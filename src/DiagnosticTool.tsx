import { useState, useRef, useEffect } from "react";
import {
  INITIAL_QUESTION,
  CONTEXT_QUESTIONS,
  FINAL_PRIORITY_QUESTION,
  classifyDiagnostic,
  type DiagnosticQuestion,
  type DiagnosticResult,
} from "./diagnostic";
import { track } from "./analytics";

interface DiagnosticProps {
  onSelectCta?: (areaTitle: string) => void;
}

export function DiagnosticTool({ onSelectCta }: DiagnosticProps) {
  // Historial de respuestas [idOpciónPaso1, idOpciónPaso2, idOpciónPaso3]
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [step, setStep] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (questionRef.current || resultRef.current)?.focus({ preventScroll: true });
  }, [step]);

  // Determinar pregunta actual
  const step0 = INITIAL_QUESTION;
  const step0Option = step0.options.find((o) => o.id === selectedOptions[0]);

  const step1: DiagnosticQuestion =
    step0Option?.contextQuestionKey &&
    CONTEXT_QUESTIONS[step0Option.contextQuestionKey]
      ? CONTEXT_QUESTIONS[step0Option.contextQuestionKey]
      : CONTEXT_QUESTIONS["q_presencia_actual"];

  const step2 = FINAL_PRIORITY_QUESTION;

  const questions: DiagnosticQuestion[] = [step0, step1, step2];
  const currentQuestion = questions[step];
  const totalSteps = questions.length;
  const isFinished = step >= totalSteps;

  const result: DiagnosticResult | null = isFinished
    ? classifyDiagnostic(selectedOptions)
    : null;

  const handleSelectOption = (optionId: string) => {
    moveFocus.current = true;
    if (!hasStarted) {
      setHasStarted(true);
      track("diagnostic_start", { source: "direct" });
    }

    const updated = [...selectedOptions.slice(0, step), optionId];
    setSelectedOptions(updated);

    if (step + 1 < totalSteps) {
      setStep(step + 1);
    } else {
      setStep(totalSteps);
      const res = classifyDiagnostic(updated);
      track("diagnostic_complete", { steps_completed: totalSteps });
      track("diagnostic_completed", {
        steps_completed: totalSteps,
        primary_area: res.primaryArea,
      });
      track("need_detected", { need: res.primaryArea });
      track("solution_recommended", {
        solution_type: res.possibleSolution,
        priority: res.priority,
      });
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  };

  const handleBack = () => {
    moveFocus.current = true;
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    moveFocus.current = true;
    setSelectedOptions([]);
    setStep(0);
    setHasStarted(false);
  };

  return (
    <div
      className="diagnostic-widget surface-glass surface-glass--strong"
      aria-live="polite"
    >
      {!isFinished ? (
        <div className="diagnostic-step">
          <div className="diagnostic-progress">
            <span className="mono">
              Paso {step + 1} de {totalSteps}
            </span>
            <div
              className="progress-bar-bg"
              role="progressbar"
              aria-label="Progreso de la orientación"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
            {step > 0 && (
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

          <div className="diagnostic-question-header">
            <h3 ref={questionRef} tabIndex={-1}>
              {currentQuestion.title}
            </h3>
            {currentQuestion.subtitle && (
              <p className="diagnostic-subtitle">{currentQuestion.subtitle}</p>
            )}
          </div>

          <div
            className="diagnostic-options-list"
            role="group"
            aria-label={currentQuestion.title}
          >
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptions[step] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`diagnostic-option-btn ${isSelected ? "is-selected" : ""}`}
                  onClick={() => {
                    track("diagnostic_question_answered", {
                      question_id: currentQuestion.id,
                      step_index: step + 1,
                    });
                    handleSelectOption(opt.id);
                  }}
                >
                  <span className="option-indicator" aria-hidden="true" />
                  <span className="option-text">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : result ? (
        <div className="diagnostic-result" ref={resultRef} tabIndex={-1}>
          <div className="result-header">
            <span className="eyebrow">ORIENTACIÓN INICIAL · POR COMPROBAR</span>
            <h3>Área principal a revisar: {result.areaTitle}</h3>
            <p className="result-area-sub">{result.areaSubtitle}</p>
          </div>

          <div className="result-body">
            <div className="diagnostic-card-grid">
              <div className="diagnostic-card-item">
                <span className="card-item-label">Posible situación</span>
                <p>{result.currentSituation}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Oportunidad por evaluar</span>
                <p>{result.mainOpportunity}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Fricción por comprobar</span>
                <p>{result.detectedFriction}</p>
              </div>

              <div className="diagnostic-card-item highlight-item">
                <span className="card-item-label">Solución posible</span>
                <p>{result.possibleSolution}</p>
              </div>

              <div className="diagnostic-card-item">
                <span className="card-item-label">Prioridad orientativa</span>
                <p>
                  <span
                    className={`priority-badge priority-${result.priority.toLowerCase()}`}
                  >
                    {result.priority}
                  </span>
                </p>
              </div>

              <div className="diagnostic-card-item highlight-step">
                <span className="card-item-label">
                  Siguiente paso recomendado
                </span>
                <p>{result.recommendedNextStep}</p>
              </div>
            </div>

            <p className="result-disclaimer mono">
              Estas posibilidades se calculan con reglas a partir de tus
              respuestas. No son hechos observados en tu negocio. Antes de
              proponer una solución, revisamos contigo el contexto y la
              evidencia.
            </p>

            <div className="result-actions">
              <a
                href="#contacto"
                className="button"
                onClick={() => {
                  track("contact_started", { origin: "diagnostic" });
                  if (onSelectCta) {
                    onSelectCta(
                      `Diagnóstico (${result.areaTitle}): ${result.possibleSolution}`,
                    );
                  }
                }}
              >
                Quiero hablar sobre mi proyecto{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                className="button button-light"
                onClick={handleRestart}
              >
                Hacer otro diagnóstico
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
