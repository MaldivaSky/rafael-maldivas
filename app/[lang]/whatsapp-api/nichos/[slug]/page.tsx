import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, LOCALES, type Lang } from "../../../../lib/seo";
import { buildMetadata } from "../../../../lib/metadata";
import { SITE } from "../../../../lib/site";
import { ATOL_NICHES, CATEGORY_LABEL, CATEGORY_PRICE_BRL, atolNicheBySlug } from "../../../../lib/atol-niches";
import JsonLd from "../../../../components/whatsapp/JsonLd";
import AtolCta from "../../../../components/atol/AtolCta";
import EightNichesExplorer from "../../../../components/atol/EightNichesExplorer";
import "../../../../whatsapp-api.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => ATOL_NICHES.map((n) => ({ lang, slug: n.slug })));
}

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await p;
  const n = atolNicheBySlug(slug);
  if (!isLang(lang) || !n) return {};
  const pt = lang === "pt";
  return buildMetadata({
    lang: lang as Lang,
    path: `whatsapp-api/nichos/${n.slug}`,
    title: pt ? `WhatsApp oficial para ${n.name.pt}` : `Official WhatsApp for ${n.name.en}`,
    description: pt
      ? `${n.short.pt} Template de ${CATEGORY_LABEL[n.template.category].pt.toLowerCase()} a R$ ${CATEGORY_PRICE_BRL[n.template.category].toFixed(3).replace(".", ",")}, resposta no celular a R$ 0,00 e exemplo REST com Idempotency-Key.`
      : `${n.short.en} ${CATEGORY_LABEL[n.template.category].en} template at BRL ${CATEGORY_PRICE_BRL[n.template.category]}, phone reply at BRL 0.00 and a REST example with Idempotency-Key.`,
    keywords: pt
      ? [`whatsapp api ${n.name.pt.toLowerCase()}`, `whatsapp oficial ${n.name.pt.toLowerCase()}`, "whatsapp coexistência", "template utilidade whatsapp"]
      : [`whatsapp api ${n.name.en.toLowerCase()}`, "whatsapp coexistence"],
  });
}

export default async function NichePage({ params: p }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: l, slug } = await p;
  const n = atolNicheBySlug(slug);
  if (!isLang(l) || !n) notFound();
  const lang = l as Lang;
  const pt = lang === "pt";
  const url = `${SITE}/${lang}/whatsapp-api/nichos/${n.slug}`;
  const others = ATOL_NICHES.filter((x) => x.slug !== n.slug);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: n.faq.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Atol Connect", item: `${SITE}/${lang}/whatsapp-api` },
        { "@type": "ListItem", position: 2, name: n.name[lang], item: url },
      ],
    },
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <header className="wa-hero" style={{ paddingBottom: 28 }}>
        <div className="wrap">
          <div className="wa-crumb">
            <Link href={`/${lang}/whatsapp-api`}>Atol Connect</Link> / {pt ? "Nichos" : "Industries"} / {n.name[lang]}
          </div>
          <span className="wa-kicker">
            {n.emoji} {pt ? "WhatsApp oficial para" : "Official WhatsApp for"} {n.name[lang]}
          </span>
          <h1>{n.rule.title[lang]}</h1>
          <p className="wa-lead">{n.rule.body[lang]}</p>
          <AtolCta lang={lang} src={`nicho-${n.slug}`} sandboxHref="#sandbox" />
        </div>
      </header>

      <section className="wa-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <EightNichesExplorer lang={lang} initialSlug={n.slug} showPageLinks={false} />
          {n.legacySlug && (
            <p className="wa-micro" style={{ marginTop: 14 }}>
              <Link href={`/${lang}/whatsapp-api/${n.legacySlug}`}>
                {pt ? "Fluxos completos, regras de negócio e custo do cenário típico →" : "Full flows, business rules and typical-scenario cost →"}
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Perguntas frequentes" : "FAQ"}</h2>
          {n.faq.map((f) => (
            <details className="wa-lang" key={f.q.pt} open>
              <summary>{f.q[lang]}</summary>
              <p style={{ margin: 0, padding: "0 18px 16px", color: "var(--fg-muted)", lineHeight: 1.6 }}>{f.a[lang]}</p>
            </details>
          ))}
          <p className="wa-micro" style={{ marginTop: 14 }}>
            <Link href={`/${lang}/whatsapp-api/calculadora-2026`}>{pt ? "Calcular o custo mensal deste nicho →" : "Calculate this industry's monthly cost →"}</Link>
          </p>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Outros nichos" : "Other industries"}</h2>
          <div className="wa-niches">
            {others.map((x) => (
              <Link key={x.slug} className="wa-niche" href={`/${lang}/whatsapp-api/nichos/${x.slug}`}>
                <span className="em" aria-hidden="true">{x.emoji}</span>
                <h3>{x.name[lang]}</h3>
                <p>{x.short[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
