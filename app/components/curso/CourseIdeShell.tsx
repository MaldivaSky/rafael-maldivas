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
  Download,
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
  computeCourseGamification,
  computeLessonMastery,
  type IdeLessonStage,
  type IdeWorkbenchTab,
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
    label: "2. Conceito & Planta",
    shortDesc: "Ilustração, código e porquês",
  },
  {
    id: "practice",
    stepNum: 3,
    label: "3. Arena Hands-On",
    shortDesc: "Terminal, Sandbox e Loja",
  },
  {
    id: "quiz",
    stepNum: 4,
    label: "4. Boss Quiz & Avanço",
    shortDesc: "Valide e ganhe +100 XP",
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

  const labForLesson =
    COURSE_LABS[lesson.slug] ?? Object.values(COURSE_LABS)[0];
  const recommendedMission = getRecommendedTerminalMission(lesson.slug);

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
      {/* Top Gamified HUD Bar */}
      <header className="ide-topbar" aria-label="Barra superior da Jornada Gamificada">
        <div className="ide-topbar-left">
          <button
            type="button"
            className="ide-icon-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Ocultar mapa da trilha" : "Mostrar mapa da trilha"}
            title="Alternar Mapa da Trilha"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <Link
            href={`/pt/cursos/${courseSlug}`}
            className="ide-breadcrumb-link"
          >
            Mapa do Curso
          </Link>
          <span className="ide-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="ide-breadcrumb-current">
            {currentTrackIndex >= 0
              ? `Fase ${currentTrackIndex + 1} de ${trackLessons.length}`
              : `Módulo ${lesson.moduleNumber}`}
          </span>
        </div>

        {/* Gamified Player Status + Level Switcher + Direct Arena Portal */}
        <div className="ide-topbar-right">
          <span className="ide-xp-rank-pill" title="Sua patente e experiência acumulada">
            <Award className="w-3.5 h-3.5 ide-text-amber" aria-hidden="true" />
            <span>
              Nv.{gamification.levelNumber} {gamification.rankTitle} ·{" "}
              <strong>{gamification.xp} XP</strong>
            </span>
          </span>

          <div
            className="ide-level-switcher"
            role="group"
            aria-label="Escolher nível da trilha"
          >
            {(["facil", "mediano", "dificil"] as CourseDifficultyLevel[]).map(
              (lvl) => {
                const spec = COURSE_LEVELS[lvl];
                const active = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    className={`ide-level-chip${active ? " is-active" : ""}`}
                    onClick={() => onUpdatePreferences({ selectedLevel: lvl })}
                    title={`${spec.name} (${spec.recommendedSlugs.length} fases)`}
                  >
                    {spec.shortTitle} ({spec.recommendedSlugs.length})
                  </button>
                );
              },
            )}
          </div>

          <Link
            href={`/pt/cursos/${courseSlug}/pratica?estacao=bancada&aula=${lesson.slug}`}
            className="ide-btn ide-btn-xs ide-btn-ghost"
            title="Baixar Casa Pré-Moldada (.zip) e guia VS Code"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Casa Pré-Moldada (.zip)</span>
          </Link>

          <Link
            href={`/pt/cursos/${courseSlug}/pratica?estacao=terminal&aula=${lesson.slug}&missao=${recommendedMission}`}
            className="ide-btn ide-btn-xs ide-btn-primary"
            title="Ir para a Arena Prática em tela cheia"
          >
            <TerminalSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Abrir Arena Prática</span>
          </Link>

          <button
            type="button"
            className="ide-btn ide-btn-xs ide-btn-ghost"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar aula ou termo (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Buscar</span>
          </button>

          <button
            type="button"
            className="ide-btn ide-btn-xs ide-btn-ghost"
            onClick={() => onUpdatePreferences({ focusMode: !focusMode })}
          >
            {focusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sair do Foco</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Modo Foco</span>
              </>
            )}
          </button>

          {!isAuthenticated && (
            <GoogleSignInButton
              href={`/api/auth/google/login?next=/pt/cursos/${courseSlug}/${lesson.slug}`}
              label="Salvar Progresso"
              compact
            />
          )}
        </div>
      </header>

      {/* Sequential 4-Step Quest Stepper Bar */}
      <nav className="ide-stepper-bar" aria-label="Etapas sequenciais desta Fase">
        <div className="ide-stepper-pills">
          {STAGE_SEQUENCE.map((st) => {
            const active = activeStage === st.id;
            const completedStep =
              (st.id === "practice" && mastery.labPassed) ||
              (st.id === "quiz" && (mastery.quizPassed || mastery.completed));
            return (
              <button
                key={st.id}
                type="button"
                className={`ide-stage-pill${active ? " is-active" : ""}`}
                onClick={() => selectStageAndScroll(st.id)}
              >
                {completedStep ? "✓ " : ""}
                {st.label}
              </button>
            );
          })}
          <button
            type="button"
            className={`ide-stage-pill${activeStage === "all" ? " is-active" : ""}`}
            onClick={() => selectStageAndScroll("all")}
            title="Mostrar todas as etapas juntas para revisão rápida"
          >
            Ver Fase Inteira (Revisão)
          </button>
        </div>

        <div className="ide-stepper-hint">
          <Sparkles className="w-3.5 h-3.5 ide-text-cyan" aria-hidden="true" />
          <span>
            {activeStageSpec
              ? `Foco atual: ${activeStageSpec.label} — ${activeStageSpec.shortDesc}.`
              : "Modo revisão ativa: navegue pelas 4 etapas acima para estudar uma fase por vez."}
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

          {children}

          {/* Dedicated Practice Station Portal Card on Stage 3 ("practice" or "all") */}
          {(activeStage === "practice" || activeStage === "all") && (
            <section
              className="ide-arena-portal-box"
              aria-label="Portais para as Arenas de Prática em Tela Cheia"
            >
              <div className="ide-arena-portal-head">
                <div>
                  <span className="ide-file-badge">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Missão Hands-On em Tela Cheia
                  </span>
                  <h3>
                    Hora de Construir! Escolha sua Arena Prática para esta Fase
                  </h3>
                  <p className="curso-muted" style={{ marginTop: 4 }}>
                    A Arena abre em tela cheia já configurada com o desafio da lição{" "}
                    <strong>{lesson.title}</strong>. Quando terminar, um botão traz você de volta para
                    esta fase com seu XP salvo!
                  </p>
                </div>
              </div>

              <div className="ide-arena-portal-grid">
                <Link
                  href={`/pt/cursos/${courseSlug}/pratica?estacao=bancada&aula=${lesson.slug}`}
                  className="ide-arena-portal-item"
                >
                  <Home className="w-5 h-5 ide-text-cyan shrink-0" aria-hidden="true" />
                  <div>
                    <strong>0. Casa Pré-Moldada (.zip) &amp; VS Code</strong>
                    <p>Baixe o esqueleto com os 4 cômodos e siga o guia do VS Code.</p>
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
            </section>
          )}

          {/* Gamified Step-by-Step Progression Footer */}
          <footer className="ide-stage-progression-bar" aria-label="Avanço de etapa">
            {activeStage === "predict" && (
              <div className="ide-stage-next-row">
                <div>
                  <span className="ide-file-badge">Etapa 1 de 4 Concluída?</span>
                  <p className="ide-muted-xs" style={{ marginTop: 4 }}>
                    Agora que você formulou sua hipótese, veja a ilustração e o código real na Etapa 2.
                  </p>
                </div>
                <button
                  type="button"
                  className="ide-btn ide-btn-primary"
                  onClick={() => selectStageAndScroll("concept")}
                >
                  <span>Avançar para Etapa 2: Conceito &amp; Planta</span>
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
                  <span>Avançar para Etapa 3: Arena Hands-On</span>
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

            {activeStage === "quiz" && (
              <div className="ide-stage-next-row">
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => selectStageAndScroll("practice")}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Voltar para Etapa 3 (Arenas)</span>
                </button>
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
