// Testes da autenticação do painel (app/lib/admin-auth.ts):
//   node --test scripts/admin-auth.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  autorizado,
  bloqueadoPor,
  cabecalhoCookie,
  COOKIE_SESSAO,
  emitirSessao,
  JANELA_FALHAS_MS,
  lerCookie,
  limparFalhas,
  MAX_FALHAS,
  registrarFalha,
  senhaCorreta,
  sessaoValida,
  VALIDADE_SESSAO_S,
} from "../app/lib/admin-auth.ts";

const SENHA = "senha-so-de-teste";
const AGORA = Date.UTC(2026, 10, 12, 12, 0, 0);

test("sessão emitida vale e carrega a validade", () => {
  const t = emitirSessao(SENHA, AGORA);
  assert.equal(sessaoValida(t, SENHA, AGORA), true);
  assert.equal(sessaoValida(t, SENHA, AGORA + (VALIDADE_SESSAO_S - 1) * 1000), true);
});

test("sessão vencida não vale", () => {
  const t = emitirSessao(SENHA, AGORA);
  assert.equal(sessaoValida(t, SENHA, AGORA + (VALIDADE_SESSAO_S + 1) * 1000), false);
});

test("trocar a senha derruba as sessões abertas", () => {
  const t = emitirSessao(SENHA, AGORA);
  assert.equal(sessaoValida(t, "outra-senha", AGORA), false);
  assert.equal(sessaoValida(t, undefined, AGORA), false);
});

test("token adulterado ou malformado não vale", () => {
  const t = emitirSessao(SENHA, AGORA);
  const [exp, sig] = t.split(".");
  // estender a validade sem a chave: assinatura não confere
  assert.equal(sessaoValida(`${Number(exp) + 99999999}.${sig}`, SENHA, AGORA), false);
  assert.equal(sessaoValida(`${exp}.${sig.slice(0, -2)}xx`, SENHA, AGORA), false);
  for (const lixo of ["", "abc", ".", "1.", ".x", "x.y", "99999999999999.zzz", null, undefined]) {
    assert.equal(sessaoValida(lixo, SENHA, AGORA), false, String(lixo));
  }
});

test("senhaCorreta: confere, e nunca aceita vazio/gigante/tipo errado", () => {
  process.env.ADMIN_PASSWORD = SENHA;
  assert.equal(senhaCorreta(SENHA), true);
  assert.equal(senhaCorreta("errada"), false);
  assert.equal(senhaCorreta(""), false);
  assert.equal(senhaCorreta("x".repeat(500)), false);
  assert.equal(senhaCorreta(123), false);
  assert.equal(senhaCorreta(null), false);
  delete process.env.ADMIN_PASSWORD;
  assert.equal(senhaCorreta(SENHA), false, "sem ADMIN_PASSWORD nada entra");
});

test("lerCookie acha o cookie certo entre vários", () => {
  assert.equal(lerCookie("a=1; __Host-mt_admin=tok.en; b=2", "__Host-mt_admin"), "tok.en");
  assert.equal(lerCookie("a=1", "__Host-mt_admin"), null);
  assert.equal(lerCookie(null, "x"), null);
});

test("cookie da sessão é HttpOnly, Secure, SameSite=Strict e __Host-", () => {
  const c = cabecalhoCookie("tok");
  assert.ok(c.startsWith("__Host-mt_admin=tok;"));
  for (const parte of ["Path=/", "HttpOnly", "Secure", "SameSite=Strict"]) assert.ok(c.includes(parte), parte);
  assert.ok(!c.includes("Domain"), "__Host- proíbe Domain");
  assert.ok(cabecalhoCookie("", 0).includes("Max-Age=0"), "logout apaga");
});

test("autorizado: só com cookie válido; escrita exige mesma origem", () => {
  process.env.ADMIN_PASSWORD = SENHA;
  const token = emitirSessao(SENHA);
  const req = (extra = {}, method = "GET") =>
    new Request("https://www.maldivastech.dev/api/leads", {
      method,
      headers: { host: "www.maldivastech.dev", ...extra },
    });
  const cookie = { cookie: `${COOKIE_SESSAO}=${token}` };

  assert.equal(autorizado(req()), false, "sem cookie");
  assert.equal(autorizado(req({ "x-admin-key": SENHA })), false, "o header antigo com a senha não vale mais");
  assert.equal(autorizado(req(cookie)), true, "GET com sessão");
  assert.equal(autorizado(req({ cookie: `${COOKIE_SESSAO}=lixo` })), false);
  assert.equal(autorizado(req({ ...cookie, origin: "https://www.maldivastech.dev" }, "PATCH")), true, "PATCH da própria página");
  assert.equal(autorizado(req({ ...cookie, origin: "https://evil.example" }, "PATCH")), false, "PATCH de outro site");
  assert.equal(autorizado(req(cookie, "PATCH")), true, "PATCH sem Origin (não é navegador cruzado)");
  delete process.env.ADMIN_PASSWORD;
  assert.equal(autorizado(req(cookie)), false, "sem ADMIN_PASSWORD nada entra");
});

test("limite de tentativas: bloqueia na 5ª falha e libera depois da janela", () => {
  const ip = "203.0.113.7";
  limparFalhas(ip);
  for (let i = 0; i < MAX_FALHAS - 1; i++) {
    registrarFalha(ip, AGORA + i);
    assert.equal(bloqueadoPor(ip, AGORA + i), 0, `ainda pode (falha ${i + 1})`);
  }
  registrarFalha(ip, AGORA + 10);
  const espera = bloqueadoPor(ip, AGORA + 20);
  assert.ok(espera > 0 && espera <= JANELA_FALHAS_MS / 1000, `bloqueado por ${espera}s`);
  assert.equal(bloqueadoPor(ip, AGORA + JANELA_FALHAS_MS + 1000), 0, "janela passou");
});

test("limite é por IP e acerto zera as falhas", () => {
  limparFalhas("a");
  limparFalhas("b");
  for (let i = 0; i < MAX_FALHAS; i++) registrarFalha("a", AGORA);
  assert.ok(bloqueadoPor("a", AGORA) > 0);
  assert.equal(bloqueadoPor("b", AGORA), 0, "outro IP não é afetado");
  limparFalhas("a");
  assert.equal(bloqueadoPor("a", AGORA), 0);
});
