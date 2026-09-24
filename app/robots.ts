import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

/**
 * robots.txt — libera explicitamente os crawlers de IA (GEO) além do Google.
 * Bloqueia apenas /api e /admin (superfície sem valor de indexação).
 */
export default function robots(): MetadataRoute.Robots {
  // Crawlers que alimentam respostas de IA e buscadores — queremos todos dentro.
  const aiBots = [
    "Googlebot",
    "Googlebot-Image",
    "Bingbot",
    "Google-Extended", // treino/uso no Gemini
    "GPTBot", // treino OpenAI
    "OAI-SearchBot", // busca ChatGPT
    "ChatGPT-User", // navegação sob demanda
    "PerplexityBot",
    "ClaudeBot",
    "anthropic-ai",
    "CCBot", // Common Crawl
    "Applebot",
    "Applebot-Extended",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/admin"] },
      // regra explícita e idêntica para cada bot de IA (clareza > inferência)
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/admin/", "/admin"],
      })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
