"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MessageCircle } from "lucide-react";
import { useLang, localePath } from "../lib/i18n";
import { t } from "../lib/content";
import { PRODUCTS } from "../lib/products";
import { ORACLE_CERTS, type OracleCert } from "../lib/credentials";
import { rich } from "../lib/rich";
import { EMAIL, GITHUB_ORG, GITHUB_USER, INSTAGRAM, LINKEDIN, WHATSAPP, YOUTUBE } from "../lib/site";
import PersonalIntro from "../components/PersonalIntro";
import { Magnetic, Reveal, Spotlight, TechIcon } from "../components/fx";

const copy = {
  "pt": {
    "tag": "Sobre",
    "h1a": "Sou Rafael. ",
    "h1b": "Prazer em conhecer você.",
    "lead": "Minha trajetória passou por vendas, qualidade, processos, marcenaria, química e gastronomia. Hoje trabalho com consultoria de tecnologia e desenvolvimento na minha empresa, a Maldivas Tech.",
    "certTag": "Certificações",
    "certTitle": "Duas certificações Oracle — IA agêntica e processos de CX",
    "certLead": "Tecnologia não se aprende uma vez: se recicla. Como profissional de TI, eu me mantenho sempre atualizado — volto ao banco, estudo e lapido o que já sei. A certificação de IA agêntica me dá a engenharia com que construo meus produtos; a de processos CX me dá a língua do negócio — marketing, vendas e atendimento — exatamente o que o MiseOn, o MercadinhoSys e o Atol Connect digitalizam.",
    "certCxTag": "Oracle · Processos de CX",
    "certCxLead": "Formação nos Oracle Modern Best Practices (OMBP) da suíte CX: como dados e processos fluem e se integram entre marketing, vendas, gestão de performance comercial e atendimento, e como o Cloud Success Navigator e os Cloud Quality Standards conduzem uma transformação em nuvem. É o processo do cliente que meus produtos digitalizam — agora certificado de ponta a ponta.",
    "certAiTag": "Oracle · IA agêntica",
    "certAiLead": "Formação prática em agentes de IA: construir um agente do zero, usar LangChain, um servidor MCP real e a OpenAI Agents SDK, e ver como agentes rodam em produção na Oracle Cloud. É o mesmo tipo de ferramenta que eu uso para construir meus produtos.",
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
        "MiseOn integrado à API oficial do WhatsApp (Meta) e homologado no iFood; credenciamento da Maldivas Tech como Tech Provider da Meta em andamento. Produtos multi-tenant com acesso por linha e trilha de auditoria."
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
        "Concebo e construo sozinho, com agentes de IA, meus próprios produtos (MiseOn e SelectSys Jobs). CNPJ próprio, contrato com agência de recrutamento Brasil–Japão, integração com a API oficial do WhatsApp, homologação no iFood e certificações Oracle em IA agêntica e processos de CX."
      ]
    ],
    "stackTag": "Formação",
    "stackTitle": "Formação e certificações",
    "edu": [
      [
        "Fusion Cloud CX Process Essentials (1Z0-1161-1)",
        "Oracle — 2026 · aprovação 84% (mínimo exigido 65%)"
      ],
      [
        "Agentic AI Certified Foundations Associate",
        "Oracle — 2026 (válido até 2028)"
      ],
      [
        "Tecnologia em Análise e Desenvolvimento de Sistemas",
        "IFSP Campus Guarulhos · TCC em E-Commerce (Nota 9,0) · Diploma Digital: 1810.1810.1391e01ddb91"
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
    "followTag": "Redes",
    "followTitle": "Me acompanhe por perto",
    "followLead": "Eu documento o que construo e compartilho o caminho — bastidores de produto e de engenharia, e o que aprendo a cada reciclagem. Seguir é o jeito mais rápido de ver o próximo capítulo.",
    "followCta": "Seguir",
    "followSubscribe": "Inscrever-se",
    "socialLinkedin": "Carreira, certificações e visão de produto em primeira mão.",
    "socialGithubPersonal": "Código dos meus projetos pessoais, experimentos e estudos.",
    "socialGithubOrg": "Repositórios oficiais dos produtos: MiseOn, MercadinhoSys e MySuperStore.",
    "socialYoutube": "O canal do MiseOn: demonstrações do sistema, tutoriais e bastidores da construção.",
    "socialInstagram": "Gestão para food service no dia a dia: ficha técnica, CMV e lançamentos do MiseOn.",
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
    "certTag": "Certifications",
    "certTitle": "Two Oracle certifications — agentic AI and CX processes",
    "certLead": "Technology isn't learned once: it's refreshed. As an IT professional, I keep myself current — I go back to the books, study and polish what I already know. The agentic AI certification gives me the engineering I use to build my products; the CX one gives me the language of the business — marketing, sales and service — exactly what MiseOn, MercadinhoSys and Atol Connect digitize.",
    "certCxTag": "Oracle · CX Processes",
    "certCxLead": "Training in the Oracle Modern Best Practices (OMBP) of the CX suite: how data and process flows integrate across marketing, sales, sales performance management and service, and how Cloud Success Navigator and Cloud Quality Standards steer a cloud transformation. It's the customer process my products digitize — now certified end to end.",
    "certAiTag": "Oracle · Agentic AI",
    "certAiLead": "Hands-on training in AI agents: building an agent from scratch, using LangChain, a real MCP server and the OpenAI Agents SDK, and seeing how agents run in production on Oracle Cloud. The same kind of tooling I use to build my products.",
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
        "MiseOn runs on the official WhatsApp API (Meta) and is approved on iFood; Maldivas Tech's Meta Tech Provider accreditation is in progress. Multi-tenant products with row-level access and audit trails."
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
        "I design and build my own products (MiseOn and SelectSys Jobs) solo, with AI agents. Registered company, a signed contract with a Brazil–Japan recruitment agency, official WhatsApp API integration, iFood approval and Oracle certifications in agentic AI and CX processes."
      ]
    ],
    "stackTag": "Education",
    "stackTitle": "Education and certifications",
    "edu": [
      [
        "Fusion Cloud CX Process Essentials (1Z0-1161-1)",
        "Oracle — 2026 · scored 84% (65% required)"
      ],
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
    "followTag": "Social",
    "followTitle": "Follow my work",
    "followLead": "I document what I build and share the journey — product and engineering behind the scenes, and what I learn every time I go back to the books. Following is the fastest way to see the next chapter.",
    "followCta": "Follow",
    "followSubscribe": "Subscribe",
    "socialLinkedin": "Career, certifications and product thinking, firsthand.",
    "socialGithubPersonal": "Code for my personal projects, experiments and studies.",
    "socialGithubOrg": "Official product repositories: MiseOn, MercadinhoSys and MySuperStore.",
    "socialYoutube": "The MiseOn channel: system demos, tutorials and build behind the scenes.",
    "socialInstagram": "Day-to-day food service management: recipe costing, COGS and MiseOn releases.",
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

  const certMeta = (cert: OracleCert) =>
    [
      cert.issuedLabel[lang],
      cert.validUntilLabel?.[lang],
      cert.score?.label[lang],
      `${c.certId} ${cert.id}`,
    ]
      .filter((x): x is string => Boolean(x))
      .join(" · ");

  return (
    <>
      <PersonalIntro about />

      <section id="certificacao">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.certTag}</div>
            <h2>{c.certTitle}</h2>
            <p className="sec-lead">{c.certLead}</p>
            <div style={{ height: 30 }} />
          </Reveal>
          <div className="cert-grid">
            {ORACLE_CERTS.map((cert, i) => (
              <Reveal key={cert.key} delay={i * 0.06}>
                <Spotlight className="cert-card">
                  <div className="cert-card-head">
                    <BadgeCheck size={30} />
                    <div>
                      <div className="sec-tag">{cert.key === "cx" ? c.certCxTag : c.certAiTag}</div>
                      <h3>{cert.short[lang]}</h3>
                    </div>
                  </div>
                  <p className="cert-name">
                    <strong>{cert.issuer}</strong> · {cert.name}
                  </p>
                  <p className="sec-lead">{cert.key === "cx" ? c.certCxLead : c.certAiLead}</p>
                  <ul className="cert-skills">
                    {cert.skills[lang].map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="cert-foot">
                    <a className="btn btn-primary" href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" data-analytics="cert_click">
                      {c.certVerify} <ArrowUpRight size={17} />
                    </a>
                    <span>{certMeta(cert)}</span>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
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

      <section id="redes" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.followTag}</div>
            <h2>{c.followTitle}</h2>
            <p className="sec-lead">{c.followLead}</p>
            <div style={{ height: 30 }} />
          </Reveal>
          <div className="follow-grid">
            {[
              {
                key: "linkedin",
                icon: "/icons/linkedin.svg",
                name: "LinkedIn",
                handle: "linkedin.com/in/rafael-paiva-dias",
                url: LINKEDIN,
                cta: c.followCta,
                desc: c.socialLinkedin,
              },
              {
                key: "github-personal",
                icon: "/icons/github.svg",
                name: "GitHub · pessoal",
                handle: "github.com/MaldivaSky",
                url: GITHUB_USER,
                cta: c.followCta,
                desc: c.socialGithubPersonal,
              },
              {
                key: "github-org",
                icon: "/icons/github.svg",
                name: "GitHub · Maldivas Tech",
                handle: "github.com/Mald1vas-Tech-Solut1ons",
                url: GITHUB_ORG,
                cta: c.followCta,
                desc: c.socialGithubOrg,
              },
              {
                key: "youtube",
                icon: "/icons/youtube.svg",
                name: "YouTube · MiseOn",
                handle: "@MiseOnSISTEMA--CozinhasProfiss",
                url: YOUTUBE,
                cta: c.followSubscribe,
                desc: c.socialYoutube,
              },
              {
                key: "instagram",
                icon: "/icons/instagram.svg",
                name: "Instagram · MiseOn",
                handle: "@miseon_system_food_service",
                url: INSTAGRAM,
                cta: c.followCta,
                desc: c.socialInstagram,
              },
            ].map((s, i) => (
              <Reveal key={s.key} delay={i * 0.05}>
                <Spotlight className="follow-card">
                  <TechIcon src={s.icon} size={26} />
                  <h3>{s.name}</h3>
                  <p className="follow-handle">{s.handle}</p>
                  <p>{s.desc}</p>
                  <a className="plink" href={s.url} target="_blank" rel="noopener noreferrer" data-analytics={`social_${s.key}`}>
                    {s.cta} <ArrowUpRight size={16} />
                  </a>
                </Spotlight>
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
