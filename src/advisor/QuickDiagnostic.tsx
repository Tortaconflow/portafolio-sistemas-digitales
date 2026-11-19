import { useRef, useState } from 'react';
import { buildWhatsAppUrl } from '../contact-utils.ts';

interface QuickOption {
  id: string;
  label: string;
  hint?: string;
}

const BUSINESS_OPTIONS: readonly QuickOption[] = [
  { id: 'comercio', label: 'Comercio o tienda local' },
  { id: 'comida-turismo', label: 'Comida, café o turismo' },
  { id: 'servicios', label: 'Servicios profesionales o citas', hint: 'Ej. barbería, consultorio, taller' },
  { id: 'otro', label: 'Otro tipo de negocio' },
  { id: 'unsure', label: 'No estoy seguro / estoy empezando' },
];

const NEED_OPTIONS: readonly QuickOption[] = [
  { id: 'visibilidad', label: 'Que más personas encuentren mi negocio' },
  { id: 'catalogo', label: 'Mostrar mis productos o servicios con claridad' },
  { id: 'whatsapp', label: 'Atender mejor por WhatsApp y ahorrar tiempo' },
  { id: 'otra', label: 'Otra necesidad' },
  { id: 'unsure', label: 'No estoy seguro, quiero orientación' },
];

const CHANNEL_OPTIONS: readonly QuickOption[] = [
  { id: 'whatsapp-persona', label: 'WhatsApp, llamadas o en persona' },
  { id: 'redes', label: 'Redes sociales (Facebook / Instagram)' },
  { id: 'web-actual', label: 'Ya tengo página web, pero no me funciona bien' },
  { id: 'sin-canales', label: 'Todavía no tengo canales digitales' },
  { id: 'unsure', label: 'No estoy seguro' },
];

const QUESTIONS = [
  { key: 'business' as const, title: '¿Qué tipo de negocio o proyecto tienes?', subtitle: 'Elige la opción más cercana. No necesitas escribir nada.', options: BUSINESS_OPTIONS },
  { key: 'need' as const, title: '¿Qué es lo que más te gustaría mejorar hoy?', subtitle: 'Piensa en tu día a día, no en términos técnicos.', options: NEED_OPTIONS },
  { key: 'channel' as const, title: '¿Cómo te contactan o compran tus clientes hoy?', subtitle: 'Esto nos ayuda a proponerte un primer paso realista.', options: CHANNEL_OPTIONS },
];

interface QuickAnswers {
  business: string;
  need: string;
  channel: string;
}

interface QuickOrientation {
  ruleId: string;
  headline: string;
  why: string;
  freeStep: string;
  missingInfo: string[];
  guideHref: string;
  guideLabel: string;
  disclaimer: string;
}

function findLabel(options: readonly QuickOption[], id: string): string {
  return options.find(o => o.id === id)?.label ?? '';
}

/**
 * Precedencia explícita (la necesidad expresada manda sobre el canal):
 * 1. need = unsure | otra -> orientación exploratoria (sin recomendar ni descartar web).
 * 2. need = whatsapp -> ordenar atención en WhatsApp Business (gratis) primero.
 * 3. need = catalogo -> catálogo gratuito de WhatsApp Business o evaluar web según contexto.
 * 4. need = visibilidad + channel = web-actual -> revisar la web actual antes de rehacerla.
 * 5. need = visibilidad (otros canales) -> Google Perfil de Negocio condicionado a elegibilidad presencial/área de servicio.
 */
export function buildOrientation(answers: QuickAnswers): QuickOrientation {
  const disclaimer = 'Orientación inicial basada solo en tres respuestas. No sustituye una revisión real de tu negocio ni es una cotización.';
  const channelNote = answers.channel === 'unsure'
    ? 'Aún no sabemos por qué canales te contactan hoy tus clientes.'
    : '';

  if (answers.need === 'unsure' || answers.need === 'otra') {
    return {
      ruleId: 'exploratory',
      headline: 'Conviene empezar ordenando qué necesitan tus clientes antes de elegir herramienta',
      why: 'Con tres respuestas aún es pronto para recomendar o descartar una página web u otra herramienta. Definir primero qué te preguntan con más frecuencia ayuda a evitar gastos innecesarios.',
      freeStep: 'Durante esta semana, anota en una libreta o notas del celular las 5 dudas más frecuentes de tus clientes y cómo las respondes hoy.',
      missingInfo: [
        'Cuál es tu oferta principal y qué problema concreto quieres resolver primero.',
        channelNote || 'Con cuánto tiempo cuentas para mantener una herramienta digital al día.',
      ],
      guideHref: '/conocimiento/diferencia-entre-presencia-digital-y-sistema-digital/',
      guideLabel: 'Guía: diferencia entre presencia digital y sistema digital',
      disclaimer,
    };
  }

  if (answers.need === 'whatsapp') {
    const webExtra = answers.channel === 'web-actual'
      ? ' Si ya tienes una página web, también conviene revisar que el botón de WhatsApp sea claro en celular.'
      : '';
    return {
      ruleId: 'whatsapp',
      headline: 'Podrías empezar ordenando tu atención con las funciones gratuitas de WhatsApp Business',
      why: `Antes de evaluar herramientas de pago o automatizaciones, ordenar respuestas frecuentes y etiquetas suele aliviar gran parte de la carga diaria.${webExtra}`,
      freeStep: 'Configura en WhatsApp Business (gratis) 3 a 5 respuestas rápidas para tus preguntas más repetidas y usa etiquetas para distinguir consultas pendientes.',
      missingInfo: [
        'Si atiendes solo o con un equipo y qué tipo de mensajes se pierden con más frecuencia.',
        channelNote || 'Si necesitas seguimiento fuera de WhatsApp o si con ordenarlo es suficiente por ahora.',
      ],
      guideHref: '/conocimiento/whatsapp-y-seguimiento-de-clientes/',
      guideLabel: 'Guía: WhatsApp y seguimiento de clientes',
      disclaimer,
    };
  }

  if (answers.need === 'catalogo') {
    return {
      ruleId: 'catalogo',
      headline: 'Podrías empezar con un catálogo gratuito en WhatsApp Business y evaluar si necesitas algo más',
      why: 'Cuando el objetivo es mostrar con claridad qué ofreces, un catálogo nativo y gratuito permite compartir fotos y descripciones sin invertir de inmediato; una página web puede evaluarse después si necesitas más estructura o alcance.',
      freeStep: 'Reúne fotos claras y descripciones cortas de tus productos o servicios principales y súbelos al catálogo gratuito de WhatsApp Business.',
      missingInfo: [
        'Con qué frecuencia cambian tus productos, precios o disponibilidad.',
        channelNote || 'Si tus clientes suelen buscarte fuera de redes sociales o prefieren resolver todo por mensaje.',
      ],
      guideHref: '/conocimiento/necesito-realmente-una-pagina-web/',
      guideLabel: 'Guía: ¿necesito realmente una página web?',
      disclaimer,
    };
  }

  if (answers.channel === 'web-actual') {
    return {
      ruleId: 'audit-web',
      headline: 'Antes de invertir en algo nuevo, conviene revisar qué está fallando en tu página actual',
      why: 'Cuando ya existe una página pero no ayuda al negocio, muchas veces el problema está en la claridad del mensaje, la velocidad en celular o un contacto difícil de encontrar, no en falta de funciones.',
      freeStep: 'Abre tu página desde un celular con datos móviles y comprueba si en menos de 10 segundos queda claro qué haces, dónde estás y cómo escribirte.',
      missingInfo: [
        'Qué parte de tu página actual genera confusión o abandona el visitante.',
        'Si hoy recibes visitas que no contactan o si casi nadie llega todavía a la página.',
      ],
      guideHref: '/conocimiento/como-saber-si-una-herramienta-digital-esta-funcionando/',
      guideLabel: 'Guía: cómo saber si una herramienta digital está funcionando',
      disclaimer,
    };
  }

  return {
    ruleId: 'visibilidad-local',
    headline: 'Si atiendes en un local o zona definida, Google Perfil de Negocio (gratis) puede ser un buen primer paso',
    why: 'Para negocios elegibles con atención presencial o área de servicio local, aparecer con horario real, ubicación y contacto claro en Google Maps suele ayudar antes de evaluar una página web.',
    freeStep: 'Verifica si tu negocio cumple las directrices de Google para Perfil de Negocio; si aplica, crea o actualiza tu ficha gratuita con horario real, fotos claras y un canal de contacto.',
    missingInfo: [
      'Si cuentas con atención presencial o área de servicio elegible para Google Perfil de Negocio.',
      channelNote || 'Si te conviene complementar esa ficha con una página web más adelante según cómo te buscan tus clientes.',
    ],
    guideHref: '/conocimiento/google-maps-perfil-de-negocio/',
    guideLabel: 'Guía: ¿para qué sirve realmente Google Maps?',
    disclaimer,
  };
}

function buildQuickBriefText(answers: QuickAnswers): string {
  const lines = ['Hola CÍDIKS, completé el diagnóstico rápido en reilycastro.com:'];
  const business = findLabel(BUSINESS_OPTIONS, answers.business);
  const need = findLabel(NEED_OPTIONS, answers.need);
  const channel = findLabel(CHANNEL_OPTIONS, answers.channel);
  if (business) lines.push(`- Negocio o proyecto: ${business}`);
  if (need) lines.push(`- Lo que quiero mejorar: ${need}`);
  if (channel) lines.push(`- Cómo me contactan hoy: ${channel}`);
  lines.push('Me gustaría revisar juntos qué paso sencillo conviene para mi caso.');
  return lines.join('\n');
}

function buildEarlyWhatsAppText(answers: QuickAnswers): string {
  const parts: string[] = [];
  const business = findLabel(BUSINESS_OPTIONS, answers.business);
  const need = findLabel(NEED_OPTIONS, answers.need);
  const channel = findLabel(CHANNEL_OPTIONS, answers.channel);
  if (business) parts.push(`Negocio: ${business}`);
  if (need) parts.push(`Necesidad: ${need}`);
  if (channel) parts.push(`Canal actual: ${channel}`);
  if (!parts.length) return 'Hola CÍDIKS, vengo del asesor en reilycastro.com y me gustaría orientación para mi negocio.';
  return `Hola CÍDIKS, vengo del asesor en reilycastro.com (${parts.join(' · ')}). Me gustaría orientación.`;
}

export function QuickDiagnostic({ onDeepen, onChat }: { onDeepen: () => void; onChat: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [answers, setAnswers] = useState<QuickAnswers>({ business: '', need: '', channel: '' });
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [editing, setEditing] = useState(false);
  const [customBrief, setCustomBrief] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  function focusHeading() {
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function selectOption(key: keyof QuickAnswers, id: string) {
    const next = { ...answers, [key]: id };
    setAnswers(next);
    setCustomBrief(null);
    setEditing(false);
    setShowHelpPanel(false);
    setStep((prev) => (prev < 3 ? ((prev + 1) as 0 | 1 | 2 | 3) : 3));
    focusHeading();
  }

  function goBack() {
    setEditing(false);
    setShowHelpPanel(false);
    setStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2 | 3) : 0));
    focusHeading();
  }

  function restart() {
    setAnswers({ business: '', need: '', channel: '' });
    setCustomBrief(null);
    setEditing(false);
    setShowHelpPanel(false);
    setStep(0);
    focusHeading();
  }

  const generatedBrief = buildQuickBriefText(answers);
  const activeBrief = customBrief ?? generatedBrief;
  const orientation = buildOrientation(answers);
  const earlyUrl = buildWhatsAppUrl(buildEarlyWhatsAppText(answers));
  const finalUrl = buildWhatsAppUrl(activeBrief);
  const currentQuestion = step < 3 ? QUESTIONS[step] : null;

  return (
    <section className="quick-advisor" aria-labelledby="quick-advisor-heading">
      {currentQuestion ? (
        <>
          <p className="eyebrow">DIAGNÓSTICO RÁPIDO · PASO {step + 1} DE 3</p>
          <h2 id="quick-advisor-heading" ref={headingRef} tabIndex={-1}>{currentQuestion.title}</h2>
          <p className="advisor-help">{currentQuestion.subtitle}</p>
          <div className="quick-options" role="group" aria-label={currentQuestion.title}>
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.key] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`quick-option${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => selectOption(currentQuestion.key, opt.id)}
                >
                  <strong>{opt.label}</strong>
                  {opt.hint ? <span>{opt.hint}</span> : null}
                </button>
              );
            })}
          </div>
          <div className="quick-footer">
            {step > 0 ? (
              <button type="button" className="advisor-text-button" onClick={goBack}>
                ← Volver a la pregunta anterior
              </button>
            ) : <span />}
            {earlyUrl ? (
              <a className="advisor-text-button" href={earlyUrl} target="_blank" rel="noopener noreferrer">
                ¿Tienes prisa? Escribir directo por WhatsApp →
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <div className="quick-result" data-rule-id={orientation.ruleId}>
          <p className="eyebrow">ORIENTACIÓN INICIAL · 3 DE 3 COMPLETADAS</p>
          <h2 id="quick-advisor-heading" ref={headingRef} tabIndex={-1}>{orientation.headline}</h2>
          <p>{orientation.why}</p>

          <div className="quick-card">
            <h3>Primer paso práctico hoy (sin contratar servicios)</h3>
            <p>{orientation.freeStep}</p>
          </div>

          <div className="quick-card">
            <h3>Qué información falta para decidir mejor</h3>
            <ul>
              {orientation.missingInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="advisor-help">{orientation.disclaimer}</p>
          </div>

          <div className="quick-summary">
            <h3>Tus selecciones</h3>
            <ul>
              <li><strong>Negocio:</strong> {findLabel(BUSINESS_OPTIONS, answers.business)}</li>
              <li><strong>Necesidad:</strong> {findLabel(NEED_OPTIONS, answers.need)}</li>
              <li><strong>Canal actual:</strong> {findLabel(CHANNEL_OPTIONS, answers.channel)}</li>
            </ul>
          </div>

          <div className="quick-paths" aria-label="Elige cómo continuar">
            <a className="button button-light quick-path-btn" href={orientation.guideHref}>
              Aprender a hacerlo por mi cuenta
            </a>
            <button
              type="button"
              className="button button-light quick-path-btn"
              aria-expanded={showHelpPanel}
              onClick={() => setShowHelpPanel((v) => !v)}
            >
              Quiero ayuda profesional
            </button>
          </div>
          <p className="advisor-help">{orientation.guideLabel}</p>

          {showHelpPanel ? (
            <div className="quick-brief">
              <label htmlFor="quick-brief-preview"><strong>Brief preliminar para WhatsApp (opcional editar)</strong></label>
              {editing ? (
                <textarea
                  id="quick-brief-preview"
                  rows={6}
                  maxLength={1200}
                  value={activeBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                />
              ) : (
                <pre id="quick-brief-preview" className="quick-brief-text">{activeBrief}</pre>
              )}
              <div className="advisor-actions">
                {finalUrl ? (
                  <a className="button" href={finalUrl} target="_blank" rel="noopener noreferrer">
                    Enviar este brief por WhatsApp
                  </a>
                ) : null}
                <button type="button" className="button button-light" onClick={() => setEditing((v) => !v)}>
                  {editing ? 'Listo, ver mensaje' : 'Editar mensaje (opcional)'}
                </button>
              </div>
            </div>
          ) : null}

          <div className="quick-footer">
            <button type="button" className="advisor-text-button" onClick={goBack}>
              ← Corregir última respuesta
            </button>
            <button type="button" className="advisor-text-button" onClick={restart}>
              Empezar de nuevo
            </button>
          </div>
        </div>
      )}

      <div className="quick-deepen" aria-label="Opciones para profundizar">
        <p className="advisor-help">¿Prefieres un análisis más detallado con referencias visuales o explicar tu idea con tus palabras?</p>
        <div className="quick-deepen-actions">
          <button type="button" className="advisor-text-button" onClick={onDeepen}>
            Quiero responder unas preguntas (recorrido completo)
          </button>
          <button type="button" className="advisor-text-button" onClick={onChat}>
            Prefiero contar mi idea
          </button>
        </div>
      </div>
    </section>
  );
}
