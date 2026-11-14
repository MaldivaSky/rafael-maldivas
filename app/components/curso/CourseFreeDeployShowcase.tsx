"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  Download,
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
      id: "bancada",
      stepLabel: "Estação 0 · Alicerce & Bancada",
      title: "Casa Pré-Moldada (.zip) + VS Code Passo a Passo",
      description:
        "Você não começa de uma tela em branco: baixe o esqueleto pronto com os 4 cômodos da loja, instale VS Code, Python e Git e saiba exatamente onde pôr cada tijolo, parede e móvel.",
      statusText: "Kit .zip pronto para baixar",
      done: workspace.terminalSteps.length > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=bancada`,
      cta: "Abrir Casa Pré-Moldada & VS Code",
      icon: Home,
    },
    {
      id: "terminal",
      stepLabel: "Estação 1 · Antes do Código",
      title: "Tela Preta Simulada (Zero Medo do Terminal)",
      description:
        "Treine pwd, ls, mkdir, git init, .gitignore, venv e migrate num ambiente seguro que bloqueia erros graves (como vazar o .env) antes de abrir o terminal real.",
      statusText: `${workspace.terminalSteps.length}/${terminalTotalSteps} comandos dominados`,
      done: workspace.terminalMissions.includes("mission-1-git-basics"),
      href: `/pt/cursos/${courseSlug}/pratica?estacao=terminal&missao=mission-1-git-basics`,
      cta: "Entrar na Arena do Terminal",
      icon: TerminalSquare,
    },
    {
      id: "sandbox",
      stepLabel: "Estação 2 · Tijolos & Paredes",
      title: "Oficina Python 3.12, SQLite & Simulador HTTP/PIX",
      description:
        "Construa a lógica de cada aula (centavos inteiros, trava de estoque concorrente, webhook idempotente) e rode os testes automatizados direto no navegador.",
      statusText: `${labsPassedCount}/18 laboratórios aprovados`,
      done: labsPassedCount > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=sandbox&aula=${levelSpec.recommendedSlugs[0] ?? "modulo-0-f01-o-mapa"}`,
      cta: "Abrir Oficina de Código",
      icon: Code2,
    },
    {
      id: "loja",
      stepLabel: "Estação 3 · Acabamento & Móveis",
      title: "Fábrica Visual da Sua Vitrine de Roupas",
      description:
        "Troque o nome da sua loja, escolha cores, cadastre produtos, teste o carrinho com envio para o seu WhatsApp e baixe o index.html pronto para publicar.",
      statusText: "Gerador ao vivo liberado",
      done: deployDoneCount > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=loja`,
      cta: "Personalizar Minha Loja",
      icon: ShoppingBag,
    },
    {
      id: "deploy",
      stepLabel: "Estação 4 · Publicação R$ 0,00",
      title: "Guia Passo a Passo na Nuvem (1 Provedor por Vez)",
      description:
        "Sem despejar tudo na tela: siga um provedor por etapa (GitHub → Neon PostgreSQL → Render → Vercel) com fotos indicando onde clicar no plano gratuito.",
      statusText: `${deployDoneCount}/${deployCards.length} provedores publicados`,
      done: deployDoneCount === deployCards.length && deployCards.length > 0,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=deploy`,
      cta: "Publicar Minha Loja R$ 0",
      icon: Rocket,
    },
    {
      id: "cards",
      stepLabel: "Estação 5 · Memória Ativa",
      title: "Baralho 3D Flip Cards & Simulador de API",
      description:
        "Vire os cartões dinâmicos 3D filtrados para o seu nível (Fácil, Mediano ou Difícil) e fixe cada conceito sem decorar.",
      statusText: "12 cartas 3D interativas",
      done: gamification.xp >= 250,
      href: `/pt/cursos/${courseSlug}/pratica?estacao=cards`,
      cta: "Jogar com os Flip Cards 3D",
      icon: FlipHorizontal2,
    },
  ];

  return (
    <section className="curso-section" aria-labelledby="quest-map-heading">
      <div className="wrap" style={{ display: "grid", gap: 24 }}>
        <div className="ide-quest-map-hero">
          <div>
            <div className="sec-tag">
              Jornada Gamificada · 100% Gratuita · Uma Fase por Vez
            </div>
            <h2 id="quest-map-heading">
              Mapa de Estações Práticas: Da Casa Pré-Moldada ao Site no Ar
            </h2>
            <p className="curso-muted" style={{ maxWidth: 760, marginTop: 6 }}>
              Em vez de misturar teoria, terminal e deploy na mesma tela, cada etapa da trilha leva
              você para a <strong>Arena Dedicada</strong> daquela missão. Você cumpre o desafio em tela
              cheia, ganha XP e destrava o próximo passo.
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
              <a
                href="/cursos/kits/casa-pre-moldada-marketplace.zip"
                download
                className="ide-btn ide-btn-primary ide-btn-xs"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Baixar Casa Pré-Moldada (.zip)</span>
              </a>
              <Link
                href={`/pt/cursos/${courseSlug}/pratica?estacao=bancada`}
                className="ide-btn ide-btn-ghost ide-btn-xs"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Abrir Arena em Tela Cheia</span>
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
                <p className="curso-muted">{st.description}</p>

                <div style={{ marginTop: "auto", paddingTop: 14 }}>
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
