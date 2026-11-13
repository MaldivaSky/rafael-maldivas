import { NextResponse } from "next/server";
import { getStudentSessionFromRequest } from "@/app/lib/student-auth";
import {
  calcularCompletudePerfil,
  getAlunoById,
  getTrilhaAluno,
  oracleConfigurado,
} from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getStudentSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!oracleConfigurado()) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  try {
    const [aluno, trilha] = await Promise.all([
      getAlunoById(session.sub),
      getTrilhaAluno(session.sub),
    ]);
    if (!aluno) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        ok: true,
        aluno,
        completude: calcularCompletudePerfil(aluno),
        ...trilha,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[aluno/trilha GET]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

