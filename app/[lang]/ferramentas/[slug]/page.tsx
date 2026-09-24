import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { tools, toolBySlug } from "@/app/lib/tools";
import { SITE } from "@/app/lib/site";
import ToolRenderer from "@/app/ferramentas/ToolRenderer";

type Params = { lang: string; slug: string };

/**
 * Versão internacionalizada das páginas de ferramenta.
 * O conteúdo (ToolRenderer) é o mesmo — o que muda é canonical/hreflang
 * e o JSON-LD, que precisa apontar para a URL com idioma.
 */
export function generateStaticParams(): { lang: Lang; slug: string }[] {
  const params: { lang: Lang; slug: string }[] = [];
  for (const lang of ["pt", "en"] as const) {
    for (const t of tools) params.push({ lang, slug: t.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const tool = toolBySlug(params.slug);
  if (!tool) return {};
  const c = tool.copy[params.lang];

  return buildMetadata({
    lang: params.lang,
    path: `ferramentas/${tool.slug}`,
    title: c.seoTitle,
    description: c.description,
    keywords: c.keywords,
  });
}

export default function ToolPage({ params }: { params: Params }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const tool = toolBySlug(params.slug);
  if (!tool) notFound();
  const c = tool.copy[lang];

  const url = `${SITE}/${lang}/ferramentas/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: c.title,
        url,
        applicationCategory: tool.category,
        operatingSystem: "Web",
        inLanguage: lang === "pt" ? "pt-BR" : "en",
        description: c.description,
        browserRequirements: "Requer JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        publisher: { "@id": `${SITE}/#organization` },
        isAccessibleForFree: true,
      },
      {
        // FAQ rende o resultado expandido na busca
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: c.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE}/${lang}` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Ferramentas",
            item: `${SITE}/${lang}/ferramentas`,
          },
          { "@type": "ListItem", position: 3, name: c.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolRenderer tool={tool} />
    </>
  );
}
