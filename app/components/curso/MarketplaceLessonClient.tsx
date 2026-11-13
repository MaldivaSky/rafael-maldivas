"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  RotateCw,
  Sparkles,
} from "lucide-react";
import type { MarketplaceLessonData } from "@/app/lib/marketplace-lessons-content";
import { localePath } from "@/app/lib/i18n";
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

const STORAGE_KEY = "maldivas-curso-done-v1";

function loadDoneSlugs(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveDoneSlugs(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* localStorage indisponível */
  }
}

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
  const [doneSlugs, setDoneSlugs] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setDoneSlugs(loadDoneSlugs());
  }, []);

  const isCompleted = doneSlugs.includes(lesson.slug);

  function toggleCompleted() {
    setDoneSlugs((prev) => {
      const willComplete = !prev.includes(lesson.slug);
      const next = willComplete
        ? [...prev, lesson.slug]
        : prev.filter((s) => s !== lesson.slug);
      saveDoneSlugs(next);
      fetch("/api/aluno/progresso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursoSlug: courseSlug,
          licaoId: lesson.slug,
          status: willComplete ? "concluida" : "em_andamento",
        }),
      }).catch(() => undefined);
      return next;
    });
  }

  const pct = Math.min(100, Math.round((doneSlugs.length / totalLessons) * 100));

  return (
    <div className="curso-lesson-body">
      {/* Barra de progresso global do curso */}
      <aside className="curso-progress-bar-box" aria-label="Progresso no curso">
        <div className="curso-progress-top">
          <div>
            <strong>
              Aula {lesson.code} · {doneSlugs.length}/{totalLessons} aulas concluídas ({pct}%)
            </strong>
            <p className="curso-fine">{lesson.metaNote}</p>
          </div>
          <div className="curso-progress-actions">
            <button
              type="button"
              className={`btn curso-btn-sm ${isCompleted ? "btn-primary" : "btn-ghost"}`}
              onClick={toggleCompleted}
              aria-pressed={isCompleted}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              {isCompleted ? "Aula concluída" : "Marcar como concluída"}
            </button>
          </div>
        </div>
        <div
          className="curso-progress-track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="curso-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </aside>

      {/* Guia da aula */}
      <section className="curso-panel">
        <p className="curso-assumption" style={{ marginBottom: 0 }}>
          <strong>Em uma frase:</strong> {lesson.oneSentence}
          <br />
          <strong>Pergunta guia:</strong> {lesson.guideQuestion}
        </p>
      </section>

      {/* Multimídia do NotebookLM */}
      <NotebookLMMediaBlock media={lesson.notebookMedia} />

      {/* Passo 1: Preveja antes de ler (interativo) */}
      {lesson.predict.length > 0 && (
        <PredictInteractive items={lesson.predict} />
      )}

      {/* Esquema visual interativo da aula */}
      <LessonVisualDiagram diagramId={lesson.diagramId} />

      {/* Conteúdo principal */}
      <article className="curso-prose">
        {lesson.coreSections.map((sec) => (
          <section key={sec.heading} style={{ marginBottom: 28 }}>
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
          </section>
        ))}

        {/* Quebre de propósito */}
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

        {/* Armadilhas */}
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

      {/* Preenchimento de lacunas com feedback visual */}
      {lesson.fillBlanks.length > 0 && (
        <FillInTheBlankLab exercises={lesson.fillBlanks} />
      )}

      {/* Quiz com feedback imediato e whyNot */}
      {lesson.quizzes.length > 0 && (
        <ExplainedQuizBlock
          title={`Quiz da aula ${lesson.code}`}
          items={lesson.quizzes}
        />
      )}

      {/* Fichas de revisão */}
      {lesson.flashcards.length > 0 && (
        <section className="curso-sim-card" aria-labelledby="flash-title">
          <div className="curso-sim-head">
            <div>
              <span className="curso-badge">Revisão ativa · 1, 3 e 7 dias</span>
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

      {/* Exame Final 80%+ e Certificado Profissional na aula final */}
      {lesson.slug === "modulo-7-projeto-final-certificado" && (
        <>
          <ProjectSubmissionEvaluator />
          <FinalExamCertificate />
        </>
      )}

      {/* 3 pontos-chave */}
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

      {/* Navegação entre aulas */}
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
  );
}

