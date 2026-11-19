import type { DiagnosticArea } from "../diagnostic.ts";

/** The advisor is local and deterministic. This contract contains no customer storage. */
export interface UserReference {
  id: string;
  url: string;
  likes: string;
  dislikes: string;
}

export interface AdvisorAnswers {
  sector: string;
  activity: string;
  audience: string;
  problem: string;
  goalId: string;
  contextId: string;
  priorityId: string;
  features: string[];
  featureNotes: string;
  resources: string;
  constraints: string;
  referenceIds: string[];
  references: UserReference[];
  likes: string;
  dislikes: string;
}

export const SECTORS = [
  { id: "comercio", label: "Comercio y productos" },
  { id: "servicios", label: "Servicios por cita o cotización" },
  { id: "turismo", label: "Turismo, hospedaje y experiencias" },
  { id: "alimentos", label: "Restaurantes, cafeterías y alimentos" },
  { id: "profesional", label: "Servicios profesionales" },
  { id: "otro", label: "Otra actividad o proyecto" },
] as const;

export const FEATURES = [
  { id: "presentacion", label: "Explicar mi oferta y presentar el negocio" },
  { id: "catalogo", label: "Mostrar productos o servicios en un catálogo" },
  { id: "reservas", label: "Organizar solicitudes de citas o reservas" },
  { id: "cotizacion", label: "Preparar consultas o solicitudes de cotización" },
  { id: "seguimiento", label: "Ordenar el seguimiento de consultas" },
  { id: "preguntas-frecuentes", label: "Responder dudas frecuentes con claridad" },
] as const;

export const STEP_LABELS = ["Negocio", "Diagnóstico", "Referencias", "Contexto", "Tu brief"] as const;

export const ANSWER_LIMITS = {
  sector: 30,
  activity: 250,
  audience: 400,
  problem: 1200,
  goalId: 100,
  contextId: 100,
  priorityId: 100,
  featureNotes: 800,
  resources: 600,
  constraints: 800,
  likes: 600,
  dislikes: 600,
} as const;
export const REFERENCE_LIMIT = 5;
export const REFERENCE_URL_LIMIT = 2048;
export const REFERENCE_NOTE_LIMIT = 600;
export const BRIEF_EDIT_LIMIT = 1800;
export const BRIEF_EDITS_TOTAL_LIMIT = 12000;

export const BRIEF_FIELDS = [
  { key: "sector", label: "Sector y actividad", kind: "provided" },
  { key: "problem", label: "Problema principal", kind: "provided" },
  { key: "objectives", label: "Objetivos", kind: "provided" },
  { key: "audience", label: "Público objetivo", kind: "provided" },
  { key: "requestedFeatures", label: "Funcionalidades solicitadas", kind: "provided" },
  { key: "preferences", label: "Referencias y preferencias", kind: "provided" },
  { key: "constraints", label: "Recursos y restricciones", kind: "provided" },
  { key: "priorities", label: "Prioridades", kind: "provided" },
  { key: "confirmedNeeds", label: "Necesidades expresadas por ti", kind: "provided" },
  { key: "suggestions", label: "Sugerencias sujetas a validación", kind: "suggested" },
  { key: "pendingQuestions", label: "Preguntas pendientes", kind: "pending" },
  { key: "nextStep", label: "Próximo paso recomendado", kind: "suggested" },
] as const;

export type BriefField = (typeof BRIEF_FIELDS)[number]["key"];
export type BriefEdits = Partial<Record<BriefField, string>>;
export type EvidenceStatus = "confirmed" | "inferred" | "suggested" | "pending";
export interface BriefProvenance {
  status: EvidenceStatus;
  source: string;
}

export interface AdvisorBrief {
  schemaVersion: "1.0";
  revision: number;
  mode: "deterministic";
  area: DiagnosticArea;
  fields: Record<BriefField, string>;
  references: UserReference[];
  provenance: Record<BriefField, BriefProvenance>;
  validationErrors?: Record<string, string>;
}
export type Brief = AdvisorBrief;
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

export function emptyAnswers(): AdvisorAnswers {
  return {
    sector: "", activity: "", audience: "", problem: "", goalId: "", contextId: "",
    priorityId: "", features: [], featureNotes: "", resources: "", constraints: "",
    referenceIds: [], references: [], likes: "", dislikes: "",
  };
}
