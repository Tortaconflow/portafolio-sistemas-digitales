import { AI_POLICY, utf8Size } from '../../shared/cidikis-ai-policy.ts';
import { validTurnResponse, type TurnRequest, type TurnResponse } from '../../shared/cidikis-ai-contract.ts';
import { simulateTurn } from '../../shared/simulated-provider.ts';

const LOCAL_ENDPOINT = import.meta.env.VITE_LOCAL_AI_ENDPOINT as string | undefined;
const PROD_AI_ENDPOINT = (import.meta.env.VITE_AI_ENDPOINT as string | undefined) ?? 'https://cidiks-ia-advisor.reilyvica.workers.dev';
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? '0x4AAAAAAGNqNCE4KJ1y0FqT';

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: Record<string, unknown>): string;
      remove(widgetId: string): void;
    };
  }
}

export function localWorkerEndpoint(): string | null {
  if (!LOCAL_ENDPOINT || !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return null;
  try { const url = new URL(LOCAL_ENDPOINT); return url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && !url.username && !url.password ? url.origin : null; } catch { return null; }
}

export function remoteWorkerEndpoint(): string | null {
  if (!['reilycastro.com', 'www.reilycastro.com'].includes(location.hostname)) return null;
  try { const url = new URL(PROD_AI_ENDPOINT); return url.protocol === 'https:' && !url.username && !url.password ? url.origin : null; } catch { return null; }
}

export function activeWorkerEndpoint(): string | null {
  return localWorkerEndpoint() ?? remoteWorkerEndpoint();
}

async function getTurnstileToken(): Promise<string> {
  if (!window.turnstile) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-cidiks-turnstile="1"]');
      if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); existing.addEventListener('error', () => reject(new Error('turnstile_load')), { once: true }); return; }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.cidiksTurnstile = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('turnstile_load'));
      document.head.appendChild(script);
    });
  }
  const container = document.createElement('div');
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'Verificación de seguridad');
  // Invisible por defecto; Turnstile solo se muestra si exige interacción.
  container.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483000;display:none;padding:12px;background:#111;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5)';
  document.body.appendChild(container);
  let widgetId: string | undefined;
  try {
    return await new Promise<string>((resolve, reject) => {
      let timer = setTimeout(() => reject(new Error('turnstile_timeout')), 12000);
      widgetId = window.turnstile!.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        action: 'cidikis_pilot',
        appearance: 'interaction-only',
        'before-interactive-callback': () => {
          container.style.display = 'block';
          clearTimeout(timer);
          timer = setTimeout(() => reject(new Error('turnstile_timeout')), 60000);
        },
        'after-interactive-callback': () => { container.style.display = 'none'; },
        callback: (token: string) => { clearTimeout(timer); resolve(token); },
        'error-callback': () => { clearTimeout(timer); reject(new Error('turnstile_error')); },
        'expired-callback': () => { clearTimeout(timer); reject(new Error('turnstile_expired')); },
      });
    });
  } finally {
    if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    container.remove();
  }
}

export async function bootstrapLocalSession(): Promise<string> {
  const endpoint = activeWorkerEndpoint();
  if (!endpoint) return 'browser-simulation';
  const challenge = localWorkerEndpoint() ? 'local-turnstile-simulation' : await getTurnstileToken();
  const response = await fetch(`${endpoint}/v2/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: '2.0', challenge }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('No pudimos iniciar la sesión del asesor. Puedes usar el diagnóstico guiado.');
  const body = await response.json() as { sessionToken?: string };
  if (!body.sessionToken) throw new Error('La sesión del asesor no es válida.');
  return body.sessionToken;
}
export async function requestLocalTurn(request: TurnRequest, remaining: number): Promise<TurnResponse> {
  const endpoint = activeWorkerEndpoint();
  let response: unknown;
  if (endpoint) {
    const result = await fetch(`${endpoint}/v2/turn`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: AbortSignal.timeout(12000) });
    if (!result.ok) throw new Error(result.status === 429 ? 'Se alcanzó el límite diario o de sesión. El diagnóstico guiado sigue disponible.' : 'No recibimos una respuesta válida. Conservamos tus datos; puedes reintentar manualmente o seguir con las preguntas.');
    const body = await result.text();
    if (utf8Size(body) > AI_POLICY.maxResponseBytes) throw new Error('Respuesta demasiado larga.');
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
  const endpoint = activeWorkerEndpoint();
  if (!endpoint) return 'unknown';
  const result = await fetch(`${endpoint}/v2/request-status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: '2.0', sessionToken: request.sessionToken, requestId: request.requestId }), signal: AbortSignal.timeout(5000) });
  if (!result.ok) return 'unknown';
  const data = await result.json() as { status?: string };
  return ['success', 'failed', 'pending', 'uncertain'].includes(data.status ?? '') ? data.status! : 'unknown';
}

export interface FloatingChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function requestFloatingChat(
  sessionToken: string,
  message: string,
  history: FloatingChatMessage[],
): Promise<{ reply: string; remaining?: number }> {
  const endpoint = activeWorkerEndpoint();
  if (!endpoint) {
    await new Promise(resolve => setTimeout(resolve, 180));
    return {
      reply: 'Estoy en vista local. En reilycastro.com respondo con IA en vivo; mientras tanto puedes probar el diagnóstico rápido de 3 preguntas en /asesor-ia/ o escribir por WhatsApp.',
    };
  }
  const result = await fetch(`${endpoint}/v2/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: '2.0',
      sessionToken,
      requestId: crypto.randomUUID(),
      message,
      history: history.slice(-6),
    }),
    signal: AbortSignal.timeout(14000),
  });
  if (!result.ok) {
    throw new Error(
      result.status === 429
        ? 'Alcanzaste el límite de mensajes por ahora. Puedes usar el diagnóstico rápido (3 preguntas) o escribir por WhatsApp.'
        : 'No pude responder en este momento. Puedes intentar de nuevo o abrir el diagnóstico rápido.',
    );
  }
  const data = await result.json() as { reply?: unknown; remaining?: number };
  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new Error('Recibí una respuesta vacía. Intenta de nuevo o usa el diagnóstico rápido.');
  }
  return { reply: data.reply.trim(), remaining: data.remaining };
}
