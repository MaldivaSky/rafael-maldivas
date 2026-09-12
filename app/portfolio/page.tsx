import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfólio — sistemas em produção, clientes reais e audiovisual",
  description:
    "MiseOn, SelectSys Jobs, mercadinhosys e MySuperStore em produção, além de entregas para pet shop, salão de beleza e food service. Inclui produção de vídeo institucional e captação aérea com drone em São Paulo.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfólio — Maldivas Tech",
    description:
      "Plataformas SaaS em operação, sistemas entregues a clientes reais e produção audiovisual própria.",
    url: "/portfolio",
  },
};

export default function Page() {
  return <PortfolioClient />;
}
