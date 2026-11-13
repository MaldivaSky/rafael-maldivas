import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import PerfilClient from "./PerfilClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Meu Perfil | Maldivas Tech",
  description: "Gerencie seu perfil de aluno, links profissionais e nome para certificado.",
  robots: { index: false, follow: false },
};

export default async function PerfilPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}) {
  const params = await paramsP;
  const lang = (isLang(params.lang) ? params.lang : "pt") as Lang;

  return (
    <main className="wrap curso-page-main">
      <PerfilClient lang={lang} />
    </main>
  );
}

