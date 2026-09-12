"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, MessageCircle, Search, X } from "lucide-react";
import { useLang } from "../lib/i18n";
import { WHATSAPP } from "../lib/site";
import { Reveal, Spotlight } from "../components/fx";
import { DeliveryTool, HeadersTool, NfeTool, PixTool } from "./MoreTools";
import { CambioTool, CnpjTool } from "./ApiTools";
import { CepTool, DominioTool, FeriadosTool, FichaTool, IpcaTool, MarkupTool } from "./BizTools";

/* ------------------------------------------------------------------ */

const copy = {
  pt: {
    tag: "Ferramentas gratuitas",
    h1a: "Testa o meu trabalho ",
    h1b: "antes de falar comigo",
    lead: "Site de agência esconde tudo atrás de um formulário de contato. Aqui não. São quatorze ferramentas abertas, de graça e sem cadastro, e o que elas fazem por dentro é o mesmo tipo de coisa que eu entrego cobrando. Usa, testa, e depois você decide se quer conversar.",

    priceTitle: "Calculadora de preço de venda e CMV",
    priceLead:
      "Vender bem e quebrar ao mesmo tempo é comum: quase todo mundo sabe o faturamento, quase ninguém sabe a margem. Preencha o custo do prato e descubra o preço que fecha a margem que você quer.",
    fIngredients: "Custo dos insumos (R$)",
    fLosses: "Perdas e quebras (%)",
    fLabor: "Mão de obra por unidade (R$)",
    fOverhead: "Custo fixo rateado (R$)",
    fCard: "Taxa de cartão / app (%)",
    fTax: "Impostos sobre a venda (%)",
    fMargin: "Margem de lucro desejada (%)",
    fPrice: "Preço que você cobra hoje (R$)",
    rCost: "Custo total do prato",
    rSuggested: "Preço de venda sugerido",
    rCmv: "CMV sobre o preço sugerido",
    rProfit: "Lucro por unidade",
    rCurrent: "Na sua venda de hoje",
    rCurrentMargin: "Margem real hoje",
    warnLoss: "No preço que você cobra hoje você perde dinheiro a cada venda.",
    warnThin: "A margem de hoje está abaixo de 10% — qualquer variação de custo apaga o lucro.",
    okMargin: "A margem de hoje está saudável.",
    hintCard: "iFood costuma ficar entre 12% e 27%. Cartão de crédito, entre 3% e 5%.",

    mailTitle: "Diagnóstico de e-mail do domínio",
    mailLead:
      "Se o seu domínio não tem SPF, DKIM e DMARC configurados, sua proposta comercial tem grande chance de cair no spam do cliente — e você nunca fica sabendo. Digite o domínio e veja em segundos.",
    mailField: "Seu domínio ou e-mail",
    mailBtn: "Analisar",
    mailChecking: "Consultando DNS…",
    mailInvalid: "Domínio inválido. Tente algo como empresa.com.br",
    mailError: "Não consegui consultar esse domínio agora. Tente de novo em instantes.",
    mailNoMx: "Este domínio não tem servidor de e-mail (MX) configurado.",
    spfOk: "SPF configurado — o domínio declara quem pode enviar em nome dele.",
    spfNone: "Sem SPF. Qualquer servidor pode se passar pelo seu domínio.",
    spfSoft: "SPF em modo permissivo (~all): o provedor só marca, não bloqueia a fraude.",
    dkimOk: "DKIM encontrado — as mensagens saem assinadas.",
    dkimNone: "Nenhum DKIM nos seletores mais comuns. Pode existir em seletor personalizado.",
    dmarcOk: "DMARC configurado com política ativa.",
    dmarcNone: "Sem DMARC. Não há política dizendo o que fazer com e-mail falsificado.",
    dmarcWeak: "DMARC com p=none: só monitora, não protege contra falsificação.",
    verdictGood: "Configuração sólida. Seu domínio está autenticado nas três frentes.",
    verdictPartial: "Configuração incompleta. Há brecha para a sua mensagem cair no spam.",
    verdictBad: "Domínio sem autenticação. É o cenário clássico de e-mail indo para o spam.",
    ctaMail:
      "Quer isso corrigido sem você mexer em DNS? Configuração de SPF, DKIM e DMARC está dentro do pacote de gestão de e-mail corporativo.",
    ctaPrice:
      "Quer esse cálculo automático, por prato e ligado ao seu estoque? É exatamente o que o MiseOn faz.",
    ctaLink: "Falar comigo no WhatsApp",
    privacy: "Nada é armazenado. A consulta lê apenas registros públicos de DNS.",
  },
  en: {
    tag: "Free tools",
    h1a: "Tools I opened up ",
    h1b: "for anyone to use",
    lead: "No signup, no email, no catch. They're the pocket version of two things I do under contract — and they let you judge the quality of the work before hiring me.",

    priceTitle: "Selling price & food-cost calculator",
    priceLead:
      "Selling well and going broke at the same time is common: almost everyone knows revenue, almost nobody knows margin. Enter the plate cost and find the price that hits your target margin.",
    fIngredients: "Ingredient cost (R$)",
    fLosses: "Waste and losses (%)",
    fLabor: "Labour per unit (R$)",
    fOverhead: "Allocated fixed cost (R$)",
    fCard: "Card / app fee (%)",
    fTax: "Sales taxes (%)",
    fMargin: "Target profit margin (%)",
    fPrice: "Price you charge today (R$)",
    rCost: "Total plate cost",
    rSuggested: "Suggested selling price",
    rCmv: "Food cost on suggested price",
    rProfit: "Profit per unit",
    rCurrent: "At the price you charge today",
    rCurrentMargin: "Real margin today",
    warnLoss: "At the price you charge today you lose money on every sale.",
    warnThin: "Today's margin is under 10% — any cost swing wipes out the profit.",
    okMargin: "Today's margin is healthy.",
    hintCard: "Delivery apps usually take 12–27%. Credit card, 3–5%.",

    mailTitle: "Domain email diagnosis",
    mailLead:
      "If your domain has no SPF, DKIM and DMARC, your sales proposal has a strong chance of landing in the customer's spam folder — and you never find out. Enter the domain and see in seconds.",
    mailField: "Your domain or email",
    mailBtn: "Analyse",
    mailChecking: "Querying DNS…",
    mailInvalid: "Invalid domain. Try something like company.com",
    mailError: "Couldn't query that domain right now. Try again shortly.",
    mailNoMx: "This domain has no mail server (MX) configured.",
    spfOk: "SPF configured — the domain declares who may send on its behalf.",
    spfNone: "No SPF. Any server can impersonate your domain.",
    spfSoft: "SPF in permissive mode (~all): providers only flag, they don't block the forgery.",
    dkimOk: "DKIM found — messages go out signed.",
    dkimNone: "No DKIM on the most common selectors. It may exist on a custom one.",
    dmarcOk: "DMARC configured with an enforcing policy.",
    dmarcNone: "No DMARC. There's no policy telling receivers what to do with forged mail.",
    dmarcWeak: "DMARC with p=none: monitoring only, no protection against spoofing.",
    verdictGood: "Solid setup. Your domain is authenticated on all three fronts.",
    verdictPartial: "Incomplete setup. There's a gap for your message to land in spam.",
    verdictBad: "Unauthenticated domain. This is the classic email-to-spam scenario.",
    ctaMail:
      "Want this fixed without touching DNS yourself? SPF, DKIM and DMARC setup is part of the corporate email package.",
    ctaPrice:
      "Want this calculated automatically, per dish and wired to your inventory? That's exactly what MiseOn does.",
    ctaLink: "Message me on WhatsApp",
    privacy: "Nothing is stored. The lookup reads public DNS records only.",
  },
};

type Copy = (typeof copy)["pt"];

/* ------------------------------------------------------------------ */
/*  Calculadora de precificação                                        */
/* ------------------------------------------------------------------ */

function money(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")}%`;

function PriceTool({ c }: { c: Copy }) {
  const [v, setV] = useState({
    ingredients: "18",
    losses: "8",
    labor: "6",
    overhead: "4",
    card: "12",
    tax: "6",
    margin: "20",
    price: "45",
  });

  const num = (k: keyof typeof v) => parseFloat(v[k].replace(",", ".")) || 0;
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const r = useMemo(() => {
    const cost =
      num("ingredients") * (1 + num("losses") / 100) + num("labor") + num("overhead");

    // taxas e imposto incidem sobre o preço, não sobre o custo:
    // preço = custo / (1 - taxas% - imposto% - margem%)
    const deductions = (num("card") + num("tax") + num("margin")) / 100;
    const suggested = deductions >= 0.95 ? NaN : cost / (1 - deductions);

    const price = num("price");
    const currentVar = price * ((num("card") + num("tax")) / 100);
    const currentProfit = price - cost - currentVar;
    const currentMargin = price > 0 ? (currentProfit / price) * 100 : 0;

    return {
      cost,
      suggested,
      cmv: Number.isFinite(suggested) && suggested > 0 ? (cost / suggested) * 100 : 0,
      profit: Number.isFinite(suggested) ? suggested - cost - suggested * ((num("card") + num("tax")) / 100) : 0,
      currentProfit,
      currentMargin,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const fields: [keyof typeof v, string, string?][] = [
    ["ingredients", c.fIngredients],
    ["losses", c.fLosses],
    ["labor", c.fLabor],
    ["overhead", c.fOverhead],
    ["card", c.fCard, c.hintCard],
    ["tax", c.fTax],
    ["margin", c.fMargin],
    ["price", c.fPrice],
  ];

  return (
    <Spotlight className="tool-card">
      <h3>{c.priceTitle}</h3>
      <p>{c.priceLead}</p>

      <div className="field-row">
        {fields.map(([k, label, hint]) => (
          <div className="field" key={k}>
            <label htmlFor={`f-${k}`}>{label}</label>
            <input
              id={`f-${k}`}
              inputMode="decimal"
              value={v[k]}
              onChange={set(k)}
              autoComplete="off"
            />
            {hint && <span className="field-hint">{hint}</span>}
          </div>
        ))}
      </div>

      <div className="result">
        <div className="result-row">
          <span>{c.rCost}</span>
          <span>{money(r.cost)}</span>
        </div>
        <div className="result-row">
          <span>{c.rCmv}</span>
          <span>{pct(r.cmv)}</span>
        </div>
        <div className="result-row">
          <span>{c.rProfit}</span>
          <span>{money(r.profit)}</span>
        </div>
        <div className="result-row">
          <span>{c.rCurrentMargin}</span>
          <span className={r.currentMargin < 0 ? "result-warn" : undefined}>
            {pct(r.currentMargin)}
          </span>
        </div>

        <div className="result-hero">
          <div className="result-label">{c.rSuggested}</div>
          <div className="result-value">
            {Number.isFinite(r.suggested) ? money(r.suggested) : "—"}
          </div>
        </div>

        <p
          className={`result-note ${
            r.currentMargin < 0 ? "result-warn" : r.currentMargin < 10 ? "result-warn" : "result-ok"
          }`}
        >
          {r.currentMargin < 0 ? c.warnLoss : r.currentMargin < 10 ? c.warnThin : c.okMargin}
        </p>
      </div>

      <div className="tool-cta">
        {c.ctaPrice}{" "}
        <a href="https://miseon.app.br" target="_blank" rel="noopener noreferrer">
          miseon.app.br ↗
        </a>
      </div>
    </Spotlight>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagnóstico de e-mail                                              */
/* ------------------------------------------------------------------ */

type DnsResult = {
  domain: string;
  mx: string[];
  spf: string | null;
  spfAll: string | null;
  dmarc: string | null;
  dmarcPolicy: string | null;
  dkim: { selector: string; provider: string }[];
};

function Row({ ok, name, text, detail }: { ok: boolean | "warn"; name: string; text: string; detail?: string }) {
  return (
    <div className="dns-row">
      <span style={{ color: ok === true ? "var(--accent)" : ok === "warn" ? "var(--gold)" : "#EF4444", flexShrink: 0, marginTop: 2 }}>
        {ok === true ? <Check size={18} /> : ok === "warn" ? <AlertTriangle size={17} /> : <X size={18} />}
      </span>
      <span className="dns-name">{name}</span>
      <span>
        {text}
        {detail && (
          <>
            <br />
            <span className="dns-detail">
              <code>{detail}</code>
            </span>
          </>
        )}
      </span>
    </div>
  );
}

function MailTool({ c }: { c: Copy }) {
  const [domain, setDomain] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "invalid">("idle");
  const [data, setData] = useState<DnsResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setState("loading");
    try {
      const r = await fetch(`/api/dns?domain=${encodeURIComponent(domain)}`);
      if (r.status === 400) {
        setState("invalid");
        return;
      }
      if (!r.ok) throw new Error();
      setData(await r.json());
      setState("done");
    } catch {
      setState("error");
    }
  };

  const spfOk = !!data?.spf;
  const spfStrict = data?.spfAll === "-all";
  const dkimOk = (data?.dkim.length ?? 0) > 0;
  const dmarcOk = !!data?.dmarc && data.dmarcPolicy !== "none";
  const score = [spfOk, dkimOk, dmarcOk].filter(Boolean).length;

  return (
    <Spotlight className="tool-card">
      <h3>{c.mailTitle}</h3>
      <p>{c.mailLead}</p>

      <form onSubmit={run}>
        <div className="field">
          <label htmlFor="dom">{c.mailField}</label>
          <input
            id="dom"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="empresa.com.br"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="plink solid" disabled={state === "loading"}>
          {state === "loading" ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          {state === "loading" ? c.mailChecking : c.mailBtn}
        </button>
      </form>

      {state === "invalid" && <p className="result-note result-warn">{c.mailInvalid}</p>}
      {state === "error" && <p className="result-note result-warn">{c.mailError}</p>}

      {state === "done" && data && (
        <div className="result">
          <Row
            ok={data.mx.length > 0}
            name="MX"
            text={data.mx.length > 0 ? data.mx.slice(0, 2).join(", ") : c.mailNoMx}
          />
          <Row
            ok={spfOk ? (spfStrict ? true : "warn") : false}
            name="SPF"
            text={spfOk ? (spfStrict ? c.spfOk : c.spfSoft) : c.spfNone}
            detail={data.spf ?? undefined}
          />
          <Row
            ok={dkimOk}
            name="DKIM"
            text={dkimOk ? `${c.dkimOk} (${data.dkim.map((d) => d.provider).join(", ")})` : c.dkimNone}
          />
          <Row
            ok={dmarcOk ? true : data.dmarc ? "warn" : false}
            name="DMARC"
            text={dmarcOk ? c.dmarcOk : data.dmarc ? c.dmarcWeak : c.dmarcNone}
            detail={data.dmarc ?? undefined}
          />

          <div className="result-hero">
            <div className="result-label">{data.domain}</div>
            <div className="result-value">{score}/3</div>
            <p className={`result-note ${score === 3 ? "result-ok" : "result-warn"}`}>
              {score === 3 ? c.verdictGood : score >= 1 ? c.verdictPartial : c.verdictBad}
            </p>
          </div>

          <p className="field-hint" style={{ marginTop: 14 }}>
            {c.privacy}
          </p>
        </div>
      )}

      <div className="tool-cta">
        {c.ctaMail}{" "}
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          {c.ctaLink} ↗
        </a>
      </div>
    </Spotlight>
  );
}

/* ------------------------------------------------------------------ */

export default function FerramentasClient() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.tag}</div>
            <h1>
              {c.h1a}
              <span className="hl">{c.h1b}</span>
            </h1>
            <p className="hero-lead">{c.lead}</p>
          </Reveal>
        </div>
      </header>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tools-grid">
            <div id="nfe">
              <NfeTool />
            </div>
            <div id="pix">
              <PixTool />
            </div>
            <div id="email">
              <MailTool c={c} />
            </div>
            <div id="headers">
              <HeadersTool />
            </div>
            <div id="preco">
              <PriceTool c={c} />
            </div>
            <div id="delivery">
              <DeliveryTool />
            </div>
            <div id="cnpj">
              <CnpjTool />
            </div>
            <div id="cambio">
              <CambioTool />
            </div>
            <div id="dominio">
              <DominioTool />
            </div>
            <div id="cep">
              <CepTool />
            </div>
            <div id="ipca">
              <IpcaTool />
            </div>
            <div id="feriados">
              <FeriadosTool />
            </div>
            <div id="ficha">
              <FichaTool />
            </div>
            <div id="markup">
              <MarkupTool />
            </div>
          </div>

          <div className="cta-row" style={{ marginTop: 40, marginBottom: 0 }}>
            <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> {c.ctaLink}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
