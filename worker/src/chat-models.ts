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
      return { raw, text, model, attempts, neurons };
    } catch (error) {
      attempts.push({ model, outcome: error instanceof Error && error.message === 'timeout' ? 'timeout' : 'error', ms: now() - started });
    }
  }
  throw new ChainError(attempts);
}
