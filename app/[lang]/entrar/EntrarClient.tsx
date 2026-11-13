"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, LogOut, User } from "lucide-react";
import { localePath, type Lang } from "@/app/lib/seo";
import StudentLoginCard from "@/app/components/auth/StudentLoginCard";

type MeResponse = {
  autenticado: boolean;
  aluno?: {
    nome: string;
    nome_certificado: string;
    email: string;
    avatar_url: string;
  };
};

export default function EntrarClient({ lang }: { lang: Lang }) {
  const pt = lang === "pt";
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAuthError(params.get("auth_error"));

    fetch("/api/aluno/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: MeResponse) => setMe(d))
      .catch(() => setMe({ autenticado: false }))
      .finally(() => setLoading(false));
  }, []);

  async function sair() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setMe({ autenticado: false });
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
            {pt ? "Verificando sua sessão..." : "Checking your session..."}
          </p>
        </div>
      </div>
    );
  }

  if (me?.autenticado && me.aluno) {
    const displayName = me.aluno.nome_certificado || me.aluno.nome;
    return (
      <div className="auth-shell">
        <section className="auth-card" aria-labelledby="already-signed-in-title">
          <div className="auth-sec-badge" style={{ marginBottom: 14 }}>
            <CheckCircle2 size={13} aria-hidden="true" />
            {pt ? "Sessão ativa" : "Active session"}
          </div>
          <h1 id="already-signed-in-title" className="auth-title">
            {pt ? `Olá, ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="auth-subtitle">
            {pt
              ? `Você está conectado com ${me.aluno.email}. Escolha por onde continuar:`
              : `Signed in as ${me.aluno.email}. Choose where to go next:`}
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            <Link href={localePath("/trilha", lang)} className="btn btn-primary" style={{ justifyContent: "space-between" }}>
              <span>{pt ? "Ir para Minha Trilha" : "Go to My Learning Track"}</span>
              <ArrowRight size={16} />
            </Link>
            <Link href={localePath("/perfil", lang)} className="btn btn-ghost" style={{ justifyContent: "space-between" }}>
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
              <span>{loggingOut ? (pt ? "Saindo..." : "Signing out...") : pt ? "Sair da conta" : "Sign out"}</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  return <StudentLoginCard lang={lang} context="entrar" authError={authError} />;
}
