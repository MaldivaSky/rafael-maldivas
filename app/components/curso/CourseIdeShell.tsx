"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Cloud,
  CloudOff,
  FileCode2,
  FolderGit2,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { courseBySlug, allCourseLessons, type CourseLesson } from "../../lib/courses";
import {
  computeLessonMastery,
  type IdeLessonStage,
  type SrsRating,
  type WorkspacePreferences,
  type WorkspaceState,
} from "../../lib/course-workspace";
import { COURSE_LEVELS, getCourseLevelSpec } from "../../lib/course-levels";
import { MYSUPERSTORE_REPO_FILES, type RepoFileNode } from "../../lib/mysuperstore-repo";
import { GLOSSARY_TERMS } from "../../lib/module-zero-content";
import type { SyncStatus } from "../../hooks/useCourseWorkspace";
import { IdeCodeEditor } from "./IdeCodeEditor";
import { IdeWorkbench } from "./IdeWorkbench";

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

const STAGE_OPTIONS: Array<{ id: IdeLessonStage; label: string }> = [
  { id: "all", label: "Página Completa" },
  { id: "predict", label: "1. Previsão" },
  { id: "concept", label: "2. Conceito & Arquitetura" },
  { id: "practice", label: "3. Laboratórios" },
  { id: "quiz", label: "4. Quiz & Conclusão" },
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
  onUpdateCodeDraft,
  onRecordLabResult,
  onUpdateNotes,
  onReviewSrsCard,
  onToggleDeployStep,
  onRecordTerminalProgress,
  children,
}: CourseIdeShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const course = useMemo(() => courseBySlug(courseSlug), [courseSlug]);
  const allLessons = useMemo(() => (course ? allCourseLessons(course) : []), [course]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [selectedRepoFile, setSelectedRepoFile] = useState<RepoFileNode | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const focusMode = workspace.preferences.focusMode;
  const explorerTab = workspace.preferences.explorerTab;
  const selectedLevel = workspace.preferences.selectedLevel;
  const levelSpec = getCourseLevelSpec(selectedLevel);
  const levelSlugSet = useMemo(() => new Set(levelSpec.recommendedSlugs), [levelSpec]);
  const isLessonInSelectedLevel = levelSlugSet.has(lesson.slug);
  const mastery = useMemo(
    () => computeLessonMastery(lesson.slug, workspace),
    [lesson.slug, workspace],
  );

  // Ctrl+K / Cmd+K Command Palette shortcut
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedRepoFile(null);
      }
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

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

  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    const matchedLessons = allLessons
      .filter(
        (l) =>
          !q ||
          l.title.toLowerCase().includes(q) ||
          l.slug.toLowerCase().includes(q),
      )
      .slice(0, 6);
    const matchedFiles = MYSUPERSTORE_REPO_FILES.filter(
      (f) =>
        !q ||
        f.path.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q),
    ).slice(0, 5);
    const matchedGlossary = GLOSSARY_TERMS.filter(
      (g) =>
        !q ||
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q),
    ).slice(0, 4);
    return { matchedLessons, matchedFiles, matchedGlossary };
  }, [allLessons, paletteQuery]);

  const completedCount = workspace.completedSlugs.length;
  const totalLessons = allLessons.length || 18;
  const labsPassedCount = Object.values(workspace.labsPassed).filter((x) => x.passed).length;

  return (
    <div className={`ide-shell${focusMode ? " is-focus" : ""}`}>
      {/* Top IDE Bar */}
      <header className="ide-topbar">
        <div className="ide-topbar-left">
          <button
            type="button"
            className="ide-icon-btn"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label={sidebarOpen ? "Recolher explorador" : "Abrir explorador"}
            title={sidebarOpen ? "Recolher explorador" : "Abrir explorador"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <nav className="ide-breadcrumbs" aria-label="Localização no curso">
            <Link href={`/pt/cursos/${courseSlug}`} className="ide-crumb-link">
              Marketplace IDE
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
            <Link href="/pt/trilha" className="ide-crumb-link">
              Minha Trilha ({completedCount}/{totalLessons})
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
            <span className="ide-crumb-current">Módulo {lesson.moduleNumber}</span>
          </nav>
        </div>

        <div className="ide-topbar-right">
          <div className="ide-level-switcher" role="group" aria-label="Nível do curso">
            {(["facil", "mediano", "dificil"] as const).map((lvlKey) => (
              <button
                key={lvlKey}
                type="button"
                className={`ide-level-btn${selectedLevel === lvlKey ? " is-active" : ""}`}
                onClick={() => onUpdatePreferences({ selectedLevel: lvlKey })}
                title={COURSE_LEVELS[lvlKey].name}
              >
                {COURSE_LEVELS[lvlKey].shortTitle}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ide-btn ide-btn-primary"
            onClick={() => onUpdatePreferences({ activeTab: "deploy" })}
            title="Guia visual gratuito para criar conta e publicar no GitHub, Vercel e Render"
          >
            <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Publicar R$ 0</span>
          </button>

          <div className="ide-mastery-pills">
            <span className={`ide-status-chip${mastery.labPassed ? " is-ok" : ""}`}>
              {mastery.labPassed ? "Lab OK" : "Lab Pendente"}
            </span>
            {mastery.quizPct !== null && (
              <span className={`ide-status-chip${mastery.quizPassed ? " is-ok" : ""}`}>
                Quiz {mastery.quizPct}%
              </span>
            )}
            <span className="ide-status-chip">
              Labs {labsPassedCount}/{totalLessons}
            </span>
          </div>

          <button
            type="button"
            className="ide-btn ide-btn-ghost ide-cmd-trigger"
            onClick={() => setPaletteOpen(true)}
            title="Busca rápida (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Buscar</span>
            <kbd className="ide-kbd">Ctrl+K</kbd>
          </button>

          <button
            type="button"
            className={`ide-btn ide-btn-ghost${focusMode ? " is-active-toggle" : ""}`}
            onClick={() => onUpdatePreferences({ focusMode: !focusMode })}
            title="Alternar Modo Foco"
          >
            {focusMode ? (
              <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{focusMode ? "Sair do Foco" : "Modo Foco"}</span>
          </button>

          {isAuthenticated ? (
            <span
              className={`ide-sync-pill${syncStatus === "cloud" ? " is-cloud" : ""}`}
              title="Progresso e códigos salvos na sua conta"
            >
              <Cloud className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {syncStatus === "saving"
                  ? "Salvando..."
                  : syncStatus === "cloud"
                    ? "Nuvem Ativa"
                    : "Salvo Local"}
              </span>
            </span>
          ) : (
            <Link
              href={`/api/auth/google?next=${encodeURIComponent(pathname || `/pt/cursos/${courseSlug}`)}`}
              className="ide-sync-pill is-guest"
              title="Salvar labs, notas e revisão espaçada na nuvem"
            >
              <CloudOff className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Entrar c/ Google</span>
            </Link>
          )}
        </div>
      </header>

      {/* Guided Stepper Bar */}
      <div className="ide-stepper-bar" role="navigation" aria-label="Etapas pedagógicas da aula">
        <div className="ide-stepper-pills">
          {STAGE_OPTIONS.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`ide-stage-pill${activeStage === st.id ? " is-active" : ""}`}
              onClick={() => onChangeStage(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
        <span className="ide-stepper-tip">
          <Sparkles className="w-3.5 h-3.5 ide-text-cyan" aria-hidden="true" />
          <span>Fluxo guiado reduz sobrecarga; troque para Página Completa a qualquer hora.</span>
        </span>
      </div>

      {/* Main 3-Pane IDE Body */}
      <div
        className={`ide-grid${sidebarOpen && !focusMode ? " has-sidebar" : " no-sidebar"}`}
      >
        {sidebarOpen && !focusMode && (
          <aside className="ide-explorer" aria-label="Explorador do curso e repositório">
            <div className="ide-explorer-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={explorerTab === "track"}
                className={`ide-explorer-tab${explorerTab === "track" ? " is-active" : ""}`}
                onClick={() => onUpdatePreferences({ explorerTab: "track" })}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Trilha</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={explorerTab === "repo"}
                className={`ide-explorer-tab${explorerTab === "repo" ? " is-active" : ""}`}
                onClick={() => onUpdatePreferences({ explorerTab: "repo" })}
              >
                <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Repo</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={explorerTab === "glossary"}
                className={`ide-explorer-tab${explorerTab === "glossary" ? " is-active" : ""}`}
                onClick={() => onUpdatePreferences({ explorerTab: "glossary" })}
              >
                <span>Glossário</span>
              </button>
            </div>

            <div className="ide-explorer-body">
              {explorerTab === "track" && course && (
                <div className="ide-track-tree">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="ide-track-module">
                      <div className="ide-track-mod-title">
                        M{mod.number} · {mod.title}
                      </div>
                      <ul className="ide-track-list">
                        {mod.lessons.map((l) => {
                          const isCurrent = l.slug === lesson.slug;
                          const done = workspace.completedSlugs.includes(l.slug);
                          const labOk = Boolean(workspace.labsPassed[l.slug]?.passed);
                          const quizPct = workspace.quizScores[l.slug]?.pct;
                          const inLevel = levelSlugSet.has(l.slug);
                          return (
                            <li key={l.slug}>
                              <Link
                                href={`/pt/cursos/${courseSlug}/${l.slug}`}
                                className={`ide-track-item${isCurrent ? " is-current" : ""}${done ? " is-done" : ""}${inLevel ? "" : " is-optional"}`}
                              >
                                <span className="ide-track-dot" aria-hidden="true">
                                  {done ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 ide-text-emerald" />
                                  ) : (
                                    <span className="ide-circle-dot" />
                                  )}
                                </span>
                                <span className="ide-track-item-title">{l.title}</span>
                                <span className="ide-track-badges">
                                  {labOk && <span className="ide-mini-ok">Lab</span>}
                                  {typeof quizPct === "number" && (
                                    <span className="ide-mini-pct">{quizPct}%</span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {explorerTab === "repo" && (
                <div className="ide-repo-tree">
                  <p className="ide-explorer-caption">
                    Arquivos de referência do MySuperStore. Itens destacados pertencem a esta aula.
                  </p>
                  {MYSUPERSTORE_REPO_FILES.map((file) => {
                    const relevant = file.lessonSlugs.includes(lesson.slug);
                    return (
                      <button
                        key={file.path}
                        type="button"
                        className={`ide-repo-item${relevant ? " is-relevant" : ""}`}
                        onClick={() => setSelectedRepoFile(file)}
                      >
                        <FileCode2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <div className="min-w-0 text-left">
                          <div className="ide-repo-path">{file.path}</div>
                          <div className="ide-repo-summary">{file.summary}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {explorerTab === "glossary" && (
                <div className="ide-glossary-pane">
                  <label htmlFor="ide-glossary-search" className="sr-only">
                    Filtrar glossário de termos
                  </label>
                  <input
                    id="ide-glossary-search"
                    type="search"
                    className="ide-search-input"
                    placeholder="Buscar termo (ex: HMAC, Lock, ORM)..."
                    value={glossaryQuery}
                    onChange={(e) => setGlossaryQuery(e.target.value)}
                  />
                  <div className="ide-glossary-list">
                    {filteredGlossary.map((g) => (
                      <div key={g.term} className="ide-glossary-card">
                        <div className="ide-glossary-term">
                          <strong>{g.term}</strong>
                          <span>{g.lesson}</span>
                        </div>
                        <p>{g.definition}</p>
                        <small>Analogia: {g.association}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center Lesson Content Pane */}
        <div className="ide-center-pane">
          {!isLessonInSelectedLevel && (
            <div className="ide-level-notice" role="note">
              <span>
                Você escolheu o nível <strong>{levelSpec.shortTitle}</strong>. Esta aula pertence ao
                nível mais avançado (opcional no seu MVP atual).
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="ide-btn ide-btn-xs ide-btn-ghost"
                  onClick={() => onUpdatePreferences({ selectedLevel: "dificil" })}
                >
                  Mudar para Difícil
                </button>
                <button
                  type="button"
                  className="ide-btn ide-btn-xs ide-btn-primary"
                  onClick={() => onUpdatePreferences({ activeTab: "deploy" })}
                >
                  Abrir Guia Publicar R$ 0
                </button>
              </div>
            </div>
          )}
          <div className="ide-center-inner">{children}</div>
        </div>

        {/* Right Interactive Workbench */}
        <aside className="ide-workbench-pane">
          <IdeWorkbench
            lessonSlug={lesson.slug}
            workspace={workspace}
            onChangeTab={(tab) => onUpdatePreferences({ activeTab: tab })}
            onUpdateCodeDraft={onUpdateCodeDraft}
            onRecordLabResult={onRecordLabResult}
            onUpdateNotes={onUpdateNotes}
            onReviewSrsCard={onReviewSrsCard}
            onToggleDeployStep={onToggleDeployStep}
            onRecordTerminalProgress={onRecordTerminalProgress}
            onChangeLevel={(lvl) => onUpdatePreferences({ selectedLevel: lvl })}
          />
        </aside>
      </div>

      {/* Repo File Viewer Modal */}
      {selectedRepoFile && (
        <div
          className="ide-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizador de código ${selectedRepoFile.path}`}
          onClick={() => setSelectedRepoFile(null)}
        >
          <div className="ide-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ide-modal-header">
              <div>
                <code className="ide-file-path">{selectedRepoFile.path}</code>
                <p className="ide-modal-sub">{selectedRepoFile.summary}</p>
              </div>
              <button
                type="button"
                className="ide-icon-btn"
                onClick={() => setSelectedRepoFile(null)}
                aria-label="Fechar código"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <IdeCodeEditor
              value={selectedRepoFile.content}
              readOnly
              language={selectedRepoFile.language}
              ariaLabel={`Código somente leitura ${selectedRepoFile.path}`}
              minHeight={300}
            />
          </div>
        </div>
      )}

      {/* Ctrl+K Command Palette Modal */}
      {paletteOpen && (
        <div
          className="ide-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Busca rápida na IDE"
          onClick={() => setPaletteOpen(false)}
        >
          <div className="ide-palette-card" onClick={(e) => e.stopPropagation()}>
            <div className="ide-palette-search">
              <Search className="w-4 h-4 opacity-60" aria-hidden="true" />
              <input
                autoFocus
                type="search"
                aria-label="Buscar aula, arquivo do MySuperStore ou termo"
                placeholder="Ir para aula, arquivo .py ou conceito do glossário..."
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
              />
              <button
                type="button"
                className="ide-icon-btn"
                onClick={() => setPaletteOpen(false)}
                aria-label="Fechar busca"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="ide-palette-results">
              {paletteResults.matchedLessons.length > 0 && (
                <div className="ide-palette-group">
                  <div className="ide-palette-label">Aulas da Trilha</div>
                  {paletteResults.matchedLessons.map((l) => (
                    <button
                      key={l.slug}
                      type="button"
                      className="ide-palette-row"
                      onClick={() => {
                        setPaletteOpen(false);
                        router.push(`/pt/cursos/${courseSlug}/${l.slug}`);
                      }}
                    >
                      <span>{l.title}</span>
                      <small>M{l.moduleNumber}</small>
                    </button>
                  ))}
                </div>
              )}

              {paletteResults.matchedFiles.length > 0 && (
                <div className="ide-palette-group">
                  <div className="ide-palette-label">Arquivos MySuperStore</div>
                  {paletteResults.matchedFiles.map((f) => (
                    <button
                      key={f.path}
                      type="button"
                      className="ide-palette-row"
                      onClick={() => {
                        setPaletteOpen(false);
                        setSelectedRepoFile(f);
                      }}
                    >
                      <code>{f.path}</code>
                      <small>{f.summary}</small>
                    </button>
                  ))}
                </div>
              )}

              {paletteResults.matchedGlossary.length > 0 && (
                <div className="ide-palette-group">
                  <div className="ide-palette-label">Glossário</div>
                  {paletteResults.matchedGlossary.map((g) => (
                    <button
                      key={g.term}
                      type="button"
                      className="ide-palette-row"
                      onClick={() => {
                        setPaletteOpen(false);
                        setGlossaryQuery(g.term);
                        onUpdatePreferences({ explorerTab: "glossary" });
                        setSidebarOpen(true);
                      }}
                    >
                      <strong>{g.term}</strong>
                      <small>{g.definition}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
