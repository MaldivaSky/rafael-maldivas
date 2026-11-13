import test from "node:test";
import assert from "node:assert/strict";
import {
  buildStudentCookieHeader,
  generatePkcePair,
  issueStudentSession,
  readCookieFromHeader,
  sanitizeNextPath,
  verifyStudentSession,
} from "../app/lib/student-auth.ts";

const SECRET = "test-secret-super-seguro-para-sessao-de-aluno-2026";

test("sessão do aluno emitida é válida e preserva sub e email", () => {
  const agora = Date.UTC(2026, 10, 13, 15, 0, 0);
  const token = issueStudentSession("550e8400-e29b-41d4-a716-446655440000", "aluno@teste.com", SECRET, agora);
  const payload = verifyStudentSession(token, SECRET, agora + 60_000);
  assert.ok(payload);
  assert.equal(payload.sub, "550e8400-e29b-41d4-a716-446655440000");
  assert.equal(payload.email, "aluno@teste.com");
});

test("sessão vencida ou adulterada é rejeitada", () => {
  const agora = Date.UTC(2026, 10, 13, 15, 0, 0);
  const token = issueStudentSession("550e8400-e29b-41d4-a716-446655440000", "aluno@teste.com", SECRET, agora);
  assert.equal(verifyStudentSession(token, SECRET, agora + 31 * 24 * 60 * 60 * 1000), null);
  assert.equal(verifyStudentSession(`${token}x`, SECRET, agora), null);
  assert.equal(verifyStudentSession(token, "outro-segredo-diferente-12345", agora), null);
});

test("cookie de produção usa __Host-, HttpOnly, Secure e SameSite=Lax", () => {
  const header = buildStudentCookieHeader("abc.def", 3600, true);
  assert.match(header, /^__Host-mt_aluno=/);
  assert.match(header, /HttpOnly/);
  assert.match(header, /Secure/);
  assert.match(header, /SameSite=Lax/);
});

test("sanitizeNextPath bloqueia open redirect", () => {
  assert.equal(sanitizeNextPath("/pt/trilha"), "/pt/trilha");
  assert.equal(sanitizeNextPath("https://evil.com"), "/pt/trilha");
  assert.equal(sanitizeNextPath("//evil.com/steal"), "/pt/trilha");
  assert.equal(sanitizeNextPath("/\\evil.com"), "/pt/trilha");
});

test("PKCE gera verifier, challenge e state distintos", () => {
  const a = generatePkcePair();
  const b = generatePkcePair();
  assert.ok(a.verifier.length >= 32);
  assert.ok(a.challenge.length >= 32);
  assert.notEqual(a.state, b.state);
});

test("readCookieFromHeader encontra cookie codificado", () => {
  const v = readCookieFromHeader("foo=1; mt_aluno=tok%2Een; bar=2", "mt_aluno");
  assert.equal(v, "tok.en");
});

