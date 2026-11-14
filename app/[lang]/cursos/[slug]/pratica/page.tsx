import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { courseBySlug, courseList, type CourseSlug } from "@/app/lib/courses";
import CoursePracticeStationClient from "@/app/components/curso/CoursePracticeStationClient";

export function generateStaticParams(): { lang: Lang; slug: CourseSlug }[] {
  const params: { lang: Lang; slug: CourseSlug }[] = [];
  for (const lang of LOCALES) {
    for (const c of courseList) params.push({ lang, slug: c.slug });
  }
  return params;
}

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const course = courseBySlug(params.slug);
  if (!course) return {};

  return buildMetadata({
    lang,
    path: `cursos/${course.slug}/pratica`,
    title:
      lang === "pt"
        ? `Arena Prática Gamificada — ${course.name}`
        : `Gamified Practice Arena — ${course.copy.en.h1}`,
    description:
      lang === "pt"
        ? "Estações práticas em tela cheia: Casa Pré-Moldada no VS Code, Terminal Preto simulado, Sandbox Python/SQL, Fábrica de Loja e Publicação R$ 0."
        : "Full-screen interactive practice stations: VS Code starter kit, simulated terminal, Python/SQL sandbox, storefront builder and free cloud deploy.",
  });
}

export default async function CoursePracticeStationPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const params = await paramsP;
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const course = courseBySlug(params.slug);
  if (!course) notFound();

  return (
    <Suspense
      fallback={
        <main className="wrap curso-page-main">
          <p className="curso-muted">Carregando Arena Prática...</p>
        </main>
      }
    >
      <CoursePracticeStationClient courseSlug={course.slug} lang={lang} />
    </Suspense>
  );
}
