/* ------------------------------------------------------------------ */
/*  Origem no navegador: guarda no aparelho de onde a pessoa veio       */
/*                                                                     */
/*  A origem fica SÓ no localStorage deste aparelho e sai daqui apenas  */
/*  quando a pessoa envia o formulário de contato (ela está escolhendo  */
/*  falar com a gente). Não há id de visitante, não há cookie e nada é  */
/*  enviado a cada página. Nunca se guarda nome, e-mail ou telefone.    */
/*                                                                     */
/*  localStorage pode estar bloqueado (aba anônima restrita): toda      */
/*  leitura e escrita engole o erro e a tela segue.                     */
/* ------------------------------------------------------------------ */

import { lerToque, temOrigem, type Toque } from "./origem";

const K_PRIMEIRA = "mt_origem_primeira";
const K_ULTIMA = "mt_origem_ultima";
const K_INTERNO = "mt_interno";

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string | null): void {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    // storage bloqueado: segue sem guardar
  }
}

function toqueGuardado(chave: string): Toque | null {
  try {
    const v = ler(chave);
    const t: unknown = v ? JSON.parse(v) : null;
    return t && typeof t === "object" && !Array.isArray(t) ? (t as Toque) : null;
  } catch {
    return null;
  }
}

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** UUID v4 sempre. crypto.randomUUID não existe em celular antigo (iOS < 15.4). */
function novoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

let sessaoEmMemoria: string | null = null;

/**
 * Id da sessão: vive no sessionStorage (só esta aba; some ao fechá-la). Não é
 * cookie nem ID persistente: a mesma pessoa em outra aba ou amanhã é outra
 * sessão. Conta sessões, não pessoas. Sem storage, vale só enquanto a página
 * estiver aberta.
 */
export function sessaoDaAba(): string {
  try {
    const guardada = sessionStorage.getItem("mt_sessao");
    if (guardada && FORMATO_UUID.test(guardada)) return guardada;
    const nova = novoId();
    sessionStorage.setItem("mt_sessao", nova);
    return nova;
  } catch {
    sessaoEmMemoria ??= novoId();
    return sessaoEmMemoria;
  }
}

export function souInterno(): boolean {
  return ler(K_INTERNO) === "1";
}

/**
 * Chame uma vez por carga de página (SiteAnalytics). A primeira origem nunca
 * é trocada; a última só muda quando a visita TEM origem (visita direta de
 * hoje não apaga o LinkedIn de ontem). `?interno=1` marca este aparelho como
 * da equipe (leads de teste), `?interno=0` desfaz.
 */
export function capturarOrigem(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const interno = params.get("interno");
    if (interno === "1" || interno === "0") gravar(K_INTERNO, interno === "1" ? "1" : null);

    const toque = lerToque(window.location.href, document.referrer);
    if (!toqueGuardado(K_PRIMEIRA)) gravar(K_PRIMEIRA, JSON.stringify(toque));
    if (temOrigem(toque)) gravar(K_ULTIMA, JSON.stringify(toque));
  } catch {
    // rastro é acessório: nunca derruba a tela
  }
}

/** O que vai junto com o formulário. O servidor limpa e decide o canal. */
export function origemParaEnvio(): {
  origem: { primeira: Toque | null; ultima: Toque | null };
  interno: boolean;
} {
  return {
    origem: { primeira: toqueGuardado(K_PRIMEIRA), ultima: toqueGuardado(K_ULTIMA) },
    interno: souInterno(),
  };
}
