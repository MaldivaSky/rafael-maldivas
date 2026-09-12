/* ------------------------------------------------------------------ */
/*  Algoritmos fiscais e de pagamento — implementados aqui, sem lib.    */
/* ------------------------------------------------------------------ */

/* ---------------- CRC16/CCITT-FALSE (exigido pelo BR Code Pix) ------ */

export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/* ---------------- EMV TLV — estrutura do Pix Copia e Cola ----------- */

export type Tlv = { id: string; len: number; value: string; children?: Tlv[] };

const NESTED = new Set(["26", "27", "28", "29", "30", "51", "62", "64", "80"]);

export function parseEmv(input: string): { tags: Tlv[]; error?: string } {
  const tags: Tlv[] = [];
  let i = 0;
  while (i < input.length) {
    const id = input.slice(i, i + 2);
    const lenRaw = input.slice(i + 2, i + 4);
    if (id.length < 2 || lenRaw.length < 2 || !/^\d{2}$/.test(lenRaw)) {
      return { tags, error: `Estrutura inválida na posição ${i}` };
    }
    const len = parseInt(lenRaw, 10);
    const value = input.slice(i + 4, i + 4 + len);
    if (value.length < len) return { tags, error: `Tamanho declarado maior que o conteúdo no campo ${id}` };
    const tag: Tlv = { id, len, value };
    if (NESTED.has(id)) {
      const inner = parseEmv(value);
      if (!inner.error) tag.children = inner.tags;
    }
    tags.push(tag);
    i += 4 + len;
  }
  return { tags };
}

export const EMV_LABELS: Record<string, string> = {
  "00": "Formato do payload",
  "01": "Iniciação (12 = reutilizável)",
  "26": "Conta do recebedor (Pix)",
  "27": "Conta do recebedor",
  "52": "Código da categoria (MCC)",
  "53": "Moeda (986 = BRL)",
  "54": "Valor da transação",
  "58": "País",
  "59": "Nome do recebedor",
  "60": "Cidade do recebedor",
  "61": "CEP",
  "62": "Dados adicionais",
  "63": "CRC16 de verificação",
  GUI: "Domínio (br.gov.bcb.pix)",
};

export function analyzePix(raw: string) {
  // Só quebra de linha e tabulação saem. O espaço faz parte do payload —
  // nome do recebedor e cidade têm espaço, e tirá-los quebra o CRC.
  const code = raw.trim().replace(/[\r\n\t]+/g, "");
  if (!code) return null;

  const { tags, error } = parseEmv(code);

  // o CRC cobre todo o payload até "6304" inclusive
  const idx = code.lastIndexOf("6304");
  const declared = idx >= 0 ? code.slice(idx + 4, idx + 8).toUpperCase() : null;
  const expected = idx >= 0 ? crc16(code.slice(0, idx + 4)) : null;

  const find = (id: string) => tags.find((t) => t.id === id);
  const merchant = find("26") ?? find("27");
  const gui = merchant?.children?.find((c) => c.id === "00")?.value ?? null;
  const key = merchant?.children?.find((c) => c.id === "01")?.value ?? null;
  const txid =
    find("62")?.children?.find((c) => c.id === "05")?.value ?? null;

  const amountRaw = find("54")?.value ?? null;

  return {
    tags,
    error,
    crcDeclared: declared,
    crcExpected: expected,
    crcValid: !!declared && declared === expected,
    gui,
    pixKey: key,
    name: find("59")?.value ?? null,
    city: find("60")?.value ?? null,
    currency: find("53")?.value ?? null,
    amount: amountRaw ? parseFloat(amountRaw) : null,
    amountRaw,
    txid,
    isStatic: find("01")?.value !== "12",
  };
}

/* ---------------- Chave de acesso da NF-e / NFC-e (44 dígitos) ------ */

const UF: Record<string, string> = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL",
  "28": "SE", "29": "BA", "31": "MG", "32": "ES", "33": "RJ", "35": "SP", "41": "PR",
  "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF",
};

const MODELO: Record<string, string> = {
  "55": "NF-e — Nota Fiscal Eletrônica",
  "65": "NFC-e — Nota Fiscal de Consumidor Eletrônica",
};

const TP_EMIS: Record<string, string> = {
  "1": "Normal (online, autorizada pela SEFAZ)",
  "2": "Contingência FS-IA",
  "3": "Contingência SCAN",
  "4": "Contingência DPEC / EPEC",
  "5": "Contingência FS-DA",
  "6": "Contingência SVC-AN",
  "7": "Contingência SVC-RS",
  "9": "Contingência offline da NFC-e",
};

/** Dígito verificador por módulo 11, pesos 2..9 da direita para a esquerda. */
export function dvModulo11(base43: string): string {
  let sum = 0;
  let weight = 2;
  for (let i = base43.length - 1; i >= 0; i--) {
    sum += parseInt(base43[i], 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const rest = sum % 11;
  return rest === 0 || rest === 1 ? "0" : String(11 - rest);
}

export function analyzeNfeKey(raw: string) {
  const key = raw.replace(/\D/g, "");
  if (key.length !== 44) {
    return { valid: false, length: key.length, reason: "length" as const };
  }

  const cUF = key.slice(0, 2);
  const aamm = key.slice(2, 6);
  const cnpj = key.slice(6, 20);
  const mod = key.slice(20, 22);
  const serie = key.slice(22, 25);
  const nNF = key.slice(25, 34);
  const tpEmis = key.slice(34, 35);
  const cNF = key.slice(35, 43);
  const cDV = key.slice(43, 44);

  const expectedDv = dvModulo11(key.slice(0, 43));

  const year = 2000 + parseInt(aamm.slice(0, 2), 10);
  const month = parseInt(aamm.slice(2, 4), 10);

  return {
    valid: expectedDv === cDV && !!UF[cUF] && !!MODELO[mod],
    length: 44,
    reason: null,
    cUF,
    uf: UF[cUF] ?? null,
    emission: month >= 1 && month <= 12 ? `${String(month).padStart(2, "0")}/${year}` : null,
    cnpj: cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
    cnpjValid: validaCnpj(cnpj),
    mod,
    modelo: MODELO[mod] ?? `Modelo desconhecido (${mod})`,
    serie: String(parseInt(serie, 10)),
    numero: String(parseInt(nNF, 10)),
    tpEmis,
    tipoEmissao: TP_EMIS[tpEmis] ?? `Código não previsto (${tpEmis})`,
    cNF,
    cDV,
    expectedDv,
    dvValid: expectedDv === cDV,
  };
}

/** Validação de CNPJ por módulo 11 — usada na conferência da chave. */
export function validaCnpj(raw: string): boolean {
  const c = raw.replace(/\D/g, "");
  if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;
  const calc = (slice: number) => {
    let sum = 0;
    let pos = slice - 7;
    for (let i = 0; i < slice; i++) {
      sum += parseInt(c[i], 10) * pos--;
      if (pos < 2) pos = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(c[12], 10) && calc(13) === parseInt(c[13], 10);
}
