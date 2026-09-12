"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Calculator,
  CalendarDays,
  ChefHat,
  Coins,
  Globe,
  Layout,
  MapPin,
  Scale,
  TrendingUp,
  LineChart,
  MailCheck,
  MessageCircle,
  QrCode,
  Receipt,
  Server,
  ShieldCheck,
  Sparkles,
  Compass,
  Clapperboard,
} from "lucide-react";
import { useLang } from "./lib/i18n";
import { t } from "./lib/content";
import { rich } from "./lib/rich";
import { craftStack } from "./lib/credentials";
import { CANVA_REEL, GITHUB_USER, LINKEDIN, WHATSAPP, YOUTUBE, cdnIcon } from "./lib/site";
import PersonalIntro from "./components/PersonalIntro";
import CityStory from "./components/CityStory";
import StudioInvite from "./components/StudioInvite";
import PartnerBadges from "./components/PartnerBadges";
import ProductCards from "./components/ProductCards";
import Mission from "./components/Mission";
import VideoShowcase from "./components/VideoShowcase";
import BriefingForm from "./components/BriefingForm";
import { CountUp, Magnetic, Reveal, Spotlight, TechIcon } from "./components/fx";

const techs = [
  "python", "typescript", "react", "nextdotjs/white", "django/44B78B", "flask/white",
  "nodedotjs", "deno/70FFAF", "postgresql", "supabase", "redis", "docker",
  "tailwindcss", "pandas/E70488", "vercel/white", "threedotjs",
].map((s) => ({ n: s.split("/")[0], s: cdnIcon(s) }));
const allTechs = [...techs, { n: "Playwright", s: "/icons/playwright.svg" }];

const local = {
  pt: {
    mediaTag: "Audiovisual",
    mediaTitle: "Eu também filmo, edito e publico",
    mediaLead:
      "O sistema arruma a casa por dentro, mas não traz cliente sozinho. Eu faço as duas pontas: a vinheta da marca, a imagem aérea e o conteúdo que vai para as redes.",
    mediaBrand: ["Vinheta institucional", "Motion de marca em vídeo generativo, com pós-produção e trilha própria."],
    mediaDrone: ["Captação aérea com drone", "Piloto formado (ITARC, 2024). Imagem aérea de fachada, obra, evento e cidade."],
    mediaYT: ["Canal no YouTube", "Conteúdo em vídeo do MiseOn — tutorial, lançamento e material de apoio ao cliente."],
    mediaReel: ["Portfólio de vídeo", "Reel com os projetos de edição e motion."],
    craftTag: "Stack de criação",
    craftTitle: "Ferramentas que uso para criar",
    toolsTag: "Ferramentas gratuitas",
    toolsTitle: "Uma ajuda para o seu dia a dia",
    toolsLead:
      "Ferramentas gratuitas para conferir uma nota, calcular preços, consultar dados e preparar imagens. Escolha o que precisa e use, sem cadastro.",
    tools: [
      ["Decodificador de chave NF-e / NFC-e", "Cole os 44 dígitos do cupom e leia UF, CNPJ do emitente, modelo, série, número e o dígito verificador por módulo 11.", "/ferramentas#nfe"],
      ["Leitor e validador de Pix Copia e Cola", "Parse do payload EMV campo a campo, com chave do recebedor, valor, txid e conferência do CRC16-CCITT.", "/ferramentas#pix"],
      ["Diagnóstico de e-mail do domínio", "SPF, DKIM e DMARC consultados no DNS — descubra se a sua proposta está caindo no spam do cliente.", "/ferramentas#email"],
      ["Auditor de cabeçalhos HTTP", "HSTS, CSP, X-Frame-Options e mais, com nota de segurança e o que cada cabeçalho evita.", "/ferramentas#headers"],
      ["Calculadora de preço de venda e CMV", "Custo real do prato, CMV e o preço que fecha a margem que você quer — com perdas, taxa e imposto.", "/ferramentas#preco"],
      ["Margem por canal de venda", "Quanto sobra do mesmo pedido no iFood, no 99Food, no seu site e no balcão, e a diferença no fim do mês.", "/ferramentas#delivery"],
      ["Consulta de CNPJ na Receita", "Situação cadastral, data de abertura, atividade, capital e quadro societário de qualquer empresa do país.", "/ferramentas#cnpj"],
      ["Conversor de moeda do dia", "Dólar, euro, iene e libra com a cotação de agora. Útil para orçar para fora sem chutar o câmbio.", "/ferramentas#cambio"],
      ["O domínio da sua empresa está livre?", "Consulta direta no registro.br antes de você mandar imprimir cartão, fachada e cardápio.", "/ferramentas#dominio"],
      ["Busca de CEP com coordenada", "Endereço completo, código IBGE e latitude para conferir área de entrega.", "/ferramentas#cep"],
      ["Reajuste de contrato pelo IPCA", "Índice acumulado puxado do Banco Central, aplicado no valor do seu contrato.", "/ferramentas#ipca"],
      ["Feriados e efeito na escala", "Calendário do ano marcando onde vira emenda e muda compra, escala e movimento.", "/ferramentas#feriados"],
      ["Ficha técnica e fator de correção", "Você compra 1 kg mas não usa 1 kg. Veja quanto custa de verdade o que vai no prato.", "/ferramentas#ficha"],
      ["Margem × markup", "30% em cima do custo não dá 30% de margem. Dá 23%. Essa conta some do caixa todo mês.", "/ferramentas#markup"],
    ],
    toolsCta: "Abrir as ferramentas",
    linkedinCta: "Ver meu perfil no LinkedIn",
  },
  en: {
    mediaTag: "Audiovisual",
    mediaTitle: "I also shoot, edit and publish",
    mediaLead:
      "Systems fix the process; content brings people into it. I deliver both — from brand idents to aerial footage.",
    mediaBrand: ["Brand ident", "Generative-video brand motion, with post-production and its own soundtrack."],
    mediaDrone: ["Aerial drone footage", "Certified pilot (ITARC, 2024). Aerial imagery of storefronts, sites, events and cities."],
    mediaYT: ["YouTube channel", "MiseOn video content — tutorials, launches and customer support material."],
    mediaReel: ["Video portfolio", "A reel of the editing and motion work."],
    craftTag: "Creation stack",
    craftTitle: "The tools I deliver in",
    toolsTag: "Free tools",
    toolsTitle: "Useful tools, ready to use.",
    toolsLead:
      "Free tools for checking invoices, calculating prices, looking up information and preparing images. Choose what you need and use it without an account.",
    tools: [
      ["Brazilian e-invoice key decoder", "Paste the 44 digits and read state, issuer tax ID, model, series, number and the modulo-11 check digit.", "/ferramentas#nfe"],
      ["Pix copy-and-paste validator", "Field-by-field EMV payload parsing, with recipient key, amount, txid and CRC16-CCITT verification.", "/ferramentas#pix"],
      ["Domain email diagnosis", "SPF, DKIM and DMARC looked up in DNS — find out whether your proposals land in spam.", "/ferramentas#email"],
      ["HTTP security header audit", "HSTS, CSP, X-Frame-Options and more, graded, with what each header prevents.", "/ferramentas#headers"],
      ["Selling price & food-cost calculator", "Real plate cost, food-cost ratio and the price that hits your target margin.", "/ferramentas#preco"],
      ["Margin by sales channel", "What's left from the same order on delivery apps, your own site and the counter, and the monthly gap.", "/ferramentas#delivery"],
      ["Brazilian company lookup", "Registry status, founding date, activity, share capital and ownership of any company in the country.", "/ferramentas#cnpj"],
      ["Currency converter, live rate", "Dollar, euro, yen and pound at today's rate. Handy for quoting abroad without guessing.", "/ferramentas#cambio"],
      ["Is your domain free?", "Direct registro.br lookup before you print cards, signage and menus.", "/ferramentas#dominio"],
      ["Postcode lookup with coordinates", "Full address, municipal code and latitude to check delivery areas.", "/ferramentas#cep"],
      ["Contract adjustment by inflation", "Accumulated index pulled from the Central Bank, applied to your contract value.", "/ferramentas#ipca"],
      ["Holidays and roster impact", "The year's calendar tagged where a long weekend shifts buying, staffing and footfall.", "/ferramentas#feriados"],
      ["Recipe costing and yield factor", "You buy 1 kg but you don't use 1 kg. See what the plate really costs.", "/ferramentas#ficha"],
      ["Margin vs markup", "30% on cost is not a 30% margin. It is 23%. That gap leaves the till every month.", "/ferramentas#markup"],
    ],
    toolsCta: "Open the tools",
    linkedinCta: "See my LinkedIn profile",
  },
} as const;

export default function HomeClient() {
  const { lang } = useLang();
  const c = t[lang];
  const l = local[lang];

  return (
    <>
      {/* ---------- hero com o vídeo institucional ---------- */}
      <PersonalIntro />

      {/* ---------- faixa de tecnologias ---------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...allTechs, ...allTechs].map((x, i) => (
            <div className="tech" key={i}>
              <TechIcon src={x.s} size={19} />
              {x.n}
            </div>
          ))}
        </div>
      </div>

      <Mission />
      <PartnerBadges />

      {/* ---------- produtos ---------- */}
      <section id="produtos">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.prodTag}</div>
            <h2>{c.prodTitle}</h2>
            <p className="sec-lead">{c.prodLead}</p>
          </Reveal>
          <ProductCards />
          <div style={{ marginTop: 34 }}>
            <Link className="btn btn-ghost" href="/portfolio">
              {lang === "pt" ? "Ver o portfólio completo" : "See the full portfolio"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- engenharia ---------- */}
      <section id="engenharia">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.engTag}</div>
            <h2>{c.engTitle}</h2>
            <p className="sec-lead">{c.engLead}</p>
          </Reveal>
          <div className="eng">
            {c.eng.map((e, i) => (
              <Reveal key={e.h} delay={i * 0.08}>
                <Spotlight className="eng-card">
                  <div className="eng-n">0{i + 1}</div>
                  <h3>{e.h}</h3>
                  <p>{e.p}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- capacidades ---------- */}
      <section id="capacidades" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.capTag}</div>
            <h2>{c.capTitle}</h2>
            <div style={{ height: 40 }} />
          </Reveal>
          <div className="caps">
            {c.caps.map((cap, i) => {
              const icons = [Compass, Layout, Server, ShieldCheck, LineChart, Clapperboard];
              const Ico = icons[i % icons.length];
              return (
                <Reveal className="cap-wrapper" key={cap.h} delay={i * 0.06}>
                  <details className="cap-details">
                    <summary className="cap-front">
                      <div className="cap-icon-box">
                        <Ico size={36} strokeWidth={1.5} />
                      </div>
                      <h3>{cap.h}</h3>
                      <div
                        style={{
                          marginTop: "auto",
                          color: "var(--accent)",
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          opacity: 0.6,
                        }}
                      >
                        {lang === "pt" ? "Ver tecnologias e atividades +" : "View technologies and activities +"}
                      </div>
                    </summary>
                    <div className="cap-back">
                      <h3>{cap.h}</h3>
                      <ul>
                        {cap.i.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CityStory />
      <VideoShowcase />

      {/* ---------- stack de criação ---------- */}
      <section id="criacao" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{l.craftTag}</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 34px)", marginBottom: 32 }}>{l.craftTitle}</h2>
          </Reveal>
          <div className="craft">
            {craftStack.map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.04}>
                <div className="craft-item">
                  <TechIcon src={tool.icon} size={26} />
                  <div>
                    <div className="craft-name">{tool.name}</div>
                    <div className="craft-use">{tool.use[lang]}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ferramentas gratuitas ---------- */}
      <section id="ferramentas" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{l.toolsTag}</div>
            <h2>{l.toolsTitle}</h2>
            <p className="sec-lead">{l.toolsLead}</p>
          </Reveal>

          <StudioInvite />
          <div className="packs">
            {l.tools.map(([title, desc, href], i) => {
              const icons = [Receipt, QrCode, MailCheck, ShieldCheck, Calculator, LineChart, Building2, Coins, Globe, MapPin, TrendingUp, CalendarDays, ChefHat, Scale];
              const Ico = icons[i % icons.length];
              return (
                <Reveal key={href} delay={i * 0.05}>
                  <Link href={href} className="pack" style={{ display: "flex" }}>
                    <div className="pack-icon">
                      <Ico size={24} />
                    </div>
                    <h3 style={{ fontSize: 20 }}>{title}</h3>
                    <p className="pack-pitch" style={{ marginBottom: 18 }}>{desc}</p>
                    <span className="plink solid" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
                      <Sparkles size={15} /> {l.toolsCta}
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- método ---------- */}
      <section id="metodo">
        <div className="wrap">
          <Reveal>
            <div className="sec-tag">{c.howTag}</div>
            <h2>{c.howTitle}</h2>
            <p className="sec-lead">{c.howLead}</p>
          </Reveal>
          <div className="steps">
            {c.steps.map((s, i) => (
              <Reveal className="step" key={s.h} delay={i * 0.07}>
                <div className="step-n">{i + 1}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BriefingForm />

      {/* ---------- contato ---------- */}
      <section id="contato">
        <div className="wrap">
          <Reveal>
            <Spotlight className="contact-box">
              <h2>{c.contactTitle}</h2>
              <p>{c.contactLead}</p>
              <div className="cta-row" style={{ justifyContent: "center", marginBottom: 16 }}>
                <Magnetic>
                  <a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} /> {c.contactBtn}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                    <TechIcon src="/icons/linkedin.svg" size={18} /> {l.linkedinCta}
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href={GITHUB_USER} target="_blank" rel="noopener noreferrer">
                    {c.ctaGh}
                  </a>
                </Magnetic>
              </div>
              <p className="contact-fine">{c.contactFine}</p>
            </Spotlight>
          </Reveal>
        </div>
      </section>
    </>
  );
}
