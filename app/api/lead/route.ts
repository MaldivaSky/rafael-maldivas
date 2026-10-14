import { NextResponse } from "next/server";
import { normalizarLead, type RawLead } from "../../lib/lead";
import { armazenamentoConfigurado, salvarLead } from "../../lib/leads-store";

/**
 * Recebe o lead do formulário e grava no banco de leads.
 *
 * Principal: PostgreSQL na Oracle Cloud; reserva: Notion (se a Oracle
 * falhar, o contato não se perde). Detalhes em app/lib/leads-store.ts.
 *
 * Runtime Node (padrão), NÃO edge: precisamos de env vars confiáveis,
 * de node:crypto (JWT) e de um timeout decente na Vercel.
 */

export const runtime = "nodejs";

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

/* ---------------- handler ---------------- */

export async function POST(req: Request) {
  if (!armazenamentoConfigurado()) {
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
    const destino = await salvarLead(lead);
    return NextResponse.json({ ok: true, destino });
  } catch (e) {
    console.error("[lead] falha ao gravar:", String(e).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}
