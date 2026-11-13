"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";

type HttpScenario = {
  id: string;
  method: "GET" | "POST" | "DELETE";
  path: string;
  status: number;
  statusText: string;
  requestBody?: string;
  responseBody: string;
  explanation: string;
};

const SCENARIOS: HttpScenario[] = [
  {
    id: "200",
    method: "GET",
    path: "/api/produtos/",
    status: 200,
    statusText: "200 OK",
    responseBody: `[
  { "id": 1, "nome": "Bolsa Macramê", "preco": "149.90", "estoque": 3 }
]`,
    explanation:
      "Consulta bem-sucedida. O servidor entregou a lista em JSON sem alterar nada na despensa.",
  },
  {
    id: "201",
    method: "POST",
    path: "/api/produtos/",
    status: 201,
    statusText: "201 Created",
    requestBody: `{ "nome": "Cesto Trançado", "preco": "89.00", "estoque": 5 }`,
    responseBody: `{ "id": 2, "nome": "Cesto Trançado", "preco": "89.00", "estoque": 5 }`,
    explanation:
      "Recurso criado com sucesso! O Serializer validou os campos e o banco gerou o id=2.",
  },
  {
    id: "400",
    method: "POST",
    path: "/api/produtos/",
    status: 400,
    statusText: "400 Bad Request",
    requestBody: `{ "nome": "", "preco": "abc" }`,
    responseBody: `{
  "nome": ["Este campo não pode ser em branco."],
  "preco": ["Um número válido é necessário."]
}`,
    explanation:
      "O conferente (Serializer) barrou na porta: dado malformado nunca chega ao banco de dados.",
  },
  {
    id: "404",
    method: "GET",
    path: "/api/produtos/999/",
    status: 404,
    statusText: "404 Not Found",
    responseBody: `{ "detail": "Não encontrado." }`,
    explanation:
      "O formato do pedido estava correto, mas não existe produto com id 999 na despensa.",
  },
  {
    id: "405",
    method: "DELETE",
    path: "/api/produtos/",
    status: 405,
    statusText: "405 Method Not Allowed",
    responseBody: `{ "detail": "Método 'DELETE' não é permitido." }`,
    explanation:
      "O endereço da coleção /api/produtos/ existe (aceita GET e POST), mas não permite apagar a lista inteira.",
  },
  {
    id: "409",
    method: "POST",
    path: "/api/produtos/1/comprar/",
    status: 409,
    statusText: "409 Conflict",
    requestBody: `{ "quantidade": 5 }`,
    responseBody: `{ "erro": "Estoque insuficiente." }`,
    explanation:
      "Os dados são válidos (não é 400), mas a quantidade pedida conflita com o estado atual do estoque (3 unidades).",
  },
];

export default function HttpStatusLab() {
  const [activeId, setActiveId] = useState<string>("200");
  const current = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  return (
    <section className="curso-sim-card" aria-labelledby="http-lab-title">
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">Laboratório · Status HTTP na prática</span>
          <h3 id="http-lab-title">
            <Terminal size={20} aria-hidden="true" />
            Provoque cada código de resposta da API (200, 201, 400, 404, 405, 409)
          </h3>
        </div>
      </div>

      <div className="curso-flow-steps" role="tablist" aria-label="Cenários HTTP">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === current.id}
            className={`curso-flow-btn ${s.id === current.id ? "on" : ""}`}
            onClick={() => setActiveId(s.id)}
          >
            <span className="curso-flow-num">{s.status}</span>
            <span>
              {s.method} {s.path}
            </span>
          </button>
        ))}
      </div>

      <div className="curso-flow-detail" aria-live="polite">
        <div className="curso-flow-meta">
          <span className="curso-badge">{current.statusText}</span>
          <code className="curso-code-ref">
            {current.method} {current.path}
          </code>
        </div>

        {current.requestBody && (
          <>
            <p className="curso-fine" style={{ marginBottom: 4 }}>
              Corpo enviado (Request JSON):
            </p>
            <pre className="curso-code-block">
              <code>{current.requestBody}</code>
            </pre>
          </>
        )}

        <p className="curso-fine" style={{ marginBottom: 4 }}>
          Resposta do servidor (Response JSON):
        </p>
        <pre className="curso-code-block">
          <code>{current.responseBody}</code>
        </pre>

        <p className="curso-why">
          <strong>O que o professor destaca:</strong> {current.explanation}
        </p>
      </div>
    </section>
  );
}

