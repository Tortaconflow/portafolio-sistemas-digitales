/** Provisional, local-only policy. Not a verified Cloudflare spending ceiling. */
export const SINGLE_CAMPAIGN = 'v02-llama-single-1' as const;
export const SINGLE_POLICY = Object.freeze({campaign:SINGLE_CAMPAIGN,model:'@cf/meta/llama-3.3-70b-instruct-fp8-fast',attempts:1,reservation:400,verifiedProviderCeiling:false});
// Fixed, non-renewable rehearsal IDs. Never spend the future real permission.
export const SINGLE_TRIALS = Object.freeze({success:'v02-single-trial-success-1',timeout:'v02-single-trial-timeout-1'} as const);
export type SingleCampaign = typeof SINGLE_CAMPAIGN | typeof SINGLE_TRIALS[keyof typeof SINGLE_TRIALS];
export const isSingleCampaign=(value:unknown):value is SingleCampaign=>value===SINGLE_CAMPAIGN||value===SINGLE_TRIALS.success||value===SINGLE_TRIALS.timeout;
