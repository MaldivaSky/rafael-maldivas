import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, toolBySlug } from "../../lib/tools";
import { SITE } from "../../lib/site";
import ToolRenderer from "./ToolRenderer";

type Props = { params: { slug: string } };

/** Uma página por ferramenta: é assim que o Google indexa cada uma. */
export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = toolBySlug(params.slug);
  if (!tool) return {};

  const url = `/ferramentas/${tool.slug}`;

  return {
    title: tool.seoTitle,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: tool.seoTitle,
      description: tool.description,
      siteName: "Maldivas Tech",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
  };
}

export default function Page({ params }: Props) {
  const tool = toolBySlug(params.slug);
  if (!tool) notFound();

  const url = `${SITE}/ferramentas/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: tool.title,
        url,
        applicationCategory: tool.category,
        operatingSystem: "Web",
        inLanguage: "pt-BR",
        description: tool.description,
        browserRequirements: "Requer JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        publisher: { "@id": `${SITE}#org` },
        isAccessibleForFree: true,
      },
      {
        // é o FAQ que rende o resultado expandido na busca
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: tool.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE },
          { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE}/ferramentas` },
          { "@type": "ListItem", position: 3, name: tool.title, item: url },
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
