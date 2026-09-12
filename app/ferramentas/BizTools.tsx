"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Globe, Loader2, MapPin, Search, TrendingUp } from "lucide-react";
import { useLang } from "../lib/i18n";
import { Spotlight } from "../components/fx";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(2).replace(".", ",")}%`;
const num = (v: string) => parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;

/* ================================================================== */
/*  9. Domínio .com.br disponível                                      */
/* ================================================================== */

const dm = {
  pt: {
    title: "O domínio da sua empresa está livre?",
    lead: "Antes de mandar imprimir cartão e fachada, veja se o endereço que você quer ainda existe. A consulta bate direto no registro.br.",
    field: "Nome que você quer",
    hint: "Pode digitar só o nome. Eu completo com .com.br.",
    btn: "Verificar",
    loading: "Consultando o registro.br…",
    invalid: "Nome inválido. Use letras, números e hífen.",
    error: "A consulta não respondeu. Tente de novo em instantes.",
    free: "Está livre",
    taken: "Já registrado",
    freeNote: "Ninguém pegou ainda. Registrar custa cerca de R$ 40 por ano no registro.br.",
    takenNote: "Esse já tem dono. Vale tentar outra variação antes de fechar a marca.",
    created: "Registrado em",
    expires: "Vence em",
    cta: "Registro de domínio, DNS, certificado e e-mail no domínio entram no pacote de site e TI.",
  },
  en: {
    title: "Is your company's domain free?",
    lead: "Before printing cards and signage, check whether the address you want still exists. The lookup hits registro.br directly.",
    field: "Name you want",
    hint: "Just the name is enough. I'll append .com.br.",
    btn: "Check",
    loading: "Querying registro.br…",
    invalid: "Invalid name. Use letters, numbers and hyphens.",
    error: "The lookup didn't respond. Try again shortly.",
    free: "Available",
    taken: "Already registered",
    freeNote: "Nobody has taken it. Registration costs about R$ 40 a year at registro.br.",
    takenNote: "This one has an owner. Worth trying another variation before locking the brand.",
    created: "Registered on",
    expires: "Expires on",
    cta: "Domain registration, DNS, certificates and domain email are part of the site and IT package.",
  },
};

export function DominioTool() {
  const { lang } = useLang();
  const c = dm[lang];
  const [q, setQ] = useState("maldivastech");
  const [state, setState] = useState<"idle" | "loading" | "done" | "invalid" | "error">("idle");
  const [d, setD] = useState<{
    fqdn: string;
    disponivel: boolean;
    criadoEm: string | null;
    expiraEm: string | null;
  } | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setState("loading");
    try {
      const r = await fetch(`/api/brasil?tipo=dominio&q=${encodeURIComponent(q)}`);
      if (r.status === 400) return setState("invalid");
      if (!r.ok) return setState("error");
      setD(await r.json());
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>
      <form onSubmit={run}>
        <div className="field">
          <label htmlFor="dom-q">{c.field}</label>
          <input id="dom-q" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} />
          <span className="field-hint">{c.hint}</span>
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <Globe size={16} />}
          {state === "loading" ? c.loading : c.btn}
        </button>
      </form>

      {state === "invalid" && <p className="result-note result-warn">{c.invalid}</p>}
      {state === "error" && <p className="result-note result-warn">{c.error}</p>}

      {state === "done" && d && (
        <div className="result">
          <div className="result-hero">
            <div className="result-label">{d.fqdn}</div>
            <div className="result-value">{d.disponivel ? c.free : c.taken}</div>
            <p className={`result-note ${d.disponivel ? "result-ok" : "result-warn"}`}>
              {d.disponivel ? c.freeNote : c.takenNote}
            </p>
          </div>
          {!d.disponivel && (d.criadoEm || d.expiraEm) && (
            <>
              {d.criadoEm && (
                <div className="result-row">
                  <span>{c.created}</span>
                  <span>{d.criadoEm.slice(0, 10)}</span>
                </div>
              )}
              {d.expiraEm && (
                <div className="result-row">
                  <span>{c.expires}</span>
                  <span>{d.expiraEm.slice(0, 10)}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  10. CEP e endereço                                                 */
/* ================================================================== */

const cp = {
  pt: {
    title: "Busca de CEP com endereço e coordenada",
    lead: "Para preencher cadastro de cliente, conferir área de entrega ou montar a ficha de um fornecedor sem digitar errado.",
    field: "CEP",
    btn: "Buscar",
    loading: "Buscando…",
    invalid: "O CEP precisa ter 8 dígitos.",
    notFound: "Esse CEP não foi encontrado.",
    error: "A busca não respondeu agora.",
    street: "Logradouro",
    hood: "Bairro",
    city: "Cidade",
    uf: "UF",
    ibge: "Código IBGE",
    coord: "Coordenada",
    map: "Abrir no Google Maps ↗",
    cta: "Busca de CEP dentro do cadastro, cálculo de raio de entrega e validação de endereço eu já implemento nos sistemas.",
  },
  en: {
    title: "Postcode lookup with address and coordinates",
    lead: "For filling in a customer record, checking a delivery area or building a supplier file without typos.",
    field: "Postcode (CEP)",
    btn: "Search",
    loading: "Searching…",
    invalid: "A CEP must have 8 digits.",
    notFound: "That postcode wasn't found.",
    error: "The search didn't respond.",
    street: "Street",
    hood: "District",
    city: "City",
    uf: "State",
    ibge: "IBGE code",
    coord: "Coordinates",
    map: "Open in Google Maps ↗",
    cta: "In-form postcode lookup, delivery-radius calculation and address validation are already built into the systems.",
  },
};

export function CepTool() {
  const { lang } = useLang();
  const c = cp[lang];
  const [cepv, setCepv] = useState("01310-100");
  const [state, setState] = useState<"idle" | "loading" | "done" | "invalid" | "notfound" | "error">("idle");
  const [d, setD] = useState<Record<string, string | null> | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cepv.replace(/\D/g, "");
    if (digits.length !== 8) return setState("invalid");
    setState("loading");
    try {
      const r = await fetch(`/api/brasil?tipo=cep&q=${digits}`);
      if (r.status === 404) return setState("notfound");
      if (!r.ok) return setState("error");
      setD(await r.json());
      setState("done");
    } catch {
      setState("error");
    }
  };

  const rows: [string, string | null][] = d
    ? [
        [c.street, d.logradouro],
        [c.hood, d.bairro],
        [c.city, d.cidade],
        [c.uf, d.uf],
        [c.ibge, d.ibge],
        [c.coord, d.lat && d.lng ? `${d.lat}, ${d.lng}` : null],
      ]
    : [];

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>
      <form onSubmit={run}>
        <div className="field">
          <label htmlFor="cep">{c.field}</label>
          <input
            id="cep"
            value={cepv}
            onChange={(e) =>
              setCepv(e.target.value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2"))
            }
            inputMode="numeric"
            autoComplete="off"
            style={{ fontFamily: "var(--mono)" }}
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <MapPin size={16} />}
          {state === "loading" ? c.loading : c.btn}
        </button>
      </form>

      {state === "invalid" && <p className="result-note result-warn">{c.invalid}</p>}
      {state === "notfound" && <p className="result-note result-warn">{c.notFound}</p>}
      {state === "error" && <p className="result-note result-warn">{c.error}</p>}

      {state === "done" && d && (
        <div className="result">
          {rows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div className="result-row" key={k}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          {d.lat && d.lng && (
            <a
              className="plink"
              style={{ marginTop: 16, display: "inline-flex" }}
              href={`https://www.google.com/maps?q=${d.lat},${d.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.map}
            </a>
          )}
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  11. Reajuste de contrato pelo IPCA                                 */
/* ================================================================== */

const rj = {
  pt: {
    title: "Reajuste de contrato pelo IPCA",
    lead: "Todo contrato anual reajusta, e quase ninguém faz a conta na hora de renovar. Aqui o IPCA acumulado vem direto do Banco Central.",
    value: "Valor atual do contrato (R$)",
    custom: "Ou use outro índice (%)",
    useOfficial: "Usar o IPCA oficial",
    loading: "Buscando o IPCA no Banco Central…",
    error: "Não consegui buscar o índice agora.",
    index: "IPCA acumulado em 12 meses",
    period: "Período",
    newValue: "Valor reajustado",
    diff: "Diferença por mês",
    year: "Diferença no ano",
    cta: "Reajuste anual pelo IPCA é cláusula padrão nos meus contratos — e a conta é essa aqui.",
  },
  en: {
    title: "Contract adjustment by inflation (IPCA)",
    lead: "Every annual contract gets adjusted, and almost nobody runs the numbers at renewal. Here the accumulated index comes straight from the Central Bank.",
    value: "Current contract value (R$)",
    custom: "Or use another index (%)",
    useOfficial: "Use the official IPCA",
    loading: "Fetching IPCA from the Central Bank…",
    error: "Couldn't fetch the index right now.",
    index: "IPCA accumulated over 12 months",
    period: "Period",
    newValue: "Adjusted value",
    diff: "Difference per month",
    year: "Difference over the year",
    cta: "Annual adjustment by IPCA is a standard clause in my contracts — and this is the calculation.",
  },
};

export function IpcaTool() {
  const { lang } = useLang();
  const c = rj[lang];
  const [value, setValue] = useState("4800");
  const [custom, setCustom] = useState("");
  const [d, setD] = useState<{ acumulado12m: number; primeiroMes: string; ultimoMes: string } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/brasil?tipo=ipca")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setD)
      .catch(() => setFailed(true));
  }, []);

  const rate = custom.trim() ? num(custom) : (d?.acumulado12m ?? 0);
  const base = num(value);
  const novo = base * (1 + rate / 100);

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      {failed && <p className="result-note result-warn">{c.error}</p>}
      {!d && !failed && (
        <p className="result-note">
          <Loader2 size={15} style={{ display: "inline", verticalAlign: "-2px" }} /> {c.loading}
        </p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="ipca-v">{c.value}</label>
          <input id="ipca-v" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="ipca-c">{c.custom}</label>
          <input
            id="ipca-c"
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={d ? d.acumulado12m.toFixed(2) : ""}
            autoComplete="off"
          />
          {custom.trim() && (
            <button type="button" className="field-hint" style={{ textAlign: "left", color: "var(--accent)" }} onClick={() => setCustom("")}>
              {c.useOfficial}
            </button>
          )}
        </div>
      </div>

      <div className="result">
        <div className="result-row">
          <span>{c.index}</span>
          <span>{pct(rate)}</span>
        </div>
        {d && (
          <div className="result-row">
            <span>{c.period}</span>
            <span>
              {d.primeiroMes} — {d.ultimoMes}
            </span>
          </div>
        )}
        <div className="result-row">
          <span>{c.diff}</span>
          <span>{brl(novo - base)}</span>
        </div>
        <div className="result-row">
          <span>{c.year}</span>
          <span>{brl((novo - base) * 12)}</span>
        </div>
        <div className="result-hero">
          <div className="result-label">{c.newValue}</div>
          <div className="result-value">{brl(novo)}</div>
        </div>
      </div>

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  12. Feriados e impacto na operação                                 */
/* ================================================================== */

const fr = {
  pt: {
    title: "Feriados do ano e o efeito na sua escala",
    lead: "Feriado na terça ou na quinta vira emenda, e emenda muda compra, escala e movimento. Veja o calendário já marcado por tipo.",
    year: "Ano",
    loading: "Carregando…",
    error: "Não consegui carregar o calendário.",
    bridgeFri: "emenda na sexta",
    bridgeMon: "emenda na segunda",
    weekend: "cai no fim de semana",
    summary: "Emendas no ano",
    cta: "Escala, previsão de demanda por data e compra antecipada saem do mesmo calendário dentro do sistema.",
  },
  en: {
    title: "Public holidays and the effect on your roster",
    lead: "A Tuesday or Thursday holiday turns into a long weekend, and that changes purchasing, staffing and footfall. See the calendar already tagged by type.",
    year: "Year",
    loading: "Loading…",
    error: "Couldn't load the calendar.",
    bridgeFri: "long weekend (Friday)",
    bridgeMon: "long weekend (Monday)",
    weekend: "falls on a weekend",
    summary: "Long weekends this year",
    cta: "Rostering, demand forecasting by date and advance purchasing come from this same calendar inside the system.",
  },
};

type Feriado = {
  data: string;
  nome: string;
  diaSemana: string;
  emendaSexta: boolean;
  emendaSegunda: boolean;
  fimDeSemana: boolean;
};

export function FeriadosTool() {
  const { lang } = useLang();
  const c = fr[lang];
  const [year, setYear] = useState(new Date().getFullYear());
  const [list, setList] = useState<Feriado[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setList(null);
    setFailed(false);
    fetch(`/api/brasil?tipo=feriados&q=${year}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setList(d.feriados))
      .catch(() => setFailed(true));
  }, [year]);

  const bridges = list?.filter((f) => f.emendaSexta || f.emendaSegunda).length ?? 0;

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field">
        <label htmlFor="ano">{c.year}</label>
        <select id="ano" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
          {[0, 1, 2].map((i) => {
            const y = new Date().getFullYear() + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {failed && <p className="result-note result-warn">{c.error}</p>}
      {!list && !failed && (
        <p className="result-note">
          <Loader2 size={15} style={{ display: "inline", verticalAlign: "-2px" }} /> {c.loading}
        </p>
      )}

      {list && (
        <div className="result">
          {list.map((f) => (
            <div className="result-row" key={f.data}>
              <span>
                {f.data.split("-").reverse().join("/")} · {f.nome}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: f.emendaSexta || f.emendaSegunda ? "var(--gold)" : f.fimDeSemana ? "var(--fg-dim)" : "var(--fg)",
                }}
              >
                {f.emendaSexta
                  ? c.bridgeFri
                  : f.emendaSegunda
                    ? c.bridgeMon
                    : f.fimDeSemana
                      ? c.weekend
                      : f.diaSemana}
              </span>
            </div>
          ))}
          <div className="result-hero">
            <div className="result-label">{c.summary}</div>
            <div className="result-value">{bridges}</div>
          </div>
        </div>
      )}

      <div className="tool-cta">
        <CalendarDays size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
        {c.cta}
      </div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  13. Ficha técnica: fator de correção e custo por porção            */
/* ================================================================== */

const ft = {
  pt: {
    title: "Ficha técnica: fator de correção e custo por porção",
    lead: "Você compra 1 kg de carne, mas não usa 1 kg. Sai osso, gordura, casca, aparo. O fator de correção mostra quanto você paga de verdade pelo que vai no prato.",
    bought: "Peso comprado (kg)",
    clean: "Peso limpo, depois de aparar (kg)",
    price: "Preço pago por kg (R$)",
    portion: "Porção por prato (g)",
    fc: "Fator de correção",
    realPrice: "Preço real do kg limpo",
    loss: "Perda no processamento",
    perPortion: "Custo por porção",
    yield: "Porções que saem da compra",
    hint: "Fator 1,00 é aproveitamento total. Acima de 2,00, metade do que você pagou foi para o lixo.",
    cta: "Ficha técnica com fator de correção, rendimento e baixa automática de estoque é o coração do MiseOn.",
  },
  en: {
    title: "Recipe costing: yield factor and cost per portion",
    lead: "You buy 1 kg of meat but you don't use 1 kg. Bone, fat, peel and trim come off. The yield factor shows what you really pay for what reaches the plate.",
    bought: "Weight purchased (kg)",
    clean: "Clean weight after trimming (kg)",
    price: "Price paid per kg (R$)",
    portion: "Portion per dish (g)",
    fc: "Yield factor",
    realPrice: "Real price per clean kg",
    loss: "Processing loss",
    perPortion: "Cost per portion",
    yield: "Portions per purchase",
    hint: "A factor of 1.00 means full usage. Above 2.00, half of what you paid went in the bin.",
    cta: "Recipe sheets with yield factors, portioning and automatic stock deduction are the core of MiseOn.",
  },
};

export function FichaTool() {
  const { lang } = useLang();
  const c = ft[lang];
  const [v, setV] = useState({ bought: "1", clean: "0,72", price: "38,90", portion: "180" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const r = useMemo(() => {
    const bought = num(v.bought);
    const clean = num(v.clean);
    const price = num(v.price);
    const portion = num(v.portion) / 1000;
    const fc = clean > 0 ? bought / clean : 0;
    const realPrice = price * fc;
    return {
      fc,
      realPrice,
      loss: bought > 0 ? ((bought - clean) / bought) * 100 : 0,
      perPortion: realPrice * portion,
      portions: portion > 0 ? Math.floor(clean / portion) : 0,
    };
  }, [v]);

  const fields: [keyof typeof v, string][] = [
    ["bought", c.bought], ["clean", c.clean], ["price", c.price], ["portion", c.portion],
  ];

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>
      <div className="field-row">
        {fields.map(([k, label]) => (
          <div className="field" key={k}>
            <label htmlFor={`ft-${k}`}>{label}</label>
            <input id={`ft-${k}`} inputMode="decimal" value={v[k]} onChange={set(k)} autoComplete="off" />
          </div>
        ))}
      </div>

      <div className="result">
        <div className="result-row">
          <span>{c.fc}</span>
          <span className={r.fc > 2 ? "result-warn" : undefined}>{r.fc.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="result-row">
          <span>{c.loss}</span>
          <span>{pct(r.loss)}</span>
        </div>
        <div className="result-row">
          <span>{c.realPrice}</span>
          <span>{brl(r.realPrice)}</span>
        </div>
        <div className="result-row">
          <span>{c.yield}</span>
          <span>{r.portions}</span>
        </div>
        <div className="result-hero">
          <div className="result-label">{c.perPortion}</div>
          <div className="result-value">{brl(r.perPortion)}</div>
        </div>
        <p className="field-hint" style={{ marginTop: 12 }}>
          {c.hint}
        </p>
      </div>

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  14. Margem × markup                                                */
/* ================================================================== */

const mk = {
  pt: {
    title: "Margem × markup: a conta que quase todo mundo erra",
    lead: "Aplicar 30% em cima do custo não dá 30% de margem. Dá 23%. Essa diferença some do seu bolso todo mês sem ninguém perceber.",
    cost: "Custo do produto (R$)",
    mode: "Eu quero informar",
    modeMarkup: "Markup sobre o custo (%)",
    modeMargin: "Margem sobre a venda (%)",
    input: "Percentual",
    price: "Preço de venda",
    profit: "Lucro por unidade",
    margin: "Margem real sobre a venda",
    markup: "Markup real sobre o custo",
    mult: "Multiplicador",
    warn: "Você pediu markup. A margem que sobra é menor do que o número que você digitou.",
    ok: "Margem e preço batendo com o que você pediu.",
    cta: "Precificação por família de produto, curva ABC e alerta de margem baixa saem prontos no mercadinhosys.",
  },
  en: {
    title: "Margin vs markup: the calculation almost everyone gets wrong",
    lead: "Adding 30% on top of cost does not give you a 30% margin. It gives 23%. That gap leaves your pocket every month unnoticed.",
    cost: "Product cost (R$)",
    mode: "I want to enter",
    modeMarkup: "Markup on cost (%)",
    modeMargin: "Margin on selling price (%)",
    input: "Percentage",
    price: "Selling price",
    profit: "Profit per unit",
    margin: "Real margin on the sale",
    markup: "Real markup on cost",
    mult: "Multiplier",
    warn: "You entered a markup. The margin left is smaller than the number you typed.",
    ok: "Margin and price matching what you asked for.",
    cta: "Pricing by product family, ABC curves and low-margin alerts come ready in mercadinhosys.",
  },
};

export function MarkupTool() {
  const { lang } = useLang();
  const c = mk[lang];
  const [cost, setCost] = useState("10");
  const [mode, setMode] = useState<"markup" | "margin">("markup");
  const [rate, setRate] = useState("30");

  const r = useMemo(() => {
    const k = num(cost);
    const p = num(rate);
    // markup incide sobre o custo; margem incide sobre o preço final
    const price = mode === "markup" ? k * (1 + p / 100) : p < 100 ? k / (1 - p / 100) : NaN;
    const profit = price - k;
    return {
      price,
      profit,
      margin: price > 0 ? (profit / price) * 100 : 0,
      markup: k > 0 ? (profit / k) * 100 : 0,
      mult: k > 0 ? price / k : 0,
    };
  }, [cost, rate, mode]);

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field-row">
        <div className="field">
          <label htmlFor="mk-c">{c.cost}</label>
          <input id="mk-c" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="mk-m">{c.mode}</label>
          <select id="mk-m" value={mode} onChange={(e) => setMode(e.target.value as "markup" | "margin")}>
            <option value="markup">{c.modeMarkup}</option>
            <option value="margin">{c.modeMargin}</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="mk-r">{c.input}</label>
        <input id="mk-r" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} autoComplete="off" />
      </div>

      <div className="result">
        <div className="result-row">
          <span>{c.profit}</span>
          <span>{Number.isFinite(r.profit) ? brl(r.profit) : "—"}</span>
        </div>
        <div className="result-row">
          <span>{c.margin}</span>
          <span>{Number.isFinite(r.margin) ? pct(r.margin) : "—"}</span>
        </div>
        <div className="result-row">
          <span>{c.markup}</span>
          <span>{Number.isFinite(r.markup) ? pct(r.markup) : "—"}</span>
        </div>
        <div className="result-row">
          <span>{c.mult}</span>
          <span>{Number.isFinite(r.mult) ? `${r.mult.toFixed(2).replace(".", ",")}×` : "—"}</span>
        </div>
        <div className="result-hero">
          <div className="result-label">{c.price}</div>
          <div className="result-value">{Number.isFinite(r.price) ? brl(r.price) : "—"}</div>
          <p className={`result-note ${mode === "markup" ? "result-warn" : "result-ok"}`}>
            {mode === "markup" ? c.warn : c.ok}
          </p>
        </div>
      </div>

      <div className="tool-cta">
        <TrendingUp size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
        {c.cta}
      </div>
    </Spotlight>
  );
}
