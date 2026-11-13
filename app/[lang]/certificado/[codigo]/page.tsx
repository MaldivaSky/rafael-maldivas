import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { Award, ShieldAlert } from "lucide-react";
import { COURSES, formatDuration } from "@/app/lib/courses";
import { isLang, localePath, type Lang } from "@/app/lib/seo";
import { COMPANY, SITE } from "@/app/lib/site";
import { oracleConfigurado, validarCertificadoPublico } from "@/app/lib/oracle-students";
import CertificadoActions from "./CertificadoActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificado Verificável | Maldivas Tech",
  description:
    "Certificado oficial de conclusão de curso livre emitido pela Maldivas Tech com código rastreável e QR Code.",
};

export default async function CertificadoPublicoPage({
  params: paramsP,
}: {
  params: Promise<{ lang: string; codigo: string }>;
}) {
  const params = await paramsP;
  const lang = (isLang(params.lang) ? params.lang : "pt") as Lang;
  const codigo = decodeURIComponent(params.codigo ?? "");

  const cert = oracleConfigurado()
    ? await validarCertificadoPublico(codigo).catch(() => null)
    : null;
  const course =
    cert && cert.curso_slug in COURSES
      ? COURSES[cert.curso_slug as keyof typeof COURSES]
      : COURSES["construa-seu-marketplace"];

  const verifyUrl = `${SITE}/${lang}/certificado/${encodeURIComponent(cert?.codigo ?? codigo)}`;

  if (!cert) {
    return (
      <main className="wrap curso-page-main">
        <section
          className="curso-catalog-card"
          style={{ maxWidth: 720, margin: "0 auto", padding: "2.25rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: "#f87171",
              fontWeight: 600,
            }}
          >
            <ShieldAlert size={22} aria-hidden="true" />
            Certificado não encontrado
          </div>
          <h1 style={{ marginTop: "0.9rem", fontSize: "1.5rem" }}>
            Código inválido ou inexistente
          </h1>
          <p className="curso-muted" style={{ marginTop: "0.5rem" }}>
            Não localizamos nenhum certificado com o código <code>{codigo}</code>.
            Confira se não há espaços ou caracteres trocados.
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link
              href={localePath("/cursos", lang)}
              className="btn-p"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
            >
              <Award size={16} aria-hidden="true" />
              Ver cursos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const qrSvg = await QRCode.toString(verifyUrl, {
    type: "svg",
    margin: 1,
    width: 112,
    color: { dark: "#0F2942", light: "#FAF8F2" },
  });

  const dataEmissao = new Date(cert.emitido_em).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const computedMinutes = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((s, l) => s + l.durationMin, 0),
    0,
  );
  const cargaMin = cert.carga_horaria_min > 0 ? cert.carga_horaria_min : computedMinutes;

  return (
    <main className="wrap curso-page-main cert-sheet-root" style={{ maxWidth: 1080 }}>
      <CertificadoActions verifyUrl={verifyUrl} codigo={cert.codigo} />

      {/* ================================================================ */}
      {/*  FRENTE DO CERTIFICADO (Padrão Institucional A4 Paisagem)         */}
      {/* ================================================================ */}
      <article
        className="cert-page"
        aria-label="Certificado de Conclusão — Frente"
        style={{
          position: "relative",
          background: "#FAF8F2",
          color: "#0F172A",
          padding: "16px",
          borderRadius: "4px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
          border: "2px solid #0F2942",
          overflow: "hidden",
        }}
      >
        {/* Marca d'água sutil */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            opacity: 0.035,
            fontSize: "4.5rem",
            fontWeight: 900,
            letterSpacing: "0.22em",
            color: "#0F2942",
            transform: "rotate(-22deg)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          MALDIVAS TECH
        </div>

        {/* Moldura dupla interna dourada + azul-marinho */}
        <div
          style={{
            position: "relative",
            border: "2px solid #B8860B",
            padding: "2.25rem 2.75rem",
            display: "grid",
            gap: "1.4rem",
          }}
        >
          {/* Cabeçalho institucional com Selo SVG */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              borderBottom: "1.5px solid #CBD5E1",
              paddingBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <Image
                src="/brand/logo-mark.png"
                alt="Maldivas Tech"
                width={52}
                height={52}
              />
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    letterSpacing: "0.08em",
                    color: "#0F2942",
                  }}
                >
                  MALDIVAS TECH
                </div>
                <div style={{ fontSize: "0.82rem", color: "#475569", fontWeight: 500 }}>
                  Engenharia de Software &amp; Sistemas em Produção · CNPJ {COMPANY.cnpj}
                </div>
              </div>
            </div>

            {/* Selo Institucional Vetorial */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <svg
                width="54"
                height="54"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="32" cy="28" r="22" fill="#0F2942" stroke="#B8860B" strokeWidth="3" />
                <circle cx="32" cy="28" r="17" stroke="#EAB308" strokeWidth="1" strokeDasharray="3 2" />
                <path d="M23 47L19 60L27 55L32 61L37 55L45 60L41 47" fill="#B8860B" />
                <path
                  d="M25 28L30 33L40 23"
                  stroke="#FAF8F2"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ textAlign: "right", fontSize: "0.76rem", color: "#334155", lineHeight: 1.35 }}>
                <strong style={{ color: "#0F2942", display: "block", fontSize: "0.82rem" }}>
                  REGISTRO VERIFICÁVEL
                </strong>
                Código: <strong style={{ color: "#0F2942" }}>{cert.codigo}</strong>
              </div>
            </div>
          </header>

          {/* Título e Nome do Concluinte */}
          <div style={{ textAlign: "center", padding: "0.25rem 0" }}>
            <div
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                fontSize: "0.88rem",
                color: "#B8860B",
                fontWeight: 700,
              }}
            >
              Certificado de Conclusão · Curso Livre de Capacitação Profissional
            </div>

            <p style={{ margin: "0.9rem 0 0.25rem", fontSize: "1rem", color: "#334155" }}>
              Certificamos que
            </p>

            <h1
              style={{
                margin: "0 auto",
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "clamp(1.75rem, 3.1vw, 2.5rem)",
                fontWeight: 700,
                color: "#0F2942",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                borderBottom: "1.5px solid #B8860B",
                display: "inline-block",
                padding: "0 1.5rem 0.35rem",
              }}
            >
              {cert.nome_exibido}
            </h1>

            <p
              style={{
                margin: "1rem auto 0",
                fontSize: "1.02rem",
                lineHeight: 1.65,
                color: "#1E293B",
                maxWidth: 780,
              }}
            >
              concluiu com êxito o programa de formação{" "}
              <strong style={{ color: "#0F2942" }}>{course.name}</strong>, baseado na
              arquitetura em produção do estudo de caso{" "}
              <strong style={{ color: "#0F2942" }}>{course.studyCase}</strong>, tendo
              cumprido integralmente a carga horária e obtido aprovação na avaliação
              técnica final.
            </p>
          </div>

          {/* Quadro de Aproveitamento & Carga Horária */}
          <section
            aria-label="Resumo Acadêmico"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              background: "#F1EFE7",
              border: "1px solid #CBD5E1",
              borderRadius: "6px",
              padding: "0.9rem 1.1rem",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", fontWeight: 700 }}>
                Carga Horária Total
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F2942", marginTop: "0.15rem" }}>
                {formatDuration(cargaMin, lang)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", fontWeight: 700 }}>
                Aproveitamento Final
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#15803D", marginTop: "0.15rem" }}>
                {cert.nota_final}% · Aprovado
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", fontWeight: 700 }}>
                Estrutura Curricular
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F2942", marginTop: "0.2rem" }}>
                {course.modules.length} módulos · {totalLessons} aulas
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", fontWeight: 700 }}>
                Data de Emissão
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F2942", marginTop: "0.25rem" }}>
                {dataEmissao}
              </div>
            </div>
          </section>

          {/* Rodapé: Assinatura + Dados Legais + QR Code Real */}
          <footer
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1.4fr auto",
              gap: "1.5rem",
              borderTop: "1.5px solid #CBD5E1",
              paddingTop: "1.15rem",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: "italic",
                  fontSize: "1.3rem",
                  color: "#0F2942",
                  borderBottom: "1px solid #64748B",
                  paddingBottom: "0.25rem",
                  marginBottom: "0.35rem",
                  display: "inline-block",
                  minWidth: 230,
                }}
              >
                Rafael Paiva Dias da Silva
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "#0F2942" }}>
                Rafael Paiva Dias da Silva
              </div>
              <div style={{ fontSize: "0.76rem", color: "#475569", lineHeight: 1.4 }}>
                Tecnólogo em Análise e Desenvolvimento de Sistemas (IFSP)
                <br />
                Instrutor Responsável &amp; Fundador · Maldivas Tech
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "#334155", lineHeight: 1.5 }}>
              <div>
                <strong>Emissor:</strong> {COMPANY.legalName}
              </div>
              <div>
                <strong>CNPJ:</strong> {COMPANY.cnpj} · São Paulo/SP
              </div>
              <div>
                <strong>Base Legal:</strong> Curso Livre de Capacitação Profissional (Lei
                Federal nº 9.394/1996 e Decreto nº 5.154/2004).
              </div>
              <div>
                <strong>Autenticidade:</strong>{" "}
                <span style={{ wordBreak: "break-all" }}>{verifyUrl}</span>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px",
                  background: "#FAF8F2",
                  border: "1px solid #CBD5E1",
                  borderRadius: "4px",
                }}
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <div style={{ fontSize: "0.66rem", color: "#475569", marginTop: "2px", fontWeight: 600 }}>
                Validar QR Code
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* ================================================================ */}
      {/*  VERSO DO CERTIFICADO (Histórico & Matriz Curricular Completa)    */}
      {/* ================================================================ */}
      <section
        className="cert-page"
        style={{
          marginTop: "2rem",
          background: "#FAF8F2",
          color: "#0F172A",
          padding: "16px",
          borderRadius: "4px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
          border: "2px solid #0F2942",
        }}
        aria-label="Verso do Certificado — Histórico e Conteúdo Programático"
      >
        <div style={{ border: "2px solid #B8860B", padding: "1.75rem 2.25rem", display: "grid", gap: "1rem" }}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1.5px solid #CBD5E1",
              paddingBottom: "0.75rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#B8860B", fontWeight: 700 }}>
                Verso do Certificado · Histórico &amp; Matriz Curricular
              </div>
              <h2 style={{ margin: "0.2rem 0 0", fontSize: "1.15rem", color: "#0F2942" }}>
                {course.name}
              </h2>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#334155" }}>
              <div><strong>Concluinte:</strong> {cert.nome_exibido}</div>
              <div><strong>Código:</strong> {cert.codigo}</div>
            </div>
          </header>

          {/* Resumo por módulo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
            {course.modules.map((mod) => {
              const modMin = mod.lessons.reduce((s, l) => s + l.durationMin, 0);
              return (
                <div
                  key={mod.id}
                  style={{
                    background: "#F1EFE7",
                    border: "1px solid #CBD5E1",
                    borderRadius: "4px",
                    padding: "0.7rem 0.9rem",
                    fontSize: "0.82rem",
                  }}
                >
                  <strong style={{ color: "#0F2942" }}>
                    Módulo {mod.number} · {mod.title}
                  </strong>
                  <div style={{ color: "#475569", marginTop: "0.2rem" }}>
                    {mod.lessons.length} componentes · Carga horária:{" "}
                    <strong>{formatDuration(modMin, lang)}</strong> ({modMin} min)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabela formal de componentes curriculares */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.76rem",
                color: "#1E293B",
              }}
            >
              <thead>
                <tr style={{ background: "#0F2942", color: "#FAF8F2", textAlign: "left" }}>
                  <th style={{ padding: "6px 8px", border: "1px solid #CBD5E1" }}>Módulo</th>
                  <th style={{ padding: "6px 8px", border: "1px solid #CBD5E1" }}>Componente Curricular / Tópico</th>
                  <th style={{ padding: "6px 8px", border: "1px solid #CBD5E1", width: 85, textAlign: "center" }}>C.H.</th>
                  <th style={{ padding: "6px 8px", border: "1px solid #CBD5E1", width: 95, textAlign: "center" }}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {course.modules.flatMap((mod) =>
                  mod.lessons.map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "5px 8px", border: "1px solid #CBD5E1", whiteSpace: "nowrap" }}>
                        Módulo {mod.number}
                      </td>
                      <td style={{ padding: "5px 8px", border: "1px solid #CBD5E1" }}>{l.title}</td>
                      <td style={{ padding: "5px 8px", border: "1px solid #CBD5E1", textAlign: "center", whiteSpace: "nowrap" }}>
                        {l.durationMin} min
                      </td>
                      <td style={{ padding: "5px 8px", border: "1px solid #CBD5E1", textAlign: "center", color: "#15803D", fontWeight: 700 }}>
                        Concluída
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>

          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              borderTop: "1px solid #CBD5E1",
              paddingTop: "0.65rem",
              fontSize: "0.76rem",
              color: "#334155",
            }}
          >
            <div>
              <strong>Total Cumprido:</strong> {formatDuration(cargaMin, lang)} ({cargaMin} min) ·{" "}
              <strong>Avaliação Final:</strong> {cert.nota_final}% (Aprovado) ·{" "}
              <strong>Stack:</strong> {course.stack.join(", ")}
            </div>
            <div>
              Registro: <strong>{cert.codigo}</strong>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
