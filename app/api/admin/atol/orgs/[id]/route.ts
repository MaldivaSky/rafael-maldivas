import { NextResponse } from "next/server";
import { autorizado } from "../../../../../lib/admin-auth";
import { atolFetch } from "../../../../../lib/atol";

export const runtime = "nodejs";

const PERMITIDOS = new Set(["plan_id", "status", "is_internal", "extend_trial_days"]);

/** Painel admin → Atol Connect: altera plano, situação, teste ou marca empresa como interna. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!autorizado(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  const corpo = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const limpo = Object.fromEntries(Object.entries(corpo).filter(([k]) => PERMITIDOS.has(k)));
  const r = await atolFetch(`/orgs/${id}`, { method: "PATCH", body: JSON.stringify(limpo) });
  const dados = await r.json().catch(() => ({}));
  return NextResponse.json(dados, { status: r.status });
}
