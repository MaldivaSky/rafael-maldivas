"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowRight, Award, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { localePath, type Lang } from "@/app/lib/seo";
import GoogleSignInButton from "./GoogleSignInButton";

type LoginContext = "perfil" | "trilha";

const ERROR_MESSAGES: Record<string, { pt: string; en: string }> = {
  cancelled: {
    pt: "Você cancelou o login com o Google. Clique abaixo se quiser tentar novamente.",
    en: "Google sign-in was cancelled. Click below to try again.",
  },
  invalid_state: {
    pt: "A sessão de autenticação expirou antes da confirmação. Tente entrar novamente.",
    en: "Your authentication session expired. Please try signing in again.",
  },
  not_configured: {
    pt: "O login com Google não está habilitado neste ambiente.",
    en: "Google sign-in is not configured in this environment.",
  },
  token_exchange_failed: {
    pt: "Não foi possível validar o retorno com o Google. Tente novamente em instantes.",
    en: "Could not complete token verification with Google. Please try again.",
  },
  invalid_claims: {
    pt: "Sua conta Google precisa ter um e-mail verificado para acessar a Área do Aluno.",
    en: "Your Google account must have a verified email to access the Student Portal.",
  },
};

export default function StudentLoginCard({
  lang,
  context,
  authError,
}: {
  lang: Lang;
  context: LoginContext;
  authError?: string | null;
}) {
  const pt = lang === "pt";
  const nextRoute = context === "perfil" ? "/perfil" : "/trilha";
  const loginHref = `/api/auth/google/login?next=${encodeURIComponent(localePath(nextRoute, lang))}`;

  const title =
    context === "perfil"
      ? pt
        ? "Entre na sua conta para gerenciar seu perfil"
        : "Sign in to manage your student profile"
      : pt
        ? "Acesse sua trilha e progresso do curso"
        : "Access your course track and progress";

  const subtitle =
    context === "perfil"
      ? pt
        ? "Use sua conta Google para definir seu nome oficial nos certificados, links profissionais e objetivo na trilha."
        : "Use your Google account to set your official certificate name, professional links, and learning goal."
      : pt
        ? "Entre com sua conta Google para salvar suas aulas concluídas, notas de quizzes, projeto final e certificados verificáveis na nuvem."
        : "Sign in with Google to sync completed lessons, quiz scores, final project reviews, and verifiable certificates.";

  const errEntry = authError ? ERROR_MESSAGES[authError] : null;
  const errText = authError
    ? errEntry
      ? pt
        ? errEntry.pt
        : errEntry.en
      : pt
        ? `Não foi possível concluir o login (${authError}). Tente novamente.`
        : `Could not complete sign-in (${authError}). Please try again.`
    : null;

  return (
    <div className="auth-shell">
      <section className="auth-card" aria-labelledby="student-auth-title">
        <div className="auth-top-row">
          <div className="auth-brand-pill">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={36}
              height={36}
              style={{ borderRadius: 9 }}
            />
            <div className="auth-brand-text">
              <strong>Maldivas Tech</strong>
              <span>{pt ? "Área do Aluno" : "Student Portal"}</span>
            </div>
          </div>

          <span className="auth-sec-badge">
            <Lock size={12} aria-hidden="true" />
            OAuth 2.0
          </span>
        </div>

        <h1 id="student-auth-title" className="auth-title">
          {title}
        </h1>
        <p className="auth-subtitle">{subtitle}</p>

        {errText && (
          <div className="auth-error-box" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <span>{errText}</span>
          </div>
        )}

        <GoogleSignInButton
          href={loginHref}
          label={pt ? "Continuar com o Google" : "Continue with Google"}
          loadingLabel={pt ? "Redirecionando para o Google..." : "Redirecting to Google..."}
          fullWidth
        />

        <div className="auth-divider">
          {pt ? "O que você desbloqueia" : "What you unlock"}
        </div>

        <ul className="auth-perks">
          <li>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>
              <strong>{pt ? "Progresso sincronizado na nuvem:" : "Cloud-synced progress:"}</strong>{" "}
              {pt
                ? "suas aulas e notas de quiz continuam de onde você parou em qualquer dispositivo."
                : "pick up your lessons and quiz history from any device."}
            </span>
          </li>
          <li>
            <Award size={16} aria-hidden="true" />
            <span>
              <strong>{pt ? "Certificados verificáveis:" : "Verifiable certificates:"}</strong>{" "}
              {pt
                ? "personalize seu nome oficial e acompanhe a avaliação técnica do projeto final."
                : "customize your certificate name and track final project evaluation."}
            </span>
          </li>
          <li>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>{pt ? "Login seguro sem senha:" : "Passwordless security:"}</strong>{" "}
              {pt
                ? "autenticação oficial via Google com proteção PKCE e sessão criptografada."
                : "official Google sign-in protected by PKCE and encrypted session cookies."}
            </span>
          </li>
        </ul>

        <footer className="auth-footer">
          <p className="auth-privacy">
            {pt
              ? "Utilizamos apenas seu nome, e-mail e foto do Google para identificar sua conta de aluno e emitir certificados."
              : "We only use your Google name, email, and avatar to identify your student account and issue certificates."}
          </p>
          <div className="auth-links">
            <Link href={localePath("/cursos/construa-seu-marketplace", lang)}>
              {pt ? "Ver ementa do curso" : "View course syllabus"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href={localePath("/cursos", lang)}>
              {pt ? "Catálogo de cursos" : "Course catalog"}
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
