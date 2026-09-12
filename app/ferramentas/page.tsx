import type { Metadata } from "next";
import FerramentasClient from "./FerramentasClient";
import { SITE } from "../lib/site";

export const metadata: Metadata = {
  title: "Ferramentas gratuitas — calculadora de CMV e teste de SPF, DKIM e DMARC",
  description:
    "Duas ferramentas grátis e sem cadastro: calculadora de preço de venda e CMV para restaurantes e varejo, e diagnóstico de autenticação de e-mail do domínio (SPF, DKIM e DMARC) para saber se sua mensagem está caindo no spam.",
  alternates: { canonical: "/ferramentas" },
  openGraph: {
    title: "Ferramentas gratuitas — Maldivas Tech",
    description:
      "Calculadora de preço de venda e CMV, e diagnóstico de SPF, DKIM e DMARC do seu domínio. Sem cadastro.",
    url: "/ferramentas",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Calculadora de preço de venda e CMV",
      url: `${SITE}/ferramentas#preco`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      description:
        "Calcula o custo real do prato, o CMV e o preço de venda que fecha a margem desejada, considerando perdas, mão de obra, custo fixo, taxa de cartão ou aplicativo e impostos.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      publisher: { "@id": `${SITE}#org` },
    },
    {
      "@type": "WebApplication",
      name: "Diagnóstico de e-mail do domínio (SPF, DKIM, DMARC)",
      url: `${SITE}/ferramentas#email`,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      description:
        "Consulta os registros públicos de DNS de um domínio e informa se SPF, DKIM e DMARC estão configurados corretamente para evitar que o e-mail caia no spam.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      publisher: { "@id": `${SITE}#org` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FerramentasClient />
    </>
  );
}
