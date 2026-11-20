"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  ImagePlus,
  Link2,
  MessageCircle,
  Timer,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { growthTools } from "../lib/growth-catalog";
import ProjectPlanner from "./ProjectPlanner";
import { RoiTool } from "../ferramentas/RoiTool";

type HubTab = "planner" | "roi" | "tools";

const TOOL_ICONS = [MessageCircle, Link2, Timer, BarChart3, Activity];

export default function WorkbenchHub() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [tab, setTab] = useState<HubTab>("planner");

  const tabs: Array<{ id: HubTab; label: string; icon: typeof Bot }> = [
    {
      id: "planner",
      label: pt ? "1. Arquiteto IA & Roteiro" : "1. AI Architect & Roadmap",
      icon: Bot,
    },
    {
      id: "roi",
      label: pt ? "2. Simulador de ROI B2B" : "2. B2B ROI Simulator",
      icon: TrendingUp,
    },
    {
      id: "tools",
      label: pt ? "3. Ferramentas & Estúdio" : "3. Free Tools & Studio",
      icon: Wrench,
    },
  ];

  return (
    <section id="diagnostico" className="workbench-section">
      <div className="wrap">
        <div className="studio-section-heading">
          <div>
            <div className="studio-kicker">
              02 / {pt ? "WORKBENCH INTERATIVO · SEM CADASTRO" : "INTERACTIVE WORKBENCH · NO SIGNUP"}
            </div>
            <h2>
              {pt ? "Prove valor antes" : "Prove value before"}
              <br />
              <span>{pt ? "de fechar qualquer contrato." : "signing any contract."}</span>
            </h2>
            <p>
              {pt
                ? "Centralizamos planejamento com IA, simulação financeira B2B e utilitários práticos em um único painel interativo — sem poluir sua leitura."
                : "AI architecture planning, B2B ROI simulation, and practical browser utilities unified in one interactive console."}
            </p>
          </div>
          <Link className="studio-text-link" href={localePath("/ferramentas", lang)}>
            {pt ? "Abrir catálogo de 19+ ferramentas" : "Open 19+ tools catalog"}
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="workbench-shell">
          <div className="workbench-tabs" role="tablist" aria-label={pt ? "Console interativo" : "Interactive console"}>
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`workbench-tab${active ? " is-active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="workbench-pane" role="tabpanel">
            {tab === "planner" && <ProjectPlanner embedded />}

            {tab === "roi" && (
              <div className="workbench-roi-wrap">
                <div className="workbench-roi-banner">
                  <div>
                    <span className="sec-tag">
                      {pt ? "Para Empresas B2B & Comércio" : "For B2B & Retail Operations"}
                    </span>
                    <h3>
                      {pt
                        ? "Sua empresa está perdendo clientes ou margem por processos manuais?"
                        : "Is your company losing revenue to manual processes?"}
                    </h3>
                    <p>
                      {pt
                        ? "Ajuste os números da sua operação para enxergar o retorno mensal de corrigir presença digital, funil de leads e automações."
                        : "Adjust your operational metrics to estimate the monthly return of fixing digital acquisition and automation."}
                    </p>
                  </div>
                  <Link
                    href={localePath("/ferramentas/diagnostico-digital", lang)}
                    className="btn btn-ghost"
                  >
                    <span>
                      {pt ? "Abrir Teste de Maturidade 6D" : "Open 6D Maturity Quiz"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <RoiTool />
              </div>
            )}

            {tab === "tools" && (
              <div className="workbench-tools-grid">
                <Link
                  href={localePath("/ferramentas/estudio-de-imagem", lang)}
                  className="workbench-studio-card"
                  data-analytics="tool_click"
                >
                  <div className="workbench-studio-icon">
                    <ImagePlus size={26} />
                  </div>
                  <div>
                    <span className="studio-pill">
                      {pt ? "100% no navegador · Privado" : "100% in-browser · Private"}
                    </span>
                    <h3>
                      {pt
                        ? "Estúdio de Imagem — Remover Fundo & WebP"
                        : "Image Studio — Background Removal & WebP"}
                    </h3>
                    <p>
                      {pt
                        ? "Prepare fotos de catálogo, remova o fundo com IA local e converta para WebP sem enviar arquivos para servidores externos."
                        : "Prepare product photos, remove backgrounds locally with AI, and convert to WebP without server uploads."}
                    </p>
                  </div>
                  <ArrowUpRight size={20} className="workbench-studio-arrow" />
                </Link>

                <div className="growth-cards">
                  {growthTools.map((tool, i) => {
                    const Icon = TOOL_ICONS[i] ?? Wrench;
                    return (
                      <Link
                        href={localePath(`/ferramentas/${tool.slug}`, lang)}
                        key={tool.key}
                        className={`growth-card growth-color-${i % 3}`}
                        data-analytics="tool_click"
                      >
                        <div className="growth-card-top">
                          <Icon size={25} />
                          <ArrowUpRight size={19} />
                        </div>
                        <h3>{tool.copy[lang].title}</h3>
                        <p>{tool.copy[lang].description}</p>
                        <span>
                          {pt ? "Abrir ferramenta" : "Open tool"}
                          <ArrowUpRight size={15} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

