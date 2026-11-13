import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { LOCALES, isLang, localePath, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import {
  courseBySlug,
  courseList,
  formatDuration,
  totalCourseMinutes,
  type CourseSlug,
} from "@/app/lib/courses";
import { COMPANY, SITE } from "@/app/lib/site";
import { ORACLE_CERT } from "@/app/lib/credentials";
import CourseWaitlistForm from "@/app/components/curso/CourseWaitlistForm";

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
  const c = course.copy[lang];

  return buildMetadata({
    lang,
    path: `cursos/${course.slug}`,
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
  });
}

const SALES_COPY = {
  pt: {
    heroTag: "Curso livre profissional · Estudo de caso MySuperStore",
    ctaFree: "Acessar Módulo 1 gratuito",
    ctaWaitlist: "Entrar na lista de espera",
    statsModules: "módulos",
    statsDuration: "carga horária real",
    statsCase: "sistema em produção",
    statsFree: "Módulo 1 completo",
    forWhoTag: "Para quem é",
    forWhoTitle: "Público-alvo e pré-requisitos",
    forWhoList: [
      "Desenvolvedores back-end ou full-stack que querem entender pagamentos, split, repasse e concorrência em produção",
      "Quem precisa projetar ou auditar um marketplace multi-lojista com PIX e cartão",
      "Profissionais que desejam defender decisões de arquitetura com exemplos reais de código",
    ],
    prereqTitle: "Pré-requisitos recomendados",
    prereqList: [
      "Lógica de programação e noções de Python",
      "Noções de banco de dados relacional (SQL)",
      "Noções de HTTP, APIs REST e JSON",
    ],
    deliverTag: "O que você leva",
    deliverTitle: "Estrutura pensada para quem constrói",
    deliverItems: [
      {
        title: "9 módulos progressivos",
        desc: "Da margem por pedido ao modelo de dados, segurança financeira, tempo real, mídia, deploy, operação jurídica e projeto final.",
      },
      {
        title: "Simuladores e fluxos interativos dentro das lições",
        desc: "Calcule margem em centavos, ponto de equilíbrio e inspecione cada passo do webhook PIX no código.",
      },
      {
        title: "PDF de apoio por módulo",
        desc: "Material escrito para consulta offline. O PDF completo do Módulo 1 já está liberado gratuitamente.",
      },
      {
        title: "Quizzes com explicação e projeto final avaliado",
        desc: "Cada pergunta explica o porquê da resposta certa e dos erros. O projeto final segue rubrica técnica objetiva.",
      },
    ],
    honestTag: "A conta honesta",
    honestTitle: "Comissão menos taxas: o que realmente sobra por pedido",
    honestLead:
      "Em vez de prometer resultados, o curso começa mostrando a conta real extraída das configurações de referência do MySuperStore (exemplo ilustrativo para pedido de R$ 100,00 sem frete, com comissão de 12%):",
    honestNote:
      "Valores de exemplo baseados no código verificado em 12/11/2026 (settings/base.py:340-351). Taxas reais dependem do seu contrato com o provedor. Esta simulação não é garantia de resultado.",
    honestCta: "Testar no simulador do Módulo 1",
    syllabusTag: "Ementa",
    syllabusTitle: "Conteúdo programático dos 9 módulos",
    freeLabel: "Gratuito · Disponível agora",
    soonLabel: "Em breve",
    openLesson: "Abrir lição gratuita",
    viewSummary: "Ver resumo",
    certTag: "Certificação e transparência",
    certTitle: "Certificado de conclusão de curso livre",
    certPoints: [
      "Este é um curso livre de capacitação profissional — não é reconhecido, autorizado ou validado pelo MEC, e não equivale a diploma, curso técnico, graduação ou pós-graduação.",
      "Critério de emissão: conclusão das atividades, aproveitamento mínimo nos quizzes e aprovação no projeto final pela rubrica técnica.",
      "Verificação pública: cada certificado terá código único consultável no site da Maldivas Tech (em /[lang]/certificados/[codigo]), exibindo nome, curso, carga horária real, data e status (válido ou revogado).",
    ],
    legalTitle: "Termos, cancelamento e reembolso",
    legalItems: [
      "Política de reembolso e direito de arrependimento (CDC art. 49): [A DEFINIR COM ADVOGADO]",
      "Termos de uso do curso e licença do material didático: [A DEFINIR COM ADVOGADO]",
      "Política de privacidade e guarda de registros de certificação (LGPD): [A DEFINIR COM ADVOGADO]",
    ],
    instructorTag: "Instrutor",
    instructorTitle: "Rafael Maldivas",
    instructorBio:
      "Fundador da Maldivas Tech, Product Owner e engenheiro responsável pelo desenvolvimento de sistemas SaaS multi-tenant e marketplaces em produção (MySuperStore, MiseOn, SelectSys Jobs).",
    faqTag: "Dúvidas frequentes",
    faqTitle: "Perguntas e respostas",
    backToCatalog: "Voltar para todos os cursos",
  },
  en: {
    heroTag: "Professional training course · MySuperStore Case Study",
    ctaFree: "Open free Module 1 (pt-BR)",
    ctaWaitlist: "Join the waitlist",
    statsModules: "modules",
    statsDuration: "total course hours",
    statsCase: "production codebase",
    statsFree: "Module 1 unlocked",
    forWhoTag: "Audience",
    forWhoTitle: "Who this course is for & prerequisites",
    forWhoList: [
      "Backend and full-stack developers who want to master marketplace payments, split payouts and concurrency in production",
      "Engineers designing or auditing multi-vendor marketplaces with PIX and cards",
      "Professionals preparing to defend real-world architectural trade-offs",
    ],
    prereqTitle: "Recommended prerequisites",
    prereqList: [
      "Programming fundamentals and basic Python",
      "Relational database basics (SQL)",
      "HTTP, REST APIs and JSON fundamentals",
    ],
    deliverTag: "What you get",
    deliverTitle: "Built around production engineering",
    deliverItems: [
      {
        title: "9 structured modules",
        desc: "From order unit economics to data modeling, financial safety, real-time events, media, deployment, operations and final project.",
      },
      {
        title: "Interactive simulators inside lessons",
        desc: "Run integer-cent margin calculations, break-even projections and inspect each PIX webhook step.",
      },
      {
        title: "Downloadable PDF per module",
        desc: "Written reference guides for offline study. Module 1 PDF is already free to download (in Portuguese).",
      },
      {
        title: "Explained quizzes & rubric-graded final project",
        desc: "Every quiz option explains why it is right or wrong. The final project is graded against an objective rubric.",
      },
    ],
    honestTag: "Unit economics",
    honestTitle: "Commission minus provider fees: the real math per order",
    honestLead:
      "Instead of income promises, the course starts by showing the exact math from MySuperStore reference settings (illustrative example for a R$ 100.00 order, 12% commission):",
    honestNote:
      "Illustrative example values verified in the codebase on 2026-11-12 (settings/base.py:340-351). Actual fees depend on your provider contract. This simulation is not a guarantee of financial results.",
    honestCta: "Try the interactive simulator (pt-BR)",
    syllabusTag: "Syllabus",
    syllabusTitle: "9-module curriculum",
    freeLabel: "Free · Available now (pt-BR)",
    soonLabel: "Coming soon",
    openLesson: "Open free lesson",
    viewSummary: "View summary",
    certTag: "Certification & disclosure",
    certTitle: "Verifiable certificate of completion (curso livre)",
    certPoints: [
      "Under Brazilian education law, this is a free-standing professional training course (curso livre). It is NOT accredited by Brazil's Ministry of Education (MEC) and is not a university degree or technical diploma.",
      "Issuance criteria: completing module quizzes and passing the final project technical rubric.",
      "Public verification: each certificate receives a unique verification code at /[lang]/certificados/[codigo] showing holder name, course, exact hours, date and status.",
    ],
    legalTitle: "Terms, cancellation and refund policy",
    legalItems: [
      "Refund policy & cooling-off period: [A DEFINIR COM ADVOGADO]",
      "Course terms of use & content license: [A DEFINIR COM ADVOGADO]",
      "Privacy policy & certificate record retention: [A DEFINIR COM ADVOGADO]",
    ],
    instructorTag: "Instructor",
    instructorTitle: "Rafael Maldivas",
    instructorBio:
      "Founder of Maldivas Tech, Product Owner and engineer behind production multi-tenant SaaS and marketplace systems (MySuperStore, MiseOn, SelectSys Jobs).",
    faqTag: "FAQ",
    faqTitle: "Frequently asked questions",
    backToCatalog: "Back to all courses",
  },
} as const;

export default async function CourseSalesPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const params = await paramsP;
  if (!isLang(params.lang)) notFound();
  const lang = params.lang as Lang;
  const course = courseBySlug(params.slug);
  if (!course) notFound();

  const c = course.copy[lang];
  const t = SALES_COPY[lang];
  const totalMin = totalCourseMinutes(course);
  const url = `${SITE}/${lang}/cursos/${course.slug}`;
  const firstFreeLesson = course.modules[0]?.lessons[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: c.h1,
        description: c.metaDescription,
        url,
        inLanguage: "pt-BR",
        provider: { "@id": `${SITE}/#organization` },
        creator: { "@id": `${SITE}/#founder` },
        educationalLevel: course.level,
        timeRequired: `PT${totalMin}M`,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: `PT${totalMin}M`,
        },
        syllabusSections: course.modules.map((m) => ({
          "@type": "Syllabus",
          name: `Módulo ${m.number}: ${m.title}`,
          description: m.description,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: c.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
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
          { "@type": "ListItem", position: 3, name: c.h1, item: url },
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

      <header className="curso-hero">
        <div className="wrap">
          <div className="curso-hero-badge">{t.heroTag}</div>
          <h1>{c.h1}</h1>
          <p className="hero-lead">{c.tagline}</p>

          <div className="cta-row">
            {firstFreeLesson && (
              <Link
                href={localePath(
                  `/cursos/${course.slug}/${firstFreeLesson.slug}`,
                  lang,
                )}
                className="btn btn-primary"
              >
                <PlayCircle size={18} aria-hidden="true" />
                {t.ctaFree}
              </Link>
            )}
            <a href="#lista-de-espera" className="btn btn-ghost">
              {t.ctaWaitlist}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="prod-stats">
            <div className="prod-stat">
              <span className="prod-stat-n">{course.modules.length}</span>
              <span className="prod-stat-l">{t.statsModules}</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-n">{formatDuration(totalMin, lang)}</span>
              <span className="prod-stat-l">{t.statsDuration}</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-n">{course.studyCase}</span>
              <span className="prod-stat-l">{t.statsCase}</span>
            </div>
            <div className="prod-stat">
              <span className="prod-stat-n">100%</span>
              <span className="prod-stat-l">{t.statsFree}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Para quem é & pré-requisitos */}
      <section className="curso-section">
        <div className="wrap curso-two-col">
          <div className="curso-panel">
            <div className="sec-tag">{t.forWhoTag}</div>
            <h2>{t.forWhoTitle}</h2>
            <ul className="curso-bullet-list">
              {t.forWhoList.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="curso-panel">
            <div className="sec-tag">{t.prereqTitle}</div>
            <h3>{t.prereqTitle}</h3>
            <ul className="curso-bullet-list">
              {t.prereqList.map((item) => (
                <li key={item}>
                  <BookOpen size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="tags" style={{ marginTop: 20 }}>
              {course.stack.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* O que você leva */}
      <section className="curso-section">
        <div className="wrap">
          <div className="sec-tag">{t.deliverTag}</div>
          <h2>{t.deliverTitle}</h2>
          <div className="curso-deliver-grid">
            {t.deliverItems.map((item) => (
              <div key={item.title} className="curso-panel">
                <h3>{item.title}</h3>
                <p className="curso-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A conta honesta */}
      <section className="curso-section">
        <div className="wrap">
          <div className="curso-panel">
            <div className="sec-tag">{t.honestTag}</div>
            <h2>{t.honestTitle}</h2>
            <p className="curso-muted">{t.honestLead}</p>

            <div className="curso-table-wrap">
              <table className="curso-table">
                <thead>
                  <tr>
                    <th>{lang === "pt" ? "Pagamento" : "Payment"}</th>
                    <th>{lang === "pt" ? "Comissão 12%" : "12% Commission"}</th>
                    <th>{lang === "pt" ? "Taxa Efí (exemplo)" : "Provider fee (example)"}</th>
                    <th>{lang === "pt" ? "Sobra da plataforma" : "Platform net"}</th>
                    <th>{lang === "pt" ? "Repasse ao lojista" : "Seller payout"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PIX</td>
                    <td>R$ 12,00</td>
                    <td>0,99% = R$ 0,99</td>
                    <td>
                      <strong>R$ 11,01</strong>
                    </td>
                    <td>R$ 88,00</td>
                  </tr>
                  <tr>
                    <td>{lang === "pt" ? "Cartão" : "Card"}</td>
                    <td>R$ 12,00</td>
                    <td>3,99% + R$ 0,39 = R$ 4,38</td>
                    <td>
                      <strong>R$ 7,62</strong>
                    </td>
                    <td>R$ 88,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="curso-fine">{t.honestNote}</p>

            {firstFreeLesson && (
              <div style={{ marginTop: 18 }}>
                <Link
                  href={localePath(
                    `/cursos/${course.slug}/${firstFreeLesson.slug}`,
                    lang,
                  )}
                  className="btn btn-primary"
                >
                  {t.honestCta}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ementa */}
      <section className="curso-section" id="ementa">
        <div className="wrap">
          <div className="sec-tag">{t.syllabusTag}</div>
          <h2>{t.syllabusTitle}</h2>

          <div className="curso-syllabus-list">
            {course.modules.map((mod) => {
              const modDuration = mod.lessons.reduce((s, l) => s + l.durationMin, 0);
              const hasFree = mod.lessons.some((l) => l.status === "gratuita");
              return (
                <article
                  key={mod.id}
                  className={`curso-module-card ${hasFree ? "free" : ""}`}
                >
                  <div className="curso-module-head">
                    <div>
                      <span className="curso-module-num">
                        Módulo {String(mod.number).padStart(2, "0")}
                      </span>
                      <h3>{mod.title}</h3>
                    </div>
                    <div className="curso-module-badges">
                      <span className={hasFree ? "curso-badge" : "curso-pill"}>
                        {hasFree ? t.freeLabel : t.soonLabel}
                      </span>
                      {modDuration > 0 && (
                        <span className="curso-pill">
                          <Clock size={13} aria-hidden="true" />{" "}
                          {formatDuration(modDuration, lang)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="curso-muted">{mod.description}</p>
                  <div className="curso-module-foot" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {mod.lessons.map((lesson) => {
                      const isFree = lesson.status === "gratuita";
                      return (
                        <Link
                          key={lesson.id}
                          href={localePath(
                            `/cursos/${course.slug}/${lesson.slug}`,
                            lang,
                          )}
                          className={
                            isFree ? "btn btn-primary curso-btn-sm" : "btn btn-ghost curso-btn-sm"
                          }
                        >
                          {isFree ? (
                            <PlayCircle size={15} aria-hidden="true" />
                          ) : (
                            <Lock size={15} aria-hidden="true" />
                          )}
                          {mod.lessons.length > 1
                            ? lesson.title
                            : isFree
                              ? t.openLesson
                              : t.viewSummary}
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certificado e aviso legal */}
      <section className="curso-section">
        <div className="wrap curso-two-col">
          <div className="curso-panel">
            <div className="sec-tag">{t.certTag}</div>
            <h2>
              <Award size={22} aria-hidden="true" /> {t.certTitle}
            </h2>
            <ul className="curso-bullet-list">
              {t.certPoints.map((pt) => (
                <li key={pt}>
                  <ShieldAlert size={18} aria-hidden="true" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="curso-panel">
            <div className="sec-tag">{t.instructorTag}</div>
            <h3>
              <UserCheck size={20} aria-hidden="true" /> {t.instructorTitle}
            </h3>
            <p className="curso-muted">{t.instructorBio}</p>
            <p className="curso-fine" style={{ marginTop: 10 }}>
              {COMPANY.legalName} · CNPJ {COMPANY.cnpj} · {ORACLE_CERT.name}
            </p>

            <hr className="curso-divider" style={{ margin: "20px 0" }} />

            <h3>
              <FileText size={18} aria-hidden="true" /> {t.legalTitle}
            </h3>
            <ul className="curso-legal-list">
              {t.legalItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lista de espera */}
      <section className="curso-section" id="lista-de-espera">
        <div className="wrap">
          <CourseWaitlistForm lang={lang} courseName={course.name} />
        </div>
      </section>

      {/* FAQ */}
      <section className="curso-section">
        <div className="wrap">
          <div className="sec-tag">{t.faqTag}</div>
          <h2>{t.faqTitle}</h2>
          <div className="curso-faq-list">
            {c.faq.map(([q, a]) => (
              <details key={q} className="curso-faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Link href={localePath("/cursos", lang)} className="btn btn-ghost">
              ← {t.backToCatalog}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

