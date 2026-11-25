"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { useLang } from "../lib/i18n";
import { analyzeTemplate } from "../lib/template-analyzer";

/* ======================= 1. Analisador de template ======================= */

const KIND_LABEL = {
  promo: { pt: "Promoção", en: "Promotion" },
  urgencia: { pt: "Urgência", en: "Urgency" },
  venda: { pt: "Chamada de compra", en: "Call to buy" },
  pontuacao: { pt: "Pontuação", en: "Punctuation" },
  emoji: { pt: "Emoji de oferta", en: "Offer emoji" },
} as const;

export function TemplateAnalyzerTool() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [text, setText] = useState(
    pt
      ? "Olá {{1}}! Seu pedido {{2}} foi confirmado. Aproveite e use o cupom VOLTA10 com 10% de desconto na próxima compra!!"
      : "Olá {{1}}! Seu pedido {{2}} foi confirmado. Aproveite e use o cupom VOLTA10 com 10% de desconto na próxima compra!!",
  );
  const v = useMemo(() => analyzeTemplate(text), [text]);

  // destaca os gatilhos no texto original
  const highlighted = useMemo(() => {
    const out: (string | { m: string })[] = [];
    let last = 0;
    for (const t of v.triggers) {
      if (t.index < last) continue;
      out.push(text.slice(last, t.index), { m: t.match });
      last = t.index + t.match.length;
    }
    out.push(text.slice(last));
    return out;
  }, [text, v.triggers]);

  const cls = v.risk === "alto" ? "is-bad" : v.risk === "medio" ? "is-warn" : "is-ok";
  const title =
    v.risk === "alto"
      ? pt ? "Alto risco de virar marketing (R$ 0,3217)" : "High risk of becoming marketing (BRL 0.3217)"
      : v.risk === "medio"
        ? pt ? "Risco moderado — revise antes de enviar" : "Moderate risk — review before submitting"
        : pt ? "Cara de utilidade (R$ 0,035)" : "Looks like utility (BRL 0.035)";

  return (
    <div className="devtool">
      <div>
        <label htmlFor="wt-text">{pt ? "Texto do template" : "Template text"}</label>
        <textarea id="wt-text" value={text} onChange={(e) => setText(e.target.value)} maxLength={1024} />
      </div>
      <div className={`devtool-verdict ${cls}`} aria-live="polite">
        <strong>{title}</strong>
        <p>
          {pt ? "Pontuação heurística" : "Heuristic score"}: {v.score} · {v.triggers.length} {pt ? "gatilho(s)" : "trigger(s)"}
        </p>
        {v.triggers.length > 0 && (
          <ul>
            {v.triggers.map((t, i) => (
              <li key={i}>
                <b>{KIND_LABEL[t.kind][lang]}</b> “{t.match}” — {t.tip}
              </li>
            ))}
          </ul>
        )}
      </div>
      {v.triggers.length > 0 && (
        <>
          <div>
            <label>{pt ? "Onde estão os gatilhos" : "Where the triggers are"}</label>
            <p className="devtool-verdict" style={{ whiteSpace: "pre-wrap" }}>
              {highlighted.map((h, i) => (typeof h === "string" ? h : <mark key={i}>{h.m}</mark>))}
            </p>
          </div>
          <div>
            <label htmlFor="wt-sug">{pt ? "Sugestão de reescrita neutra (revise o sentido)" : "Neutral rewrite suggestion (check the meaning)"}</label>
            <textarea id="wt-sug" readOnly value={v.suggestion} style={{ minHeight: 90 }} />
          </div>
        </>
      )}
      <p className="atol-fine">
        {pt
          ? "Heurística local, roda só no navegador. A categoria final é definida pela revisão da Meta."
          : "Local heuristic, runs only in your browser. Meta's review sets the final category."}
      </p>
    </div>
  );
}

/* ======================= 2. Validador HMAC-SHA256 ======================= */

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

/** comparação em tempo constante (não vaza o prefixo correto por timing) */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function HmacValidatorTool() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [mode, setMode] = useState<"atol" | "meta">("atol");
  const [secret, setSecret] = useState("whsec_teste_123");
  const [timestamp, setTimestamp] = useState("1795964645");
  const [body, setBody] = useState('{"event":"message.status","created_at":"2026-11-24T15:04:05.000Z","data":{"status":"delivered"}}');
  const [header, setHeader] = useState("");
  const [expected, setExpected] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!secret) {
      setExpected("");
      return;
    }
    if (typeof crypto === "undefined" || !crypto.subtle) {
      setErr(pt ? "Web Crypto indisponível (use HTTPS ou um navegador atualizado)." : "Web Crypto unavailable (use HTTPS or a modern browser).");
      return;
    }
    const msg = mode === "atol" ? `${timestamp}.${body}` : body;
    hmacHex(secret, msg)
      .then((h) => alive && (setExpected(`sha256=${h}`), setErr(null)))
      .catch(() => alive && setErr(pt ? "Falha ao calcular o HMAC." : "Failed to compute HMAC."));
    return () => {
      alive = false;
    };
  }, [secret, body, timestamp, mode, pt]);

  const given = header.trim().replace(/^x-(hub|atol)-signature(-256)?:\s*/i, "");
  const normalized = given && !given.startsWith("sha256=") ? `sha256=${given}` : given;
  const valid = normalized && expected ? safeEqual(normalized.toLowerCase(), expected) : null;
  const age = mode === "atol" && /^\d+$/.test(timestamp) ? Math.abs(Date.now() / 1000 - Number(timestamp)) : 0;

  return (
    <div className="devtool">
      <div className="tco-mode" role="group" aria-label={pt ? "Formato" : "Format"}>
        <button type="button" aria-pressed={mode === "atol"} className={mode === "atol" ? "is-on" : ""} onClick={() => setMode("atol")}>
          Atol Connect · X-Atol-Signature
        </button>
        <button type="button" aria-pressed={mode === "meta"} className={mode === "meta" ? "is-on" : ""} onClick={() => setMode("meta")}>
          Meta · X-Hub-Signature-256
        </button>
      </div>
      <div>
        <label htmlFor="hm-secret">{mode === "atol" ? (pt ? "Segredo do endpoint (whsec_…)" : "Endpoint secret (whsec_…)") : pt ? "App Secret da Meta" : "Meta App Secret"}</label>
        <input id="hm-secret" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="off" spellCheck={false} />
      </div>
      {mode === "atol" && (
        <div>
          <label htmlFor="hm-ts">X-Atol-Timestamp</label>
          <input id="hm-ts" type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value.trim())} inputMode="numeric" />
        </div>
      )}
      <div>
        <label htmlFor="hm-body">{pt ? "Corpo bruto (raw body, exatamente como chegou)" : "Raw body (exactly as received)"}</label>
        <textarea id="hm-body" value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} />
      </div>
      <div>
        <label htmlFor="hm-header">{pt ? "Header de assinatura recebido" : "Signature header received"}</label>
        <input id="hm-header" type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="sha256=…" spellCheck={false} />
      </div>
      <div className={`devtool-verdict ${valid === null ? "" : valid ? "is-ok" : "is-bad"}`} aria-live="polite">
        <strong>
          {valid === null
            ? pt ? "Cole o header para validar" : "Paste the header to validate"
            : valid
              ? pt ? "Assinatura válida ✓" : "Valid signature ✓"
              : pt ? "Assinatura NÃO confere" : "Signature does NOT match"}
        </strong>
        <p style={{ wordBreak: "break-all", fontFamily: "var(--mono)", fontSize: 12.5 }}>
          {pt ? "Esperado" : "Expected"}: {expected || "—"}
        </p>
        {mode === "atol" && age > 300 && (
          <p>{pt ? "⚠ Timestamp com mais de 5 min de diferença: em produção, rejeite (proteção contra replay)." : "⚠ Timestamp more than 5 min off: reject in production (replay protection)."}</p>
        )}
        {valid === false && (
          <p>{pt ? "Causa nº 1: o corpo foi re-serializado (JSON.parse + stringify). Use os bytes exatos recebidos." : "Top cause: the body was re-serialized (JSON.parse + stringify). Use the exact bytes received."}</p>
        )}
        {err && <p className="atol-err">{err}</p>}
      </div>
      <p className="atol-fine">{pt ? "Cálculo 100% local (Web Crypto API). Prefira segredos de homologação." : "100% local computation (Web Crypto API). Prefer staging secrets."}</p>
    </div>
  );
}

/* =================== 3. Checklist de migração QR → Cloud API =================== */

type Item = { id: string; t: { pt: string; en: string }; d: { pt: string; en: string } };
const PHASES: { name: { pt: string; en: string }; items: Item[] }[] = [
  {
    name: { pt: "Antes de migrar", en: "Before migrating" },
    items: [
      { id: "inv", t: { pt: "Inventário de números e fluxos", en: "Inventory numbers and flows" }, d: { pt: "Liste cada número na API por QR Code e o que dispara mensagem (ERP, loja, bot).", en: "List each QR-code number and what triggers messages (ERP, store, bot)." } },
      { id: "cat", t: { pt: "Separar utilidade de marketing", en: "Split utility from marketing" }, d: { pt: "Avisos de pedido/agenda/cobrança = utilidade (R$ 0,035). Promoções = marketing (R$ 0,3217) com opt-in.", en: "Order/appointment/billing notices = utility (BRL 0.035). Promotions = marketing (BRL 0.3217) with opt-in." } },
      { id: "bm", t: { pt: "Business Manager verificado", en: "Verified Business Manager" }, d: { pt: "Portfólio Meta da empresa com CNPJ, domínio e forma de pagamento cadastrada.", en: "Company Meta portfolio with tax ID, domain and payment method." } },
      { id: "optin", t: { pt: "Base de opt-in registrada", en: "Opt-in base recorded" }, d: { pt: "Data e origem do consentimento de cada contato que recebe marketing (LGPD).", en: "Date and source of consent for every marketing contact (LGPD)." } },
    ],
  },
  {
    name: { pt: "Conexão oficial", en: "Official connection" },
    items: [
      { id: "mode", t: { pt: "Escolher Coexistência ou API dedicada", en: "Pick Coexistence or dedicated API" }, d: { pt: "Coexistência mantém o app no celular (respostas a R$ 0,00). Dedicada é para alto volume/ERP.", en: "Coexistence keeps the phone app (replies at BRL 0.00). Dedicated suits high volume/ERP." } },
      { id: "signup", t: { pt: "Embedded Signup concluído", en: "Embedded Signup completed" }, d: { pt: "Número conectado pelo fluxo oficial da Meta, sem QR Code.", en: "Number connected through Meta's official flow, no QR code." } },
      { id: "tpl", t: { pt: "Templates enviados e aprovados", en: "Templates submitted and approved" }, d: { pt: "Reescreva os textos ativos como templates; teste no analisador de utilidade x marketing.", en: "Rewrite outbound texts as templates; check them in the utility vs marketing analyzer." } },
    ],
  },
  {
    name: { pt: "Integração", en: "Integration" },
    items: [
      { id: "endpoint", t: { pt: "Trocar o endpoint no ERP", en: "Swap the ERP endpoint" }, d: { pt: "POST /api/v1/messages com Authorization: Bearer e Idempotency-Key por evento.", en: "POST /api/v1/messages with Authorization: Bearer and one Idempotency-Key per event." } },
      { id: "hook", t: { pt: "Validar webhooks HMAC", en: "Validate HMAC webhooks" }, d: { pt: "Confira X-Atol-Signature sobre `${timestamp}.${corpo}` e rejeite timestamp > 5 min.", en: "Check X-Atol-Signature over `${timestamp}.${body}` and reject timestamps > 5 min." } },
      { id: "window", t: { pt: "Tratar a janela de 24h", en: "Handle the 24h window" }, d: { pt: "Fora da janela, só template. Trate o erro 131047 oferecendo um template ao atendente.", en: "Outside the window, templates only. Handle error 131047 by offering a template to the agent." } },
    ],
  },
  {
    name: { pt: "Virada", en: "Cutover" },
    items: [
      { id: "pilot", t: { pt: "Piloto de 1 dia sem erro", en: "1-day error-free pilot" }, d: { pt: "Rode os fluxos reais no número oficial e acompanhe entregas no painel.", en: "Run real flows on the official number and watch deliveries in the dashboard." } },
      { id: "off", t: { pt: "Encerrar a sessão por QR Code", en: "Close the QR-code session" }, d: { pt: "Desligue a API antiga para não haver envio duplicado nem conflito de sessão.", en: "Turn off the old API to avoid duplicate sends and session conflicts." } },
      { id: "quality", t: { pt: "Monitorar Quality Rating", en: "Monitor Quality Rating" }, d: { pt: "Acompanhe a nota do número na Meta nas primeiras semanas e respeite pedidos de saída.", en: "Watch the number's rating at Meta in the first weeks and honor opt-outs." } },
    ],
  },
];
const ALL_IDS = PHASES.flatMap((p) => p.items.map((i) => i.id));
const STORE = "mt_migracao_qr_cloud_v1";

export function MigrationChecklistTool() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [done, setDone] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) ?? "[]");
      if (Array.isArray(raw)) setDone(raw.filter((x) => typeof x === "string" && ALL_IDS.includes(x)));
    } catch {
      /* storage indisponível ou corrompido: começa vazio */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(done));
    } catch {
      /* ignore */
    }
  }, [done, loaded]);

  const pct = Math.round((done.length / ALL_IDS.length) * 100);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <div className="devtool">
      <div aria-live="polite">
        <label>
          {pt ? "Progresso" : "Progress"}: {done.length}/{ALL_IDS.length} ({pct}%)
        </label>
        <div className="devtool-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div>
        {PHASES.map((ph) => (
          <div key={ph.name.pt}>
            <div className="devtool-phase">{ph.name[lang]}</div>
            {ph.items.map((it) => {
              const on = done.includes(it.id);
              return (
                <label key={it.id} className={`devtool-check${on ? " is-done" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => toggle(it.id)} />
                  <span>
                    <strong>{it.t[lang]}</strong>
                    <small>{it.d[lang]}</small>
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <div className="cta-row devtool-noprint" style={{ marginBottom: 0 }}>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" /> {pt ? "Imprimir / salvar PDF" : "Print / save PDF"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setDone([])}>
          <RotateCcw size={16} aria-hidden="true" /> {pt ? "Recomeçar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
