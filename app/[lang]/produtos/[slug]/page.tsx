import type { Metadata } from "next";
import Link from "next/link";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { PRODUCTS, productList, type ProductSlug } from "@/app/lib/products";

export function generateStaticParams(): { lang: Lang; slug: ProductSlug }[] {
  const params: { lang: Lang; slug: ProductSlug }[] = [];
  for (const lang of ["pt", "en"] as const) {
    for (const p of productList) params.push({ lang, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const product = productList.find((p) => p.slug === params.slug);
  if (!product) return {};

  const c = product.copy[lang];
  return buildMetadata({
    lang,
    path: `produtos/${product.slug}`,
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    ogType: "product",
  });
}

/** Copy da seção Problema→Solução→Ferramenta, por idioma e produto. */
type NarrativeCopy = {
  problemLabel: string;
  solutionLabel: string;
  toolLabel: string;
  cta: string;
  ctaAlt: string;
  stack: string;
};

const narrative: Record<Lang, NarrativeCopy> = {
  pt: {
    problemLabel: "O problema",
    solutionLabel: "A solução",
    toolLabel: "A ferramenta da Maldivas Tech",
    cta: "Falar com especialista",
    ctaAlt: "Ver todos os produtos",
    stack: "Tecnologias",
  },
  en: {
    problemLabel: "The problem",
    solutionLabel: "The solution",
    toolLabel: "The Maldivas Tech tool",
    cta: "Talk to a specialist",
    ctaAlt: "See all products",
    stack: "Technologies",
  },
};

function Narrative({ lang, slug }: { lang: Lang; slug: ProductSlug }) {
  const t = narrative[lang];
  const p = PRODUCTS[slug];
  const c = p.copy[lang];

  const problem =
    slug === "miseon"
      ? lang === "pt"
        ? "Restaurantes perdem margem porque o preço do prato não considera ficha técnica, quebra e variação de insumo. O controle vive em planilhas paralelas que ninguém atualiza."
        : "Restaurants lose margin because menu prices ignore recipe cost, waste and ingredient volatility. Control lives in side spreadsheets nobody updates."
      : lang === "pt"
        ? "Agências de recrutamento perdem candidatos porque a triagem está espalhada em e-mails, planilhas e mensagens. Sem pipeline único, não há previsibilidade nem conformidade."
        : "Recruitment agencies lose candidates because screening is scattered across email, spreadsheets and chat. Without a single pipeline there is no forecast and no compliance.";

  return (
    <section className="wrap">
      <article>
        <span className="sec-tag">{t.problemLabel}</span>
        <p>{problem}</p>
      </article>

      <article>
        <h2>{t.solutionLabel}</h2>
        <p>{c.tagline}</p>
        <ul>
          {c.keywords.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </article>

      <article>
        <h2>{t.toolLabel}</h2>
        <p>
          <strong>{p.name}</strong> — {c.metaTitle}
        </p>
        <aside aria-label={t.stack}>
          <span className="sec-tag">{t.stack}</span>
          <ul>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </aside>
      </article>
    </section>
  );
}

export default function ProductPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang = params.lang as Lang;
  const product = productList.find((p) => p.slug === params.slug)!;
  const c = product.copy[lang];
  const t = narrative[lang];

  return (
    <main>
      <header className="wrap">
        <h1>{c.h1}</h1>
        <p>{c.metaDescription}</p>
        <Link href={`/${lang}#contato`} className="btn btn-primary">
          {t.cta}
        </Link>
      </header>

      <Narrative lang={lang} slug={product.slug} />

      <nav className="wrap">
        <Link href={`/${lang}/produtos`}>{t.ctaAlt}</Link>
      </nav>
    </main>
  );
}
