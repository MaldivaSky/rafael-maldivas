import { NextResponse } from "next/server";
import { normalizarLead, type RawLead } from "../../lib/lead";

/**
 * Recebe o lead do formulário e grava uma página no database do Notion.
 *
 * Runtime Node (padrão), NÃO edge: precisamos de env vars confiáveis e de
 * um timeout decente para falar com a API do Notion na Vercel.
 *
 * Colunas reais da base "Leads — Maldivas Tech":
 *   Nome(title) Status(select) Area(select) Prazo(select)
 *   Servicos(multi_select) Contato(rich_text) Negocio(rich_text)
 *   Dor(rich_text) Idioma(select) Canal(select) Criado em(created_time)
 */

export const runtime = "nodejs";

const NOTION_API = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

/* ---------------- rate limit simples em memória ---------------- */
const HITS = new Map<string, number[]>();
const LIMITE = 3;
const JANELA = 10 * 60 * 1000; // 10 min

function passouDoLimite(ip: string): boolean {
  const agora = Date.now();
  const antigos = (HITS.get(ip) ?? []).filter((t) => agora - t < JANELA);
  antigos.push(agora);
  HITS.set(ip, antigos);
  return antigos.length > LIMITE;
}

/* ---------------- monta o payload do Notion ---------------- */

type Rich = { rich_text: { text: { content: string } }[] };
const rt = (content: string): Rich => ({
  rich_text: content ? [{ text: { content: content.slice(0, 1900) } }] : [],
});
const sel = (name: string) => (name ? { select: { name } } : undefined);

function montarPagina(databaseId: string, lead: ReturnType<typeof normalizarLead>) {
  const titulo = lead.negocio || lead.nome;

  const properties: Record<string, unknown> = {
    Nome: { title: [{ text: { content: titulo.slice(0, 1900) } }] },
    Status: { select: { name: "Novo" } },
    Area: sel(lead.area),
    Prazo: sel(lead.prazo),
    Servicos: lead.servicos.length
      ? { multi_select: lead.servicos.map((name) => ({ name })) }
      : undefined,
    Contato: rt(lead.contato),
    Negocio: rt(lead.negocio),
    Dor: rt(lead.dor),
    Idioma: sel(lead.idioma === "en" ? "EN" : "PT"),
    Canal: sel("Site"),
  };

  for (const k of Object.keys(properties)) {
    if (properties[k] === undefined) delete properties[k];
  }

  // corpo da página: leitura rápida, sem depender de coluna
  const linhas = [
    `Área: ${lead.area}`,
    `Negócio: ${lead.negocio || "—"}`,
    `Dor: ${lead.dor}`,
    `Serviços: ${lead.servicos.join(", ") || "não especificado"}`,
    `Prazo: ${lead.prazo}`,
    `Contato: ${lead.contato || "não informado"}`,
  ];
  const children = linhas.map((line) => ({
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: line } }] },
  }));

  return { parent: { database_id: databaseId }, properties, children };
}

/* ---------------- handler ---------------- */

export async function POST(req: Request) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 500 });
  }

  let raw: RawLead;
  try {
    raw = (await req.json()) as RawLead;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  // honeypot: bot preencheu o campo escondido -> finge sucesso e não grava
  if (raw.honey && raw.honey.trim() !== "") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (passouDoLimite(ip)) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  const lead = normalizarLead(raw);
  if (!lead.valido) {
    return NextResponse.json({ ok: false, reason: lead.motivo ?? "invalid" }, { status: 400 });
  }

  try {
    const r = await fetch(NOTION_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(montarPagina(databaseId, lead)),
      signal: AbortSignal.timeout(9000),
    });

    if (!r.ok) {
      const detalhe = await r.text();
      return NextResponse.json(
        { ok: false, reason: "notion", status: r.status, detalhe: detalhe.slice(0, 400) },
        { status: 502 }
      );
    }

    const page = await r.json();
    return NextResponse.json({ ok: true, id: page?.id ?? null });
  } catch {
    return NextResponse.json({ ok: false, reason: "network" }, { status: 502 });
  }
}
