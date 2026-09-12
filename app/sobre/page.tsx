import type { Metadata } from "next";
import SobreClient from "./SobreClient";

export const metadata: Metadata = {
  title: "Sobre — Rafael Maldivas e a Maldivas Tech",
  description:
    "Rafael Paiva Dias da Silva: 15 anos de vendas e inteligência de mercado antes da engenharia de software. Formado em Análise e Desenvolvimento de Sistemas pelo IFSP, piloto de drone certificado e fundador da Maldivas Tech, em São Paulo.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre — Maldivas Tech",
    description:
      "Quinze anos vendendo antes de escrever a primeira linha de código. É por isso que eu começo pelo processo.",
    url: "/sobre",
  },
};

export default function Page() {
  return <SobreClient />;
}
