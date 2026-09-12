import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Google e Bing entram em tudo, menos na rota de consulta de DNS
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
