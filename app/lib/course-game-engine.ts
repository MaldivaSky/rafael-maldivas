/**
 * Software Engineering Construction Process & Game Progression Engine.
 *
 * Maps every lesson to one of the 6 real-world Software Engineering Acts
 * ("Da Planta ao Deploy") so tools, downloads, and arenas are introduced
 * strictly in pedagogical order — never dumped without context.
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export type EngineeringActId =
  | "act-1-blueprint"
  | "act-2-workbench"
  | "act-3-foundation"
  | "act-4-walls-api"
  | "act-5-finishing-tests"
  | "act-6-cloud-deploy";

export type ArenaStationType =
  | "bancada"
  | "terminal"
  | "sandbox"
  | "http"
  | "loja"
  | "deploy"
  | "cards";

export interface EngineeringActSpec {
  id: EngineeringActId;
  actNumber: number;
  shortTitle: string;
  houseAnalogy: string;
  softwareProcessName: string;
  whyThisOrder: string;
}

export interface LessonQuestBriefing {
  lessonSlug: string;
  actId: EngineeringActId;
  actNumber: number;
  phaseBadge: string;
  houseRoomLabel: string;
  whyBeforeCode: string;
  whatYouWillBuild: string;
  primaryStation: ArenaStationType;
  primaryStationTitle: string;
  primaryStationWhy: string;
   primaryStationCta: string;
  secondaryStation?: {
    station: ArenaStationType;
    label: string;
  };
  unlocksDownloadKit?: {
    title: string;
    whatIsIt: string;
    howToUseSteps: string[];
    href: string;
    buttonLabel: string;
  };
}

export const ENGINEERING_ACTS: EngineeringActSpec[] = [
  {
    id: "act-1-blueprint",
    actNumber: 1,
    shortTitle: "Ato 1 · Planta & Requisitos",
    houseAnalogy: "Desenhar a planta da casa e calcular se a obra se paga",
    softwareProcessName: "Concepção, Arquitetura & Regras do Negócio",
    whyThisOrder:
      "Nenhum engenheiro compra tijolo ou instala programa antes de entender o que vai construir, quem pede, quem decide e como o dinheiro fecha.",
  },
  {
    id: "act-2-workbench",
    actNumber: 2,
    shortTitle: "Ato 2 · Terreno & Ferramentas",
    houseAnalogy: "Limpar o terreno, montar a bancada e receber a Casa Pré-Moldada",
    softwareProcessName: "Ambiente de Desenvolvimento (Terminal, VS Code, Python & Git)",
    whyThisOrder:
      "Primeiro você perde o medo da Tela Preta (Terminal) em simulação segura; depois instala o VS Code e recebe o esqueleto pré-moldado sabendo para que serve cada pasta.",
  },
  {
    id: "act-3-foundation",
    actNumber: 3,
    shortTitle: "Ato 3 · Alicerce & Colunas",
    houseAnalogy: "Concretar o alicerce onde todas as informações ficam guardadas",
    softwareProcessName: "Modelagem de Dados, Tabelas SQL, Centavos & Migrações",
    whyThisOrder:
      "Se o banco de dados for mal desenhado, o dinheiro some e pedidos antigos mudam de preço. O alicerce vem antes das telas e da API.",
  },
  {
    id: "act-4-walls-api",
    actNumber: 4,
    shortTitle: "Ato 4 · Paredes, Portas & Cofre",
    houseAnalogy: "Levantar as paredes, instalar fechaduras e ligar a energia",
    softwareProcessName: "API REST, Trava de Estoque Concorrente, PIX, Webhook & Split",
    whyThisOrder:
      "Com o banco firme, criamos o conferente (Serializer), o cozinheiro (ViewSet), a trava que impede vender duas vezes a última peça e a recepção segura de pagamentos.",
  },
  {
    id: "act-5-finishing-tests",
    actNumber: 5,
    shortTitle: "Ato 5 · Inspeção & Acabamento",
    houseAnalogy: "Testar a fiação elétrica, pintar a fachada e colocar os móveis",
    softwareProcessName: "Testes Automatizados, Leitura de Arquitetura & Vitrine Front-end",
    whyThisOrder:
      "Antes de inaugurar, provamos com testes automáticos que nenhuma regra quebra e personalizamos a vitrine visual (móveis e cores) da loja.",
  },
  {
    id: "act-6-cloud-deploy",
    actNumber: 6,
    shortTitle: "Ato 6 · Inauguração na Rua",
    houseAnalogy: "Ligar na rede pública, abrir as portas e emitir o Habite-se",
    softwareProcessName: "Auditoria de Segurança, Deploy Cloud R$ 0,00 & Certificação",
    whyThisOrder:
      "Só vai para a internet (GitHub, Neon, Render e Vercel) o software que já tem alicerce, paredes seguras, `.env` protegido e testes passando.",
  },
];

export const LESSON_QUEST_BRIEFINGS: Record<string, LessonQuestBriefing> = {
  "modulo-0-f01-o-mapa": {
    lessonSlug: "modulo-0-f01-o-mapa",
    actId: "act-1-blueprint",
    actNumber: 1,
    phaseBadge: "Ato 1 de 6 · Planta Baixa do Software",
    houseRoomLabel: "Planta Geral: Salão (Front-end), Cozinha (Back-end) e Despensa (Banco)",
    whyBeforeCode:
      "Você ainda NÃO precisa instalar nenhum programa nem baixar arquivos agora. Na engenharia de software, o Passo 1 é entender o mapa: quem mostra a tela, quem aplica as regras e onde os dados moram.",
    whatYouWillBuild:
      "Você vai dominar o caminho completo de um pedido desde o toque no celular até o banco de dados e testar um roteador HTTP na prática.",
    primaryStation: "http",
    primaryStationTitle: "Estação de Arquitetura: Simulador de Requisições HTTP",
    primaryStationWhy:
      "Veja na prática como o Garçom (Rota) e o Cozinheiro (Servidor) conversam usando pedidos GET/POST e códigos 200, 401 e 409.",
    primaryStationCta: "Entrar na Estação 1: Simular Viagem do Pedido →",
    secondaryStation: {
      station: "sandbox",
      label: "Opcional: Ver código do Roteador HTTP em Python",
    },
  },

  "modulo-0-f02-preparando-a-bancada": {
    lessonSlug: "modulo-0-f02-preparando-a-bancada",
    actId: "act-2-workbench",
    actNumber: 2,
    phaseBadge: "Ato 2 de 6 · Preparação do Canteiro & Bancada",
    houseRoomLabel: "Sua Bancada: Terminal Preto + VS Code + Casa Pré-Moldada",
    whyBeforeCode:
      "Agora que você já conhece a planta da loja, vamos montar sua bancada! Primeiro você treina os 8 comandos essenciais na nossa Tela Preta Simulada (sem risco de errar). Depois, você baixa a Casa Pré-Moldada (.zip) e abre no VS Code.",
    whatYouWillBuild:
      "Você vai criar sua pasta de projeto, ativar o Git protegendo senhas (.gitignore), isolar o Python no .venv e abrir a Casa Pré-Moldada no VS Code.",
    primaryStation: "terminal",
    primaryStationTitle: "Missão Obrigatória 1: Domine a Tela Preta Antes do VS Code",
    primaryStationWhy:
      "Ninguém mais trava no terminal: digite pwd, ls, mkdir minha-loja, cd minha-loja, git init e proteja o .env aqui no navegador antes de abrir no seu PC.",
    primaryStationCta: "Passo 1: Treinar na Tela Preta Simulada →",
    secondaryStation: {
      station: "bancada",
      label: "Passo 2: Baixar Casa Pré-Moldada (.zip) & Guia VS Code",
    },
    unlocksDownloadKit: {
      title: "Material Desbloqueado nesta Fase: Sua Casa Pré-Moldada (.zip)",
      whatIsIt:
        "Em vez de começar com uma pasta vazia sem saber o que criar, preparamos um projeto-esqueleto com os 4 cômodos da sua loja já separados e marcados com comentários ([MÓVEL 1], [TIJOLO 1], [PAREDE 1]).",
      howToUseSteps: [
        "1º Conclua os comandos básicos na Tela Preta Simulada para entender o que são pastas (mkdir/cd) e proteção de senhas (.gitignore).",
        "2º Clique no botão abaixo para abrir o Guia Passo a Passo do VS Code e baixar o arquivo casa-pre-moldada-marketplace.zip.",
        "3º Descompacte a pasta, abra no VS Code (File → Open Folder) e rode python testar_minha_casa.py no terminal integrado.",
      ],
      href: "/pt/cursos/construa-seu-marketplace/pratica?estacao=bancada&aula=modulo-0-f02-preparando-a-bancada",
      buttonLabel: "Abrir Guia Passo a Passo do VS Code & Baixar Casa Pré-Moldada →",
    },
  },

  "modulo-0-f03-primeiro-projeto-django": {
    lessonSlug: "modulo-0-f03-primeiro-projeto-django",
    actId: "act-3-foundation",
    actNumber: 3,
    phaseBadge: "Ato 3 de 6 · Fundação & Alicerce do Banco",
    houseRoomLabel: "Cômodo 2 da Casa Pré-Moldada: 02-alicerce-banco/models_esqueleto.py",
    whyBeforeCode:
      "Com a bancada pronta, todo software começa pelo ALICERCE: definir como os produtos e preços serão guardados no banco de dados (usando classes Python que viram tabelas SQL via migração).",
    whatYouWillBuild:
      "Você vai criar a tabela de Produtos e Pedidos com validação de estoque e rodar makemigrations + migrate.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina do Alicerce: Modelagem Python & SQLite",
    primaryStationWhy:
      "Complete o tijolo do Model e veja o código criar a tabela e validar regras no banco em tempo real.",
    primaryStationCta: "Construir o Alicerce na Oficina de Código →",
    secondaryStation: {
      station: "terminal",
      label: "Praticar makemigrations e migrate no Terminal Simulado",
    },
  },

  "modulo-0-f04-primeira-api-com-drf": {
    lessonSlug: "modulo-0-f04-primeira-api-com-drf",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Levantando as Paredes (API REST)",
    houseRoomLabel: "Cômodo 3 da Casa Pré-Moldada: 03-paredes-api/api_esqueleto.py",
    whyBeforeCode:
      "O banco já guarda produtos, mas o celular do cliente não pode acessar o banco direto! Precisamos levantar as PAREDES e o balcão de atendimento: o Serializer (conferente) e a View (cozinheiro).",
    whatYouWillBuild:
      "Uma API JSON que lista produtos (200), cria pedidos validados (201) e bloqueia compras sem estoque (409).",
    primaryStation: "http",
    primaryStationTitle: "Simulador de Balcão API: Provocando Status 200, 201, 400 e 409",
    primaryStationWhy:
      "Envie pacotes JSON reais para o servidor e veja como o Serializer barra dados falsos antes de tocar no banco.",
    primaryStationCta: "Testar as Paredes da API no Simulador HTTP →",
    secondaryStation: {
      station: "sandbox",
      label: "Programar o Serializer e a Baixa de Estoque em Python",
    },
  },

  "modulo-0-f05-testes-e-git": {
    lessonSlug: "modulo-0-f05-testes-e-git",
    actId: "act-5-finishing-tests",
    actNumber: 5,
    phaseBadge: "Ato 5 de 6 · Inspeção de Qualidade & Fachada",
    houseRoomLabel: "Inspeção Elétrica (testar_minha_casa.py) + Móveis (01-acabamento-vitrine)",
    whyBeforeCode:
      "Obra profissional não vai para a rua no 'eu acho que funciona'. Nesta fase você escreve testes automáticos (Preparar → Agir → Conferir), protege seus segredos no Git e prepara a vitrine visual!",
    whatYouWillBuild:
      "Uma suíte de testes automatizados que grita se alguém quebrar o preço ou o estoque, além da vitrine personalizada da sua loja.",
    primaryStation: "loja",
    primaryStationTitle: "Acabamento & Móveis: Personalize a Vitrine da Sua Loja",
    primaryStationWhy:
      "Agora que você entende como o motor e os testes funcionam, escolha o nome, as cores, os produtos e o WhatsApp da sua vitrine!",
    primaryStationCta: "Personalizar os Móveis da Minha Vitrine →",
    secondaryStation: {
      station: "terminal",
      label: "Rodar python manage.py test e git commit no Terminal",
    },
  },

  "modulo-0-f06-lendo-um-projeto-real": {
    lessonSlug: "modulo-0-f06-lendo-um-projeto-real",
    actId: "act-5-finishing-tests",
    actNumber: 5,
    phaseBadge: "Ato 5 de 6 · Vistoria de Engenharia em Sistema Real",
    houseRoomLabel: "Planta Completa do MySuperStore (9 departamentos integrados)",
    whyBeforeCode:
      "Antes de construir um prédio grande, você visita um prédio real por dentro. Aqui você aplica o método dos 5 passos ('da porta para dentro') para ler o código real do MySuperStore sem se perder.",
    whatYouWillBuild:
      "Auditoria guiada de rotas, models, serializers e serviços do MySuperStore.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Inspeção: Rastreando Rotas e Serviços",
    primaryStationWhy:
      "Analise e valide a estrutura modular de um marketplace multi-lojista real.",
    primaryStationCta: "Abrir Oficina de Inspeção de Código →",
    secondaryStation: {
      station: "cards",
      label: "Revisar os Conceitos da Base com os Flip Cards 3D",
    },
  },

  "modulo-1-visao-do-negocio": {
    lessonSlug: "modulo-1-visao-do-negocio",
    actId: "act-1-blueprint",
    actNumber: 1,
    phaseBadge: "Ato 1 de 6 · Viabilidade Financeira & Regras do Dinheiro",
    houseRoomLabel: "Orçamento da Obra: Comissão, Taxa PIX/Cartão, Frete e Repasse",
    whyBeforeCode:
      "Um marketplace que erra 1 centavo no arredondamento ou promete frete grátis sem calcular a taxa do cartão quebra no primeiro mês. Toda regra financeira nasce em centavos inteiros antes do código.",
    whatYouWillBuild:
      "Calculadora exata de comissão, taxa de provedor e repasse líquido ao lojista em centavos inteiros.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina Financeira: Split em Centavos sem Erro de Float",
    primaryStationWhy:
      "Implemente a função que separa comissão da plataforma e repasse do lojista garantindo que nenhum centavo desapareça.",
    primaryStationCta: "Construir Motor de Centavos na Oficina →",
  },

  "modulo-2-modelo-de-dados": {
    lessonSlug: "modulo-2-modelo-de-dados",
    actId: "act-3-foundation",
    actNumber: 3,
    phaseBadge: "Ato 3 de 6 · Alicerce Multi-Lojista (Order × SubOrder)",
    houseRoomLabel: "Cômodo 2: Tabelas Order, SubOrder, OrderItem (Snapshot) e Payment",
    whyBeforeCode:
      "Quando um cliente compra de 2 lojas no mesmo carrinho, ele faz 1 pagamento só, mas cada loja envia seu pacote separado. O desenho das tabelas precisa separar Pedido (Order) de Sub-pedido (SubOrder).",
    whatYouWillBuild:
      "Esquema relacional com Snapshot de preço/endereço e proteção contra exclusão acidental de histórico financeiro (PROTECT).",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina SQL + Python: Modelando Order, SubOrder e Snapshot",
    primaryStationWhy:
      "Construa as tabelas no SQLite e prove com testes que alterar o preço futuro de um produto nunca adultera pedidos antigos.",
    primaryStationCta: "Construir Tabelas Multi-Lojista na Oficina →",
  },

  "modulo-2-carrinho-frete-cupom": {
    lessonSlug: "modulo-2-carrinho-frete-cupom",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Paredes de Cálculo (Carrinho, Frete & Cupom)",
    houseRoomLabel: "Cômodo 3: Recálculo no Servidor e Rateio de Desconto",
    whyBeforeCode:
      "O navegador do cliente nunca decide o preço final! O servidor precisa buscar o preço no banco, validar o cupom dentro da transação e dividir o desconto entre as lojas jogando a sobra de 1 centavo na última loja.",
    whatYouWillBuild:
      "Algoritmo de rateio proporcional de cupom em centavos inteiros + vitrine funcional.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Rateio: Desconto Multi-Loja sem Perder 1 Centavo",
    primaryStationWhy:
      "Programe o cálculo de carrinho no servidor e valide que a soma dos sub-pedidos bate exatamente com o total cobrado.",
    primaryStationCta: "Programar Carrinho & Cupom na Oficina →",
    secondaryStation: {
      station: "loja",
      label: "Personalizar sua Vitrine de Roupas com Carrinho",
    },
  },

  "modulo-3-criar-pedido-sem-vender-duas-vezes": {
    lessonSlug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Parede de Concorrência (Trava de Estoque)",
    houseRoomLabel: "Cômodo 3: Transação Atômica e UPDATE Condicional",
    whyBeforeCode:
      "Se duas pessoas clicarem em 'Comprar' no mesmo milissegundo disputando a última camiseta, um código ingênuo vende para as duas! Aqui você blinda o estoque com atualização condicional no banco.",
    whatYouWillBuild:
      "Trava atômica de estoque que aprova apenas 1 comprador e devolve 409 Conflict para o segundo.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Concorrência: Impedindo Venda Dupla no SQLite",
    primaryStationWhy:
      "Implemente a baixa atômica ordenada por SKU para impedir overselling e deadlock.",
    primaryStationCta: "Blindar Estoque na Oficina de Código →",
    secondaryStation: {
      station: "http",
      label: "Simular Ataque de Compra Dupla no Simulador HTTP",
    },
  },

  "modulo-3-cobrar-pix-e-cartao": {
    lessonSlug: "modulo-3-cobrar-pix-e-cartao",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Parede de Cobrança (PIX mTLS & Tokenização)",
    houseRoomLabel: "Integração com Provedor de Pagamento (QR Code PIX e Cartão)",
    whyBeforeCode:
      "O número do cartão do cliente nunca deve passar pelo seu servidor! E na cobrança PIX, o valor vai em centavos com certificado mTLS e txid único.",
    whatYouWillBuild:
      "Gerador de payload de cobrança PIX e validador seguro de parâmetros financeiros.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Pagamentos: Payload PIX & Conversão Segura",
    primaryStationWhy:
      "Construa a camada que prepara a cobrança sem erro de ponto flutuante e sem expor dados sensíveis.",
    primaryStationCta: "Abrir Oficina de Cobrança PIX →",
  },

  "modulo-3-confirmar-pagamento-webhook": {
    lessonSlug: "modulo-3-confirmar-pagamento-webhook",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Porta Blindada (Webhook HMAC & Idempotência)",
    houseRoomLabel: "Recepção de Confirmação Bancária contra Fraude e Duplicidade",
    whyBeforeCode:
      "Qualquer golpista na internet pode mandar um POST falso dizendo 'PIX PAGO' para a sua URL! E o próprio banco pode avisar 2 vezes o mesmo pagamento. Sua porta precisa ser fail-closed e idempotente.",
    whatYouWillBuild:
      "Receptor de Webhook com validação em tempo constante (HMAC), conferência de valor pago e chave de idempotência.",
    primaryStation: "http",
    primaryStationTitle: "Simulador de Webhook PIX: Teste Fraude (401) e Replay (200 Idempotente)",
    primaryStationWhy:
      "Tente enganar o servidor com assinatura falsa e dispare o mesmo webhook 2 vezes seguidas para ver a proteção funcionar.",
    primaryStationCta: "Testar Webhook PIX no Simulador →",
    secondaryStation: {
      station: "sandbox",
      label: "Implementar o Validador de Webhook em Python",
    },
  },

  "modulo-3-repasse-e-estorno": {
    lessonSlug: "modulo-3-repasse-e-estorno",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Cofre de Repasse & Estorno com Teto",
    houseRoomLabel: "Ledger Financeiro: Pagar o Lojista 1 Vez e Devolver sem Prejuízo",
    whyBeforeCode:
      "Se o cliente pedir reembolso parcial duas vezes, seu sistema nunca pode devolver mais do que foi pago! E o repasse ao lojista precisa de ID determinístico para nunca pagar duplicado.",
    whatYouWillBuild:
      "Motor de estorno com teto acumulado e chave determinística de repasse.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina do Cofre: Estorno Parcial & Teto Acumulado",
    primaryStationWhy:
      "Garanta por código que a soma dos estornos jamais ultrapasse o total pago pelo cliente.",
    primaryStationCta: "Programar Cofre de Estorno na Oficina →",
  },

  "modulo-4-ciclo-de-vida-e-worker": {
    lessonSlug: "modulo-4-ciclo-de-vida-e-worker",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Automação de Segundo Plano (Workers)",
    houseRoomLabel: "Auxiliar de Cozinha: Liberando Estoque de PIX Vencido",
    whyBeforeCode:
      "Quando alguém gera um PIX e não paga, a camiseta não pode ficar presa para sempre! Um worker periódico devolve o item à prateleira com segurança.",
    whatYouWillBuild:
      "Rotina idempotente de expiração de pedidos pendentes e devolução de estoque.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Worker: Expirando Pedidos Vencidos sem Perder Estoque",
    primaryStationWhy:
      "Programe a tarefa que varre pedidos vencidos, restaura o estoque e ignora pedidos já pagos.",
    primaryStationCta: "Programar Worker na Oficina →",
  },

  "modulo-4-tempo-real-e-midia": {
    lessonSlug: "modulo-4-tempo-real-e-midia",
    actId: "act-4-walls-api",
    actNumber: 4,
    phaseBadge: "Ato 4 de 6 · Interfone em Tempo Real & Fotos Leves",
    houseRoomLabel: "WebSockets Autorizados e Upload Seguro de Imagens",
    whyBeforeCode:
      "A tela do cliente deve mudar para 'Pago!' no segundo em que o PIX cai, mas um usuário nunca pode escutar o canal de outro pedido! E fotos de produtos não podem estourar a memória do servidor.",
    whatYouWillBuild:
      "Autorizador de canal em tempo real e validador de limite de mídia.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Tempo Real: Autorização de Canal & Mídia",
    primaryStationWhy:
      "Bloqueie conexões intrusas e valide limites de arquivo antes do processamento.",
    primaryStationCta: "Abrir Oficina de Tempo Real →",
  },

  "modulo-5-infraestrutura-deploy-backup": {
    lessonSlug: "modulo-5-infraestrutura-deploy-backup",
    actId: "act-6-cloud-deploy",
    actNumber: 6,
    phaseBadge: "Ato 6 de 6 · Inauguração na Rua (Deploy Cloud R$ 0,00)",
    houseRoomLabel: "Cômodo 4: Telhado, Segurança de Produção e Publicação na Nuvem",
    whyBeforeCode:
      "Chegou a hora de tirar o projeto do seu computador e colocar um link real na internet sem gastar R$ 1,00! Seguimos um provedor por vez: GitHub → Neon PostgreSQL → Render → Vercel.",
    whatYouWillBuild:
      "Sua loja ou marketplace publicado na nuvem gratuita com HTTPS automático e banco de dados real.",
    primaryStation: "deploy",
    primaryStationTitle: "Arena de Publicação R$ 0,00: 1 Provedor por Vez com Fotos",
    primaryStationWhy:
      "Siga passo a passo onde clicar para criar conta e publicar no GitHub, Neon, Render e Vercel.",
    primaryStationCta: "Iniciar Publicação Passo a Passo R$ 0 →",
    secondaryStation: {
      station: "terminal",
      label: "Rodar Auditoria python manage.py check --deploy no Terminal",
    },
  },

  "modulo-6-juridico-fiscal-operacao": {
    lessonSlug: "modulo-6-juridico-fiscal-operacao",
    actId: "act-6-cloud-deploy",
    actNumber: 6,
    phaseBadge: "Ato 6 de 6 · Blindagem Legal, LGPD & Operação",
    houseRoomLabel: "Alvará de Funcionamento: LGPD, Termos Claros e Responsabilidade Fiscal",
    whyBeforeCode:
      "Para operar de verdade ou entregar software para clientes, você precisa saber onde o código toca na lei: proteção de dados pessoais (LGPD), direito de arrependimento e divisão fiscal.",
    whatYouWillBuild:
      "Checklist operacional e auditoria de conformidade LGPD no código.",
    primaryStation: "sandbox",
    primaryStationTitle: "Oficina de Conformidade: Mascaramento & Auditoria LGPD",
    primaryStationWhy:
      "Implemente a proteção de dados sensíveis em logs e exportações.",
    primaryStationCta: "Abrir Oficina de Conformidade LGPD →",
  },

  "modulo-7-projeto-final-certificado": {
    lessonSlug: "modulo-7-projeto-final-certificado",
    actId: "act-6-cloud-deploy",
    actNumber: 6,
    phaseBadge: "Ato 6 de 6 · Vistoria Final (Habite-se & Certificado Verificável)",
    houseRoomLabel: "Entrega da Obra Completa + Certificado Oficial com QR Code",
    whyBeforeCode:
      "Você percorreu todas as etapas da engenharia! Agora você reúne as invariantes do seu marketplace, valida nos testes de aceitação e emite seu Certificado de Conclusão com QR Code público.",
    whatYouWillBuild:
      "Submissão final avaliada por rubrica técnica e emissão do seu certificado verificável.",
    primaryStation: "deploy",
    primaryStationTitle: "Revisar Publicação R$ 0 & Preparar Link para o Certificado",
    primaryStationWhy:
      "Garanta que seu repositório GitHub e sua URL de demonstração estão no ar para submeter ao certificado.",
    primaryStationCta: "Conferir Deploy & Repositório para o Certificado →",
  },
};

export function getLessonQuestBriefing(lessonSlug: string): LessonQuestBriefing {
  return (
    LESSON_QUEST_BRIEFINGS[lessonSlug] ?? {
      lessonSlug,
      actId: "act-4-walls-api",
      actNumber: 4,
      phaseBadge: "Jornada de Engenharia · Construção Guiada",
      houseRoomLabel: "Construção Passo a Passo do Marketplace",
      whyBeforeCode:
        "Cada fase constrói uma peça real do seu sistema: primeiro entendemos o problema, depois vemos a planta e então praticamos na arena dedicada.",
      whatYouWillBuild: "Regra prática validada por testes automatizados.",
      primaryStation: "sandbox",
      primaryStationTitle: "Oficina Prática desta Fase",
      primaryStationWhy: "Pratique o conceito desta aula em tela cheia com feedback imediato.",
      primaryStationCta: "Abrir Arena Prática desta Fase →",
    }
  );
}
