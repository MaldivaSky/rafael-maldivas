/* ------------------------------------------------------------------ */
/*  Constantes do site — fonte única de verdade                        */
/* ------------------------------------------------------------------ */

/**
 * Domínio canônico.
 *
 * O valor antigo (rafael-maldivas.dev) não resolvia em DNS, o que apontava
 * todos os canonical e @id do JSON-LD para um host inexistente — motivo
 * suficiente para o Google e o Bing não indexarem o site.
 *
 * Ao registrar o domínio próprio, basta definir NEXT_PUBLIC_SITE_URL nas
 * variáveis de ambiente do Vercel. Nenhum arquivo precisa mudar.
 */
export const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rafael-maldivas.vercel.app"
).replace(/\/$/, "");

export const EMAIL = "rafaelmaldivas@gmail.com";
export const PHONE_E164 = "+5511919889233";
export const PHONE_HUMAN = "(11) 91988-9233";
export const WHATSAPP = "https://wa.me/5511919889233";
export const LINKEDIN = "https://www.linkedin.com/in/rafael-paiva-dias/";
export const GITHUB_USER = "https://github.com/MaldivaSky";
export const GITHUB_ORG = "https://github.com/maldivas-tech";
export const YOUTUBE = "https://www.youtube.com/@MiseOnSISTEMA--CozinhasProfiss";
export const CANVA_REEL = "https://canva.link/6laeoy708m17zrt";

export const COMPANY = {
  legalName:
    "Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA",
  tradeName: "Maldivas Tech",
  cnpj: "68.923.239/0001-77",
  cnae: "62.01-5-01",
  street: "R. Pais Leme, 215, cj. 1713 — Pinheiros",
  city: "São Paulo",
  region: "SP",
  postalCode: "05424-150",
  country: "BR",
  since: "2026-09-02",
  /* Pinheiros, São Paulo — usado no geo SEO e no Perfil da Empresa no Google */
  lat: -23.5676,
  lng: -46.6931,
} as const;

/** Cidades que entram como área de atendimento no schema local. */
export const SERVICE_AREAS = [
  "São Paulo",
  "Guarulhos",
  "Osasco",
  "Barueri",
  "São Bernardo do Campo",
  "Santo André",
  "Campinas",
] as const;

/**
 * Verificação dos buscadores. Preencha nas variáveis de ambiente depois de
 * cadastrar o domínio no Google Search Console e no Bing Webmaster Tools.
 */
export const VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
} as const;

/** Ícones locais — o CDN do simple-icons removeu vários slugs (404). */
export const icon = (name: string) => `/icons/${name}.svg`;

/** Ícones ainda servidos pelo CDN, para a faixa de stack técnica. */
export const cdnIcon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;
