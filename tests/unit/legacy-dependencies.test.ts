import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_QUESTION, CONTEXT_QUESTIONS, FINAL_PRIORITY_QUESTION } from '../../src/diagnostic.ts';
import { emptyAnswers } from '../../src/advisor/contract.ts';
import { advisorReducer, createAdvisorSession, projectHybridBrief } from '../../shared/advisor-session.ts';

test('a confirmed conversational objective correction invalidates old deterministic goal/context IDs', () => {
  const goal = INITIAL_QUESTION.options[0];
  const answers = { ...emptyAnswers(), sector: 'servicios', activity: 'Barbería', problem: 'Perdemos consultas', goalId: goal.id, contextId: CONTEXT_QUESTIONS[goal.contextQuestionKey!].options[0].id, priorityId: FINAL_PRIORITY_QUESTION.options[0].id };
  let s = advisorReducer(createAdvisorSession(), { version: 1, type: 'guided', answers, confirm: true });
  assert.ok(projectHybridBrief(s).legacyBrief);
  s = advisorReducer(s, { version: 1, type: 'correct', field: 'objective', value: 'Necesito organizar la capacidad antes de atraer más personas' });
  assert.equal(s.answers.goalId, ''); assert.equal(s.answers.contextId, '');
  assert.equal(projectHybridBrief(s).area, 'unknown'); assert.equal(projectHybridBrief(s).legacyBrief, undefined);
  assert.equal(projectHybridBrief(s).fields.objectives, 'Necesito organizar la capacidad antes de atraer más personas');
});

test('literal yes cannot confirm a fact or infer an unexplained feature', async () => {
  const { simulateTurn } = await import('../../shared/simulated-provider.ts');
  const result = simulateTurn({ version: '2.0', requestId: 'request-one', sessionToken: 'browser-simulation', contextRevision: 0, purpose: 'conversation', messageId: 'message-one', message: 'sí', context: { profile: { activity: 'Barbería' }, recent: [], questionField: 'problem' } });
  assert.equal(result.proposals.length, 0); assert.equal(result.recommendation, undefined);
});
