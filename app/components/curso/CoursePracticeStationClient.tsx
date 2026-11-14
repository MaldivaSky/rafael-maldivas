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
            {/* Step 0: Visual Blueprint + Studio Video before any download */}
            <div
              className="ide-prefab-card"
              style={{
                marginBottom: 20,
                border: "1px solid rgba(56, 189, 248, 0.35)",
                background: "rgba(15, 23, 42, 0.9)",
              }}
            >
              <span className="ide-file-badge">
                🎬 Briefing de Engenharia · Entenda Antes de Baixar
              </span>
              <h2 style={{ marginTop: 8 }}>
                Como um Engenheiro Organiza o Esqueleto do Sistema (Os 4 Cômodos)
              </h2>
              <p className="ide-lab-objective" style={{ marginTop: 6 }}>
                Antes de baixar qualquer arquivo, entenda a regra de ouro: todo sistema real é
                dividido em <strong>4 cômodos independentes</strong> e construído na ordem certa:{" "}
                <strong>1º Alicerce (Modelagem em Centavos)</strong> →{" "}
                <strong>2º Paredes (API e Trava de Estoque)</strong> →{" "}
                <strong>3º Móveis (Vitrine HTML)</strong> →{" "}
                <strong>4º Inspetor &amp; Telhado (Testes e Deploy)</strong>.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 16,
                  marginTop: 14,
                }}
              >
                <figure
                  style={{
                    margin: 0,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    background: "#070d19",
                  }}
                >
                  <img
                    src="/cursos/guias/anatomia-casa-pre-moldada.svg"
                    alt="Diagrama mostrando os 4 cômodos da Casa Pré-Moldada na ordem de construção: 1. Alicerce, 2. Paredes, 3. Móveis e 4. Habite-se."
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </figure>

                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(2, 6, 23, 0.7)",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "0.92rem", color: "#f8fafc" }}>
                    🎥 Assista: Preparando a Bancada &amp; Terminal (Estúdio .mp4)
                  </strong>
                  <p style={{ fontSize: "0.8rem", color: "#cbd5e1", margin: "4px 0 10px" }}>
                    Veja em 2 minutos como o terminal, o VS Code, o ambiente virtual Python e o Git
                    trabalham juntos sem bagunçar seu computador.
                  </p>
                  <video
                    controls
                    preload="metadata"
                    style={{ width: "100%", borderRadius: 8, background: "#020617" }}
                  >
                    <source src="/cursos/midia/preparando-a-bancada.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            <div className="ide-prefab-grid">
              <div className="ide-prefab-card ide-prefab-highlight">
                <span className="ide-file-badge">
                  <Home className="w-3.5 h-3.5" aria-hidden="true" /> Passo 1 · Escolha o Kit da Sua Etapa Atual
                </span>
                <h2>Sua Casa Pré-Moldada (Explicada Item por Item)</h2>
                <p className="ide-lab-objective">
                  Não jogamos arquivos soltos! Veja abaixo para que serve cada pacote antes de baixar:
                </p>
                <ul
                  style={{
                    marginTop: 10,
                    marginBottom: 14,
                    paddingLeft: 18,
                    fontSize: "0.85rem",
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  <li>
                    <strong>1. Casa Pré-Moldada (.zip Recomendado):</strong> Esqueleto didático com os 4
                    cômodos marcados com <code>[TIJOLO 1]</code>, <code>[PAREDE 1]</code>,{" "}
                    <code>[MÓVEL 1]</code> e o robô avaliador <code>testar_minha_casa.py</code>.
                  </li>
                  <li>
                    <strong>2. Mini-Loja Django (.zip):</strong> Gabarito do Módulo 0 (F03–F05) com
                    Django + DRF configurado.
                  </li>
                  <li>
                    <strong>3. Kit Projeto Final (.zip):</strong> Estrutura base para a entrega do
                    Certificado (Módulo 7).
                  </li>
                </ul>

                <div className="flex flex-wrap gap-3" style={{ marginTop: 14 }}>
                  <a
                    href="/cursos/kits/casa-pre-moldada-marketplace.zip"
                    download
                    className="ide-btn ide-btn-primary"
                    onClick={() => setVscodeChecks((p) => ({ ...p, zip: true }))}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>1. Baixar Casa Pré-Moldada (.zip)</span>
                  </a>
                  <a
                    href="/cursos/kits/mini-loja-kit.zip"
                    download
                    className="ide-btn ide-btn-ghost"
                  >
                    <FolderGit2 className="w-4 h-4" aria-hidden="true" />
                    <span>2. Baixar Mini-Loja Django (.zip)</span>
                  </a>
                  <a
                    href="/cursos/kits/projeto-final-minimarket-kit.zip"
                    download
                    className="ide-btn ide-btn-ghost"
                  >
                    <Wrench className="w-4 h-4" aria-hidden="true" />
                    <span>3. Baixar Kit do Projeto Final (.zip)</span>
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

            {/* Planta Arquitetônica dos 4 Cômodos na Ordem Oficial de Implementação */}
            <div className="ide-prefab-rooms-grid" style={{ marginTop: 20 }}>
              <article className="ide-prefab-room">
                <span className="ide-file-badge">1º na Ordem · Alicerce &amp; Modelagem</span>
                <h3>
                  <code>02-alicerce-banco/models_esqueleto.py</code>
                </h3>
                <p>
                  Tudo começa pela Modelagem de Dados! Aqui você preenche <code>[TIJOLO 1]</code> (preço em
                  centavos inteiros para nunca perder 1 centavo) e <code>[TIJOLO 2]</code> (snapshot imutável do
                  preço no segundo da compra).
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() =>
                    navigateToStation("sandbox", { aula: "modulo-2-modelo-de-dados" })
                  }
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>1º Praticar Modelagem no Sandbox →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">2º na Ordem · Paredes &amp; Estoque</span>
                <h3>
                  <code>03-paredes-api/api_esqueleto.py</code>
                </h3>
                <p>
                  Com o banco modelado, levantamos as paredes: em <code>[PAREDE 1]</code> você trava o estoque
                  para ninguém comprar a última peça duas vezes; em <code>[PAREDE 2]</code> você calcula o split
                  exato do lojista.
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
                  <span>2º Testar Parede de Estoque no Sandbox →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">3º na Ordem · Móveis &amp; Fachada</span>
                <h3>
                  <code>01-acabamento-vitrine/index.html</code>
                </h3>
                <p>
                  Com alicerce e paredes prontos, colocamos os móveis! Você abre no VS Code, procura pelos
                  marcadores <code>[MÓVEL 1]</code>, <code>[MÓVEL 2]</code> e <code>[MÓVEL 3]</code> e personaliza sua
                  vitrine de roupas.
                </p>
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() => navigateToStation("loja")}
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>3º Personalizar também na Fábrica Online →</span>
                </button>
              </article>

              <article className="ide-prefab-room">
                <span className="ide-file-badge">4º na Ordem · Testes &amp; Publicação R$ 0</span>
                <h3>
                  <code>testar_minha_casa.py + 04-telhado-deploy/</code>
                </h3>
                <p>
                  Rode <code>python testar_minha_casa.py</code> para validar seus 4 cômodos e use os arquivos de
                  deploy (<code>.gitignore</code> + <code>Procfile</code>) para publicar no GitHub, Neon, Render e Vercel.
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
