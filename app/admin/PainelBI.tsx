"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Loader2, RefreshCw } from "lucide-react";

/**
 * Painel BI do /admin. Todos os números vêm prontos de /api/painel (função
 * site.painel no banco). Conta SESSÕES (uma por aba aberta), não pessoas:
 * não há cookie nem ID persistente. Onde não há dado, mostra "—".
 */

type Kpi = {
  sessoes: number;
  paginas: number;
  leads: number;
  rejeitaram: number;
  segundos_medio: number | null;
};

type Dados = {
  dias: number;
  kpis: { atual: Kpi; anterior: Kpi };
  diario: { dia: string; sessoes: number; leads: number }[];
  canais: { canal: string; sessoes: number; leads: number }[];
  posts: { post: string; sessoes: number; leads: number }[];
  funil: { visitaram: number; interagiram: number; briefing: number; enviaram: number };
  paginas: { caminho: string; visitas: number; segundos_medio: number | null; leads: number }[];
  dispositivos: { nome: string; sessoes: number }[];
  paises: { nome: string; sessoes: number }[];
  idiomas: { nome: string; sessoes: number }[];
};

const PERIODOS = [7, 30, 90] as const;

// paleta da marca, legível no tema claro e no escuro
const COR = {
  sessoes: "#22B5F2",
  leads: "#22C55E",
  alt: "#7C8CF8",
  aviso: "#F5B544",
  eixo: "#8696AE",
  grade: "rgba(134, 150, 174, 0.25)",
};
const PIZZA = [COR.sessoes, COR.alt, COR.leads, COR.aviso, "#EF4444"];

const NOME_DISPOSITIVO: Record<string, string> = {
  mobile: "Celular",
  desktop: "Computador",
  tablet: "Tablet",
  desconhecido: "Desconhecido",
};

const num = (n: number) => n.toLocaleString("pt-BR");

function pct(parte: number, todo: number): string {
  if (!todo) return "—";
  const v = (parte / todo) * 100;
  return `${v.toLocaleString("pt-BR", { maximumFractionDigits: v < 10 ? 1 : 0 })}%`;
}

function duracao(segundos: number | null | undefined): string {
  if (!segundos) return "—";
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

/** variação sobre o período anterior; sem base de comparação, não inventa */
function variacao(atual: number, anterior: number): { texto: string; cor: string } {
  if (!anterior) return { texto: "sem período anterior", cor: "var(--fg-muted)" };
  const v = ((atual - anterior) / anterior) * 100;
  if (Math.abs(v) < 0.5) return { texto: "igual ao anterior", cor: "var(--fg-muted)" };
  return {
    texto: `${v > 0 ? "▲" : "▼"} ${Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}% vs. anterior`,
    cor: v > 0 ? COR.leads : "#EF4444",
  };
}

const cartao: React.CSSProperties = {
  border: "1px solid var(--line-strong)",
  borderRadius: 14,
  padding: 18,
  background: "var(--bg-soft)",
};

const tooltipStyle: React.CSSProperties = {
  background: "var(--bg-soft)",
  border: "1px solid var(--line-strong)",
  borderRadius: 10,
  color: "var(--fg)",
  fontSize: 13,
};

function Indicador({
  rotulo,
  valor,
  extra,
}: {
  rotulo: string;
  valor: string;
  extra?: { texto: string; cor: string };
}) {
  return (
    <div style={cartao}>
      <div className="field-hint" style={{ textTransform: "uppercase", letterSpacing: ".06em", fontSize: 12 }}>
        {rotulo}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, margin: "6px 0 4px", color: "var(--fg)" }}>{valor}</div>
      {extra && <div style={{ fontSize: 12.5, color: extra.cor }}>{extra.texto}</div>}
    </div>
  );
}

function Bloco({ titulo, nota, children }: { titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section style={cartao}>
      <h3 style={{ fontSize: 16, margin: 0 }}>{titulo}</h3>
      {nota && <p className="field-hint" style={{ margin: "4px 0 12px" }}>{nota}</p>}
      {!nota && <div style={{ height: 12 }} />}
      {children}
    </section>
  );
}

const celula: React.CSSProperties = { padding: "8px 10px", textAlign: "right", fontSize: 14 };
const celulaTexto: React.CSSProperties = { ...celula, textAlign: "left" };

function csvEscape(v: string | number | null): string {
  const s = String(v ?? "");
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export default function PainelBI({ aoExpirar }: { aoExpirar: () => void }) {
  const [dias, setDias] = useState<number>(30);
  const [dados, setDados] = useState<Dados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      // a sessão vai no cookie HttpOnly; não há senha para anexar
      const r = await fetch(`/api/painel?dias=${dias}`, { cache: "no-store" });
      if (r.status === 401) return aoExpirar();
      const d = await r.json();
      if (d.ok) setDados(d.dados as Dados);
      else if (d.reason === "not_configured") setErro("O banco de telemetria não está configurado neste ambiente.");
      else setErro("Não consegui ler o painel agora. Se a atualização do banco ainda não foi aplicada, é por isso.");
    } catch {
      setErro("Falha de rede ao ler o painel.");
    } finally {
      setCarregando(false);
    }
  }, [dias, aoExpirar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const a = dados?.kpis.atual;
  const p = dados?.kpis.anterior;

  const diario = useMemo(
    () => (dados?.diario ?? []).map((d) => ({ ...d, rotulo: d.dia.slice(8, 10) + "/" + d.dia.slice(5, 7) })),
    [dados]
  );

  const canais = useMemo(
    () =>
      (dados?.canais ?? []).map((c) => ({
        ...c,
        conversao: pct(c.leads, c.sessoes),
      })),
    [dados]
  );

  const exportarCsv = () => {
    if (!dados) return;
    const linhas: string[] = [];
    linhas.push("Dia;Sessoes;Leads", ...dados.diario.map((d) => [d.dia, d.sessoes, d.leads].map(csvEscape).join(";")));
    linhas.push("", "Canal;Sessoes;Leads;Conversao", ...canais.map((c) => [c.canal, c.sessoes, c.leads, c.conversao].map(csvEscape).join(";")));
    linhas.push("", "Post;Sessoes;Leads", ...dados.posts.map((x) => [x.post, x.sessoes, x.leads].map(csvEscape).join(";")));
    linhas.push(
      "",
      "Pagina;Visitas;Tempo medio (s);Sessoes com lead",
      ...dados.paginas.map((x) => [x.caminho, x.visitas, x.segundos_medio ?? "", x.leads].map(csvEscape).join(";"))
    );
    // BOM para o Excel abrir acentos corretamente
    const blob = new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `maldivas-painel-${dias}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const semDados = !!dados && (a?.sessoes ?? 0) === 0;
  const f = dados?.funil;

  return (
    <div>
      {/* controles */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
        <div className="briefing-chips" style={{ margin: 0 }} role="group" aria-label="Período">
          {PERIODOS.map((d) => (
            <button key={d} className={`briefing-chip ${dias === d ? "is-on" : ""}`} onClick={() => setDias(d)}>
              {d} dias
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button className="plink" onClick={carregar} disabled={carregando}>
            {carregando ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} />} Atualizar
          </button>
          <button className="plink" onClick={exportarCsv} disabled={!dados}>
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      {erro && <p className="field-hint result-warn" style={{ marginBottom: 16 }}>{erro}</p>}

      {carregando && !dados && (
        <div style={{ ...cartao, textAlign: "center" }}>
          <Loader2 className="spin" size={20} />
        </div>
      )}

      {dados && a && p && (
        <>
          {semDados && (
            <p className="field-hint" style={{ ...cartao, marginBottom: 16 }}>
              Ainda não há visitas neste período. A coleta conta sessões de visitantes reais (robôs e o seu aparelho,
              marcado com <code>?interno=1</code>, ficam de fora). Os gráficos se enchem conforme o site recebe acessos.
            </p>
          )}

          {/* indicadores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 16 }}>
            <Indicador rotulo="Sessões" valor={num(a.sessoes)} extra={variacao(a.sessoes, p.sessoes)} />
            <Indicador rotulo="Páginas vistas" valor={num(a.paginas)} extra={variacao(a.paginas, p.paginas)} />
            <Indicador rotulo="Leads" valor={num(a.leads)} extra={variacao(a.leads, p.leads)} />
            <Indicador rotulo="Conversão" valor={pct(a.leads, a.sessoes)} extra={{ texto: "leads / sessões", cor: "var(--fg-muted)" }} />
            <Indicador
              rotulo="Tempo na visita"
              valor={duracao(a.segundos_medio)}
              extra={{ texto: "média por sessão (aba visível)", cor: "var(--fg-muted)" }}
            />
            <Indicador
              rotulo="Rejeição"
              valor={pct(a.rejeitaram, a.sessoes)}
              extra={{ texto: "sessões de uma página só", cor: "var(--fg-muted)" }}
            />
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {/* evolução */}
            <Bloco titulo="Evolução diária" nota="Sessões (azul, eixo esquerdo) e leads (verde, eixo direito) por dia.">
              <div style={{ width: "100%", height: 280 }} role="img" aria-label="Gráfico de linhas: sessões e leads por dia">
                <ResponsiveContainer>
                  <LineChart data={diario} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke={COR.grade} vertical={false} />
                    <XAxis dataKey="rotulo" stroke={COR.eixo} tick={{ fill: COR.eixo, fontSize: 12 }} minTickGap={24} />
                    <YAxis yAxisId="s" allowDecimals={false} stroke={COR.eixo} tick={{ fill: COR.eixo, fontSize: 12 }} />
                    <YAxis yAxisId="l" orientation="right" allowDecimals={false} stroke={COR.eixo} tick={{ fill: COR.eixo, fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line yAxisId="s" type="monotone" dataKey="sessoes" name="Sessões" stroke={COR.sessoes} strokeWidth={2.5} dot={false} />
                    <Line yAxisId="l" type="monotone" dataKey="leads" name="Leads" stroke={COR.leads} strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Bloco>

            {/* canais + funil */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              <Bloco
                titulo="De onde vêm as visitas"
                nota="Só o link com UTM (/r/in/<post>) confirma a origem; o resto é provável pelo referrer."
              >
                {canais.length === 0 ? (
                  <span className="field-hint">—</span>
                ) : (
                  <>
                    <div style={{ width: "100%", height: Math.max(180, canais.length * 42) }} role="img" aria-label="Gráfico de barras: sessões e leads por canal">
                      <ResponsiveContainer>
                        <BarChart data={canais} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                          <CartesianGrid stroke={COR.grade} horizontal={false} />
                          <XAxis type="number" allowDecimals={false} stroke={COR.eixo} tick={{ fill: COR.eixo, fontSize: 12 }} />
                          <YAxis type="category" dataKey="canal" width={120} stroke={COR.eixo} tick={{ fill: COR.eixo, fontSize: 12 }} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(134,150,174,.12)" }} />
                          <Legend />
                          <Bar dataKey="sessoes" name="Sessões" fill={COR.sessoes} radius={[0, 4, 4, 0]} />
                          <Bar dataKey="leads" name="Leads" fill={COR.leads} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ overflowX: "auto", marginTop: 8 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr className="field-hint">
                            <th style={celulaTexto}>Canal</th>
                            <th style={celula}>Sessões</th>
                            <th style={celula}>Leads</th>
                            <th style={celula}>Conversão</th>
                          </tr>
                        </thead>
                        <tbody>
                          {canais.map((c) => (
                            <tr key={c.canal} style={{ borderTop: "1px solid var(--line-strong)" }}>
                              <td style={celulaTexto}>{c.canal}</td>
                              <td style={celula}>{num(c.sessoes)}</td>
                              <td style={celula}>{num(c.leads)}</td>
                              <td style={celula}>{c.conversao}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </Bloco>

              <Bloco titulo="Funil de conversão" nota="Das sessões que entraram, quantas avançaram em cada etapa.">
                {f && f.visitaram > 0 ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      { nome: "Visitaram o site", n: f.visitaram, cor: COR.sessoes },
                      { nome: "Interagiram (clique ou briefing)", n: f.interagiram, cor: COR.alt },
                      { nome: "Começaram o briefing", n: f.briefing, cor: COR.aviso },
                      { nome: "Enviaram o lead", n: f.enviaram, cor: COR.leads },
                    ].map((e) => (
                      <div key={e.nome}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                          <span>{e.nome}</span>
                          <span style={{ color: "var(--fg-muted)" }}>
                            {num(e.n)} · {pct(e.n, f.visitaram)}
                          </span>
                        </div>
                        <div style={{ height: 12, borderRadius: 999, background: "rgba(134,150,174,.2)", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${Math.max((e.n / f.visitaram) * 100, e.n > 0 ? 2 : 0)}%`,
                              height: "100%",
                              background: e.cor,
                              borderRadius: 999,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="field-hint">—</span>
                )}
              </Bloco>
            </div>

            {/* posts */}
            <Bloco titulo="Posts e links de divulgação" nota="Cada /r/in/<nome-do-post> aparece aqui com o nome que você deu.">
              {dados.posts.length === 0 ? (
                <span className="field-hint">Nenhuma visita veio de link curto ainda. Use /r/in/&lt;nome-do-post&gt; no próximo post.</span>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr className="field-hint">
                      <th style={celulaTexto}>Post</th>
                      <th style={celula}>Sessões</th>
                      <th style={celula}>Leads</th>
                      <th style={celula}>Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.posts.map((x) => (
                      <tr key={x.post} style={{ borderTop: "1px solid var(--line-strong)" }}>
                        <td style={celulaTexto}>{x.post}</td>
                        <td style={celula}>{num(x.sessoes)}</td>
                        <td style={celula}>{num(x.leads)}</td>
                        <td style={celula}>{pct(x.leads, x.sessoes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Bloco>

            {/* páginas */}
            <Bloco titulo="Páginas mais visitadas" nota="Tempo médio com a aba visível. 'Com lead' = sessões que passaram pela página e enviaram o formulário.">
              {dados.paginas.length === 0 ? (
                <span className="field-hint">—</span>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="field-hint">
                        <th style={celulaTexto}>Página</th>
                        <th style={celula}>Visitas</th>
                        <th style={celula}>Tempo médio</th>
                        <th style={celula}>Com lead</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.paginas.map((x) => (
                        <tr key={x.caminho} style={{ borderTop: "1px solid var(--line-strong)" }}>
                          <td style={{ ...celulaTexto, wordBreak: "break-all" }}>{x.caminho}</td>
                          <td style={celula}>{num(x.visitas)}</td>
                          <td style={celula}>{duracao(x.segundos_medio)}</td>
                          <td style={celula}>{num(x.leads)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Bloco>

            {/* perfil do público */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <Bloco titulo="Dispositivos">
                {dados.dispositivos.length === 0 ? (
                  <span className="field-hint">—</span>
                ) : (
                  <div style={{ width: "100%", height: 220 }} role="img" aria-label="Gráfico de pizza: sessões por dispositivo">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={dados.dispositivos.map((d) => ({ ...d, nome: NOME_DISPOSITIVO[d.nome] ?? d.nome }))}
                          dataKey="sessoes"
                          nameKey="nome"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {dados.dispositivos.map((d, i) => (
                            <Cell key={d.nome} fill={PIZZA[i % PIZZA.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Bloco>

              {[
                { titulo: "Países", itens: dados.paises },
                { titulo: "Idioma", itens: dados.idiomas.map((i) => ({ ...i, nome: i.nome === "pt" ? "Português" : i.nome === "en" ? "Inglês" : "Sem idioma" })) },
              ].map((b) => (
                <Bloco key={b.titulo} titulo={b.titulo}>
                  {b.itens.length === 0 ? (
                    <span className="field-hint">—</span>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {b.itens.map((i) => (
                        <div key={i.nome}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 3 }}>
                            <span>{i.nome}</span>
                            <span style={{ color: "var(--fg-muted)" }}>
                              {num(i.sessoes)} · {pct(i.sessoes, a.sessoes)}
                            </span>
                          </div>
                          <div style={{ height: 8, borderRadius: 999, background: "rgba(134,150,174,.2)" }}>
                            <div
                              style={{
                                width: `${Math.min((i.sessoes / Math.max(a.sessoes, 1)) * 100, 100)}%`,
                                height: "100%",
                                background: COR.sessoes,
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Bloco>
              ))}
            </div>
          </div>

          <p className="field-hint" style={{ marginTop: 24 }}>
            Conta sessões (uma por aba aberta), não pessoas: não há cookie nem ID persistente, e nenhum IP é guardado.
            Robôs são descartados, mas alguns escapam. O país vem do cabeçalho da hospedagem. Se a palavra buscada no
            Google importa, isso só existe no Google Search Console.
          </p>
        </>
      )}
    </div>
  );
}
