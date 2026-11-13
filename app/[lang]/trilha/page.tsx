import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import TrilhaClient from "./TrilhaClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Minha Trilha & Curso | Maldivas Tech",
  description:
    "Acompanhe seu progresso na trilha, aulas concluídas, notas de quizzes e certificados verificáveis.",
  robots: { index: false, follow: false },
};

export default async function TrilhaPage({
  params: paramsP,
  searchParams: searchParamsP,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ auth_error?: string }>;
}) {
  const params = await paramsP;
  const searchParams = await searchParamsP;
  const lang = (isLang(params.lang) ? params.lang : "pt") as Lang;

  return (
    <main className="wrap curso-page-main">
      <TrilhaClient lang={lang} authError={searchParams.auth_error} />
    </main>
  );
}

