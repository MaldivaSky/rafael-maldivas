import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lock, PlayCircle } from "lucide-react";
import { LOCALES, isLang, localePath, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import {
  allCourseLessons,
  courseBySlug,
  courseList,
  formatDuration,
  lessonBySlug,
} from "@/app/lib/courses";
import { SITE } from "@/app/lib/site";
import ModuleOneLessonClient from "@/app/components/curso/ModuleOneLessonClient";

export function generateStaticParams(): {
  lang: Lang;
  slug: string;
  licao: string;
}[] {
  const params: { lang: Lang; slug: string; licao: string }[] = [];
  for (const lang of LOCALES) {
    for (const course of courseList) {
      for (const lesson of allCourseLessons(course)) {
        params.push({ lang, slug: course.slug, licao: lesson.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string; licao: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const course = courseBySlug(params.slug);
  if (!course) return {};
  const lesson = lessonBySlug(course, params.licao);
  if (!lesson) return {};

  return buildMetadata({
    lang,
    path: `cursos/${course.slug}/${lesson.slug}`,
    title: `${lesson.title} | ${course.name}`,
    description: lesson.summary,
  });
}

export default async function CourseLessonPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string; licao: string }>;
}) {
  const params = await paramsP;
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const course = courseBySlug(params.slug);
  if (!course) notFound();
  const lesson = lessonBySlug(course, params.licao);
  if (!lesson) notFound();

  const allLessons = allCourseLessons(course);
  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = idx >= 0 ? allLessons[idx + 1] : undefined;
  const firstFree = allLessons.find((l) => l.status === "gratuita");
  const url = `${SITE}/${lang}/cursos/${course.slug}/${lesson.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        "@id": `${url}#lesson`,
        name: lesson.title,
        description: lesson.summary,
        url,
        inLanguage: "pt-BR",
        isAccessibleForFree: lesson.status === "gratuita",
        timeRequired: `PT${lesson.durationMin}M`,
        isPartOf: { "@id": `${SITE}/${lang}/cursos/${course.slug}#course` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "pt" ? "Início" : "Home",
            item: `${SITE}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "pt" ? "Cursos" : "Courses",
            item: `${SITE}/${lang}/cursos`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: course.copy[lang].h1,
            item: `${SITE}/${lang}/cursos/${course.slug}`,
          },
          { "@type": "ListItem", position: 4, name: lesson.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="wrap curso-page-main">
        <nav className="curso-breadcrumb" aria-label="Navegação do curso">
          <Link href={localePath(`/cursos/${course.slug}`, lang)}>
            <ArrowLeft size={15} aria-hidden="true" />
            {course.copy[lang].h1}
          </Link>
        </nav>

        <header className="curso-lesson-header">
          <div className="curso-card-badges">
            <span className={lesson.status === "gratuita" ? "curso-badge" : "curso-pill"}>
              {lesson.status === "gratuita"
                ? "Módulo gratuito"
                : "Em breve · Conteúdo pago"}
            </span>
            <span className="curso-pill">
              <Clock size={14} aria-hidden="true" />{" "}
              {formatDuration(lesson.durationMin, lang)}
            </span>
          </div>

          <h1>{lesson.title}</h1>
          <p className="hero-lead">{lesson.summary}</p>

          {lang === "en" && (
            <div className="curso-assumption" role="note">
              Lessons and interactive exercises are delivered in Brazilian Portuguese (pt-BR).{" "}
              <Link
                href={`/pt/cursos/${course.slug}/${lesson.slug}`}
                style={{ textDecoration: "underline", fontWeight: 600 }}
              >
                Switch to Portuguese version
              </Link>
              .
            </div>
          )}
        </header>

        {lesson.status === "gratuita" ? (
          <ModuleOneLessonClient
            courseSlug={course.slug}
            nextLessonSlug={nextLesson?.slug}
          />
        ) : (
          <section className="curso-panel curso-soon-box">
            <div className="curso-soon-icon">
              <Lock size={28} aria-hidden="true" />
            </div>
            <h2>Este módulo está em preparação</h2>
            <p className="curso-muted">
              O conteúdo completo, vídeos, áudios e PDF deste módulo serão disponibilizados
              na área paga do curso. Enquanto isso, você pode estudar o Módulo 1 completo e
              entrar na lista de espera.
            </p>

            {lesson.objectives.length > 0 && (
              <div className="curso-soon-objectives">
                <h3>O que este módulo vai cobrir:</h3>
                <ul>
                  {lesson.objectives.map((obj) => (
                    <li key={obj}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="cta-row" style={{ marginTop: 24 }}>
              {firstFree && (
                <Link
                  href={localePath(`/cursos/${course.slug}/${firstFree.slug}`, lang)}
                  className="btn btn-primary"
                >
                  <PlayCircle size={16} aria-hidden="true" />
                  Ir para o Módulo 1 gratuito
                </Link>
              )}
              <Link
                href={localePath(`/cursos/${course.slug}#lista-de-espera`, lang)}
                className="btn btn-ghost"
              >
                Entrar na lista de espera
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

