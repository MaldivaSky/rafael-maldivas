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
  FlipHorizontal2,
  FolderTree,
  Globe,
  Home,
  Layers,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  TerminalSquare,
  Wrench,
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
import { COURSE_LABS } from "@/app/lib/course-labs";
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
import GoogleSignInButton from "@/app/components/auth/GoogleSignInButton";
import { IdeCodeEditor } from "./IdeCodeEditor";

interface CourseIdeShellProps {
  courseSlug: string;
  lesson: CourseLesson;
  workspace: WorkspaceState;
  syncStatus: SyncStatus;
  isAuthenticated: boolean;
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
    label: "1. Desafio Inicial",
    shortDesc: "Pense antes da resposta",
  },
  {
    id: "concept",
    stepNum: 2,
    label: "2. Conceito, Vídeo & Planta",
    shortDesc: "Estúdio multimídia, diagramas e código",
  },
  {
    id: "practice",
    stepNum: 3,
    label: "3. Lab & Quebra-Código",
    shortDesc: "Teste hipóteses e experimente",
  },
  {
    id: "quiz",
    stepNum: 4,
    label: "4. Boss Quiz (+100 XP)",
    shortDesc: "Valide e desbloqueie a próxima fase",
  },
];

export function CourseIdeShell({
  courseSlug,
  lesson,
  workspace,
  syncStatus,
  isAuthenticated,
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMode, setSidebarMode] = useState<"curriculum" | "repo" | "glossary">(
    "curriculum",
  );
  const [selectedRepoFile, setSelectedRepoFile] = useState<RepoFileNode | null>(
    null,
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const focusMode = workspace.preferences.focusMode;
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

  // Track-specific ordered lessons vs extra lessons
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
  const prevTrackLesson =
    currentTrackIndex > 0 ? trackLessons[currentTrackIndex - 1] : null;

  const labForLesson =
    COURSE_LABS[lesson.slug] ?? Object.values(COURSE_LABS)[0];
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
      } else if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen]);

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

  const activeStageSpec = STAGE_SEQUENCE.find((s) => s.id === activeStage);

  return (
    <div className={`ide-shell${focusMode ? " is-focus-mode" : ""}`}>
      {/* Top Game HUD Bar */}
      <header className="ide-topbar" role="banner">
        <div className="ide-topbar-left">
          <button
            type="button"
            className="ide-icon-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Recolher mapa da trilha" : "Abrir mapa da trilha"}
            aria-label="Alternar barra lateral"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <Link
            href={`/pt/cursos/${courseSlug}`}
            className="ide-brand-pill"
            title="Voltar ao Mapa Geral do Curso"
          >
            <Sparkles className="w-3.5 h-3.5 ide-text-cyan" aria-hidden="true" />
            <span>Trilha Game · {levelSpec.shortTitle}</span>
          </Link>

          <div className="ide-breadcrumb" aria-label="Fase atual">
            <span className="ide-breadcrumb-module">
              {currentTrackIndex >= 0
                ? `Fase ${currentTrackIndex + 1} de ${trackLessons.length}`
                : `Módulo ${lesson.moduleNumber}`}
            </span>
            <span className="ide-breadcrumb-sep">/</span>
            <strong className="ide-breadcrumb-lesson">{lesson.title}</strong>
          </div>
        </div>

        <div className="ide-topbar-right">
          {/* Level Switcher */}
          <div
            className="ide-level-pills"
            role="group"
            aria-label="Nível de complexidade da jornada"
          >
            {Object.values(COURSE_LEVELS).map((lvl) => {
              const isSelected = lvl.id === selectedLevel;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() =>
                    onUpdatePreferences({
                      selectedLevel: lvl.id as CourseDifficultyLevel,
                    })
                  }
                  className={`ide-level-pill${isSelected ? " is-active" : ""}`}
                  title={lvl.name}
                  aria-pressed={isSelected}
                >
                  <span>{lvl.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Direct Portal to Practice Station of THIS Lesson */}
          <Link
            href={buildStationHref(briefing.primaryStation)}
            className="ide-btn ide-btn-xs ide-btn-primary"
            title={briefing.primaryStationTitle}
          >
            <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Arena Desta Fase</span>
          </Link>

          {/* XP & Track Progress Badge */}
          <div
            className="ide-xp-badge"
            title={`Patente: ${gamification.rankTitle} · ${gamification.xp} XP · ${gamification.trackPct}% da trilha`}
          >
            <Award className="w-3.5 h-3.5 ide-text-amber" aria-hidden="true" />
            <span>
              <strong>{gamification.xp} XP</strong> · {gamification.trackPct}%
            </span>
          </div>

          <button
            type="button"
            className="ide-search-trigger"
            onClick={() => setPaletteOpen(true)}
            title="Buscar lição ou termo (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Buscar</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="ide-icon-btn"
            onClick={() => onUpdatePreferences({ focusMode: !focusMode })}
            title={focusMode ? "Sair do modo foco" : "Modo foco (tela limpa)"}
            aria-label="Alternar modo foco"
          >
            {focusMode ? (
              <Minimize2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <div className="ide-auth-slot">
            {isAuthenticated ? (
              <span className="ide-sync-pill" title={`Status: ${syncStatus}`}>
                ● Salvo na nuvem
              </span>
            ) : (
              <GoogleSignInButton
                href={`/pt/cursos/${courseSlug}/${lesson.slug}`}
                compact
              />
            )}
          </div>
        </div>
      </header>

      {/* Secondary Stepper Bar: Full Journey ("Jornada Completa") first, plus optional focused stage filters */}
      <nav
        className="ide-stage-stepper"
        aria-label="Modo de visualização da aula"
      >
        <div className="ide-stage-pills">
          <button
            type="button"
            className={`ide-stage-pill${activeStage === "all" ? " is-active" : ""}`}
            onClick={() => selectStageAndScroll("all")}
            title="Ver toda a aula passo a passo (Briefing + Estúdio Multimídia + Conceito + Lab + Quiz)"
          >
            ★ Jornada Completa Passo a Passo
          </button>
          {STAGE_SEQUENCE.map((st) => {
            const isCurrent = activeStage === st.id;
            const completedStep =
              (st.id === "predict" && mastery.completed) ||
              (st.id === "concept" && mastery.completed) ||
              (st.id === "practice" && mastery.labPassed) ||
              (st.id === "quiz" && mastery.quizPassed);

            return (
              <button
                key={st.id}
                type="button"
                className={`ide-stage-pill${isCurrent ? " is-active" : ""}${completedStep ? " is-done" : ""}`}
                onClick={() => selectStageAndScroll(st.id)}
                title={st.shortDesc}
              >
                {completedStep ? "✓ " : ""}
                {st.label}
              </button>
            );
          })}
        </div>

        <div className="ide-stepper-hint">
          <Sparkles className="w-3.5 h-3.5 ide-text-cyan" aria-hidden="true" />
          <span>
            {activeStageSpec
              ? `Filtro ativo: ${activeStageSpec.label} — ${activeStageSpec.shortDesc}.`
              : `Ato ${briefing.actNumber} de 6 (${activeActSpec.softwareProcessName}) · Role no seu ritmo ou filtre por etapa acima.`}
          </span>
        </div>
      </nav>

      {/* Clean 2-Zone Layout: Sidebar Track Map + Spacious Single-Focus Stage */}
      <div
        className={`ide-grid${sidebarOpen && !focusMode ? " has-sidebar" : " no-sidebar"}`}
      >
        {sidebarOpen && !focusMode && (
          <aside className="ide-sidebar" aria-label="Mapa da Sua Trilha">
            <div className="ide-sidebar-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={sidebarMode === "curriculum"}
                className={`ide-sidebar-tab${sidebarMode === "curriculum" ? " is-active" : ""}`}
                onClick={() => setSidebarMode("curriculum")}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sua Trilha ({trackLessons.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={sidebarMode === "repo"}
                className={`ide-sidebar-tab${sidebarMode === "repo" ? " is-active" : ""}`}
                onClick={() => setSidebarMode("repo")}
              >
                <FolderTree className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Arquivos</span>
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
                    {gamification.trackTotal} CONCLUÍDAS)
                  </div>
                  <ul className="ide-lesson-list">
                    {trackLessons.map((item, idx) => {
                      const isCurrent = item.slug === lesson.slug;
                      const isDone = workspace.completedSlugs.includes(item.slug);
                      const itemBrief = getLessonQuestBriefing(item.slug);
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/pt/cursos/${courseSlug}/${item.slug}`}
                            className={`ide-lesson-link${isCurrent ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                          >
                            {isDone ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 ide-text-emerald shrink-0"
                                aria-label="Fase concluída"
                              />
                            ) : (
                              <Circle
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span>
                              <strong>
                                Fase {idx + 1} (Ato {itemBrief.actNumber}):
                              </strong>{" "}
                              {item.title}
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
                      + Outras Fases Avançadas ({extraLessons.length} aulas)
                    </summary>
                    <ul className="ide-lesson-list" style={{ marginTop: 6 }}>
                      {extraLessons.map((item) => {
                        const isCurrent = item.slug === lesson.slug;
                        const isDone = workspace.completedSlugs.includes(item.slug);
                        return (
                          <li key={item.slug}>
                            <Link
                              href={`/pt/cursos/${courseSlug}/${item.slug}`}
                              className={`ide-lesson-link${isCurrent ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                            >
                              {isDone ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 ide-text-emerald shrink-0"
                                  aria-label="Concluída"
                                />
                              ) : (
                                <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
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
                  Arquivos reais do <strong>MySuperStore</strong> ligados a esta fase:
                </p>
                <ul className="ide-repo-list">
                  {MYSUPERSTORE_REPO_FILES.map((file) => {
                    const isRelevant = file.lessonSlugs.includes(lesson.slug);
                    const isSelected = selectedRepoFile?.path === file.path;
                    return (
                      <li key={file.path}>
                        <button
                          type="button"
                          className={`ide-repo-item${isSelected ? " is-selected" : ""}${isRelevant ? " is-relevant" : ""}`}
                          onClick={() => setSelectedRepoFile(file)}
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
                      <small>Associação: {g.association}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}

        {/* Center Main Stage (Spacious, Single-Focus, Game-Guided) */}
        <main className="ide-center-pane" ref={centerPaneRef}>
          {selectedRepoFile && (
            <div className="ide-repo-modal-inline">
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

          {/* Top Software Engineering Process Pipeline & Phase Briefing Card */}
          <section
            className="ide-arena-portal-box"
            style={{ marginBottom: 24 }}
            aria-label="Posição na Engenharia de Software e Missão da Fase"
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                <span className="ide-file-badge">
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" /> {briefing.phaseBadge}
                </span>
                <span className="curso-pill" style={{ fontSize: "0.75rem" }}>
                  🏠 {briefing.houseRoomLabel}
                </span>
              </div>
              <span className="ide-muted-xs">
                Processo de Engenharia: <strong>{activeActSpec.softwareProcessName}</strong>
              </span>
            </div>

            {/* 6-Act Visual Pipeline */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                gap: 8,
                marginBottom: 16,
              }}
              role="list"
              aria-label="Os 6 Atos da Engenharia de Software"
            >
              {ENGINEERING_ACTS.map((act) => {
                const isCurrentAct = act.actNumber === briefing.actNumber;
                const isPastAct = act.actNumber < briefing.actNumber;
                return (
                  <div
                    key={act.id}
                    role="listitem"
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: isCurrentAct
                        ? "1px solid rgba(56, 189, 248, 0.75)"
                        : isPastAct
                          ? "1px solid rgba(52, 211, 153, 0.38)"
                          : "1px solid rgba(148, 163, 184, 0.16)",
                      background: isCurrentAct
                        ? "rgba(56, 189, 248, 0.14)"
                        : isPastAct
                          ? "rgba(16, 185, 129, 0.08)"
                          : "rgba(15, 23, 42, 0.45)",
                      fontSize: "0.76rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: isCurrentAct
                          ? "#38bdf8"
                          : isPastAct
                            ? "#34d399"
                            : "#94a3b8",
                      }}
                    >
                      {isPastAct ? "✓ " : isCurrentAct ? "▶ " : ""}
                      {act.shortTitle}
                    </div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: "0.7rem",
                        marginTop: 2,
                        lineHeight: 1.35,
                      }}
                    >
                      {act.houseAnalogy}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Why Before Code + What You Will Build */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
                padding: 14,
                borderRadius: 12,
                background: "rgba(2, 6, 23, 0.65)",
                border: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#38bdf8",
                    marginBottom: 4,
                  }}
                >
                  1. Por que fazemos isso nesta etapa da obra?
                </strong>
                <p style={{ fontSize: "0.88rem", color: "#e2e8f0", margin: 0, lineHeight: 1.55 }}>
                  {briefing.whyBeforeCode}
                </p>
              </div>
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#34d399",
                    marginBottom: 4,
                  }}
                >
                  2. Feature e Entrega Prática desta Fase
                </strong>
                <p style={{ fontSize: "0.88rem", color: "#e2e8f0", margin: 0, lineHeight: 1.55 }}>
                  {briefing.whatYouWillBuild}
                </p>
              </div>
            </div>
          </section>

          {children}

          {/* Focused Practice Mission of THIS Phase (Never dumping all tools unguided) */}
          {(activeStage === "practice" || activeStage === "all") && (
            <section
              className="ide-arena-portal-box"
              aria-label="Missão Prática Oficial desta Fase"
            >
              <div className="ide-arena-portal-head">
                <div>
                  <span className="ide-file-badge">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Missão Hands-On Oficial ·{" "}
                    {briefing.phaseBadge}
                  </span>
                  <h3 style={{ marginTop: 6 }}>{briefing.primaryStationTitle}</h3>
                  <p className="curso-muted" style={{ marginTop: 6 }}>
                    {briefing.primaryStationWhy}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                <Link
                  href={buildStationHref(briefing.primaryStation)}
                  className="ide-btn ide-btn-primary"
                >
                  <Wrench className="w-4 h-4" aria-hidden="true" />
                  <span>{briefing.primaryStationCta}</span>
                </Link>

                {briefing.secondaryStation && (
                  <Link
                    href={buildStationHref(briefing.secondaryStation.station)}
                    className="ide-btn ide-btn-secondary"
                  >
                    <span>{briefing.secondaryStation.label}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {/* Step-by-Step Explained Starter Kit Unlock (Only in F02 after Terminal intro!) */}
              {briefing.unlocksDownloadKit && (
                <div
                  style={{
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid rgba(52, 211, 153, 0.45)",
                    background: "rgba(16, 185, 129, 0.08)",
                  }}
                >
                  <span className="ide-file-badge">
                    🏠 {briefing.unlocksDownloadKit.title}
                  </span>
                  <p style={{ marginTop: 8, fontSize: "0.9rem", color: "#e2e8f0" }}>
                    {briefing.unlocksDownloadKit.whatIsIt}
                  </p>
                  <ol
                    style={{
                      marginTop: 10,
                      marginBottom: 14,
                      paddingLeft: 20,
                      color: "#cbd5e1",
                      fontSize: "0.86rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {briefing.unlocksDownloadKit.howToUseSteps.map((stepText) => (
                      <li key={stepText}>{stepText}</li>
                    ))}
                  </ol>
                  <Link
                    href={briefing.unlocksDownloadKit.href}
                    className="ide-btn ide-btn-primary"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>{briefing.unlocksDownloadKit.buttonLabel}</span>
                  </Link>
                </div>
              )}

              {/* Optional Collapsible Drawer for All 7 Stations (Does not clutter the primary path) */}
              <details style={{ marginTop: 18 }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  Explorar outras Estações do Laboratório (Acesso Livre sob Demanda)
                </summary>
                <div className="ide-arena-portal-grid" style={{ marginTop: 12 }}>
                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=bancada&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <Home className="w-5 h-5 ide-text-cyan shrink-0" aria-hidden="true" />
                    <div>
                      <strong>0. Casa Pré-Moldada (.zip) &amp; VS Code</strong>
                      <p>Guia passo a passo de instalação e esqueleto em 4 cômodos.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=terminal&aula=${lesson.slug}&missao=${recommendedMission}`}
                    className="ide-arena-portal-item"
                  >
                    <TerminalSquare className="w-5 h-5 ide-text-emerald shrink-0" aria-hidden="true" />
                    <div>
                      <strong>1. Tela Preta (Terminal desta Fase)</strong>
                      <p>Rode os comandos no simulador seguro (+25 XP por comando).</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=sandbox&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <Code2 className="w-5 h-5 ide-text-amber shrink-0" aria-hidden="true" />
                    <div>
                      <strong>2. Oficina Python/SQL ({labForLesson.shortCode})</strong>
                      <p>{labForLesson.title} (+50 XP ao passar nos testes).</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=http&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <Globe className="w-5 h-5 ide-text-cyan shrink-0" aria-hidden="true" />
                    <div>
                      <strong>3. Simulador de API, Estoque &amp; Webhook</strong>
                      <p>Dispare GET/POST e teste concorrência e assinatura PIX.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=loja&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <ShoppingBag className="w-5 h-5 ide-text-emerald shrink-0" aria-hidden="true" />
                    <div>
                      <strong>4. Móveis da Minha Loja (Vitrine)</strong>
                      <p>Personalize nome, cores, produtos e WhatsApp e baixe o HTML.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=deploy&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <Rocket className="w-5 h-5 ide-text-amber shrink-0" aria-hidden="true" />
                    <div>
                      <strong>5. Publicar R$ 0 (GitHub / Neon / Render / Vercel)</strong>
                      <p>Siga um provedor por vez com fotos reais de onde clicar.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>

                  <Link
                    href={`/pt/cursos/${courseSlug}/pratica?estacao=cards&aula=${lesson.slug}`}
                    className="ide-arena-portal-item"
                  >
                    <FlipHorizontal2 className="w-5 h-5 ide-text-cyan shrink-0" aria-hidden="true" />
                    <div>
                      <strong>6. Baralho 3D Flip Cards</strong>
                      <p>Vire os cartões interativos do nível {levelSpec.shortTitle}.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </section>
          )}

          {/* Gamified Step-by-Step Progression Footer */}
          <footer className="ide-stage-progression-bar" aria-label="Avanço de fase na trilha">
            {activeStage === "predict" && (
              <div className="ide-stage-next-row">
                <div>
                  <span className="ide-file-badge">Etapa 1 de 4 Concluída?</span>
                  <p className="ide-muted-xs" style={{ marginTop: 4 }}>
                    Agora que você formulou sua hipótese, veja o estúdio multimídia, a ilustração e o código na Etapa 2.
                  </p>
                </div>
                <button
                  type="button"
                  className="ide-btn ide-btn-primary"
                  onClick={() => selectStageAndScroll("concept")}
                >
                  <span>Avançar para Etapa 2: Conceito, Vídeo &amp; Planta</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {activeStage === "concept" && (
              <div className="ide-stage-next-row">
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => selectStageAndScroll("predict")}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Voltar para Etapa 1</span>
                </button>
                <button
                  type="button"
                  className="ide-btn ide-btn-primary"
                  onClick={() => selectStageAndScroll("practice")}
                >
                  <span>Avançar para Etapa 3: Lab &amp; Arena Prática</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {activeStage === "practice" && (
              <div className="ide-stage-next-row">
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => selectStageAndScroll("concept")}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Voltar para Etapa 2</span>
                </button>
                <button
                  type="button"
                  className="ide-btn ide-btn-primary"
                  onClick={() => selectStageAndScroll("quiz")}
                >
                  <span>Avançar para Etapa 4: Boss Quiz &amp; Conclusão (+100 XP)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {(activeStage === "quiz" || activeStage === "all") && (
              <div className="ide-stage-next-row">
                {prevTrackLesson ? (
                  <Link
                    href={`/pt/cursos/${courseSlug}/${prevTrackLesson.slug}`}
                    className="ide-btn ide-btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Fase Anterior: {prevTrackLesson.title}</span>
                  </Link>
                ) : (
                  <Link
                    href={`/pt/cursos/${courseSlug}`}
                    className="ide-btn ide-btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Voltar ao Mapa do Curso</span>
                  </Link>
                )}

                {nextTrackLesson ? (
                  <Link
                    href={`/pt/cursos/${courseSlug}/${nextTrackLesson.slug}`}
                    className="ide-btn ide-btn-primary"
                  >
                    <span>
                      Próxima Fase da Trilha ({levelSpec.shortTitle}): {nextTrackLesson.title}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href={`/pt/cursos/${courseSlug}/certificado`}
                    className="ide-btn ide-btn-primary"
                  >
                    <Award className="w-4 h-4" aria-hidden="true" />
                    <span>Trilha Concluída · Ir para Exame Final &amp; Certificado</span>
                  </Link>
                )}
              </div>
            )}
          </footer>
        </main>
      </div>

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
                placeholder="Buscar fase, comando ou conceito..."
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
              <div className="ide-palette-group-title">Lições</div>
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
