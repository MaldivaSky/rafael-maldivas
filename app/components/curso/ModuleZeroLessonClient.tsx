"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Flame,
  HelpCircle,
  RotateCw,
  Search,
  Sparkles,
} from "lucide-react";
import { courseBySlug, lessonBySlug } from "@/app/lib/courses";
import {
  computeLessonMastery,
  type IdeLessonStage,
} from "@/app/lib/course-workspace";
import {
  GLOSSARY_TERMS,
  RESTAURANT_STATIONS,
  type M0LessonData,
} from "@/app/lib/module-zero-content";
import { localePath } from "@/app/lib/i18n";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { CourseIdeShell } from "./CourseIdeShell";
import { SoftwareSkeletonMasterclass } from "./SoftwareSkeletonMasterclass";
import HttpStatusLab from "./HttpStatusLab";
import NotebookLMMediaBlock from "./NotebookLMMediaBlock";
import LessonVisualDiagram from "./LessonVisualDiagram";
import {
  FillInTheBlankLab,
  PredictInteractive,
} from "./InteractivePracticeLab";
import {
  M0_DIAGRAM_BY_SLUG,
  M0_FILL_BLANKS,
} from "@/app/lib/module-zero-practice";

export default function ModuleZeroLessonClient({
  courseSlug,
  lesson,
  prevLesson,
  nextLesson,
}: {
  courseSlug: string;
  lesson: M0LessonData;
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}) {
  const {
    workspace,
    syncStatus,
    isAuthenticated,
    isAdmissionActivated,
    admissionLoading,
    studentProfile,
    setCodeDraft,
    recordLabResult,
    recordQuizScore,
    setNote,
    reviewSrsCard,
    toggleLessonCompleted,
    toggleDeployStep,
    recordTerminalProgress,
    updatePreferences,
  } = useCourseWorkspace(courseSlug);

  const [activeStage, setActiveStage] = useState<IdeLessonStage>("predict");
  const [conceptTopicIdx, setConceptTopicIdx] = useState(0);
  const [activeStationId, setActiveStationId] = useState<string>(RESTAURANT_STATIONS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");

  const canonicalLesson = useMemo(() => {
    const course = courseBySlug(courseSlug);
    const found = course ? lessonBySlug(course, lesson.slug) : undefined;
    return (
      found ?? {
        id: lesson.slug,
        slug: lesson.slug,
        moduleNumber: 0,
        title: `${lesson.code} — ${lesson.metaNote}`,
        summary: lesson.oneSentence,
        durationMin: 90,
        status: "gratuita" as const,
        prerequisites: [],
        objectives: lesson.threeThings,
      }
    );
  }, [courseSlug, lesson]);

  const m0DoneSlugs = workspace.completedSlugs.filter((s) => s.startsWith("modulo-0-"));
  const isCompleted = workspace.completedSlugs.includes(lesson.slug);
  const mastery = useMemo(
    () => computeLessonMastery(lesson.slug, workspace),
    [lesson.slug, workspace],
  );

  function handlePickQuizOption(questionId: string, optionIdx: number) {
    setQuizAnswers((prev) => {
      const next = { ...prev, [questionId]: optionIdx };
      const answeredCount = lesson.quizzes.filter((q) => typeof next[q.id] === "number").length;
      if (answeredCount === lesson.quizzes.length && lesson.quizzes.length > 0) {
        const correctCount = lesson.quizzes.filter((q) => next[q.id] === q.correctIndex).length;
        recordQuizScore(lesson.slug, canonicalLesson.id, correctCount, lesson.quizzes.length);
      }
      return next;
    });
  }

  const filteredGlossary = useMemo(() => {
    const q = glossaryQuery.trim().toLowerCase();
    if (!q) return GLOSSARY_TERMS;
    return GLOSSARY_TERMS.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        g.association.toLowerCase().includes(q),
    );
  }, [glossaryQuery]);

  const activeStation =
    RESTAURANT_STATIONS.find((s) => s.id === activeStationId) ?? RESTAURANT_STATIONS[0];

  const showPredict = activeStage === "all" || activeStage === "predict";
  const showConcept = activeStage === "all" || activeStage === "concept";
  const showPractice = activeStage === "all" || activeStage === "practice";
  const showQuiz = activeStage === "all" || activeStage === "quiz";

  return (
    <CourseIdeShell
      courseSlug={courseSlug}
      lesson={canonicalLesson}
      workspace={workspace}
      syncStatus={syncStatus}
      isAuthenticated={isAuthenticated}
      isAdmissionActivated={isAdmissionActivated}
      admissionLoading={admissionLoading}
      studentProfile={studentProfile}
      activeStage={activeStage}
      onChangeStage={setActiveStage}
      onUpdatePreferences={updatePreferences}
      onUpdateCodeDraft={setCodeDraft}
      onRecordLabResult={recordLabResult}
      onUpdateNotes={setNote}
      onReviewSrsCard={reviewSrsCard}
      onToggleDeployStep={toggleDeployStep}
      onRecordTerminalProgress={recordTerminalProgress}
    >
      <div className="curso-lesson-body">
        <div className="clean-lesson-inline-bar">
          <div className="clean-lesson-summary-text">
            <strong>Síntese:</strong> {lesson.oneSentence}
          </div>
          <div className="clean-lesson-inline-actions">
            <button
              type="button"
              className={`clean-btn-sm ${isCompleted ? "is-done" : ""}`}
              onClick={() => toggleLessonCompleted(lesson.slug, canonicalLesson.id)}
              aria-pressed={isCompleted}
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>{isCompleted ? "Concluída" : "Marcar concluída"}</span>
            </button>
          </div>
        </div>

        {showPredict && (
          <>
            <NotebookLMMediaBlock media={lesson.notebookMedia} />
            <PredictInteractive items={lesson.predict} />
          </>
        )}

        {showConcept && (
          <>
            <LessonVisualDiagram diagramId={M0_DIAGRAM_BY_SLUG[lesson.slug]} />

            {lesson.slug === "modulo-0-f01-o-mapa" && (
              <section className="curso-sim-card" aria-labelledby="mapa-restaurante-title">
                <div className="curso-sim-head">
                  <div>
                    <span className="curso-badge">Modelo mental único · O restaurante</span>
                    <h2 id="mapa-restaurante-title">
                      <Sparkles size={20} aria-hidden="true" /> Clique em cada posto para ver a tecnologia real
                    </h2>
                  </div>
                </div>

                <div className="curso-flow-steps" role="tablist" aria-label="Postos do restaurante">
                  {RESTAURANT_STATIONS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      role="tab"
                      aria-selected={st.id === activeStation.id}
                      className={`curso-flow-btn ${st.id === activeStation.id ? "on" : ""}`}
                      onClick={() => setActiveStationId(st.id)}
                    >
                      <span>{st.station}</span>
                    </button>
                  ))}
                </div>

                <div className="curso-flow-detail" aria-live="polite">
                  <div className="curso-flow-meta">
                    <span className="curso-badge">{activeStation.tech}</span>
                    <code className="curso-code-ref">{activeStation.inMySuperStore}</code>
                  </div>
                  <h3>{activeStation.station}</h3>
                  <p className="curso-muted">{activeStation.why}</p>
                </div>
              </section>
            )}

            <article className="curso-prose">
              {(lesson.slug === "modulo-0-f01-o-mapa" ||
                lesson.slug === "modulo-0-f03-primeiro-projeto-django" ||
                lesson.slug === "modulo-0-f06-lendo-um-projeto-real") && (
                <SoftwareSkeletonMasterclass courseSlug={courseSlug} compact />
              )}

              {/* Topic Stepper: 1 Topic Card at a Time (Zero Wall of Text) */}
              {lesson.coreSections.length > 1 && (
                <div className="clean-topic-pills" role="tablist" aria-label="Tópicos do conceito">
                  {lesson.coreSections.map((sec, idx) => (
                    <button
                      key={sec.heading}
                      type="button"
                      role="tab"
                      aria-selected={conceptTopicIdx === idx}
                      onClick={() => setConceptTopicIdx(idx)}
                      className={`clean-topic-pill${conceptTopicIdx === idx ? " is-active" : ""}`}
                    >
                      <span>Tópico {idx + 1} de {lesson.coreSections.length}</span>
                    </button>
                  ))}
                </div>
              )}

              {lesson.coreSections
                .filter((_, idx) => idx === Math.min(conceptTopicIdx, lesson.coreSections.length - 1))
                .map((sec) => (
                  <div key={sec.heading} className="clean-topic-card">
                    <h2>{sec.heading}</h2>
                    {sec.paragraphs.map((para) => (
                      <p key={para}>{para}</p>
                    ))}

                    {sec.table && (
                      <div className="curso-table-wrap">
                        <table className="curso-table">
                          <thead>
                            <tr>
                              {sec.table.headers.map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {sec.codeBlock && (
                      <div>
                        <p className="curso-fine" style={{ marginBottom: 6 }}>
                          <strong>{sec.codeBlock.title}</strong>
                        </p>
                        <pre className="curso-code-block">
                          <code>{sec.codeBlock.code}</code>
                        </pre>
                        {sec.codeBlock.lineNotes && (
                          <ul>
                            {sec.codeBlock.lineNotes.map(([token, note]) => (
                              <li key={token}>
                                <code>{token}</code> — {note}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {lesson.coreSections.length > 1 && (
                      <div className="clean-topic-nav-row">
                        <button
                          type="button"
                          disabled={conceptTopicIdx === 0}
                          onClick={() => setConceptTopicIdx((i) => Math.max(0, i - 1))}
                          className="clean-btn-ghost"
                        >
                          ← Tópico Anterior
                        </button>
                        {conceptTopicIdx + 1 < lesson.coreSections.length ? (
                          <button
                            type="button"
                            onClick={() =>
                              setConceptTopicIdx((i) =>
                                Math.min(lesson.coreSections.length - 1, i + 1),
                              )
                            }
                            className="clean-btn-primary"
                          >
                            Próximo Tópico ({conceptTopicIdx + 2}/{lesson.coreSections.length}) →
                          </button>
                        ) : (
                          <span className="clean-topic-done-badge">
                            ✓ Todos os tópicos lidos
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </article>

            <section className="curso-sim-card" aria-labelledby="quebre-title">
              <div className="curso-sim-head">
                <div>
                  <span className="curso-badge">Quebre de propósito</span>
                  <h2 id="quebre-title">
                    <Flame size={20} aria-hidden="true" /> {lesson.breakExperiment.title}
                  </h2>
                </div>
              </div>
              <p className="curso-muted">
                <strong>Experimento:</strong> {lesson.breakExperiment.setup}
              </p>
              <p className="curso-muted" style={{ marginTop: 8 }}>
                <strong>O que falha:</strong> {lesson.breakExperiment.whatHappens}
              </p>
              <p className="curso-why" style={{ marginTop: 10 }}>
                <strong>Por que a regra existe:</strong> {lesson.breakExperiment.lessonLearned}
              </p>

              <h3 style={{ marginTop: 22, marginBottom: 10 }}>Armadilhas comuns (errado × certo)</h3>
              <div className="curso-table-wrap">
                <table className="curso-table">
                  <thead>
                    <tr>
                      <th>Errado</th>
                      <th>Certo</th>
                      <th>Por quê</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.pitfalls.map((pit) => (
                      <tr key={pit.wrong}>
                        <td>{pit.wrong}</td>
                        <td>
                          <strong>{pit.right}</strong>
                        </td>
                        <td>{pit.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {showPractice && (
          <>
            {lesson.slug === "modulo-0-f04-primeira-api-com-drf" && <HttpStatusLab />}

            <section className="curso-sim-card">
              <div className="curso-sim-head">
                <div>
                  <span className="curso-badge">Mão na massa</span>
                  <h3>Exercício com pista e gabarito</h3>
                </div>
              </div>
              {lesson.exercises.map((ex) => (
                <div key={ex.prompt} className="curso-quiz-item">
                  <p>
                    <strong>{ex.prompt}</strong>
                  </p>
                  <details style={{ marginTop: 10 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>Ver pista</summary>
                    <p className="curso-muted" style={{ marginTop: 6 }}>
                      {ex.hint}
                    </p>
                  </details>
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 600 }}>Ver gabarito</summary>
                    <p className="curso-why" style={{ marginTop: 6 }}>
                      {ex.answer}
                    </p>
                  </details>
                </div>
              ))}
            </section>

            <FillInTheBlankLab exercises={M0_FILL_BLANKS[lesson.slug] ?? []} />
          </>
        )}

        {showQuiz && (
          <>
            <section className="curso-sim-card" aria-labelledby="m0-quiz-title">
              <div className="curso-sim-head">
                <div>
                  <span className="curso-badge">Quiz da lição</span>
                  <h3 id="m0-quiz-title">
                    <HelpCircle size={20} aria-hidden="true" /> Quiz com explicação de cada erro
                  </h3>
                </div>
              </div>

              <div className="curso-quiz-list">
                {lesson.quizzes.map((q) => {
                  const picked = quizAnswers[q.id];
                  const hasPicked = typeof picked === "number";
                  const isCorrect = picked === q.correctIndex;
                  const pickedOpt = hasPicked ? q.options[picked] : undefined;

                  return (
                    <fieldset key={q.id} className="curso-quiz-item">
                      <legend>{q.question}</legend>
                      <div className="curso-quiz-options">
                        {q.options.map((opt, idx) => {
                          const selected = picked === idx;
                          const stateClass = !hasPicked
                            ? ""
                            : idx === q.correctIndex
                              ? "correct"
                              : selected
                                ? "wrong"
                                : "";
                          return (
                            <button
                              key={opt.text}
                              type="button"
                              className={`curso-quiz-opt ${selected ? "selected" : ""} ${stateClass}`}
                              aria-pressed={selected}
                              onClick={() => handlePickQuizOption(q.id, idx)}
                            >
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasPicked && (
                        <div
                          className={`curso-quiz-feedback ${isCorrect ? "ok" : "err"}`}
                          aria-live="polite"
                        >
                          <div>
                            <p>
                              <strong>{isCorrect ? "Correto!" : "Por que essa alternativa está errada:"}</strong>{" "}
                              {!isCorrect && pickedOpt?.whyNot ? `${pickedOpt.whyNot} ` : ""}
                            </p>
                            <p style={{ marginTop: 4 }}>{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </fieldset>
                  );
                })}
              </div>
            </section>

            <section className="curso-sim-card" aria-labelledby="flashcards-title">
              <div className="curso-sim-head">
                <div>
                  <span className="curso-badge">Revisão espaçada · também no painel SRS à direita</span>
                  <h3 id="flashcards-title">
                    <RotateCw size={20} aria-hidden="true" /> Fichas de revisão (clique para virar)
                  </h3>
                </div>
              </div>

              <div className="curso-deliver-grid">
                {lesson.flashcards.map((fc, idx) => {
                  const flipped = Boolean(flippedCards[idx]);
                  return (
                    <button
                      key={fc.front}
                      type="button"
                      className="curso-check-btn"
                      aria-pressed={flipped}
                      onClick={() =>
                        setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                    >
                      <div className="curso-check-body">
                        <span className="curso-badge">{flipped ? "Verso (resposta)" : "Frente (pergunta)"}</span>
                        <strong style={{ marginTop: 6 }}>
                          {flipped ? fc.back : fc.front}
                        </strong>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="curso-assumption" style={{ marginTop: 20, marginBottom: 0 }}>
                <strong>Se você só lembrar de 3 coisas desta lição:</strong>
                <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                  {lesson.threeThings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="curso-sim-card" aria-labelledby="glossario-title">
              <div className="curso-sim-head">
                <div>
                  <span className="curso-badge">Apoio rápido · 44 termos</span>
                  <h3 id="glossario-title">
                    <BookOpen size={20} aria-hidden="true" /> Glossário de Fundamentos (A–Z)
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  aria-expanded={glossaryOpen}
                  onClick={() => setGlossaryOpen((o) => !o)}
                >
                  {glossaryOpen ? "Fechar glossário" : "Abrir glossário (44 termos)"}
                </button>
              </div>

              {glossaryOpen && (
                <div>
                  <div className="curso-field" style={{ marginBottom: 14 }}>
                    <label htmlFor="glossary-search">
                      <Search size={14} aria-hidden="true" /> Filtrar termo ou associação
                    </label>
                    <input
                      id="glossary-search"
                      type="search"
                      placeholder="Ex.: ORM, webhook, venv, 409..."
                      value={glossaryQuery}
                      onChange={(e) => setGlossaryQuery(e.target.value)}
                    />
                  </div>

                  <div className="curso-table-wrap">
                    <table className="curso-table">
                      <thead>
                        <tr>
                          <th>Termo</th>
                          <th>O que é</th>
                          <th>Associação</th>
                          <th>Lição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGlossary.map((g) => (
                          <tr key={g.term}>
                            <td>
                              <strong>{g.term}</strong>
                            </td>
                            <td>{g.definition}</td>
                            <td>{g.association}</td>
                            <td>{g.lesson}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        <nav className="curso-lesson-nav" aria-label="Navegação entre lições">
          {prevLesson ? (
            <Link
              href={localePath(`/cursos/${courseSlug}/${prevLesson.slug}`, "pt")}
              className="btn btn-ghost"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {prevLesson.title}
            </Link>
          ) : (
            <Link
              href={localePath(`/cursos/${courseSlug}`, "pt")}
              className="btn btn-ghost"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar para a ementa
            </Link>
          )}

          {nextLesson && (
            <Link
              href={localePath(`/cursos/${courseSlug}/${nextLesson.slug}`, "pt")}
              className="btn btn-primary"
            >
              Próxima: {nextLesson.title}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </CourseIdeShell>
  );
}
