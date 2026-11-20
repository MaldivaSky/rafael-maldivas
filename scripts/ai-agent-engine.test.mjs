import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  MemoryRateLimiter,
  executeCourseTutor,
  executeDiagnosticArchitect,
  executePortfolioConcierge,
  extractJsonFromModelText,
  sanitizeAgentText,
} from "../app/lib/ai-agent-core.ts";

const MOCK_CTX = {
  company: {
    tradeName: "Maldivas Tech",
    legalName: "Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA",
    cnpj: "68.923.239/0001-77",
    city: "São Paulo",
    region: "SP",
    street: "R. Pais Leme, 215, cj. 1713 — Pinheiros",
    site: "https://www.maldivastech.dev",
    whatsapp: "https://wa.me/5511919889233",
    email: "rafaelmaldivas@gmail.com",
  },
  founderCert: {
    issuer: "Oracle",
    name: "Agentic AI Certified Foundations Associate",
    id: "332142567AAI26OFA",
    verifyUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=example",
  },
  products: [
    {
      name: "MiseOn",
      slug: "miseon",
      role: "RestaurantManagementSystem",
      tagline: "Gestão multi-tenant para restaurantes",
      priceBRL: "149.90",
      trialDays: 30,
      stack: ["Next.js", "PostgreSQL", "NFC-e"],
      appUrl: "https://miseon.app.br",
    },
  ],
  works: [
    {
      name: "SelectSys Jobs",
      client: "Fujiarte Co., Ltd.",
      kind: "ATS Bilíngue Brasil-Japão",
      desc: "Plataforma de recrutamento internacional",
      proof: "Reduziu triagem manual em 60%",
      url: "https://selectsys-jobs.vercel.app",
    },
  ],
  services: [
    {
      id: "dev",
      area: "code",
      name: "Desenvolvimento sob medida",
      summary: "ERP, PDV e SaaS",
      outcome: "Software que a equipe usa todo dia",
    },
  ],
  courseSummary: {
    name: "Construa seu marketplace",
    slug: "construa-seu-marketplace",
    lessonsCount: 18,
    durationLabel: "38h 10min",
    studyCase: "MySuperStore",
  },
};

describe("AI Agent Engine Core (3 Fronts + Security)", () => {
  it("sanitiza entradas, aplica rate limiting e extrai JSON de respostas Gemini", () => {
    const cleaned = sanitizeAgentText("  olá\u0000\u0007   mundo \n  Maldivas  ", 30);
    assert.equal(cleaned, "olá mundo Maldivas");

    const limiter = new MemoryRateLimiter(2, 60_000);
    assert.equal(limiter.allow("ip-1", 1000), true);
    assert.equal(limiter.allow("ip-1", 2000), true);
    assert.equal(limiter.allow("ip-1", 3000), false);
    assert.equal(limiter.allow("ip-1", 62_000), true);

    const parsed = extractJsonFromModelText('```json\n{"answer":"ok","highlights":["a"]}\n```');
    assert.deepEqual(parsed, { answer: "ok", highlights: ["a"] });
  });

  it("atende as 3 frentes com fallback determinístico quando sem API key ou em falha externa", async () => {
    const nullCaller = async () => null;

    const concierge = await executePortfolioConcierge(
      { question: "Como funciona o MiseOn e totens Bravus?", lang: "pt" },
      MOCK_CTX,
      nullCaller,
    );
    assert.equal(concierge.source, "fallback");
    assert.ok(concierge.recommendedRoute.includes("miseon"));
    assert.equal(concierge.highlights.length, 3);

    const diagnostic = await executeDiagnosticArchitect(
      {
        business: "Rede de hamburguerias",
        pain: "Pedidos do iFood e estoque de insumos não batem",
        lang: "pt",
      },
      MOCK_CTX,
      nullCaller,
    );
    assert.equal(diagnostic.source, "fallback");
    assert.ok(diagnostic.recommendedSolution.includes("MiseOn"));
    assert.equal(diagnostic.firstSprintSteps.length, 3);

    const tutor = await executeCourseTutor(
      {
        stationId: "http",
        lessonSlug: "modulo-3-confirmar-pagamento-webhook",
        studentQuery: "Por que validar HMAC e idempotência no webhook PIX?",
        lang: "pt",
      },
      nullCaller,
    );
    assert.equal(tutor.source, "fallback");
    assert.ok(tutor.socraticHint.includes("X-Webhook-Signature"));
    assert.equal(tutor.nextChecklist.length, 3);
  });

  it("processa saída JSON estruturada do Gemini mantendo source='gemini'", async () => {
    const mockGemini = async () => ({
      model: "gemini-2.5-flash",
      text: JSON.stringify({
        answer: "O SelectSys Jobs digitalizou o pipeline Brasil-Japão da Fujiarte.",
        highlights: ["OCR com Tesseract.js", "PostgreSQL RLS", "Exportação ExcelJS"],
        recommendedRoute: "/pt/portfolio/fujiarte",
        recommendedRouteLabel: "Ver Case Fujiarte",
        whatsappPrefill: "Quero saber sobre o SelectSys Jobs.",
      }),
    });

    const res = await executePortfolioConcierge(
      { question: "Me fale sobre a Fujiarte", lang: "pt" },
      MOCK_CTX,
      mockGemini,
    );
    assert.equal(res.source, "gemini");
    assert.equal(res.model, "gemini-2.5-flash");
    assert.equal(res.recommendedRoute, "/pt/portfolio/fujiarte");
    assert.equal(res.highlights.length, 3);
  });
});

