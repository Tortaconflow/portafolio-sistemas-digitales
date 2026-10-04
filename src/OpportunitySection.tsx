import { useState } from "react";
import { track } from "./analytics";

export interface OpportunityScenario {
  id: string;
  letter: string;
  scenario: string;
  briefDiagnosis: {
    situation: string;
    friction: string;
    possibleSolution: string;
    priority: "Alta" | "Media" | "Exploratoria";
    suggestedStep: string;
  };
}

export const OPPORTUNITY_SCENARIOS: OpportunityScenario[] = [
  {
    id: "sc-a",
    letter: "A",
    scenario: "La gente te conoce, pero no sabe dónde encontrarte.",
    briefDiagnosis: {
      situation: "Tu reputación o recomendación boca a boca es buena, pero en internet no hay una ficha clara ni ubicación verificada.",
      friction: "Clientes potenciales buscan en Google o Google Maps y no obtienen horarios reales, teléfono directo ni dirección exacta.",
      possibleSolution: "Perfil verificado en Google Business y una presencia digital mínima de consulta rápida.",
      priority: "Alta",
      suggestedStep: "Verificar tu dirección física oficial y unificar teléfonos en un canal de acceso inmediato.",
    },
  },
  {
    id: "sc-b",
    letter: "B",
    scenario: "Tienes Facebook, pero la información se pierde entre publicaciones.",
    briefDiagnosis: {
      situation: "Publicas contenido regularmente, pero los precios, condiciones o catálogos quedan enterrados en el muro.",
      friction: "El interesado desiste porque tiene que desplazarse entre decenas de fotos antiguas para encontrar lo que busca.",
      possibleSolution: "Página web ligera o catálogo estático que mantenga la información esencial fija y organizada.",
      priority: "Alta",
      suggestedStep: "Reunir tus 10 servicios o productos más demandados en un índice de consulta accesible con 1 clic.",
    },
  },
  {
    id: "sc-c",
    letter: "C",
    scenario: "Recibes preguntas repetidas todos los días.",
    briefDiagnosis: {
      situation: "Una parte de tu tiempo se va en responder lo mismo por WhatsApp o llamadas: precios, horarios, envíos o ubicación.",
      friction: "El tiempo del negocio se consume en atención informativa en lugar de cerrar pedidos o dar el servicio.",
      possibleSolution: "Estructura de respuestas frecuentes visible y botones de WhatsApp con mensaje estructurado.",
      priority: "Alta",
      suggestedStep: "Anotar las 5 preguntas que más te hacen y publicarlas antes del botón de contacto.",
    },
  },
  {
    id: "sc-d",
    letter: "D",
    scenario: "Tienes buenos productos, pero poca gente fuera de tu círculo los conoce.",
    briefDiagnosis: {
      situation: "Tus clientes locales están satisfechos, pero la oferta no llega a personas de otras colonias o ciudades.",
      friction: "No cuentas con una plataforma donde un comprador foráneo pueda ver detalles, fotos reales y garantías para confiar.",
      possibleSolution: "Página de experiencias o catálogo con relato artesanal, medidas y políticas claras de envío.",
      priority: "Media",
      suggestedStep: "Documentar la historia y especificaciones de tus productos estrella con fotografías nítidas y claras.",
    },
  },
  {
    id: "sc-e",
    letter: "E",
    scenario: "Tus clientes llegan por recomendación, pero no tienes un sistema para captar nuevos.",
    briefDiagnosis: {
      situation: "Si las recomendaciones bajan, el flujo de ingresos se frena porque no hay un canal activo de atracción.",
      friction: "Dependes únicamente del azar o del círculo social existente sin presencia en búsquedas de necesidad.",
      possibleSolution: "Posicionamiento local orgánico enfocado en búsquedas de intención ('dónde comprar X en Oaxaca').",
      priority: "Media",
      suggestedStep: "Identificar qué palabras exactas escribe alguien en Google cuando necesita lo que tú ofreces.",
    },
  },
  {
    id: "sc-f",
    letter: "F",
    scenario: "Tu negocio funciona, pero depende demasiado de ti.",
    briefDiagnosis: {
      situation: "Si tú no respondes el teléfono de inmediato, la cotización no se entrega y la oportunidad se pierde.",
      friction: "No hay procedimientos estandarizados ni herramientas que guíen al cliente cuando estás atendiendo otra cosa.",
      possibleSolution: "Automatización de registro de prospectos, cotizadores simples y filtros automáticos de atención.",
      priority: "Alta",
      suggestedStep: "Diseñar un cotizador o formulario guiado que reúna los datos antes de que tú tengas que intervenir.",
    },
  },
  {
    id: "sc-g",
    letter: "G",
    scenario: "Ya tienes presencia digital, pero no sabes si realmente está funcionando.",
    briefDiagnosis: {
      situation: "Tienes página web o redes sociales activas, pero no tienes certeza de si generan clientes reales o solo visitas vacías.",
      friction: "Falta de instrumentación orientada a eventos útiles (cuántos llegaron a WhatsApp, qué preguntaron).",
      possibleSolution: "Auditoría de analítica orientada a negocio y simplificación del camino hacia la conversación.",
      priority: "Exploratoria",
      suggestedStep: "Revisar los últimos 15 días: cuántas personas te contactaron desde internet con una necesidad concreta.",
    },
  },
];

interface OpportunitySectionProps {
  onSelectOpportunity?: (scenarioText: string, solution: string) => void;
  onOpenFullDiagnostic?: () => void;
}

export function OpportunitySection({
  onSelectOpportunity,
  onOpenFullDiagnostic,
}: OpportunitySectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = OPPORTUNITY_SCENARIOS.find((s) => s.id === selectedId);

  const handleSelect = (sc: OpportunityScenario) => {
    setSelectedId(sc.id === selectedId ? null : sc.id);
    track("diagnostic_started", { source: "opportunity_section" });
  };

  return (
    <section id="oportunidad" className="section container opportunity-section" aria-labelledby="opportunity-title">
      <div className="opportunity-intro">
        <p className="eyebrow">ESCENARIOS ILUSTRATIVOS</p>
        <h2 id="opportunity-title">¿Dónde estás perdiendo oportunidades?</h2>
        <p className="section-description">
          Antes de invertir en una web o comprar herramientas, identifica qué dificulta que te encuentren, te contacten o hagan un pedido. Elige la situación que mejor describa tu negocio:
        </p>
      </div>

      <div className="opportunity-grid" role="list">
        {OPPORTUNITY_SCENARIOS.map((sc) => {
          const isCurrent = selectedId === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              className={`opportunity-card surface-glass surface-glass--subtle ${isCurrent ? "is-active" : ""}`}
              onClick={() => handleSelect(sc)}
              aria-expanded={isCurrent}
            >
              <div className="opportunity-card-top">
                <span className="mono opportunity-letter">{sc.letter}</span>
                <span className="opportunity-status-indicator" aria-hidden="true" />
              </div>
              <p className="opportunity-text">"{sc.scenario}"</p>
              <span className="opportunity-click-hint">
                {isCurrent ? "Ocultar posibilidad ↑" : "Ver una posibilidad ↓"}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="opportunity-result-box surface-glass surface-glass--strong" tabIndex={-1}>
          <div className="result-header">
            <span className="eyebrow">ORIENTACIÓN POR REVISAR · ESCENARIO {selected.letter}</span>
            <h3>{selected.scenario}</h3>
          </div>

          <div className="diagnostic-card-grid">
            <div className="diagnostic-card-item">
              <span className="card-item-label">Situación</span>
              <p>{selected.briefDiagnosis.situation}</p>
            </div>
            <div className="diagnostic-card-item">
              <span className="card-item-label">Qué lo dificulta</span>
              <p>{selected.briefDiagnosis.friction}</p>
            </div>
            <div className="diagnostic-card-item highlight-item">
              <span className="card-item-label">Solución posible</span>
              <p>{selected.briefDiagnosis.possibleSolution}</p>
            </div>
            <div className="diagnostic-card-item highlight-step">
              <span className="card-item-label">Siguiente paso recomendado</span>
              <p>{selected.briefDiagnosis.suggestedStep}</p>
            </div>
          </div>

          <div className="result-actions">
            <a
              href="#contacto"
              className="button"
              onClick={() => {
                track("contact_started", { origin: "diagnostic" });
                if (onSelectOpportunity) {
                  onSelectOpportunity(selected.scenario, selected.briefDiagnosis.possibleSolution);
                }
              }}
            >
              Quiero hablar sobre este problema <span aria-hidden="true">↗</span>
            </a>
            {onOpenFullDiagnostic && (
              <button
                type="button"
                className="button button-light"
                onClick={onOpenFullDiagnostic}
              >
                Volver a las 3 preguntas
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
