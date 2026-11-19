import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "../analytics.ts";
import { buildWhatsAppUrl, getWhatsAppDestination, MAX_WHATSAPP_URL_LENGTH } from "../contact-utils.ts";
import { INITIAL_QUESTION, FINAL_PRIORITY_QUESTION } from "../diagnostic.ts";
import {
  BRIEF_FIELDS,
  BRIEF_EDIT_LIMIT,
  FEATURES,
  SECTORS,
  STEP_LABELS,
  CONTEXT_PROMPTS,
  buildBrief,
  contextQuestion,
  emptyAnswers,
  normalizeReferenceUrl,
  updateAnswer,
  validateAnswers,
  validateBriefEdits,
  validateStep,
} from "./model.ts";
import type { AdvisorAnswers, BriefEdits, BriefField } from "./contract.ts";
import { REFERENCE_LIBRARY } from "./references.ts";
import type { DisplayBrief } from '../../shared/advisor-session-contract.ts';
import { serializeDisplayBrief } from '../../shared/advisor-session.ts';

type Errors = Record<string, string>;
type StepNumber = 1 | 2 | 3 | 4 | 5;
const STEP_TITLES = [
  "Tu negocio",
  "Qué necesitas resolver",
  "Referencias y preferencias",
  "Recursos y prioridades",
  "Tu brief, listo para revisar",
];
const PROVENANCE_LABELS = {
  confirmed: "Aportado o confirmado por ti",
  inferred: "Hipótesis de las reglas",
  suggested: "Sugerencia por validar",
  pending: "Pendiente de confirmar",
};

function FieldError({ field, errors }: { field: string; errors: Errors }) {
  return errors[field] ? (
    <p id={`advisor-${field}-error`} className="advisor-field-error">
      {errors[field]}
    </p>
  ) : null;
}

function TextField({
  field,
  label,
  value,
  limit,
  errors,
  onChange,
  help,
  multiline = false,
  required = false,
}: {
  field: string;
  label: string;
  value: string;
  limit: number;
  errors: Errors;
  onChange: (value: string) => void;
  help?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const describedBy = [
    help ? `advisor-${field}-help` : "",
    errors[field] ? `advisor-${field}-error` : "",
  ].filter(Boolean).join(" ");
  const props = {
    id: `advisor-${field}`,
    name: field,
    value,
    maxLength: limit,
    required,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy || undefined,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
  };
  return (
    <div className="advisor-field">
      <label htmlFor={props.id}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {help && <p id={`advisor-${field}-help`} className="advisor-help">{help}</p>}
      {multiline ? <textarea {...props} rows={3} /> : <input {...props} type="text" />}
      <FieldError field={field} errors={errors} />
      <span className="advisor-character-count">{value.length} / {limit}</span>
    </div>
  );
}

function RadioQuestion({
  field,
  title,
  subtitle,
  options,
  value,
  errors,
  onChange,
}: {
  field: string;
  title: string;
  subtitle?: string;
  options: readonly { id: string; label: string }[];
  value: string;
  errors: Errors;
  onChange: (value: string) => void;
}) {
  const describedBy = [
    subtitle ? `advisor-${field}-help` : "",
    errors[field] ? `advisor-${field}-error` : "",
  ].filter(Boolean).join(" ");
  return (
    <fieldset className="advisor-question" aria-describedby={describedBy || undefined}>
      <legend>{title} <span aria-hidden="true">*</span></legend>
      {subtitle && <p id={`advisor-${field}-help`} className="advisor-help">{subtitle}</p>}
      <div className="advisor-choices">
        {options.map((option) => (
          <label className="advisor-choice" key={option.id}>
            <input
              type="radio"
              name={field}
              value={option.id}
              checked={value === option.id}
              required
              aria-invalid={errors[field] ? true : undefined}
              onChange={() => onChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <FieldError field={field} errors={errors} />
    </fieldset>
  );
}

interface WizardProps {
  sharedAnswers?: AdvisorAnswers;
  onAnswersChange?: (answers: AdvisorAnswers) => void;
  sharedBrief?: DisplayBrief | null;
  onBriefChange?: (brief: DisplayBrief | null) => void;
  briefFactory?: (answers: AdvisorAnswers, edits: BriefEdits, revision: number, purpose: 'generate' | 'edit') => DisplayBrief;
  contextChanged?: boolean;
  openBriefVersion?: number;
  onPendingEdits?: (pending: boolean) => void;
  onRestart?: () => void;
}
export function AdvisorWizard(props: WizardProps = {}) {
  const [localAnswers, setLocalAnswers] = useState<AdvisorAnswers>(() => emptyAnswers());
  const answers = props.sharedAnswers ?? localAnswers;
  function setAnswers(value: AdvisorAnswers | ((current: AdvisorAnswers) => AdvisorAnswers)) {
    const next = typeof value === 'function' ? value(answers) : value;
    if (props.onAnswersChange) props.onAnswersChange(next); else setLocalAnswers(next);
  }
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const [referenceDraft, setReferenceDraft] = useState({ url: "", likes: "", dislikes: "" });
  const [localBrief, setLocalBrief] = useState<DisplayBrief | null>(null);
  const brief = props.sharedBrief === undefined ? localBrief : props.sharedBrief;
  const setBrief = props.onBriefChange ?? setLocalBrief;
  const makeBrief = props.briefFactory ?? buildBrief;
  const [briefAnswers, setBriefAnswers] = useState<AdvisorAnswers | null>(null);
  const [edits, setEdits] = useState<BriefEdits>({});
  const [editDrafts, setEditDrafts] = useState<Record<BriefField, string> | null>(null);
  const [editErrors, setEditErrors] = useState<Errors>({});
  const [refreshConfirm, setRefreshConfirm] = useState(false);
  const [restartConfirm, setRestartConfirm] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const started = useRef(false);
  const referenceSequence = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const refreshHeadingRef = useRef<HTMLHeadingElement>(null);
  const restartHeadingRef = useRef<HTMLHeadingElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const focusHeading = useRef(false);
  const focusErrors = useRef(false);
  const restoreNextFocus = useRef(false);
  const restoreRestartFocus = useRef(false);

  useEffect(() => {
    if (focusHeading.current) {
      focusHeading.current = false;
      headingRef.current?.focus();
    }
  }, [step, restartConfirm]);
  useEffect(() => {
    if (focusErrors.current && Object.keys(errors).length) {
      focusErrors.current = false;
      errorRef.current?.focus();
    }
  }, [errors]);
  useEffect(() => {
    if (refreshConfirm) refreshHeadingRef.current?.focus();
    else if (restoreNextFocus.current) {
      restoreNextFocus.current = false;
      nextButtonRef.current?.focus();
    }
  }, [refreshConfirm]);
  useEffect(() => {
    if (restartConfirm) restartHeadingRef.current?.focus();
    else if (restoreRestartFocus.current) {
      restoreRestartFocus.current = false;
      restartButtonRef.current?.focus();
    }
  }, [restartConfirm]);

  const currentContext = contextQuestion(answers.goalId);
  const referenceCount = answers.referenceIds.length + answers.references.length;
  const answersChanged = Boolean(brief && briefAnswers && JSON.stringify(answers) !== JSON.stringify(briefAnswers));
  const pendingEdits = Boolean(brief && editDrafts && BRIEF_FIELDS.some((field) => editDrafts[field.key] !== brief.fields[field.key]));
  const message = brief ? serializeDisplayBrief(brief) : "";
  const preparedUrl = message ? buildWhatsAppUrl(message) : "";
  // Long messages remain available in full in the preview and clipboard.
  const canPrefillWhatsApp = Boolean(preparedUrl && preparedUrl.length <= MAX_WHATSAPP_URL_LENGTH);
  const whatsappUrl = canPrefillWhatsApp ? preparedUrl : getWhatsAppDestination();
  const canShare = Boolean(brief && !props.contextChanged && !answersChanged && !pendingEdits && !Object.keys(editErrors).length);

  useEffect(() => { props.onPendingEdits?.(pendingEdits); }, [pendingEdits, props.onPendingEdits]);
  useEffect(() => {
    if (!props.openBriefVersion || !brief) return;
    setBriefAnswers(answers);
    setEditDrafts({ ...brief.fields });
    setEdits({}); setEditErrors({});
    focusHeading.current = true; setStep(4);
    // Only an explicit open action imports a shared brief. Proposals never replace drafts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openBriefVersion]);

  function start() {
    if (started.current) return;
    started.current = true;
    track("advisor_start", { mode: "deterministic" });
  }

  function change<K extends keyof AdvisorAnswers>(key: K, value: AdvisorAnswers[K]) {
    start();
    setAnswers((current) => updateAnswer(current, key, value));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      if (key === "goalId") delete next.contextId;
      return next;
    });
    setRefreshConfirm(false);
    setCopyFeedback("");
    if (key === "goalId" && answers.goalId && answers.goalId !== value) {
      setNotice("Cambió la pregunta de contexto. Elige una respuesta para el nuevo objetivo.");
    }
  }

  function fail(nextErrors: Errors) {
    focusErrors.current = true;
    setErrors(nextErrors);
    track("advisor_validation_error", { step: (step + 1) as StepNumber });
  }

  function moveTo(nextStep: number) {
    focusHeading.current = true;
    setStep(nextStep);
    setErrors({});
    setNotice("");
    setRefreshConfirm(false);
    setRestartConfirm(false);
  }

  function generateBrief(replaceEdits = false) {
    const validated = validateAnswers(answers);
    if (!validated.ok) {
      fail(validated.errors);
      return;
    }
    if (answersChanged && Object.keys(edits).length && !replaceEdits) {
      setRefreshConfirm(true);
      setNotice("Actualizar el brief reemplazará tus ediciones manuales. Puedes copiar la versión anterior antes de confirmar.");
      return;
    }
    try {
      const revision = brief ? brief.revision + (answersChanged ? 1 : 0) : 1;
      const nextEdits = answersChanged || replaceEdits ? {} : edits;
      const nextBrief = makeBrief(validated.value, nextEdits, revision, 'generate');
      setAnswers(validated.value);
      setBrief(nextBrief);
      setBriefAnswers(validated.value);
      setEdits(nextEdits);
      setEditDrafts({ ...nextBrief.fields });
      setEditErrors({});
      setCopyFeedback("");
      track("advisor_step_completed", { step: 4 });
      if (nextBrief.area !== 'unknown') track("advisor_brief_generated", { mode: "deterministic", area: nextBrief.area, revision });
      moveTo(4);
    } catch (error) {
      fail({ form: error instanceof Error ? error.message : "Revisa tus respuestas antes de preparar el brief." });
    }
  }

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step >= STEP_LABELS.length - 1) return;
    start();
    const nextErrors = validateStep(answers, step);
    if (Object.keys(nextErrors).length) {
      fail(nextErrors);
      return;
    }
    if (step === 2 && (referenceDraft.url.trim() || referenceDraft.likes.trim() || referenceDraft.dislikes.trim())) {
      fail({ referenceDraft: "Tienes una referencia pendiente. Añádela o descártala antes de continuar." });
      return;
    }
    if (step === 3) {
      generateBrief();
      return;
    }
    track("advisor_step_completed", { step: (step + 1) as StepNumber });
    moveTo(step + 1);
  }

  function toggleCurated(id: string, selected: boolean) {
    if (selected && referenceCount >= 5) {
      setErrors((current) => ({ ...current, referenceIds: "Puedes elegir hasta 5 referencias en total. Quita una para añadir otra." }));
      setNotice("Ya elegiste 5 referencias. Puedes quitar una para elegir otra.");
      return;
    }
    change("referenceIds", selected ? [...answers.referenceIds, id] : answers.referenceIds.filter((item) => item !== id));
    if (selected) {
      track("advisor_reference_added", { source: "curated", count: (referenceCount + 1) as StepNumber });
    }
    setNotice(selected ? "Referencia añadida." : "Referencia retirada.");
  }

  function addReference() {
    const normalized = normalizeReferenceUrl(referenceDraft.url);
    if (!normalized.ok) {
      setErrors((current) => ({ ...current, referenceUrl: normalized.error }));
      document.getElementById("advisor-referenceUrl")?.focus();
      return;
    }
    if (referenceCount >= 5) {
      setErrors((current) => ({ ...current, referenceUrl: "Puedes elegir hasta 5 referencias en total. Quita una antes de añadir otra." }));
      document.getElementById("advisor-referenceUrl")?.focus();
      return;
    }
    const selectedUrls = REFERENCE_LIBRARY.filter((item) => answers.referenceIds.includes(item.id)).map((item) => item.url);
    if (answers.references.some((item) => item.url === normalized.url) || selectedUrls.includes(normalized.url)) {
      setErrors((current) => ({ ...current, referenceUrl: "Este enlace ya está entre tus referencias." }));
      document.getElementById("advisor-referenceUrl")?.focus();
      return;
    }
    referenceSequence.current += 1;
    change("references", [...answers.references, {
      id: `visitor-${referenceSequence.current}`,
      url: normalized.url,
      likes: referenceDraft.likes,
      dislikes: referenceDraft.dislikes,
    }]);
    setReferenceDraft({ url: "", likes: "", dislikes: "" });
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors.referenceUrl;
      delete nextErrors.referenceDraft;
      return nextErrors;
    });
    track("advisor_reference_added", { source: "visitor", count: (referenceCount + 1) as StepNumber });
    setNotice("Enlace añadido como referencia. No hemos visitado ni analizado su contenido.");
    document.getElementById("advisor-referenceUrl")?.focus();
  }

  function editBrief(field: BriefField, value: string) {
    setEditDrafts((current) => current ? { ...current, [field]: value } : current);
    setEditErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      delete nextErrors.form;
      return nextErrors;
    });
    setCopyFeedback("");
  }

  function saveBriefEdits() {
    if (!brief || !briefAnswers || !editDrafts) return;
    try {
      const originalBrief = makeBrief(briefAnswers, {}, brief.revision, 'edit');
      const nextEdits: BriefEdits = {};
      for (const field of BRIEF_FIELDS) {
        if (editDrafts[field.key] !== originalBrief.fields[field.key]) nextEdits[field.key] = editDrafts[field.key];
      }
      const validated = validateBriefEdits(nextEdits);
      if (!validated.ok) {
        setEditErrors(validated.errors);
        setCopyFeedback("No se guardaron las ediciones. Revisa los bloques señalados; el mensaje anterior sigue conservado.");
        return;
      }
      const nextBrief = makeBrief(briefAnswers, validated.value, brief.revision, 'edit');
      setEdits(validated.value);
      setBrief(nextBrief);
      setEditDrafts({ ...nextBrief.fields });
      setEditErrors({});
      setCopyFeedback("Ediciones guardadas. La vista previa del mensaje está actualizada.");
    } catch (error) {
      setEditErrors({ form: error instanceof Error ? error.message : "No pudimos aplicar las ediciones." });
      setCopyFeedback("Conservamos el mensaje anterior. Revisa tus ediciones para guardarlas.");
    }
  }

  async function copyBrief() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopyFeedback("Brief copiado. Tú decides cuándo compartirlo.");
    } catch {
      setCopyFeedback("No pudimos copiar automáticamente. Selecciona y copia el texto completo en la vista previa.");
      previewRef.current?.focus();
      previewRef.current?.select();
    }
  }

  function restart() {
    setAnswers(emptyAnswers());
    setBrief(null);
    setBriefAnswers(null);
    setEdits({});
    setEditDrafts(null);
    setEditErrors({});
    setReferenceDraft({ url: "", likes: "", dislikes: "" });
    setCopyFeedback("");
    started.current = false;
    moveTo(0);
    props.onRestart?.();
    setNotice("Empezaste un nuevo diagnóstico. Se borraron las respuestas y el brief anteriores.");
  }

  return (
    <section className="advisor-wizard" aria-labelledby="advisor-step-title">
      <div className="advisor-progress">
        <p className="advisor-step-count">Paso {step + 1} de {STEP_LABELS.length}</p>
        <progress value={step + 1} max={STEP_LABELS.length} aria-label={`Paso ${step + 1} de ${STEP_LABELS.length}`} />
        <ol aria-label="Pasos del diagnóstico">
          {STEP_LABELS.map((label, index) => (
            <li key={label} className={index <= step ? "is-reached" : ""}>
              <span aria-current={index === step ? "step" : undefined}>
                <span className="advisor-step-number" aria-hidden="true">{index + 1}</span>
                <span>{label}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <header className="advisor-step-header">
        <p className="eyebrow">ASESORÍA GUIADA · REGLAS LOCALES</p>
        <h2 id="advisor-step-title" ref={headingRef} tabIndex={-1}>{STEP_TITLES[step]}</h2>
        <p className="advisor-help">Los campos con * son obligatorios. Las referencias y el contexto adicional son opcionales.</p>
      </header>
      <p className="advisor-status" role="status" aria-live="polite">{notice}</p>
      {Object.keys(errors).length > 0 && (
        <div className="advisor-errors" ref={errorRef} tabIndex={-1} role="status" aria-live="polite">
          <p><strong>Revisa estos puntos para continuar:</strong></p>
          <ul>{[...new Set(Object.values(errors))].map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}
      {brief && answersChanged && step < 4 && (
        <p className="advisor-notice">Estás corrigiendo tus respuestas. Tu brief anterior se conserva hasta que confirmes su actualización.</p>
      )}
      <form noValidate onSubmit={next} data-advisor-step={step + 1}>
        {step === 0 && (
          <div className="advisor-fields">
            <div className="advisor-field">
              <label htmlFor="advisor-sector">Tipo de negocio <span aria-hidden="true">*</span></label>
              <select id="advisor-sector" name="sector" required value={answers.sector} aria-invalid={errors.sector ? true : undefined} aria-describedby={errors.sector ? "advisor-sector-error" : undefined} onChange={(event) => change("sector", event.target.value)}>
                <option value="">Elige una opción</option>
                {SECTORS.map((sector) => <option key={sector.id} value={sector.id}>{sector.label}</option>)}
              </select>
              <FieldError field="sector" errors={errors} />
            </div>
            <TextField field="activity" label={CONTEXT_PROMPTS.activity} required value={answers.activity} limit={250} errors={errors} onChange={(value) => change("activity", value)} help="Describe tu actividad. No necesitas dar tu nombre ni datos de contacto." multiline />
            <TextField field="audience" label="¿A quién atiendes? (opcional)" value={answers.audience} limit={400} errors={errors} onChange={(value) => change("audience", value)} help="Por ejemplo: familias que visitan Oaxaca o comercios de tu zona." multiline />
            <p className="advisor-notice">Tus respuestas quedan en la memoria de esta página. Al recargarla o cerrarla se perderán. Evita datos privados de clientes.</p>
          </div>
        )}
        {step === 1 && (
          <div className="advisor-fields">
            <TextField field="problem" label={CONTEXT_PROMPTS.problem} required value={answers.problem} limit={1200} errors={errors} onChange={(value) => change("problem", value)} help="Cuéntanos qué ocurre hoy. Una situación concreta ayuda más que una lista de herramientas." multiline />
            <RadioQuestion field="goalId" title={INITIAL_QUESTION.title} subtitle={INITIAL_QUESTION.subtitle} options={INITIAL_QUESTION.options} value={answers.goalId} errors={errors} onChange={(value) => change("goalId", value)} />
            {currentContext && <RadioQuestion field="contextId" title={currentContext.title} subtitle={currentContext.subtitle} options={currentContext.options} value={answers.contextId} errors={errors} onChange={(value) => change("contextId", value)} />}
            <RadioQuestion field="priorityId" title={FINAL_PRIORITY_QUESTION.title} subtitle={FINAL_PRIORITY_QUESTION.subtitle} options={FINAL_PRIORITY_QUESTION.options} value={answers.priorityId} errors={errors} onChange={(value) => change("priorityId", value)} />
          </div>
        )}
        {step === 2 && (
          <div className="advisor-fields">
            <p className="advisor-notice">Esta biblioteca reúne enlaces y criterios de diseño. No reproduce capturas de terceros. Añadir una URL no significa que hayamos analizado visualmente esa web.</p>
            <fieldset className="advisor-question" aria-describedby="advisor-reference-count">
              <legend>Explora referencias curadas (opcional)</legend>
              <p id="advisor-reference-count" className="advisor-help">{referenceCount} de 5 referencias elegidas en total. Puedes continuar sin elegir ninguna.</p>
              <div className="advisor-reference-grid">
                {REFERENCE_LIBRARY.map((reference) => (
                  <article className="advisor-reference-card" key={reference.id}>
                    <p className="eyebrow">{reference.category}</p>
                    <h3>{reference.title}</h3>
                    <p>{reference.description}</p>
                    <ul>{reference.patterns.map((pattern) => <li key={pattern}>{pattern}</li>)}</ul>
                    <p className="advisor-reference-meta">Referencia externa · revisada {reference.reviewedAt}</p>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer">Visitar {reference.title} <span className="advisor-new-tab">(nueva pestaña)</span> <span aria-hidden="true">↗</span></a>
                    <label className="advisor-choice">
                      <input type="checkbox" checked={answers.referenceIds.includes(reference.id)} onChange={(event) => toggleCurated(reference.id, event.target.checked)} />
                      <span>Elegir {reference.title}</span>
                    </label>
                  </article>
                ))}
              </div>
              <FieldError field="referenceIds" errors={errors} />
            </fieldset>
            <div className="advisor-reference-entry">
              <h3>Añade tu propio enlace (opcional)</h3>
              <div className="advisor-field">
                <label htmlFor="advisor-referenceUrl">URL de la página</label>
                <p className="advisor-help" id="advisor-referenceUrl-help">Usa una dirección pública que empiece por https://. No pegues enlaces privados, de acceso o con contraseñas.</p>
                <input id="advisor-referenceUrl" name="referenceUrl" type="url" inputMode="url" autoCapitalize="none" spellCheck={false} maxLength={2048} value={referenceDraft.url} aria-invalid={errors.referenceUrl ? true : undefined} aria-describedby={`advisor-referenceUrl-help${errors.referenceUrl ? " advisor-referenceUrl-error" : ""}`} onChange={(event) => {
                  setReferenceDraft((current) => ({ ...current, url: event.target.value }));
                  setErrors((current) => { const nextErrors = { ...current }; delete nextErrors.referenceUrl; delete nextErrors.referenceDraft; return nextErrors; });
                }} />
                <FieldError field="referenceUrl" errors={errors} />
              </div>
              <TextField field="referenceLikes" label="¿Qué te gusta de esa página?" value={referenceDraft.likes} limit={600} errors={{}} onChange={(value) => setReferenceDraft((current) => ({ ...current, likes: value }))} multiline />
              <TextField field="referenceDislikes" label="¿Qué no elegirías de esa página?" value={referenceDraft.dislikes} limit={600} errors={{}} onChange={(value) => setReferenceDraft((current) => ({ ...current, dislikes: value }))} multiline />
              <div className="advisor-actions">
                <button type="button" className="button button-light" onClick={addReference}>Añadir enlace</button>
                {(referenceDraft.url || referenceDraft.likes || referenceDraft.dislikes) && <button type="button" className="advisor-text-button" onClick={() => {
                  setReferenceDraft({ url: "", likes: "", dislikes: "" });
                  setErrors((current) => { const nextErrors = { ...current }; delete nextErrors.referenceDraft; delete nextErrors.referenceUrl; return nextErrors; });
                  setNotice("Se descartó el enlace que aún no habías añadido.");
                }}>Descartar enlace pendiente</button>}
              </div>
            </div>
            {answers.references.length > 0 && (
              <div className="advisor-user-references">
                <h3>Tus enlaces</h3>
                {answers.references.map((reference, index) => (
                  <article className="advisor-user-reference" key={reference.id}>
                    <h4>Referencia {index + 1}</h4>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.url} <span className="advisor-new-tab">(nueva pestaña)</span></a>
                    <TextField field={`${reference.id}-likes`} label="Lo que te gusta" value={reference.likes} limit={600} errors={{}} onChange={(value) => change("references", answers.references.map((item) => item.id === reference.id ? { ...item, likes: value } : item))} multiline />
                    <TextField field={`${reference.id}-dislikes`} label="Lo que evitarías" value={reference.dislikes} limit={600} errors={{}} onChange={(value) => change("references", answers.references.map((item) => item.id === reference.id ? { ...item, dislikes: value } : item))} multiline />
                    <button type="button" className="advisor-text-button" onClick={() => {
                      change("references", answers.references.filter((item) => item.id !== reference.id));
                      setNotice("Referencia retirada. Para cambiar su URL puedes añadir el nuevo enlace.");
                      document.getElementById("advisor-referenceUrl")?.focus();
                    }}>Quitar referencia {index + 1}</button>
                  </article>
                ))}
              </div>
            )}
            <TextField field="likes" label="En conjunto, ¿qué elementos te interesan? (opcional)" value={answers.likes} limit={600} errors={errors} onChange={(value) => change("likes", value)} help="Puedes comentar claridad, colores, organización, fotos o facilidad para contactar." multiline />
            <TextField field="dislikes" label="¿Qué elementos prefieres evitar? (opcional)" value={answers.dislikes} limit={600} errors={errors} onChange={(value) => change("dislikes", value)} multiline />
          </div>
        )}
        {step === 3 && (
          <div className="advisor-fields">
            <fieldset className="advisor-question" aria-describedby="advisor-features-help">
              <legend>¿Qué funciones te gustaría explorar? (opcional)</legend>
              <p id="advisor-features-help" className="advisor-help">Son preferencias iniciales. Elegirlas no significa contratarlas ni que sean necesarias.</p>
              <div className="advisor-choices">
                {FEATURES.map((feature) => (
                  <label className="advisor-choice" key={feature.id}>
                    <input type="checkbox" checked={answers.features.includes(feature.id)} onChange={(event) => change("features", event.target.checked ? [...answers.features, feature.id] : answers.features.filter((item) => item !== feature.id))} />
                    <span>{feature.label}</span>
                  </label>
                ))}
              </div>
              <FieldError field="features" errors={errors} />
            </fieldset>
            <TextField field="featureNotes" label="Otra función o detalle (opcional)" value={answers.featureNotes} limit={800} errors={errors} onChange={(value) => change("featureNotes", value)} multiline />
            <TextField field="resources" label="¿Con qué recursos cuentas hoy? (opcional)" value={answers.resources} limit={600} errors={errors} onChange={(value) => change("resources", value)} help={`${CONTEXT_PROMPTS.resources} Por ejemplo: tiempo para actualizar contenido, fotografías propias o alguien que responda consultas. Si no lo sabes, puedes dejarlo pendiente.`} multiline />
            <TextField field="constraints" label="¿Qué límites debemos considerar? (opcional)" value={answers.constraints} limit={800} errors={errors} onChange={(value) => change("constraints", value)} help="Por ejemplo: conectividad, herramientas actuales, tiempo o un presupuesto orientativo. Aquí no se generan precios ni plazos definitivos." multiline />
          </div>
        )}
        {step === 4 && brief && (
          <div className="advisor-brief">
            <div className="advisor-notice">
              <h3>Orientación inicial, por comprobar</h3>
              <p>Las posibilidades se obtienen mediante reglas a partir de tus respuestas. No son una auditoría de tu negocio ni una evaluación visual de las referencias. El alcance, la inversión y los plazos se acuerdan después de revisar el contexto contigo.</p>
            </div>
            <p className="advisor-help">Revisa y corrige cada bloque; después guarda tus ediciones para actualizar el mensaje. Las sugerencias siguen sujetas a validación aunque cambies su redacción. Máximo {BRIEF_EDIT_LIMIT} caracteres por edición y 12 000 entre todas.</p>
            <div className="advisor-brief-fields">
              {BRIEF_FIELDS.map((field) => {
                const provenance = brief.provenance[field.key];
                return (
                  <div className="advisor-brief-field" key={field.key}>
                    <label htmlFor={`advisor-brief-${field.key}`}>{field.label}</label>
                    <p id={`advisor-brief-${field.key}-source`} className="advisor-provenance">
                      <strong>{PROVENANCE_LABELS[provenance.status]}</strong> · {provenance.source}
                    </p>
                    <textarea id={`advisor-brief-${field.key}`} name={`brief-${field.key}`} rows={4} value={editDrafts?.[field.key] ?? brief.fields[field.key]} maxLength={BRIEF_EDIT_LIMIT} aria-invalid={editErrors[field.key] ? true : undefined} aria-describedby={`advisor-brief-${field.key}-source${editErrors[field.key] ? ` advisor-brief-${field.key}-error` : ""}`} onChange={(event) => editBrief(field.key, event.target.value)} />
                    {editErrors[field.key] && <p id={`advisor-brief-${field.key}-error`} className="advisor-field-error" role="status">{editErrors[field.key]}</p>}
                  </div>
                );
              })}
            </div>
            {editErrors.form && <p className="advisor-field-error" role="status">{editErrors.form}</p>}
            {pendingEdits && <p className="advisor-notice">Tienes ediciones sin guardar. El mensaje conserva la versión anterior hasta que guardes los cambios.</p>}
            <div className="advisor-actions">
              <button type="button" className="button button-light" onClick={saveBriefEdits} disabled={!pendingEdits}>Guardar ediciones del brief</button>
              {pendingEdits && <button type="button" className="advisor-text-button" onClick={() => {
                setEditDrafts({ ...brief.fields });
                setEditErrors({});
                setCopyFeedback("Se descartaron las ediciones pendientes. El brief guardado se conserva.");
              }}>Descartar ediciones sin guardar</button>}
            </div>
            <section className="advisor-share" aria-labelledby="advisor-share-title">
              <h3 id="advisor-share-title">Comparte cuando estés listo</h3>
              <p>Este es el mensaje completo que puedes compartir. Abrir WhatsApp prepara la conversación; tú revisas y completas el envío allí.</p>
              <label htmlFor="advisor-message-preview">Vista previa del mensaje</label>
              <textarea id="advisor-message-preview" ref={previewRef} readOnly value={message} rows={12} />
              {!canPrefillWhatsApp && <p className="advisor-notice">Tu brief es largo. Cópialo completo y pégalo en WhatsApp; abriremos la conversación sin recortar el texto.</p>}
              {!canShare && <p className="advisor-field-error">Guarda o descarta las ediciones pendientes antes de compartir el brief.</p>}
              {props.contextChanged && <p className="advisor-field-error">Cambió lo comprendido desde este brief. Vuelve a las preguntas o a la conversación para actualizarlo antes de compartir.</p>}
              <div className="advisor-actions">
                <button type="button" className="button button-light" onClick={copyBrief} disabled={!canShare}>Copiar brief</button>
                {canShare && whatsappUrl && <a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => {
                  track("advisor_step_completed", { step: 5 });
                  track("advisor_contact_opened", { channel: "whatsapp", stage: "channel_opened" });
                }}>{canPrefillWhatsApp ? "Abrir WhatsApp con mi brief" : "Abrir WhatsApp y pegar mi brief"} <span aria-hidden="true">↗</span></a>}
              </div>
              <p className="advisor-status" role="status" aria-live="polite">{copyFeedback}</p>
              <p className="advisor-help">Todavía no se ha enviado. Tus respuestas no se guardan en un servidor. Al abrir WhatsApp compartirás el texto con ese servicio si está precargado.</p>
            </section>
          </div>
        )}
        {refreshConfirm && (
          <div className="advisor-confirm" role="group" aria-labelledby="advisor-refresh-title">
            <h3 id="advisor-refresh-title" ref={refreshHeadingRef} tabIndex={-1}>¿Reemplazar las ediciones del brief?</h3>
            <p>Conservamos el brief anterior mientras corriges tus respuestas. Actualizarlo generará una nueva versión y quitará las ediciones manuales anteriores.</p>
            <label htmlFor="advisor-previous-preview">Brief anterior para conservar</label>
            <textarea id="advisor-previous-preview" ref={previewRef} readOnly value={message} rows={6} />
            <div className="advisor-actions">
              <button type="button" className="button" onClick={() => generateBrief(true)}>Actualizar y reemplazar ediciones</button>
              <button type="button" className="button button-light" onClick={copyBrief}>Copiar brief anterior</button>
              <button type="button" className="advisor-text-button" onClick={() => { restoreNextFocus.current = true; setRefreshConfirm(false); setNotice("Las ediciones del brief anterior siguen conservadas."); }}>Seguir revisando respuestas</button>
            </div>
            <p className="advisor-status" role="status" aria-live="polite">{copyFeedback}</p>
          </div>
        )}
        <div className="advisor-navigation">
          {step > 0 && <button type="button" className="button button-light" onClick={() => {
            if (pendingEdits) {
              setEditErrors({ form: "Guarda o descarta las ediciones pendientes antes de volver a las respuestas. Así no se perderán tus cambios." });
              setCopyFeedback("Las ediciones pendientes siguen en pantalla. Guárdalas o descártalas antes de volver.");
              return;
            }
            moveTo(step - 1);
          }}>Volver</button>}
          {step < 4 && !refreshConfirm && <button className="button" ref={nextButtonRef} type="submit">{step === 3 ? brief ? "Actualizar mi brief" : "Generar mi brief" : "Continuar"} <span aria-hidden="true">→</span></button>}
        </div>
      </form>
      <div className="advisor-reset">
        {!restartConfirm ? <button type="button" className="advisor-text-button" ref={restartButtonRef} onClick={() => setRestartConfirm(true)}>Empezar de nuevo</button> : (
          <div className="advisor-confirm" role="group" aria-labelledby="advisor-restart-title">
            <h3 id="advisor-restart-title" ref={restartHeadingRef} tabIndex={-1}>¿Borrar este diagnóstico?</h3>
            <p>Se quitarán tus respuestas, referencias y brief. Puedes copiar el brief primero si quieres conservarlo.</p>
            <div className="advisor-actions">
              <button type="button" className="button" onClick={restart}>Sí, borrar y empezar</button>
              <button type="button" className="button button-light" onClick={() => { restoreRestartFocus.current = true; setRestartConfirm(false); }}>Conservar mi diagnóstico</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
