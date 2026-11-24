import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, type Lang } from "../../../lib/seo";
import { buildMetadata } from "../../../lib/metadata";
import { NICHES, nicheBySlug, META_RATES, brl, scenarioCost } from "../../../lib/whatsapp-niches";
import GoogleCta from "../../../components/whatsapp/GoogleCta";
import "../../../whatsapp-api.css";

export function generateStaticParams() {
  return (["pt", "en"] as const).flatMap((lang) => NICHES.map((n) => ({ lang, nicho: n.slug })));
}

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string; nicho: string }> }): Promise<Metadata> {
  const { lang, nicho } = await p;
  const n = nicheBySlug(nicho);
  if (!isLang(lang) || !n) return {};
  return buildMetadata({
    lang: lang as Lang,
    path: `whatsapp-api/${n.slug}`,
    title: `${n.seoTitle[lang as Lang]} · Atol Connect`,
    description: n.pitch[lang as Lang] + (lang === "pt" ? " API oficial da Meta, a partir de R$ 79/mês, 14 dias grátis." : " Official Meta API from BRL 79/month, 14 days free."),
    keywords: [n.seoTitle[lang as Lang], lang === "pt" ? "WhatsApp API oficial" : "official WhatsApp API"],
  });
}

const CATEGORY_LABEL = {
  utility: { pt: "Utilidade", en: "Utility" },
  marketing: { pt: "Marketing", en: "Marketing" },
  authentication: { pt: "Autenticação", en: "Authentication" },
  service: { pt: "Serviço (grátis)", en: "Service (free)" },
} as const;

export default async function NichePage({ params: p }: { params: Promise<{ lang: string; nicho: string }> }) {
  const { lang: l, nicho } = await p;
  if (!isLang(l)) notFound();
  const n = nicheBySlug(nicho);
  if (!n) notFound();
  const lang = l as Lang;
  const pt = lang === "pt";
  const base = `/${lang}`;
  const unit = META_RATES[n.scenario.category];

  return (
    <main>
      <header className="wa-hero">
        <div className="wrap">
          <div className="wa-crumb">
            <Link href={`${base}/whatsapp-api`}>Atol Connect</Link> / {n.name[lang]}
          </div>
          <span className="wa-kicker">{n.emoji} {n.name[lang]}</span>
          <h1>{n.seoTitle[lang]}</h1>
          <p className="wa-lead">{n.pitch[lang]}</p>
          <GoogleCta lang={lang} src={`nicho-${n.slug}`} />
        </div>
      </header>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-grid2">
            <div className="wa-card">
              <h3>{pt ? "A dor" : "The pain"}</h3>
              <p style={{ margin: 0, color: "var(--fg-muted)", lineHeight: 1.6 }}>{n.pain[lang]}</p>
            </div>
            <div className="wa-card">
              <h3>{pt ? "Quanto custa a tarifa da Meta" : "What Meta fees cost"}</h3>
              <p style={{ margin: 0, color: "var(--fg-muted)", lineHeight: 1.6 }}>
                {n.scenario.label[lang]} × {brl(unit)} = <strong style={{ color: "var(--fg)" }}>{brl(scenarioCost(n))}</strong>{" "}
                {pt ? "pagos direto à Meta, mais o plano a partir de R$ 79/mês." : "paid directly to Meta, plus the plan from BRL 79/month."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Fluxos prontos para ligar" : "Ready-to-run flows"}</h2>
          <div className="wa-card">
            {n.flows.map((f) => (
              <div className="wa-flow" key={f.name.pt}>
                <div>
                  <strong>{f.name[lang]}</strong> <span className={`wa-badge ${f.category}`}>{CATEGORY_LABEL[f.category][lang]}</span>
                </div>
                <small>{pt ? "Gatilho: " : "Trigger: "}{f.trigger[lang]}</small>
                <small>{pt ? "Regra: " : "Rule: "}{f.rule[lang]}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-grid2">
            <div className="wa-card">
              <h3>{pt ? "Regras de negócio do nicho" : "Niche business rules"}</h3>
              <ul>{n.rules.map((r) => <li key={r.pt}>{r[lang]}</li>)}</ul>
            </div>
            <div className="wa-card">
              <h3>{pt ? "Como o seu sistema chama a API" : "How your system calls the API"}</h3>
              <p className="wa-micro" style={{ margin: 0 }}>{pt ? "Evento" : "Event"}: <code>{n.api.event}</code> → POST /api/v1/messages</p>
              <pre className="wa-code">{n.api.body}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-final">
            <h2>{pt ? `Você vende software para ${n.name.pt.toLowerCase()}?` : `Do you sell software to ${n.name.en.toLowerCase()}?`}</h2>
            <p className="wa-sub" style={{ margin: "0 auto 8px" }}>
              {n.partnerAngle[lang]} {pt ? "Ofereça WhatsApp oficial como módulo, a R$ 59 por número no Plano Parceiro." : "Offer official WhatsApp as a module at BRL 59 per number on the Partner plan."}
            </p>
            <GoogleCta lang={lang} src={`nicho-${n.slug}-parceiro`} secondary={{ href: `${base}/desenvolvedores`, label: pt ? "Ver documentação" : "Read the docs" }} />
          </div>
          <p className="wa-micro" style={{ marginTop: 24 }}>
            {pt ? "Outros nichos: " : "Other niches: "}
            {NICHES.filter((x) => x.slug !== n.slug).map((x, i, a) => (
              <span key={x.slug}><Link href={`${base}/whatsapp-api/${x.slug}`}>{x.name[lang]}</Link>{i < a.length - 1 ? " · " : ""}</span>
            ))}
          </p>
        </div>
      </section>
    </main>
  );
}
