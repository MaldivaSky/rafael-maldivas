"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FolderArchive,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";

type RubricCheck = {
  id: string;
  label: string;
  points: number;
  passed: boolean;
  detail: string;
};

function evaluateSubmission({
  repoUrl,
  testOutput,
  codeSnippet,
}: {
  repoUrl: string;
  testOutput: string;
  codeSnippet: string;
}): { total: number; checks: RubricCheck[] } {
  const urlOk = /^https:\/\/(github\.com|gitlab\.com|bitbucket\.org)\/[^\s/]+\/[^\s/]+/i.test(
    repoUrl.trim(),
  );

  const ranMatch = testOutput.match(/Ran\s+(\d+)\s+tests?/i);
  const ranCount = ranMatch ? Number(ranMatch[1]) : 0;
  const hasOk = /\bOK\b/.test(testOutput);
  const hasFailure =
    /\b(FAILED|ERROR|NotImplementedError|AssertionError|Traceback)\b/i.test(
      testOutput,
    );
  const testsPassed = ranCount >= 10 && hasOk && !hasFailure;

  const hasDecimal =
    /Decimal|ROUND_HALF_UP/.test(codeSnippet) &&
    !/float\s*\(\s*subtotal|float\s*\(\s*preco/i.test(codeSnippet);
  const hasStockGuard =
    /WHERE\s+.*?>=\s*1|WHERE\s+stock|select_for_update|Barrier|threading\.Lock/i.test(
      codeSnippet,
    );
  const hasWebhookGuard =
    /compare_digest|503|fail[-_]?closed|cancelled|pagamentos_orfaos/i.test(
      codeSnippet,
    );
  const hasRefundCap =
    /estornado|teto|ErroEstorno|_chaves|determinist/i.test(codeSnippet);

  const checks: RubricCheck[] = [
    {
      id: "repo",
      label: "Repositório público válido (GitHub / GitLab / Bitbucket)",
      points: 15,
      passed: urlOk,
      detail: urlOk
        ? "URL de repositório reconhecida."
        : "Informe uma URL completa iniciando com https://github.com/usuario/repositorio.",
    },
    {
      id: "tests",
      label: "Saída real de `python testes_aceitacao.py .` com OK (mín. 10 testes)",
      points: 35,
      passed: testsPassed,
      detail: testsPassed
        ? `Detectados ${ranCount} testes executados com status OK e sem falhas.`
        : "Cole a saída completa do terminal contendo 'Ran ... tests' e 'OK', sem FAILED, ERROR ou NotImplementedError.",
    },
    {
      id: "money",
      label: "Dinheiro exato com Decimal / ROUND_HALF_UP (sem float)",
      points: 15,
      passed: hasDecimal,
      detail: hasDecimal
        ? "Uso de Decimal / ROUND_HALF_UP identificado."
        : "Inclua no trecho colado sua função de cálculo com Decimal e ROUND_HALF_UP.",
    },
    {
      id: "stock",
      label: "Concorrência de estoque (UPDATE condicional / Lock / Barrier)",
      points: 15,
      passed: hasStockGuard,
      detail: hasStockGuard
        ? "Proteção contra venda duplicada identificada."
        : "Inclua o trecho de estoque.py mostrando UPDATE condicional ou trava.",
    },
    {
      id: "webhook",
      label: "Defesa de webhook (compare_digest / fail-closed 503 / idempotência)",
      points: 10,
      passed: hasWebhookGuard,
      detail: hasWebhookGuard
        ? "Defesas de webhook e idempotência identificadas."
        : "Inclua o trecho de pagamento.py com hmac.compare_digest e fail-closed.",
    },
    {
      id: "refund",
      label: "Teto acumulado de estorno e idempotência de operação",
      points: 10,
      passed: hasRefundCap,
      detail: hasRefundCap
        ? "Regra de teto e chave determinística de estorno identificada."
        : "Inclua o trecho de estorno.py com checagem de teto e ErroEstorno.",
    },
  ];

  const total = checks.reduce((acc, c) => acc + (c.passed ? c.points : 0), 0);
  return { total, checks };
}

export default function ProjectSubmissionEvaluator() {
  const [repoUrl, setRepoUrl] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [evaluation, setEvaluation] = useState<{
    total: number;
    checks: RubricCheck[];
  } | null>(null);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [sendMsg, setSendMsg] = useState("");

  function handleEvaluate(e: React.FormEvent) {
    e.preventDefault();
    setEvaluation(
      evaluateSubmission({ repoUrl, testOutput, codeSnippet }),
    );
  }

  async function handleOfficialSend(e: React.FormEvent) {
    e.preventDefault();
    if (!evaluation || evaluation.total < 80) return;
    setSendStatus("sending");
    setSendMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          email: studentEmail.trim(),
          source: "curso-projeto-final",
          message: `Projeto Final minimarket | Rubrica: ${evaluation.total}/100 | Repo: ${repoUrl.trim()}`,
        }),
      });
      if (!res.ok) throw new Error("Falha ao enviar");
      setSendStatus("sent");
      setSendMsg(
        "Projeto registrado com sucesso! Nossa equipe recebeu seu repositório e a pontuação da rubrica.",
      );
    } catch {
      setSendStatus("error");
      setSendMsg(
        "Não foi possível enviar agora. Tente novamente ou guarde sua avaliação local.",
      );
    }
  }

  const approved = evaluation !== null && evaluation.total >= 80;

  return (
    <section className="curso-sim-card" aria-labelledby="project-eval-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Mão na massa · Projeto Final real</span>
          <h2 id="project-eval-title">
            <FolderArchive size={20} aria-hidden="true" /> Baixe o arcabouço, rode os testes e cole seu projeto para avaliação
          </h2>
        </div>
      </div>

      <p className="curso-muted">
        1) Baixe o arcabouço com a suíte oficial <code>testes_aceitacao.py</code> e os
        6 módulos vazios em <code>minimarket/</code>. 2) Execute{" "}
        <code>python testes_aceitacao.py .</code> na sua máquina e implemente até passar
        100% no verde. 3) Cole abaixo o repositório, a saída do terminal e o código
        implementado.
      </p>

      <div className="curso-media-actions" style={{ margin: "14px 0 18px" }}>
        <a
          href="/cursos/kits/projeto-final-minimarket-kit.zip"
          download="projeto-final-minimarket-kit.zip"
          className="btn btn-primary"
        >
          <Download size={16} aria-hidden="true" />
          Baixar arcabouço do Projeto Final (.zip)
        </a>
        <a
          href="/cursos/kits/mini-loja-kit.zip"
          download="mini-loja-kit.zip"
          className="btn btn-ghost"
        >
          <Download size={16} aria-hidden="true" />
          Baixar mini-loja (Módulo 0 .zip)
        </a>
      </div>

      <form onSubmit={handleEvaluate} className="curso-eval-form">
        <div className="curso-field">
          <label htmlFor="eval-repo">
            1. Link do repositório Git (GitHub / GitLab / Bitbucket)
          </label>
          <input
            id="eval-repo"
            type="url"
            required
            placeholder="https://github.com/seu-usuario/minimarket-curso"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        <div className="curso-field">
          <label htmlFor="eval-terminal">
            2. Cole a saída completa do terminal ao rodar{" "}
            <code>python testes_aceitacao.py .</code>
          </label>
          <textarea
            id="eval-terminal"
            rows={5}
            required
            className="curso-predict-textarea"
            placeholder="Ex.: Ran 12 tests in 0.042s ... OK"
            value={testOutput}
            onChange={(e) => setTestOutput(e.target.value)}
          />
        </div>

        <div className="curso-field">
          <label htmlFor="eval-code">
            3. Cole seus trechos principais de código (<code>dinheiro.py</code>,{" "}
            <code>estoque.py</code>, <code>pagamento.py</code>, <code>estorno.py</code>)
          </label>
          <textarea
            id="eval-code"
            rows={7}
            required
            className="curso-predict-textarea"
            placeholder="Cole aqui o código implementado para conferência automática das invariantes..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          <Terminal size={16} aria-hidden="true" />
          Avaliar projeto pela rubrica (0–100)
        </button>
      </form>

      {evaluation && (
        <div style={{ marginTop: 20 }}>
          <div className={`curso-exam-result ${approved ? "ok" : "err"}`}>
            <strong>
              Pontuação na rubrica: {evaluation.total}/100 —{" "}
              {approved
                ? "Aprovado para submissão oficial!"
                : "Mínimo de 80/100 necessário. Veja os pontos abaixo e ajuste antes de enviar."}
            </strong>
          </div>

          <ul className="curso-rubric-list">
            {evaluation.checks.map((c) => (
              <li
                key={c.id}
                className={`curso-rubric-item ${c.passed ? "ok" : "err"}`}
              >
                <div className="curso-rubric-head">
                  {c.passed ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <XCircle size={16} aria-hidden="true" />
                  )}
                  <strong>
                    {c.label} ({c.passed ? c.points : 0}/{c.points} pts)
                  </strong>
                </div>
                <p className="curso-fine">{c.detail}</p>
              </li>
            ))}
          </ul>

          {approved && (
            <form
              onSubmit={handleOfficialSend}
              className="curso-panel"
              style={{ marginTop: 18 }}
            >
              <h3>Enviar projeto aprovado para registro na Maldivas Tech</h3>
              <p className="curso-muted" style={{ marginBottom: 12 }}>
                Seu projeto atingiu {evaluation.total}/100 pontos. Preencha nome e e-mail
                para registrar sua entrega junto ao link do repositório.
              </p>
              <div className="curso-cert-form">
                <div className="curso-field">
                  <label htmlFor="sub-name">Nome completo</label>
                  <input
                    id="sub-name"
                    type="text"
                    required
                    minLength={3}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div className="curso-field">
                  <label htmlFor="sub-email">E-mail</label>
                  <input
                    id="sub-email"
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sendStatus === "sending"}
                >
                  <Send size={15} aria-hidden="true" />
                  {sendStatus === "sending" ? "Enviando..." : "Registrar entrega"}
                </button>
              </div>
              {sendMsg && (
                <p
                  className="curso-fine"
                  style={{
                    marginTop: 10,
                    color: sendStatus === "sent" ? "#4ade80" : "#f87171",
                  }}
                >
                  {sendMsg}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </section>
  );
}

