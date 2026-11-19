import type { AdvisorAnswers, AdvisorBrief, BriefField, BriefProvenance } from '../src/advisor/contract.ts';

export const FACT_FIELDS = ['activity', 'audience', 'problem', 'objective', 'channels', 'resources', 'constraints', 'preferences', 'priority'] as const;
export const FACT_LABELS = { activity: 'Actividad', audience: 'Público', problem: 'Problema', objective: 'Objetivo', channels: 'Canales actuales', resources: 'Recursos', constraints: 'Restricciones', preferences: 'Preferencias', priority: 'Prioridad' } as const;
export type FactField = typeof FACT_FIELDS[number];
export type Origin = 'guided' | 'visitor' | 'simulated';
export interface Claim {
  id: string; field: FactField; value: string;
  status: 'declared' | 'confirmed' | 'inferred' | 'rejected' | 'superseded';
  origin: Origin; evidence?: { messageId: string; quote: string };
  revision: number; confirmedAt?: number;
}
export interface Contradiction { id: string; field: FactField; previousId: string; proposedId: string; resolved: boolean }
export interface Recommendation { id: string; text: string; dependencies: string[]; accepted: boolean; stale: boolean; origin: 'simulated' }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; text: string; simulated: boolean }
export interface AdvisorSession {
  schemaVersion: '2.0'; revision: number; mode: 'guided' | 'chat' | null;
  answers: AdvisorAnswers; claims: Claim[]; contradictions: Contradiction[];
  recommendations: Recommendation[]; messages: ChatMessage[];
  pending: FactField[]; turns: number;
}
export interface Proposal { field: FactField; value: string; kind: 'literal' | 'inference'; quote?: string }
export interface HybridBriefDocument {
  schemaVersion: '2.0'; revision: number; contextRevision: number; mode: 'hybrid';
  area: AdvisorBrief['area'] | 'unknown'; fields: Record<BriefField, string>;
  provenance: Record<BriefField, BriefProvenance>; references: AdvisorBrief['references'];
  legacyBrief?: AdvisorBrief;
}
export type DisplayBrief = AdvisorBrief | HybridBriefDocument;
export type AdvisorEvent =
  | { version: 1; type: 'mode'; mode: 'guided' | 'chat' }
  | { version: 1; type: 'guided'; answers: AdvisorAnswers; confirm?: boolean }
  | { version: 1; type: 'proposals'; proposals: Proposal[]; messageId: string; baseRevision: number; recommendation?: string }
  | { version: 1; type: 'confirm'; id: string }
  | { version: 1; type: 'reject'; id: string }
  | { version: 1; type: 'correct'; field: FactField; value: string }
  | { version: 1; type: 'recommendation'; id: string; accepted: boolean }
  | { version: 1; type: 'message'; message: ChatMessage }
  | { version: 1; type: 'attempt' }
  | { version: 1; type: 'reset' };
