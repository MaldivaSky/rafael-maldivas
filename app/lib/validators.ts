/* ------------------------------------------------------------------ */
/*  Validadores brasileiros — funções puras, sem dependência externa.  */
/*                                                                     */
/*  Tudo aqui roda no navegador: nenhum documento sai do dispositivo.  */
/*  São os mesmos algoritmos oficiais (módulo 11 da Receita).          */
/* ------------------------------------------------------------------ */

/* ---------------- CPF ---------------- */

/** Valida CPF pelos dois dígitos verificadores (módulo 11). */
export function validaCpf(raw: string): boolean {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;

  const calc = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i++) sum += parseInt(c[i], 10) * (slice + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };

  return calc(9) === parseInt(c[9], 10) && calc(10) === parseInt(c[10], 10);
}

/**
 * Confere um CPF e explica o motivo quando falha.
 * A região fiscal vem do 9º dígito — informação que quase ninguém conhece.
 */
const REGIAO_FISCAL: Record<string, string> = {
  "0": "RS",
  "1": "DF, GO, MT, MS, TO",
  "2": "AC, AM, AP, PA, RO, RR",
  "3": "CE, MA, PI",
  "4": "AL, PB, PE, RN",
  "5": "BA, SE",
  "6": "MG",
  "7": "ES, RJ",
  "8": "SP",
  "9": "PR, SC",
};

export function analyzeCpf(raw: string) {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 11) return { length: c.length, valid: false, repeated: false, region: null };

  const repeated = /^(\d)\1{10}$/.test(c);
  const calc = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i++) sum += parseInt(c[i], 10) * (slice + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const dv1 = calc(9) === parseInt(c[9], 10);
  const dv2 = calc(10) === parseInt(c[10], 10);

  return {
    length: 11,
    valid: !repeated && dv1 && dv2,
    repeated,
    dv1,
    dv2,
    region: REGIAO_FISCAL[c[8]] ?? null,
    formatted: c.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"),
  };
}

/** Máscara progressiva 000.000.000-00 conforme digita. */
export const maskCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

/* ---------------- Código de barras EAN / GTIN ---------------- */

/** Valida EAN-8, EAN-13, UPC-A e GTIN-14 pelo dígito verificador. */
export function analyzeEan(raw: string) {
  const c = raw.replace(/\D/g, "");
  if (![8, 12, 13, 14].includes(c.length)) {
    return { length: c.length, valid: false, kind: null, expectedDv: null, givenDv: null };
  }

  const base = c.slice(0, -1);
  const given = c[c.length - 1];

  // pesos 3 e 1 alternados, da direita para a esquerda sobre a base
  let sum = 0;
  for (let i = base.length - 1; i >= 0; i--) {
    const fromRight = base.length - 1 - i;
    sum += parseInt(base[i], 10) * (fromRight % 2 === 0 ? 3 : 1);
  }
  const expected = String((10 - (sum % 10)) % 10);

  const kind =
    c.length === 8 ? "EAN-8" : c.length === 12 ? "UPC-A" : c.length === 13 ? "EAN-13" : "GTIN-14";

  // prefixo GS1 789/790 = Brasil
  const brasil = c.length >= 13 && c.startsWith("789") ? true : null;

  return { length: c.length, valid: expected === given, kind, expectedDv: expected, givenDv: given, brasil };
}

/* ---------------- Extração de dados de NF-e (XML) ---------------- */

export type NfeItem = {
  cProd: string;
  xProd: string;
  ncm: string;
  cfop: string;
  uCom: string;
  qCom: string;
  vUnCom: string;
  vProd: string;
};

export type NfeParsed = {
  ok: boolean;
  tipo: "NF-e" | "NFC-e" | "desconhecido";
  chave: string | null;
  numero: string | null;
  serie: string | null;
  emissao: string | null;
  natureza: string | null;
  emitente: { nome: string; cnpj: string; ie: string; cidade: string; uf: string } | null;
  destinatario: { nome: string; cpfCnpj: string; cidade: string; uf: string } | null;
  itens: NfeItem[];
  totais: {
    vProd: string | null;
    vFrete: string | null;
    vDesc: string | null;
    vNF: string | null;
    vICMS: string | null;
    vIPI: string | null;
  };
  pagamento: { tPag: string; vPag: string }[];
  error?: string;
};

const txt = (parent: Element | null, tag: string): string | null => {
  if (!parent) return null;
  const el = parent.getElementsByTagName(tag)[0];
  return el?.textContent?.trim() ?? null;
};

const attr = (parent: Element | null, tag: string, name: string): string | null => {
  if (!parent) return null;
  const el = parent.getElementsByTagName(tag)[0];
  return el?.getAttribute(name)?.trim() ?? null;
};

const T_PAG: Record<string, string> = {
  "01": "Dinheiro",
  "02": "Cheque",
  "03": "Cartão de crédito",
  "04": "Cartão de débito",
  "05": "Crédito loja",
  "10": "Vale alimentação",
  "11": "Vale refeição",
  "12": "Vale presente",
  "13": "Vale combustível",
  "15": "Boleto bancário",
  "16": "Depósito bancário",
  "17": "PIX",
  "18": "Transferência bancária",
  "19": "Programa de fidelidade",
  "90": "Sem pagamento",
  "99": "Outros",
};

/**
 * Lê um XML de NF-e / NFC-e e devolve os campos que interessam a quem
 * vai lançar a nota em sistema. O parse roda no navegador (DOMParser).
 */
export function parseNfeXml(xml: string): NfeParsed {
  const empty: NfeParsed = {
    ok: false,
    tipo: "desconhecido",
    chave: null,
    numero: null,
    serie: null,
    emissao: null,
    natureza: null,
    emitente: null,
    destinatario: null,
    itens: [],
    totais: { vProd: null, vFrete: null, vDesc: null, vNF: null, vICMS: null, vIPI: null },
    pagamento: [],
  };

  if (typeof DOMParser === "undefined") return { ...empty, error: "sem_domparser" };
  if (!xml || !xml.trim()) return { ...empty, error: "vazio" };

  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) {
    return { ...empty, error: "xml_invalido" };
  }

  // aceita NF-e (infNFe) e NFC-e — mesma estrutura, muda o modelo
  const inf = doc.getElementsByTagName("infNFe")[0] ?? doc.getElementsByTagName("infNFeSupl")[0];
  if (!inf) return { ...empty, error: "sem_infnfe" };

  const chave = (inf.getAttribute("Id") ?? "").replace(/^NFe/i, "").replace(/\D/g, "") || null;
  const mod = chave?.slice(20, 22) ?? null;

  const ide = inf.getElementsByTagName("ide")[0] ?? null;
  const emit = inf.getElementsByTagName("emit")[0] ?? null;
  const dest = inf.getElementsByTagName("dest")[0] ?? null;
  const endEmit = emit?.getElementsByTagName("enderEmit")[0] ?? null;
  const endDest = dest?.getElementsByTagName("enderDest")[0] ?? null;

  const dets = Array.from(inf.getElementsByTagName("det"));
  const itens: NfeItem[] = dets.slice(0, 200).map((det) => {
    const prod = det.getElementsByTagName("prod")[0] ?? null;
    return {
      cProd: txt(prod, "cProd") ?? "",
      xProd: txt(prod, "xProd") ?? "",
      ncm: txt(prod, "NCM") ?? "",
      cfop: txt(prod, "CFOP") ?? "",
      uCom: txt(prod, "uCom") ?? "",
      qCom: txt(prod, "qCom") ?? "",
      vUnCom: txt(prod, "vUnCom") ?? "",
      vProd: txt(prod, "vProd") ?? "",
    };
  });

  const total = inf.getElementsByTagName("ICMSTot")[0] ?? null;
  const pag = inf.getElementsByTagName("pag")[0] ?? null;
  const detPags = pag ? Array.from(pag.getElementsByTagName("detPag")) : [];

  return {
    ok: true,
    tipo: mod === "65" ? "NFC-e" : mod === "55" ? "NF-e" : "desconhecido",
    chave,
    numero: txt(ide, "nNF"),
    serie: txt(ide, "serie"),
    emissao: txt(ide, "dhEmi") ?? txt(ide, "dEmi"),
    natureza: txt(ide, "natOp"),
    emitente: emit
      ? {
          nome: txt(emit, "xNome") ?? "",
          cnpj: txt(emit, "CNPJ") ?? "",
          ie: txt(emit, "IE") ?? "",
          cidade: txt(endEmit, "xMun") ?? "",
          uf: txt(endEmit, "UF") ?? "",
        }
      : null,
    destinatario: dest
      ? {
          nome: txt(dest, "xNome") ?? "",
          cpfCnpj: txt(dest, "CNPJ") ?? txt(dest, "CPF") ?? "",
          cidade: txt(endDest, "xMun") ?? "",
          uf: txt(endDest, "UF") ?? "",
        }
      : null,
    itens,
    totais: {
      vProd: txt(total, "vProd"),
      vFrete: txt(total, "vFrete"),
      vDesc: txt(total, "vDesc"),
      vNF: txt(total, "vNF"),
      vICMS: txt(total, "vICMS"),
      vIPI: txt(total, "vIPI"),
    },
    pagamento: detPags.map((d) => ({
      tPag: T_PAG[txt(d, "tPag") ?? ""] ?? txt(d, "tPag") ?? "—",
      vPag: txt(d, "vPag") ?? "",
    })),
  };
}

export const PAG_LABEL = T_PAG;
