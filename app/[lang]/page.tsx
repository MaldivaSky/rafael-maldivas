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
        ? "Maldivas Tech — Sistemas de Gestão, SaaS e TI Gerenciada"
        : "Maldivas Tech — Management Systems, SaaS and Managed IT",
    description:
      lang === "pt"
        ? "Desenvolvemos sistemas de gestão e SaaS multi-tenant. Produtos próprios — MiseOn (restaurantes) e SelectSys Jobs (ATS) — e software sob medida a partir de São Paulo para o mundo."
        : "We build management systems and multi-tenant SaaS. Our products — MiseOn (restaurants) and SelectSys Jobs (ATS) — plus custom software from São Paulo to the world.",
    keywords:
      lang === "pt"
        ? ["sistemas de gestão", "SaaS para restaurantes", "ATS para agências", "software sob medida"]
        : ["management systems", "restaurant SaaS", "ATS for agencies", "custom software"],
  });
}

export default function LangHome() {
  return <HomeClient />;
}
