import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advisorReducer, createAdvisorSession, currentClaim, projectHybridBrief, serializeDisplayBrief } from '../../shared/advisor-session.ts';
import { buildBrief, emptyAnswers, validateBrief } from '../../src/advisor/model.ts';
import { simulateTurn } from '../../shared/simulated-provider.ts';
import { buildTurnContext, validTurn, validProviderResult, validTurnResponse, type TurnRequest } from '../../shared/cidikis-ai-contract.ts';
import { BRIEF_FIELDS } from '../../src/advisor/contract.ts';
import { AI_POLICY } from '../../shared/cidikis-ai-policy.ts';

test('v1 contract and deterministic output stay unchanged under hybrid projection', () => {
  const answers = { ...emptyAnswers(), sector: 'servicios', activity: 'Barbería', problem: 'Perdemos consultas', goalId: 'organizar_clientes', contextId: 'olvido_seguimiento', priorityId: 'bases_solidas' };
  // Use the actual existing identifiers, independent of fixture assumptions.
  return import('../../src/diagnostic.ts').then(({ INITIAL_QUESTION, CONTEXT_QUESTIONS, FINAL_PRIORITY_QUESTION }) => {
    answers.goalId = INITIAL_QUESTION.options[0].id;
    answers.contextId = CONTEXT_QUESTIONS[INITIAL_QUESTION.options[0].contextQuestionKey!].options[0].id;
    answers.priorityId = FINAL_PRIORITY_QUESTION.options[0].id;
    const old = buildBrief(answers);
    const state = advisorReducer(createAdvisorSession(), { version: 1, type: 'guided', answers, confirm: true });
    const next = projectHybridBrief(state);
    assert.deepEqual(next.fields, old.fields); assert.deepEqual(next.legacyBrief, old);
    assert.ok(validateBrief(old).ok); assert.equal(next.schemaVersion, '2.0');
  });
});

test('declarations, literal evidence, confirmation, contradiction and correction retain provenance', () => {
  let s = advisorReducer(createAdvisorSession(), { version: 1, type: 'correct', field: 'activity', value: 'Barbería' });
  s = advisorReducer(s, { version: 1, type: 'message', message: { id: 'message-one', role: 'user', text: 'Ahora tengo un estudio de tatuajes', simulated: false } });
  const before = s.revision;
  s = advisorReducer(s, { version: 1, type: 'proposals', messageId: 'message-one', baseRevision: before, proposals: [{ field: 'activity', value: 'estudio de tatuajes', quote: 'estudio de tatuajes', kind: 'literal' }] });
  assert.equal(currentClaim(s, 'activity')?.value, 'Barbería'); assert.equal(s.contradictions.filter(c => !c.resolved).length, 1);
  assert.equal(projectHybridBrief(s).fields.sector.includes('Barbería'), true);
  const claim = s.claims.at(-1)!;
  s = advisorReducer(s, { version: 1, type: 'confirm', id: claim.id });
  assert.equal(currentClaim(s, 'activity')?.value, 'estudio de tatuajes'); assert.equal(currentClaim(s, 'activity')?.origin, 'simulated');
  assert.equal(s.contradictions.some(c => !c.resolved), false);
  s = advisorReducer(s, { version: 1, type: 'correct', field: 'activity', value: 'Tatuajes personalizados' });
  assert.equal(currentClaim(s, 'activity')?.origin, 'visitor');
  assert.ok(s.claims.some(c => c.value === 'Barbería' && c.status === 'superseded'));
});

test('fabricated quotes, unknown fields, stale response and rejected interpretations never become confirmed', () => {
  let s = advisorReducer(createAdvisorSession(), { version: 1, type: 'message', message: { id: 'message-one', role: 'user', text: 'Tengo una idea', simulated: false } });
  s = advisorReducer(s, { version: 1, type: 'proposals', messageId: 'message-one', baseRevision: 0, proposals: [{ field: 'activity', value: 'Barbería', quote: 'Barbería', kind: 'literal' }] });
  assert.equal(s.claims.length, 0);
  s = advisorReducer(s, { version: 1, type: 'proposals', messageId: 'message-one', baseRevision: s.revision, proposals: [{ field: 'activity', value: 'Negocio sin definir', kind: 'inference' }] });
  const claim = s.claims[0];
  const edited = advisorReducer(s, { version: 1, type: 'correct', field: 'problem', value: 'Quiero validar demanda' });
  assert.deepEqual(advisorReducer(edited, { version: 1, type: 'proposals', messageId: 'message-one', baseRevision: s.revision, proposals: [{ field: 'problem', value: 'otra cosa', kind: 'inference' }] }), edited);
  s = advisorReducer(s, { version: 1, type: 'reject', id: claim.id }); assert.equal(currentClaim(s, 'activity'), undefined);
  assert.equal(projectHybridBrief(s).area, 'unknown'); assert.equal(projectHybridBrief(s).legacyBrief, undefined);
});

for (const [name, opening] of [['barbería', 'Tengo una barbería y quiero conseguir más clientes, pero no sé qué necesito'], ['tatuajes', 'Tengo un estudio de tatuajes y quiero organizar citas'], ['turismo', 'Ofrezco recorridos en Oaxaca y quiero recibir más reservas'], ['información incompleta', 'Tengo una idea, pero no sé cómo empezar']]) {
  test(`multi-turn fixture: ${name}, transitions and one editable twelve-block brief`, () => {
    let s = createAdvisorSession(); let questionField: TurnRequest['context']['questionField'] = null;
    for (const [index, text] of [opening, 'Nos contactan por WhatsApp e Instagram', 'Se pierden consultas cuando tardamos en responder', 'Atendemos a visitantes y clientes de la zona', 'Solo tenemos dos horas por semana'].entries()) {
      const id = `message-${index}`;
      const request: TurnRequest = { version: '2.0', requestId: `request-${index}`, sessionToken: 'browser-simulation', contextRevision: s.revision, messageId: id, purpose: 'conversation', message: text, context: buildTurnContext(s, questionField) };
      assert.ok(validTurn(request)); const result = simulateTurn(request); assert.ok(validProviderResult(result));
      if (!index) assert.equal(result.recommendation, undefined);
      s = advisorReducer(s, { version: 1, type: 'message', message: { id, role: 'user', text, simulated: false } });
      s = advisorReducer(s, { version: 1, type: 'proposals', proposals: result.proposals, messageId: id, baseRevision: s.revision });
      for (const claim of [...s.claims].filter(c => c.origin === 'simulated' && ['inferred','declared'].includes(c.status))) s = advisorReducer(s, { version: 1, type: 'confirm', id: claim.id });
      questionField = result.questionField;
    }
    const facts = s.claims.filter(c => c.status === 'confirmed');
    for (const mode of ['guided', 'chat', 'guided'] as const) s = advisorReducer(s, { version: 1, type: 'mode', mode });
    assert.deepEqual(s.claims.filter(c => c.status === 'confirmed'), facts);
    const brief = projectHybridBrief(s); assert.equal(Object.keys(brief.fields).length, 12);
    assert.equal(brief.area, 'unknown'); assert.ok(brief.fields.sector.includes(opening.split(/[,.;]| y quiero| pero /i)[0]));
    const edited = projectHybridBrief(s, { problem: 'Una corrección manual con espacios finales ', suggestions: 'Una sugerencia revisada' });
    assert.equal(edited.fields.problem, 'Una corrección manual con espacios finales ');
    assert.equal(edited.provenance.suggestions.status, 'suggested');
    assert.ok(serializeDisplayBrief(edited).includes('Simulación local'));
    assert.throws(() => projectHybridBrief(s, { problem: 'x'.repeat(1801) }));
  });
}

test('recommendations remain suggestions and become stale after corrections', () => {
  let s = advisorReducer(createAdvisorSession(), { version: 1, type: 'correct', field: 'problem', value: 'Perdemos consultas' });
  s = advisorReducer(s, { version: 1, type: 'correct', field: 'activity', value: 'Barbería' });
  s = advisorReducer(s, { version: 1, type: 'correct', field: 'objective', value: 'Atender mejor las consultas' });
  s = advisorReducer(s, { version: 1, type: 'message', message: { id: 'message-one', text: 'Tengo una barbería', role: 'user', simulated: false } });
  s = advisorReducer(s, { version: 1, type: 'proposals', messageId: 'message-one', baseRevision: s.revision, proposals: [], recommendation: 'Revisar el proceso' });
  s = advisorReducer(s, { version: 1, type: 'recommendation', id: s.recommendations[0].id, accepted: true });
  assert.equal(projectHybridBrief(s).provenance.suggestions.status, 'suggested');
  assert.ok(projectHybridBrief(s).fields.suggestions.includes('Revisar el proceso'));
  s = advisorReducer(s, { version: 1, type: 'correct', field: 'problem', value: 'Falta capacidad para atender' });
  assert.equal(s.recommendations[0].stale, true); assert.equal(projectHybridBrief(s).fields.suggestions.includes('Revisar el proceso'), false);
});

test('memory limits, shared attempt pool, strict response contract and no forced legacy IDs', () => {
  let s = createAdvisorSession();
  for (let i = 0; i < 40; i++) s = advisorReducer(s, { version: 1, type: 'message', message: { id: `message-${i}`, text: 'idea', role: 'user', simulated: false } });
  assert.equal(s.messages.length, AI_POLICY.maxTranscriptMessages);
  for (let i = 0; i < 15; i++) { s = advisorReducer(s, { version: 1, type: 'attempt' }); s = advisorReducer(s, { version: 1, type: 'mode', mode: i % 2 ? 'guided' : 'chat' }); }
  assert.equal(s.turns, 8); assert.equal(s.answers.goalId, '');
  assert.equal(validProviderResult({ text: 'hola', proposals: [], questionField: null, confirm: true }), false);
  assert.equal(validTurnResponse({ text: 'hola', proposals: [], questionField: null, simulated: false }), false);
  const brief = projectHybridBrief(s); for (const block of BRIEF_FIELDS) assert.ok(brief.fields[block.key]);
  assert.throws(() => advisorReducer(s, { version: 2, type: 'attempt' } as never));
});

test('reset removes messages, references and confirmed claims while retaining the shared turn budget', () => {
  let s = advisorReducer(createAdvisorSession(), { version: 1, type: 'correct', field: 'activity', value: 'Barbería' });
  s = advisorReducer(s, { version: 1, type: 'attempt' });
  s = advisorReducer(s, { version: 1, type: 'message', message: { id: 'message-one', text: 'Una idea privada', role: 'user', simulated: false } });
  const reset = advisorReducer(s, { version: 1, type: 'reset' });
  assert.equal(reset.turns, 1); assert.equal(reset.claims.length, 0); assert.equal(reset.messages.length, 0); assert.deepEqual(reset.answers, emptyAnswers());
});

test('partial hybrid brief keeps curated references, visitor notes and requested features', () => {
  return import('../../src/advisor/references.ts').then(({ REFERENCE_LIBRARY }) => {
    const answers = { ...emptyAnswers(), referenceIds: [REFERENCE_LIBRARY[0].id], references: [{ id: 'visitor-1', url: 'https://example.com/', likes: 'Claridad', dislikes: 'Animaciones' }], likes: 'Fotografías propias', dislikes: 'Colores saturados', features: ['seguimiento'] };
    const s = advisorReducer(createAdvisorSession(), { version: 1, type: 'guided', answers });
    const brief = projectHybridBrief(s); assert.equal(brief.references.length, 2);
    assert.ok(brief.fields.preferences.includes('Claridad')); assert.ok(brief.fields.preferences.includes('Colores saturados'));
    assert.ok(brief.fields.requestedFeatures.includes('Ordenar el seguimiento'));
    assert.ok(serializeDisplayBrief(brief).includes('Animaciones'));
    assert.throws(() => projectHybridBrief(s, {}, 0));
  });
});
