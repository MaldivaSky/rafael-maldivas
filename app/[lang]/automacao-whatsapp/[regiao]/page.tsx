import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "../../../lib/metadata";
import { COMPANY, SITE, WHATSAPP } from "../../../lib/site";
import { GEO_REGIONS, geoRegionBySlug } from "../../../lib/geo-regions";
import JsonLd from "../../../components/whatsapp/JsonLd";
import AtolCta from "../../../components/atol/AtolCta";
import "../../../whatsapp-api.css";

/* GeoSEO é só pt-BR: /en/automacao-whatsapp/* não existe (404). */
export const dynamicParams = false;

export function generateStaticParams() {
  return GEO_REGIONS.map((r) => ({ lang: "pt", regiao: r.slug }));
}

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string; regiao: string }> }): Promise<Metadata> {
  const { lang, regiao } = await p;
  const r = geoRegionBySlug(regiao);
  if (lang !== "pt" || !r) return {};
  const path = `automacao-whatsapp/${r.slug}`;
  const url = `${SITE}/pt/${path}`;
  const meta = buildMetadata({
    lang: "pt",
    path,
    title: `Automação de WhatsApp Oficial ${r.prep} · implantação assistida`,
    description: `Implantação assistida da WhatsApp Cloud API oficial ${r.prep} (${r.areas.slice(0, 4).join(", ")}): número no celular com Coexistência, avisos automáticos e integração com seus sistemas. Maldivas Tech.`,
    keywords: [`automação whatsapp ${r.name.toLowerCase()}`, `whatsapp oficial ${r.name.toLowerCase()}`, `api whatsapp ${r.name.toLowerCase()}`, "implantação whatsapp business api"],
  });
  // só existe em pt: hreflang sem a variante en (evita alternate apontando para 404)
  return { ...meta, alternates: { canonical: url, languages: { "pt-BR": url, "x-default": url } } };
}

export default async function GeoPage({ params: p }: { params: Promise<{ lang: string; regiao: string }> }) {
  const { lang, regiao } = await p;
  const r = geoRegionBySlug(regiao);
  if (lang !== "pt" || !r) notFound();
  const url = `${SITE}/pt/automacao-whatsapp/${r.slug}`;

  const faq: [string, string][] = [
    [`Vocês atendem presencialmente ${r.prep}?`, r.logistics],
    ["Preciso trocar de número ou parar de usar o celular?", "Não. Com o modo Coexistência da Meta, o mesmo número segue no app WhatsApp Business do celular — e as respostas digitadas nele custam R$ 0,00."],
    ["Quanto custa?", "A plataforma Atol Connect começa em R$ 79/mês. A implantação assistida é uma taxa única combinada antes, e as tarifas da Meta (ex.: R$ 0,035 por aviso de utilidade) são pagas direto à Meta, sem markup."],
  ];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: `Implantação de WhatsApp Oficial ${r.prep}`,
      serviceType: "Implantação da WhatsApp Business Platform (Cloud API) e automação de atendimento",
      provider: { "@id": `${SITE}/#organization` },
      areaServed: [{ "@type": r.kind, name: r.name }, ...r.areas.map((a) => ({ "@type": "Place", name: a }))],
      offers: { "@type": "Offer", priceCurrency: "BRL", price: "79.00", description: "Plataforma Atol Connect a partir de R$ 79/mês; implantação assistida sob orçamento." },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];

  const others = GEO_REGIONS.filter((x) => x.slug !== r.slug);

  return (
    <main>
      <JsonLd data={ld} />
      <header className="wa-hero" style={{ paddingBottom: 28 }}>
        <div className="wrap">
          <div className="wa-crumb">
            <Link href="/pt/whatsapp-api">Atol Connect</Link> / Automação de WhatsApp / {r.name}
          </div>
          <span className="wa-kicker">Implantação assistida · {r.name}</span>
          <h1>
            WhatsApp Oficial {r.prep}, <em>implantado junto com a sua equipe.</em>
          </h1>
          <p className="wa-lead">{r.profile}</p>
          <AtolCta lang="pt" src={`geo-${r.slug}`} secondary={{ href: "/pt?interesse=implantacao#contato", label: "Quero implantação assistida" }} />
        </div>
      </header>

      <section className="wa-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>O que a implantação entrega</h2>
          <div className="wa-steps">
            <div className="wa-step"><h3>Número oficial, celular junto</h3><p>Conexão pela Cloud API da Meta com Coexistência: o app no celular continua funcionando e as respostas nele custam R$ 0,00.</p></div>
            <div className="wa-step"><h3>Avisos automáticos do seu negócio</h3><p>Templates de utilidade aprovados (R$ 0,035 cada) para pedido, agenda, cobrança ou serviço pronto — sem promoção misturada.</p></div>
            <div className="wa-step"><h3>Presença local + sistemas</h3><p>Ficha no Google apontando para o WhatsApp e, quando fizer sentido, integração com MiseOn, MercadinhoSys ou o seu ERP.</p></div>
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>Onde mais implantamos {r.prep}</h2>
          <div className="wa-grid2">
            {r.focus.map((f) => (
              <Link key={f.slug} className="wa-niche" href={`/pt/whatsapp-api/nichos/${f.slug}`}>
                <h3>{f.niche}</h3>
                <p>{f.why}.</p>
                <span className="cost">Ver template e código →</span>
              </Link>
            ))}
          </div>
          <p className="wa-micro" style={{ marginTop: 16 }}>
            Bairros e cidades atendidos: {r.areas.join(" · ")}.
          </p>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>Perguntas frequentes</h2>
          {faq.map(([q, a]) => (
            <details className="wa-lang" key={q} open>
              <summary>{q}</summary>
              <p style={{ margin: 0, padding: "0 18px 16px", color: "var(--fg-muted)", lineHeight: 1.6 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-final">
            <h2>Fale direto com a engenharia</h2>
            <p className="wa-sub" style={{ margin: "0 auto 18px" }}>
              {COMPANY.legalName} · CNPJ {COMPANY.cnpj} · {COMPANY.street}, {COMPANY.city}/{COMPANY.region}
            </p>
            <div className="wa-cta" style={{ justifyContent: "center" }}>
              <a className="btn btn-primary" href={`${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero implantar o WhatsApp Oficial ${r.prep}.`)}`} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">
                Chamar no WhatsApp
              </a>
              <Link className="btn btn-ghost" href="/pt/whatsapp-api/calculadora-2026">
                Calcular o custo
              </Link>
            </div>
            <p className="wa-micro" style={{ marginTop: 18 }}>
              Outras regiões:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && " · "}
                  <Link href={`/pt/automacao-whatsapp/${o.slug}`}>{o.name}</Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
