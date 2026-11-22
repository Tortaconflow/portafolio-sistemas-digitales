import { simulateTurn } from '../../shared/simulated-provider.ts';
import type { ProviderResult, TurnRequest } from '../../shared/cidikis-ai-contract.ts';

export interface AdvisorProvider { turn(request: TurnRequest): Promise<ProviderResult> }
export class SimulatedProvider implements AdvisorProvider {
  constructor(private delayMs = 120, private fault = '') {}
  async turn(request: TurnRequest): Promise<ProviderResult> {
    await new Promise(resolve => setTimeout(resolve, this.delayMs));
    if (this.fault === 'failure') throw new Error('local_fixture_failure');
    if (this.fault === 'invalid') return { text: '', proposals: [], questionField: null };
    return simulateTurn(request);
  }
}
// The prepared CloudflareAdvisorProvider is exercised by an explicit local fixture
// transport only. A verified complete-token gate and remote approval remain required.
