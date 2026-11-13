import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import EntrarClient from "./EntrarClient";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Entrar na Área do Aluno | Maldivas Tech",
  description: "Faça login com sua conta Google para acessar sua trilha de aprendizado, perfil e certificados.",
  robots: { index: false, follow: false },
};

export default async function EntrarPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}) {
  const params = await paramsP;
  const lang = (isLang(params.lang) ? params.lang : "pt") as Lang;

  return (
    <main className="wrap curso-page-main">
      <EntrarClient lang={lang} />
    </main>
  );
}
