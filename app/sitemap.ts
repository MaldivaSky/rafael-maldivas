import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";
import { tools } from "./lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paginas: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/servicos", 0.9, "monthly"],
    ["/portfolio", 0.9, "monthly"],
    ["/ferramentas", 0.8, "monthly"],
    ["/sobre", 0.6, "yearly"],
  ];

  // cada ferramenta entra sozinha: é a página que vai ranquear
  const ferramentas: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${SITE}/ferramentas/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...paginas.map(([path, priority, changeFrequency]) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...ferramentas,
  ];
}
