"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MessageCircle } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { t } from "../lib/content";
import { PRODUCTS } from "../lib/products";
import { ORACLE_CERT } from "../lib/credentials";
import { rich } from "../lib/rich";
import { EMAIL, LINKEDIN, WHATSAPP } from "../lib/site";
import PersonalIntro from "../components/PersonalIntro";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const copy = {
  "pt": {
    "tag": "Sobre",
    "h1a": "Sou Rafael. ",
    "h1b": "Prazer em conhecer você.",
    "lead": "Minha trajetória passou por vendas, qualidade, processos, marcenaria, química e gastronomia. Hoje trabalho com consultoria de tecnologia e desenvolvimento na minha empresa, a Maldivas Tech.",
    "certTag": "Certificação",
    "certTitle": "Certificado pela Oracle em IA agêntica",
    "certLead": "Formação prática em agentes de IA: construir um agente do zero, usar LangChain, um servidor MCP real e a OpenAI Agents SDK, e ver como agentes rodam em produção na Oracle Cloud. É o mesmo tipo de ferramenta que eu uso para construir meus produtos.",
    "certIssued": "Emitido em 03/10/2026",
    "certValid": "válido até 03/10/2028",
    "certVerify": "Verificar na Oracle",
    "certId": "Credencial",
    "pmTag": "Product Owner, na prática",
    "pmTitle": "Do problema ao produto em operação",
    "pmLead": "Sou PO e construtor ao mesmo tempo. Sozinho, com agentes de IA, levo a ideia da conversa com quem opera até o produto em produção, e respondo pelo resultado.",
    "pm": [
      [
        "Discovery no chão da operação",
        "Seis anos em PDV, estoque e ruptura na Heineken e inteligência de mercado com CRM e Power BI. Converso com quem usa antes de definir qualquer requisito."
      ],
      [
        "Backlog e priorização",
        "Decido o que entra, o que fica de fora e em que ordem, pelo impacto na operação. Entrego em ciclos curtos e ajusto com o retorno de quem usa, sem over-engineering."
      ],
      [
        "Construção com agentes de IA",
        "Agentes de IA fazem o papel de um time de engenharia: modelagem de dados, código e deploy. Cada entrega passa pela minha revisão e decisão."
      ],
      [
        "Homologações e operação",
        "MiseOn verificado pela Meta como Provedora de Tecnologia (WhatsApp Business API) e homologado no iFood. Produtos multi-tenant com acesso por linha e trilha de auditoria."
      ]
    ],
    "pmProducts": "Produtos que eu construo e opero",
    "pmOpen": "Ver produto",
    "pathTag": "Trajetória",
    "pathTitle": "De onde eu vim",
    "path": [
      [
        "2007 — 2012",
        "Técnico em química e suporte técnico",
        "Laboratório, instrumentação analítica e atendimento a cliente — inclusive internacional. Foi aqui que eu aprendi a traduzir coisa técnica para quem não é técnico."
      ],
      [
        "2015 — 2022",
        "Vendas externas — Heineken, Melhoramentos/Softys",
        "Seis anos batendo meta agressiva na Heineken e selecionado como mentor técnico no onboarding de novos vendedores. Rodei PDV, estoque, ruptura e merchandising na prática."
      ],
      [
        "2022 — 2025",
        "Inteligência de mercado — Loft, GP Alimentos",
        "CRM Salesforce, qualificação de leads e organização de informações comerciais em dashboards no Power BI."
      ],
      [
        "2024 — 2025",
        "Formação em tecnologia",
        "Análise e Desenvolvimento de Sistemas no IFSP, Marketing Digital pelo Google e pilotagem de drone pela ITARC."
      ],
      [
        "2025 — hoje",
        "Instrutor de informática e facilitador digital",
        "Preparação de aulas de tecnologia e apoio a agricultores familiares na organização de dados e planilhas de custo."
      ],
      [
        "2026 — hoje",
        "Product Owner e fundador — Maldivas Tech",
        "Concebo e construo sozinho, com agentes de IA, meus próprios produtos (MiseOn e SelectSys Jobs). CNPJ próprio, contrato com agência de recrutamento Brasil–Japão, Meta Tech Provider, homologação no iFood e certificação Oracle em IA agêntica."
      ]
    ],
    "stackTag": "Formação",
    "stackTitle": "Formação e certificações",
    "edu": [
      [
        "Agentic AI Certified Foundations Associate",
        "Oracle — 2026 (válido até 2028)"
      ],
      [
        "Tecnologia em Análise e Desenvolvimento de Sistemas",
        "IFSP — Instituto Federal de São Paulo"
      ],
      [
        "Marketing Digital",
        "Google"
      ],
      [
        "Pilotagem de Drone",
        "ITARC"
      ],
      [
        "Power BI",
        "HashTag Treinamentos"
      ],
      [
        "Técnico em Química",
        "ETEC Getúlio Vargas"
      ],
      [
        "Idiomas",
        "Português nativo · Inglês avançado · Espanhol intermediário"
      ]
    ],
    "ctaTitle": "Vamos conversar?",
    "ctaLead": "Se você está buscando ajuda com tecnologia ou quer conversar sobre uma oportunidade, pode me chamar.",
    "ctaBtn": "Falar no WhatsApp",
    "ctaAlt": "Ver perfil no LinkedIn"
  },
  "en": {
    "tag": "About",
    "h1a": "I’m Rafael. ",
    "h1b": "Nice to meet you.",
    "lead": "My background spans sales, quality, processes, woodworking, chemistry and gastronomy. Today I work in technology consulting and development at my company, Maldivas Tech.",
    "certTag": "Certification",
    "certTitle": "Oracle certified in agentic AI",
    "certLead": "Hands-on training in AI agents: building an agent from scratch, using LangChain, a real MCP server and the OpenAI Agents SDK, and seeing how agents run in production on Oracle Cloud. The same kind of tooling I use to build my products.",
    "certIssued": "Issued 3 Oct 2026",
    "certValid": "valid until 3 Oct 2028",
    "certVerify": "Verify on Oracle",
    "certId": "Credential",
    "pmTag": "Product ownership, in practice",
    "pmTitle": "From problem to product in production",
    "pmLead": "I’m the PO and the builder at the same time. Solo, with AI agents, I take an idea from a conversation with the people who run the operation to a product in production, and I own the outcome.",
    "pm": [
      [
        "Discovery on the shop floor",
        "Six years of POS, inventory and stockouts at Heineken, plus market intelligence with CRM and Power BI. I talk to users before defining any requirement."
      ],
      [
        "Backlog and prioritisation",
        "I decide what goes in, what stays out and in which order, based on operational impact. I ship in short cycles and adjust with user feedback, without over-engineering."
      ],
      [
        "Building with AI agents",
        "AI agents act as my engineering team: data modelling, code and deployment. Every delivery goes through my review and my decision."
      ],
      [
        "Approvals and operations",
        "MiseOn verified by Meta as a Technology Provider (WhatsApp Business API) and approved on iFood. Multi-tenant products with row-level access and audit trails."
      ]
    ],
    "pmProducts": "Products I build and operate",
    "pmOpen": "See product",
    "pathTag": "Track record",
    "pathTitle": "How I got here",
    "path": [
      [
        "2007 — 2012",
        "Chemistry technician and technical support",
        "Lab work, analytical instrumentation and customer support, including international clients. This is where I learned to translate technical things for non-technical people."
      ],
      [
        "2015 — 2022",
        "Field sales — Heineken, Melhoramentos/Softys",
        "Six years hitting aggressive targets at Heineken and picked as technical mentor for onboarding new reps. I lived POS, inventory, stockouts and merchandising firsthand."
      ],
      [
        "2022 — 2025",
        "Market intelligence — Loft, GP Alimentos",
        "Salesforce CRM, lead qualification and commercial reporting in Power BI."
      ],
      [
        "2024 — 2025",
        "Technology education",
        "Systems Analysis and Development at IFSP, Digital Marketing by Google and drone piloting certified by ITARC."
      ],
      [
        "2025 — today",
        "IT instructor and digital facilitator",
        "Technology teaching and support for family farmers with data organisation and cost spreadsheets."
      ],
      [
        "2026 — today",
        "Product Owner and founder — Maldivas Tech",
        "I design and build my own products (MiseOn and SelectSys Jobs) solo, with AI agents. Registered company, a signed contract with a Brazil–Japan recruitment agency, Meta Tech Provider, iFood approval and an Oracle certification in agentic AI."
      ]
    ],
    "stackTag": "Education",
    "stackTitle": "Education and certifications",
    "edu": [
      [
        "Agentic AI Certified Foundations Associate",
        "Oracle — 2026 (valid until 2028)"
      ],
      [
        "Technology in Systems Analysis and Development",
        "IFSP — Federal Institute of São Paulo"
      ],
      [
        "Digital Marketing",
        "Google"
      ],
      [
        "Drone Piloting",
        "ITARC"
      ],
      [
        "Power BI",
        "HashTag Treinamentos"
      ],
      [
        "Chemistry Technician",
        "ETEC Getúlio Vargas"
      ],
      [
        "Languages",
        "Portuguese native · English advanced · Spanish intermediate"
      ]
    ],
    "ctaTitle": "Shall we talk?",
    "ctaLead": "Get in touch if you need help with technology or would like to discuss an opportunity.",
    "ctaBtn": "Message on WhatsApp",
    "ctaAlt": "View LinkedIn profile"
  }
} as const;

export default function SobreClient() {
  const { lang } = useLang();
  const c = copy[lang];
  const g = t[lang];

  return (
    <>
      <PersonalIntro about />

      <section id="certificacao">
        <div className="wrap">
          <Reveal>
            <Spotlight className="cert-card">
              <div className="cert-card-head">
                <BadgeCheck size={30} />
                <div>
                  <div className="sec-tag">{c.certTag}</div>
                  <h2>{c.certTitle}</h2>
                </div>
              </div>
              <p className="cert-name">
                <strong>{ORACLE_CERT.issuer}</strong> · {ORACLE_CERT.name}
              </p>
              <p className="sec-lead">{c.certLead}</p>
              <ul className="cert-skills">
                {ORACLE_CERT.skills[lang].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="cert-foot">
                <a className="btn btn-primary" href={ORACLE_CERT.verifyUrl} target="_blank" rel="noopener noreferrer" data-analytics="cert_click">
                  {c.certVerify} <ArrowUpRight size={17} />
                </a>
                <span>
                  {c.certIssued} · {c.certValid} · {c.certId} {ORACLE_CERT.id}
                </span>
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </section>

      <section id="produto">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.pmTag}</div>
            <h2>{c.pmTitle}</h2>
            <p className="sec-lead">{c.pmLead}</p>
          </Reveal>
          <div className="perks perks-2">
            {c.pm.map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.05}>
                <div className="perk">
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h3 style={{ margin: "40px 0 18px" }}>{c.pmProducts}</h3>
          </Reveal>
          <div className="works">
            {Object.values(PRODUCTS).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Spotlight className="work">
                  <h3>{p.name}</h3>
                  <p>{p.copy[lang].tagline}</p>
                  <div className="tags">
                    {p.stack.map((s) => (
                      <span className="tag" key={s}>{s}</span>
                    ))}
                  </div>
                  <div className="work-foot">
                    <Link
                      className="plink"
                      href={localePath(`/produtos/${p.slug}`, lang)}
                      data-analytics="product_click"
                    >
                      {c.pmOpen} <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="about">
            {/* texto corrido sempre sobre uma superfície opaca */}
            <Reveal className="about-body plate">
              {g.aboutBody.map((p, i) => (
                <p key={i}>{rich(p)}</p>
              ))}
            </Reveal>

            <Reveal className="card-corp">
              <h3>{g.corp}</h3>
              {g.kv.map(([k, v]) => (
                <div className="kv" key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section id="trajetoria">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.pathTag}</div>
            <h2>{c.pathTitle}</h2>
            <div style={{ height: 34 }} />
          </Reveal>
          <div className="works">
            {c.path.map(([when, role, desc], i) => (
              <Reveal key={role} delay={i * 0.05}>
                <Spotlight className="work">
                  <div className="work-client">{when}</div>
                  <h3 style={{ fontSize: 21 }}>{role}</h3>
                  <p style={{ marginTop: 12, marginBottom: 0 }}>{desc}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.stackTag}</div>
            <h2>{c.stackTitle}</h2>
            <div style={{ height: 30 }} />
          </Reveal>
          <div className="perks">
            {c.edu.map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.05}>
                <div className="perk">
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <Spotlight className="contact-box">
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
                <Magnetic>
                  <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} /> {c.ctaBtn}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                    <TechIcon src="/icons/linkedin.svg" size={18} /> {c.ctaAlt}
                  </a>
                </Magnetic>
              </div>
              <p className="contact-fine">{EMAIL}</p>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
