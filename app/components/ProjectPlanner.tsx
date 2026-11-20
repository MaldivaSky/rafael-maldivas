"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Compass,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useLang } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";
import type { DiagnosticAgentResult } from "../lib/ai-agent-core";

const plans = {
  pt: [
    {
      title: "Atrair mais contatos",
      priority: "Alta",
      timeframe: "2–4 semanas",
      steps: [
        "Escolha um serviço ou produto para apresentar com clareza.",
        "Prepare uma página com exemplos reais e um contato visível.",
        "Crie um link UTM para cada canal de divulgação e acompanhe as visitas.",
      ],
      _pdf: {
        priority: "Alta",
        timeframe: "2–4 semanas",
        metrics: [
          "Aumento de visitas ao site",
          "Taxa de cliques no WhatsApp",
          "Origem das visitas por canal",
        ],
        nextStep: "Criar ou revisar a página de apresentação do serviço escolhido.",
      },
    },
    {
      title: "Organizar minha operação",
      priority: "Média",
      timeframe: "4–8 semanas",
      steps: [
        "Liste onde pedidos, estoque e informações ficam hoje.",
        "Escolha o processo com mais erros ou retrabalho.",
        "Defina os dados e as permissões necessários antes de escolher um sistema.",
      ],
      _pdf: {
        priority: "Média",
        timeframe: "4–8 semanas",
        metrics: [
          "Tempo médio de atendimento",
          "Taxa de erros por processo",
          "Horas semanais em retrabalho",
        ],
        nextStep: "Mapear o processo com maior custo de retrabalho e quantificar o impacto.",
      },
    },
    {
      title: "Automatizar tarefas repetitivas",
      priority: "Alta",
      timeframe: "3–6 semanas",
      steps: [
        "Registre uma tarefa, seu tempo de execução e frequência.",
        "Separe regras previsíveis das decisões que precisam de revisão humana.",
        "Teste a automação em uma pequena amostra e compare tempo e qualidade.",
      ],
      _pdf: {
        priority: "Alta",
        timeframe: "3–6 semanas",
        metrics: [
          "Horas liberadas por mês",
          "Taxa de erro antes vs. depois",
          "Custo por execução",
        ],
        nextStep: "Simular o tempo economizado na ferramenta de automação e conversar com Rafael.",
      },
    },
    {
      title: "Melhorar minha imagem",
      priority: "Média",
      timeframe: "2–3 semanas",
      steps: [
        "Escolha o público e a mensagem principal da sua marca.",
        "Reúna fotos, vídeos e exemplos reais do seu trabalho.",
        "Prepare um conjunto consistente de imagens para site, catálogo e redes.",
      ],
      _pdf: {
        priority: "Média",
        timeframe: "2–3 semanas",
        metrics: [
          "Consistência visual nas redes",
          "Engajamento por post",
          "Reconhecimento da marca",
        ],
        nextStep: "Definir uma paleta de cores e tipografia para usar em todos os materiais.",
      },
    },
  ],
  en: [
    {
      title: "Attract more contacts",
      priority: "High",
      timeframe: "2–4 weeks",
      steps: [
        "Choose one service or product to explain clearly.",
        "Prepare a page with real examples and an obvious contact action.",
        "Create a UTM link for each channel and review visits.",
      ],
      _pdf: {
        priority: "High",
        timeframe: "2–4 weeks",
        metrics: [
          "Website visit growth",
          "WhatsApp click-through rate",
          "Visit origin by channel",
        ],
        nextStep: "Create or revise the presentation page for your chosen service.",
      },
    },
    {
      title: "Organise my operations",
      priority: "Medium",
      timeframe: "4–8 weeks",
      steps: [
        "List where orders, stock and information live today.",
        "Choose the process with the most errors or repeated work.",
        "Define data and permissions before choosing a system.",
      ],
      _pdf: {
        priority: "Medium",
        timeframe: "4–8 weeks",
        metrics: [
          "Average service time",
          "Error rate per process",
          "Weekly hours on rework",
        ],
        nextStep: "Map the process with the highest rework cost and quantify the impact.",
      },
    },
    {
      title: "Automate repetitive tasks",
      priority: "High",
      timeframe: "3–6 weeks",
      steps: [
        "Record a task, its duration and frequency.",
        "Separate predictable rules from decisions needing human review.",
        "Test automation on a small sample and compare time and quality.",
      ],
      _pdf: {
        priority: "High",
        timeframe: "3–6 weeks",
        metrics: [
          "Hours freed per month",
          "Error rate before vs. after",
          "Cost per execution",
        ],
        nextStep: "Simulate time savings in the automation tool and talk to Rafael.",
      },
    },
    {
      title: "Improve my brand image",
      priority: "Medium",
      timeframe: "2–3 weeks",
      steps: [
        "Choose your audience and your brand's main message.",
        "Collect photos, video and real examples of your work.",
        "Prepare consistent images for your site, catalogue and social channels.",
      ],
      _pdf: {
        priority: "Medium",
        timeframe: "2–3 weeks",
        metrics: [
          "Visual consistency across channels",
          "Engagement per post",
          "Brand recognition",
        ],
        nextStep: "Define a colour palette and typeface to use across all materials.",
      },
    },
  ],
};

function escapeHtml(raw: string): string {
  return raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Opens a styled print window — user saves as PDF via browser dialog */
function printPlan(
  plan: (typeof plans.pt)[0],
  lang: string,
  disclaimer: string,
  aiDiagnostic: DiagnosticAgentResult | null,
) {
  const today = new Date().toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-US",
    { day: "2-digit", month: "long", year: "numeric" },
  );
  const p = plan._pdf;
  const priorityColor =
    p.priority === "Alta" || p.priority === "High" ? "#0E9384" : "#B45309";

  const activeTitle = aiDiagnostic ? aiDiagnostic.recommendedSolution : plan.title;
  const activeSteps = aiDiagnostic ? aiDiagnostic.firstSprintSteps : plan.steps;
  const activeMetrics = aiDiagnostic ? aiDiagnostic.metricsToTrack : p.metrics;
  const activeTimeline = aiDiagnostic ? aiDiagnostic.estimatedTimeline : p.timeframe;
  const activeNext = aiDiagnostic ? aiDiagnostic.summary : p.nextStep;

  const html = `<!DOCTYPE html>
<html lang="${lang === "pt" ? "pt-BR" : "en"}">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(activeTitle)} — Maldivas Tech</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#fff;color:#0f172a;padding:48px;max-width:760px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:20px;border-bottom:2px solid #e2e8f0}
  .brand{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#0166BB}
  .brand-sub{font-size:11.5px;color:#64748b;font-weight:500;margin-top:3px}
  .date{font-size:12px;color:#64748b;text-align:right}
  .plan-tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0166BB;margin-bottom:10px}
  .plan-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1.15;margin-bottom:18px}
  .badges{display:flex;gap:10px;margin-bottom:28px;flex-wrap:wrap}
  .badge{font-size:12px;font-weight:600;padding:6px 14px;border-radius:999px}
  .badge-p{background:${priorityColor}18;color:${priorityColor};border:1px solid ${priorityColor}40}
  .badge-t{background:#f1f5f9;color:#334155;border:1px solid #cbd5e1}
  .sec-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748b;margin-bottom:12px}
  .steps{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
  .step{display:flex;gap:14px;align-items:flex-start;padding:14px 16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0}
  .num{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:#0166BB;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}
  .step-text{font-size:14.5px;line-height:1.6;color:#1e293b;padding-top:2px}
  .metrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:28px}
  .metric{padding:12px 14px;background:#f8fafc;border-radius:9px;border:1px solid #e2e8f0;font-size:13px;color:#334155}
  .next{padding:18px 22px;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:14px;border:1px solid #7dd3fc;margin-bottom:36px}
  .next p{font-size:14.5px;color:#0c4a6e;font-weight:500;line-height:1.6}
  .footer{padding-top:18px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}
  .fn{font-size:11px;color:#64748b;line-height:1.6}
  .fu{font-size:11px;color:#0166BB;font-weight:700}
  @media print{body{padding:32px}@page{margin:0;size:A4}}
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Maldivas Tech</div>
      <div class="brand-sub">Rafael Maldivas · Sistemas de Gestão, SaaS &amp; Presença Digital</div>
    </div>
    <div class="date">${escapeHtml(today)}</div>
  </div>
  <div class="plan-tag">${aiDiagnostic ? (lang === "pt" ? "Diagnóstico Arquitetural IA" : "AI Architectural Diagnostic") : (lang === "pt" ? "Planejador Digital" : "Digital Planner")}</div>
  <h1 class="plan-title">${escapeHtml(activeTitle)}</h1>
  <div class="badges">
    <span class="badge badge-p">Prioridade: ${escapeHtml(p.priority)}</span>
    <span class="badge badge-t">Prazo estimado: ${escapeHtml(activeTimeline)}</span>
  </div>
  <div class="sec-label">${lang === "pt" ? "3 ações da primeira sprint" : "3 Sprint-1 actions"}</div>
  <ol class="steps">
    ${activeSteps.map((s, i) => `<li class="step"><span class="num">${i + 1}</span><span class="step-text">${escapeHtml(s)}</span></li>`).join("")}
  </ol>
  <div class="sec-label">${lang === "pt" ? "Indicadores para acompanhar" : "KPIs to track"}</div>
  <div class="metrics">
    ${activeMetrics.map((m) => `<div class="metric">${escapeHtml(m)}</div>`).join("")}
  </div>
  <div class="sec-label">${lang === "pt" ? "Síntese técnica e próximo passo" : "Technical summary & next step"}</div>
  <div class="next"><p>${escapeHtml(activeNext)}</p></div>
  <div class="footer">
    <div class="fn">${escapeHtml(disclaimer)}<br/>Maldivas Tech · CNPJ 68.923.239/0001-77</div>
    <div class="fu">www.maldivastech.dev</div>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=820,height=1100");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}

export default function ProjectPlanner({ embedded = false }: { embedded?: boolean }) {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [selected, setSelected] = useState(0);
  const [business, setBusiness] = useState("");
  const [pain, setPain] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState<DiagnosticAgentResult | null>(null);

  const plan = plans[lang][selected];

  const disclaimer = pt
    ? "Ponto de partida arquitetural para discussão; não substitui levantamento presencial."
    : "Architectural starting point for discussion, not a substitute for full discovery.";

  const whatsappText = aiResult
    ? pt
      ? `Olá, Rafael! Gerei o diagnóstico IA para "${business || plan.title}": recomendação "${aiResult.recommendedSolution}". Quero avançar na Sprint 1.`
      : `Hi Rafael! I generated the AI diagnostic for "${business || plan.title}" (${aiResult.recommendedSolution}) and want to discuss Sprint 1.`
    : pt
      ? `Olá, Rafael! Escolhi a prioridade "${plan.title}" no planejador digital. Gostaria de conversar sobre os próximos passos.`
      : `Hi Rafael! I chose the priority "${plan.title}" in the digital planner. I'd love to talk about next steps.`;

  async function handleGenerateAiPlan(e: React.FormEvent) {
    e.preventDefault();
    if (business.trim().length < 2 && pain.trim().length < 3) {
      setAiError(
        pt
          ? "Conte rapidamente qual é o negócio ou o que está travando hoje."
          : "Briefly describe your business or main bottleneck.",
      );
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/agent/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business,
          pain,
          priority: plan.title,
          lang,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        data?: DiagnosticAgentResult;
      };
      if (!res.ok || !json.ok || !json.data) {
        setAiError(
          pt
            ? "Não foi possível gerar o diagnóstico agora. Tente novamente."
            : "Could not generate diagnostic right now. Please try again.",
        );
        return;
      }
      setAiResult(json.data);
    } catch {
      setAiError(
        pt
          ? "Falha de rede ao consultar o Arquiteto IA."
          : "Network error while contacting AI Architect.",
      );
    } finally {
      setAiLoading(false);
    }
  }

  const content = (
    <div className="growth-tool">
      <div className="growth-tool-icon">
        <Compass size={27} />
      </div>
      <div className="sec-tag">
        {pt ? "Arquiteto IA & Planejador Digital · Gratuito" : "AI Architect & Digital Planner · Free"}
      </div>
      <h2>
        {pt
          ? "Vamos desenhar o próximo passo da sua operação."
          : "Let's design the next step for your operation."}
      </h2>
      <p>
        {pt
          ? "Escolha um roteiro rápido abaixo ou descreva seu gargalo para o Agente Arquiteto IA da Maldivas Tech montar a arquitetura inicial."
          : "Pick a quick track below or describe your bottleneck so our Solutions Architect AI outlines your initial roadmap."}
      </p>

      <div
        className="growth-presets"
        role="group"
        aria-label={pt ? "Sua prioridade" : "Your priority"}
      >
        {plans[lang].map((item, i) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="growth-plan" aria-live="polite">
        <h3>{plan.title}</h3>
        <ol>
          {plan.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <form className="planner-ai-box" onSubmit={handleGenerateAiPlan}>
        <div className="planner-ai-head">
          <Bot size={18} aria-hidden="true" />
          <strong>
            {pt
              ? "Diagnóstico Arquitetural Personalizado (Agente Gemini)"
              : "Custom Architectural Diagnostic (Gemini Agent)"}
          </strong>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="planner-biz">
              {pt ? "Qual é o seu negócio?" : "What is your business?"}
            </label>
            <input
              id="planner-biz"
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder={
                pt
                  ? "Ex.: Restaurante com delivery, mercado, agência B2B..."
                  : "e.g. Restaurant with delivery, retail store, B2B agency..."
              }
              maxLength={180}
            />
          </div>
          <div className="field">
            <label htmlFor="planner-pain">
              {pt ? "Qual gargalo quer resolver?" : "What bottleneck do you want to solve?"}
            </label>
            <input
              id="planner-pain"
              type="text"
              value={pain}
              onChange={(e) => setPain(e.target.value)}
              placeholder={
                pt
                  ? "Ex.: Estoque não bate, redigitação de pedidos, falta de leads..."
                  : "e.g. Inventory mismatch, manual order re-entry, low leads..."
              }
              maxLength={320}
            />
          </div>
        </div>
        {aiError && (
          <p className="field-hint result-warn" role="alert">
            {aiError}
          </p>
        )}
        <div className="planner-ai-actions">
          <button type="submit" className="btn btn-primary" disabled={aiLoading}>
            {aiLoading ? (
              <Loader2 size={17} className="spin" />
            ) : (
              <Sparkles size={17} />
            )}
            <span>
              {aiLoading
                ? pt
                  ? "Analisando arquitetura..."
                  : "Analyzing architecture..."
                : pt
                  ? "Gerar Diagnóstico com IA"
                  : "Generate AI Diagnostic"}
            </span>
          </button>
        </div>
      </form>

      {aiResult && (
        <div className="planner-ai-result" aria-live="polite">
          <div className="planner-badges">
            <span className="planner-badge badge-high">
              {aiResult.source === "gemini"
                ? `Gemini (${aiResult.model ?? "Flash"})`
                : pt
                  ? "Arquitetura Maldivas Tech"
                  : "Maldivas Architecture"}
            </span>
            <span className="planner-badge badge-time">
              {aiResult.estimatedTimeline}
            </span>
          </div>
          <h3>{aiResult.recommendedSolution}</h3>
          <p className="planner-ai-summary">{aiResult.summary}</p>
          {aiResult.architecturePillars.length > 0 && (
            <>
              <div className="planner-section-label">
                {pt ? "Pilares de Engenharia" : "Engineering Pillars"}
              </div>
              <ul className="planner-ai-list">
                {aiResult.architecturePillars.map((pillar) => (
                  <li key={pillar}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{pillar}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="planner-section-label">
            {pt ? "Primeira Sprint (Execução)" : "Sprint 1 Actions"}
          </div>
          <ol className="planner-ai-ol">
            {aiResult.firstSprintSteps.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
          {aiResult.metricsToTrack.length > 0 && (
            <div className="planner-metrics">
              {aiResult.metricsToTrack.map((m) => (
                <span key={m} className="planner-metric">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="personal-actions">
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => printPlan(plan, lang, disclaimer, aiResult)}
        >
          <FileText size={17} /> {pt ? "Baixar plano em PDF" : "Download PDF roadmap"}
        </button>
        <a
          className="personal-link"
          href={`${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="contact_click"
        >
          {pt ? "Validar com Rafael no WhatsApp" : "Review with Rafael on WhatsApp"}{" "}
          <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section id="diagnostico">
      <div className="wrap">{content}</div>
    </section>
  );
}
