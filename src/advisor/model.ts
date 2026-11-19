import {
  INITIAL_QUESTION,
  CONTEXT_QUESTIONS,
  FINAL_PRIORITY_QUESTION,
  classifyDiagnostic,
  type DiagnosticQuestion,
} from "../diagnostic.ts";
import { ASTRA_CONSULTATIVE_STEPS } from "../astra.ts";
import { REFERENCE_LIBRARY } from "./references.ts";
import {
  ANSWER_LIMITS, BRIEF_FIELDS, BRIEF_EDIT_LIMIT, BRIEF_EDITS_TOTAL_LIMIT,
  FEATURES, REFERENCE_LIMIT, REFERENCE_NOTE_LIMIT, REFERENCE_URL_LIMIT, SECTORS,
  STEP_LABELS, emptyAnswers,
  type AdvisorAnswers, type AdvisorBrief, type BriefEdits, type BriefField,
  type BriefProvenance, type EvidenceStatus, type UserReference, type ValidationResult,
} from "./contract.ts";

export {
  ANSWER_LIMITS, BRIEF_FIELDS, BRIEF_EDIT_LIMIT, BRIEF_EDITS_TOTAL_LIMIT,
  FEATURES, REFERENCE_LIMIT, REFERENCE_NOTE_LIMIT, REFERENCE_URL_LIMIT,
  SECTORS, STEP_LABELS, emptyAnswers,
} from "./contract.ts";
export type { AdvisorAnswers, AdvisorBrief, Brief, BriefEdits, BriefField, UserReference } from "./contract.ts";

/** Reuse the existing context prompts without presenting ASTRA as an AI service. */
export const CONTEXT_PROMPTS = {
  activity: ASTRA_CONSULTATIVE_STEPS.find((step) => step.field === "offer")?.question ?? "¿Qué ofreces?",
  problem: ASTRA_CONSULTATIVE_STEPS.find((step) => step.field === "coreProblem")?.question ?? "¿Qué quieres resolver?",
  resources: ASTRA_CONSULTATIVE_STEPS.find((step) => step.field === "currentEfforts")?.question ?? "¿Qué haces actualmente?",
} as const;

const forbiddenControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const fieldKeys = BRIEF_FIELDS.map((field) => field.key);
const answerKeys = Object.keys(emptyAnswers());
const sourceStatuses: EvidenceStatus[] = ["confirmed", "inferred", "suggested", "pending"];

function isRecord(input: unknown): input is Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const prototype = Object.getPrototypeOf(input);
  return prototype === Object.prototype || prototype === null;
}

function textValue(
  input: unknown, key: string, max: number, errors: Record<string, string>, required = false,
): string {
  if (typeof input !== "string") {
    errors[key] = "Escribe un texto válido.";
    return "";
  }
  if (input.length > max) errors[key] = `Usa como máximo ${max} caracteres.`;
  else if (forbiddenControls.test(input)) errors[key] = "El texto contiene caracteres no admitidos.";
  const value = input.trim();
  if (required && !value && !errors[key]) errors[key] = "Completa este dato para continuar.";
  return value;
}

function hasExtraKeys(input: Record<string, unknown>, permitted: readonly string[]): boolean {
  return Object.keys(input).some((key) => !permitted.includes(key));
}

/** Pure lexical validation; never requests a URL or claims its contents were reviewed. */
export function normalizeReferenceUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  if (typeof raw !== "string" || !raw.trim()) return { ok: false, error: "Añade un enlace HTTPS completo." };
  if (raw.length > REFERENCE_URL_LIMIT) return { ok: false, error: `El enlace debe tener hasta ${REFERENCE_URL_LIMIT} caracteres.` };
  const value = raw.trim();
  if (/\s|[\u0000-\u001f\u007f\\]/.test(value) || !/^https:\/\//i.test(value))
    return { ok: false, error: "Usa un enlace HTTPS absoluto, sin espacios ni caracteres especiales de control." };
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password)
      return { ok: false, error: "Usa HTTPS sin usuario ni contraseña en el enlace." };
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    const localSuffixes = ["localhost", "local", "internal", "lan", "home", "corp", "test", "invalid", "onion"];
    if (!host.includes(".") || localSuffixes.some((suffix) => host === suffix || host.endsWith(`.${suffix}`)))
      return { ok: false, error: "Usa un dominio público; los enlaces locales o privados no se admiten." };
    // IPv6 literals are intentionally excluded; use a public domain for a reference.
    if (host.includes(":")) return { ok: false, error: "Usa un dominio público en lugar de una dirección IPv6." };
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const [a, b, c] = host.split(".").map(Number);
      if (a === 0 || a === 10 || a === 127 || a >= 224 ||
        (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
        (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) ||
        (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113))
        return { ok: false, error: "Las direcciones locales, privadas o reservadas no se admiten." };
    }
    if (url.href.length > REFERENCE_URL_LIMIT) return { ok: false, error: "El enlace normalizado es demasiado largo." };
    return { ok: true, url: url.href };
  } catch {
    return { ok: false, error: "Revisa el enlace; debe ser una dirección HTTPS válida." };
  }
}

export function contextQuestion(goalId: string): DiagnosticQuestion | undefined {
  const goal = INITIAL_QUESTION.options.find((option) => option.id === goalId);
  return goal?.contextQuestionKey ? CONTEXT_QUESTIONS[goal.contextQuestionKey] : undefined;
}

export function updateAnswer<K extends keyof AdvisorAnswers>(
  answers: AdvisorAnswers, key: K, value: AdvisorAnswers[K],
): AdvisorAnswers {
  const updated = { ...answers, [key]: value };
  if (key === "goalId" && value !== answers.goalId) updated.contextId = "";
  return updated;
}

function selectedIds(input: unknown, key: string, choices: readonly string[], errors: Record<string, string>): string[] {
  if (!Array.isArray(input) || input.length > choices.length || input.some((value) => typeof value !== "string")) {
    errors[key] = "Selecciona opciones válidas dentro del límite disponible.";
    return [];
  }
  if (new Set(input).size !== input.length || input.some((value) => !choices.includes(value)))
    errors[key] = "Revisa las opciones: no pueden estar repetidas ni ser desconocidas.";
  return [...input] as string[];
}

function userReferences(input: unknown, errors: Record<string, string>, allowCurated = false): UserReference[] {
  if (!Array.isArray(input) || input.length > REFERENCE_LIMIT) {
    errors.references = `Añade como máximo ${REFERENCE_LIMIT} referencias en total.`;
    return [];
  }
  const result: UserReference[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const entry of input) {
    const itemErrors: Record<string, string> = {};
    if (!isRecord(entry) || hasExtraKeys(entry, ["id", "url", "likes", "dislikes"])) {
      errors.references = "Revisa el formato de las referencias.";
      continue;
    }
    const id = textValue(entry.id, "id", 100, itemErrors, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id) ||
      (!allowCurated && REFERENCE_LIBRARY.some((reference) => reference.id === id)))
      itemErrors.id = "La referencia necesita un identificador único válido.";
    const checkedUrl = normalizeReferenceUrl(typeof entry.url === "string" ? entry.url : "");
    if (!checkedUrl.ok) itemErrors.url = checkedUrl.error;
    const url = checkedUrl.ok ? checkedUrl.url : "";
    if (url && urls.has(url)) itemErrors.url = "No añadas el mismo enlace dos veces.";
    const likes = textValue(entry.likes, "likes", REFERENCE_NOTE_LIMIT, itemErrors);
    const dislikes = textValue(entry.dislikes, "dislikes", REFERENCE_NOTE_LIMIT, itemErrors);
    if (Object.keys(itemErrors).length) errors.references = Object.values(itemErrors).join(" ");
    ids.add(id);
    if (url) urls.add(url);
    result.push({ id, url, likes, dislikes });
  }
  return result;
}

export function validateAnswers(input: unknown): ValidationResult<AdvisorAnswers> {
  const errors: Record<string, string> = {};
  if (!isRecord(input)) return { ok: false, errors: { form: "Revisa las respuestas del asesor." } };
  if (hasExtraKeys(input, answerKeys)) errors.form = "Las respuestas contienen campos desconocidos.";
  const answers = emptyAnswers();
  for (const key of Object.keys(ANSWER_LIMITS) as Array<keyof typeof ANSWER_LIMITS>)
    answers[key] = textValue(input[key], key, ANSWER_LIMITS[key], errors, ["sector", "activity", "problem", "goalId", "contextId", "priorityId"].includes(key));
  if (answers.sector && !SECTORS.some((sector) => sector.id === answers.sector)) errors.sector = "Selecciona un sector de la lista.";
  if (answers.goalId && !INITIAL_QUESTION.options.some((option) => option.id === answers.goalId)) errors.goalId = "Selecciona un objetivo válido.";
  const context = contextQuestion(answers.goalId);
  if (answers.contextId && (!context || !context.options.some((option) => option.id === answers.contextId)))
    errors.contextId = "Selecciona una respuesta correspondiente a tu objetivo actual.";
  if (answers.priorityId && !FINAL_PRIORITY_QUESTION.options.some((option) => option.id === answers.priorityId))
    errors.priorityId = "Selecciona una prioridad válida.";
  answers.features = selectedIds(input.features, "features", FEATURES.map((feature) => feature.id), errors);
  answers.referenceIds = selectedIds(input.referenceIds, "referenceIds", REFERENCE_LIBRARY.map((reference) => reference.id), errors);
  answers.references = userReferences(input.references, errors);
  if (answers.referenceIds.length + answers.references.length > REFERENCE_LIMIT)
    errors.references = `Selecciona como máximo ${REFERENCE_LIMIT} referencias entre la biblioteca y tus enlaces.`;
  const curatedUrls = answers.referenceIds.flatMap((id) => {
    const reference = REFERENCE_LIBRARY.find((item) => item.id === id);
    const checked = reference ? normalizeReferenceUrl(reference.url) : undefined;
    return checked?.ok ? [checked.url] : [];
  });
  if (answers.references.some((reference) => curatedUrls.includes(reference.url))) errors.references = "Este enlace ya está seleccionado en la biblioteca.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: answers };
}

const stepKeys: readonly (readonly string[])[] = [
  ["sector", "activity", "audience"],
  ["problem", "goalId", "contextId", "priorityId"],
  ["referenceIds", "references", "likes", "dislikes"],
  ["features", "featureNotes", "resources", "constraints"],
  answerKeys,
];
export function validateStep(answers: AdvisorAnswers, step: number): Record<string, string> {
  if (!Number.isInteger(step) || step < 0 || step >= STEP_LABELS.length) return { form: "El paso solicitado no es válido." };
  const checked = validateAnswers(answers);
  return checked.ok ? {} : Object.fromEntries(Object.entries(checked.errors).filter(([key]) => key === "form" || stepKeys[step].includes(key)));
}

export function validateBriefEdits(input: unknown): ValidationResult<BriefEdits> {
  if (!isRecord(input)) return { ok: false, errors: { form: "Revisa las ediciones del brief." } };
  const errors: Record<string, string> = {};
  const result: BriefEdits = {};
  if (hasExtraKeys(input, fieldKeys)) errors.form = "Las ediciones contienen campos desconocidos.";
  let total = 0;
  for (const [key, value] of Object.entries(input)) {
    if (!fieldKeys.includes(key as BriefField)) continue;
    textValue(value, key, BRIEF_EDIT_LIMIT, errors);
    total += typeof value === "string" ? value.length : 0;
    // Preserve raw drafts and explicit empty edits; clearing a field must not restore it.
    if (typeof value === "string") result[key as BriefField] = value;
  }
  if (total > BRIEF_EDITS_TOTAL_LIMIT) errors.form = `Las ediciones deben sumar como máximo ${BRIEF_EDITS_TOTAL_LIMIT} caracteres.`;
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: result };
}

export function setBriefEdit(edits: BriefEdits, key: BriefField, value: string): BriefEdits {
  const checked = validateBriefEdits({ ...edits, [key]: value });
  if (!checked.ok) throw new Error(Object.values(checked.errors).join(" "));
  return checked.value;
}

function provenance(status: EvidenceStatus, source: string): BriefProvenance { return { status, source }; }

export function buildBrief(answers: AdvisorAnswers, edits: BriefEdits = {}, revision = 1): AdvisorBrief {
  const checked = validateAnswers(answers);
  if (!checked.ok) throw new Error(Object.values(checked.errors).join(" "));
  const checkedEdits = validateBriefEdits(edits);
  if (!checkedEdits.ok) throw new Error(Object.values(checkedEdits.errors).join(" "));
  if (!Number.isSafeInteger(revision) || revision < 1 || revision > 1000000) throw new Error("La revisión del brief no es válida.");
  const a = checked.value;
  const goal = INITIAL_QUESTION.options.find((option) => option.id === a.goalId)!;
  const context = contextQuestion(a.goalId)!;
  const contextOption = context.options.find((option) => option.id === a.contextId)!;
  const priority = FINAL_PRIORITY_QUESTION.options.find((option) => option.id === a.priorityId)!;
  const result = classifyDiagnostic([a.goalId, a.contextId, a.priorityId]);
  const sector = SECTORS.find((item) => item.id === a.sector)!;
  const features = a.features.map((id) => FEATURES.find((item) => item.id === id)!.label);
  const references: UserReference[] = [
    ...a.referenceIds.map((id) => {
      const reference = REFERENCE_LIBRARY.find((item) => item.id === id)!;
      return {
        id, url: normalizeReferenceUrl(reference.url).ok ? new URL(reference.url).href : reference.url,
        likes: `Referencia curada de CÍDIKS: ${reference.title}. Patrones orientativos: ${reference.patterns.join(", ")}. La selección no confirma una preferencia visual.`,
        dislikes: "",
      };
    }),
    ...a.references.map((reference) => ({ ...reference })),
  ];
  const referenceLines = references.map((reference) => {
    const curated = REFERENCE_LIBRARY.find((item) => item.id === reference.id);
    return `- ${curated?.title ?? "Enlace aportado por ti"}: ${reference.url}${!curated && reference.likes ? `\n  Lo que te gusta: ${reference.likes}` : ""}${reference.dislikes ? `\n  Lo que prefieres evitar: ${reference.dislikes}` : ""}`;
  });
  const preferenceLines = [
    ...referenceLines,
    a.likes ? `Elementos que te gustan: ${a.likes}` : "",
    a.dislikes ? `Elementos que prefieres evitar: ${a.dislikes}` : "",
  ].filter(Boolean);
  const constraints = [a.resources ? `Recursos y acciones actuales: ${a.resources}` : "Recursos disponibles: pendiente de confirmar.", a.constraints ? `Restricciones expresadas: ${a.constraints}` : "Restricciones: pendiente de confirmar."].join("\n");
  const pending = [
    !a.audience ? "¿A qué personas quieres atender principalmente?" : "",
    !features.length && !a.featureNotes ? "¿Qué funciones son indispensables y cuáles podrían esperar?" : "",
    !a.resources ? "¿Qué textos, imágenes, identidad y canales tienes disponibles?" : "",
    !a.constraints ? "¿Qué recursos, presupuesto orientativo o limitaciones debemos considerar?" : "",
    !preferenceLines.length ? "¿Qué referencias o preferencias ayudarían a comprender el estilo que buscas?" : "",
    "¿Qué evidencia y condiciones necesitamos revisar contigo antes de definir una solución?",
    "El alcance, la inversión y las fechas quedan pendientes de una conversación; este brief no es una cotización.",
  ].filter(Boolean);
  const fields: Record<BriefField, string> = {
    sector: `${sector.label}. Actividad: ${a.activity}`,
    problem: a.problem,
    objectives: `${goal.label}. Contexto reportado: ${contextOption.label}`,
    audience: a.audience || "Pendiente de confirmar: público objetivo.",
    requestedFeatures: [...features, a.featureNotes].filter(Boolean).join("\n") || "Pendiente de definir: funcionalidades solicitadas.",
    preferences: preferenceLines.length ? `Enlaces seleccionados, sin análisis visual de sus páginas:\n${preferenceLines.join("\n")}` : "Pendiente de confirmar: referencias y preferencias.",
    constraints,
    priorities: `Prioridad expresada por ti: ${priority.label}`,
    confirmedNeeds: `Necesidad expresada por ti: ${goal.label}. Problema reportado: ${a.problem}. Estas respuestas no constituyen una auditoría ni funciones contratadas.`,
    suggestions: `Hipótesis por revisar contigo: ${result.areaTitle}.\nSolución posible: ${result.possibleSolution}\nOportunidad por evaluar: ${result.mainOpportunity}\nFricción por comprobar: ${result.detectedFriction}\nNo son hechos observados en tu negocio ni una garantía de resultados.`,
    pendingQuestions: pending.join("\n"),
    nextStep: `Propuesta para revisar contigo: ${result.recommendedNextStep} Después, conversar con CÍDIKS para contrastar tus respuestas y acordar el alcance.`,
  };
  const ruleSource = `Reglas del diagnóstico a partir de tu objetivo «${goal.label}», tu contexto «${contextOption.label}» y tu prioridad «${priority.label}». Requiere revisión humana.`;
  const sources: Record<BriefField, BriefProvenance> = {
    sector: provenance("confirmed", "Sector y actividad proporcionados por ti; no verificados externamente."),
    problem: provenance("confirmed", "Problema proporcionado por ti; no observado mediante auditoría."),
    objectives: provenance("confirmed", "Objetivo y respuesta de contexto elegidos por ti."),
    audience: provenance(a.audience ? "confirmed" : "pending", a.audience ? "Público proporcionado por ti." : "No se proporcionó público objetivo."),
    requestedFeatures: provenance(features.length || a.featureNotes ? "confirmed" : "pending", "Funciones solicitadas por ti; su alcance y viabilidad siguen pendientes."),
    preferences: provenance(preferenceLines.length ? "confirmed" : "pending", "Selección y notas del visitante. Los enlaces no fueron analizados visualmente."),
    constraints: provenance(a.resources || a.constraints ? "confirmed" : "pending", "Recursos y restricciones proporcionados por ti; ausencias señaladas como pendientes."),
    priorities: provenance("confirmed", "Prioridad de tiempo elegida por ti."),
    confirmedNeeds: provenance("confirmed", "Necesidad expresada en tus respuestas; no derivada de hipótesis ni verificada externamente."),
    suggestions: provenance("suggested", ruleSource),
    pendingQuestions: provenance("pending", "Preguntas sobre datos ausentes y validación humana antes de acordar alcance."),
    nextStep: provenance("suggested", ruleSource),
  };
  for (const [key, value] of Object.entries(checkedEdits.value) as Array<[BriefField, string]>) {
    const field = BRIEF_FIELDS.find((field) => field.key === key)!;
    const blank = !value.trim();
    fields[key] = blank ? `Pendiente de completar: ${field.label.toLowerCase()}.` : value;
    sources[key] = provenance(field.kind === "suggested" ? "suggested" : field.kind === "pending" || blank ? "pending" : "confirmed", `Texto revisado por ti. ${blank ? "El dato se dejó vacío y necesita completarse." : field.kind === "suggested" ? "Sigue siendo una sugerencia, sin compromiso de alcance ni resultados." : field.kind === "pending" ? "Sigue pendiente de confirmar." : "Información proporcionada por ti; no verificada externamente."}`);
  }
  const brief: AdvisorBrief = { schemaVersion: "1.0", revision, mode: "deterministic", area: result.primaryArea, fields, references, provenance: sources };
  const validated = validateBrief(brief);
  if (!validated.ok) throw new Error(Object.values(validated.errors).join(" "));
  return validated.value;
}

/** Protect serialization from malformed objects and preserve suggestion provenance. */
export function validateBrief(input: unknown): ValidationResult<AdvisorBrief> {
  if (!isRecord(input)) return { ok: false, errors: { brief: "El brief no tiene un formato válido." } };
  const errors: Record<string, string> = {};
  if (hasExtraKeys(input, ["schemaVersion", "revision", "mode", "area", "fields", "references", "provenance", "validationErrors"])) errors.brief = "El brief contiene campos desconocidos.";
  if (input.schemaVersion !== "1.0" || input.mode !== "deterministic" || !["presencia", "conversion", "operacion"].includes(String(input.area))) errors.brief = "La versión, el modo o el área del brief no son válidos.";
  if (!Number.isSafeInteger(input.revision) || typeof input.revision !== "number" || input.revision < 1 || input.revision > 1000000) errors.revision = "La revisión del brief no es válida.";
  if (!isRecord(input.fields) || !isRecord(input.provenance)) return { ok: false, errors: { brief: "Faltan los campos o la procedencia del brief." } };
  if (hasExtraKeys(input.fields, fieldKeys) || hasExtraKeys(input.provenance, fieldKeys)) errors.brief = "El brief contiene bloques desconocidos.";
  let fieldTotal = 0;
  for (const field of BRIEF_FIELDS) {
    const value = input.fields[field.key];
    const fieldMax = field.key === "preferences" ? 20000 : field.key === "confirmedNeeds" ? 2000 : BRIEF_EDIT_LIMIT;
    textValue(value, field.key, fieldMax, errors, true);
    if (typeof value === "string") fieldTotal += value.length;
    const source = input.provenance[field.key];
    if (!isRecord(source) || hasExtraKeys(source, ["status", "source"]) || !sourceStatuses.includes(source.status as EvidenceStatus)) errors[field.key] = "Revisa la procedencia del bloque.";
    else {
      textValue(source.source, field.key, 600, errors, true);
      if (field.kind === "suggested" && source.status !== "suggested") errors[field.key] = "Las sugerencias no pueden convertirse en hechos confirmados.";
      if (field.kind === "pending" && source.status !== "pending") errors[field.key] = "Las preguntas pendientes deben mantener su estado.";
    }
  }
  if (fieldTotal > 40000) errors.brief = "El brief supera el límite de longitud.";
  userReferences(input.references, errors, true);
  if (input.validationErrors !== undefined && (!isRecord(input.validationErrors) || Object.values(input.validationErrors).some((value) => typeof value !== "string" || value.length > 600))) errors.brief = "Los errores de validación no tienen un formato válido.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: input as unknown as AdvisorBrief };
}

export function serializeBrief(brief: AdvisorBrief): string {
  const checked = validateBrief(brief);
  if (!checked.ok) throw new Error(Object.values(checked.errors).join(" "));
  const statusLabels: Record<EvidenceStatus, string> = { confirmed: "Proporcionado por ti", inferred: "Inferencia por revisar", suggested: "Sugerencia por validar", pending: "Pendiente" };
  return [
    "Solicitud de orientación · CÍDIKIS IA / CÍDIKS",
    `Brief v${brief.schemaVersion} · revisión ${brief.revision} · reglas locales, sin IA`,
    "La información aportada no fue verificada externamente. Este brief no es una cotización ni un compromiso de alcance, fechas o resultados.",
    "",
    ...BRIEF_FIELDS.flatMap((field) => [`${field.label} (${statusLabels[brief.provenance[field.key].status]}):`, brief.fields[field.key], ""]),
    "Referencias (enlaces recibidos, sin análisis visual):",
    ...(brief.references.length ? brief.references.flatMap((reference, index) => [`${index + 1}. ${reference.url}`, reference.likes ? `Notas: ${reference.likes}` : "", reference.dislikes ? `Evitar: ${reference.dislikes}` : ""].filter(Boolean)) : ["Ninguna referencia añadida."]),
    "",
    "Preparado para revisar y compartir voluntariamente. Abrir WhatsApp no confirma envío ni recepción.",
  ].join("\n");
}
