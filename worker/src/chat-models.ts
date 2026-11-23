import { utf8Size } from '../../shared/cidikis-ai-policy.ts';
import { chatModelInput, extractChatText } from '../../shared/chat-prompt.ts';
import type { FloatingChatMessage } from '../../shared/floating-chat-guidance.ts';

/**
 * Cadena de modelos del chat: si el principal tarda o falla, responde el de
 * respaldo en vez de mostrarle un error a la persona. Sin imports de Workers
 * para poder probarla con modelos simulados (tests/unit/chat-quality.test.ts).
 */

export type RunModel = (model: string, input: Record<string, unknown>) => Promise<unknown>;
export type ModelStep = { model: string; timeoutMs: number };
export type AttemptOutcome = 'ok' | 'timeout' | 'error' | 'empty';
export type ModelAttempt = { model: string; outcome: AttemptOutcome; ms: number };

export interface ChainResult {
  raw: unknown;
  text: string;
  model: string;
  attempts: ModelAttempt[];
  /**
   * Neurons a cobrar: lo que reportó el modelo que respondió más una estimación por
   * cada intento anterior que no respondió. Sin dato de uso queda undefined y se
   * conserva la reserva.
   */
  neurons?: number;
  /** Tokens de entrada que Workers AI tomó de su caché (se cobran a la mitad en Gemma 4). */
  cachedTokens?: number;
}

/**
 * Las instrucciones del chat (~1,200 tokens) son casi todo el costo de cada mensaje y
 * son iguales para todos. Workers AI reutiliza ese inicio si la petición llega a la
 * misma instancia del modelo, y la cabecera `x-session-affinity` lo pide así. Medido
 * el 2026-11-23 con Gemma 4: 13.3 → 7.7 neurons por respuesta, también con mensajes
 * distintos. Se reparte en pocas llaves para no cargar una sola instancia; cada sesión
 * usa siempre la misma, así su historial también se reutiliza. La llave no identifica
 * a nadie: solo lleva la versión del prompt y un número del 0 al slots-1.
 */
export const CHAT_AFFINITY_SLOTS = 4;

export function chatAffinityKey(sessionDigest: string, promptVersion: string, slots = CHAT_AFFINITY_SLOTS): string {
  const value = Number.parseInt(sessionDigest.slice(0, 8), 16);
  const slot = Number.isFinite(value) ? value % slots : 0;
  return `cidiks-${promptVersion}-${slot}`;
}

export class ChainError extends Error {
  // Campo explícito: Node (strip-types) no admite propiedades en el constructor.
  readonly attempts: ModelAttempt[];
  constructor(attempts: ModelAttempt[]) {
    super(attempts.every(attempt => attempt.outcome === 'timeout') ? 'timeout' : 'provider');
    this.attempts = attempts;
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms); }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export function usageNeurons(raw: unknown): number | undefined {
  const neurons = (raw as { usage?: { neurons?: unknown } } | null)?.usage?.neurons;
  return typeof neurons === 'number' && Number.isFinite(neurons) ? neurons : undefined;
}

export function usageCachedTokens(raw: unknown): number | undefined {
  const cached = (raw as { usage?: { prompt_tokens_details?: { cached_tokens?: unknown } } } | null)
    ?.usage?.prompt_tokens_details?.cached_tokens;
  return typeof cached === 'number' && Number.isFinite(cached) ? cached : undefined;
}

export async function runChatChain(
  run: RunModel,
  steps: readonly ModelStep[],
  history: readonly FloatingChatMessage[],
  message: string,
  failedAttemptNeurons = 20,
  now: () => number = Date.now,
): Promise<ChainResult> {
  const attempts: ModelAttempt[] = [];
  for (const { model, timeoutMs } of steps) {
    const started = now();
    try {
      const raw = await withTimeout(run(model, chatModelInput(model, history, message)), timeoutMs);
      const text = extractChatText(raw);
      if (!text || utf8Size(text) > 2500) {
        attempts.push({ model, outcome: 'empty', ms: now() - started });
        continue;
      }
      attempts.push({ model, outcome: 'ok', ms: now() - started });
      const used = usageNeurons(raw);
      const neurons = used === undefined ? undefined : used + failedAttemptNeurons * (attempts.length - 1);
      return { raw, text, model, attempts, neurons, cachedTokens: usageCachedTokens(raw) };
    } catch (error) {
      attempts.push({ model, outcome: error instanceof Error && error.message === 'timeout' ? 'timeout' : 'error', ms: now() - started });
    }
  }
  throw new ChainError(attempts);
}
