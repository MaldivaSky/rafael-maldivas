import { NextResponse } from "next/server";
import { autorizado } from "@/app/lib/admin-auth";
import { COURSES, totalCourseMinutes } from "@/app/lib/courses";
import { avaliarProjetoAdmin, oracleConfigurado } from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!autorizado(req)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 400 });
  }

  const alunoId = typeof body.alunoId === "string" ? body.alunoId.trim() : "";
  const cursoSlug =
    typeof body.cursoSlug === "string" && body.cursoSlug in COURSES
      ? (body.cursoSlug as keyof typeof COURSES)
      : "construa-seu-marketplace";
  const decisao =
    body.decisao === "aprovado"
      ? "aprovado"
      : body.decisao === "revisao_solicitada"
        ? "revisao_solicitada"
        : null;
  const parecer = typeof body.parecer === "string" ? body.parecer.trim() : "";

  if (!alunoId || !decisao) {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  try {
    const res = await avaliarProjetoAdmin({
      alunoId,
      cursoSlug,
      decisao,
      parecer,
      cargaHorariaMin: totalCourseMinutes(COURSES[cursoSlug]),
    });
    return NextResponse.json({ ok: true, ...res });
  } catch (err) {
    console.error("[admin/avaliacoes POST]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

