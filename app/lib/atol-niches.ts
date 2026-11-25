/* ------------------------------------------------------------------ */
/*  Atol Connect — dataset único dos 8 nichos                          */
/*                                                                     */
/*  Alimenta: <EightNichesExplorer/> (home e /whatsapp-api), as páginas */
/*  estáticas /whatsapp-api/nichos/[slug] e o seletor de segmento do    */
/*  Acesso Prioritário. Os exemplos de código são GERADOS a partir do   */
/*  mesmo objeto, então request, Idempotency-Key e webhook nunca        */
/*  divergem entre linguagens.                                         */
/*                                                                     */
/*  Contrato real da API (repo atol-connect):                          */
/*   POST /api/v1/messages · Authorization: Bearer atol_live_...        */
/*   Idempotency-Key: <chave>                                          */
/*   Webhook de saída: X-Atol-Signature: sha256=HMAC(segredo,           */
/*     `${X-Atol-Timestamp}.${corpo}`) · envelope {event,created_at,data} */
/* ------------------------------------------------------------------ */

type Bi = { pt: string; en: string };
export type TemplateCategory = "utility" | "marketing" | "authentication";

export const CATEGORY_PRICE_BRL: Record<TemplateCategory, number> = {
  utility: 0.035,
  authentication: 0.035,
  marketing: 0.3217,
};

export const CATEGORY_LABEL: Record<TemplateCategory, Bi> = {
  utility: { pt: "Utilidade", en: "Utility" },
  authentication: { pt: "Autenticação", en: "Authentication" },
  marketing: { pt: "Marketing", en: "Marketing" },
};

export type ChatLine = { from: "business" | "customer" | "team"; text: Bi };

export type AtolNiche = {
  slug: string;
  emoji: string;
  name: Bi;
  short: Bi;
  /** regra de negócio que o nicho resolve (e qual sistema da casa entra) */
  rule: { title: Bi; body: Bi; ecosystem?: { name: string; href: string } };
  template: {
    name: string;
    category: TemplateCategory;
    /** variáveis do corpo, na ordem {{1}}, {{2}}… */
    params: string[];
    /** texto renderizado no mockup (já com variáveis preenchidas) */
    preview: Bi;
  };
  /** chave idempotente: o mesmo evento nunca vira duas mensagens */
  idempotencyKey: string;
  to: string;
  chat: ChatLine[];
  webhook: { event: "message.received" | "message.status"; data: Record<string, unknown> };
  faq: { q: Bi; a: Bi }[];
  /** página antiga /whatsapp-api/<slug> com fluxos detalhados, quando existe */
  legacySlug?: string;
};

export const ATOL_NICHES: AtolNiche[] = [
  {
    slug: "restaurantes-delivery",
    emoji: "🍽️",
    name: { pt: "Restaurantes & Delivery", en: "Restaurants & Delivery" },
    short: { pt: "Status do pedido sem o atendente digitar nada.", en: "Order status with zero typing." },
    rule: {
      title: { pt: "Uma mensagem por mudança de status — direto do MiseOn", en: "One message per status change — straight from MiseOn" },
      body: {
        pt: "O PDV/KDS do MiseOn dispara 'pedido aceito' e 'saiu para entrega'. Pedido cancelado interrompe qualquer aviso pendente daquele pedido. Esta é a operação oficial Meta que já roda em produção.",
        en: "MiseOn's POS/KDS fires 'order accepted' and 'out for delivery'. A canceled order stops any pending notice for it. This is the official Meta operation already live in production.",
      },
      ecosystem: { name: "MiseOn", href: "https://miseon.app.br" },
    },
    template: {
      name: "pedido_saiu_entrega",
      category: "utility",
      params: ["Maria", "#1042", "25 min"],
      preview: { pt: "Oi, Maria! Seu pedido #1042 saiu para entrega. Previsão: 25 min.", en: "Hi Maria! Your order #1042 is out for delivery. ETA: 25 min." },
    },
    idempotencyKey: "pedido-1042-saiu-entrega",
    to: "5511999990001",
    chat: [
      { from: "customer", text: { pt: "Consegue mandar sem cebola?", en: "Can you make it without onion?" } },
      { from: "team", text: { pt: "Já avisei a cozinha, Maria 👍", en: "Kitchen's been told, Maria 👍" } },
    ],
    webhook: { event: "message.status", data: { message_id: "wamid.HBgN...1042", status: "delivered", to: "5511999990001", idempotency_key: "pedido-1042-saiu-entrega" } },
    faq: [
      { q: { pt: "Aviso de pedido é marketing ou utilidade?", en: "Is an order notice marketing or utility?" }, a: { pt: "Utilidade (R$ 0,035 por mensagem entregue), desde que o texto seja só informativo, sem promoção.", en: "Utility (BRL 0.035 per delivered message) as long as the text is purely informational, with no promotion." } },
      { q: { pt: "Funciona com iFood?", en: "Does it work with iFood?" }, a: { pt: "No MiseOn, sim: pedidos do iFood (integração homologada) entram no mesmo fluxo de status.", en: "In MiseOn, yes: iFood orders (approved integration) follow the same status flow." } },
    ],
    legacySlug: "restaurantes-delivery",
  },
  {
    slug: "varejo-mercados",
    emoji: "🛒",
    name: { pt: "Varejo & Mercados", en: "Retail & Grocery" },
    short: { pt: "Fiado cobrado com educação, no dia certo.", en: "Store credit reminders on the right day." },
    rule: {
      title: { pt: "Cobrança de fiado só para quem tem saldo vencido — MercadinhoSys", en: "Credit reminders only for overdue balances — MercadinhoSys" },
      body: {
        pt: "O MercadinhoSys sabe quem deve, quanto e desde quando. O lembrete sai uma vez, com o valor exato e o PIX; quem pagou no balcão sai da fila na hora.",
        en: "MercadinhoSys knows who owes what and since when. The reminder goes out once with the exact amount and PIX; anyone who paid at the counter leaves the queue instantly.",
      },
      ecosystem: { name: "MercadinhoSys", href: "https://mercadinhosys.com.br" },
    },
    template: {
      name: "lembrete_fiado",
      category: "utility",
      params: ["João", "R$ 86,40", "10/12"],
      preview: { pt: "Olá, João! Seu saldo na loja é de R$ 86,40, com vencimento em 10/12. Chave PIX abaixo.", en: "Hi João! Your store balance is BRL 86.40, due 12/10. PIX key below." },
    },
    idempotencyKey: "fiado-cliente-381-2026-12",
    to: "5511999990002",
    chat: [
      { from: "customer", text: { pt: "Passo aí sábado e acerto.", en: "I'll stop by Saturday and settle." } },
      { from: "team", text: { pt: "Combinado, João. Te espero!", en: "Deal, João. See you then!" } },
    ],
    webhook: { event: "message.received", data: { from: "5511999990002", type: "text", text: "Passo aí sábado e acerto.", conversation_window_open: true } },
    faq: [
      { q: { pt: "Posso mandar promoção junto com a cobrança?", en: "Can I add a promotion to the reminder?" }, a: { pt: "Não. Qualquer gatilho promocional reclassifica o template como marketing (R$ 0,3217). Separe os dois.", en: "No. Any promotional trigger reclassifies the template as marketing (BRL 0.3217). Keep them separate." } },
    ],
    legacySlug: "varejo-mercadinho",
  },
  {
    slug: "clinicas-saude",
    emoji: "🩺",
    name: { pt: "Clínicas & Saúde", en: "Clinics & Health" },
    short: { pt: "Confirmação de consulta que reduz falta.", en: "Appointment confirmations that cut no-shows." },
    rule: {
      title: { pt: "Lembrete 24h antes, com confirmar/remarcar", en: "Reminder 24h ahead with confirm/reschedule" },
      body: {
        pt: "O lembrete vai só para consultas confirmadas na agenda. Dado de saúde nunca entra no texto do template (LGPD): só data, hora e profissional.",
        en: "Reminders go only to booked appointments. Health data never goes into the template text (LGPD): only date, time and practitioner.",
      },
    },
    template: {
      name: "lembrete_consulta",
      category: "utility",
      params: ["Ana", "amanhã, 14h30", "Dra. Paula"],
      preview: { pt: "Ana, sua consulta é amanhã, 14h30, com a Dra. Paula. Responda 1 para confirmar ou 2 para remarcar.", en: "Ana, your appointment is tomorrow at 2:30pm with Dr. Paula. Reply 1 to confirm or 2 to reschedule." },
    },
    idempotencyKey: "consulta-7781-lembrete-24h",
    to: "5511999990003",
    chat: [
      { from: "customer", text: { pt: "1", en: "1" } },
      { from: "team", text: { pt: "Confirmado, Ana. Até amanhã!", en: "Confirmed, Ana. See you tomorrow!" } },
    ],
    webhook: { event: "message.received", data: { from: "5511999990003", type: "text", text: "1", context: { idempotency_key: "consulta-7781-lembrete-24h" } } },
    faq: [
      { q: { pt: "Posso enviar resultado de exame pelo WhatsApp?", en: "Can I send test results on WhatsApp?" }, a: { pt: "Não recomendamos no template. Envie um link autenticado do seu sistema dentro da conversa.", en: "Not in the template. Send an authenticated link from your system inside the conversation." } },
    ],
    legacySlug: "clinicas-consultorios",
  },
  {
    slug: "ecommerce",
    emoji: "📦",
    name: { pt: "E-commerce", en: "E-commerce" },
    short: { pt: "PIX pendente e rastreio no número oficial.", en: "Pending PIX and tracking on the official number." },
    rule: {
      title: { pt: "PIX expira? Um único lembrete antes do vencimento", en: "PIX about to expire? One reminder before it does" },
      body: {
        pt: "O lembrete sai só se o PIX ainda estiver pendente; o webhook de pagamento cancela o envio. Recuperação de carrinho com desconto é marketing e exige opt-in.",
        en: "The reminder fires only if the PIX is still pending; the payment webhook cancels it. Discounted cart recovery is marketing and needs opt-in.",
      },
      ecosystem: { name: "MySuperStore", href: "https://mysuperstore-lime.vercel.app" },
    },
    template: {
      name: "pix_pendente",
      category: "utility",
      params: ["Carla", "#A-2290", "30 min"],
      preview: { pt: "Carla, o PIX do pedido #A-2290 expira em 30 min. Copie o código abaixo para concluir.", en: "Carla, the PIX for order #A-2290 expires in 30 min. Copy the code below to finish." },
    },
    idempotencyKey: "pedido-A2290-pix-lembrete",
    to: "5511999990004",
    chat: [
      { from: "customer", text: { pt: "Paguei agora!", en: "Just paid!" } },
      { from: "team", text: { pt: "Recebido, Carla. Já vai para separação.", en: "Got it, Carla. Heading to picking now." } },
    ],
    webhook: { event: "message.status", data: { message_id: "wamid.HBgN...A2290", status: "read", to: "5511999990004" } },
    faq: [
      { q: { pt: "Código de rastreio é utilidade?", en: "Is a tracking code utility?" }, a: { pt: "Sim, enquanto for só informativo sobre um pedido existente.", en: "Yes, as long as it only informs about an existing order." } },
    ],
    legacySlug: "ecommerce-lojas-virtuais",
  },
  {
    slug: "software-houses-erps",
    emoji: "🧩",
    name: { pt: "Software Houses & ERPs", en: "Software Houses & ERPs" },
    short: { pt: "WhatsApp oficial como módulo do seu sistema.", en: "Official WhatsApp as a module of your product." },
    rule: {
      title: { pt: "Uma Idempotency-Key por evento do ERP", en: "One Idempotency-Key per ERP event" },
      body: {
        pt: "Retry do seu servidor nunca vira mensagem duplicada: a mesma chave devolve a mesma resposta. Cada cliente seu fica numa organização isolada (RLS), com Inbox, Templates e Coexistência já prontos.",
        en: "Retries from your server never duplicate a message: the same key returns the same response. Each of your clients lives in an isolated organization (RLS) with Inbox, Templates and Coexistence ready.",
      },
    },
    template: {
      name: "nfe_emitida",
      category: "utility",
      params: ["Mercado Bom Preço", "NF-e 4812", "R$ 1.240,00"],
      preview: { pt: "Mercado Bom Preço, a NF-e 4812 no valor de R$ 1.240,00 foi emitida. O XML e o DANFE estão no link.", en: "Mercado Bom Preço, invoice NF-e 4812 for BRL 1,240.00 was issued. XML and DANFE at the link." },
    },
    idempotencyKey: "erp-tenant-77-nfe-4812",
    to: "5511999990005",
    chat: [
      { from: "customer", text: { pt: "Pode mandar o boleto também?", en: "Can you send the bank slip too?" } },
      { from: "team", text: { pt: "Enviado aqui pelo financeiro 👇", en: "Sent by finance below 👇" } },
    ],
    webhook: { event: "message.status", data: { message_id: "wamid.HBgN...4812", status: "delivered", idempotency_key: "erp-tenant-77-nfe-4812" } },
    faq: [
      { q: { pt: "Qual a diferença para uma API headless de R$ 39,90?", en: "How is this different from a BRL 39.90 headless API?" }, a: { pt: "Aqui o seu cliente final já recebe Inbox em equipe, gestor de templates e Coexistência com o celular. Você não precisa construir esse front-end.", en: "Your end customer already gets a team inbox, template manager and phone Coexistence. You don't have to build that front-end." } },
    ],
  },
  {
    slug: "imobiliarias",
    emoji: "🏠",
    name: { pt: "Imobiliárias", en: "Real Estate" },
    short: { pt: "Visita confirmada e corretor avisado.", en: "Viewing confirmed and agent notified." },
    rule: {
      title: { pt: "Lead do portal respondido em minutos, não em horas", en: "Portal leads answered in minutes, not hours" },
      body: {
        pt: "O lead que pede visita recebe a confirmação e o corretor de plantão é atribuído na Inbox. O telefone pessoal do corretor nunca é exposto ao cliente.",
        en: "A lead asking for a viewing gets the confirmation and the on-duty agent is assigned in the Inbox. The agent's personal phone is never exposed.",
      },
    },
    template: {
      name: "visita_confirmada",
      category: "utility",
      params: ["Pedro", "Rua Harmonia, 410 — ap. 52", "sábado, 10h"],
      preview: { pt: "Pedro, sua visita ao imóvel Rua Harmonia, 410 — ap. 52 está confirmada para sábado, 10h.", en: "Pedro, your viewing at Rua Harmonia, 410 — apt 52 is confirmed for Saturday 10am." },
    },
    idempotencyKey: "visita-imovel-552-pedro",
    to: "5511999990006",
    chat: [
      { from: "customer", text: { pt: "Aceita pet?", en: "Are pets allowed?" } },
      { from: "team", text: { pt: "Aceita sim, Pedro. Te mostro no sábado.", en: "Yes they are, Pedro. I'll show you Saturday." } },
    ],
    webhook: { event: "message.received", data: { from: "5511999990006", type: "text", text: "Aceita pet?" } },
    faq: [
      { q: { pt: "Posso disparar lançamentos para a base inteira?", en: "Can I blast new listings to my whole base?" }, a: { pt: "Só para quem deu opt-in, como marketing (R$ 0,3217), e respeitando os pedidos de saída.", en: "Only to opted-in contacts, as marketing (BRL 0.3217), honoring opt-outs." } },
    ],
    legacySlug: "imobiliarias",
  },
  {
    slug: "servicos-locais",
    emoji: "🔧",
    name: { pt: "Serviços Locais", en: "Local Services" },
    short: { pt: "Orçamento aprovado e serviço pronto avisados.", en: "Approved quotes and job-done notices." },
    rule: {
      title: { pt: "Aviso de 'serviço pronto' só quando a OS fecha", en: "'Job done' notice only when the work order closes" },
      body: {
        pt: "Oficinas, salões, assistências: a mensagem sai quando a ordem de serviço muda de status, com valor final e horário de retirada. O dono responde pelo celular sem pagar nada (Coexistência).",
        en: "Garages, salons, repair shops: the message fires when the work order changes status, with final amount and pickup time. The owner answers from the phone at no cost (Coexistence).",
      },
    },
    template: {
      name: "servico_pronto",
      category: "utility",
      params: ["Luiz", "OS 3301", "R$ 420,00"],
      preview: { pt: "Luiz, o serviço da OS 3301 está pronto. Valor final: R$ 420,00. Retirada até 18h.", en: "Luiz, work order 3301 is ready. Final amount: BRL 420.00. Pickup until 6pm." },
    },
    idempotencyKey: "os-3301-pronto",
    to: "5511999990007",
    chat: [
      { from: "customer", text: { pt: "Passo às 17h.", en: "I'll come at 5pm." } },
      { from: "team", text: { pt: "Fechado, Luiz!", en: "Great, Luiz!" } },
    ],
    webhook: { event: "message.received", data: { from: "5511999990007", type: "text", text: "Passo às 17h." } },
    faq: [
      { q: { pt: "Preciso de site para isso?", en: "Do I need a website?" }, a: { pt: "Não. Com a implantação assistida, a Maldivas Tech também organiza sua ficha no Google para o cliente chegar ao WhatsApp.", en: "No. With assisted setup, Maldivas Tech also organizes your Google listing so customers reach your WhatsApp." } },
    ],
    legacySlug: "oficinas-servicos",
  },
  {
    slug: "recrutamento-ats",
    emoji: "🧑‍💼",
    name: { pt: "Recrutamento (ATS)", en: "Recruiting (ATS)" },
    short: { pt: "Candidato avisado a cada etapa, sem planilha.", en: "Candidates notified at every stage, no spreadsheets." },
    rule: {
      title: { pt: "Documento pendente cobrado automaticamente — SelectSys Jobs", en: "Missing documents chased automatically — SelectSys Jobs" },
      body: {
        pt: "Quando a triagem documental do SelectSys detecta passaporte ou certidão faltando, o candidato recebe um único aviso com a lista exata. Ao enviar, o Kanban avança de etapa.",
        en: "When SelectSys document screening finds a missing passport or certificate, the candidate gets one notice with the exact list. Once sent, the Kanban moves forward.",
      },
      ecosystem: { name: "SelectSys Jobs", href: "https://selectsys-jobs.vercel.app" },
    },
    template: {
      name: "documento_pendente",
      category: "utility",
      params: ["Rafaela", "cópia do passaporte", "etapa 4 — Documentação"],
      preview: { pt: "Rafaela, falta a cópia do passaporte para avançar na etapa 4 — Documentação. Envie por aqui.", en: "Rafaela, we still need a passport copy to move on in stage 4 — Documents. Send it here." },
    },
    idempotencyKey: "candidato-2210-doc-passaporte",
    to: "5511999990008",
    chat: [
      { from: "customer", text: { pt: "[foto do passaporte]", en: "[passport photo]" } },
      { from: "team", text: { pt: "Recebido! Você avançou para a etapa 5.", en: "Received! You've moved to stage 5." } },
    ],
    webhook: { event: "message.received", data: { from: "5511999990008", type: "image", media_id: "1234567890", caption: null } },
    faq: [
      { q: { pt: "Os dados do candidato ficam protegidos?", en: "Is candidate data protected?" }, a: { pt: "Sim: isolamento por organização no banco (RLS) e conformidade LGPD; no SelectSys, também APPI (Japão).", en: "Yes: per-organization database isolation (RLS) and LGPD compliance; in SelectSys, APPI (Japan) too." } },
    ],
  },
];

export const atolNicheBySlug = (slug: string) => ATOL_NICHES.find((n) => n.slug === slug);

/* ---------------------------- geração de código ---------------------------- */

export const API_URL = "https://connect.maldivastech.dev/api/v1/messages";

export function requestBody(n: AtolNiche) {
  return {
    to: n.to,
    type: "template",
    template: {
      name: n.template.name,
      language: "pt_BR",
      components: [{ type: "body", parameters: n.template.params.map((text) => ({ type: "text", text })) }],
    },
  };
}

export type CodeLang = "curl" | "node" | "python" | "php";

export function codeSample(n: AtolNiche, lang: CodeLang): string {
  const json = JSON.stringify(requestBody(n), null, 2);
  const key = n.idempotencyKey;
  switch (lang) {
    case "curl":
      return `curl -X POST ${API_URL} \\
  -H "Authorization: Bearer atol_live_..." \\
  -H "Idempotency-Key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '${json.replace(/'/g, "'\\''")}'`;
    case "node":
      return `const res = await fetch("${API_URL}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ATOL_API_KEY}\`, // atol_live_...
    "Idempotency-Key": "${key}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${json.replace(/\n/g, "\n  ")}),
});
if (!res.ok) throw new Error(\`Atol \${res.status}: \${await res.text()}\`);
// 201 → { data }; retry com a mesma chave → { data, idempotent_replay: true }
const { data, idempotent_replay } = await res.json();`;
    case "python":
      return `import os, requests

res = requests.post(
    "${API_URL}",
    headers={
        "Authorization": f"Bearer {os.environ['ATOL_API_KEY']}",  # atol_live_...
        "Idempotency-Key": "${key}",
    },
    json=${json.replace(/\n/g, "\n    ")},
    timeout=15,
)
res.raise_for_status()
body = res.json()  # {"data": {...}} — "idempotent_replay": True em retry
print(body["data"])`;
    case "php":
      return `<?php
$payload = json_encode(${phpArray(requestBody(n), 1)}, JSON_UNESCAPED_UNICODE);

$ch = curl_init("${API_URL}");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . getenv("ATOL_API_KEY"), // atol_live_...
        "Idempotency-Key: ${key}",
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => $payload,
]);
$body = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);`;
  }
}

function phpArray(v: unknown, depth: number): string {
  const pad = "    ".repeat(depth);
  const padEnd = "    ".repeat(depth - 1);
  if (Array.isArray(v)) {
    return `[\n${v.map((x) => `${pad}${phpArray(x, depth + 1)}`).join(",\n")}\n${padEnd}]`;
  }
  if (v && typeof v === "object") {
    return `[\n${Object.entries(v)
      .map(([k, x]) => `${pad}"${k}" => ${phpArray(x, depth + 1)}`)
      .join(",\n")}\n${padEnd}]`;
  }
  return JSON.stringify(v);
}

/** Exemplo do webhook de saída, com os headers que o produto realmente envia. */
export function webhookSample(n: AtolNiche) {
  const ts = "2026-11-24T15:04:05.000Z";
  const d = n.webhook.data as { status?: string; type?: string; text?: string | null };
  // mesmo shape que lib/whatsapp.ts do atol-connect enfileira
  const data =
    n.webhook.event === "message.status"
      ? { wamid: "wamid.HBgNNTUxMTk5OTk5MDAwMRUCABEYEjA", status: d.status ?? "delivered", recipient: n.to, errors: null, pricing_category: n.template.category, timestamp: ts }
      : { wamid: "wamid.HBgNNTUxMTk5OTk5MDAwMhUCABIYFjM", from: n.to, profile_name: "Cliente", phone_number_id: "123456789012345", type: d.type ?? "text", text: d.text ?? null, timestamp: ts };
  const payload = { event: n.webhook.event, created_at: ts, data };
  const body = JSON.stringify(payload, null, 2);
  const headers = [
    "POST /seu-endpoint HTTP/1.1",
    "Content-Type: application/json",
    "User-Agent: AtolConnect-Webhooks/1.0",
    `X-Atol-Event: ${n.webhook.event}`,
    "X-Atol-Timestamp: 1795964645",
    "X-Atol-Signature: sha256=<HMAC-SHA256(segredo, `${timestamp}.${corpo}`)>",
  ].join("\n");
  const verify = `// Node — valide antes de processar (rejeite timestamp > 5 min)
import { createHmac, timingSafeEqual } from "node:crypto";

export function isValidAtol(rawBody: string, ts: string, sig: string, secret: string) {
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(\`\${ts}.\${rawBody}\`).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}`;
  return { headers, body, verify };
}

export const NICHE_SEGMENTS = ATOL_NICHES.map((n) => ({ slug: n.slug, name: n.name }));
