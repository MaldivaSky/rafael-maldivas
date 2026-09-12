"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Building2, Loader2, Search } from "lucide-react";
import { useLang } from "../lib/i18n";
import { Spotlight } from "../components/fx";

/* ================================================================== */
/*  Consulta de CNPJ na Receita Federal                                */
/* ================================================================== */

const cj = {
  pt: {
    title: "Consulta de CNPJ na Receita Federal",
    lead: "Antes de fechar com um fornecedor ou aceitar um pedido grande, vale olhar se a empresa está ativa, desde quando existe e quem assina por ela. Digite o CNPJ e veja o cadastro público.",
    field: "CNPJ",
    btn: "Consultar",
    loading: "Buscando na Receita…",
    invalid: "O CNPJ precisa ter 14 dígitos.",
    notFound: "Esse CNPJ não aparece na base pública. Empresa muito recente às vezes demora a entrar.",
    error: "A consulta não respondeu agora. Tente de novo em instantes.",
    razao: "Razão social",
    fantasia: "Nome fantasia",
    situacao: "Situação cadastral",
    abertura: "Aberta em",
    porte: "Porte",
    natureza: "Natureza jurídica",
    capital: "Capital social",
    cnae: "Atividade principal",
    cnaes: "Outras atividades",
    endereco: "Endereço",
    contato: "Contato",
    socios: "Quadro societário",
    matriz: "Matriz",
    filial: "Filial",
    source: "Fonte: base pública da Receita Federal via BrasilAPI. Nada fica guardado aqui.",
    cta: "Cadastro de fornecedor, validação de CNPJ e conferência de dado fiscal entram direto no sistema quando eu monto o cadastro da sua empresa.",
  },
  en: {
    title: "Brazilian company lookup (CNPJ)",
    lead: "Before closing with a supplier or accepting a large order, it's worth checking whether the company is active, how long it has existed and who signs for it. Enter the tax ID and read the public registry.",
    field: "CNPJ",
    btn: "Look up",
    loading: "Querying the registry…",
    invalid: "A CNPJ must have 14 digits.",
    notFound: "That CNPJ isn't in the public base. Very new companies sometimes take a while to appear.",
    error: "The lookup didn't respond. Try again shortly.",
    razao: "Legal name",
    fantasia: "Trade name",
    situacao: "Registry status",
    abertura: "Opened on",
    porte: "Size",
    natureza: "Legal form",
    capital: "Share capital",
    cnae: "Primary activity",
    cnaes: "Other activities",
    endereco: "Address",
    contato: "Contact",
    socios: "Ownership",
    matriz: "Headquarters",
    filial: "Branch",
    source: "Source: Brazilian Federal Revenue public base via BrasilAPI. Nothing is stored here.",
    cta: "Supplier onboarding, tax-ID validation and registry checks go straight into the system when I build your company's records.",
  },
};

type CnpjData = {
  cnpj: string;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  situacao: string | null;
  abertura: string | null;
  porte: string | null;
  naturezaJuridica: string | null;
  capitalSocial: number | null;
  cnaePrincipal: string | null;
  cnaesSecundarios: string[];
  endereco: string;
  municipio: string | null;
  uf: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
  socios: { nome: string; qualificacao: string }[];
  matriz: boolean;
};

const maskCnpj = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const date = (iso: string) => iso.split("-").reverse().join("/");

export function CnpjTool() {
  const { lang } = useLang();
  const c = cj[lang];
  const [cnpj, setCnpj] = useState("33.000.167/0001-01");
  const [state, setState] = useState<"idle" | "loading" | "done" | "invalid" | "notfound" | "error">("idle");
  const [d, setD] = useState<CnpjData | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cnpj.replace(/\D/g, "");
    if (digits.length !== 14) {
      setState("invalid");
      return;
    }
    setState("loading");
    try {
      const r = await fetch(`/api/cnpj?cnpj=${digits}`);
      if (r.status === 404) {
        setState("notfound");
        return;
      }
      if (!r.ok) {
        setState("error");
        return;
      }
      setD(await r.json());
      setState("done");
    } catch {
      setState("error");
    }
  };

  const rows: [string, string | null][] = d
    ? [
        [c.razao, d.razaoSocial],
        [c.fantasia, d.nomeFantasia],
        [c.situacao, d.situacao ? `${d.situacao} · ${d.matriz ? c.matriz : c.filial}` : null],
        [c.abertura, d.abertura ? date(d.abertura) : null],
        [c.porte, d.porte],
        [c.natureza, d.naturezaJuridica],
        [c.capital, d.capitalSocial !== null ? brl(d.capitalSocial) : null],
        [c.cnae, d.cnaePrincipal],
        [c.endereco, [d.endereco, d.municipio, d.uf, d.cep].filter(Boolean).join(" · ")],
        [c.contato, [d.telefone, d.email].filter(Boolean).join(" · ") || null],
      ]
    : [];

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <form onSubmit={run}>
        <div className="field">
          <label htmlFor="cnpj">{c.field}</label>
          <input
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(maskCnpj(e.target.value))}
            inputMode="numeric"
            autoComplete="off"
            style={{ fontFamily: "var(--mono)" }}
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <Building2 size={16} />}
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
              <div className="result-row" key={k} style={{ alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>{k}</span>
                <span style={{ textAlign: "right" }}>{v}</span>
              </div>
            ))}

          {d.cnaesSecundarios.length > 0 && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
                {c.cnaes} ({d.cnaesSecundarios.length})
              </summary>
              <div style={{ marginTop: 10 }}>
                {d.cnaesSecundarios.map((x) => (
                  <p className="dns-detail" key={x} style={{ padding: "5px 0" }}>
                    {x}
                  </p>
                ))}
              </div>
            </details>
          )}

          {d.socios.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
                {c.socios} ({d.socios.length})
              </summary>
              <div style={{ marginTop: 10 }}>
                {d.socios.map((s) => (
                  <div className="result-row" key={s.nome}>
                    <span>{s.nome}</span>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{s.qualificacao}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          <p className="field-hint" style={{ marginTop: 14 }}>
            {c.source}
          </p>
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Conversor de moeda com cotação do dia                              */
/* ================================================================== */

const cb = {
  pt: {
    title: "Conversor de moeda com cotação do dia",
    lead: "Serve para orçar em dólar ou em iene sem chutar o câmbio. Eu uso isso nas propostas para o Japão, onde o cliente precisa ver o valor em ¥ e eu preciso receber em R$.",
    amount: "Valor",
    from: "De",
    to: "Para",
    loading: "Buscando cotação…",
    error: "Não consegui buscar a cotação agora.",
    updated: "Cotação de",
    table: "Como está o câmbio hoje",
    swap: "Inverter",
    cta: "Orçamento multimoeda, contrato em outra moeda e relatório para cliente estrangeiro são parte do que eu já entrego no SelectSys Jobs.",
  },
  en: {
    title: "Currency converter with today's rate",
    lead: "For quoting in dollars or yen without guessing the exchange rate. I use this on proposals for Japan, where the client needs the figure in ¥ and I need to be paid in R$.",
    amount: "Amount",
    from: "From",
    to: "To",
    loading: "Fetching rate…",
    error: "Couldn't fetch the rate right now.",
    updated: "Rate from",
    table: "Today's exchange rates",
    swap: "Swap",
    cta: "Multi-currency quoting, contracts in another currency and reports for foreign clients are part of what SelectSys Jobs already delivers.",
  },
};

type Rate = { code: string; name: string; brl: number; change: number };

export function CambioTool() {
  const { lang } = useLang();
  const c = cb[lang];
  const [rates, setRates] = useState<Rate[] | null>(null);
  const [updated, setUpdated] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [amount, setAmount] = useState("4800");
  const [from, setFrom] = useState("BRL");
  const [to, setTo] = useState("JPY");

  useEffect(() => {
    fetch("/api/cambio")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setRates(d.rates);
        setUpdated(d.updatedAt);
      })
      .catch(() => setFailed(true));
  }, []);

  // tudo passa por BRL: converte para real e depois para a moeda de destino
  const toBrl = (code: string) =>
    code === "BRL" ? 1 : (rates?.find((r) => r.code === code)?.brl ?? 0);

  const result = useMemo(() => {
    const v = parseFloat(amount.replace(",", ".")) || 0;
    const f = toBrl(from);
    const t = toBrl(to);
    if (!f || !t) return null;
    return (v * f) / t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, from, to, rates]);

  const codes = ["BRL", ...(rates ?? []).map((r) => r.code)];
  const fmt = (n: number, code: string) =>
    n.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "JPY" ? 0 : 2,
    });

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      {failed && <p className="result-note result-warn">{c.error}</p>}
      {!rates && !failed && (
        <p className="result-note">
          <Loader2 size={15} style={{ display: "inline", verticalAlign: "-2px" }} /> {c.loading}
        </p>
      )}

      {rates && (
        <>
          <div className="field">
            <label htmlFor="amt">{c.amount}</label>
            <input
              id="amt"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="from">{c.from}</label>
              <select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
                {codes.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="to">{c.to}</label>
              <select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
                {codes.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="plink"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            <ArrowLeftRight size={15} /> {c.swap}
          </button>

          <div className="result">
            <div className="result-hero">
              <div className="result-label">
                {amount || 0} {from} →
              </div>
              <div className="result-value">{result !== null ? fmt(result, to) : "—"}</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="result-label" style={{ marginBottom: 8 }}>
                {c.table}
              </div>
              {rates.map((r) => (
                <div className="result-row" key={r.code}>
                  <span>
                    {r.name} ({r.code})
                  </span>
                  <span className={r.change < 0 ? "result-ok" : "result-warn"}>
                    {fmt(r.brl, "BRL")} · {r.change > 0 ? "+" : ""}
                    {r.change.toFixed(2).replace(".", ",")}%
                  </span>
                </div>
              ))}
            </div>

            {updated && (
              <p className="field-hint" style={{ marginTop: 12 }}>
                {c.updated} {updated}
              </p>
            )}
          </div>
        </>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}
