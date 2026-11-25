import type { Metadata } from "next";
import Link from "next/link";
import { isLang, type Lang } from "../../../lib/seo";
import { buildMetadata } from "../../../lib/metadata";
import { SITE } from "../../../lib/site";
import JsonLd from "../../../components/whatsapp/JsonLd";
import AtolCta from "../../../components/atol/AtolCta";
import "../../../whatsapp-api.css";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

const PATH = "whatsapp-api/z-api-vs-oficial";

export async function generateMetadata({ params: p }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await p;
  if (!isLang(lang)) return {};
  const pt = lang === "pt";
  return buildMetadata({
    lang: lang as Lang,
    path: PATH,
    title: pt ? "Z-API x WhatsApp Cloud API oficial: comparativo técnico e financeiro" : "Z-API vs official WhatsApp Cloud API: technical & cost comparison",
    description: pt
      ? "Alternativa oficial à Z-API: risco de banimento, Coexistência com o celular, templates, webhooks e custo total com a tabela Meta 2026. Guia de migração do QR Code para a Cloud API."
      : "Official alternative to Z-API: ban risk, phone Coexistence, templates, webhooks and total cost under Meta's 2026 rates. Migration guide from QR code to Cloud API.",
    keywords: pt
      ? ["alternativa z-api oficial", "migrar z-api para cloud api meta", "z-api banimento", "whatsapp api oficial x não oficial", "evolution api x cloud api"]
      : ["z-api alternative", "migrate z-api to cloud api", "unofficial vs official whatsapp api"],
  });
}

export default async function ZapiVsOficial({ params: p }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await p;
  const lang = (isLang(l) ? l : "pt") as Lang;
  const pt = lang === "pt";
  const url = `${SITE}/${lang}/${PATH}`;

  const rows: [string, string, string][] = pt
    ? [
        ["Como conecta", "Embedded Signup oficial da Meta (OAuth), sem QR Code", "Emula o WhatsApp Web lendo um QR Code"],
        ["Termos do WhatsApp", "Canal autorizado (WhatsApp Business Platform)", "Fora dos termos: automação não autorizada"],
        ["Risco de banimento", "Baixo, controlado por Quality Rating", "Real, sobretudo em envios em massa"],
        ["Estabilidade no pico", "Infra da Meta, sem sessão no aparelho", "Quedas de sessão e reconexões manuais"],
        ["Celular continua funcionando", "Sim, com Coexistência (respostas a R$ 0,00)", "Sim, mas a sessão depende do aparelho"],
        ["Templates aprovados", "Sim: utilidade, autenticação e marketing", "Não existem templates oficiais"],
        ["Webhooks", "Assinados (HMAC-SHA256), 8 retentativas", "Varia por fornecedor"],
        ["Preço da plataforma", "R$ 79/mês · R$ 59/número no plano parceiro", "~R$ 29 a R$ 99,99 por instância"],
        ["Tarifa por mensagem", "Paga direto à Meta (R$ 0,035 utilidade · R$ 0,3217 marketing)", "Não há tarifa — e também não há garantia"],
      ]
    : [
        ["How it connects", "Meta's official Embedded Signup (OAuth), no QR code", "Emulates WhatsApp Web by scanning a QR code"],
        ["WhatsApp terms", "Authorized channel (WhatsApp Business Platform)", "Outside the terms: unauthorized automation"],
        ["Ban risk", "Low, governed by Quality Rating", "Real, especially on bulk sends"],
        ["Peak stability", "Meta's infrastructure, no device session", "Session drops and manual reconnects"],
        ["Phone keeps working", "Yes, with Coexistence (replies at BRL 0.00)", "Yes, but the session depends on the device"],
        ["Approved templates", "Yes: utility, authentication and marketing", "No official templates"],
        ["Webhooks", "Signed (HMAC-SHA256), 8 retries", "Varies by vendor"],
        ["Platform price", "BRL 79/month · BRL 59/number on partner plan", "~BRL 29 to 99.99 per instance"],
        ["Per-message fee", "Paid directly to Meta (BRL 0.035 utility · BRL 0.3217 marketing)", "No fee — and no guarantee either"],
      ];

  const steps: [string, string][] = pt
    ? [
        ["Inventário", "Liste números, fluxos e integrações que hoje usam QR Code; separe o que é aviso (utilidade) do que é promoção (marketing)."],
        ["Templates", "Reescreva as mensagens ativas como templates e envie para aprovação — avisos neutros saem como utilidade (R$ 0,035)."],
        ["Conexão oficial", "Conecte o número pelo Embedded Signup. Com Coexistência, o app no celular continua funcionando."],
        ["Troca do endpoint", "Aponte o ERP para POST /api/v1/messages com Idempotency-Key; valide o webhook com X-Atol-Signature."],
        ["Desligar o QR Code", "Depois do primeiro dia sem erro, encerre a sessão antiga para não haver envio duplicado."],
      ]
    : [
        ["Inventory", "List numbers, flows and integrations on QR code today; split notices (utility) from promotions (marketing)."],
        ["Templates", "Rewrite outbound messages as templates and submit for approval — neutral notices go as utility (BRL 0.035)."],
        ["Official connection", "Connect the number via Embedded Signup. With Coexistence, the phone app keeps working."],
        ["Swap the endpoint", "Point the ERP at POST /api/v1/messages with Idempotency-Key; validate webhooks with X-Atol-Signature."],
        ["Turn off QR code", "After the first error-free day, close the old session to avoid duplicate sends."],
      ];

  const faq: [string, string][] = pt
    ? [
        ["A Z-API é oficial?", "Não. APIs por QR Code emulam o WhatsApp Web e não fazem parte da WhatsApp Business Platform da Meta. A alternativa oficial é a Cloud API, usada pelo Atol Connect."],
        ["Vou perder meu número ao migrar?", "Não. O mesmo número é conectado à Cloud API pelo Embedded Signup; com Coexistência, o app no celular continua ativo."],
        ["A Cloud API oficial é mais cara?", "A plataforma começa em R$ 79/mês. Há tarifa da Meta por mensagem (R$ 0,035 em avisos), mas respostas no celular são R$ 0,00 e há 1.000 mensagens de serviço grátis por número/mês. Simule na calculadora 2026."],
        ["Quanto tempo leva a migração?", "A troca técnica do endpoint costuma levar horas; o que define o prazo é a aprovação dos templates pela Meta."],
      ]
    : [
        ["Is Z-API official?", "No. QR-code APIs emulate WhatsApp Web and aren't part of Meta's WhatsApp Business Platform. The official alternative is the Cloud API, used by Atol Connect."],
        ["Will I lose my number?", "No. The same number is connected to the Cloud API through Embedded Signup; with Coexistence the phone app stays active."],
        ["Is the official Cloud API more expensive?", "The platform starts at BRL 79/month. Meta charges per message (BRL 0.035 for notices), but phone replies are BRL 0.00 and 1,000 service messages per number/month are free. Try the 2026 calculator."],
        ["How long does migration take?", "Swapping the endpoint usually takes hours; template approval by Meta sets the timeline."],
      ];

  const ld = [
    { "@context": "https://schema.org", "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}#migracao`,
      name: pt ? "Migrar da Z-API (QR Code) para a WhatsApp Cloud API oficial" : "Migrate from Z-API (QR code) to the official WhatsApp Cloud API",
      step: steps.map(([name, text], i) => ({ "@type": "HowToStep", position: i + 1, name, text })),
    },
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <header className="wa-hero" style={{ paddingBottom: 32 }}>
        <div className="wrap">
          <div className="wa-crumb">
            <Link href={`/${lang}/whatsapp-api`}>Atol Connect</Link> / Z-API x {pt ? "oficial" : "official"}
          </div>
          <span className="wa-kicker">{pt ? "Comparativo técnico e financeiro" : "Technical & cost comparison"}</span>
          <h1>
            Z-API x Cloud API <em>{pt ? "oficial da Meta." : "by Meta."}</em>
          </h1>
          <p className="wa-lead">
            {pt
              ? "O QR Code é barato até o dia em que o número cai no meio do movimento. Aqui está a diferença real — de arquitetura, de risco e de custo — e como migrar sem perder o número."
              : "QR code is cheap until the number drops at peak time. Here's the real difference — architecture, risk and cost — and how to migrate without losing your number."}
          </p>
        </div>
      </header>

      <section className="wa-sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="wa-scroll">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>{pt ? "Critério" : "Criterion"}</th>
                  <th>Atol Connect (Cloud API)</th>
                  <th>{pt ? "APIs por QR Code (Z-API, Evolution…)" : "QR-code APIs (Z-API, Evolution…)"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([a, b, c]) => (
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
              ? "Faixa de preço de APIs por QR Code observada em páginas públicas e comparativos em nov/2026; varia por fornecedor. Z-API e Evolution são marcas/projetos de seus titulares, citados só como exemplo de categoria."
              : "QR-code API price range observed on public pages and comparisons in Nov 2026; varies by vendor. Z-API and Evolution belong to their owners and are cited only as category examples."}
          </p>
        </div>
      </section>

      <section className="wa-sec" id="migracao">
        <div className="wrap">
          <h2>{pt ? "Migração em 5 passos" : "Migration in 5 steps"}</h2>
          <div className="wa-steps">
            {steps.map(([t, d]) => (
              <div className="wa-step" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <p className="wa-micro" style={{ marginTop: 16 }}>
            <Link href={`/${lang}/ferramentas/checklist-migracao-qr-code-cloud-api`}>{pt ? "Checklist interativo de migração (salva o progresso) →" : "Interactive migration checklist (saves progress) →"}</Link>
            {"  ·  "}
            <Link href={`/${lang}/whatsapp-api/calculadora-2026`}>{pt ? "Calcular o custo total →" : "Calculate total cost →"}</Link>
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
            <h2>{pt ? "Saia do QR Code sem trocar de número." : "Leave QR code without changing numbers."}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AtolCta lang={lang} src="z-api-vs-oficial" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
