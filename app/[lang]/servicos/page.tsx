import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import ServicosClient from "@/app/servicos/ServicosClient";

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
    path: "servicos",
    title:
      lang === "pt"
        ? "Serviços — TI Gerenciada, E-mail Corporativo, Site e Divulgação"
        : "Services — Managed IT, Business Email, Websites and Marketing",
    description:
      lang === "pt"
        ? "Gerenciamento de TI, e-mail corporativo (SPF/DKIM/DMARC), manutenção de site com SEO, Google Ads e Meta Ads, desenvolvimento sob medida e Scrum. Contrato mensal com nota fiscal."
        : "Managed IT, business email (SPF/DKIM/DMARC), website maintenance with SEO, Google Ads and Meta Ads, custom development and Scrum. Monthly contract with invoices.",
    keywords:
      lang === "pt"
        ? ["gerenciamento de TI", "TI gerenciada São Paulo", "manutenção de site"]
        : ["managed IT services", "business email setup", "website maintenance"],
  });
}

export default function ServicosPage() {
  return <ServicosClient />;
}
