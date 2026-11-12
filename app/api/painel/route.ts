import { NextResponse } from "next/server";
import { autorizado } from "../../lib/admin-auth";
import { oracleConfigurado, painelOracle } from "../../lib/oracle-leads";

/**
 * Dados do painel BI (/admin, aba "Painel"). Protegida pela mesma senha do
 * painel de leads. Tudo é agregado no banco (função site.painel); aqui só se
 * valida o período e repassa.
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const dias = Number(new URL(req.url).searchParams.get("dias") ?? "30");
  const periodo = [7, 30, 90].includes(dias) ? dias : 30;

  try {
    const dados = await painelOracle(periodo);
    return NextResponse.json({ ok: true, dados }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[painel] falha:", String(e).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}
