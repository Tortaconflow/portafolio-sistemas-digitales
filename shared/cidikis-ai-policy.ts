export const AI_POLICY = Object.freeze({
  version: '2.0', maxAttempts: 8, sessionMs: 60 * 60 * 1000,
  maxMessageChars: 1000, maxMessageBytes: 2000, maxTranscriptMessages: 24,
  maxTranscriptBytes: 65536, maxBodyBytes: 24576, maxResponseBytes: 12288,
  maxInputTokens: 4096, maxOutputTokens: 1024, reservationNeurons: 190,
  dailyNeurons: 8000, globalConcurrency: 2, providerTimeoutMs: 10000,
});
export const utf8Size = (value: string) => new TextEncoder().encode(value).length;
export const safeText = (value: unknown, max: number): value is string =>
  typeof value === 'string' && value.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
