// Testes das regras de coleta (app/lib/visita.ts):
//   node --test scripts/visita.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  caminhoLimpo,
  classificarDispositivo,
  ehRobo,
  idiomaDoCaminho,
  paisValido,
  segundosValidos,
  sessaoValida,
} from "../app/lib/visita.ts";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36";
const IPAD = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1";
const TABLET_ANDROID = "Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

test("robôs e monitores não contam", () => {
  for (const ua of [
    "Googlebot/2.1",
    "Mozilla/5.0 (compatible; bingbot/2.0)",
    "Lighthouse",
    "Mozilla/5.0 HeadlessChrome/120",
    "curl/8.4.0",
    "vercel-screenshot/1.0",
    "facebookexternalhit/1.1",
    "",
    "   ",
  ]) assert.equal(ehRobo(ua), true, ua);
  assert.equal(ehRobo(null), true);
});

test("navegadores de verdade contam", () => {
  for (const ua of [IPHONE, ANDROID, IPAD, WINDOWS]) assert.equal(ehRobo(ua), false, ua);
});

test("dispositivo", () => {
  assert.equal(classificarDispositivo(IPHONE), "mobile");
  assert.equal(classificarDispositivo(ANDROID), "mobile");
  assert.equal(classificarDispositivo(IPAD), "tablet");
  assert.equal(classificarDispositivo(TABLET_ANDROID), "tablet");
  assert.equal(classificarDispositivo(WINDOWS), "desktop");
  assert.equal(classificarDispositivo(undefined), "desktop");
});

test("idioma pelo caminho", () => {
  assert.equal(idiomaDoCaminho("/pt/servicos"), "pt");
  assert.equal(idiomaDoCaminho("/en"), "en");
  assert.equal(idiomaDoCaminho("/admin"), null);
  assert.equal(idiomaDoCaminho("/"), null);
});

test("país só com 2 letras", () => {
  assert.equal(paisValido("br"), "BR");
  assert.equal(paisValido("BRA"), null);
  assert.equal(paisValido("'; DROP"), null);
  assert.equal(paisValido(null), null);
});

test("sessão só em formato uuid", () => {
  assert.equal(sessaoValida("3F2504E0-4F89-41D3-9A0C-0305E82C3301"), "3f2504e0-4f89-41d3-9a0c-0305e82c3301");
  assert.equal(sessaoValida("abc"), null);
  assert.equal(sessaoValida(123), null);
});

test("caminho sem query, sem controle, com teto", () => {
  assert.equal(caminhoLimpo("/pt/servicos?utm_source=x#topo"), "/pt/servicos");
  assert.equal(caminhoLimpo("javascript:alert(1)"), "/");
  assert.equal(caminhoLimpo(42), "/");
  assert.equal(caminhoLimpo("/a\nb"), "/ab");
  assert.equal(caminhoLimpo("/" + "x".repeat(500)).length, 160);
});

test("segundos: 1 a 1800", () => {
  assert.equal(segundosValidos(42.4), 42);
  assert.equal(segundosValidos(0), null);
  assert.equal(segundosValidos(99999), null);
  assert.equal(segundosValidos("30"), null);
  assert.equal(segundosValidos(NaN), null);
});
