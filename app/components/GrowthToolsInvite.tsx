"use client";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Link2, Timer, BarChart3, Activity } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { growthTools } from "../lib/growth-catalog";

const icons = [MessageCircle, Link2, Timer, BarChart3, Activity];
const benefits = {
  pt: [
    "Transforme a bio em uma porta de entrada para novos contatos.", 
    "Organize suas campanhas e identifique a origem das visitas.", 
    "Descubra quanto tempo uma tarefa repetitiva pode estar levando.",
    "Calcule quanto sua empresa está deixando na mesa.",
    "Avalie a maturidade digital da sua empresa gratuitamente."
  ],
  en: [
    "Turn your bio into a starting point for new conversations.", 
    "Organize campaigns and identify where visits come from.", 
    "Discover how much time a repetitive task could be taking.",
    "Calculate how much revenue you're leaving on the table.",
    "Evaluate your company's digital maturity for free."
  ],
};
export default function GrowthToolsInvite() {
  const { lang } = useLang(); const pt = lang === "pt";
  return <div className="growth-invite">
    <div className="growth-invite-heading"><div><span className="sec-tag">{pt ? "Novas ferramentas · sem cadastro" : "New tools · no signup"}</span><h2>{pt ? "Boas ideias. Utilidade de verdade." : "Good ideas. Real everyday value."}</h2></div><p>{pt ? "Divulgue melhor. Converse mais. Ganhe tempo." : "Share your work. Start conversations. Save time."}</p></div>
    <div className="growth-cards">{growthTools.map((tool, i) => { const Icon = icons[i]; return <Link href={localePath(`/ferramentas/${tool.slug}`, lang)} key={tool.key} className={`growth-card growth-color-${i}`} data-analytics="tool_click"><div className="growth-card-top">{Icon ? <Icon size={27}/> : null}<ArrowUpRight size={20}/></div><h3>{tool.copy[lang].title}</h3><p>{benefits[lang][i]}</p><span>{pt ? "Usar ferramenta" : "Use tool"} <ArrowUpRight size={16}/></span></Link>; })}</div>
  </div>;
}
