import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { guidedChatReply, chatOrientation, GUIDED_CHAT_OPTIONS } from '../../shared/floating-chat-guidance.ts';
import { CHAT_FEW_SHOTS, CHAT_SYSTEM_PROMPT, buildChatMessages, chatModelInput, chatReplyWasCut, extractChatText } from '../../shared/chat-prompt.ts';
import { formatModelReply, toPlainChatText, trimToLastSentence } from '../../shared/chat-format.ts';
import { guardChatReply } from '../../shared/chat-guard.ts';
import { OPEN_REQUEST, ledgerHealth, type Rows } from '../../worker/src/ledger-queries.ts';

const ORDERS_QUESTION = '¿Por dónde te llegan más pedidos hoy: WhatsApp, redes sociales, llamadas o en persona?';

test('las reglas fijas no contestan otra pregunta: precio de web, negación, palabras sueltas', () => {
  for (const message of [
    'Siempre he vendido por WhatsApp, ¿cuánto cuesta una página web?',
    'No uso WhatsApp, mis clientes siempre me preguntan el precio en persona',
    'Vendo mandarinas por WhatsApp y siempre le gusta a la gente',
    'ya tengo pagina y por whatsapp me preguntan siempre el precio',
  ]) {
    assert.equal(guidedChatReply(message, []), null, message);
  }
  const afterOrders = [{ role: 'assistant' as const, text: ORDERS_QUESTION }];
  assert.equal(guidedChatReply('casi no uso whatsapp, todo es en persona', afterOrders), null);
});

test('las reglas fijas siguen atendiendo los casos claros, con faltas comunes', () => {
  const afterOrders = [{ role: 'assistant' as const, text: ORDERS_QUESTION }];
  for (const channel of ['por wasap', 'watsapp', 'por guasap', 'en el whats', 'whatsap', 'wpp']) {
    assert.match(guidedChatReply(channel, afterOrders) ?? '', /respuestas rápidas/, channel);
  }
  const gelatinas = guidedChatReply('vendo gelatinas me preguntan cuanto y donde x wasap y se me juntan', []);
  assert.match(gelatinas ?? '', /una respuesta corta con esa información/);
  assert.match(guidedChatReply('vendo tamales y por wasap me preguntan a cada rato cuanto cuestan y donde entrego', []) ?? '', /el precio y cómo entregas/);
  assert.match(guidedChatReply('¿Web o solo WhatsApp?', []) ?? '', /WhatsApp puede bastar/);
  assert.equal(guidedChatReply('esta guapa la pagina', []), null);
});

test('la guía del chat ya no habla de "tres respuestas"', () => {
  for (const option of GUIDED_CHAT_OPTIONS) {
    assert.doesNotMatch(chatOrientation(option).why, /tres respuestas/i, option.label);
  }
});

test('el prompt nuevo no trae texto del formulario ni frases que el filtro trata como fuga', () => {
  assert.doesNotMatch(CHAT_SYSTEM_PROMPT, /tres respuestas|dato no confiable/i);
  assert.match(CHAT_SYSTEM_PROMPT, /de tú/);
  assert.match(CHAT_SYSTEM_PROMPT, /Sin listas/);
});

test('los ejemplos fijos pasan el filtro y ninguna regla los atrapa', () => {
  for (const example of CHAT_FEW_SHOTS) {
    assert.equal(guardChatReply(example.reply).blocked, null, example.reply);
    assert.equal(guidedChatReply(example.message, example.history), null, example.message);
    for (const turn of example.history) assert.ok(turn.text.length > 0);
  }
});

test('los mensajes al modelo: ejemplos dentro del sistema (no como turnos) y el turno real como usuario', () => {
  const messages = buildChatMessages([{ role: 'assistant', text: 'falso' }], 'hola');
  assert.equal(messages[0].role, 'system');
  assert.equal(messages.length, 2);
  assert.match(messages[0].content, /Son de otras personas/);
  for (const example of CHAT_FEW_SHOTS) assert.ok(messages[0].content.includes(example.reply));
  assert.equal(messages.at(-1)!.role, 'user');
  assert.ok(messages.at(-1)!.content.includes('"falso"'));
  assert.equal(chatModelInput('@cf/google/gemma-4-26b-a4b-it', [], 'hola').chat_template_kwargs !== undefined, true);
  assert.equal(chatModelInput('@cf/meta/llama-3.1-8b-instruct-fast', [], 'hola').chat_template_kwargs, undefined);
});

test('lee la respuesta en los dos formatos de Workers AI y detecta el corte por max_tokens', () => {
  assert.equal(extractChatText({ response: ' hola ' }), 'hola');
  assert.equal(extractChatText({ choices: [{ message: { content: 'adiós' }, finish_reason: 'stop' }] }), 'adiós');
  assert.equal(extractChatText(null), '');
  assert.equal(chatReplyWasCut({ choices: [{ finish_reason: 'length' }] }), true);
  assert.equal(chatReplyWasCut({ response: 'x' }), false);
});

test('el formato quita markdown y recorta la frase cortada', () => {
  assert.equal(toPlainChatText('Te sugiero:\n1. **Configura** respuestas\n- Usa `etiquetas`'), 'Te sugiero:\nConfigura respuestas\nUsa etiquetas');
  assert.equal(trimToLastSentence('Haz una lista de dudas. Luego usa etiquetas para distinguir las consul'), 'Haz una lista de dudas.');
  assert.equal(trimToLastSentence('¿Qué vendes?'), '¿Qué vendes?');
  const out = formatModelReply('**Hola**, empieza por tus fotos claras. Luego sube tu catálogo y');
  assert.deepEqual(out, { text: 'Hola, empieza por tus fotos claras.', stripped: true, trimmed: true });
  // Si lo que queda es muy corto, se conserva el texto completo.
  assert.equal(trimToLastSentence('Hola. Empieza por tus fotos y luego'), 'Hola. Empieza por tus fotos y luego');
});

test('ledger: una fila atascada deja de ocupar cupo cuando su sesión caduca (excepto campañas)', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE sessions(id TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE requests(id TEXT PRIMARY KEY, session TEXT NOT NULL, status TEXT NOT NULL, campaign TEXT);`);
  const now = 1_000_000;
  db.prepare('INSERT INTO sessions VALUES (?,?)').run('vieja', now - 1);
  db.prepare('INSERT INTO sessions VALUES (?,?)').run('viva', now + 60_000);
  for (const [id, session, status, campaign] of [
    ['a', 'vieja', 'uncertain', null], ['b', 'vieja', 'pending', null],
    ['c', 'viva', 'pending', null], ['d', 'viva', 'success', null], ['e', 'vieja', 'uncertain', 'v02-pilot-1'],
  ]) db.prepare('INSERT INTO requests VALUES (?,?,?,?)').run(id, session, status, campaign);
  const open = db.prepare(`SELECT id FROM requests WHERE ${OPEN_REQUEST} ORDER BY id`).all(now).map(row => row.id);
  assert.deepEqual(open, ['c', 'e']);
});

test('salud del ledger: cuenta cupos y filas viejas, y borra solo lo cerrado hace más de 30 días', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE days(day TEXT PRIMARY KEY, reserved INTEGER NOT NULL);
    CREATE TABLE sessions(id TEXT PRIMARY KEY, expires INTEGER NOT NULL, campaign TEXT);
    CREATE TABLE requests(id TEXT PRIMARY KEY, session TEXT NOT NULL, status TEXT NOT NULL, day TEXT NOT NULL, campaign TEXT);`);
  const now = Date.parse('2026-11-23T12:00:00Z');
  const day = 24 * 60 * 60 * 1000;
  db.prepare('INSERT INTO days VALUES (?,?)').run('2026-11-23', 120);
  for (const [id, expires, campaign] of [['viva', now + 60_000, null], ['ayer', now - 2 * day, null], ['piloto', now - 2 * day, 'v02-pilot-1']] as const) {
    db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(id, expires, campaign);
  }
  for (const [id, session, status, rowDay, campaign] of [
    ['abierta', 'viva', 'pending', '2026-11-23', null],
    ['atascada', 'ayer', 'uncertain', '2026-11-21', null],
    ['vieja', 'ayer', 'success', '2026-10-01', null],
    ['vieja-atascada', 'ayer', 'uncertain', '2026-10-01', null],
    ['piloto-vieja', 'piloto', 'success', '2026-10-01', 'v02-pilot-1'],
  ] as const) db.prepare('INSERT INTO requests VALUES (?,?,?,?,?)').run(id, session, status, rowDay, campaign);
  const rows: Rows = (sql, ...bindings) => db.prepare(sql).all(...bindings) as Record<string, unknown>[];

  const health = ledgerHealth(rows, now);
  assert.deepEqual(health, { openSlots: 1, staleRows: 2, reservedToday: 120, activeSessions: 1, deletedSessions: 1, deletedRequests: 2 });
  const left = db.prepare('SELECT id FROM requests ORDER BY id').all().map(row => row.id);
  assert.deepEqual(left, ['abierta', 'atascada', 'piloto-vieja']);
  assert.deepEqual(db.prepare('SELECT id FROM sessions ORDER BY id').all().map(row => row.id), ['piloto', 'viva']);
});
