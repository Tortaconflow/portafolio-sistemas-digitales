import { FACT_FIELDS, type AdvisorSession, type FactField, type Proposal } from './advisor-session-contract.ts';
import { currentClaim } from './advisor-session.ts';
import { AI_POLICY, safeText, utf8Size } from './cidikis-ai-policy.ts';

export interface TurnContext { profile: Partial<Record<FactField, string>>; recent: { role: 'user' | 'assistant'; text: string }[]; questionField: FactField | null }
export interface TurnRequest {
  version: '2.0'; requestId: string; sessionToken: string; contextRevision: number;
  purpose: 'conversation' | 'guided_guidance' | 'manual_retry'; messageId: string; message: string; context: TurnContext;
}
export interface ProviderResult { text: string; proposals: Proposal[]; questionField: FactField | null; recommendation?: string }
export interface TurnResponse extends ProviderResult {
  version: '2.0'; requestId: string; contextRevision: number; contextHash: string;
  simulated: true; remaining: number;
}
export const uuidPattern = /^[a-zA-Z0-9_-]{8,80}$/;
export function record(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype); }
export function exact(value: Record<string, unknown>, keys: string[]) { return Object.keys(value).every(k => keys.includes(k)); }
export function validContext(value: unknown): value is TurnContext {
  if (!record(value) || !exact(value, ['profile', 'recent', 'questionField']) || !record(value.profile) || !exact(value.profile, [...FACT_FIELDS])) return false;
  if (Object.values(value.profile).some(v => !safeText(v, 1000))) return false;
  if (value.questionField !== null && !FACT_FIELDS.includes(value.questionField as FactField)) return false;
  return Array.isArray(value.recent) && value.recent.length <= 4 && value.recent.every(m => record(m) && exact(m, ['role', 'text']) && ['user', 'assistant'].includes(m.role as string) && safeText(m.text, 2000));
}
export function validTurn(value: unknown): value is TurnRequest {
  if (!record(value) || !exact(value, ['version', 'requestId', 'sessionToken', 'contextRevision', 'purpose', 'messageId', 'message', 'context'])) return false;
  return value.version === '2.0' && typeof value.requestId === 'string' && uuidPattern.test(value.requestId) && typeof value.messageId === 'string' && uuidPattern.test(value.messageId)
    && safeText(value.sessionToken, 400) && Number.isSafeInteger(value.contextRevision) && Number(value.contextRevision) >= 0
    && ['conversation', 'guided_guidance', 'manual_retry'].includes(value.purpose as string)
    && safeText(value.message, AI_POLICY.maxMessageChars) && Boolean(value.message.trim()) && utf8Size(value.message) <= AI_POLICY.maxMessageBytes && validContext(value.context);
}
export function validProviderResult(value: unknown): value is ProviderResult {
  if (!record(value) || !exact(value, ['text', 'proposals', 'questionField', 'recommendation']) || !safeText(value.text, 2000) || !value.text.trim()) return false;
  if (value.recommendation !== undefined && !safeText(value.recommendation, 800)) return false;
  if (value.questionField !== null && !FACT_FIELDS.includes(value.questionField as FactField)) return false;
  return Array.isArray(value.proposals) && value.proposals.length <= 4 && value.proposals.every(p => record(p) && exact(p, ['field', 'value', 'kind', 'quote']) && FACT_FIELDS.includes(p.field as FactField) && safeText(p.value, 1000) && Boolean(p.value.trim()) && ['literal', 'inference'].includes(p.kind as string) && (p.kind !== 'literal' || safeText(p.quote, 1000) && p.quote === p.value));
}
export function validTurnResponse(value: unknown): value is TurnResponse {
  if (!record(value) || !exact(value, ['text', 'proposals', 'questionField', 'recommendation', 'version', 'requestId', 'contextRevision', 'contextHash', 'simulated', 'remaining'])) return false;
  const { version, requestId, contextRevision, contextHash, simulated, remaining, ...provider } = value;
  return version === '2.0' && typeof requestId === 'string' && uuidPattern.test(requestId) && Number.isSafeInteger(contextRevision) && typeof contextHash === 'string' && /^[a-f0-9]{64}$/.test(contextHash) && simulated === true && Number.isInteger(remaining) && Number(remaining) >= 0 && Number(remaining) <= AI_POLICY.maxAttempts && validProviderResult(provider) && utf8Size(JSON.stringify(value)) <= AI_POLICY.maxResponseBytes;
}
export function buildTurnContext(session: AdvisorSession, questionField: FactField | null): TurnContext {
  const profile: TurnContext['profile'] = {};
  for (const field of FACT_FIELDS) { const claim = currentClaim(session, field); if (claim?.value) profile[field] = claim.value; }
  // References, contact data and entire transcripts are deliberately excluded.
  return { profile, recent: session.messages.slice(-4).map(m => ({ role: m.role, text: m.text.slice(0, 2000) })), questionField };
}
