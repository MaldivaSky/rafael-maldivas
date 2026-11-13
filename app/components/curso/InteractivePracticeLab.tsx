"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tipos reutilizáveis em todas as 18 lições                          */
/* ------------------------------------------------------------------ */

export type PredictQuestion = {
  question: string;
  answer: string;
};

export type FillBlankSegment =
  | { kind: "text"; value: string }
  | {
      kind: "blank";
      id: string;
      accepted: string[];
      placeholder?: string;
      hint?: string;
    };

export type FillBlankExercise = {
  id: string;
  title: string;
  prompt: string;
  wordBank?: string[];
  segments: FillBlankSegment[];
  explanation: string;
};

export type QuizOptionExplained = {
  text: string;
  whyNot?: string;
};

export type ExplainedQuizItem = {
  id: string;
  question: string;
  options: QuizOptionExplained[];
  correctIndex: number;
  explanation: string;
};

/* ------------------------------------------------------------------ */
/*  1. Previsão antes de ler (com campo de resposta do aluno)          */
/* ------------------------------------------------------------------ */

export function PredictInteractive({
  items,
  onInteract,
}: {
  items: PredictQuestion[];
  onInteract?: () => void;
}) {
  const [guesses, setGuesses] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selfEval, setSelfEval] = useState<Record<number, "hit" | "miss">>({});

  return (
    <section className="curso-sim-card" aria-labelledby="predict-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Passo 1 · Antes de ler: preveja</span>
          <h2 id="predict-title">
            <Lightbulb size={20} aria-hidden="true" /> Escreva seu palpite antes de abrir a resposta
          </h2>
        </div>
      </div>
      <p className="curso-muted">
        Tentar responder antes de ler fixa o conceito e mostra onde está a sua dúvida real.
      </p>

      <div className="curso-quiz-list">
        {items.map((p, idx) => {
          const isOpen = Boolean(revealed[idx]);
          const evalState = selfEval[idx];
          return (
            <div key={p.question} className="curso-quiz-item">
              <p>
                <strong>{p.question}</strong>
              </p>

              <label
                htmlFor={`predict-input-${idx}`}
                className="curso-fine"
                style={{ display: "block", marginTop: 10, marginBottom: 6 }}
              >
                Sua hipótese (opcional, fica só no seu navegador):
              </label>
              <textarea
                id={`predict-input-${idx}`}
                rows={2}
                className="curso-predict-textarea"
                placeholder="Digite em 1 ou 2 linhas o que você acha que acontece..."
                value={guesses[idx] ?? ""}
                onChange={(e) =>
                  setGuesses((prev) => ({ ...prev, [idx]: e.target.value }))
                }
              />

              <div className="curso-media-actions" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
                    onInteract?.();
                  }}
                >
                  <Eye size={15} aria-hidden="true" />
                  {isOpen ? "Esconder resposta" : "Conferir resposta do professor"}
                </button>
              </div>

              {isOpen && (
                <div className="curso-predict-feedback">
                  <p className="curso-why" style={{ marginTop: 0 }}>
                    <strong>Resposta do professor:</strong> {p.answer}
                  </p>
                  <div className="curso-self-eval">
                    <span className="curso-fine">Como foi sua previsão?</span>
                    <button
                      type="button"
                      className={`curso-eval-btn ${evalState === "hit" ? "ok" : ""}`}
                      onClick={() =>
                        setSelfEval((prev) => ({ ...prev, [idx]: "hit" }))
                      }
                    >
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Acertei a ideia
                    </button>
                    <button
                      type="button"
                      className={`curso-eval-btn ${evalState === "miss" ? "learn" : ""}`}
                      onClick={() =>
                        setSelfEval((prev) => ({ ...prev, [idx]: "miss" }))
                      }
                    >
                      <Sparkles size={14} aria-hidden="true" />
                      Aprendi algo novo
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Preenchimento de Lacunas com validação visual                   */
/* ------------------------------------------------------------------ */

function normalizeToken(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function FillInTheBlankLab({
  exercises,
  onComplete,
}: {
  exercises: FillBlankExercise[];
  onComplete?: (correctCount: number, totalCount: number) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  if (!exercises.length) return null;

  function fillNextEmpty(ex: FillBlankExercise, token: string) {
    const blanks = ex.segments.filter(
      (s): s is Extract<FillBlankSegment, { kind: "blank" }> => s.kind === "blank",
    );
    const target = blanks.find((b) => !(values[b.id] ?? "").trim()) ?? blanks[0];
    if (!target) return;
    setValues((prev) => ({ ...prev, [target.id]: token }));
    setChecked((prev) => ({ ...prev, [ex.id]: false }));
  }

  function verifyExercise(ex: FillBlankExercise) {
    const nextChecked = { ...checked, [ex.id]: true };
    setChecked(nextChecked);

    if (onComplete) {
      let total = 0;
      let correct = 0;
      for (const item of exercises) {
        for (const seg of item.segments) {
          if (seg.kind === "blank") {
            total += 1;
            const userVal = normalizeToken(values[seg.id] ?? "");
            if (seg.accepted.some((a) => normalizeToken(a) === userVal)) {
              correct += 1;
            }
          }
        }
      }
      onComplete(correct, total);
    }
  }

  function resetExercise(ex: FillBlankExercise) {
    setValues((prev) => {
      const next = { ...prev };
      for (const seg of ex.segments) {
        if (seg.kind === "blank") delete next[seg.id];
      }
      return next;
    });
    setChecked((prev) => ({ ...prev, [ex.id]: false }));
    setShowSolution((prev) => ({ ...prev, [ex.id]: false }));
  }

  return (
    <section className="curso-sim-card" aria-labelledby="lacunas-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Prática ativa · Complete as lacunas</span>
          <h2 id="lacunas-title">
            <Sparkles size={20} aria-hidden="true" /> Complete o código e a regra de negócio
          </h2>
        </div>
      </div>
      <p className="curso-muted">
        Digite ou clique nos blocos sugeridos para preencher cada lacuna e clique em{" "}
        <strong>Verificar respostas</strong> para receber feedback imediato.
      </p>

      <div className="curso-quiz-list">
        {exercises.map((ex) => {
          const isChecked = Boolean(checked[ex.id]);
          const isRevealed = Boolean(showSolution[ex.id]);
          const blanks = ex.segments.filter(
            (s): s is Extract<FillBlankSegment, { kind: "blank" }> => s.kind === "blank",
          );
          const correctCount = blanks.filter((b) =>
            b.accepted.some(
              (a) => normalizeToken(a) === normalizeToken(values[b.id] ?? ""),
            ),
          ).length;
          const allCorrect = isChecked && correctCount === blanks.length;

          return (
            <div key={ex.id} className="curso-quiz-item">
              <div className="curso-media-card-head">
                <div>
                  <h3>{ex.title}</h3>
                  <p className="curso-muted">{ex.prompt}</p>
                </div>
                {isChecked && (
                  <span
                    className={`curso-blank-score ${allCorrect ? "ok" : "err"}`}
                  >
                    {allCorrect ? (
                      <CheckCircle2 size={15} aria-hidden="true" />
                    ) : (
                      <XCircle size={15} aria-hidden="true" />
                    )}
                    {correctCount}/{blanks.length} corretas
                  </span>
                )}
              </div>

              {ex.wordBank && ex.wordBank.length > 0 && (
                <div className="curso-word-bank" aria-label="Banco de termos sugeridos">
                  <span className="curso-fine">Clique para preencher:</span>
                  {ex.wordBank.map((word) => (
                    <button
                      key={word}
                      type="button"
                      className="curso-word-chip"
                      onClick={() => fillNextEmpty(ex, word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}

              <div className="curso-blank-box">
                {ex.segments.map((seg, i) => {
                  if (seg.kind === "text") {
                    return (
                      <span key={`${ex.id}-t-${i}`} className="curso-blank-text">
                        {seg.value}
                      </span>
                    );
                  }
                  const userVal = values[seg.id] ?? "";
                  const ok = seg.accepted.some(
                    (a) => normalizeToken(a) === normalizeToken(userVal),
                  );
                  const stateClass = !isChecked ? "" : ok ? "ok" : "err";

                  return (
                    <span key={seg.id} className="curso-blank-input-wrap">
                      <input
                        type="text"
                        aria-label={seg.hint ?? `Lacuna ${seg.id}`}
                        placeholder={seg.placeholder ?? "________"}
                        value={userVal}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, [seg.id]: e.target.value }));
                          setChecked((prev) => ({ ...prev, [ex.id]: false }));
                        }}
                        className={`curso-blank-input ${stateClass}`}
                        size={Math.max(
                          10,
                          Math.min(28, (seg.accepted[0]?.length ?? 10) + 2),
                        )}
                      />
                      {isChecked && (
                        <span
                          className={`curso-blank-badge ${ok ? "ok" : "err"}`}
                          aria-label={ok ? "Correto" : "Incorreto"}
                        >
                          {ok ? "✓" : "✗"}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              <div className="curso-media-actions" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary curso-btn-sm"
                  onClick={() => verifyExercise(ex)}
                >
                  <CheckCircle2 size={15} aria-hidden="true" />
                  Verificar respostas
                </button>
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  onClick={() =>
                    setShowSolution((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
                  }
                >
                  <Eye size={15} aria-hidden="true" />
                  {isRevealed ? "Esconder gabarito" : "Ver gabarito"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  onClick={() => resetExercise(ex)}
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Limpar
                </button>
              </div>

              {(isChecked || isRevealed) && (
                <div
                  className={`curso-blank-feedback ${
                    isChecked ? (allCorrect ? "ok" : "err") : ""
                  }`}
                >
                  {isRevealed && (
                    <p style={{ marginBottom: 6 }}>
                      <strong>Gabarito esperado:</strong>{" "}
                      {blanks.map((b, idx) => (
                        <code key={b.id} style={{ marginRight: 8 }}>
                          ({idx + 1}) {b.accepted[0]}
                        </code>
                      ))}
                    </p>
                  )}
                  <p className="curso-why" style={{ marginTop: 0 }}>
                    {ex.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Quiz com feedback visual imediato e explicação de cada erro     */
/* ------------------------------------------------------------------ */

export function ExplainedQuizBlock({
  title = "Quiz com feedback imediato",
  items,
  onComplete,
}: {
  title?: string;
  items: ExplainedQuizItem[];
  onComplete?: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (!items.length) return null;

  const answeredCount = Object.keys(answers).length;
  const correctCount = items.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;

  function choose(qId: string, optionIdx: number) {
    const next = { ...answers, [qId]: optionIdx };
    setAnswers(next);
    if (onComplete && Object.keys(next).length === items.length) {
      const score = items.filter((q) => next[q.id] === q.correctIndex).length;
      onComplete(score, items.length);
    }
  }

  return (
    <section className="curso-sim-card" aria-labelledby="quiz-explained-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">
            Quiz interativo · {answeredCount}/{items.length} respondidas ·{" "}
            {correctCount} acerto(s)
          </span>
          <h2 id="quiz-explained-title">
            <HelpCircle size={20} aria-hidden="true" /> {title}
          </h2>
        </div>
        {answeredCount > 0 && (
          <button
            type="button"
            className="btn btn-ghost curso-btn-sm"
            onClick={() => setAnswers({})}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Refazer quiz
          </button>
        )}
      </div>

      <div className="curso-quiz-list">
        {items.map((q, qIdx) => {
          const chosen = answers[q.id];
          const answered = chosen !== undefined;
          const isCorrect = answered && chosen === q.correctIndex;
          const chosenOpt = answered ? q.options[chosen] : undefined;

          return (
            <div key={q.id} className="curso-quiz-item">
              <p>
                <strong>
                  {qIdx + 1}. {q.question}
                </strong>
              </p>

              <div className="curso-quiz-opts">
                {q.options.map((opt, optIdx) => {
                  const selected = chosen === optIdx;
                  const rightOpt = optIdx === q.correctIndex;
                  const stateClass = !answered
                    ? ""
                    : rightOpt
                      ? "correct"
                      : selected
                        ? "wrong"
                        : "";

                  return (
                    <button
                      key={`${q.id}-${optIdx}`}
                      type="button"
                      className={`curso-quiz-opt ${stateClass}`}
                      onClick={() => choose(q.id, optIdx)}
                    >
                      <span className="curso-quiz-opt-row">
                        <span>{opt.text}</span>
                        {answered && rightOpt && (
                          <CheckCircle2 size={16} aria-hidden="true" />
                        )}
                        {answered && selected && !rightOpt && (
                          <XCircle size={16} aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div
                  className={`curso-quiz-feedback ${isCorrect ? "ok" : "err"}`}
                  role="status"
                >
                  <p style={{ marginBottom: 6 }}>
                    <strong>
                      {isCorrect
                        ? "✓ Resposta correta!"
                        : "✗ Alternativa incorreta."}
                    </strong>{" "}
                    {!isCorrect && chosenOpt?.whyNot ? chosenOpt.whyNot : ""}
                  </p>
                  <p className="curso-why" style={{ marginTop: 0 }}>
                    <strong>Explicação:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

