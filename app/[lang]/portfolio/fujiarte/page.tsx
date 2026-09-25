import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import FujiarteCase from "../../../portfolio/FujiarteCase";

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
    path: "portfolio/fujiarte",
    title:
      lang === "pt"
        ? "Case de Sucesso: Fujiarte Co., Ltd. e SelectSys Jobs"
        : "Case Study: Fujiarte Co., Ltd. and SelectSys Jobs",
    description:
      lang === "pt"
        ? "Descubra como a plataforma SelectSys Jobs foi implementada para a Fujiarte Co., Ltd., otimizando o recrutamento internacional Brasil–Japão."
        : "Discover how the SelectSys Jobs platform was implemented for Fujiarte Co., Ltd., optimizing international Brazil–Japan recruitment.",
    keywords:
      lang === "pt"
        ? ["case de sucesso", "Fujiarte", "SelectSys Jobs", "recrutamento Brasil Japão", "ATS"]
        : ["case study", "Fujiarte", "SelectSys Jobs", "Brazil Japan recruitment", "ATS"],
  });
}

export default function Page() {
  return <FujiarteCase />;
}
