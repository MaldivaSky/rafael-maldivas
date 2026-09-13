/* ------------------------------------------------------------------ */
/*  Registro das ferramentas                                           */
/*                                                                     */
/*  Cada ferramenta é uma PÁGINA, não uma âncora. O Google indexa       */
/*  página: um #ancora dentro de /ferramentas nunca vai ranquear para   */
/*  "calculadora de CMV" ou "consultar CNPJ grátis". Cada slug aqui     */
/*  vira /ferramentas/<slug>, com title, description, H1 e schema       */
/*  próprios, e entra sozinho no sitemap.                              */
/* ------------------------------------------------------------------ */

export type ToolGroup = "fiscal" | "margem" | "site" | "operacao";

export type Tool = {
  slug: string;
  /** chave do componente no renderizador */
  key: string;
  group: ToolGroup;
  /** o que a pessoa digita no Google */
  title: string;
  /** <title> da aba, até ~60 caracteres */
  seoTitle: string;
  h1: string;
  /** meta description, 150-160 caracteres */
  description: string;
  keywords: string[];
  /** categoria do schema.org */
  category: "BusinessApplication" | "SecurityApplication" | "FinanceApplication";
  /** perguntas que viram FAQPage — é o que ganha rich snippet */
  faq: [string, string][];
};

export const tools: Tool[] = [
  {
    slug: "calculadora-cmv-preco-de-venda",
    key: "preco",
    group: "margem",
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
    category: "BusinessApplication",
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
  {
    slug: "margem-ou-markup",
    key: "markup",
    group: "margem",
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
    category: "BusinessApplication",
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
  {
    slug: "ficha-tecnica-fator-de-correcao",
    key: "ficha",
    group: "margem",
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
    category: "BusinessApplication",
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
  {
    slug: "margem-ifood-99food-delivery",
    key: "delivery",
    group: "margem",
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
    category: "BusinessApplication",
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
  {
    slug: "consultar-cnpj",
    key: "cnpj",
    group: "fiscal",
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
    category: "BusinessApplication",
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
  {
    slug: "validar-pix-copia-e-cola",
    key: "pix",
    group: "fiscal",
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
    category: "FinanceApplication",
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
  {
    slug: "consultar-chave-nfe-nfce",
    key: "nfe",
    group: "fiscal",
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
    category: "BusinessApplication",
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
  {
    slug: "dominio-com-br-disponivel",
    key: "dominio",
    group: "site",
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
    category: "BusinessApplication",
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
  {
    slug: "teste-spf-dkim-dmarc",
    key: "email",
    group: "site",
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
    category: "SecurityApplication",
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
  {
    slug: "teste-seguranca-do-site",
    key: "headers",
    group: "site",
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
    category: "SecurityApplication",
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
  {
    slug: "reajuste-de-contrato-ipca",
    key: "ipca",
    group: "operacao",
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
    category: "FinanceApplication",
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
  {
    slug: "conversor-de-moedas",
    key: "cambio",
    group: "operacao",
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
    category: "FinanceApplication",
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
  {
    slug: "feriados-nacionais",
    key: "feriados",
    group: "operacao",
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
    category: "BusinessApplication",
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
  {
    slug: "buscar-cep",
    key: "cep",
    group: "operacao",
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
    category: "BusinessApplication",
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
  {
    slug: "validar-cpf",
    key: "cpf",
    group: "fiscal",
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
    category: "BusinessApplication",
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
  {
    slug: "extrator-nota-fiscal-xml",
    key: "nfexml",
    group: "fiscal",
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
    category: "BusinessApplication",
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
  {
    slug: "consultar-ddd",
    key: "ddd",
    group: "operacao",
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
    category: "BusinessApplication",
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
  {
    slug: "codigos-de-bancos",
    key: "bancos",
    group: "fiscal",
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
    category: "FinanceApplication",
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
  {
    slug: "calculadora-selic-cdi-rendimento",
    key: "taxas",
    group: "operacao",
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
    category: "FinanceApplication",
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
];

export const GROUP_LABEL: Record<ToolGroup, { pt: string; en: string }> = {
  fiscal: { pt: "Fiscal e pagamento", en: "Tax and payments" },
  margem: { pt: "Preço e margem", en: "Price and margin" },
  site: { pt: "Site, domínio e segurança", en: "Site, domain and security" },
  operacao: { pt: "Contrato e operação", en: "Contracts and operations" },
};

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
