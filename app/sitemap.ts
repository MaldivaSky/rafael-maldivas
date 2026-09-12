import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/servicos", 0.9, "monthly"],
    ["/portfolio", 0.9, "monthly"],
    ["/ferramentas", 0.8, "monthly"],
    ["/sobre", 0.6, "yearly"],
  ];

  return routes.map(([path, priority, changeFrequency]) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
