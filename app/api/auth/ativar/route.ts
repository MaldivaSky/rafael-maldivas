import { NextResponse } from "next/server";
import type { AdmissionRecord } from "@/app/lib/course-admission";
import {
  buildAdmissionCookieHeader,
  buildStudentCookieHeader,
  getAdmissionSigningSecret,
  issueAdmissionCompletedToken,
  issueStudentSession,
  sanitizeNextPath,
  verifyEmailActivationToken,
} from "@/app/lib/student-auth";
import {
  getWorkspaceAluno,
  oracleConfigurado,
  registrarEventoAluno,
  upsertWorkspaceAluno,
} from "@/app/lib/oracle-students";

export const runtime = "nodejs";

function getSiteOrigin(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  if (process.env.NODE_ENV === "production" && envUrl) return envUrl;
  if (host) return `${proto}://${host}`;
  return envUrl || "https://www.maldivastech.dev";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const origin = getSiteOrigin(req);

  const payload = verifyEmailActivationToken(token);
  if (!payload) {
    return NextResponse.redirect(`${origin}/pt/entrar?erro=link_ativacao_invalido`, 302);
  }

  const nowIso = new Date().toISOString();
  if (oracleConfigurado()) {
    try {
      const existingWs = await getWorkspaceAluno(payload.sub);
      const prevAdmission = (existingWs?.dados?.admissionRecord as AdmissionRecord | undefined) ?? null;
      const nextAdmission = prevAdmission
        ? { ...prevAdmission, emailActivated: true, activatedAt: nowIso }
        : {
            version: 1,
            emailActivated: true,
            activatedAt: nowIso,
            recommendedLevel: payload.recommendedLevel,
          };

      await Promise.all([
        upsertWorkspaceAluno(payload.sub, {
          ...(existingWs?.dados ?? {}),
          admissionRecord: nextAdmission,
        }),
        registrarEventoAluno({
          alunoId: payload.sub,
          tipo: "acesso_portal",
          meta: {
            evento: "email_ativado_com_sucesso",
            email: payload.email,
            recommendedLevel: payload.recommendedLevel,
          },
        }),
      ]);
    } catch (err) {
      console.error("[auth/ativar oracle]", String(err).slice(0, 250));
    }
  }

  const secret = getAdmissionSigningSecret();
  const studentSessionToken = issueStudentSession(payload.sub, payload.email, secret);
  const admissionToken = issueAdmissionCompletedToken(
    {
      sub: payload.sub,
      email: payload.email,
      nome: payload.nome,
      recommendedLevel: payload.recommendedLevel,
    },
    secret,
  );

  const destPath = sanitizeNextPath(
    payload.next,
    "/pt/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa",
  );
  const res = NextResponse.redirect(`${origin}${destPath}`, 302);
  res.headers.append("Set-Cookie", buildStudentCookieHeader(studentSessionToken));
  res.headers.append("Set-Cookie", buildAdmissionCookieHeader(admissionToken));
  return res;
}
