import { useState, useRef, useEffect } from "react";
import {
  ASTRA_CONSULTATIVE_STEPS,
  evaluateAstraConsultation,
  type AstraDiagnosisCard,
} from "./astra";
import { track } from "./analytics";

interface AstraAgentProps {
  onSelectCta?: (diagnosisSummary: string) => void;
}

export function AstraAgent({ onSelectCta }: AstraAgentProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState<string>("");
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [result, setResult] = useState<AstraDiagnosisCard | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const totalSteps = ASTRA_CONSULTATIVE_STEPS.length;
  const currentStep = ASTRA_CONSULTATIVE_STEPS[currentStepIndex];
  const isFinished = currentStepIndex >= totalSteps;

  const handleStart = () => {
    setHasStarted(true);
    track("agent_started", { mode: "interactive_consultant" });
  };

  const handleAnswer = (text: string) => {
    const field = currentStep.field;
    const updatedAnswers = { ...answers, [field]: text };
    setAnswers(updatedAnswers);
    setCustomInput("");

    track("diagnostic_question_answered", {
      question_id: currentStep.id,
      step_index: currentStepIndex + 1,
    });

    if (currentStepIndex + 1 < totalSteps) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCurrentStepIndex(totalSteps);
      const evalResult = evaluateAstraConsultation(updatedAnswers);
      setResult(evalResult);
      track("agent_completed", {
        classified_need: evalResult.classifiedNeed,
        recommended_solution: evalResult.possibleSolution,
      });
      track("solution_recommended", {
        solution_type: evalResult.possibleSolution,
        priority: evalResult.priority,
      });
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setResult(null);
    setHasStarted(false);
  };

  return (
    <section id="agente-astra" className="section container astra-section" aria-labelledby="astra-title">
      <div className="astra-container surface-glass surface-glass--strong">
        {/* Encabezado e identidad de ASTRA */}
        <div className="astra-identity-header">
          <div className="astra-avatar-wrap">
            <svg
              className="astra-avatar-svg"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Símbolo de ASTRA inspirado estilísticamente en la observación y memoria mesoamericana"
              role="img"
            >
              <rect width="64" height="64" rx="16" fill="var(--action)" />
              {/* Rasgo escultórico estilizado contemporáneo: observación, memoria, sabiduría */}
              <circle cx="32" cy="28" r="16" stroke="#DCE5DA" strokeWidth="2.5" />
              <path
                d="M24 30C24 30 28 34 32 34C36 34 40 30 40 30"
                stroke="#DCE5DA"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line x1="26" y1="24" x2="30" y2="24" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="24" x2="38" y2="24" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M20 48C20 43 25 41 32 41C39 41 44 43 44 48"
                stroke="#DCE5DA"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="18" r="2" fill="#FFFFFF" />
            </svg>
            <div>
              <div className="astra-badge-row">
                <span className="mono astra-tag">AGENTE CONSULTIVO EXPERIMENTAL</span>
                <span className="astra-pill">ASTRA 1.0</span>
              </div>
              <h2 id="astra-title">Diagnóstico consultivo guiado</h2>
            </div>
          </div>
          <p className="astra-manifesto">
            "Quiero entender cómo funciona tu negocio antes de recomendarte algo. No todo problema se resuelve con una página web: diagnosticamos primero para encontrar la solución más útil y ligera para tus condiciones."
          </p>
          <p className="astra-identity-disclaimer mono">
            Identidad contemporánea inspirada visualmente en el rigor, la memoria y la observación de las esculturas monumentales mesoamericanas. No realiza afirmaciones históricas ni inventa vocabulario.
          </p>
        </div>

        {/* Estado inicial antes de comenzar */}
        {!hasStarted && !result && (
          <div className="astra-welcome-panel">
            <div className="astra-welcome-card surface-glass surface-glass--subtle">
              <h3>¿Cómo funciona este descubrimiento?</h3>
              <ul className="checklist">
                <li>Te haré preguntas sobre cómo te encuentran, qué vendes y qué tareas te quitan tiempo.</li>
                <li>Si por tu momento comercial aún no necesitas una página web, te lo diré con honestidad.</li>
                <li>Al terminar, obtendrás una tarjeta de diagnóstico con tu fricción detectada y el siguiente paso sugerido.</li>
              </ul>
              <button type="button" className="button" onClick={handleStart}>
                Comenzar diagnóstico consultivo <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Flujo de preguntas interactivas */}
        {hasStarted && !isFinished && currentStep && (
          <div className="astra-flow-panel" aria-live="polite">
            <div className="diagnostic-progress">
              <span className="mono">
                Pregunta {currentStepIndex + 1} de {totalSteps}
              </span>
              <div
                className="progress-bar-bg"
                role="progressbar"
                aria-valuenow={currentStepIndex + 1}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
              >
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                />
              </div>
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  className="text-button diagnostic-back"
                  onClick={handleBack}
                  aria-label="Volver a la pregunta anterior"
                >
                  ← Volver
                </button>
              )}
            </div>

            <div className="astra-bubble astra-bubble--agent">
              <span className="mono astra-bubble-sender">ASTRA:</span>
              <p className="astra-bubble-question">{currentStep.question}</p>
              <p className="astra-bubble-clarification">{currentStep.clarification}</p>
            </div>

            <div className="astra-options-list" role="group" aria-label="Opciones rápidas">
              {currentStep.quickOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="diagnostic-option-btn"
                  onClick={() => handleAnswer(opt)}
                >
                  <span className="option-indicator" aria-hidden="true" />
                  <span className="option-text">{opt}</span>
                </button>
              ))}
            </div>

            {/* Opción de respuesta personalizada escrita */}
            <form
              className="astra-custom-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (customInput.trim()) {
                  handleAnswer(customInput.trim());
                }
              }}
            >
              <label htmlFor="astra-custom-text" className="mono small">
                O escribe tu respuesta con tus propias palabras:
              </label>
              <div className="astra-input-row">
                <input
                  id="astra-custom-text"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Escribe aquí tu respuesta específica..."
                  maxLength={200}
                />
                <button type="submit" className="button button-light" disabled={!customInput.trim()}>
                  Responder
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tarjeta de diagnóstico final de ASTRA */}
        {result && (
          <div className="astra-result-panel" ref={resultRef} tabIndex={-1}>
            <div className="result-header">
              <span className="eyebrow">DIAGNÓSTICO GENERADO POR ASTRA</span>
              <h3>Evaluación consultiva del negocio</h3>
              {!result.recommendsWebImmediately && (
                <div className="astra-honest-alert">
                  <span className="alert-icon" aria-hidden="true">💡</span>
                  <p>
                    <strong>Criterio honesto de diagnóstico:</strong> Por lo que describes, quizá <em>no necesitas una página web todavía</em>. Conviene ordenar canales más directos primero.
                  </p>
                </div>
              )}
            </div>

            <div className="diagnostic-card-grid">
              <div className="diagnostic-card-item">
                <span className="card-item-label">Situación actual</span>
                <p>{result.currentSituation}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Principal oportunidad</span>
                <p>{result.mainOpportunity}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Fricción detectada</span>
                <p>{result.detectedFriction}</p>
              </div>

              <div className="diagnostic-card-item highlight-item">
                <span className="card-item-label">Solución sugerida</span>
                <p>{result.possibleSolution}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Prioridad de acción</span>
                <p>
                  <span className={`priority-badge priority-${result.priority.toLowerCase()}`}>
                    {result.priority}
                  </span>
                </p>
              </div>

              <div className="diagnostic-card-item highlight-step">
                <span className="card-item-label">Siguiente paso recomendado</span>
                <p>{result.recommendedNextStep}</p>
              </div>
            </div>

            <p className="result-disclaimer mono">
              Este diagnóstico no asegura resultados económicos mágicos. Proporciona una pauta de diseño para reducir trabajo repetitivo, facilitar la confianza y medir con certeza.
            </p>

            <div className="result-actions">
              <a
                href="#contacto"
                className="button"
                onClick={() => {
                  track("contact_started", { origin: "agent" });
                  if (onSelectCta) {
                    onSelectCta(`Diagnóstico ASTRA (${result.classifiedNeed}): ${result.possibleSolution}`);
                  }
                }}
              >
                Quiero hablar sobre mi proyecto <span aria-hidden="true">↗</span>
              </a>
              <button type="button" className="button button-light" onClick={handleReset}>
                Hacer otra consulta con ASTRA
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
