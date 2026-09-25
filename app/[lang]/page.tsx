import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import HomeClient from "@/app/HomeClient";

export function generateStaticParams() {
  return LOCALES.map((lang: Lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  return buildMetadata({
    lang,
    path: "",
    title:
      lang === "pt"
        ? "Maldivas Tech — Sistemas de Gestão e Software Sob Medida em São Paulo"
        : "Maldivas Tech — Management Systems & Custom Software in São Paulo",
    description:
      lang === "pt"
        ? "A Maldivas Tech, de Rafael Maldivas, desenvolve sistemas de gestão e software sob medida para organizar operações, integrar ferramentas e reduzir tarefas manuais. São Paulo e atendimento remoto."
        : "Maldivas Tech, led by Rafael Maldivas, builds management systems and custom software to organise operations, connect tools and reduce manual work. Based in São Paulo, serving clients remotely.",
    keywords:
      lang === "pt"
        ? ["sistemas de gestão", "SaaS para restaurantes", "ATS para agências", "software sob medida"]
        : ["management systems", "restaurant SaaS", "ATS for agencies", "custom software"],
  });
}

export default function LangHome() {
  return <HomeClient />;
}
