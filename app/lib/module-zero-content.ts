/* ------------------------------------------------------------------ */
/*  Conteúdo didático do Módulo 0 — Fundamentos (F01 a F06)            */
/*  Baseado no material verificado em 13/11/2026 (Windows 11,          */
/*  Python 3.12.10, Django 5.1.4, DRF 3.15.2).                         */
/* ------------------------------------------------------------------ */

export type GlossaryTerm = {
  term: string;
  definition: string;
  association: string;
  lesson: string;
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "API", definition: "O cardápio com regras: o que se pode pedir, como pedir e o que volta", association: "O cardápio do delivery", lesson: "F01, F04" },
  { term: "App (Django)", definition: "Um departamento do projeto, com um assunto só", association: "A confeitaria", lesson: "F03" },
  { term: "Arrange-Act-Assert", definition: "Preparar, agir, conferir: as 3 partes de um teste", association: "Ingredientes, cozinhar, provar", lesson: "F05" },
  { term: "Back-end", definition: "O que roda no servidor: regras e dados", association: "A cozinha", lesson: "F01" },
  { term: "Banco de dados", definition: "Programa que guarda dados com segurança e os acha rápido", association: "A despensa", lesson: "F01" },
  { term: "Branch (ramo)", definition: "Cópia paralela do projeto para trabalhar sem mexer na versão estável", association: "Um caderno de rascunho", lesson: "F05" },
  { term: "Celery", definition: "Programa que executa tarefas demoradas fora do atendimento", association: "O auxiliar de cozinha", lesson: "F01, F06" },
  { term: "CI", definition: "Os testes rodando sozinhos a cada mudança enviada", association: "O fiscal que prova antes de servir", lesson: "F05" },
  { term: "Commit", definition: "Uma versão do projeto: foto + frase + autor + data", association: "Uma página do caderno de receitas", lesson: "F05" },
  { term: "Container (Docker)", definition: "O programa com tudo de que precisa, rodando igual em qualquer lugar", association: "A marmita padronizada", lesson: "F01" },
  { term: "DEBUG", definition: "Modo que mostra detalhes dos erros: só em desenvolvimento", association: "A cozinha com a porta aberta", lesson: "F03" },
  { term: "Django", definition: "Framework Python 'de baterias incluídas' para sistemas web", association: "A cozinha industrial montada", lesson: "F01, F03" },
  { term: "DRF", definition: "Django REST Framework: transforma o Django em API", association: "O kit de delivery", lesson: "F01, F04" },
  { term: "Framework", definition: "Estrutura que chama o seu código na hora certa", association: "A cozinha montada (biblioteca é a faca)", lesson: "F01" },
  { term: "Front-end", definition: "O que roda no aparelho do cliente: a tela", association: "O salão e o cardápio", lesson: "F01" },
  { term: "Git", definition: "Programa que guarda todas as versões do projeto", association: "O caderno de receitas", lesson: "F05" },
  { term: "HTTP", definition: "A língua em que cliente e servidor se falam", association: "A língua da comanda", lesson: "F01" },
  { term: "HTTPS", definition: "HTTP com criptografia", association: "A comanda em envelope lacrado", lesson: "F01" },
  { term: "JSON", definition: "Formato de texto em que os dados viajam", association: "O bilhete legível", lesson: "F01, F04" },
  { term: "JWT", definition: "Token assinado que prova quem é o usuário em cada pedido", association: "O crachá", lesson: "F04, F06" },
  { term: "manage.py", definition: "Programa que recebe ordens para o projeto Django", association: "O painel de comando", lesson: "F03" },
  { term: "Migração", definition: "Arquivo que descreve uma mudança na estrutura do banco, versionado", association: "A planta de reforma", lesson: "F01, F03" },
  { term: "Model", definition: "Classe Python que descreve uma tabela", association: "A ficha da prateleira", lesson: "F01, F03" },
  { term: "ORM", definition: "Tradutor entre Python e SQL", association: "O tradutor da despensa", lesson: "F01, F03" },
  { term: "PATH", definition: "Lista de pastas onde o Windows procura programas", association: "O mapa de onde ficam as ferramentas", lesson: "F02" },
  { term: "pip", definition: "Instalador de bibliotecas Python", association: "O comprador de ingredientes", lesson: "F02" },
  { term: "PostgreSQL", definition: "Banco de dados robusto, usado em produção", association: "A despensa profissional", lesson: "F01" },
  { term: "Projeto (Django)", definition: "A configuração e o ponto de entrada do sistema inteiro", association: "O restaurante inteiro", lesson: "F03" },
  { term: "Redis", definition: "Memória rápida para filas e avisos", association: "O quadro de recados", lesson: "F01" },
  { term: "Regressão", definition: "Quebrar algo que funcionava ao mudar outra coisa", association: "O prato que piorou ao mudar a receita", lesson: "F05" },
  { term: "Requisição / resposta", definition: "O pedido do cliente e a resposta do servidor", association: "A comanda e o prato", lesson: "F01" },
  { term: "requirements.txt", definition: "Lista de bibliotecas com versões fixas", association: "A lista de compras", lesson: "F02" },
  { term: "Router", definition: "Gera as rotas a partir dos viewsets", association: "O garçom que anota os endereços", lesson: "F04" },
  { term: "Rota (URL)", definition: "Endereço do pedido e quem o atende", association: "O endereço no cardápio", lesson: "F01, F04" },
  { term: "SECRET_KEY", definition: "Chave que assina sessões e links; nunca no Git", association: "O carimbo da casa", lesson: "F03" },
  { term: "Serializer", definition: "Valida o que entra e converte o que sai em JSON", association: "O conferente e o empacotador", lesson: "F04" },
  { term: "Servidor", definition: "Programa que fica esperando pedidos e responde", association: "O restaurante aberto", lesson: "F01" },
  { term: "Status HTTP", definition: "Número que diz se o pedido deu certo (2xx), foi mal feito (4xx) ou o servidor falhou (5xx)", association: "A nota do atendimento", lesson: "F01, F04" },
  { term: "Teste automatizado", definition: "Código que prova que outro código faz o prometido", association: "O degustador padrão", lesson: "F05" },
  { term: "venv (ambiente virtual)", definition: "Pasta com Python e bibliotecas isolados por projeto", association: "A caixa de ferramentas do projeto", lesson: "F02" },
  { term: "View", definition: "Código que atende um pedido e aplica a regra", association: "O cozinheiro", lesson: "F01, F04" },
  { term: "ViewSet", definition: "View com listar, criar, detalhar, editar e apagar prontos", association: "O cozinheiro com ações prontas", lesson: "F04" },
  { term: "Webhook", definition: "Aviso que um serviço externo envia ao seu servidor quando algo acontece", association: "O entregador que toca a campainha", lesson: "F01" },
  { term: "WebSocket", definition: "Conexão que fica aberta para avisos em tempo real", association: "O interfone", lesson: "F01" },
];

export type RestaurantStation = {
  id: string;
  station: string;
  tech: string;
  why: string;
  inMySuperStore: string;
};

export const RESTAURANT_STATIONS: RestaurantStation[] = [
  { id: "salao", station: "O salão e o cardápio", tech: "Front-end (Next.js + React)", why: "O cliente precisa de uma tela clara e rápida para navegar e pedir.", inMySuperStore: "Next.js + React hospedado na Vercel" },
  { id: "comanda", station: "A comanda", tech: "Requisição HTTP + JSON", why: "Salão e cozinha precisam falar uma língua combinada para trocar dados.", inMySuperStore: "POST /api/v1/orders/" },
  { id: "porteiro", station: "O porteiro", tech: "Proxy reverso e HTTPS", why: "Criptografa a comanda no caminho e confere o certificado.", inMySuperStore: "Caddy com TLS automático" },
  { id: "garcom", station: "O maître / garçom", tech: "Rotas (urls.py)", why: "Lê o endereço da comanda e encaminha para a estação certa.", inMySuperStore: "config/urls.py e apps/*/urls.py" },
  { id: "conferente", station: "O conferente", tech: "Serializer (DRF)", why: "Valida se o pedido está completo antes de entrar e empacota a resposta.", inMySuperStore: "apps/orders/serializers.py" },
  { id: "cozinheiro", station: "O cozinheiro", tech: "View / ViewSet", why: "Aplica as regras de negócio (ex.: tem estoque? quanto custa?).", inMySuperStore: "apps/orders/views.py" },
  { id: "despensa", station: "A despensa", tech: "Banco de dados (PostgreSQL)", why: "Guarda as informações de forma permanente, organizada e exata.", inMySuperStore: "PostgreSQL 15" },
  { id: "tradutor", station: "O tradutor da despensa", tech: "ORM + Model + Migração", why: "Você escreve classes Python (Model), o ORM traduz para SQL e a Migração versiona reformas.", inMySuperStore: "apps/orders/models.py + migrations/" },
  { id: "delivery", station: "O delivery", tech: "API REST (Django REST Framework)", why: "Entrega embalagens JSON para qualquer cliente (site, app ou parceiro).", inMySuperStore: "Django REST Framework" },
  { id: "auxiliar", station: "O auxiliar de cozinha", tech: "Fila de tarefas (Celery + Redis)", why: "Executa trabalho demorado (como expirar pedido vencido) sem travar o balcão.", inMySuperStore: "Celery + Celery Beat + Redis" },
  { id: "interfone", station: "O interfone cozinha ↔ mesa", tech: "WebSocket", why: "Avisa a tela na hora em que o PIX cai, sem o cliente perguntar toda hora.", inMySuperStore: "Django Channels + Daphne" },
  { id: "marmita", station: "A marmita padronizada", tech: "Container (Docker)", why: "Empacota código e dependências para rodar igual no seu PC e no servidor.", inMySuperStore: "Dockerfile + Docker Compose" },
];

export type QuizOptionExplained = {
  text: string;
  whyNot?: string;
};

export type M0QuizItem = {
  id: string;
  question: string;
  options: QuizOptionExplained[];
  correctIndex: number;
  explanation: string;
};

export type M0LessonData = {
  slug: string;
  code: string;
  title: string;
  oneSentence: string;
  guideQuestion: string;
  metaNote: string;
  predict: { question: string; answer: string }[];
  coreSections: {
    heading: string;
    paragraphs: string[];
    codeBlock?: { title: string; code: string; lineNotes?: [string, string][] };
    table?: { headers: string[]; rows: string[][] };
  }[];
  breakExperiment: {
    title: string;
    setup: string;
    whatHappens: string;
    lessonLearned: string;
  };
  pitfalls: { wrong: string; right: string; why: string }[];
  exercises: { prompt: string; hint: string; answer: string }[];
  quizzes: M0QuizItem[];
  flashcards: { front: string; back: string }[];
  threeThings: string[];
};

export const MODULE_ZERO_LESSONS: Record<string, M0LessonData> = {
  "modulo-0-f01-o-mapa": {
    slug: "modulo-0-f01-o-mapa",
    code: "F01",
    title: "O mapa: o que é cada peça e por que ela existe",
    oneSentence:
      "Um sistema como o MySuperStore é um restaurante: cada tecnologia é um posto de trabalho com uma função clara.",
    guideQuestion:
      "Quando alguém toca em 'Comprar', quais peças de software acordam e por que cada uma precisa existir?",
    metaNote: "Tempo estimado: 1h30 · Não instala nada ainda: primeiro o mapa, depois a bancada.",
    predict: [
      {
        question: "1. Uma cliente toca em 'Comprar'. O pedido passa por quantos computadores diferentes até ser gravado de forma definitiva?",
        answer:
          "Pelo menos três: o celular (que mostra a tela), o servidor da loja (que decide e grava) e o banco de dados (onde a linha fica salva). No MySuperStore ainda entram a hospedagem da tela e o provedor de pagamento (Efí).",
      },
      {
        question: "2. Onde fica gravado o fato 'esta bolsa foi vendida': no celular dela, na tela do site ou em outro lugar?",
        answer:
          "No banco de dados. O celular e a tela só mostram. Quem manda é quem grava — por isso a regra 'tem estoque?' nunca pode ficar só no navegador.",
      },
      {
        question: "3. Se o servidor cair no meio do caminho, o pedido existe ou não?",
        answer:
          "Depende de quando caiu: se foi antes de gravar no banco, não existe. Se foi depois, existe no banco mesmo que a cliente não tenha visto a tela de confirmação. Resolver isso envolve transações e idempotência.",
      },
    ],
    coreSections: [
      {
        heading: "1. A viagem de um pedido (do toque ao banco)",
        paragraphs: [
          "Quando a cliente toca em Comprar, a tela (Front-end) monta uma comanda em formato JSON e envia pela rede via HTTPS. O porteiro (Caddy) confere o certificado e entrega ao Django.",
          "Lá dentro, o garçom (urls.py) direciona para o cozinheiro (View), o conferente (Serializer) valida os dados, o cozinheiro consulta a despensa (PostgreSQL) via tradutor (ORM) e grava o pedido. Só então volta a resposta '201 Criado' em JSON.",
        ],
        codeBlock: {
          title: "Fluxo completo da requisição",
          code: `Celular (Next.js) --[HTTPS + JSON]--> Caddy (porteiro)
  --> urls.py (garçom) --> serializer (conferente) --> view (cozinheiro)
  --> ORM (tradutor) --> PostgreSQL (despensa)
  <-- Resposta JSON "201 Criado" <--`,
        },
      },
      {
        heading: "2. Onde a analogia do restaurante quebra (muito importante!)",
        paragraphs: [
          "Toda analogia ajuda a lembrar, mas ela não é a coisa real. Na internet, três fenômenos acontecem que não existem num restaurante comum:",
          "1) Mil clientes na mesma última unidade: um restaurante atende uma mesa por vez; na web, duas pessoas clicam em 'Comprar' no mesmo milissegundo. Sem trava no banco, você vende a mesma peça duas vezes.",
          "2) O entregador que toca a campainha duas vezes: o provedor de pagamento pode enviar o mesmo webhook repetido se a rede oscilar. Sem idempotência, você confirma e repassa duas vezes.",
          "3) O cliente pode falsificar a comanda: no navegador, qualquer pessoa pode abrir o DevTools e tentar enviar preço R$ 0,01. O servidor precisa recalcular tudo.",
        ],
      },
    ],
    breakExperiment: {
      title: "Remover a validação no servidor e confiar só no navegador",
      setup: "Imagine um checkout onde o navegador envia { produto_id: 1, preco_total: '0.01' } e a View grava direto sem consultar o preço no banco.",
      whatHappens: "Qualquer usuário técnico altera o JSON no navegador antes do envio e compra um produto de R$ 200,00 por R$ 0,01.",
      lessonLearned: "Quem mostra (front-end) nunca decide valor nem estoque. Quem decide e recalcula é sempre o back-end consultando o banco.",
    },
    pitfalls: [
      { wrong: "Achar que o navegador guarda o estoque oficial", right: "O banco de dados (PostgreSQL) é a única fonte da verdade", why: "Dados no navegador podem ser alterados pelo usuário e somem se trocar de aparelho." },
      { wrong: "Confundir Framework (Django) com Biblioteca", right: "Biblioteca você chama (ex.: math); Framework chama o seu código na hora certa", why: "No Django, você escreve views e models e o framework orquestra o ciclo HTTP." },
    ],
    exercises: [
      {
        prompt: "Mapeie no papel: se um cliente reclamar 'paguei o PIX e a tela não atualizou sozinha', quais dois postos do restaurante estão envolvidos?",
        hint: "Pense em quem avisa o servidor que o dinheiro caiu e quem mantém o canal aberto com a tela.",
        answer: "O Webhook (entregador do provedor de pagamento tocando a campainha do servidor) e o WebSocket (interfone entre a cozinha e a mesa para atualizar a tela na hora).",
      },
    ],
    quizzes: [
      {
        id: "f01-q1",
        question: "Na analogia do restaurante, qual peça valida o JSON que entra e formata o JSON que sai?",
        options: [
          { text: "O garçom (urls.py)", whyNot: "O garçom (urls.py) apenas lê o endereço da rota e encaminha para a view certa; ele não valida campos do JSON." },
          { text: "O conferente (Serializer)", },
          { text: "A despensa (PostgreSQL)", whyNot: "A despensa guarda as tabelas de forma permanente; ela não converte requisições HTTP em JSON." },
          { text: "O porteiro (Caddy)", whyNot: "O porteiro cuida de HTTPS e encaminhamento de rede, não das regras de campos de cada formulário." },
        ],
        correctIndex: 1,
        explanation: "O Serializer do DRF atua como conferente na entrada (validando tipos e limites) e empacotador na saída (convertendo objetos Python em JSON).",
      },
      {
        id: "f01-q2",
        question: "Por que a analogia do restaurante quebra quando falamos de concorrência na internet?",
        options: [
          { text: "Porque restaurantes não usam JSON", whyNot: "JSON é apenas o formato da comanda; a quebra conceitual está no paralelismo das requisições." },
          { text: "Porque duas requisições podem chegar no mesmo milissegundo disputando a última unidade no banco" },
          { text: "Porque o servidor não usa banco de dados", whyNot: "Todo back-end transacional usa banco de dados para persistência." },
          { text: "Porque HTTPS impede mais de um cliente por vez", whyNot: "HTTPS criptografa a conexão; milhares de clientes se conectam em paralelo via HTTPS." },
        ],
        correctIndex: 1,
        explanation: "Em um sistema web, várias threads/processos leem a mesma linha do banco ao mesmo tempo. Sem atualização condicional ou trava, duas vendas da mesma peça única podem passar.",
      },
    ],
    flashcards: [
      { front: "Qual é a diferença entre Front-end e Back-end?", back: "Front-end (salão) roda no aparelho do cliente e mostra a interface. Back-end (cozinha) roda no servidor, aplica regras e grava no banco." },
      { front: "Para que serve o ORM (Object-Relational Mapping)?", back: "Traduz classes e chamadas em Python para comandos SQL no banco de dados, evitando SQL repetitivo e facilitando manutenção." },
      { front: "O que é um Webhook?", back: "Um aviso HTTP enviado por um serviço externo (ex.: Efí Bank) para o seu servidor quando um evento acontece (ex.: PIX pago)." },
    ],
    threeThings: [
      "Quem mostra (front-end) não decide; quem decide e grava é o back-end no banco de dados.",
      "Cada tecnologia resolve um problema específico — não decore nomes, entenda o posto de trabalho.",
      "Na web, requisições chegam em paralelo e falham no meio: por isso existem travas, transações e idempotência.",
    ],
  },

  "modulo-0-f02-preparando-a-bancada": {
    slug: "modulo-0-f02-preparando-a-bancada",
    code: "F02",
    title: "Preparando a bancada: instalar Python, Git e venv no Windows",
    oneSentence:
      "Antes de cozinhar, você monta a bancada: fogão (Python), caixa de ferramentas própria (venv) e caderno de receitas (Git).",
    guideQuestion:
      "O que exatamente eu instalo, em que ordem, e como sei que deu certo antes de escrever uma linha de código?",
    metaNote: "Tempo estimado: 1h30 · Testado em Windows 11, Python 3.12.10, Django 5.1.4 e DRF 3.15.2 (13/11/2026).",
    predict: [
      {
        question: "1. Você instala o Django direto no Python global do PC para dois projetos (um precisa do Django 4, outro do Django 5). O que acontece?",
        answer:
          "Conflito! Só pode haver uma versão de um pacote no Python global. Um dos projetos quebra. O ambiente virtual (venv) dá a cada projeto sua própria caixa de ferramentas.",
      },
      {
        question: "2. Para que serve o arquivo requirements.txt?",
        answer:
          "É a lista de compras com versões fixas do projeto. Com ela, qualquer colega ou servidor recria exatamente o mesmo ambiente com um comando.",
      },
      {
        question: "3. Você digita 'python --version' no Windows e dá erro. Significa que o Python não está instalado?",
        answer:
          "Não necessariamente. Pode estar instalado fora do PATH ou apontando para o atalho da Microsoft Store. No Windows, usar 'py --version' resolve porque o instalador oficial registra o launcher 'py'.",
      },
    ],
    coreSections: [
      {
        heading: "1. Cinco comandos do terminal (PowerShell) que bastam",
        paragraphs: [
          "Quase todo erro de iniciante no terminal é estar na pasta errada. Antes de rodar qualquer comando, confira onde você está com pwd.",
        ],
        table: {
          headers: ["Comando", "O que faz", "Associação"],
          rows: [
            ["pwd", "Mostra em qual pasta você está", "Em que sala estou?"],
            ["ls", "Lista os arquivos e pastas aqui dentro", "Olhar a prateleira"],
            ["cd pasta", "Entra em uma pasta", "Ir para outra sala"],
            ["cd ..", "Volta uma pasta acima", "Voltar uma sala"],
            ["mkdir nome", "Cria uma pasta nova", "Montar uma prateleira"],
          ],
        },
      },
      {
        heading: "2. Criando o ambiente virtual (.venv) e travando versões",
        paragraphs: [
          "Ao instalar o Python no Windows pelo instalador oficial (python.org), marque obrigatoriamente a caixa 'Add python.exe to PATH'. Depois, crie a pasta do projeto, gere o ambiente virtual e instale as versões testadas:",
        ],
        codeBlock: {
          title: "Sequência exata executada no PowerShell (Windows 11)",
          code: `mkdir mini-loja
cd mini-loja
py -3.12 -m venv .venv
.venv\\Scripts\\python -m pip install --upgrade pip
.venv\\Scripts\\python -m pip install django==5.1.4 djangorestframework==3.15.2
.venv\\Scripts\\python -m pip freeze > requirements.txt
.venv\\Scripts\\python -m django --version`,
          lineNotes: [
            ["py -3.12 -m venv .venv", "Cria a caixa de ferramentas isolada na pasta .venv"],
            [".venv\\Scripts\\python ...", "Garante que você usa o Python de dentro da caixa, sem depender de ativação"],
            ["django==5.1.4", "Versão fixa: evita que uma atualização futura quebre o código da aula"],
            ["pip freeze > requirements.txt", "Salva a lista exata de pacotes instalados"],
          ],
        },
      },
    ],
    breakExperiment: {
      title: "Esquecer o .venv e tentar rodar django fora da caixa",
      setup: "Em uma pasta nova sem ambiente virtual, digite django-admin --version no PowerShell.",
      whatHappens: "O Windows responde que o termo 'django-admin' não é reconhecido como nome de cmdlet ou programa.",
      lessonLearned: "As bibliotecas instaladas dentro do .venv só existem lá dentro. Sempre prefixe com .venv\\Scripts\\python (ou ative o ambiente).",
    },
    pitfalls: [
      { wrong: "Usar 'pip install django' sem versão fixa", right: "Usar 'django==5.1.4' e registrar em requirements.txt", why: "Sem versão fixa, outro computador pode instalar uma versão incompatível meses depois." },
      { wrong: "Ignorar 'Add python.exe to PATH' no instalador", right: "Marcar a opção no instalador e testar com py --version", why: "Sem PATH ou launcher py, o terminal não encontra o executável." },
    ],
    exercises: [
      {
        prompt: "Se você baixar um projeto Django do GitHub que já tem um requirements.txt, quais 3 comandos montam a bancada dele no Windows?",
        hint: "Criar o venv, atualizar o pip (opcional) e instalar a partir do arquivo com -r.",
        answer: "1) py -3.12 -m venv .venv  2) .venv\\Scripts\\python -m pip install -r requirements.txt  3) .venv\\Scripts\\python manage.py --version",
      },
    ],
    quizzes: [
      {
        id: "f02-q1",
        question: "Por que criamos um ambiente virtual (.venv) para cada projeto Python?",
        options: [
          { text: "Para o Python rodar mais rápido no Windows", whyNot: "O venv não altera a velocidade do interpretador; ele isola pacotes." },
          { text: "Para isolar as bibliotecas e versões de cada projeto sem gerar conflito global" },
          { text: "Porque o Django exige conexão com a nuvem sem venv", whyNot: "Django roda localmente com ou sem venv, mas sem venv os projetos disputam versões." },
          { text: "Para substituir o Git no controle de versões", whyNot: "Git versiona seu código; venv isola dependências instaladas (e fica fora do Git!)." },
        ],
        correctIndex: 1,
        explanation: "Cada projeto tem suas próprias versões de bibliotecas no .venv. Assim, um projeto em Django 4 e outro em Django 5 convivem perfeitamente na mesma máquina.",
      },
      {
        id: "f02-q2",
        question: "O que significa 'django==5.1.4' no requirements.txt?",
        options: [
          { text: "Instale qualquer versão acima da 5.1.4", whyNot: "Isso seria '>=5.1.4'; o operador '==' fixa a versão exata." },
          { text: "Instale exatamente a versão 5.1.4 do Django" },
          { text: "Desinstale o Django 5.1.4", whyNot: "pip install instala o pacote; desinstalar exige pip uninstall." },
          { text: "É um comentário ignorado pelo pip", whyNot: "Comentários em requirements.txt começam com '#'." },
        ],
        correctIndex: 1,
        explanation: "Fixar versões com '==' garante reprodutibilidade: quem rodar o projeto hoje ou daqui a um ano terá exatamente o mesmo comportamento testado.",
      },
    ],
    flashcards: [
      { front: "O que é o PATH no Windows?", back: "Lista de pastas onde o sistema operacional procura programas quando você digita um comando no terminal." },
      { front: "Para que serve o pip?", back: "É o instalador oficial de pacotes Python (o comprador de ingredientes)." },
      { front: "A pasta .venv deve ir para o Git?", back: "Não! Ela é pesada e específica da máquina. Para o Git vai apenas o requirements.txt." },
    ],
    threeThings: [
      "Confira sempre em que pasta você está (pwd) antes de rodar comandos.",
      "Cada projeto ganha seu próprio .venv para evitar conflito de versões.",
      "Trave as versões testadas no requirements.txt — nunca envie .venv para o Git.",
    ],
  },

  "modulo-0-f03-primeiro-projeto-django": {
    slug: "modulo-0-f03-primeiro-projeto-django",
    code: "F03",
    title: "Seu primeiro projeto Django: projeto × app, model e migração",
    oneSentence:
      "Você monta a cozinha (projeto), abre um departamento (app), escreve a ficha da prateleira (model) e vê o Django construir a tabela no banco (migração).",
    guideQuestion:
      "O que o Django cria, para que serve cada arquivo e como uma classe Python vira uma tabela no banco?",
    metaNote: "Tempo estimado: 2h · Requer F02 concluída e leitura básica de Python (classes e funções).",
    predict: [
      {
        question: "1. No Django, 'projeto' e 'app' são a mesma coisa?",
        answer:
          "Não. O projeto (ex.: minimarket) é o restaurante inteiro: configurações gerais e porta de entrada. Um app (ex.: catalogo) é um departamento. O MySuperStore tem 9 apps.",
      },
      {
        question: "2. Você escreve a classe Produto em models.py e roda direto 'manage.py migrate'. A tabela aparece no banco?",
        answer:
          "Não! O migrate só executa migrações que já existem. Antes dele, você precisa rodar 'makemigrations' para que o Django leia o model e crie o arquivo da migração.",
      },
      {
        question: "3. Quantas linhas de código você precisa para colocar o cadastro de produtos no painel admin pronto do Django?",
        answer:
          "Apenas 2 instruções (importar Produto e chamar admin.site.register(Produto)). O painel completo de listar, criar, editar e apagar já vem pronto.",
      },
    ],
    coreSections: [
      {
        heading: "1. Cada arquivo do projeto e seu posto no restaurante",
        paragraphs: [
          "Ao rodar startproject minimarket . e startapp catalogo, o Django cria uma estrutura organizada onde cada arquivo tem uma responsabilidade única:",
        ],
        table: {
          headers: ["Arquivo", "O que faz", "Posto no restaurante"],
          rows: [
            ["manage.py", "Recebe ordens (runserver, migrate, test, shell)", "Painel de comando da cozinha"],
            ["minimarket/settings.py", "Apps instalados, banco, idioma, DEBUG, SECRET_KEY", "Quadro de regras da casa"],
            ["minimarket/urls.py", "Tabela de rotas principais do sistema", "Garçom-chefe"],
            ["catalogo/models.py", "Classes Python que definem as tabelas", "Ficha de cada prateleira"],
            ["catalogo/migrations/", "Histórico versionado de mudanças no banco", "Plantas de reforma da despensa"],
            ["catalogo/admin.py", "Registra models no painel administrativo", "Sala do gerente"],
          ],
        },
      },
      {
        heading: "2. Do Model à Tabela: makemigrations → migrate → sqlmigrate",
        paragraphs: [
          "Repare no uso de DecimalField para dinheiro (nunca FloatField!) e CheckConstraint no banco para impedir estoque negativo mesmo fora do Python:",
        ],
        codeBlock: {
          title: "catalogo/models.py",
          code: `from django.db import models

class Produto(models.Model):
    nome = models.CharField(max_length=120)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(estoque__gte=0),
                name="estoque_nao_negativo",
            )
        ]`,
          lineNotes: [
            ["DecimalField", "Dinheiro exato em base 10; evita erros de ponto flutuante (0.1 + 0.2 != 0.3)"],
            ["CheckConstraint", "Garante no próprio SQL do banco que estoque nunca fica menor que zero"],
          ],
        },
      },
    ],
    breakExperiment: {
      title: "Esquecer o makemigrations antes do migrate",
      setup: "Adicione um campo novo (ex.: ativo = models.BooleanField(default=True)) em Produto e rode direto manage.py migrate.",
      whatHappens: "O Django exibe 'No migrations to apply.' e a coluna não é criada. Se você tentar acessar produto.ativo, recebe OperationalError: no such column.",
      lessonLearned: "O fluxo tem sempre dois passos: 1) makemigrations (gera a planta da reforma) e 2) migrate (executa a obra no banco).",
    },
    pitfalls: [
      { wrong: "Usar FloatField para preço ou comissão", right: "Usar DecimalField(max_digits=10, decimal_places=2)", why: "Float binário gera centavos errados em somas e multiplicações." },
      { wrong: "Esquecer de registrar o app em INSTALLED_APPS", right: "Adicionar 'catalogo' na lista INSTALLED_APPS de settings.py", why: "Sem isso, o Django ignora o app na hora de gerar migrações." },
    ],
    exercises: [
      {
        prompt: "Qual comando permite inspecionar o SQL exato (CREATE TABLE...) que a migração 0001 do app catalogo vai rodar no banco?",
        hint: "Começa com 'sql...' e recebe o nome do app e o número da migração.",
        answer: ".venv\\Scripts\\python manage.py sqlmigrate catalogo 0001",
      },
    ],
    quizzes: [
      {
        id: "f03-q1",
        question: "Qual é a ordem correta para transformar um Model novo em tabela no banco de dados?",
        options: [
          { text: "migrate → makemigrations", whyNot: "Rodar migrate antes não encontra a migração nova porque ela ainda não foi gerada." },
          { text: "makemigrations → migrate" },
          { text: "startapp → runserver", whyNot: "runserver sobe o servidor web, mas não cria tabelas no banco." },
          { text: "admin.site.register → migrate", whyNot: "admin.py apenas expõe o model no painel visual; não gera migração." },
        ],
        correctIndex: 1,
        explanation: "Primeiro makemigrations compara seu models.py com o histórico e cria o arquivo de migração; depois migrate aplica esse arquivo no banco.",
      },
      {
        id: "f03-q2",
        question: "Por que o model Produto usa DecimalField para preço em vez de FloatField?",
        options: [
          { text: "Porque FloatField não aceita números positivos", whyNot: "FloatField aceita positivos e negativos, mas com imprecisão binária." },
          { text: "Porque ponto flutuante binário gera erros de arredondamento em centavos" },
          { text: "Porque o Django proíbe FloatField em qualquer projeto", whyNot: "FloatField existe no Django (ex.: para coordenadas ou medições físicas), mas é inadequado para dinheiro." },
          { text: "Porque DecimalField ocupa menos espaço que booleano", whyNot: "Booleano ocupa 1 bit/byte; DecimalField armazena precisão decimal exata." },
        ],
        correctIndex: 1,
        explanation: "Dinheiro exige base decimal exata. Em float, 0.1 + 0.2 resulta em 0.30000000000000004; em DecimalField, o cálculo é exato.",
      },
    ],
    flashcards: [
      { front: "Qual a diferença entre Projeto e App no Django?", back: "Projeto é a configuração geral do sistema (restaurante); App é um módulo focado em um assunto (departamento, ex.: catalogo, orders)." },
      { front: "Para que serve o manage.py?", back: "É o painel de comando do projeto Django para rodar servidor, migrações, shell e testes." },
      { front: "O que significa DEBUG = True?", back: "Exibe páginas detalhadas de erro para ajudar no desenvolvimento. Nunca deve ficar True em produção!" },
    ],
    threeThings: [
      "Projeto é o restaurante inteiro; app é cada departamento especializado.",
      "Alterou models.py? Sempre rode makemigrations e depois migrate.",
      "Dinheiro vai sempre em DecimalField (nunca float) e regras críticas têm CheckConstraint no banco.",
    ],
  },

  "modulo-0-f04-primeira-api-com-drf": {
    slug: "modulo-0-f04-primeira-api-com-drf",
    code: "F04",
    title: "Sua primeira API com DRF: serializer, viewset, router e status HTTP",
    oneSentence:
      "Até agora a cozinha servia só no salão (admin); agora montamos o delivery em JSON para qualquer site ou app pedir.",
    guideQuestion:
      "Como o catálogo vira um serviço que qualquer tela chama e como a API se defende de pedido ruim?",
    metaNote: "Tempo estimado: 2h · Em F04 você provoca os status 200, 201, 400, 404, 405 e 409.",
    predict: [
      {
        question: "1. Um cliente envia {'nome': '', 'preco': 'abc'} para criar um produto. O que o servidor responde?",
        answer:
          "Status 400 (Bad Request) com a lista exata dos campos inválidos em português, sem gravar nada no banco.",
      },
      {
        question: "2. Um pedido deve aceitar {'status': 'confirmado'} vindo do navegador na criação?",
        answer:
          "Nunca! Se o cliente puder escolher o status, qualquer pessoa marca o pedido como pago sem pagar. Campos controlados pelo servidor ficam em read_only_fields.",
      },
    ],
    coreSections: [
      {
        heading: "1. O trio do DRF: Serializer, ViewSet e Router",
        paragraphs: [
          "No Django REST Framework, três peças trabalham juntas: o Serializer (conferente que valida e converte para JSON), o ViewSet (cozinheiro com as ações prontas de listar, criar, detalhar, editar e apagar) e o Router (garçom que gera todas as URLs automaticamente).",
        ],
        codeBlock: {
          title: "Ação de compra com baixa condicional de estoque (views.py)",
          code: `@action(detail=True, methods=["post"])
def comprar(self, request, pk=None):
    qtd = int(request.data.get("quantidade", 1))
    if qtd <= 0:
        return Response({"erro": "Quantidade deve ser maior que zero."}, status=400)
    atualizados = Produto.objects.filter(
        pk=pk, estoque__gte=qtd
    ).update(estoque=F("estoque") - qtd)
    if atualizados == 0:
        return Response({"erro": "Estoque insuficiente."}, status=409)
    return Response({"ok": True}, status=200)`,
          lineNotes: [
            ["estoque__gte=qtd", "A verificação e a subtração acontecem juntas em um único UPDATE no banco"],
            ["status=409", "Conflict: o formato do pedido estava certo (não é 400), mas conflita com o estoque atual"],
          ],
        },
      },
    ],
    breakExperiment: {
      title: "Remover o filtro estoque__gte=qtd do UPDATE",
      setup: "Trocar Produto.objects.filter(pk=pk, estoque__gte=qtd).update(...) por uma leitura seguida de save().",
      whatHappens: "Se duas requisições chegarem juntas para a última unidade, ambas leem estoque = 1 e ambas vendem! Ou o CheckConstraint do banco estoura erro 500.",
      lessonLearned: "Baixa de estoque em marketplace precisa de atualização condicional atômica no banco, retornando 409 Conflict quando não há saldo.",
    },
    pitfalls: [
      { wrong: "Retornar 200 OK com { 'erro': '...' } no corpo", right: "Usar o código de status HTTP adequado (400, 404, 409)", why: "Clientes e ferramentas de monitoramento olham primeiro o status HTTP." },
      { wrong: "Deixar campos de status ou total editáveis pelo cliente", right: "Declarar read_only_fields no Serializer e calcular no servidor", why: "Evita fraude de preço e de pagamento." },
    ],
    exercises: [
      {
        prompt: "Qual é a diferença prática entre receber um 400 Bad Request e um 409 Conflict ao tentar comprar?",
        hint: "Um diz respeito ao formato/validade dos dados; o outro ao estado atual do recurso no banco.",
        answer: "400 significa que o cliente mandou dados malformados ou inválidos (ex.: quantidade = -2 ou texto no lugar de número). 409 significa que os dados são válidos, mas conflitam com o estado atual (ex.: estoque insuficiente).",
      },
    ],
    quizzes: [
      {
        id: "f04-q1",
        question: "Um cliente envia DELETE para /api/produtos/ (sem ID). Qual código HTTP o DRF retorna?",
        options: [
          { text: "204 No Content", whyNot: "204 só acontece quando se apaga um item específico (/api/produtos/1/)." },
          { text: "404 Not Found", whyNot: "A rota /api/produtos/ existe (aceita GET e POST), então não é 404." },
          { text: "405 Method Not Allowed" },
          { text: "500 Internal Server Error", whyNot: "O DRF trata métodos não permitidos de forma limpa com 405, não com erro 500." },
        ],
        correctIndex: 2,
        explanation: "A rota de coleção /api/produtos/ aceita GET (listar) e POST (criar), mas não DELETE. Quando o endereço existe e o verbo HTTP não é aceito ali, a resposta padrão é 405.",
      },
      {
        id: "f04-q2",
        question: "Para que serve 'read_only_fields' em um ModelSerializer?",
        options: [
          { text: "Para esconder o campo na resposta JSON", whyNot: "Para esconder na saída usa-se write_only=True ou remove-se de fields." },
          { text: "Para impedir que o cliente envie ou altere aquele campo na entrada, mantendo-o visível na saída" },
          { text: "Para tornar a tabela somente leitura no PostgreSQL", whyNot: "read_only_fields atua na camada do Serializer (API), não no banco." },
          { text: "Para acelerar consultas SELECT", whyNot: "Não afeta índices nem consultas SQL." },
        ],
        correctIndex: 1,
        explanation: "Campos como id, total calculado ou status do pedido devem aparecer na resposta (leitura), mas nunca ser aceitos como escolha do cliente na entrada.",
      },
    ],
    flashcards: [
      { front: "O que significa Status 201?", back: "Created: requisição bem-sucedida que criou um novo recurso no servidor (ex.: POST /api/produtos/)." },
      { front: "Diferença entre 400 e 404?", back: "400 = pedido mal feito (validação falhou). 404 = endereço ou recurso não encontrado." },
      { front: "Qual o papel do Router no DRF?", back: "Gera automaticamente as rotas REST (/api/produtos/ e /api/produtos/{id}/) a partir de um ViewSet." },
    ],
    threeThings: [
      "Serializer valida a entrada e embala a saída; ViewSet executa; Router cria os endereços.",
      "Use códigos HTTP honestos: 200, 201, 400, 404, 405 e 409 contam exatamente o que aconteceu.",
      "Nunca confie em preço ou status vindo do cliente: use read_only_fields e recalcule no servidor.",
    ],
  },

  "modulo-0-f05-testes-e-git": {
    slug: "modulo-0-f05-testes-e-git",
    code: "F05",
    title: "Provar que funciona: testes automáticos, Git e regra dos segredos",
    oneSentence:
      "Teste é o degustador padrão que prova todos os pratos em segundos; Git é o caderno de receitas que guarda cada versão — sem senhas dentro.",
    guideQuestion:
      "Como sei, sem testar à mão, que o sistema continua certo após cada mudança, e como guardo o histórico sem vazar segredos?",
    metaNote: "Tempo estimado: 2h · Inclui prática de quebrar o código de propósito e .gitignore obrigatório.",
    predict: [
      {
        question: "1. Ao rodar 'manage.py test', o Django usa o seu banco de dados de verdade com os produtos que você cadastrou?",
        answer:
          "Não! O Django cria um banco temporário isolado, roda todos os testes e destrói esse banco ao final. Seus dados locais ficam intactos.",
      },
      {
        question: "2. Você enviou um arquivo .env com senhas para o Git sem querer e depois apagou o arquivo no commit seguinte. O problema acabou?",
        answer:
          "Não! O Git guarda todo o histórico de commits. Quem clonar ou olhar o histórico ainda vê a senha. Segredo que entrou no Git deve ser considerado vazado e trocado imediatamente.",
      },
    ],
    coreSections: [
      {
        heading: "1. Anatomia de um teste: Arrange, Act, Assert",
        paragraphs: [
          "Todo teste automatizado claro tem três blocos: preparar a cena (Arrange), executar a ação (Act) e conferir o resultado (Assert).",
        ],
        codeBlock: {
          title: "catalogo/tests.py — Testando estoque insuficiente (409)",
          code: `def test_comprar_acima_do_estoque_retorna_409(self):
    # 1. Arrange (preparar)
    p = Produto.objects.create(nome="Bolsa", preco=Decimal("100.00"), estoque=1)
    client = APIClient()

    # 2. Act (agir)
    resp = client.post(f"/api/produtos/{p.id}/comprar/", {"quantidade": 2}, format="json")

    # 3. Assert (conferir)
    self.assertEqual(resp.status_code, 409)
    p.refresh_from_db()
    self.assertEqual(p.estoque, 1)`,
        },
      },
      {
        heading: "2. .gitignore antes do primeiro commit",
        paragraphs: [
          "Antes de rodar git add ., crie o arquivo .gitignore para impedir que .venv/, db.sqlite3, __pycache__/ e arquivos .env entrem no repositório.",
        ],
      },
    ],
    breakExperiment: {
      title: "Quebrar o código de propósito para provar que o teste pega",
      setup: "Na view de comprar, altere temporariamente o status de retorno de estoque insuficiente de 409 para 200 e rode .venv\\Scripts\\python manage.py test.",
      whatHappens: "O terminal falha imediatamente com AssertionError: 200 != 409, apontando a linha exata do teste que detectou a regressão.",
      lessonLearned: "Um teste que nunca falhou pode estar testando a coisa errada. Ver o teste falhar quando a regra quebra prova que sua rede de segurança funciona.",
    },
    pitfalls: [
      { wrong: "Rodar 'git add .' sem criar .gitignore antes", right: "Criar .gitignore primeiro e conferir com 'git status'", why: "Evita subir milhares de arquivos da .venv ou vazar .env com senhas." },
      { wrong: "Testar tudo na mão só na tela alterada", right: "Rodar a suíte completa com manage.py test", why: "Alterar um arquivo pode causar regressão em outra rota sem você perceber." },
    ],
    exercises: [
      {
        prompt: "Escreva no papel os 3 passos (Arrange, Act, Assert) para testar que um produto com preço negativo é rejeitado com 400.",
        hint: "Prepare o APIClient, envie POST com preco '-10.00', confira status_code == 400.",
        answer: "Arrange: client = APIClient(). Act: resp = client.post('/api/produtos/', {'nome': 'Teste', 'preco': '-10.00'}, format='json'). Assert: self.assertEqual(resp.status_code, 400).",
      },
    ],
    quizzes: [
      {
        id: "f05-q1",
        question: "Se um arquivo .env com senha de banco foi commitado e enviado para o GitHub, o que você deve fazer?",
        options: [
          { text: "Apenas apagar o arquivo em um novo commit", whyNot: "O histórico antigo do Git continua expondo o conteúdo do commit anterior." },
          { text: "Considerar a senha vazada, revogar/trocar a credencial e remover o .env do rastreamento com .gitignore" },
          { text: "Mudar o nome do arquivo para .env.txt", whyNot: "Renomear mantém o segredo exposto no repositório." },
          { text: "Nada, porque o GitHub esconde arquivos que começam com ponto", whyNot: "Arquivos ocultos (dot-files) são exibidos normalmente no Git e no GitHub." },
        ],
        correctIndex: 1,
        explanation: "Uma vez que um segredo entra no histórico enviado ao remoto, ele deve ser rotacionado/trocado imediatamente, além de corrigir o .gitignore.",
      },
    ],
    flashcards: [
      { front: "O que significa Regressão em software?", back: "Quebrar uma funcionalidade que já funcionava ao fazer uma mudança em outro ponto do sistema." },
      { front: "Quais são as 3 partes de um teste (AAA)?", back: "Arrange (preparar dados), Act (executar ação), Assert (conferir resultado)." },
      { front: "Por que o .gitignore vem antes do primeiro commit?", back: "Para impedir que ambiente virtual (.venv), banco local e segredos (.env) entrem no histórico do Git." },
    ],
    threeThings: [
      "Testes automáticos rodam em banco temporário e protegem contra regressão em segundos.",
      "Quebre o código de propósito para ter certeza de que o teste realmente protege a regra.",
      "Crie o .gitignore antes do primeiro commit e nunca coloque segredos no Git.",
    ],
  },

  "modulo-0-f06-lendo-um-projeto-real": {
    slug: "modulo-0-f06-lendo-um-projeto-real",
    code: "F06",
    title: "Lendo um projeto de verdade: método aplicado ao MySuperStore",
    oneSentence:
      "Ler um repositório grande é chegar a um restaurante novo: primeiro a planta, depois o cardápio, depois seguir um pedido da mesa à cozinha.",
    guideQuestion:
      "Diante de um repositório com milhares de arquivos, por onde começo e como encontro o que preciso sem ler tudo?",
    metaNote: "Tempo estimado: 2h · Liga a trilha Fundamentos diretamente aos Módulos 1 a 9 do MySuperStore.",
    predict: [
      {
        question: "1. Você abre um projeto real com milhares de arquivos. Qual é a primeira coisa a ler?",
        answer:
          "O README e a estrutura de pastas da raiz — a planta do restaurante, nunca os arquivos soltos de código.",
      },
      {
        question: "2. Para entender como um pedido é criado no MySuperStore, quantos arquivos você precisa ler: centenas ou meia dúzia?",
        answer:
          "Meia dúzia! Seguindo um único fio (rota → view → serializer → model → teste), você entende o fluxo inteiro sem varrer o projeto todo.",
      },
    ],
    coreSections: [
      {
        heading: "1. O método em 5 passos ('da porta para dentro')",
        paragraphs: [
          "1) A planta: leia README.md e pastas da raiz (backend/, frontend/, docker-compose.yml).",
          "2) Como roda: veja Dockerfile, docker-compose.yml e requirements/.",
          "3) Os departamentos: abra settings/base.py e veja LOCAL_APPS (no MySuperStore são 9 apps: users, sellers, catalog, carts, orders, payments, assistant, admin_api, crm).",
          "4) O cardápio: abra config/urls.py e os urls.py de cada app.",
          "5) Siga um pedido de ponta a ponta: rota → ViewSet → Serializer → Model → Teste.",
        ],
        table: {
          headers: ["No mini-loja (F03–F05)", "No MySuperStore (real)", "O que mudou na escala"],
          rows: [
            ["1 app (catalogo)", "9 apps em apps/", "Cada assunto (pedidos, pagamentos, lojas) isolado"],
            ["settings.py único", "settings/base.py + dev.py + prod.py", "Separação de ambiente de desenvolvimento e produção"],
            ["Sem login nas rotas", "Permissões e filtro por usuário", "Só o dono do pedido (ou lojista envolvido) acessa"],
            ["SQLite local", "PostgreSQL + Redis + Celery + Caddy", "Concorrência real, tarefas assíncronas e HTTPS"],
          ],
        },
      },
    ],
    breakExperiment: {
      title: "Tentar ler um repositório grande em ordem alfabética",
      setup: "Abrir a pasta backend/ e tentar ler cada arquivo de cima para baixo sem seguir uma rota.",
      whatHappens: "Em 20 minutos você se perde em arquivos utilitários, configurações e migrações antigas sem saber como um pedido funciona.",
      lessonLearned: "Escolha um fio (uma funcionalidade ou rota) e puxe: urls.py → views.py → serializers.py → models.py → tests.py.",
    },
    pitfalls: [
      { wrong: "Tentar memorizar todos os arquivos antes de começar", right: "Usar busca (Ctrl+Shift+F / rg) a partir da rota", why: "Projetos reais mudam; saber encontrar pelo fluxo vale mais que decorar caminhos." },
    ],
    exercises: [
      {
        prompt: "Usando o método de 5 passos, se você precisa descobrir onde o MySuperStore calcula a comissão do lojista, por qual arquivo você começa a busca?",
        hint: "Pense no app de pedidos (orders) e nos modelos/serializers.",
        answer: "Comece por LOCAL_APPS em config/settings/base.py, vá para apps/orders/models.py (SubOrder) e apps/orders/serializers.py (OrderCreateSerializer).",
      },
    ],
    quizzes: [
      {
        id: "f06-q1",
        question: "Qual é a sequência recomendada pelo método 'da porta para dentro' para seguir uma funcionalidade em um projeto Django?",
        options: [
          { text: "migrations → settings → admin → views", whyNot: "Migrações são histórico de schema; não mostram o fluxo da requisição HTTP." },
          { text: "urls.py → views.py → serializers.py → models.py" },
          { text: "Dockerfile → .gitignore → manage.py", whyNot: "Esses arquivos mostram infraestrutura e CLI, não a regra de negócio da rota." },
          { text: "Ler todos os arquivos em ordem alfabética", whyNot: "Ordem alfabética mistura camadas e faz você perder o fio da requisição." },
        ],
        correctIndex: 1,
        explanation: "Seguir a viagem exata da requisição (garçom → cozinheiro → conferente → ficha da despensa) revela tudo o que participa daquela ação em poucos arquivos.",
      },
    ],
    flashcards: [
      { front: "Quais são os 5 passos para ler qualquer repositório?", back: "1. Planta (README/raiz), 2. Como roda (Compose/requirements), 3. Departamentos (INSTALLED_APPS), 4. Cardápio (urls.py), 5. Seguir um pedido de ponta a ponta." },
      { front: "Por que testes são ótimos para leitura de código?", back: "O nome e as asserções de um teste descrevem exatamente o comportamento que o sistema promete." },
    ],
    threeThings: [
      "Nunca leia um projeto grande de A a Z: olhe a planta e siga um fio de requisição.",
      "O MySuperStore usa exatamente a mesma estrutura de F03–F05, escalada para 9 apps.",
      "Com a trilha Fundamentos concluída, você está pronto para o Módulo 1 (negócio, números e código em produção).",
    ],
  },
};

