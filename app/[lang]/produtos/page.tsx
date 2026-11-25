import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import { LOCALES, isLang, type Lang } from "../../lib/seo";
import { buildMetadata } from "../../lib/metadata";
import { productList } from "../../lib/products";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
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
    path: "produtos",
    title:
      lang === "pt"
        ? "Produtos SaaS: MiseOn, MercadinhoSys e SelectSys Jobs"
        : "SaaS products: MiseOn, MercadinhoSys and SelectSys Jobs",
    description:
      lang === "pt"
        ? "MiseOn (food service em miseon.app.br), MercadinhoSys (ERP e PDV fiscal para varejo em mercadinhosys.com.br) e SelectSys Jobs (ATS Brasil–Japão): sistemas reais com clientes em produção."
        : "MiseOn (miseon.app.br), MercadinhoSys (mercadinhosys.com.br) and SelectSys Jobs: production multi-tenant SaaS built by Maldivas Tech.",
    keywords:
      lang === "pt"
        ? [
            "SaaS de gestão",
            "mercadinhosys",
            "miseon",
            "sistema para restaurantes",
            "ERP para mercadinho",
            "ATS para agências",
          ]
        : [
            "management SaaS",
            "retail ERP software",
            "restaurant SaaS",
            "ATS for agencies",
          ],
  });
}

export default async function ProductsIndex({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}) {
  const params = await paramsP;
  const lang: Lang = isLang(params.lang) ? (params.lang as Lang) : "pt";
  const pt = lang === "pt";

  return (
    <main className="prod-catalog-page">
      <div className="wrap">
        <header className="prod-catalog-header">
          <div className="sec-tag">
            {pt
              ? "PLATAFORMAS SAAS EM OPERAÇÃO · CLIENTES REAIS"
              : "LIVE SAAS PLATFORMS · REAL PRODUCTION CLIENTS"}
          </div>
          <h1>
            {pt
              ? "Produtos de software construídos para rodar operação real."
              : "Production SaaS engineered for real daily operations."}
          </h1>
          <p className="sec-lead">
            {pt
              ? "Cada plataforma possui isolamento multi-tenant, domínio próprio, contrato formal e clientes operando em produção — além do ecossistema white-label MySuperStore."
              : "Multi-tenant architecture, verified domains, and real clients running daily workflows in production."}
          </p>
        </header>

        <section className="prod-catalog-grid" aria-label={pt ? "Catálogo SaaS" : "SaaS Catalog"}>
          {productList.map((p) => {
            const copy = p.copy[lang];
            const needsLightPlate = p.slug === "selectsys-jobs" || p.slug === "mercadinhosys";
            const domainLabel = p.appUrl
              ? p.appUrl.replace(/^https?:\/\//, "")
              : "selectsys-jobs.vercel.app";

            return (
              <article key={p.slug} className="prod-catalog-card">
                {p.showcaseImage && (
                  <div className="prod-catalog-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.showcaseImage}
                      alt={`${p.name} — preview executivo`}
                      loading="lazy"
                    />
                    <span className="prod-catalog-domain">{domainLabel}</span>
                  </div>
                )}

                <div className="prod-catalog-body">
                  <div className="prod-brand-lockup">
                    {p.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img loading="lazy" decoding="async"
                        src={p.icon}
                        alt=""
                        width={46}
                        height={46}
                        className="prod-brand-icon"
                      />
                    )}
                    {p.logoHorizontal ? (
                      <div className={needsLightPlate ? "prod-logo-plate is-compact" : "prod-logo-dark is-compact"}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img loading="lazy" decoding="async" src={p.logoHorizontal} alt={p.name} />
                      </div>
                    ) : (
                      <strong>{p.name}</strong>
                    )}
                  </div>

                  <h2>{p.name}</h2>
                  <p className="prod-catalog-tagline">{copy.tagline}</p>

                  <div className="tags">
                    {p.stack.slice(0, 5).map((tech) => (
                      <span className="tag" key={tech}>
                        <CheckCircle2 size={13} style={{ color: "var(--accent)" }} />
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="prod-catalog-actions">
                    <Link
                      href={`/${lang}/produtos/${p.slug}`}
                      className="btn btn-primary"
                    >
                      <span>{pt ? "Ver Arquitetura & Planos" : "Details & Architecture"}</span>
                      <ArrowUpRight size={17} />
                    </Link>
                    {p.appUrl && (
                      <a
                        href={p.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                      >
                        <ExternalLink size={16} />
                        <span>{domainLabel}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
