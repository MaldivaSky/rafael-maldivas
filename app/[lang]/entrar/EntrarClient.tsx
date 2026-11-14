"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, LogOut, User } from "lucide-react";
import { localePath, type Lang } from "@/app/lib/seo";
import { CourseAdmissionGate } from "@/app/components/curso/CourseAdmissionGate";

type AdmissionStatusResponse = {
  ok: boolean;
  authenticated: boolean;
  activated: boolean;
  student: {
    id: string;
    email: string;
    nome: string;
    recommendedLevel?: string;
  } | null;
};

export default function EntrarClient({ lang }: { lang: Lang }) {
  const pt = lang === "pt";
  const [loading, setLoading] = useState(true);
  const [adm, setAdm] = useState<AdmissionStatusResponse | null>(null);
  const [nextPath, setNextPath] = useState(
    "/pt/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa",
  );
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("next");
    if (n && n.startsWith("/")) {
      setNextPath(n);
    }

    fetch("/api/aluno/admissao", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: AdmissionStatusResponse) => setAdm(d))
      .catch(() =>
        setAdm({ ok: false, authenticated: false, activated: false, student: null }),
      )
      .finally(() => setLoading(false));
  }, []);

  async function sair() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAdm({ ok: true, authenticated: false, activated: false, student: null });
      window.dispatchEvent(new Event("maldivas:auth-changed"));
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card" style={{ textAlign: "center", padding: "56px 24px" }}>
          <Loader2 size={24} className="spin" />
          <p className="auth-subtitle" style={{ margin: "12px auto 0" }}>
            {pt ? "Verificando sua credencial de aluno..." : "Checking your student session..."}
          </p>
        </div>
      </div>
    );
  }

  if (adm?.activated && adm.student) {
    const displayName = adm.student.nome || adm.student.email;
    return (
      <div className="auth-shell">
        <section className="auth-card" aria-labelledby="already-signed-in-title">
          <div className="auth-sec-badge" style={{ marginBottom: 14 }}>
            <CheckCircle2 size={13} aria-hidden="true" />
            {pt ? "Matrícula Ativada & Verificada" : "Active Enrollment"}
          </div>
          <h1 id="already-signed-in-title" className="auth-title">
            {pt ? `Olá, ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="auth-subtitle">
            {pt
              ? `Conectado com ${adm.student.email}. Seu acesso às aulas e laboratórios está liberado:`
              : `Signed in as ${adm.student.email}. Choose where to continue:`}
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            <Link
              href={nextPath}
              className="btn btn-primary"
              style={{ justifyContent: "space-between" }}
            >
              <span>{pt ? "Continuar Curso Agora" : "Continue Course Now"}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localePath("/trilha", lang)}
              className="btn btn-ghost"
              style={{ justifyContent: "space-between" }}
            >
              <span>{pt ? "Ver Minha Trilha" : "My Learning Track"}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href={localePath("/perfil", lang)}
              className="btn btn-ghost"
              style={{ justifyContent: "space-between" }}
            >
              <span>{pt ? "Gerenciar Meu Perfil" : "Manage My Profile"}</span>
              <User size={16} />
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={sair}
              disabled={loggingOut}
              style={{ justifyContent: "center" }}
            >
              <LogOut size={15} />
              <span>
                {loggingOut
                  ? pt
                    ? "Saindo..."
                    : "Signing out..."
                  : pt
                    ? "Sair da conta"
                    : "Sign out"}
              </span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  return <CourseAdmissionGate targetPath={nextPath} initialStudent={adm?.student} />;
}
