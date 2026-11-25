/* ------------------------------------------------------------------ */
/*  Conteúdo da home que também vira JSON-LD (FAQPage, ItemList,        */
/*  VideoObject). Fonte única: o texto visível e o schema nunca          */
/*  divergem — exigência do Google para rich results.                   */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";

type Bi = { pt: string; en: string };

export const HOME_FAQ: { q: Bi; a: Bi }[] = [
  {
    q: { pt: "A Maldivas Tech desenvolve sistema sob medida?", en: "Does Maldivas Tech build custom software?" },
    a: {
      pt: "Sim. Além dos produtos próprios, desenvolvemos sistemas, integrações (ERP, iFood, WhatsApp oficial, PIX) e painéis de dados sob contrato, com escopo, prazo e critérios de aceite definidos antes de começar.",
      en: "Yes. Besides our own products, we build systems, integrations (ERP, iFood, official WhatsApp, PIX) and data dashboards under contract, with scope, timeline and acceptance criteria agreed upfront.",
    },
  },
  {
    q: { pt: "Vocês emitem nota fiscal e assinam contrato?", en: "Do you issue invoices and sign contracts?" },
    a: {
      pt: "Sim. A Maldivas Tech é a Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA, CNPJ 68.923.239/0001-77, com sede em Pinheiros, São Paulo. Todo serviço e assinatura sai com NFSe.",
      en: "Yes. Maldivas Tech is Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA, tax ID 68.923.239/0001-77, based in Pinheiros, São Paulo. Every service and subscription is invoiced.",
    },
  },
  {
    q: { pt: "Atendem empresas fora de São Paulo?", en: "Do you serve companies outside São Paulo?" },
    a: {
      pt: "Sim. Os sistemas são em nuvem e a implantação é remota; em São Paulo e região metropolitana também fazemos implantação presencial. O SelectSys Jobs, por exemplo, atende uma agência que opera entre Brasil e Japão.",
      en: "Yes. Our systems are cloud-based and onboarding is remote; in the São Paulo metro area we also onboard on-site. SelectSys Jobs, for instance, serves an agency operating between Brazil and Japan.",
    },
  },
  {
    q: { pt: "Quem mantém os sistemas depois da entrega?", en: "Who maintains the systems after delivery?" },
    a: {
      pt: "A mesma equipe que construiu. Os produtos próprios têm evolução contínua; projetos sob medida saem com garantia técnica sobre o escopo e opção de manutenção mensal.",
      en: "The same team that built them. Our own products evolve continuously; custom projects ship with a technical warranty on scope and an optional monthly maintenance plan.",
    },
  },
  {
    q: { pt: "O curso é mesmo gratuito, com certificado?", en: "Is the course really free, with a certificate?" },
    a: {
      pt: "Sim. As 18 aulas (38h10) estão abertas sem custo. Ao concluir os quizzes e ter o projeto final aprovado pela rubrica técnica, você recebe um certificado de curso livre com código único, verificável publicamente. É curso livre, não regulamentado pelo MEC.",
      en: "Yes. All 18 lessons (38h10) are open at no cost. After completing the quizzes and getting the final project approved by the technical rubric, you receive a free-standing course certificate with a unique, publicly verifiable code. It's not a MEC-accredited program.",
    },
  },
];

export const BRAND_VIDEO = {
  src: "/video/maldivas-hero.mp4",
  webm: "/video/maldivas-hero.webm",
  poster: "/video/maldivas-hero-poster.jpg",
  name: { pt: "Maldivas Tech — vídeo institucional", en: "Maldivas Tech — brand video" } as Bi,
  description: {
    pt: "Vídeo institucional da Maldivas Tech, software house de São Paulo que constrói e opera SaaS próprios e sistemas sob medida.",
    en: "Brand video of Maldivas Tech, a São Paulo software house that builds and runs its own SaaS products and custom systems.",
  } as Bi,
  uploadDate: "2026-09-11",
};

export const faqFor = (lang: Lang) => HOME_FAQ.map((f) => ({ q: f.q[lang], a: f.a[lang] }));
