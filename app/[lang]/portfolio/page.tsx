import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import PortfolioClient from "@/app/portfolio/PortfolioClient";

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
    path: "portfolio",
    title:
      lang === "pt"
        ? "Portfólio — Sistemas em Produção, Clientes Reais e Audiovisual"
        : "Portfolio — Production Systems, Real Clients and Video",
    description:
      lang === "pt"
        ? "MiseOn, SelectSys Jobs, mercadinhosys e MySuperStore em produção, além de entregas para pet shop, salão e food service. Inclui vídeo institucional e captação com drone em São Paulo."
        : "MiseOn, SelectSys Jobs, mercadinhosys and MySuperStore in production, plus deliveries for pet shops, salons and food service. Includes corporate video and drone footage in São Paulo.",
    keywords:
      lang === "pt"
        ? ["portfólio de software", "SaaS em produção", "case de sistema"]
        : ["software portfolio", "SaaS in production", "software case study"],
  });
}

export default function PortfolioPage() {
  return <PortfolioClient />;
}
