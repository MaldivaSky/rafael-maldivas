"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, Check, Copy, ExternalLink, Loader2, Mail, RefreshCw, Search, UserCheck } from "lucide-react";
import type { PainelAlunosAdmin } from "@/app/lib/oracle-students";
import { COURSES } from "@/app/lib/courses";

function dataCurta(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function AlunosPanel({ aoExpirar }: { aoExpirar: () => void }) {
  const [dados, setDados] = useState<PainelAlunosAdmin | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [soPendentes, setSoPendentes] = useState(false);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [pareceres, setPareceres] = useState<Record<string, string>>({});
  const [avaliandoId, setAvaliandoId] = useState<string | null>(null);
  const [copiadoCod, setCopiadoCod] = useState<string | null>(null);

  const totalAulasCurso = useMemo(
    () => COURSES["construa-seu-marketplace"].modules.reduce((acc, m) => acc + m.lessons.length, 0),
    [],
  );

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/admin/alunos", { cache: "no-store" });
      if (r.status === 401) {
        aoExpirar();
        return;
      }
      const json = await r.json();
      if (!json.ok) {
        setErro("Não foi possível carregar os alunos.");
      } else {
        setDados(json.dados as PainelAlunosAdmin);
      }
    } catch {
      setErro("Falha de conexão ao buscar alunos.");
    } finally {
      setCarregando(false);
    }
  }, [aoExpirar]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const lista = dados?.alunos ?? [];
    const q = busca.trim().toLowerCase();
    return lista.filter((a) => {
      if (soPendentes && a.avaliacao?.status !== "pendente") return false;
      if (!q) return true;
      return (
        a.nome.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.objetivo.toLowerCase().includes(q)
      );
    });
  }, [dados?.alunos, busca, soPendentes]);

  async function avaliar(
    alunoId: string,
    cursoSlug: string,
    decisao: "aprovado" | "revisao_solicitada",
  ) {
    setAvaliandoId(alunoId);
    try {
      const r = await fetch("/api/admin/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alunoId,
          cursoSlug,
          decisao,
          parecer: pareceres[alunoId] ?? "",
        }),
      });
      if (r.status === 401) {
        aoExpirar();
        return;
      }
      if (r.ok) {
        await carregar();
      }
    } finally {
      setAvaliandoId(null);
    }
  }

  const selecionado = useMemo(
    () => filtrados.find((a) => a.id === selecionadoId) ?? null,
    [filtrados, selecionadoId],
  );

  if (carregando && !dados) {
    return (
      <div className="tool-index" style={{ padding: 32, textAlign: "center" }}>
        <Loader2 size={20} className="spin" /> Carregando alunos e trilhas...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="tool-index" style={{ padding: 24 }}>
        <p className="result-warn">{erro}</p>
        <button className="plink" onClick={carregar} style={{ marginTop: 10 }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  const kpis = dados?.kpis ?? {
    total_alunos: 0,
    ativos_7d: 0,
    total_concluidas: 0,
    certificados_emitidos: 0,
    alunos_com_lead: 0,
    avaliacoes_pendentes: 0,
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
        }}
      >
        <div className="tool-index">
          <div className="tool-index-title">Alunos cadastrados</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.total_alunos}</div>
        </div>
        <div className="tool-index">
          <div className="tool-index-title">Ativos (7 dias)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#22B5F2" }}>{kpis.ativos_7d}</div>
        </div>
        <div className="tool-index">
          <div className="tool-index-title">Aulas concluídas</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{kpis.total_concluidas}</div>
        </div>
        <div className="tool-index">
          <div className="tool-index-title">Certificados</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#22C55E" }}>
            {kpis.certificados_emitidos}
          </div>
        </div>
        <div className="tool-index">
          <div className="tool-index-title">Lead → Aluno</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#F5B544" }}>
            {kpis.alunos_com_lead}
          </div>
        </div>
        <div className="tool-index">
          <div className="tool-index-title">Avaliações pendentes</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#F97316" }}>
            {kpis.avaliacoes_pendentes}
          </div>
        </div>
      </div>

      {/* Busca & Atualizar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search
            size={15}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.6 }}
          />
          <input
            type="search"
            placeholder="Buscar aluno por nome, e-mail, cargo ou objetivo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.25)",
              background: "transparent",
              color: "inherit",
            }}
          />
        </div>
        <button
          type="button"
          className={`briefing-chip ${soPendentes ? "is-on" : ""}`}
          onClick={() => setSoPendentes((v) => !v)}
        >
          Somente pendentes ({kpis.avaliacoes_pendentes})
        </button>
        <button className="plink" onClick={carregar} disabled={carregando}>
          {carregando ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />} Atualizar
        </button>
      </div>

      {/* Lista de Alunos */}
      {filtrados.length === 0 ? (
        <div className="tool-index" style={{ padding: 28, textAlign: "center" }}>
          Nenhum aluno encontrado ainda.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtrados.map((a) => {
            const pct =
              totalAulasCurso > 0
                ? Math.min(100, Math.round((a.aulas_concluidas / totalAulasCurso) * 100))
                : 0;
            const aberto = selecionadoId === a.id;

            return (
              <div
                key={a.id}
                className="tool-index"
                style={{
                  padding: 16,
                  borderColor: aberto ? "rgba(34,181,242,0.5)" : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {a.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar_url}
                        alt={a.nome}
                        width={40}
                        height={40}
                        style={{ borderRadius: "999px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "999px",
                          background: "rgba(34,181,242,0.18)",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                        }}
                      >
                        {a.nome.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <strong>{a.nome_certificado || a.nome}</strong>
                        <span style={{ opacity: 0.7, fontSize: 13 }}>{a.email}</span>
                        {a.lead && (
                          <span
                            className="briefing-chip is-on"
                            style={{ fontSize: 11, padding: "2px 8px" }}
                            title={`Lead originado em ${a.lead.canal}`}
                          >
                            Lead: {a.lead.status} · {a.lead.canal}
                          </span>
                        )}
                        {a.certificados.length > 0 && (
                          <span
                            className="briefing-chip is-on"
                            style={{ fontSize: 11, padding: "2px 8px", borderColor: "#22C55E", color: "#22C55E" }}
                          >
                            <Award size={12} /> Certificado
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 3 }}>
                        {a.headline || a.objetivo || "Sem headline preenchida"} · Último acesso:{" "}
                        {dataCurta(a.ultimo_acesso_em)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ minWidth: 140 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                        {a.aulas_concluidas}/{totalAulasCurso} aulas ({pct}%)
                      </div>
                      <div
                        style={{
                          height: 5,
                          borderRadius: 999,
                          background: "rgba(148,163,184,0.2)",
                          marginTop: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ width: `${pct}%`, height: "100%", background: "#22B5F2" }} />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="plink"
                      onClick={() => setSelecionadoId(aberto ? null : a.id)}
                    >
                      {aberto ? "Fechar" : "Ver trilha"}
                    </button>
                  </div>
                </div>

                {/* Detalhe expandido do aluno */}
                {aberto && selecionado && (
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: "1px solid rgba(148,163,184,0.18)",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
                      <span>
                        <UserCheck size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                        <strong>Objetivo:</strong> {selecionado.objetivo || "—"}
                      </span>
                      {selecionado.github_url && (
                        <a href={selecionado.github_url} target="_blank" rel="noreferrer" className="plink">
                          GitHub <ExternalLink size={12} />
                        </a>
                      )}
                      {selecionado.linkedin_url && (
                        <a href={selecionado.linkedin_url} target="_blank" rel="noreferrer" className="plink">
                          LinkedIn <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    {selecionado.bio && (
                      <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>{selecionado.bio}</p>
                    )}

                    {/* Avaliação do Projeto Final + Envio por E-mail */}
                    {selecionado.avaliacao && (
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 8,
                          border: "1px solid rgba(34,181,242,0.3)",
                          background: "rgba(34,181,242,0.05)",
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                          <strong style={{ fontSize: 13 }}>
                            Projeto Final · Exame: {selecionado.avaliacao.nota_exame}%
                          </strong>
                          <span className="briefing-chip is-on" style={{ fontSize: 11, padding: "2px 8px" }}>
                            Status: {selecionado.avaliacao.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 13 }}>
                          <a href={selecionado.avaliacao.repo_url} target="_blank" rel="noreferrer" className="plink">
                            Repositório GitHub <ExternalLink size={12} />
                          </a>
                          {selecionado.avaliacao.deploy_url && (
                            <a href={selecionado.avaliacao.deploy_url} target="_blank" rel="noreferrer" className="plink">
                              Deploy em produção <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: 12.5, opacity: 0.9 }}>
                          <strong>Resumo do aluno:</strong> {selecionado.avaliacao.resumo_tecnico}
                        </p>
                        <textarea
                          rows={2}
                          placeholder="Parecer técnico do instrutor (enviado ao aluno / histórico)..."
                          value={pareceres[selecionado.id] ?? selecionado.avaliacao.parecer_avaliador ?? ""}
                          onChange={(e) =>
                            setPareceres((prev) => ({ ...prev, [selecionado.id]: e.target.value }))
                          }
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(148,163,184,0.25)",
                            background: "transparent",
                            color: "inherit",
                            fontSize: 12.5,
                          }}
                        />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="plink solid"
                            disabled={avaliandoId === selecionado.id}
                            onClick={() => avaliar(selecionado.id, selecionado.avaliacao!.curso_slug, "aprovado")}
                          >
                            {avaliandoId === selecionado.id ? "Processando..." : "Aprovar e Emitir Certificado"}
                          </button>
                          <button
                            type="button"
                            className="plink"
                            disabled={avaliandoId === selecionado.id}
                            onClick={() => avaliar(selecionado.id, selecionado.avaliacao!.curso_slug, "revisao_solicitada")}
                          >
                            Solicitar Revisão
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Certificados emitidos + Botão de envio por e-mail */}
                    {selecionado.certificados.length > 0 && (
                      <div style={{ display: "grid", gap: 6 }}>
                        {selecionado.certificados.map((c) => {
                          const certUrl = `https://www.maldivastech.dev/pt/certificado/${c.codigo}`;
                          const nomeAluno = selecionado.nome_certificado || selecionado.nome;
                          const parecerTxt = pareceres[selecionado.id] ?? selecionado.avaliacao?.parecer_avaliador ?? "";
                          const subject = encodeURIComponent(`Parabéns! Seu Certificado Oficial Maldivas Tech foi aprovado (${c.codigo})`);
                          const body = encodeURIComponent(
                            `Olá, ${nomeAluno}!\n\nAnalisei a sua entrega no projeto final e sua trilha no curso "Construa seu marketplace: do código ao pagamento em produção" (estudo de caso MySuperStore) e o seu trabalho foi APROVADO!\n\n${parecerTxt ? `Parecer do instrutor:\n${parecerTxt}\n\n` : ""}Acesse, imprima/salve em PDF e compartilhe no LinkedIn o seu certificado oficial verificável pelo link:\n${certUrl}\n\nCódigo verificador: ${c.codigo}\n\nParabéns pelos resultados!\nRafael Paiva Dias da Silva\nTecnólogo em Análise e Desenvolvimento de Sistemas (IFSP)\nFundador & Instrutor · Maldivas Tech`,
                          );
                          return (
                            <div
                              key={c.codigo}
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px 10px",
                                borderRadius: 8,
                                border: "1px solid rgba(34,197,94,0.35)",
                              }}
                            >
                              <span style={{ fontSize: 12.5 }}>
                                <strong>Certificado:</strong> <code>{c.codigo}</code> ({c.nota_final}%)
                              </span>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <button
                                  type="button"
                                  className="plink"
                                  onClick={() => {
                                    navigator.clipboard.writeText(certUrl).catch(() => undefined);
                                    setCopiadoCod(c.codigo);
                                    setTimeout(() => setCopiadoCod(null), 2000);
                                  }}
                                >
                                  {copiadoCod === c.codigo ? <Check size={12} /> : <Copy size={12} />}
                                  {copiadoCod === c.codigo ? "Copiado" : "Copiar link"}
                                </button>
                                <a href={`mailto:${selecionado.email}?subject=${subject}&body=${body}`} className="plink solid">
                                  <Mail size={12} /> Enviar por e-mail
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div>
                      <strong style={{ fontSize: 13 }}>Histórico na trilha:</strong>
                      {selecionado.progresso.length === 0 ? (
                        <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.7 }}>
                          Nenhuma aula registrada ainda.
                        </p>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                          {selecionado.progresso.map((p) => (
                            <span
                              key={`${p.curso_slug}-${p.licao_id}`}
                              className="briefing-chip"
                              style={{ fontSize: 12 }}
                            >
                              {p.licao_id} · {p.status === "concluida" ? "✓" : "…"}
                              {typeof p.nota_quiz === "number" ? ` (${p.nota_quiz}%)` : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

