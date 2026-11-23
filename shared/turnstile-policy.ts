/**
 * Política del cliente para Cloudflare Turnstile.
 *
 * Contexto: los errores 300* y 600* ("fallo genérico del desafío") y 110600,
 * 110620 y 200500 son reintentables según la documentación de Cloudflare, y el
 * widget reintenta solo (retry: 'auto'). Rechazar al primer error-callback
 * cancelaba ese reintento y dejaba el chat sin abrir.
 */
export const TURNSTILE_POLICY = Object.freeze({
  /** Tiempo para descargar api.js (antes 8 s: fallaba en conexiones lentas). */
  scriptLoadMs: 20_000,
  /** Tiempo para obtener un token sin interacción visible. */
  silentMs: 30_000,
  /** Tiempo para que la persona marque la casilla cuando se muestra. */
  interactiveMs: 90_000,
  /** Pausa entre reintentos automáticos del widget (Cloudflare: 8 s por defecto). */
  retryIntervalMs: 3_000,
  /** Errores reintentables tolerados antes de rendirse. */
  maxRetryableErrors: 3,
});

/** Códigos con "Retry: No" en la documentación: reintentar no los arregla. */
const FATAL_CODES = new Set(['110100', '110110', '110200', '200100', '400020', '400021', '400070']);

export function isFatalTurnstileError(code: unknown): boolean {
  return FATAL_CODES.has(String(code ?? ''));
}

export type TurnstileFailure = 'load' | 'config' | 'blocked' | 'timeout';

const MESSAGES: Record<TurnstileFailure, string> = {
  load: 'No pude cargar la verificación de seguridad. Puede ser tu conexión o un bloqueador. Puedes reintentar, seguir con la guía o escribirnos por WhatsApp.',
  config: 'La verificación de seguridad no está disponible en este momento. Puedes seguir con la guía o escribirnos por WhatsApp.',
  blocked: 'No pude confirmar que eres una persona. Toca «Reintentar» o abre esta página en Chrome o Safari; también puedes seguir con la guía.',
  timeout: 'La verificación tardó demasiado. Puedes reintentar o seguir con la guía.',
};

export const turnstileFailureMessage = (failure: TurnstileFailure): string => MESSAGES[failure];

export class TurnstileError extends Error {
  // Campos explícitos: Node (strip-types) no admite propiedades en el constructor.
  readonly failure: TurnstileFailure;
  readonly code: string | undefined;
  constructor(failure: TurnstileFailure, code?: string) {
    super(`turnstile_${failure}`);
    this.failure = failure;
    this.code = code;
  }
}

/**
 * Cuenta errores del widget. Devuelve la falla definitiva, o null si conviene
 * dejar que Turnstile reintente por su cuenta.
 */
export function createErrorTracker(max: number = TURNSTILE_POLICY.maxRetryableErrors) {
  let retryable = 0;
  return (code: unknown): TurnstileError | null => {
    const text = String(code ?? '');
    if (isFatalTurnstileError(text)) return new TurnstileError('config', text);
    retryable += 1;
    return retryable >= max ? new TurnstileError('blocked', text) : null;
  };
}
