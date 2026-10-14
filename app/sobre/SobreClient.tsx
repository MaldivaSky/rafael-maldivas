"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { t } from "../lib/content";
import { PRODUCTS } from "../lib/products";
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
    "pmTag": "Produto, na prática",
    "pmTitle": "Do problema ao produto em operação",
    "pmLead": "Antes do código vem o produto: descobrir a dor com quem opera, priorizar o que gera valor e acompanhar o uso real. É o ciclo que eu rodo nos meus próprios SaaS.",
    "pm": [
      [
        "Discovery no chão da operação",
        "Seis anos em PDV, estoque e ruptura na Heineken e inteligência de mercado com CRM e Power BI. Eu converso com quem usa antes de escrever requisito."
      ],
      [
        "Priorização e MVP",
        "Escopo enxuto, entregue em ciclos curtos e ajustado com o retorno de quem trabalha com o sistema — sem over-engineering."
      ],
      [
        "Integrações e homologações",
        "MiseOn verificado pela Meta como Provedora de Tecnologia (WhatsApp Business API) e homologado no iFood em 22/08/2026."
      ],
      [
        "Operação com dados",
        "Produtos multi-tenant com controle de acesso por linha, trilha de auditoria e eventos de navegação e conversão instrumentados."
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
        "Maldivas Tech",
        "CNPJ próprio, contrato firmado com agência de recrutamento Brasil–Japão, verificação como Provedora de Tecnologia pela Meta e homologação no iFood."
      ]
    ],
    "stackTag": "Formação",
    "stackTitle": "Formação e certificações",
    "edu": [
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
    "pmTag": "Product, in practice",
    "pmTitle": "From problem to product in production",
    "pmLead": "Product comes before code: find the pain with the people who run the operation, prioritise what creates value and follow real usage. It is the loop I run on my own SaaS.",
    "pm": [
      [
        "Discovery on the shop floor",
        "Six years of POS, inventory and stockouts at Heineken, plus market intelligence with CRM and Power BI. I talk to users before writing requirements."
      ],
      [
        "Prioritisation and MVP",
        "Lean scope, shipped in short cycles and tuned with feedback from the people using the system — no over-engineering."
      ],
      [
        "Integrations and approvals",
        "MiseOn verified by Meta as a Technology Provider (WhatsApp Business API) and approved on iFood on 2026-08-22."
      ],
      [
        "Data-driven operation",
        "Multi-tenant products with row-level access control, audit trails and instrumented navigation and conversion events."
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
        "Maldivas Tech",
        "Own registered company, a signed contract with a Brazil–Japan recruitment agency, Meta Technology Provider verification and iFood approval."
      ]
    ],
    "stackTag": "Education",
    "stackTitle": "Education and certifications",
    "edu": [
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
