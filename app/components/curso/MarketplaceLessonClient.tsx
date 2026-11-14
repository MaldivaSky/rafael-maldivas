"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { courseBySlug, lessonBySlug } from "@/app/lib/courses";
import {
  computeLessonMastery,
  type IdeLessonStage,
} from "@/app/lib/course-workspace";
import type { MarketplaceLessonData } from "@/app/lib/marketplace-lessons-content";
import { localePath } from "@/app/lib/i18n";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { CourseIdeShell } from "./CourseIdeShell";
import { SoftwareSkeletonMasterclass } from "./SoftwareSkeletonMasterclass";
import NotebookLMMediaBlock from "./NotebookLMMediaBlock";
import LessonVisualDiagram from "./LessonVisualDiagram";
import {
  ExplainedQuizBlock,
  FillInTheBlankLab,
  PredictInteractive,
} from "./InteractivePracticeLab";
import FinalExamCertificate from "./FinalExamCertificate";
import CopyCodeBlock from "./CopyCodeBlock";
import ProjectSubmissionEvaluator from "./ProjectSubmissionEvaluator";

export default function MarketplaceLessonClient({
  courseSlug,
  lesson,
  totalLessons,
  prevLesson,
  nextLesson,
}: {
  courseSlug: string;
  lesson: MarketplaceLessonData;
  totalLessons: number;
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
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const canonicalLesson = useMemo(() => {
    const course = courseBySlug(courseSlug);
    const found = course ? lessonBySlug(course, lesson.slug) : undefined;
    return (
      found ?? {
        id: lesson.slug,
        slug: lesson.slug,
        moduleNumber: 2,
        title: `${lesson.code} — ${lesson.metaNote}`,
        summary: lesson.oneSentence,
        durationMin: 90,
        status: "gratuita" as const,
        prerequisites: [],
        objectives: lesson.threeThings,
      }
    );
  }, [courseSlug, lesson]);

  const doneSlugs = workspace.completedSlugs;
  const isCompleted = doneSlugs.includes(lesson.slug);
  const mastery = useMemo(
    () => computeLessonMastery(lesson.slug, workspace),
    [lesson.slug, workspace],
  );
  const pct = Math.min(100, Math.round((doneSlugs.length / totalLessons) * 100));

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
            {lesson.predict.length > 0 && <PredictInteractive items={lesson.predict} />}
          </>
        )}

        {showConcept && (
          <>
            <LessonVisualDiagram diagramId={lesson.diagramId} />

            {lesson.slug === "modulo-2-modelo-de-dados" && (
              <SoftwareSkeletonMasterclass courseSlug={courseSlug} compact />
            )}

            <article className="curso-prose">
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
                  <section key={sec.heading} className="clean-topic-card">
                    <h2>{sec.heading}</h2>
                    {sec.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}

                    {sec.codeBlocks?.map((cb, cbIdx) => (
                      <CopyCodeBlock
                        key={`${sec.heading}-cb-${cbIdx}`}
                        title={cb.title}
                        code={cb.code}
                      />
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
                  </section>
                ))}

              {lesson.breakExperiment && (
                <section className="curso-break-box" aria-labelledby="break-title">
                  <h2 id="break-title">
                    <Flame size={19} aria-hidden="true" /> {lesson.breakExperiment.title}
                  </h2>
                  <p>
                    <strong>Cenário:</strong> {lesson.breakExperiment.setup}
                  </p>
                  <p>
                    <strong>O que acontece:</strong> {lesson.breakExperiment.whatHappens}
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Lição aprendida:</strong> {lesson.breakExperiment.lessonLearned}
                  </p>
                </section>
              )}

              {lesson.pitfalls.length > 0 && (
                <section style={{ marginTop: 28 }}>
                  <h2>Armadilhas comuns (certo × errado)</h2>
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
                        {lesson.pitfalls.map((pit, idx) => (
                          <tr key={idx}>
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
              )}
            </article>
          </>
        )}

        {showPractice && lesson.fillBlanks.length > 0 && (
          <FillInTheBlankLab exercises={lesson.fillBlanks} />
        )}

        {showPractice && lesson.slug === "modulo-7-projeto-final-certificado" && (
          <ProjectSubmissionEvaluator />
        )}

        {showQuiz && (
          <>
            {lesson.quizzes.length > 0 && (
              <ExplainedQuizBlock
                title={`Quiz da aula ${lesson.code}`}
                items={lesson.quizzes}
                onComplete={(score, total) =>
                  recordQuizScore(lesson.slug, canonicalLesson.id, score, total)
                }
              />
            )}

            {lesson.flashcards.length > 0 && (
              <section className="curso-sim-card" aria-labelledby="flash-title">
                <div className="curso-sim-head">
                  <div>
                    <span className="curso-badge">Revisão ativa · também no painel SRS à direita</span>
                    <h2 id="flash-title">
                      <RotateCw size={20} aria-hidden="true" /> Fichas de revisão (clique para virar)
                    </h2>
                  </div>
                </div>
                <div className="curso-flash-grid">
                  {lesson.flashcards.map((fc, idx) => {
                    const flipped = Boolean(flippedCards[idx]);
                    return (
                      <button
                        key={fc.front}
                        type="button"
                        className={`curso-flash-card ${flipped ? "flipped" : ""}`}
                        aria-pressed={flipped}
                        onClick={() =>
                          setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                      >
                        <span className="curso-flash-side">
                          {flipped ? "Resposta" : "Pergunta"}
                        </span>
                        <strong>{flipped ? fc.back : fc.front}</strong>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {lesson.slug === "modulo-7-projeto-final-certificado" && (
              <FinalExamCertificate />
            )}

            {lesson.threeThings.length > 0 && (
              <section className="curso-panel" aria-labelledby="three-title">
                <h2 id="three-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={19} aria-hidden="true" /> Se você só lembrar de três coisas
                </h2>
                <ol className="curso-bullet-list" style={{ marginTop: 12 }}>
                  {lesson.threeThings.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}

        <nav className="curso-lesson-nav" aria-label="Navegação entre aulas">
          {prevLesson ? (
            <Link
              href={localePath(`/cursos/${courseSlug}/${prevLesson.slug}`, "pt")}
              className="btn btn-ghost"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Anterior: {prevLesson.title}
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

          {nextLesson ? (
            <Link
              href={localePath(`/cursos/${courseSlug}/${nextLesson.slug}`, "pt")}
              className="btn btn-primary"
            >
              Próxima: {nextLesson.title}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href={localePath(`/cursos/${courseSlug}`, "pt")}
              className="btn btn-primary"
            >
              Concluir e voltar à ementa
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </CourseIdeShell>
  );
}
