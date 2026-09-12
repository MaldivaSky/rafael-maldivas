"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, Search, ShieldCheck, X } from "lucide-react";
import { useLang } from "../lib/i18n";
import { analyzeNfeKey, analyzePix, EMV_LABELS } from "../lib/fiscal";
import { Spotlight } from "../components/fx";

const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;

function Mark({ ok }: { ok: boolean | "warn" }) {
  const color = ok === true ? "var(--accent)" : ok === "warn" ? "var(--gold)" : "#EF4444";
  return (
    <span style={{ color, flexShrink: 0, marginTop: 2, display: "inline-flex" }}>
      {ok === true ? <Check size={18} /> : ok === "warn" ? <AlertTriangle size={17} /> : <X size={18} />}
    </span>
  );
}

/* ================================================================== */
/*  Decodificador de chave de acesso NF-e / NFC-e                      */
/* ================================================================== */

const nf = {
  pt: {
    title: "Decodificador de chave de acesso NF-e / NFC-e",
    lead: "Os 44 dígitos impressos no rodapé do cupom não são um número aleatório: carregam UF, CNPJ do emitente, modelo, série, número e um dígito verificador por módulo 11. Cole a chave e leia o que ela diz.",
    field: "Chave de acesso (44 dígitos)",
    hint: "Aceita com ou sem espaços. Fica tudo no seu navegador — nada é enviado.",
    short: "A chave precisa ter 44 dígitos. Você informou",
    valid: "Chave íntegra",
    invalid: "Chave inconsistente",
    uf: "UF do emitente",
    emission: "Mês/ano de emissão",
    cnpj: "CNPJ do emitente",
    model: "Modelo do documento",
    serie: "Série",
    number: "Número da nota",
    tp: "Forma de emissão",
    dv: "Dígito verificador (módulo 11)",
    dvOk: "confere",
    dvBad: "não confere — esperado",
    cnpjOk: "CNPJ válido",
    cnpjBad: "CNPJ com dígito inválido",
    cta: "Emissão de NFC-e em PDV, contingência offline e conferência de chave são parte do mercadinhosys e do MiseOn.",
  },
  en: {
    title: "Brazilian e-invoice key decoder (NF-e / NFC-e)",
    lead: "The 44 digits printed on a Brazilian receipt aren't random: they encode state, issuer tax ID, document model, series, number and a modulo-11 check digit. Paste the key and read what it says.",
    field: "Access key (44 digits)",
    hint: "Spaces are fine. Everything runs in your browser — nothing is sent.",
    short: "The key must have 44 digits. You entered",
    valid: "Key is consistent",
    invalid: "Key is inconsistent",
    uf: "Issuer state",
    emission: "Issue month/year",
    cnpj: "Issuer tax ID",
    model: "Document model",
    serie: "Series",
    number: "Invoice number",
    tp: "Emission mode",
    dv: "Check digit (modulo 11)",
    dvOk: "matches",
    dvBad: "mismatch — expected",
    cnpjOk: "valid tax ID",
    cnpjBad: "tax ID check digit invalid",
    cta: "NFC-e issuing at the POS, offline contingency and key verification are part of mercadinhosys and MiseOn.",
  },
};

function NfeTool() {
  const { lang } = useLang();
  const c = nf[lang];
  const [key, setKey] = useState("35260968923239000177650010000001231123456782");
  const r = useMemo(() => analyzeNfeKey(key), [key]);

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field">
        <label htmlFor="nfe">{c.field}</label>
        <input
          id="nfe"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          inputMode="numeric"
          spellCheck={false}
          autoComplete="off"
          style={{ fontFamily: "var(--mono)", fontSize: 14, letterSpacing: "0.02em" }}
        />
        <span className="field-hint">{c.hint}</span>
      </div>

      {r.reason === "length" ? (
        <p className="result-note result-warn">
          {c.short} {r.length}.
        </p>
      ) : (
        <div className="result">
          {(
            [
              [c.uf, `${r.uf} (${r.cUF})`, !!r.uf],
              [c.emission, r.emission ?? "—", !!r.emission],
              [c.cnpj, `${r.cnpj} · ${r.cnpjValid ? c.cnpjOk : c.cnpjBad}`, r.cnpjValid],
              [c.model, r.modelo, r.mod === "55" || r.mod === "65"],
              [c.serie, r.serie, true],
              [c.number, r.numero, true],
              [c.tp, r.tipoEmissao, true],
              [
                c.dv,
                r.dvValid ? `${r.cDV} · ${c.dvOk}` : `${r.cDV} · ${c.dvBad} ${r.expectedDv}`,
                r.dvValid,
              ],
            ] as [string, string, boolean][]
          ).map(([label, value, ok]) => (
            <div className="dns-row" key={label}>
              <Mark ok={ok} />
              <span className="dns-name" style={{ width: 150 }}>
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}

          <div className="result-hero">
            <div className="result-label">{r.valid ? c.valid : c.invalid}</div>
            <div className="result-value">{r.valid ? "OK" : "!"}</div>
          </div>
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Leitor e validador de Pix Copia e Cola                             */
/* ================================================================== */

const px = {
  pt: {
    title: "Leitor e validador de Pix Copia e Cola",
    lead: "O código Pix é um payload EMV: campos aninhados em TLV, fechados por um CRC16-CCITT. Cole o copia e cola e veja para quem vai o dinheiro, quanto, e se o código está íntegro antes de pagar.",
    field: "Código Pix copia e cola",
    hint: "O parse roda no seu navegador. Nenhum código é enviado ou registrado.",
    empty: "Cole um código Pix para analisar.",
    crcOk: "CRC16 confere — código íntegro",
    crcBad: "CRC16 não confere — código adulterado ou incompleto. Esperado",
    key: "Chave Pix do recebedor",
    name: "Recebedor",
    city: "Cidade",
    amount: "Valor",
    amountFree: "Livre — quem paga digita o valor",
    txid: "Identificador da transação",
    kind: "Tipo",
    staticQr: "Estático (reutilizável)",
    dynamicQr: "Dinâmico (uso único)",
    fields: "Campos do payload",
    cta: "Conciliação de Pix, split de recebimento e baixa automática no pedido são o que eu implemento no MySuperStore e no MiseOn.",
  },
  en: {
    title: "Pix copy-and-paste reader and validator",
    lead: "A Pix code is an EMV payload: nested TLV fields closed by a CRC16-CCITT. Paste the code and see who gets the money, how much, and whether the payload is intact before paying.",
    field: "Pix copy-and-paste code",
    hint: "Parsing runs in your browser. No code is sent or logged.",
    empty: "Paste a Pix code to analyse.",
    crcOk: "CRC16 matches — payload intact",
    crcBad: "CRC16 mismatch — payload tampered with or truncated. Expected",
    key: "Recipient Pix key",
    name: "Recipient",
    city: "City",
    amount: "Amount",
    amountFree: "Open — the payer types the amount",
    txid: "Transaction id",
    kind: "Type",
    staticQr: "Static (reusable)",
    dynamicQr: "Dynamic (single use)",
    fields: "Payload fields",
    cta: "Pix reconciliation, receipt splitting and automatic order settlement are what I implement in MySuperStore and MiseOn.",
  },
};

const SAMPLE_PIX =
  "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Maldivas Tech6009Sao Paulo62070503***630489F5";

function PixTool() {
  const { lang } = useLang();
  const c = px[lang];
  const [code, setCode] = useState(SAMPLE_PIX);
  const r = useMemo(() => analyzePix(code), [code]);

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>

      <div className="field">
        <label htmlFor="pix">{c.field}</label>
        <input
          id="pix"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          style={{ fontFamily: "var(--mono)", fontSize: 13 }}
        />
        <span className="field-hint">{c.hint}</span>
      </div>

      {!r ? (
        <p className="result-note">{c.empty}</p>
      ) : (
        <div className="result">
          {(
            [
              [c.key, r.pixKey ?? "—", !!r.pixKey],
              [c.name, r.name ?? "—", !!r.name],
              [c.city, r.city ?? "—", !!r.city],
              [c.amount, r.amount ? money(r.amount) : c.amountFree, true],
              [c.txid, r.txid && r.txid !== "***" ? r.txid : "—", true],
              [c.kind, r.isStatic ? c.staticQr : c.dynamicQr, true],
            ] as [string, string, boolean][]
          ).map(([label, value, ok]) => (
            <div className="dns-row" key={label}>
              <Mark ok={ok} />
              <span className="dns-name" style={{ width: 150 }}>
                {label}
              </span>
              <span style={{ wordBreak: "break-all" }}>{value}</span>
            </div>
          ))}

          <div className="result-hero">
            <div className="result-label">CRC16-CCITT</div>
            <div className="result-value">{r.crcDeclared ?? "—"}</div>
            <p className={`result-note ${r.crcValid ? "result-ok" : "result-warn"}`}>
              {r.crcValid ? c.crcOk : `${c.crcBad} ${r.crcExpected}`}
            </p>
          </div>

          <details style={{ marginTop: 18 }}>
            <summary style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>
              {c.fields} ({r.tags.length})
            </summary>
            <div style={{ marginTop: 12 }}>
              {r.tags.map((t) => (
                <div className="dns-row" key={t.id}>
                  <span className="dns-name" style={{ width: 44, fontFamily: "var(--mono)" }}>
                    {t.id}
                  </span>
                  <span>
                    {EMV_LABELS[t.id] ?? "—"}
                    <br />
                    <span className="dns-detail">
                      <code>{t.value.length > 90 ? `${t.value.slice(0, 90)}…` : t.value}</code>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="tool-cta">{c.cta}</div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Auditor de cabeçalhos de segurança HTTP                            */
/* ================================================================== */

const hd = {
  pt: {
    title: "Auditor de cabeçalhos de segurança HTTP",
    lead: "Sete cabeçalhos separam um site que resiste a XSS e clickjacking de um que só parece seguro por ter cadeado. Informe o domínio e receba a nota, campo a campo, com o que cada um evita.",
    field: "Domínio do site",
    btn: "Auditar",
    loading: "Analisando resposta…",
    invalid: "Endereço inválido. Use algo como empresa.com.br",
    blocked: "Endereço interno não é auditável por aqui.",
    unreachable: "Não consegui alcançar esse endereço. Verifique o domínio.",
    score: "Nota de segurança",
    served: "Respondido por",
    cta: "Endurecimento de cabeçalhos, CSP e HSTS entram no pacote de manutenção de site.",
  },
  en: {
    title: "HTTP security header audit",
    lead: "Seven headers separate a site that resists XSS and clickjacking from one that merely looks safe because it has a padlock. Enter the domain and get a graded, field-by-field report.",
    field: "Site domain",
    btn: "Audit",
    loading: "Analysing response…",
    invalid: "Invalid address. Use something like company.com",
    blocked: "Internal addresses can't be audited here.",
    unreachable: "Couldn't reach that address. Check the domain.",
    score: "Security grade",
    served: "Served by",
    cta: "Header hardening, CSP and HSTS are part of the website maintenance package.",
  },
};

type HeaderCheck = {
  id: string;
  header: string;
  present: boolean;
  value: string | null;
  level: "ok" | "warn" | "fail";
  title: { pt: string; en: string };
  detail: { pt: string; en: string };
};

function HeadersTool() {
  const { lang } = useLang();
  const c = hd[lang];
  const [domain, setDomain] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "invalid" | "blocked" | "error">("idle");
  const [data, setData] = useState<{
    url: string;
    grade: string;
    score: number;
    server: string | null;
    checks: HeaderCheck[];
  } | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setState("loading");
    try {
      const res = await fetch(`/api/headers?domain=${encodeURIComponent(domain)}`);
      if (res.status === 400) {
        const j = await res.json();
        setState(j.error === "blocked_host" ? "blocked" : "invalid");
        return;
      }
      if (!res.ok) {
        setState("error");
        return;
      }
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

      <form onSubmit={run}>
        <div className="field">
          <label htmlFor="hdr">{c.field}</label>
          <input
            id="hdr"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="empresa.com.br"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} /> : <Search size={16} />}
          {state === "loading" ? c.loading : c.btn}
        </button>
      </form>

      {state === "invalid" && <p className="result-note result-warn">{c.invalid}</p>}
      {state === "blocked" && <p className="result-note result-warn">{c.blocked}</p>}
      {state === "error" && <p className="result-note result-warn">{c.unreachable}</p>}

      {state === "done" && data && (
        <div className="result">
          {data.checks.map((chk) => (
            <div className="dns-row" key={chk.id}>
              <Mark ok={chk.level === "ok" ? true : chk.level === "warn" ? "warn" : false} />
              <span>
                <strong>{chk.title[lang]}</strong>
                <br />
                <span className="dns-detail">{chk.detail[lang]}</span>
                {chk.value && (
                  <>
                    <br />
                    <span className="dns-detail">
                      <code>
                        {chk.header}: {chk.value}
                      </code>
                    </span>
                  </>
                )}
              </span>
            </div>
          ))}

          <div className="result-hero">
            <div className="result-label">
              {c.score} · {data.url}
            </div>
            <div className="result-value">
              {data.grade} <span style={{ fontSize: 20, opacity: 0.7 }}>({data.score}/100)</span>
            </div>
            {data.server && (
              <p className="result-note">
                {c.served} <code>{data.server}</code>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="tool-cta">
        <ShieldCheck size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
        {c.cta}
      </div>
    </Spotlight>
  );
}

/* ================================================================== */
/*  Simulador de margem por canal de venda                             */
/* ================================================================== */

const dl = {
  pt: {
    title: "Simulador de margem por canal de venda",
    lead: "O mesmo prato vendido no iFood, no seu site e no balcão deixa três lucros bem diferentes. Veja quanto sobra em cada canal, lado a lado, e quanto a comissão custa por mês.",
    price: "Preço do pedido (R$)",
    cost: "Custo do produto (R$)",
    pack: "Embalagem por pedido (R$)",
    ifood: "Comissão iFood (%)",
    nine: "Comissão 99Food (%)",
    own: "Taxa do seu canal próprio (%)",
    volume: "Pedidos por mês nesse canal",
    ownName: "Canal próprio (site/WhatsApp)",
    counter: "Balcão (sem taxa)",
    note: "Diferença entre o melhor e o pior canal, no mês:",
    cta: "Vender no canal próprio e receber o pedido do iFood na mesma fila é exatamente o que o MiseOn faz — integração homologada nas duas pontas.",
  },
  en: {
    title: "Margin simulator by sales channel",
    lead: "The same dish sold on a delivery app, on your own site and at the counter leaves three very different profits. See what's left per channel, side by side, and what the commission costs per month.",
    price: "Order price (R$)",
    cost: "Product cost (R$)",
    pack: "Packaging per order (R$)",
    ifood: "iFood commission (%)",
    nine: "99Food commission (%)",
    own: "Your own channel fee (%)",
    volume: "Orders per month in that channel",
    ownName: "Own channel (site/WhatsApp)",
    counter: "Counter (no fee)",
    note: "Gap between best and worst channel, per month:",
    cta: "Selling on your own channel while receiving delivery-app orders in the same queue is exactly what MiseOn does — approved integration on both ends.",
  },
};

function DeliveryTool() {
  const { lang } = useLang();
  const c = dl[lang];
  const [v, setV] = useState({
    price: "60", cost: "22", pack: "3", ifood: "23", nine: "18", own: "1.5", volume: "400",
  });
  const n = (k: keyof typeof v) => parseFloat(v[k].replace(",", ".")) || 0;
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const rows = useMemo(() => {
    const base = n("cost") + n("pack");
    const make = (name: string, rate: number) => {
      const fee = n("price") * (rate / 100);
      const net = n("price") - base - fee;
      return { name, rate, net, margin: n("price") > 0 ? (net / n("price")) * 100 : 0 };
    };
    return [
      make("iFood", n("ifood")),
      make("99Food", n("nine")),
      make(c.ownName, n("own")),
      make(c.counter, 0),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, lang]);

  const spread = (Math.max(...rows.map((r) => r.net)) - Math.min(...rows.map((r) => r.net))) * n("volume");

  const fields: [keyof typeof v, string][] = [
    ["price", c.price], ["cost", c.cost], ["pack", c.pack],
    ["ifood", c.ifood], ["nine", c.nine], ["own", c.own], ["volume", c.volume],
  ];

  return (
    <Spotlight className="tool-card">
      <h3>{c.title}</h3>
      <p>{c.lead}</p>
      <div className="field-row">
        {fields.map(([k, label]) => (
          <div className="field" key={k}>
            <label htmlFor={`d-${k}`}>{label}</label>
            <input id={`d-${k}`} inputMode="decimal" value={v[k]} onChange={set(k)} autoComplete="off" />
          </div>
        ))}
      </div>

      <div className="result">
        {rows.map((r) => (
          <div className="result-row" key={r.name}>
            <span>
              {r.name} · {pct(r.rate)}
            </span>
            <span className={r.net < 0 ? "result-warn" : undefined}>
              {money(r.net)} · {pct(r.margin)}
            </span>
          </div>
        ))}
        <div className="result-hero">
          <div className="result-label">{c.note}</div>
          <div className="result-value">{money(spread)}</div>
        </div>
      </div>

      <div className="tool-cta">
        {c.cta}{" "}
        <a href="https://miseon.app.br" target="_blank" rel="noopener noreferrer">
          miseon.app.br ↗
        </a>
      </div>
    </Spotlight>
  );
}

export { NfeTool, PixTool, HeadersTool, DeliveryTool };
