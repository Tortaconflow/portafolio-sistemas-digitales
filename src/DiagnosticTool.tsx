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
  onComplete?: (area: string) => void;
  onSelectCta?: (areaTitle: string) => void;
}

export function DiagnosticTool({ onComplete, onSelectCta }: DiagnosticProps) {
  // Historial de respuestas [idOpciónPaso1, idOpciónPaso2, idOpciónPaso3]
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [step, setStep] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Determinar pregunta actual
  const step0 = INITIAL_QUESTION;
  const step0Option = step0.options.find((o) => o.id === selectedOptions[0]);

  const step1: DiagnosticQuestion =
    step0Option?.contextQuestionKey && CONTEXT_QUESTIONS[step0Option.contextQuestionKey]
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
      track("need_detected", { need: res.primaryArea });
      if (onComplete) {
        onComplete(res.primaryArea);
      }
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setSelectedOptions([]);
    setStep(0);
  };

  return (
    <div className="diagnostic-widget surface-glass surface-glass--strong" aria-live="polite">
      {!isFinished ? (
        <div className="diagnostic-step">
          <div className="diagnostic-progress">
            <span className="mono">
              Paso {step + 1} de {totalSteps}
            </span>
            <div
              className="progress-bar-bg"
              role="progressbar"
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
            <h3>{currentQuestion.title}</h3>
            {currentQuestion.subtitle && (
              <p className="diagnostic-subtitle">{currentQuestion.subtitle}</p>
            )}
          </div>

          <div className="diagnostic-options-list" role="radiogroup" aria-label={currentQuestion.title}>
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptions[step] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`diagnostic-option-btn ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleSelectOption(opt.id)}
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
            <span className="eyebrow">ORIENTACIÓN INICIAL DETERMINISTA</span>
            <h3>Área principal a revisar: {result.areaTitle}</h3>
            <p className="result-area-sub">{result.areaSubtitle}</p>
          </div>

          <div className="result-body">
            <div className="result-section">
              <h4>¿Por qué?</h4>
              <p>{result.explanation}</p>
            </div>

            <div className="result-section highlight-step">
              <h4>Siguiente paso sugerido</h4>
              <p>{result.suggestedStep}</p>
            </div>

            <p className="result-disclaimer mono">
              Nota: Esta es una orientación inicial calculada por reglas claras según tus respuestas, no una auditoría infalible ni una garantía de resultados comerciales.
            </p>

            <div className="result-actions">
              <a
                href="#contacto"
                className="button"
                onClick={() => onSelectCta && onSelectCta(result.areaTitle)}
              >
                Quiero revisar esto con Reily <span aria-hidden="true">↗</span>
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
