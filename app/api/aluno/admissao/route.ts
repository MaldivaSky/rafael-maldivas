import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  calculateAgeAndBracket,
  deriveMacroRegion,
  gradeItAssessment,
  recommendCourseLevelFromAdmission,
  validateAdmissionQuestionnaire,
  type AdmissionQuestionnaire,
  type AdmissionRecord,
} from "@/app/lib/course-admission";
import {
  getAlunoByEmail,
  getAlunoById,
  getWorkspaceAluno,
  oracleConfigurado,
  registrarEventoAluno,
  upsertAlunoAdmissao,
  upsertWorkspaceAluno,
} from "@/app/lib/oracle-students";
import {
  buildAdmissionCookieHeader,
  getAdmissionSigningSecret,
  getStudentAdmissionFromRequest,
  getStudentSessionFromRequest,
  issueAdmissionCompletedToken,
  issueEmailActivationToken,
  sanitizeNextPath,
} from "@/app/lib/student-auth";

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
  const admCookie = getStudentAdmissionFromRequest(req);
  const session = getStudentSessionFromRequest(req);

  if (admCookie && admCookie.activated) {
    return NextResponse.json({
      ok: true,
      authenticated: true,
      activated: true,
      student: {
        id: admCookie.sub,
        email: admCookie.email,
        nome: admCookie.nome,
        recommendedLevel: admCookie.recommendedLevel,
      },
    });
  }

  if (session && oracleConfigurado()) {
    try {
      let [aluno, ws] = await Promise.all([
        getAlunoById(session.sub),
        getWorkspaceAluno(session.sub),
      ]);
      if (!aluno && session.email) {
        aluno = await getAlunoByEmail(session.email);
        if (aluno && !ws) {
          ws = await getWorkspaceAluno(aluno.id);
        }
      }
      const admRecord =
        (ws?.dados?.admissionRecord as AdmissionRecord | undefined) ??
        (aluno?.admissao && typeof aluno.admissao === "object" && "questionnaire" in aluno.admissao
          ? aluno.admissao
          : null);
      const resolvedNome =
        aluno?.nome_certificado ||
        aluno?.nome ||
        session.nome ||
        admRecord?.questionnaire?.fullName ||
        "";
      const resolvedAvatar = aluno?.avatar_url || session.avatarUrl || "";

      if (admRecord && admRecord.emailActivated) {
        const secret = getAdmissionSigningSecret();
        const admToken = issueAdmissionCompletedToken(
          {
            sub: session.sub,
            email: session.email,
            nome: resolvedNome || "Aluno",
            recommendedLevel: admRecord.recommendedLevel || "facil",
          },
          secret,
        );
        const res = NextResponse.json({
          ok: true,
          authenticated: true,
          activated: true,
          student: {
            id: session.sub,
            email: session.email,
            nome: resolvedNome || "Aluno",
            avatarUrl: resolvedAvatar,
            recommendedLevel: admRecord.recommendedLevel || "facil",
          },
        });
        res.headers.append("Set-Cookie", buildAdmissionCookieHeader(admToken));
        return res;
      }

      return NextResponse.json({
        ok: true,
        authenticated: true,
        activated: false,
        student: {
          id: session.sub,
          email: aluno?.email || session.email,
          nome: resolvedNome,
          avatarUrl: resolvedAvatar,
          objetivo: aluno?.objetivo || "",
          headline: aluno?.headline || "",
          existingQuestionnaire: admRecord?.questionnaire ?? null,
        },
      });
    } catch {
      /* fallback below */
    }
  }

  if (session) {
    return NextResponse.json({
      ok: true,
      authenticated: true,
      activated: false,
      student: {
        id: session.sub,
        email: session.email,
        nome: session.nome || "",
        avatarUrl: session.avatarUrl || "",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    authenticated: false,
    activated: false,
    student: null,
  });
}

async function trySendActivationEmailViaResend(params: {
  toEmail: string;
  studentName: string;
  activationUrl: string;
  scorePct: number;
  recommendedLevel: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "Maldivas Tech <cursos@maldivastech.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [params.toEmail],
        subject: "Ative seu acesso ao Curso Construa seu Marketplace · Maldivas Tech",
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background: #0b111d; color: #f1f5f9; border-radius: 16px; border: 1px solid #1e293b;">
            <h2 style="margin: 0 0 12px; color: #22b5f2;">Parabéns, ${params.studentName}!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
              Você concluiu o Censo Etnográfico-Regional e foi aprovado(a) no Teste de Informática Fundamental com <strong>${params.scorePct}%</strong> de aproveitamento.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
              Trilha recomendada para seu perfil: <strong style="color: #f8fafc; text-transform: uppercase;">Nível ${params.recommendedLevel}</strong>.
            </p>
            <div style="margin: 26px 0;">
              <a href="${params.activationUrl}" style="display: inline-block; padding: 14px 24px; background: #22c55e; color: #04190b; font-weight: 800; text-decoration: none; border-radius: 10px; font-size: 15px;">
                Ativar Meu Acesso e Entrar na Aula →
              </a>
            </div>
            <p style="font-size: 12px; color: #64748b;">
              Se o botão acima não abrir, copie e cole este link no navegador:<br/>
              <a href="${params.activationUrl}" style="color: #38bdf8;">${params.activationUrl}</a>
            </p>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: {
    questionnaire?: Partial<AdmissionQuestionnaire>;
    itAnswers?: Record<string, number>;
    next?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Formato de requisição inválido." },
      { status: 400 },
    );
  }

  const rawQ = body.questionnaire ?? {};
  const validation = validateAdmissionQuestionnaire(rawQ);
  if (!validation.valid) {
    return NextResponse.json(
      { ok: false, message: validation.error || "Preencha todos os campos obrigatórios." },
      { status: 400 },
    );
  }

  const itAnswers = body.itAnswers ?? {};
  const grade = gradeItAssessment(itAnswers);
  if (!grade.passed) {
    return NextResponse.json(
      {
        ok: false,
        message: `Você acertou ${grade.correctCount} de ${grade.totalQuestions} (${grade.scorePct}%). É necessário acertar pelo menos 3 questões para liberar o link de ativação.`,
        itResult: grade,
      },
      { status: 422 },
    );
  }

  const cleanEmail = (rawQ.email ?? "").trim().toLowerCase();
  const cleanName = (rawQ.fullName ?? "").trim();
  const session = getStudentSessionFromRequest(req);

  const questionnaire: AdmissionQuestionnaire = {
    fullName: cleanName,
    email: cleanEmail,
    birthDate: (rawQ.birthDate ?? "").trim(),
    authMethod: session ? "google" : rawQ.authMethod === "google" ? "google" : "email",
    educationLevel: rawQ.educationLevel ?? "Ensino Médio Completo",
    howFoundSite: rawQ.howFoundSite ?? "Busca no Google / Bing",
    knowsProgramming: rawQ.knowsProgramming ?? "nao",
    programmingLanguages: Array.isArray(rawQ.programmingLanguages)
      ? rawQ.programmingLanguages
      : ["Nenhuma ainda (Iniciante Absoluto)"],
    motivation: rawQ.motivation ?? "Aprender programação do zero com método prático",
    motivationGoalText: rawQ.motivationGoalText ?? "",
    stateUf: (rawQ.stateUf ?? "SP").toUpperCase(),
    city: (rawQ.city ?? "").trim(),
    urbanZone: rawQ.urbanZone ?? "Capital (Centro ou Bairros Centrais)",
    ethnicityIbge: rawQ.ethnicityIbge ?? "Prefiro não declarar",
    gender: rawQ.gender ?? "Prefiro não declarar",
    employmentStatus: rawQ.employmentStatus ?? "Estudante (Escola / Faculdade / Curso Técnico)",
    incomeBracket: rawQ.incomeBracket ?? "Prefiro não informar",
    deviceAccess: rawQ.deviceAccess ?? "Notebook / PC próprio em casa com internet fibra/banda larga",
    learningStyle: rawQ.learningStyle ?? "Prático / Hands-on (aprendo fazendo, digitando código e testando)",
    englishLevel: rawQ.englishLevel ?? "Básico (entendo palavras soltas, uso tradutor)",
    aiUsage: rawQ.aiUsage ?? "Uso às vezes para tirar dúvidas rápidas",
  };

  const macroRegion = deriveMacroRegion(questionnaire.stateUf);
  const { ageYears, ageBracket } = calculateAgeAndBracket(questionnaire.birthDate);
  const recommendedLevel = recommendCourseLevelFromAdmission(questionnaire, grade.scorePct);
  const nowIso = new Date().toISOString();

  const admissionRecord: AdmissionRecord = {
    version: 1,
    questionnaire,
    macroRegion,
    ageYears,
    ageBracket,
    itTestAnswers: itAnswers,
    itTestScore: grade.scorePct,
    itTestPassed: true,
    recommendedLevel,
    emailActivated: false,
    submittedAt: nowIso,
    activatedAt: null,
  };

  let studentSub =
    session?.sub ||
    `email:${createHash("sha256").update(cleanEmail).digest("hex").slice(0, 28)}`;

  if (oracleConfigurado()) {
    try {
      const headline = `${questionnaire.educationLevel} · ${questionnaire.city}/${questionnaire.stateUf} (${macroRegion})`;
      const bio = ` Zona: ${questionnaire.urbanZone} | Ocupação: ${questionnaire.employmentStatus} | Origem: ${questionnaire.howFoundSite} | Linguagens: ${questionnaire.programmingLanguages.join(", ")} | Teste TI: ${grade.scorePct}%`;
      const aluno = await upsertAlunoAdmissao({
        email: cleanEmail,
        nome: cleanName,
        headline,
        bio,
        objetivo: questionnaire.motivation,
        admissao: admissionRecord,
      });
      studentSub = aluno.id;

      const existingWs = await getWorkspaceAluno(studentSub);
      await Promise.all([
        upsertWorkspaceAluno(studentSub, {
          ...(existingWs?.dados ?? {}),
          selectedLevel: recommendedLevel,
          admissionRecord,
        }),
        registrarEventoAluno({
          alunoId: studentSub,
          tipo: "perfil_atualizado",
          meta: {
            evento: "admissao_submetida",
            admissionRecord,
            macroRegion,
            stateUf: questionnaire.stateUf,
            city: questionnaire.city,
            educationLevel: questionnaire.educationLevel,
            ethnicityIbge: questionnaire.ethnicityIbge,
            gender: questionnaire.gender,
            incomeBracket: questionnaire.incomeBracket,
            howFoundSite: questionnaire.howFoundSite,
            itScorePct: grade.scorePct,
            recommendedLevel,
          },
        }),
      ]);
    } catch (err) {
      console.error("[api/aluno/admissao]", String(err).slice(0, 250));
    }
  }

  const origin = getSiteOrigin(req);
  const nextPath = sanitizeNextPath(
    body.next,
    "/pt/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa",
  );
  const secret = getAdmissionSigningSecret();
  const activationToken = issueEmailActivationToken(
    {
      sub: studentSub,
      email: cleanEmail,
      nome: cleanName,
      recommendedLevel,
      next: nextPath,
    },
    secret,
  );
  const activationUrl = `${origin}/api/auth/ativar?token=${encodeURIComponent(activationToken)}`;

  const emailSent = await trySendActivationEmailViaResend({
    toEmail: cleanEmail,
    studentName: cleanName,
    activationUrl,
    scorePct: grade.scorePct,
    recommendedLevel,
  });

  return NextResponse.json({
    ok: true,
    emailSent,
    recipientEmail: cleanEmail,
    studentName: cleanName,
    recommendedLevel,
    activationUrl,
    itResult: grade,
  });
}
