/* ------------------------------------------------------------------ */
/*  Heurística: um template de UTILIDADE tem cara de MARKETING?         */
/*  Puro (sem imports): testado em scripts/whatsapp-tco.test.mjs.       */
/*  Não substitui a revisão da Meta — aponta os gatilhos mais comuns.   */
/* ------------------------------------------------------------------ */

export type TriggerKind = "promo" | "urgencia" | "venda" | "pontuacao" | "emoji";

export type TemplateTrigger = { kind: TriggerKind; match: string; index: number; tip: string };

export type TemplateVerdict = {
  score: number;
  risk: "baixo" | "medio" | "alto";
  triggers: TemplateTrigger[];
  suggestion: string;
};

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Rule = { kind: TriggerKind; re: RegExp; weight: number; tip: string };

const RULES: Rule[] = [
  { kind: "promo", re: /\b(desconto|descontos|promo(cao|coes)?|oferta|ofertas|cupom|cupons|cashback|brinde|gratis|frete gratis|black friday|liquida(cao)?|queima de estoque|\d{1,2}\s?% off|\d{1,2}\s?%\s?de desconto|off)\b/g, weight: 3, tip: "Termo promocional: tire do template de utilidade e use uma campanha de marketing com opt-in." },
  { kind: "urgencia", re: /\b(ultima chance|ultimas unidades|so hoje|somente hoje|corre|corra|nao perca|imperdivel|por tempo limitado|acaba (hoje|amanha)|enquanto durar)\b/g, weight: 3, tip: "Urgência comercial: informe prazo factual (ex.: 'vence em 10/12') sem pressão de compra." },
  { kind: "venda", re: /\b(aproveite|compre|compra ja|garanta( ja)?|confira (nossas|as) novidades|novidades|lancamento|conheca|visite nossa loja|peca ja|adquira)\b/g, weight: 2, tip: "Chamada para comprar: utilidade responde a algo que o cliente já fez (pedido, agenda, conta)." },
  { kind: "pontuacao", re: /!{2,}|\?!|!\?/g, weight: 1, tip: "Exclamações em sequência soam promocionais; use pontuação neutra." },
];

const EMOJI_RE = /[\u{1F381}\u{1F525}\u{1F4A5}\u{1F389}\u{1F38A}\u{1F6CD}\u{1F4B8}\u{1F4B0}\u{2728}\u{1F31F}\u{1F3F7}]/gu;

export function analyzeTemplate(text: string): TemplateVerdict {
  const plain = strip(text);
  const triggers: TemplateTrigger[] = [];
  let score = 0;

  for (const r of RULES) {
    r.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = r.re.exec(plain))) {
      triggers.push({ kind: r.kind, match: text.slice(m.index, m.index + m[0].length), index: m.index, tip: r.tip });
      score += r.weight;
      if (m[0].length === 0) r.re.lastIndex++;
    }
  }

  const exclamations = (text.match(/!/g) ?? []).length;
  if (exclamations >= 3) score += 1;

  let em: RegExpExecArray | null;
  EMOJI_RE.lastIndex = 0;
  while ((em = EMOJI_RE.exec(text))) {
    triggers.push({ kind: "emoji", match: em[0], index: em.index, tip: "Emoji de oferta (🔥🎁💸): reforça leitura promocional." });
    score += 1;
  }

  triggers.sort((a, b) => a.index - b.index);
  const risk = score >= 4 ? "alto" : score >= 2 ? "medio" : "baixo";

  // reescrita neutra: remove os trechos promocionais e normaliza pontuação
  let suggestion = text;
  for (const t of [...triggers].sort((a, b) => b.index - a.index)) {
    if (t.kind === "pontuacao") suggestion = suggestion.slice(0, t.index) + "." + suggestion.slice(t.index + t.match.length);
    else if (t.kind !== "emoji") suggestion = suggestion.slice(0, t.index) + suggestion.slice(t.index + t.match.length);
  }
  suggestion = suggestion
    .replace(EMOJI_RE, "")
    .replace(/!+/g, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/([.,;:]){2,}/g, "$1")
    .trim();

  return { score, risk, triggers, suggestion };
}
