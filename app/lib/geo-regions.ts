/* ------------------------------------------------------------------ */
/*  GeoSEO — implantação assistida de WhatsApp Oficial (só pt-BR)       */
/*  Conteúdo próprio por região (bairros, perfil de comércio, logística) */
/*  para não virar doorway page.                                        */
/* ------------------------------------------------------------------ */

export type GeoRegion = {
  slug: string;
  name: string;
  /** "na Zona Norte", "em Guarulhos"… */
  prep: string;
  kind: "City" | "AdministrativeArea";
  areas: string[];
  profile: string;
  focus: { niche: string; slug: string; why: string }[];
  logistics: string;
  lat: number;
  lng: number;
};

export const GEO_REGIONS: GeoRegion[] = [
  {
    slug: "sao-paulo",
    name: "São Paulo",
    prep: "em São Paulo",
    kind: "City",
    areas: ["Pinheiros", "Vila Madalena", "Butantã", "Lapa", "Centro", "Moema", "Vila Mariana", "Itaim Bibi"],
    profile:
      "Na capital, o gargalo raramente é falta de cliente: é o WhatsApp do balcão travado no pico, com três pessoas dividindo um celular e pedido se perdendo entre conversas.",
    focus: [
      { niche: "Restaurantes & Delivery", slug: "restaurantes-delivery", why: "status do pedido automático e equipe respondendo no celular sem custo" },
      { niche: "Clínicas & Saúde", slug: "clinicas-saude", why: "confirmação de consulta 24h antes para reduzir falta" },
      { niche: "Software Houses & ERPs", slug: "software-houses-erps", why: "embarcar o WhatsApp oficial no próprio sistema por R$ 59/número" },
    ],
    logistics: "Base em Pinheiros (R. Pais Leme, 215): implantação presencial na capital com agendamento, ou remota no mesmo dia.",
    lat: -23.5676,
    lng: -46.6931,
  },
  {
    slug: "guarulhos",
    name: "Guarulhos",
    prep: "em Guarulhos",
    kind: "City",
    areas: ["Centro", "Vila Galvão", "Macedo", "Bonsucesso", "Cumbica", "Pimentas", "Taboão"],
    profile:
      "Comércio de bairro forte e muita entrega: mercadinhos, adegas, pet shops e prestadores que vivem de WhatsApp — e que já perderam número por usar API de QR Code.",
    focus: [
      { niche: "Varejo & Mercados", slug: "varejo-mercados", why: "lembrete de fiado e aviso de encomenda sem o número cair" },
      { niche: "Serviços Locais", slug: "servicos-locais", why: "aviso de serviço pronto direto da ordem de serviço" },
      { niche: "E-commerce", slug: "ecommerce", why: "PIX pendente e rastreio pelo número oficial" },
    ],
    logistics: "Atendimento remoto imediato e visita presencial agendada em Guarulhos — já atendemos clientes na Vila Galvão.",
    lat: -23.4543,
    lng: -46.5337,
  },
  {
    slug: "abc-paulista",
    name: "ABC Paulista",
    prep: "no ABC Paulista",
    kind: "AdministrativeArea",
    areas: ["Santo André", "São Bernardo do Campo", "São Caetano do Sul", "Diadema", "Mauá"],
    profile:
      "Região de indústria, distribuidoras e software houses que atendem varejo: aqui o WhatsApp oficial costuma entrar como módulo do ERP, não como app isolado.",
    focus: [
      { niche: "Software Houses & ERPs", slug: "software-houses-erps", why: "Idempotency-Key por evento do ERP e Inbox pronta para o cliente final" },
      { niche: "Varejo & Mercados", slug: "varejo-mercados", why: "cobrança e aviso de pedido de distribuidora" },
      { niche: "Recrutamento (ATS)", slug: "recrutamento-ats", why: "aviso de etapa e documento pendente para candidatos" },
    ],
    logistics: "Integração técnica remota com o seu ERP; reuniões presenciais no ABC sob agendamento.",
    lat: -23.6639,
    lng: -46.5383,
  },
  {
    slug: "zona-norte-sp",
    name: "Zona Norte de São Paulo",
    prep: "na Zona Norte de São Paulo",
    kind: "AdministrativeArea",
    areas: ["Santana", "Tucuruvi", "Vila Maria", "Casa Verde", "Freguesia do Ó", "Mandaqui", "Tremembé"],
    profile:
      "Corredores comerciais como a Voluntários da Pátria e a Av. Braz Leme concentram lojas, clínicas e delivery que dependem do WhatsApp para fechar venda no mesmo dia.",
    focus: [
      { niche: "Clínicas & Saúde", slug: "clinicas-saude", why: "lembrete de consulta e remarcação pelo próprio chat" },
      { niche: "Restaurantes & Delivery", slug: "restaurantes-delivery", why: "aviso de saiu para entrega sem ocupar o atendente" },
      { niche: "Imobiliárias", slug: "imobiliarias", why: "lead do portal respondido em minutos" },
    ],
    logistics: "Implantação presencial na Zona Norte com agendamento, ou remota com acompanhamento por vídeo.",
    lat: -23.4825,
    lng: -46.6250,
  },
  {
    slug: "zona-leste-sp",
    name: "Zona Leste de São Paulo",
    prep: "na Zona Leste de São Paulo",
    kind: "AdministrativeArea",
    areas: ["Tatuapé", "Mooca", "Penha", "Itaquera", "Vila Formosa", "São Mateus", "Belém"],
    profile:
      "Região mais populosa da capital, com muito comércio de rua, oficinas e serviços — volume alto de conversa, onde a resposta pelo celular a R$ 0,00 (Coexistência) faz diferença no custo.",
    focus: [
      { niche: "Serviços Locais", slug: "servicos-locais", why: "orçamento aprovado e serviço pronto avisados automaticamente" },
      { niche: "Varejo & Mercados", slug: "varejo-mercados", why: "fiado e encomendas com mensagem de utilidade a R$ 0,035" },
      { niche: "Restaurantes & Delivery", slug: "restaurantes-delivery", why: "pedido confirmado direto do PDV" },
    ],
    logistics: "Implantação presencial na Zona Leste com agendamento, ou remota no mesmo dia.",
    lat: -23.5403,
    lng: -46.4700,
  },
];

export const geoRegionBySlug = (slug: string) => GEO_REGIONS.find((r) => r.slug === slug);
