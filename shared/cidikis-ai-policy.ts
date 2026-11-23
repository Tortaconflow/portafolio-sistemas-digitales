export const AI_POLICY = Object.freeze({
  version: '2.0', maxAttempts: 8, sessionMs: 60 * 60 * 1000,
  maxMessageChars: 1000, maxMessageBytes: 2000, maxTranscriptMessages: 24,
  maxTranscriptBytes: 65536, maxBodyBytes: 24576, maxResponseBytes: 12288,
  maxInputTokens: 4096, maxOutputTokens: 1024, reservationNeurons: 190,
  // Chat flotante. Se reserva el peor caso (Gemma ~28 + respaldo Llama ~19) y al
  // terminar se cobra lo que Workers AI reporta (~12 por respuesta medido).
  chatReservationNeurons: 50,
  chatMaxAttempts: 20,
  // Modelo principal y respaldo: 6 s + 4 s quedan por debajo de los 14 s del navegador.
  // Medido 2026-11-23: Gemma suele responder en 1-2 s, pero en horas de carga la mitad
  // pasó de 8 s; Llama 8B respondió en menos de 1 s en casi todos los casos.
  chatPrimaryTimeoutMs: 6000,
  // Lo que se cobra por cada modelo que no respondió (no hay dato real de su gasto).
  chatFailedAttemptNeurons: 20,
  chatFallbackTimeoutMs: 4000,
  // El tope diario de neurons es el que protege el costo; la concurrencia solo evita ráfagas.
  dailyNeurons: 8000, globalConcurrency: 10, providerTimeoutMs: 10000,
});
export const utf8Size = (value: string) => new TextEncoder().encode(value).length;
export const safeText = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
