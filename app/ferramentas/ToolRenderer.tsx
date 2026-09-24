"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { tools, GROUP_LABEL, type Tool } from "../lib/tools";
import { WHATSAPP } from "../lib/site";
import { Magnetic, Reveal } from "../components/fx";
import { copy, MailTool, PriceTool } from "./FerramentasClient";
import { DeliveryTool, HeadersTool, NfeTool, PixTool } from "./MoreTools";
import { CambioTool, CnpjTool } from "./ApiTools";
import { CepTool, DominioTool, FeriadosTool, FichaTool, IpcaTool, MarkupTool } from "./BizTools";
import { BancosTool, CpfTool, DddTool, NfeXmlTool, TaxasTool } from "./NewTools";

const t = {
  pt: {
    back: "Todas as ferramentas",
    faq: "Perguntas frequentes",
    related: "Outras ferramentas da mesma área",
    ctaTitle: "Isso aqui é a versão de bolso",
    ctaLead:
      "A ferramenta acima resolve um cálculo. O que eu faço sob contrato é deixar isso rodando dentro do seu sistema, com os seus dados, sem ninguém digitar nada.",
    cta: "Falar comigo no WhatsApp",
    free: "Grátis · sem cadastro",
  },
  en: {
    back: "All tools",
    faq: "Frequently asked",
    related: "Other tools in the same area",
    ctaTitle: "This is the pocket version",
    ctaLead:
      "The tool above solves one calculation. What I do under contract is keep it running inside your system, on your data, with nobody typing anything.",
    cta: "Message me on WhatsApp",
    free: "Free · no signup",
  },
} as const;

export default function ToolRenderer({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const c = t[lang];
  const k = copy[lang];

  const render = () => {
    switch (tool.key) {
      // margem
      case "preco":
        return <PriceTool c={k} />;
      case "markup":
        return <MarkupTool />;
      case "ficha":
        return <FichaTool />;
      case "delivery":
        return <DeliveryTool />;
      // fiscal
      case "cnpj":
        return <CnpjTool />;
      case "pix":
        return <PixTool />;
      case "nfe":
        return <NfeTool />;
      case "cpf":
        return <CpfTool />;
      case "nfexml":
        return <NfeXmlTool />;
      case "bancos":
        return <BancosTool />;
      // site
      case "dominio":
        return <DominioTool />;
      case "email":
        return <MailTool c={k} />;
      case "headers":
        return <HeadersTool />;
      // operação
      case "ipca":
        return <IpcaTool />;
      case "cambio":
        return <CambioTool />;
      case "feriados":
        return <FeriadosTool />;
      case "cep":
        return <CepTool />;
      case "ddd":
        return <DddTool />;
      case "taxas":
        return <TaxasTool />;
      default:
        return null;
    }
  };

  const irmas = tools.filter((x) => x.group === tool.group && x.slug !== tool.slug);

  return (
    <>
      <header className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <Reveal>
            <Link href={localePath("/ferramentas", lang)} className="tool-back">
              ← {c.back}
            </Link>
            <div className="sec-tag" style={{ marginTop: 18 }}>
              {GROUP_LABEL[tool.group][lang]} · {c.free}
            </div>
            <h1 style={{ fontSize: "clamp(34px, 5.2vw, 60px)", maxWidth: "20ch" }}>{tool.h1}</h1>
            <p className="hero-lead" style={{ marginBottom: 0 }}>
              {tool.description}
            </p>
          </Reveal>
        </div>
      </header>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tool-solo">{render()}</div>
        </div>
      </section>

      {tool.faq.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <h2 style={{ fontSize: "clamp(26px, 3.2vw, 36px)" }}>{c.faq}</h2>
              <div style={{ height: 28 }} />
            </Reveal>
            <div className="faq">
              {tool.faq.map(([q, a], i) => (
                <Reveal key={q} delay={i * 0.05}>
                  <details className="faq-item" open={i === 0}>
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {irmas.length > 0 && (
        <section style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal>
              <div className="sec-tag">{c.related}</div>
            </Reveal>
            <div className="tool-index" style={{ marginBottom: 0 }}>
              {irmas.map((x) => (
                <Link className="tool-chip" href={localePath(`/ferramentas/${x.slug}`, lang)} key={x.slug}>
                  {x.title}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contato" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="contact-box">
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 0 }}>
                <Magnetic>
                  <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} /> {c.cta}
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link className="btn btn-ghost" href={localePath("/servicos#briefing", lang)}>
                    {lang === "pt" ? "Fazer o levantamento" : "Start the discovery"}
                  </Link>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
