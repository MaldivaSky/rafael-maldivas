import type { FillBlankExercise } from "@/app/components/curso/InteractivePracticeLab";
import type { VisualDiagramId } from "@/app/components/curso/LessonVisualDiagram";

export const M0_DIAGRAM_BY_SLUG: Record<string, VisualDiagramId> = {
  "modulo-0-f01-o-mapa": "f01-viagem",
  "modulo-0-f03-primeiro-projeto-django": "f03-django-ciclo",
  "modulo-0-f04-primeira-api-com-drf": "f04-drf-pipeline",
};

export const M0_FILL_BLANKS: Record<string, FillBlankExercise[]> = {
  "modulo-0-f01-o-mapa": [
    {
      id: "f01-fb1",
      title: "Trajeto do pedido na arquitetura",
      prompt: "Complete as 3 peças principais da viagem de um pedido:",
      wordBank: ["HTTPS", "Serializer", "PostgreSQL", "localStorage"],
      segments: [
        { kind: "text", value: "O celular envia a comanda JSON via " },
        { kind: "blank", id: "f01-b1", accepted: ["HTTPS"], placeholder: "protocolo" },
        { kind: "text", value: ". No Django, o " },
        { kind: "blank", id: "f01-b2", accepted: ["Serializer"], placeholder: "conferente" },
        { kind: "text", value: " valida os dados antes de gravar no banco " },
        { kind: "blank", id: "f01-b3", accepted: ["PostgreSQL"], placeholder: "banco" },
        { kind: "text", value: "." },
      ],
      explanation:
        "A comunicação viaja criptografada em HTTPS; o Serializer confere a entrada no servidor; e o PostgreSQL persiste os dados com segurança.",
    },
  ],
  "modulo-0-f02-preparando-a-bancada": [
    {
      id: "f02-fb1",
      title: "Comandos de ambiente virtual no Windows",
      prompt: "Complete os comandos para criar o venv e instalar versões fixas:",
      wordBank: ["venv", "requirements.txt", "install", "pip"],
      segments: [
        { kind: "text", value: "python -m " },
        { kind: "blank", id: "f02-b1", accepted: ["venv"], placeholder: "módulo" },
        { kind: "text", value: " .venv   |   pip " },
        { kind: "blank", id: "f02-b2", accepted: ["install"], placeholder: "ação" },
        { kind: "text", value: " -r " },
        { kind: "blank", id: "f02-b3", accepted: ["requirements.txt"], placeholder: "arquivo" },
      ],
      explanation:
        "python -m venv .venv isola as dependências do projeto; pip install -r requirements.txt instala exatamente as versões fixadas.",
    },
  ],
  "modulo-0-f03-primeiro-projeto-django": [
    {
      id: "f03-fb1",
      title: "Ciclo Model → Migração → Banco",
      prompt: "Complete os dois comandos do manage.py após alterar models.py:",
      wordBank: ["makemigrations", "migrate", "runserver", "startapp"],
      segments: [
        { kind: "text", value: "1º gera o arquivo de planta: python manage.py " },
        { kind: "blank", id: "f03-b1", accepted: ["makemigrations"], placeholder: "comando 1" },
        { kind: "text", value: "  |  2º aplica no banco: python manage.py " },
        { kind: "blank", id: "f03-b2", accepted: ["migrate"], placeholder: "comando 2" },
      ],
      explanation:
        "makemigrations cria a migração versionada no código; migrate executa o SQL correspondente no banco.",
    },
  ],
  "modulo-0-f04-primeira-api-com-drf": [
    {
      id: "f04-fb1",
      title: "Status HTTP na prática",
      prompt: "Associe o código HTTP correto a cada situação da API:",
      wordBank: ["201", "400", "404", "409"],
      segments: [
        { kind: "text", value: "Recurso criado com sucesso: " },
        { kind: "blank", id: "f04-b1", accepted: ["201"], placeholder: "2xx" },
        { kind: "text", value: " · Dados inválidos no JSON: " },
        { kind: "blank", id: "f04-b2", accepted: ["400"], placeholder: "4xx" },
        { kind: "text", value: " · Conflito de estado/estoque: " },
        { kind: "blank", id: "f04-b3", accepted: ["409"], placeholder: "4xx" },
      ],
      explanation:
        "201 Created confirma criação; 400 Bad Request aponta erro de validação do cliente; 409 Conflict indica conflito com o estado atual.",
    },
  ],
  "modulo-0-f05-testes-e-git": [
    {
      id: "f05-fb1",
      title: "Estrutura Arrange-Act-Assert e .gitignore",
      prompt: "Complete as 3 etapas de um teste automatizado e o arquivo que protege segredos:",
      wordBank: ["Assert", "Act", ".gitignore", "Arrange"],
      segments: [
        { kind: "text", value: "Etapas do teste: " },
        { kind: "blank", id: "f05-b1", accepted: ["Arrange"], placeholder: "1ª etapa" },
        { kind: "text", value: " → " },
        { kind: "blank", id: "f05-b2", accepted: ["Act"], placeholder: "2ª etapa" },
        { kind: "text", value: " → " },
        { kind: "blank", id: "f05-b3", accepted: ["Assert"], placeholder: "3ª etapa" },
        { kind: "text", value: ". Arquivo que impede .env de ir para o Git: " },
        { kind: "blank", id: "f05-b4", accepted: [".gitignore", "gitignore"], placeholder: "arquivo" },
      ],
      explanation:
        "Arrange prepara os dados, Act executa a ação, Assert verifica o resultado; e o .gitignore garante que segredos (.env) nunca entrem no repositório.",
    },
  ],
  "modulo-0-f06-lendo-um-projeto-real": [
    {
      id: "f06-fb1",
      title: "Método de leitura de projeto grande",
      prompt: "Complete a ordem segura para explorar um repositório Django real:",
      wordBank: ["urls.py", "models.py", "views.py", "tests.py"],
      segments: [
        { kind: "text", value: "Comece pelas tabelas em " },
        { kind: "blank", id: "f06-b1", accepted: ["models.py"], placeholder: "tabelas" },
        { kind: "text", value: ", siga o endereço em " },
        { kind: "blank", id: "f06-b2", accepted: ["urls.py"], placeholder: "rotas" },
        { kind: "text", value: " até a regra em " },
        { kind: "blank", id: "f06-b3", accepted: ["views.py"], placeholder: "regra" },
        { kind: "text", value: " e confira a prova em " },
        { kind: "blank", id: "f06-b4", accepted: ["tests.py"], placeholder: "provas" },
        { kind: "text", value: "." },
      ],
      explanation:
        "Ler de fora para dentro (models → urls → views/serializers → tests) evita se perder em milhares de linhas.",
    },
  ],
};

export const M1_FILL_BLANKS: FillBlankExercise[] = [
  {
    id: "m1-fb1",
    title: "Conservação do dinheiro e arredondamento",
    prompt: "Complete a regra de ouro do cálculo financeiro no MySuperStore:",
    wordBank: ["ROUND_HALF_UP", "float", "centavos", "frete"],
    segments: [
      { kind: "text", value: "Nunca armazene dinheiro em " },
      { kind: "blank", id: "m1-b1", accepted: ["float"], placeholder: "tipo proibido" },
      { kind: "text", value: ": use " },
      { kind: "blank", id: "m1-b2", accepted: ["centavos"], placeholder: "unidade" },
      { kind: "text", value: " inteiros ou Decimal com " },
      { kind: "blank", id: "m1-b3", accepted: ["ROUND_HALF_UP"], placeholder: "critério" },
      { kind: "text", value: ". A comissão nunca incide sobre o " },
      { kind: "blank", id: "m1-b4", accepted: ["frete"], placeholder: "item" },
      { kind: "text", value: "." },
    ],
    explanation:
      "Dinheiro em float acumula erro binário. O MySuperStore usa Decimal/centavos com ROUND_HALF_UP, e o frete vai integralmente ao lojista.",
  },
];

