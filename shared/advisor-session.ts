import { emptyAnswers, BRIEF_FIELDS, SECTORS, FEATURES, type AdvisorAnswers, type BriefEdits } from '../src/advisor/contract.ts';
import { buildBrief, serializeBrief, validateAnswers, validateBriefEdits } from '../src/advisor/model.ts';
import { INITIAL_QUESTION, FINAL_PRIORITY_QUESTION } from '../src/diagnostic.ts';
import { REFERENCE_LIBRARY } from '../src/advisor/references.ts';
import { AI_POLICY, safeText, utf8Size } from './cidikis-ai-policy.ts';
import { FACT_FIELDS, FACT_LABELS, type AdvisorSession, type AdvisorEvent, type Claim, type FactField, type HybridBriefDocument, type DisplayBrief } from './advisor-session-contract.ts';

export function createAdvisorSession(): AdvisorSession {
  return { schemaVersion: '2.0', revision: 0, mode: null, answers: emptyAnswers(), claims: [], contradictions: [], recommendations: [], messages: [], pending: [...FACT_FIELDS], turns: 0 };
}
const answerField: Partial<Record<FactField, keyof AdvisorAnswers>> = { activity: 'activity', audience: 'audience', problem: 'problem', resources: 'resources', constraints: 'constraints', preferences: 'likes' };
export function currentClaim(session: AdvisorSession, field: FactField): Claim | undefined {
  return session.claims.findLast(c => c.field === field && c.status === 'confirmed') ?? session.claims.findLast(c => c.field === field && c.status === 'declared' && c.origin !== 'simulated');
}
function revise(state: AdvisorSession): AdvisorSession {
  return { ...state, revision: state.revision + 1,
    claims: state.claims.map(c => ({ ...c })), contradictions: state.contradictions.map(c => ({ ...c })),
    recommendations: state.recommendations.map(r => ({ ...r, stale: true })) };
}
function addClaim(state: AdvisorSession, field: FactField, value: string, status: Claim['status'], origin: Claim['origin'], evidence?: Claim['evidence']) {
  const old = currentClaim(state, field);
  if (old?.value === value && old.status === status) return;
  const id = `claim-${state.revision}-${state.claims.length}`;
  state.claims.push({ id, field, value, status, origin, evidence, revision: state.revision, ...(status === 'confirmed' ? { confirmedAt: state.revision } : {}) });
  if (origin === 'simulated' && old && old.value !== value && (status === 'inferred' || status === 'declared') && old.status === 'confirmed') {
    state.contradictions.push({ id: `conflict-${id}`, field, previousId: old.id, proposedId: id, resolved: false });
  } else if (origin !== 'simulated' || status === 'confirmed') {
    state.claims = state.claims.map(c => c.field === field && c.id !== id && ['confirmed', 'declared'].includes(c.status) ? { ...c, status: 'superseded' } : c);
  }
}
function invalidateLegacyChoice(state: AdvisorSession, field: FactField, value: string) {
  if (field === 'objective' && state.answers.goalId && INITIAL_QUESTION.options.find(o => o.id === state.answers.goalId)?.label !== value) state.answers = { ...state.answers, goalId: '', contextId: '' };
  if (field === 'priority' && state.answers.priorityId && FINAL_PRIORITY_QUESTION.options.find(o => o.id === state.answers.priorityId)?.label !== value) state.answers = { ...state.answers, priorityId: '' };
}
export function advisorReducer(state: AdvisorSession, event: AdvisorEvent): AdvisorSession {
  if (event.version !== 1 || state.schemaVersion !== '2.0') throw new Error('Versión de estado incompatible.');
  if (event.type === 'mode') return { ...state, mode: event.mode };
  if (event.type === 'reset') return { ...createAdvisorSession(), revision: state.revision + 1, mode: state.mode, turns: state.turns };
  if (event.type === 'guided' && JSON.stringify(state.answers) === JSON.stringify(event.answers) && (!event.confirm || FACT_FIELDS.every(field => {
    const key = answerField[field];
    const value = key ? event.answers[key] : field === 'objective' ? INITIAL_QUESTION.options.find(o => o.id === event.answers.goalId)?.label : field === 'priority' ? FINAL_PRIORITY_QUESTION.options.find(o => o.id === event.answers.priorityId)?.label : '';
    return !value || currentClaim(state, field)?.value === value && currentClaim(state, field)?.status === 'confirmed';
  }))) return state;
  if (event.type === 'attempt') return state.turns >= AI_POLICY.maxAttempts ? state : { ...state, turns: state.turns + 1 };
  if (event.type === 'message') {
    const m = event.message;
    if (!safeText(m.text, m.role === 'user' ? AI_POLICY.maxMessageChars : 4000) || state.messages.some(x => x.id === m.id)) return state;
    const messages = [...state.messages, m].slice(-AI_POLICY.maxTranscriptMessages);
    while (utf8Size(JSON.stringify(messages)) > AI_POLICY.maxTranscriptBytes) messages.shift();
    return { ...state, messages };
  }
  if (event.type === 'proposals' && event.baseRevision !== state.revision) return state;
  const next = revise(state);
  if (event.type === 'guided') {
    next.answers = structuredClone(event.answers);
    for (const field of FACT_FIELDS) {
      const key = answerField[field];
      const value = key ? event.answers[key] : field === 'objective' ? INITIAL_QUESTION.options.find(o => o.id === event.answers.goalId)?.label : field === 'priority' ? FINAL_PRIORITY_QUESTION.options.find(o => o.id === event.answers.priorityId)?.label : '';
      if (typeof value === 'string' && (key && state.answers[key] !== value || field === 'objective' && state.answers.goalId !== event.answers.goalId || field === 'priority' && state.answers.priorityId !== event.answers.priorityId || event.confirm && value)) {
        addClaim(next, field, value, event.confirm ? 'confirmed' : 'declared', 'guided');
        if (key && state.answers[key] !== value) {
          next.claims = next.claims.map(c => c.field === field && c.origin === 'simulated' && ['inferred', 'declared'].includes(c.status) ? { ...c, status: 'superseded' } : c);
          next.contradictions.forEach(c => { if (c.field === field) c.resolved = true; });
        }
      }
    }
  } else if (event.type === 'proposals') {
    const message = state.messages.find(m => m.id === event.messageId && m.role === 'user');
    if (!message) return state;
    for (const p of event.proposals.slice(0, 4)) {
      if (!FACT_FIELDS.includes(p.field) || !safeText(p.value, 1000) || !p.value.trim()) continue;
      if (p.kind === 'literal' && (!p.quote || p.quote !== p.value || !message.text.includes(p.quote))) continue;
      // Extracted text remains a proposal; only a visitor action can confirm it.
      const old = currentClaim(next, p.field);
      if (old?.value === p.value || next.claims.some(c => c.field === p.field && c.value === p.value && ['inferred', 'declared'].includes(c.status))) continue;
      addClaim(next, p.field, p.value, p.kind === 'literal' ? 'declared' : 'inferred', 'simulated', p.quote ? { messageId: message.id, quote: p.quote } : undefined);
    }
    const rootConfirmed = (['activity','problem','objective'] as const).every(field => currentClaim(next, field)?.status === 'confirmed');
    if (event.recommendation && safeText(event.recommendation, 800) && rootConfirmed && !next.contradictions.some(c => !c.resolved)) {
      next.recommendations.push({ id: `rec-${next.revision}`, text: event.recommendation, dependencies: next.claims.filter(c => c.status === 'confirmed').map(c => c.id), accepted: false, stale: false, origin: 'simulated' });
    }
  } else if (event.type === 'confirm' || event.type === 'reject') {
    const target = next.claims.find(c => c.id === event.id);
    if (!target || !['inferred', 'declared'].includes(target.status)) return state;
    if (event.type === 'reject') target.status = 'rejected';
    else {
      next.claims = next.claims.map(c => c.field === target.field && c.id !== target.id && ['confirmed', 'declared', 'inferred'].includes(c.status) ? { ...c, status: 'superseded' } : c);
      target.status = 'confirmed'; target.confirmedAt = next.revision;
      invalidateLegacyChoice(next, target.field, target.value);
      const key = answerField[target.field];
      if (key && typeof next.answers[key] === 'string') {
        const limits: Partial<Record<FactField, number>> = { activity: 250, audience: 400, problem: 1200, resources: 600, constraints: 800, preferences: 600 };
        if (target.value.length <= (limits[target.field] ?? 1000)) next.answers = { ...next.answers, [key]: target.value };
      }
    }
    next.contradictions.forEach(c => { if (c.proposedId === target.id) c.resolved = true; });
  } else if (event.type === 'correct') {
    if (!FACT_FIELDS.includes(event.field) || !safeText(event.value, 1000)) return state;
    addClaim(next, event.field, event.value.trim(), 'confirmed', 'visitor');
    invalidateLegacyChoice(next, event.field, event.value.trim());
    const key = answerField[event.field];
    if (key) next.answers = { ...next.answers, [key]: event.value.trim() };
    next.contradictions.forEach(c => { if (c.field === event.field) c.resolved = true; });
    next.claims = next.claims.map(c => c.field === event.field && c.origin === 'simulated' && ['inferred', 'declared'].includes(c.status) ? { ...c, status: 'superseded' } : c);
  } else if (event.type === 'recommendation') {
    const rec = next.recommendations.find(r => r.id === event.id);
    if (!rec || state.recommendations.find(r => r.id === event.id)?.stale) return state;
    next.recommendations = state.recommendations.map(r => r.id === event.id ? { ...r, accepted: event.accepted } : { ...r });
  }
  next.pending = FACT_FIELDS.filter(f => !currentClaim(next, f)?.value);
  // Bound local history without discarding active or conflict evidence.
  if (next.claims.length > 160) next.claims = next.claims.filter(c => !['superseded', 'rejected'].includes(c.status)).slice(-160);
  return next;
}

export function projectHybridBrief(session: AdvisorSession, edits: BriefEdits = {}, revision = 1): HybridBriefDocument {
  if (!Number.isSafeInteger(revision) || revision < 1 || revision > 1000000) throw new Error('La revisión del brief no es válida.');
  const validEdits = validateBriefEdits(edits);
  if (!validEdits.ok) throw new Error(Object.values(validEdits.errors).join(' '));
  const validated = validateAnswers(session.answers);
  const legacy = validated.ok ? buildBrief(validated.value, {}, revision) : undefined;
  const references = legacy?.references ?? [...REFERENCE_LIBRARY.filter(r => session.answers.referenceIds.includes(r.id)).map(r => ({ id: r.id, url: r.url, likes: `Referencia curada: ${r.title}. Patrones orientativos: ${r.patterns.join(', ')}. La selección no confirma una preferencia visual.`, dislikes: '' })), ...session.answers.references];
  const fields = Object.fromEntries(BRIEF_FIELDS.map(f => [f.key, legacy?.fields[f.key] ?? 'Pendiente de conocer.'])) as HybridBriefDocument['fields'];
  const provenance = Object.fromEntries(BRIEF_FIELDS.map(f => [f.key, legacy?.provenance[f.key] ?? { status: 'pending', source: 'Información insuficiente; sin clasificación forzada.' }])) as HybridBriefDocument['provenance'];
  const set = (key: typeof BRIEF_FIELDS[number]['key'], facts: FactField[]) => {
    const claims = facts.map(f => currentClaim(session, f)).filter((c): c is Claim => Boolean(c?.value));
    if (!claims.length) return;
    fields[key] = claims.map(c => c.value).join('\n');
    provenance[key] = { status: claims.every(c => c.status === 'confirmed') ? 'confirmed' : 'inferred', source: claims.map(c => `${c.status === 'confirmed' ? 'Confirmado' : 'Declarado'} por visitante · origen ${c.origin}`).join('; ') };
  };
  // Preserve exact v1 output when no chat or review corrections are involved.
  const hybridFacts = session.claims.some(c => c.origin !== 'guided' && ['confirmed', 'declared'].includes(c.status));
  if (!legacy || hybridFacts) {
    set('sector', ['activity']); set('problem', ['problem']); set('objectives', ['objective']); set('audience', ['audience']);
    set('preferences', ['preferences']); set('constraints', ['resources', 'constraints']); set('priorities', ['priority']);
    set('confirmedNeeds', ['problem', 'objective']);
    const channels = currentClaim(session, 'channels');
    if (channels?.value) {
      const label = channels.status === 'confirmed' ? 'confirmados' : 'declarados, sin confirmar';
      fields.confirmedNeeds = [fields.confirmedNeeds === 'Pendiente de conocer.' ? '' : fields.confirmedNeeds,
        `Canales actuales (${label}): ${channels.value}`].filter(Boolean).join('\n');
      provenance.confirmedNeeds = { status: channels.status === 'confirmed' && provenance.confirmedNeeds.status !== 'inferred' ? 'confirmed' : 'inferred',
        source: `${provenance.confirmedNeeds.source}; canales ${label} por visitante · origen ${channels.origin}` };
    }
    if (!legacy) fields.sector = [SECTORS.find(s => s.id === session.answers.sector)?.label, fields.sector].filter(Boolean).join('\n');
  }
  if (!legacy || hybridFacts) {
    const preferenceContext = [session.answers.dislikes ? `Evitar: ${session.answers.dislikes}` : '', ...references.map(r => [r.url, r.likes ? `Interesa: ${r.likes}` : '', r.dislikes ? `Evitar: ${r.dislikes}` : ''].filter(Boolean).join('\n'))].filter(Boolean).join('\n');
    if (preferenceContext) { const preference = currentClaim(session, 'preferences'); fields.preferences = [preference?.value, preferenceContext].filter(Boolean).join('\n'); provenance.preferences = { status: preference && preference.status !== 'confirmed' ? 'inferred' : 'confirmed', source: `${preference ? provenance.preferences.source + '; ' : ''}Enlaces y preferencias del visitante; sin análisis visual.` }; }
    if (!legacy && (session.answers.features.length || session.answers.featureNotes)) {
      fields.requestedFeatures = [...session.answers.features.map(id => FEATURES.find(f => f.id === id)?.label), session.answers.featureNotes].filter(Boolean).join('\n');
      provenance.requestedFeatures = { status: 'confirmed', source: 'Funciones solicitadas en el formulario; viabilidad pendiente.' };
    }
  }
  const confirmed = session.claims.filter(c => c.status === 'confirmed');
  const recs = session.recommendations.filter(r => r.accepted && !r.stale && r.dependencies.every(id => confirmed.some(c => c.id === id)));
  if (recs.length) { fields.suggestions = [fields.suggestions === 'Pendiente de conocer.' ? '' : fields.suggestions, ...recs.map(r => `[Simulación local; sugerencia por validar] ${r.text}`)].filter(Boolean).join('\n'); provenance.suggestions = { status: 'suggested', source: 'Simulación aceptada para revisar; no es una necesidad confirmada.' }; }
  if (!legacy) fields.nextStep = 'Revisar el contexto y confirmar los datos pendientes antes de definir una solución.';
  const pending = session.pending.map(f => `Por conocer: ${FACT_LABELS[f].toLowerCase()}.`);
  const conflicts = session.contradictions.filter(c => !c.resolved).map(c => `Contradicción por resolver: ${FACT_LABELS[c.field].toLowerCase()}. Se conserva el dato confirmado.`);
  const proposals = [...new Set(session.claims.filter(c => c.origin === 'simulated' && ['inferred', 'declared'].includes(c.status)).map(c => `Interpretación sin confirmar: ${FACT_LABELS[c.field].toLowerCase()}. Revisar antes de considerarla un dato.`))];
  if (!legacy || conflicts.length || proposals.length) fields.pendingQuestions = [legacy?.fields.pendingQuestions, ...pending, ...conflicts, ...proposals].filter(Boolean).join('\n') || 'Sin preguntas pendientes registradas.';
  for (const [key, value] of Object.entries(validEdits.value)) {
    const field = key as keyof typeof fields;
    fields[field] = value.trim() ? value : 'Pendiente de confirmar (bloque retirado por el visitante).';
    provenance[field] = { status: !value.trim() ? 'pending' : ['suggestions', 'nextStep'].includes(field) ? 'suggested' : field === 'pendingQuestions' ? 'pending' : 'confirmed', source: 'Edición manual del visitante; no verificación externa.' };
  }
  return { schemaVersion: '2.0', revision, contextRevision: session.revision, mode: 'hybrid', area: legacy?.area ?? 'unknown', fields, provenance, references, legacyBrief: legacy };
}
export function semanticSignature(session: AdvisorSession): string {
  return JSON.stringify({ answers: session.answers, claims: session.claims.filter(c => ['confirmed', 'declared', 'inferred'].includes(c.status)), conflicts: session.contradictions.filter(c => !c.resolved), recommendations: session.recommendations.filter(r => r.accepted && !r.stale) });
}
export function serializeDisplayBrief(brief: DisplayBrief): string {
  if (brief.mode === 'deterministic') return serializeBrief(brief);
  return ['CÍDIKIS · Brief híbrido v0.2 · Simulación local, sin IA conectada', `Revisión ${brief.revision}`, 'Información aportada sin verificación externa. Las sugerencias no son una cotización ni un compromiso de resultados.', '', ...BRIEF_FIELDS.flatMap(f => [`${f.label} (${{ confirmed: 'Aportado o confirmado por ti', inferred: 'Declaración o inferencia por revisar', suggested: 'Sugerencia por validar', pending: 'Pendiente' }[brief.provenance[f.key].status]}):`, brief.fields[f.key], '']), 'Referencias recibidas, sin análisis visual:', ...brief.references.map(r => [r.url, r.likes ? `Interesa: ${r.likes}` : '', r.dislikes ? `Evitar: ${r.dislikes}` : ''].filter(Boolean).join('\n')), 'Preparado para compartir voluntariamente. Abrir WhatsApp no confirma envío ni recepción.'].join('\n');
}
