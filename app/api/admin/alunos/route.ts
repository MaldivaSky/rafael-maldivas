import { NextResponse } from "next/server";
import { autorizado } from "@/app/lib/admin-auth";
import { listarPainelAlunosAdmin, oracleConfigurado } from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  try {
    const dados = await listarPainelAlunosAdmin();
    return NextResponse.json(
      { ok: true, dados },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[admin/alunos GET]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

