import type { Metadata } from "next";
import Link from "next/link";
import { isLang, type Lang } from "../../lib/seo";
import { buildMetadata } from "../../lib/metadata";
import { CONNECT_URL } from "../../lib/whatsapp-niches";
import GoogleCta from "../../components/whatsapp/GoogleCta";
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
    path: "desenvolvedores",
    title: pt ? "API do WhatsApp para desenvolvedores: REST, SDK e webhooks · Atol Connect" : "WhatsApp API for developers: REST, SDK and webhooks · Atol Connect",
    description: pt
      ? "Integre o WhatsApp oficial em 10 minutos: exemplos em cURL, Node, Python, PHP e C#, SDK TypeScript, OpenAPI e webhooks assinados com HMAC. Guia de migração da Z-API."
      : "Integrate official WhatsApp in 10 minutes: cURL, Node, Python, PHP and C# examples, TypeScript SDK, OpenAPI and HMAC-signed webhooks. Z-API migration guide.",
    keywords: pt ? ["API WhatsApp desenvolvedor", "migrar Z-API", "WhatsApp API PHP", "WhatsApp API C#", "webhook WhatsApp HMAC"] : ["WhatsApp API developer", "migrate from Z-API", "WhatsApp API PHP"],
  });
}

const BODY = `{ "to": "5511999990000", "type": "text", "text": { "body": "Pedido #1042 confirmado" } }`;

const SAMPLES: { id: string; label: string; code: string }[] = [
  {
    id: "curl",
    label: "cURL",
    code: `curl -X POST ${CONNECT_URL}/api/v1/messages \\
  -H "Authorization: Bearer atol_live_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '${BODY}'`,
  },
  {
    id: "node",
    label: "Node / TypeScript",
    code: `const res = await fetch("${CONNECT_URL}/api/v1/messages", {
  method: "POST",
  headers: { Authorization: "Bearer " + process.env.ATOL_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ to: "5511999990000", type: "text", text: { body: "Pedido #1042 confirmado" } }),
});
console.log(await res.json());`,
  },
  {
    id: "python",
    label: "Python",
    code: `import os, requests

r = requests.post(
    "${CONNECT_URL}/api/v1/messages",
    headers={"Authorization": "Bearer " + os.environ["ATOL_KEY"]},
    json={"to": "5511999990000", "type": "text", "text": {"body": "Pedido #1042 confirmado"}},
    timeout=15,
)
print(r.json())`,
  },
  {
    id: "php",
    label: "PHP",
    code: `<?php
$ch = curl_init("${CONNECT_URL}/api/v1/messages");
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => ["Authorization: Bearer " . getenv("ATOL_KEY"), "Content-Type: application/json"],
  CURLOPT_POSTFIELDS => json_encode(["to" => "5511999990000", "type" => "text", "text" => ["body" => "Pedido #1042 confirmado"]]),
]);
echo curl_exec($ch);`,
  },
  {
    id: "csharp",
    label: "C# (.NET)",
    code: `using var http = new HttpClient();
http.DefaultRequestHeaders.Authorization =
    new("Bearer", Environment.GetEnvironmentVariable("ATOL_KEY"));
var res = await http.PostAsync("${CONNECT_URL}/api/v1/messages",
    new StringContent("""${BODY}""", System.Text.Encoding.UTF8, "application/json"));
Console.WriteLine(await res.Content.ReadAsStringAsync());`,
  },
];

const HMAC = `import { createHmac, timingSafeEqual } from "node:crypto";

export function verify(rawBody: string, ts: string, sig: string, secret: string) {
  const expected = "sha256=" + createHmac("sha256", secret).update(\`\${ts}.\${rawBody}\`).digest("hex");
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
// Cabeçalhos: X-Atol-Signature, X-Atol-Timestamp, X-Atol-Event`;

export default async function DevelopersPage({ params: p }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await p;
  const lang = (isLang(l) ? l : "pt") as Lang;
  const pt = lang === "pt";
  const base = `/${lang}`;

  return (
    <main>
      <header className="wa-hero">
        <div className="wrap">
          <div className="wa-crumb"><Link href={`${base}/whatsapp-api`}>Atol Connect</Link> / {pt ? "Desenvolvedores" : "Developers"}</div>
          <span className="wa-kicker">REST · Webhooks · OpenAPI 3.1</span>
          <h1>{pt ? "Integre o WhatsApp oficial em 10 minutos." : "Integrate official WhatsApp in 10 minutes."}</h1>
          <p className="wa-lead">
            {pt
              ? "Uma chave de API, um endpoint e webhooks assinados. Exemplos nas linguagens que ERPs e PDVs brasileiros realmente usam."
              : "One API key, one endpoint and signed webhooks. Examples in the languages Brazilian ERPs and POS systems actually use."}
          </p>
          <GoogleCta lang={lang} src="dev-hero" secondary={{ href: `${CONNECT_URL}/docs`, label: pt ? "Documentação completa" : "Full documentation" }} />
          <div className="wa-cta" style={{ marginTop: 0 }}>
            <a className="btn btn-ghost btn-sm" href={`${CONNECT_URL}/openapi.yaml`}>{pt ? "Importar no Postman/Insomnia (openapi.yaml)" : "Import in Postman/Insomnia (openapi.yaml)"}</a>
            <a className="btn btn-ghost btn-sm" href={`${CONNECT_URL}/sdk/atol-connect.ts`}>{pt ? "Baixar SDK TypeScript" : "Download TypeScript SDK"}</a>
          </div>
        </div>
      </header>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "1. Envie sua primeira mensagem" : "1. Send your first message"}</h2>
          <p className="wa-sub">{pt ? "Crie a chave em Painel → Desenvolvedores. A chave começa com atol_live_ e é mostrada uma única vez." : "Create the key under Dashboard → Developers. It starts with atol_live_ and is shown once."}</p>
          {SAMPLES.map((s, i) => (
            <details className="wa-lang" key={s.id} open={i === 0}>
              <summary>{s.label}</summary>
              <pre className="wa-code">{s.code}</pre>
            </details>
          ))}
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <h2>{pt ? "2. Receba eventos com assinatura HMAC" : "2. Receive events with HMAC signatures"}</h2>
          <p className="wa-sub">
            {pt
              ? "Mensagens recebidas, status de entrega e falhas chegam no seu endpoint HTTPS. Valide a assinatura antes de confiar no corpo. No painel há o botão Testar (webhook.ping) e Reenviar entregas com falha."
              : "Inbound messages, delivery statuses and failures hit your HTTPS endpoint. Verify the signature before trusting the body. The dashboard has a Test (webhook.ping) button and Retry for failed deliveries."}
          </p>
          <pre className="wa-code">{HMAC}</pre>
        </div>
      </section>

      <section className="wa-sec" id="migracao">
        <div className="wrap">
          <h2>{pt ? "3. Migre da Z-API ou Evolution em 15 minutos" : "3. Migrate from Z-API or Evolution in 15 minutes"}</h2>
          <div className="wa-scroll">
            <table className="wa-table">
              <thead><tr><th>{pt ? "Você usa hoje" : "You use today"}</th><th>Atol Connect</th></tr></thead>
              <tbody>
                <tr><td>send-text</td><td>POST /api/v1/messages {"{ type: \"text\" }"}</td></tr>
                <tr><td>send-template / {pt ? "mensagens fora da janela" : "messages outside the window"}</td><td>POST /api/v1/messages {"{ type: \"template\" }"}</td></tr>
                <tr><td>{pt ? "Mídia, botões e listas" : "Media, buttons and lists"}</td><td>{pt ? "Ainda não na API pública (envio de texto e modelos). Responda pela caixa de entrada." : "Not yet in the public API (text and templates only). Reply from the team inbox."}</td></tr>
                <tr><td>{pt ? "Webhook on-message-received" : "on-message-received webhook"}</td><td>{pt ? "Evento message.received (e message.status), assinado com HMAC" : "message.received (and message.status) event, HMAC-signed"}</td></tr>
                <tr><td>{pt ? "Leitura de QR Code" : "QR code pairing"}</td><td>{pt ? "Embedded Signup da Meta (sem QR, sem ban)" : "Meta Embedded Signup (no QR, no ban)"}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="wa-micro" style={{ marginTop: 12 }}>
            {pt
              ? "Diferença que importa: fora da janela de 24h a API oficial exige template aprovado. O painel valida as variáveis antes de enviar."
              : "The difference that matters: outside the 24h window the official API requires an approved template. The dashboard validates variables before sending."}
          </p>
        </div>
      </section>

      <section className="wa-sec">
        <div className="wrap">
          <div className="wa-final">
            <h2>{pt ? "Ideias de produto para vender em cima da API" : "Product ideas to sell on top of the API"}</h2>
            <p className="wa-sub" style={{ margin: "0 auto 8px" }}>
              {pt ? "Oito nichos com fluxos, regras de negócio e custo de tarifa calculado." : "Eight niches with flows, business rules and calculated fee costs."}
            </p>
            <div className="wa-cta">
              <Link className="btn btn-primary" href={`${base}/whatsapp-api#nichos`}>{pt ? "Ver os nichos" : "Browse niches"}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
