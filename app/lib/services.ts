/* ------------------------------------------------------------------ */
/*  Catálogo comercial                                                 */
/*  Valores não são publicados — a definição é "sob consulta".         */
/* ------------------------------------------------------------------ */

export type Pack = {
  id: string;
  icon: string;
  name: { pt: string; en: string };
  pitch: { pt: string; en: string };
  items: { pt: string[]; en: string[] };
  outcome: { pt: string; en: string };
  featured?: boolean;
};

export const packs: Pack[] = [
  {
    id: "ti",
    icon: "server",
    name: { pt: "Gerenciamento de TI", en: "Managed IT" },
    pitch: {
      pt: "Um responsável técnico fixo, no lugar de chamar alguém diferente a cada problema.",
      en: "One fixed technical lead instead of calling a different person for every problem.",
    },
    items: {
      pt: [
        "Ponto único de contato para toda a tecnologia da empresa",
        "Atendimento em dias úteis com prazo de resposta combinado em contrato",
        "Backups verificados — restauração testada, não só agendada",
        "Monitoramento de disponibilidade, certificado SSL e domínio",
        "Inventário de contas, acessos e licenças",
        "Presença presencial combinada, quando a operação exige",
      ],
      en: [
        "Single point of contact for all company technology",
        "Business-hours support with a contractual response time",
        "Verified backups — restores tested, not merely scheduled",
        "Uptime, SSL certificate and domain monitoring",
        "Inventory of accounts, access and licences",
        "Scheduled on-site presence when the operation requires it",
      ],
    },
    outcome: {
      pt: "A equipe para de perder hora com problema de computador e o dono para de ser o suporte técnico.",
      en: "The team stops losing hours to computer problems and the owner stops being the help desk.",
    },
  },
  {
    id: "email",
    icon: "mail",
    name: { pt: "Gestão de e-mail corporativo", en: "Corporate email management" },
    pitch: {
      pt: "O e-mail da sua empresa precisa chegar na caixa de entrada — não no spam do cliente.",
      en: "Your company email has to land in the inbox — not in the customer's spam folder.",
    },
    items: {
      pt: [
        "Criação, desativação e transferência de usuários e grupos",
        "Endereços institucionais e recuperação de acesso",
        "Configuração de SPF, DKIM e DMARC contra entrega em spam",
        "Estudo comparativo Google Workspace × Microsoft 365 com recomendação",
        "Migração entre provedores sem perder histórico",
        "Política de retenção e desligamento de colaborador",
      ],
      en: [
        "Creating, disabling and transferring users and groups",
        "Institutional addresses and access recovery",
        "SPF, DKIM and DMARC setup against spam foldering",
        "Google Workspace vs. Microsoft 365 comparison with a recommendation",
        "Provider migration without losing history",
        "Retention and offboarding policy",
      ],
    },
    outcome: {
      pt: "Proposta comercial que some no spam é venda perdida. Autenticação de domínio resolve isso.",
      en: "A proposal lost to spam is a lost sale. Domain authentication fixes that.",
    },
  },
  {
    id: "site",
    icon: "layout",
    name: { pt: "Manutenção de site", en: "Website maintenance" },
    pitch: {
      pt: "Site parado envelhece. O seu fica no ar, atualizado e achável.",
      en: "A frozen site ages badly. Yours stays live, current and findable.",
    },
    items: {
      pt: [
        "Publicação de textos, banners, vagas e páginas de campanha",
        "SEO contínuo — inclusive multilíngue quando o público exige",
        "Monitoramento de disponibilidade e renovação de certificado",
        "Formulários do site conectados direto ao seu sistema ou CRM",
        "Correção de layout quebrado e otimização de velocidade",
        "Relatório mensal de acesso e origem do tráfego",
      ],
      en: [
        "Publishing copy, banners, job posts and campaign pages",
        "Continuous SEO — multilingual when the audience calls for it",
        "Uptime monitoring and certificate renewal",
        "Site forms wired straight into your system or CRM",
        "Broken-layout fixes and speed optimisation",
        "Monthly traffic and acquisition report",
      ],
    },
    outcome: {
      pt: "O formulário do site vira registro no sistema sem ninguém redigitar nada.",
      en: "A site form becomes a system record with nobody retyping anything.",
    },
  },
  {
    id: "digital",
    icon: "megaphone",
    name: { pt: "Presença digital e divulgação", en: "Digital presence & growth" },
    pitch: {
      pt: "Ser achado no Google Maps costuma valer mais que qualquer anúncio.",
      en: "Being found on Google Maps is usually worth more than any ad.",
    },
    items: {
      pt: [
        "Perfil da Empresa no Google — fotos, horário, categoria e avaliações",
        "Campanhas em Google Ads e Meta Ads com relatório mensal de resultado",
        "Conteúdo para redes sociais: corte, legenda e formato vertical",
        "Captação aérea com drone (piloto formado, ITARC)",
        "Vídeo institucional, motion e vinheta de marca",
        "Material impresso e identidade — panfleto, cardápio, fachada",
      ],
      en: [
        "Google Business Profile — photos, hours, category and reviews",
        "Google Ads and Meta Ads campaigns with a monthly results report",
        "Social content: cutting, captions and vertical formats",
        "Aerial drone footage (certified pilot, ITARC)",
        "Brand film, motion design and idents",
        "Print and identity — flyers, menus, storefront",
      ],
    },
    outcome: {
      pt: "Quem procura o seu serviço na sua rua encontra você, não o concorrente.",
      en: "People searching for your service on your street find you, not the competitor.",
    },
  },
  {
    id: "dev",
    icon: "code",
    name: { pt: "Desenvolvimento sob medida", en: "Custom development" },
    pitch: {
      pt: "Quando o sistema de prateleira não serve, eu construo o que a operação precisa.",
      en: "When off-the-shelf doesn't fit, I build what the operation actually needs.",
    },
    items: {
      pt: [
        "ERP, PDV com emissão fiscal, marketplace, ATS e SaaS multi-tenant",
        "Integração com iFood, WhatsApp Business API, Pix e split de pagamento",
        "Modelagem PostgreSQL com Row Level Security e trilha de auditoria",
        "Migração de planilha para sistema, sem perder o histórico",
        "Relatórios e painéis de BI a partir dos seus próprios dados",
        "LGPD by design e documento exportável fiel ao layout exigido",
      ],
      en: [
        "ERP, fiscal POS, marketplace, ATS and multi-tenant SaaS",
        "Integration with iFood, WhatsApp Business API, Pix and payment split",
        "PostgreSQL modelling with Row Level Security and audit trails",
        "Spreadsheet-to-system migration without losing history",
        "BI reports and dashboards built on your own data",
        "LGPD by design and exportable documents true to the required layout",
      ],
    },
    outcome: {
      pt: "Software que a equipe usa todo dia — porque foi desenhado em cima do processo dela.",
      en: "Software the team uses every day — because it was designed around their process.",
    },
    featured: true,
  },
  {
    id: "ux",
    icon: "compass",
    name: { pt: "Desenho da tela junto com quem usa", en: "Designing the screen with whoever uses it" },
    pitch: {
      pt: "Sistema que a equipe não usa não é problema de tecnologia. É tela feita por quem nunca ficou atrás do balcão.",
      en: "A system the team won't use isn't a technology problem. It's a screen designed by someone who never stood behind the counter.",
    },
    items: {
      pt: [
        "Eu acompanho o dia da sua equipe antes de desenhar qualquer tela",
        "Você vê o sistema em rascunho e mexe nele antes de virar código",
        "Uma parte pronta por semana, num ambiente de teste só seu",
        "Você define a ordem do que é feito primeiro, e pode mudar",
        "A gente senta com quem vai operar e ajusta até ficar rápido de usar",
        "Treinamento da equipe e manual no fim, sem custo extra",
      ],
      en: [
        "I shadow your team's day before drawing a single screen",
        "You see the system as a sketch and change it before it becomes code",
        "One finished piece per week, on a test environment that's yours alone",
        "You set what gets built first, and you can change your mind",
        "We sit with whoever operates it and tune it until it's fast to use",
        "Team training and a manual at the end, at no extra cost",
      ],
    },
    outcome: {
      pt: "A equipe para de anotar no caderno por fora do sistema, porque a tela finalmente faz sentido para ela.",
      en: "The team stops keeping a paper notebook alongside the system, because the screen finally makes sense to them.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Diferenciais do contrato mensal                                    */
/* ------------------------------------------------------------------ */

export const contractPerks = {
  pt: [
    ["Sem fila", "Demanda entra na semana, não em três semanas de espera."],
    ["Sem orçar item a item", "Tudo dentro das horas mensais, sem aprovação a cada pedido."],
    ["Horas acumulam", "O que não for usado acumula até 50% para o mês seguinte."],
    ["Prioridade sua", "A ordem de entrega é definida por você e pode mudar sem custo."],
    ["Nota fiscal", "NFS-e mensal — fornecedor que o seu financeiro consegue cadastrar."],
    ["Garantia", "90 dias de garantia técnica sobre tudo que estava no escopo."],
  ],
  en: [
    ["No queue", "Work starts this week, not after a three-week backlog."],
    ["No per-item quoting", "Everything inside the monthly hours, no approval per request."],
    ["Hours roll over", "Unused hours carry up to 50% into the following month."],
    ["Your priority", "You set the delivery order and can change it at no cost."],
    ["Formal invoicing", "Monthly service invoice — a vendor your finance team can onboard."],
    ["Warranty", "90 days of technical warranty on everything in scope."],
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Formas de contratar                                                */
/*  O contrato mensal é UM dos modelos — foi o que fechou com a        */
/*  FUJIARTE, não é a única maneira de trabalhar comigo.               */
/* ------------------------------------------------------------------ */

export type HiringModel = {
  id: string;
  name: { pt: string; en: string };
  who: { pt: string; en: string };
  how: { pt: string; en: string };
  terms: { pt: string[]; en: string[] };
};

export const hiringModels: HiringModel[] = [
  {
    id: "projeto",
    name: { pt: "Projeto fechado", en: "Fixed-scope project" },
    who: {
      pt: "Você sabe o que quer e quer saber quanto custa antes de começar.",
      en: "You know what you want and want the price before anything starts.",
    },
    how: {
      pt: "Eu levanto o processo, escrevo o escopo e fecho um preço. O que entra e o que não entra fica no papel, com marcos de validação e data de entrega.",
      en: "I map the process, write the scope and fix a price. What's in and what's out goes on paper, with validation milestones and a delivery date.",
    },
    terms: {
      pt: ["Preço fechado, sem surpresa", "Pagamento por marco entregue", "90 dias de garantia", "Treinamento e termo de aceite no fim"],
      en: ["Fixed price, no surprises", "Payment per delivered milestone", "90-day warranty", "Training and sign-off at the end"],
    },
  },
  {
    id: "avulso",
    name: { pt: "Sob demanda", en: "On demand" },
    who: {
      pt: "Você já tem sistema e site, e precisa de uma coisa pontual.",
      en: "You already have a system and a site, and need one specific thing.",
    },
    how: {
      pt: "Ajuste de tela, relatório novo, integração, correção de bug, documento exportável. Você pede, eu orço por item e entrego. Sem vínculo e sem mensalidade.",
      en: "A screen tweak, a new report, an integration, a bug fix, an exportable document. You ask, I quote per item and deliver. No tie-in, no monthly fee.",
    },
    terms: {
      pt: ["Orçamento por item, aprovado antes", "50% na aprovação e 50% na entrega", "Garantia de 30 dias", "Entra na fila conforme a agenda"],
      en: ["Per-item quote, approved upfront", "50% on approval, 50% on delivery", "30-day warranty", "Scheduled according to availability"],
    },
  },
  {
    id: "mensal",
    name: { pt: "Contrato mensal", en: "Monthly retainer" },
    who: {
      pt: "A demanda é constante e você cansou de orçar cada pedido.",
      en: "The demand is constant and you're tired of quoting every request.",
    },
    how: {
      pt: "Um banco de horas por mês, com responsável fixo. Sistema, site, e-mail e divulgação entram no mesmo contrato, e a ordem de entrega é você quem define. Foi assim que eu fechei com uma agência de recrutamento Brasil–Japão.",
      en: "A monthly bank of hours with a dedicated lead. System, site, email and marketing sit in one contract, and you set the delivery order. This is how I contracted with a Brazil–Japan recruitment agency.",
    },
    terms: {
      pt: ["Sem fila e sem orçar item a item", "Horas não usadas acumulam até 50%", "Presença presencial combinada", "Nota fiscal mensal"],
      en: ["No queue, no per-item quoting", "Unused hours roll over up to 50%", "Scheduled on-site presence", "Monthly invoicing"],
    },
  },
  {
    id: "vaga",
    name: { pt: "Alocação — CLT ou PJ", en: "Full-time — employee or contractor" },
    who: {
      pt: "Você tem um time e precisa de mais um dev sênior dentro dele.",
      en: "You have a team and need one more senior dev inside it.",
    },
    how: {
      pt: "Entro no seu time, na sua cerimônia e no seu board. Fullstack, remoto no Brasil ou internacional. Falo inglês e já trabalhei com cliente japonês.",
      en: "I join your team, your ceremonies and your board. Fullstack, remote in Brazil or internationally. I speak English and have worked with Japanese clients.",
    },
    terms: {
      pt: ["Disponível para CLT ou PJ", "Remoto ou híbrido em São Paulo", "Currículo e histórico completo em /sobre", "Referência técnica sob solicitação"],
      en: ["Available as employee or contractor", "Remote or hybrid in São Paulo", "Full CV and history on the about page", "Technical references on request"],
    },
  },
];
