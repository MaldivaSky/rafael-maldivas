import { NextResponse } from "next/server";
import { getStudentSessionFromRequest, sameOriginRequest } from "@/app/lib/student-auth";
import { COURSES } from "@/app/lib/courses";
import { oracleConfigurado, submeterProjetoParaAvaliacao } from "@/app/lib/oracle-students";

export const runtime = "nodejs";

function isValidHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

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
    typeof body.cursoSlug === "string" && body.cursoSlug in COURSES
      ? (body.cursoSlug as keyof typeof COURSES)
      : "construa-seu-marketplace";
  const repoUrl = typeof body.repoUrl === "string" ? body.repoUrl.trim() : "";
  const deployUrl = typeof body.deployUrl === "string" ? body.deployUrl.trim() : "";
  const resumoTecnico =
    typeof body.resumoTecnico === "string" ? body.resumoTecnico.trim() : "";
  const nomeExibido =
    typeof body.nomeExibido === "string" ? body.nomeExibido.trim() : "";
  const notaExame = typeof body.notaExame === "number" ? body.notaExame : 0;

  if (!isValidHttpUrl(repoUrl)) {
    return NextResponse.json({ ok: false, reason: "invalid_repo_url" }, { status: 400 });
  }
  if (deployUrl && !isValidHttpUrl(deployUrl)) {
    return NextResponse.json({ ok: false, reason: "invalid_deploy_url" }, { status: 400 });
  }
  if (notaExame < 80) {
    return NextResponse.json({ ok: false, reason: "exam_score_required" }, { status: 400 });
  }
  if (resumoTecnico.length < 20) {
    return NextResponse.json({ ok: false, reason: "summary_too_short" }, { status: 400 });
  }

  try {
    const avaliacao = await submeterProjetoParaAvaliacao({
      alunoId: session.sub,
      cursoSlug,
      nomeExibido,
      repoUrl,
      deployUrl,
      resumoTecnico,
      notaExame,
    });
    return NextResponse.json({ ok: true, avaliacao });
  } catch (err) {
    console.error("[aluno/avaliacao POST]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

