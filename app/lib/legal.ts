import { COMPANY } from "./site";

/**
 * Documentos legais públicos da Maldivas Tech (site + produtos, incluindo a
 * plataforma Atol Connect sobre a WhatsApp Business Platform).
 *
 * Estas URLs são informadas à Meta (App Settings → Basic e verificação do
 * negócio). Não renomeie os slugs sem atualizar o painel da Meta:
 *   /pt|en/privacidade · /pt|en/termos · /pt|en/exclusao-de-dados
 */

export const LEGAL_EMAIL = "suporte@maldivastech.dev";
export const LEGAL_UPDATED = "2026-11-23";

export type LegalSlug = "privacidade" | "termos" | "exclusao-de-dados";

type Section = { h: string; p?: string[]; li?: string[] };
export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: Section[];
};

const company = `${COMPANY.legalName} ("${COMPANY.tradeName}"), CNPJ ${COMPANY.cnpj}, ${COMPANY.street}, ${COMPANY.city}/${COMPANY.region}, CEP ${COMPANY.postalCode}`;
const companyEn = `${COMPANY.legalName} ("${COMPANY.tradeName}"), Brazilian tax ID (CNPJ) ${COMPANY.cnpj}, ${COMPANY.street}, ${COMPANY.city}/${COMPANY.region}, Brazil, ZIP ${COMPANY.postalCode}`;

export const LEGAL: Record<"pt" | "en", Record<LegalSlug, LegalDoc>> = {
  pt: {
    privacidade: {
      title: "Política de Privacidade",
      description:
        "Como a Maldivas Tech coleta, usa, compartilha e protege dados pessoais no site e nos seus produtos, incluindo a plataforma Atol Connect para WhatsApp Business.",
      updated: "Última atualização: 23 de novembro de 2026",
      intro: `Esta política explica como ${company} trata dados pessoais no site maldivastech.dev e nos produtos que desenvolve e opera, incluindo a plataforma Atol Connect, que conecta empresas à WhatsApp Business Platform (Cloud API) da Meta. Seguimos a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD) e as diretrizes de proteção de dados para provedores de tecnologia da Meta.`,
      sections: [
        {
          h: "1. Quem somos e nosso papel",
          p: [
            "Somos controladores dos dados de cadastro, faturamento e uso da conta das empresas que contratam nossos produtos e dos visitantes do site.",
            "Quando uma empresa cliente usa a Atol Connect para conversar com os clientes dela pelo WhatsApp, a empresa cliente é a controladora desses dados e a Maldivas Tech atua como operadora, tratando-os somente para prestar o serviço contratado e conforme as instruções do cliente.",
          ],
        },
        {
          h: "2. Dados que coletamos",
          li: [
            "Cadastro da conta: nome, e-mail, telefone, razão social, CNPJ e dados de faturamento da empresa cliente.",
            "Conexão com a Meta: perfil público básico (public_profile) usado exclusivamente para autenticar o administrador no fluxo oficial Facebook Login for Business (Embedded Signup), além dos identificadores da conta do WhatsApp Business (WABA), do número de telefone, do portfólio empresarial e dos tokens de acesso concedidos.",
            "Mensagens do WhatsApp: número de telefone, nome de perfil e conteúdo das mensagens trocadas entre a empresa cliente e os clientes dela, além dos status de entrega e leitura.",
            "Modelos de mensagem (templates) criados pela empresa cliente.",
            "Dados técnicos: endereço IP, navegador, registros de acesso e de auditoria, e cookies necessários ao funcionamento do site.",
            "Contato: dados que você envia por formulário, e-mail ou WhatsApp.",
          ],
        },
        {
          h: "3. Para que usamos os dados",
          li: [
            "Prestar o serviço: enviar e receber mensagens, gerenciar números e modelos, e entregar eventos (webhooks) aos sistemas da empresa cliente.",
            "Criar e administrar a conta, cobrar os planos contratados e emitir nota fiscal.",
            "Segurança: prevenir fraude e abuso, manter trilha de auditoria e cumprir as políticas da Meta e do WhatsApp.",
            "Suporte e comunicações sobre o serviço.",
            "Cumprir obrigações legais e regulatórias.",
          ],
          p: [
            "Bases legais (LGPD, art. 7º): execução de contrato, cumprimento de obrigação legal, legítimo interesse (segurança e melhoria do serviço) e consentimento quando exigido. Não vendemos dados pessoais, não compartilhamos listas com corretores de dados e jamais usamos o conteúdo das mensagens para publicidade ou treinamento de modelos externos.",
          ],
        },
        {
          h: "4. Com quem compartilhamos e subprocessadores",
          li: [
            "Meta Platforms, Inc. (Estados Unidos / Irlanda — WhatsApp Business Platform): as mensagens e metadados operacionais são transmitidos pela Cloud API oficial da Meta, conforme os termos aceitos pela empresa cliente.",
            "Supabase, Inc. (Estados Unidos, com banco PostgreSQL provisionado na região São Paulo/Brasil): hospedagem do banco de dados multi-tenant com isolamento por linha (RLS) e autenticação.",
            "Vercel Inc. (Estados Unidos, com edge/serverless atendendo o Brasil): hospedagem da aplicação web, rotas de API e processamento de webhooks.",
            "Provedores de pagamento e emissão fiscal no Brasil, apenas com os dados cadastrais estritamente necessários à cobrança.",
            "Autoridades públicas ou judiciais competentes, exclusivamente nos termos rigorosos da Seção 6 abaixo.",
          ],
        },
        {
          h: "5. Transferência internacional",
          p: [
            "Como nossos provedores de nuvem e a própria Meta possuem matriz ou infraestrutura nos Estados Unidos, determinados tratamentos envolvem transferência internacional de dados. Adotamos as salvaguardas do art. 33 da LGPD, incluindo cláusulas contratuais padrão de proteção de dados, criptografia em trânsito (TLS 1.2+) e criptografia em repouso (AES-256-GCM para credenciais e tokens da Meta).",
          ],
        },
        {
          h: "6. Requisições de autoridades públicas e ordens judiciais",
          p: [
            "A Maldivas Tech adota política formal e documentada para tratamento de solicitações de dados feitas por órgãos públicos, autoridades policiais ou judiciais, aplicando cumulativamente quatro práticas obrigatórias:",
          ],
          li: [
            "Revisão estrita de legalidade e competência: toda requisição é analisada formalmente para verificar se emana de autoridade competente, se possui mandado ou ordem judicial válida conforme a legislação brasileira (LGPD e Marco Civil da Internet, Lei 12.965/2014) e se identifica de forma específica o alvo.",
            "Contestação de pedidos ilegais ou abusivos: rejeitamos ou impugnamos formalmente pedidos genéricos, desproporcionais, sem fundamentação legal válida ou que tentem acessar dados em massa.",
            "Minimização estrita de dados: quando houver obrigação legal inafastável por ordem judicial válida, divulgamos estritamente o conjunto mínimo de dados expressamente exigido na decisão, pelo menor período aplicável.",
            "Notificação ao titular/cliente e registro de auditoria: notificamos previamente a empresa cliente afetada antes de qualquer fornecimento, salvo quando expressamente proibido por lei ou ordem judicial sob segredo de justiça, e mantemos registro documental auditável de todas as requisições e respostas.",
          ],
        },
        {
          h: "7. Relatório de transparência",
          p: [
            "Em compromisso com a transparência perante clientes, titulares e parceiros de plataforma: nos últimos 12 meses, a Maldivas Tech recebeu 0 (zero) requisições de autoridades públicas brasileiras ou estrangeiras para fornecimento de dados de usuários ou mensagens da plataforma Atol Connect.",
          ],
        },
        {
          h: "8. Por quanto tempo guardamos",
          li: [
            "Dados da conta: enquanto o contrato estiver ativo e, depois, pelo prazo exigido por lei (fiscal e contábil).",
            "Mensagens e mídias: pelo período configurado pela empresa cliente no plano contratado; quando a conta é encerrada, são excluídas em até 90 dias.",
            "Registros de acesso: no mínimo 6 meses, conforme o Marco Civil da Internet (Lei 12.965/2014).",
          ],
        },
        {
          h: "9. Segurança",
          p: [
            "Os dados de cada empresa cliente são isolados por controle de acesso por linha (Row Level Security) no PostgreSQL. Tokens da Meta e segredos de webhook ficam criptografados com AES-256-GCM e nunca são expostos ao navegador. Usamos HTTPS/HSTS, validação criptográfica HMAC-SHA256 dos webhooks da Meta, chaves de API armazenadas apenas como hash SHA-256 e trilha de auditoria imutável.",
          ],
        },
        {
          h: "10. Seus direitos e exclusão de dados",
          p: [
            "Pelo art. 18 da LGPD, você pode pedir: confirmação do tratamento, acesso, correção, anonimização, portabilidade, exclusão, informação sobre compartilhamento e revogação do consentimento. Escreva para " +
              LEGAL_EMAIL +
              ". Respondemos em até 15 dias.",
            "Se você é cliente final de uma empresa que usa a Atol Connect, o pedido deve ser feito primeiro a essa empresa, que é a controladora; nós a apoiamos tecnicamente no atendimento.",
            "Para instruções detalhadas ou exclusão automática via Meta Callback, consulte nossa página Exclusão de Dados (/pt/exclusao-de-dados).",
          ],
        },
        {
          h: "11. Cookies",
          p: [
            "Usamos cookies necessários ao funcionamento do site (por exemplo, preferência de idioma e sessão autenticada) e, mediante consentimento explícito, cookies de medição agregada. Você pode alterar sua escolha no banner de cookies a qualquer momento.",
          ],
        },
        {
          h: "12. Encarregado (DPO) e contato",
          p: [
            `Encarregado pelo tratamento de dados (DPO): Rafael Paiva Dias da Silva. E-mail: ${LEGAL_EMAIL}. Endereço: ${COMPANY.street}, ${COMPANY.city}/${COMPANY.region}, CEP ${COMPANY.postalCode}.`,
            "Podemos atualizar esta política periodicamente. A data da última versão aparece sempre no topo da página.",
          ],
        },
      ],
    },
    termos: {
      title: "Termos de Uso",
      description:
        "Condições de uso do site e dos produtos da Maldivas Tech, incluindo a plataforma Atol Connect para WhatsApp Business.",
      updated: "Última atualização: 22 de novembro de 2026",
      intro: `Estes termos regem o uso do site maldivastech.dev e dos produtos oferecidos por ${company}, incluindo a Atol Connect. Ao criar uma conta ou usar os serviços, você concorda com estes termos e com a Política de Privacidade.`,
      sections: [
        {
          h: "1. O serviço",
          p: [
            "A Atol Connect é uma plataforma de software que permite a empresas conectar seus números à WhatsApp Business Platform (Cloud API) da Meta para enviar e receber mensagens, gerenciar modelos, atender clientes e integrar sistemas por API e webhooks.",
            "A Atol Connect funciona sobre a API oficial da Meta; o credenciamento da Maldivas Tech como provedora de tecnologia (Tech Provider) da Meta está em andamento. A Meta e o WhatsApp não são parte destes termos e não patrocinam nem endossam a Atol Connect.",
          ],
        },
        {
          h: "2. Conta e cadastro",
          li: [
            "A conta é da empresa cliente, que deve informar dados verdadeiros e mantê-los atualizados.",
            "O cliente é responsável pelos usuários que convida e pela guarda das credenciais e chaves de API.",
            "Para usar o WhatsApp, o cliente conecta a própria conta do WhatsApp Business pelo fluxo oficial da Meta e aceita os termos da Meta.",
          ],
        },
        {
          h: "3. Uso permitido e obrigações do cliente",
          li: [
            "Cumprir a Política de Mensagens do WhatsApp Business, a Política Comercial do WhatsApp e os Termos da Meta.",
            "Obter o consentimento (opt-in) dos destinatários antes de enviar mensagens iniciadas pela empresa e atender pedidos de descadastro (opt-out).",
            "Não enviar spam, conteúdo ilegal, enganoso ou que viole direitos de terceiros, nem usar o serviço para produtos ou atividades proibidos pela Meta.",
            "Cumprir a LGPD como controlador dos dados dos seus próprios clientes.",
          ],
        },
        {
          h: "4. Planos, preços e cobrança da Meta",
          p: [
            "Os planos da Atol Connect cobram o uso da plataforma (números conectados, usuários, volume de API e recursos) conforme a tabela vigente no momento da contratação.",
            "As tarifas de mensagens cobradas pela Meta são pagas pelo cliente diretamente à Meta, pelo método de pagamento cadastrado na conta do WhatsApp Business dele, e não estão incluídas no plano.",
            "Planos são renovados automaticamente até o cancelamento. O cliente pode cancelar a qualquer momento; o acesso segue até o fim do período já pago. Contratações feitas fora do estabelecimento podem ser desistidas em até 7 dias (art. 49 do Código de Defesa do Consumidor), quando aplicável.",
          ],
        },
        {
          h: "5. Disponibilidade",
          p: [
            "Buscamos alta disponibilidade, mas o serviço depende da infraestrutura da Meta e de terceiros. Não respondemos por indisponibilidade, bloqueios, limites ou mudanças de política impostos pela Meta ao número ou à conta do cliente.",
          ],
        },
        {
          h: "6. Suspensão e encerramento",
          p: [
            "Podemos suspender ou encerrar contas que violem estes termos ou as políticas da Meta, que coloquem a plataforma em risco ou que estejam inadimplentes, com aviso prévio sempre que possível. Após o encerramento, os dados seguem o prazo de exclusão da Política de Privacidade.",
          ],
        },
        {
          h: "7. Propriedade intelectual",
          p: [
            "O software, a marca Atol Connect e a marca Maldivas Tech pertencem à Maldivas Tech. O cliente mantém a propriedade dos seus dados e conteúdos. WhatsApp e Meta são marcas da Meta Platforms, Inc.",
          ],
        },
        {
          h: "8. Responsabilidade",
          p: [
            "O cliente responde pelo conteúdo que envia e pelo uso que faz do serviço. Na máxima extensão permitida em lei, a responsabilidade da Maldivas Tech fica limitada ao valor pago pelo cliente nos 12 meses anteriores ao evento, sem prejuízo dos direitos do consumidor.",
          ],
        },
        {
          h: "9. Lei e foro",
          p: [
            "Estes termos seguem as leis do Brasil. Fica eleito o foro da Comarca de São Paulo/SP, ressalvado o foro do domicílio do consumidor.",
            `Dúvidas: ${LEGAL_EMAIL}.`,
          ],
        },
      ],
    },
    "exclusao-de-dados": {
      title: "Exclusão de Dados",
      description:
        "Como pedir a exclusão dos seus dados pessoais na Maldivas Tech e na plataforma Atol Connect (inclusive via callback automático da Meta).",
      updated: "Última atualização: 23 de novembro de 2026",
      intro:
        "Você pode pedir a exclusão dos seus dados pessoais a qualquer momento. Esta página explica os canais manuais e automáticos, inclusive para dados recebidos pela integração com a Meta (WhatsApp Business Platform e Facebook Login for Business).",
      sections: [
        {
          h: "1. Exclusão automática pelo Facebook / Meta (Data Deletion Callback)",
          li: [
            "Se você autorizou o app Atol Connect usando sua conta da Meta/Facebook, pode acessar Configurações e Privacidade → Configurações → Aplicativos e Sites no Facebook, localizar 'Atol Connect' e clicar em 'Remover' marcando a opção de excluir dados.",
            "A Meta acionará automaticamente nosso endpoint assinado (https://connect.maldivastech.dev/api/meta/data-deletion), que registra a solicitação e devolve imediatamente uma URL de acompanhamento (https://connect.maldivastech.dev/exclusao) com código único de protocolo.",
          ],
        },
        {
          h: "2. Exclusão pelo painel ou por e-mail",
          li: [
            "No painel da Atol Connect (https://connect.maldivastech.dev/app/settings), o proprietário da organização pode desconectar números do WhatsApp ou encerrar a conta a qualquer momento.",
            `Você também pode enviar e-mail para ${LEGAL_EMAIL} com o assunto "Exclusão de dados", informando o e-mail da conta, número de WhatsApp ou CNPJ da empresa.`,
            "Podemos solicitar confirmação de titularidade antes da remoção definitiva para proteger sua conta contra pedidos fraudulentos.",
          ],
        },
        {
          h: "3. Se você conversou com uma empresa pelo WhatsApp",
          p: [
            "A empresa com quem você falou é a controladora dos seus dados. Peça a exclusão a ela; nós executamos o pedido dela na plataforma. Se não conseguir contato com a empresa, escreva para nós e encaminharemos o pedido.",
          ],
        },
        {
          h: "4. Prazo e confirmação",
          p: [
            "Tokens da Meta são revogados imediatamente no encerramento ou desconexão. Confirmamos o recebimento em até 2 dias úteis e concluímos a exclusão de dados operacionais em até 15 dias nas solicitações diretas (e em até 90 dias no encerramento contratual de rotina), informando o que foi excluído e o que precisou ser mantido por obrigação legal.",
          ],
        },
      ],
    },
  },
  en: {
    privacidade: {
      title: "Privacy Policy",
      description:
        "How Maldivas Tech collects, uses, shares and protects personal data on its website and products, including the Atol Connect platform for WhatsApp Business.",
      updated: "Last updated: November 23, 2026",
      intro: `This policy explains how ${companyEn} processes personal data on maldivastech.dev and in the products it builds and operates, including Atol Connect, a platform that connects businesses to Meta's WhatsApp Business Platform (Cloud API). We comply with Brazil's General Data Protection Law (Law 13,709/2018, LGPD) and Meta's Tech Provider data protection requirements.`,
      sections: [
        {
          h: "1. Who we are and our role",
          p: [
            "We are the controller of account, billing and usage data of businesses that subscribe to our products, and of website visitors.",
            "When a business customer uses Atol Connect to talk to its own customers on WhatsApp, that business is the controller of that data and Maldivas Tech acts as processor, handling it only to provide the contracted service and under the customer's instructions.",
          ],
        },
        {
          h: "2. Data we collect",
          li: [
            "Account data: name, email, phone, company name, tax ID and billing data of the business customer.",
            "Meta connection: basic public profile (public_profile) used solely to authenticate the business administrator inside Meta's official Facebook Login for Business (Embedded Signup) popup, plus identifiers of the WhatsApp Business Account (WABA), phone number, business portfolio, and granted access tokens.",
            "WhatsApp messages: phone number, profile name and content of messages exchanged between the business customer and its customers, plus delivery and read statuses.",
            "Message templates created by the business customer.",
            "Technical data: IP address, browser, access and audit logs, and cookies required for the website to work.",
            "Contact: data you send via form, email or WhatsApp.",
          ],
        },
        {
          h: "3. How we use data",
          li: [
            "To provide the service: send and receive messages, manage numbers and templates, and deliver events (webhooks) to the customer's systems.",
            "To create and manage accounts, bill subscriptions and issue invoices.",
            "Security: prevent fraud and abuse, keep an audit trail and comply with Meta and WhatsApp policies.",
            "Support and service communications.",
            "To meet legal and regulatory obligations.",
          ],
          p: [
            "Legal bases (LGPD, art. 7): performance of contract, legal obligation, legitimate interest (security and service improvement) and consent where required. We never sell personal data, never share data with data brokers, and never use message content for advertising or external AI training.",
          ],
        },
        {
          h: "4. Subprocessors and data sharing",
          li: [
            "Meta Platforms, Inc. (United States / Ireland — WhatsApp Business Platform): messages and operational metadata are transmitted via Meta's official Cloud API under the terms accepted by the business customer.",
            "Supabase, Inc. (United States, with PostgreSQL database provisioned in São Paulo, Brazil): managed multi-tenant database with Row Level Security (RLS) and authentication.",
            "Vercel Inc. (United States, with global edge/serverless delivery): web application hosting, API routes, and webhook ingestion.",
            "Payment and tax-invoicing providers in Brazil, strictly limited to billing data.",
            "Competent public or judicial authorities, solely under the strict governance in Section 6 below.",
          ],
        },
        {
          h: "5. International transfers",
          p: [
            "Because our cloud subprocessors (Supabase, Inc. and Vercel Inc.) and Meta Platforms, Inc. are headquartered or operate infrastructure in the United States, certain processing involves international data transfers. We apply the safeguards required by art. 33 of the LGPD, including standard contractual clauses, TLS 1.2+ encryption in transit, and AES-256-GCM encryption at rest for Meta access tokens and secrets.",
          ],
        },
        {
          h: "6. Public authority and law enforcement requests",
          p: [
            "Maldivas Tech maintains a formal, documented policy governing any request for user or platform data from government agencies, law enforcement, or judicial authorities, enforcing four mandatory practices:",
          ],
          li: [
            "Strict legality and jurisdiction review: every request is formally reviewed to verify issuing authority competence, valid judicial warrant or statutory subpoena under Brazilian law (LGPD and Marco Civil da Internet, Law 12,965/2014), and narrow specificity.",
            "Challenging unlawful or overbroad requests: we formally object to, challenge, or reject any request that is unlawful, procedurally defective, vague, disproportionate, or seeks bulk access to user data.",
            "Strict data minimization: when legally compelled by a valid, binding court order, we disclose strictly the minimum dataset explicitly covered by that order.",
            "User notification and audit logging: we notify the affected business customer prior to disclosure unless legally prohibited by statute or sealed court order, and we maintain permanent audit records of every request and legal review.",
          ],
        },
        {
          h: "7. Transparency report",
          p: [
            "In line with our commitment to platform transparency: over the past 12 months, Maldivas Tech has received 0 (zero) requests from domestic or foreign public authorities for user data or WhatsApp records on the Atol Connect platform.",
          ],
        },
        {
          h: "8. Retention",
          li: [
            "Account data: while the contract is active and afterwards for the period required by law (tax and accounting).",
            "Messages and media: for the period configured by the business customer in its plan; when the account is closed they are deleted within 90 days.",
            "Access logs: at least 6 months, as required by Brazil's Internet Civil Framework (Law 12,965/2014).",
          ],
        },
        {
          h: "9. Security",
          p: [
            "Each business customer's data is isolated with PostgreSQL Row Level Security (RLS). Meta tokens and webhook secrets are encrypted at rest with AES-256-GCM and never exposed to the browser. We enforce HTTPS/HSTS, HMAC-SHA256 signature validation on Meta webhooks, SHA-256 hashed API keys, role-based access control, and an append-only audit trail.",
          ],
        },
        {
          h: "10. Your rights and data deletion",
          p: [
            "Under art. 18 of the LGPD you may request confirmation of processing, access, correction, anonymization, portability, deletion, information about sharing and withdrawal of consent. Write to " +
              LEGAL_EMAIL +
              ". We reply within 15 days.",
            "If you are an end customer of a business that uses Atol Connect, please contact that business first, as it is the controller; we support it in handling your request.",
            "For manual or automated Meta Data Deletion Callback instructions, see our Data Deletion page (/en/exclusao-de-dados).",
          ],
        },
        {
          h: "11. Cookies",
          p: [
            "We use cookies required for the website to work (for example, language preference and authenticated sessions) and, with your consent, aggregate measurement cookies. You can change your choice in the cookie banner at any time.",
          ],
        },
        {
          h: "12. Data Protection Officer and contact",
          p: [
            `Data Protection Officer (DPO): Rafael Paiva Dias da Silva. Email: ${LEGAL_EMAIL}. Address: ${COMPANY.street}, ${COMPANY.city}/${COMPANY.region}, Brazil, ZIP ${COMPANY.postalCode}.`,
            "We may update this policy periodically. The date of the latest version is always shown at the top of the page.",
          ],
        },
      ],
    },
    termos: {
      title: "Terms of Service",
      description:
        "Terms for using the Maldivas Tech website and products, including the Atol Connect platform for WhatsApp Business.",
      updated: "Last updated: November 22, 2026",
      intro: `These terms govern the use of maldivastech.dev and the products offered by ${companyEn}, including Atol Connect. By creating an account or using the services you agree to these terms and to the Privacy Policy.`,
      sections: [
        {
          h: "1. The service",
          p: [
            "Atol Connect is a software platform that lets businesses connect their numbers to Meta's WhatsApp Business Platform (Cloud API) to send and receive messages, manage templates, serve customers and integrate systems via API and webhooks.",
            "Atol Connect runs on Meta's official API; Maldivas Tech's accreditation as a Meta Tech Provider is in progress. Meta and WhatsApp are not parties to these terms and do not sponsor or endorse Atol Connect.",
          ],
        },
        {
          h: "2. Account",
          li: [
            "The account belongs to the business customer, which must provide accurate data and keep it up to date.",
            "The customer is responsible for the users it invites and for safeguarding credentials and API keys.",
            "To use WhatsApp, the customer connects its own WhatsApp Business Account through Meta's official flow and accepts Meta's terms.",
          ],
        },
        {
          h: "3. Acceptable use and customer obligations",
          li: [
            "Comply with the WhatsApp Business Messaging Policy, the WhatsApp Commerce Policy and Meta's Terms.",
            "Obtain recipients' opt-in before sending business-initiated messages and honor opt-out requests.",
            "Do not send spam, illegal, misleading or infringing content, or use the service for products or activities prohibited by Meta.",
            "Comply with the LGPD as controller of its own customers' data.",
          ],
        },
        {
          h: "4. Plans, pricing and Meta charges",
          p: [
            "Atol Connect plans charge for platform usage (connected numbers, users, API volume and features) according to the price list in force at the time of purchase.",
            "Message fees charged by Meta are paid by the customer directly to Meta, using the payment method on its WhatsApp Business Account, and are not included in the plan.",
            "Plans renew automatically until cancelled. The customer may cancel at any time; access continues until the end of the paid period.",
          ],
        },
        {
          h: "5. Availability",
          p: [
            "We aim for high availability, but the service depends on Meta's and third parties' infrastructure. We are not liable for downtime, blocks, limits or policy changes imposed by Meta on the customer's number or account.",
          ],
        },
        {
          h: "6. Suspension and termination",
          p: [
            "We may suspend or terminate accounts that breach these terms or Meta's policies, put the platform at risk or are past due, with prior notice whenever possible. After termination, data follows the deletion timeline in the Privacy Policy.",
          ],
        },
        {
          h: "7. Intellectual property",
          p: [
            "The software and the Atol Connect and Maldivas Tech brands belong to Maldivas Tech. The customer keeps ownership of its data and content. WhatsApp and Meta are trademarks of Meta Platforms, Inc.",
          ],
        },
        {
          h: "8. Liability",
          p: [
            "The customer is responsible for the content it sends and for its use of the service. To the maximum extent permitted by law, Maldivas Tech's liability is limited to the amount paid by the customer in the 12 months before the event.",
          ],
        },
        {
          h: "9. Governing law",
          p: [
            "These terms are governed by the laws of Brazil, with venue in São Paulo/SP, except where consumer law provides otherwise.",
            `Questions: ${LEGAL_EMAIL}.`,
          ],
        },
      ],
    },
    "exclusao-de-dados": {
      title: "Data Deletion",
      description:
        "How to request deletion of your personal data at Maldivas Tech and on the Atol Connect platform (including automated Meta Data Deletion Callback).",
      updated: "Last updated: November 23, 2026",
      intro:
        "You can request deletion of your personal data at any time. This page explains manual and automated channels, including data received through our Meta integration (WhatsApp Business Platform and Facebook Login for Business).",
      sections: [
        {
          h: "1. Automated deletion via Facebook / Meta (Data Deletion Callback)",
          li: [
            "If you authorized Atol Connect with your Meta/Facebook account, go to Facebook Settings & Privacy → Settings → Apps and Websites, locate 'Atol Connect', click 'Remove', and choose to delete associated data.",
            "Meta automatically calls our signed Data Deletion Callback endpoint (https://connect.maldivastech.dev/api/meta/data-deletion), which logs your request and returns a status URL (https://connect.maldivastech.dev/exclusao) along with a unique confirmation code.",
          ],
        },
        {
          h: "2. Deletion via dashboard or email",
          li: [
            "In the Atol Connect dashboard (https://connect.maldivastech.dev/app/settings), the organization owner can disconnect WhatsApp numbers or close the account at any time.",
            `You may also email ${LEGAL_EMAIL} with the subject "Data deletion", including your account email, WhatsApp number, or company tax ID.`,
            "We may ask for ownership verification before permanent deletion to protect accounts against fraudulent requests.",
          ],
        },
        {
          h: "3. If you chatted with a business on WhatsApp",
          p: [
            "The business you talked to is the controller of your data. Ask it for deletion; we carry out its request on the platform. If you cannot reach the business, write to us and we will forward your request.",
          ],
        },
        {
          h: "4. Timeline and confirmation",
          p: [
            "Meta access tokens are revoked immediately upon disconnection or account closure. We acknowledge receipt within 2 business days and complete deletion of operational data within 15 days for direct requests (and within 90 days on routine account closure), keeping only records required by law (tax, accounting, and statutory access logs).",
          ],
        },
      ],
    },
  },
};
