import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { Award, CheckCircle2, ShieldAlert } from "lucide-react";
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
              className="btn btn-primary"
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
    width: 96,
    color: { dark: "#0F172A", light: "#FFFFFF" },
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

  const leftModules = course.modules.slice(0, 3);
  const rightModules = course.modules.slice(3);

  const cornerPositions: Array<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    rotate: number;
  }> = [
    { top: 10, left: 10, rotate: 0 },
    { top: 10, right: 10, rotate: 90 },
    { bottom: 10, right: 10, rotate: 180 },
    { bottom: 10, left: 10, rotate: 270 },
  ];

  const renderCertificateFrame = () => (
    <>
      {/* Moldura dupla clássica (dourado + filete marinho) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10px",
          border: "1.5px solid #B8860B",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "15px",
          border: "0.5px solid rgba(15, 23, 42, 0.22)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {cornerPositions.map((pos, idx) => (
        <svg
          key={idx}
          aria-hidden="true"
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          style={{
            position: "absolute",
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
            transform: `rotate(${pos.rotate}deg)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <path d="M2 2H26V5H5V26H2V2Z" fill="#0F172A" />
          <path d="M8 8H22V10H10V22H8V8Z" fill="#B8860B" />
          <circle cx="14" cy="14" r="2" fill="#B8860B" />
        </svg>
      ))}
    </>
  );

  return (
    <main className="wrap curso-page-main cert-sheet-root" style={{ maxWidth: 1080 }}>
      <CertificadoActions verifyUrl={verifyUrl} codigo={cert.codigo} />

      {/* ================================================================ */}
      {/*  PÁGINA 1: FRENTE DO CERTIFICADO (Executivo Clássico A4 Paisagem) */}
      {/* ================================================================ */}
      <article
        className="cert-page"
        aria-label="Certificado de Conclusão — Frente"
        style={{
          position: "relative",
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "2px",
          border: "4px solid #0F172A",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "34px 44px",
          fontFamily: "var(--font-sans, 'Outfit', system-ui, -apple-system, sans-serif)",
        }}
      >
        {renderCertificateFrame()}

        {/* Marca d'água discreta */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4.6rem",
            fontWeight: 900,
            letterSpacing: "0.22em",
            color: "#0F172A",
            opacity: 0.03,
            transform: "rotate(-18deg)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        >
          MALDIVAS TECH
        </div>

        {/* Cabeçalho */}
        <header
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            borderBottom: "1px solid #CBD5E1",
            paddingBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image src="/brand/logo-mark.png" alt="Maldivas Tech" width={44} height={44} />
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.06em", color: "#0F172A" }}>
                MALDIVAS TECH
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 500 }}>
                Engenharia de Software &amp; Sistemas em Produção · CNPJ {COMPANY.cnpj}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              fontSize: "0.76rem",
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={15} aria-hidden="true" />
            VERIFICADO · {cert.codigo}
          </div>
        </header>

        {/* Corpo Central */}
        <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "8px 0" }}>
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              fontSize: "0.74rem",
              color: "#B8860B",
              fontWeight: 700,
            }}
          >
            Certificado de Conclusão · Curso Livre Profissional
          </div>

          <p style={{ margin: "10px 0 4px", fontSize: "0.94rem", color: "#475569" }}>
            Certificamos que
          </p>

          <h1
            style={{
              margin: "0 auto",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(1.55rem, 2.45vw, 2.05rem)",
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "0.01em",
              lineHeight: 1.18,
              textShadow: "none",
              maxWidth: "92%",
            }}
          >
            {cert.nome_exibido}
          </h1>

          <div
            aria-hidden="true"
            style={{
              width: "120px",
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, #B8860B 50%, transparent 100%)",
              margin: "10px auto 12px",
            }}
          />

          <p
            style={{
              margin: "0 auto",
              fontSize: "0.96rem",
              lineHeight: 1.55,
              color: "#334155",
              maxWidth: "740px",
            }}
          >
            concluiu com êxito o programa de formação{" "}
            <strong style={{ color: "#0F172A" }}>{course.name}</strong>, baseado na
            arquitetura em produção do estudo de caso{" "}
            <strong style={{ color: "#0F172A" }}>{course.studyCase}</strong>, tendo
            cumprido integralmente a carga horária e obtido aprovação na avaliação
            técnica e prática final.
          </p>
        </div>

        {/* Quadro de Métricas */}
        <section
          aria-label="Resumo Acadêmico"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "12px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            padding: "12px 16px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", fontWeight: 700 }}>
              Carga Horária Total
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
              {formatDuration(cargaMin, lang)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", fontWeight: 700 }}>
              Aproveitamento Final
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#15803D", marginTop: "2px" }}>
              {cert.nota_final}% · Aprovado
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", fontWeight: 700 }}>
              Estrutura Curricular
            </div>
            <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "#0F172A", marginTop: "3px" }}>
              {course.modules.length} módulos · {totalLessons} aulas
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", fontWeight: 700 }}>
              Data de Emissão
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A", marginTop: "4px" }}>
              {dataEmissao}
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer
          style={{
            position: "relative",
            zIndex: 3,
            display: "grid",
            gridTemplateColumns: "1.2fr auto 1.4fr auto",
            gap: "18px",
            borderTop: "1px solid #CBD5E1",
            paddingTop: "12px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "1.08rem",
                color: "#0F172A",
                borderBottom: "1px solid #0F172A",
                paddingBottom: "3px",
                marginBottom: "4px",
                display: "inline-block",
                minWidth: "230px",
              }}
            >
              Rafael Paiva Dias da Silva
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0F172A" }}>
              Rafael Paiva Dias da Silva
            </div>
            <div style={{ fontSize: "0.71rem", color: "#475569", lineHeight: 1.35, marginTop: "2px" }}>
              Tecnólogo em Análise e Desenvolvimento de Sistemas (IFSP)
              <br />
              Instrutor Responsável &amp; Fundador · Maldivas Tech
            </div>
          </div>

          {/* Selo Institucional */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" aria-label="Selo de Autenticidade Maldivas Tech">
              <circle cx="34" cy="34" r="31" stroke="#B8860B" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="34" cy="34" r="25" fill="#0F172A" stroke="#B8860B" strokeWidth="1.5" />
              <text x="34" y="29" textAnchor="middle" fill="#FDE68A" fontSize="6.5" fontWeight="700" letterSpacing="1.1">
                MALDIVAS
              </text>
              <text x="34" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="800" letterSpacing="1.2">
                TECH
              </text>
              <text x="34" y="47" textAnchor="middle" fill="#93C5FD" fontSize="5.2" fontWeight="600" letterSpacing="0.8">
                VERIFICADO
              </text>
            </svg>
          </div>

          <div style={{ fontSize: "0.71rem", color: "#475569", lineHeight: 1.42 }}>
            <div>
              <strong style={{ color: "#0F172A" }}>Emissor:</strong> {COMPANY.legalName} · CNPJ {COMPANY.cnpj}
            </div>
            <div>
              <strong style={{ color: "#0F172A" }}>Base Legal:</strong> Curso Livre (Lei nº 9.394/1996 · Decreto nº 5.154/2004)
            </div>
            <div>
              <strong style={{ color: "#0F172A" }}>Verificação:</strong>{" "}
              <span style={{ wordBreak: "break-all" }}>{verifyUrl}</span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: "3px",
                background: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "4px",
              }}
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </footer>
      </article>

      {/* ================================================================ */}
      {/*  PÁGINA 2: VERSO DO CERTIFICADO (8 Módulos & 18 Aulas em 1 folha) */}
      {/* ================================================================ */}
      <section
        className="cert-page"
        style={{
          position: "relative",
          marginTop: "24px",
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "2px",
          border: "4px solid #0F172A",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          boxSizing: "border-box",
          overflow: "hidden",
          padding: "28px 38px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "var(--font-sans, 'Outfit', system-ui, -apple-system, sans-serif)",
        }}
        aria-label="Verso do Certificado — Matriz Curricular"
      >
        {renderCertificateFrame()}
        <header
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #CBD5E1",
            paddingBottom: "8px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#0284C7", fontWeight: 700 }}>
              Matriz Curricular &amp; Histórico de Conclusão
            </div>
            <h2 style={{ margin: "2px 0 0", fontSize: "1.05rem", color: "#0F172A", fontWeight: 700 }}>
              {course.name}
            </h2>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.76rem", color: "#475569" }}>
            <div><strong style={{ color: "#0F172A" }}>{cert.nome_exibido}</strong></div>
            <div>Registro: <code>{cert.codigo}</code></div>
          </div>
        </header>

        {/* Grid compacto de 2 colunas para caber 100% em 1 página A4 paisagem */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            margin: "10px 0",
          }}
        >
          {[leftModules, rightModules].map((group, idx) => (
            <div key={idx} style={{ display: "grid", gap: "8px", alignContent: "start" }}>
              {group.map((mod) => {
                const modMin = mod.lessons.reduce((s, l) => s + l.durationMin, 0);
                return (
                  <div
                    key={mod.id}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      padding: "7px 10px",
                      background: "#F8FAFC",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        color: "#0F172A",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Módulo {mod.number} · {mod.title}</span>
                      <span style={{ color: "#0284C7", whiteSpace: "nowrap", marginLeft: 8 }}>
                        {formatDuration(modMin, lang)}
                      </span>
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "14px",
                        fontSize: "0.68rem",
                        color: "#334155",
                        lineHeight: 1.38,
                      }}
                    >
                      {mod.lessons.map((l) => (
                        <li key={l.id}>
                          {l.title} <span style={{ color: "#64748B" }}>({l.durationMin} min)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E2E8F0",
            paddingTop: "10px",
            fontSize: "0.74rem",
            color: "#475569",
          }}
        >
          <div>
            <strong style={{ color: "#0F172A" }}>Total:</strong> {course.modules.length} módulos · {totalLessons} aulas · {formatDuration(cargaMin, lang)} ({cargaMin} min) ·{" "}
            <strong style={{ color: "#15803D" }}>Aproveitamento: {cert.nota_final}%</strong>
          </div>
          <div>
            Stack: {course.stack.join(" · ")}
          </div>
        </footer>
      </section>
    </main>
  );
}
