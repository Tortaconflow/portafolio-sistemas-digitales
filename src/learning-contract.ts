/** Contrato futuro interno. Este sitio no almacena ni envía registros comerciales. */
export type EvidenceStatus = "observed" | "reported" | "hypothesis" | "pending";
export type CommercialStage =
  | "inquiry_received"
  | "diagnosis"
  | "proposal"
  | "demo"
  | "follow_up"
  | "closed_won"
  | "closed_lost";
export interface LearningRecord {
  id: string; // Identificador opaco; los datos de contacto van en el CRM privado.
  projectId?: string;
  stage: CommercialStage;
  sector: string;
  question: string;
  evidence: { status: EvidenceStatus; reference: string; reviewedAt: string }[];
  hypothesis: string;
  decision: string;
  expectedSignal: string;
  baseline: {
    value: number | null;
    unit: string;
    sampleSize: number | null;
    period: string;
  };
  outcome: {
    value: number | null;
    sampleSize: number | null;
    period: string;
    caveats: string;
  };
  economics: {
    revenueMxn: number | null;
    directCostMxn: number | null;
    humanHours: number | null;
    deliveryDays: number | null;
    reworkHours: number | null;
    satisfactionScore: number | null;
    satisfactionScale: string;
  };
  objections: string[];
  learning: string;
  nextReview: string;
}
