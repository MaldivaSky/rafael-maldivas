"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Save, Sparkles } from "lucide-react";
import { localePath, type Lang } from "@/app/lib/seo";

type AlunoPerfil = {
  id: string;
  email: string;
  nome: string;
  nome_certificado: string;
  avatar_url: string;
  headline: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  objetivo: string;
  criado_em: string;
};

const OBJETIVOS = [
  "Construir meu próprio marketplace / SaaS",
  "Aprofundar arquitetura back-end e pagamentos",
  "Transição de carreira para engenharia de software",
  "Aplicar em projetos para clientes",
];

export default function PerfilClient({ lang }: { lang: Lang }) {
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [completude, setCompletude] = useState(0);
  const [aluno, setAluno] = useState<AlunoPerfil | null>(null);

  const [nomeCert, setNomeCert] = useState("");
  const [headline, setHeadline] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    fetch("/api/aluno/me", { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) {
          setUnauth(true);
          return;
        }
        const json = await r.json();
        if (json.ok && json.aluno) {
          const a = json.aluno as AlunoPerfil;
          setAluno(a);
          setCompletude(json.completude ?? 0);
          setNomeCert(a.nome_certificado || a.nome);
          setHeadline(a.headline || "");
          setObjetivo(a.objetivo || "");
          setBio(a.bio || "");
          setGithubUrl(a.github_url || "");
          setLinkedinUrl(a.linkedin_url || "");
        }
      })
      .catch(() => setErrorMsg("Não foi possível carregar seu perfil."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    setErrorMsg("");

    try {
      const r = await fetch("/api/aluno/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_certificado: nomeCert,
          headline,
          objetivo,
          bio,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        }),
      });
      const json = await r.json();
      if (!r.ok || !json.ok) {
        setErrorMsg("Erro ao salvar perfil. Tente novamente.");
      } else {
        setAluno(json.aluno);
        setCompletude(json.completude ?? 0);
        setSavedMsg("Perfil atualizado com sucesso!");
      }
    } catch {
      setErrorMsg("Falha de rede ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="curso-catalog-card" style={{ padding: "2rem", textAlign: "center" }}>
        <p className="curso-muted">Carregando perfil...</p>
      </div>
    );
  }

  if (unauth || !aluno) {
    const loginHref = `/api/auth/google/login?next=${encodeURIComponent(localePath("/perfil", lang))}`;
    return (
      <div className="curso-catalog-card" style={{ padding: "2rem", maxWidth: 640, margin: "0 auto" }}>
        <h2>Entre com sua conta Google para editar seu perfil</h2>
        <p className="curso-muted" style={{ marginTop: "0.5rem" }}>
          Seu perfil reúne seus dados para emissão de certificados, links profissionais e objetivo na trilha.
        </p>
        <div style={{ marginTop: "1.25rem" }}>
          <a href={loginHref} className="btn-p" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} aria-hidden="true" />
            Entrar com Google
          </a>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.85rem",
    borderRadius: "8px",
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(15, 23, 42, 0.35)",
    color: "inherit",
    fontSize: "0.95rem",
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: 780 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link
          href={localePath("/trilha", lang)}
          className="btn-g"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar para Minha Trilha
        </Link>
        <span className="curso-badge">Completude do perfil: {completude}%</span>
      </div>

      <section className="curso-catalog-card" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {aluno.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={aluno.avatar_url}
            alt={aluno.nome}
            width={64}
            height={64}
            style={{ borderRadius: "999px", objectFit: "cover" }}
          />
        )}
        <div>
          <strong style={{ fontSize: "1.15rem" }}>{aluno.nome}</strong>
          <div className="curso-muted" style={{ fontSize: "0.9rem" }}>{aluno.email}</div>
          <div className="curso-muted" style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>
            Aluno desde {new Date(aluno.criado_em).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="curso-catalog-card" style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label htmlFor="nome_certificado" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
            Nome completo (como aparecerá no Certificado)
          </label>
          <input
            id="nome_certificado"
            type="text"
            value={nomeCert}
            onChange={(e) => setNomeCert(e.target.value)}
            maxLength={200}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="headline" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
            Cargo / Headline profissional
          </label>
          <input
            id="headline"
            type="text"
            placeholder="Ex.: Desenvolvedor Back-end Python/Django | Empreendedor"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={160}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="objetivo" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
            Objetivo principal na trilha
          </label>
          <select
            id="objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            style={inputStyle}
          >
            <option value="">Selecione um objetivo...</option>
            {OBJETIVOS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bio" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
            Bio curta / Momento atual
          </label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Conte rapidamente sua experiência ou o projeto que está construindo..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={1000}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <div>
            <label htmlFor="github_url" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
              GitHub
            </label>
            <input
              id="github_url"
              type="text"
              placeholder="https://github.com/seu-usuario"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              maxLength={300}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="linkedin_url" style={{ display: "block", fontWeight: 600, marginBottom: "0.35rem" }}>
              LinkedIn
            </label>
            <input
              id="linkedin_url"
              type="text"
              placeholder="https://www.linkedin.com/in/seu-perfil"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              maxLength={300}
              style={inputStyle}
            />
          </div>
        </div>

        {savedMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#22C55E", fontSize: "0.92rem" }}>
            <CheckCircle2 size={18} aria-hidden="true" />
            {savedMsg}
          </div>
        )}
        {errorMsg && (
          <div role="alert" style={{ color: "#f87171", fontSize: "0.92rem" }}>
            {errorMsg}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn-p"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} aria-hidden="true" />}
            {saving ? "Salvando..." : "Salvar perfil"}
          </button>
        </div>
      </form>
    </div>
  );
}

