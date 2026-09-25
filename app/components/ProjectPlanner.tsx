"use client";

import { useState } from "react";
import { ArrowUpRight, Compass, Download, FileText } from "lucide-react";
import { useLang } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";

const plans = {
  pt: [
    {
      title: "Atrair mais contatos",
      icon: "📣",
      priority: "Alta",
      timeframe: "2–4 semanas",
      steps: [
        "Escolha um serviço ou produto para apresentar com clareza.",
        "Prepare uma página com exemplos reais e um contato visível.",
        "Crie um link UTM para cada canal de divulgação e acompanhe as visitas.",
      ],
      // Usado apenas no PDF — não aparece na página
      _pdf: {
        icon: "📣", priority: "Alta", timeframe: "2–4 semanas",
        metrics: ["Aumento de visitas ao site", "Taxa de cliques no WhatsApp", "Origem das visitas por canal"],
        nextStep: "Criar ou revisar a página de apresentação do serviço escolhido.",
      },
    },
    {
      title: "Organizar minha operação",
      icon: "⚙️",
      priority: "Média",
      timeframe: "4–8 semanas",
      steps: [
        "Liste onde pedidos, estoque e informações ficam hoje.",
        "Escolha o processo com mais erros ou retrabalho.",
        "Defina os dados e as permissões necessários antes de escolher um sistema.",
      ],
      _pdf: {
        icon: "⚙️", priority: "Média", timeframe: "4–8 semanas",
        metrics: ["Tempo médio de atendimento", "Taxa de erros por processo", "Horas semanais em retrabalho"],
        nextStep: "Mapear o processo com maior custo de retrabalho e quantificar o impacto.",
      },
    },
    {
      title: "Automatizar tarefas repetitivas",
      icon: "🤖",
      priority: "Alta",
      timeframe: "3–6 semanas",
      steps: [
        "Registre uma tarefa, seu tempo de execução e frequência.",
        "Separe regras previsíveis das decisões que precisam de revisão humana.",
        "Teste a automação em uma pequena amostra e compare tempo e qualidade.",
      ],
      _pdf: {
        icon: "🤖", priority: "Alta", timeframe: "3–6 semanas",
        metrics: ["Horas liberadas por mês", "Taxa de erro antes vs. depois", "Custo por execução"],
        nextStep: "Simular o tempo economizado na ferramenta de automação e conversar com Rafael.",
      },
    },
    {
      title: "Melhorar minha imagem",
      icon: "✨",
      priority: "Média",
      timeframe: "2–3 semanas",
      steps: [
        "Escolha o público e a mensagem principal da sua marca.",
        "Reúna fotos, vídeos e exemplos reais do seu trabalho.",
        "Prepare um conjunto consistente de imagens para site, catálogo e redes.",
      ],
      _pdf: {
        icon: "✨", priority: "Média", timeframe: "2–3 semanas",
        metrics: ["Consistência visual nas redes", "Engajamento por post", "Reconhecimento da marca"],
        nextStep: "Definir uma paleta de cores e tipografia para usar em todos os materiais.",
      },
    },
  ],
  en: [
    {
      title: "Attract more contacts",
      icon: "📣",
      priority: "High",
      timeframe: "2–4 weeks",
      steps: [
        "Choose one service or product to explain clearly.",
        "Prepare a page with real examples and an obvious contact action.",
        "Create a UTM link for each channel and review visits.",
      ],
      _pdf: {
        icon: "📣", priority: "High", timeframe: "2–4 weeks",
        metrics: ["Website visit growth", "WhatsApp click-through rate", "Visit origin by channel"],
        nextStep: "Create or revise the presentation page for your chosen service.",
      },
    },
    {
      title: "Organise my operations",
      icon: "⚙️",
      priority: "Medium",
      timeframe: "4–8 weeks",
      steps: [
        "List where orders, stock and information live today.",
        "Choose the process with the most errors or repeated work.",
        "Define data and permissions before choosing a system.",
      ],
      _pdf: {
        icon: "⚙️", priority: "Medium", timeframe: "4–8 weeks",
        metrics: ["Average service time", "Error rate per process", "Weekly hours on rework"],
        nextStep: "Map the process with the highest rework cost and quantify the impact.",
      },
    },
    {
      title: "Automate repetitive tasks",
      icon: "🤖",
      priority: "High",
      timeframe: "3–6 weeks",
      steps: [
        "Record a task, its duration and frequency.",
        "Separate predictable rules from decisions needing human review.",
        "Test automation on a small sample and compare time and quality.",
      ],
      _pdf: {
        icon: "🤖", priority: "High", timeframe: "3–6 weeks",
        metrics: ["Hours freed per month", "Error rate before vs. after", "Cost per execution"],
        nextStep: "Simulate time savings in the automation tool and talk to Rafael.",
      },
    },
    {
      title: "Improve my brand image",
      icon: "✨",
      priority: "Medium",
      timeframe: "2–3 weeks",
      steps: [
        "Choose your audience and your brand's main message.",
        "Collect photos, video and real examples of your work.",
        "Prepare consistent images for your site, catalogue and social channels.",
      ],
      _pdf: {
        icon: "✨", priority: "Medium", timeframe: "2–3 weeks",
        metrics: ["Visual consistency across channels", "Engagement per post", "Brand recognition"],
        nextStep: "Define a colour palette and typeface to use across all materials.",
      },
    },
  ],
};

/** Opens a styled print window — user saves as PDF via browser dialog */
function printPlan(
  plan: (typeof plans.pt)[0],
  lang: string,
  disclaimer: string
) {
  const today = new Date().toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-US",
    { day: "2-digit", month: "long", year: "numeric" }
  );
  const p = plan._pdf;
  const priorityColor =
    p.priority === "Alta" || p.priority === "High" ? "#10b981" : "#f59e0b";

  const html = `<!DOCTYPE html>
<html lang="${lang === "pt" ? "pt-BR" : "en"}">
<head>
<meta charset="UTF-8">
<title>${plan.title} — Maldivas Tech</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Outfit',sans-serif;background:#fff;color:#0f172a;padding:48px;max-width:760px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #f1f5f9}
  .brand{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6d28d9}
  .brand-sub{font-size:11px;color:#94a3b8;font-weight:400;margin-top:3px}
  .date{font-size:12px;color:#94a3b8;text-align:right}
  .plan-tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6d28d9;margin-bottom:12px}
  .plan-title{font-size:36px;font-weight:800;letter-spacing:-.04em;line-height:1.1;margin-bottom:20px}
  .badges{display:flex;gap:10px;margin-bottom:32px;flex-wrap:wrap}
  .badge{font-size:12px;font-weight:600;padding:6px 14px;border-radius:999px}
  .badge-p{background:${priorityColor}18;color:${priorityColor};border:1px solid ${priorityColor}40}
  .badge-t{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}
  .sec-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:14px}
  .steps{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:32px}
  .step{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0}
  .num{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:#6d28d9;color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}
  .step-text{font-size:15px;line-height:1.6;color:#334155;padding-top:2px}
  .metrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:32px}
  .metric{padding:12px 14px;background:#f8fafc;border-radius:9px;border:1px solid #e2e8f0;font-size:13px;color:#475569}
  .next{padding:18px 22px;background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-radius:14px;border:1px solid #c4b5fd;margin-bottom:40px}
  .next p{font-size:15px;color:#4c1d95;font-weight:500;line-height:1.6}
  .footer{padding-top:20px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center}
  .fn{font-size:11px;color:#94a3b8;line-height:1.6}
  .fu{font-size:11px;color:#6d28d9;font-weight:600}
  @media print{body{padding:32px}@page{margin:0;size:A4}}
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Maldivas Tech</div>
      <div class="brand-sub">Rafael Maldivas · Software &amp; Presença Digital</div>
    </div>
    <div class="date">${today}</div>
  </div>
  <div class="plan-tag">${lang === "pt" ? "Planejador Digital" : "Digital Planner"}</div>
  <h1 class="plan-title">${p.icon} ${plan.title}</h1>
  <div class="badges">
    <span class="badge badge-p">● ${p.priority}</span>
    <span class="badge badge-t">🗓 ${p.timeframe}</span>
  </div>
  <div class="sec-label">${lang === "pt" ? "3 ações para começar" : "3 actions to start"}</div>
  <ol class="steps">
    ${plan.steps.map((s, i) => `<li class="step"><span class="num">${i + 1}</span><span class="step-text">${s}</span></li>`).join("")}
  </ol>
  <div class="sec-label">${lang === "pt" ? "O que acompanhar" : "What to track"}</div>
  <div class="metrics">
    ${p.metrics.map((m) => `<div class="metric">📊 ${m}</div>`).join("")}
  </div>
  <div class="sec-label">${lang === "pt" ? "Próximo passo imediato" : "Immediate next step"}</div>
  <div class="next"><p>→ ${p.nextStep}</p></div>
  <div class="footer">
    <div class="fn">${disclaimer}<br/>Maldivas Tech · rafael-maldivas.vercel.app</div>
    <div class="fu">rafael-maldivas.vercel.app</div>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=820,height=1100");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

export default function ProjectPlanner() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [selected, setSelected] = useState(0);
  const plan = plans[lang][selected];

  const disclaimer = pt
    ? "Ponto de partida para discussão; não substitui uma avaliação do negócio."
    : "A starting point for discussion, not a business assessment.";

  const whatsappText = pt
    ? `Olá, Rafael! Escolhi a prioridade "${plan.title}" no planejador digital. Gostaria de conversar sobre os próximos passos.`
    : `Hi Rafael! I chose the priority "${plan.title}" in the digital planner. I'd love to talk about next steps.`;

  // Texto simples mantido como fallback visível na página (igual ao original)
  const text = `${pt ? "Meu plano digital" : "My digital plan"} — Maldivas Tech\n\n${plan.title}\n\n${plan.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n${disclaimer}`;

  return (
    <section id="diagnostico">
      <div className="wrap">
        <div className="growth-tool">
          <div className="growth-tool-icon"><Compass size={27} /></div>
          <div className="sec-tag">{pt ? "Planejador digital · gratuito" : "Digital planner · free"}</div>
          <h2>{pt ? "Vamos encontrar seu próximo passo." : "Let's find your next step."}</h2>
          <p>{pt ? "Escolha sua prioridade e leve um roteiro inicial de três ações." : "Choose your priority and take away three initial action steps."}</p>

          <div className="growth-presets" role="group" aria-label={pt ? "Sua prioridade" : "Your priority"}>
            {plans[lang].map((item, i) => (
              <button key={i} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>
                {item.title}
              </button>
            ))}
          </div>

          {/* Card do plano — igual ao original, sem prazos nem badges */}
          <div className="growth-plan" aria-live="polite">
            <h3>{plan.title}</h3>
            <ol>
              {plan.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>

          <div className="personal-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => printPlan(plan, lang, disclaimer)}
            >
              <FileText size={17} /> {pt ? "Baixar meu plano (PDF)" : "Download my plan (PDF)"}
            </button>
            <a
              className="personal-link"
              href={`${WHATSAPP}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="contact_click"
            >
              {pt ? "Conversar com Rafael" : "Talk to Rafael"} <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
