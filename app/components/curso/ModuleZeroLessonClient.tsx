"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  Flame,
  HelpCircle,
  Lightbulb,
  RotateCw,
  Search,
  Sparkles,
} from "lucide-react";
import {
  GLOSSARY_TERMS,
  RESTAURANT_STATIONS,
  type M0LessonData,
} from "@/app/lib/module-zero-content";
import { localePath } from "@/app/lib/i18n";
import HttpStatusLab from "./HttpStatusLab";
import NotebookLMMediaBlock from "./NotebookLMMediaBlock";

const STORAGE_KEY = "maldivas-curso-m0-done-v1";

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
    /* localStorage indisponível — segue sem persistir */
  }
}

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
  const [doneSlugs, setDoneSlugs] = useState<string[]>([]);
  const [revealedPredicts, setRevealedPredicts] = useState<Record<number, boolean>>({});
  const [activeStationId, setActiveStationId] = useState<string>(RESTAURANT_STATIONS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");

  useEffect(() => {
    setDoneSlugs(loadDoneSlugs());
  }, []);

  const isCompleted = doneSlugs.includes(lesson.slug);

  function toggleCompleted() {
    setDoneSlugs((prev) => {
      const next = prev.includes(lesson.slug)
        ? prev.filter((s) => s !== lesson.slug)
        : [...prev, lesson.slug];
      saveDoneSlugs(next);
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

  return (
    <div className="curso-lesson-body">
      {/* Barra de progresso + PDF */}
      <aside className="curso-progress-bar-box" aria-label="Progresso na trilha Fundamentos">
        <div className="curso-progress-top">
          <div>
            <strong>
              Módulo 0 · Lição {lesson.code} ({doneSlugs.length}/6 lições concluídas)
            </strong>
            <p className="curso-fine">{lesson.metaNote}</p>
          </div>
          <div className="curso-progress-actions">
            <a
              href="/cursos/construa-seu-marketplace-modulo-0-fundamentos.pdf"
              download="construa-seu-marketplace-modulo-0-fundamentos.pdf"
              className="btn btn-ghost curso-btn-sm"
            >
              <Download size={15} aria-hidden="true" />
              Baixar PDF do Módulo 0
            </a>
            <button
              type="button"
              className={`btn curso-btn-sm ${isCompleted ? "btn-primary" : "btn-ghost"}`}
              onClick={toggleCompleted}
              aria-pressed={isCompleted}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              {isCompleted ? "Lição concluída" : "Marcar como concluída"}
            </button>
          </div>
        </div>
        <div
          className="curso-progress-track"
          role="progressbar"
          aria-valuenow={Math.round((doneSlugs.length / 6) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="curso-progress-fill"
            style={{ width: `${Math.round((doneSlugs.length / 6) * 100)}%` }}
          />
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

      {/* Material multimídia do NotebookLM (vídeo, áudio, slides e mapa mental) */}
      <NotebookLMMediaBlock media={lesson.notebookMedia} />

      {/* 1. Antes de ler: preveja */}
      <section className="curso-sim-card" aria-labelledby="predict-title">
        <div className="curso-sim-head">
          <div>
            <span className="curso-badge">Passo 1 · Antes de ler: preveja</span>
            <h2 id="predict-title">
              <Lightbulb size={20} aria-hidden="true" /> Tente responder antes de abrir o gabarito
            </h2>
          </div>
        </div>
        <p className="curso-muted">
          Errar uma previsão mostra exatamente onde está a lacuna. Chute mentalmente ou no papel
          antes de revelar a resposta do professor.
        </p>

        <div className="curso-quiz-list">
          {lesson.predict.map((p, idx) => {
            const open = Boolean(revealedPredicts[idx]);
            return (
              <div key={p.question} className="curso-quiz-item">
                <p>
                  <strong>{p.question}</strong>
                </p>
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  style={{ marginTop: 10 }}
                  aria-expanded={open}
                  onClick={() =>
                    setRevealedPredicts((prev) => ({ ...prev, [idx]: !prev[idx] }))
                  }
                >
                  <Eye size={15} aria-hidden="true" />
                  {open ? "Esconder resposta" : "Ver resposta do professor"}
                </button>
                {open && (
                  <p className="curso-why" style={{ marginTop: 10 }}>
                    {p.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Mapa interativo do restaurante na F01 */}
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

      {/* Conteúdo principal */}
      <article className="curso-prose">
        {lesson.coreSections.map((sec) => (
          <div key={sec.heading} style={{ marginBottom: 28 }}>
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
          </div>
        ))}
      </article>

      {/* Laboratório interativo de Status HTTP na F04 */}
      {lesson.slug === "modulo-0-f04-primeira-api-com-drf" && <HttpStatusLab />}

      {/* Quebre de propósito + Armadilhas */}
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

      {/* Exercícios práticos */}
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

      {/* Quiz explicando cada alternativa errada */}
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
                        onClick={() =>
                          setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))
                        }
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

      {/* Fichas de revisão (Flashcards) + 3 coisas */}
      <section className="curso-sim-card" aria-labelledby="flashcards-title">
        <div className="curso-sim-head">
          <div>
            <span className="curso-badge">Revisão espaçada · 1, 3 e 7 dias</span>
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

      {/* Glossário A-Z pesquisável */}
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

      {/* Navegação entre lições */}
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
  );
}

