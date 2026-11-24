/* ------------------------------------------------------------------ */
/*  Atol Connect — ideias de negócio por nicho + regras de negócio     */
/*  Fonte única das páginas /whatsapp-api e /whatsapp-api/[nicho].     */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";

type Bi = { pt: string; en: string };

/** Tarifas da Meta (BR, por mensagem entregue, referência nov/2026). Pagas direto à Meta, sem markup. */
export const META_RATES = { marketing: 0.3217, utility: 0.035, authentication: 0.035, serviceFreePerMonth: 1000 } as const;

export type NicheFlow = {
  name: Bi;
  /** evento do sistema do cliente que dispara a mensagem */
  trigger: Bi;
  category: "utility" | "marketing" | "authentication" | "service";
  /** regra de negócio que torna o fluxo seguro e rentável */
  rule: Bi;
};

export type Niche = {
  slug: string;
  emoji: string;
  name: Bi;
  /** frase de busca real do nicho */
  seoTitle: Bi;
  pitch: Bi;
  pain: Bi;
  flows: NicheFlow[];
  /** regras de negócio do nicho (o que o sistema deve garantir) */
  rules: Bi[];
  /** quanto custa de tarifa Meta num cenário típico */
  scenario: { volume: number; category: "utility" | "marketing"; label: Bi };
  /** exemplo de payload que o ERP/PDV do cliente envia */
  api: { event: string; body: string };
  /** quem integra: tipo de software que o parceiro vende */
  partnerAngle: Bi;
};

export const NICHES: Niche[] = [
  {
    slug: "restaurantes-delivery",
    emoji: "🍽️",
    name: { pt: "Restaurantes e delivery", en: "Restaurants & delivery" },
    seoTitle: { pt: "WhatsApp API oficial para restaurantes e delivery", en: "Official WhatsApp API for restaurants & delivery" },
    pitch: {
      pt: "Pedido confirmado, saiu para entrega e pesquisa de satisfação sem o atendente digitar nada, direto do sistema de pedidos.",
      en: "Order confirmed, out for delivery and satisfaction survey with no typing, straight from the order system.",
    },
    pain: {
      pt: "Cliente liga ou chama no WhatsApp perguntando 'cadê meu pedido?'. Cada pergunta ocupa o atendente na hora de pico.",
      en: "Customers message 'where is my order?' at peak time and tie up the staff.",
    },
    flows: [
      { name: { pt: "Pedido confirmado", en: "Order confirmed" }, trigger: { pt: "Pedido aceito no PDV/KDS", en: "Order accepted in POS/KDS" }, category: "utility", rule: { pt: "Enviar só para quem fez o pedido; uma mensagem por mudança de status.", en: "Only to the buyer; one message per status change." } },
      { name: { pt: "Saiu para entrega", en: "Out for delivery" }, trigger: { pt: "Motoboy atribuído", en: "Courier assigned" }, category: "utility", rule: { pt: "Incluir nome do entregador e previsão; nunca expor telefone pessoal dele.", en: "Include courier name and ETA; never expose their personal phone." } },
      { name: { pt: "Recompra em dias fracos", en: "Slow-day reorder nudge" }, trigger: { pt: "Cliente sem pedido há 21 dias", en: "No order in 21 days" }, category: "marketing", rule: { pt: "Só com opt-in registrado; limite de 1 campanha por cliente a cada 15 dias.", en: "Opt-in required; max 1 campaign per customer every 15 days." } },
    ],
    rules: [
      { pt: "Dentro de 24h da última mensagem do cliente, a conversa é livre (sem template).", en: "Within 24h of the customer's last message the chat is free-form (no template)." },
      { pt: "Fora da janela, só template aprovado; status de pedido entra como utilidade (tarifa baixa).", en: "Outside the window only approved templates; order status is utility (low rate)." },
      { pt: "Pedido cancelado interrompe qualquer fluxo pendente daquele pedido.", en: "A canceled order stops any pending flow for it." },
    ],
    scenario: { volume: 3000, category: "utility", label: { pt: "3.000 atualizações de pedido/mês", en: "3,000 order updates/month" } },
    api: { event: "order.status_changed", body: `{\n  "to": "5511999990000",\n  "type": "template",\n  "template": { "name": "pedido_confirmado", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Maria" }, { "type": "text", "text": "#1042" } ] }] }\n}` },
    partnerAngle: { pt: "Software de pedidos, KDS e cardápio digital.", en: "Ordering, KDS and digital-menu software." },
  },
  {
    slug: "varejo-mercadinho",
    emoji: "🛒",
    name: { pt: "Varejo e mercadinhos", en: "Retail & grocery" },
    seoTitle: { pt: "WhatsApp API oficial para varejo e mercadinho", en: "Official WhatsApp API for retail & grocery" },
    pitch: {
      pt: "Cupom, ofertas da semana e aviso de produto em falta que voltou, ligados ao cadastro de clientes do PDV.",
      en: "Receipts, weekly offers and back-in-stock alerts tied to the POS customer base.",
    },
    pain: { pt: "Promoção por grupo de WhatsApp pessoal gera bloqueio de número e não tem métrica.", en: "Promos via personal WhatsApp groups risk bans and have no metrics." },
    flows: [
      { name: { pt: "Cupom fiscal digital", en: "Digital receipt" }, trigger: { pt: "Venda finalizada com CPF", en: "Sale closed with customer ID" }, category: "utility", rule: { pt: "Só com consentimento no cadastro; link do cupom expira em 30 dias.", en: "Consent required; receipt link expires in 30 days." } },
      { name: { pt: "Oferta da semana", en: "Weekly offer" }, trigger: { pt: "Segunda-feira, segmento RFM ativo", en: "Monday, active RFM segment" }, category: "marketing", rule: { pt: "Segmentar por compra recente; descadastro com resposta SAIR respeitado na hora.", en: "Segment by recent purchase; honor STOP replies instantly." } },
      { name: { pt: "Produto voltou ao estoque", en: "Back in stock" }, trigger: { pt: "Entrada de XML do fornecedor", en: "Supplier XML intake" }, category: "marketing", rule: { pt: "Avisar apenas quem pediu o aviso daquele item.", en: "Notify only those who asked for that item." } },
    ],
    rules: [
      { pt: "Opt-in com data, origem e texto aceito fica na trilha de auditoria (LGPD).", en: "Opt-in with date, source and accepted text is kept in the audit trail." },
      { pt: "Marketing tem teto mensal por cliente para proteger a qualidade do número.", en: "Marketing is capped per customer per month to protect number quality." },
      { pt: "Qualidade 'baixa' da Meta pausa campanhas automaticamente.", en: "A 'low' quality rating from Meta auto-pauses campaigns." },
    ],
    scenario: { volume: 2000, category: "marketing", label: { pt: "2.000 ofertas/mês", en: "2,000 offers/month" } },
    api: { event: "sale.closed", body: `{\n  "to": "5511988880000",\n  "type": "template",\n  "template": { "name": "cupom_digital", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "R$ 87,40" } ] }] }\n}` },
    partnerAngle: { pt: "ERPs e PDVs fiscais para varejo.", en: "Retail ERP and fiscal POS vendors." },
  },
  {
    slug: "clinicas-consultorios",
    emoji: "🩺",
    name: { pt: "Clínicas e consultórios", en: "Clinics & practices" },
    seoTitle: { pt: "WhatsApp API oficial para clínicas e consultórios", en: "Official WhatsApp API for clinics" },
    pitch: { pt: "Confirmação de consulta com resposta Sim/Não que atualiza a agenda sozinha e reduz faltas.", en: "Appointment confirmation with Yes/No replies that update the calendar and cut no-shows." },
    pain: { pt: "Faltas de 15 a 30% deixam horário vazio; a recepção gasta o dia ligando.", en: "15–30% no-shows leave empty slots; reception spends the day calling." },
    flows: [
      { name: { pt: "Confirmação D-1", en: "D-1 confirmation" }, trigger: { pt: "24h antes da consulta", en: "24h before appointment" }, category: "utility", rule: { pt: "Resposta 'Não' libera o horário e oferece reagendar.", en: "A 'No' frees the slot and offers rescheduling." } },
      { name: { pt: "Lembrete de retorno", en: "Return reminder" }, trigger: { pt: "Prazo clínico vencendo", en: "Clinical follow-up due" }, category: "utility", rule: { pt: "Sem dado clínico no texto; apenas data, unidade e link.", en: "No clinical data in text; only date, unit and link." } },
      { name: { pt: "Resultado disponível", en: "Results ready" }, trigger: { pt: "Laudo liberado", en: "Report released" }, category: "utility", rule: { pt: "Enviar link autenticado, nunca o laudo no corpo da mensagem.", en: "Send an authenticated link, never the report in the message body." } },
    ],
    rules: [
      { pt: "Dado de saúde é sensível na LGPD: mensagem leva só o mínimo e o resto fica atrás de login.", en: "Health data is sensitive under LGPD: messages carry the minimum, the rest sits behind login." },
      { pt: "Cada confirmação gera evento no webhook para o sistema da agenda.", en: "Each confirmation emits a webhook event for the scheduling system." },
    ],
    scenario: { volume: 1500, category: "utility", label: { pt: "1.500 lembretes/mês", en: "1,500 reminders/month" } },
    api: { event: "appointment.reminder", body: `{\n  "to": "5511977770000",\n  "type": "template",\n  "template": { "name": "confirmacao_consulta", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Ana" }, { "type": "text", "text": "12/12 às 14h" } ] }] }\n}` },
    partnerAngle: { pt: "Prontuário e agenda para clínicas.", en: "EHR and scheduling vendors." },
  },
  {
    slug: "ecommerce-lojas-virtuais",
    emoji: "📦",
    name: { pt: "E-commerce e lojas virtuais", en: "E-commerce" },
    seoTitle: { pt: "WhatsApp API oficial para e-commerce", en: "Official WhatsApp API for e-commerce" },
    pitch: { pt: "Recuperação de carrinho, PIX pendente e rastreio, com atendimento humano na mesma conversa.", en: "Cart recovery, pending PIX and tracking, with human support in the same thread." },
    pain: { pt: "PIX gerado e não pago e carrinho abandonado são venda perdida que um lembrete recupera.", en: "Unpaid PIX and abandoned carts are lost sales a reminder recovers." },
    flows: [
      { name: { pt: "PIX pendente", en: "Pending PIX" }, trigger: { pt: "PIX gerado há 30 min sem pagar", en: "PIX unpaid after 30 min" }, category: "utility", rule: { pt: "Parar o fluxo no instante do pagamento; nunca cobrar duas vezes.", en: "Stop the flow the moment payment lands; never double-charge." } },
      { name: { pt: "Carrinho abandonado", en: "Abandoned cart" }, trigger: { pt: "Carrinho parado há 2h", en: "Cart idle for 2h" }, category: "marketing", rule: { pt: "Máximo de 2 lembretes por carrinho; só com opt-in.", en: "Max 2 reminders per cart; opt-in only." } },
      { name: { pt: "Código de rastreio", en: "Tracking code" }, trigger: { pt: "Pedido postado", en: "Order shipped" }, category: "utility", rule: { pt: "Um aviso por etapa relevante, sem repetir status.", en: "One notice per meaningful step, no repeated statuses." } },
    ],
    rules: [
      { pt: "Pós-venda é utilidade (barato); promoção é marketing (cobrado como tal), o sistema separa as duas.", en: "After-sales is utility (cheap); promos are marketing; the system keeps them separate." },
      { pt: "Cliente que responde reabre janela de 24h para atendimento humano grátis.", en: "A customer reply reopens a 24h window for free human support." },
    ],
    scenario: { volume: 5000, category: "utility", label: { pt: "5.000 avisos de pedido/mês", en: "5,000 order notices/month" } },
    api: { event: "payment.pending", body: `{\n  "to": "5511966660000",\n  "type": "template",\n  "template": { "name": "pix_pendente", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Carlos" }, { "type": "text", "text": "R$ 249,00" } ] }] }\n}` },
    partnerAngle: { pt: "Plataformas de loja virtual e checkout.", en: "Storefront and checkout platforms." },
  },
  {
    slug: "imobiliarias",
    emoji: "🏠",
    name: { pt: "Imobiliárias e corretores", en: "Real estate" },
    seoTitle: { pt: "WhatsApp API oficial para imobiliárias", en: "Official WhatsApp API for real estate" },
    pitch: { pt: "Lead do portal responde em segundos e cai na fila do corretor certo, com histórico no CRM.", en: "Portal leads get an instant reply and land in the right agent's queue with CRM history." },
    pain: { pt: "Lead que espera 10 minutos esfria; cada corretor usa o próprio número e a imobiliária perde o histórico.", en: "Leads waiting 10 minutes go cold; agents use personal numbers and the agency loses history." },
    flows: [
      { name: { pt: "Resposta instantânea ao lead", en: "Instant lead reply" }, trigger: { pt: "Lead chega do portal", en: "Lead arrives from portal" }, category: "utility", rule: { pt: "Distribuir por rodízio e região; sem resposta em 5 min, passa ao próximo.", en: "Round-robin by region; no reply in 5 min passes to the next." } },
      { name: { pt: "Confirmação de visita", en: "Visit confirmation" }, trigger: { pt: "Visita agendada", en: "Visit scheduled" }, category: "utility", rule: { pt: "Lembrete D-1 e 2h antes, com endereço e contato.", en: "D-1 and 2h-before reminders with address and contact." } },
      { name: { pt: "Novo imóvel no perfil", en: "New listing match" }, trigger: { pt: "Imóvel cadastrado combina com busca", en: "New listing matches a saved search" }, category: "marketing", rule: { pt: "Limite de 2 por semana por lead.", en: "Max 2 per week per lead." } },
    ],
    rules: [
      { pt: "Conversa pertence à imobiliária, não ao corretor: sai o corretor, o histórico fica.", en: "The conversation belongs to the agency, not the agent: history stays when an agent leaves." },
      { pt: "Transferência entre corretores registrada em auditoria.", en: "Agent-to-agent transfers are audited." },
    ],
    scenario: { volume: 1200, category: "utility", label: { pt: "1.200 respostas e lembretes/mês", en: "1,200 replies and reminders/month" } },
    api: { event: "lead.created", body: `{\n  "to": "5511955550000",\n  "type": "template",\n  "template": { "name": "boas_vindas_lead", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Julia" }, { "type": "text", "text": "Apto 2 dorm. Pinheiros" } ] }] }\n}` },
    partnerAngle: { pt: "CRMs e sites para imobiliárias.", en: "Real-estate CRMs and sites." },
  },
  {
    slug: "educacao-cursos",
    emoji: "🎓",
    name: { pt: "Educação e cursos", en: "Education & courses" },
    seoTitle: { pt: "WhatsApp API oficial para escolas e cursos", en: "Official WhatsApp API for schools & courses" },
    pitch: { pt: "Matrícula, boleto/PIX da mensalidade e aviso de aula, sem planilha de cobrança.", en: "Enrollment, tuition PIX and class notices with no billing spreadsheets." },
    pain: { pt: "Inadimplência cresce quando a cobrança depende de alguém lembrar de mandar mensagem.", en: "Delinquency grows when collection depends on someone remembering to message." },
    flows: [
      { name: { pt: "Cobrança D-3 / D0", en: "Billing D-3 / D0" }, trigger: { pt: "Mensalidade a vencer", en: "Tuition due soon" }, category: "utility", rule: { pt: "Parar ao receber a baixa; tom cordial, nunca ameaçador.", en: "Stop on payment; courteous tone, never threatening." } },
      { name: { pt: "Aula começa em 1h", en: "Class starts in 1h" }, trigger: { pt: "Aula agendada", en: "Class scheduled" }, category: "utility", rule: { pt: "Link da sala no corpo; um por aula.", en: "Room link in body; one per class." } },
      { name: { pt: "Reengajamento", en: "Re-engagement" }, trigger: { pt: "Aluno inativo há 14 dias", en: "Student inactive 14 days" }, category: "marketing", rule: { pt: "Máximo de 1 por quinzena; opt-in.", en: "Max 1 per fortnight; opt-in." } },
    ],
    rules: [
      { pt: "Menor de idade: o contato é do responsável legal, registrado como tal.", en: "Minors: the contact is the legal guardian, recorded as such." },
      { pt: "Mensagem de cobrança segue o CDC: sem exposição pública do devedor.", en: "Collection messages follow consumer law: no public shaming." },
    ],
    scenario: { volume: 2500, category: "utility", label: { pt: "2.500 avisos/mês", en: "2,500 notices/month" } },
    api: { event: "invoice.due_soon", body: `{\n  "to": "5511944440000",\n  "type": "template",\n  "template": { "name": "mensalidade_a_vencer", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Pedro" }, { "type": "text", "text": "10/12" } ] }] }\n}` },
    partnerAngle: { pt: "Sistemas de gestão escolar e LMS.", en: "School management and LMS vendors." },
  },
  {
    slug: "oficinas-servicos",
    emoji: "🔧",
    name: { pt: "Oficinas e serviços locais", en: "Auto shops & local services" },
    seoTitle: { pt: "WhatsApp API oficial para oficinas e prestadores de serviço", en: "Official WhatsApp API for auto shops & services" },
    pitch: { pt: "Orçamento aprovado pelo WhatsApp, aviso de carro pronto e lembrete de revisão.", en: "WhatsApp-approved quotes, car-ready alerts and service reminders." },
    pain: { pt: "Orçamento por telefone some; cliente 'esquece' a revisão e a receita recorrente se perde.", en: "Phone quotes vanish; customers forget services and recurring revenue leaks." },
    flows: [
      { name: { pt: "Orçamento para aprovação", en: "Quote for approval" }, trigger: { pt: "Orçamento emitido", en: "Quote issued" }, category: "utility", rule: { pt: "Aprovação registrada com data e hora vira prova do serviço autorizado.", en: "Timestamped approval is proof of authorized work." } },
      { name: { pt: "Veículo pronto", en: "Vehicle ready" }, trigger: { pt: "OS encerrada", en: "Work order closed" }, category: "utility", rule: { pt: "Enviar horário de retirada e valor final.", en: "Include pickup hours and final amount." } },
      { name: { pt: "Revisão a cada 6 meses", en: "6-month service reminder" }, trigger: { pt: "Data da última OS + 180 dias", en: "Last order + 180 days" }, category: "marketing", rule: { pt: "Um lembrete por ciclo; descadastro respeitado.", en: "One reminder per cycle; opt-out honored." } },
    ],
    rules: [
      { pt: "Foto do problema enviada pelo cliente fica anexada à OS.", en: "Customer-sent photos are attached to the work order." },
      { pt: "Aprovação por mensagem exige resposta explícita (SIM), nunca silêncio.", en: "Approval requires an explicit reply (YES), never silence." },
    ],
    scenario: { volume: 800, category: "utility", label: { pt: "800 avisos/mês", en: "800 notices/month" } },
    api: { event: "workorder.closed", body: `{\n  "to": "5511933330000",\n  "type": "template",\n  "template": { "name": "veiculo_pronto", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "Roberto" }, { "type": "text", "text": "ABC1D23" } ] }] }\n}` },
    partnerAngle: { pt: "Sistemas de OS e gestão de oficinas.", en: "Work-order systems for shops." },
  },
  {
    slug: "contabilidade-escritorios",
    emoji: "📑",
    name: { pt: "Contabilidade e escritórios", en: "Accounting & professional offices" },
    seoTitle: { pt: "WhatsApp API oficial para escritórios contábeis", en: "Official WhatsApp API for accounting firms" },
    pitch: { pt: "Guias e prazos (DAS, DARF, folha) avisados ao cliente, com cobrança de documentos pendentes.", en: "Tax-slip deadlines and pending-document requests sent to clients automatically." },
    pain: { pt: "A equipe passa o mês cobrando documento por WhatsApp pessoal, sem controle de quem respondeu.", en: "Staff chase documents from personal phones with no tracking." },
    flows: [
      { name: { pt: "Guia disponível", en: "Tax slip available" }, trigger: { pt: "Guia gerada no sistema", en: "Slip generated" }, category: "utility", rule: { pt: "Link seguro com validade; nada de PDF no corpo.", en: "Secure expiring link; no PDF in the body." } },
      { name: { pt: "Documento pendente", en: "Missing document" }, trigger: { pt: "Fechamento em 3 dias sem extrato", en: "Close in 3 days, statement missing" }, category: "utility", rule: { pt: "Escalonar para o contador responsável após 2 avisos.", en: "Escalate to the accountant after 2 reminders." } },
      { name: { pt: "Aviso de prazo legal", en: "Legal deadline notice" }, trigger: { pt: "Calendário fiscal", en: "Tax calendar" }, category: "utility", rule: { pt: "Um aviso D-5 e outro D-1.", en: "One at D-5 and one at D-1." } },
    ],
    rules: [
      { pt: "Dados fiscais ficam atrás de login; a mensagem só leva o aviso e o link.", en: "Fiscal data stays behind login; the message only carries the notice and link." },
      { pt: "Cada cliente atendido por uma carteira de contadores, com fila e SLA.", en: "Each client is handled by an accountant portfolio with queue and SLA." },
    ],
    scenario: { volume: 1000, category: "utility", label: { pt: "1.000 avisos/mês", en: "1,000 notices/month" } },
    api: { event: "tax_slip.generated", body: `{\n  "to": "5511922220000",\n  "type": "template",\n  "template": { "name": "guia_disponivel", "language": "pt_BR",\n    "components": [{ "type": "body", "parameters": [\n      { "type": "text", "text": "DAS" }, { "type": "text", "text": "20/12" } ] }] }\n}` },
    partnerAngle: { pt: "Softwares contábeis e de gestão fiscal.", en: "Accounting and fiscal software." },
  },
];

export const nicheBySlug = (slug: string) => NICHES.find((n) => n.slug === slug);

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Tarifa Meta estimada para o cenário do nicho. */
export function scenarioCost(n: Niche): number {
  return n.scenario.volume * META_RATES[n.scenario.category];
}

export const CONNECT_URL = "https://connect.maldivastech.dev";
/** Link único de cadastro (Google ou e-mail), com origem rastreável. */
export const signupUrl = (src: string, plan?: string) =>
  `${CONNECT_URL}/login?mode=signup${plan ? `&plan=${plan}` : ""}&utm_source=maldivastech&utm_medium=portal&utm_campaign=${encodeURIComponent(src)}`;

export const L = (v: Bi, lang: Lang) => v[lang];
