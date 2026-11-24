/**
 * Compara el prompt anterior a v0.3 (scripts/chat-eval/prompt-anterior.ts) con el
 * vigente del chat flotante (shared/chat-prompt.ts) usando Gemma en Workers AI.
 *
 * Se ejecuta desde tu computadora con la API REST de Cloudflare. No toca el Worker,
 * el ledger ni producción. Instrucciones: docs/cidiks-chat-v03.md.
 *
 *   npm run eval:chat -- --simular            sin red ni token: revisa el armado
 *   npm run eval:chat                          5 conversaciones × 2 versiones
 *   npm run eval:chat -- --repeticiones 3      repite todo para ver la variación
 *   npm run eval:chat -- --solo C3,C5          solo algunas conversaciones
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  CHAT_PROMPT_VERSION,
  DEFAULT_CHAT_MODEL,
  buildChatMessages,
  chatModelInput,
  chatReplyWasCut,
  extractChatText,
} from '../../shared/chat-prompt.ts';
import { formatModelReply } from '../../shared/chat-format.ts';
import { guardChatReply, redactPersonalData } from '../../shared/chat-guard.ts';
import { guidedChatReply, type FloatingChatMessage } from '../../shared/floating-chat-guidance.ts';
import { AI_POLICY } from '../../shared/cidikis-ai-policy.ts';
import { PREVIOUS_PROMPT_VERSION, PREVIOUS_SYSTEM_CONTENT, previousChatInput } from './prompt-anterior.ts';
import { CONVERSACIONES, type Conversacion, type Turno } from './conversaciones.ts';

/** Solo Gemma, el modelo principal de producción. El respaldo (Llama) queda fuera por ahora. */
const MODEL = DEFAULT_CHAT_MODEL;
const HISTORY_TURNS = 6;
const MAX_TURN_CHARS = 600;
const REQUEST_TIMEOUT_MS = 30_000;

interface Variante {
  id: 'anterior' | 'vigente';
  version: string;
  system: string;
  input: (model: string, history: readonly FloatingChatMessage[], message: string) => Record<string, unknown>;
}

const VARIANTES: readonly Variante[] = [
  { id: 'anterior', version: PREVIOUS_PROMPT_VERSION, system: PREVIOUS_SYSTEM_CONTENT, input: previousChatInput },
  { id: 'vigente', version: CHAT_PROMPT_VERSION, system: buildChatMessages([], '')[0].content, input: chatModelInput },
];

interface Resultado {
  conversacion: string;
  turno: number;
  repeticion: number;
  variante: Variante['id'];
  persona: string;
  respuesta: string;
  origen: 'modelo' | 'regla' | 'error';
  error?: string;
  ms?: number;
  intentos?: number;
  tokensEntrada?: number;
  tokensCache?: number;
  tokensSalida?: number;
  neurons?: number;
  cortada?: boolean;
  conFormato?: boolean;
  bloqueo?: string | null;
  palabras: number;
  preguntas: number;
  turnosEnviados: number;
  /** false cuando el primer mensaje de la persona ya no entra en los 6 turnos que recibe el modelo. */
  primerMensajeEnVentana: boolean;
  senales: Array<{ etiqueta: string; ok: boolean }>;
}

/* ───────────── Argumentos y credenciales ───────────── */

function parseArgs(argv: string[]) {
  const value = (name: string) => {
    const inline = argv.find(arg => arg.startsWith(`--${name}=`));
    if (inline) return inline.slice(name.length + 3);
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const repeticiones = Number(value('repeticiones') ?? 1);
  const solo = value('solo')?.split(',').map(id => id.trim().toUpperCase()).filter(Boolean);
  return {
    ayuda: argv.includes('--ayuda') || argv.includes('--help'),
    simular: argv.includes('--simular'),
    repeticiones: Number.isInteger(repeticiones) && repeticiones >= 1 && repeticiones <= 5 ? repeticiones : NaN,
    solo,
  };
}

function credentials(): { accountId: string; token: string } {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() ?? '';
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim() ?? '';
  if (!/^[a-f0-9]{32}$/i.test(accountId) || token.length < 20) {
    console.error([
      'Faltan credenciales. Copia scripts/chat-eval/.env.example como scripts/chat-eval/.env',
      'y llena CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_API_TOKEN (token con la plantilla «Workers AI»).',
      'Para revisar el armado sin red ni token: npm run eval:chat -- --simular',
    ].join('\n'));
    process.exit(1);
  }
  return { accountId, token };
}

/* ───────────── Llamada a Workers AI ───────────── */

type RunResult = { raw: unknown; ms: number; intentos: number };

async function callWorkersAi(accountId: string, token: string, input: Record<string, unknown>, affinity: string): Promise<RunResult> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`;
  let lastError = '';
  for (let intento = 1; intento <= 2; intento++) {
    const started = performance.now();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          // Igual que el Worker: pide la misma instancia para reutilizar la caché del prompt.
          'x-session-affinity': affinity,
        },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const ms = Math.round(performance.now() - started);
      const body = await response.json().catch(() => null) as { success?: boolean; result?: unknown; errors?: Array<{ code?: number; message?: string }> } | null;
      if (response.ok && body?.success) return { raw: body.result, ms, intentos: intento };
      const detail = body?.errors?.map(e => `${e.code ?? ''} ${e.message ?? ''}`.trim()).join('; ') || 'sin detalle';
      lastError = `HTTP ${response.status}: ${detail}`;
      // 401/403/400 no se arreglan reintentando.
      if (response.status < 429 && response.status !== 408) break;
    } catch (error) {
      lastError = error instanceof Error ? error.name === 'TimeoutError' ? `sin respuesta en ${REQUEST_TIMEOUT_MS / 1000} s` : error.message : String(error);
    }
    if (intento === 1) await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error(lastError);
}

function usage(raw: unknown) {
  const u = (raw as { usage?: Record<string, unknown> } | null)?.usage;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
  const details = u?.prompt_tokens_details as { cached_tokens?: unknown } | undefined;
  return {
    tokensEntrada: num(u?.prompt_tokens),
    tokensSalida: num(u?.completion_tokens),
    tokensCache: num(details?.cached_tokens),
    neurons: num(u?.neurons),
  };
}

/* ───────────── Señales automáticas ───────────── */

// «Te doy la bienvenida» es la forma neutra que pide el prompt: no cuenta. «tú solo» y «con él» sí.
const GENERO = /(?<!la )\bbienvenid[oa]s?\b|\b(?:cansad[oa]s?|preocupad[oa]s?|estresad[oa]s?|agobiad[oa]s?|abrumad[oa]s?)\b|\b(?:t[uú]|trabajas|atiendes|est[aá]s) sol[oa]\b|\bcon (?:él|ella)\b/i;
const PIDE_DATO = /\b(?:cu[eé]ntame|dime|plat[ií]came|comp[aá]rteme)\b/i;

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
const questions = (text: string) => (text.match(/\?/g) ?? []).length;

function senales(turno: Turno, text: string, conFormato: boolean, bloqueo: string | null) {
  const out = [
    { etiqueta: 'Máximo 80 palabras', ok: words(text) <= 80 },
    { etiqueta: 'Como mucho una pregunta', ok: questions(text) <= 1 },
    { etiqueta: 'Sin listas ni negritas', ok: !conFormato },
    { etiqueta: 'No la bloqueó el filtro', ok: bloqueo === null },
    { etiqueta: 'Sin palabras que marquen género', ok: !GENERO.test(text) },
    { etiqueta: 'No empieza con "Entiendo"', ok: !/^entiendo\b/i.test(text) },
  ];
  if (turno.pregunta !== undefined) {
    const asks = questions(text) > 0 || PIDE_DATO.test(text);
    out.push({ etiqueta: turno.pregunta ? 'Pregunta o pide un dato' : 'No pregunta', ok: asks === turno.pregunta });
  }
  for (const senal of turno.senales ?? []) out.push({ etiqueta: senal.etiqueta, ok: senal.patron.test(text) === senal.debe });
  return out;
}

/* ───────────── Una conversación, como en producción ───────────── */

/**
 * Reproduce el camino de /v2/chat: reglas fijas del navegador y del servidor,
 * últimos 6 turnos (src/advisor/ai-client.ts y worker/src/index.ts), recorte a
 * 600 caracteres, enmascarado de datos, formato y filtro de salida.
 */
async function runConversation(
  conversacion: Conversacion,
  variante: Variante,
  repeticion: number,
  run: (input: Record<string, unknown>) => Promise<RunResult>,
): Promise<Resultado[]> {
  const transcript: FloatingChatMessage[] = [];
  const results: Resultado[] = [];
  for (const [i, turno] of conversacion.turnos.entries()) {
    const message = redactPersonalData(turno.persona.trim());
    const window = transcript.slice(-HISTORY_TURNS);
    const history = window
      .filter(m => m.text.trim().length > 0)
      .map(m => ({ role: m.role, text: redactPersonalData(m.text.trim().slice(0, MAX_TURN_CHARS)) }));
    const firstUserText = transcript.find(m => m.role === 'user')?.text;
    const base = {
      conversacion: conversacion.id, turno: i + 1, repeticion, variante: variante.id, persona: turno.persona,
      turnosEnviados: history.length,
      primerMensajeEnVentana: firstUserText === undefined || window.some(m => m.role === 'user' && m.text === firstUserText),
    };

    // El navegador prueba las reglas con todo el historial y el Worker con la ventana.
    const rule = guidedChatReply(message, transcript) ?? guidedChatReply(message, history);
    if (rule) {
      results.push({ ...base, respuesta: rule, origen: 'regla', palabras: words(rule), preguntas: questions(rule), senales: [] });
      transcript.push({ role: 'user', text: turno.persona }, { role: 'assistant', text: rule });
      continue;
    }

    try {
      const { raw, ms, intentos } = await run(variante.input(MODEL, history, message));
      const formatted = formatModelReply(extractChatText(raw));
      const visitorText = [message, ...history.filter(t => t.role === 'user').map(t => t.text)].join('\n');
      const guarded = guardChatReply(formatted.text, visitorText);
      results.push({
        ...base, respuesta: guarded.text, origen: 'modelo', ms, intentos, ...usage(raw),
        cortada: chatReplyWasCut(raw), conFormato: formatted.stripped, bloqueo: guarded.blocked,
        palabras: words(guarded.text), preguntas: questions(guarded.text),
        senales: senales(turno, guarded.text, formatted.stripped, guarded.blocked),
      });
      transcript.push({ role: 'user', text: turno.persona }, { role: 'assistant', text: guarded.text });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      results.push({ ...base, respuesta: '', origen: 'error', error: detail, palabras: 0, preguntas: 0, senales: [] });
      // Sin respuesta no tiene sentido seguir esta conversación: el siguiente turno no tendría contexto.
      break;
    }
  }
  return results;
}

/* ───────────── Reporte ───────────── */

const average = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : NaN);
function percentile(values: number[], p: number): number {
  if (!values.length) return NaN;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];
}
const fmt = (n: number, digits = 0) => (Number.isFinite(n) ? n.toLocaleString('es-MX', { maximumFractionDigits: digits }) : '—');
const sha = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 12);

/** Señales que se aplican a toda respuesta (forma); las demás dependen del turno (comportamiento). */
const GENERIC_LABELS = new Set([
  'Máximo 80 palabras', 'Como mucho una pregunta', 'Sin listas ni negritas',
  'No la bloqueó el filtro', 'Sin palabras que marquen género', 'No empieza con "Entiendo"',
]);

function summary(results: Resultado[], variante: Variante['id']) {
  const model = results.filter(r => r.variante === variante && r.origen === 'modelo');
  const pick = (key: 'tokensEntrada' | 'tokensCache' | 'tokensSalida' | 'ms' | 'neurons') =>
    model.map(r => r[key]).filter((v): v is number => typeof v === 'number');
  const all = model.flatMap(r => r.senales);
  const generic = all.filter(s => GENERIC_LABELS.has(s.etiqueta));
  const specific = all.filter(s => !GENERIC_LABELS.has(s.etiqueta));
  const neurons = pick('neurons');
  return {
    respuestas: model.length,
    errores: results.filter(r => r.variante === variante && r.origen === 'error').length,
    reglas: results.filter(r => r.variante === variante && r.origen === 'regla').length,
    entrada: average(pick('tokensEntrada')),
    cache: average(pick('tokensCache')),
    salida: average(pick('tokensSalida')),
    neurons: neurons.length ? average(neurons) : NaN,
    p50: percentile(pick('ms'), 0.5),
    p95: percentile(pick('ms'), 0.95),
    lentas: model.filter(r => (r.ms ?? 0) > AI_POLICY.chatPrimaryTimeoutMs).length,
    palabras: average(model.map(r => r.palabras)),
    bloqueadas: model.filter(r => r.bloqueo).length,
    cortadas: model.filter(r => r.cortada).length,
    genericas: `${generic.filter(s => s.ok).length}/${generic.length}`,
    especificas: `${specific.filter(s => s.ok).length}/${specific.length}`,
  };
}

function describe(r: Resultado | undefined): string {
  if (!r) return '_No se ejecutó (la conversación se detuvo por un error anterior)._';
  if (r.origen === 'error') return `_Error: ${r.error}_`;
  const meta = r.origen === 'regla'
    ? 'respuesta fija de la guía local (sin modelo)'
    : [
      `${fmt(r.ms ?? NaN)} ms${(r.ms ?? 0) > AI_POLICY.chatPrimaryTimeoutMs ? ' (en producción habría respondido el respaldo)' : ''}`,
      `${fmt(r.tokensEntrada ?? NaN)} tokens de entrada (${fmt(r.tokensCache ?? NaN)} en caché)`,
      `${fmt(r.tokensSalida ?? NaN)} de salida`,
      `${r.palabras} palabras`,
      r.bloqueo ? `**bloqueada por el filtro: ${r.bloqueo}**` : '',
      r.cortada ? 'cortada por max_tokens' : '',
    ].filter(Boolean).join(' · ');
  const signals = r.senales.length ? `\n\n${r.senales.map(s => `${s.ok ? '✓' : '✗'} ${s.etiqueta}`).join(' · ')}` : '';
  return `${meta}\n\n> ${r.respuesta.replace(/\n+/g, ' ')}${signals}`;
}

function report(results: Resultado[], conversaciones: readonly Conversacion[], repeticiones: number, started: Date): string {
  const a = summary(results, 'anterior');
  const p = summary(results, 'vigente');
  const row = (label: string, x: string, y: string) => `| ${label} | ${x} | ${y} |`;
  const lines = [
    `# Comparación del chat flotante · ${started.toLocaleString('es-MX')}`,
    '',
    `Modelo: \`${MODEL}\` (solo el principal). Repeticiones: ${repeticiones}. Conversaciones: ${conversaciones.map(c => c.id).join(', ')}.`,
    `Prompt anterior \`${VARIANTES[0].version}\` (sha ${sha(VARIANTES[0].system)}) · vigente \`${VARIANTES[1].version}\` (sha ${sha(VARIANTES[1].system)}).`,
    '',
    '## Resumen',
    '',
    '| | Anterior | Vigente |',
    '|---|---|---|',
    row('Respuestas del modelo / errores', `${a.respuestas} / ${a.errores}`, `${p.respuestas} / ${p.errores}`),
    row('Respuestas fijas de la guía (sin modelo)', String(a.reglas), String(p.reglas)),
    row('Tokens de entrada (promedio)', fmt(a.entrada), fmt(p.entrada)),
    row('· de ellos en caché', fmt(a.cache), fmt(p.cache)),
    row('Tokens de salida (promedio)', fmt(a.salida), fmt(p.salida)),
    row('Neurons (promedio, si la API los informa)', fmt(a.neurons, 1), fmt(p.neurons, 1)),
    row('Latencia p50 / p95 (ms)', `${fmt(a.p50)} / ${fmt(a.p95)}`, `${fmt(p.p50)} / ${fmt(p.p95)}`),
    row(`Más de ${AI_POLICY.chatPrimaryTimeoutMs / 1000} s (en producción respondería el respaldo)`, String(a.lentas), String(p.lentas)),
    row('Palabras por respuesta (promedio)', fmt(a.palabras), fmt(p.palabras)),
    row('Bloqueadas por el filtro / cortadas', `${a.bloqueadas} / ${a.cortadas}`, `${p.bloqueadas} / ${p.cortadas}`),
    row('Señales de forma cumplidas', a.genericas, p.genericas),
    row('Señales de comportamiento cumplidas', a.especificas, p.especificas),
    ...(repeticiones > 1 ? [
      '',
      '### Por repetición',
      '',
      '| Repetición | Entrada anterior / vigente | Salida anterior / vigente | p50 ms anterior / vigente | Neurons anterior / vigente | Errores anterior / vigente |',
      '|---|---|---|---|---|---|',
      ...Array.from({ length: repeticiones }, (_, i) => {
        const r = results.filter(x => x.repeticion === i + 1);
        const [x, y] = [summary(r, 'anterior'), summary(r, 'vigente')];
        return `| ${i + 1} | ${fmt(x.entrada)} / ${fmt(y.entrada)} | ${fmt(x.salida)} / ${fmt(y.salida)} | ${fmt(x.p50)} / ${fmt(y.p50)} | ${fmt(x.neurons, 1)} / ${fmt(y.neurons, 1)} | ${x.errores} / ${y.errores} |`;
      }),
    ] : []),
    '',
    'Las señales son comprobaciones aproximadas por palabras clave. La latencia depende de la carga de Workers AI en ese momento: compara con varias repeticiones antes de concluir.',
    '',
  ];

  for (const conversacion of conversaciones) {
    lines.push(`## ${conversacion.id} · ${conversacion.titulo}`, '', `Mide: ${conversacion.mide}`, '');
    for (let rep = 1; rep <= repeticiones; rep++) {
      if (repeticiones > 1) lines.push(`### Repetición ${rep}`, '');
      conversacion.turnos.forEach((turno, i) => {
        const find = (v: Variante['id']) => results.find(r => r.conversacion === conversacion.id && r.turno === i + 1 && r.repeticion === rep && r.variante === v);
        const actual = find('anterior');
        const lost = [actual, find('vigente')].some(r => r && !r.primerMensajeEnVentana);
        lines.push(
          `**Turno ${i + 1}.** Persona: «${turno.persona}»`,
          '',
          `Esperado: ${turno.esperado}${lost ? ' **El primer mensaje de la persona ya no llega al modelo en este turno (límite de 6 turnos).**' : ''}`,
          '',
          `**Anterior** · ${describe(actual)}`,
          '',
          `**Vigente** · ${describe(find('vigente'))}`,
          '',
        );
      });
    }
  }

  lines.push(
    '## Revisión humana',
    '',
    'Califica cada conversación de 0 a 2 (0 no lo hace, 1 a medias, 2 bien). Lee sin mirar qué versión es, si puedes.',
    '',
    '| Conversación | Criterio | Anterior | Vigente |',
    '|---|---|---|---|',
    ...conversaciones.flatMap(c => [
      'Escucha antes de recomendar',
      'Separa lo que contó, lo comprobable y lo que supone',
      'Se ajusta a sus recursos (dinero, tiempo, señal, conocimientos)',
      'Menciona CÍDIKS o el diagnóstico solo cuando toca',
      'Natural, breve y respetuosa',
    ].map(criterio => `| ${c.id} | ${criterio} | | |`)),
    '',
  );
  return lines.join('\n');
}

/* ───────────── Programa ───────────── */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.ayuda) {
    console.log(readmeHint());
    return;
  }
  if (Number.isNaN(args.repeticiones)) {
    console.error('--repeticiones debe ser un número del 1 al 5.');
    process.exit(1);
  }
  const conversaciones = args.solo ? CONVERSACIONES.filter(c => args.solo!.includes(c.id)) : CONVERSACIONES;
  if (!conversaciones.length) {
    console.error(`--solo no coincide con ninguna conversación (${CONVERSACIONES.map(c => c.id).join(', ')}).`);
    process.exit(1);
  }
  const turns = conversaciones.reduce((n, c) => n + c.turnos.length, 0);
  const calls = turns * VARIANTES.length * args.repeticiones;
  const started = new Date();

  let run: (variante: Variante) => (input: Record<string, unknown>) => Promise<RunResult>;
  if (args.simular) {
    console.log(`Simulación: ${calls} solicitudes armadas, ninguna enviada.\n`);
    run = variante => async input => {
      const messages = input.messages as Array<{ content: string }>;
      return {
        raw: { response: `Respuesta simulada de la versión ${variante.id} (${messages[0].content.length} + ${messages[1].content.length} caracteres enviados). ¿Qué vendes hoy?` },
        ms: 0,
        intentos: 1,
      };
    };
  } else {
    const { accountId, token } = credentials();
    console.log(`Se harán hasta ${calls} llamadas a ${MODEL} (${turns} turnos × ${VARIANTES.length} versiones × ${args.repeticiones}).`);
    console.log('Se cobran a tu cuenta de Workers AI; no pasan por el ledger del Worker.\n');
    // Una llave por versión: el prompt de cada versión se reutiliza de la caché, como en producción.
    run = variante => input => callWorkersAi(accountId, token, input, `cidiks-eval-${variante.version}`);
  }

  const results: Resultado[] = [];
  for (let rep = 1; rep <= args.repeticiones; rep++) {
    for (const conversacion of conversaciones) {
      // Se alterna qué versión va primero para repartir el efecto de la caché y de la carga del servicio.
      const first = (rep + conversaciones.indexOf(conversacion)) % 2 === 0;
      for (const variante of first ? VARIANTES : [...VARIANTES].reverse()) {
        process.stdout.write(`${conversacion.id} · ${variante.id.padEnd(9)} · repetición ${rep} … `);
        const out = await runConversation(conversacion, variante, rep, run(variante));
        results.push(...out);
        const errors = out.filter(r => r.origen === 'error');
        console.log(errors.length ? `error: ${errors[0].error}` : out.map(r => r.origen === 'regla' ? 'regla' : `${r.ms ?? 0} ms`).join(', '));
      }
    }
  }

  if (args.simular) {
    for (const r of results.filter(r => r.variante === 'anterior' && r.repeticion === 1)) {
      const note = r.origen === 'regla' ? '  ← la guía local responde sin modelo' : !r.primerMensajeEnVentana ? '  ← el primer mensaje ya no entra en la ventana' : '';
      console.log(`${r.conversacion} turno ${r.turno}: ${r.turnosEnviados} turnos de historial${note}`);
    }
    const [anterior, vigente] = VARIANTES.map(v => v.system.length);
    console.log(`\nInstrucciones fijas: anterior ${anterior} caracteres · vigente ${vigente} (${((vigente / anterior - 1) * 100).toFixed(1)} %).`);
    console.log('Los tokens reales salen del reporte con Workers AI (sin --simular).');
    return;
  }

  const dir = fileURLToPath(new URL('./resultados/', import.meta.url));
  await mkdir(dir, { recursive: true });
  const stamp = started.toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const base = `${dir}${stamp}-gemma`;
  await writeFile(`${base}.md`, report(results, conversaciones, args.repeticiones, started));
  await writeFile(`${base}.json`, JSON.stringify({
    fecha: started.toISOString(), modelo: MODEL, repeticiones: args.repeticiones,
    versiones: VARIANTES.map(v => ({ id: v.id, version: v.version, sha: sha(v.system), caracteres: v.system.length })),
    resultados: results,
  }, null, 2));
  const failed = results.filter(r => r.origen === 'error').length;
  console.log(`\nReporte: ${base}.md${failed ? `\nAtención: ${failed} conversación(es) se detuvieron por error; revisa el reporte.` : ''}`);
}

function readmeHint(): string {
  return [
    'Compara el prompt anterior a v0.3 con el vigente, usando Gemma en Workers AI.',
    '',
    '  npm run eval:chat -- --simular           revisa el armado sin red ni token',
    '  npm run eval:chat                         una pasada (5 conversaciones × 2 versiones)',
    '  npm run eval:chat -- --repeticiones 3     repite para ver la variación (máximo 5)',
    '  npm run eval:chat -- --solo C3,C5         solo algunas conversaciones',
    '',
    'Credenciales en scripts/chat-eval/.env (ver .env.example). Guía: docs/cidiks-chat-v03.md',
  ].join('\n');
}

await main();
