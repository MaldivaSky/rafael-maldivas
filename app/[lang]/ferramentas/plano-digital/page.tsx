import { notFound } from "next/navigation";
import ProjectPlanner from "@/app/components/ProjectPlanner";
import { AutomationTool } from "@/app/ferramentas/GrowthTools";
import { buildMetadata } from "@/app/lib/metadata";
import { isLang } from "@/app/lib/seo";

export function generateStaticParams() { return [{ lang: "pt" }, { lang: "en" }]; }
export function generateMetadata({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return {};
  return buildMetadata({ lang: params.lang, path: "ferramentas/plano-digital", title: params.lang === "pt" ? "Planejador digital gratuito" : "Free digital planner", description: params.lang === "pt" ? "Escolha sua prioridade, baixe um plano inicial e simule o tempo que uma automação poderia liberar." : "Choose a priority, download a starting plan and simulate the time automation could free up." });
}
export default function Page({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  return <div style={{ paddingTop: 90 }}><div className="wrap"><h1>{params.lang === "pt" ? "Seu próximo passo digital." : "Your next digital step."}</h1></div><ProjectPlanner/><section id="simulador"><div className="wrap"><AutomationTool/></div></section></div>;
}
