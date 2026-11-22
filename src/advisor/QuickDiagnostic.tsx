import { useRef, useState } from 'react';
import { buildOrientation, type QuickAnswers } from '../../shared/quick-orientation.ts';
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

function findLabel(options: readonly QuickOption[], id: string): string {
  return options.find(o => o.id === id)?.label ?? '';
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
