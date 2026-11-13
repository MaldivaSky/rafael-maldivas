"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type ExamQuestion = {
  id: string;
  topic: string;
  question: string;
  options: { text: string; whyNot?: string }[];
  correctIndex: number;
  explanation: string;
};

const PASS_PERCENT = 80;

const FINAL_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: "ex-01",
    topic: "Módulo 0 · Arquitetura Web",
    question:
      "Em um marketplace Django + Next.js, onde o preço final do pedido e a disponibilidade de estoque devem ser decididos?",
    options: [
      { text: "No navegador (Next.js), antes de enviar o JSON para economizar banco.", whyNot: "Qualquer usuário pode alterar o JSON no DevTools antes do envio." },
      { text: "No servidor (back-end), consultando o banco de dados dentro da transação.", },
      { text: "No localStorage do cliente, sincronizado a cada 5 minutos.", whyNot: "localStorage é editável pelo usuário e não reflete concorrência entre clientes." },
      { text: "No Caddy, por regra de proxy reverso.", whyNot: "Proxy reverso roteia e termina TLS; não conhece regras de negócio nem estoque." },
    ],
    correctIndex: 1,
    explanation:
      "Quem mostra (front-end) nunca decide preço nem estoque. O back-end sempre recalcula tudo consultando o PostgreSQL.",
  },
  {
    id: "ex-02",
    topic: "Módulo 0 · Django & DRF",
    question:
      "Qual a diferença entre `python manage.py makemigrations` e `python manage.py migrate`?",
    options: [
      { text: "makemigrations cria o arquivo versionado com a mudança; migrate aplica o SQL no banco.", },
      { text: "makemigrations apaga o banco antigo; migrate cria o superusuário.", whyNot: "Nenhum dos dois comandos cria superusuário ou apaga o banco por padrão." },
      { text: "Ambos fazem a mesma coisa, mas apenas migrate funciona em produção.", whyNot: "makemigrations gera o plano de alteração; migrate executa esse plano." },
      { text: "makemigrations sobe o servidor; migrate instala bibliotecas do requirements.txt.", whyNot: "runserver sobe o servidor e pip install instala pacotes." },
    ],
    correctIndex: 0,
    explanation:
      "makemigrations gera a planta versionada no Git; migrate aplica a alteração estrutural (DDL) no PostgreSQL.",
  },
  {
    id: "ex-03",
    topic: "A01 · Margem & Dinheiro",
    question:
      "Em um pedido de R$ 100,00 sem frete, comissão de 12% e taxa PIX de 0,99%, por que o cálculo deve usar centavos inteiros ou Decimal com ROUND_HALF_UP em vez de float?",
    options: [
      { text: "Porque float não suporta números negativos em Python.", whyNot: "float suporta negativos; o problema é representação binária inexata de decimais." },
      { text: "Porque float acumula erros binários de arredondamento (ex.: 0.1 + 0.2 != 0.3), quebrando a conservação de centavos.", },
      { text: "Porque o PostgreSQL não aceita colunas numéricas decimais.", whyNot: "PostgreSQL possui NUMERIC/DECIMAL exato." },
      { text: "Porque Decimal é mais rápido que inteiro em operações de GPU.", whyNot: "O motivo é exatidão financeira, não velocidade em GPU." },
    ],
    correctIndex: 1,
    explanation:
      "Dinheiro exige aritmética exata: `valor_lojista + comissao == total_pago`, sem centavos perdidos ou criados por ponto flutuante.",
  },
  {
    id: "ex-04",
    topic: "A02 · Modelo de Dados",
    question:
      "Um pedido tem produtos de 3 lojas pagos em um único PIX. Quantos `Order`, `SubOrder` e `Payment` são criados?",
    options: [
      { text: "3 Order, 3 SubOrder e 3 Payment.", whyNot: "O cliente fechou 1 carrinho e pagou 1 vez." },
      { text: "1 Order, 3 SubOrder e 1 Payment.", },
      { text: "1 Order, 1 SubOrder e 3 Payment.", whyNot: "Cada loja precisa de envio/rastreio independentes (SubOrder), e houve só 1 pagamento." },
      { text: "1 Order, 3 SubOrder e 3 Payment.", whyNot: "Um PIX único gera 1 Payment associado ao Order." },
    ],
    correctIndex: 1,
    explanation:
      "1 Order representa a compra única (1 Payment); cada loja recebe 1 SubOrder com seu próprio ciclo de entrega e repasse.",
  },
  {
    id: "ex-05",
    topic: "A02 · Snapshot & Proteção",
    question:
      "Por que `OrderItem` copia o preço e o título do produto no momento da compra (snapshot) e `Payment.order` usa `on_delete=PROTECT`?",
    options: [
      { text: "Para permitir que o cliente altere o preço depois de pagar.", whyNot: "Snapshot congela o histórico, não permite edição posterior." },
      { text: "Para que edições futuras no catálogo não alterem pedidos antigos e ninguém apague pedidos pagos por acidente.", },
      { text: "Para duplicar o tamanho do banco e acelerar o cache do Redis.", whyNot: "O objetivo é integridade histórica e contábil." },
      { text: "Para usar CASCADE automaticamente quando um produto sair de linha.", whyNot: "CASCADE apagaria histórico financeiro; por isso usa-se PROTECT." },
    ],
    correctIndex: 1,
    explanation:
      "Snapshots preservam o valor histórico pago pelo cliente e `PROTECT` impede exclusão acidental de registros financeiros.",
  },
  {
    id: "ex-06",
    topic: "A03 · Cupom & Rateio",
    question:
      "Um cupom de desconto de R$ 10,00 é dividido proporcionalmente entre 3 lojas e o cálculo em centavos deixa 1 centavo de resto. O que fazer?",
    options: [
      { text: "Descartar o centavo de resto para simplificar.", whyNot: "Quebra a soma exata dos descontos." },
      { text: "Jogar a sobra de arredondamento na última loja da lista para que a soma dos descontos seja exatamente R$ 10,00.", },
      { text: "Cobrar 1 centavo extra do cliente no PIX.", whyNot: "Nunca se altera o total acordado por erro de rateio." },
      { text: "Aplicar o desconto de R$ 10,00 inteiro nas 3 lojas.", whyNot: "Daria R$ 30,00 de desconto." },
    ],
    correctIndex: 1,
    explanation:
      "No rateio proporcional, o último item absorve a diferença de arredondamento para garantir conservação exata dos centavos.",
  },
  {
    id: "ex-07",
    topic: "A04 · Concorrência de Estoque",
    question:
      "Qual combinação impede venda duplicada quando duas pessoas clicam em 'Comprar' no mesmo milissegundo na última unidade?",
    options: [
      { text: "Ler `product.stock` em Python, checar `if stock >= qty`, subtrair e chamar `save()`.", whyNot: "Condição de corrida clássica (TOCTOU): duas transações leem 1 antes de qualquer uma gravar." },
      { text: "`transaction.atomic()` + `select_for_update()` (em ordem fixa de IDs) + `UPDATE ... WHERE stock >= qty`.", },
      { text: "Colocar `time.sleep(1)` antes de salvar o pedido.", whyNot: "Atraso não serializa transações concorrentes." },
      { text: "Desabilitar o botão de compra com CSS após o primeiro clique.", whyNot: "Cada comprador está em seu próprio celular/navegador." },
    ],
    correctIndex: 1,
    explanation:
      "A transação garante atomicidade, `select_for_update()` serializa em ordem determinística (evitando deadlock) e o `UPDATE` condicional garante que o estoque nunca fique negativo.",
  },
  {
    id: "ex-08",
    topic: "A05 · PIX, Cartão e mTLS",
    question:
      "Por que o número completo e o CVV do cartão de crédito nunca devem trafegar pelo seu servidor Django?",
    options: [
      { text: "Porque o Django não consegue ler strings com 16 dígitos.", whyNot: "É uma questão de segurança e escopo regulatório (PCI-DSS), não limitação da linguagem." },
      { text: "Para reduzir drasticamente risco de vazamento e escopo PCI-DSS: o front-end tokeniza direto com o provedor e envia só o token.", },
      { text: "Porque o certificado mTLS só funciona para PIX e bloqueia cartões.", whyNot: "mTLS protege chamadas servidor-a-servidor para o provedor." },
      { text: "Porque o cartão é cobrado via WebSocket sem HTTPS.", whyNot: "Cartão usa tokenização HTTPS do provedor." },
    ],
    correctIndex: 1,
    explanation:
      "Com tokenização no cliente direto junto ao provedor, o servidor recebe apenas um token de uso único e nunca armazena dados sensíveis de cartão.",
  },
  {
    id: "ex-09",
    topic: "A06 · Webhook Seguro",
    question:
      "Quais são as defesas essenciais em um endpoint público de webhook de pagamento?",
    options: [
      { text: "Aceitar qualquer POST com `status: 'paid'` se o IP parecer brasileiro.", whyNot: "IPs e corpos JSON podem ser forjados sem autenticação." },
      { text: "Fail-closed se segredo ausente, comparação em tempo constante (`hmac.compare_digest`), conferência do valor no provedor e trava idempotente (`select_for_update`).", },
      { text: "Comparar o segredo com `==` e retornar 200 OK mesmo quando `WEBHOOK_SECRET` estiver vazio.", whyNot: "Permitir segredo vazio (fail-open) expõe o sistema inteiro." },
      { text: "Confiar apenas no `User-Agent` enviado na requisição.", whyNot: "`User-Agent` é triviais de falsificar." },
    ],
    correctIndex: 1,
    explanation:
      "Fail-closed evita exposição por configuração vazia, `compare_digest` evita timing attack, a consulta ao provedor confirma o valor real e `select_for_update` garante idempotência.",
  },
  {
    id: "ex-10",
    topic: "A07 · Repasse & Estorno",
    question:
      "Qual regra protege o sistema contra devolver mais dinheiro ao cliente do que ele realmente pagou em múltiplos estornos parciais?",
    options: [
      { text: "Permitir estornos livres e corrigir no fechamento mensal manual.", whyNot: "Prejuízo direto e risco de fraude/bug." },
      { text: "Validar pedido aprovado, checar teto `ja_estornado + novo_valor <= total_pago`, usar ID determinístico e confirmar no provedor antes de registrar.", },
      { text: "Fazer estorno apenas via `DELETE` na tabela `Payment`.", whyNot: "Nunca se apaga registro financeiro; gera-se registro de estorno." },
      { text: "Calcular o estorno usando apenas o subtotal sem verificar estornos anteriores.", whyNot: "Dois estornos parciais poderiam ultrapassar o total pago." },
    ],
    correctIndex: 1,
    explanation:
      "O teto acumulado garante que a soma dos estornos nunca supere o pagamento original, e o ID determinístico impede dupla execução.",
  },
  {
    id: "ex-11",
    topic: "A08 · Ciclo de Vida & Worker",
    question:
      "Por que reservar estoque na criação do pedido exige uma rotina de expiração (ex.: Celery Beat)?",
    options: [
      { text: "Para apagar a conta do usuário que não pagou em 10 minutos.", whyNot: "Não se apaga conta de cliente." },
      { text: "Para liberar peças presas em pedidos PIX abandonados, devolvendo-as à vitrine (respeitando exceções de cartão pendente).", },
      { text: "Porque o PostgreSQL apaga linhas após 30 minutos automaticamente.", whyNot: "PostgreSQL não expira registros sozinho." },
      { text: "Para aumentar o consumo de CPU da VM.", whyNot: "O objetivo é liberar estoque preso de forma controlada." },
    ],
    correctIndex: 1,
    explanation:
      "Sem expiração, carrinhos abandonados esgotam o estoque da loja artificialmente.",
  },
  {
    id: "ex-12",
    topic: "A09 · Tempo Real & Mídia",
    question:
      "No WebSocket de chat/notificações e no upload de vídeos de produtos em um servidor enxuto, quais cuidados são indispensáveis?",
    options: [
      { text: "Autenticar o token no handshake e já liberar todas as salas do sistema.", whyNot: "Autenticação (quem é) não basta sem autorização (de qual pedido/loja participa)." },
      { text: "Checar autenticação + autorização por participante no WebSocket e fazer upload direto de mídia para o serviço de storage, evitando estourar RAM.", },
      { text: "Carregar vídeos de 50 MB inteiros em memória no Django antes de salvar.", whyNot: "Amplificação de memória derruba rapidamente uma VM de 1 GB." },
      { text: "Usar `SELECT *` em polling a cada 500 ms em vez de WebSocket.", whyNot: "Polling agressivo sobrecarrega API e banco." },
    ],
    correctIndex: 1,
    explanation:
      "Autorização por participante evita vazamento de dados entre lojas, e upload direto protege a RAM do servidor.",
  },
  {
    id: "ex-13",
    topic: "A10 · Infraestrutura 1 GB RAM",
    question:
      "Qual a ordem segura em um pipeline de deploy e como validar que o backup do PostgreSQL realmente funciona?",
    options: [
      { text: "Trocar o container da aplicação primeiro e rodar migrações depois; conferir apenas se o arquivo `.sql.gz` tem > 0 bytes.", whyNot: "Código novo sem migração quebra o schema; arquivo existente pode estar corrompido." },
      { text: "Rodar migrações antes de subir a nova versão da aplicação (com healthcheck) e testar restauração real do backup em ambiente isolado.", },
      { text: "Reiniciar o Redis com política `allkeys-lru` para apagar filas antigas.", whyNot: "Filas de tarefas exigem `noeviction` para não perder jobs silenciosamente." },
      { text: "Desativar swap e healthcheck para economizar disco.", whyNot: "Em VM de 1 GB, swap e healthcheck evitam indisponibilidade súbita." },
    ],
    correctIndex: 1,
    explanation:
      "Migrar antes evita erros de coluna inexistente; backup só é confiável após teste de restore.",
  },
  {
    id: "ex-14",
    topic: "A11 · Jurídico, Fiscal e Operação",
    question:
      "Qual afirmação reflete postura jurídica e operacional responsável antes de colocar um marketplace para cobrar em produção?",
    options: [
      { text: "Publicar que o software garante lucro líquido imediato e dispensar termos de uso.", whyNot: "Promessa de resultado cria risco jurídico direto." },
      { text: "Alinhar CNPJ/CNAE e emissão fiscal com contador, termos/LGPD/reembolso (CDC art. 49) com advogado e nunca prometer retorno financeiro garantido.", },
      { text: "Guardar CPF e endereço em log público para facilitar suporte.", whyNot: "Viola princípios básicos da LGPD." },
      { text: "Ignorar custódia de recursos de terceiros porque o código já faz split.", whyNot: "Código não substitui enquadramento regulatório e fiscal." },
    ],
    correctIndex: 1,
    explanation:
      "Código correto é pré-requisito, mas operar dinheiro de terceiros exige alinhamento contábil, fiscal, LGPD e contratual.",
  },
  {
    id: "ex-15",
    topic: "Projeto Final · Invariantes",
    question:
      "O que prova objetivamente que seu mini-marketplace está pronto na avaliação do Projeto Final?",
    options: [
      { text: "Ter apenas telas bonitas em HTML sem testes automatizados.", whyNot: "Sem testes automatizados, invariantes financeiras quebram na primeira mudança." },
      { text: "Suíte de testes automatizados provando conservação de centavos, trava de estoque concorrente, idempotência de webhook, teto de estorno e documentação honesta das decisões.", },
      { text: "Subir o arquivo `.env` com senhas no GitHub para facilitar a avaliação.", whyNot: "Segredos nunca entram no controle de versão." },
      { text: "Usar `float` nos testes e ignorar arredondamento.", whyNot: "Invariantes financeiras exigem exatidão em centavos/Decimal." },
    ],
    correctIndex: 1,
    explanation:
      "Testes automatizados das invariantes financeiras + documentação clara de trade-offs garantem confiabilidade real.",
  },
];

type SavedCert = {
  studentName: string;
  score: number;
  total: number;
  percent: number;
  code: string;
  issuedAt: string;
};

const CERT_STORAGE_KEY = "maldivas-curso-cert-v1";

function generateCertCode(name: string, percent: number): string {
  const clean = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const hashNum = Array.from(`${name}:${percent}:2026`).reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000,
    7,
  );
  return `MDV-MKT-2026-${clean}-${String(hashNum).padStart(4, "0")}`;
}

export default function FinalExamCertificate() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [savedCert, setSavedCert] = useState<SavedCert | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CERT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedCert;
        if (parsed && typeof parsed.code === "string") {
          setSavedCert(parsed);
          setStudentName(parsed.studentName);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () =>
      FINAL_EXAM_QUESTIONS.filter((q) => answers[q.id] === q.correctIndex).length,
    [answers],
  );
  const percent = Math.round(
    (correctCount / FINAL_EXAM_QUESTIONS.length) * 100,
  );
  const passed = submitted && percent >= PASS_PERCENT;

  function handleSubmitExam() {
    setSubmitted(true);
  }

  function handleResetExam() {
    setAnswers({});
    setSubmitted(false);
  }

  function handleIssueCertificate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = studentName.trim();
    if (trimmed.length < 3) return;
    const cert: SavedCert = {
      studentName: trimmed,
      score: correctCount,
      total: FINAL_EXAM_QUESTIONS.length,
      percent,
      code: generateCertCode(trimmed, percent),
      issuedAt: new Date().toLocaleDateString("pt-BR"),
    };
    setSavedCert(cert);
    try {
      window.localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(cert));
    } catch {
      /* ignore */
    }
  }

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="curso-exam-section" aria-labelledby="exam-final-title">
      <div className="curso-sim-card">
        <div className="curso-sim-head">
          <div>
            <span className="curso-badge">
              Avaliação Final · Nota mínima {PASS_PERCENT}% (12/{FINAL_EXAM_QUESTIONS.length})
            </span>
            <h2 id="exam-final-title">
              <Award size={22} aria-hidden="true" /> Exame Final e Certificado Maldivas Tech
            </h2>
          </div>
          <span className="curso-pill">
            {answeredCount}/{FINAL_EXAM_QUESTIONS.length} respondidas
          </span>
        </div>

        <p className="curso-muted">
          Responda às {FINAL_EXAM_QUESTIONS.length} questões técnicas cobrindo toda a trilha
          (Módulo 0 + A01 a A11 + Projeto Final). Atingindo{" "}
          <strong>{PASS_PERCENT}% ou mais</strong>, você libera a emissão imediata do seu{" "}
          <strong>Certificado de Conclusão de Curso Livre pela Maldivas Tech</strong> (38h 10min).
        </p>

        <div className="curso-quiz-list">
          {FINAL_EXAM_QUESTIONS.map((q, qIdx) => {
            const chosen = answers[q.id];
            const isCorrect = submitted && chosen === q.correctIndex;
            const chosenOpt = chosen !== undefined ? q.options[chosen] : undefined;

            return (
              <div key={q.id} className="curso-quiz-item">
                <div className="curso-fine" style={{ marginBottom: 4 }}>
                  {q.topic}
                </div>
                <p>
                  <strong>
                    {qIdx + 1}. {q.question}
                  </strong>
                </p>

                <div className="curso-quiz-opts">
                  {q.options.map((opt, optIdx) => {
                    const selected = chosen === optIdx;
                    const rightOpt = optIdx === q.correctIndex;
                    const stateClass = !submitted
                      ? selected
                        ? "selected"
                        : ""
                      : rightOpt
                        ? "correct"
                        : selected
                          ? "wrong"
                          : "";

                    return (
                      <button
                        key={`${q.id}-${optIdx}`}
                        type="button"
                        disabled={submitted}
                        className={`curso-quiz-opt ${stateClass}`}
                        aria-pressed={selected}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                      >
                        <span className="curso-quiz-opt-row">
                          <span>{opt.text}</span>
                          {submitted && rightOpt && (
                            <CheckCircle2 size={16} aria-hidden="true" />
                          )}
                          {submitted && selected && !rightOpt && (
                            <XCircle size={16} aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div
                    className={`curso-quiz-feedback ${isCorrect ? "ok" : "err"}`}
                    role="status"
                  >
                    <p style={{ marginBottom: 4 }}>
                      <strong>
                        {isCorrect ? "✓ Acerto!" : "✗ Resposta incorreta."}
                      </strong>{" "}
                      {!isCorrect && chosenOpt?.whyNot ? chosenOpt.whyNot : ""}
                    </p>
                    <p className="curso-why" style={{ marginTop: 0 }}>
                      <strong>Explicação:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="curso-media-actions" style={{ marginTop: 20 }}>
          {!submitted ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={answeredCount < FINAL_EXAM_QUESTIONS.length}
              onClick={handleSubmitExam}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Finalizar exame ({answeredCount}/{FINAL_EXAM_QUESTIONS.length})
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleResetExam}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Refazer exame final
            </button>
          )}
        </div>

        {submitted && (
          <div
            className={`curso-exam-result ${passed ? "ok" : "err"}`}
            role="status"
          >
            <div>
              <strong>
                Resultado: {correctCount}/{FINAL_EXAM_QUESTIONS.length} ({percent}%) —{" "}
                {passed
                  ? "Aprovado! Certificado liberado."
                  : `Nota mínima é ${PASS_PERCENT}% (12 acertos). Revise os erros acima e tente novamente.`}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Emissor e Prévia Profissional do Certificado */}
      {(passed || savedCert) && (
        <div className="curso-sim-card" style={{ marginTop: 24 }}>
          <div className="curso-sim-head">
            <div>
              <span className="curso-badge">Certificado Profissional · Curso Livre</span>
              <h3>Emita seu certificado pela Maldivas Tech</h3>
            </div>
          </div>

          <form onSubmit={handleIssueCertificate} className="curso-cert-form">
            <div className="curso-field">
              <label htmlFor="cert-student-name">
                Seu nome completo (como sairá no certificado)
              </label>
              <input
                id="cert-student-name"
                type="text"
                required
                minLength={3}
                placeholder="Ex.: Maria Clara Oliveira"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Award size={16} aria-hidden="true" />
              {savedCert ? "Atualizar certificado" : "Gerar certificado"}
            </button>
          </form>

          {savedCert && (
            <div className="curso-cert-wrapper">
              <article
                id="maldivas-certificate-print"
                className="curso-cert-sheet"
                aria-label="Certificado de conclusão de curso livre da Maldivas Tech"
              >
                <div className="curso-cert-top">
                  <div className="curso-cert-brand">
                    <ShieldCheck size={22} aria-hidden="true" />
                    <span>MALDIVAS TECH · ENGENHARIA DE SOFTWARE</span>
                  </div>
                  <span className="curso-cert-tag">CURSO LIVRE · 38H 10MIN</span>
                </div>

                <p className="curso-cert-kicker">CERTIFICADO DE CONCLUSÃO</p>
                <p className="curso-cert-intro">Certificamos que</p>
                <h4 className="curso-cert-name">{savedCert.studentName}</h4>
                <p className="curso-cert-body">
                  concluiu com aproveitamento de <strong>{savedCert.percent}%</strong>{" "}
                  ({savedCert.score}/{savedCert.total} questões no exame final) o curso livre{" "}
                  <strong>
                    Construa seu marketplace: do código ao pagamento em produção
                  </strong>{" "}
                  (estudo de caso MySuperStore), totalizando{" "}
                  <strong>38 horas e 10 minutos</strong> distribuídas em 18 aulas
                  (Módulo 0 Fundamentos, modelo de dados, PIX/cartão com mTLS, webhook
                  idempotente, repasse, estorno, Celery, WebSockets, Docker/deploy e
                  operação jurídica/LGPD).
                </p>

                <div className="curso-cert-footer">
                  <div>
                    <div className="curso-cert-sig-line" />
                    <strong>Rafael Maldivas</strong>
                    <span>Fundador & Instrutor · Maldivas Tech</span>
                  </div>
                  <div className="curso-cert-meta">
                    <span>Emitido em: {savedCert.issuedAt}</span>
                    <span>
                      Código: <code>{savedCert.code}</code>
                    </span>
                    <span>Modalidade: Curso livre (não regulamentado pelo MEC)</span>
                  </div>
                </div>
              </article>

              <div className="curso-media-actions" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  <Printer size={16} aria-hidden="true" />
                  Imprimir / Salvar Certificado em PDF
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleCopyCode(savedCert.code)}
                >
                  <Copy size={16} aria-hidden="true" />
                  {copied ? "Código copiado!" : `Copiar código (${savedCert.code})`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

