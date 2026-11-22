import { AI_POLICY, utf8Size } from '../../shared/cidikis-ai-policy.ts';
import { validTurnResponse, type TurnRequest, type TurnResponse } from '../../shared/cidikis-ai-contract.ts';
import { simulateTurn } from '../../shared/simulated-provider.ts';
import type { FloatingChatMessage } from '../../shared/floating-chat-guidance.ts';

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

let turnstileLoad: Promise<NonNullable<Window['turnstile']>> | undefined;

function loadTurnstile(): Promise<NonNullable<Window['turnstile']>> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  turnstileLoad ??= new Promise<NonNullable<Window['turnstile']>>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const timer = window.setTimeout(failed, 8_000);

    function cleanup() {
      window.clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
    }

    function failed() {
      cleanup();
      script.remove();
      reject(new Error('turnstile_load'));
    }

    script.onerror = failed;
    script.onload = () => {
      const api = window.turnstile;
      if (!api) {
        failed();
        return;
      }
      cleanup();
      resolve(api);
    };
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    turnstileLoad = undefined;
    throw error;
  });

  return turnstileLoad;
}

async function getTurnstileToken(): Promise<string> {
  const api = await loadTurnstile();
  const container = document.createElement('div');
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-label', 'Verificación de seguridad');
  // Invisible por defecto; Turnstile solo se muestra si exige interacción.
  container.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483000;display:none;padding:12px;background:#111;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5)';
  document.body.appendChild(container);
  let widgetId: string | undefined;
  let timer: number | undefined;
  try {
    return await new Promise<string>((resolve, reject) => {
      const expire = () => reject(new Error('turnstile_timeout'));
      timer = window.setTimeout(expire, 12_000);
      widgetId = api.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        action: 'cidikis_pilot',
        appearance: 'interaction-only',
        size: document.documentElement.clientWidth < 360 ? 'compact' : 'normal',
        'before-interactive-callback': () => {
          container.style.display = 'block';
          window.clearTimeout(timer);
          timer = window.setTimeout(expire, 60_000);
        },
        'after-interactive-callback': () => { container.style.display = 'none'; },
        callback: resolve,
        'error-callback': () => reject(new Error('turnstile_error')),
        'expired-callback': () => reject(new Error('turnstile_expired')),
      });
    });
  } finally {
    window.clearTimeout(timer);
    try {
      if (widgetId) api.remove(widgetId);
    } finally {
      container.remove();
    }
  }
}

export async function bootstrapLocalSession(): Promise<string> {
  const endpoint = activeWorkerEndpoint();
  if (!endpoint) return 'browser-simulation';
  const challenge = localWorkerEndpoint() ? 'local-turnstile-simulation' : await getTurnstileToken().catch(() => {
    throw new FloatingChatError('No pude completar la verificación de seguridad. Puedes reintentar o seguir con la guía.');
  });
  const response = await fetch(`${endpoint}/v2/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: '2.0', challenge }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new FloatingChatError('No pude iniciar la sesión. Puedes reintentar o seguir con la guía.');
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

export class FloatingChatError extends Error {
  constructor(message: string, readonly options: {
    refreshSession?: boolean;
    retryWithNewId?: boolean;
    alreadyAnswered?: boolean;
  } = {}) {
    super(message);
  }
}

export async function requestFloatingChat(
  sessionToken: string,
  message: string,
  history: FloatingChatMessage[],
  requestId: string,
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
      requestId,
      message,
      history: history.slice(-6),
    }),
    signal: AbortSignal.timeout(14000),
  });
  if (!result.ok) {
    const data = await result.json().catch(() => null) as { code?: string; status?: string } | null;
    if (result.status === 401) {
      throw new FloatingChatError('La sesión caducó. Puedes reintentar o seguir con la guía.', { refreshSession: true });
    }
    if (result.status === 429) {
      throw new FloatingChatError('El chat está ocupado o alcanzó su límite. Puedes seguir con la guía.');
    }
    if ((data?.code === 'duplicate' && data.status === 'success') || data?.code === 'unchanged_context') {
      throw new FloatingChatError('La respuesta se generó y se perdió en el camino. Puedes cambiar tu pregunta o seguir con la guía.', { alreadyAnswered: true });
    }
    throw new FloatingChatError('No pude responder en este momento. Puedes reintentar o seguir con la guía.', {
      retryWithNewId: data?.code === 'provider_failure' || (data?.code === 'duplicate' && data.status === 'failed'),
    });
  }
  const data = await result.json() as { reply?: unknown; remaining?: number };
  if (typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new FloatingChatError('La respuesta llegó vacía. Puedes cambiar tu pregunta o seguir con la guía.', { alreadyAnswered: true });
  }
  return { reply: data.reply.trim(), remaining: data.remaining };
}
