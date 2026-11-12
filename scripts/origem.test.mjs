// Testes da regra de origem/canal (app/lib/origem.ts). Sem dependências:
//   node --test scripts/origem.test.mjs
// O Node 22.18+/24 lê o .ts direto (remove os tipos), por isso o import.
import test from "node:test";
import assert from "node:assert/strict";
import {
  canalDeToque,
  decidirCanal,
  lerToque,
  limparToque,
  temOrigem,
} from "../app/lib/origem.ts";

const SITE = "https://www.maldivastech.dev/";

test("link com UTM do LinkedIn é confirmado", () => {
  const t = lerToque(`${SITE}?utm_source=linkedin&utm_medium=post&utm_campaign=divulgacao&utm_content=post-ats`, "");
  assert.equal(t.utm_content, "post-ats");
  assert.deepEqual(canalDeToque(t), { codigo: "linkedin", rotulo: "LinkedIn", certeza: "confirmado" });
});

test("referrer do LinkedIn sem UTM é só provável", () => {
  const t = lerToque(SITE, "https://www.linkedin.com/");
  assert.equal(t.referrer_host, "www.linkedin.com");
  assert.equal(canalDeToque(t).certeza, "provavel");
  assert.equal(canalDeToque(t).codigo, "linkedin");
  assert.equal(canalDeToque(lerToque(SITE, "https://lnkd.in/abc")).codigo, "linkedin");
});

test("Google: busca orgânica, Ads e Meu Negócio", () => {
  assert.equal(canalDeToque(lerToque(SITE, "https://www.google.com.br/")).codigo, "google_organico");
  assert.equal(canalDeToque(lerToque(SITE, "android-app://com.google.android.googlequicksearchbox")).codigo, "google_organico");
  assert.equal(canalDeToque(lerToque(`${SITE}?gclid=abc`, "")).codigo, "google_ads");
  assert.equal(canalDeToque(lerToque(`${SITE}?gbraid=abc`, "")).codigo, "google_ads");
  assert.equal(canalDeToque(lerToque(`${SITE}?utm_source=google&utm_medium=cpc`, "")).codigo, "google_ads");
  assert.equal(canalDeToque(lerToque(`${SITE}?utm_source=google&utm_medium=perfil_empresa`, "")).codigo, "google_perfil");
});

test("navegar dentro do próprio site não é origem", () => {
  const t = lerToque(SITE, "https://www.maldivastech.dev/pt/servicos");
  assert.equal(t.referrer_host, undefined);
  assert.equal(temOrigem(t), false);
  assert.equal(lerToque(SITE, "https://maldivastech.dev/").referrer_host, undefined);
  assert.equal(canalDeToque(t).codigo, "direto");
});

test("referrer inválido e UTM gigante não quebram", () => {
  assert.doesNotThrow(() => lerToque(SITE, "nada"));
  const t = lerToque(`${SITE}?utm_source=${"a".repeat(500)}`, "");
  assert.equal(t.utm_source.length, 120);
});

test("limparToque descarta chave estranha, tipo errado e controle", () => {
  assert.equal(limparToque(null), null);
  assert.equal(limparToque([]), null);
  assert.equal(limparToque({ canal: "linkedin", admin: true }), null);
  const t = limparToque({
    utm_source: "LinkedIn\n\u0000",
    utm_medium: 42,
    referrer_host: "WWW.Google.com",
    landing: "pt",
    gclid: "true",
    x: "y",
  });
  assert.deepEqual(t, { utm_source: "LinkedIn", referrer_host: "www.google.com", landing: "/pt" });
});

test("o navegador não consegue forjar o canal", () => {
  const t = limparToque({ canal: "google_ads", utm_source: "linkedin" });
  assert.equal(canalDeToque(t).codigo, "linkedin");
});

test("lead: primeira origem vence; primeira direta cai na última", () => {
  const li = { utm_source: "linkedin", utm_medium: "post" };
  const g = { referrer_host: "www.google.com" };
  assert.equal(decidirCanal(li, g).codigo, "linkedin");
  assert.equal(decidirCanal({ landing: "/pt" }, g).codigo, "google_organico");
  assert.equal(decidirCanal(null, null).codigo, "direto");
  assert.equal(decidirCanal(null, null).certeza, "desconhecido");
});

test("aparelho interno vira canal interno", () => {
  assert.equal(decidirCanal({ utm_source: "linkedin" }, null, true).codigo, "interno");
});

test("utm desconhecido vira 'outro' confirmado", () => {
  assert.deepEqual(canalDeToque({ utm_source: "parceiro-x" }), {
    codigo: "outro",
    rotulo: "Outro site",
    certeza: "confirmado",
  });
});
