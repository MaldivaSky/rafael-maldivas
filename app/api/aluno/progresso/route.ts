import { NextResponse } from "next/server";
import { getStudentSessionFromRequest, sameOriginRequest } from "@/app/lib/student-auth";
import {
  oracleConfigurado,
  salvarProgressoAula,
  sincronizarProgressoLocal,
} from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOriginRequest(req)) {
    return NextResponse.json({ ok: false, reason: "csrf" }, { status: 403 });
  }
  const session = getStudentSessionFromRequest(req);
  if (!session) {
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

  const cursoSlug =
    typeof body.cursoSlug === "string" && body.cursoSlug.trim()
      ? body.cursoSlug.trim()
      : "construa-seu-marketplace";

  try {
    // Sincronização em lote (vinda do localStorage ao logar pela primeira vez)
    if (Array.isArray(body.syncSlugs)) {
      const ids = body.syncSlugs.filter((x): x is string => typeof x === "string");
      await sincronizarProgressoLocal({
        alunoId: session.sub,
        cursoSlug,
        licaoIds: ids,
      });
      return NextResponse.json({ ok: true });
    }

    const licaoId = typeof body.licaoId === "string" ? body.licaoId.trim() : "";
    if (!licaoId) {
      return NextResponse.json({ ok: false, reason: "missing_lesson" }, { status: 400 });
    }

    const status = body.status === "em_andamento" ? "em_andamento" : "concluida";
    const notaQuiz = typeof body.notaQuiz === "number" ? body.notaQuiz : null;
    const ifNotExists = body.ifNotExists === true;

    await salvarProgressoAula({
      alunoId: session.sub,
      cursoSlug,
      licaoId,
      status,
      notaQuiz,
      ifNotExists,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[aluno/progresso POST]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

