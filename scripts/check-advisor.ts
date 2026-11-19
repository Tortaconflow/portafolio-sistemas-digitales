import assert from "node:assert/strict";
import { INITIAL_QUESTION, FINAL_PRIORITY_QUESTION, classifyDiagnostic } from "../src/diagnostic.ts";
import { REFERENCE_LIBRARY } from "../src/advisor/references.ts";
import {
  ANSWER_LIMITS, BRIEF_EDIT_LIMIT, BRIEF_FIELDS, FEATURES, SECTORS, STEP_LABELS,
  buildBrief, contextQuestion, emptyAnswers, normalizeReferenceUrl, serializeBrief,
  setBriefEdit, updateAnswer, validateAnswers, validateBrief, validateBriefEdits, validateStep,
  type AdvisorAnswers, type BriefField, type UserReference,
} from "../src/advisor/model.ts";

let assertions = 0;
function check(condition: unknown, message: string): asserts condition {
  assertions++;
  assert.ok(condition, message);
}
function validAnswers(overrides: Partial<AdvisorAnswers> = {}): AdvisorAnswers {
  return {
    ...emptyAnswers(), sector: "comercio", activity: "Vendo textiles por pedido.",
    problem: "Los clientes preguntan lo mismo y necesito ordenar la información.",
    goalId: "mas_clientes", contextId: "preguntan_pero_no_cierran", priorityId: "resolver_pronto",
    ...overrides,
  };
}
function reference(id: string, url = "https://example.com/", overrides: Partial<UserReference> = {}): UserReference {
  return { id, url, likes: "Me gusta que expliquen las opciones.", dislikes: "Evitar demasiados pasos.", ...overrides };
}

check(STEP_LABELS.length === 5, "Five guided steps are present");
check(SECTORS.map((sector) => sector.id).join(",") === "comercio,servicios,turismo,alimentos,profesional,otro", "Sector IDs remain stable");
check(BRIEF_FIELDS.length === 12 && new Set(BRIEF_FIELDS.map((field) => field.key)).size === 12, "All twelve unique brief fields are present");
check(emptyAnswers() !== emptyAnswers() && emptyAnswers().references !== emptyAnswers().references, "Empty sessions do not share mutable arrays");
check(validateAnswers(validAnswers()).ok, "A complete required path validates");
check(!validateAnswers(emptyAnswers()).ok, "An empty session cannot produce a brief");
check(Object.keys(validateStep(emptyAnswers(), 0)).sort().join(",") === "activity,sector", "Only this step's required fields block step zero");
check(!Object.keys(validateStep(emptyAnswers(), 2)).length, "References remain optional");
check(!Object.keys(validateStep(emptyAnswers(), 3)).length, "Context remains optional");
check(validateStep(validAnswers(), -1).form && validateStep(validAnswers(), 0.5).form && validateStep(validAnswers(), 5).form, "Invalid step indexes are rejected");

// Exhaust every legitimate goal, its context options, and both visitor priorities.
let paths = 0;
for (const goal of INITIAL_QUESTION.options) {
  const context = contextQuestion(goal.id);
  check(context, `Existing context question for ${goal.id}`);
  for (const option of context.options) {
    for (const priority of FINAL_PRIORITY_QUESTION.options) {
      const answers = validAnswers({ goalId: goal.id, contextId: option.id, priorityId: priority.id });
      const checked = validateAnswers(answers);
      check(checked.ok, `Legitimate path: ${goal.id}/${option.id}/${priority.id}`);
      const brief = buildBrief(answers);
      const original = classifyDiagnostic([goal.id, option.id, priority.id]);
      check(brief.area === original.primaryArea, "The strict adapter preserves the existing classifier result");
      check(brief.fields.priorities.includes(priority.label), "Visitor priority is used instead of classifier urgency");
      check(brief.provenance.suggestions.status === "suggested", "Recommendations remain suggestions on every path");
      check(brief.provenance.confirmedNeeds.status === "confirmed" && !brief.fields.confirmedNeeds.includes(original.currentSituation), "Generic classifier situation is never a confirmed need");
      check(Object.keys(brief.fields).length === 12 && Object.keys(brief.provenance).length === 12, "Every path includes complete fields and provenance");
      paths++;
    }
  }
}
check(paths >= 40, "All goal/context/priority combinations were exercised");
check(buildBrief(validAnswers({ goalId: "lanzar_idea", contextId: "validando_con_personas" })).area === "presencia", "A tied score retains the original deterministic order");
check(buildBrief(validAnswers({ goalId: "reservas", contextId: "sin_calendario_registro", priorityId: "armar_con_calma" })).area === "operacion", "An operation-heavy reservation path is supported");

for (const bad of [null, [], "answers", { ...validAnswers(), injected: true }])
  check(!validateAnswers(bad).ok, "Unknown or malformed answer objects fail validation");
for (const key of ["sector", "activity", "problem", "goalId", "contextId", "priorityId"] as const) {
  check(!validateAnswers({ ...validAnswers(), [key]: "   " }).ok, `Whitespace-only ${key} rejected`);
}
for (const key of ["sector", "goalId", "contextId", "priorityId"] as const)
  check(!validateAnswers({ ...validAnswers(), [key]: "unknown-id" }).ok, `Unknown ${key} rejected`);
check(!validateAnswers(validAnswers({ goalId: "google", contextId: "preguntan_pero_no_cierran" })).ok, "A context from another goal is rejected");
check(!contextQuestion("unknown-id"), "Unknown goal has no fallback context");
check(!validateAnswers(validAnswers({ features: [FEATURES[0].id, FEATURES[0].id] })).ok, "Repeated feature IDs rejected");
check(!validateAnswers(validAnswers({ features: ["unknown-feature"] })).ok, "Unknown features rejected");
check(!validateAnswers({ ...validAnswers(), features: "catalogo" }).ok, "Feature list must be an array");
check(!validateAnswers({ ...validAnswers(), audience: 15 }).ok, "Free-text fields are not coerced from other types");
check(!validateAnswers({ ...validAnswers(), problem: "texto\u0000invalido" }).ok, "Nonprinting control characters rejected");
for (const key of Object.keys(ANSWER_LIMITS) as Array<keyof typeof ANSWER_LIMITS>)
  check(!validateAnswers({ ...validAnswers(), [key]: "x".repeat(ANSWER_LIMITS[key] + 1) }).ok, `${key} has a runtime length bound`);
check(validateAnswers(validAnswers({ activity: " x ", problem: " y " })).ok, "Legitimate surrounding whitespace can be normalized");

const beforeChange = validAnswers();
const afterChange = updateAnswer(beforeChange, "goalId", "google");
check(afterChange.contextId === "" && beforeChange.contextId === "preguntan_pero_no_cierran", "Changing goal invalidates dependent context without mutation");
check(updateAnswer(beforeChange, "goalId", beforeChange.goalId).contextId === beforeChange.contextId, "Selecting the same goal retains its context");
check(!validateAnswers(afterChange).ok, "An invalidated path cannot silently reuse its old diagnosis");
check(!validateStep(afterChange, 0).contextId && Boolean(validateStep(afterChange, 1).contextId), "Invalidated context blocks the diagnosis step");

for (const badUrl of [
  "", "/relative", "http://example.com", "javascript:alert(1)", "data:text/html,test",
  "https://name:password@example.com", "https://localhost", "https://localhost./",
  "https://shop.local/", "https://intranet.internal/", "https://singlehost/",
  "https://127.0.0.1/", "https://127.1/", "https://2130706433/", "https://0x7f000001/",
  "https://10.1.2.3/", "https://172.16.0.1/", "https://172.31.1.1/", "https://192.168.1.1/",
  "https://169.254.1.1/", "https://100.64.0.1/", "https://198.18.0.1/", "https://224.0.0.1/",
  "https://[::1]/", "https://[fc00::1]/", "https://[fe80::1]/",
  "https://example.com\n/path", "https://example.com\\@localhost/", "https://example.com/has space",
  `https://example.com/${"x".repeat(2048)}`,
]) check(!normalizeReferenceUrl(badUrl).ok, `Unsafe reference rejected: ${badUrl.slice(0, 70)}`);
const normalized = normalizeReferenceUrl("  HTTPS://EXAMPLE.COM:443/reference#section  ");
check(normalized.ok && normalized.url === "https://example.com/reference#section", "Public HTTPS reference canonicalized safely");
check(normalizeReferenceUrl("https://1.1.1.1/").ok, "Public IPv4 reference permitted");
check(normalizeReferenceUrl("https://172.32.0.1/").ok, "Public IPv4 does not match a private subnet");
check(normalizeReferenceUrl("https://例え.jp/").ok, "International public domains supported");

check(REFERENCE_LIBRARY.length >= 1, "A curated library exists");
for (const item of REFERENCE_LIBRARY) check(normalizeReferenceUrl(item.url).ok, `Curated reference URL valid: ${item.id}`);
check(!validateAnswers(validAnswers({ referenceIds: ["unknown-reference"] })).ok, "Unknown curated reference rejected");
check(!validateAnswers(validAnswers({ referenceIds: [REFERENCE_LIBRARY[0].id, REFERENCE_LIBRARY[0].id] })).ok, "Repeated curated IDs rejected");
check(!validateAnswers(validAnswers({ references: [reference("first"), reference("second")] })).ok, "Repeated normalized visitor URLs rejected");
check(!validateAnswers(validAnswers({ references: [reference("same", "https://example.com/1"), reference("same", "https://example.com/2")] })).ok, "Repeated visitor IDs rejected");
check(!validateAnswers(validAnswers({ references: [reference(REFERENCE_LIBRARY[0].id)] })).ok, "Visitor IDs cannot impersonate curated references");
check(!validateAnswers(validAnswers({ references: [reference("bad-id!")] })).ok, "Malformed visitor ID rejected");
check(!validateAnswers(validAnswers({ references: [reference("long-note", "https://example.com/", { likes: "x".repeat(601) })] })).ok, "Reference notes bounded");
check(!validateAnswers({ ...validAnswers(), references: [{ ...reference("first"), html: "<iframe>" }] }).ok, "Unexpected reference properties rejected");
check(!validateAnswers(validAnswers({ referenceIds: [REFERENCE_LIBRARY[0].id], references: [reference("duplicate-curated", REFERENCE_LIBRARY[0].url)] })).ok, "Visitor URL cannot duplicate selected curated URL");
const five = Array.from({ length: 5 }, (_, index) => reference(`visitor-${index}`, `https://example.com/${index}`));
check(validateAnswers(validAnswers({ references: five })).ok, "Five visitor references permitted");
check(!validateAnswers(validAnswers({ references: [...five, reference("sixth", "https://example.com/6")] })).ok, "Six visitor references rejected");
check(!validateAnswers(validAnswers({ references: five, referenceIds: [REFERENCE_LIBRARY[0].id] })).ok, "The combined curated and visitor limit is enforced");

const minimalBrief = buildBrief(validAnswers());
for (const key of ["audience", "requestedFeatures", "preferences", "constraints"] as BriefField[])
  check(minimalBrief.provenance[key].status === "pending" && /pendiente/i.test(minimalBrief.fields[key]), `Absent optional ${key} remains explicit and pending`);
check(minimalBrief.fields.pendingQuestions.includes("público") || minimalBrief.fields.pendingQuestions.includes("personas"), "Pending questions address missing audience");
check(minimalBrief.fields.pendingQuestions.includes("no es una cotización"), "No definitive quote generated");
check(minimalBrief.provenance.suggestions.source.includes("Conseguir más clientes"), "Rule provenance identifies its inputs in understandable language");
check(!/\$\d|MXN|garantiz(?:a|amos)\s+ventas/i.test(minimalBrief.fields.suggestions), "Rules do not invent prices or sales guarantees");
const completeBrief = buildBrief(validAnswers({
  audience: "Personas que buscan textiles hechos a mano.", features: [FEATURES[0].id], featureNotes: "Catálogo bilingüe por revisar.",
  resources: "Tengo fotografías propias.", constraints: "Necesito poder editar el catálogo.",
  referenceIds: [REFERENCE_LIBRARY[0].id], references: [reference("visitor-example")], likes: "Prefiero información clara.", dislikes: "Evitar texto demasiado pequeño.",
}));
check(completeBrief.references.length === 2 && completeBrief.references[1].id === "visitor-example", "Curated and visitor references both reach the brief");
check(completeBrief.references[0].likes.includes("curada") && completeBrief.references[0].likes.includes("no confirma"), "Curatorial patterns are not promoted to visitor preferences");
check(completeBrief.fields.preferences.includes("sin análisis visual"), "Reference limitations remain explicit");
check(completeBrief.fields.requestedFeatures.includes(FEATURES[0].label), "Explicit feature requests are preserved");
check(completeBrief.fields.constraints.includes("Tengo fotografías propias"), "Resources reach the commercial brief");
check(completeBrief.provenance.audience.status === "confirmed", "A supplied audience is reported as provided, not externally audited");
check(validateBrief(completeBrief).ok, "Generated brief passes independent runtime validation");

const edits = setBriefEdit({}, "audience", "Personas de Oaxaca.");
const editedBrief = buildBrief(validAnswers(), edits, 2);
check(editedBrief.fields.audience === "Personas de Oaxaca." && editedBrief.provenance.audience.status === "confirmed", "A visitor edit can fill an absent supplied field");
check(editedBrief.revision === 2 && editedBrief.provenance.audience.source.includes("revisado por ti"), "Revision and edited provenance are preserved");
const editedSuggestion = buildBrief(validAnswers(), setBriefEdit({}, "suggestions", "Revisar un catálogo antes de construir."));
check(editedSuggestion.provenance.suggestions.status === "suggested", "Editing a suggestion never confirms it");
check(buildBrief(validAnswers(), setBriefEdit({}, "pendingQuestions", "¿Qué evidencia falta?")).provenance.pendingQuestions.status === "pending", "Editing a pending question retains pending status");
const cleared = setBriefEdit(edits, "audience", "  ");
check(Object.hasOwn(cleared, "audience") && cleared.audience === "  ", "An explicit empty edit is preserved instead of restoring generated context");
const clearedBrief = buildBrief(validAnswers({ audience: "Antes existía este público." }), cleared);
check(clearedBrief.provenance.audience.status === "pending" && !clearedBrief.fields.audience.includes("Antes existía"), "Clearing a provided block leaves an explicit pending datum");
check(buildBrief(validAnswers(), { suggestions: "" }).provenance.suggestions.status === "suggested", "Even a cleared suggestion retains its non-confirmed status");
check(setBriefEdit({}, "audience", "Texto con espacio ").audience === "Texto con espacio ", "Trailing whitespace survives draft validation");
check(buildBrief(validAnswers(), { audience: "Texto con espacio " }).fields.audience.endsWith(" "), "Applying a valid raw edit preserves trailing whitespace");
check(!validateBriefEdits({ unknown: "text" }).ok && !validateBriefEdits([]).ok && !validateBriefEdits({ problem: 42 }).ok, "Edit structure is validated strictly");
check(!validateBriefEdits({ problem: "x".repeat(BRIEF_EDIT_LIMIT + 1) }).ok, "Every edit has a bound");
check(!validateBriefEdits(Object.fromEntries(BRIEF_FIELDS.map((field) => [field.key, "x".repeat(1100)]))).ok, "Combined edit bound enforced");
assert.throws(() => setBriefEdit({}, "problem", "x".repeat(BRIEF_EDIT_LIMIT + 1)));
assert.throws(() => buildBrief(emptyAnswers()));
for (const revision of [0, -1, 0.5, NaN, Infinity, 1000001]) assert.throws(() => buildBrief(validAnswers(), {}, revision));
assert.throws(() => buildBrief(validAnswers(), { unknown: "text" } as never));
// UI owns the approval to regenerate after changing answers; rebuilding without edits resets stale text.
check(buildBrief(validAnswers({ audience: "Nuevo público." }), {}, 3).fields.audience === "Nuevo público.", "Fresh answers plus cleared edits invalidate prior overrides");

check(!validateBrief({ ...completeBrief, fields: { ...completeBrief.fields, unknown: "text" } }).ok, "Unknown serialized brief field rejected");
check(!validateBrief({ ...completeBrief, mode: "ai" }).ok, "This phase cannot claim an AI-generated brief");
check(!validateBrief({ ...completeBrief, provenance: { ...completeBrief.provenance, suggestions: { status: "confirmed", source: "changed" } } }).ok, "Suggestion cannot be forged into a confirmed claim");
check(!validateBrief({ ...completeBrief, fields: { ...completeBrief.fields, problem: "" } }).ok, "Blank brief blocks rejected");
check(!validateBrief({ ...completeBrief, references: [reference("unsafe", "javascript:alert(1)")] }).ok, "Serialization revalidates reference links");

// Strings remain plain text; they never become HTML or executable attributes in the model.
const literal = '<img src=x onerror="alert(1)"> & </textarea><script>alert(2)</script>';
const plainBrief = buildBrief(validAnswers({ problem: literal, likes: literal }));
const serialized = serializeBrief(plainBrief);
check(plainBrief.fields.problem === literal && serialized.includes(literal), "Markup-shaped input remains literal plain text for React and URL encoding");
const encoded = encodeURIComponent(serialized);
check(!encoded.includes("<script>") && encoded.includes("%3Cscript%3E"), "Plain-text brief is safely encodable for the voluntary channel handoff");
const decoded = decodeURIComponent(encoded);
check(decoded === serialized, "Encoding preserves accents, newlines and visitor text");
check(serialized.includes("sin IA") && serialized.includes("no confirma envío ni recepción"), "Shared text preserves mode and handoff semantics");
check(serializeBrief(completeBrief).includes(REFERENCE_LIBRARY[0].url) && serializeBrief(completeBrief).includes("https://example.com/"), "All references survive serialization");

console.log(`OK: advisor domain, ${paths} deterministic paths and ${assertions} meaningful validation/provenance checks; no network or AI used.`);
