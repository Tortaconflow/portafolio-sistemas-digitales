import { AI_POLICY, utf8Size } from '../../shared/cidikis-ai-policy.ts';

export async function digest(secret: string, input: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const hash = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
  return [...new Uint8Array(hash)].map(v => v.toString(16).padStart(2, '0')).join('');
}
export async function issueToken(secret: string): Promise<{ token: string; id: string; expires: number }> {
  const id = crypto.randomUUID(); const expires = Date.now() + AI_POLICY.sessionMs;
  const payload = `${id}.${expires}`;
  return { token: `${payload}.${await digest(secret, `token:${payload}`)}`, id, expires };
}
export async function verifyToken(secret: string, token: string): Promise<string | null> {
  const parts = token.split('.');
  if (parts.length !== 3 || !/^[a-f0-9-]{36}$/.test(parts[0]) || !/^\d{13}$/.test(parts[1]) || !/^[a-f0-9]{64}$/.test(parts[2])) return null;
  const expires = Number(parts[1]); if (expires <= Date.now() || expires > Date.now() + AI_POLICY.sessionMs + 1000) return null;
  const expected = await digest(secret, `token:${parts[0]}.${parts[1]}`);
  let mismatch = 0; for (let i = 0; i < 64; i++) mismatch |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i);
  return mismatch ? null : parts[0];
}
export async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get('content-encoding') || !/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? '')) throw new Error('body');
  const claimed = request.headers.get('content-length');
  if (claimed && (!/^\d+$/.test(claimed) || Number(claimed) > AI_POLICY.maxBodyBytes)) throw new Error('body');
  if (!request.body) throw new Error('body');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > AI_POLICY.maxBodyBytes) { await reader.cancel(); throw new Error('body'); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(all);
  if (utf8Size(text) > AI_POLICY.maxBodyBytes) throw new Error('body');
  return JSON.parse(text);
}
