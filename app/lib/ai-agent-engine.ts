import { COMPANY, EMAIL, SITE, WHATSAPP } from "./site";
import { ORACLE_CERT } from "./credentials";
import { productList } from "./products";
import { works } from "./projects";
import { packs } from "./services";
import { COURSES, allCourseLessons, formatDuration, totalCourseMinutes } from "./courses";
import {
  executeCourseTutor,
  executeDiagnosticArchitect,
  executePortfolioConcierge,
  MemoryRateLimiter,
  type AgentLang,
  type ConciergeAgentInput,
  type DiagnosticAgentInput,
  type MaldivasKnowledgeContext,
  type TutorAgentInput,
} from "./ai-agent-core";

export const agentRateLimiter = new MemoryRateLimiter(24, 60_000);

export function getMaldivasKnowledgeContext(
  lang: AgentLang = "pt",
): MaldivasKnowledgeContext {
  const mainCourse = COURSES["construa-seu-marketplace"];
  const lessons = allCourseLessons(mainCourse);
  const totalMinutes = totalCourseMinutes(mainCourse);

  return {
    company: {
      tradeName: COMPANY.tradeName,
      legalName: COMPANY.legalName,
      cnpj: COMPANY.cnpj,
      city: COMPANY.city,
      region: COMPANY.region,
      street: COMPANY.street,
      site: SITE,
      whatsapp: WHATSAPP,
      email: EMAIL,
    },
    founderCert: {
      issuer: ORACLE_CERT.issuer,
      name: ORACLE_CERT.name,
      id: ORACLE_CERT.id,
      verifyUrl: ORACLE_CERT.verifyUrl,
    },
    products: productList.map((p) => ({
      name: p.name,
      slug: p.slug,
      role: p.applicationSubCategory,
      tagline: p.copy[lang].tagline,
      priceBRL: p.priceBRL,
      trialDays: p.trialDays,
      stack: p.stack,
      appUrl: p.appUrl,
    })),
    works: works.map((w) => ({
      name: w.name,
      client: w.client[lang],
      kind: w.kind[lang],
      desc: w.desc[lang],
      proof: w.proof[lang],
      url: w.url,
    })),
    services: packs.map((pk) => ({
      id: pk.id,
      area: pk.icon,
      name: pk.name[lang],
      summary: pk.pitch[lang],
      outcome: pk.outcome[lang],
    })),
    courseSummary: {
      name: mainCourse.name,
      slug: mainCourse.slug,
      lessonsCount: lessons.length,
      durationLabel: formatDuration(totalMinutes, lang),
      studyCase: mainCourse.studyCase,
    },
  };
}

export async function runPortfolioConciergeAgent(input: ConciergeAgentInput) {
  const ctx = getMaldivasKnowledgeContext(input.lang);
  return executePortfolioConcierge(input, ctx);
}

export async function runDiagnosticArchitectAgent(input: DiagnosticAgentInput) {
  const ctx = getMaldivasKnowledgeContext(input.lang);
  return executeDiagnosticArchitect(input, ctx);
}

export async function runCourseTutorAgent(input: TutorAgentInput) {
  return executeCourseTutor(input);
}

