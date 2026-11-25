import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "../lib/seo";
import { buildMetadata } from "../lib/metadata";
import HomeClient from "../HomeClient";

export function generateStaticParams() {
  return LOCALES.map((lang: Lang) => ({ lang }));
}

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  return buildMetadata({
    lang,
    path: "",
    title:
      lang === "pt"
        ? "Maldivas Tech — WhatsApp API Oficial em reais e SaaS em produção | São Paulo"
        : "Maldivas Tech — Official WhatsApp API in BRL & Live SaaS | São Paulo",
    description:
      lang === "pt"
        ? "Infraestrutura oficial de WhatsApp (Atol Connect, Cloud API da Meta com Inbox e Coexistência a partir de R$ 79/mês, sem markup) e sistemas em produção: MiseOn, MercadinhoSys e SelectSys Jobs."
        : "Official WhatsApp infrastructure (Atol Connect, Meta Cloud API with Inbox and Coexistence from BRL 79/month, no markup) and live systems: MiseOn, MercadinhoSys and SelectSys Jobs.",
    keywords:
      lang === "pt"
        ? ["api oficial whatsapp em reais", "whatsapp api sem markup", "whatsapp coexistência", "sistema para restaurante", "ATS Brasil Japão", "Maldivas Tech"]
        : ["official whatsapp api brazil", "whatsapp api no markup", "restaurant SaaS", "ATS Brazil Japan"],
  });
}

export default function LangHome() {
  return <HomeClient />;
}
