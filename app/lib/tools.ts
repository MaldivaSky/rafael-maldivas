/* ------------------------------------------------------------------ */
/*  Registro das ferramentas                                           */
/*                                                                     */
/*  Cada ferramenta é uma PÁGINA, não uma âncora. O Google indexa       */
/*  página: um #ancora dentro de /ferramentas nunca vai ranquear para   */
/*  "calculadora de CMV" ou "consultar CNPJ grátis". Cada slug aqui     */
/*  vira /ferramentas/<slug>, com title, description, H1 e schema       */
/*  próprios, e entra sozinho no sitemap.                              */
/* ------------------------------------------------------------------ */

import type { Lang } from "./seo";
import { growthTools } from "./growth-catalog";

export type ToolGroup = "fiscal" | "margem" | "site" | "operacao";

/** Campos textuais de uma ferramenta em um idioma. */
export type LocalizedText = {
  /** o que a pessoa digita no Google */
  title: string;
  /** <title> da aba, até ~60 caracteres */
  seoTitle: string;
  h1: string;
  /** meta description, 150-160 caracteres */
  description: string;
  keywords: string[];
  /** perguntas que viram FAQPage — é o que ganha rich snippet */
  faq: [string, string][];
};

export type Tool = {
  slug: string;
  /** chave do componente no renderizador */
  key: string;
  group: ToolGroup;
  /** categoria do schema.org */
  category: "BusinessApplication" | "SecurityApplication" | "FinanceApplication";
  /** copy por idioma — pt e en escritas por intenção, não tradução literal */
  copy: Record<Lang, LocalizedText>;
};

export const tools: Tool[] = [
  ...growthTools,
  {
    slug: "calculadora-cmv-preco-de-venda",
    key: "preco",
    group: "margem",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Calculadora de CMV e preço de venda",
        seoTitle: "Calculadora de CMV e preço de venda | grátis, sem cadastro",
        h1: "Calculadora de CMV e preço de venda",
        description:
          "Calcule o CMV e o preço de venda do seu prato ou produto considerando perdas, mão de obra, custo fixo, taxa de cartão ou aplicativo e imposto. Grátis, sem cadastro.",
        keywords: [
          "calculadora de CMV",
          "como calcular preço de venda",
          "CMV restaurante",
          "calcular custo do prato",
          "precificação restaurante",
          "margem de lucro restaurante",
        ],
        faq: [
          [
            "O que é CMV?",
            "CMV é o Custo da Mercadoria Vendida: quanto do preço cobrado foi embora só para repor o que você vendeu. Em restaurante costuma ficar entre 28% e 35%. Acima disso, o prato está barato ou o insumo está caro.",
          ],
          [
            "Como calcular o preço de venda a partir do custo?",
            "Não basta somar uma porcentagem ao custo. Taxa de cartão, imposto e margem incidem sobre o preço final, não sobre o custo. A fórmula correta é preço = custo dividido por (1 menos a soma dessas porcentagens).",
          ],
          [
            "Por que incluir as perdas no cálculo?",
            "Porque você paga pelo insumo inteiro e usa só parte dele. Aparo, casca, osso e quebra saem do seu bolso mesmo sem chegar ao prato, então precisam entrar no custo.",
          ],
        ],
      },
      en: {
        title: "Food cost and selling price calculator",
        seoTitle: "Food cost calculator: price your menu right | free",
        h1: "Food cost and selling price calculator",
        description:
          "Work out food cost and the selling price of a dish or product including waste, labour, fixed cost, card or delivery-app fee and tax. Free, no sign-up.",
        keywords: [
          "food cost calculator",
          "how to price a menu",
          "restaurant food cost percentage",
          "menu pricing calculator",
          "dish costing calculator",
          "restaurant profit margin",
        ],
        faq: [
          [
            "What is food cost?",
            "Food cost is the cost of goods sold: how much of the price you charge goes straight back into replacing what you sold. In restaurants it usually lands between 28% and 35%. Above that, the dish is underpriced or the ingredients are expensive.",
          ],
          [
            "How do I set a selling price from cost?",
            "You cannot just add a percentage on top of cost. Card fees, tax and margin apply to the final price, not to the cost. The correct formula is price = cost divided by (1 minus the sum of those percentages).",
          ],
          [
            "Why factor in waste?",
            "Because you pay for the whole ingredient and use only part of it. Trim, peel, bone and spoilage come out of your pocket even when they never reach the plate, so they belong in the cost.",
          ],
        ],
      },
    },
  },
  {
    slug: "margem-ou-markup",
    key: "markup",
    group: "margem",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Margem ou markup",
        seoTitle: "Margem ou markup: calculadora e a diferença | grátis",
        h1: "Margem × markup: a conta que quase todo mundo erra",
        description:
          "Markup de 30% sobre o custo não dá 30% de margem, dá 23%. Calcule os dois, veja o preço de venda e entenda por que essa diferença some do caixa todo mês.",
        keywords: [
          "diferença entre margem e markup",
          "calculadora de markup",
          "como calcular margem de lucro",
          "markup divisor",
          "formação de preço varejo",
        ],
        faq: [
          [
            "Qual a diferença entre margem e markup?",
            "Markup é calculado sobre o custo; margem é calculada sobre o preço de venda. Um produto de R$ 10 vendido a R$ 13 tem 30% de markup e 23% de margem. É o mesmo preço, lido de duas formas diferentes.",
          ],
          [
            "Por que aplicar 30% no custo não dá 30% de lucro?",
            "Porque a base muda. Os 30% foram calculados sobre R$ 10, mas o lucro de R$ 3 é comparado aos R$ 13 que entraram no caixa. Quem confunde os dois trabalha com menos margem do que pensa.",
          ],
        ],
      },
      en: {
        title: "Margin or markup",
        seoTitle: "Margin vs markup calculator: the real difference | free",
        h1: "Margin vs markup: the sum almost everyone gets wrong",
        description:
          "A 30% markup on cost is not a 30% margin — it is 23%. Calculate both, see the selling price and learn why that gap drains cash every month.",
        keywords: [
          "margin vs markup",
          "markup calculator",
          "how to calculate profit margin",
          "markup vs margin formula",
          "retail pricing calculator",
        ],
        faq: [
          [
            "What is the difference between margin and markup?",
            "Markup is calculated on cost; margin is calculated on the selling price. A product costing $10 sold for $13 has a 30% markup and a 23% margin. Same price, read two different ways.",
          ],
          [
            "Why doesn't a 30% markup on cost give 30% profit?",
            "Because the base changes. The 30% was calculated on $10, but the $3 profit is compared against the $13 that actually hit the till. Confusing the two means working on a smaller margin than you think.",
          ],
        ],
      },
    },
  },
  {
    slug: "ficha-tecnica-fator-de-correcao",
    key: "ficha",
    group: "margem",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Ficha técnica e fator de correção",
        seoTitle: "Fator de correção de alimentos: calculadora | grátis",
        h1: "Ficha técnica: fator de correção e custo por porção",
        description:
          "Você compra 1 kg mas não usa 1 kg. Calcule o fator de correção, o preço real do quilo limpo e o custo por porção do seu prato. Grátis e sem cadastro.",
        keywords: [
          "fator de correção alimentos",
          "ficha técnica de cozinha",
          "custo por porção",
          "rendimento de carne",
          "índice de parte comestível",
        ],
        faq: [
          [
            "O que é fator de correção?",
            "É a razão entre o peso que você comprou e o peso que sobrou depois de limpar. Se 1 kg de carne rende 720 g limpos, o fator é 1,39 — cada quilo aproveitado custa 39% a mais do que a nota diz.",
          ],
          [
            "Qual fator de correção é aceitável?",
            "Depende do insumo. Carne com osso e folhas costumam ficar entre 1,3 e 2,0. Acima de 2,0, mais da metade do que você pagou virou lixo, e vale rever fornecedor, corte ou técnica de limpeza.",
          ],
        ],
      },
      en: {
        title: "Recipe costing and yield factor",
        seoTitle: "Yield factor and recipe costing calculator | free",
        h1: "Recipe sheet: yield factor and cost per portion",
        description:
          "You buy 1 kg but you don't use 1 kg. Calculate the yield factor, the true price per usable kilo and the cost per portion of your dish. Free, no sign-up.",
        keywords: [
          "recipe yield factor",
          "food yield calculator",
          "recipe costing calculator",
          "cost per portion",
          "edible portion yield",
        ],
        faq: [
          [
            "What is a yield factor?",
            "It is the ratio between the weight you bought and the weight left after trimming. If 1 kg of meat yields 720 g trimmed, the factor is 1.39 — every usable kilo costs 39% more than the invoice says.",
          ],
          [
            "What yield factor is acceptable?",
            "It depends on the ingredient. Bone-in meat and leafy greens often sit between 1.3 and 2.0. Above 2.0, more than half of what you paid went in the bin, and it is worth reviewing the supplier, the cut or the trimming method.",
          ],
        ],
      },
    },
  },
  {
    slug: "margem-ifood-99food-delivery",
    key: "delivery",
    group: "margem",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Margem no iFood e no delivery",
        seoTitle: "Quanto sobra de cada pedido no iFood? Calculadora grátis",
        h1: "Simulador de margem por canal de venda",
        description:
          "Compare quanto sobra do mesmo pedido vendido no iFood, no 99Food, no seu canal próprio e no balcão. Veja a diferença por pedido e no fechamento do mês.",
        keywords: [
          "comissão do iFood",
          "quanto o iFood cobra",
          "margem delivery restaurante",
          "vale a pena vender no iFood",
          "canal próprio de delivery",
        ],
        faq: [
          [
            "Quanto o iFood cobra por pedido?",
            "A comissão varia conforme o plano e a modalidade de entrega, normalmente entre 12% e 27% sobre o valor do pedido. A simulação acima deixa esse número editável para você usar o do seu contrato.",
          ],
          [
            "Vale a pena manter canal próprio junto com o aplicativo?",
            "Na maioria dos casos sim. A taxa do canal próprio fica em torno de 1% a 2% do Pix ou cartão, contra mais de 20% do aplicativo. O aplicativo traz cliente novo; o canal próprio é onde a recompra deveria acontecer.",
          ],
        ],
      },
      en: {
        title: "Delivery app margin (iFood and 99Food)",
        seoTitle: "Delivery app margin calculator: what's left per order",
        h1: "Margin simulator by sales channel",
        description:
          "Compare what is left of the same order sold on iFood, 99Food, your own channel and at the counter. See the difference per order and across the month.",
        keywords: [
          "food delivery commission calculator",
          "delivery app margin",
          "restaurant delivery profit",
          "iFood commission",
          "own delivery channel",
        ],
        faq: [
          [
            "How much does a delivery app take per order?",
            "The commission varies with the plan and delivery mode, usually between 12% and 27% of the order value. The simulator above keeps that number editable so you can enter the rate from your own contract.",
          ],
          [
            "Is it worth keeping your own channel alongside the app?",
            "In most cases yes. Own-channel fees sit around 1% to 2% for Pix or card, against more than 20% on the app. The app brings new customers; the own channel is where repeat orders should happen.",
          ],
        ],
      },
    },
  },
  {
    slug: "consultar-cnpj",
    key: "cnpj",
    group: "fiscal",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Consulta de CNPJ",
        seoTitle: "Consultar CNPJ grátis: situação cadastral e sócios",
        h1: "Consulta de CNPJ na Receita Federal",
        description:
          "Consulte CNPJ grátis: razão social, nome fantasia, situação cadastral, data de abertura, CNAE, capital social e quadro societário. Dados públicos da Receita Federal.",
        keywords: [
          "consultar CNPJ",
          "situação cadastral CNPJ",
          "CNPJ grátis",
          "quadro societário",
          "consulta Receita Federal CNPJ",
          "verificar se empresa está ativa",
        ],
        faq: [
          [
            "A consulta de CNPJ é gratuita?",
            "Sim. Os dados vêm da base pública da Receita Federal, sem cadastro e sem custo. Nada do que você digita fica guardado aqui.",
          ],
          [
            "Por que um CNPJ recente não aparece?",
            "A base pública tem um atraso de atualização. Empresas abertas nas últimas semanas às vezes ainda não constam, mesmo estando regulares.",
          ],
        ],
      },
      en: {
        title: "Brazilian company lookup (CNPJ)",
        seoTitle: "Brazil CNPJ lookup: a company's registry status and owners",
        h1: "Brazilian CNPJ lookup on the tax authority registry",
        description:
          "Look up a Brazilian company by CNPJ: legal name, trade name, registry status, founding date, activity code, share capital and owners. Public Brazilian tax-registry data.",
        keywords: [
          "Brazilian CNPJ lookup",
          "check a Brazil company",
          "Brazil company registry status",
          "is this Brazilian company active",
          "Brazil business tax ID",
          "verify Brazilian supplier",
        ],
        faq: [
          [
            "Is the CNPJ lookup free?",
            "Yes. The data comes from the public Brazilian tax-authority (Receita Federal) registry, with no sign-up and no cost. Nothing you type here is stored.",
          ],
          [
            "Why doesn't a newly registered CNPJ show up?",
            "The public registry lags behind. Companies opened in the last few weeks sometimes are not listed yet, even when fully compliant.",
          ],
        ],
      },
    },
  },
  {
    slug: "validar-pix-copia-e-cola",
    key: "pix",
    group: "fiscal",
    category: "FinanceApplication",
    copy: {
      pt: {
        title: "Validador de Pix Copia e Cola",
        seoTitle: "Validar Pix Copia e Cola: leia o código antes de pagar",
        h1: "Leitor e validador de Pix Copia e Cola",
        description:
          "Cole um código Pix e veja para quem vai o dinheiro, o valor, a chave do recebedor e se o CRC16 confere. Descubra se o código foi adulterado antes de pagar.",
        keywords: [
          "validar pix copia e cola",
          "ler código pix",
          "pix br code",
          "CRC16 pix",
          "golpe do pix adulterado",
          "EMV QR Code pix",
        ],
        faq: [
          [
            "Como saber se um código Pix foi adulterado?",
            "Todo código Pix termina com um CRC16 que cobre o conteúdo inteiro. Se alguém trocar a chave ou o valor sem recalcular esse código, a verificação falha. É isso que a ferramenta acima confere.",
          ],
          [
            "Dá para ver quem vai receber antes de pagar?",
            "Sim. O nome do recebedor, a cidade e a chave Pix ficam dentro do próprio código, em texto. A ferramenta separa cada campo para você conferir antes de abrir o aplicativo do banco.",
          ],
        ],
      },
      en: {
        title: "Brazilian Pix copy-and-paste validator",
        seoTitle: "Pix code validator: read a Brazilian Pix before you pay",
        h1: "Brazilian Pix code reader and validator",
        description:
          "Paste a Brazilian Pix code and see who gets the money, the amount, the recipient key and whether the CRC16 checks out. Spot a tampered payment code before you pay.",
        keywords: [
          "Brazilian Pix code validator",
          "read Pix QR code",
          "pix br code",
          "decode pix code",
          "pix EMV QR code",
          "verify payment code",
        ],
        faq: [
          [
            "How do I know a Pix code was tampered with?",
            "Every Pix code ends with a CRC16 that covers the entire payload. If someone swaps the key or the amount without recomputing that checksum, the check fails. That is what the tool above verifies.",
          ],
          [
            "Can I see who will receive the money before paying?",
            "Yes. The recipient name, city and Pix key are stored in plain text inside the code itself. The tool splits out every field so you can check them before opening your banking app.",
          ],
        ],
      },
    },
  },
  {
    slug: "consultar-chave-nfe-nfce",
    key: "nfe",
    group: "fiscal",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Decodificador de chave NF-e e NFC-e",
        seoTitle: "Chave de acesso NF-e: decodificar os 44 dígitos | grátis",
        h1: "Decodificador de chave de acesso NF-e / NFC-e",
        description:
          "Cole os 44 dígitos da chave de acesso e leia UF, CNPJ do emitente, modelo, série, número e o dígito verificador conferido por módulo 11. Grátis e sem cadastro.",
        keywords: [
          "chave de acesso NFe",
          "decodificar chave NFCe",
          "44 dígitos nota fiscal",
          "dígito verificador módulo 11",
          "consultar nota pelo número",
          "estrutura da chave NFe",
        ],
        faq: [
          [
            "O que significam os 44 dígitos da chave de acesso?",
            "Na ordem: código da UF, ano e mês de emissão, CNPJ do emitente, modelo do documento, série, número da nota, tipo de emissão, um código numérico aleatório e o dígito verificador.",
          ],
          [
            "Como sei se a chave está correta?",
            "O último dígito é calculado a partir dos 43 anteriores por módulo 11. Se o cálculo não bater com o dígito informado, a chave foi digitada errado ou foi alterada.",
          ],
        ],
      },
      en: {
        title: "Brazilian invoice key decoder (NF-e / NFC-e)",
        seoTitle: "NF-e access key decoder: 44-digit key explained",
        h1: "Brazilian NF-e / NFC-e access key decoder",
        description:
          "Paste the 44-digit Brazilian invoice access key and read the state code, issuer CNPJ, model, series, number and the module-11 check digit. Free, no sign-up.",
        keywords: [
          "NF-e access key",
          "NFC-e access key decoder",
          "Brazil invoice 44 digit key",
          "module 11 check digit",
          "decode Brazilian invoice key",
          "brazilian electronic invoice key",
        ],
        faq: [
          [
            "What do the 44 digits of the access key mean?",
            "In order: the state code, the issue year and month, the issuer CNPJ, the document model, the series, the invoice number, the emission type, a random numeric code and the check digit.",
          ],
          [
            "How do I know the key is correct?",
            "The last digit is computed from the previous 43 using module 11. If the calculation doesn't match the given digit, the key was mistyped or tampered with.",
          ],
        ],
      },
    },
  },
  {
    slug: "dominio-com-br-disponivel",
    key: "dominio",
    group: "site",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Domínio .com.br disponível",
        seoTitle: "Domínio .com.br está livre? Consulta no registro.br",
        h1: "O domínio da sua empresa está livre?",
        description:
          "Veja em segundos se o domínio .com.br que você quer ainda está disponível para registro. Consulta direta na base do registro.br, grátis e sem cadastro.",
        keywords: [
          "consultar domínio disponível",
          "registro.br disponibilidade",
          "domínio com br livre",
          "verificar domínio",
          "registrar domínio empresa",
        ],
        faq: [
          [
            "Quanto custa registrar um domínio .com.br?",
            "Cerca de R$ 40 por ano no registro.br, que é o órgão oficial. Domínio não se compra uma vez: precisa ser renovado, e se vencer qualquer pessoa pode pegar.",
          ],
          [
            "O domínio que eu quero está ocupado. E agora?",
            "Vale testar variações antes de fechar a identidade visual: acrescentar a cidade, o segmento ou trocar a ordem das palavras. Mudar o nome agora custa muito menos do que reimprimir tudo depois.",
          ],
        ],
      },
      en: {
        title: "Brazilian .com.br domain availability",
        seoTitle: "Is the .com.br domain free? Check registro.br",
        h1: "Is your company's domain still available?",
        description:
          "See in seconds whether the .com.br domain you want is still available to register. A direct lookup on the Brazilian registro.br registry, free and with no sign-up.",
        keywords: [
          "Brazilian domain lookup",
          "registro.br availability",
          "com.br domain check",
          "register Brazil domain",
          "check domain availability",
        ],
        faq: [
          [
            "How much does a .com.br domain cost to register?",
            "Around R$ 40 a year on registro.br, the official body. A domain is not bought once: it has to be renewed, and if it lapses anyone can grab it.",
          ],
          [
            "The domain I want is taken. What now?",
            "Worth testing variations before locking in your branding: add the city, the niche or swap the word order. Changing the name now costs far less than reprinting everything later.",
          ],
        ],
      },
    },
  },
  {
    slug: "teste-spf-dkim-dmarc",
    key: "email",
    group: "site",
    category: "SecurityApplication",
    copy: {
      pt: {
        title: "Teste de SPF, DKIM e DMARC",
        seoTitle: "Testar SPF, DKIM e DMARC do domínio | por que cai no spam",
        h1: "Diagnóstico de e-mail do domínio",
        description:
          "Descubra se o seu domínio tem SPF, DKIM e DMARC configurados, e por que os seus e-mails podem estar caindo no spam do cliente. Consulta de DNS grátis.",
        keywords: [
          "testar SPF DKIM DMARC",
          "email caindo no spam",
          "verificar SPF do domínio",
          "configurar DMARC",
          "autenticação de email",
          "email empresarial spam",
        ],
        faq: [
          [
            "Por que meu e-mail cai no spam do cliente?",
            "A causa mais comum é o domínio não declarar quem pode enviar em nome dele. Sem SPF, DKIM e DMARC, o provedor do destinatário não consegue provar que a mensagem é legítima e joga na caixa de spam.",
          ],
          [
            "O que é DMARC com p=none?",
            "É uma política que só observa e reporta, sem pedir bloqueio de mensagem falsificada. Serve como etapa de diagnóstico, mas não protege a sua marca contra quem se passa por você.",
          ],
        ],
      },
      en: {
        title: "SPF, DKIM and DMARC checker",
        seoTitle: "SPF, DKIM & DMARC test: why your email hits spam",
        h1: "Domain email authentication diagnosis",
        description:
          "Find out whether your domain has SPF, DKIM and DMARC configured, and why your emails may be landing in the customer's spam folder. Free DNS lookup.",
        keywords: [
          "SPF DKIM DMARC test",
          "email going to spam",
          "check domain SPF",
          "set up DMARC",
          "email authentication check",
          "business email deliverability",
        ],
        faq: [
          [
            "Why do my emails land in the customer's spam?",
            "The most common cause is a domain that doesn't declare who may send on its behalf. Without SPF, DKIM and DMARC, the recipient's provider cannot prove the message is legitimate and drops it in the spam folder.",
          ],
          [
            "What is DMARC with p=none?",
            "It is a policy that only observes and reports, without asking receivers to block forged mail. It works as a diagnostic step, but it does not protect your brand from someone impersonating you.",
          ],
        ],
      },
    },
  },
  {
    slug: "teste-seguranca-do-site",
    key: "headers",
    group: "site",
    category: "SecurityApplication",
    copy: {
      pt: {
        title: "Teste de segurança do site",
        seoTitle: "Testar segurança do site: HSTS, CSP e cabeçalhos | grátis",
        h1: "Auditor de cabeçalhos de segurança HTTP",
        description:
          "Analise HSTS, Content-Security-Policy, X-Frame-Options e Referrer-Policy do seu site e receba uma nota de segurança com o que cada cabeçalho evita.",
        keywords: [
          "testar segurança do site",
          "cabeçalhos de segurança HTTP",
          "content security policy",
          "HSTS",
          "proteção contra clickjacking",
          "security headers",
        ],
        faq: [
          [
            "Meu site tem cadeado. Não basta?",
            "Não. O cadeado indica apenas que a conexão é criptografada. Ele não impede XSS, não impede que outro site coloque o seu dentro de um iframe e não força o navegador a nunca usar HTTP.",
          ],
          [
            "O que é Content-Security-Policy?",
            "É a lista de origens de onde o seu site pode carregar script, estilo e imagem. É a defesa mais eficaz contra script de terceiro injetado na sua página.",
          ],
        ],
      },
      en: {
        title: "Website security header test",
        seoTitle: "Website security test: HSTS, CSP and headers | free",
        h1: "HTTP security header auditor",
        description:
          "Scan your site's HSTS, Content-Security-Policy, X-Frame-Options and Referrer-Policy and get a security score with what each header prevents.",
        keywords: [
          "website security test",
          "HTTP security headers",
          "content security policy",
          "HSTS check",
          "clickjacking protection",
          "security headers scanner",
        ],
        faq: [
          [
            "My site shows a padlock. Isn't that enough?",
            "No. The padlock only means the connection is encrypted. It doesn't stop XSS, doesn't stop another site from embedding yours in an iframe and doesn't force the browser to never use HTTP.",
          ],
          [
            "What is Content-Security-Policy?",
            "It is the list of origins your site may load script, style and images from. It is the most effective defence against third-party script injected into your page.",
          ],
        ],
      },
    },
  },
  {
    slug: "reajuste-de-contrato-ipca",
    key: "ipca",
    group: "operacao",
    category: "FinanceApplication",
    copy: {
      pt: {
        title: "Reajuste de contrato pelo IPCA",
        seoTitle: "Calculadora de reajuste pelo IPCA | índice do Banco Central",
        h1: "Reajuste de contrato pelo IPCA",
        description:
          "Calcule o reajuste anual do seu contrato com o IPCA acumulado em 12 meses, puxado direto do Banco Central. Veja o valor novo e a diferença no ano.",
        keywords: [
          "calculadora reajuste IPCA",
          "IPCA acumulado 12 meses",
          "reajuste de contrato",
          "reajuste de aluguel IPCA",
          "índice de correção anual",
        ],
        faq: [
          [
            "Qual o IPCA acumulado em 12 meses?",
            "O valor exibido na ferramenta vem da série oficial do Banco Central e é recalculado a cada nova divulgação mensal. Índice de preço compõe mês a mês, não se soma.",
          ],
          [
            "Posso usar outro índice?",
            "Sim. O campo de índice é editável, então dá para aplicar IGP-M, INPC ou um percentual combinado em contrato sem refazer a conta na mão.",
          ],
        ],
      },
      en: {
        title: "Brazilian contract inflation adjustment (IPCA)",
        seoTitle: "Brazil IPCA inflation adjustment calculator (contract)",
        h1: "Contract adjustment by Brazilian IPCA inflation",
        description:
          "Calculate the annual adjustment of a Brazilian contract using the 12-month accumulated IPCA, pulled straight from the Central Bank. See the new amount and the yearly difference.",
        keywords: [
          "Brazil IPCA calculator",
          "Brazil inflation adjustment",
          "contract adjustment Brazil",
          "IPCA accumulated 12 months",
          "Brazilian rent adjustment index",
        ],
        faq: [
          [
            "What is the 12-month accumulated IPCA?",
            "The figure shown in the tool comes from the Central Bank's official series and is recalculated on each monthly release. A price index compounds month by month, it is not summed.",
          ],
          [
            "Can I use another index?",
            "Yes. The index field is editable, so you can apply IGP-M, INPC or a rate agreed in the contract without redoing the maths by hand.",
          ],
        ],
      },
    },
  },
  {
    slug: "conversor-de-moedas",
    key: "cambio",
    group: "operacao",
    category: "FinanceApplication",
    copy: {
      pt: {
        title: "Conversor de moedas",
        seoTitle: "Conversor de moedas com cotação do dia: dólar, euro, iene",
        h1: "Conversor de moeda com cotação do dia",
        description:
          "Converta entre real, dólar, euro, iene e libra com a cotação de agora. Útil para orçar para cliente no exterior sem chutar o câmbio.",
        keywords: [
          "conversor de moedas",
          "cotação do dólar hoje",
          "real para iene",
          "converter real em dólar",
          "cotação euro hoje",
        ],
        faq: [
          [
            "De onde vem a cotação?",
            "Da cotação comercial de mercado, atualizada ao longo do dia. Para contrato e nota fiscal, confirme sempre a taxa que o seu banco vai efetivamente aplicar na liquidação.",
          ],
          [
            "Serve para orçar serviço para o exterior?",
            "Serve como referência. Em contrato internacional é comum fixar a taxa da data da proposta e prever no texto o que acontece se o câmbio variar acima de certo percentual.",
          ],
        ],
      },
      en: {
        title: "Currency converter",
        seoTitle: "Currency converter with live rates: USD, EUR, JPY, GBP",
        h1: "Currency converter with live rates",
        description:
          "Convert between BRL, USD, EUR, JPY and GBP at today's rate. Handy for quoting an overseas client without guessing the exchange rate.",
        keywords: [
          "currency converter",
          "live exchange rate",
          "BRL to USD",
          "USD to BRL converter",
          "foreign exchange calculator",
        ],
        faq: [
          [
            "Where does the rate come from?",
            "From the market commercial rate, updated throughout the day. For contracts and invoices, always confirm the rate your bank will actually apply at settlement.",
          ],
          [
            "Is it good for quoting work abroad?",
            "It works as a reference. In international contracts it is common to fix the rate from the proposal date and state in the text what happens if the exchange rate moves beyond a given percentage.",
          ],
        ],
      },
    },
  },
  {
    slug: "feriados-nacionais",
    key: "feriados",
    group: "operacao",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Feriados nacionais e emendas",
        seoTitle: "Feriados nacionais: calendário com emendas | grátis",
        h1: "Feriados do ano e o efeito na sua escala",
        description:
          "Calendário de feriados nacionais já marcando onde vira emenda de fim de semana, para planejar escala, compra de estoque e movimento da loja.",
        keywords: [
          "feriados nacionais",
          "calendário de feriados",
          "feriados prolongados",
          "emenda de feriado",
          "escala de trabalho feriado",
        ],
        faq: [
          [
            "Por que feriado na terça ou quinta importa tanto?",
            "Porque vira emenda. Muita gente folga a segunda ou a sexta, o movimento muda de dia e a compra de insumo precisa ser antecipada. Um feriado no meio da semana costuma mexer em quatro dias, não em um.",
          ],
          [
            "O calendário inclui feriado municipal?",
            "Não. São apenas os feriados nacionais. Feriado estadual e municipal variam por cidade e precisam ser conferidos na prefeitura.",
          ],
        ],
      },
      en: {
        title: "Brazilian national holidays and long weekends",
        seoTitle: "Brazil public holidays: calendar with long weekends",
        h1: "Brazilian national holidays and their effect on staffing",
        description:
          "A Brazilian national holiday calendar flagging the ones that create a long weekend, to plan staffing, stock purchases and store footfall in advance.",
        keywords: [
          "Brazil public holidays",
          "Brazilian national holidays",
          "Brazil long weekends",
          "Brazil holiday calendar",
          "holiday staffing plan",
        ],
        faq: [
          [
            "Why does a Tuesday or Thursday holiday matter so much?",
            "Because it becomes a long weekend. Many people take the Monday or Friday off, footfall shifts day and ingredient purchases have to be brought forward. A mid-week holiday usually moves four days, not one.",
          ],
          [
            "Does the calendar include local holidays?",
            "No. Only national holidays. State and municipal holidays vary by city and have to be checked with the local council.",
          ],
        ],
      },
    },
  },
  {
    slug: "buscar-cep",
    key: "cep",
    group: "operacao",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Busca de CEP",
        seoTitle: "Buscar CEP: endereço, código IBGE e coordenada | grátis",
        h1: "Busca de CEP com endereço e coordenada",
        description:
          "Digite o CEP e receba logradouro, bairro, cidade, UF, código IBGE e a coordenada do ponto. Útil para cadastro de cliente e conferência de área de entrega.",
        keywords: [
          "buscar CEP",
          "consultar CEP",
          "CEP com coordenada",
          "código IBGE do município",
          "endereço pelo CEP",
        ],
        faq: [
          [
            "Para que serve a coordenada do CEP?",
            "Para medir distância e montar raio de entrega. Com latitude e longitude dá para calcular automaticamente se um endereço está dentro da área que você atende.",
          ],
          [
            "O que é o código IBGE?",
            "É o identificador oficial do município. Sistemas fiscais e de nota eletrônica usam esse código em vez do nome da cidade, que pode ser escrito de várias formas.",
          ],
        ],
      },
      en: {
        title: "Brazilian postcode lookup (CEP)",
        seoTitle: "Brazil postcode lookup: address, city code and coordinates",
        h1: "Brazilian postcode (CEP) lookup with address and coordinates",
        description:
          "Type a Brazilian CEP and get the street, district, city, state, IBGE code and the point's coordinates. Useful for customer records and checking delivery areas.",
        keywords: [
          "Brazil postcode lookup",
          "Brazilian CEP lookup",
          "CEP with coordinates",
          "Brazil IBGE city code",
          "address by postcode Brazil",
        ],
        faq: [
          [
            "What is the CEP coordinate for?",
            "For measuring distance and building a delivery radius. With latitude and longitude you can automatically work out whether an address falls inside the area you serve.",
          ],
          [
            "What is the IBGE code?",
            "It is the official identifier of the municipality. Brazilian tax and electronic-invoice systems use that code instead of the city name, which can be spelled several ways.",
          ],
        ],
      },
    },
  },
  {
    slug: "validar-cpf",
    key: "cpf",
    group: "fiscal",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Validador de CPF",
        seoTitle: "Validar CPF online: confira o dígito verificador | grátis",
        h1: "Validador de CPF",
        description:
          "Confira se um CPF é válido pelo cálculo do dígito verificador por módulo 11. A ferramenta mostra ainda a região fiscal do número. Grátis, sem cadastro e sem enviar dados.",
        keywords: [
          "validar CPF",
          "verificar CPF",
          "validar CPF online",
          "dígito verificador CPF",
          "gerador de CPF válido",
          "conferir CPF",
        ],
        faq: [
          [
            "Como funciona a validação de CPF?",
            "O CPF tem 11 dígitos, sendo os dois últimos calculados a partir dos nove primeiros por módulo 11. Se o cálculo dos dígitos verificadores não bater com os dígitos informados, o número é inválido.",
          ],
          [
            "O que o nono dígito do CPF indica?",
            "A região fiscal que emitiu o número, não o estado onde a pessoa mora. O dígito 8, por exemplo, corresponde a São Paulo; o 7, ao Rio de Janeiro e ao Espírito Santo.",
          ],
        ],
      },
      en: {
        title: "Brazilian CPF validator",
        seoTitle: "Validate a Brazilian CPF: check the check digit | free",
        h1: "Brazilian CPF validator",
        description:
          "Check whether a Brazilian CPF is valid by computing its module-11 check digit. The tool also shows the tax region of the number. Free, no sign-up, no data sent.",
        keywords: [
          "validate Brazilian CPF",
          "Brazilian CPF checker",
          "CPF check digit",
          "Brazil tax ID for individuals",
          "how to validate a Brazilian CPF",
          "CPF validator online",
        ],
        faq: [
          [
            "How does CPF validation work?",
            "A CPF has 11 digits, with the last two computed from the first nine using module 11. If the check-digit calculation doesn't match the digits given, the number is invalid.",
          ],
          [
            "What does the ninth digit of a CPF indicate?",
            "The tax region that issued the number, not the state where the person lives. Digit 8, for example, corresponds to São Paulo; digit 7 to Rio de Janeiro and Espírito Santo.",
          ],
        ],
      },
    },
  },
  {
    slug: "extrator-nota-fiscal-xml",
    key: "nfexml",
    group: "fiscal",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Extrator de dados da NF-e (XML)",
        seoTitle: "Ler XML de NF-e: extrator de itens e valores | grátis",
        h1: "Extrator de dados de NF-e / NFC-e (XML)",
        description:
          "Suba o XML da nota fiscal e extraia emitente, destinatário, itens com quantidade e valor, impostos, pagamento e total. O arquivo é lido no seu navegador, sem upload para servidor.",
        keywords: [
          "ler XML NF-e",
          "extrair dados nota fiscal XML",
          "visualizar XML NF-e",
          "importar XML no estoque",
          "consultar itens da nota",
          "leitor de XML NFC-e",
        ],
        faq: [
          [
            "O arquivo que eu envio fica guardado no site?",
            "Não. A leitura do XML acontece inteira no seu navegador, com o componente nativo de parse de XML. O arquivo não é enviado para nenhum servidor nem armazenado.",
          ],
          [
            "Consigo importar os itens direto para o meu estoque?",
            "A ferramenta separa os dados para você conferir e copiar. A entrada automática no estoque, com atualização de saldo e custo médio, é parte de um ERP — é o que eu implemento no mercadinhosys.",
          ],
          [
            "Funciona para NFC-e de cupom?",
            "Sim. A estrutura do XML da NFC-e é a mesma da NF-e; muda apenas o modelo (65 em vez de 55). A ferramenta identifica o tipo automaticamente.",
          ],
        ],
      },
      en: {
        title: "Brazilian invoice XML extractor (NF-e)",
        seoTitle: "Read NF-e XML: extract Brazilian invoice items | free",
        h1: "Brazilian NF-e / NFC-e XML data extractor",
        description:
          "Upload the Brazilian invoice XML and extract issuer, recipient, line items with quantity and value, taxes, payment and total. The file is parsed in your browser, no server upload.",
        keywords: [
          "read NF-e XML",
          "extract Brazilian invoice data",
          "view NF-e XML",
          "import XML into inventory",
          "brazilian electronic invoice xml",
          "NFC-e XML reader",
        ],
        faq: [
          [
            "Is the file I upload stored on the site?",
            "No. The XML is parsed entirely in your browser using the native XML parser. The file is not sent to any server or stored.",
          ],
          [
            "Can I import the items straight into my inventory?",
            "The tool splits out the data for you to check and copy. Automatic inventory entry, with balance and average-cost updates, is part of an ERP — that is what I build in mercadinhosys.",
          ],
          [
            "Does it work for NFC-e receipts?",
            "Yes. The NFC-e XML structure is the same as NF-e; only the model changes (65 instead of 55). The tool detects the type automatically.",
          ],
        ],
      },
    },
  },
  {
    slug: "consultar-ddd",
    key: "ddd",
    group: "operacao",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "DDD: de que estado é esse número?",
        seoTitle: "Consultar DDD: qual estado e cidades | grátis",
        h1: "DDD: de que estado é esse número?",
        description:
          "Descubra a qual estado pertence um DDD e veja as cidades atendidas pelo código de área. Dados da Anatel, via consulta gratuita e sem cadastro.",
        keywords: [
          "consultar DDD",
          "de que estado é o DDD",
          "DDD de São Paulo",
          "código de área",
          "DDD 11",
          "lista de DDD por estado",
        ],
        faq: [
          [
            "O DDD indica onde a pessoa mora?",
            "Indica a região do número, não necessariamente onde a pessoa está. Os códigos de área foram divididos por região, e em 2016 o nono dígito foi acrescentado aos celulares da maioria do país.",
          ],
          [
            "O mesmo DDD atende mais de uma cidade?",
            "Sim, e em geral muitas. O DDD 11, por exemplo, cobre toda a Grande São Paulo e mais de 60 municípios. A ferramenta lista as principais cidades de cada código.",
          ],
        ],
      },
      en: {
        title: "Brazilian area code (DDD) lookup",
        seoTitle: "Brazil area code lookup: which state is this DDD?",
        h1: "Brazilian area code (DDD) lookup",
        description:
          "Find out which Brazilian state an area code (DDD) belongs to and see the cities it covers. Anatel data, via a free lookup with no sign-up.",
        keywords: [
          "Brazil area code lookup",
          "Brazilian DDD",
          "DDD 11",
          "Brazil phone area code",
          "which state is this area code",
          "brazil dialling code",
        ],
        faq: [
          [
            "Does the DDD show where the person lives?",
            "It shows the region of the number, not necessarily where the person is. Area codes were split by region, and in 2016 the ninth digit was added to mobile numbers across most of the country.",
          ],
          [
            "Does the same DDD cover more than one city?",
            "Yes, usually many. DDD 11, for example, covers Greater São Paulo and over 60 municipalities. The tool lists the main cities for each code.",
          ],
        ],
      },
    },
  },
  {
    slug: "codigos-de-bancos",
    key: "bancos",
    group: "fiscal",
    category: "FinanceApplication",
    copy: {
      pt: {
        title: "Códigos de bancos (COMPE e ISPB)",
        seoTitle: "Código de banco: consultar COMPE e ISPB | grátis",
        h1: "Códigos de bancos: COMPE e ISPB",
        description:
          "Consulte o código de qualquer banco pelo número COMPE, pelo ISPB ou pelo nome. Útil para conferir boleto, DDA e o código que aparece no aplicativo na hora de pagar.",
        keywords: [
          "código de banco",
          "consulta código COMPE",
          "ISPB banco",
          "banco 341",
          "código do banco no boleto",
          "lista de bancos código",
        ],
        faq: [
          [
            "O que é o código COMPE do banco?",
            "É o número de três dígitos que identifica a instituição na câmara de compensação. É o 341 do Itaú, o 237 do Bradesco, o 001 do Banco do Brasil. Ele aparece no boleto, no DDA e no app do banco.",
          ],
          [
            "O que é o ISPB?",
            "É o identificador de oito dígitos usado no Sistema de Pagamentos Brasileiro, base do Pix. Ele não muda com fusões e vem substituindo o COMPE em integrações novas.",
          ],
        ],
      },
      en: {
        title: "Brazilian bank codes (COMPE and ISPB)",
        seoTitle: "Brazilian bank code lookup: COMPE and ISPB",
        h1: "Brazilian bank codes: COMPE and ISPB",
        description:
          "Look up any Brazilian bank by its COMPE number, ISPB or name. Useful for checking a boleto, DDA or the code that shows in the app when you pay.",
        keywords: [
          "Brazilian bank code",
          "COMPE code lookup",
          "ISPB Brazil",
          "Brazil bank 341",
          "bank code on boleto",
          "list of Brazilian banks",
        ],
        faq: [
          [
            "What is a bank's COMPE code?",
            "It is the three-digit number that identifies the institution in the clearing house. It is 341 for Itaú, 237 for Bradesco, 001 for Banco do Brasil. It appears on the boleto, in DDA and in the bank app.",
          ],
          [
            "What is the ISPB?",
            "It is the eight-digit identifier used in the Brazilian Payment System, the basis of Pix. It does not change with mergers and has been replacing COMPE in new integrations.",
          ],
        ],
      },
    },
  },
  {
    slug: "calculadora-selic-cdi-rendimento",
    key: "taxas",
    group: "operacao",
    category: "FinanceApplication",
    copy: {
      pt: {
        title: "Selic, CDI e calculadora de rendimento",
        seoTitle: "Calculadora de rendimento: Selic e CDI de hoje | grátis",
        h1: "Selic, CDI e calculadora de juros compostos",
        description:
          "Veja a Selic e o CDI do dia, direto do Banco Central, e simule quanto rende um valor em juros compostos pelo prazo que você escolher. Grátis e sem cadastro.",
        keywords: [
          "calculadora de juros compostos",
          "taxa Selic hoje",
          "CDI hoje",
          "quanto rende o CDI",
          "simulador de rendimento",
          "juros compostos online",
        ],
        faq: [
          [
            "Como calcular quanto rende 100% do CDI?",
            "O CDI acompanha de perto a Selic. Para 12 meses, o rendimento aproximado é o valor aplicado multiplicado por (1 + taxa do CDI) elevado a 1 ano. A ferramenta converte a taxa anual para mensal e compõe mês a mês.",
          ],
          [
            "O rendimento mostrado é líquido de imposto?",
            "Não. O cálculo mostra a rentabilidade bruta, sem descontar imposto de renda nem taxa de administração. Em renda fixa, o IR é regressivo: começa em 22,5% e cai até 15% conforme o prazo.",
          ],
          [
            "A taxa da ferramenta é a mesma do meu banco?",
            "A Selic e o CDI exibidos são as taxas oficiais do momento. Cada investimento aplica um percentual do CDI (por exemplo, 100% ou 110%), que você digita no campo de taxa para simular o seu caso.",
          ],
        ],
      },
      en: {
        title: "Selic, CDI and a compound-interest calculator",
        seoTitle: "Brazil return calculator: today's Selic and CDI | free",
        h1: "Selic, CDI and a compound-interest calculator",
        description:
          "See today's Brazilian Selic and CDI rates, straight from the Central Bank, and simulate what an amount earns in compound interest over the term you choose. Free, no sign-up.",
        keywords: [
          "compound interest calculator",
          "Brazil Selic rate today",
          "CDI rate today",
          "Brazil fixed income return",
          "investment return calculator",
          "compound interest online",
        ],
        faq: [
          [
            "How do I calculate what 100% of CDI earns?",
            "CDI tracks the Selic closely. For 12 months, the approximate return is the invested amount multiplied by (1 + the CDI rate) raised to 1 year. The tool converts the annual rate to monthly and compounds month by month.",
          ],
          [
            "Is the shown return net of tax?",
            "No. The calculation shows the gross return, without deducting income tax or management fees. In Brazilian fixed income, income tax is regressive: it starts at 22.5% and falls to 15% as the term lengthens.",
          ],
          [
            "Is the tool's rate the same as my bank's?",
            "The Selic and CDI shown are the official rates of the moment. Each investment applies a percentage of CDI (for example, 100% or 110%), which you enter in the rate field to simulate your case.",
          ],
        ],
      },
    },
  },
];

export const GROUP_LABEL: Record<ToolGroup, { pt: string; en: string }> = {
  fiscal: { pt: "Fiscal e pagamento", en: "Tax and payments" },
  margem: { pt: "Preço e margem", en: "Price and margin" },
  site: { pt: "Site, domínio e segurança", en: "Site, domain and security" },
  operacao: { pt: "Contrato e operação", en: "Contracts and operations" },
};

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
