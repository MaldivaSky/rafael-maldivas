"use client";

import Link from "next/link";
import { ArrowRight, FileText, PlayCircle, ShieldCheck } from "lucide-react";
import { useLang, localePath } from "@/app/lib/i18n";

const COPY = {
  pt: {
    tag: "Novo curso livre · Módulos 0 e 1 abertos sem cadastro",
    title: "A conta de R$ 100 que quase ninguém faz antes de criar um marketplace",
    lead: "Do zero absoluto em Django/DRF (Módulo 0 — Fundamentos, 6 lições / 11h) até a conta real do MySuperStore em produção (Módulo 1). Comece de graça agora, com simuladores, quizzes explicados e PDFs.",
    pixLabel: "Pedido de R$ 100,00 no PIX",
    pixMath: "Comissão 12% (R$ 12,00) − Taxa 0,99% (R$ 0,99)",
    pixNet: "Sobra: R$ 11,01",
    cardLabel: "Pedido de R$ 100,00 no Cartão",
    cardMath: "Comissão 12% (R$ 12,00) − Taxa 3,99% + R$ 0,39 (R$ 4,38)",
    cardNet: "Sobra: R$ 7,62",
    ctaFree: "Começar pelo Módulo 0 (Fundamentos)",
    ctaSyllabus: "Ver ementa completa",
    note: "Curso livre de capacitação profissional (não regulamentado pelo MEC). Valores de exemplo extraídos do código em 12/11/2026; simulação não é garantia de resultado.",
    highlights: [
      "Módulo 0: do zero à primeira API DRF e testes (6 lições, 11h)",
      "Módulo 1: simulador de margem em centavos + fluxo do PIX",
      "Quizzes explicando cada erro + PDFs gratuitos para baixar",
    ],
  },
  en: {
    tag: "New training course · Free Module 1 (pt-BR)",
    title: "The R$ 100 math almost nobody checks before building a marketplace",
    lead: "No empty income promises — we open the real MySuperStore production codebase. Inspect how much actually stays per order, try the integer-cent simulator and download Module 1 PDF for free.",
    pixLabel: "R$ 100.00 order via PIX",
    pixMath: "12% commission (R$ 12.00) − 0.99% fee (R$ 0.99)",
    pixNet: "Platform net: R$ 11.01",
    cardLabel: "R$ 100.00 order via Card",
    cardMath: "12% commission (R$ 12.00) − 3.99% + R$ 0.39 (R$ 4.38)",
    cardNet: "Platform net: R$ 7.62",
    ctaFree: "Open free Module 1 (pt-BR)",
    ctaSyllabus: "View 9-module syllabus",
    note: "Free-standing professional course (curso livre, not MEC-accredited). Illustrative code examples verified on 2026-11-12; simulations do not guarantee financial results.",
    highlights: [
      "Order margin + break-even simulator",
      "Step-by-step PIX webhook & idempotency flow",
      "Free Module 1 PDF + explained quiz",
    ],
  },
} as const;

export default function CourseInvite() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <section className="curso-home-invite" aria-labelledby="curso-invite-title">
      <div className="wrap">
        <div className="curso-invite-card">
          <div className="curso-invite-main">
            <div className="sec-tag">{t.tag}</div>
            <h2 id="curso-invite-title">{t.title}</h2>
            <p className="curso-muted">{t.lead}</p>

            <ul className="curso-invite-list">
              {t.highlights.map((h) => (
                <li key={h}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="cta-row" style={{ marginTop: 22 }}>
              <Link
                href={localePath(
                  "/cursos/construa-seu-marketplace/modulo-0-f01-o-mapa",
                  lang,
                )}
                className="btn btn-primary"
              >
                <PlayCircle size={17} aria-hidden="true" />
                {t.ctaFree}
              </Link>
              <Link
                href={localePath("/cursos/construa-seu-marketplace", lang)}
                className="btn btn-ghost"
              >
                <FileText size={16} aria-hidden="true" />
                {t.ctaSyllabus}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <p className="curso-fine">{t.note}</p>
          </div>

          <div className="curso-invite-proof" aria-label={t.pixLabel}>
            <div className="curso-proof-box">
              <span className="curso-badge">PIX</span>
              <strong>{t.pixLabel}</strong>
              <p>{t.pixMath}</p>
              <span className="curso-proof-net">{t.pixNet}</span>
            </div>

            <div className="curso-proof-box warn">
              <span className="curso-pill">Cartão</span>
              <strong>{t.cardLabel}</strong>
              <p>{t.cardMath}</p>
              <span className="curso-proof-net warn">{t.cardNet}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

