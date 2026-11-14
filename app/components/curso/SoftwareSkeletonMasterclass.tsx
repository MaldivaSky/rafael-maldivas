"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Download,
  FileText,
  Headphones,
  Layers,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ImplementationStep {
  order: number;
  id: string;
  badge: string;
  title: string;
  analogy: string;
  whatYouDo: string;
  whyThisOrder: string;
  codeFile: string;
  codeSnippet: string;
  lessonSlug: string;
  lessonLabel: string;
}

const IMPLEMENTATION_STEPS: ImplementationStep[] = [
  {
    order: 1,
    id: "step-1-modelagem",
    badge: "1º DEGRAU · BASE DE TUDO",
    title: "Modelagem de Dados (Entidades, Relações & Centavos)",
    analogy: "Planta estrutural do alicerce: decidir quais salas existem e o que cada gaveta guarda.",
    whatYouDo:
      "Antes de qualquer tela ou rota, você responde: QUEM existe no meu sistema? No marketplace existem Lojista (Store), Produto (Product), Pedido do Cliente (Order), Sub-pedido por Loja (SubOrder) e Item Congelado (OrderItem). Aqui você define os tipos de cada coluna e a regra sagrada: dinheiro é sempre inteiro em centavos (12990 = R$ 129,90).",
    whyThisOrder:
      "Se você começar pela tela ou pela API sem modelar os dados, você descobre no meio do caminho que não consegue dividir um pedido entre 2 lojistas ou que mudar o preço de um produto altera notas fiscais antigas!",
    codeFile: "02-alicerce-banco/models_esqueleto.py (ou orders/models.py)",
    codeSnippet: `class Product(models.Model):
    store = models.ForeignKey("stores.Store", on_delete=models.PROTECT)
    sku = models.CharField(max_length=64, unique=True)
    price_cents = models.PositiveIntegerField()  # R$ 129,90 = 12990 centavos
    stock_qty = models.PositiveIntegerField(default=0)

class OrderItem(models.Model):
    sub_order = models.ForeignKey("orders.SubOrder", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT) # Proíbe apagar produto já vendido!
    unit_price_cents_snapshot = models.PositiveIntegerField()      # Congela o preço pago no segundo da compra!
    quantity = models.PositiveIntegerField()`,
    lessonSlug: "modulo-2-modelo-de-dados",
    lessonLabel: "Estudar Modelagem em F03 e A02 →",
  },
  {
    order: 2,
    id: "step-2-migracoes",
    badge: "2º DEGRAU · CONCRETAGEM",
    title: "Migrações SQL & Índices (makemigrations → migrate)",
    analogy: "Transformar o desenho no papel em concreto armado dentro do banco PostgreSQL/SQLite.",
    whatYouDo:
      "Com as classes Python prontas, você gera o arquivo de migração (historico versionado do banco) e aplica no SQLite/PostgreSQL. O banco cria as tabelas físicas, chaves primárias (PK), chaves estrangeiras (FK) e restrições.",
    whyThisOrder:
      "O código Python sozinho não guarda dados no disco. A migração garante que o banco de dados tenha exatamente as colunas e travas que você planejou no Degrau 1.",
    codeFile: "Terminal Integrado (Tela Preta)",
    codeSnippet: `$ python manage.py makemigrations
Migrations for 'orders':
  orders/migrations/0001_initial.py
    - Create model Order
    - Create model SubOrder
    - Create model OrderItem

$ python manage.py migrate
Applying orders.0001_initial... OK`,
    lessonSlug: "modulo-0-f03-primeiro-projeto-django",
    lessonLabel: "Praticar Migrações na Lição F03 →",
  },
  {
    order: 3,
    id: "step-3-serializer",
    badge: "3º DEGRAU · PORTEIRO",
    title: "Serializers & Contratos de Entrada (Validação Fail-Fast)",
    analogy: "O conferente na porta da cozinha: barra comandas ilegíveis antes de incomodar o cozinheiro.",
    whatYouDo:
      "Você define quais campos o cliente PODE enviar no JSON (ex.: `product_id` e `quantity >= 1`) e quais campos o servidor NUNCA aceita vindos do navegador (ex.: `price_cents` — o preço sempre vem do banco!).",
    whyThisOrder:
      "Nunca deixe dados sujos chegarem na regra de negócio. O Serializer devolve HTTP 400 imediatamente se alguém tentar pedir quantidade 0 ou negativa.",
    codeFile: "orders/serializers.py",
    codeSnippet: `class CreateOrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=50)
    # Repare: NÃO aceitamos 'price' vindo do cliente!
    # O servidor busca o preço real direto na tabela Product.`,
    lessonSlug: "modulo-0-f04-primeira-api-com-drf",
    lessonLabel: "Estudar Serializers na Lição F04 →",
  },
  {
    order: 4,
    id: "step-4-service",
    badge: "4º DEGRAU · MOTOR BLINDADO",
    title: "Service Atômico (Trava de Estoque, Snapshot & Split em Centavos)",
    analogy: "O cofre e o chef executivo: tudo acontece por inteiro dentro da transação ou nada é salvo.",
    whatYouDo:
      "Dentro de `with transaction.atomic():`, você ordena os itens por SKU, desconta o estoque apenas se `stock_qty >= quantity`, congela o preço no `OrderItem`, divide os pacotes por loja (`SubOrder`) e calcula a comissão da plataforma jogando o centavo de sobra na última fatia.",
    whyThisOrder:
      "É aqui que você impede que duas pessoas comprem a última peça no mesmo milissegundo (Race Condition) e garante que a soma dos repasses bata 100% com o valor cobrado.",
    codeFile: "03-paredes-api/api_esqueleto.py (ou orders/services.py)",
    codeSnippet: `with transaction.atomic():
    updated = Product.objects.filter(
        id=item.product_id,
        stock_qty__gte=item.quantity,
    ).update(stock_qty=F("stock_qty") - item.quantity)
    if updated == 0:
        raise ConflictError("Estoque esgotado (HTTP 409)!")`,
    lessonSlug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
    lessonLabel: "Estudar Trava Concorrente na Lição A04 →",
  },
  {
    order: 5,
    id: "step-5-rotas",
    badge: "5º DEGRAU · PORTAS HTTP",
    title: "Views, Rotas REST & Webhook PIX Idempotente",
    analogy: "As portas de atendimento ao público e a recepção blindada do banco.",
    whatYouDo:
      "Você conecta a URL (`POST /api/orders/`, `POST /api/webhooks/pix/`) ao seu Serializer (Degrau 3) e ao seu Service (Degrau 4), adicionando validação criptográfica HMAC e chave de idempotência para nunca aprovar ou repassar duas vezes.",
    whyThisOrder:
      "A rota HTTP é apenas uma casca fina que chama o Porteiro e o Motor. Como os Degraus 1 a 4 já estão prontos, criar a rota leva poucos minutos!",
    codeFile: "orders/views.py + orders/urls.py",
    codeSnippet: `@api_view(["POST"])
def create_order_view(request):
    serializer = CreateOrderInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True) # 400 se inválido
    order = create_marketplace_order(user=request.user, items=serializer.validated_data["items"])
    return Response({"order_id": order.id, "total_cents": order.total_cents}, status=201)`,
    lessonSlug: "modulo-3-confirmar-pagamento-webhook",
    lessonLabel: "Estudar Webhook PIX na Lição A06 →",
  },
  {
    order: 6,
    id: "step-6-vitrine-testes",
    badge: "6º DEGRAU · ACABAMENTO & HABITE-SE",
    title: "Vitrine Front-end, Testes Automatizados & Deploy Cloud R$ 0",
    analogy: "Pintar a fachada, colocar os móveis, passar na vistoria elétrica e abrir as portas na rua.",
    whatYouDo:
      "Agora você liga a Vitrine Visual (`01-acabamento-vitrine/index.html` ou Next.js) nas rotas da API, roda a suíte de testes (`testar_minha_casa.py` / `pytest`) para provar que nada quebra e publica de graça no GitHub + Neon + Render + Vercel.",
    whyThisOrder:
      "A tela vem no topo porque ela depende de dados reais e regras sólidas. E os testes garantem que nenhuma atualização futura destrua o que já funciona!",
    codeFile: "01-acabamento-vitrine/index.html + testar_minha_casa.py",
    codeSnippet: `$ python testar_minha_casa.py
[PASSOU] Comodo 1 (Moveis e Vitrine HTML)
[PASSOU] Comodo 2 (Alicerce e Centavos Inteiros)
[PASSOU] Comodo 3 (Paredes da API e Trava de Estoque)
[PASSOU] Comodo 4 (Telhado, .gitignore e Deploy)
🎉 PARABENS! SUA CASA PRE-MOLDADA PASSOU NOS 4 TESTES!`,
    lessonSlug: "modulo-5-infraestrutura-deploy-backup",
    lessonLabel: "Estudar Testes (F05) e Deploy R$ 0 (A10) →",
  },
];

const QUIZ_ORDER_CARDS = [
  {
    stepNumber: 1,
    label: "Modelar a tabela Coupon (code, discount_cents, max_uses) no models.py",
    wrongHint:
      "Pense no alicerce primeiro! Onde o cupom vai ficar guardado? Toda feature começa na Modelagem de Dados (models.py) em centavos inteiros.",
  },
  {
    stepNumber: 2,
    label: "Rodar makemigrations e migrate para criar a tabela física no banco SQL",
    wrongHint:
      "Você já desenhou o Model em Python! Qual comando transforma essa classe em uma tabela real no banco de dados?",
  },
  {
    stepNumber: 3,
    label: "Criar o Serializer (Porteiro) que valida se o código do cupom foi enviado em texto limpo",
    wrongHint:
      "Com a tabela criada no banco, precisamos do Porteiro (Serializer) para validar os dados que chegam antes da regra financeira.",
  },
  {
    stepNumber: 4,
    label: "Programar o Service atômico que trava o cupom e rateia o desconto nas SubOrders no servidor",
    wrongHint:
      "Agora que o Porteiro conferiu a entrada, quem faz a conta segura em centavos dentro de transaction.atomic()?",
  },
  {
    stepNumber: 5,
    label: "Expor a rota POST /api/cart/apply-coupon/ e escrever os testes automatizados (pytest)",
    wrongHint:
      "O motor de cálculo já está pronto! Agora precisamos abrir a porta HTTP (Rota/View) e testar antes de ligar no HTML.",
  },
  {
    stepNumber: 6,
    label: "Conectar o campo de Cupom na Vitrine HTML/Front-end exibindo o desconto retornado pela API",
    wrongHint:
      "Último degrau! Com banco, porteiro, motor e rota testados, conectamos o acabamento visual na Vitrine!",
  },
];

export function SoftwareSkeletonMasterclass({
  courseSlug,
  compact = false,
}: {
  courseSlug: string;
  compact?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"skeleton" | "datamodel" | "studio">(
    "skeleton",
  );
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  // Interactive Ordering Mini-Game state
  const [unlockedStepCount, setUnlockedStepCount] = useState(0);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Interactive Data Modeling Simulator state
  const [modelMode, setModelMode] = useState<"pro" | "amateur">("pro");
  const [simulatedPriceChange, setSimulatedPriceChange] = useState(false);
  const [simulatedDeleteProduct, setSimulatedDeleteProduct] = useState(false);

  const currentStep = IMPLEMENTATION_STEPS[selectedStepIdx] ?? IMPLEMENTATION_STEPS[0];

  // Deterministic shuffled order for the mini-game buttons
  const shuffledGameOptions = [
    QUIZ_ORDER_CARDS[5],
    QUIZ_ORDER_CARDS[2],
    QUIZ_ORDER_CARDS[0],
    QUIZ_ORDER_CARDS[4],
    QUIZ_ORDER_CARDS[1],
    QUIZ_ORDER_CARDS[3],
  ];

  function handlePickOrderStep(cardStepNumber: number) {
    const expectedNext = unlockedStepCount + 1;
    if (cardStepNumber === expectedNext) {
      setUnlockedStepCount(expectedNext);
      if (expectedNext === QUIZ_ORDER_CARDS.length) {
        setOrderFeedback(
          "🎉 Perfeito (+100 XP de Arquitetura)! Você construiu a feature respeitando a ordem exata da Engenharia de Software: Modelagem → Migração → Porteiro → Motor Atômico → Rota/Testes → Tela!",
        );
      } else {
        setOrderFeedback(
          `✓ Degrau ${cardStepNumber} correto! Qual é o Degrau ${expectedNext + 1} da construção?`,
        );
      }
    } else {
      const expectedCard = QUIZ_ORDER_CARDS[unlockedStepCount];
      setOrderFeedback(
        `⚠️ Calma! Se você fizer isso antes do Degrau ${expectedNext}, a obra fica sem base. Dica: ${expectedCard.wrongHint}`,
      );
    }
  }

  return (
    <section
      className="curso-panel"
      style={{
        marginTop: compact ? 24 : 32,
        marginBottom: compact ? 24 : 32,
        border: "1px solid rgba(56, 189, 248, 0.35)",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(7, 13, 25, 0.98) 100%)",
      }}
      aria-label="Masterclass Interativa: Esqueleto do Sistema, Modelagem de Dados e Ordem de Implementação"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <span className="curso-Complete-badge">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Fundamento Mestre de
            Engenharia · Do Alicerce ao Deploy
          </span>
          <h2 className="curso-section-title" style={{ marginTop: 8 }}>
            Como Funciona o Esqueleto de Todo Sistema, a Modelagem de Dados e a Ordem de Implementação
          </h2>
          <p className="curso-muted" style={{ maxWidth: "78ch", marginTop: 6 }}>
            Nenhum engenheiro começa um prédio escolhendo a cor da cortina. Antes de digitar
            qualquer código ou baixar arquivos, domine a{" "}
            <strong>ordem universal de construção de software</strong>, entenda{" "}
            <strong>o que é modelagem de dados</strong> e explore os vídeos, podcasts e
            diagramas do nosso estúdio.
          </p>
        </div>
      </div>

      {/* 3 Interactive Masterclass Tabs */}
      <div
        role="tablist"
        aria-label="Pilares da Engenharia do Curso"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 10,
          marginBottom: 22,
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "skeleton"}
          onClick={() => setActiveTab("skeleton")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderRadius: 12,
            textAlign: "left",
            cursor: "pointer",
            border:
              activeTab === "skeleton"
                ? "2px solid #38bdf8"
                : "1px solid rgba(148, 163, 184, 0.22)",
            background:
              activeTab === "skeleton"
                ? "rgba(56, 189, 248, 0.16)"
                : "rgba(15, 23, 42, 0.65)",
            color: "#f8fafc",
          }}
        >
          <Layers className="w-5 h-5 ide-text-cyan shrink-0" aria-hidden="true" />
          <div>
            <strong style={{ display: "block", fontSize: "0.92rem" }}>
              1. O Esqueleto &amp; Ordem (6 Degraus)
            </strong>
            <span style={{ fontSize: "0.76rem", color: "#cbd5e1" }}>
              Por onde começar e como avançar cada feature
            </span>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "datamodel"}
          onClick={() => setActiveTab("datamodel")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderRadius: 12,
            textAlign: "left",
            cursor: "pointer",
            border:
              activeTab === "datamodel"
                ? "2px solid #34d399"
                : "1px solid rgba(148, 163, 184, 0.22)",
            background:
              activeTab === "datamodel"
                ? "rgba(16, 185, 129, 0.16)"
                : "rgba(15, 23, 42, 0.65)",
            color: "#f8fafc",
          }}
        >
          <Database className="w-5 h-5 ide-text-emerald shrink-0" aria-hidden="true" />
          <div>
            <strong style={{ display: "block", fontSize: "0.92rem" }}>
              2. Modelagem de Dados Interativa
            </strong>
            <span style={{ fontSize: "0.76rem", color: "#cbd5e1" }}>
              Tabelas, PK/FK, Order × SubOrder e Snapshot
            </span>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "studio"}
          onClick={() => setActiveTab("studio")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderRadius: 12,
            textAlign: "left",
            cursor: "pointer",
            border:
              activeTab === "studio"
                ? "2px solid #fbbf24"
                : "1px solid rgba(148, 163, 184, 0.22)",
            background:
              activeTab === "studio"
                ? "rgba(245, 158, 11, 0.16)"
                : "rgba(15, 23, 42, 0.65)",
            color: "#f8fafc",
          }}
        >
          <PlayCircle className="w-5 h-5 ide-text-amber shrink-0" aria-hidden="true" />
          <div>
            <strong style={{ display: "block", fontSize: "0.92rem" }}>
              3. Estúdio Multimídia &amp; NotebookLM
            </strong>
            <span style={{ fontSize: "0.76rem", color: "#cbd5e1" }}>
              4 Vídeos (.mp4), 5 Podcasts (.m4a), 6 PDFs e Mapa
            </span>
          </div>
        </button>
      </div>

      {/* TAB 1: O ESQUELETO DE TODO SISTEMA & ORDEM DE IMPLEMENTAÇÃO */}
      {activeTab === "skeleton" && (
        <div>
          {/* Architectural SVG Blueprint */}
          <figure
            style={{
              margin: "0 0 22px 0",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              background: "#070d19",
            }}
          >
            <img
              src="/cursos/guias/esqueleto-ordem-implementacao.svg"
              alt="Diagrama arquitetural mostrando os 6 degraus da ordem oficial de implementação de um sistema: 1. Modelagem de Dados, 2. Migrações SQL, 3. Serializer, 4. Service Atômico, 5. Rotas HTTP e 6. Vitrine e Testes."
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
            />
            <figcaption
              style={{
                padding: "10px 16px",
                fontSize: "0.82rem",
                color: "#cbd5e1",
                borderTop: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              📐 <strong>Regra de Ouro da Engenharia:</strong> Construímos de baixo para cima
              (do Degrau 1 ao Degrau 6). Clique em cada degrau abaixo para inspecionar o
              código real e o motivo de ele vir nessa posição!
            </figcaption>
          </figure>

          {/* Interactive 6-Step Inspector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {IMPLEMENTATION_STEPS.map((st, idx) => {
              const isSelected = idx === selectedStepIdx;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStepIdx(idx)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    textAlign: "left",
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid #38bdf8"
                      : "1px solid rgba(148, 163, 184, 0.2)",
                    background: isSelected
                      ? "rgba(56, 189, 248, 0.18)"
                      : "rgba(15, 23, 42, 0.55)",
                    color: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: isSelected ? "#38bdf8" : "#94a3b8",
                    }}
                  >
                    DEGRAU {st.order} DE 6
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, marginTop: 2 }}>
                    {st.title.split("(")[0].trim()}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Step Deep-Dive Card */}
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              border: "1px solid rgba(56, 189, 248, 0.35)",
              background: "rgba(2, 6, 23, 0.78)",
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span className="ide-file-badge">{currentStep.badge}</span>
              <span className="curso-pill" style={{ fontSize: "0.76rem" }}>
                📂 {currentStep.codeFile}
              </span>
            </div>

            <h3 style={{ fontSize: "1.2rem", color: "#f8fafc", marginBottom: 6 }}>
              {currentStep.title}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#7dd3fc", marginBottom: 12 }}>
              <strong>Analogia da Obra:</strong> {currentStep.analogy}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(15, 23, 42, 0.75)",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                }}
              >
                <strong style={{ color: "#38bdf8", fontSize: "0.8rem" }}>
                  O QUE VOCÊ FAZ NESTE DEGRAU:
                </strong>
                <p style={{ fontSize: "0.86rem", color: "#e2e8f0", marginTop: 4 }}>
                  {currentStep.whatYouDo}
                </p>
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.28)",
                }}
              >
                <strong style={{ color: "#34d399", fontSize: "0.8rem" }}>
                  POR QUE VEM NESTA ORDEM EXATA:
                </strong>
                <p style={{ fontSize: "0.86rem", color: "#e2e8f0", marginTop: 4 }}>
                  {currentStep.whyThisOrder}
                </p>
              </div>
            </div>

            <pre
              style={{
                padding: 14,
                borderRadius: 10,
                background: "#090d16",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                color: "#e2e8f0",
                fontSize: "0.8rem",
                overflowX: "auto",
                marginBottom: 14,
              }}
            >
              <code>{currentStep.codeSnippet}</code>
            </pre>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link
                href={`/pt/cursos/${courseSlug}/${currentStep.lessonSlug}`}
                className="btn btn-primary curso-btn-sm"
              >
                <span>{currentStep.lessonLabel}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {selectedStepIdx + 1 < IMPLEMENTATION_STEPS.length && (
                <button
                  type="button"
                  className="btn btn-ghost curso-btn-sm"
                  onClick={() => setSelectedStepIdx(selectedStepIdx + 1)}
                >
                  <span>Ver Próximo Degrau ({selectedStepIdx + 2}/6) →</span>
                </button>
              )}
            </div>
          </div>

          {/* Gamified Ordering Mini-Challenge */}
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              border: "1px solid rgba(245, 158, 11, 0.4)",
              background: "rgba(245, 158, 11, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span className="ide-file-badge">
                🎮 Mini-Game do Arquiteto · Construa na Ordem Certa ({unlockedStepCount}/6)
              </span>
              {unlockedStepCount > 0 && (
                <button
                  type="button"
                  className="ide-btn ide-btn-xs ide-btn-ghost"
                  onClick={() => {
                    setUnlockedStepCount(0);
                    setOrderFeedback(null);
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reiniciar desafio</span>
                </button>
              )}
            </div>

            <h4 style={{ fontSize: "1.02rem", color: "#f8fafc", marginBottom: 4 }}>
              Missão: Você precisa criar a feature &ldquo;Cupom de Desconto no Checkout&rdquo;.
              Clique nos cartões abaixo na ordem exata de implementação (do 1º ao 6º)!
            </h4>
            <p style={{ fontSize: "0.84rem", color: "#cbd5e1", marginBottom: 14 }}>
              Próximo passo esperado: <strong>Degrau {Math.min(6, unlockedStepCount + 1)} de 6</strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 10,
              }}
            >
              {shuffledGameOptions.map((card) => {
                const isAlreadyUnlocked = card.stepNumber <= unlockedStepCount;
                return (
                  <button
                    key={card.stepNumber}
                    type="button"
                    disabled={isAlreadyUnlocked}
                    onClick={() => handlePickOrderStep(card.stepNumber)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: 12,
                      borderRadius: 10,
                      textAlign: "left",
                      cursor: isAlreadyUnlocked ? "default" : "pointer",
                      border: isAlreadyUnlocked
                        ? "1.5px solid #34d399"
                        : "1px solid rgba(148, 163, 184, 0.28)",
                      background: isAlreadyUnlocked
                        ? "rgba(16, 185, 129, 0.16)"
                        : "rgba(15, 23, 42, 0.8)",
                      color: "#f8fafc",
                      fontSize: "0.83rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {isAlreadyUnlocked ? (
                      <CheckCircle2
                        className="w-4 h-4 ide-text-emerald shrink-0"
                        style={{ marginTop: 2 }}
                        aria-hidden="true"
                      />
                    ) : (
                      <Code2
                        className="w-4 h-4 ide-text-amber shrink-0"
                        style={{ marginTop: 2 }}
                        aria-hidden="true"
                      />
                    )}
                    <span>
                      {isAlreadyUnlocked && (
                        <strong style={{ color: "#34d399", marginRight: 6 }}>
                          [{card.stepNumber}º Passo OK]
                        </strong>
                      )}
                      {card.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {orderFeedback && (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "#e2e8f0",
                  fontSize: "0.86rem",
                }}
              >
                {orderFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MODELAGEM DE DADOS INTERATIVA */}
      {activeTab === "datamodel" && (
        <div>
          <figure
            style={{
              margin: "0 0 20px 0",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(52, 211, 153, 0.35)",
              background: "#060c17",
            }}
          >
            <img
              src="/cursos/guias/modelagem-dados-marketplace.svg"
              alt="Diagrama Entidade-Relacionamento (ER) das 5 tabelas centrais do marketplace: stores_store, catalog_product, orders_order, orders_suborder e orders_orderitem com snapshot imutável e on_delete=PROTECT."
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
            />
            <figcaption
              style={{
                padding: "10px 16px",
                fontSize: "0.82rem",
                color: "#cbd5e1",
                borderTop: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              🗄️ <strong>O que é Modelagem de Dados?</strong> É desenhar quais tabelas
              existem, como elas se conectam por Chaves Estrangeiras (`FK`) e quais
              regras impedem que o histórico financeiro seja corrompido.
            </figcaption>
          </figure>

          {/* Interactive Comparison Simulator: Amateur vs Senior Data Model */}
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              border: "1px solid rgba(52, 211, 153, 0.35)",
              background: "rgba(2, 6, 23, 0.78)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <span className="ide-file-badge">
                  🧪 Laboratório Visual de Modelagem · Teste o que Acontece no Banco!
                </span>
                <h3 style={{ fontSize: "1.12rem", color: "#f8fafc", marginTop: 6 }}>
                  Simule Eventos Reais do Marketplace no Banco de Dados
                </h3>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setModelMode("pro")}
                  className={`ide-btn ide-btn-xs ${
                    modelMode === "pro" ? "ide-btn-primary" : "ide-btn-ghost"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Modelagem Profissional (MySuperStore)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModelMode("amateur")}
                  className={`ide-btn ide-btn-xs ${
                    modelMode === "amateur" ? "ide-btn-primary" : "ide-btn-ghost"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Modelagem Ingênua (Sem Snapshot/PROTECT)</span>
                </button>
              </div>
            </div>

            {/* Simulation Trigger Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <button
                type="button"
                onClick={() => setSimulatedPriceChange((v) => !v)}
                className="btn btn-ghost curso-btn-sm"
              >
                <span>
                  {simulatedPriceChange
                    ? "↺ Restaurar Preço Original (R$ 129,90)"
                    : "⚡ Disparar Evento 1: Lojista Baixou Preço na Black Friday (R$ 129,90 → R$ 79,90)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatedDeleteProduct((v) => !v)}
                className="btn btn-ghost curso-btn-sm"
              >
                <span>
                  {simulatedDeleteProduct
                    ? "↺ Restaurar Produto no Catálogo"
                    : "💣 Disparar Evento 2: Lojista Tentou Deletar Produto Já Vendido"}
                </span>
              </button>
            </div>

            {/* Live State Output */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                <strong style={{ color: "#38bdf8", fontSize: "0.82rem" }}>
                  TABELA 1: catalog_product (Catálogo Hoje)
                </strong>
                <p style={{ fontSize: "0.86rem", color: "#e2e8f0", marginTop: 8 }}>
                  Produto: <code>Camiseta Oversized Preta</code>
                  <br />
                  Preço Atual na Vitrine:{" "}
                  <strong style={{ color: "#34d399" }}>
                    {simulatedPriceChange
                      ? "7990 centavos (R$ 79,90)"
                      : "12990 centavos (R$ 129,90)"}
                  </strong>
                  <br />
                  Status do Registro:{" "}
                  <strong>
                    {simulatedDeleteProduct && modelMode === "amateur"
                      ? "❌ APAGADO DO BANCO (CASCADE)!"
                      : simulatedDeleteProduct && modelMode === "pro"
                        ? "🛡️ PROTEGIDO (PROTECT bloqueou DELETE!)"
                        : "✓ Ativo no Catálogo"}
                  </strong>
                </p>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background:
                    modelMode === "pro"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(239, 68, 68, 0.14)",
                  border:
                    modelMode === "pro"
                      ? "1px solid rgba(52, 211, 153, 0.45)"
                      : "1px solid rgba(248, 113, 113, 0.55)",
                }}
              >
                <strong
                  style={{
                    color: modelMode === "pro" ? "#34d399" : "#f87171",
                    fontSize: "0.82rem",
                  }}
                >
                  TABELA 2: orders_orderitem (Recibo do Pedido #1042 feito ontem)
                </strong>
                {modelMode === "pro" ? (
                  <p style={{ fontSize: "0.86rem", color: "#e2e8f0", marginTop: 8 }}>
                    <code>unit_price_cents_snapshot</code>:{" "}
                    <strong style={{ color: "#fde68a" }}>
                      12990 centavos (R$ 129,90 · Intacto!)
                    </strong>
                    <br />
                    Integridade Fiscal:{" "}
                    <strong style={{ color: "#34d399" }}>
                      ✓ 100% Blindada! Mesmo com promoção hoje ou tentativa de exclusão, o
                      recibo de ontem continua valendo exatamente R$ 129,90.
                    </strong>
                  </p>
                ) : (
                  <p style={{ fontSize: "0.86rem", color: "#fecaca", marginTop: 8 }}>
                    {simulatedDeleteProduct ? (
                      <strong>
                        💥 DESASTRE CONTÁBIL: Como usou on_delete=CASCADE, deletar o produto
                        apagou os itens dos pedidos antigos! Seu financeiro perdeu o
                        histórico!
                      </strong>
                    ) : simulatedPriceChange ? (
                      <strong>
                        💥 BUG GRAVE: Como o pedido lia product.price direto sem Snapshot, o
                        recibo de ontem mudou sozinho de R$ 129,90 para R$ 79,90! O caixa
                        não bate mais!
                      </strong>
                    ) : (
                      <span>
                        Clique nos botões acima de Evento 1 ou Evento 2 para ver como uma
                        modelagem amadora corrompe o banco de dados!
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link
                href={`/pt/cursos/${courseSlug}/modulo-2-modelo-de-dados`}
                className="btn btn-primary curso-btn-sm"
              >
                <span>Ir para Aula A02: Modelagem de Dados Completa →</span>
              </Link>
              <Link
                href={`/pt/cursos/${courseSlug}/pratica?estacao=sandbox&aula=modulo-2-modelo-de-dados`}
                className="btn btn-ghost curso-btn-sm"
              >
                <span>Praticar Modelagem SQL/Python na Oficina →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ESTÚDIO MULTIMÍDIA NOTEBOOKLM + CASA PRÉ-MOLDADA */}
      {activeTab === "studio" && (
        <div>
          <figure
            style={{
              margin: "0 0 20px 0",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              background: "#070d19",
            }}
          >
            <img
              src="/cursos/guias/anatomia-casa-pre-moldada.svg"
              alt="Diagrama dos 4 cômodos da Casa Pré-Moldada (.zip) mostrando a ordem exata: 1. Alicerce (models_esqueleto.py), 2. Paredes (api_esqueleto.py), 3. Móveis (index.html) e 4. Habite-se (testar_minha_casa.py)."
              style={{ width: "100%", height: "auto", display: "block" }}
              loading="lazy"
            />
          </figure>

          {/* 4 Studio Videos (.mp4) */}
          <h3 style={{ fontSize: "1.08rem", color: "#f8fafc", marginBottom: 12 }}>
            🎬 4 Vídeos de Estúdio: O Sistema Explicado Visualmente (.mp4)
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
              marginBottom: 22,
            }}
          >
            {[
              {
                title: "1. Do Clique ao Banco de Dados",
                desc: "Veja o caminho que um pedido percorre entre Vitrine, API e Tabelas SQL.",
                src: "/cursos/midia/caminho-clique-banco-de-dados.mp4",
                lessonSlug: "modulo-0-f01-o-mapa",
              },
              {
                title: "2. Preparando a Bancada & Terminal",
                desc: "Como funciona sua bancada com VS Code, Python .venv e Git seguro.",
                src: "/cursos/midia/preparando-a-bancada.mp4",
                lessonSlug: "modulo-0-f02-preparando-a-bancada",
              },
              {
                title: "3. Por Que Travas Evitam Venda Dupla",
                desc: "Entenda transações atômicas e concorrência na última peça do estoque.",
                src: "/cursos/midia/por-que-travas-evitam-erros.mp4",
                lessonSlug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
              },
              {
                title: "4. O Caminho Completo do PIX & Split",
                desc: "QR Code dinâmico, Webhook HMAC, idempotência e divisão de comissão.",
                src: "/cursos/midia/caminho-do-pix.mp4",
                lessonSlug: "modulo-3-confirmar-pagamento-webhook",
              },
            ].map((vid) => (
              <div
                key={vid.src}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                }}
              >
                <strong style={{ display: "block", fontSize: "0.9rem", color: "#f8fafc" }}>
                  {vid.title}
                </strong>
                <p style={{ fontSize: "0.78rem", color: "#cbd5e1", margin: "4px 0 10px" }}>
                  {vid.desc}
                </p>
                <video
                  controls
                  preload="metadata"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    background: "#020617",
                  }}
                >
                  <source src={vid.src} type="video/mp4" />
                </video>
                <div style={{ marginTop: 8 }}>
                  <Link
                    href={`/pt/cursos/${courseSlug}/${vid.lessonSlug}`}
                    style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: 600 }}
                  >
                    Ir para a aula deste vídeo →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 5 Studio Podcasts (.m4a) + 6 Slide Decks (.pdf) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.98rem",
                  color: "#f8fafc",
                  marginBottom: 12,
                }}
              >
                <Headphones className="w-4 h-4 ide-text-cyan" aria-hidden="true" />
                <span>5 Podcasts de Engenharia (NotebookLM .m4a)</span>
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    label: "Ep. 1 · A Engenharia por trás do MySuperStore",
                    src: "/cursos/midia/a-engenharia-por-tras-do-mysuperstore.m4a",
                  },
                  {
                    label: "Ep. 2 · Bastidores do Código & Modelagem do Marketplace",
                    src: "/cursos/midia/bastidores-codigo-marketplace.m4a",
                  },
                  {
                    label: "Ep. 3 · Como Bugs em Produção Ensinam Arquitetura",
                    src: "/cursos/midia/como-bugs-em-producao-ensinam-arquitetura.m4a",
                  },
                  {
                    label: "Ep. 4 · Segurança vs Pragmatismo em Pagamentos",
                    src: "/cursos/midia/seguranca-versus-pragmatismo.m4a",
                  },
                  {
                    label: "Ep. 5 · Como Proteger Dinheiro em Servidor de 1 GB RAM",
                    src: "/cursos/midia/como-proteger-dinheiro-1gb-ram.m4a",
                  },
                ].map((pod) => (
                  <div
                    key={pod.src}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: "rgba(2, 6, 23, 0.65)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#e2e8f0",
                        marginBottom: 6,
                      }}
                    >
                      {pod.label}
                    </div>
                    <audio controls preload="none" style={{ width: "100%", height: 34 }}>
                      <source src={pod.src} type="audio/mp4" />
                    </audio>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(52, 211, 153, 0.25)",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.98rem",
                  color: "#f8fafc",
                  marginBottom: 12,
                }}
              >
                <FileText className="w-4 h-4 ide-text-emerald" aria-hidden="true" />
                <span>6 Decks de Slides (.pdf) &amp; Mapa Mental Completo</span>
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  {
                    label: "Deck 1 · Arquitetura de Sistemas Reais (PDF)",
                    href: "/cursos/midia/arquitetura-de-sistemas-reais.pdf",
                  },
                  {
                    label: "Deck 2 · Raio-X do Django e Modelagem SQL (PDF)",
                    href: "/cursos/midia/raio-x-do-django.pdf",
                  },
                  {
                    label: "Deck 3 · APIs com Django REST Framework (PDF)",
                    href: "/cursos/midia/apis-com-django-rest-framework.pdf",
                  },
                  {
                    label: "Deck 4 · Caderno do Sênior: Testes & Git (PDF)",
                    href: "/cursos/midia/caderno-do-senior.pdf",
                  },
                  {
                    label: "Deck 5 · Lendo Projetos Reais de Engenharia (PDF)",
                    href: "/cursos/midia/lendo-projetos-reais.pdf",
                  },
                  {
                    label: "Deck 6 · Anatomia e Infraestrutura MySuperStore (PDF)",
                    href: "/cursos/midia/anatomia-infraestrutura-mysuperstore.pdf",
                  },
                  {
                    label: "Mapa Mental Completo do MySuperStore (Alta Resolução PNG)",
                    href: "/cursos/midia/mysuperstore-mapa-mental.png",
                  },
                ].map((doc) => (
                  <a
                    key={doc.href}
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(2, 6, 23, 0.65)",
                      border: "1px solid rgba(148, 163, 184, 0.16)",
                      color: "#e2e8f0",
                      fontSize: "0.82rem",
                      textDecoration: "none",
                    }}
                  >
                    <span>{doc.label}</span>
                    <Download className="w-3.5 h-3.5 ide-text-emerald shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
