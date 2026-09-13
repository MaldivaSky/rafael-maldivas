"use client";


import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { AlertTriangle, Check, Download, FileUp, Loader2, Search, X } from "lucide-react";
import { useLang } from "../lib/i18n";
import { Spotlight } from "../components/fx";
import { analyzeCpf, maskCpf, parseNfeXml, type NfeParsed } from "../lib/validators";

const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(2).replace(".", ",")}%`;
const br = (s: string | null | undefined) => {
  if (s === null || s === undefined || s === "") return "—";
  const n = parseFloat(s);
  return Number.isFinite(n)
    ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : s;
};

function Mark({ ok }: { ok: boolean | "warn" }) {
  const color = ok === true ? "var(--accent)" : ok === "warn" ? "var(--gold)" : "#EF4444";
  return (
    <span style={{ color, flexShrink: 0, marginTop: 2, display: "inline-flex" }}>
      {ok === true ? <Check size={18} /> : ok === "warn" ? <AlertTriangle size={17} /> : <X size={18} />}
    </span>
  );
}

/* ================================================================== */
/*  Validador de CPF                                                   */
/* ================================================================== */

const cp = {
  pt: {
    title: "Validador de CPF",
    lead: "Confira se um CPF existe de fato: os dois últimos dígitos são calculados a partir dos nove primeiros por módulo 11. O nono dígito ainda revela a região fiscal que emitiu o número. Roda no seu navegador.",
    field: "CPF",
    hint: "Aceita com ou sem pontos. Nada é enviado para nenhum servidor.",
    empty: "Digite um CPF para validar.",
    short: "Faltam dígitos: você informou",
    valid: "CPF válido",
    invalid: "CPF inválido",
    repeated: "Todos os dígitos iguais não formam um CPF válido.",
    dv1: "Primeiro dígito verificador",
    dv2: "Segundo dígito verificador",
    region: "Região fiscal (9º dígito)",
    regionHint: "Não é onde a pessoa mora; é a delegacia regional que emitiu o número.",
    ok: "confere",
    bad: "não confere",
    cta: "Validação de CPF em cadastro faz parte do que eu implemento em sistemas de gestão.",
  },
  en: {
    title: "Brazilian CPF validator",
    lead: "Check whether a CPF actually exists: the last two digits are derived from the first nine by modulo 11. The ninth digit even reveals the fiscal region that issued the number. Runs in your browser.",
    field: "CPF",
    hint: "Dots are fine. Nothing is sent to any server.",
    empty: "Enter a CPF to validate.",
    short: "Missing digits: you entered",
    valid: "Valid CPF",
    invalid: "Invalid CPF",
    repeated: "All-equal digits do not form a valid CPF.",
    dv1: "First check digit",
    dv2: "Second check digit",
    region: "Fiscal region (9th digit)",
    regionHint: "It is not where the person lives; it is the regional office that issued the number.",
    ok: "matches",
    bad: "mismatch",
    cta: "CPF validation at signup is part of what I implement in management systems.",
  },
};

function CpfTool() {
  const { lang } = useLang();
  const c = cp[lang];
  const [value, setValue] = useState("");
  const r = useMemo(() => analyzeCpf(value), [value]);
  const filled = value.replace(/\D/g, "").length > 0;

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field">
        <label htmlFor="cpf">{c.field}</label>
        <input
          id="cpf"
          value={value}
          onChange={(e) => setValue(maskCpf(e.target.value))}
          inputMode="numeric"
          spellCheck={false}
          autoComplete="off"
          placeholder="000.000.000-00"
        />
        <span className="field-hint">{c.hint}</span>
      </div>

      {!filled ? (
        <p className="result-note">{c.empty}</p>
      ) : r.length !== 11 ? (
        <p className="result-note result-warn">
          {c.short} {r.length}/11.
        </p>
      ) : (
        <div className="result">
          {(
            [
              [c.dv1, r.dv1],
              [c.dv2, r.dv2],
            ] as [string, boolean | undefined][]
          ).map(([label, ok]) => (
            <div className="dns-row" key={label}>
              <Mark ok={ok === true} />
              <span className="dns-name" style={{ width: 220 }}>
                {label}
              </span>
              <span>{ok ? c.ok : c.bad}</span>
            </div>
          ))}

          {r.region && (
            <div className="dns-row">
              <Mark ok={true} />
              <span className="dns-name" style={{ width: 220 }}>
                {c.region}
              </span>
              <span>{r.region}</span>
            </div>
          )}

          <div className="result-hero">
            <div className="result-label">{r.valid ? c.valid : c.invalid}</div>
            <div className="result-value">{r.valid ? "OK" : "!"}</div>
            <p className={`result-note ${r.valid ? "result-ok" : "result-warn"}`}>
              {r.valid ? c.valid : r.repeated ? c.repeated : c.invalid}
            </p>
          </div>

          <p className="field-hint" style={{ marginTop: 12 }}>
            {c.regionHint}
          </p>
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Extrator de dados de NF-e / NFC-e (XML)                            */
/* ================================================================== */

const nx = {
  pt: {
    title: "Extrator de dados de NF-e / NFC-e (XML)",
    lead: "Suba ou cole o XML da nota e veja emitente, destinatário, itens com quantidade e valor, impostos, pagamento e o total — já separado. O arquivo é lido no seu navegador, sem upload para servidor.",
    field: "Arquivo XML",
    drop: "Escolher arquivo XML",
    pasteLabel: "ou cole o conteúdo do XML aqui",
    pastePh: '<?xml version="1.0"?>…',
    parse: "Extrair dados",
    clear: "Limpar",
    invalid: "Não consegui ler esse arquivo. Confira se é o XML da nota (nfeProc ou NFe).",
    emit: "Emitente",
    dest: "Destinatário",
    items: "Itens",
    invoice: "Nota",
    cnpj: "CNPJ/CPF",
    ie: "Inscrição estadual",
    code: "Código",
    series: "Série",
    number: "Número",
    issued: "Emissão",
    nature: "Natureza da operação",
    vProd: "Produtos",
    vFrete: "Frete",
    vDesc: "Desconto",
    vICMS: "ICMS",
    vIPI: "IPI",
    vNF: "Total da nota",
    payment: "Pagamento",
    copy: "Copiar resumo",
    cta: "Lançar a nota no estoque sem redigitar é o que o mercadinhosys faz com o XML do fornecedor.",
  },
  en: {
    title: "Brazilian invoice data extractor (NF-e / NFC-e XML)",
    lead: "Upload or paste the invoice XML and see issuer, recipient, line items with quantity and price, taxes, payment and the total — already separated. The file is read in your browser, no server upload.",
    field: "XML file",
    drop: "Choose XML file",
    pasteLabel: "or paste the XML content here",
    pastePh: '<?xml version="1.0"?>…',
    parse: "Extract data",
    clear: "Clear",
    invalid: "Could not read this file. Make sure it is the invoice XML (nfeProc or NFe).",
    emit: "Issuer",
    dest: "Recipient",
    items: "Items",
    invoice: "Invoice",
    cnpj: "Tax ID",
    ie: "State registration",
    code: "Code",
    series: "Series",
    number: "Number",
    issued: "Issued",
    nature: "Operation nature",
    vProd: "Products",
    vFrete: "Freight",
    vDesc: "Discount",
    vICMS: "ICMS",
    vIPI: "IPI",
    vNF: "Invoice total",
    payment: "Payment",
    copy: "Copy summary",
    cta: "Posting an invoice to stock without retyping is what mercadinhosys does with the supplier's XML.",
  },
};

function NfeXmlTool() {
  const { lang } = useLang();
  const c = nx[lang];
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<NfeParsed | null>(null);
  const [error, setError] = useState("");

  const parse = (xml: string) => {
    if (!xml.trim()) return;
    const r = parseNfeXml(xml);
    if (!r.ok) {
      setError(c.invalid);
      setResult(null);
      return;
    }
    setError("");
    setResult(r);
  };

  const onFile = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    setRaw(text);
    parse(text);
  };

  const summary = result
    ? [
        `${c.emit}: ${result.emitente?.nome ?? "—"} (${result.emitente?.cnpj ?? "—"})`,
        `${c.number}: ${result.numero ?? "—"} · ${c.series}: ${result.serie ?? "—"}`,
        `${c.vNF}: R$ ${br(result.totais.vNF)}`,
        ...result.itens.map(
          (it) =>
            `${it.cProd} ${it.xProd} — ${br(it.qCom)} ${it.uCom} x R$ ${br(it.vUnCom)} = R$ ${br(it.vProd)}`
        ),
      ].join("\n")
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      /* clipboard bloqueado — ignora */
    }
  };

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field">
        <label htmlFor="nfexml">{c.field}</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label className="plink solid" style={{ cursor: "pointer" }}>
            <FileUp size={16} /> {c.drop}
            <input
              id="nfexml"
              type="file"
              accept=".xml,text/xml,application/xml"
              style={{ display: "none" }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
                e.target.value = "";
              }}
            />
          </label>
          {fileName && (
            <span className="field-hint" style={{ margin: 0 }}>
              {fileName}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="nfepaste">{c.pasteLabel}</label>
        <textarea
          id="nfepaste"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={() => parse(raw)}
          placeholder={c.pastePh}
          rows={4}
          spellCheck={false}
          style={{ fontFamily: "var(--mono)", fontSize: 12, width: "100%", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" className="plink solid" onClick={() => parse(raw)} disabled={!raw.trim()}>
          <Search size={16} /> {c.parse}
        </button>
        <button
          type="button"
          className="plink"
          onClick={() => {
            setRaw("");
            setResult(null);
            setError("");
            setFileName("");
          }}
        >
          {c.clear}
        </button>
      </div>

      {error && <p className="result-note result-warn">{error}</p>}

      {result?.ok && (
        <div className="result">
          <div className="dns-row">
            <Mark ok={true} />
            <span className="dns-name" style={{ width: 150 }}>
              {c.invoice}
            </span>
            <span>
              {result.tipo} · nº {result.numero ?? "—"} · {c.series} {result.serie ?? "—"}
              <br />
              <span className="dns-detail">
                {result.natureza ?? "—"} · {c.issued} {result.emissao ?? "—"}
              </span>
            </span>
          </div>

          {result.emitente && (
            <div className="dns-row">
              <Mark ok={true} />
              <span className="dns-name" style={{ width: 150 }}>
                {c.emit}
              </span>
              <span>
                {result.emitente.nome}
                <br />
                <span className="dns-detail">
                  {c.cnpj} {result.emitente.cnpj} · {c.ie} {result.emitente.ie || "—"} ·{" "}
                  {result.emitente.cidade}/{result.emitente.uf}
                </span>
              </span>
            </div>
          )}

          {result.destinatario?.nome && (
            <div className="dns-row">
              <Mark ok={true} />
              <span className="dns-name" style={{ width: 150 }}>
                {c.dest}
              </span>
              <span>
                {result.destinatario.nome}
                <br />
                <span className="dns-detail">
                  {c.cnpj} {result.destinatario.cpfCnpj || "—"} · {result.destinatario.cidade}/
                  {result.destinatario.uf}
                </span>
              </span>
            </div>
          )}

          <details open style={{ marginTop: 10 }}>
            <summary
              style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 700, fontSize: 14 }}
            >
              {c.items} ({result.itens.length})
            </summary>
            <div style={{ marginTop: 12 }}>
              {result.itens.map((it, i) => (
                <div key={`${it.cProd}-${i}`} className="dns-row" style={{ alignItems: "flex-start" }}>
                  <span className="dns-name" style={{ width: 26, fontFamily: "var(--mono)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ flex: 1 }}>
                    <strong>{it.xProd || "—"}</strong>
                    <br />
                    <span className="dns-detail">
                      {c.code} {it.cProd} · NCM {it.ncm} · CFOP {it.cfop}
                      <br />
                      {br(it.qCom)} {it.uCom} x R$ {br(it.vUnCom)} = <strong>R$ {br(it.vProd)}</strong>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </details>

          <div style={{ marginTop: 14 }}>
            {(
              [
                [c.vProd, result.totais.vProd],
                [c.vFrete, result.totais.vFrete],
                [c.vDesc, result.totais.vDesc],
                [c.vICMS, result.totais.vICMS],
                [c.vIPI, result.totais.vIPI],
              ] as [string, string | null][]
            )
              .filter(([, val]) => val !== null)
              .map(([label, val]) => (
                <div className="result-row" key={label}>
                  <span>{label}</span>
                  <span>R$ {br(val)}</span>
                </div>
              ))}
          </div>

          {result.pagamento.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {result.pagamento.map((p, i) => (
                <div className="result-row" key={i}>
                  <span>
                    {c.payment}: {p.tPag}
                  </span>
                  <span>R$ {br(p.vPag)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="result-hero">
            <div className="result-label">{c.vNF}</div>
            <div className="result-value">R$ {br(result.totais.vNF)}</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button type="button" className="plink solid" onClick={copy}>
              <Download size={15} /> {c.copy}
            </button>
          </div>
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  DDD — de que estado é esse número                                  */
/* ================================================================== */

const dd = {
  pt: {
    title: "DDD: de que estado é esse número?",
    lead: "O código de área (DDD) é atribuído por região pela Anatel. Digite o DDD e veja o estado e as cidades atendidas — informação útil para conferir cadastro e definir área de atendimento.",
    field: "DDD (2 dígitos)",
    btn: "Consultar",
    loading: "Consultando…",
    invalid: "Informe um DDD com dois dígitos.",
    error: "Não consegui consultar esse DDD agora. Tente de novo.",
    cities: "cidades atendidas",
    list: "Principais municípios",
    cta: "Conferência de telefone no cadastro é parte do que eu implemento em ERP e CRM.",
  },
  en: {
    title: "Brazilian area code lookup (DDD)",
    lead: "Area codes (DDD) are assigned by region by Anatel. Type the code and see the state and served cities — handy for checking records and defining service areas.",
    field: "DDD (2 digits)",
    btn: "Look up",
    loading: "Looking up…",
    invalid: "Enter a two-digit DDD.",
    error: "Couldn't look up that DDD right now. Try again.",
    cities: "cities served",
    list: "Main municipalities",
    cta: "Phone validation at signup is part of what I implement in ERP and CRM.",
  },
};

type DddResult = { ddd: string; state: string | null; cities: string[]; total: number };

function DddTool() {
  const { lang } = useLang();
  const c = dd[lang];
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "invalid" | "error">("idle");
  const [data, setData] = useState<DddResult | null>(null);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    const code = value.replace(/\D/g, "");
    if (code.length !== 2) {
      setState("invalid");
      return;
    }
    setState("loading");
    try {
      const res = await fetch(`/api/brasil?tipo=ddd&q=${code}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <form onSubmit={run} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="field" style={{ flex: "1 1 160px", marginBottom: 0 }}>
          <label htmlFor="ddd">{c.field}</label>
          <input
            id="ddd"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 2))}
            inputMode="numeric"
            autoComplete="off"
            placeholder="11"
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <Search size={16} />}
          {state === "loading" ? c.loading : c.btn}
        </button>
      </form>

      {state === "invalid" && <p className="result-note result-warn">{c.invalid}</p>}
      {state === "error" && <p className="result-note result-warn">{c.error}</p>}

      {state === "done" && data && (
        <div className="result">
          <div className="result-hero">
            <div className="result-label">
              DDD {data.ddd} · {data.state}
            </div>
            <div className="result-value">{data.total}</div>
            <p className="result-note">{c.cities}</p>
          </div>

          {data.cities.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary
                style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 700, fontSize: 14 }}
              >
                {c.list}
              </summary>
              <p className="dns-detail" style={{ marginTop: 10, lineHeight: 1.7 }}>
                {data.cities
                  .map((city) => city.charAt(0) + city.slice(1).toLowerCase())
                  .join(" · ")}
              </p>
            </details>
          )}
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Códigos de bancos (COMPE e ISPB)                                   */
/* ================================================================== */

const bk = {
  pt: {
    title: "Códigos de bancos (COMPE e ISPB)",
    lead: "Digite o código do banco, o ISPB ou parte do nome e veja a instituição. Útil para conferir boleto, DDA, arquivo de remessa e o código que aparece no aplicativo na hora de pagar.",
    field: "Código, ISPB ou nome",
    btn: "Buscar",
    loading: "Buscando…",
    error: "Não consegui consultar a lista de bancos agora. Tente de novo.",
    none: "Nenhum banco encontrado com esse termo.",
    ispb: "ISPB",
    cta: "Conferência de boleto e conciliação bancária fazem parte dos sistemas que eu construo.",
  },
  en: {
    title: "Brazilian bank codes (COMPE and ISPB)",
    lead: "Type the bank code, the ISPB or part of the name and see the institution. Useful to check a boleto, DDA, remittance file and the code shown in the app when you pay.",
    field: "Code, ISPB or name",
    btn: "Search",
    loading: "Searching…",
    error: "Couldn't query the bank list right now. Try again.",
    none: "No bank found for that term.",
    ispb: "ISPB",
    cta: "Boleto checking and bank reconciliation are part of the software I build.",
  },
};

type Bank = { code: number | null; ispb: string; name: string; fullName: string };

function BancosTool() {
  const { lang } = useLang();
  const c = bk[lang];
  const [term, setTerm] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [banks, setBanks] = useState<Bank[]>([]);

  const run = async (e: FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(`/api/brasil?tipo=bancos&q=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error();
      const j = (await res.json()) as { bancos: Bank[] };
      setBanks(j.bancos ?? []);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <form onSubmit={run} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="field" style={{ flex: "1 1 200px", marginBottom: 0 }}>
          <label htmlFor="bank">{c.field}</label>
          <input
            id="bank"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="341 · Itaú · 60701190"
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <Search size={16} />}
          {state === "loading" ? c.loading : c.btn}
        </button>
      </form>

      {state === "error" && <p className="result-note result-warn">{c.error}</p>}
      {state === "done" && banks.length === 0 && <p className="result-note">{c.none}</p>}

      {state === "done" && banks.length > 0 && (
        <div className="result">
          {banks.map((b) => (
            <div className="dns-row" key={b.ispb}>
              <span
                className="dns-name"
                style={{ width: 44, fontFamily: "var(--mono)", color: "var(--accent)" }}
              >
                {b.code ?? "—"}
              </span>
              <span>
                <strong>{b.name}</strong>
                <br />
                <span className="dns-detail">
                  {c.ispb} {b.ispb}
                  {b.fullName && b.fullName !== b.name ? ` · ${b.fullName}` : ""}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Selic, CDI e calculadora de rendimento                             */
/* ================================================================== */

const ta = {
  pt: {
    title: "Selic, CDI e calculadora de rendimento",
    lead: "A taxa do dia vem do Banco Central. Por cima dela, simule quanto rende um valor em juros compostos: informe o valor, a taxa e o prazo e veja o montante, os juros e a taxa efetiva.",
    rates: "Taxas de hoje",
    selic: "Selic (meta)",
    cdi: "CDI",
    ipca: "IPCA (12m)",
    updated: "Atualizado em",
    value: "Valor aplicado (R$)",
    rate: "Taxa (% ao ano)",
    rateHint: "O CDI costuma ser usado como referência: 100% do CDI é a taxa cheia; 110% é acima dela.",
    months: "Prazo (meses)",
    invested: "Valor aplicado",
    total: "Montante final",
    interest: "Juros ganhos",
    effective: "Rentabilidade no período",
    cta: "Modelagem de rendimento e projeção de fluxo de caixa entram em projetos de BI.",
  },
  en: {
    title: "Selic, CDI and compound yield calculator",
    lead: "The daily rate comes from the Central Bank. On top of it, simulate how much a value yields in compound interest: enter the amount, the rate and the term and see the total, the interest and the effective rate.",
    rates: "Today's rates",
    selic: "Selic (target)",
    cdi: "CDI",
    ipca: "IPCA (12m)",
    updated: "Updated on",
    value: "Invested amount (R$)",
    rate: "Rate (% per year)",
    rateHint: "CDI is a common reference: 100% of CDI is the full rate; 110% is above it.",
    months: "Term (months)",
    invested: "Invested",
    total: "Final amount",
    interest: "Interest earned",
    effective: "Return over the period",
    cta: "Yield modelling and cash-flow projection are part of BI projects.",
  },
};

type Taxas = {
  selic: number | null;
  cdi: number | null;
  ipca: number | null;
  selicEfetivaDia: number | null;
  atualizadoEm: string | null;
};

function TaxasTool() {
  const { lang } = useLang();
  const c = ta[lang];
  const [rates, setRates] = useState<Taxas | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [v, setV] = useState({ value: "10000", rate: "13.9", months: "12" });

  const load = async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/brasil?tipo=taxas");
      if (!res.ok) throw new Error();
      setRates(await res.json());
      setLoadState("done");
    } catch {
      setLoadState("error");
    }
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const n = (k: keyof typeof v) => parseFloat(v[k].replace(",", ".")) || 0;
  const set = (k: keyof typeof v) => (e: ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const r = useMemo(() => {
    const principal = n("value");
    const annual = n("rate") / 100;
    const months = Math.max(0, Math.round(n("months")));
    const monthly = Math.pow(1 + annual, 1 / 12) - 1;
    const total = principal * Math.pow(1 + monthly, months);
    const interest = total - principal;
    const eff = principal > 0 ? (total / principal - 1) * 100 : 0;
    return { principal, total, interest, eff };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const apply = (rate: number | null) => {
    if (rate === null) return;
    setV((s) => ({ ...s, rate: String(rate).replace(".", ",") }));
  };

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      {loadState === "done" && rates && (
        <div className="result" style={{ marginBottom: 18 }}>
          <div className="result-row">
            <span>{c.selic}</span>
            <span>{rates.selic !== null ? pct(rates.selic) : "—"}</span>
          </div>
          <div className="result-row">
            <span>{c.cdi}</span>
            <span>{rates.cdi !== null ? pct(rates.cdi) : "—"}</span>
          </div>
          <div className="result-row">
            <span>{c.ipca}</span>
            <span>{rates.ipca !== null ? pct(rates.ipca) : "—"}</span>
          </div>
          {rates.atualizadoEm && (
            <p className="field-hint" style={{ marginTop: 6 }}>
              {c.updated} {rates.atualizadoEm}
            </p>
          )}
        </div>
      )}
      {loadState === "loading" && <p className="result-note">{c.rates}…</p>}
      {loadState === "error" && (
        <p className="result-note result-warn">
          <button type="button" className="plink" onClick={load}>
            {c.rates}: recarregar
          </button>
        </p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="t-value">{c.value}</label>
          <input id="t-value" inputMode="decimal" value={v.value} onChange={set("value")} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="t-rate">{c.rate}</label>
          <input id="t-rate" inputMode="decimal" value={v.rate} onChange={set("rate")} autoComplete="off" />
          <span className="field-hint">{c.rateHint}</span>
        </div>
        <div className="field">
          <label htmlFor="t-months">{c.months}</label>
          <input id="t-months" inputMode="numeric" value={v.months} onChange={set("months")} autoComplete="off" />
        </div>
      </div>

      {rates && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <button type="button" className="plink" onClick={() => apply(rates.selic)}>
            {c.selic}: {rates.selic ?? "—"}%
          </button>
          <button type="button" className="plink" onClick={() => apply(rates.cdi)}>
            {c.cdi}: {rates.cdi ?? "—"}%
          </button>
        </div>
      )}

      <div className="result">
        <div className="result-row">
          <span>{c.invested}</span>
          <span>{money(r.principal)}</span>
        </div>
        <div className="result-row">
          <span>{c.interest}</span>
          <span className={r.interest < 0 ? "result-warn" : undefined}>{money(r.interest)}</span>
        </div>
        <div className="result-row">
          <span>{c.effective}</span>
          <span>{pct(r.eff)}</span>
        </div>
        <div className="result-hero">
          <div className="result-label">{c.total}</div>
          <div className="result-value">{money(r.total)}</div>
        </div>
      </div>

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

export { CpfTool, NfeXmlTool, DddTool, BancosTool, TaxasTool };
