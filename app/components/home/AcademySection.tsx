"use client";

import Link from "next/link";
import { Award, BadgeCheck, Code2, GraduationCap, PlayCircle, ShieldCheck, Wallet } from "lucide-react";
import { useLang, localePath } from "../../lib/i18n";
import { allCourseLessons, courseBySlug } from "../../lib/courses";

/**
 * Academy — campanha do curso livre gratuito com certificado verificável.
 * Números e currículo vêm de lib/courses.ts (fonte única): se uma aula
 * mudar lá, a home acompanha sozinha.
 */
const SLUG = "construa-seu-marketplace";

export default function AcademySection() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const course = courseBySlug(SLUG);
  if (!course) return null;

  const lessons = allCourseLessons(course);
  const free = lessons.filter((l) => l.status === "gratuita").length;
  const minutes = lessons.reduce((s, l) => s + l.durationMin, 0);
  const hours = `${Math.floor(minutes / 60)}h${minutes % 60 ? String(minutes % 60).padStart(2, "0") : ""}`;
  const first = lessons[0];

  const outcomes = pt
    ? [
        { icon: Wallet, t: "Dinheiro que fecha a conta", d: "Centavos inteiros, comissão, taxa de PIX e cartão: a conta de R$ 100 que quase ninguém faz antes de lançar um marketplace." },
        { icon: ShieldCheck, t: "Pagamento que não se perde", d: "Webhook idempotente, estoque com trava, repasse e estorno — os bugs que custam dinheiro de verdade, corrigidos no código." },
        { icon: Code2, t: "Código de produção, não de tutorial", d: "Você estuda o MySuperStore, que roda a loja real da Eli Trassi, e faz deploy de graça no fim." },
      ]
    : [
        { icon: Wallet, t: "Money math that adds up", d: "Integer cents, commission, PIX and card fees: the BRL 100 math almost nobody does before launching a marketplace." },
        { icon: ShieldCheck, t: "Payments that don't get lost", d: "Idempotent webhooks, stock locks, payouts and refunds — the bugs that cost real money, fixed in code." },
        { icon: Code2, t: "Production code, not tutorial code", d: "You study MySuperStore, which runs Eli Trassi's real store, and deploy for free at the end." },
      ];

  const steps = pt
    ? [
        ["Estude no seu ritmo", "Vídeos, áudios, slides, diagramas interativos, terminal no navegador e PDFs — tudo aberto, sem pagar nada."],
        ["Prove o que aprendeu", "Quizzes que explicam cada erro e um projeto final avaliado por rubrica técnica, com testes que provam o dinheiro."],
        ["Receba o certificado", `Certificado de curso livre com ${hours} de carga horária e código único, verificável publicamente no site da Maldivas Tech.`],
      ]
    : [
        ["Study at your pace", "Videos, audio, slides, interactive diagrams, an in-browser terminal and PDFs — all open, no payment."],
        ["Prove what you learned", "Quizzes that explain every mistake and a final project graded by a technical rubric, with tests that prove the money."],
        ["Get the certificate", `Free-standing course certificate with ${hours} of workload and a unique code, publicly verifiable on the Maldivas Tech site.`],
      ];

  const audiences = pt
    ? ["Quem está começando: o Módulo 0 parte do zero (6 aulas, 11h)", "Dev que quer entender pagamento em produção", "Dono de negócio que vai contratar ou lançar um marketplace"]
    : ["Beginners: Module 0 starts from zero (6 lessons, 11h)", "Developers who want to master payments in production", "Business owners about to hire or launch a marketplace"];

  return (
    <section className="h6-sec acad" id="academy" aria-labelledby="acad-title">
      <div className="wrap">
        <div className="acad-hero">
          <div className="acad-hero-copy">
            <span className="h6-kicker">{pt ? "MALDIVAS TECH ACADEMY · CURSO LIVRE" : "MALDIVAS TECH ACADEMY · FREE COURSE"}</span>
            <h2 id="acad-title">
              {pt ? (
                <>Aprenda a construir um marketplace que movimenta dinheiro de verdade. <em>Com certificado. De graça.</em></>
              ) : (
                <>Learn to build a marketplace that moves real money. <em>With a certificate. For free.</em></>
              )}
            </h2>
            <p className="acad-lead">
              {pt
                ? `“${course.name}” — o curso completo, com o código real que está em produção, aberto do primeiro ao último módulo.`
                : `“Build your marketplace: from code to payments in production” — the full course, with real production code, open from first to last module.`}
            </p>
            <div className="acad-cta">
              <Link className="btn btn-primary" href={localePath(`/cursos/${SLUG}/${first.slug}`, lang)} data-analytics="course_start">
                <PlayCircle size={17} aria-hidden="true" /> {pt ? "Começar grátis agora" : "Start free now"}
              </Link>
              <Link className="btn btn-ghost" href={localePath(`/cursos/${SLUG}`, lang)} data-analytics="course_syllabus">
                {pt ? "Ver ementa completa" : "See full syllabus"}
              </Link>
            </div>
            <p className="acad-fine">
              {pt
                ? "Curso livre de capacitação profissional, não regulamentado pelo MEC. Aulas em português."
                : "Free-standing professional course (not MEC-accredited). Lessons in Brazilian Portuguese."}
            </p>
          </div>

          <ul className="acad-stats" aria-label={pt ? "O curso em números" : "The course in numbers"}>
            <li><strong>{free}</strong><span>{pt ? "aulas abertas" : "open lessons"}</span></li>
            <li><strong>{hours}</strong><span>{pt ? "de conteúdo" : "of content"}</span></li>
            <li><strong>R$ 0</strong><span>{pt ? "para estudar" : "to study"}</span></li>
            <li className="is-cert">
              <strong><Award size={24} aria-hidden="true" /> {pt ? "Certificado" : "Certificate"}</strong>
              <span>{pt ? "com código verificável" : "with a verifiable code"}</span>
            </li>
          </ul>
        </div>

        <div className="acad-outcomes">
          {outcomes.map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon size={20} aria-hidden="true" />
              <strong>{t}</strong>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="acad-grid">
          <div className="acad-curriculum">
            <h3>{pt ? "O que você vai estudar" : "What you'll study"}</h3>
            <ol>
              {course.modules.map((m) => {
                const mins = m.lessons.reduce((s, l) => s + l.durationMin, 0);
                return (
                  <li key={m.id}>
                    <span className="acad-mod">{pt ? "Módulo" : "Module"} {m.number}</span>
                    <strong>{m.title}</strong>
                    <small>
                      {m.lessons.length} {m.lessons.length === 1 ? (pt ? "aula" : "lesson") : pt ? "aulas" : "lessons"} · {Math.round(mins / 60)}h
                    </small>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="acad-side">
            <div className="acad-cert">
              <h3><BadgeCheck size={19} aria-hidden="true" /> {pt ? "Como você conquista o certificado" : "How you earn the certificate"}</h3>
              <ol>
                {steps.map(([t, d]) => (
                  <li key={t}>
                    <strong>{t}</strong>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="acad-who">
              <h3><GraduationCap size={19} aria-hidden="true" /> {pt ? "Para quem é" : "Who it's for"}</h3>
              <ul>
                {audiences.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="acad-proof">
              <span>{pt ? "Pedido de R$ 100,00 no PIX" : "BRL 100.00 order via PIX"}</span>
              <p>{pt ? "Comissão 12% (R$ 12,00) − taxa 0,99% (R$ 0,99)" : "12% commission (BRL 12.00) − 0.99% fee (BRL 0.99)"}</p>
              <strong>{pt ? "Sobra para a plataforma: R$ 11,01" : "Platform keeps: BRL 11.01"}</strong>
              <small>{pt ? "No cartão sobra R$ 7,62. É a primeira conta do curso." : "On card it's BRL 7.62. It's the course's first lesson in money."}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
