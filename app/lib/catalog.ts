/* ------------------------------------------------------------------ */
/*  Catálogo de serviços, separado por tipo de trabalho                */
/*                                                                     */
/*  Antes existia um card "Presença digital" que juntava Google Meu    */
/*  Negócio, tráfego pago, conteúdo social, drone, vídeo institucional */
/*  e material impresso — seis ofícios diferentes numa caixa só. Quem  */
/*  lê não consegue dizer o que é contratável separadamente.           */
/* ------------------------------------------------------------------ */

export type Area = "software" | "ti" | "marketing" | "audiovisual";

export type Servico = {
  id: string;
  area: Area;
  icon: string;
  nome: { pt: string; en: string };
  resumo: { pt: string; en: string };
  entrega: { pt: string[]; en: string[] };
  /** o que muda na vida de quem contrata */
  resultado: { pt: string; en: string };
};

export const AREAS: Record<
  Area,
  { pt: string; en: string; lead: { pt: string; en: string } }
> = {
  software: {
    pt: "Software sob medida",
    en: "Custom software",
    lead: {
      pt: "Quando o sistema de prateleira não serve, ou serve pela metade e a equipe faz o resto no caderno.",
      en: "When off-the-shelf doesn't fit, or fits halfway and the team does the rest on paper.",
    },
  },
  ti: {
    pt: "Tecnologia da informação",
    en: "Information technology",
    lead: {
      pt: "A parte que ninguém vê até parar de funcionar: acesso, e-mail, backup, domínio, site no ar.",
      en: "The part nobody notices until it stops working: access, email, backup, domain, site uptime.",
    },
  },
  marketing: {
    pt: "Marketing e presença digital",
    en: "Marketing and digital presence",
    lead: {
      pt: "Sistema arruma a casa por dentro. Isso aqui é o que faz gente nova bater na porta.",
      en: "A system fixes the inside. This is what makes new people knock on the door.",
    },
  },
  audiovisual: {
    pt: "Audiovisual e conteúdo",
    en: "Video and content",
    lead: {
      pt: "Produzido aqui dentro, do roteiro à entrega. Sem terceirizar para agência.",
      en: "Produced in-house, from script to delivery. No agency in the middle.",
    },
  },
};

export const servicos: Servico[] = [
  /* ---------------- software ---------------- */
  {
    id: "sistemas",
    area: "software",
    icon: "code",
    nome: { pt: "Desenvolvimento de sistemas", en: "System development" },
    resumo: {
      pt: "ERP, PDV com emissão fiscal, marketplace, ATS e SaaS multi-tenant, do modelo de dados ao deploy.",
      en: "ERP, fiscal POS, marketplace, ATS and multi-tenant SaaS, from the data model to deployment.",
    },
    entrega: {
      pt: [
        "Levantamento do processo dentro da sua operação",
        "Banco PostgreSQL com isolamento por cliente e trilha de auditoria",
        "Emissão de NFC-e e contingência quando a internet cai",
        "Migração da planilha atual sem perder histórico",
      ],
      en: [
        "Process discovery inside your operation",
        "PostgreSQL with per-tenant isolation and audit trails",
        "Fiscal invoicing and offline contingency when the link drops",
        "Migration from the current spreadsheet without losing history",
      ],
    },
    resultado: {
      pt: "O número que você olha de manhã passa a ser o número certo.",
      en: "The figure you check in the morning becomes the right figure.",
    },
  },
  {
    id: "integracoes",
    area: "software",
    icon: "plug",
    nome: { pt: "Integrações e automações", en: "Integrations and automation" },
    resumo: {
      pt: "Pedido do iFood, mensagem de WhatsApp e recebimento em Pix caindo no mesmo lugar, sem redigitação.",
      en: "Delivery-app orders, WhatsApp messages and Pix receipts landing in one place, with no retyping.",
    },
    entrega: {
      pt: [
        "iFood: integração homologada, pedido entra direto na fila",
        "WhatsApp Business API: empresa verificada como Provedora pela Meta",
        "Pix e split automático de recebimento entre lojistas",
        "Conciliação e baixa automática no pedido",
      ],
      en: [
        "iFood: approved integration, orders land straight in the queue",
        "WhatsApp Business API: company verified as a Provider by Meta",
        "Pix and automatic receipt splitting between sellers",
        "Reconciliation and automatic order settlement",
      ],
    },
    resultado: {
      pt: "Ninguém mais copia pedido de uma tela para outra às sete da noite.",
      en: "Nobody copies an order from one screen to another at seven in the evening.",
    },
  },
  {
    id: "dados",
    area: "software",
    icon: "chart",
    nome: { pt: "Análise de dados e BI", en: "Data analysis and BI" },
    resumo: {
      pt: "Painéis que respondem o que você pergunta: o que vende, o que encalha, quem compra de novo.",
      en: "Dashboards that answer what you actually ask: what sells, what sits, who comes back.",
    },
    entrega: {
      pt: [
        "Curva ABC, matriz RFM e previsão de ruptura de estoque",
        "Painel em Power BI, Plotly ou dentro do próprio sistema",
        "Ingestão das bases que você já tem, mesmo em planilha",
        "Relatório mensal com leitura, não só gráfico",
      ],
      en: [
        "ABC curves, RFM matrices and stockout forecasting",
        "Dashboards in Power BI, Plotly or inside the system itself",
        "Ingestion of the data you already have, spreadsheets included",
        "A monthly report with a reading, not just charts",
      ],
    },
    resultado: {
      pt: "Decisão de compra deixa de ser palpite de fim de semana.",
      en: "Purchasing decisions stop being a weekend hunch.",
    },
  },
  {
    id: "ux",
    area: "software",
    icon: "compass",
    nome: { pt: "Desenho da tela com quem usa", en: "Designing screens with the user" },
    resumo: {
      pt: "Sistema que a equipe não usa não é problema de tecnologia. É tela feita por quem nunca ficou atrás do balcão.",
      en: "A system the team won't use isn't a tech problem. It's a screen made by someone who never stood at the counter.",
    },
    entrega: {
      pt: [
        "Eu acompanho o dia da equipe antes de desenhar qualquer tela",
        "Você mexe no rascunho antes de virar código",
        "Uma parte pronta por semana, em ambiente de teste só seu",
        "Treinamento e manual no aceite, sem custo extra",
      ],
      en: [
        "I shadow the team's day before drawing a single screen",
        "You change the sketch before it becomes code",
        "One finished piece per week, on a test environment that's yours",
        "Training and a manual at sign-off, at no extra cost",
      ],
    },
    resultado: {
      pt: "A equipe para de anotar no caderno por fora do sistema.",
      en: "The team stops keeping a paper notebook alongside the system.",
    },
  },

  /* ---------------- TI ---------------- */
  {
    id: "ti-gerenciada",
    area: "ti",
    icon: "server",
    nome: { pt: "Gerenciamento de TI", en: "Managed IT" },
    resumo: {
      pt: "Um responsável técnico fixo, no lugar de chamar alguém diferente a cada problema.",
      en: "One fixed technical lead instead of calling a different person for every problem.",
    },
    entrega: {
      pt: [
        "Ponto único de contato para toda a tecnologia da empresa",
        "Backup com restauração testada, não só agendada",
        "Monitoramento de disponibilidade, certificado e domínio",
        "Inventário de contas, acessos e licenças",
      ],
      en: [
        "A single point of contact for all company technology",
        "Backups with restores actually tested, not just scheduled",
        "Uptime, certificate and domain monitoring",
        "Inventory of accounts, access and licences",
      ],
    },
    resultado: {
      pt: "O dono para de ser o suporte técnico da própria empresa.",
      en: "The owner stops being their own company's help desk.",
    },
  },
  {
    id: "email",
    area: "ti",
    icon: "mail",
    nome: { pt: "E-mail corporativo", en: "Corporate email" },
    resumo: {
      pt: "Proposta comercial que some no spam é venda perdida, e você nunca fica sabendo.",
      en: "A proposal lost to spam is a lost sale, and you never find out.",
    },
    entrega: {
      pt: [
        "SPF, DKIM e DMARC configurados no domínio",
        "Criação, desativação e transferência de usuários e grupos",
        "Comparativo Google Workspace × Microsoft 365 com recomendação",
        "Migração entre provedores sem perder histórico",
      ],
      en: [
        "SPF, DKIM and DMARC configured on the domain",
        "Creating, disabling and transferring users and groups",
        "Google Workspace vs. Microsoft 365 comparison with a recommendation",
        "Provider migration without losing history",
      ],
    },
    resultado: {
      pt: "O e-mail da empresa chega na caixa de entrada do cliente.",
      en: "Company email lands in the customer's inbox.",
    },
  },
  {
    id: "site",
    area: "ti",
    icon: "layout",
    nome: { pt: "Criação e manutenção de site", en: "Website build and maintenance" },
    resumo: {
      pt: "Site parado envelhece. O seu fica no ar, atualizado e achável.",
      en: "A frozen site ages badly. Yours stays live, current and findable.",
    },
    entrega: {
      pt: [
        "Publicação de textos, banners, vagas e páginas de campanha",
        "Formulários ligados direto ao seu sistema ou CRM",
        "Correção de layout quebrado e otimização de velocidade",
        "Monitoramento de disponibilidade e renovação de certificado",
      ],
      en: [
        "Publishing copy, banners, job posts and campaign pages",
        "Forms wired straight into your system or CRM",
        "Broken-layout fixes and speed optimisation",
        "Uptime monitoring and certificate renewal",
      ],
    },
    resultado: {
      pt: "O formulário do site vira registro no sistema sem ninguém redigitar.",
      en: "A site form becomes a system record with nobody retyping it.",
    },
  },

  /* ---------------- marketing ---------------- */
  {
    id: "google-negocio",
    area: "marketing",
    icon: "map",
    nome: { pt: "Google Meu Negócio e SEO local", en: "Google Business Profile and local SEO" },
    resumo: {
      pt: "Aparecer no mapa quando alguém procura o seu serviço na sua rua costuma valer mais que anúncio.",
      en: "Showing up on the map when someone searches your service on your street usually beats advertising.",
    },
    entrega: {
      pt: [
        "Perfil da Empresa completo: fotos, horário, categoria e serviços",
        "Resposta a avaliação e política de reputação",
        "Dados estruturados no site para o Google e o Bing entenderem",
        "Acompanhamento de quantas pessoas ligaram e traçaram rota",
      ],
      en: [
        "Complete Business Profile: photos, hours, category and services",
        "Review responses and a reputation policy",
        "Structured data on the site so Google and Bing understand it",
        "Tracking of how many people called and asked for directions",
      ],
    },
    resultado: {
      pt: "Quem procura na sua rua acha você, não o concorrente.",
      en: "People searching on your street find you, not the competitor.",
    },
  },
  {
    id: "trafego",
    area: "marketing",
    icon: "megaphone",
    nome: { pt: "Tráfego pago", en: "Paid traffic" },
    resumo: {
      pt: "Campanha em Google Ads e Meta Ads com relatório que diz quanto entrou, não quantos clicaram.",
      en: "Google Ads and Meta Ads campaigns with a report that says what came in, not how many clicked.",
    },
    entrega: {
      pt: [
        "Estrutura de campanha, público e criativo",
        "Rastreamento de origem até o pedido ou o contato",
        "Relatório mensal de resultado em linguagem de dono",
        "Verba de mídia paga direto por você, sem intermediação",
      ],
      en: [
        "Campaign structure, audiences and creatives",
        "Source tracking all the way to the order or the enquiry",
        "Monthly results report in plain owner's language",
        "Media budget paid directly by you, with nobody in between",
      ],
    },
    resultado: {
      pt: "Você para de pagar por clique e passa a pagar por cliente.",
      en: "You stop paying for clicks and start paying for customers.",
    },
  },
  {
    id: "identidade",
    area: "marketing",
    icon: "palette",
    nome: { pt: "Identidade e material impresso", en: "Identity and print material" },
    resumo: {
      pt: "Logo, panfleto, cardápio, fachada e post — feitos no Canva e no Figma, com a mesma cara.",
      en: "Logo, flyers, menus, signage and posts — made in Canva and Figma, all in one look.",
    },
    entrega: {
      pt: [
        "Identidade visual e manual básico de marca",
        "Panfleto, cardápio, encarte e material de PDV",
        "Arte para post, story e capa de rede social",
        "Arquivo aberto entregue no fim, é seu",
      ],
      en: [
        "Visual identity and a basic brand manual",
        "Flyers, menus, inserts and point-of-sale material",
        "Artwork for posts, stories and social covers",
        "Source files handed over at the end — they're yours",
      ],
    },
    resultado: {
      pt: "O negócio passa a parecer do tamanho que ele é.",
      en: "The business finally looks the size it actually is.",
    },
  },

  /* ---------------- audiovisual ---------------- */
  {
    id: "video-institucional",
    area: "audiovisual",
    icon: "clapper",
    nome: { pt: "Vídeo institucional e motion", en: "Brand film and motion" },
    resumo: {
      pt: "Vinheta de marca, vídeo de apresentação e peça para lançamento, com trilha e pós-produção.",
      en: "Brand idents, presentation films and launch pieces, with soundtrack and post-production.",
    },
    entrega: {
      pt: [
        "Roteiro, captação ou geração, montagem e trilha",
        "Motion e vinheta com a sua identidade",
        "Versão para site, para anúncio e para tela vertical",
        "Entrega em 1080p, pronta para subir",
      ],
      en: [
        "Script, shooting or generation, editing and soundtrack",
        "Motion and idents in your own identity",
        "Versions for the site, for ads and for vertical screens",
        "Delivered in 1080p, ready to publish",
      ],
    },
    resultado: {
      pt: "A primeira impressão para de depender de foto de celular.",
      en: "First impressions stop depending on a phone snapshot.",
    },
  },
  {
    id: "edicao",
    area: "audiovisual",
    icon: "scissors",
    nome: { pt: "Edição de vídeo", en: "Video editing" },
    resumo: {
      pt: "Material bruto vira peça publicitária: corte, cor, legenda, trilha e ritmo.",
      en: "Raw footage becomes an ad: cutting, colour, captions, soundtrack and pace.",
    },
    entrega: {
      pt: [
        "Corte de material próprio ou de banco",
        "Legenda queimada, pensada para quem assiste sem som",
        "Formato horizontal, quadrado e vertical na mesma entrega",
        "Revisão incluída antes da versão final",
      ],
      en: [
        "Editing of your own footage or stock",
        "Burnt-in captions, built for people watching without sound",
        "Horizontal, square and vertical in the same delivery",
        "One revision round included before the final cut",
      ],
    },
    resultado: {
      pt: "O vídeo prende até o fim, em vez de ser pulado em três segundos.",
      en: "The video holds to the end instead of being skipped in three seconds.",
    },
  },
  {
    id: "drone",
    area: "audiovisual",
    icon: "drone",
    nome: { pt: "Filmagem com drone", en: "Drone filming" },
    resumo: {
      pt: "Imagem aérea de fachada, obra, evento e panorâmica urbana. Piloto formado pela ITARC.",
      en: "Aerial footage of storefronts, sites, events and city panoramas. Pilot certified by ITARC.",
    },
    entrega: {
      pt: [
        "Captação em 1080p, equipamento e piloto próprios",
        "Fachada, área externa, estacionamento e entorno",
        "Obra acompanhada por etapa, para registro de avanço",
        "Material bruto entregue junto com a edição",
      ],
      en: [
        "1080p capture, own equipment and pilot",
        "Storefront, outdoor area, parking and surroundings",
        "Construction tracked by stage, as a progress record",
        "Raw footage delivered alongside the edit",
      ],
    },
    resultado: {
      pt: "O cliente entende o tamanho do lugar antes de chegar nele.",
      en: "The customer grasps the size of the place before arriving.",
    },
  },
  {
    id: "conteudo",
    area: "audiovisual",
    icon: "instagram",
    nome: { pt: "Conteúdo para redes sociais", en: "Social media content" },
    resumo: {
      pt: "Corte vertical, legenda e ritmo de feed — o formato que a plataforma entrega para mais gente.",
      en: "Vertical cuts, captions and feed pacing — the format the platform actually pushes.",
    },
    entrega: {
      pt: [
        "Pauta e roteiro curto a partir do que o negócio já faz",
        "Corte vertical com legenda, pronto para Reels e Shorts",
        "Calendário de publicação e acompanhamento do que rendeu",
        "Canal no YouTube estruturado, com capa e descrição",
      ],
      en: [
        "Topics and short scripts from what the business already does",
        "Vertical cuts with captions, ready for Reels and Shorts",
        "Publishing calendar and tracking of what performed",
        "A structured YouTube channel, with art and descriptions",
      ],
    },
    resultado: {
      pt: "O perfil para de ficar parado há oito meses.",
      en: "The profile stops sitting untouched for eight months.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Vídeos por modalidade                                              */
/* ------------------------------------------------------------------ */

export type Peca = {
  id: string;
  src: string;
  poster: string;
  modalidade: { pt: string; en: string };
  titulo: { pt: string; en: string };
  desc: { pt: string; en: string };
  ficha: { pt: string; en: string };
};

export const pecas: Peca[] = [
  {
    id: "institucional",
    src: "/video/maldivas-hero.mp4",
    poster: "/video/maldivas-hero-poster.jpg",
    modalidade: { pt: "Vinheta de marca", en: "Brand ident" },
    titulo: { pt: "Abertura da Maldivas Tech", en: "Maldivas Tech ident" },
    desc: {
      pt: "Peça de abertura da marca, com trilha própria. É a mesma que roda no topo deste site.",
      en: "The brand's opening piece, with its own soundtrack. It's the one running at the top of this site.",
    },
    ficha: { pt: "Motion · vídeo generativo · pós-produção", en: "Motion · generative video · post" },
  },
  {
    id: "drone",
    src: "/video/drone-sp.mp4",
    poster: "/video/drone-sp-poster.jpg",
    modalidade: { pt: "Filmagem com drone", en: "Drone filming" },
    titulo: { pt: "Captação aérea em São Paulo", en: "Aerial capture in São Paulo" },
    desc: {
      pt: "Panorâmica urbana em 1080p. Equipamento e piloto próprios, com formação pela ITARC.",
      en: "Urban panorama in 1080p. Own equipment and pilot, certified by ITARC.",
    },
    ficha: { pt: "1080p · piloto formado · material bruto incluso", en: "1080p · certified pilot · raw footage included" },
  },
  {
    id: "edicao",
    src: "/video/sabor-de-braganca.mp4",
    poster: "/video/sabor-de-braganca-poster.jpg",
    modalidade: { pt: "Edição de vídeo · cliente", en: "Video editing · client" },
    titulo: { pt: "Sabor de Bragança — Linguiças Especiais", en: "Sabor de Bragança — Specialty Sausages" },
    desc: {
      pt: "Peça publicitária completa para o cliente: abertura de marca, aérea de Bragança Paulista, produção, ponto de venda e fechamento. Corte, cor, trilha e ritmo de anúncio.",
      en: "A full ad piece for the client: brand opening, aerial of Bragança Paulista, production line, point of sale and close. Editing, colour, soundtrack and ad pacing.",
    },
    ficha: { pt: "Cliente real · corte · cor · trilha", en: "Real client · cut · colour · soundtrack" },
  },
  {
    id: "produto",
    src: "/video/miseon-totem.mp4",
    poster: "/video/miseon-totem-poster.jpg",
    modalidade: { pt: "Vídeo de produto", en: "Product video" },
    titulo: { pt: "Totem de autoatendimento MiseOn", en: "MiseOn self-service kiosk" },
    desc: {
      pt: "Peça curta de lançamento do totem, feita para anúncio e para o topo de página de vendas.",
      en: "A short launch piece for the kiosk, built for ads and the top of a sales page.",
    },
    ficha: { pt: "Vertical e horizontal · pronto para anúncio", en: "Vertical and horizontal · ad-ready" },
  },
];
