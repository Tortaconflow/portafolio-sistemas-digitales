import { AI_POLICY, utf8Size } from '../../shared/cidikis-ai-policy.ts';
import { validTurnResponse, type TurnRequest, type TurnResponse } from '../../shared/cidikis-ai-contract.ts';
import { simulateTurn } from '../../shared/simulated-provider.ts';

const LOCAL_ENDPOINT = import.meta.env.VITE_LOCAL_AI_ENDPOINT as string | undefined;
export function localWorkerEndpoint(): string | null {
  if (!LOCAL_ENDPOINT || !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return null;
  try { const url = new URL(LOCAL_ENDPOINT); return url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && !url.username && !url.password ? url.origin : null; } catch { return null; }
}
export async function bootstrapLocalSession(): Promise<string> {
  const endpoint = localWorkerEndpoint();
  if (!endpoint) return 'browser-simulation';
  const response = await fetch(`${endpoint}/v2/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: '2.0', challenge: 'local-turnstile-simulation' }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('No pudimos iniciar la simulación local. Puedes usar el diagnóstico guiado.');
  const body = await response.json() as { sessionToken?: string };
  if (!body.sessionToken) throw new Error('La sesión local no es válida.');
  return body.sessionToken;
}
export async function requestLocalTurn(request: TurnRequest, remaining: number): Promise<TurnResponse> {
  const endpoint = localWorkerEndpoint();
  let response: unknown;
  if (endpoint) {
    const result = await fetch(`${endpoint}/v2/turn`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: AbortSignal.timeout(12000) });
    if (!result.ok) throw new Error(result.status === 429 ? 'Se alcanzó un límite de la sesión o del presupuesto local. El diagnóstico guiado sigue disponible.' : 'No recibimos una respuesta válida. Conservamos tus datos; puedes reintentar manualmente o seguir con las preguntas.');
    const body = await result.text();
    if (utf8Size(body) > AI_POLICY.maxResponseBytes) throw new Error('Respuesta local demasiado larga.');
    response = JSON.parse(body);
  } else {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(request.context) + request.message));
    const contextHash = [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, '0')).join('');
    response = { ...simulateTurn(request), version: '2.0', requestId: request.requestId, contextRevision: request.contextRevision, contextHash, simulated: true, remaining };
    // Give assistive technology a real loading state, without a provider call.
    await new Promise(resolve => setTimeout(resolve, 180));
  }
  if (!validTurnResponse(response) || response.requestId !== request.requestId || response.contextRevision !== request.contextRevision) throw new Error('La respuesta no coincide con este turno. Se conservaron tus datos.');
  return response;
}
export async function requestLocalStatus(request: TurnRequest): Promise<string> {
  const endpoint = localWorkerEndpoint();
  if (!endpoint) return 'unknown';
  const result = await fetch(`${endpoint}/v2/request-status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: '2.0', sessionToken: request.sessionToken, requestId: request.requestId }), signal: AbortSignal.timeout(5000) });
  if (!result.ok) return 'unknown';
  const data = await result.json() as { status?: string };
  return ['success', 'failed', 'pending', 'uncertain'].includes(data.status ?? '') ? data.status! : 'unknown';
}
