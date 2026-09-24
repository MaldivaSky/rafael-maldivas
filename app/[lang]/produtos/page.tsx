import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { productList } from "@/app/lib/products";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
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
    path: "produtos",
    title:
      lang === "pt"
        ? "Produtos — SaaS de Gestão da Maldivas Tech"
        : "Products — Maldivas Tech Management SaaS",
    description:
      lang === "pt"
        ? "MiseOn (gestão para restaurantes) e SelectSys Jobs (ATS para agências): SaaS multi-tenant desenvolvidos pela Maldivas Tech, com contrato e nota fiscal."
        : "MiseOn (restaurant SaaS) and SelectSys Jobs (ATS for agencies): multi-tenant SaaS built by Maldivas Tech, from São Paulo to the world.",
    keywords:
      lang === "pt"
        ? ["SaaS de gestão", "sistema para restaurantes", "ATS para agências"]
        : ["management SaaS", "restaurant SaaS", "ATS for agencies"],
  });
}

export default function ProductsIndex({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang as Lang;
  const heading = lang === "pt" ? "Nossos produtos SaaS" : "Our SaaS products";

  return (
    <main className="wrap">
      <h1>{heading}</h1>
      <section>
        {productList.map((p) => (
          <article key={p.slug}>
            <h2>
              <Link href={`/${lang}/produtos/${p.slug}`}>{p.name}</Link>
            </h2>
            <p>{p.copy[lang].tagline}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
