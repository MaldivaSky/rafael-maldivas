"use client";

import { useState } from "react";
import { Layers } from "lucide-react";

export type VisualDiagramId =
  | "f01-viagem"
  | "f03-django-ciclo"
  | "f04-drf-pipeline"
  | "a02-modelo-dados"
  | "a04-corrida-estoque"
  | "a06-escudo-webhook"
  | "a08-estados-pedido"
  | "a10-infra-1gb";

type DiagramNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
  detail: string;
};

type DiagramEdge = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type DiagramSpec = {
  badge: string;
  title: string;
  subtitle: string;
  viewBox: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

const DIAGRAMS: Record<VisualDiagramId, DiagramSpec> = {
  "f01-viagem": {
    badge: "Esquema visual interativo · Clique em cada etapa",
    title: "A viagem de um pedido do toque no celular até o banco",
    subtitle: "Cada caixa representa um posto de trabalho real na stack do MySuperStore.",
    viewBox: "0 0 760 220",
    nodes: [
      { id: "n1", label: "1. Celular", sub: "Next.js + JSON", x: 15, y: 25, w: 135, h: 68, accent: true, detail: "A tela monta a comanda JSON e envia via HTTPS. Nunca decide preço final nem estoque." },
      { id: "n2", label: "2. Porteiro", sub: "Caddy TLS", x: 170, y: 25, w: 125, h: 68, detail: "Proxy reverso que confere o certificado HTTPS e encaminha a requisição segura ao Django." },
      { id: "n3", label: "3. Garçom", sub: "urls.py", x: 315, y: 25, w: 125, h: 68, detail: "Lê a rota (/api/v1/orders/) e entrega para o ViewSet responsável." },
      { id: "n4", label: "4. Conferente", sub: "Serializer DRF", x: 460, y: 25, w: 135, h: 68, detail: "Valida campos obrigatórios, tipos e recalcula valores no servidor." },
      { id: "n5", label: "5. Cozinheiro", sub: "View + ORM", x: 615, y: 25, w: 130, h: 68, detail: "Executa a regra de negócio, trava estoque e traduz Python para SQL via ORM." },
      { id: "n6", label: "6. Despensa", sub: "PostgreSQL", x: 250, y: 128, w: 260, h: 70, accent: true, detail: "Grava pedido, sub-pedidos e baixa condicional de estoque de forma atômica, retornando HTTP 201 Criado." },
    ],
    edges: [
      { x1: 150, y1: 59, x2: 170, y2: 59 },
      { x1: 295, y1: 59, x2: 315, y2: 59 },
      { x1: 440, y1: 59, x2: 460, y2: 59 },
      { x1: 595, y1: 59, x2: 615, y2: 59 },
      { x1: 680, y1: 93, x2: 510, y2: 163 },
      { x1: 250, y1: 163, x2: 82, y2: 93 },
    ],
  },
  "f03-django-ciclo": {
    badge: "Esquema visual interativo · Clique em cada etapa",
    title: "Do Model em Python até a tabela real no banco de dados",
    subtitle: "Como o Django transforma uma classe Python em estrutura versionada no SQL.",
    viewBox: "0 0 760 190",
    nodes: [
      { id: "m1", label: "models.py", sub: "Classe Produto", x: 20, y: 55, w: 155, h: 76, accent: true, detail: "Você descreve os campos (nome, preço em DecimalField, estoque) como uma classe Python." },
      { id: "m2", label: "makemigrations", sub: "Gera planta 0001", x: 205, y: 55, w: 165, h: 76, detail: "Compara o model atual com o histórico e cria um arquivo de migração versionado no Git." },
      { id: "m3", label: "migrate", sub: "Executa SQL DDL", x: 400, y: 55, w: 160, h: 76, detail: "Aplica o CREATE TABLE / ALTER TABLE no banco de forma segura e rastreável." },
      { id: "m4", label: "ORM & Admin", sub: "CRUD + Queries", x: 590, y: 55, w: 150, h: 76, accent: true, detail: "Produto.objects.filter(...) consulta a tabela em Python e o /admin já exibe a interface pronta." },
    ],
    edges: [
      { x1: 175, y1: 93, x2: 205, y2: 93 },
      { x1: 370, y1: 93, x2: 400, y2: 93 },
      { x1: 560, y1: 93, x2: 590, y2: 93 },
    ],
  },
  "f04-drf-pipeline": {
    badge: "Esquema visual interativo · Clique em cada etapa",
    title: "Pipeline de uma API REST no Django REST Framework",
    subtitle: "Como Router, ViewSet e Serializer decidem o status HTTP de resposta.",
    viewBox: "0 0 760 200",
    nodes: [
      { id: "r1", label: "Cliente HTTP", sub: "GET / POST / PATCH", x: 15, y: 60, w: 145, h: 74, detail: "Envia método HTTP, cabeçalhos (JWT) e corpo JSON para o endereço da API." },
      { id: "r2", label: "DefaultRouter", sub: "Mapeia URLs", x: 185, y: 60, w: 145, h: 74, detail: "Gera automaticamente rotas de listagem (/produtos/) e detalhe (/produtos/1/)." },
      { id: "r3", label: "Serializer", sub: "Valida & serializa", x: 355, y: 60, w: 150, h: 74, accent: true, detail: "Se o JSON vier inválido, barra imediatamente com 400 Bad Request antes de tocar o banco." },
      { id: "r4", label: "ViewSet", sub: "Regra + Status HTTP", x: 530, y: 60, w: 210, h: 74, accent: true, detail: "Retorna 200 OK, 201 Created, 404 Not Found, 405 Method Not Allowed ou 409 Conflict." },
    ],
    edges: [
      { x1: 160, y1: 97, x2: 185, y2: 97 },
      { x1: 330, y1: 97, x2: 355, y2: 97 },
      { x1: 505, y1: 97, x2: 530, y2: 97 },
    ],
  },
  "a02-modelo-dados": {
    badge: "Esquema visual interativo · Clique em cada tabela",
    title: "Modelo financeiro relacional do MySuperStore",
    subtitle: "Um pagamento único se divide por loja preservando histórico com snapshots e PROTECT.",
    viewBox: "0 0 760 230",
    nodes: [
      { id: "d1", label: "Order", sub: "1 pagamento global", x: 20, y: 78, w: 150, h: 74, accent: true, detail: "Guarda comprador, totais em DecimalField e status global do pagamento." },
      { id: "d2", label: "SubOrder", sub: "1 por lojista", x: 210, y: 20, w: 165, h: 68, detail: "Cada loja no carrinho gera um SubOrder próprio com status de envio e rastreio independentes." },
      { id: "d3", label: "OrderItem", sub: "Snapshot preço/nome", x: 210, y: 138, w: 165, h: 68, detail: "Congela o preço e título do momento da compra: se o lojista editar o produto amanhã, o pedido antigo não muda." },
      { id: "d4", label: "Payment", sub: "efí_txid + status", x: 420, y: 20, w: 155, h: 68, detail: "Registra a tentativa de pagamento no provedor (PIX/Cartão) com ID determinístico." },
      { id: "d5", label: "Payout & Commission", sub: "PROTECT no ledger", x: 420, y: 138, w: 175, h: 68, accent: true, detail: "Usa on_delete=PROTECT para impedir que alguém apague registros financeiros por acidente." },
      { id: "d6", label: "Conservação", sub: "Lojista + Comiss. = Total", x: 615, y: 78, w: 130, h: 74, detail: "Invariante testada: nenhum centavo pode surgir ou desaparecer na divisão." },
    ],
    edges: [
      { x1: 170, y1: 115, x2: 210, y2: 54 },
      { x1: 170, y1: 115, x2: 210, y2: 172 },
      { x1: 375, y1: 54, x2: 420, y2: 54 },
      { x1: 375, y1: 172, x2: 420, y2: 172 },
      { x1: 575, y1: 54, x2: 615, y2: 115 },
      { x1: 595, y1: 172, x2: 615, y2: 115 },
    ],
  },
  "a04-corrida-estoque": {
    badge: "Esquema visual interativo · Clique em cada camada",
    title: "Defesa em 3 camadas contra venda duplicada de estoque",
    subtitle: "Como impedir que dois cliques no mesmo milissegundo vendam a última unidade.",
    viewBox: "0 0 760 200",
    nodes: [
      { id: "c1", label: "1. transaction.atomic", sub: "Tudo ou nada", x: 20, y: 60, w: 175, h: 76, detail: "Se qualquer item falhar no meio do pedido, o PostgreSQL desfaz tudo (ROLLBACK) sem deixar pedido órfão." },
      { id: "c2", label: "2. select_for_update", sub: "Ordem fixa de IDs", x: 225, y: 60, w: 175, h: 76, accent: true, detail: "Enfileira transações concorrentes ordenando os IDs de produto para evitar deadlock." },
      { id: "c3", label: "3. UPDATE condicional", sub: "WHERE stock >= qty", x: 430, y: 60, w: 185, h: 76, accent: true, detail: "O banco só subtrai se ainda houver estoque naquele instante; se retornar 0 linhas, a compra é recusada." },
      { id: "c4", label: "Resultado", sub: "1 venda · 0 negativo", x: 640, y: 60, w: 105, h: 76, detail: "A primeira transação leva a peça; a segunda recebe erro limpo de estoque insuficiente." },
    ],
    edges: [
      { x1: 195, y1: 98, x2: 225, y2: 98 },
      { x1: 400, y1: 98, x2: 430, y2: 98 },
      { x1: 615, y1: 98, x2: 640, y2: 98 },
    ],
  },
  "a06-escudo-webhook": {
    badge: "Esquema visual interativo · Clique em cada barreira",
    title: "Escudo de 4 barreiras do Webhook de pagamento",
    subtitle: "URL pública na internet: como provar que o aviso é real e não confirmar duas vezes.",
    viewBox: "0 0 760 200",
    nodes: [
      { id: "w1", label: "1. Fail-closed", sub: "Sem segredo = 503", x: 15, y: 60, w: 155, h: 76, detail: "Se o segredo não estiver configurado no ambiente, o servidor recusa tudo em vez de aceitar sem validar." },
      { id: "w2", label: "2. Tempo constante", sub: "hmac.compare_digest", x: 195, y: 60, w: 170, h: 76, accent: true, detail: "Compara o segredo na URL em tempo constante para impedir timing attacks." },
      { id: "w3", label: "3. Conferir valor", sub: "txid + valor na Efí", x: 390, y: 60, w: 165, h: 76, detail: "Consulta o provedor e valida que o valor pago bate exatamente com o total do pedido." },
      { id: "w4", label: "4. Idempotência", sub: "select_for_update()", x: 580, y: 60, w: 165, h: 76, accent: true, detail: "Trava o pedido; se já estiver PAID, ignora o webhook repetido sem duplicar repasse." },
    ],
    edges: [
      { x1: 170, y1: 98, x2: 195, y2: 98 },
      { x1: 365, y1: 98, x2: 390, y2: 98 },
      { x1: 555, y1: 98, x2: 580, y2: 98 },
    ],
  },
  "a08-estados-pedido": {
    badge: "Esquema visual interativo · Clique em cada estado",
    title: "Máquina de estados e limpeza de estoque preso",
    subtitle: "Reservar estoque exige regra de expiração para não travar a loja com carrinhos abandonados.",
    viewBox: "0 0 760 210",
    nodes: [
      { id: "s1", label: "PENDING", sub: "Estoque reservado", x: 20, y: 72, w: 145, h: 72, accent: true, detail: "Pedido criado; estoque já foi baixado condicionalmente aguardando PIX ou confirmação do cartão." },
      { id: "s2", label: "PAID", sub: "Webhook / consulta", x: 220, y: 20, w: 155, h: 64, accent: true, detail: "Pagamento confirmado; libera preparação do envio e agenda/executa repasse." },
      { id: "s3", label: "EXPIRED / CANCELLED", sub: "Celery Beat devolve", x: 220, y: 126, w: 185, h: 64, detail: "Após o prazo sem pagamento, a tarefa periódica cancela e devolve o estoque (com exceção documentada para cartão pendente)." },
      { id: "s4", label: "REFUNDED", sub: "Estorno com teto", x: 455, y: 20, w: 165, h: 64, detail: "Devolução total ou parcial validada contra o teto acumulado e confirmada pelo provedor." },
      { id: "s5", label: "Worker Celery", sub: "Só quando precisa", x: 455, y: 126, w: 165, h: 64, detail: "Tarefas demoradas ou periódicas rodam fora da requisição HTTP para não travar o usuário." },
    ],
    edges: [
      { x1: 165, y1: 108, x2: 220, y2: 52 },
      { x1: 165, y1: 108, x2: 220, y2: 158 },
      { x1: 375, y1: 52, x2: 455, y2: 52 },
      { x1: 405, y1: 158, x2: 455, y2: 158 },
    ],
  },
  "a10-infra-1gb": {
    badge: "Esquema visual interativo · Clique em cada serviço",
    title: "Arquitetura em produção sob orçamento de 1 GB de RAM",
    subtitle: "Medições reais do estudo de caso: onde a memória vai e como manter tudo de pé.",
    viewBox: "0 0 760 220",
    nodes: [
      { id: "i1", label: "Caddy", sub: "Proxy + TLS", x: 20, y: 74, w: 130, h: 72, detail: "Termina HTTPS automático e encaminha HTTP para o Django e WebSockets para o Daphne." },
      { id: "i2", label: "Django API", sub: "Teto 640 MB", x: 180, y: 22, w: 165, h: 68, accent: true, detail: "Migrações rodam ANTES de subir o novo código da aplicação para evitar erro de schema." },
      { id: "i3", label: "Celery Worker", sub: "--pool=solo", x: 180, y: 128, w: 165, h: 68, detail: "Usa --pool=solo para economizar memória na VM enxuta sem multiplicar processos." },
      { id: "i4", label: "Redis", sub: "24 MB · noeviction", x: 385, y: 22, w: 165, h: 68, detail: "Broker e cache com política noeviction para não descartar filas silenciosamente." },
      { id: "i5", label: "PostgreSQL", sub: "11 MB dados · 1,7 ms", x: 385, y: 128, w: 165, h: 68, accent: true, detail: "Banco local ou próximo reduz latência de ~200 ms para ~1,7 ms; backup é testado com restore real." },
      { id: "i6", label: "Swap + Health", sub: "1,06 GB swap", x: 585, y: 74, w: 155, h: 72, detail: "Monitoramento e healthcheck garantem reinício limpo sem derrubar o servidor em picos." },
    ],
    edges: [
      { x1: 150, y1: 110, x2: 180, y2: 56 },
      { x1: 150, y1: 110, x2: 180, y2: 162 },
      { x1: 345, y1: 56, x2: 385, y2: 56 },
      { x1: 345, y1: 162, x2: 385, y2: 162 },
      { x1: 550, y1: 56, x2: 585, y2: 110 },
      { x1: 550, y1: 162, x2: 585, y2: 110 },
    ],
  },
};

export default function LessonVisualDiagram({
  diagramId,
}: {
  diagramId?: VisualDiagramId;
}) {
  const spec = diagramId ? DIAGRAMS[diagramId] : undefined;
  const [activeId, setActiveId] = useState<string>(spec?.nodes[0]?.id ?? "");

  if (!spec) return null;

  const activeNode = spec.nodes.find((n) => n.id === activeId) ?? spec.nodes[0];

  return (
    <section className="curso-sim-card" aria-labelledby={`diag-title-${diagramId}`}>
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">{spec.badge}</span>
          <h2 id={`diag-title-${diagramId}`}>
            <Layers size={20} aria-hidden="true" /> {spec.title}
          </h2>
        </div>
      </div>
      <p className="curso-muted">{spec.subtitle}</p>

      <figure className="curso-svg-figure" style={{ marginTop: 14 }}>
        <svg
          viewBox={spec.viewBox}
          className="curso-svg"
          role="img"
          aria-labelledby={`svg-title-${diagramId} svg-desc-${diagramId}`}
        >
          <title id={`svg-title-${diagramId}`}>{spec.title}</title>
          <desc id={`svg-desc-${diagramId}`}>{spec.subtitle}</desc>

          {spec.edges.map((e, idx) => (
            <line
              key={idx}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="svg-line"
            />
          ))}

          {spec.nodes.map((node) => {
            const isActive = node.id === activeNode.id;
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => setActiveId(node.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setActiveId(node.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={10}
                  className={
                    isActive
                      ? "svg-box-accent"
                      : node.accent
                        ? "svg-box"
                        : "svg-box-muted"
                  }
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 - 4}
                  textAnchor="middle"
                  className="svg-title"
                  style={{ fontSize: "13px" }}
                >
                  {node.label}
                </text>
                <text
                  x={node.x + node.w / 2}
                  y={node.y + node.h / 2 + 15}
                  textAnchor="middle"
                  className="svg-sub"
                  style={{ fontSize: "11px" }}
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>

      <div className="curso-diagram-detail" role="region" aria-live="polite">
        <strong>
          {activeNode.label} ({activeNode.sub}):
        </strong>{" "}
        <span>{activeNode.detail}</span>
      </div>
    </section>
  );
}

