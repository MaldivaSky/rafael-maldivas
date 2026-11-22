import type { Metadata } from "next";
import { isLang, type Lang } from "../../lib/seo";
import { buildMetadata } from "../../lib/metadata";
import { LEGAL } from "../../lib/legal";
import LegalDocument from "../../components/LegalDocument";

const SLUG = "termos" as const;

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const doc = LEGAL[lang][SLUG];
  return buildMetadata({
    lang,
    path: SLUG,
    title: doc.title,
    description: doc.description,
  });
}

export default async function Page({ params: paramsP }: { params: Promise<{ lang: string }> }) {
  const params = await paramsP;
  const lang: Lang = isLang(params.lang) ? (params.lang as Lang) : "pt";
  return <LegalDocument lang={lang} slug={SLUG} />;
}
