import { NextResponse } from "next/server";
import { autorizado } from "../../../lib/admin-auth";
import { atolFetch } from "../../../lib/atol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const semCache = { "Cache-Control": "no-store" };

/** Painel admin → Atol Connect: KPIs da plataforma + empresas (busca e filtro). */
export async function GET(req: Request) {
  if (!autorizado(req)) return NextResponse.json({ ok: false }, { status: 401, headers: semCache });
  const p = new URL(req.url).searchParams;
  const qs = new URLSearchParams();
  if (p.get("q")) qs.set("q", p.get("q")!);
  if (p.get("status")) qs.set("status", p.get("status")!);
  try {
    const [ov, orgs] = await Promise.all([atolFetch("/overview"), atolFetch(`/orgs?${qs}`)]);
    if (!ov.ok || !orgs.ok) {
      const status = ov.status === 503 || orgs.status === 503 ? 503 : 502;
      return NextResponse.json({ ok: false, reason: status === 503 ? "not_configured" : "atol_unavailable" }, { status, headers: semCache });
    }
    return NextResponse.json({ ok: true, overview: await ov.json(), orgs: (await orgs.json()).orgs }, { headers: semCache });
  } catch {
    return NextResponse.json({ ok: false, reason: "atol_unavailable" }, { status: 502, headers: semCache });
  }
}
