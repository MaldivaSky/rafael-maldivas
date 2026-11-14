"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Code2,
  Compass,
  FolderTree,
  Home,
  Layers,
  Loader2,
  Menu,
  Search,
  Sparkles,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import {
  allCourseLessons,
  courseBySlug,
  type CourseLesson,
} from "@/app/lib/courses";
import {
  COURSE_LEVELS,
  getCourseLevelSpec,
  type CourseDifficultyLevel,
} from "@/app/lib/course-levels";
import {
  ENGINEERING_ACTS,
  getLessonQuestBriefing,
  type ArenaStationType,
} from "@/app/lib/course-game-engine";
import {
  computeCourseGamification,
  computeLessonMastery,
  type IdeLessonStage,
  type SrsRating,
  type WorkspacePreferences,
  type WorkspaceState,
} from "@/app/lib/course-workspace";
import { GLOSSARY_TERMS } from "@/app/lib/module-zero-content";
import { MYSUPERSTORE_REPO_FILES, type RepoFileNode } from "@/app/lib/mysuperstore-repo";
import { getRecommendedTerminalMission } from "@/app/lib/terminal-sim";
import type { SyncStatus } from "@/app/hooks/useCourseWorkspace";
import { CourseAdmissionGate } from "./CourseAdmissionGate";
import { IdeCodeEditor } from "./IdeCodeEditor";

interface CourseIdeShellProps {
  courseSlug: string;
  lesson: CourseLesson;
  workspace: WorkspaceState;
  syncStatus: SyncStatus;
  isAuthenticated: boolean;
  isAdmissionActivated?: boolean;
  admissionLoading?: boolean;
  studentProfile?: {
    id: string;
    email: string;
    nome: string;
    recommendedLevel?: string;
  } | null;
  activeStage: IdeLessonStage;
  onChangeStage: (stage: IdeLessonStage) => void;
  onUpdatePreferences: (patch: Partial<WorkspacePreferences>) => void;
  onUpdateCodeDraft: (slug: string, code: string) => void;
  onRecordLabResult: (slug: string, passed: boolean) => void;
  onUpdateNotes: (slug: string, text: string) => void;
  onReviewSrsCard: (cardId: string, rating: SrsRating) => void;
  onToggleDeployStep: (stepId: string) => void;
  onRecordTerminalProgress?: (stepIds: string[], missionIds: string[]) => void;
  children: ReactNode;
}

const STAGE_SEQUENCE: Array<{
  id: IdeLessonStage;
  stepNum: number;
  label: string;
  shortDesc: string;
}> = [
  {
    id: "predict",
    stepNum: 1,
    label: "1. Contexto & Vídeo",
    shortDesc: "Visão geral, multimídia e hipótese",
  },
  {
    id: "concept",
    stepNum: 2,
    label: "2. Arquitetura & Código",
    shortDesc: "Diagrama visual e explicação guiada",
  },
  {
    id: "practice",
    stepNum: 3,
    label: "3. Prática & Arena",
    shortDesc: "Experimento prático e simulador",
  },
  {
    id: "quiz",
    stepNum: 4,
    label: "4. Desafio (+100 XP)",
    shortDesc: "Validação rápida para avançar",
  },
];

export function CourseIdeShell({
  courseSlug,
  lesson,
  workspace,
  isAdmissionActivated = false,
  admissionLoading = false,
  studentProfile = null,
  activeStage,
  onChangeStage,
  onUpdatePreferences,
  children,
}: CourseIdeShellProps) {
  const course = useMemo(() => courseBySlug(courseSlug), [courseSlug]);
  const allLessons = useMemo(
    () => (course ? allCourseLessons(course) : []),
    [course],
  );
  const centerPaneRef = useRef<HTMLDivElement | null>(null);

  // Clean UX: Sidebar drawer starts closed so 100% of attention is on the current step
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"curriculum" | "repo" | "glossary">(
    "curriculum",
  );
  const [selectedRepoFile, setSelectedRepoFile] = useState<RepoFileNode | null>(
    null,
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const selectedLevel = workspace.preferences.selectedLevel;
  const levelSpec = getCourseLevelSpec(selectedLevel);
  const gamification = useMemo(
    () => computeCourseGamification(workspace, levelSpec.recommendedSlugs),
    [levelSpec.recommendedSlugs, workspace],
  );
  const mastery = useMemo(
    () => computeLessonMastery(lesson.slug, workspace),
    [lesson.slug, workspace],
  );
  const briefing = useMemo(
    () => getLessonQuestBriefing(lesson.slug),
    [lesson.slug],
  );
  const activeActSpec = useMemo(
    () =>
      ENGINEERING_ACTS.find((a) => a.actNumber === briefing.actNumber) ??
      ENGINEERING_ACTS[0],
    [briefing.actNumber],
  );

  const trackLessons = useMemo(() => {
    const map = new Map(allLessons.map((l) => [l.slug, l]));
    return levelSpec.recommendedSlugs
      .map((slug) => map.get(slug))
      .filter((l): l is CourseLesson => Boolean(l));
  }, [allLessons, levelSpec.recommendedSlugs]);

  const extraLessons = useMemo(() => {
    const trackSet = new Set(levelSpec.recommendedSlugs);
    return allLessons.filter((l) => !trackSet.has(l.slug));
  }, [allLessons, levelSpec.recommendedSlugs]);

  const currentTrackIndex = trackLessons.findIndex((l) => l.slug === lesson.slug);
  const nextTrackLesson =
    currentTrackIndex >= 0 && currentTrackIndex + 1 < trackLessons.length
      ? trackLessons[currentTrackIndex + 1]
      : null;

  const recommendedMission = getRecommendedTerminalMission(lesson.slug);

  function buildStationHref(station: ArenaStationType) {
    const base = `/pt/cursos/${courseSlug}/pratica?estacao=${station}&aula=${lesson.slug}`;
    if (station === "terminal") {
      return `${base}&missao=${recommendedMission}`;
    }
    return base;
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        if (sidebarOpen) setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen, sidebarOpen]);

  function selectStageAndScroll(nextStage: IdeLessonStage) {
    onChangeStage(nextStage);
    if (centerPaneRef.current) {
      centerPaneRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    const lessonsMatched = allLessons
      .filter(
        (l) =>
          !q ||
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q),
      )
      .slice(0, 6);
    const termsMatched = GLOSSARY_TERMS.filter(
      (g) =>
        !q ||
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q),
    ).slice(0, 5);
    return { lessonsMatched, termsMatched };
  }, [allLessons, paletteQuery]);

  // 1. Loading state while checking admission cookie/session
  if (admissionLoading) {
    return (
      <div className="clean-lesson-loading">
        <Loader2 className="w-6 h-6 animate-spin ide-text-cyan" aria-hidden="true" />
        <p>Carregando ambiente de estudo...</p>
      </div>
    );
  }

  // 2. Mandatory Admission & Email Activation Gate (No unauthenticated access allowed)
  if (!isAdmissionActivated) {
    return (
      <CourseAdmissionGate
        targetPath={`/pt/cursos/${courseSlug}/${lesson.slug}`}
        initialStudent={studentProfile}
      />
    );
  }

  return (
    <div className="clean-course-workspace">
      {/* Single-Row Minimalist Topbar (56px, zero clutter) */}
      <header className="clean-topbar" role="banner">
        <div className="clean-topbar-left">
          <button
            type="button"
            className="clean-topbar-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Abrir mapa de aulas e arquivos"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Trilha ({gamification.trackCompleted}/{gamification.trackTotal})</span>
          </button>

          <Link
            href={`/pt/cursos/${courseSlug}`}
            className="clean-topbar-back"
            title="Voltar à página inicial do curso"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Mapa</span>
          </Link>

          <span className="clean-topbar-divider" aria-hidden="true" />

          <strong className="clean-topbar-title">{lesson.title}</strong>
        </div>

        <div className="clean-topbar-right">
          <label className="clean-level-select-wrap" title="Alterar nível da trilha">
            <span className="sr-only">Nível da trilha</span>
            <select
              value={selectedLevel}
              onChange={(e) =>
                onUpdatePreferences({
                  selectedLevel: e.target.value as CourseDifficultyLevel,
                })
              }
              className="clean-level-select"
            >
              {Object.values(COURSE_LEVELS).map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  Trilha: {lvl.shortTitle}
                </option>
              ))}
            </select>
          </label>

          <Link
            href={buildStationHref(briefing.primaryStation)}
            className="clean-topbar-arena-btn"
          >
            <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Arena Prática</span>
          </Link>

          <div className="clean-xp-pill" title={`Patente: ${gamification.rankTitle}`}>
            <Award className="w-3.5 h-3.5 ide-text-amber" aria-hidden="true" />
            <span>{gamification.xp} XP</span>
          </div>

          <button
            type="button"
            className="clean-topbar-icon-btn"
            onClick={() => setPaletteOpen(true)}
            title="Buscar (Ctrl+K)"
            aria-label="Buscar no curso"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </button>

          {studentProfile && (
            <span className="clean-verified-student" title={studentProfile.email}>
              <UserCheck className="w-3.5 h-3.5 ide-text-emerald" aria-hidden="true" />
              <span className="hidden sm:inline">
                {studentProfile.nome.split(" ")[0] || "Aluno"}
              </span>
            </span>
          )}
        </div>
      </header>

      {/* Slide-Over Curriculum / Repo / Glossary Drawer (Only visible when clicked) */}
      {sidebarOpen && (
        <div
          className="clean-drawer-backdrop"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="clean-drawer"
            aria-label="Navegação do Curso"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="clean-drawer-head">
              <strong>Menu da Jornada</strong>
              <button
                type="button"
                className="clean-topbar-icon-btn"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="ide-sidebar-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={sidebarMode === "curriculum"}
                className={`ide-sidebar-tab${sidebarMode === "curriculum" ? " is-active" : ""}`}
                onClick={() => setSidebarMode("curriculum")}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Aulas ({trackLessons.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarMode === "repo"}
                className={`ide-sidebar-tab${sidebarMode === "repo" ? " is-active" : ""}`}
                onClick={() => setSidebarMode("repo")}
              >
                <FolderTree className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Código Real</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarMode === "glossary"}
                className={`ide-sidebar-tab${sidebarMode === "glossary" ? " is-active" : ""}`}
                onClick={() => setSidebarMode("glossary")}
              >
                <span>Glossário</span>
              </button>
            </div>

            {sidebarMode === "curriculum" && (
              <div className="ide-sidebar-scroll">
                <div className="ide-module-group">
                  <div className="ide-module-heading">
                    TRILHA {levelSpec.shortTitle.toUpperCase()} ({gamification.trackCompleted}/
                    {gamification.trackTotal})
                  </div>
                  <ul className="ide-lesson-list">
                    {trackLessons.map((item, idx) => {
                      const isCurrent = item.slug === lesson.slug;
                      const isDone = workspace.completedSlugs.includes(item.slug);
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/pt/cursos/${courseSlug}/${item.slug}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`ide-lesson-link${isCurrent ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                          >
                            {isDone ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 ide-text-emerald shrink-0"
                                aria-label="Fase concluída"
                              />
                            ) : (
                              <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            )}
                            <span>
                              <strong>Fase {idx + 1}:</strong> {item.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {extraLessons.length > 0 && (
                  <details className="ide-extra-modules-details">
                    <summary className="ide-module-heading" style={{ cursor: "pointer" }}>
                      + Aulas Complementares ({extraLessons.length})
                    </summary>
                    <ul className="ide-lesson-list" style={{ marginTop: 6 }}>
                      {extraLessons.map((item) => {
                        const isCurrent = item.slug === lesson.slug;
                        const isDone = workspace.completedSlugs.includes(item.slug);
                        return (
                          <li key={item.slug}>
                            <Link
                              href={`/pt/cursos/${courseSlug}/${item.slug}`}
                              onClick={() => setSidebarOpen(false)}
                              className={`ide-lesson-link${isCurrent ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                            >
                              {isDone ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 ide-text-emerald shrink-0"
                                />
                              ) : (
                                <Circle className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                )}
              </div>
            )}

            {sidebarMode === "repo" && (
              <div className="ide-sidebar-scroll">
                <p className="ide-sidebar-help">
                  Arquivos reais do <strong>MySuperStore</strong>:
                </p>
                <ul className="ide-repo-list">
                  {MYSUPERSTORE_REPO_FILES.map((file) => {
                    const isRelevant = file.lessonSlugs.includes(lesson.slug);
                    return (
                      <li key={file.path}>
                        <button
                          type="button"
                          className={`ide-repo-item${isRelevant ? " is-relevant" : ""}`}
                          onClick={() => {
                            setSelectedRepoFile(file);
                            setSidebarOpen(false);
                          }}
                        >
                          <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{file.path}</span>
                          {isRelevant && <span className="ide-repo-tag">Desta aula</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {sidebarMode === "glossary" && (
              <div className="ide-sidebar-scroll">
                <ul className="ide-glossary-mini-list">
                  {GLOSSARY_TERMS.map((g) => (
                    <li key={g.term} className="ide-glossary-mini-item">
                      <strong>{g.term}</strong>
                      <p>{g.definition}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Main Centered Learning Stage (Max-width 860px, Clean Micro-Steps) */}
      <main className="clean-lesson-canvas" ref={centerPaneRef}>
        {/* Sleek Context & 4-Step Progress Card */}
        <section className="clean-lesson-hero-card" aria-label="Etapa atual da aula">
          <div className="clean-act-strip">
            <span className="clean-act-pill">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" /> {briefing.phaseBadge}
            </span>
            <span className="clean-act-process">
              {activeActSpec.softwareProcessName}
            </span>
          </div>

          {/* 4-Step Interactive Chapter Selector (1 Step at a Time = Zero Cognitive Overload) */}
          <nav className="clean-chapter-tabs" aria-label="Passos desta aula">
            {STAGE_SEQUENCE.map((st) => {
              const isCurrent = activeStage === st.id;
              const isDone =
                (st.id === "predict" && mastery.completed) ||
                (st.id === "concept" && mastery.completed) ||
                (st.id === "practice" && mastery.labPassed) ||
                (st.id === "quiz" && mastery.quizPassed);

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => selectStageAndScroll(st.id)}
                  className={`clean-chapter-tab${isCurrent ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                >
                  <span className="clean-chapter-num">
                    {isDone ? "✓" : st.stepNum}
                  </span>
                  <div className="clean-chapter-meta">
                    <strong>{st.label.split(". ")[1]}</strong>
                    <span>{st.shortDesc}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Compact 2-Line Context Summary Only on Step 1 */}
          {activeStage === "predict" && (
            <div className="clean-briefing-callout">
              <p>
                <strong>Por que esta etapa vem agora:</strong> {briefing.whyBeforeCode}
              </p>
              <p style={{ marginTop: 4 }}>
                <strong>Entrega prática desta aula:</strong> {briefing.whatYouWillBuild}
              </p>
            </div>
          )}
        </section>

        {selectedRepoFile && (
          <div className="ide-repo-modal-inline" style={{ marginBottom: 20 }}>
            <div className="ide-repo-modal-header">
              <div>
                <span className="ide-file-badge">MySuperStore Reference</span>
                <strong>{selectedRepoFile.path}</strong>
                <p className="ide-muted-xs">{selectedRepoFile.summary}</p>
              </div>
              <button
                type="button"
                className="ide-btn ide-btn-xs ide-btn-ghost"
                onClick={() => setSelectedRepoFile(null)}
              >
                Fechar arquivo
              </button>
            </div>
            <IdeCodeEditor
              value={selectedRepoFile.content}
              readOnly
              language={selectedRepoFile.language}
              minHeight={220}
            />
          </div>
        )}

        {/* Active Step Content */}
        <div className="clean-stage-content">{children}</div>

        {/* Focused Arena Mission Card (Only shown on Step 3 "practice") */}
        {activeStage === "practice" && (
          <section
            className="clean-arena-mission-card"
            aria-label="Missão Prática em Tela Cheia"
          >
            <div className="clean-arena-mission-body">
              <span className="clean-act-pill">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Arena Interativa
                Dedicada
              </span>
              <h3>{briefing.primaryStationTitle}</h3>
              <p>{briefing.primaryStationWhy}</p>

              <div className="clean-arena-actions">
                <Link
                  href={buildStationHref(briefing.primaryStation)}
                  className="clean-btn-primary"
                >
                  <Wrench className="w-4 h-4" aria-hidden="true" />
                  <span>{briefing.primaryStationCta}</span>
                </Link>

                {briefing.secondaryStation && (
                  <Link
                    href={buildStationHref(briefing.secondaryStation.station)}
                    className="clean-btn-secondary"
                  >
                    <span>{briefing.secondaryStation.label}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {briefing.unlocksDownloadKit && (
                <div className="clean-starter-kit-box">
                  <strong>🏠 {briefing.unlocksDownloadKit.title}</strong>
                  <p>{briefing.unlocksDownloadKit.whatIsIt}</p>
                  <ol>
                    {briefing.unlocksDownloadKit.howToUseSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <Link
                    href={briefing.unlocksDownloadKit.href}
                    className="clean-btn-primary"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>{briefing.unlocksDownloadKit.buttonLabel}</span>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Clean Step-by-Step Bottom Navigation Bar */}
        <footer className="clean-step-footer" aria-label="Navegação entre etapas">
          {activeStage === "predict" && (
            <div className="clean-step-footer-row">
              <span className="clean-step-footer-hint">
                Passo 1 de 4 · Contexto &amp; Multimídia
              </span>
              <button
                type="button"
                className="clean-btn-primary"
                onClick={() => selectStageAndScroll("concept")}
              >
                <span>Continuar para o Passo 2: Arquitetura &amp; Código</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {activeStage === "concept" && (
            <div className="clean-step-footer-row">
              <button
                type="button"
                className="clean-btn-ghost"
                onClick={() => selectStageAndScroll("predict")}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar ao Passo 1</span>
              </button>
              <button
                type="button"
                className="clean-btn-primary"
                onClick={() => selectStageAndScroll("practice")}
              >
                <span>Continuar para o Passo 3: Prática &amp; Arena</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {activeStage === "practice" && (
            <div className="clean-step-footer-row">
              <button
                type="button"
                className="clean-btn-ghost"
                onClick={() => selectStageAndScroll("concept")}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar ao Passo 2</span>
              </button>
              <button
                type="button"
                className="clean-btn-primary"
                onClick={() => selectStageAndScroll("quiz")}
              >
                <span>Continuar para o Passo 4: Desafio Final (+100 XP)</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {(activeStage === "quiz" || activeStage === "all") && (
            <div className="clean-step-footer-row">
              <button
                type="button"
                className="clean-btn-ghost"
                onClick={() => selectStageAndScroll("practice")}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar ao Passo 3 (Prática)</span>
              </button>
              {nextTrackLesson ? (
                <Link
                  href={`/pt/cursos/${courseSlug}/${nextTrackLesson.slug}`}
                  className="clean-btn-primary"
                >
                  <span>Próxima Aula: {nextTrackLesson.title}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  href={`/pt/cursos/${courseSlug}/certificado`}
                  className="clean-btn-primary"
                >
                  <Award className="w-4 h-4" aria-hidden="true" />
                  <span>Ir para Exame Final &amp; Certificado</span>
                </Link>
              )}
            </div>
          )}
        </footer>
      </main>

      {/* Command Palette Modal (Ctrl+K) */}
      {paletteOpen && (
        <div
          className="ide-palette-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Busca rápida no curso"
          onClick={() => setPaletteOpen(false)}
        >
          <div className="ide-palette-box" onClick={(e) => e.stopPropagation()}>
            <div className="ide-palette-input-row">
              <Search className="w-4 h-4 ide-muted" aria-hidden="true" />
              <input
                type="search"
                autoFocus
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Buscar aula, comando ou conceito..."
                className="ide-palette-input"
              />
              <button
                type="button"
                className="ide-btn ide-btn-xs ide-btn-ghost"
                onClick={() => setPaletteOpen(false)}
              >
                ESC
              </button>
            </div>

            <div className="ide-palette-results">
              <div className="ide-palette-group-title">Aulas</div>
              {paletteResults.lessonsMatched.map((l) => (
                <Link
                  key={l.slug}
                  href={`/pt/cursos/${courseSlug}/${l.slug}`}
                  className="ide-palette-item"
                  onClick={() => setPaletteOpen(false)}
                >
                  <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div>
                    <strong>{l.title}</strong>
                    <p>{l.summary}</p>
                  </div>
                </Link>
              ))}

              <div className="ide-palette-group-title">Glossário</div>
              {paletteResults.termsMatched.map((g) => (
                <div key={g.term} className="ide-palette-item">
                  <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div>
                    <strong>{g.term}</strong>
                    <p>{g.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
