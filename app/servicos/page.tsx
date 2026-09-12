import type { Metadata } from "next";
import ServicosClient from "./ServicosClient";

export const metadata: Metadata = {
  title: "Serviços — TI gerenciada, e-mail corporativo, site e divulgação",
  description:
    "Gerenciamento de TI, gestão de e-mail corporativo com SPF/DKIM/DMARC, manutenção de site com SEO contínuo, Google Meu Negócio, Google Ads e Meta Ads, desenvolvimento sob medida e condução de projeto em Scrum. Contrato mensal com nota fiscal. Valores sob consulta.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: "Serviços — Maldivas Tech",
    description:
      "Um responsável de tecnologia, um valor fixo por mês: sistema, site, e-mails e divulgação sob um único contrato.",
    url: "/servicos",
  },
};

export default function Page() {
  return <ServicosClient />;
}
