import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LOCALES, isLang, localePath, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import { courseBySlug, courseList, type CourseSlug } from "@/app/lib/courses";
import FinalExamCertificate from "@/app/components/curso/FinalExamCertificate";

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
    path: `cursos/${course.slug}/certificado`,
    title:
      lang === "pt"
        ? `Exame Final (80%+) e Certificado | ${course.name}`
        : `Final Exam (80%+) & Certificate | ${course.name}`,
    description:
      lang === "pt"
        ? "Avaliação final de 15 questões técnicas com nota mínima de 80% para emissão do certificado de conclusão de curso livre da Maldivas Tech."
        : "15-question technical final exam (80% passing score) for the Maldivas Tech free-standing certificate of completion.",
  });
}

export default async function CourseCertificatePage({
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
    <main className="wrap curso-page-main">
      <nav className="curso-breadcrumb" aria-label="Navegação do curso">
        <Link href={localePath(`/cursos/${course.slug}`, lang)}>
          <ArrowLeft size={15} aria-hidden="true" />
          {course.copy[lang].h1}
        </Link>
      </nav>

      <header className="curso-lesson-header">
        <div className="curso-card-badges">
          <span className="curso-badge">Exame Final · 80%+</span>
          <span className="curso-pill">Certificado Maldivas Tech · 38h 10min</span>
        </div>
        <h1>
          {lang === "pt"
            ? "Exame Final e Emissão de Certificado"
            : "Final Exam & Certificate"}
        </h1>
        <p className="hero-lead">
          {lang === "pt"
            ? "Prove seu domínio da trilha completa (Módulo 0 + A01 a A11 + Projeto Final). Com 80% ou mais de acertos, gere e imprima seu certificado em PDF."
            : "Complete the 15-question assessment (delivered in pt-BR) with 80%+ to issue and print your Maldivas Tech certificate."}
        </p>
      </header>

      <FinalExamCertificate />
    </main>
  );
}

