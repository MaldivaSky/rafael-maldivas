"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  FlipHorizontal2,
  Globe,
  Home,
  Rocket,
  ShoppingBag,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useCourseWorkspace } from "@/app/hooks/useCourseWorkspace";
import {
  getCourseLevelSpec,
  getDeployCardsForLevel,
} from "@/app/lib/course-levels";
import { computeCourseGamification } from "@/app/lib/course-workspace";
import { TERMINAL_MISSIONS } from "@/app/lib/terminal-sim";
import { SoftwareSkeletonMasterclass } from "./SoftwareSkeletonMasterclass";

export default function CourseFreeDeployShowcase({
  courseSlug,
}: {
  courseSlug: string;
}) {
  const { workspace } = useCourseWorkspace(courseSlug);
  const selectedLevel = workspace.preferences.selectedLevel;
  const levelSpec = getCourseLevelSpec(selectedLevel);
  const deployCards = getDeployCardsForLevel(selectedLevel);
  const gamification = computeCourseGamification(
    workspace,
    levelSpec.recommendedSlugs,
  );

  const terminalTotalSteps = TERMINAL_MISSIONS.reduce(
    (acc, m) => acc + m.steps.length,
    0,
  );
  const deployDoneCount = deployCards.filter(
    (c) => workspace.deployChecklist[c.id],
  ).length;
  const labsPassedCount = Object.values(workspace.labsPassed).filter(
    (l) => l.passed,
  ).length;

  const stations = [
    {
      id: "http",
      stepLabel: "Ato 1 · Planta & Arquitetura",
      title: "1. Simulador de Requisições HTTP, Estoque & Webhook",
      description:
        "Antes de instalar qualquer programa: veja como o Garçom (Rota) conversa com a Cozinha (Servidor) e teste status 200, 201, 401 e 409.",
      statusText: "Planta viva do sistema",
      done: workspace.completedSlugs.includes("modulo-0-f01-o-mapa"),
      href: `/pt/cursos/${courseSlug}/pratica?estacao=http&aula=modulo-0-f01-o-mapa`,
      cta: "1º Explorar Planta & Rotas HTTP",
      icon: Globe,
    },
    {
      id: "terminal",
      stepLabel: "Ato 2 (Parte A) · Perder o Medo da Tela Preta",
      title: "2. Terminal Simulado Guiado (Antes do VS Code)",
      description:
        "Treine pwd, ls, mkdir, git init, .gitignore, venv e migrate num simulador seguro que explica cada comando antes de usar o seu PC.",
      statusText: `${workspace.terminalSteps.length}/${terminalTotalSteps} comandos dominados`,
      done: workspace.terminalMissions.includes("mission-1-git-basics"),
      href: `/pt/cursos/${courseSlug}/pratica?estacao=terminal&aula=modulo-0-f02-preparando-a-bancada&missao=mission-1-git-basics`,
      cta: "2º Treinar na Tela Preta Simulada",
      icon: TerminalSquare,
    },
    {
      id: "bancada",
      stepLabel: "Ato 2 (Parte B) · Esqueleto Guiado",
      title: "3. Bancada VS Code + Casa Pré-Moldada (.zip Explicada)",
      description:
        "Agora que você entende a planta e o terminal, baixe o projeto-esqueleto com os 4 cômodos já separados (Alicerce, Paredes, Móveis e Telhado) e siga o guia do VS Code.",
      statusText: "4 cômodos + testar_minha_casa.py",
      done: workspace.terminalSteps.length >= 4,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=bancada&aula=modulo-0-f02-preparando-a-bancada`,
      cta: "3º Montar VS Code & Casa Pré-Moldada",
      icon: Home,
    },
    {
      id: "sandbox",
      stepLabel: "Atos 3 & 4 · Alicerce SQL & Paredes da API",
      title: "4. Oficina de Modelagem (Order/SubOrder), Centavos & Python",
      description:
        "Construa a modelagem de dados em centavos inteiros, congele preços com Snapshot, programe a trava de estoque concorrente e rode os testes no navegador.",
      statusText: `${labsPassedCount}/18 laboratórios aprovados`,
      done: labsPassedCount > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=sandbox&aula=modulo-2-modelo-de-dados`,
      cta: "4º Construir Modelagem & Regras",
      icon: Code2,
    },
    {
      id: "loja",
      stepLabel: "Ato 5 · Acabamento Visual & Testes",
      title: "5. Fábrica Visual da Vitrine (Móveis da Sua Loja)",
      description:
        "Com o alicerce e as paredes prontos, personalize o nome da sua loja, cores, produtos e WhatsApp e baixe o index.html pronto.",
      statusText: "Gerador ao vivo liberado",
      done: deployDoneCount > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=loja&aula=modulo-0-f05-testes-e-git`,
      cta: "5º Personalizar Móveis da Vitrine",
      icon: ShoppingBag,
    },
    {
      id: "deploy",
      stepLabel: "Ato 6 · Inauguração na Rua (R$ 0,00)",
      title: "6. Publicação Cloud Passo a Passo (1 Provedor por Vez)",
      description:
        "Siga um provedor por etapa (GitHub → Neon PostgreSQL → Render → Vercel) com fotos reais indicando onde clicar no plano gratuito.",
      statusText: `${deployDoneCount}/${deployCards.length} provedores publicados`,
      done: deployDoneCount === deployCards.length && deployCards.length > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=deploy&aula=modulo-5-infraestrutura-deploy-backup`,
      cta: "6º Publicar na Internet (R$ 0)",
      icon: Rocket,
    },
  ];

  return (
    <section className="curso-section" aria-labelledby="quest-map-heading">
      <div className="wrap" style={{ display: "grid", gap: 28 }}>
        {/* Masterclass Interativa: Esqueleto do Sistema, Modelagem de Dados, Ordem de Implementação & NotebookLM Studio */}
        <SoftwareSkeletonMasterclass courseSlug={courseSlug} />

        {/* Gamified 6-Act Practice Stations Map */}
        <div className="ide-quest-map-hero">
          <div>
            <div className="sec-tag">
              Progressão Gamificada em 6 Atos · 100% Gratuita · Na Ordem da Engenharia
            </div>
            <h2 id="quest-map-heading">
              As 6 Arenas Práticas na Ordem Certa de Construção
            </h2>
            <p className="curso-muted" style={{ maxWidth: 760, marginTop: 6 }}>
              Respeitamos o processo real de engenharia de software:{" "}
              <strong>1º Planta &amp; Rotas</strong> → <strong>2º Terminal Seguro</strong> →{" "}
              <strong>3º VS Code &amp; Casa Pré-Moldada</strong> →{" "}
              <strong>4º Modelagem SQL &amp; API</strong> → <strong>5º Vitrine &amp; Testes</strong>{" "}
              → <strong>6º Deploy Cloud R$ 0,00</strong>.
            </p>
          </div>

          <div className="ide-quest-hud-card" aria-label="Progresso do aluno">
            <div className="flex flex-wrap items-center gap-2">
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
            </div>
            <p className="ide-muted-xs" style={{ marginTop: 8 }}>
              Trilha ativa: <strong>{levelSpec.name}</strong> ({gamification.trackCompleted}/
              {gamification.trackTotal} fases concluídas · {gamification.trackPct}%)
            </p>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 10 }}>
              <Link
                href={`/pt/cursos/${courseSlug}/${levelSpec.recommendedSlugs[0] ?? "modulo-0-f01-o-mapa"}`}
                className="ide-btn ide-btn-primary ide-btn-xs"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Começar Fase 1 da Trilha →</span>
              </Link>
              <Link
                href={`/pt/cursos/${courseSlug}/pratica?estacao=cards`}
                className="ide-btn ide-btn-ghost ide-btn-xs"
              >
                <FlipHorizontal2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Baralho 3D Flip Cards</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="ide-quest-stations-grid">
          {stations.map((st) => {
            const Icon = st.icon;
            return (
              <article
                key={st.id}
                className={`ide-quest-station-card${st.done ? " is-done" : ""}`}
              >
                <div className="ide-quest-station-top">
                  <span className="ide-file-badge">
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {st.stepLabel}
                  </span>
                  <span className="ide-pill-counter">
                    {st.done && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 ide-text-emerald"
                        aria-hidden="true"
                        style={{ display: "inline", marginRight: 4 }}
                      />
                    )}
                    {st.statusText}
                  </span>
                </div>
                <h3>{st.title}</h3>
                <p>{st.description}</p>
                <div className="ide-quest-station-footer">
                  <Link href={st.href} className="ide-btn ide-btn-primary">
                    <span>{st.cta}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
