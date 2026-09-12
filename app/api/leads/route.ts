import { NextResponse } from "next/server";
import { listarLeads, atualizarStatus, STATUS_OPCOES } from "../../lib/notion-leads";

/**
 * API do painel de leads. Protegida por senha (ADMIN_PASSWORD) enviada no
 * header `x-admin-key`. A senha vive só no servidor; o navegador guarda
 * apenas um marcador de sessão no localStorage para não pedir toda vez.
 */

export const runtime = "nodejs";

function autorizado(req: Request): boolean {
  const esperado = process.env.ADMIN_PASSWORD;
  if (!esperado) return false;
  const enviado = req.headers.get("x-admin-key") ?? "";
  return enviado.length > 0 && enviado === esperado;
}

/* ---------- GET: lista os leads ---------- */
export async function GET(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  try {
    const leads = await listarLeads();
    return NextResponse.json({ ok: true, leads, statuses: STATUS_OPCOES });
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: "notion", detail: String(e).slice(0, 300) },
      { status: 502 }
    );
  }
}

/* ---------- PATCH: muda o status de um lead ---------- */
export async function PATCH(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !status || !STATUS_OPCOES.includes(status as (typeof STATUS_OPCOES)[number])) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  try {
    await atualizarStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: "notion", detail: String(e).slice(0, 300) },
      { status: 502 }
    );
  }
}
