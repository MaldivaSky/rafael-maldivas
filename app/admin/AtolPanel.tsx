"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";

/**
 * Aba "Atol Connect" do /admin: administração de todas as empresas da plataforma
 * WhatsApp (dados vêm de /api/admin/atol, que fala com a Atol Connect servidor a servidor).
 */

type Overview = {
  period: string;
  mrr_cents: number;
  customers: { active: number; trial: number; past_due: number; suspended: number; canceled: number };
  internal_orgs: number;
  numbers_connected: number;
  usage: { messages_sent: number; messages_received: number; api_requests: number };
  health: { meta_events_24h: number; meta_errors_24h: number; failed_messages_24h: number; failed_webhooks_total: number };
};
type Org = {
  id: string; name: string; legal_name: string | null; tax_id: string | null; plan_id: string; status: string; is_internal: boolean;
  trial_ends_at: string | null; created_at: string; owner_email: string | null; users: number; numbers: string[]; messages_month: number;
};

const PLANOS: [string, string][] = [["starter", "Start"], ["growth", "Pro"], ["scale", "Business"], ["partner", "Parceiro"], ["internal", "Interno"]];
const SITUACOES: [string, string][] = [["trial", "Teste"], ["active", "Ativa"], ["past_due", "Inadimplente"], ["suspended", "Suspensa"], ["canceled", "Cancelada"]];
const COR: Record<string, string> = { active: "#25d366", trial: "#22b5f2", past_due: "#ffb547", suspended: "#ff5c7a", canceled: "#8a94a6" };

const cartao: React.CSSProperties = { border: "1px solid var(--line-strong)", borderRadius: 14, padding: 18, background: "var(--bg-soft)" };
const brl = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const n = (v: number) => v.toLocaleString("pt-BR");

function Indicador({ rotulo, valor, alerta }: { rotulo: string; valor: string; alerta?: boolean }) {
  return (
    <div style={cartao}>
      <div className="field-hint" style={{ textTransform: "uppercase", letterSpacing: ".06em", fontSize: 12 }}>{rotulo}</div>
      <div style={{ fontSize: 28, fontWeight: 700, margin: "6px 0 0", color: alerta ? "#ff5c7a" : "var(--fg)" }}>{valor}</div>
    </div>
  );
}

export default function AtolPanel({ aoExpirar }: { aoExpirar: () => void }) {
  const [dados, setDados] = useState<{ overview: Overview; orgs: Org[] } | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [salvando, setSalvando] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const qs = new URLSearchParams();
      if (busca.trim()) qs.set("q", busca.trim());
      if (situacao) qs.set("status", situacao);
      const r = await fetch(`/api/admin/atol?${qs}`, { cache: "no-store" });
      if (r.status === 401) return aoExpirar();
      const d = await r.json();
      if (!d.ok) setErro(d.reason === "not_configured" ? "Integração não configurada (ATOL_PLATFORM_TOKEN)." : "A Atol Connect não respondeu. Tente de novo.");
      else setDados({ overview: d.overview, orgs: d.orgs });
    } catch {
      setErro("Falha de rede ao consultar a Atol Connect.");
    } finally {
      setCarregando(false);
    }
  }, [busca, situacao, aoExpirar]);

  useEffect(() => { void carregar(); }, [situacao]); // eslint-disable-line react-hooks/exhaustive-deps

  async function alterar(org: Org, corpo: Record<string, unknown>, confirmar?: string) {
    if (confirmar && !confirm(confirmar)) return;
    setSalvando(org.id);
    const r = await fetch(`/api/admin/atol/orgs/${org.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
    setSalvando(null);
    if (r.status === 401) return aoExpirar();
    if (!r.ok) setErro((await r.json().catch(() => ({})))?.error?.message ?? "Não foi possível alterar.");
    await carregar();
  }

  const ov = dados?.overview;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
        <form onSubmit={(e) => { e.preventDefault(); void carregar(); }} style={{ display: "flex", gap: 8 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar empresa" style={{ minWidth: 240, fontSize: 14, padding: "8px 12px" }} />
          </div>
          <button className="plink" type="submit"><Search size={15} /> Buscar</button>
        </form>
        <div className="briefing-chips" style={{ margin: 0 }} role="group" aria-label="Situação">
          {[["", "Todas"], ...SITUACOES].map(([id, nome]) => (
            <button key={id} className={`briefing-chip ${situacao === id ? "is-on" : ""}`} onClick={() => setSituacao(id)}>{nome}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button className="plink" onClick={carregar} disabled={carregando}>
            {carregando ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />} Atualizar
          </button>
          <a className="plink" href="https://connect.maldivastech.dev" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Abrir Atol Connect</a>
        </div>
      </div>

      {erro && <p className="field-hint result-warn" style={{ marginBottom: 16 }}>{erro}</p>}
      {!dados && carregando && <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Loader2 className="spin" size={20} /> Carregando…</div>}

      {ov && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 14 }}>
            <Indicador rotulo="MRR" valor={brl(ov.mrr_cents)} />
            <Indicador rotulo="Clientes ativos" valor={n(ov.customers.active)} />
            <Indicador rotulo="Em teste" valor={n(ov.customers.trial)} />
            <Indicador rotulo="Inadimplentes" valor={n(ov.customers.past_due)} alerta={ov.customers.past_due > 0} />
            <Indicador rotulo="Números conectados" valor={n(ov.numbers_connected)} />
            <Indicador rotulo="SaaS internos" valor={n(ov.internal_orgs)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
            <Indicador rotulo="Mensagens enviadas (mês)" valor={n(ov.usage.messages_sent)} />
            <Indicador rotulo="Mensagens recebidas (mês)" valor={n(ov.usage.messages_received)} />
            <Indicador rotulo="Chamadas de API (mês)" valor={n(ov.usage.api_requests)} />
            <Indicador rotulo="Eventos Meta 24h · erros" valor={`${n(ov.health.meta_events_24h)} · ${n(ov.health.meta_errors_24h)}`} alerta={ov.health.meta_errors_24h > 0} />
            <Indicador rotulo="Mensagens com falha 24h" valor={n(ov.health.failed_messages_24h)} alerta={ov.health.failed_messages_24h > 0} />
            <Indicador rotulo="Webhooks esgotados" valor={n(ov.health.failed_webhooks_total)} alerta={ov.health.failed_webhooks_total > 0} />
          </div>
        </>
      )}

      {dados && (
        <section style={cartao}>
          <h3 style={{ fontSize: 16, margin: "0 0 12px" }}>Empresas ({dados.orgs.length})</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr className="field-hint" style={{ textAlign: "left" }}>
                  {["Empresa", "Proprietário", "WhatsApp", "Uso no mês", "Plano", "Situação", "Teste até", ""].map((h) => (
                    <th key={h} style={{ padding: "8px 10px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.orgs.length === 0 && <tr><td colSpan={8} className="field-hint" style={{ padding: 12 }}>Nenhuma empresa encontrada.</td></tr>}
                {dados.orgs.map((o) => (
                  <tr key={o.id} style={{ borderTop: "1px solid var(--line-strong)", opacity: salvando === o.id ? 0.5 : 1 }}>
                    <td style={{ padding: "10px" }}>
                      <strong>{o.name}</strong>
                      {o.is_internal && <span className="field-hint" style={{ marginLeft: 6, fontSize: 11, border: "1px solid var(--line-strong)", borderRadius: 999, padding: "1px 7px" }}>interna</span>}
                      <div className="field-hint" style={{ fontSize: 12 }}>{o.tax_id ?? "sem CNPJ"} · desde {new Date(o.created_at).toLocaleDateString("pt-BR")}</div>
                    </td>
                    <td style={{ padding: "10px", fontSize: 13 }}>{o.owner_email ?? "—"}<div className="field-hint" style={{ fontSize: 12 }}>{o.users} usuário(s)</div></td>
                    <td style={{ padding: "10px", fontSize: 13 }}>{o.numbers.length ? o.numbers.join(", ") : "—"}</td>
                    <td style={{ padding: "10px", fontSize: 13 }}>{n(o.messages_month)} msgs</td>
                    <td style={{ padding: "10px" }}>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <select value={o.plan_id} disabled={!!salvando} onChange={(e) => alterar(o, { plan_id: e.target.value })} style={{ fontSize: 14, padding: "8px 10px" }}>
                          {PLANOS.map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
                        </select>
                      </div>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <div className="field" style={{ marginBottom: 0 }}>
                      <select value={o.status} disabled={!!salvando} style={{ color: COR[o.status], fontSize: 14, padding: "8px 10px" }}
                        onChange={(e) => alterar(o, { status: e.target.value }, ["suspended", "canceled"].includes(e.target.value) ? `Mudar ${o.name} para "${e.target.value}"? A empresa para de enviar mensagens.` : undefined)}>
                        {SITUACOES.map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
                      </select>
                      </div>
                    </td>
                    <td style={{ padding: "10px", fontSize: 13 }}>{o.trial_ends_at ? new Date(o.trial_ends_at).toLocaleDateString("pt-BR") : "—"}</td>
                    <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                      <button className="plink" disabled={!!salvando} onClick={() => alterar(o, { extend_trial_days: 14 })}>+14 dias</button>{" "}
                      <button className="plink" disabled={!!salvando}
                        onClick={() => alterar(o, { is_internal: !o.is_internal }, o.is_internal ? undefined : `Marcar ${o.name} como SaaS interno (sem cobrança e sem limites)?`)}>
                        {o.is_internal ? "Tirar de interna" : "Marcar interna"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <p className="field-hint" style={{ marginTop: 16 }}>
        Toda alteração feita aqui fica registrada na auditoria da empresa na Atol Connect. As tarifas da Meta não passam pela plataforma.
      </p>
    </div>
  );
}
