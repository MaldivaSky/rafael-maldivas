import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafael Paiva — Desenvolvedor Fullstack · Dados & BI",
  description:
    "Portfólio de Rafael Paiva: desenvolvedor fullstack e analista de dados. ERPs, marketplaces, apps com IA e dashboards — Python, TypeScript, React, Django e PostgreSQL.",
  keywords: [
    "Rafael Paiva",
    "desenvolvedor fullstack",
    "analista de dados",
    "React",
    "Python",
    "TypeScript",
    "portfolio",
  ],
  openGraph: {
    title: "Rafael Paiva — Desenvolvedor Fullstack · Dados & BI",
    description:
      "ERPs, marketplaces, apps com IA e dashboards em produção. Python · TypeScript · React · PostgreSQL.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
