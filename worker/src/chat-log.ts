/**
 * Una línea de registro por solicitud del chat, para saber si funciona sin guardar
 * nada de lo que escribe la persona: solo categorías fijas, tramos y contadores.
 * Nunca incluir mensaje, respuesta, IP, token de sesión ni requestId.
 */
export type ChatOutcome =
  | 'model_ok' | 'guard_blocked' | 'rule_server' | 'local'
  | 'timeout' | 'provider_failure' | 'finish_failed'
  | 'control_unavailable' | 'invalid_body' | 'auth_session'
  | `ledger_${string}`;

export interface ChatLog {
  evt: 'chat';
  outcome: ChatOutcome;
  model?: string;
  reason?: string;
  stripped?: boolean;
  trimmed?: boolean;
  cut?: boolean;
  latency?: string;
  len?: string;
  hist?: number;
  remaining?: number;
  closed?: boolean;
  /** Si respondió el modelo de respaldo y cómo le fue al principal (ok, timeout, error, empty). */
  fallback?: boolean;
  primary?: string;
  /** Resultado de cada modelo cuando todos fallaron, p. ej. "timeout>error". */
  attempts?: string;
  neurons?: number;
  /** Tokens de entrada que salieron de la caché de Workers AI (0 = no hubo caché). */
  cached?: number;
}

export const latencyBucket = (ms: number) =>
  ms < 1000 ? '<1s' : ms < 3000 ? '1-3s' : ms < 6000 ? '3-6s' : ms < 10000 ? '6-10s' : '>=10s';

export const lengthBucket = (chars: number) =>
  chars < 150 ? '<150' : chars < 300 ? '150-300' : chars < 500 ? '300-500' : '>=500';

export function logChat(entry: ChatLog): void {
  console.log(JSON.stringify(entry));
}
