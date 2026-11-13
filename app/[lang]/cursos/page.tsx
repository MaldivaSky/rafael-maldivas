import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, GraduationCap, PlayCircle } from "lucide-react";
import { LOCALES, isLang, localePath, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import {
  courseList,
  formatDuration,
  totalCourseMinutes,
} from "@/app/lib/courses";
import { SITE } from "@/app/lib/site";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const CATALOG_COPY = {
  pt: {
    metaTitle: "Cursos Profissionais de Engenharia de Software | Maldivas Tech",
    metaDescription:
      "Cursos livres baseados em sistemas reais em produção: modelagem de dados, pagamentos PIX, split, repasse, segurança e deploy. Comece pelo módulo gratuito.",
    keywords: [
      "cursos engenharia de software",
      "curso arquitetura de marketplace",
      "curso backend pagamentos pix",
      "Maldivas Tech cursos",
    ],
    tag: "Formação técnica",
    h1: "Cursos baseados em sistemas reais em produção",
    lead: "Sem projetos fictícios de tutorial. Cada módulo parte de código que processa pedidos, pagamentos, repasses e operação real.",
    freeBadge: "Módulos 0 e 1 gratuitos (7 aulas)",
    modalityBadge: "Curso livre · Certificado verificável",
    ctaDetails: "Ver ementa completa",
    ctaStart: "Começar pelo Módulo 0 gratuito",
    modulesLabel: "módulos",
    caseLabel: "Estudo de caso:",
  },
  en: {
    metaTitle: "Professional Software Engineering Courses | Maldivas Tech",
    metaDescription:
      "Hands-on engineering courses built on real production codebases: data modeling, payments, split payouts, idempotency and deployment.",
    keywords: [
      "software engineering courses",
      "marketplace architecture course",
      "production backend course",
      "Maldivas Tech courses",
    ],
    tag: "Technical training",
    h1: "Courses grounded in real production systems",
    lead: "No toy tutorial apps. Every module walks through production architecture for orders, payments, payouts and operations.",
    freeBadge: "Free Modules 0 & 1 (7 lessons, pt-BR)",
    modalityBadge: "Free-standing course · Verifiable certificate",
    ctaDetails: "View full syllabus",
    ctaStart: "Start free Module 0 (pt-BR)",
    modulesLabel: "modules",
    caseLabel: "Case study:",
  },
} as const;

export async function generateMetadata({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const t = CATALOG_COPY[lang];

  return buildMetadata({
    lang,
    path: "cursos",
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: [...t.keywords],
  });
}

export default async function CoursesIndexPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string }>;
}) {
  const params = await paramsP;
  const lang = (isLang(params.lang) ? params.lang : "pt") as Lang;
  const t = CATALOG_COPY[lang];
  const url = `${SITE}/${lang}/cursos`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: t.h1,
        description: t.metaDescription,
        inLanguage: lang === "pt" ? "pt-BR" : "en",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#crumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "pt" ? "Início" : "Home", item: `${SITE}/${lang}` },
          { "@type": "ListItem", position: 2, name: lang === "pt" ? "Cursos" : "Courses", item: url },
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
        <header className="curso-catalog-head">
          <div className="sec-tag">{t.tag}</div>
          <h1>{t.h1}</h1>
          <p className="hero-lead">{t.lead}</p>
        </header>

        <section className="curso-catalog-grid" aria-label={t.h1}>
          {courseList.map((course) => {
            const c = course.copy[lang];
            const totalMin = totalCourseMinutes(course);
            const firstFree = course.modules[0]?.lessons.find(
              (l) => l.status === "gratuita",
            );

            return (
              <article key={course.slug} className="curso-catalog-card">
                <div className="curso-card-badges">
                  <span className="curso-badge">{t.freeBadge}</span>
                  <span className="curso-pill">{t.modalityBadge}</span>
                </div>

                <h2>
                  <Link href={localePath(`/cursos/${course.slug}`, lang)}>
                    {c.h1}
                  </Link>
                </h2>

                <p className="curso-muted">{c.tagline}</p>

                <div className="curso-card-meta">
                  <span>
                    <BookOpen size={16} aria-hidden="true" />
                    {course.modules.length} {t.modulesLabel}
                  </span>
                  <span>
                    <Clock size={16} aria-hidden="true" />
                    {formatDuration(totalMin, lang)}
                  </span>
                  <span>
                    <GraduationCap size={16} aria-hidden="true" />
                    {t.caseLabel} {course.studyCase}
                  </span>
                </div>

                <div className="tags">
                  {course.stack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="cta-row">
                  <Link
                    href={localePath(`/cursos/${course.slug}`, lang)}
                    className="btn btn-primary"
                  >
                    {t.ctaDetails}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  {firstFree && (
                    <Link
                      href={localePath(
                        `/cursos/${course.slug}/${firstFree.slug}`,
                        lang,
                      )}
                      className="btn btn-ghost"
                    >
                      <PlayCircle size={16} aria-hidden="true" />
                      {t.ctaStart}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}

