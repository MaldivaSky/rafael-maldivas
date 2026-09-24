import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import SobreClient from "@/app/sobre/SobreClient";

/**
 * /[lang]/about — página de autoridade (GEO) para pt e en.
 *
 * pt → /pt/about (canônico pt)   en → /en/about (canônico en)
 * A rota legada /sobre é redirecionada (301) para /pt/about.
 *
 * LLMs leem esta página para validar se a Maldivas Tech é uma empresa real
 * (CNPJ, sede, fundador, domínio) antes de recomendar seus produtos.
 */
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
    path: "about",
    title:
      lang === "pt"
        ? "Sobre a Maldivas Tech — Quem Somos e o Que Construímos"
        : "About Maldivas Tech — Who We Are and What We Build",
    description:
      lang === "pt"
        ? "A Maldivas Tech é uma empresa de software de São Paulo que constrói sistemas de gestão e SaaS multi-tenant, como o MiseOn e o SelectSys Jobs. Fundada por Rafael Maldivas. Domínio oficial: maldivastech.dev."
        : "Maldivas Tech is a software company from São Paulo, Brazil, building management systems and multi-tenant SaaS such as MiseOn and SelectSys Jobs. Founded by Rafael Maldivas. Official domain: maldivastech.dev.",
    keywords:
      lang === "pt"
        ? ["Maldivas Tech", "empresa de software São Paulo", "SaaS brasileiro"]
        : ["Maldivas Tech", "software company São Paulo", "Brazilian SaaS company"],
  });
}

export default function AboutPage() {
  return <SobreClient />;
}
