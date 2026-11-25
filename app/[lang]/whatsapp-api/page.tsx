import type { Metadata } from "next";
import Link from "next/link";
import { isLang, type Lang } from "../../lib/seo";
import { buildMetadata } from "../../lib/metadata";
import { NICHES, META_RATES, CONNECT_URL, brl, scenarioCost } from "../../lib/whatsapp-niches";
import JsonLd from "../../components/whatsapp/JsonLd";
import GoogleCta from "../../components/whatsapp/GoogleCta";
import EightNichesExplorer from "../../components/atol/EightNichesExplorer";
import MetaTariffSceneLazy from "../../components/atol/MetaTariffSceneLazy";
import { TECH_PROVIDER_APPROVED } from "../../lib/flags";
import { SITE } from "../../lib/site";
import "../../whatsapp-api.css";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await p;
  if (!isLang(lang)) return {};
  const pt = lang === "pt";
  return buildMetadata({
    lang: lang as Lang,
    path: "whatsapp-api",
    title: pt ? "API oficial do WhatsApp Business a partir de R$ 79 · Atol Connect" : "Official WhatsApp Business API from BRL 79 · Atol Connect",
    description: pt
      ? "API oficial do WhatsApp em reais (Cloud API da Meta), sem markup nas tarifas e com Coexistência: o celular continua funcionando. Inbox em equipe, templates, REST e webhooks. A partir de R$ 79/mês."
      : "Official WhatsApp Cloud API priced in BRL, no markup on Meta fees and with Coexistence: your phone keeps working. Team inbox, templates, REST and webhooks. From BRL 79/month.",
    keywords: pt
      ? ["api oficial whatsapp em reais", "whatsapp api sem markup", "whatsapp coexistência meta", "alternativa Z-API", "WhatsApp API para ERP", "WhatsApp Cloud API Brasil"]
      : ["official WhatsApp API", "Z-API alternative", "WhatsApp API for ERP", "WhatsApp Cloud API Brazil"],
  });
}

export default async function WhatsappApiHub({ params: p }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await p;
  const lang = (isLang(l) ? l : "pt") as Lang;
  const pt = lang === "pt";
  const base = `/${lang}`;

  const faq = pt
    ? [
        ["Qual a API oficial de WhatsApp mais barata no Brasil?", "O Atol Connect usa a Cloud API oficial da Meta a partir de R$ 79/mês por número (R$ 59 no Plano Parceiro), sem markup nas tarifas da Meta."],
        ["Posso ter o número banido?", "O risco é baixo porque o canal é o oficial da Meta. APIs por QR Code (Z-API, Evolution, Baileys) violam os termos do WhatsApp e podem derrubar o número."],
        ["Quanto a Meta cobra por mensagem?", `Utilidade e autenticação ${brl(META_RATES.utility)}, marketing ${brl(META_RATES.marketing)} por mensagem entregue, com 1.000 conversas de serviço grátis por número/mês (referência nov/2026).`],
        ["Funciona com meu ERP ou PDV?", "Sim: API REST, SDK TypeScript, exemplos em PHP, C#, Python e Node, e webhooks assinados com HMAC."],
      ]
    : [
        ["What is the cheapest official WhatsApp API in Brazil?", "Atol Connect uses Meta's official Cloud API from BRL 79/month per number (BRL 59 on the Partner plan) with no markup on Meta fees."],
        ["Can my number get banned?", "Risk is low because the channel is Meta's official one. QR-code APIs violate WhatsApp terms and can take the number down."],
        ["How much does Meta charge per message?", `Utility and authentication ${brl(META_RATES.utility)}, marketing ${brl(META_RATES.marketing)} per delivered message, with 1,000 free service conversations per number/month (Nov 2026 reference).`],
        ["Does it work with my ERP or POS?", "Yes: REST API, TypeScript SDK, PHP, C#, Python and Node examples and HMAC-signed webhooks."],
      ];
  const ld = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "ItemList", name: pt ? "WhatsApp API por nicho" : "WhatsApp API by niche", itemListElement: NICHES.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.name[lang], url: `${SITE}/${lang}/whatsapp-api/${n.slug}` })) },
    // mesma entidade do grafo global (layout) e do connect.maldivastech.dev
    { "@context": "https://schema.org", "@type": "SoftwareApplication", "@id": `${CONNECT_URL}/#software`, name: "Atol Connect", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: CONNECT_URL, offers: { "@type": "Offer", price: "79.00", priceCurrency: "BRL" }, provider: { "@id": `${SITE}/#organization` }, publisher: { "@id": `${SITE}/#organization` } },
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <header className="wa-hero">
        <div className="wrap">
          <span className="wa-kicker">Atol Connect · WhatsApp Cloud API</span>
          <h1>
            {pt ? "A API oficial do WhatsApp pelo preço da " : "The official WhatsApp API at the price of the "}
            <em>{pt ? "não oficial." : "unofficial one."}</em>
          </h1>
          <p className="wa-lead">
            {pt
              ? "Chega de número banido por QR Code. Conecte pelo fluxo oficial da Meta, atenda em equipe e integre ERP, PDV ou loja virtual por REST e webhooks. Planos a partir de R$ 79/mês e zero markup nas tarifas da Meta."
              : "No more numbers banned over QR-code hacks. Connect through Meta's official flow, serve customers as a team and plug in your ERP, POS or store over REST and webhooks. From BRL 79/month with zero markup on Meta fees."}
          </p>
          <GoogleCta lang={lang} src="hub-hero" secondary={{ href: `${base}/desenvolvedores`, label: pt ? "Ver a API e o SDK" : "See the API and SDK" }} />
          <div className="wa-strip">
            <div className="wa-stat"><strong>R$ 79</strong><span>{pt ? "por número/mês (Start)" : "per number/month (Start)"}</span></div>
            <div className="wa-stat"><strong>R$ 59</strong><span>{pt ? "por número no Plano Parceiro" : "per number on the Partner plan"}</span></div>
            <div className="wa-stat"><strong>0%</strong><span>{pt ? "markup nas tarifas da Meta" : "markup on Meta fees"}</span></div>
            <div className="wa-stat"><strong>R$ 0,00</strong><span>{pt ? "respostas no celular (Coexistência)" : "phone replies (Coexistence)"}</span></div>
          </div>
        </div>
      </header>

      <section className="wa-sec" style={{ paddingTop: 8 }}>
        <div className="wrap wa-tariff">
          <div>
            <h2>{pt ? "De onde vem o custo de cada mensagem" : "Where each message's cost comes from"}</h2>
            <p className="wa-sub">
              {pt
                ? "O que o cliente manda cai na franquia grátis de 1.000 por número. Aviso do sistema é utilidade (R$ 0,035) e campanha é marketing (R$ 0,3217), pagos por entrega direto à Meta. A resposta que a equipe dá pelo celular nem passa pela API: R$ 0,00."
                : "What customers send falls into the free 1,000-per-number quota. System notices are utility (BRL 0.035) and campaigns are marketing (BRL 0.3217), paid per delivery directly to Meta. Replies your team sends from the phone don't touch the API: BRL 0.00."}
            </p>
            <p className="wa-micro">
              <Link href={`${base}/whatsapp-api/calculadora-2026`}>{pt ? "Simular com o volume da minha operação →" : "Simulate with my volume →"}</Link>
            </p>
          </div>
          <MetaTariffSceneLazy lang={lang} />
        </div>
      </section>

      <section className="wa-sec" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <h2>{pt ? "Sandbox interativa: 8 nichos, conversa e código" : "Interactive sandbox: 8 industries, chat and code"}</h2>
          <p className="wa-sub">
            {pt
              ? "Escolha o nicho e veja o template cobrado pela Meta, a resposta da equipe no celular e a chamada REST com Idempotency-Key e webhook assinado."
              : "Pick an industry and see the template Meta charges for, the team's phone reply and the REST call with Idempotency-Key and signed webhook."}
          </p>
          <EightNichesExplorer lang={lang} />
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Do cadastro ao primeiro envio em 3 passos" : "From sign-up to first send in 3 steps"}</h2>
          <p className="wa-sub">
            {TECH_PROVIDER_APPROVED
              ? pt ? "Sem formulário longo e sem esperar aprovação manual nossa." : "No long forms and no waiting on us for manual approval."
              : pt
                ? "Food service já opera hoje via MiseOn. Para os demais segmentos, a liberação self-serve abre ao fim do credenciamento Tech Provider na Meta — reserve o acesso prioritário."
                : "Food service already runs today via MiseOn. For other segments, self-serve opens when Meta's Tech Provider accreditation completes — reserve priority access."}
          </p>
          <div className="wa-steps">
            <div className="wa-step"><h3>{pt ? "Crie a conta" : "Create your account"}</h3><p>{pt ? "Cadastro em 1 minuto, sem cartão. A organização é criada junto, com 14 dias de teste a partir da liberação." : "1-minute sign-up, no card. Your organization is created with a 14-day trial from release."}</p></div>
            <div className="wa-step"><h3>{pt ? "Conecte o número" : "Connect your number"}</h3><p>{pt ? "Embedded Signup da Meta, incluindo o modo Coexistência para manter o app WhatsApp Business no celular." : "Meta Embedded Signup, including Coexistence to keep the WhatsApp Business app on your phone."}</p></div>
            <div className="wa-step"><h3>{pt ? "Atenda e integre" : "Serve and integrate"}</h3><p>{pt ? "Caixa de entrada em equipe, modelos aprovados, chave de API e webhooks assinados com HMAC." : "Team inbox, approved templates, API key and HMAC-signed webhooks."}</p></div>
          </div>
        </div>
      </section>

      <section className="wa-sec" id="nichos">
        <div className="wrap">
          <h2>{pt ? "Uma API, oito negócios prontos para vender" : "One API, eight ready-to-sell businesses"}</h2>
          <p className="wa-sub">
            {pt
              ? "Cada nicho tem fluxos de mensagem, regras de negócio e o custo real de tarifa da Meta. Use para operar o seu negócio ou para vender como módulo do seu software."
              : "Each niche comes with message flows, business rules and the real Meta fee cost. Use it to run your business or sell it as a module of your software."}
          </p>
          <div className="wa-niches">
            {NICHES.map((n) => (
              <Link key={n.slug} className="wa-niche" href={`${base}/whatsapp-api/${n.slug}`}>
                <span className="em" aria-hidden="true">{n.emoji}</span>
                <h3>{n.name[lang]}</h3>
                <p>{n.pitch[lang]}</p>
                <span className="cost">{n.scenario.label[lang]} → {brl(scenarioCost(n))} {pt ? "de tarifa Meta" : "in Meta fees"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Regras de negócio que protegem o seu número" : "Business rules that protect your number"}</h2>
          <div className="wa-grid2">
            <div className="wa-card">
              <h3>{pt ? "Como a Meta cobra" : "How Meta charges"}</h3>
              <ul>
                <li>{pt ? `Utilidade e autenticação: ${brl(META_RATES.utility)} por mensagem entregue.` : `Utility and authentication: ${brl(META_RATES.utility)} per delivered message.`}</li>
                <li>{pt ? `Marketing: ${brl(META_RATES.marketing)} por mensagem entregue.` : `Marketing: ${brl(META_RATES.marketing)} per delivered message.`}</li>
                <li>{pt ? `${META_RATES.serviceFreePerMonth.toLocaleString("pt-BR")} conversas de serviço grátis por número/mês.` : `${META_RATES.serviceFreePerMonth.toLocaleString("en-US")} free service conversations per number/month.`}</li>
                <li>{pt ? "Você paga a Meta direto. A Atol Connect cobra só o plano." : "You pay Meta directly. Atol Connect only charges the plan."}</li>
              </ul>
            </div>
            <div className="wa-card">
              <h3>{pt ? "O que o sistema garante" : "What the system enforces"}</h3>
              <ul>
                <li>{pt ? "Janela de 24h: dentro dela, conversa livre; fora, só template aprovado." : "24h window: free-form inside, approved templates outside."}</li>
                <li>{pt ? "Opt-in registrado com data e origem (LGPD) antes de qualquer marketing." : "Opt-in stored with date and source (LGPD) before any marketing."}</li>
                <li>{pt ? "Template com variáveis validado antes do envio, sem erro 132000 da Meta." : "Templates with variables validated before sending, no Meta 132000 errors."}</li>
                <li>{pt ? "Trilha de auditoria e isolamento por organização no banco (RLS)." : "Audit trail and per-organization database isolation (RLS)."}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Oficial x QR Code (Z-API, Evolution, Baileys)" : "Official vs QR-code (Z-API, Evolution, Baileys)"}</h2>
          <div className="wa-scroll">
            <table className="wa-table">
              <thead>
                <tr><th>{pt ? "Critério" : "Criterion"}</th><th>Atol Connect</th><th>{pt ? "API não oficial" : "Unofficial API"}</th></tr>
              </thead>
              <tbody>
                <tr><td>{pt ? "Risco de banimento" : "Ban risk"}</td><td className="yes">{pt ? "Baixo: canal oficial da Meta" : "Low: Meta's official channel"}</td><td>{pt ? "Alto: viola os termos do WhatsApp" : "High: violates WhatsApp terms"}</td></tr>
                <tr><td>{pt ? "Preço por número" : "Price per number"}</td><td className="yes">R$ 79 · R$ 59 {pt ? "parceiro" : "partner"}</td><td>~ R$ 99,99</td></tr>
                <tr><td>{pt ? "Tarifa da Meta" : "Meta fees"}</td><td className="yes">{pt ? "Direto na Meta, sem markup" : "Direct to Meta, no markup"}</td><td>{pt ? "Não se aplica (e não há SLA)" : "n/a (and no SLA)"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="wa-micro" style={{ marginTop: 12 }}>
            <Link href={`${base}/whatsapp-api/z-api-vs-oficial`}>{pt ? "Comparativo completo Z-API x oficial e migração em 5 passos →" : "Full Z-API vs official comparison and 5-step migration →"}</Link>
            {"  ·  "}
            <Link href={`${base}/whatsapp-api/calculadora-2026`}>{pt ? "Calculadora 2026 →" : "2026 calculator →"}</Link>
          </p>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "Perguntas frequentes" : "FAQ"}</h2>
          {faq.map(([q, a]) => (
            <details className="wa-lang" key={q}><summary>{q}</summary><p style={{ margin: 0, padding: "0 18px 16px", color: "var(--fg-muted)", lineHeight: 1.6 }}>{a}</p></details>
          ))}
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-final">
            <h2>{pt ? "Software house? Venda WhatsApp oficial como módulo do seu sistema." : "Software house? Sell official WhatsApp as a module of your product."}</h2>
            <p className="wa-sub" style={{ margin: "0 auto 8px" }}>
              {pt ? "Plano Parceiro a R$ 59 por número, API REST, webhooks e suporte em português para ERPs e PDVs." : "Partner plan at BRL 59 per number, REST API, webhooks and Portuguese support for ERPs and POS."}
            </p>
            <GoogleCta lang={lang} src="hub-final" secondary={{ href: `${CONNECT_URL}/parceiros`, label: pt ? "Programa de parceiros" : "Partner program" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
