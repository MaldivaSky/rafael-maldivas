/* ------------------------------------------------------------------ */
/*  Utilitários dev da WhatsApp Cloud API (/ferramentas, grupo         */
/*  "whatsapp"). Tráfego técnico de fundo de funil para o Atol Connect. */
/* ------------------------------------------------------------------ */

import type { Tool } from "./tools";

export const whatsappDevTools: Tool[] = [
  {
    slug: "analisador-template-whatsapp-utilidade-marketing",
    key: "waTemplate",
    group: "whatsapp",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Analisador de template Meta: utilidade ou marketing?",
        seoTitle: "Analisador de template WhatsApp: utilidade x marketing | grátis",
        h1: "Seu template vai ser cobrado como utilidade ou marketing?",
        description:
          "Cole o texto do template e veja os gatilhos promocionais que fazem a Meta reclassificar de utilidade (R$ 0,035) para marketing (R$ 0,3217), com sugestão de reescrita neutra.",
        keywords: ["template utilidade whatsapp", "template marketing whatsapp", "reclassificação template meta", "categoria template whatsapp api", "custo template whatsapp"],
        faq: [
          ["Por que a Meta reclassifica um template de utilidade?", "Porque utilidade é para informar sobre uma transação ou conta existente. Se o texto tem oferta, desconto, urgência ou convite para comprar, a Meta trata como marketing — e a tarifa sobe de R$ 0,035 para R$ 0,3217 por mensagem entregue."],
          ["A análise é a mesma da Meta?", "Não. É uma heurística no seu navegador que aponta os gatilhos mais comuns. A decisão final é da revisão da Meta, mas tirar esses gatilhos reduz muito o risco."],
          ["O texto que eu colar sai do meu computador?", "Não. A análise roda 100% no navegador; nada é enviado para servidor."],
        ],
      },
      en: {
        title: "Meta template analyzer: utility or marketing?",
        seoTitle: "WhatsApp template analyzer: utility vs marketing | free",
        h1: "Will your template be billed as utility or marketing?",
        description:
          "Paste a template and see the promotional triggers that make Meta reclassify it from utility (BRL 0.035) to marketing (BRL 0.3217), with a neutral rewrite suggestion.",
        keywords: ["whatsapp utility template", "whatsapp marketing template", "meta template recategorization", "whatsapp template category"],
        faq: [
          ["Why does Meta reclassify a utility template?", "Utility is for informing about an existing transaction or account. Offers, discounts, urgency or calls to buy make Meta treat it as marketing — and the fee jumps from BRL 0.035 to BRL 0.3217 per delivered message."],
          ["Is this Meta's own check?", "No. It's an in-browser heuristic that flags the most common triggers. Meta's review decides, but removing them cuts the risk a lot."],
          ["Does my text leave my computer?", "No. Analysis runs entirely in your browser; nothing is sent to a server."],
        ],
      },
    },
  },
  {
    slug: "validador-assinatura-webhook-hmac-sha256",
    key: "waHmac",
    group: "whatsapp",
    category: "SecurityApplication",
    copy: {
      pt: {
        title: "Validador de assinatura de webhook HMAC-SHA256",
        seoTitle: "Validador HMAC-SHA256 de webhook (Meta e Atol) | no navegador",
        h1: "Validador de assinatura de webhook HMAC-SHA256",
        description:
          "Cole o segredo, o corpo bruto e o header de assinatura e valide o webhook em tempo real com a Web Crypto API. Suporta X-Hub-Signature-256 (Meta) e X-Atol-Signature com timestamp.",
        keywords: ["validar webhook hmac sha256", "x-hub-signature-256", "assinatura webhook whatsapp", "hmac online", "verificar webhook meta"],
        faq: [
          ["Por que minha assinatura nunca bate?", "Quase sempre porque o corpo foi re-serializado. O HMAC é calculado sobre os bytes exatos recebidos: use o corpo bruto (raw body), antes de qualquer JSON.parse."],
          ["Qual a diferença entre o header da Meta e o do Atol?", "A Meta assina só o corpo (X-Hub-Signature-256 = sha256=HMAC(app secret, corpo)). O Atol Connect assina `${timestamp}.${corpo}` e manda o X-Atol-Timestamp para você rejeitar replays com mais de 5 minutos."],
          ["O segredo é enviado para algum lugar?", "Não. O cálculo usa a Web Crypto API do seu navegador. Mesmo assim, prefira testar com um segredo de homologação."],
        ],
      },
      en: {
        title: "HMAC-SHA256 webhook signature validator",
        seoTitle: "HMAC-SHA256 webhook validator (Meta & Atol) | in-browser",
        h1: "HMAC-SHA256 webhook signature validator",
        description:
          "Paste the secret, raw body and signature header to validate a webhook in real time with the Web Crypto API. Supports X-Hub-Signature-256 (Meta) and timestamped X-Atol-Signature.",
        keywords: ["validate webhook hmac sha256", "x-hub-signature-256", "whatsapp webhook signature", "verify meta webhook"],
        faq: [
          ["Why does my signature never match?", "Almost always because the body was re-serialized. HMAC is computed over the exact bytes received: use the raw body, before any JSON.parse."],
          ["How do Meta's and Atol's headers differ?", "Meta signs the body only (X-Hub-Signature-256 = sha256=HMAC(app secret, body)). Atol Connect signs `${timestamp}.${body}` and sends X-Atol-Timestamp so you can reject replays older than 5 minutes."],
          ["Is the secret sent anywhere?", "No. It uses your browser's Web Crypto API. Still, prefer a staging secret."],
        ],
      },
    },
  },
  {
    slug: "checklist-migracao-qr-code-cloud-api",
    key: "waChecklist",
    group: "whatsapp",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Checklist de migração QR Code → Cloud API oficial",
        seoTitle: "Checklist: migrar da Z-API/QR Code para a Cloud API oficial",
        h1: "Checklist de migração do QR Code para a WhatsApp Cloud API oficial",
        description:
          "Lista marcável com o passo a passo para sair da Z-API, Evolution ou outra API por QR Code e ir para a Cloud API da Meta sem perder o número. Progresso salvo no navegador e versão para imprimir/PDF.",
        keywords: ["migrar z-api para cloud api", "checklist migração whatsapp api oficial", "sair do qr code whatsapp", "migrar evolution api"],
        faq: [
          ["Perco o histórico de conversas?", "O histórico do app no celular continua no aparelho. O que muda é que as novas mensagens da API passam a chegar pela Cloud API oficial."],
          ["Preciso de um número novo?", "Não. O mesmo número pode ser conectado à Cloud API; com Coexistência, ele segue funcionando no app WhatsApp Business."],
          ["Meu progresso fica salvo?", "Sim, no próprio navegador (localStorage). Nada é enviado para servidor."],
        ],
      },
      en: {
        title: "Migration checklist: QR code → official Cloud API",
        seoTitle: "Checklist: migrate from Z-API/QR code to the official Cloud API",
        h1: "Migration checklist from QR code to the official WhatsApp Cloud API",
        description:
          "A checkable step-by-step list to leave Z-API, Evolution or any QR-code API for Meta's Cloud API without losing your number. Progress saved in your browser, printable/PDF version.",
        keywords: ["migrate z-api to cloud api", "whatsapp official api migration checklist", "leave qr code whatsapp"],
        faq: [
          ["Do I lose chat history?", "Phone app history stays on the device. New API messages simply start arriving through the official Cloud API."],
          ["Do I need a new number?", "No. The same number can be connected to the Cloud API; with Coexistence it keeps working in the WhatsApp Business app."],
          ["Is my progress saved?", "Yes, in your browser (localStorage). Nothing is sent to a server."],
        ],
      },
    },
  },
];
