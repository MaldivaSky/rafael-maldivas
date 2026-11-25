import type { Metadata } from "next";
import Link from "next/link";
import { isLang, type Lang } from "../../../lib/seo";
import { buildMetadata } from "../../../lib/metadata";
import { SITE } from "../../../lib/site";
import JsonLd from "../../../components/whatsapp/JsonLd";
import AtolCta from "../../../components/atol/AtolCta";
import MetaTcoCalculator2026 from "../../../components/atol/MetaTcoCalculator2026";
import { META_BRL, brl } from "../../../lib/whatsapp-tco";
import "../../../whatsapp-api.css";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

const PATH = "whatsapp-api/calculadora-2026";

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await p;
  if (!isLang(lang)) return {};
  const pt = lang === "pt";
  return buildMetadata({
    lang: lang as Lang,
    path: PATH,
    title: pt
      ? "Calculadora WhatsApp API 2026: preço em reais"
      : "WhatsApp Business API cost calculator 2026 (Brazil, BRL)",
    description: pt
      ? "Simule o custo real da WhatsApp Cloud API com a tabela da Meta vigente desde 01/10/2026: 1.000 mensagens de serviço grátis, utilidade R$ 0,035, marketing R$ 0,3217 e Coexistência a R$ 0."
      : "Simulate the real WhatsApp Cloud API cost under Meta's rates in force since Oct 1, 2026: 1,000 free service messages, utility BRL 0.035, marketing BRL 0.3217 and Coexistence at BRL 0.",
    keywords: pt
      ? ["preço whatsapp api outubro 2026", "calculadora whatsapp business api brasil", "tarifa meta whatsapp 2026", "whatsapp coexistência custo", "mensagem de serviço whatsapp cobrada"]
      : ["whatsapp api price october 2026", "whatsapp business api calculator brazil", "meta whatsapp rates 2026"],
  });
}

export default async function Calculadora2026({ params: p }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await p;
  const lang = (isLang(l) ? l : "pt") as Lang;
  const pt = lang === "pt";
  const url = `${SITE}/${lang}/${PATH}`;

  const rates: [string, string, string][] = pt
    ? [
        ["Resposta no app do celular (Coexistência)", brl(META_BRL.appCoexistence), "Não passa pela API e não consome a franquia"],
        ["Serviço via API (Inbox, IA, bot)", `${META_BRL.serviceFreePerNumber.toLocaleString("pt-BR")} grátis/número/mês`, `Excedente ${brl(META_BRL.service)} por mensagem entregue`],
        ["Utilidade (pedido, PIX, lembrete)", brl(META_BRL.utility), "Cobrada mesmo dentro da janela de 24h"],
        ["Autenticação (código)", brl(META_BRL.authentication), "Por mensagem entregue"],
        ["Marketing (campanha)", brl(META_BRL.marketing), "Por mensagem entregue · exige opt-in"],
      ]
    : [
        ["Reply on the phone app (Coexistence)", brl(META_BRL.appCoexistence), "Doesn't go through the API or use the quota"],
        ["API service (Inbox, AI, bot)", `${META_BRL.serviceFreePerNumber.toLocaleString("en-US")} free/number/month`, `Then ${brl(META_BRL.service)} per delivered message`],
        ["Utility (order, PIX, reminder)", brl(META_BRL.utility), "Charged even inside the 24h window"],
        ["Authentication (code)", brl(META_BRL.authentication), "Per delivered message"],
        ["Marketing (campaign)", brl(META_BRL.marketing), "Per delivered message · opt-in required"],
      ];

  const faq: [string, string][] = pt
    ? [
        ["O que mudou no preço do WhatsApp em outubro de 2026?", "Desde 01/10/2026 as mensagens de serviço enviadas pela API passaram a ser cobradas no Brasil, com 1.000 grátis por número a cada mês e R$ 0,035 no excedente. Utilidade e autenticação seguem a R$ 0,035 e marketing a R$ 0,3217 por mensagem entregue."],
        ["Responder pelo celular custa alguma coisa?", "Não. No modo Coexistência, as respostas digitadas no app WhatsApp Business do celular não passam pela API e não são cobradas nem consomem a franquia de 1.000 mensagens."],
        ["Template de utilidade dentro da janela de 24h é grátis?", "Não. Todo template de utilidade entregue é cobrado (R$ 0,035), com a janela aberta ou fechada. O que fica fora da cobrança é a conversa livre dentro da franquia de serviço."],
        ["A Atol Connect cobra markup sobre a tarifa da Meta?", "Não. A tarifa da Meta é paga direto à Meta, no cartão do Business Manager do cliente. A Atol Connect cobra só a plataforma, em reais, com NFSe."],
        ["Como a calculadora estima a economia frente a um CRM?", "Usa R$ 249 por número como referência (meio da faixa pública de R$ 197 a R$ 497/mês de plataformas oficiais com CRM) e a mesma tarifa Meta dos dois lados. É uma estimativa, não uma proposta de concorrente."],
      ]
    : [
        ["What changed in WhatsApp pricing in October 2026?", "Since Oct 1, 2026, service messages sent through the API are charged in Brazil, with 1,000 free per number each month and BRL 0.035 beyond that. Utility and authentication stay at BRL 0.035 and marketing at BRL 0.3217 per delivered message."],
        ["Does replying from the phone cost anything?", "No. In Coexistence mode, replies typed in the WhatsApp Business phone app don't go through the API and are neither charged nor counted against the 1,000-message quota."],
        ["Are utility templates free inside the 24h window?", "No. Every delivered utility template is charged (BRL 0.035), window open or not. What stays free is free-form chat within the service quota."],
        ["Does Atol Connect mark up Meta's fees?", "No. Meta's fees are paid to Meta directly on the customer's Business Manager card. Atol Connect only charges the platform, in BRL, with an invoice."],
        ["How is the saving vs. a CRM estimated?", "It uses BRL 249 per number as a reference (middle of the public BRL 197–497/month range of official platforms with CRM) and the same Meta fees on both sides. It's an estimate, not a competitor quote."],
      ];

  const ld = [
    { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: pt ? "Calculadora TCO WhatsApp Business API 2026" : "WhatsApp Business API TCO calculator 2026",
      url,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      publisher: { "@id": `${SITE}/#organization` },
    },
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <header className="wa-hero" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div className="wa-crumb">
            <Link href={`/${lang}/whatsapp-api`}>Atol Connect</Link> / {pt ? "Calculadora 2026" : "2026 Calculator"}
          </div>
          <span className="wa-kicker">{pt ? "Tabela Meta BRL · vigente desde 01/10/2026" : "Meta BRL rates · since Oct 1, 2026"}</span>
          <h1>
            {pt ? "Quanto custa o WhatsApp oficial " : "What official WhatsApp really costs "}
            <em>{pt ? "depois de outubro/2026." : "after October 2026."}</em>
          </h1>
          <p className="wa-lead">
            {pt
              ? "Mensagem de serviço pela API agora é cobrada após 1.000 por número. Resposta no celular (Coexistência) continua R$ 0,00. Simule com o volume real da sua operação."
              : "API service messages are now charged after 1,000 per number. Phone replies (Coexistence) stay at BRL 0.00. Simulate with your real volume."}
          </p>
        </div>
      </header>

      <section className="wa-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <MetaTcoCalculator2026 lang={lang} />
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Tabela da Meta por mensagem entregue (BRL)" : "Meta rates per delivered message (BRL)"}</h2>
          <div className="wa-scroll">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>{pt ? "Tipo" : "Type"}</th>
                  <th>{pt ? "Preço" : "Price"}</th>
                  <th>{pt ? "Regra" : "Rule"}</th>
                </tr>
              </thead>
              <tbody>
                {rates.map(([a, b, c]) => (
                  <tr key={a}>
                    <td>{a}</td>
                    <td className="yes">{b}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wa-micro" style={{ marginTop: 12 }}>
            {pt
              ? "Referência: regras de cobrança publicadas pela Meta para o Brasil com vigência em 01/10/2026; valores em BRL conforme a tabela local. Confirme sempre no Gerenciador de Negócios da sua conta."
              : "Reference: Meta's Brazil billing rules effective Oct 1, 2026; BRL values per the local rate card. Always confirm in your Business Manager."}
          </p>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Perguntas frequentes" : "FAQ"}</h2>
          {faq.map(([q, a]) => (
            <details className="wa-lang" key={q}>
              <summary>{q}</summary>
              <p style={{ margin: 0, padding: "0 18px 16px", color: "var(--fg-muted)", lineHeight: 1.6 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-final">
            <h2>{pt ? "Plataforma em reais, tarifa direto na Meta." : "Platform in BRL, fees straight to Meta."}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AtolCta
                lang={lang}
                src="calculadora-2026"
                secondary={{ href: `/${lang}/whatsapp-api/z-api-vs-oficial`, label: pt ? "Z-API x oficial" : "Z-API vs official" }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
