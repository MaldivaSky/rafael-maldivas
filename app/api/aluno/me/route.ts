import { NextResponse } from "next/server";
import { getStudentSessionFromRequest, sameOriginRequest } from "@/app/lib/student-auth";
import {
  calcularCompletudePerfil,
  getAlunoById,
  oracleConfigurado,
  touchAlunoAcesso,
  updateAlunoPerfil,
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
    const aluno = await getAlunoById(session.sub);
    if (!aluno) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }
    void touchAlunoAcesso(aluno);
    return NextResponse.json(
      { ok: true, aluno, completude: calcularCompletudePerfil(aluno) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[aluno/me GET]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

export async function PATCH(req: Request) {
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

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : undefined);

  try {
    const aluno = await updateAlunoPerfil(session.sub, {
      nome_certificado: str("nome_certificado"),
      headline: str("headline"),
      bio: str("bio"),
      github_url: str("github_url"),
      linkedin_url: str("linkedin_url"),
      objetivo: str("objetivo"),
    });
    return NextResponse.json(
      { ok: true, aluno, completude: calcularCompletudePerfil(aluno) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[aluno/me PATCH]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, reason: "storage" }, { status: 502 });
  }
}

