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

  return (
    <main className="wrap curso-page-main cert-sheet-root" style={{ maxWidth: 1080 }}>
      <CertificadoActions verifyUrl={verifyUrl} codigo={cert.codigo} />

      {/* ================================================================ */}
      {/*  PÁGINA 1: FRENTE DO CERTIFICADO (Clean Executivo A4 Paisagem)    */}
      {/* ================================================================ */}
      <article
        className="cert-page"
        aria-label="Certificado de Conclusão — Frente"
        style={{
          position: "relative",
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "8px",
          border: "1px solid #CBD5E1",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 36px",
          fontFamily: "var(--font-sans, 'Outfit', system-ui, -apple-system, sans-serif)",
        }}
      >
        {/* Barra superior de identidade Maldivas Tech */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #0F172A 0%, #0284C7 55%, #0EA5E9 100%)",
          }}
        />

        {/* Cabeçalho */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "14px",
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
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
              color: "#0284C7",
              fontWeight: 700,
            }}
          >
            Certificado de Conclusão · Curso Livre Profissional
          </div>

          <p style={{ margin: "12px 0 4px", fontSize: "0.95rem", color: "#475569" }}>
            Certificamos que
          </p>

          <h1
            style={{
              margin: "0 auto",
              fontSize: "clamp(1.65rem, 2.8vw, 2.25rem)",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {cert.nome_exibido}
          </h1>

          <div
            aria-hidden="true"
            style={{
              width: "80px",
              height: "3px",
              background: "#0284C7",
              margin: "10px auto 14px",
              borderRadius: "999px",
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
            display: "grid",
            gridTemplateColumns: "1.2fr 1.5fr auto",
            gap: "20px",
            borderTop: "1px solid #E2E8F0",
            paddingTop: "14px",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0F172A" }}>
              Rafael Paiva Dias da Silva
            </div>
            <div style={{ fontSize: "0.74rem", color: "#475569", lineHeight: 1.4, marginTop: "2px" }}>
              Tecnólogo em Análise e Desenvolvimento de Sistemas (IFSP)
              <br />
              Instrutor Responsável &amp; Fundador · Maldivas Tech
            </div>
          </div>

          <div style={{ fontSize: "0.72rem", color: "#475569", lineHeight: 1.45 }}>
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
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
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
          marginTop: "24px",
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "8px",
          border: "1px solid #CBD5E1",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "var(--font-sans, 'Outfit', system-ui, -apple-system, sans-serif)",
        }}
        aria-label="Verso do Certificado — Matriz Curricular"
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "10px",
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
