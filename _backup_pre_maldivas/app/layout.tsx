import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafael Maldivas — Desenvolvedor Fullstack · Dados & BI",
  description:
    "Portfólio de Rafael Maldivas: desenvolvedor fullstack e analista de dados. ERPs, marketplaces, apps com IA e dashboards — Python, TypeScript, React, Django e PostgreSQL.",
  keywords: [
    "Rafael Maldivas",
    "desenvolvedor fullstack",
    "analista de dados",
    "React",
    "Python",
    "TypeScript",
    "portfolio",
  ],
  openGraph: {
    title: "Rafael Maldivas — Desenvolvedor Fullstack · Dados & BI",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
