/* ------------------------------------------------------------------ */
/*  Credenciais e parcerias de plataforma                              */
/*                                                                     */
/*  Regra: só entra aqui o que existe documentado. Nenhum App ID,      */
/*  Business ID, chave ou token é publicado — o selo declara o status  */
/*  da homologação, e a comprovação é enviada sob solicitação.         */
/* ------------------------------------------------------------------ */

export type BadgeStatus = "approved" | "pending";

export type Badge = {
  id: string;
  icon: string;
  platform: string;
  title: { pt: string; en: string };
  detail: { pt: string; en: string };
  status: BadgeStatus;
  statusLabel: { pt: string; en: string };
};

export const badges: Badge[] = [
  {
    id: "meta",
    icon: "/icons/meta.svg",
    platform: "Meta",
    title: { pt: "Provedora de Tecnologia verificada", en: "Verified Tech Provider" },
    detail: {
      pt: "Empresa verificada por Meta como Provedora de Tecnologia, com aplicativo aprovado para WhatsApp Business API.",
      en: "Company verified by Meta as a Technology Provider, with an approved WhatsApp Business API app.",
    },
    status: "approved",
    statusLabel: { pt: "Verificado", en: "Verified" },
  },
  {
    id: "ifood",
    icon: "/icons/ifood.svg",
    platform: "iFood",
    title: { pt: "Integração homologada", en: "Approved integration" },
    detail: {
      pt: "Aplicativo aprovado no iFood for Developers em 22/08/2026, liberado para uso em produção.",
      en: "App approved on iFood for Developers on 2026-08-22 and cleared for production use.",
    },
    status: "approved",
    statusLabel: { pt: "Homologado", en: "Approved" },
  },
  {
    id: "99food",
    icon: "/icons/99food.svg",
    platform: "99Food",
    title: { pt: "Integração em desenvolvimento", en: "Integration in progress" },
    detail: {
      pt: "Terceiro canal de pedidos do MiseOn, em construção para entrar na mesma fila unificada de iFood e WhatsApp.",
      en: "MiseOn's third order channel, being built to land in the same unified queue as iFood and WhatsApp.",
    },
    status: "pending",
    statusLabel: { pt: "Em desenvolvimento", en: "In progress" },
  },
];

/* ------------------------------------------------------------------ */
/*  Stack de criação — edição, design e conteúdo                      */
/* ------------------------------------------------------------------ */

export type CraftTool = {
  name: string;
  icon: string;
  use: { pt: string; en: string };
};

export const craftStack: CraftTool[] = [
  {
    name: "CapCut",
    icon: "/icons/capcut.svg",
    use: { pt: "Corte, legenda e formato vertical", en: "Cutting, captions and vertical formats" },
  },
  {
    name: "Canva",
    icon: "/icons/canva.svg",
    use: { pt: "Identidade, panfleto e post", en: "Identity, flyers and social posts" },
  },
  {
    name: "Figma",
    icon: "/icons/figma.svg",
    use: { pt: "UI, protótipo e design system", en: "UI, prototyping and design systems" },
  },
  {
    name: "Veo / Gemini",
    icon: "/icons/googlegemini.svg",
    use: { pt: "Motion e vídeo generativo", en: "Motion and generative video" },
  },
  {
    name: "DJI",
    icon: "/icons/dji.svg",
    use: { pt: "Captação aérea (piloto certificado)", en: "Aerial footage (certified pilot)" },
  },
  {
    name: "Google Ads",
    icon: "/icons/googleads.svg",
    use: { pt: "Campanha de busca e performance", en: "Search and performance campaigns" },
  },
  {
    name: "Meta Ads",
    icon: "/icons/meta.svg",
    use: { pt: "Campanha em Instagram e Facebook", en: "Instagram and Facebook campaigns" },
  },
  {
    name: "Google Maps",
    icon: "/icons/googlemaps.svg",
    use: { pt: "Perfil da Empresa e SEO local", en: "Business Profile and local SEO" },
  },
];
