export interface ChallengeResult { success: boolean; hostname?: string; action?: string; challenge_ts?: string }
export interface SiteVerifier { verify(token: string): Promise<ChallengeResult> }
export function validChallenge(result: ChallengeResult, hostname: string): boolean {
  const time = Date.parse(result.challenge_ts ?? '');
  return result.success === true && result.hostname === hostname && result.action === 'cidikis_pilot'
    && Number.isFinite(time) && time <= Date.now() + 1000 && time > Date.now() - 300000;
}
/** Server-side only. Local tests inject transport; remote lab uses native fetch. */
export class CloudflareSiteVerifier implements SiteVerifier {
  constructor(private secret: string, private transport: typeof fetch) {}
  async verify(token: string): Promise<ChallengeResult> {
    const response = await this.transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect:'manual', signal:AbortSignal.timeout(8000),headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: this.secret, response: token }) });
    if (!response.ok) throw new Error('siteverify_unavailable');
    if(!response.body)throw Error('siteverify_contract');
    const reader=response.body.getReader();let size=0;const chunks:Uint8Array[]=[];
    try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();throw Error('siteverify_size');}chunks.push(value);}}finally{reader.releaseLock();}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const result: unknown = JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes));
    if (!result || typeof result !== 'object' || typeof (result as ChallengeResult).success !== 'boolean') throw new Error('siteverify_contract');
    return result as ChallengeResult;
  }
}
export class SimulatedSiteVerifier implements SiteVerifier {
  constructor(private fault = '') {}
  async verify(token: string): Promise<ChallengeResult> {
    if (this.fault === 'network') throw new Error('siteverify_fixture_network');
    return { success: token.startsWith('fixture-pass-') && this.fault !== 'invalid',
      hostname: this.fault === 'hostname' ? 'evil.example' : '127.0.0.1',
      action: this.fault === 'action' ? 'another_action' : 'cidikis_pilot',
      challenge_ts: new Date(Date.now() - (this.fault === 'expired' ? 300001 : 0)).toISOString() };
  }
}
