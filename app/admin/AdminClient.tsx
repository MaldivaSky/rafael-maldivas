"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  RefreshCw,
  Search,
} from "lucide-react";

/**
 * Painel de leads. Os dados vêm do Notion (via /api/leads), que é usado
 * só como banco. O token do Notion mora no servidor — nunca aqui.
 *
 * A senha é enviada no header `x-admin-key`. No localStorage fica apenas
 * um marcador de sessão, nunca a senha.
 */

type Lead = {
  id: string;
  nome: string;
  status: string;
  area: string;
  prazo: string;
  servicos: string[];
  contato: string;
  negocio: string;
  dor: string;
  idioma: string;
  canal: string;
  criadoEm: string;
  url: string;
};

const KEY = "maldivas_admin_key";
const TOKEN = "maldivas_admin_ok"; // marcador de sessão (não é a senha)

const AREAS = ["Todas", "Software", "TI", "Marketing", "Audiovisual", "Múltiplas", "Indefinido"];

const STATUS_COR: Record<string, string> = {
  Novo: "#22B5F2",
  "Em contato": "#7C8CF8",
  "Proposta enviada": "#F5B544",
  Ganho: "#22C55E",
  Perdido: "#EF4444",
  Descartado: "#6B7A93",
};

function soNumeros(t: string) {
  return (t.match(/\d/g) ?? []).join("");
}

function dataCurta(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export default function AdminClient() {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [filtroArea, setFiltroArea] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  // sessão: se já logou antes, pula o login
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(TOKEN) === "1") {
      setLogado(true);
    }
  }, []);

  const carregar = useCallback(async () => {
    const key = typeof window !== "undefined" ? localStorage.getItem(KEY) ?? "" : "";
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/leads", { headers: { "x-admin-key": key } });
      if (r.status === 401) {
        localStorage.removeItem(TOKEN);
        setLogado(false);
        setErro("Sessão expirada. Entre de novo.");
        return;
      }
      const d = await r.json();
      if (d.ok) {
        setLeads(d.leads);
        setStatuses(d.statuses ?? []);
      } else {
        setErro("Não consegui ler os leads agora.");
      }
    } catch {
      setErro("Falha de rede ao ler os leads.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (logado) carregar();
  }, [logado, carregar]);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/leads", { headers: { "x-admin-key": senha } });
      const d = await r.json();
      if (d.ok) {
        localStorage.setItem(KEY, senha);
        localStorage.setItem(TOKEN, "1");
        setLeads(d.leads);
        setStatuses(d.statuses ?? []);
        setLogado(true);
      } else {
        setErro("Senha incorreta.");
      }
    } catch {
      setErro("Falha de rede. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  };

  const sair = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN);
    setLogado(false);
    setSenha("");
    setLeads([]);
  };

  const mudarStatus = async (lead: Lead, novo: string) => {
    setSalvandoId(lead.id);
    const key = localStorage.getItem(KEY) ?? "";
    // otimista: atualiza a tela antes da resposta
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: novo } : l)));
    try {
      const r = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: lead.id, status: novo }),
      });
      const d = await r.json();
      if (!d.ok) carregar();
    } catch {
      carregar();
    } finally {
      setSalvandoId(null);
    }
  };

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return leads.filter((l) => {
      if (filtroArea !== "Todas" && l.area !== filtroArea) return false;
      if (!q) return true;
      return (
        l.nome.toLowerCase().includes(q) ||
        l.negocio.toLowerCase().includes(q) ||
        l.dor.toLowerCase().includes(q) ||
        l.contato.toLowerCase().includes(q)
      );
    });
  }, [leads, filtroArea, busca]);

  const porStatus = useMemo(() => {
    const lista = statuses.length ? statuses : ["Novo", "Em contato", "Proposta enviada", "Ganho", "Perdido"];
    return lista.map((s) => ({ status: s, itens: filtrados.filter((l) => l.status === s) }));
  }, [statuses, filtrados]);

  /* ---------------- tela de login ---------------- */
  if (!logado) {
    return (
      <section className="hero" style={{ paddingBottom: 80 }}>
        <div className="wrap" style={{ maxWidth: 520 }}>
          <div className="sec-tag">Painel · uso interno</div>
          <h1 style={{ fontSize: 40 }}>
            Seu <span className="hl">funil de leads</span>.
          </h1>
          <p className="hero-lead" style={{ fontSize: 18 }}>
            Entre para ver os pedidos que chegaram pelo site, já por área e status.
          </p>

          <form className="briefing-form" onSubmit={entrar} style={{ marginTop: 24 }}>
            <div className="field">
              <label htmlFor="a-senha">Senha de administrador</label>
              <input
                id="a-senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoFocus
                autoComplete="current-password"
              />
            </div>
            {erro && <p className="field-hint result-warn">{erro}</p>}
            <button className="plink solid" type="submit" disabled={carregando} style={{ marginTop: 8 }}>
              {carregando ? <Loader2 size={16} className="spin" /> : <ArrowLeft size={16} />} Ver os leads
            </button>
          </form>
        </div>
      </section>
    );
  }

  /* ---------------- painel ---------------- */
  return (
    <section style={{ padding: "40px 0 80px" }}>
      <div className="wrap">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <div className="sec-tag" style={{ marginBottom: 6 }}>Painel · uso interno</div>
            <h2 style={{ marginBottom: 0 }}>Leads</h2>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <button className="plink" onClick={carregar} disabled={carregando}>
              {carregando ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />} Atualizar
            </button>
            <button className="plink" onClick={sair}>
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>

        {/* filtros */}
        <div className="tool-index" style={{ marginBottom: 24 }}>
          <div className="tool-index-title">Filtrar</div>
          <div className="briefing-chips" style={{ marginBottom: 14 }}>
            {AREAS.map((a) => (
              <button
                key={a}
                className={`briefing-chip ${filtroArea === a ? "is-on" : ""}`}
                onClick={() => setFiltroArea(a)}
              >
                {filtroArea === a && <Check size={13} />}
                {a}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, negócio, dor ou contato…"
            />
          </div>
        </div>

        {erro && <p className="field-hint result-warn" style={{ marginBottom: 16 }}>{erro}</p>}

        {filtrados.length === 0 && !carregando ? (
          <div className="contact-box" style={{ textAlign: "left" }}>
            <h3 style={{ marginBottom: 8 }}>Nenhum lead {filtroArea !== "Todas" ? `em ${filtroArea}` : ""} ainda.</h3>
            <p className="sec-lead" style={{ marginBottom: 0, fontSize: 16 }}>
              Quando alguém enviar o formulário do site, o card aparece aqui automaticamente.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              alignItems: "start",
            }}
          >
            {porStatus.map(({ status, itens }) => (
              <div key={status} className="plate" style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: STATUS_COR[status] ?? "var(--accent)",
                    }}
                  />
                  <strong style={{ fontSize: 15 }}>{status}</strong>
                  <span className="field-hint" style={{ marginLeft: "auto" }}>{itens.length}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {itens.map((l) => (
                    <article
                      key={l.id}
                      style={{
                        border: "1px solid var(--line-strong)",
                        borderRadius: 12,
                        padding: 14,
                        background: "var(--bg-soft)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        <strong style={{ fontSize: 15 }}>{l.nome}</strong>
                        <span className="field-hint" style={{ marginLeft: "auto" }}>{dataCurta(l.criadoEm)}</span>
                      </div>
                      {l.negocio && (
                        <div className="field-hint" style={{ marginTop: 2 }}>{l.negocio}</div>
                      )}
                      {l.area && l.area !== "Indefinido" && (
                        <span className="tag" style={{ marginTop: 8, display: "inline-flex" }}>{l.area}</span>
                      )}
                      <p style={{ fontSize: 13.5, color: "var(--fg-muted)", margin: "10px 0", lineHeight: 1.5 }}>
                        {l.dor}
                      </p>
                      {l.servicos.length > 0 && (
                        <div className="field-hint" style={{ marginBottom: 10 }}>
                          {l.servicos.join(" · ")}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                        {soNumeros(l.contato).length >= 10 && (
                          <a
                            className="plink"
                            style={{ padding: "7px 12px", fontSize: 13 }}
                            href={`https://wa.me/55${soNumeros(l.contato)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                        )}
                        {l.contato.includes("@") && (
                          <a
                            className="plink"
                            style={{ padding: "7px 12px", fontSize: 13 }}
                            href={`mailto:${l.contato}`}
                          >
                            <Mail size={14} /> E-mail
                          </a>
                        )}
                      </div>

                      <div className="field" style={{ marginBottom: 0 }}>
                        <select
                          value={l.status}
                          onChange={(e) => mudarStatus(l, e.target.value)}
                          disabled={salvandoId === l.id}
                          style={{ fontSize: 14, padding: "8px 10px" }}
                        >
                          {(statuses.length ? statuses : [l.status]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </article>
                  ))}
                  {itens.length === 0 && (
                    <span className="field-hint" style={{ fontSize: 13 }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="field-hint" style={{ marginTop: 28 }}>
          Os dados vivem no Notion (usado apenas como banco). Para mudar de <em>status</em> aqui
          já atualiza lá também. Você pode arrastar os cards no próprio Notion se preferir.
        </p>
      </div>
    </section>
  );
}
