"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "1. Em um pedido de R$ 100,00 sem frete e sem cupom, com comissão de 12% e taxa PIX de 0,99%, qual é a sobra líquida da plataforma?",
    options: ["R$ 12,00", "R$ 11,01", "R$ 10,62", "R$ 88,00"],
    correctIndex: 1,
    explanation:
      "A comissão bruta é 12% de R$ 100,00 = R$ 12,00. A taxa PIX do provedor (0,99% sobre R$ 100,00 = R$ 0,99) é absorvida pela plataforma: R$ 12,00 − R$ 0,99 = R$ 11,01.",
  },
  {
    id: "q2",
    question:
      "2. No mesmo pedido de R$ 100,00, quando o cliente paga no cartão (taxa de exemplo: 3,99% + R$ 0,39), quanto sobra para a plataforma?",
    options: ["R$ 11,01", "R$ 8,01", "R$ 7,62", "R$ 4,38"],
    correctIndex: 2,
    explanation:
      "A taxa do cartão sobre R$ 100,00 é R$ 3,99 + R$ 0,39 = R$ 4,38. Subtraindo da comissão de R$ 12,00, a sobra líquida é R$ 7,62 — 30,8% menor que no PIX.",
  },
  {
    id: "q3",
    question:
      "3. Sobre qual base incide a comissão da plataforma no modelo do MySuperStore?",
    options: [
      "Sobre o total pago pelo cliente, incluindo o frete",
      "Apenas sobre o subtotal efetivo dos produtos (após desconto de cupom), sem incidir no frete",
      "Sobre o valor bruto antes do cupom de desconto",
      "Apenas sobre o valor do frete",
    ],
    correctIndex: 1,
    explanation:
      "Em orders/models.py:78-83, a comissão incide somente sobre o subtotal efetivo (produtos menos desconto). O frete é repassado integralmente ao lojista que envia a mercadoria.",
  },
  {
    id: "q4",
    question:
      "4. Por que o código do MySuperStore armazena dinheiro em Decimal (ou centavos inteiros) em vez de float?",
    options: [
      "Porque float não funciona no PostgreSQL",
      "Porque float ocupa mais memória que string",
      "Porque ponto flutuante binário gera imprecisões (ex.: 0.1 + 0.2 ≠ 0.3) que viram centavos errados em repasses",
      "Porque Python não permite multiplicar números float",
    ],
    correctIndex: 2,
    explanation:
      "Números em ponto flutuante binário não representam exatamente frações decimais como 0,10 ou 0,01. Usar Decimal com ROUND_HALF_UP ou centavos inteiros garante a conservação exata: lojista + comissão = total.",
  },
  {
    id: "q5",
    question:
      "5. Qual propriedade garante que nenhum centavo foi criado ou perdido na divisão de um pedido?",
    options: [
      "valor_do_lojista + comissão == total_pago_pelo_cliente",
      "comissão − taxa_do_provedor == total_pago_pelo_cliente",
      "subtotal + frete == sobra_da_plataforma",
      "cupom + comissão == valor_do_lojista",
    ],
    correctIndex: 0,
    explanation:
      "A equação de conservação valor_do_lojista + comissão == total_pago_pelo_cliente garante que a soma do que vai para o lojista com o que fica na plataforma fecha exatamente com o pago pelo comprador.",
  },
  {
    id: "q6",
    question:
      "6. Por que o MySuperStore divide um Order em um ou mais SubOrders?",
    options: [
      "Para cobrar o frete duas vezes do cliente",
      "Porque um carrinho pode ter itens de lojas diferentes, e envio, rastreio e repasse são independentes por lojista",
      "Para evitar o uso de chaves estrangeiras no banco",
      "Porque o PIX não aceita mais de um produto por cobrança",
    ],
    correctIndex: 1,
    explanation:
      "Quando o cliente compra de duas lojas no mesmo checkout, cada loja despacha em prazos diferentes e recebe seu próprio Payout. O SubOrder isola o fulfillment e o financeiro por vendedor.",
  },
  {
    id: "q7",
    question:
      "7. Por que o servidor deve recalcular subtotal, frete e total no backend em vez de aceitar o total enviado pelo navegador?",
    options: [
      "Porque o navegador não sabe somar números inteiros",
      "Porque qualquer dado vindo do navegador pode ser manipulado pelo usuário antes do envio",
      "Para deixar a resposta da API mais lenta",
      "Porque o JSON não suporta casas decimais",
    ],
    correctIndex: 1,
    explanation:
      "O cliente controla tudo que roda no navegador. O servidor deve tratar os dados da requisição apenas como intenção de compra e recalcular todos os valores a partir do catálogo e das regras no banco.",
  },
  {
    id: "q8",
    question:
      "8. O que acontece quando um pedido de R$ 300,00 atinge a faixa de frete grátis (R$ 299,00) com frete informado de R$ 25,00?",
    options: [
      "O cliente paga R$ 325,00 e o lojista recebe R$ 25,00 de frete",
      "O frete cobrado do cliente é R$ 0,00; a comissão incide sobre R$ 300,00 e o lojista não recebe frete",
      "A plataforma paga R$ 25,00 extras além do subtotal ao lojista",
      "A comissão passa a ser calculada sobre R$ 325,00",
    ],
    correctIndex: 1,
    explanation:
      "Quando (subtotal − desconto) >= frete_grátis_mínimo, o frete cobrado do cliente zera. O lojista recebe (subtotal_efetivo − comissão) + 0 e arca com a etiqueta do envio.",
  },
  {
    id: "q9",
    question:
      "9. Qual afirmação está correta sobre a natureza jurídica deste curso e o certificado?",
    options: [
      "É um curso técnico reconhecido pelo MEC com diploma",
      "É uma pós-graduação lato sensu",
      "É um curso livre de capacitação profissional com certificado de conclusão verificável, sem vínculo com o MEC",
      "O certificado garante aprovação automática em processos seletivos",
    ],
    correctIndex: 2,
    explanation:
      "Cursos livres não são regulamentados pelo MEC e não emitem diploma acadêmico. O valor do certificado está na verificação pública do código e na comprovação prática do projeto avaliado.",
  },
];

export default function LessonQuiz({
  onComplete,
}: {
  onComplete?: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUESTIONS.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function choose(qId: string, idx: number) {
    const next = { ...answers, [qId]: idx };
    setAnswers(next);
    if (Object.keys(next).length === QUESTIONS.length) {
      const score = QUESTIONS.filter(
        (q) => next[q.id] === q.correctIndex,
      ).length;
      onComplete?.(score, QUESTIONS.length);
    }
  }

  return (
    <section className="curso-sim-card" aria-labelledby="quiz-m1-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Avaliação · Quiz do Módulo 1</span>
          <h3 id="quiz-m1-title">
            <HelpCircle size={20} aria-hidden="true" />
            Teste seu entendimento ({QUESTIONS.length} perguntas)
          </h3>
        </div>
        <span className="curso-pill" aria-live="polite">
          {answeredCount}/{QUESTIONS.length} respondidas
        </span>
      </div>

      <div className="curso-quiz-list">
        {QUESTIONS.map((q) => {
          const picked = answers[q.id];
          const hasPicked = typeof picked === "number";
          const isCorrect = picked === q.correctIndex;

          return (
            <fieldset key={q.id} className="curso-quiz-item">
              <legend>{q.question}</legend>
              <div className="curso-quiz-options">
                {q.options.map((opt, idx) => {
                  const selected = picked === idx;
                  const stateClass = !hasPicked
                    ? ""
                    : idx === q.correctIndex
                      ? "correct"
                      : selected
                        ? "wrong"
                        : "";

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`curso-quiz-opt ${selected ? "selected" : ""} ${stateClass}`}
                      aria-pressed={selected}
                      onClick={() => choose(q.id, idx)}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {hasPicked && (
                <div
                  className={`curso-quiz-feedback ${isCorrect ? "ok" : "err"}`}
                  aria-live="polite"
                >
                  {isCorrect ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : (
                    <XCircle size={18} aria-hidden="true" />
                  )}
                  <p>
                    <strong>{isCorrect ? "Correto!" : "Quase lá."}</strong>{" "}
                    {q.explanation}
                  </p>
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      {allAnswered && (
        <div className="curso-alert-ok" role="status" aria-live="polite">
          <CheckCircle2 size={20} aria-hidden="true" />
          <div>
            <strong>
              Resultado do Módulo 1: {correctCount} de {QUESTIONS.length} acertos (
              {Math.round((correctCount / QUESTIONS.length) * 100)}%)
            </strong>
            <p>
              {correctCount >= 7
                ? "Excelente! Você atingiu o critério mínimo de 70% neste módulo."
                : "Revise as explicações acima e refaça as questões para consolidar os números antes do Módulo 2."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
