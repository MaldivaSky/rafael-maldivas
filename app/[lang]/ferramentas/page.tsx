import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import FerramentasClient from "@/app/ferramentas/FerramentasClient";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
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
    path: "ferramentas",
    title:
      lang === "pt"
        ? "Ferramentas Gratuitas — Imagens, Custos e Consultas"
        : "Free Tools — Images, Costing and Lookups",
    description:
      lang === "pt"
        ? "Ferramentas gratuitas para preparar imagens, calcular custos, conferir NF-e e Pix e consultar dados de empresas e domínios. Sem cadastro."
        : "Free tools to prepare images, calculate costs, verify Brazilian invoices (NF-e) and Pix, and look up company and domain data. No sign-up.",
    keywords:
      lang === "pt"
        ? ["ferramentas gratuitas", "calculadora de CMV", "consultar CNPJ"]
        : ["free business tools", "cost calculator", "brazilian business lookup"],
  });
}

export default function FerramentasPage() {
  return <FerramentasClient />;
}
