/**
 * Motor de Admissão, Questionário Etnográfico-Regional-Cultural-Estatístico
 * e Exame de Nivelamento em Informática Básica.
 *
 * Zero dependências externas de runtime para permitir importação direta via `node --test`.
 */

export type MacroRegion =
  | "Sudeste"
  | "Sul"
  | "Nordeste"
  | "Norte"
  | "Centro-Oeste"
  | "Exterior";

export interface AdmissionQuestionnaire {
  // 1. Identificação Obrigatória
  fullName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  authMethod: "google" | "email";

  // 2. Escolaridade, Origem e Motivação (Perguntas centrais solicitadas)
  educationLevel: string;
  howFoundSite: string;
  knowsProgramming: "nao" | "sim_iniciante" | "sim_pratico";
  programmingLanguages: string[];
  motivation: string;
  motivationGoalText?: string;

  // 3. Recorte Regional & Territorial
  stateUf: string;
  city: string;
  urbanZone: string;

  // 4. Recorte Etnográfico, Demográfico & Socioeconômico
  ethnicityIbge: string;
  gender: string;
  employmentStatus: string;
  incomeBracket: string;
  deviceAccess: string;

  // 5. Bagagem Cultural Digital & Cognitiva
  learningStyle: string;
  englishLevel: string;
  aiUsage: string;
}

export interface FundamentalItQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AdmissionRecord {
  version: 1;
  questionnaire: AdmissionQuestionnaire;
  macroRegion: MacroRegion;
  ageYears: number;
  ageBracket: string;
  itTestAnswers: Record<string, number>;
  itTestScore: number; // 0..100
  itTestPassed: boolean;
  recommendedLevel: "facil" | "mediano" | "dificil";
  emailActivated: boolean;
  submittedAt: string;
  activatedAt: string | null;
}

export const BRAZIL_UF_OPTIONS: Array<{ uf: string; name: string; region: MacroRegion }> = [
  { uf: "AC", name: "Acre", region: "Norte" },
  { uf: "AL", name: "Alagoas", region: "Nordeste" },
  { uf: "AP", name: "Amapá", region: "Norte" },
  { uf: "AM", name: "Amazonas", region: "Norte" },
  { uf: "BA", name: "Bahia", region: "Nordeste" },
  { uf: "CE", name: "Ceará", region: "Nordeste" },
  { uf: "DF", name: "Distrito Federal", region: "Centro-Oeste" },
  { uf: "ES", name: "Espírito Santo", region: "Sudeste" },
  { uf: "GO", name: "Goiás", region: "Centro-Oeste" },
  { uf: "MA", name: "Maranhão", region: "Nordeste" },
  { uf: "MT", name: "Mato Grosso", region: "Centro-Oeste" },
  { uf: "MS", name: "Mato Grosso do Sul", region: "Centro-Oeste" },
  { uf: "MG", name: "Minas Gerais", region: "Sudeste" },
  { uf: "PA", name: "Pará", region: "Norte" },
  { uf: "PB", name: "Paraíba", region: "Nordeste" },
  { uf: "PR", name: "Paraná", region: "Sul" },
  { uf: "PE", name: "Pernambuco", region: "Nordeste" },
  { uf: "PI", name: "Piauí", region: "Nordeste" },
  { uf: "RJ", name: "Rio de Janeiro", region: "Sudeste" },
  { uf: "RN", name: "Rio Grande do Norte", region: "Nordeste" },
  { uf: "RS", name: "Rio Grande do Sul", region: "Sul" },
  { uf: "RO", name: "Rondônia", region: "Norte" },
  { uf: "RR", name: "Roraima", region: "Norte" },
  { uf: "SC", name: "Santa Catarina", region: "Sul" },
  { uf: "SP", name: "São Paulo", region: "Sudeste" },
  { uf: "SE", name: "Sergipe", region: "Nordeste" },
  { uf: "TO", name: "Tocantins", region: "Norte" },
  { uf: "EX", name: "Fora do Brasil (Exterior)", region: "Exterior" },
];

export const EDUCATION_OPTIONS = [
  "Ensino Fundamental (cursando ou completo)",
  "Ensino Médio (cursando)",
  "Ensino Médio (completo)",
  "Ensino Técnico / Profissionalizante",
  "Ensino Superior (cursando)",
  "Ensino Superior (completo)",
  "Pós-graduação / Mestrado / Doutorado",
];

export const HOW_FOUND_OPTIONS = [
  "LinkedIn (Post ou Perfil do Rafael)",
  "Busca no Google",
  "Indicação de amigo, professor ou colega",
  "YouTube / Vídeo",
  "Instagram / TikTok",
  "GitHub / Comunidade Dev",
  "Outro canal",
];

export const PROGRAMMING_LANGUAGE_OPTIONS = [
  "Nenhuma (Estou começando do absoluto zero)",
  "HTML & CSS",
  "Python",
  "JavaScript / TypeScript",
  "SQL / Banco de Dados",
  "PHP / Java / C#",
  "C / C++ / Rust / Go",
  "Outra linguagem",
];

export const MOTIVATION_OPTIONS = [
  "Conseguir meu primeiro emprego ou estágio em tecnologia",
  "Construir minha própria loja ou marketplace do zero",
  "Aprender programação passo a passo sem decorar código",
  "Dominar arquitetura de software, banco de dados e pagamentos",
  "Fazer transição de carreira para Engenharia de Software",
  "Aplicar em um negócio da minha família ou clientes freelance",
];

export const URBAN_ZONE_OPTIONS = [
  "Capital (Centro ou Bairros Centrais)",
  "Periferia / Região Metropolitana",
  "Interior (Cidade Média ou Pequena)",
  "Zona Rural / Comunidade Tradicional",
];

export const ETHNICITY_IBGE_OPTIONS = [
  "Parda",
  "Branca",
  "Preta",
  "Amarela",
  "Indígena",
  "Prefiro não declarar",
];

export const GENDER_OPTIONS = [
  "Homem",
  "Mulher",
  "Pessoa Não-Binária",
  "Outro / Prefiro não declarar",
];

export const EMPLOYMENT_OPTIONS = [
  "Apenas Estudante",
  "Trabalhando CLT (fora da área de TI)",
  "Trabalhando CLT (já na área de TI)",
  "Autônomo / MEI / Freelancer",
  "Em busca de recolocação / Desempregado",
  "Empreendedor / Dono de comércio",
];

export const INCOME_BRACKET_OPTIONS = [
  "Até 1 salário mínimo",
  "De 1 a 2 salários mínimos",
  "De 2 a 4 salários mínimos",
  "De 4 a 8 salários mínimos",
  "Acima de 8 salários mínimos",
  "Prefiro não informar",
];

export const DEVICE_ACCESS_OPTIONS = [
  "Notebook ou PC próprio com internet banda larga",
  "Computador compartilhado com a família",
  "Computador do trabalho, escola ou lan house",
  "Apenas Celular / Smartphone no momento",
];

export const LEARNING_STYLE_OPTIONS = [
  "Prático e Gamificado (aprender fazendo missões e desafios)",
  "Visual (diagramas, mapas mentais e vídeos curtos)",
  "Passo a passo escrito (ler com calma e testar)",
  "Auditivo (ouvir podcasts e explicações faladas)",
];

export const ENGLISH_LEVEL_OPTIONS = [
  "Iniciante (uso tradutor para tudo)",
  "Básico (entendo palavras soltas de tecnologia)",
  "Intermediário (consigo ler textos técnicos com apoio)",
  "Avançado / Fluente",
];

export const AI_USAGE_OPTIONS = [
  "Uso IA (ChatGPT, Claude, Gemini) quase todos os dias",
  "Já usei algumas vezes para tirar dúvidas",
  "Ainda não tenho costume de usar IA",
];

/**
 * 5 Perguntas Fundamentais de Informática & Raciocínio Digital (Nivelamento de Entrada).
 * Mínimo para aprovação: 3 de 5 acertos (60%).
 */
export const FUNDAMENTAL_IT_QUESTIONS: FundamentalItQuestion[] = [
  {
    id: "it-q1-zip",
    topic: "Arquivos & Pastas (.zip)",
    question:
      "1. Quando você baixa um arquivo compactado como 'casa-pre-moldada.zip' para o seu computador, o que é necessário fazer antes de abrir o projeto no editor de código?",
    options: [
      "Extrair (descompactar) o arquivo .zip para uma pasta normal no computador",
      "Renomear o final do arquivo de .zip para .mp4",
      "Apagar o arquivo assim que o download terminar",
      "Desligar o monitor e ligar novamente",
    ],
    correctIndex: 0,
    explanation:
      "Um arquivo .zip é como uma mala fechada com vários arquivos dentro. Antes de editar os arquivos no VS Code, precisamos extrair (descompactar) a pasta.",
  },
  {
    id: "it-q2-browser",
    topic: "Internet & Navegador",
    question:
      "2. Quando você digita um endereço como 'www.maldivastech.dev' para acessar um site, qual programa está exibindo a página na sua tela?",
    options: [
      "O Navegador Web (como Google Chrome, Edge, Firefox ou Safari)",
      "A Calculadora do Windows",
      "O cabo de energia da tomada",
      "O Bloco de Notas sem internet",
    ],
    correctIndex: 0,
    explanation:
      "O Navegador Web (Browser) é o cliente que faz o pedido pela internet e desenha o HTML/CSS na tela do usuário.",
  },
  {
    id: "it-q3-extensions",
    topic: "Tipos de Arquivo",
    question:
      "3. Na organização de um sistema, vemos arquivos como 'index.html', 'models.py' e 'foto.jpg'. Para que servem essas letras depois do ponto (.html, .py, .jpg)?",
    options: [
      "Indicam o tipo de cada arquivo: página web (.html), código Python (.py) e imagem (.jpg)",
      "São apenas enfeites aleatórios que o computador escolhe sozinho",
      "Indicam o preço do arquivo em reais",
      "Servem para deixar o computador mais lento",
    ],
    correctIndex: 0,
    explanation:
      "A extensão do arquivo diz ao sistema operacional e ao VS Code qual é a linguagem ou formato daquele conteúdo.",
  },
  {
    id: "it-q4-security",
    topic: "Segurança & Senhas (.env)",
    question:
      "4. Em um projeto profissional, as senhas do banco de dados e chaves do PIX ficam guardadas num arquivo secreto chamado '.env'. Qual é a regra de ouro sobre esse arquivo?",
    options: [
      "NUNCA publicar o arquivo .env aberto na internet ou no GitHub público",
      "Postar o arquivo .env nas redes sociais para pedir ajuda",
      "Enviar a senha do banco para todos os clientes da loja",
      "Usar a senha '1234' em todos os sistemas",
    ],
    correctIndex: 0,
    explanation:
      "Arquivos de configuração sensíveis (.env) ficam apenas no seu computador e no cofre seguro do servidor, protegidos pelo .gitignore.",
  },
  {
    id: "it-q5-logic",
    topic: "Lógica & Centavos",
    question:
      "5. Se uma camiseta custa R$ 100,00 e cada Real tem 100 centavos, quantos centavos inteiros essa camiseta custa no banco de dados?",
    options: [
      "10000 centavos (100 × 100)",
      "10 centavos",
      "0,01 centavo",
      "100 centavos",
    ],
    correctIndex: 0,
    explanation:
      "Sistemas financeiros profissionais guardam R$ 100,00 como 10000 centavos inteiros para evitar erros de arredondamento com vírgula!",
  },
];

export function deriveMacroRegion(stateUf: string): MacroRegion {
  const found = BRAZIL_UF_OPTIONS.find(
    (u) => u.uf.toUpperCase() === (stateUf || "").trim().toUpperCase(),
  );
  return found ? found.region : "Sudeste";
}

export function calculateAgeAndBracket(
  birthDateIso: string,
  nowDate = new Date(),
): { ageYears: number; ageBracket: string } {
  const parsed = new Date(birthDateIso);
  if (Number.isNaN(parsed.getTime())) {
    return { ageYears: 25, ageBracket: "25 a 34 anos" };
  }
  let age = nowDate.getFullYear() - parsed.getFullYear();
  const m = nowDate.getMonth() - parsed.getMonth();
  if (m < 0 || (m === 0 && nowDate.getDate() < parsed.getDate())) {
    age -= 1;
  }
  const safeAge = Math.max(10, Math.min(99, age));
  if (safeAge < 18) return { ageYears: safeAge, ageBracket: "Menor de 18 anos" };
  if (safeAge <= 24) return { ageYears: safeAge, ageBracket: "18 a 24 anos" };
  if (safeAge <= 34) return { ageYears: safeAge, ageBracket: "25 a 34 anos" };
  if (safeAge <= 44) return { ageYears: safeAge, ageBracket: "35 a 44 anos" };
  return { ageYears: safeAge, ageBracket: "45 anos ou mais" };
}

export function gradeItAssessment(answers: Record<string, number>): {
  correctCount: number;
  totalQuestions: number;
  scorePct: number;
  passed: boolean;
} {
  const totalQuestions = FUNDAMENTAL_IT_QUESTIONS.length;
  let correctCount = 0;
  for (const q of FUNDAMENTAL_IT_QUESTIONS) {
    if (answers[q.id] === q.correctIndex) {
      correctCount += 1;
    }
  }
  const scorePct = Math.round((correctCount / totalQuestions) * 100);
  return {
    correctCount,
    totalQuestions,
    scorePct,
    passed: correctCount >= 3, // Pelo menos 3 de 5 (60%)
  };
}

export function recommendCourseLevelFromAdmission(
  questionnaire: Pick<AdmissionQuestionnaire, "knowsProgramming" | "programmingLanguages">,
  itScorePct: number,
): "facil" | "mediano" | "dificil" {
  const langs = questionnaire.programmingLanguages ?? [];
  const hasBackendLangs =
    langs.includes("Python") && langs.includes("SQL / Banco de Dados");

  if (questionnaire.knowsProgramming === "sim_pratico" && hasBackendLangs && itScorePct >= 80) {
    return "dificil";
  }
  if (
    questionnaire.knowsProgramming === "sim_iniciante" ||
    questionnaire.knowsProgramming === "sim_pratico"
  ) {
    return "mediano";
  }
  return "facil";
}

export function validateAdmissionQuestionnaire(
  q: Partial<AdmissionQuestionnaire>,
): { valid: boolean; error?: string } {
  if (!q.fullName || q.fullName.trim().length < 3) {
    return { valid: false, error: "Informe seu nome completo (mínimo 3 letras)." };
  }
  const email = (q.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Informe um endereço de e-mail válido." };
  }
  if (!q.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(q.birthDate)) {
    return { valid: false, error: "Informe sua data de nascimento." };
  }
  if (!q.educationLevel) {
    return { valid: false, error: "Selecione sua escolaridade." };
  }
  if (!q.stateUf || !q.city || q.city.trim().length < 2) {
    return { valid: false, error: "Informe seu Estado (UF) e sua Cidade." };
  }
  if (!q.howFoundSite) {
    return { valid: false, error: "Conte como você encontrou o site." };
  }
  if (!q.motivation) {
    return { valid: false, error: "Selecione sua principal motivação para fazer o curso." };
  }
  return { valid: true };
}

export interface EthnographicDashboardStats {
  totalRespondents: number;
  activatedCount: number;
  averageItScore: number;
  averageAge: number;
  byRegion: Array<{ name: string; count: number; pct: number }>;
  byStateUf: Array<{ name: string; count: number; pct: number }>;
  byUrbanZone: Array<{ name: string; count: number; pct: number }>;
  byEducation: Array<{ name: string; count: number; pct: number }>;
  byEthnicity: Array<{ name: string; count: number; pct: number }>;
  byGender: Array<{ name: string; count: number; pct: number }>;
  byIncome: Array<{ name: string; count: number; pct: number }>;
  byEmployment: Array<{ name: string; count: number; pct: number }>;
  byDevice: Array<{ name: string; count: number; pct: number }>;
  byHowFound: Array<{ name: string; count: number; pct: number }>;
  byProgrammingExperience: Array<{ name: string; count: number; pct: number }>;
  byLanguageKnown: Array<{ name: string; count: number; pct: number }>;
  byMotivation: Array<{ name: string; count: number; pct: number }>;
  byLearningStyle: Array<{ name: string; count: number; pct: number }>;
  byAgeBracket: Array<{ name: string; count: number; pct: number }>;
}

function tallyField(
  records: AdmissionRecord[],
  getter: (r: AdmissionRecord) => string | string[] | undefined,
): Array<{ name: string; count: number; pct: number }> {
  const total = Math.max(1, records.length);
  const counts = new Map<string, number>();
  for (const r of records) {
    const val = getter(r);
    if (Array.isArray(val)) {
      for (const item of val) {
        const clean = (item || "Não informado").trim();
        counts.set(clean, (counts.get(clean) ?? 0) + 1);
      }
    } else {
      const clean = (val || "Não informado").trim();
      counts.set(clean, (counts.get(clean) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeEthnographicDashboardStats(
  records: AdmissionRecord[],
): EthnographicDashboardStats {
  const total = records.length;
  if (total === 0) {
    return {
      totalRespondents: 0,
      activatedCount: 0,
      averageItScore: 0,
      averageAge: 0,
      byRegion: [],
      byStateUf: [],
      byUrbanZone: [],
      byEducation: [],
      byEthnicity: [],
      byGender: [],
      byIncome: [],
      byEmployment: [],
      byDevice: [],
      byHowFound: [],
      byProgrammingExperience: [],
      byLanguageKnown: [],
      byMotivation: [],
      byLearningStyle: [],
      byAgeBracket: [],
    };
  }

  const activatedCount = records.filter((r) => r.emailActivated).length;
  const averageItScore = Math.round(
    records.reduce((acc, r) => acc + (r.itTestScore || 0), 0) / total,
  );
  const averageAge = Math.round(
    records.reduce((acc, r) => acc + (r.ageYears || 25), 0) / total,
  );

  const expLabel: Record<string, string> = {
    nao: "Iniciante absoluto (nunca programou)",
    sim_iniciante: "Já estudou o básico",
    sim_pratico: "Já programa na prática",
  };

  return {
    totalRespondents: total,
    activatedCount,
    averageItScore,
    averageAge,
    byRegion: tallyField(records, (r) => r.macroRegion),
    byStateUf: tallyField(records, (r) => r.questionnaire.stateUf),
    byUrbanZone: tallyField(records, (r) => r.questionnaire.urbanZone),
    byEducation: tallyField(records, (r) => r.questionnaire.educationLevel),
    byEthnicity: tallyField(records, (r) => r.questionnaire.ethnicityIbge),
    byGender: tallyField(records, (r) => r.questionnaire.gender),
    byIncome: tallyField(records, (r) => r.questionnaire.incomeBracket),
    byEmployment: tallyField(records, (r) => r.questionnaire.employmentStatus),
    byDevice: tallyField(records, (r) => r.questionnaire.deviceAccess),
    byHowFound: tallyField(records, (r) => r.questionnaire.howFoundSite),
    byProgrammingExperience: tallyField(
      records,
      (r) => expLabel[r.questionnaire.knowsProgramming] ?? "Iniciante",
    ),
    byLanguageKnown: tallyField(records, (r) => r.questionnaire.programmingLanguages),
    byMotivation: tallyField(records, (r) => r.questionnaire.motivation),
    byLearningStyle: tallyField(records, (r) => r.questionnaire.learningStyle),
    byAgeBracket: tallyField(records, (r) => r.ageBracket),
  };
}
