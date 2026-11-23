// Módulo centralizado de instrumentación y analítica para Cídiks · Reily Castro
// Principio: Privacidad estricta, eventos mínimos y agregados. Nunca envía datos personales.

export type AnalyticsEventName =
  | "page_view"
  | "diagnostic_start"
  | "diagnostic_complete"
  | "need_detected"
  | "education_view"
  | "education_cta"
  | "contact_click"
  | "form_start"
  | "form_prepare"
  | "form_submit"
  | "diagnostic_started"
  | "diagnostic_question_answered"
  | "diagnostic_completed"
  | "solution_recommended"
  | "contact_started"
  | "contact_submitted"
  | "case_study_opened"
  | "education_opened"
  | "agent_started"
  | "agent_completed"
  | "hero_cta_click"
  | "demo_view"
  | "demo_select"
  | "case_view"
  | "methodology_view"
  | "contact_start"
  | "contact_submit"
  | "advisor_start"
  | "advisor_step_completed"
  | "advisor_reference_added"
  | "advisor_brief_generated"
  | "advisor_contact_opened"
  | "chat_timing"
  | "advisor_validation_error";

export type AbstractNeedCategory =
  | "presencia"
  | "conversion"
  | "operacion"
  | "desconocido"
  | "descubrimiento"
  | "confianza"
  | "comunicacion"
  | "automatizacion"
  | "organizacion"
  | "ventas"
  | "reservas"
  | "seguimiento";

export interface AnalyticsPayloads {
  page_view: {
    view:
      | "inicio"
      | "proyectos"
      | "servicios"
      | "sobre-mi"
      | "contacto"
      | "diagnostico"
      | "conocimiento";
  };
  diagnostic_start: {
    source?: "hero" | "nav" | "direct" | "education";
  };
  diagnostic_complete: {
    steps_completed: number;
  };
  need_detected: {
    need: AbstractNeedCategory;
  };
  education_view: {
    article_id: "google-maps" | "web" | "whatsapp" | "automation-ai" | string;
    category:
      | "presencia"
      | "conversion"
      | "operacion"
      | "estrategia"
      | "seguridad"
      | "identidad"
      | "aprendizaje";
  };
  education_cta: {
    article_id: string;
    target: "contacto" | "diagnostico";
  };
  contact_click: {
    channel: "whatsapp" | "correo" | "messenger" | "formulario";
    origin?:
      | "hero"
      | "nav"
      | "footer"
      | "diagnostic"
      | "education"
      | "direct"
      | "agent";
  };
  form_start: {
    channel_selected: "whatsapp" | "correo" | "messenger";
  };
  form_prepare: {
    channel_selected: "whatsapp" | "correo" | "messenger";
    has_interest: boolean;
  };
  // Reservado exclusivamente para confirmación verdadera de backend si la arquitectura futura lo implementa.
  // No se debe disparar mientras el flujo de contacto sea asistido por cliente/enlace.
  form_submit: {
    channel_selected: "whatsapp" | "correo" | "messenger";
    has_interest: boolean;
  };

  // Nuevos eventos semánticos de evolución del portafolio
  diagnostic_started: {
    source?:
      "hero" | "nav" | "direct" | "education" | "opportunity_section" | "astra";
  };
  diagnostic_question_answered: {
    question_id: string;
    step_index: number;
  };
  diagnostic_completed: {
    steps_completed: number;
    primary_area: string;
  };
  solution_recommended: {
    solution_type: string;
    priority: "Alta" | "Media" | "Exploratoria";
  };
  contact_started: {
    origin: "direct" | "diagnostic" | "agent" | "hero" | "case_study";
  };
  contact_submitted: {
    channel: "whatsapp" | "correo" | "messenger";
  };
  case_study_opened: {
    case_id: string;
  };
  education_opened: {
    topic_id: string;
  };
  agent_started: {
    mode: "interactive_consultant";
  };
  agent_completed: {
    classified_need: string;
    recommended_solution: string;
  };
  hero_cta_click: { target: "contacto" | "casos" };
  demo_view: { demo_id: string; kind: "illustration" };
  demo_select: { demo_id: "oferta" | "seguimiento" };
  case_view: { case_id: string };
  methodology_view: { location: "home" | "method" };
  contact_start: {
    origin: "form" | "direct";
    channel?: "whatsapp" | "correo" | "messenger";
  };
  // Aquí submit significa apertura del canal con mensaje preparado, nunca recepción.
  // Una futura confirmación de backend debe usar stage=received y un id abstracto, sin PII.
  contact_submit: {
    channel: "whatsapp" | "correo" | "messenger";
    stage: "channel_opened" | "received";
  };
  advisor_start: { mode: "deterministic" };
  advisor_step_completed: { step: number };
  advisor_reference_added: { source: "curated" | "visitor"; count: number };
  advisor_brief_generated: {
    mode: "deterministic";
    area: "presencia" | "conversion" | "operacion";
    revision: number;
  };
  advisor_contact_opened: { channel: "whatsapp"; stage: "channel_opened" };
  advisor_validation_error: { step: number };
  chat_timing: {
    stage: "turnstile" | "request" | "model";
    outcome: "ok" | "error";
    duration_ms: number;
  };
}

// Advisor events accept only fixed categories and bounded numbers, never free text.
const ADVISOR_FIELDS: Record<string, Record<string, readonly string[] | number>> = {
  advisor_start: { mode: ["deterministic"] },
  advisor_step_completed: { step: 5 },
  advisor_reference_added: { source: ["curated", "visitor"], count: 5 },
  advisor_brief_generated: {
    mode: ["deterministic"], area: ["presencia", "conversion", "operacion"], revision: 10000,
  },
  advisor_contact_opened: { channel: ["whatsapp"], stage: ["channel_opened"] },
  advisor_validation_error: { step: 5 },
  chat_timing: { stage: ["turnstile", "request", "model"], outcome: ["ok", "error"], duration_ms: 120000 },
};

export function sanitizeAdvisorPayload(event: string, payload: Record<string, unknown>) {
  const schema = ADVISOR_FIELDS[event];
  const clean: Record<string, string | number> = {};
  if (!schema) return clean;
  for (const [key, allowed] of Object.entries(schema)) {
    const value = payload[key];
    if (typeof allowed === "number") {
      if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= allowed)
        clean[key] = value;
    } else if (typeof value === "string" && allowed.includes(value)) clean[key] = value;
  }
  return clean;
}

// Lista negra estricta de claves que NUNCA deben enviarse
const FORBIDDEN_KEYS = new Set([
  "name",
  "nombre",
  "email",
  "correo",
  "phone",
  "telefono",
  "tel",
  "message",
  "mensaje",
  "text",
  "texto",
  "business",
  "negocio",
  "city",
  "ciudad",
  "offer",
  "oferta",
  "goal",
  "meta",
  "problem",
  "problema",
]);

function sanitizePayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      continue;
    }
    // Asegurar que no se filtren strings con longitudes excesivas o correos/teléfonos
    if (typeof value === "string") {
      if (value.includes("@") || /^\+?\d{8,15}$/.test(value.trim())) {
        continue; // descartar potenciales correos o números
      }
      sanitized[key] = value.slice(0, 100); // restringir longitud
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    cidiksAnalyticsBuffer?: Array<{
      event: string;
      data: Record<string, unknown>;
      timestamp: number;
    }>;
  }
}

/**
 * Función centralizada de tracking.
 * Si gtag o dataLayer están activos, despacha el evento.
 * De lo contrario, almacena en un buffer seguro en memoria para inspección o debugging sin romper nada.
 */
export function track<E extends AnalyticsEventName>(
  event: E,
  payload: AnalyticsPayloads[E],
): void {
  try {
    const raw = payload as unknown as Record<string, unknown>;
    const cleanData = event.startsWith("advisor_") || event === "chat_timing"
      ? sanitizeAdvisorPayload(event, raw)
      : sanitizePayload(raw);

    // Si existe Google Tag / Google Analytics
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", event, cleanData);
    }
    // Si existe un dataLayer estándar (GTM u otros)
    else if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...cleanData });
    }

    // Buffer seguro en memoria (permite verificar que los eventos se emiten correctamente)
    if (typeof window !== "undefined") {
      if (!window.cidiksAnalyticsBuffer) {
        window.cidiksAnalyticsBuffer = [];
      }
      window.cidiksAnalyticsBuffer.push({
        event,
        data: cleanData,
        timestamp: Date.now(),
      });
      // Mantener buffer acotado a 100 eventos
      if (window.cidiksAnalyticsBuffer.length > 100) {
        window.cidiksAnalyticsBuffer.shift();
      }
    }
  } catch (err) {
    // Modo fallback silencioso: la analítica nunca debe romper la experiencia de usuario
    if (import.meta.env?.DEV) {
      console.warn("[Cídiks Analytics Fallback]", err);
    }
  }
}
