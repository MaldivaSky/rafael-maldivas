import { NextResponse } from "next/server";
import { getStudentSessionFromRequest, sameOriginRequest } from "@/app/lib/student-auth";
import {
  calcularCompletudePerfil,
  getAlunoByEmail,
  getAlunoById,
  oracleConfigurado,
  touchAlunoAcesso,
  updateAlunoPerfil,
} from "@/app/lib/oracle-students";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getStudentSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { ok: false, autenticado: false, reason: "unauthorized" },
      { status: 401 },
    );
  }
  if (!oracleConfigurado()) {
    const fallbackAluno = {
      id: session.sub,
      google_sub: session.sub,
      email: session.email,
      nome: session.nome || session.email.split("@")[0] || "Aluno",
      nome_certificado: session.nome || "",
      avatar_url: session.avatarUrl || "",
      headline: "",
      bio: "",
      github_url: "",
      linkedin_url: "",
      objetivo: "",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
      ultimo_acesso_em: new Date().toISOString(),
    };
    return NextResponse.json(
      { ok: true, autenticado: true, aluno: fallbackAluno, completude: 40 },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    let aluno = await getAlunoById(session.sub);
    if (!aluno && session.email) {
      aluno = await getAlunoByEmail(session.email);
    }
    if (!aluno) {
      const fallbackAluno = {
        id: session.sub,
        google_sub: session.sub,
        email: session.email,
        nome: session.nome || session.email.split("@")[0] || "Aluno",
        nome_certificado: session.nome || "",
        avatar_url: session.avatarUrl || "",
        headline: "",
        bio: "",
        github_url: "",
        linkedin_url: "",
        objetivo: "",
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
        ultimo_acesso_em: new Date().toISOString(),
      };
      return NextResponse.json(
        { ok: true, autenticado: true, aluno: fallbackAluno, completude: 40 },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    void touchAlunoAcesso(aluno);
    return NextResponse.json(
      { ok: true, autenticado: true, aluno, completude: calcularCompletudePerfil(aluno) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[aluno/me GET]", String(err).slice(0, 300));
    return NextResponse.json({ ok: false, autenticado: false, reason: "storage" }, { status: 502 });
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

