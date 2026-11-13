"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Flame,
  GraduationCap,
  Loader2,
  LogIn,
  Mail,
  RefreshCw,
  Search,
  TrendingDown,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ESTAGIO_META,
  type AlunoTelemetria,
  type TelemetriaAlunosAdmin,
} from "@/app/lib/course-telemetry";

type FiltroCoorte =
  | "todos"
  | "login_7d"
  | "mantendo_frequencia"
  | "comecaram_nao_terminaram"
  | "em_risco"
  | "abandonaram"
  | "nunca_iniciaram"
  | "pendentes"
  | "concluidos";

type Ordenacao =
  | "ultimo_acesso"
  | "mais_inativo"
  | "maior_progresso"
  | "maior_frequencia"
  | "cadastro_recente";

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

function diasTexto(dias: number): string {
  if (dias === 0) return "hoje";
  if (dias === 1) return "há 1 dia";
  return `há ${dias} dias`;
}

function formatHours(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function csvEscape(v: string | number | null | undefined): string {
  const s = String(v ?? "");
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const tooltipStyle: React.CSSProperties = {
  background: "var(--bg-soft)",
  border: "1px solid var(--line-strong)",
  borderRadius: 10,
  color: "var(--fg)",
  fontSize: 12.5,
};

export default function AlunosPanel({ aoExpirar }: { aoExpirar: () => void }) {
  const [telemetria, setTelemetria] = useState<TelemetriaAlunosAdmin | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [coorte, setCoorte] = useState<FiltroCoorte>("todos");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("ultimo_acesso");
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [pareceres, setPareceres] = useState<Record<string, string>>({});
  const [avaliandoId, setAvaliandoId] = useState<string | null>(null);
  const [copiadoCod, setCopiadoCod] = useState<string | null>(null);
  const [mostrarGraficos, setMostrarGraficos] = useState(true);

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
      if (!json.ok || !json.telemetria) {
        setErro("Não foi possível carregar a telemetria dos alunos.");
      } else {
        setTelemetria(json.telemetria as TelemetriaAlunosAdmin);
      }
    } catch {
      setErro("Falha de conexão ao buscar telemetria dos alunos.");
    } finally {
      setCarregando(false);
    }
  }, [aoExpirar]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const lista = telemetria?.alunos ?? [];
    const q = busca.trim().toLowerCase();

    const filtered = lista.filter((a) => {
      if (coorte === "login_7d" && a.dias_sem_acesso > 7) return false;
      if (coorte === "mantendo_frequencia" && a.estagio !== "mantendo_frequencia") return false;
      if (coorte === "comecaram_nao_terminaram" && !a.começou_nao_terminou) return false;
      if (coorte === "em_risco" && a.estagio !== "em_risco") return false;
      if (
        coorte === "abandonaram" &&
        a.estagio !== "abandonou" &&
        a.estagio !== "abandonou_onboarding"
      ) {
        return false;
      }
      if (coorte === "nunca_iniciaram" && !a.nunca_iniciou) return false;
      if (coorte === "pendentes" && a.avaliacao?.status !== "pendente") return false;
      if (coorte === "concluidos" && a.estagio !== "concluido") return false;

      if (!q) return true;
      return (
        a.nome.toLowerCase().includes(q) ||
        a.nome_certificado.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.objetivo.toLowerCase().includes(q) ||
        (a.parou_em_licao?.title.toLowerCase().includes(q) ?? false)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (ordenacao) {
        case "mais_inativo":
          return b.dias_sem_atividade - a.dias_sem_atividade;
        case "maior_progresso":
          return b.percentual_conclusao - a.percentual_conclusao || b.aulas_concluidas_norm - a.aulas_concluidas_norm;
        case "maior_frequencia":
          return b.dias_ativos_14d - a.dias_ativos_14d || b.dias_ativos_total - a.dias_ativos_total;
        case "cadastro_recente":
          return Date.parse(b.criado_em) - Date.parse(a.criado_em);
        case "ultimo_acesso":
        default:
          return Date.parse(b.ultimo_acesso_em) - Date.parse(a.ultimo_acesso_em);
      }
    });
  }, [telemetria?.alunos, busca, coorte, ordenacao]);

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

  function exportarCsv() {
    if (!telemetria) return;
    const header = [
      "Nome",
      "Email",
      "Estagio",
      "Motivo_Estagio",
      "Aulas_Concluidas",
      "Total_Aulas",
      "Progresso_Pct",
      "Parou_Em",
      "Media_Quiz",
      "Dias_Ativos_Total",
      "Dias_Ativos_14d",
      "Aulas_7d",
      "Dias_Sem_Atividade",
      "Primeiro_Login",
      "Ultimo_Acesso",
      "Completude_Perfil_Pct",
      "Objetivo",
      "Lead_Canal",
      "Lead_Status",
    ].join(";");

    const rows = filtrados.map((a) =>
      [
        a.nome_certificado || a.nome,
        a.email,
        a.estagio_label,
        a.estagio_motivo,
        a.aulas_concluidas_norm,
        a.total_aulas,
        a.percentual_conclusao,
        a.parou_em_licao ? `${a.parou_em_licao.shortCode} - ${a.parou_em_licao.title}` : "Concluido",
        a.media_quiz ?? "",
        a.dias_ativos_total,
        a.dias_ativos_14d,
        a.aulas_7d,
        a.dias_sem_atividade,
        a.criado_em,
        a.ultimo_acesso_em,
        a.completude_perfil,
        a.objetivo,
        a.lead?.canal ?? "",
        a.lead?.status ?? "",
      ]
        .map(csvEscape)
        .join(";"),
    );

    const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `maldivas-telemetria-alunos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const selecionado: AlunoTelemetria | null = useMemo(
    () => filtrados.find((a) => a.id === selecionadoId) ?? null,
    [filtrados, selecionadoId],
  );

  if (carregando && !telemetria) {
    return (
      <div className="admin-panel-card" style={{ padding: 36, textAlign: "center" }}>
        <Loader2 size={20} className="spin" />{" "}
        <span style={{ marginLeft: 8 }}>Calculando telemetria de alunos e retenção...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="admin-panel-card" style={{ padding: 24 }}>
        <p className="result-warn">{erro}</p>
        <button className="plink" onClick={carregar} style={{ marginTop: 10 }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!telemetria) return null;

  const r = telemetria.resumo;

  const coortes: Array<{ id: FiltroCoorte; label: string; count: number }> = [
    { id: "todos", label: "Todos os logins", count: r.total_alunos },
    { id: "login_7d", label: "Login recente (7d)", count: r.ativos_7d },
    { id: "mantendo_frequencia", label: "Mantendo frequência", count: r.mantendo_frequencia },
    { id: "comecaram_nao_terminaram", label: "Começaram e não terminaram", count: r.comecaram_nao_terminaram },
    { id: "em_risco", label: "Em risco (8–21d)", count: r.em_risco },
    { id: "abandonaram", label: "Abandonaram (>21d / onb.)", count: r.abandonaram_total },
    { id: "nunca_iniciaram", label: "Só login · 0 aulas", count: r.nunca_iniciaram },
    { id: "pendentes", label: "Avaliação pendente", count: r.avaliacoes_pendentes },
    { id: "concluidos", label: "Concluídos / Certificados", count: r.concluidos },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* KPIs Executivos de Regras de Negócio LMS */}
      <section className="admin-kpi-grid" aria-label="Indicadores executivos dos alunos">
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Logins Google</span>
            <LogIn size={14} aria-hidden="true" />
          </div>
          <div className="admin-kpi-value">{r.total_alunos}</div>
          <div className="admin-kpi-sub">
            +{r.novos_7d} novos em 7d · {r.logins_24h} acessos nas últimas 24h
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Mantendo frequência</span>
            <Flame size={14} color="#22C55E" aria-hidden="true" />
          </div>
          <div className="admin-kpi-value" style={{ color: "#22C55E" }}>
            {r.mantendo_frequencia}
          </div>
          <div className="admin-kpi-sub">
            {r.ativos_esporadicos} ativo(s) recente(s) · {r.ativos_7d} no total (7d)
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Começaram e não terminaram</span>
            <Activity size={14} color="#22B5F2" aria-hidden="true" />
          </div>
          <div className="admin-kpi-value" style={{ color: "#22B5F2" }}>
            {r.comecaram_nao_terminaram}
          </div>
          <div className="admin-kpi-sub">
            Ativação: {r.taxa_ativacao_pct}% · {r.nunca_iniciaram} nunca iniciaram
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Em risco &amp; Abandono</span>
            <TrendingDown size={14} color="#EF4444" aria-hidden="true" />
          </div>
          <div className="admin-kpi-value" style={{ color: r.abandonaram_total > 0 ? "#EF4444" : "#F59E0B" }}>
            {r.em_risco + r.abandonaram_total}
          </div>
          <div className="admin-kpi-sub">
            {r.em_risco} em risco (8–21d) · {r.abandonaram_trilha} trilha · {r.abandonaram_onboarding} onb.
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Progresso &amp; Quiz médio</span>
            <GraduationCap size={14} aria-hidden="true" />
          </div>
          <div className="admin-kpi-value">{r.media_conclusao_pct}%</div>
          <div className="admin-kpi-sub">
            Quiz médio: {r.media_quiz_global !== null ? `${r.media_quiz_global}%` : "—"} · {r.total_concluidas} aulas
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-label">
            <span>Certificados &amp; Funil</span>
            <Award size={14} color="#F5B544" aria-hidden="true" />
          </div>
          <div className="admin-kpi-value">{r.certificados_emitidos}</div>
          <div className="admin-kpi-sub">
            {r.avaliacoes_pendentes} aval. pendentes · {r.alunos_com_lead} vieram de leads
          </div>
        </div>
      </section>

      {/* Controles de visualização */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)" }}>
          Regras: <strong>Mantendo frequência</strong> (ativo ≤7d + ≥2 dias/aulas) ·{" "}
          <strong>Em risco</strong> (8–21d sem estudar) ·{" "}
          <strong>Abandonou</strong> (&gt;21d sem atividade ou &gt;7d só com login)
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="plink"
            onClick={() => setMostrarGraficos((v) => !v)}
          >
            {mostrarGraficos ? "Ocultar gráficos" : "Mostrar gráficos"}
          </button>
          <button type="button" className="plink" onClick={exportarCsv} disabled={filtrados.length === 0}>
            <Download size={14} /> Exportar CSV ({filtrados.length})
          </button>
          <button type="button" className="plink" onClick={carregar} disabled={carregando}>
            {carregando ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />} Atualizar
          </button>
        </div>
      </div>

      {/* Gráficos de Telemetria LMS */}
      {mostrarGraficos && (
        <section className="admin-charts-grid" aria-label="Gráficos de telemetria">
          {/* 1. Série temporal de logins & aulas */}
          <div className="admin-panel-card">
            <h3 style={{ fontSize: 15.5, margin: 0 }}>Logins, Frequência &amp; Aulas (30 dias)</h3>
            <p className="field-hint" style={{ margin: "3px 0 12px" }}>
              Novas contas Google, alunos ativos por dia e aulas concluídas diariamente.
            </p>
            <div style={{ width: "100%", height: 230 }}>
              <ResponsiveContainer>
                <LineChart data={telemetria.serie_diaria_30d} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(134, 150, 174, 0.2)" strokeDasharray="3 3" />
                  <XAxis dataKey="rotulo" tick={{ fontSize: 11, fill: "#8696AE" }} minTickGap={16} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8696AE" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="acessos_ativos"
                    name="Alunos ativos"
                    stroke="#22B5F2"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="aulas_concluidas"
                    name="Aulas concluídas"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="novos_logins"
                    name="Novos logins"
                    stroke="#F5B544"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Funil da Jornada do Aluno */}
          <div className="admin-panel-card">
            <h3 style={{ fontSize: 15.5, margin: 0 }}>Funil de Retenção da Jornada</h3>
            <p className="field-hint" style={{ margin: "3px 0 14px" }}>
              Conversão do primeiro login Google até a conclusão e emissão do certificado.
            </p>
            <div style={{ display: "grid", gap: 11 }}>
              {telemetria.funil_jornada.map((step) => (
                <div key={step.etapa} className="admin-funnel-row">
                  <span style={{ fontWeight: 600, color: "var(--fg)" }}>{step.etapa}</span>
                  <div className="admin-funnel-track">
                    <div
                      className="admin-funnel-fill"
                      style={{ width: `${Math.max(step.alunos > 0 ? 4 : 0, step.pct_total)}%` }}
                    />
                  </div>
                  <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, minWidth: 68, textAlign: "right" }}>
                    {step.alunos} ({step.pct_total}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Gargalo por Aula (Onde os alunos param) */}
          <div className="admin-panel-card" style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: 15.5, margin: 0 }}>
              Mapa de Retenção &amp; Gargalo por Aula (F01 → Projeto Final)
            </h3>
            <p className="field-hint" style={{ margin: "3px 0 12px" }}>
              Quantos alunos concluíram cada aula vs. quantos estão atualmente parados ou abandonaram exatamente nessa etapa.
            </p>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={telemetria.gargalo_aulas} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(134, 150, 174, 0.2)" strokeDasharray="3 3" />
                  <XAxis dataKey="shortCode" tick={{ fontSize: 11, fill: "#8696AE" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8696AE" }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(label, payload) => {
                      const row = payload?.[0]?.payload as { title?: string } | undefined;
                      return row?.title || String(label);
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="concluidas" name="Concluíram" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="parados_aqui" name="Parados nesta aula" fill="#22B5F2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="abandono_aqui" name="Em risco / Abandono aqui" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Barra de Coortes (Segmentação de Regra de Negócio) */}
      <section className="admin-panel-card" style={{ display: "grid", gap: 14 }}>
        <div className="admin-cohort-strip" role="tablist" aria-label="Coortes de alunos">
          {coortes.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={coorte === c.id}
              className={`admin-cohort-pill ${coorte === c.id ? "is-on" : ""}`}
              onClick={() => setCoorte(c.id)}
            >
              <span>{c.label}</span>
              <span className="admin-cohort-count">{c.count}</span>
            </button>
          ))}
        </div>

        {/* Busca + Ordenação */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.6,
              }}
            />
            <input
              type="search"
              placeholder="Buscar por nome, e-mail, cargo, objetivo ou aula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                borderRadius: 10,
                border: "1px solid var(--line-strong)",
                background: "var(--surface)",
                color: "var(--fg)",
                fontSize: 14,
              }}
            />
          </div>

          <select
            aria-label="Ordenar alunos"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid var(--line-strong)",
              background: "var(--surface)",
              color: "var(--fg)",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            <option value="ultimo_acesso">Ordenar: Último login / acesso</option>
            <option value="mais_inativo">Ordenar: Mais dias sem atividade (risco)</option>
            <option value="maior_progresso">Ordenar: Maior progresso (%)</option>
            <option value="maior_frequencia">Ordenar: Maior frequência (dias ativos)</option>
            <option value="cadastro_recente">Ordenar: 1º login mais recente</option>
          </select>
        </div>
      </section>

      {/* Lista de Alunos + Dossiê */}
      {filtrados.length === 0 ? (
        <div className="admin-panel-card" style={{ padding: 32, textAlign: "center" }}>
          Nenhum aluno corresponde aos filtros selecionados.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtrados.map((a) => {
            const aberto = selecionadoId === a.id;
            const meta = ESTAGIO_META[a.estagio];
            const precisaReengajar =
              a.estagio === "em_risco" ||
              a.estagio === "abandonou" ||
              a.estagio === "abandonou_onboarding";

            const reengajarSubject = encodeURIComponent(
              a.parou_em_licao
                ? `Continue sua trilha na aula ${a.parou_em_licao.shortCode} · Maldivas Tech`
                : "Comece sua primeira aula no curso de Marketplace · Maldivas Tech",
            );
            const reengajarBody = encodeURIComponent(
              `Olá, ${a.nome_certificado || a.nome}!\n\n` +
                (a.parou_em_licao
                  ? `Vi que você já concluiu ${a.aulas_concluidas_norm} de ${a.total_aulas} aulas no curso "Construa seu marketplace" e parou em "${a.parou_em_licao.title}".\n\nRetome direto de onde parou:\nhttps://www.maldivastech.dev/pt/cursos/construa-seu-marketplace/${a.parou_em_licao.slug}\n\n`
                  : `Vi que você criou sua conta na Área do Aluno da Maldivas Tech, mas ainda não iniciou a primeira aula.\n\nComece pela aula F01 (100% gratuita):\nhttps://www.maldivastech.dev/pt/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa\n\n`) +
                `Se tiver qualquer dúvida técnica no caminho, pode responder este e-mail!\n\nAbraço,\nRafael Maldivas`,
            );

            return (
              <div
                key={a.id}
                className={`admin-student-card ${aberto ? "is-open" : ""}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: "1 1 320px" }}>
                    {a.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar_url}
                        alt={a.nome}
                        width={42}
                        height={42}
                        style={{ borderRadius: "999px", objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "999px",
                          background: "var(--accent-glow)",
                          color: "var(--accent)",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {a.nome.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <strong style={{ fontSize: 15 }}>{a.nome_certificado || a.nome}</strong>
                        <span style={{ color: "var(--fg-dim)", fontSize: 13 }}>{a.email}</span>
                        <span className={`admin-stage-badge is-${meta.tone}`} title={meta.descricaoRegra}>
                          {a.estagio_label}
                        </span>
                        {a.lead && (
                          <span
                            className="admin-stage-badge is-amber"
                            title={`Lead originado em ${a.lead.canal}`}
                          >
                            Lead: {a.lead.status} · {a.lead.canal}
                          </span>
                        )}
                        {a.certificados.length > 0 && (
                          <span className="admin-stage-badge is-green">
                            <Award size={12} /> Certificado
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12.5, color: "var(--fg-muted)", marginTop: 4 }}>
                        {a.estagio_motivo}
                        {a.parou_em_licao ? ` · Próxima: ${a.parou_em_licao.shortCode}` : ""}
                        {` · ${a.dias_ativos_total}d ativo(s)`}
                        {a.media_quiz !== null ? ` · Quiz: ${a.media_quiz}%` : ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 165 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}>
                        <span>
                          {a.aulas_concluidas_norm}/{a.total_aulas} aulas ({a.percentual_conclusao}%)
                        </span>
                        <span style={{ color: "var(--fg-dim)", fontWeight: 500 }}>
                          {diasTexto(a.dias_sem_acesso)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: "var(--surface-2)",
                          marginTop: 5,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${a.percentual_conclusao}%`,
                            height: "100%",
                            background:
                              a.estagio === "abandonou" || a.estagio === "abandonou_onboarding"
                                ? "#EF4444"
                                : a.estagio === "em_risco"
                                  ? "#F59E0B"
                                  : a.percentual_conclusao === 100
                                    ? "#22C55E"
                                    : "#22B5F2",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="plink"
                      onClick={() => setSelecionadoId(aberto ? null : a.id)}
                    >
                      {aberto ? "Fechar" : "Ver dossiê"}
                    </button>
                  </div>
                </div>

                {/* Dossiê Completo do Aluno */}
                {aberto && selecionado && (
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: "1px solid var(--line-strong)",
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    {/* Métricas de Login & Cadência */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 10,
                      }}
                    >
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          1º Login Google
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>
                          {dataCurta(selecionado.criado_em)}
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          Último Acesso
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>
                          {dataCurta(selecionado.ultimo_acesso_em)}
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          Frequência (14d / Total)
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>
                          {selecionado.dias_ativos_14d}d / {selecionado.dias_ativos_total}d ativos
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          Ritmo &amp; Horas Estudadas
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>
                          {selecionado.ritmo_semanal} aulas/sem · {formatHours(selecionado.tempo_estudado_min)}
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          Onde Parou
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>
                          {selecionado.parou_em_licao
                            ? `${selecionado.parou_em_licao.shortCode} (Mód. ${selecionado.parou_em_licao.moduleNumber})`
                            : "Curso concluído"}
                        </div>
                      </div>
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                        <div style={{ fontSize: 11, color: "var(--fg-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                          Perfil do Aluno
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 3 }}>
                          {selecionado.completude_perfil}% preenchido
                        </div>
                      </div>
                    </div>

                    {/* Links, Objetivo & Reengajamento */}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", fontSize: 13 }}>
                      <span>
                        <UserCheck size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                        <strong>Objetivo:</strong> {selecionado.objetivo || "—"}
                      </span>
                      {selecionado.headline && (
                        <span style={{ color: "var(--fg-muted)" }}>
                          <strong>Cargo:</strong> {selecionado.headline}
                        </span>
                      )}
                      {selecionado.github_url && (
                        <a href={selecionado.github_url} target="_blank" rel="noreferrer" className="plink" style={{ padding: "5px 10px", fontSize: 12.5 }}>
                          GitHub <ExternalLink size={12} />
                        </a>
                      )}
                      {selecionado.linkedin_url && (
                        <a href={selecionado.linkedin_url} target="_blank" rel="noreferrer" className="plink" style={{ padding: "5px 10px", fontSize: 12.5 }}>
                          LinkedIn <ExternalLink size={12} />
                        </a>
                      )}
                      {precisaReengajar && (
                        <a
                          href={`mailto:${selecionado.email}?subject=${reengajarSubject}&body=${reengajarBody}`}
                          className="plink solid"
                          style={{ padding: "6px 12px", fontSize: 12.5, marginLeft: "auto" }}
                        >
                          <AlertTriangle size={13} /> Enviar e-mail de retomada
                        </a>
                      )}
                    </div>

                    {selecionado.bio && (
                      <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)" }}>{selecionado.bio}</p>
                    )}

                    {/* Avaliação do Projeto Final + Envio por E-mail */}
                    {selecionado.avaliacao && (
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 10,
                          border: "1px solid rgba(34,181,242,0.35)",
                          background: "rgba(34,181,242,0.06)",
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                          <strong style={{ fontSize: 13.5 }}>
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
                            borderRadius: 8,
                            border: "1px solid var(--line-strong)",
                            background: "var(--surface)",
                            color: "var(--fg)",
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
                          const subject = encodeURIComponent(
                            `Parabéns! Seu Certificado Oficial Maldivas Tech foi aprovado (${c.codigo})`,
                          );
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
                                padding: "8px 12px",
                                borderRadius: 10,
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

                    {/* Matriz Visual das 18 Aulas do Currículo */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <strong style={{ fontSize: 13 }}>
                          Mapa Completo da Trilha ({selecionado.aulas_concluidas_norm}/{selecionado.total_aulas} concluídas)
                        </strong>
                        <span style={{ fontSize: 11.5, color: "var(--fg-dim)" }}>
                          Verde = concluída · Azul = em andamento · Cinza = pendente
                        </span>
                      </div>
                      <div className="admin-lesson-matrix">
                        {selecionado.licoes_mapa.map((l) => (
                          <div
                            key={l.id}
                            className={`admin-lesson-cell ${
                              l.status === "concluida"
                                ? "is-done"
                                : l.status === "em_andamento"
                                  ? "is-wip"
                                  : ""
                            }`}
                            title={`${l.title}${l.atualizado_em ? ` (${dataCurta(l.concluido_em || l.atualizado_em)})` : ""}`}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                              <strong>{l.shortCode}</strong>
                              {l.status === "concluida" ? (
                                <CheckCircle2 size={12} color="#22C55E" aria-hidden="true" />
                              ) : l.status === "em_andamento" ? (
                                <Clock size={12} color="#22B5F2" aria-hidden="true" />
                              ) : (
                                <Users size={11} style={{ opacity: 0.35 }} aria-hidden="true" />
                              )}
                            </div>
                            <span style={{ color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Mód. {l.moduleNumber}
                              {typeof l.nota_quiz === "number" ? ` · ${l.nota_quiz}%` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
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
