"use client";

import { useState } from "react";
import { ArrowUpRight, Compass, Download } from "lucide-react";
import { useLang } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";

const plans = {
  pt: [
    { title: "Atrair mais contatos", steps: ["Escolha um serviço ou produto para apresentar com clareza.", "Prepare uma página com exemplos reais e um contato visível.", "Crie um link UTM para cada canal de divulgação e acompanhe as visitas."] },
    { title: "Organizar minha operação", steps: ["Liste onde pedidos, estoque e informações ficam hoje.", "Escolha o processo com mais erros ou retrabalho.", "Defina os dados e as permissões necessários antes de escolher um sistema."] },
    { title: "Automatizar tarefas repetitivas", steps: ["Registre uma tarefa, seu tempo de execução e frequência.", "Separe regras previsíveis das decisões que precisam de revisão humana.", "Teste a automação em uma pequena amostra e compare tempo e qualidade."] },
    { title: "Melhorar minha imagem", steps: ["Escolha o público e a mensagem principal da sua marca.", "Reúna fotos, vídeos e exemplos reais do seu trabalho.", "Prepare um conjunto consistente de imagens para site, catálogo e redes."] },
  ],
  en: [
    { title: "Attract more contacts", steps: ["Choose one service or product to explain clearly.", "Prepare a page with real examples and an obvious contact action.", "Create a UTM link for each channel and review visits."] },
    { title: "Organize my operations", steps: ["List where orders, stock and information live today.", "Choose the process with the most errors or repeated work.", "Define data and permissions before choosing a system."] },
    { title: "Automate repetitive tasks", steps: ["Record a task, its duration and frequency.", "Separate predictable rules from decisions needing human review.", "Test automation on a small sample and compare time and quality."] },
    { title: "Improve my brand image", steps: ["Choose your audience and your brand's main message.", "Collect photos, video and real examples of your work.", "Prepare consistent images for your site, catalogue and social channels."] },
  ],
};

export default function ProjectPlanner() {
  const { lang } = useLang(); const pt = lang === "pt";
  const [selected, setSelected] = useState(0);
  const plan = plans[lang][selected];
  const text = `${pt ? "Meu plano digital" : "My digital plan"} — Maldivas Tech\n\n${plan.title}\n\n${plan.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\n\n${pt ? "Ponto de partida para discussão; não substitui uma avaliação do negócio." : "A starting point for discussion, not a business assessment."}`;
  return <section id="diagnostico"><div className="wrap"><div className="growth-tool">
    <div className="growth-tool-icon"><Compass size={27}/></div>
    <div className="sec-tag">{pt ? "Planejador digital · gratuito" : "Digital planner · free"}</div>
    <h2>{pt ? "Vamos encontrar seu próximo passo." : "Let’s find your next step."}</h2>
    <p>{pt ? "Escolha sua prioridade e leve um roteiro inicial de três ações." : "Choose your priority and take away three initial action steps."}</p>
    <div className="growth-presets" role="group" aria-label={pt ? "Sua prioridade" : "Your priority"}>{plans[lang].map((item, i) => <button key={i} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.title}</button>)}</div>
    <div className="growth-plan" aria-live="polite"><h3>{plan.title}</h3><ol>{plan.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
    <div className="personal-actions"><button className="btn btn-primary" type="button" onClick={() => {const url = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"})); const a = document.createElement("a"); a.href = url; a.download = pt ? "meu-plano-digital.txt" : "my-digital-plan.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);}}><Download size={17}/>{pt ? "Baixar meu plano" : "Download my plan"}</button><a className="personal-link" href={`${WHATSAPP}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">{pt ? "Conversar com Rafael" : "Talk to Rafael"}<ArrowUpRight size={17}/></a></div>
  </div></div></section>;
}
