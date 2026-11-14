"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  Download,
  FlipHorizontal2,
  FolderGit2,
  Globe,
  Home,
  Layers,
  Rocket,
  ShoppingBag,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import {
  allCourseLessons,
  courseBySlug,
  lessonBySlug,
} from "@/app/lib/courses";
import {
  COURSE_LEVELS,
  getCourseLevelSpec,
  type CourseDifficultyLevel,
} from "@/app/lib/course-levels";
import {
  computeCourseGamification,
} from "@/app/lib/course-workspace";
import {
  TERMINAL_MISSIONS,
  getRecommendedTerminalMission,
  type TerminalMissionId,
} from "@/app/lib/terminal-sim";
import { localePath } from "@/app/lib/i18n";
import type { Lang } from "@/app/lib/seo";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import { FreeDeployGuidePanel } from "./FreeDeployGuidePanel";
import { IdeWorkbench } from "./IdeWorkbench";
import { InteractiveFlipDeck } from "./InteractiveFlipDeck";
import { InteractiveTerminalLab } from "./InteractiveTerminalLab";

export type StationId =
  | "bancada"
  | "terminal"
  | "sandbox"
  | "http"
  | "loja"
  | "deploy"
  | "cards";

const STATION_SPECS: Array<{
  id: StationId;
  order: number;
  shortLabel: string;
  title: string;
  subtitle: string;
  xpRewardLabel: string;
}> = [
  {
    id: "bancada",
    order: 0,
    shortLabel: "0. Casa Pré-Moldada & VS Code",
    title: "Estação 0 · Sua Casa Pré-Moldada + Bancada VS Code",
    subtitle:
      "Baixe o esqueleto pronto da sua loja, instale VS Code + Python + Git sem travar e veja exatamente onde encaixar cada tijolo, parede e móvel.",
    xpRewardLabel: "+50 XP ao preparar a bancada",
  },
  {
    id: "terminal",
    order: 1,
    shortLabel: "1. Tela Preta (Terminal)",
    title: "Estação 1 · Simulador Seguro de Terminal Preto",
    subtitle:
      "Domine os comandos reais (pwd, mkdir, git init, .gitignore, venv, migrate e deploy) antes de abrir o terminal de verdade.",
    xpRewardLabel: "+25 XP por comando dominado",
  },
  {
    id: "sandbox",
    order: 2,
    shortLabel: "2. Oficina Python & SQL",
    title: "Estação 2 · Sandbox de Código Python 3.12 & SQLite",
    subtitle:
      "Construa o tijolo técnico da aula atual e rode os testes automatizados direto no navegador.",
    xpRewardLabel: "+50 XP por laboratório aprovado",
  },
  {
    id: "http",
    order: 3,
    shortLabel: "3. Simulador API & Webhook",
    title: "Estação 3 · Simulador de Requisições HTTP, Estoque & Webhook PIX",
    subtitle:
      "Dispare requisições GET/POST, teste concorrência de última peça e valide assinatura HMAC e idempotência.",
    xpRewardLabel: "+40 XP em diagnóstico de API",
  },
  {
    id: "loja",
    order: 4,
    shortLabel: "4. Móveis da Minha Loja",
    title: "Estação 4 · Fábrica Visual da Sua Vitrine de Roupas",
    subtitle:
      "Personalize o nome da sua marca, cores, peças, preços e WhatsApp ao vivo e baixe o index.html pronto.",
    xpRewardLabel: "+50 XP ao gerar sua vitrine",
  },
  {
    id: "deploy",
    order: 5,
    shortLabel: "5. Publicar R$ 0 (Nuvem)",
    title: "Estação 5 · Guia Passo a Passo de Publicação R$ 0,00",
    subtitle:
      "Um provedor por vez (GitHub → Neon PostgreSQL → Render → Vercel) com fotos reais mostrando onde clicar sem gastar nada.",
    xpRewardLabel: "+50 XP por provedor concluído",
  },
  {
    id: "cards",
    order: 6,
    shortLabel: "6. Flip Cards 3D",
    title: "Estação 6 · Baralho 3D Dinâmico de Revisão Rápida",
    subtitle:
      "Vire os cartões 3D para fixar os conceitos-chave do seu nível (Fácil, Mediano ou Difícil).",
    xpRewardLabel: "Memória ativa desbloqueada",
  },
];

function isValidStation(val: string | null): val is StationId {
  return (
    val === "bancada" ||
    val === "terminal" ||
    val === "sandbox" ||
    val === "http" ||
    val === "loja" ||
    val === "deploy" ||
    val === "cards"
  );
}

function isValidMission(val: string | null): val is TerminalMissionId {
  return (
    val === "mission-1-git-basics" ||
    val === "mission-2-django-env" ||
    val === "mission-3-deploy-check"
  );
}

export default function CoursePracticeStationClient({
  courseSlug,
  lang,
}: {
  courseSlug: string;
  lang: Lang;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    workspace,
    setCodeDraft,
    recordLabResult,
    setNote,
    reviewSrsCard,
    toggleDeployStep,
    recordTerminalProgress,
    updatePreferences,
  } = useCourseWorkspace(courseSlug);

  const course = useMemo(() => courseBySlug(courseSlug), [courseSlug]);
  const allLessons = useMemo(
    () => (course ? allCourseLessons(course) : []),
    [course],
  );

  const stationParam = searchParams.get("estacao");
  const activeStation: StationId = isValidStation(stationParam)
    ? stationParam
    : "terminal";

  const aulaParam = searchParams.get("aula");
  const originLesson = useMemo(() => {
    if (!course) return allLessons[0];
    if (aulaParam) {
      const found = lessonBySlug(course, aulaParam);
      if (found) return found;
    }
    return allLessons[0];
  }, [allLessons, aulaParam, course]);

  const effectiveLessonSlug = originLesson?.slug ?? "modulo-0-f01-o-mapa";

  const missaoParam = searchParams.get("missao");
  const effectiveMissionId: TerminalMissionId = isValidMission(missaoParam)
    ? missaoParam
    : getRecommendedTerminalMission(effectiveLessonSlug);

  const provedorParam = searchParams.get("provedor") ?? undefined;

  const selectedLevel = workspace.preferences.selectedLevel;
  const levelSpec = getCourseLevelSpec(selectedLevel);
  const gamification = useMemo(
    () => computeCourseGamification(workspace, levelSpec.recommendedSlugs),
    [levelSpec.recommendedSlugs, workspace],
  );

  const currentStationSpec =
    STATION_SPECS.find((s) => s.id === activeStation) ?? STATION_SPECS[1];

  const [vscodeChecks, setVscodeChecks] = useState<Record<string, boolean>>({
    zip: false,
    vscode: false,
    python: false,
    terminal: false,
  });

  function navigateToStation(
    nextStation: StationId,
    opts?: { aula?: string; missao?: TerminalMissionId; provedor?: string },
  ) {
    const params = new URLSearchParams();
    params.set("estacao", nextStation);
    const targetAula = opts?.aula ?? aulaParam ?? effectiveLessonSlug;
    if (targetAula) params.set("aula", targetAula);
    if (opts?.missao) params.set("missao", opts.missao);
    if (opts?.provedor) params.set("provedor", opts.provedor);
    router.push(
      `${localePath(`/cursos/${courseSlug}/pratica`, lang)}?${params.toString()}`,
    );
  }

  return (
    <main className="ide-station-page" aria-label="Arena Prática Gamificada">
      {/* Top Game HUD */}
      <header className="ide-station-hud">
        <div className="wrap ide-station-hud-inner">
          <div className="ide-station-nav-left">
            {originLesson ? (
              <Link
                href={localePath(
                  `/cursos/${courseSlug}/${originLesson.slug}`,
                  lang,
                )}
                className="ide-btn ide-btn-primary"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar para a Aula ({originLesson.id.replace("licao-", "").toUpperCase()})</span>
              </Link>
            ) : null}
            <Link
              href={localePath(`/cursos/${courseSlug}`, lang)}
              className="ide-btn ide-btn-ghost"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Mapa do Curso</span>
            </Link>
          </div>

          <div className="ide-station-xp-bar" aria-label="Status do jogador">
            <span className="ide-xp-rank-pill">
              <Award className="w-4 h-4 ide-text-amber" aria-hidden="true" />
              <span>
                Nível {gamification.levelNumber} · {gamification.rankTitle}
              </span>
            </span>
            <span className="ide-xp-points-pill">
              <Sparkles className="w-3.5 h-3.5 ide-text-cyan" aria-hidden="true" />
              <strong>{gamification.xp} XP</strong>
            </span>
            <span className="ide-xp-track-pill">
              Trilha {levelSpec.shortTitle}:{" "}
              <strong>
                {gamification.trackCompleted}/{gamification.trackTotal} fases ({gamification.trackPct}%)
              </strong>
            </span>
          </div>

          <div className="ide-level-pills" role="group" aria-label="Trilha escolhida">
            {(["facil", "mediano", "dificil"] as CourseDifficultyLevel[]).map((lvl) => {
              const spec = COURSE_LEVELS[lvl];
              const active = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  className={`ide-preset-chip${active ? " is-selected-chip" : ""}`}
                  onClick={() => updatePreferences({ selectedLevel: lvl })}
                >
                  {spec.shortTitle}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="wrap ide-station-container">
        {/* Station Switcher Bar */}
        <nav className="ide-station-tabs" aria-label="Estações de Prática">
          {STATION_SPECS.map((station) => {
            const isCurrent = station.id === activeStation;
            return (
              <button
                key={station.id}
                type="button"
                className={`ide-station-tab${isCurrent ? " is-active" : ""}`}
                onClick={() => navigateToStation(station.id)}
              >
                <span>{station.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Context Banner showing how the Station adapts to the Origin Lesson */}
        <section className="ide-station-mission-banner" aria-label="Missão ativa nesta arena">
          <div className="ide-station-mission-info">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ide-file-badge">{currentStationSpec.xpRewardLabel}</span>
              {originLesson && (
                <span className="ide-runtime-badge is-ready">
                  Missão vinculada à aula: {originLesson.title}
                </span>
              )}
            </div>
            <h1 className="ide-station-title">{currentStationSpec.title}</h1>
            <p className="ide-station-subtitle">{currentStationSpec.subtitle}</p>
          </div>

          {(activeStation === "sandbox" || activeStation === "http" || activeStation === "terminal") && (
            <div className="ide-station-lesson-picker">
              <label htmlFor="station-lesson-select" className="ide-muted-xs">
                Trocar tarefa por fase da trilha:
              </label>
              <select
                id="station-lesson-select"
                className="ide-select-input"
                value={effectiveLessonSlug}
                onChange={(e) => {
                  const nextSlug = e.target.value;
                  navigateToStation(activeStation, {
                    aula: nextSlug,
                    missao: getRecommendedTerminalMission(nextSlug),
                  });
                }}
              >
                {allLessons.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* STATION 0: CASA PRÉ-MOLDADA + BANCADA VS CODE                    */}
        {/* ================================================================ */}
        {activeStation === "bancada" && (
          <section className="ide-station-stage" aria-label="Casa Pré-Moldada e Instalação do VS Code">
            <div className="ide-prefab-grid">
              <div className="ide-prefab-card ide-prefab-highlight">
                <span className="ide-file-badge">
                  <Home className="w-3.5 h-3.5" aria-hidden="true" /> Passo 1 · Baixe o Esqueleto Pronto
                </span>
                <h2>Sua Casa Pré-Moldada (Você não começa do zero!)</h2>
                <p className="ide-lab-objective">
                  Em vez de encarar uma pasta vazia sem saber por onde começar, baixe nossa{" "}
                  <strong>Casa Pré-Moldada (.zip)</strong>. Ela já vem com os 4 cômodos criados, comentários
                  exatos (<code>[MÓVEL 1]</code>, <code>[TIJOLO 1]</code>, <code>[PAREDE 1]</code>) indicando
                  onde escrever seu código e um inspetor automático (<code>testar_minha_casa.py</code>).
                </p>

                <div className="flex flex-wrap gap-3" style={{ marginTop: 14 }}>
                  <a
                    href="/cursos/kits/casa-pre-moldada-marketplace.zip"
                    download
                    className="ide-btn ide-btn-primary"
                    onClick={() => setVscodeChecks((p) => ({ ...p, zip: true }))}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Baixar Casa Pré-Moldada (.zip)</span>
                  </a>
                  <a
                    href="/cursos/kits/mini-loja-kit.zip"
                    download
                    className="ide-btn ide-btn-ghost"
                  >
                    <FolderGit2 className="w-4 h-4" aria-hidden="true" />
                    <span>Baixar Mini-Loja Django Pronta (Gabarito .zip)</span>
                  </a>
                  <a
                    href="/cursos/kits/projeto-final-minimarket-kit.zip"
                    download
                    className="ide-btn ide-btn-ghost"
                  >
                    <Wrench className="w-4 h-4" aria-hidden="true" />
                    <span>Baixar Kit do Projeto Final (.zip)</span>
                  </a>
                </div>
              </div>

              {/* Checklist guiado VS Code + Python + Git */}
              <div className="ide-prefab-card">
                <span className="ide-file-badge">
                  <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> Passo 2 · Monte sua Bancada no Computador
                </span>
                <h3>Checklist de Instalação para Iniciantes (Windows / Mac / Linux)</h3>
                <div className="ide-prefab-checklist">
                  <label className="ide-prefab-check-row">
                    <input
                      type="checkbox"
                      checked={vscodeChecks.zip}
                      onChange={(e) =>
                        setVscodeChecks((p) => ({ ...p, zip: e.target.checked }))
                      }
                    />
                    <div>
                      <strong>1. Baixar e descompactar a Casa Pré-Moldada</strong>
                      <p>Extraia o arquivo <code>casa-pre-moldada-marketplace.zip</code> para uma pasta como <code>Documentos/minha-loja</code>.</p>
                    </div>
                  </label>

                  <label className="ide-prefab-check-row">
                    <input
                      type="checkbox"
                      checked={vscodeChecks.vscode}
                      onChange={(e) =>
                        setVscodeChecks((p) => ({ ...p, vscode: e.target.checked }))
                      }
                    />
                    <div>
                      <strong>
                        2. Instalar o VS Code (gratuito em{" "}
                        <a
                          href="https://code.visualstudio.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline", color: "#38bdf8" }}
                        >
                          code.visualstudio.com
                        </a>
                        )
                      </strong>
                      <p>
                        Abra o VS Code, clique em <code>File → Open Folder...</code> (Arquivo → Abrir Pasta) e selecione a pasta <code>minha-loja</code>.
                      </p>
                    </div>
                  </label>

                  <label className="ide-prefab-check-row">
                    <input
                      type="checkbox"
                      checked={vscodeChecks.python}
                      onChange={(e) =>
                        setVscodeChecks((p) => ({ ...p, python: e.target.checked }))
                      }
                    />
                    <div>
                      <strong>
                        3. Instalar Python 3.12 (
                        <a
                          href="https://www.python.org/downloads/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline", color: "#38bdf8" }}
                        >
                          python.org
                        </a>
                        ) + Git (
                        <a
                          href="https://git-scm.com/downloads"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline", color: "#38bdf8" }}
                        >
                          git-scm.com
                        </a>
                        )
                      </strong>
                      <p>
                        Regra de ouro no Windows: marque a caixa <code>[x] Add python.exe to PATH</code> na primeira tela do instalador do Python!
                      </p>
                    </div>
                  </label>

                  <label className="ide-prefab-check-row">
                    <input
                      type="checkbox"
                      checked={vscodeChecks.terminal}
                      onChange={(e) =>
                        setVscodeChecks((p) => ({ ...p, terminal: e.target.checked }))
                      }
                    />
                    <div>
                      <strong>4. Abrir o Terminal Integrado dentro do VS Code e rodar o Inspetor</strong>
                      <p>
                        Aperte <code>Ctrl + &apos;</code> (ou menu <code>Terminal → New Terminal</code>) e digite{" "}
                        <code>python testar_minha_casa.py</code> para ver os 4 cômodos passarem no teste!
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Planta Arquitetônica dos 4 Cômodos */}
            <div className="ide-prefab-rooms-grid" style={{ marginTop: 20 }}>
              <article className="ide-prefab-room">
                <span className="ide-file-badge">Cômodo 1 · Móveis &amp; Fachada (Nível Fácil)</span>
                <h3>
                  <code>01-acabamento-vitrine/index.html</code>
                </h3>
                <p>
                  A vitrine de roupas já vem desenhada! Você abre no VS Code, procura pelos marcadores{" "}
                  <code>[MÓVEL 1]</code>, <code>[MÓVEL 2]</code> e <code>[MÓVEL 3]</code> e coloca o nome da sua
                  loja, seu WhatsApp e suas peças.
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() => navigateToStation("loja")}
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Personalizar também na Fábrica Online →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">Cômodo 2 · Alicerce &amp; Tijolos (Nível Mediano)</span>
                <h3>
                  <code>02-alicerce-banco/models_esqueleto.py</code>
                </h3>
                <p>
                  A fundação do banco de dados: aqui você preenche <code>[TIJOLO 1]</code> (preço em centavos
                  inteiros para nunca perder 1 centavo) e <code>[TIJOLO 2]</code> (snapshot do preço no momento da
                  compra).
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() =>
                    navigateToStation("sandbox", { aula: "modulo-2-modelo-de-dados" })
                  }
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Praticar este Tijolo no Sandbox →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">Cômodo 3 · Paredes &amp; Estoque (Nível Mediano/Difícil)</span>
                <h3>
                  <code>03-paredes-api/api_esqueleto.py</code>
                </h3>
                <p>
                  As paredes que protegem seu dinheiro: em <code>[PAREDE 1]</code> você trava o estoque para
                  ninguém comprar a última peça duas vezes; em <code>[PAREDE 2]</code> você calcula o split exato do
                  lojista.
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() =>
                    navigateToStation("sandbox", {
                      aula: "modulo-3-criar-pedido-sem-vender-duas-vezes",
                    })
                  }
                >
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Testar Parede de Estoque no Sandbox →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">Cômodo 4 · Telhado &amp; Rua (Publicação R$ 0)</span>
                <h3>
                  <code>04-telhado-deploy/ (.gitignore + Procfile)</code>
                </h3>
                <p>
                  Os arquivos que blindam suas senhas (<code>.env</code> fora do Git) e ligam sua loja gratuitamente
                  no GitHub, Neon PostgreSQL, Render e Vercel.
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-primary ide-btn-xs"
                  onClick={() => navigateToStation("terminal")}
                >
                  <TerminalSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ir para Estação 1: Treinar na Tela Preta →</span>
                </button>
              </article>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 1: TERMINAL PRETO SIMULADO                               */}
        {/* ================================================================ */}
        {activeStation === "terminal" && (
          <section className="ide-station-stage" aria-label="Estação Terminal Preto">
            <InteractiveTerminalLab
              completedStepIds={workspace.terminalSteps}
              completedMissions={workspace.terminalMissions}
              onRecordProgress={recordTerminalProgress}
              initialMissionId={effectiveMissionId}
              onUnlockContinue={() => navigateToStation("sandbox")}
              continueLabel="Missão Cumprida · Avançar para Oficina de Código →"
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 2: SANDBOX PYTHON & SQL                                  */}
        {/* ================================================================ */}
        {activeStation === "sandbox" && (
          <section className="ide-station-stage" aria-label="Estação Sandbox de Código">
            <IdeWorkbench
              lessonSlug={effectiveLessonSlug}
              workspace={workspace}
              forcedTab="lab"
              hideTabBar={true}
              onChangeTab={(tab) => updatePreferences({ activeTab: tab })}
              onUpdateCodeDraft={setCodeDraft}
              onRecordLabResult={recordLabResult}
              onUpdateNotes={setNote}
              onReviewSrsCard={reviewSrsCard}
              onToggleDeployStep={toggleDeployStep}
              onRecordTerminalProgress={recordTerminalProgress}
              onChangeLevel={(level) => updatePreferences({ selectedLevel: level })}
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 3: SIMULADOR HTTP, WEBHOOK & PIX                         */}
        {/* ================================================================ */}
        {activeStation === "http" && (
          <section className="ide-station-stage" aria-label="Estação HTTP e Webhook">
            <IdeWorkbench
              lessonSlug={effectiveLessonSlug}
              workspace={workspace}
              forcedTab="http"
              hideTabBar={true}
              onChangeTab={(tab) => updatePreferences({ activeTab: tab })}
              onUpdateCodeDraft={setCodeDraft}
              onRecordLabResult={recordLabResult}
              onUpdateNotes={setNote}
              onReviewSrsCard={reviewSrsCard}
              onToggleDeployStep={toggleDeployStep}
              onRecordTerminalProgress={recordTerminalProgress}
              onChangeLevel={(level) => updatePreferences({ selectedLevel: level })}
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 4: FÁBRICA DA SUA VITRINE (MÓVEIS & ACABAMENTO)          */}
        {/* ================================================================ */}
        {activeStation === "loja" && (
          <section className="ide-station-stage" aria-label="Estação Fábrica de Vitrine">
            <FreeDeployGuidePanel
              selectedLevel={selectedLevel}
              deployChecklist={workspace.deployChecklist}
              onToggleDeployStep={toggleDeployStep}
              onChangeLevel={(lvl) => updatePreferences({ selectedLevel: lvl })}
              sectionMode="builder"
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 5: PUBLICAÇÃO R$ 0 (1 PROVEDOR POR VEZ)                  */}
        {/* ================================================================ */}
        {activeStation === "deploy" && (
          <section className="ide-station-stage" aria-label="Estação Publicação Gratuita">
            <FreeDeployGuidePanel
              selectedLevel={selectedLevel}
              deployChecklist={workspace.deployChecklist}
              onToggleDeployStep={toggleDeployStep}
              onChangeLevel={(lvl) => updatePreferences({ selectedLevel: lvl })}
              sectionMode="deploy"
              initialProviderId={provedorParam}
            />
          </section>
        )}

        {/* ================================================================ */}
        {/* STATION 6: BARALHO 3D FLIP CARDS                                 */}
        {/* ================================================================ */}
        {activeStation === "cards" && (
          <section className="ide-station-stage" aria-label="Estação Flip Cards 3D">
            <InteractiveFlipDeck activeLevel={selectedLevel} />
          </section>
        )}

        {/* Bottom Return & Next Station Footer */}
        <footer className="ide-station-footer">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {originLesson ? (
              <Link
                href={localePath(
                  `/cursos/${courseSlug}/${originLesson.slug}`,
                  lang,
                )}
                className="ide-btn ide-btn-primary"
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Concluir Prática e Voltar para a Aula ({originLesson.title})</span>
              </Link>
            ) : (
              <Link
                href={localePath(`/cursos/${courseSlug}`, lang)}
                className="ide-btn ide-btn-primary"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Voltar para a Trilha do Curso</span>
              </Link>
            )}

            <div className="flex flex-wrap gap-2">
              {activeStation !== "deploy" && (
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => navigateToStation("deploy")}
                >
                  <Rocket className="w-4 h-4" aria-hidden="true" />
                  <span>Ir para Publicação R$ 0</span>
                </button>
              )}
              {activeStation !== "cards" && (
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost"
                  onClick={() => navigateToStation("cards")}
                >
                  <FlipHorizontal2 className="w-4 h-4" aria-hidden="true" />
                  <span>Virar Cartas 3D</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
