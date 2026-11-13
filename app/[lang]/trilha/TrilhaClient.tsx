"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  GraduationCap,
  Loader2,
  LogOut,
  PlayCircle,
  UserCheck,
} from "lucide-react";
import { COURSES, formatDuration } from "@/app/lib/courses";
import { localePath, type Lang } from "@/app/lib/seo";
import StudentLoginCard from "@/app/components/auth/StudentLoginCard";

type AlunoView = {
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

type ProgressoItem = {
  curso_slug: string;
  licao_id: string;
  status: "em_andamento" | "concluida";
  nota_quiz: number | null;
  atualizado_em: string;
  concluido_em: string | null;
};

type CertItem = {
  codigo_verificacao: string;
  curso_slug: string;
  nome_exibido: string;
  nota_final: number;
  carga_horaria_min: number;
  emitido_em: string;
};

type TrilhaData = {
  aluno: AlunoView;
  completude: number;
  progresso: ProgressoItem[];
  certificados: CertItem[];
};

const M0_KEY = "maldivas-curso-m0-done-v1";
const M1_KEY = "maldivas-curso-m1-done-v1";

function collectLocalProgressSlugs(): string[] {
  const out: string[] = [];
  for (const key of [M0_KEY, M1_KEY]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string" && item.trim()) out.push(item.trim());
        }
      }
    } catch {
      /* ignore */
    }
  }
  return Array.from(new Set(out));
}

export default function TrilhaClient({
  lang,
  authError,
}: {
  lang: Lang;
  authError?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TrilhaData | null>(null);
  const [unauth, setUnauth] = useState(false);

  const course = COURSES["construa-seu-marketplace"];

  const loadTrilha = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/aluno/trilha", { cache: "no-store" });
      if (r.status === 401) {
        setUnauth(true);
        setData(null);
        return;
      }
      const json = await r.json();
      if (json.ok) {
        setUnauth(false);
        setData({
          aluno: json.aluno,
          completude: json.completude ?? 0,
          progresso: json.progresso ?? [],
          certificados: json.certificados ?? [],
        });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const r = await fetch("/api/aluno/trilha", { cache: "no-store" });
      if (!active) return;
      if (r.status === 401) {
        setUnauth(true);
        setLoading(false);
        return;
      }
      const json = await r.json();
      if (!active) return;
      if (json.ok) {
        setUnauth(false);
        // Sincroniza progresso offline do localStorage se houver aulas ainda não salvas no banco
        const localSlugs = collectLocalProgressSlugs();
        const remoteSet = new Set(
          (json.progresso as ProgressoItem[] | undefined)?.map((p) => p.licao_id) ?? [],
        );
        const missing = localSlugs.filter((s) => !remoteSet.has(s));
        if (missing.length > 0) {
          await fetch("/api/aluno/progresso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cursoSlug: course.slug,
              syncSlugs: missing,
            }),
          }).catch(() => undefined);
          await loadTrilha();
          return;
        }
        setData({
          aluno: json.aluno,
          completude: json.completude ?? 0,
          progresso: json.progresso ?? [],
          certificados: json.certificados ?? [],
        });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [course.slug, loadTrilha]);

  const allLessons = useMemo(
    () => course.modules.flatMap((m) => m.lessons),
    [course.modules],
  );

  const doneMap = useMemo(() => {
    const map = new Map<string, ProgressoItem>();
    for (const p of data?.progresso ?? []) {
      map.set(p.licao_id, p);
    }
    return map;
  }, [data?.progresso]);

  const completedCount = useMemo(
    () =>
      allLessons.filter(
        (l) =>
          doneMap.get(l.id)?.status === "concluida" ||
          doneMap.get(l.slug)?.status === "concluida",
      ).length,
    [allLessons, doneMap],
  );

  const percent =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const studiedMinutes = useMemo(
    () =>
      allLessons
        .filter(
          (l) =>
            doneMap.get(l.id)?.status === "concluida" ||
            doneMap.get(l.slug)?.status === "concluida",
        )
        .reduce((acc, l) => acc + l.durationMin, 0),
    [allLessons, doneMap],
  );

  const nextLesson = useMemo(
    () =>
      allLessons.find(
        (l) =>
          doneMap.get(l.id)?.status !== "concluida" &&
          doneMap.get(l.slug)?.status !== "concluida",
      ) ?? allLessons[0],
    [allLessons, doneMap],
  );

  const avgQuiz = useMemo(() => {
    const scores = (data?.progresso ?? [])
      .map((p) => p.nota_quiz)
      .filter((n): n is number => typeof n === "number");
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [data?.progresso]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="auth-shell">
        <div
          className="curso-catalog-card"
          style={{
            padding: "2rem 2.5rem",
            textAlign: "center",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Loader2 size={18} className="spin" aria-hidden="true" />
          <span className="curso-muted">Carregando sua trilha...</span>
        </div>
      </div>
    );
  }

  if (unauth || !data) {
    return <StudentLoginCard lang={lang} context="trilha" authError={authError} />;
  }

  const { aluno, completude, certificados } = data;

  return (
    <>
      <header className="curso-catalog-head">
        <div className="sec-tag">Área do Aluno</div>
        <h1>Meu Curso e Trajetória</h1>
        <p className="hero-lead">
          Seu progresso sincronizado na nuvem, próxima aula recomendada e certificados verificáveis.
        </p>
      </header>
      <div style={{ display: "grid", gap: "1.75rem" }}>
      {/* Cabeçalho do Aluno */}
      <section
        className="curso-catalog-card"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {aluno.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={aluno.avatar_url}
              alt={aluno.nome}
              width={56}
              height={56}
              style={{ borderRadius: "999px", objectFit: "cover", border: "2px solid rgba(34,181,242,0.4)" }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "999px",
                background: "rgba(34,181,242,0.16)",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              {aluno.nome.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "1.15rem" }}>{aluno.nome_certificado || aluno.nome}</strong>
              <span className="curso-pill">Perfil {completude}% completo</span>
            </div>
            <p className="curso-muted" style={{ margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
              {aluno.headline || aluno.email}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          <Link href={localePath("/perfil", lang)} className="btn btn-ghost curso-btn-sm">
            <UserCheck size={16} aria-hidden="true" />
            Meu Perfil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost curso-btn-sm"
          >
            <LogOut size={16} aria-hidden="true" />
            Sair
          </button>
        </div>
      </section>

      {/* KPIs do Meu Curso */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="curso-catalog-card">
          <span className="curso-muted" style={{ fontSize: "0.85rem" }}>Progresso na trilha</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.25rem" }}>{percent}%</div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "rgba(148,163,184,0.2)",
              marginTop: "0.6rem",
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${percent}%`, height: "100%", background: "#22B5F2" }} />
          </div>
        </div>

        <div className="curso-catalog-card">
          <span className="curso-muted" style={{ fontSize: "0.85rem" }}>Aulas concluídas</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.25rem" }}>
            {completedCount} / {allLessons.length}
          </div>
          <span className="curso-muted" style={{ fontSize: "0.82rem" }}>
            {formatDuration(studiedMinutes, lang)} estudadas
          </span>
        </div>

        <div className="curso-catalog-card">
          <span className="curso-muted" style={{ fontSize: "0.85rem" }}>Desempenho em quizzes</span>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "0.25rem" }}>
            {avgQuiz !== null ? `${avgQuiz}%` : "—"}
          </div>
          <span className="curso-muted" style={{ fontSize: "0.82rem" }}>
            {certificados.length > 0 ? "Certificado emitido" : "Exame final a partir de 80%"}
          </span>
        </div>
      </section>

      {/* CTA Continuar de onde parei */}
      {nextLesson && (
        <section
          className="curso-catalog-card"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            borderColor: "rgba(34,181,242,0.45)",
          }}
        >
          <div>
            <span className="curso-badge">
              <Flame size={14} aria-hidden="true" /> Próxima aula recomendada
            </span>
            <h2 style={{ marginTop: "0.6rem", fontSize: "1.25rem" }}>{nextLesson.title}</h2>
            <p className="curso-muted" style={{ marginTop: "0.3rem", maxWidth: 680 }}>
              {nextLesson.summary}
            </p>
          </div>
          <Link
            href={localePath(`/cursos/${course.slug}/${nextLesson.slug}`, lang)}
            className="btn btn-primary"
          >
            <PlayCircle size={18} aria-hidden="true" />
            Continuar agora
          </Link>
        </section>
      )}

      {/* Minha Trajetória (Módulo a Módulo) */}
      <section style={{ display: "grid", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Compass size={20} aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: "1.35rem" }}>Minha Trajetória — {course.name}</h2>
        </div>

        {course.modules.map((mod) => {
          const modDone = mod.lessons.filter(
            (l) =>
              doneMap.get(l.id)?.status === "concluida" ||
              doneMap.get(l.slug)?.status === "concluida",
          ).length;

          return (
            <div key={mod.id} className="curso-catalog-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.85rem",
                }}
              >
                <div>
                  <span className="curso-pill">Módulo {mod.number}</span>
                  <h3 style={{ margin: "0.4rem 0 0", fontSize: "1.15rem" }}>{mod.title}</h3>
                </div>
                <span className="curso-muted" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {modDone}/{mod.lessons.length} concluídas
                </span>
              </div>

              <div style={{ display: "grid", gap: "0.55rem" }}>
                {mod.lessons.map((lesson) => {
                  const prog = doneMap.get(lesson.id) ?? doneMap.get(lesson.slug);
                  const isDone = prog?.status === "concluida";

                  return (
                    <Link
                      key={lesson.id}
                      href={localePath(`/cursos/${course.slug}/${lesson.slug}`, lang)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        padding: "0.75rem 0.9rem",
                        borderRadius: "10px",
                        border: "1px solid rgba(148,163,184,0.18)",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                        {isDone ? (
                          <CheckCircle2 size={18} color="#22C55E" aria-hidden="true" />
                        ) : (
                          <BookOpen size={18} style={{ opacity: 0.65 }} aria-hidden="true" />
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{lesson.title}</div>
                          <div className="curso-muted" style={{ fontSize: "0.8rem", display: "flex", gap: "0.75rem" }}>
                            <span>
                              <Clock size={12} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                              {lesson.durationMin} min
                            </span>
                            {typeof prog?.nota_quiz === "number" && (
                              <span>Quiz: {prog.nota_quiz}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ opacity: 0.6 }} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Certificados Emitidos */}
      <section className="curso-catalog-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Award size={20} aria-hidden="true" />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Meus Certificados</h2>
        </div>

        {certificados.length === 0 ? (
          <p className="curso-muted" style={{ margin: 0 }}>
            Nenhum certificado emitido ainda. Conclua o Exame Final (mínimo 80%) na última
            etapa do curso para gerar seu certificado verificável.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {certificados.map((c) => (
              <div
                key={c.codigo_verificacao}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "0.9rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(34,197,94,0.35)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <GraduationCap size={18} color="#22C55E" aria-hidden="true" />
                    {c.nome_exibido} · Nota {c.nota_final}%
                  </div>
                  <div className="curso-muted" style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Código: <code>{c.codigo_verificacao}</code> · Emitido em{" "}
                    {new Date(c.emitido_em).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <Link
                  href={localePath(`/certificado/${c.codigo_verificacao}`, lang)}
                  className="btn btn-ghost curso-btn-sm"
                >
                  Validar / Imprimir
                  <ExternalLink size={15} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}

