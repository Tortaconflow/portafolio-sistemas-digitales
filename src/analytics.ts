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
  | "agent_completed";

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
    view: "inicio" | "proyectos" | "servicios" | "sobre-mi" | "contacto";
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
    category: "presencia" | "conversion" | "operacion" | "estrategia";
  };
  education_cta: {
    article_id: string;
    target: "contacto" | "diagnostico";
  };
  contact_click: {
    channel: "whatsapp" | "correo" | "messenger" | "formulario";
    origin?: "hero" | "nav" | "footer" | "diagnostic" | "education" | "direct" | "agent";
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
    source?: "hero" | "nav" | "direct" | "education" | "opportunity_section" | "astra";
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

function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
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
    cidiksAnalyticsBuffer?: Array<{ event: string; data: Record<string, unknown>; timestamp: number }>;
  }
}

/**
 * Función centralizada de tracking.
 * Si gtag o dataLayer están activos, despacha el evento.
 * De lo contrario, almacena en un buffer seguro en memoria para inspección o debugging sin romper nada.
 */
export function track<E extends AnalyticsEventName>(
  event: E,
  payload: AnalyticsPayloads[E]
): void {
  try {
    const cleanData = sanitizePayload(payload as unknown as Record<string, unknown>);

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
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Cídiks Analytics Fallback]", err);
    }
  }
}
