/* ------------------------------------------------------------------ */
/*  Conteúdo completo das aulas A02 a A11 + Projeto Final               */
/*  Extraído diretamente de estudo-arquitetura/modulo-marketplace      */
/* ------------------------------------------------------------------ */

import type { NotebookLMMediaConfig } from "@/app/components/curso/NotebookLMMediaBlock";
import type { VisualDiagramId } from "@/app/components/curso/LessonVisualDiagram";
import type {
  ExplainedQuizItem,
  FillBlankExercise,
  PredictQuestion,
} from "@/app/components/curso/InteractivePracticeLab";

export type MarketplaceLessonData = {
  slug: string;
  code: string;
  title: string;
  oneSentence: string;
  guideQuestion: string;
  metaNote: string;
  diagramId?: VisualDiagramId;
  notebookMedia?: NotebookLMMediaConfig;
  predict: PredictQuestion[];
  coreSections: {
    heading: string;
    paragraphs: string[];
    codeBlocks?: { title: string; code: string }[];
    table?: { headers: string[]; rows: string[][] };
  }[];
  breakExperiment?: {
    title: string;
    setup: string;
    whatHappens: string;
    lessonLearned: string;
  };
  pitfalls: { wrong: string; right: string; why: string }[];
  fillBlanks: FillBlankExercise[];
  quizzes: ExplainedQuizItem[];
  flashcards: { front: string; back: string }[];
  threeThings: string[];
};

export const MARKETPLACE_LESSONS: Record<string, MarketplaceLessonData> = {
  "modulo-2-modelo-de-dados": {
    "slug": "modulo-2-modelo-de-dados",
    "code": "A02",
    "title": "Modelo de dados: pedido, sub-pedido e item, e por que o banco decide se o dinheiro fecha",
    "oneSentence": "o desenho das tabelas já é uma regra de negócio: ele decide o que pode ou não pode acontecer com o dinheiro, antes de qualquer if no código.",
    "guideQuestion": "por que um pedido com duas lojas vira três tabelas, e o que o desenho do banco já impede você de errar?",
    "metaNote": "100 min · Estudo de caso MySuperStore",
    "diagramId": "a02-modelo-dados",
    "predict": [
      {
        "question": "Quantos \"pedidos\" a loja A enxerga? Quantos o cliente enxerga?",
        "answer": "A loja A enxerga um sub-pedido (só o que é dela). O cliente enxerga um pedido que contém dois sub-pedidos."
      },
      {
        "question": "Depois da compra, a loja A aumenta o preço da bolsa. O total do pedido antigo muda?",
        "answer": "Não pode mudar. O pedido guarda uma cópia (snapshot) do nome e do preço no momento da compra."
      },
      {
        "question": "A loja B apaga a vela do catálogo. O que deve acontecer com o histórico do pedido?",
        "answer": "O histórico precisa continuar legível. Por isso o item guarda nome, SKU e preço próprios, e a ligação com o"
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: a sacola e os cupons",
        "paragraphs": [
          "O cliente leva uma sacola (o pedido). Mas cada loja emitiu o seu cupom (o sub-pedido), porque cada uma envia, recebe e pode ter problema separadamente. O item é a linha do cupom.",
          "💡 Por quê o pagamento é do pedido e o repasse é do sub-pedido? O cliente paga uma vez (um Payment por Order). Mas cada loja recebe a sua parte (um Payout por SubOrder). Os dois lados do dinheiro têm granularidades diferentes, e o modelo respeita isso."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "erDiagram\n  USER ||--o{ ORDER : compra\n  ORDER ||--o{ SUBORDER : \"divide por loja\"\n  SELLER ||--o{ SUBORDER : recebe\n  SUBORDER ||--o{ ORDERITEM : contém\n  ORDER ||--|| PAYMENT : \"é pago por\"\n  SUBORDER ||--|| PAYOUT : \"gera repasse\"\n  SUBORDER ||--|| COMMISSIONENTRY : \"gera comissão\"\n  ORDERITEM ||--o| RETURNREQUEST : \"pode ter devolução\""
          }
        ]
      },
      {
        "heading": "2. O código, linha por linha, com o porquê",
        "paragraphs": [
          "2.1 O pedido (orders/models.py:38-61)",
          "💡 Por quê UUID e também order_number? O UUID é a chave interna; o order_number é o que o humano usa. Atenção: a API busca pedido por order_number (views.py:11). Isso é seguro não porque o número é difícil de adivinhar (é data + 4 dígitos!), mas porque a consulta filtra pelo dono (Order.objects.filter(user=...), views.py:17). A defesa é o filtro, não o segredo do identificador.",
          "2.2 O sub-pedido (orders/models.py:72-91)",
          "2.3 O item (orders/models.py:101-111)",
          "💡 Por quê o item copia nome, SKU, atributos e preço, se já tem a variant? Porque a variant é uma referência viva: ela muda de preço, muda de nome e pode ser apagada (SET_NULL). O item precisa ser o retrato do momento da compra. Sem isso, o pedido de hoje muda quando o catálogo muda.",
          "2.4 Pagamento, repasse e comissão (payments/models.py)"
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "class Order(models.Model):\n    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)\n    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name=\"orders\")\n    # Snapshot do endereço no momento da compra\n    address_recipient = models.CharField(max_length=150)\n    address_cep = models.CharField(max_length=8)\n    ...\n    order_number = models.CharField(max_length=30, unique=True)\n    subtotal = models.DecimalField(max_digits=10, decimal_places=2)\n    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0)\n    total = models.DecimalField(max_digits=10, decimal_places=2)\n    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)"
          },
          {
            "title": "Código (python)",
            "code": "class SubOrder(models.Model):\n    \"\"\"Sub-pedido por vendedor — permite fulfillment independente por loja.\"\"\"\n    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name=\"sub_orders\")\n    seller = models.ForeignKey(\"sellers.Seller\", on_delete=models.SET_NULL, null=True, related_name=\"sub_orders\")\n    subtotal = models.DecimalField(max_digits=10, decimal_places=2)\n    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0)\n    # Comissão da plataforma = subtotal × seller.commission_rate (não incide no frete)\n    commission = models.DecimalField(max_digits=10, decimal_places=2)\n    # Valor que o vendedor recebe = (subtotal - commission) + shipping\n    seller_amount = models.DecimalField(max_digits=10, decimal_places=2)\n    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)\n    tracking_code = ..."
          },
          {
            "title": "Código (python)",
            "code": "class OrderItem(models.Model):\n    sub_order = models.ForeignKey(SubOrder, on_delete=models.CASCADE, related_name=\"items\")\n    variant = models.ForeignKey(\"catalog.ProductVariant\", on_delete=models.SET_NULL, null=True)\n    product_name = models.CharField(max_length=250)\n    variant_sku = models.CharField(max_length=100)\n    variant_attributes = models.JSONField(default=dict)\n    quantity = models.PositiveIntegerField()\n    unit_price = models.DecimalField(max_digits=10, decimal_places=2)\n    total = models.DecimalField(max_digits=10, decimal_places=2)"
          },
          {
            "title": "Código (python)",
            "code": "class Payment(models.Model):                       # linha 21\n    order = models.OneToOneField(\"orders.Order\", on_delete=models.PROTECT, related_name=\"payment\")\n    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)\n    raw_response = models.JSONField(default=dict)  # resposta completa do provedor\n\nclass Payout(models.Model):                        # linha 64\n    sub_order = models.OneToOneField(\"orders.SubOrder\", on_delete=models.PROTECT, related_name=\"payout\")"
          }
        ],
        "table": {
          "headers": [
            "Linha",
            "Por quê"
          ],
          "rows": [
            [
              "id = UUIDField",
              "O identificador é aleatório e não sequencial: ninguém consegue \"adivinhar\" o pedido seguinte trocando um número na URL."
            ],
            [
              "user ... on_delete=SET_NULL, null=True",
              "Se o usuário apagar a conta, o pedido continua existindo (a empresa precisa dele para a contabilidade e para disputas). Só o vínculo some."
            ],
            [
              "address_* copiados no pedido",
              "Snapshot: se o cliente mudar o endereço no perfil, este pedido continua com o endereço em que foi enviado."
            ],
            [
              "DecimalField(max_digits=10, decimal_places=2)",
              "Dinheiro exato, com 2 casas (Aula 1)."
            ],
            [
              "order_number unique",
              "Um número legível para o cliente falar com o suporte, sem expor o UUID."
            ]
          ]
        }
      },
      {
        "heading": "3. Dois ciclos de vida: pagamento e entrega",
        "paragraphs": [
          "Procurei no código (verificado) onde o Order.status muda. Só em três lugares:",
          "Já shipped, processing e delivered só mudam no sub-pedido (orders/views.py:68, quando o lojista atualiza).",
          "Ciclo do pedido (Order): a venda e o dinheiro",
          "Ciclo do sub-pedido (SubOrder): a entrega, uma por loja",
          "💡 Por quê dois ciclos? O pedido responde \"foi pago?\"; o sub-pedido responde \"foi entregue?\". Com duas lojas, não existe um único \"status de entrega\" verdadeiro: uma entregou, a outra não. O Order.status nunca vira \"enviado\".  ⚠️ Consequência prática: a tela do cliente precisa olhar os sub-pedidos para mostrar o andamento. Quem exibir só Order.status verá \"pagamento confirmado\" até o pedido ser cancelado. É uma decisão de modelagem boa, mas que precisa estar clara para o frontend."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "class OrderStatus(models.TextChoices):             # orders/models.py:6\n    PENDING = \"pending\"; CONFIRMED = \"confirmed\"; PROCESSING = \"processing\"\n    SHIPPED = \"shipped\"; DELIVERED = \"delivered\"; CANCELLED = \"cancelled\"; REFUNDED = \"refunded\""
          },
          {
            "title": "Código (mermaid)",
            "code": "stateDiagram-v2\n  [*] --> pending\n  pending --> confirmed: pagamento aprovado\n  pending --> cancelled: expirou ou cancelou\n  confirmed --> refunded: estorno total"
          },
          {
            "title": "Código (mermaid)",
            "code": "stateDiagram-v2\n  [*] --> confirmed\n  confirmed --> processing\n  processing --> shipped\n  shipped --> delivered\n  shipped --> refunded: devolução aprovada"
          }
        ],
        "table": {
          "headers": [
            "Quando",
            "Onde"
          ],
          "rows": [
            [
              "Pagamento confirmado → CONFIRMED",
              "payments/processing.py:43"
            ],
            [
              "Cancelado (expirou ou cliente cancelou) → CANCELLED",
              "orders/tasks.py:93, payments/views.py:274"
            ],
            [
              "Estorno total → REFUNDED",
              "payments/views.py:316"
            ]
          ]
        }
      },
      {
        "heading": "6. Caso real: como o teste prova que o dinheiro fecha",
        "paragraphs": [
          "O arquivo orders/tests.py (linhas 84-93) tem uma função que toda a suíte financeira usa:",
          "💡 Por quê? Esta é a invariante do dinheiro: tudo que o cliente pagou tem que estar em algum lugar: com a loja ou com a plataforma. Se a soma não fecha, um centavo sumiu ou foi inventado. Um teste que verifica uma invariante vale mais do que dez testes de exemplos."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "def assert_conserves_value(self, order):\n    subs = list(order.sub_orders.all())\n    sum_seller = sum(s.seller_amount for s in subs)\n    sum_comm = sum(s.commission for s in subs)\n    ...\n    # Repasses + comissões == total pago pelo cliente.\n    self.assertEqual(sum_seller + sum_comm, order.total)"
          }
        ]
      },
      {
        "heading": "7. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Leia e modele (20 min)",
          "Um cliente compra 2 bolsas da loja A (R$ 75 cada) e 1 vela da loja B (R$ 100). Fretes: loja A R$ 15, loja B R$ 12. Comissão de 12% nas duas. Sem cupom. Sem frete grátis (R$ 250 < R$ 299).",
          "Calcule, por sub-pedido: subtotal, shipping, commission, seller_amount. Depois o total do pedido e confirme a conservação.",
          "O subtotal da loja A é 2 × R$ 75. A comissão incide só sobre o subtotal. O seller_amount é (subtotal − comissão) + frete.",
          "total do pedido = 250 + 27 = R$ 277,00. Conservação: 147 + 100 + 18 + 12 = 277 ✔.",
          "E2 — Desenhe (20 min)",
          "Sem olhar a aula, desenhe as caixas Order, SubOrder, OrderItem, Payment, Payout, CommissionEntry com as setas e a cardinalidade (1:1 ou 1:N). Depois compare com o diagrama da seção 1.",
          "E3 — Decida o on_delete (25 min)",
          "Para cada relação, escolha CASCADE, PROTECT ou SET_NULL e justifique em uma frase:",
          "E4 — Rode o experimento (15 min)",
          "Rode o experimento da seção 4. Depois, remova as colunas de snapshot (nome, preco_centavos) do item_pedido e reescreva o total usando só o JOIN. Qual é o pior cenário para o cliente? E para a empresa?",
          "E5 — Desafio ★★★",
          "ReturnRequest tem order_item = OneToOneField(OrderItem) (orders/models.py:135). Por que uma devolução por item, e não por pedido? Que regra de negócio isso impõe? Que regra falta (pense em devolver 2 de 3 unidades do mesmo item)?",
          "Devolver por item permite devolver só a bolsa e ficar com a vela, e o repasse/estorno é calculado só sobre aquele item (order_item.total). O OneToOne impede abrir duas devoluções do mesmo item. O que falta: o modelo não tem quantidade devolvida; devolver 2 de 3 unidades do mesmo item não cabe (devolve-se o item inteiro). Em um produto fungível, isso seria uma limitação real, e é um bom exercício de evolução do modelo."
        ],
        "table": {
          "headers": [
            "",
            "subtotal",
            "frete",
            "comissão",
            "seller_amount"
          ],
          "rows": [
            [
              "Loja A",
              "R$ 150,00",
              "R$ 15,00",
              "R$ 18,00",
              "R$ 147,00"
            ],
            [
              "Loja B",
              "R$ 100,00",
              "R$ 12,00",
              "R$ 12,00",
              "R$ 100,00"
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento: o bug do preço que muda. Cole no Python (só biblioteca padrão):",
      "whatHappens": "Antes de rodar, preveja os três valores.",
      "lessonLearned": "Por quê: o mesmo pedido (2 unidades) custou R$ 178,00 quando foi pago e passaria a \"custar\" R$ 258,00 se o total fosse calculado pelo preço atual do produto. Com a cópia dentro do item, o histórico não muda. E, ao apagar o produto, o ON DELETE SET NULL zera só a ligação (None): o item continua com nome e preço. No Django, é o SET_NULL de OrderItem.variant."
    },
    "pitfalls": [
      {
        "wrong": "Guardar só a FK do produto e calcular o total pelo preço de hoje",
        "right": "Copiar nome e preço no item",
        "why": "Histórico precisa ser imutável"
      },
      {
        "wrong": "Um único repasse por pedido",
        "right": "Um repasse por loja (Payout no sub-pedido)",
        "why": "Cada loja recebe a sua parte"
      },
      {
        "wrong": "CASCADE do pedido para o pagamento",
        "right": "PROTECT",
        "why": "Apagar um pedido não pode destruir o rastro do dinheiro"
      },
      {
        "wrong": "Usar Order.status para dizer \"entregue\"",
        "right": "Olhar o status de cada sub-pedido",
        "why": "Lojas entregam em momentos diferentes"
      },
      {
        "wrong": "Achar que o UUID protege o pedido",
        "right": "Filtrar a consulta pelo dono",
        "why": "Segurança é autorização, não obscuridade"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a02-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Payment.order = models.OneToOneField('orders.Order', on_delete=models."
          },
          {
            "kind": "blank",
            "id": "mk-a02-q3-b1",
            "accepted": [
              "protect",
              "PROTECT"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": ", related_name='payment')"
          }
        ],
        "explanation": "PROTECT faz o banco recusar apagar um pedido que tem pagamento, preservando o rastro do dinheiro."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a02-q1",
        "question": "Um pedido tem produtos de 3 lojas e foi pago em um único PIX. Quantos Payment e quantos Payout existem?",
        "options": [
          {
            "text": "1 Payment e 1 Payout",
            "whyNot": "Esquece que cada loja recebe separadamente e com valor diferente."
          },
          {
            "text": "3 Payment e 3 Payout",
            "whyNot": "Cobraria o cliente três vezes. O pagamento é um só."
          },
          {
            "text": "1 Payment e 3 Payout"
          },
          {
            "text": "3 Payment e 1 Payout",
            "whyNot": "Inverte as granularidades: o dinheiro entra uma vez e sai em partes."
          }
        ],
        "correctIndex": 2,
        "explanation": "O cliente paga uma vez (1 Payment, ligado ao Order). Cada loja recebe a sua parte (1 Payout por SubOrder)."
      },
      {
        "id": "mk-a02-q2",
        "question": "Se o lojista alterar o preço de um produto hoje, o total de um pedido feito ontem também muda.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "O OrderItem guarda unit_price e total próprios (snapshot). O preço atual do produto não entra na conta de um pedido já feito."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "O OrderItem guarda unit_price e total próprios (snapshot). O preço atual do produto não entra na conta de um pedido já feito."
      },
      {
        "id": "mk-a02-q4",
        "question": "A loja A marca o seu sub-pedido como \"shipped\". Pelo código do MySuperStore, o que acontece com o status do Order?",
        "options": [
          {
            "text": "Vira shipped automaticamente.",
            "whyNot": "Parece natural, mas nenhum código propaga o status do sub-pedido para o pedido."
          },
          {
            "text": "Vira shipped só quando todas as lojas enviarem.",
            "whyNot": "Seria uma boa regra de agregação, mas ela não existe neste sistema (é uma evolução possível)."
          },
          {
            "text": "Nada: continua confirmed. O Order só muda em pagamento, cancelamento e estorno."
          },
          {
            "text": "Vira processing.",
            "whyNot": "Confunde com o estado do sub-pedido, e mesmo ele não muda o Order."
          }
        ],
        "correctIndex": 2,
        "explanation": "A busca no código mostra que Order.status só é alterado em processing.py:43 (confirmar), tasks.py:93 e views.py:274 (cancelar) e views.py:316 (estornar). O envio só altera o SubOrder."
      }
    ],
    "flashcards": [
      {
        "front": "Por que existe sub-pedido?",
        "back": "Cada loja envia, recebe e tem problema separadamente"
      },
      {
        "front": "Pagamento é de qual nível?",
        "back": "Do pedido (1 por pedido). O repasse é do sub-pedido"
      },
      {
        "front": "O que é snapshot?",
        "back": "Cópia do dado no momento da compra, para o histórico não mudar"
      },
      {
        "front": "SET_NULL no item",
        "back": "O produto pode ser apagado sem destruir o histórico"
      },
      {
        "front": "PROTECT no pagamento",
        "back": "O banco recusa apagar o pedido que tem dinheiro ligado"
      },
      {
        "front": "Quem muda o Order.status?",
        "back": "Só confirmação, cancelamento e estorno"
      },
      {
        "front": "Invariante do dinheiro",
        "back": "Repasses + comissões = total pago"
      }
    ],
    "threeThings": [
      "Pedido = venda e dinheiro; sub-pedido = entrega e repasse por loja.",
      "Copie o que não pode mudar (preço, nome, endereço, comissão) para dentro do pedido.",
      "Deixe o banco proteger o dinheiro: PROTECT, OneToOne e Decimal impedem erros que nenhum if pegaria."
    ]
  },
  "modulo-2-carrinho-frete-cupom": {
    "slug": "modulo-2-carrinho-frete-cupom",
    "code": "A03",
    "title": "Carrinho, frete e cupom: o servidor decide o valor, e o desconto não perde centavo",
    "oneSentence": "o navegador sugere, o servidor decide. Qualquer número que vem do cliente pode ser forjado, então o valor final nasce sempre no backend, e cada centavo de desconto precisa ter um dono.",
    "guideQuestion": "se o navegador pode mandar qualquer número, como o sistema garante que o cliente paga o valor certo e que cada loja recebe a sua parte?",
    "metaNote": "110 min · Estudo de caso MySuperStore",
    "predict": [
      {
        "question": "Um cliente abre o DevTools e envia o pedido com \"shipping\": 0 e \"total\": 1.00. O que o servidor faz?",
        "answer": "Ignora. O serializer de criação do pedido nem lê shipping, subtotal ou total: só aceita endereço, notas e"
      },
      {
        "question": "Um cupom de R$ 10,00 vale para um pedido com 3 lojas de R$ 100 cada. Dividir igualmente dá R$ 3,33 por loja.",
        "answer": "R$ 3,33 × 3 = R$ 9,99: sumiu 1 centavo. A solução do sistema: a última loja recebe a sobra (R$ 3,34)."
      },
      {
        "question": "O carrinho tem R$ 310 em produtos (frete grátis a partir de R$ 299). O cliente aplica um cupom de R$ 20.",
        "answer": "Não. O frete grátis é medido depois do desconto: 310 − 20 = R$ 290, abaixo do mínimo de R$ 299. O cliente passa a"
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o caixa, não o cliente, soma a conta",
        "paragraphs": [
          "No supermercado, o caixa passa os produtos e diz o total. O cliente não digita o próprio total na maquininha. Um marketplace funciona igual: o navegador diz o que quer comprar (itens e quantidades); o servidor diz quanto custa.",
          "O que o cliente pode mandar (orders/serializers.py:99-113)",
          "💡 Por quê é seguro? Um serializer só lê os campos listados em fields. shipping, subtotal e total não estão na lista, então, mesmo que o navegador envie, o servidor nunca os vê. A defesa não é \"validar o total\": é não ter onde receber o total. O teste test_preco_forjado_no_navegador_e_ignorado (orders/tests.py:712) prova isso."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart LR\n  N[\"Navegador<br/>envia: endereço, notas, código do cupom\"] --> S[\"Servidor<br/>lê o carrinho do banco,<br/>aplica cupom, decide frete,<br/>calcula o total\"]\n  S --> P[\"Pedido gravado<br/>com os valores do servidor\"]\n  N -. \"total, frete, subtotal<br/>(se vierem, são ignorados)\" .-x S"
          },
          {
            "title": "Código (python)",
            "code": "class OrderCreateSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Order\n        fields = [\n            \"address_recipient\", \"address_cep\", \"address_logradouro\", \"address_numero\",\n            \"address_complemento\", \"address_bairro\", \"address_cidade\", \"address_uf\",\n            \"notes\", \"coupon_code\",\n        ]"
          }
        ]
      },
      {
        "heading": "2. O carrinho: tudo é calculado, nada é confiado",
        "paragraphs": [
          "O carrinho (carts/models.py) calcula por propriedades, e o frete escolhido fica num campo JSON por loja:",
          "O caso do \"frete fantasma\"",
          "A propriedade quoted_shipping_total soma só o frete das lojas que ainda têm item no carrinho. O comentário do código conta o bug real: *cotações antigas de lojas que já saíram da sacola eram somadas e cobravam \"frete fantasma\" (ex.: R$ 53,79 de uma loja sem item)*.",
          "💡 Por quê? selected_shipping é uma memória: guarda cotações que o cliente escolheu em algum momento. Quando ele remove uma loja do carrinho, a memória continua lá. A regra certa é: a fonte da verdade é o que está no carrinho agora, e a memória só vale para as lojas presentes."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "selected_shipping = models.JSONField(default=dict, blank=True)\n# {\"seller_id\": {\"id\": 1, \"company\": \"Correios\", \"name\": \"PAC\", \"price\": \"18.50\", \"delivery_time\": 5}}\n\ndef seller_shipping_price(self, seller_id):\n    \"\"\"Frete de UMA loja. No modo fixo o servidor impõe o preço; senão vale a cotação escolhida.\"\"\"\n    if settings.SHIPPING_MODE == \"flat\":\n        return settings.FLAT_SHIPPING_PRICE\n    data = (self.selected_shipping or {}).get(str(seller_id)) or {}\n    return Decimal(str(data.get(\"price\", 0) or 0))"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "selected_shipping por loja",
              "Cada loja tem a sua transportadora e o seu preço (Aula 2: cada loja envia por conta própria)."
            ],
            [
              "SHIPPING_MODE == \"flat\"",
              "No modo fixo, o servidor impõe o preço. É a defesa mais forte: não há cotação para adulterar."
            ],
            [
              "Decimal(str(...))",
              "O preço vem como texto no JSON; converter por str evita herdar erro de float."
            ]
          ]
        }
      },
      {
        "heading": "3. O pedido: frete grátis e total, depois do cupom (orders/serializers.py:224-231)",
        "paragraphs": [],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "free_shipping = (Decimal(str(subtotal)) - Decimal(str(discount or 0))) >= dj_settings.FREE_SHIPPING_MIN\nif free_shipping:\n    shipping = Decimal(\"0\")\n# Total final = (produtos - desconto) + frete. O desconto NÃO incide no frete.\ntotal = max(Decimal(\"0\"), Decimal(str(subtotal)) - Decimal(str(discount or 0))) + Decimal(str(shipping))"
          }
        ],
        "table": {
          "headers": [
            "Linha",
            "Por quê"
          ],
          "rows": [
            [
              "(subtotal − discount) >= FREE_SHIPPING_MIN",
              "O frete grátis é um incentivo para gastar mais. Se o cupom derrubar o valor abaixo do mínimo, a condição deixou de ser verdade."
            ],
            [
              "max(0, subtotal − discount)",
              "O total nunca fica negativo, mesmo com um cupom maior que a compra."
            ],
            [
              "\"O desconto não incide no frete\"",
              "O cupom é sobre o produto; o frete é custo de transporte."
            ],
            [
              "Decisão no pedido, não no carrinho",
              "O comentário no código: *\"o servidor decide, não o carrinho: o cupom do checkout pode diferir do salvo no carrinho\"*."
            ]
          ]
        }
      },
      {
        "heading": "4. O cupom: consultivo no carrinho, consumido na transação",
        "paragraphs": [
          "O código (orders/serializers.py:188-222) tem um comentário que vale ouro:",
          "*\"O 'aplicar cupom' do carrinho é só consultivo: aqui, dentro da transação e com o cupom travado, revalida tudo e consome 1 uso. Sem isto o contador nunca subia e max_uses/1ª compra eram burláveis.\"*",
          "O que ele faz, em ordem:",
          "⚠️ Ponto de atenção (verificado): quando um pedido expira (Aula 8), o estoque volta, mas o current_uses do cupom não é devolvido. É um item do Projeto B no arquivo 06 do curso."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "coupon = Coupon.objects.select_for_update().filter(code=coupon_code).first()   # 1. trava o cupom\n...  # 2. revalida: ativo? dentro da vigência? esgotou? valor mínimo? 1ª compra? vale para a loja?\nCoupon.objects.filter(pk=coupon.pk).update(current_uses=F(\"current_uses\") + 1)  # 3. conta o uso"
          }
        ],
        "table": {
          "headers": [
            "Passo",
            "Por quê"
          ],
          "rows": [
            [
              "select_for_update",
              "Dois clientes usando o último uso do cupom ao mesmo tempo: sem a trava, ambos passam."
            ],
            [
              "Revalidar tudo",
              "Entre \"aplicar\" e \"pagar\", o cupom pode ter expirado ou esgotado. O carrinho mostra uma foto antiga."
            ],
            [
              "F(\"current_uses\") + 1",
              "O incremento acontece no banco (\"some 1 ao valor que está aí agora\"), não no Python (\"leia, some, grave\"). Mesmo princípio da Aula 4."
            ],
            [
              "Tudo na transaction.atomic",
              "Se o pedido falhar depois (por exemplo, estoque), o uso do cupom também volta. Nada de consumir cupom de pedido que não existiu."
            ]
          ]
        }
      },
      {
        "heading": "5. O rateio: dividir dinheiro sem perder centavo (orders/serializers.py:252-276)",
        "paragraphs": [
          "Com várias lojas, o desconto precisa ser dividido, porque cada loja calcula a sua comissão e o seu repasse sobre o que realmente vendeu. Duas regras:",
          "- Cupom da loja: o desconto recai só sobre os itens daquela loja. - Cupom da plataforma: dividido proporcionalmente ao subtotal de cada loja, e a sobra do arredondamento vai para a última.",
          "💡 Por quê \"a última pega a sobra\"? Dividir R$ 10,00 entre 3 dá 3,333... Arredondando cada parte, você obtém 3,33 + 3,33 + 3,33 = 9,99: um centavo sumiu. O cliente recebeu R$ 10,00 de desconto, mas a soma das lojas é R$ 9,99, e a conta da Aula 2 (repasses + comissões = total) não fecha mais. Em vez de espalhar o erro, o código o concentra em um só lugar (a última): 3,33 + 3,33 + 3,34 = 10,00.",
          "Exemplo completo: cupom da plataforma de 20%",
          "Loja A: R$ 150 (frete R$ 15) · Loja B: R$ 100 (frete R$ 12) · Cupom de plataforma de 20% sobre R$ 250 = R$ 50,00.",
          "Total do cliente: R$ 200 + R$ 27 de frete = R$ 227,00. Conservação: 120,60 + 82,40 + 14,40 + 9,60 = 227,00 ✔. (O frete grátis não vale: R$ 250 − R$ 50 = R$ 200 < R$ 299.)",
          "💡 Quem paga o cupom? No código, o desconto reduz o subtotal efetivo de cada loja, e a comissão e o repasse são calculados sobre o valor já descontado. Na prática, o lojista arca com o desconto (recebe menos) e a plataforma também ganha menos comissão. Isso é uma decisão de produto que você precisa comunicar aos lojistas: cupom da plataforma que não é compensado a eles gera atrito."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "if idx == last_idx:\n    alloc = discount_dec - running          # a sobra fecha exatamente\nelse:\n    alloc = (discount_dec * s_sub / Decimal(str(subtotal))).quantize(\n        Decimal(\"0.01\"), rounding=ROUND_HALF_UP)\n    running += alloc"
          }
        ],
        "table": {
          "headers": [
            "",
            "Desconto rateado",
            "Subtotal efetivo",
            "Comissão (12%)",
            "Lojista recebe"
          ],
          "rows": [
            [
              "Loja A",
              "R$ 30,00",
              "R$ 120,00",
              "R$ 14,40",
              "R$ 120,60"
            ],
            [
              "Loja B",
              "R$ 20,00",
              "R$ 80,00",
              "R$ 9,60",
              "R$ 82,40"
            ]
          ]
        }
      },
      {
        "heading": "8. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Na mão (20 min)",
          "Cupom da loja A de 20% (só vale para a loja A). Loja A: R$ 150 (frete R$ 15) · Loja B: R$ 100 (frete R$ 12). Calcule o desconto, o subtotal efetivo, a comissão (12%) e o repasse de cada loja, e o total do cliente.",
          "Cupom de loja: o desconto é 20% do subtotal só da loja A; a loja B não muda. Confira se o frete grátis vale (R$ 250 − R$ 30 = R$ 220).",
          "Desconto = R$ 30,00 (20% de R$ 150), todo na loja A.",
          "Total do cliente: 220 + 27 = R$ 247,00. Conservação: 120,60 + 100,00 + 14,40 + 12,00 = 247,00 ✔.",
          "E2 — No código (45 min): laboratorio/starter/lab03_rateio.py",
          "Implemente ratear_desconto(desconto, subtotais). Critério de aceite: python testes.py lab03 verde (6 testes, incluindo um que sorteia 300 combinações).",
          "E3 — Teste de propriedade (20 min)",
          "Sem olhar o teste aleatório, escreva você uma verificação com 5 casos que ache difíceis (R$ 0,01 entre 7 lojas, subtotais muito diferentes, desconto igual ao total...). Quantos o seu código resolve de primeira?",
          "E4 — Pense como o atacante (25 min)",
          "Liste 3 campos que o navegador poderia tentar forjar num pedido e onde, no código, cada tentativa é neutralizada.",
          "(1) total/shipping/subtotal: não estão em fields do serializer (serializers.py:99-113). (2) Preço do item: o unit_price vem de variant.effective_price no servidor (serializers.py:314), não do carrinho do navegador. (3) coupon_code de outra loja ou vencido: revalidado dentro da transação, com o cupom travado (:198-209). (Também vale: quantidade acima do estoque, validada em validate() e na baixa condicional.)",
          "E5 — Desafio ★★★",
          "O código não devolve o uso do cupom quando o pedido expira. Descreva a regra (quando devolver? só se o cupom ainda estiver ativo?), onde você a colocaria e como testaria (teste que falha antes e passa depois). Esse é o Projeto B."
        ],
        "table": {
          "headers": [
            "",
            "Subtotal efetivo",
            "Comissão",
            "Lojista recebe"
          ],
          "rows": [
            [
              "Loja A",
              "R$ 120,00",
              "R$ 14,40",
              "R$ 120,60"
            ],
            [
              "Loja B",
              "R$ 100,00",
              "R$ 12,00",
              "R$ 100,00"
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: o centavo perdido. Depois de implementar ratear_desconto, troque o ramo da última loja pela mesma conta das outras (sem \"a sobra\") e rode python testes.py lab03.",
      "whatHappens": "test_tres_lojas_iguais_a_sobra_vai_para_a_ultima falha: você obtém [3.33, 3.33, 3.33] (soma 9,99) em vez de [3.33, 3.33, 3.34]. test_a_soma_sempre_fecha_com_o_desconto também falha, e o teste aleatório mostra que o erro aparece em 58 das 300 combinações sorteadas (quase 1 em cada 5), não só neste exemplo. Lição: erro de arredondamento não é raro; é estatisticamente certo em volume.",
      "lessonLearned": "Experimento B: o cupom que derruba o frete grátis. Rode no gabarito:"
    },
    "pitfalls": [
      {
        "wrong": "Aceitar total ou shipping do navegador",
        "right": "Não aceitar: calcular no servidor",
        "why": "O que vem do cliente pode ser forjado"
      },
      {
        "wrong": "Contar o uso do cupom no botão \"aplicar\"",
        "right": "Contar na transação do pedido, com o cupom travado",
        "why": "Aplicar não é comprar; e a corrida estoura o limite"
      },
      {
        "wrong": "Frete grátis medido antes do cupom",
        "right": "Medido depois do cupom",
        "why": "Senão o cupom \"dá\" frete que o valor não justifica"
      },
      {
        "wrong": "Ratear com 3,33 em cada loja",
        "right": "A última recebe a sobra",
        "why": "A soma precisa fechar"
      },
      {
        "wrong": "Somar todas as cotações de frete guardadas",
        "right": "Somar só as das lojas presentes",
        "why": "Evita o frete fantasma"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a03-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "No rateio do desconto entre lojas, a sobra do arredondamento vai para a "
          },
          {
            "kind": "blank",
            "id": "mk-a03-q3-b1",
            "accepted": [
              "ultima",
              "última",
              "ultima loja",
              "última loja"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": " loja."
          }
        ],
        "explanation": "Concentrar a sobra em uma loja garante que a soma das partes seja exatamente o desconto (3,33 + 3,33 + 3,34 = 10,00)."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a03-q1",
        "question": "Um cliente envia o pedido com \"total\": 1.00 no corpo da requisição. No MySuperStore, o que acontece com esse campo?",
        "options": [
          {
            "text": "O servidor valida e recusa o pedido.",
            "whyNot": "Recusar exigiria receber e comparar o valor. O sistema é mais simples e mais seguro: não recebe."
          },
          {
            "text": "O pedido é criado com total de R$ 1,00.",
            "whyNot": "Seria a falha clássica de confiar no cliente. O código evita isso por desenho."
          },
          {
            "text": "O campo é ignorado: o serializer não o aceita e o total é calculado no servidor."
          },
          {
            "text": "O servidor usa o menor entre o total enviado e o calculado.",
            "whyNot": "Nenhuma comparação acontece: o valor enviado não entra na conta."
          }
        ],
        "correctIndex": 2,
        "explanation": "O OrderCreateSerializer só lista endereço, notas e cupom em `fields`. Total, frete e subtotal nem são lidos."
      },
      {
        "id": "mk-a03-q2",
        "question": "No MySuperStore, o uso de um cupom é contado quando o cliente clica em 'aplicar cupom' no carrinho.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "O 'aplicar' do carrinho é só consultivo. O uso é contado na criação do pedido, dentro da transação, com o cupom travado e revalidado, e se o pedido falhar o uso volta junto."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "O 'aplicar' do carrinho é só consultivo. O uso é contado na criação do pedido, dentro da transação, com o cupom travado e revalidado, e se o pedido falhar o uso volta junto."
      },
      {
        "id": "mk-a03-q4",
        "question": "O carrinho tem R$ 310 em produtos, frete de R$ 25 e o frete grátis vale a partir de R$ 299. O cliente aplica um cupom de R$ 20. Qual é o total que ele paga?",
        "options": [
          {
            "text": "R$ 290,00 (310 − 20, frete continua grátis)",
            "whyNot": "Esquece que o frete grátis depende do valor depois do cupom."
          },
          {
            "text": "R$ 315,00 (310 − 20 + 25, o cupom derrubou o frete grátis)"
          },
          {
            "text": "R$ 335,00 (310 + 25, o cupom não vale com frete)",
            "whyNot": "Ignora o cupom; ele vale e reduz os produtos."
          },
          {
            "text": "R$ 310,00 (o cupom só vale no carrinho)",
            "whyNot": "O cupom é revalidado e aplicado na criação do pedido, não só mostrado no carrinho."
          }
        ],
        "correctIndex": 1,
        "explanation": "O frete grátis é medido depois do desconto: 310 − 20 = 290 < 299. O frete passa a ser cobrado e o total sobe para R$ 315."
      }
    ],
    "flashcards": [
      {
        "front": "Quem decide o total do pedido?",
        "back": "O servidor, nunca o navegador"
      },
      {
        "front": "Por que o serializer protege o total?",
        "back": "Porque total/shipping nem estão em fields"
      },
      {
        "front": "O \"aplicar cupom\" do carrinho é...",
        "back": "Consultivo. O uso é contado na transação do pedido"
      },
      {
        "front": "Frete grátis é medido...",
        "back": "Depois do cupom"
      },
      {
        "front": "Rateio de desconto",
        "back": "Proporcional ao subtotal; a última loja recebe a sobra"
      },
      {
        "front": "Cupom de loja x de plataforma",
        "back": "De loja: só nos itens dela. De plataforma: dividido entre todas"
      },
      {
        "front": "Frete fantasma",
        "back": "Cotação antiga de loja que saiu do carrinho; some-se só as lojas presentes"
      }
    ],
    "threeThings": [
      "Não confie no navegador: o melhor valor forjado é o que o servidor nem recebe.",
      "Consuma o cupom dentro da transação, travado e revalidado.",
      "Dividir dinheiro nunca é exato: escolha um lugar para a sobra e teste a soma."
    ]
  },
  "modulo-3-criar-pedido-sem-vender-duas-vezes": {
    "slug": "modulo-3-criar-pedido-sem-vender-duas-vezes",
    "code": "A04",
    "title": "Criar o pedido sem vender duas vezes: transação, trava e baixa condicional",
    "oneSentence": "vender a mesma peça duas vezes não é um bug de lógica, é um bug de tempo: acontece porque dois processos olham o estoque no mesmo instante. A solução não é \"verificar melhor\", é fazer a verificação e a baixa na mesma instrução.",
    "guideQuestion": "duas pessoas clicam em \"comprar\" ao mesmo tempo na última peça. O que impede as duas de conseguirem?",
    "metaNote": "130 min · Estudo de caso MySuperStore",
    "diagramId": "a04-corrida-estoque",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A04 · Vídeo e Caderno de Apoio",
      "video": {
        "title": "Por que travas evitam erros em produção",
        "src": "/cursos/midia/por-que-travas-evitam-erros.mp4",
        "summary": "Explicação visual sobre concorrência, select_for_update e baixa condicional de estoque.",
        "durationLabel": "Vídeo 8m07s"
      },
      "deck": {
        "title": "O Caderno do Sênior (Apoio visual + erratas)",
        "href": "/cursos/midia/caderno-do-senior.pdf",
        "summary": "Material de apoio visual (15 páginas). Nota técnica: na pág. 2 entenda 'nem sumir' e 'o pedido nem é criado' (o estoque baixa antes do pagamento); na pág. 5 leia-se 'vende-se duas vezes' no cenário ler-subtrair-salvar.",
        "pagesLabel": "15 páginas · PDF"
      }
    },
    "predict": [
      {
        "question": "O código lê o estoque, vê 1, decide \"pode vender\" e depois grava 0. Se Ana e Bia fazem isso ao mesmo tempo, quantas",
        "answer": "Duas vendas, e o estoque final é 0 (ou até errado). Ambas leram 1 antes de qualquer uma gravar. A peça única foi vendida duas vezes."
      },
      {
        "question": "No meio da criação do pedido (já criou o pedido e o sub-pedido), a baixa do estoque falha. O que sobra no banco?",
        "answer": "Nada. Tudo acontece dentro de uma transação: se algo falha, o banco desfaz tudo (pedido, sub-pedido, itens, uso do cupom)."
      },
      {
        "question": "Você acha que travar a linha do produto (select_for_update) já resolve tudo? Por quê?",
        "answer": "Ajuda, mas não basta sozinho. A trava faz Bia esperar Ana. Mas, quando Bia continua, o objeto que ela tem na memória ainda diz"
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: a última entrada do show",
        "paragraphs": [
          "Duas pessoas olham o site e veem \"1 ingresso disponível\". Ambas clicam. Se o sistema só olha e depois marca como vendido, as duas passam: cada uma olhou antes de a outra marcar.",
          "💡 Por quê isso é tão perigoso? É um bug intermitente: só acontece quando duas compras coincidem no tempo. Em teste com um usuário, nunca aparece. Em produção, com campanha, aparece. É o pior tipo de bug: raro, caro e sem rastro (o log mostra duas vendas \"normais\")."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "sequenceDiagram\n  participant Ana\n  participant Banco\n  participant Bia\n  Ana->>Banco: lê estoque (1)\n  Bia->>Banco: lê estoque (1)\n  Note over Ana,Bia: as duas \"decidem\" que podem vender\n  Ana->>Banco: grava estoque = 0\n  Bia->>Banco: grava estoque = 0\n  Note over Banco: 2 vendas, 1 peça"
          }
        ]
      },
      {
        "heading": "2. A solução em três camadas, com o porquê de cada uma",
        "paragraphs": [
          "O create() do pedido (orders/serializers.py:155-345) combina três proteções. Cada uma resolve um problema diferente:",
          "Camada 1: a transação (serializers.py:166)",
          "💡 Por quê? Criar um pedido são vários passos (pedido, cada sub-pedido, cada item, cada baixa, o cupom). Se o 5º passo falhar e os 4 anteriores ficarem gravados, você tem um pedido sem item e estoque sumido. atomic garante ou os 5 acontecem, ou nenhum.",
          "Camada 2: a trava (serializers.py:168-169)",
          "select_for_update() diz ao PostgreSQL: *\"esta linha é minha até a transação acabar; quem quiser mexer, espere\"*.",
          "💡 Por quê? Sem a trava, Ana e Bia fazem as etapas intercaladas. Com ela, Bia espera até Ana terminar (commit). Aí as coisas acontecem em fila, o que é muito mais fácil de raciocinar.",
          "Camada 3: a baixa condicional (serializers.py:318-328)",
          "O comentário no código explica o motivo: *\"só desconta se ainda houver unidades no banco AGORA (não no objeto lido antes). Duas compras simultâneas da mesma peça única: uma passa, a outra recebe 'esgotou' e o pedido inteiro é desfeito.\"*",
          "💡 Por quê a trava e a baixa condicional, se a trava já faz fila? Porque o objeto item.variant foi carregado antes da trava (em validate(), :128-133) e guarda um stock velho. A trava impede a mistura, mas não atualiza o que você já tem na memória. A baixa condicional não depende da memória: ela pergunta ao banco. É defesa em profundidade: se uma camada falhar ou for removida por engano, a outra segura.",
          "E o validate()?",
          "Antes de tudo, validate() (:117-153) checa if variant.stock < item.quantity e devolve uma mensagem amigável (\"Restam apenas 2 unidades\"). Isso é UX, não segurança: dá um erro bonito na maioria dos casos. Mas, por não ter trava, não impede a corrida: é só a primeira linha de defesa."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart TD\n  A[\"1. Transação atômica<br/>tudo ou nada\"] --> B[\"2. Trava de linha<br/>select_for_update<br/>um de cada vez\"]\n  B --> C[\"3. Baixa condicional<br/>UPDATE ... WHERE estoque >= qtd<br/>a verificação é a gravação\"]"
          },
          {
            "title": "Código (python)",
            "code": "with transaction.atomic():\n    ...  # criar pedido, sub-pedidos, itens, baixar estoque, consumir cupom"
          },
          {
            "title": "Código (python)",
            "code": "for item in cart_items:\n    ProductVariant.objects.select_for_update().get(id=item.variant.id)"
          },
          {
            "title": "Código (python)",
            "code": "baixou = ProductVariant.objects.filter(\n    id=item.variant_id, stock__gte=item.quantity\n).update(stock=_F(\"stock\") - item.quantity)\nif not baixou:\n    raise serializers.ValidationError(\n        {\"detail\": f\"{item.variant.product.name} acabou de esgotar. Atualize sua sacola.\"}\n    )"
          }
        ],
        "table": {
          "headers": [
            "Camada",
            "Pergunta que responde",
            "Sem ela"
          ],
          "rows": [
            [
              "1. Transação (atomic)",
              "\"E se algo falhar no meio?\"",
              "Fica um pedido pela metade, com estoque baixado e sem itens"
            ],
            [
              "2. Trava (select_for_update)",
              "\"E se duas compras mexerem nos mesmos produtos ao mesmo tempo?\"",
              "As duas misturam suas leituras e gravações"
            ],
            [
              "3. Baixa condicional",
              "\"E se o dado que eu tenho na memória já estiver velho?\"",
              "Você subtrai de um número desatualizado"
            ]
          ]
        }
      },
      {
        "heading": "3. O teste que prova a regra (orders/tests.py:598-639)",
        "paragraphs": [
          "💡 Por quê este teste é bom? Ele reproduz a corrida de forma determinística: as duas compras passam em validate() (as duas \"viram\" estoque 1) e só depois save() é chamado em sequência. Ele prova que a segunda recebe erro e não deixa pedido nenhum. Note a última linha: zero pedidos da Bia: a transação desfez tudo."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "def _serializer(self, email):\n    ...\n    s = OrderCreateSerializer(data=dict(ADDRESS), context={\"request\": request})\n    s.is_valid(raise_exception=True)  # as duas validam com estoque 1 (a corrida)\n    return s\n\ndef test_peca_unica_nao_vende_duas_vezes(self):\n    a, b = self._serializer(\"a-s4@test.com\"), self._serializer(\"b-s4@test.com\")\n    a.save()\n    with self.assertRaises(self.VE):\n        b.save()\n    self.variant.refresh_from_db()\n    self.assertEqual(self.variant.stock, 0)\n    self.assertEqual(Order.objects.filter(user__email=\"b-s4@test.com\").count(), 0)"
          }
        ]
      },
      {
        "heading": "5. ⚠️ Um ponto de atenção real: a ordem das travas",
        "paragraphs": [
          "No código, as travas são pedidas na ordem do carrinho (serializers.py:168-169, for item in cart_items). Pense:",
          "- Pedido 1: carrinho com produto A, depois B → trava A, depois B. - Pedido 2: carrinho com produto B, depois A → trava B, depois A.",
          "Se isso acontece ao mesmo tempo: o Pedido 1 tem A e espera B; o Pedido 2 tem B e espera A. Ninguém avança: é um deadlock. O PostgreSQL detecta e cancela um dos dois com erro, e o cliente vê uma falha.",
          "💡 Como o MercadinhoSys resolve? Ele ordena os ids antes de travar (checkout_locking.py: ids = sorted({...}), order_by(Produto.id)): todos travam na mesma ordem (A antes de B), então um sempre espera o outro, e ninguém espera em círculo. É uma correção de uma linha no MySuperStore (sorted(...) sobre os ids) e é o Projeto B do curso."
        ]
      },
      {
        "heading": "7. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Linha do tempo (15 min)",
          "Desenhe, em uma tabela de tempo, o que cada transação faz nestes dois casos, com estoque 1: (a) código ingênuo; (b) UPDATE ... WHERE estoque >= 1. Marque o instante em que o bug acontece no caso (a).",
          "No caso (b): Ana executa o UPDATE (rowcount 1, estoque 0). Bia executa o UPDATE: o WHERE estoque >= 1 não casa mais (rowcount 0). Ela recebe \"esgotou\". O bug do caso (a) acontece entre os instantes 1 e 4: o intervalo em que as duas decisões foram tomadas com o mesmo dado velho.",
          "E2 — No código (45 min): laboratorio/starter/lab04_estoque.py",
          "Implemente comprar_condicional. Critério de aceite: python testes.py lab04 verde (3 testes). Depois, rode cinco vezes para ver que não é sorte.",
          "E3 — Estoque maior que 1 (25 min)",
          "Com estoque 3, oito compradores tentam levar 1 cada. Quantas vendas devem acontecer? Qual o estoque final? E se cada comprador quiser 2 unidades?",
          "Com 1 unidade cada: 3 vendas, estoque final 0. Com 2 unidades cada: 1 venda (2 unidades), estoque final 1 (a segunda tentativa vê estoque 1 < 2 e falha). Repare: o UPDATE condicional não deixa o estoque negativo e também não vende parcialmente.",
          "E4 — Corrija o deadlock (30 min)",
          "Reescreva o laço das travas (for item in cart_items: ... select_for_update()) para travar em ordem fixa. Escreva a mudança em 3 linhas e explique por que dois pedidos com carrinhos [A, B] e [B, A] não travam mais um ao outro.",
          "Os dois pedidos pedem A e depois B. Quem chegar primeiro pega A; o outro espera A (sem ter nada travado), não B. Como não há \"espera em círculo\", não há deadlock. (Ainda é preciso um teste com PostgreSQL real: o SQLite não tem trava de linha.)",
          "E5 — Desafio ★★★",
          "O laboratório usa SQLite e uma peça. Em produção, o pedido tem vários itens. Descreva o que acontece se o 1º item tiver estoque e o 2º não: o que fica no banco? Por que isso não exige código extra de \"desfazer\"?",
          "O 1º item é baixado; o 2º faz rowcount == 0 e levanta ValidationError. Como está dentro da transaction.atomic(), a exceção desfaz tudo, inclusive a baixa do 1º item, o pedido, os sub-pedidos e o uso do cupom. Não há código de \"desfazer\" porque a transação é o desfazer. (Por isso o estoque só pode ser baixado dentro dela.)"
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "ids = sorted({item.variant_id for item in cart_items})\nfor v_id in ids:\n    ProductVariant.objects.select_for_update().get(id=v_id)"
          }
        ],
        "table": {
          "headers": [
            "t",
            "Ana",
            "Bia",
            "Estoque no banco"
          ],
          "rows": [
            [
              "1",
              "lê estoque → 1",
              "",
              "1"
            ],
            [
              "2",
              "",
              "lê estoque → 1",
              "1"
            ],
            [
              "3",
              "decide: pode vender",
              "decide: pode vender",
              "1"
            ],
            [
              "4",
              "grava 0",
              "",
              "0"
            ],
            [
              "5",
              "",
              "grava 0",
              "0 → 2 vendas, 1 peça"
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: veja o bug. Em laboratorio/starter/lab04_estoque.py a versão ingênua já está pronta. Rode:",
      "whatHappens": "O teste test_ingenuo_vende_a_mesma_peca_varias_vezes passa (ele afirma que o bug existe). test_condicional_... falha até você implementar.",
      "lessonLearned": "Com 8 compradores e 1 peça, o código ingênuo vendeu a mesma peça 8 vezes, e isso aconteceu em 30 de 30 rodadas. E mesmo sem pausa artificial (pausa=0) a corrida apareceu em 30 de 30 rodadas. A pausa só garante o bug em testes; ela não é necessária para ele existir. Já a versão condicional: 1 venda exata em 30 de 30 rodadas, com o estoque final sempre 0."
    },
    "pitfalls": [
      {
        "wrong": "if produto.estoque >= qtd: produto.estoque -= qtd; produto.save()",
        "right": "UPDATE ... SET estoque = estoque - qtd WHERE estoque >= qtd",
        "why": "A primeira versão tem o intervalo entre ler e gravar"
      },
      {
        "wrong": "Confiar no validate()",
        "right": "Tratar validate() como mensagem amigável",
        "why": "Sem trava, não protege"
      },
      {
        "wrong": "Baixar estoque fora da transação",
        "right": "Dentro da atomic",
        "why": "Um erro depois deixaria o estoque baixado sem pedido"
      },
      {
        "wrong": "Travar em ordem do carrinho",
        "right": "Travar em ordem fixa (ids ordenados)",
        "why": "Evita deadlock"
      },
      {
        "wrong": "Achar que o teste \"uma compra\" prova segurança",
        "right": "Testar duas compras concorrentes",
        "why": "O bug só existe com concorrência"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a04-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Complete a cláusula que impede o estoque negativo: UPDATE produto SET estoque = estoque - 1 WHERE id = 1 AND "
          },
          {
            "kind": "blank",
            "id": "mk-a04-q3-b1",
            "accepted": [
              "estoque>=1",
              "estoque > 0",
              "estoque >= 1"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": ""
          }
        ],
        "explanation": "Sem a condição, o UPDATE subtrai mesmo com estoque zero e o número fica negativo. A condição no WHERE é a regra de negócio."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a04-q1",
        "question": "Por que \"ler o estoque, ver que há, e depois gravar o novo valor\" pode vender a mesma peça duas vezes?",
        "options": [
          {
            "text": "Porque o banco de dados não guarda o estoque corretamente.",
            "whyNot": "O banco guarda corretamente. Ele só executa o que as duas compras mandarem, na ordem em que chegarem."
          },
          {
            "text": "Porque entre a leitura e a gravação outra compra pode ter lido o mesmo valor."
          },
          {
            "text": "Porque o Python é lento demais para cálculos.",
            "whyNot": "Velocidade não é o ponto: com pausa zero a corrida ainda apareceu em 30 de 30 rodadas."
          },
          {
            "text": "Porque o estoque deveria ser um número decimal.",
            "whyNot": "Tipo numérico não tem relação com a concorrência."
          }
        ],
        "correctIndex": 1,
        "explanation": "O erro está no intervalo entre ler e gravar: duas compras leem \"1\" antes de qualquer uma gravar \"0\". Nenhuma linha de código está \"errada\"; o problema é de tempo."
      },
      {
        "id": "mk-a04-q2",
        "question": "Usar select_for_update() e depois subtrair o estoque que já estava carregado na memória é suficiente para impedir a venda dupla.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "A trava faz as compras esperarem em fila, mas não atualiza o objeto que já estava na memória (lido antes da trava, em validate()). Subtrair desse valor velho pode vender de novo. A baixa condicional pergunta ao banco \"agora\", por isso o sistema usa as duas."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "A trava faz as compras esperarem em fila, mas não atualiza o objeto que já estava na memória (lido antes da trava, em validate()). Subtrair desse valor velho pode vender de novo. A baixa condicional pergunta ao banco \"agora\", por isso o sistema usa as duas."
      },
      {
        "id": "mk-a04-q5",
        "question": "Dois clientes finalizam ao mesmo tempo: um com carrinho [A, B] e outro com [B, A]. As travas são pedidas na ordem do carrinho. O que pode acontecer?",
        "options": [
          {
            "text": "Nada: o PostgreSQL ordena as travas sozinho.",
            "whyNot": "O banco atende as travas na ordem em que são pedidas; ele não reordena."
          },
          {
            "text": "Deadlock: cada um segura um produto e espera o outro; o banco cancela um dos pedidos."
          },
          {
            "text": "Os dois pedidos passam normalmente, pois são produtos diferentes.",
            "whyNot": "Os produtos são os mesmos; o problema é a ordem em que são pedidos."
          },
          {
            "text": "O estoque dos dois produtos fica negativo.",
            "whyNot": "O estoque não fica negativo; o problema aqui é espera circular, não baixa indevida."
          }
        ],
        "correctIndex": 1,
        "explanation": "Cada pedido trava um produto e espera o segundo, que o outro já travou: espera em círculo. O PostgreSQL detecta o deadlock e aborta um deles com erro. A correção é travar em ordem fixa (ids ordenados), como faz o MercadinhoSys."
      }
    ],
    "flashcards": [
      {
        "front": "O que causa a venda dupla?",
        "back": "O intervalo entre ler e gravar, com duas compras no mesmo instante"
      },
      {
        "front": "O que a transação garante?",
        "back": "Tudo ou nada: se algo falhar, nada fica pela metade"
      },
      {
        "front": "O que a trava (select_for_update) garante?",
        "back": "Quem chega depois espera, mas não atualiza o que já está na memória"
      },
      {
        "front": "O que a baixa condicional garante?",
        "back": "A verificação e a gravação acontecem juntas, no banco"
      },
      {
        "front": "Como saber que a baixa funcionou?",
        "back": "rowcount == 1"
      },
      {
        "front": "O validate() do serializer protege?",
        "back": "Não: é só uma mensagem amigável"
      },
      {
        "front": "O que é deadlock?",
        "back": "Dois processos se esperam em círculo; evita-se travando em ordem fixa"
      }
    ],
    "threeThings": [
      "Nunca leia, decida e grave: faça a condição fazer parte da gravação.",
      "Transação, trava e baixa condicional resolvem problemas diferentes: use as três.",
      "Teste a concorrência de verdade: um teste com um usuário só nunca acha esse bug."
    ]
  },
  "modulo-3-cobrar-pix-e-cartao": {
    "slug": "modulo-3-cobrar-pix-e-cartao",
    "code": "A05",
    "title": "Cobrar com PIX e cartão: mTLS, QR code, split e por que o cartão nunca passa pelo seu servidor",
    "oneSentence": "cobrar é pedir ao provedor para criar uma cobrança e guardar o identificador dela. O dinheiro é do provedor até o momento de dividir; o seu servidor nunca precisa tocar no número do cartão.",
    "guideQuestion": "como o dinheiro do cliente chega até a plataforma e aos lojistas, e por que o número do cartão nunca toca o seu servidor?",
    "metaNote": "110 min · Estudo de caso MySuperStore",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A05 · Vídeo do fluxo PIX",
      "video": {
        "title": "MySuperStore: O Caminho do PIX",
        "src": "/cursos/midia/caminho-do-pix.mp4",
        "summary": "Material complementar em vídeo percorrendo cobrança PIX, QR code, copia-e-cola e confirmação.",
        "durationLabel": "Vídeo 8m33s"
      }
    },
    "predict": [
      {
        "question": "Quando o cliente escolhe PIX, quem desenha a imagem do QR code: o provedor ou o seu servidor?",
        "answer": "O seu servidor. O provedor devolve só o texto \"copia e cola\"; o código gera a imagem localmente (_qr_png_base64). Isso evita uma chamada e uma permissão a mais."
      },
      {
        "question": "O cliente paga com cartão. O número do cartão chega ao backend do marketplace?",
        "answer": "Não. O navegador troca o cartão por um token com o SDK do provedor; o backend recebe só o token (payment_token)."
      },
      {
        "question": "A cobrança PIX é criada com validade de 1 hora. O pedido é cancelado automaticamente se passar de 60 minutos sem pagamento.",
        "answer": "O PIX ainda pode estar válido depois que o pedido já foi cancelado (e o estoque devolvido). Se o cliente pagar nesse intervalo, o dinheiro entra"
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o caixa eletrônico e o cofre",
        "paragraphs": [
          "- PIX é como pedir ao banco um boleto instantâneo com um número único (txid). O cliente paga esse número; o banco avisa você. - Cartão é como um cofre: o cliente entrega o cartão ao cofre do provedor (no navegador) e você recebe só um recibo (o token). Com o recibo você pede a cobrança, mas não consegue abrir o cofre."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "sequenceDiagram\n  participant C as Cliente (navegador)\n  participant A as API\n  participant E as Provedor (Efí)\n  C->>A: POST /payments/process/ (order_id, método pix)\n  A->>A: valida: pedido é do usuário e está pendente\n  A->>E: cria cobrança PIX (mTLS) com validade e split\n  E-->>A: txid + copia-e-cola\n  A->>A: gera a imagem do QR localmente\n  A-->>C: QR code + copia-e-cola"
          }
        ]
      },
      {
        "heading": "2. O endpoint, passo a passo (payments/views.py:45-134)",
        "paragraphs": [
          "Antes de cobrar, o serializer garante duas coisas (payments/serializers.py:40-51):",
          "💡 Por quê as duas? A primeira impede pagar o pedido de outra pessoa (e vazar dados). A segunda impede cobrar duas vezes um pedido já pago ou cancelado. Sem a segunda, chamar /process/ de novo reiniciaria o pagamento de um pedido aprovado (o código redefine o status para PENDING a cada chamada, views.py:62-65).",
          "2.1 A cobrança PIX (services.py:179-238)",
          "2.2 O QR code é gerado aqui, não no provedor (services.py:56-62)",
          "💡 Por quê gerar localmente? O texto copia-e-cola já contém tudo; o QR é só uma representação gráfica dele. Pedir a imagem ao provedor exigiria mais uma chamada e mais uma permissão (cob.read). Princípio: menos permissão = menos estrago se a credencial vazar.",
          "2.3 O certificado mTLS (services.py:19-48)",
          "O provedor exige mTLS: além de usuário e senha, o seu servidor apresenta um certificado. O provedor entrega o certificado em formato .p12, mas a biblioteca de requisições precisa de .pem. O código converte uma vez por processo:",
          "💡 Por quê o certificado nunca está no repositório? Ele é uma credencial. No servidor ele é montado como arquivo somente leitura (certs:/app/certs:ro) e, no desenho para PaaS, vem por variável base64 (settings/base.py:311-322).",
          "2.4 Dinheiro em centavos (services.py:51-53)",
          "💡 Por quê centavos inteiros? APIs de cartão costumam trabalhar em centavos (inteiros), e int(19.99 * 100) dá 1998, não 1999 (veja o experimento abaixo). Passar por Decimal(str(...)) evita o erro de ponto flutuante.",
          "2.5 O cartão: tokenização e cobrança em um passo (views.py:98-134, services.py:94-142)",
          "- O navegador usa o SDK do provedor (payment-token-efi) para trocar o cartão por um payment_token. - O backend exige token, dados do titular e endereço de cobrança (serializers.py:53-62), nunca o número. - create_one_step_charge cria e paga a cobrança numa só chamada, com o split dos lojistas (payee_code). - O resultado volta como status: approved, paid ou settled confirmam na hora (views.py:114-121); outros (waiting, unpaid) aguardam a notificação do provedor.",
          "💡 Por quê é bom o cartão não passar pelo servidor? Quem toca em dados de cartão entra no escopo das regras de segurança do setor de cartões (PCI). Com a tokenização, o seu servidor só vê um recibo inútil para um ladrão: o escopo de conformidade é muito menor, e, se o seu banco de dados vazar, não há cartões para roubar."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "def validate_order_id(self, value):\n    order = Order.objects.get(id=value, user=user)          # é do usuário?\n    if order.status != OrderStatus.PENDING:                 # ainda está pendente?\n        raise serializers.ValidationError(\"Não é possível pagar um pedido com status ...\")"
          },
          {
            "title": "Código (python)",
            "code": "body = {\n    \"calendario\": {\"expiracao\": int(getattr(settings, \"EFI_PIX_EXPIRACAO\", 3600))},\n    \"valor\": {\"original\": valor},\n    \"chave\": settings.EFI_PIX_KEY,\n    \"solicitacaoPagador\": f\"{settings.STORE_PIX_LABEL} · Pedido {order.order_number}\"[:140],\n}\nsplits = []\nfor sub_order in order.sub_orders.all():\n    seller = sub_order.seller\n    if seller and seller.efi_authorized:\n        splits.append({\"recebedor\": {\"contaCorrente\": seller.efi_payee_code},\n                       \"valor\": f\"{Decimal(str(sub_order.seller_amount)):.2f}\"})\nif splits:\n    body[\"repasses\"] = splits"
          },
          {
            "title": "Código (python)",
            "code": "def _qr_png_base64(payload: str) -> str:\n    \"\"\"Gera a imagem PNG (base64) do QR Code a partir do Copia-e-Cola, localmente.\n    Evita o endpoint pix_generate_qrcode do Efí, que exige escopo cob.read.\"\"\"\n    img = qrcode.make(payload)\n    ..."
          },
          {
            "title": "Código (python)",
            "code": "_efi_pem_lock = threading.Lock()\n_efi_pem_cache: dict[str, str] = {}\n\ndef _ensure_pem_certificate(cert_path: str) -> str:\n    ...\n    with _efi_pem_lock:\n        cached = _efi_pem_cache.get(cert_path)\n        if cached and os.path.exists(cached):\n            return cached\n        ...   # lê o .p12, extrai chave e certificado\n        out = os.path.join(\"/tmp\", f\"efi_{abs(hash(cert_path))}.pem\")\n        with open(out, \"wb\") as fh:\n            fh.write(pem)\n        os.chmod(out, 0o600)\n        _efi_pem_cache[cert_path] = out\n        return out"
          },
          {
            "title": "Código (python)",
            "code": "def _cents(value) -> int:\n    \"\"\"Converte um Decimal/float de reais para centavos inteiros sem erro de ponto flutuante.\"\"\"\n    return int((Decimal(str(value)) * 100).to_integral_value())"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "expiracao: 3600",
              "A cobrança vence em 1 h: pagar depois disso é impossível no banco do cliente (mas veja o caso real abaixo)."
            ],
            [
              "chave: EFI_PIX_KEY",
              "A chave PIX recebedora da plataforma. O dinheiro entra nela."
            ],
            [
              "solicitacaoPagador com [:140]",
              "O texto que o app do banco mostra ao cliente; o limite do provedor é 140 caracteres."
            ],
            [
              "Decimal(str(...)):.2f",
              "Valor como texto com 2 casas, sem passar por float."
            ],
            [
              "repasses só para efi_authorized",
              "O split nativo só existe para lojistas com conta no provedor (efi_payee_code). Os demais recebem o repasse depois (Aula 7)."
            ]
          ]
        }
      },
      {
        "heading": "3. ⚠️ Dois pontos de atenção reais",
        "paragraphs": [
          "3.1 O fallback de PIX local (views.py:76-89, services.py:334-379)",
          "Se o provedor falha ao criar a cobrança, o código gera um PIX \"local\" com uma chave de exemplo fixa. O QR aparece, mas:",
          "- a chave não é a da loja; - o efi_txid fica vazio, e o webhook procura pagamentos por efi_txid (views.py:228), então o pagamento nunca é reconhecido.",
          "💡 Por quê é perigoso? O cliente vê um QR como se tudo estivesse bem, paga (para uma chave que não é sua) e o pedido nunca confirma. O correto é falhar com clareza (um erro 502 \"tente novamente\"), porque um erro visível custa menos do que um pagamento perdido.",
          "3.2 Caso real verificado: o PIX pago depois do cancelamento",
          "Em 13/11/2026 eu escrevi um teste temporário para uma dúvida: a cobrança PIX vale 3600 s (EFI_PIX_EXPIRACAO); o pedido é cancelado após 60 min (Aula 8). Os dois relógios começam em momentos diferentes (o pedido nasce antes da cobrança) e a tarefa que cancela roda a cada 5 minutos. Existe, portanto, uma janela em que o pedido já foi cancelado e a cobrança ainda é válida.",
          "O teste criou um pedido, expirou-o e simulou o webhook de pagamento. Resultado:",
          "O pedido cancelado voltou a \"confirmado\", e o estoque continua devolvido (1). A peça pode ser vendida de novo a outra pessoa, e o cliente que pagou fica com um pedido \"confirmado\" de uma peça que talvez não exista mais.",
          "💡 Por quê acontece? process_successful_payment só se protege contra o estado CONFIRMED (processing.py:26). Ele não conhece o estado CANCELLED. E o código que cancela não cancela a cobrança no provedor, então ela segue podendo ser paga. Dois relógios e uma regra faltando.  ✅ Corrigido no PR 29 do MySuperStore (aguardando merge): só pedido PENDING confirma, o pagamento tardio vira \"órfão\" (registrado, sem reativar o pedido) e a expiração espera o QR vencer. O texto desta seção descreve o comportamento antes do PR 29.  Como corrigir (você vai projetar no desafio E6): (a) alinhar os prazos (a cobrança deve vencer antes do cancelamento); (b) recusar a confirmação de pedido CANCELLED e devolver o dinheiro (ou pôr em revisão manual); (c) cancelar a cobrança no provedor ao expirar o pedido."
        ],
        "codeBlocks": [
          {
            "title": "Trecho do estudo de caso",
            "code": "apos expirar:  pedido=cancelled  estoque=1\napos webhook:  processed=True    pedido=confirmed  estoque=1  pagamento=approved"
          }
        ]
      },
      {
        "heading": "6. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Ordene o fluxo (10 min)",
          "Ordene: (a) gera a imagem do QR; (b) valida que o pedido é do usuário e está pendente; (c) cria a cobrança no provedor com o split; (d) devolve QR e copia-e-cola; (e) grava txid no Payment.",
          "b → c → e → a → d. Validar antes de gastar uma chamada; cobrar; guardar o txid (é a chave para reconhecer o pagamento depois); só então desenhar e responder.",
          "E2 — O centavo (15 min)",
          "Rode o experimento A. Descubra mais três valores em que int(float * 100) perde 1 centavo. Qual regra geral explica?",
          "Muitos valores com duas casas (por exemplo, 0,57 → 56, 0,58 → 57, 9,95 → 994) caem para baixo. A regra: números decimais de duas casas geralmente não têm representação exata em binário; a multiplicação cai em x.9999... e o int() trunca. A solução é Decimal (que guarda o decimal exato), ou round() explícito.",
          "E3 — O BR Code (30 min)",
          "Rode o experimento B. Depois: (1) monte à mão o campo 54 para R$ 7,50; (2) diga quantos caracteres tem o campo 59 para \"LOJA EXEMPLO\"; (3) altere o nome da loja e confirme que o CRC muda.",
          "(1) O valor 7.50 tem 4 caracteres, então o tamanho é 04 e o campo fica 54 + 04 + 7.50 = 54047.50. (2) \"LOJA EXEMPLO\" tem 12 caracteres: 5912LOJA EXEMPLO. (3) Qualquer mudança no texto muda o CRC (é essa a função dele).",
          "E4 — Leia o mTLS (25 min)",
          "Releia _ensure_pem_certificate. Para cada um dos 5 elementos (Lock, cache, chmod 0o600, exists, /tmp), escreva: (a) o problema que ele resolve e (b) o que quebraria sem ele.",
          "E5 — Pense como o auditor (20 min)",
          "Imagine que o seu endpoint recebesse o número do cartão. Liste três consequências (pense em logs, backup do banco, funcionários, vazamento, regras do setor de cartões).",
          "E6 — Desafio ★★★ (o caso do PIX pago depois do cancelamento)",
          "Projete a correção do caso 3.2. Responda: (1) qual prazo de validade da cobrança você usaria e por quê? (2) o que process_successful_payment deve fazer ao receber pagamento de um pedido CANCELLED? (3) o que fazer com o dinheiro que entrou? (4) como testar (um teste que falha antes e passa depois)?",
          "(1) Validade menor que o prazo de cancelamento, com folga maior que o intervalo da tarefa (por exemplo, 50 min de validade contra 60 min de cancelamento e tarefa a cada 5 min), para a cobrança nunca viver mais que o pedido. (2) Recusar a confirmação (return False) e registrar o evento; não mudar o status do pedido. (3) Tratar como pagamento órfão: devolver pelo estorno PIX (Aula 7) ou abrir revisão manual, e avisar o cliente. (4) Um teste como o experimento: criar o pedido, expirar, chamar process_successful_payment e afirmar que o pedido continua CANCELLED e o estoque não foi reduzido. (Cancelar a cobrança no provedor ao expirar é um reforço, não substitui a regra.)"
        ]
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: o centavo que vira 1998. No Python:",
      "whatHappens": "float perde 1 centavo em todos esses valores comuns: 19,99 vira R$ 19,98. Por quê: 19.99 em binário é 19.989999...; multiplicar por 100 dá 1998.9999..., e int() corta (não arredonda). Cobrar R$ 19,98 de quem devia R$ 19,99 é um erro que nenhum teste de exemplo simples pega e que o cliente (ou o fiscal) pega.",
      "lessonLearned": "Experimento B: o CRC do BR Code. O texto \"copia e cola\" do PIX é uma sequência de campos ID + tamanho + valor e termina com um CRC de 4 caracteres. O fallback do código monta um (services.py:334-379). Rode:"
    },
    "pitfalls": [
      {
        "wrong": "Receber o número do cartão no backend",
        "right": "Receber só o token",
        "why": "Menos escopo de segurança; nada para vazar"
      },
      {
        "wrong": "int(valor * 100) com float",
        "right": "Decimal e to_integral_value()",
        "why": "float perde centavo"
      },
      {
        "wrong": "Fallback silencioso para um PIX \"de mentira\"",
        "right": "Falhar com clareza (erro e nova tentativa)",
        "why": "Pagamento perdido custa mais que um erro visível"
      },
      {
        "wrong": "Cobrança válida por mais tempo que o pedido",
        "right": "Validade menor que o prazo de cancelamento",
        "why": "Evita pagamento para pedido morto"
      },
      {
        "wrong": "Confirmar qualquer pedido que ainda não esteja confirmado",
        "right": "Recusar também CANCELLED e tratar o dinheiro recebido",
        "why": "Evita ressuscitar pedido cancelado"
      },
      {
        "wrong": "Certificado dentro do repositório",
        "right": "Arquivo montado somente leitura ou variável de ambiente",
        "why": "É uma credencial"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a05-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Para converter reais em centavos sem perder 1 centavo, use int(("
          },
          {
            "kind": "blank",
            "id": "mk-a05-q3-b1",
            "accepted": [
              "decimal",
              "Decimal"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": "(str(valor)) * 100).to_integral_value())"
          }
        ],
        "explanation": "Decimal guarda o número decimal exato; float guarda aproximação binária e trunca para 1998 em vez de 1999."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a05-q1",
        "question": "Um cliente paga com cartão no MySuperStore. O que o backend recebe para cobrar?",
        "options": [
          {
            "text": "O número do cartão e o CVV, criptografados.",
            "whyNot": "Mesmo criptografado, receber o número traria o servidor para o escopo de conformidade do setor de cartões."
          },
          {
            "text": "Um token gerado no navegador pelo SDK do provedor, mais dados do titular e endereço."
          },
          {
            "text": "Apenas o nome do titular.",
            "whyNot": "Sem token não há como cobrar o cartão."
          },
          {
            "text": "O número do cartão, mas só os 4 últimos dígitos.",
            "whyNot": "Os 4 últimos dígitos não bastam para cobrar; só o token permite a cobrança."
          }
        ],
        "correctIndex": 1,
        "explanation": "O navegador troca o cartão por um payment_token no cofre do provedor. O backend exige token, dados do titular e endereço de cobrança, e nunca o número."
      },
      {
        "id": "mk-a05-q2",
        "question": "No MySuperStore (antes do PR 29), depois que o pedido expira (60 min) e é cancelado, um PIX pago nesse intervalo não consegue reativar o pedido.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "Verificado com um teste: process_successful_payment só se protege contra o status CONFIRMED. Um pedido CANCELLED é confirmado de novo (pedido=confirmed, estoque continua devolvido). A correção exige prazos alinhados e recusar a confirmação de pedido cancelado."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "Verificado com um teste: process_successful_payment só se protege contra o status CONFIRMED. Um pedido CANCELLED é confirmado de novo (pedido=confirmed, estoque continua devolvido). A correção exige prazos alinhados e recusar a confirmação de pedido cancelado."
      },
      {
        "id": "mk-a05-q5",
        "question": "O código converte o certificado .p12 em .pem e grava em /tmp. Qual combinação de cuidados ele usa?",
        "options": [
          {
            "text": "Cache em memória e permissão aberta para facilitar o acesso.",
            "whyNot": "A permissão aberta deixaria a chave privada legível por qualquer processo do servidor."
          },
          {
            "text": "Trava de thread, cache, verificação de que o arquivo ainda existe e permissão 0600."
          },
          {
            "text": "Conversão a cada requisição, para nunca guardar o arquivo.",
            "whyNot": "Converter a cada requisição desperdiça tempo e abre o arquivo repetidamente; o cache existe por isso."
          },
          {
            "text": "Gravar o certificado dentro do banco de dados.",
            "whyNot": "Colocar a chave no banco ampliaria quem pode vê-la e entraria nos backups."
          }
        ],
        "correctIndex": 1,
        "explanation": "A trava evita duas threads escreverem o mesmo arquivo; o cache evita reconverter; a checagem refaz se /tmp foi limpo; e 0600 limita a leitura ao dono do processo."
      }
    ],
    "flashcards": [
      {
        "front": "O que é o txid?",
        "back": "O identificador da cobrança PIX; é a chave para reconhecer o pagamento"
      },
      {
        "front": "Quem gera a imagem do QR?",
        "back": "O seu servidor, a partir do copia-e-cola"
      },
      {
        "front": "O que o mTLS acrescenta?",
        "back": "O servidor também apresenta certificado, além de usuário e senha"
      },
      {
        "front": "Por que o chmod 0600?",
        "back": "Só o dono lê a chave privada"
      },
      {
        "front": "O cartão chega ao backend?",
        "back": "Não: só o token"
      },
      {
        "front": "Por que Decimal e não float em centavos?",
        "back": "int(19.99*100) dá 1998"
      },
      {
        "front": "Pago depois de cancelado",
        "back": "process_successful_payment só conhece CONFIRMED: pedido cancelado volta a confirmado"
      }
    ],
    "threeThings": [
      "Menos acesso, menos estrago: token em vez de cartão, QR local em vez de permissão extra, certificado com permissão 0600.",
      "Dinheiro em Decimal/centavos inteiros: float perde centavo sem avisar.",
      "Dois relógios desalinhados criam bugs de dinheiro: alinhe a validade da cobrança ao prazo do pedido e proteja o estado CANCELLED."
    ]
  },
  "modulo-3-confirmar-pagamento-webhook": {
    "slug": "modulo-3-confirmar-pagamento-webhook",
    "code": "A06",
    "title": "Confirmar o pagamento: webhook, segredo, fail-closed e idempotência",
    "oneSentence": "o webhook é uma porta pública por onde chega dinheiro. Ela precisa de prova de origem (quem avisou), prova de valor (quanto foi pago) e prova de unicidade (só vale uma vez).",
    "guideQuestion": "uma URL pública recebe o aviso \"o PIX foi pago\". Como o sistema sabe que é verdade e garante que o pedido é confirmado uma única vez?",
    "metaNote": "130 min · Estudo de caso MySuperStore",
    "diagramId": "a06-escudo-webhook",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A06 · Vídeo e Áudio",
      "video": {
        "title": "MySuperStore: O Caminho do PIX",
        "src": "/cursos/midia/caminho-do-pix.mp4",
        "summary": "Material complementar em vídeo mostrando o retorno do pagamento e a confirmação no sistema.",
        "durationLabel": "Vídeo 8m33s"
      },
      "audio": {
        "title": "Segurança versus Pragmatismo na Arquitetura de Software",
        "src": "/cursos/midia/seguranca-versus-pragmatismo.m4a",
        "summary": "Debate em áudio sobre defesas de webhook, validação em tempo constante e trade-offs práticos.",
        "durationLabel": "Áudio 16m42s"
      }
    },
    "predict": [
      {
        "question": "O provedor, por instabilidade, reenvia o mesmo aviso 3 vezes. Quantas comissões e repasses devem existir ao final?",
        "answer": "Uma comissão e um repasse. O segundo e o terceiro avisos são reconhecidos como repetição e não fazem nada."
      },
      {
        "question": "Alguém descobre o txid de um pedido e chama a URL do webhook dizendo \"pago\". Se não houver segredo, o que acontece?",
        "answer": "Sem segredo, o pedido seria marcado como pago sem ter sido. Essa é exatamente a falha que o segredo na URL previne."
      },
      {
        "question": "O servidor sobe em produção sem o segredo configurado. O webhook deve aceitar ou recusar tudo?",
        "answer": "Recusar tudo (erro 503). É o princípio fail-closed: na dúvida sobre a segurança, negue. Aceitar tudo \"para não quebrar\" seria abrir a porta por esquecimento."
      },
      {
        "question": "O cliente paga R$ 1,00 de um pedido de R$ 300,00. O webhook chega com o valor R$ 1,00. O pedido é confirmado?",
        "answer": "Não. O código compara o valor pago com o devido e não confirma pagamento a menor."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o carteiro e o porteiro",
        "paragraphs": [
          "O provedor (o carteiro) bate à sua porta e diz \"tem um pagamento aqui\". Você é o porteiro. Três perguntas, nesta ordem:",
          "1. Quem é você? (o carteiro é mesmo do provedor?) → origem 2. O que você trouxe? (o valor bate com o pedido?) → valor 3. Isso já entrou antes? (é a mesma encomenda de ontem?) → unicidade"
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart TD\n  A[\"Aviso chega no webhook\"] --> B{\"Segredo configurado?\"}\n  B -- \"não, e produção\" --> X1[\"503: recusa tudo (fail-closed)\"]\n  B -- sim --> C{\"hmac confere?\"}\n  C -- não --> X2[\"401: não autorizado\"]\n  C -- sim --> D{\"valor pago >= devido?\"}\n  D -- não --> X3[\"200, mas NÃO confirma\"]\n  D -- sim --> E{\"pedido já confirmado?\"}\n  E -- sim --> X4[\"não faz nada (idempotente)\"]\n  E -- não --> F[\"Confirma: comissão, repasse, e-mails\"]"
          }
        ]
      },
      {
        "heading": "2. Os três caminhos até a confirmação",
        "paragraphs": [
          "O sistema descobre que o PIX foi pago de três formas, e todas terminam na mesma função segura:",
          "💡 Por quê dois caminhos reais (webhook e polling)? O webhook pode falhar (rede, indisponibilidade): se só existisse ele, o cliente pagaria e ficaria olhando \"aguardando\". O polling é o cinto de segurança: a tela pergunta ao provedor \"foi pago?\" e confirma na hora. Mas isso cria o risco de os dois confirmarem ao mesmo tempo, e por isso a função final precisa ser idempotente."
        ],
        "table": {
          "headers": [
            "Caminho",
            "Quem inicia",
            "Onde"
          ],
          "rows": [
            [
              "Webhook",
              "O provedor avisa o servidor",
              "efi_webhook, payments/views.py:198-242"
            ],
            [
              "Polling da tela",
              "O navegador pergunta enquanto o cliente espera",
              "confirm_pix_view, views.py:161-195"
            ],
            [
              "Simulação",
              "Só em desenvolvimento (DEBUG)",
              "simulate_pix_payment_view, views.py:137-158"
            ]
          ]
        }
      },
      {
        "heading": "3. O webhook, linha por linha, com o porquê (payments/views.py:198-242)",
        "paragraphs": [
          "3.1 Prova de origem",
          "⚠️ Limite conhecido: o segredo na *query string* pode aparecer em logs de proxy. Aceitável com HTTPS e URL controlada. O ideal seria um cabeçalho dedicado, se o provedor permitisse.",
          "3.2 Prova de valor (views.py:224-236)"
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "secret = getattr(settings, \"EFI_WEBHOOK_SECRET\", \"\")\nif not secret:\n    if not settings.DEBUG:\n        logger.error(\"EFI_WEBHOOK_SECRET ausente — webhook Pix recusado (fail-closed).\")\n        return Response({\"detail\": \"Webhook não configurado.\"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)\nelif not _hmac.compare_digest(request.query_params.get(\"hmac\", \"\"), secret):\n    logger.warning(\"Webhook Pix com hmac inválido (ip=%s).\", request.META.get(\"REMOTE_ADDR\"))\n    return Response({\"detail\": \"Não autorizado.\"}, status=status.HTTP_401_UNAUTHORIZED)"
          },
          {
            "title": "Código (python)",
            "code": "for pix in data.get(\"pix\", []) or []:\n    txid = pix.get(\"txid\")\n    ...\n    payment = Payment.objects.filter(efi_txid=txid, method=PaymentMethod.PIX).first()\n    if payment and payment.status != PaymentStatus.APPROVED:\n        paid = Decimal(str(pix.get(\"valor\", \"0\")))\n        if paid < payment.amount:\n            logger.error(\"Pix %s pago a menor (%s < %s) — não confirmado.\", txid, paid, payment.amount)\n            continue"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "@permission_classes([AllowAny])",
              "O provedor não tem login no seu sistema. A porta é pública por necessidade, então a defesa é outra: o segredo."
            ],
            [
              "O segredo vai na URL (?hmac=)",
              "É o que o provedor permite: você cadastra a URL completa lá. (A URL termina com ?hmac=...&ignorar= porque o provedor acrescenta /pix no fim, que cai dentro do parâmetro ignorar: payments/urls.py:21-23.)"
            ],
            [
              "compare_digest em vez de ==",
              "== para de comparar no primeiro caractere diferente: o tempo de resposta vaza quantos caracteres você acertou. Um atacante paciente descobre o segredo letra por letra. compare_digest leva o mesmo tempo sempre."
            ],
            [
              "if not secret → 503",
              "Fail-closed. Se alguém esquece de configurar o segredo, o sistema não aceita tudo: recusa tudo. Esquecer não pode virar abertura."
            ],
            [
              "if not settings.DEBUG",
              "Em desenvolvimento, permite testar sem segredo. Em produção, nunca."
            ],
            [
              "logger.warning(... ip ...)",
              "Tentativa inválida fica registrada com o IP: é evidência de ataque."
            ]
          ]
        }
      },
      {
        "heading": "4. Prova de unicidade: process_successful_payment (processing.py:15-98)",
        "paragraphs": [
          "💡 O que é idempotência? Uma operação é idempotente se fazê-la uma vez ou dez vezes dá o mesmo resultado. \"Ligar o interruptor para ligado\" é idempotente; \"inverter o interruptor\" não é. O webhook precisa ser idempotente, porque o provedor garante entrega pelo menos uma vez, e não exatamente uma. Sem isso, cada reenvio paga outra comissão e outro repasse."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "@transaction.atomic\ndef process_successful_payment(order, raw_response=None, charge_id=\"\") -> bool:\n    # Bloqueia a linha do pedido para evitar corrida entre webhook e confirmação manual\n    order = Order.objects.select_for_update().get(id=order.id)\n    if order.status == OrderStatus.CONFIRMED:\n        return False\n    ...  # Payment aprovado, Order e SubOrders confirmados, CommissionEntry, Payout, limpa o carrinho\n    return True"
          },
          {
            "title": "Código (python)",
            "code": "processed = process_successful_payment(payment.order, raw_response={...})\nif processed:\n    dispatch_post_payment_tasks(payment.order)     # e-mails, webhook para ERP, repasses"
          }
        ],
        "table": {
          "headers": [
            "Linha",
            "Por quê"
          ],
          "rows": [
            [
              "@transaction.atomic",
              "Confirmar são vários passos (pagamento, pedido, sub-pedidos, comissão, repasses). Ou todos, ou nenhum."
            ],
            [
              "select_for_update().get(...)",
              "Trava o pedido. Se o webhook e o polling chegam juntos, um espera o outro. É a mesma ideia da Aula 4, agora no pedido."
            ],
            [
              "if order.status == CONFIRMED: return False",
              "Idempotência: confirmar de novo não faz nada. O segundo a chegar vê que já foi confirmado."
            ],
            [
              "return True/False",
              "O retorno é a informação. Quem chama só envia e-mails e repasses se foi True."
            ]
          ]
        }
      },
      {
        "heading": "5. ⚠️ A lacuna: a trava protege contra o duplicado, não contra o cancelado",
        "paragraphs": [
          "A defesa acima só conhece o estado CONFIRMED. Como vimos na Aula 5 (caso verificado), um pedido CANCELLED que recebia pagamento era confirmado de novo. *(O PR 29 do MySuperStore corrige isso; o texto abaixo descreve o desenho antes dele e por que a correção usa a lista de permitidos.)*",
          "💡 Por quê é uma lacuna de desenho? A guarda if status == CONFIRMED responde a uma pergunta (\"já foi?\"). A pergunta certa é \"este pedido ainda pode ser confirmado?\", ou seja, status == PENDING. Lista de estados permitidos (== PENDING) é mais segura que lista de estados proibidos (!= CONFIRMED): quando surge um estado novo, a lista proibida o deixa passar por esquecimento."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "stateDiagram-v2\n  [*] --> pending\n  pending --> confirmed: pagamento (OK)\n  pending --> cancelled: expirou\n  cancelled --> confirmed: pagamento tardio (BUG: não deveria)\n  confirmed --> confirmed: aviso repetido (idempotente, OK)"
          }
        ]
      },
      {
        "heading": "8. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Cenários do webhook (25 min)",
          "Preveja o status HTTP e o que muda no banco em cada cenário (segredo s3, pedido de R$ 100,00 pendente):",
          "E2 — No código (50 min): laboratorio/starter/lab06_webhook.py",
          "Implemente validar_webhook e confirmar_pagamento. Critério de aceite: python testes.py lab06 verde (7 testes, um deles com 20 threads).",
          "E3 — O experimento do 1 ms (15 min)",
          "Faça o experimento A e depois devolva a trava. Explique, em duas frases, por que a versão sem trava passa nos testes quando a pausa é zero.",
          "E4 — Feche a lacuna do cancelado ★★★ (40 min)",
          "Estenda o seu confirmar_pagamento: se o pedido estiver cancelled, não confirme, devolva False e incremente um contador pagamentos_orfaos (o dinheiro entrou, mas o pedido morreu). Escreva o teste que falha antes e passa depois.",
          "Note a lista de permitidos: só pending confirma. O teste falha no gabarito original (que confirma cancelled) e passa na versão nova. Em produção, pagamentos_orfaos vira um estorno automático ou uma fila de revisão manual.",
          "E5 — Responder sempre 200? (15 min)",
          "O webhook devolve 200 para valor insuficiente e para txid desconhecido. Por quê não devolver erro? E qual é o risco de responder 200 a tudo?",
          "Erro (4xx/5xx) faz o provedor reenviar o aviso por horas ou dias: ruído e carga, sem benefício (o aviso nunca ficará válido). 200 diz \"recebi, pode parar\". O risco é engolir um problema real (um pagamento a menor que precisa de ação humana): por isso o código registra (logger.error) e o ideal é alertar (Sentry/painel) e contar esses casos."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "@dataclass\nclass Pedido:\n    status: str = \"pending\"\n    comissoes: int = 0\n    repasses: int = 0\n    pagamentos_orfaos: int = 0\n    _trava: threading.Lock = field(default_factory=threading.Lock, repr=False)\n\ndef confirmar_pagamento(pedido):\n    with pedido._trava:\n        if pedido.status == \"cancelled\":\n            pedido.pagamentos_orfaos += 1      # dinheiro entrou para um pedido morto: estornar ou revisar\n            return False\n        if pedido.status != \"pending\":         # lista de PERMITIDOS: só pending confirma\n            return False\n        pedido.status = \"confirmed\"; pedido.comissoes += 1; pedido.repasses += 1\n        return True\n\ndef test_pagamento_de_pedido_cancelado_nao_confirma(self):\n    p = self.m.Pedido(status=\"cancelled\")\n    self.assertFalse(self.m.confirmar_pagamento(p))\n    self.assertEqual((p.status, p.comissoes, p.pagamentos_orfaos), (\"cancelled\", 0, 1))"
          }
        ],
        "table": {
          "headers": [
            "#",
            "O que chega",
            "Status HTTP",
            "Muda algo no banco?"
          ],
          "rows": [
            [
              "a",
              "Sem hmac na URL",
              "",
              ""
            ],
            [
              "b",
              "hmac=errado",
              "",
              ""
            ],
            [
              "c",
              "hmac=s3, valor R$ 99,99",
              "",
              ""
            ],
            [
              "d",
              "hmac=s3, valor R$ 100,00",
              "",
              ""
            ],
            [
              "e",
              "O mesmo aviso (d) uma segunda vez",
              "",
              ""
            ],
            [
              "f",
              "Servidor sem segredo em produção, valor R$ 100,00",
              "",
              ""
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: tire a trava. No lab06_webhook.py, na função confirmar_pagamento, remova a trava e simule a latência de um banco real:",
      "whatHappens": "Rode python testes.py lab06 e olhe test_vinte_webhooks_simultaneos_confirmam_uma_unica_vez.",
      "lessonLearned": "Com 20 avisos simultâneos: sem pausa, apenas 1 confirmação (a CPU é tão rápida que o bug se esconde); com 1 ms de pausa, 20 confirmações, 20 comissões e 20 repasses de um único pagamento. Lição: o bug de concorrência não aparece quando tudo é rápido, e a produção tem latência. Um teste sem latência dá falsa segurança."
    },
    "pitfalls": [
      {
        "wrong": "Webhook sem segredo \"porque a URL é difícil de adivinhar\"",
        "right": "Segredo comparado com compare_digest",
        "why": "Obscuridade não é segurança"
      },
      {
        "wrong": "if not secret: aceita",
        "right": "if not secret: recusa (fail-closed)",
        "why": "Esquecer uma configuração não pode abrir a porta"
      },
      {
        "wrong": "Confirmar qualquer valor",
        "right": "Exigir pago >= devido",
        "why": "Pagamento a menor liberaria o pedido"
      },
      {
        "wrong": "Responder erro a aviso repetido",
        "right": "Responder 200 e não fazer nada",
        "why": "Erro faz o provedor reenviar para sempre"
      },
      {
        "wrong": "Checar só != CONFIRMED",
        "right": "Exigir == PENDING",
        "why": "Lista de permitidos > lista de proibidos"
      },
      {
        "wrong": "Testar concorrência sem latência",
        "right": "Simular latência (ex.: 1 ms)",
        "why": "O bug se esconde quando tudo é rápido"
      },
      {
        "wrong": "Mandar e-mails mesmo quando processed é falso",
        "right": "Só quando for True",
        "why": "Evita e-mail duplicado a cada reenvio"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a06-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Para confirmar uma única vez, process_successful_payment usa Order.objects."
          },
          {
            "kind": "blank",
            "id": "mk-a06-q3-b1",
            "accepted": [
              "select_for_update",
              "select_for_update()"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": "().get(id=order.id) para travar a linha do pedido."
          }
        ],
        "explanation": "A trava faz o webhook e o polling esperarem um ao outro; o segundo vê CONFIRMED e retorna False."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a06-q1",
        "question": "Por que o webhook compara o segredo com hmac.compare_digest em vez de usar ==?",
        "options": [
          {
            "text": "Porque == não funciona com textos.",
            "whyNot": "== funciona com textos; o problema é o tempo, não a função."
          },
          {
            "text": "Porque == para no primeiro caractere diferente, e o tempo de resposta revela quantos caracteres o atacante acertou."
          },
          {
            "text": "Porque compare_digest é mais rápido.",
            "whyNot": "compare_digest é de propósito mais lento (tempo constante). Ele não é mais rápido."
          },
          {
            "text": "Porque == diferencia maiúsculas de minúsculas.",
            "whyNot": "Ambos diferenciam maiúsculas; isso não tem relação com a escolha."
          }
        ],
        "correctIndex": 1,
        "explanation": "Com ==, um segredo com mais caracteres corretos no início demora um pouco mais para ser recusado. Um atacante mede isso e descobre o segredo caractere por caractere. compare_digest leva o mesmo tempo sempre."
      },
      {
        "id": "mk-a06-q2",
        "question": "Se o segredo do webhook não estiver configurado em produção, o MySuperStore aceita os avisos para não interromper as vendas.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "O código recusa tudo com 503 (fail-closed). Aceitar sem segredo permitiria a qualquer pessoa marcar pedidos como pagos sem pagar."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "O código recusa tudo com 503 (fail-closed). Aceitar sem segredo permitiria a qualquer pessoa marcar pedidos como pagos sem pagar."
      },
      {
        "id": "mk-a06-q5",
        "question": "O provedor envia o mesmo aviso 20 vezes ao mesmo tempo. A função confirma assim: \"if status == confirmed: return; (1 ms depois) status = confirmed; gerar comissão\". O que acontece?",
        "options": [
          {
            "text": "Uma comissão: o if protege.",
            "whyNot": "O if só protege se a leitura e a gravação forem atômicas, e a trava garante isso."
          },
          {
            "text": "Várias comissões: todos passam no if antes de alguém gravar; falta a trava."
          },
          {
            "text": "Nenhuma comissão: o banco recusa.",
            "whyNot": "O banco não conhece a regra de negócio; ele executa o que a aplicação mandar."
          },
          {
            "text": "Uma comissão, porque o Python executa uma thread por vez.",
            "whyNot": "O Python alterna as threads durante a espera (a pausa de 1 ms é justamente a janela); medi 20 de 20."
          }
        ],
        "correctIndex": 1,
        "explanation": "O if sozinho tem o mesmo problema da Aula 4: ler e depois gravar tem um intervalo. Com 1 ms de latência, os 20 avisos passam e geram 20 comissões e 20 repasses. A trava no pedido faz um esperar o outro."
      }
    ],
    "flashcards": [
      {
        "front": "Três provas do webhook",
        "back": "Origem (segredo), valor (pago ≥ devido), unicidade (idempotência)"
      },
      {
        "front": "Por que compare_digest?",
        "back": "Tempo constante: não vaza quantos caracteres o atacante acertou"
      },
      {
        "front": "O que é fail-closed?",
        "back": "Sem configuração de segurança, recusar tudo"
      },
      {
        "front": "O que é idempotência?",
        "back": "Fazer uma vez ou dez vezes dá o mesmo resultado"
      },
      {
        "front": "Para que serve o retorno True/False?",
        "back": "Só enviar e-mails e repasses quando confirmou agora"
      },
      {
        "front": "Por que dois caminhos (webhook e polling)?",
        "back": "O webhook pode falhar; o polling é o cinto de segurança"
      },
      {
        "front": "Lista de permitidos x proibidos",
        "back": "== PENDING é mais segura que != CONFIRMED"
      }
    ],
    "threeThings": [
      "A porta é pública, então autentique, confira o valor e só então confirme.",
      "Idempotência exige trava: \"se já foi, retorne\" não basta com avisos simultâneos.",
      "Use lista de estados permitidos: só o que está pending pode virar confirmed."
    ]
  },
  "modulo-3-repasse-e-estorno": {
    "slug": "modulo-3-repasse-e-estorno",
    "code": "A07",
    "title": "Repasse e estorno: pagar o lojista uma vez e devolver ao cliente sem devolver demais",
    "oneSentence": "movimentar dinheiro para fora é mais perigoso que receber. Toda saída precisa de um identificador que não muda quando a operação é repetida, para que um timeout nunca vire um pagamento em dobro.",
    "guideQuestion": "como pagar cada lojista exatamente uma vez e devolver dinheiro ao cliente sem nunca devolver mais do que ele pagou?",
    "metaNote": "120 min · Estudo de caso MySuperStore",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A07 · Áudio de bastidores",
      "audio": {
        "title": "Bastidores do código de um marketplace",
        "src": "/cursos/midia/bastidores-codigo-marketplace.m4a",
        "summary": "Episódio em áudio cobrindo as regras de dinheiro, repasse ao lojista e estorno seguro.",
        "durationLabel": "Áudio 16m05s"
      }
    },
    "predict": [
      {
        "question": "Um lojista não tem conta no provedor de pagamento. Quando e como ele recebe a parte dele?",
        "answer": "Depois do pagamento, por um PIX de saída da conta da plataforma para a chave PIX dele. Até lá, o repasse fica pendente (é uma dívida real)."
      },
      {
        "question": "O sistema pede o repasse ao provedor, mas a resposta se perde (timeout). O repasse volta a ser tentado depois. O lojista recebe duas vezes?",
        "answer": "Não, se o pedido de repasse usar um identificador único e fixo (idEnvio = id do repasse). O provedor reconhece o mesmo id e não paga de novo."
      },
      {
        "question": "O cliente pagou R$ 100. Estornamos R$ 30 e, depois, pedimos para estornar R$ 80. Deve funcionar? E se pedirmos R$ 70?",
        "answer": "R$ 80 não (o saldo estornável é R$ 70); R$ 70 sim, e o pagamento passa a \"estornado\"."
      },
      {
        "question": "O provedor devolve os R$ 30 ao cliente, mas a nossa chamada dá timeout. Tentamos de novo. O cliente recebe R$ 30 ou R$ 60?",
        "answer": "R$ 30, desde que o id da devolução seja o mesmo na nova tentativa. Se o id mudar a cada tentativa, o cliente recebe R$ 60 e a empresa perde R$ 30."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o troco e a conta conjunta",
        "paragraphs": [
          "Pense em uma conta conjunta: o cliente depositou R$ 100. A plataforma precisa repartir (parte do lojista, parte dela) e, se o cliente desistir, devolver. Cada saída precisa de um número de protocolo: mandar duas vezes o mesmo protocolo é uma repetição; mandar protocolos diferentes é duas operações."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart LR\n  P[\"Pagamento aprovado<br/>R$ 100\"] --> S{\"Lojista tem conta<br/>no provedor?\"}\n  S -- sim --> A[\"Split nativo:<br/>o provedor já pagou ao lojista<br/>Payout = COMPLETED\"]\n  S -- \"é a loja da casa\" --> H[\"Dinheiro já está na conta master<br/>Payout = COMPLETED\"]\n  S -- não --> N[\"Payout = PENDING\"]\n  N --> J[\"Tarefa a cada 30 min:<br/>PIX de saída para a chave do lojista\"]\n  J --> C[\"Payout = COMPLETED\"]"
          }
        ]
      },
      {
        "heading": "2. O repasse, linha por linha, com o porquê",
        "paragraphs": [
          "2.1 Como o repasse nasce (processing.py:57-88)",
          "O comentário do código conta o bug que motivou a regra: antes, cartão sem conta do lojista era marcado como COMPLETED por engano, e o lojista nunca recebia.",
          "💡 Por quê um status PENDING explícito em vez de \"pagar na hora\"? O PIX de saída pode falhar (chave errada, permissão do provedor, indisponibilidade). Registrar a obrigação antes e tentar pagar depois garante que a dívida nunca some: ela fica PENDING até alguém ou o job liquidar.",
          "2.2 Como o repasse é pago (processing.py:101-163)",
          "O send_to_seller ainda limpa o id (services.py:262-264): clean_id = \"\".join(c for c in id_envio if c.isalnum())[:35]: o provedor aceita só letras e números, até 35 caracteres. Um UUID tem hífens, por isso é limpo.",
          "💡 Por quê o id vem do Payout e não é gerado na hora? Um id gerado na hora é diferente a cada tentativa: o provedor trataria cada uma como uma operação nova. O id do registro é estável: pertence ao repasse, e não à tentativa. Regra de ouro: o identificador de uma operação financeira nasce junto com a intenção, não junto com a tentativa.",
          "2.3 ⚠️ Um ponto de atenção real: o repasse que fica em PROCESSING",
          "settle_pending_payouts (processing.py:166-182) só busca status=PENDING. Se o processo morrer (falta de memória, reinício) depois de marcar PROCESSING e antes de voltar a PENDING, o repasse fica preso em PROCESSING para sempre, e nenhuma tarefa o retoma. *(Conclusão a partir do código lido; um teste confirmaria.)* O desafio E5 pede o desenho da correção."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "settled_via_split = bool(seller and seller.efi_authorized)\nsettled_in_master = bool(seller and seller.receives_in_master)\npayout_status = PayoutStatus.COMPLETED if (settled_via_split or settled_in_master) else PayoutStatus.PENDING\nPayout.objects.create(sub_order=sub_order, seller=seller, amount=sub_order.seller_amount, status=payout_status, ...)"
          },
          {
            "title": "Código (python)",
            "code": "def settle_payout(payout):\n    if payout.status == PayoutStatus.COMPLETED: return False\n    seller = payout.seller\n    if seller and seller.receives_in_master: return False         # nunca PIX da master para ela mesma\n    if not seller or not seller.pix_key: ...; return False        # sem chave, não dá\n    if not EfiPixService.is_configured(): ...; return False\n    payout.status = PayoutStatus.PROCESSING; payout.save(update_fields=[\"status\"])\n    try:\n        resp = EfiPixService.send_to_seller(pix_key=seller.pix_key, amount=payout.amount,\n                                            id_envio=str(payout.id), info=f\"Repasse {order_number}\")\n    except Exception as exc:\n        payout.status = PayoutStatus.PENDING; payout.save(update_fields=[\"status\"]); return False\n    ...  # sucesso: COMPLETED; senão volta a PENDING para nova tentativa"
          }
        ],
        "table": {
          "headers": [
            "Situação",
            "Status ao nascer",
            "Por quê"
          ],
          "rows": [
            [
              "Lojista com conta no provedor (efi_authorized)",
              "COMPLETED",
              "O split nativo já creditou a parte dele no momento do pagamento. Não há nada a fazer."
            ],
            [
              "Loja da casa (receives_in_master)",
              "COMPLETED",
              "O dinheiro já está na conta master, que é a conta dela. Mandar PIX para si mesma seria um erro."
            ],
            [
              "Lojista sem conta",
              "PENDING",
              "Dívida real: o dinheiro caiu na conta master e precisa ser repassado."
            ]
          ]
        }
      },
      {
        "heading": "3. O estorno, regra por regra (payments/refunds.py)",
        "paragraphs": [
          "O cabeçalho do arquivo lista as regras. Cada uma corrige um risco real:",
          "3.1 O id determinístico (refunds.py:74)",
          "Veja os dois cenários, que são o centro da aula:",
          "💡 A ideia genial é que o id depende do estado que nós controlamos. Enquanto a nossa base diz \"devolvido R$ 0\", qualquer tentativa gera o mesmo id; assim que gravamos o sucesso, o estado muda e o próximo id é outro. Estado e id andam juntos.",
          "3.2 Os dois erros opostos (medidos no laboratório)"
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "devolution_id = f\"d{payment.pk.hex[:20]}{int(already * 100)}\""
          }
        ],
        "table": {
          "headers": [
            "#",
            "Regra",
            "Por quê"
          ],
          "rows": [
            [
              "1",
              "O Payment fica travado (select_for_update) durante o estorno",
              "Dois estornos simultâneos não devolvem o mesmo dinheiro duas vezes"
            ],
            [
              "2",
              "Teto: nunca mais que pago − já estornado",
              "Impossível devolver mais do que entrou"
            ],
            [
              "3",
              "O saldo estornado é acumulado (already + value)",
              "Antes era sobrescrito: dois estornos de R$ 30 virariam \"R$ 30 estornados\""
            ],
            [
              "4",
              "Só muda o estado depois que o provedor confirma",
              "Nunca existe \"estornado\" sem o dinheiro ter voltado"
            ],
            [
              "5",
              "Cartão: só integral",
              "O provedor cancela a cobrança inteira"
            ],
            [
              "6",
              "PIX: id de devolução derivado do saldo já estornado",
              "Repetir o mesmo estorno é seguro; estornos parciais diferentes não colidem"
            ]
          ]
        }
      },
      {
        "heading": "4. O estorno de um item (orders/views.py:190-224)",
        "paragraphs": [
          "Quando o lojista aprova uma devolução, o sistema reaproveita o mesmo refund_payment para estornar só o valor do item, e devolve a quantidade ao estoque do lojista, tudo na mesma transação:",
          "💡 Por quê reaproveitar? Uma só lógica de estorno no sistema inteiro. Se houvesse uma cópia para devolução e outra para cancelamento, uma delas esqueceria o teto, ou a trava, ou o id determinístico. Regra: a regra de dinheiro mora em um lugar só."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "with transaction.atomic():\n    if payment:\n        try:\n            refund_payment(payment.pk, order_item.total)     # mesmas regras do estorno do pagamento\n        except RefundError as exc:\n            raise ValidationError({\"detail\": exc.message})\n    if order_item.variant_id:\n        variant = ProductVariant.objects.select_for_update().get(id=order_item.variant_id)\n        variant.stock += order_item.quantity\n        variant.save(update_fields=[\"stock\"])\n    sub_order.status = \"refunded\""
          }
        ]
      },
      {
        "heading": "7. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Tabela de tempo (20 min)",
          "Pagamento de R$ 100. Preencha o id da devolução e o que o provedor faz em cada passo:",
          "E2 — No código (50 min): laboratorio/starter/lab07_estorno.py",
          "Implemente id_devolucao e estornar. Critério de aceite: python testes.py lab07 verde (6 testes).",
          "E3 — As duas mutações (20 min)",
          "Faça as mutações A e B da seção 5. Anote que teste falha, o que o provedor recebeu e o que o seu sistema acha.",
          "E4 — Repasse com timeout (25 min)",
          "Escreva (no papel) a sequência de um settle_payout em que o provedor paga mas a resposta se perde. Mostre como o id_envio evita o pagamento duplo na próxima rodada do job.",
          "E5 — Desafio ★★★: o repasse preso em PROCESSING",
          "Projete a correção. Responda: (1) que campo você acrescentaria ao Payout? (2) como o job reconheceria um repasse \"velho demais\" em PROCESSING? (3) é seguro simplesmente voltar para PENDING? Por quê? (4) como testar?",
          "(1) processing_started_at (data/hora em que entrou em PROCESSING). (2) O job também busca PROCESSING com processing_started_at mais antigo que um limite (por exemplo, 15 min). (3) É seguro justamente por causa do id_envio: reenviar manda o mesmo id, e se o provedor já pagou ele responde \"já fiz\" (e podemos marcar COMPLETED com o e2eId devolvido). Sem o id estável, voltar a PENDING poderia pagar duas vezes. (4) Teste: criar um Payout em PROCESSING com processing_started_at antigo, rodar o job com um provedor falso e afirmar que termina em COMPLETED, sem segundo pagamento."
        ],
        "table": {
          "headers": [
            "#",
            "Ação",
            "Já devolvido (nosso)",
            "Id",
            "Provedor"
          ],
          "rows": [
            [
              "1",
              "Estornar R$ 30 (sucesso)",
              "",
              "",
              ""
            ],
            [
              "2",
              "Estornar R$ 30 (provedor processa, resposta se perde)",
              "",
              "",
              ""
            ],
            [
              "3",
              "Repetir o passo 2",
              "",
              "",
              ""
            ],
            [
              "4",
              "Estornar R$ 80",
              "",
              "",
              ""
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Depois de implementar lab07_estorno.py, faça duas mutações em id_devolucao e rode python testes.py lab07:",
      "whatHappens": "A: id constante. return \"d\" + pagamento.codigo[:20]",
      "lessonLearned": "B: id aleatório. return \"d\" + uuid.uuid4().hex[:20]"
    },
    "pitfalls": [
      {
        "wrong": "Gerar o id da operação na hora de enviar",
        "right": "Gerar o id com a intenção (junto do registro)",
        "why": "O id deve ser estável entre tentativas"
      },
      {
        "wrong": "Marcar \"estornado\" e depois chamar o provedor",
        "right": "Chamar o provedor e só então marcar",
        "why": "Nunca mentir sobre o estado do dinheiro"
      },
      {
        "wrong": "Sobrescrever refunded_amount",
        "right": "Acumular",
        "why": "Parciais somam"
      },
      {
        "wrong": "Sem teto",
        "right": "Recusar valor > saldo",
        "why": "Impossível devolver o que não entrou"
      },
      {
        "wrong": "Tratar a resposta do SDK como sucesso se não lançou exceção",
        "right": "Verificar o conteúdo (e2eId, id, status)",
        "why": "O SDK devolve o erro em vez de lançar"
      },
      {
        "wrong": "Duas lógicas de estorno",
        "right": "Uma função para tudo",
        "why": "Regras de dinheiro não se duplicam"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a07-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "O valor máximo que pode ser estornado de um pagamento é: valor pago menos o valor "
          },
          {
            "kind": "blank",
            "id": "mk-a07-q3-b1",
            "accepted": [
              "ja estornado",
              "já estornado",
              "estornado",
              "refunded_amount"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": "."
          }
        ],
        "explanation": "O teto é o saldo estornável (pago − já estornado). Como o estornado é acumulado, parciais sucessivos nunca passam do total."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a07-q1",
        "question": "O repasse a um lojista é enviado ao provedor, mas a resposta se perde. O job tenta de novo meia hora depois. O que impede o pagamento em dobro?",
        "options": [
          {
            "text": "O job espera o provedor confirmar por e-mail.",
            "whyNot": "Não há e-mail de confirmação no fluxo; a idempotência é pelo id."
          },
          {
            "text": "O id_envio é o id do repasse: o provedor reconhece o mesmo id e não paga novamente."
          },
          {
            "text": "O banco de dados impede dois pagamentos ao mesmo lojista.",
            "whyNot": "O banco impede dois Payout por sub-pedido (OneToOne), mas não impede dois envios do mesmo Payout ao provedor."
          },
          {
            "text": "Nada: o risco existe e é aceito.",
            "whyNot": "O risco foi tratado por desenho, com o id estável."
          }
        ],
        "correctIndex": 1,
        "explanation": "O id da operação no provedor é o id do Payout, estável entre tentativas. Repetir manda o mesmo id e o provedor responde que já executou."
      },
      {
        "id": "mk-a07-q2",
        "question": "A plataforma deve enviar um PIX de repasse também para a 'loja da casa' (que recebe na conta master), para manter a contabilidade igual à dos outros lojistas.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "O dinheiro já está na conta master, que é a conta dessa loja. Enviar PIX da master para ela mesma é um erro e custo. O código recusa (receives_in_master) e já cria o repasse como COMPLETED."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "O dinheiro já está na conta master, que é a conta dessa loja. Enviar PIX da master para ela mesma é um erro e custo. O código recusa (receives_in_master) e já cria o repasse como COMPLETED."
      },
      {
        "id": "mk-a07-q4",
        "question": "Se o id de devolução fosse aleatório a cada tentativa, o que aconteceria com um estorno de R$ 30 que deu timeout depois de o provedor processar?",
        "options": [
          {
            "text": "Nada: o provedor ignora duplicatas.",
            "whyNot": "O provedor só ignora duplicatas com o mesmo id; ids diferentes são operações diferentes."
          },
          {
            "text": "O provedor veria a nova tentativa como outra devolução e devolveria R$ 60 ao cliente, enquanto o sistema registraria R$ 30."
          },
          {
            "text": "O provedor recusaria a nova tentativa.",
            "whyNot": "Ele não tem como saber que é uma repetição se o id mudou."
          },
          {
            "text": "O sistema registraria R$ 60 e o provedor devolveria R$ 30.",
            "whyNot": "Isso é o oposto: acontece com um id constante (o provedor ignora o 2º pedido), não com um id aleatório."
          }
        ],
        "correctIndex": 1,
        "explanation": "Sem id estável, cada tentativa é uma operação nova. O provedor devolve de novo, e o nosso estado só registra a segunda confirmação: a empresa perde R$ 30 sem erro algum."
      }
    ],
    "flashcards": [
      {
        "front": "Três tipos de repasse",
        "back": "Split (já pago), loja da casa (já está na master), PIX de saída (pendente)"
      },
      {
        "front": "O que é idEnvio?",
        "back": "O id do repasse, estável entre tentativas: evita pagar em dobro"
      },
      {
        "front": "Quando o id da operação deve nascer?",
        "back": "Junto com a intenção, não com a tentativa"
      },
      {
        "front": "Regra do estorno: o teto",
        "back": "Pago − já estornado"
      },
      {
        "front": "Regra do estorno: ordem",
        "back": "Só muda o estado depois que o provedor confirma"
      },
      {
        "front": "Como é o id da devolução PIX?",
        "back": "Código do pagamento + centavos já devolvidos"
      },
      {
        "front": "Por que reaproveitar refund_payment?",
        "back": "Regra de dinheiro em um lugar só"
      }
    ],
    "threeThings": [
      "O id de uma operação financeira é da intenção, não da tentativa.",
      "Só mude o estado depois que o provedor confirmar, e verifique o conteúdo da resposta.",
      "Teste contra o estado do provedor, não só contra o seu: os maiores erros de dinheiro são silenciosos."
    ]
  },
  "modulo-4-ciclo-de-vida-e-worker": {
    "slug": "modulo-4-ciclo-de-vida-e-worker",
    "code": "A08",
    "title": "O ciclo de vida do pedido: expiração, estoque preso e a decisão de ter (ou não) um worker",
    "oneSentence": "toda reserva precisa de um prazo de validade. Se você bloqueia um recurso (estoque) para alguém e essa pessoa some, alguém tem que soltar o recurso, e esse alguém é uma tarefa agendada.",
    "guideQuestion": "o cliente desistiu no meio do pagamento. O que acontece com a peça reservada, e quem faz isso quando ninguém está olhando?",
    "metaNote": "110 min · Estudo de caso MySuperStore",
    "diagramId": "a08-estados-pedido",
    "predict": [
      {
        "question": "Na Aula 4 vimos que o estoque é baixado ao criar o pedido. Uma cliente cria o pedido e fecha a aba sem escolher como pagar. O que acontece com a peça?",
        "answer": "Antes do PR 27: nada. A peça ficava presa para sempre (a expiração só cancelava pedidos com PIX pendente). Hoje: depois de 60 minutos, o pedido é cancelado e a peça volta."
      },
      {
        "question": "Um pedido com cartão recusado (o cliente desistiu de tentar de novo) fica quanto tempo travando a peça?",
        "answer": "Antes do PR 27: para sempre. Hoje: 60 minutos e volta."
      },
      {
        "question": "Um pedido com cartão aguardando confirmação passa de 60 minutos. A tarefa deve cancelá-lo?",
        "answer": "Não. O provedor ainda pode confirmar a cobrança; cancelar agora e a confirmação chegar depois criaria um pedido pago e cancelado ao mesmo tempo."
      },
      {
        "question": "A tarefa de lembrete roda a cada 5 minutos e avisa quem está com o pedido parado há 10 a 15 minutos. Por que uma janela e não um \"já avisei\" no banco?",
        "answer": "A janela evita um campo a mais e uma escrita extra: se a tarefa roda de 5 em 5 minutos, um pedido cai na janela de 10–15 uma vez só (ou duas, se um ciclo falhar), e isso é aceitável para um lembrete. Troca-se exatidão por simplicidade."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: a mesa reservada no restaurante",
        "paragraphs": [
          "Você reserva uma mesa e não aparece. O restaurante espera 15 minutos e libera. Sem essa regra, a mesa fica \"reservada\" a noite toda e o restaurante perde dinheiro. O estoque do marketplace é a mesma coisa:",
          "💡 Por quê o estoque é baixado no início e não no pagamento? Para uma peça única, a alternativa (baixar só depois de pago) permite vender duas vezes (Aula 4). A reserva antecipada é a escolha certa para o negócio, mas cobra um preço: precisa de prazo de validade. Toda reserva tem esse custo."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "stateDiagram-v2\n  [*] --> pending: pedido criado (estoque baixado)\n  pending --> confirmed: pagamento aprovado\n  pending --> cancelled: 60 min sem como pagar (estoque volta)\n  confirmed --> [*]\n  cancelled --> [*]"
          }
        ]
      },
      {
        "heading": "2. As regras de cancelamento, com o porquê (orders/tasks.py, após o PR 27)",
        "paragraphs": [
          "A função _is_abandoned(payment) decide se um pedido pendente há 60 minutos ou mais não tem mais como ser pago:",
          "O laço, com as três proteções (orders/tasks.py)",
          "💡 O princípio em todas as linhas: \"reconfirme depois de travar\". Tudo que você leu antes da trava pode ter mudado. Leia, trave, releia, decida. (É a mesma lição da Aula 4: o objeto na memória está velho.)"
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "def _is_abandoned(payment) -> bool:\n    if payment is None:\n        return True                                   # o cliente desistiu antes de escolher o método\n    if payment.method == PaymentMethod.PIX:\n        return payment.status == PaymentStatus.PENDING   # o QR venceu\n    return payment.status in (PaymentStatus.REJECTED, PaymentStatus.CANCELLED)   # cartão sem cobrança em andamento"
          },
          {
            "title": "Código (python)",
            "code": "for order in orders_to_cancel:\n    with transaction.atomic():\n        order = Order.objects.select_for_update().get(id=order.id)\n        if order.status != OrderStatus.PENDING:\n            continue\n        payment = Payment.objects.select_for_update().filter(order=order).first()   # relê DENTRO da trava\n        if not _is_abandoned(payment):\n            continue\n        ...  # cancela pedido e sub-pedidos, cancela o pagamento pendente, devolve o estoque"
          }
        ],
        "table": {
          "headers": [
            "Situação (≥ 60 min)",
            "Cancela?",
            "Por quê"
          ],
          "rows": [
            [
              "Sem pagamento iniciado",
              "Sim",
              "O cliente nunca chegou a pagar"
            ],
            [
              "PIX pendente",
              "Sim",
              "O QR (1 h) venceu"
            ],
            [
              "Cartão recusado ou cancelado",
              "Sim",
              "Não há cobrança em andamento"
            ],
            [
              "Cartão pendente / em processamento",
              "Não",
              "O provedor ainda pode confirmar"
            ],
            [
              "Pedido confirmado",
              "Não",
              "Já foi pago"
            ],
            [
              "Pedido com menos de 60 min",
              "Não",
              "Ainda há tempo"
            ]
          ]
        }
      },
      {
        "heading": "3. O caso real: o PR 27, passo a passo",
        "paragraphs": [
          "O bug: a expiração só cancelava payment.method == \"pix\" and payment.status == PENDING. Quem não tinha Payment (abandonou antes de escolher) ou tinha cartão recusado ficava pending para sempre, com a peça baixada.",
          "O método que usamos:",
          "1. Escrever o teste do problema. ExpiracaoPedidosTest (7 testes), cobrindo os casos da tabela acima. 2. Rodar no código antigo. Resultado: 3 testes falham (sem pagamento, cartão recusado, rodar duas vezes) e os outros 4 passam (são os casos que já funcionavam: PIX pendente, cartão pendente, pedido recente, pedido pago). 3. Corrigir. 4. Rodar de novo. Todos passam. Suíte completa: 107 testes passando.",
          "💡 Por quê \"falha antes\" importa tanto? Um teste que nunca falhou pode estar testando nada. Ver o teste falhar no código antigo prova que ele detecta o bug, e que a correção é o que o faz passar. Os 4 testes que passam nos dois casos não são inúteis: são proteção contra regressão (garantem que a correção não quebrou os casos que já funcionavam, como o cartão pendente)."
        ],
        "codeBlocks": [
          {
            "title": "Trecho do estudo de caso",
            "code": "código antigo:  FAILED  test_pedido_sem_pagamento_iniciado_devolve_estoque\n                FAILED  test_cartao_recusado_devolve_estoque_e_mantem_status_do_pagamento\n                FAILED  test_rodar_duas_vezes_nao_devolve_estoque_em_dobro\ncódigo novo:    7 passed"
          }
        ]
      },
      {
        "heading": "4. Quem executa isso? Celery, beat e a decisão do worker",
        "paragraphs": [
          "A tarefa precisa rodar sozinha, de tempos em tempos. No MySuperStore (config/celery.py):",
          "O que o worker faz de verdade (verificado no código)",
          "E existe um endpoint de cron pronto (orders/views.py:226-242), restrito a admin, que o próprio código descreve como *\"substituindo o Celery worker em ambientes serverless\"*:",
          "💡 Por quê isso importa? Em uma VM de 1 GB, o worker tem teto de 320 MB (compose.micro.yml). As duas tarefas agendadas só precisam de um relógio externo que chame um endereço protegido (um agendador gratuito, por exemplo). Trocar o worker por um cron reduz memória, mas acrescenta uma dependência (o agendador externo) e exige autenticação para o endereço. É uma decisão com custo dos dois lados."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "app.conf.beat_schedule = {\n    \"check-pending-pix-orders-every-5-minutes\": {\"task\": \"apps.orders.tasks.check_pending_pix_orders_task\", \"schedule\": crontab(minute=\"*/5\")},\n    \"settle-pending-payouts-every-30-minutes\":  {\"task\": \"apps.payments.tasks.settle_pending_payouts_task\", \"schedule\": crontab(minute=\"*/30\")},\n}"
          },
          {
            "title": "Código (python)",
            "code": "class ExpirePendingPixCronView(viewsets.GenericViewSet):\n    permission_classes = [IsPlatformAdmin]\n    @action(detail=False, methods=[\"get\"])\n    def run(self, request):\n        result = expire_pending_pix_orders()\n        return Response({\"status\": \"success\", \"result\": result})"
          }
        ],
        "table": {
          "headers": [
            "Peça",
            "O que é",
            "Por quê existe"
          ],
          "rows": [
            [
              "Worker (Celery)",
              "Um processo que executa tarefas",
              "Para o servidor web não travar fazendo trabalho demorado"
            ],
            [
              "Beat",
              "O relógio: enfileira as tarefas nos horários",
              "Alguém precisa \"acordar\" a tarefa de 5 em 5 minutos"
            ],
            [
              "Redis",
              "A fila entre o beat/servidor e o worker",
              "O correio entre os processos"
            ]
          ]
        }
      },
      {
        "heading": "7. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Classifique (20 min)",
          "Para cada pedido pendente, diga se a tarefa cancela e por quê:",
          "a) Não (recente). b) Não (59,9 < 60: a fronteira é >= 60). c) Sim (PIX pendente, 60 min). d) Sim (recusado). e) Não (o provedor ainda pode confirmar). f) Não cancela pela regra do pagamento: com Payment aprovado, _is_abandoned devolve False (método PIX e status ≠ pending). Esse caso é uma inconsistência (pagamento aprovado e pedido pendente) que deve ser investigada, e não cancelada.",
          "E2 — No código (45 min): laboratorio/starter/lab08_expiracao.py",
          "Implemente precisa_lembrete, deve_cancelar e expirar. Critério de aceite: python testes.py lab08 verde (10 testes). Atenção às fronteiras (9.9, 10, 14.9, 15, 59.9, 60).",
          "E3 — Precisa de worker? (30 min)",
          "Para cada tarefa, diga se precisa de um processo sempre ligado ou só de um relógio, e o que perderia se ela fosse trocada por um cron externo:",
          "E4 — Devolva o cupom (40 min): parte do Projeto B",
          "Quando um pedido expira, o current_uses do cupom não volta (Aula 3). Escreva: (1) a regra (quando devolver?); (2) onde colocaria o código; (3) o teste que falha antes e passa depois; (4) o que acontece se o cupom foi de 1 uso e outra pessoa já o usou nesse meio tempo.",
          "(1) Ao cancelar por expiração, decrementar current_uses do cupom do pedido, uma vez (use F(\"current_uses\") - 1, com piso em 0). (2) Dentro do mesmo transaction.atomic() do cancelamento, junto à devolução do estoque: ou tudo volta, ou nada. Precisa guardar qual cupom o pedido usou (hoje só vai para notes; um campo coupon no Order resolve). (3) Criar pedido com cupom de 1 uso, expirar, e afirmar current_uses == 0 e que um segundo cliente consegue usar. (4) Se outra pessoa já o usou depois do cancelamento, o contador volta a refletir a realidade; e o cuidado é não decrementar duas vezes (por isso a idempotência do cancelamento, só pedidos pending).",
          "E5 — Desafio ★★★: cancele também a cobrança",
          "A expiração cancela o pedido, mas não a cobrança PIX no provedor (Aula 5, caso do pagamento tardio). Desenhe: (1) onde chamar o provedor; (2) o que fazer se a chamada falhar; (3) por que isso não deve ficar dentro da transação.",
          "(1) Depois do commit do cancelamento (por exemplo, com transaction.on_commit), chamar o cancelamento da cobrança no provedor. (2) Se falhar: não desfazer o cancelamento do pedido; registrar e tentar de novo depois (a regra \"pedido cancelado não confirma\", da Aula 6, é a rede de segurança). (3) Chamada de rede demora e pode falhar: dentro da transação, ela seguraria as travas do banco enquanto espera a rede, e uma falha desfaria o cancelamento. Efeito externo vai depois do commit (a mesma lógica do on_commit da otimização de imagem)."
        ],
        "table": {
          "headers": [
            "#",
            "Idade",
            "Pagamento"
          ],
          "rows": [
            [
              "a",
              "9 min",
              "nenhum"
            ],
            [
              "b",
              "59,9 min",
              "nenhum"
            ],
            [
              "c",
              "60 min",
              "PIX pendente"
            ],
            [
              "d",
              "61 min",
              "cartão recusado"
            ],
            [
              "e",
              "61 min",
              "cartão pendente"
            ],
            [
              "f",
              "120 min",
              "PIX aprovado (mas o pedido ainda pending, por uma falha)"
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: veja o teste falhar antes. No repositório do MySuperStore, restaure o tasks.py antigo e rode a classe nova:",
      "whatHappens": "3 falhas e 4 passes. As falhas são exatamente os casos que o bug deixava de tratar. Nos testes que passam, a diferença é proteção contra regressão. *(Se o PR 27 já foi incorporado à master, use o laboratório 8: python testes.py lab08 com a função deve_cancelar \"ingênua\" que só olha PIX.)*",
      "lessonLearned": "Experimento B: o laboratório 8. Implemente deve_cancelar só com a regra antiga (pagamento é PIX e pending) e rode python testes.py lab08."
    },
    "pitfalls": [
      {
        "wrong": "Reservar sem prazo de validade",
        "right": "Toda reserva tem prazo e uma tarefa que a solta",
        "why": "Senão o recurso fica preso"
      },
      {
        "wrong": "Decidir com o dado lido antes da trava",
        "right": "Reler depois de travar",
        "why": "O dado pode ter mudado"
      },
      {
        "wrong": "Cancelar cartão \"pendente\" depois de 60 min",
        "right": "Esperar a confirmação do provedor",
        "why": "Evita pedido pago e cancelado"
      },
      {
        "wrong": "Marcar como \"já avisei\" no banco",
        "right": "Janela de tempo (10–15 min)",
        "why": "Mais simples; aceita a imprecisão"
      },
      {
        "wrong": "Escrever o teste depois de corrigir e nunca vê-lo falhar",
        "right": "Ver o teste falhar no código antigo",
        "why": "Prova que ele mede o problema"
      },
      {
        "wrong": "Tarefa que não é segura para rodar duas vezes",
        "right": "Tarefa idempotente",
        "why": "O agendador pode disparar duas vezes"
      },
      {
        "wrong": "Achar que \"tem Celery\" significa \"precisa do Celery\"",
        "right": "Perguntar o que realmente exige um worker",
        "why": "Memória é custo"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a08-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Depois de travar o pedido com select_for_update, o código "
          },
          {
            "kind": "blank",
            "id": "mk-a08-q3-b1",
            "accepted": [
              "rele",
              "relê",
              "le de novo",
              "lê de novo",
              "recarrega"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": " o pagamento (lê de novo) antes de decidir se cancela."
          }
        ],
        "explanation": "O cliente pode ter tentado pagar de novo entre a consulta inicial e a trava (cartão recusado volta a pendente). Decidir com o dado lido antes seria usar um dado velho."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a08-q1",
        "question": "Uma cliente cria o pedido e fecha a aba sem escolher como pagar. Com a regra corrigida (PR 27), o que acontece com a peça única do pedido?",
        "options": [
          {
            "text": "Fica reservada para sempre.",
            "whyNot": "Era o comportamento antigo (a expiração só olhava PIX pendente)."
          },
          {
            "text": "Depois de 60 minutos o pedido é cancelado e a peça volta ao estoque."
          },
          {
            "text": "Volta imediatamente, assim que a aba fecha.",
            "whyNot": "O servidor não sabe que a aba fechou; só o tempo decide."
          },
          {
            "text": "Volta só se o cliente fizer login de novo.",
            "whyNot": "Login não influencia: a regra é por tempo e por estado do pagamento."
          }
        ],
        "correctIndex": 1,
        "explanation": "Pedido pendente com 60 minutos ou mais e sem pagamento iniciado está abandonado: a tarefa o cancela e devolve o estoque."
      },
      {
        "id": "mk-a08-q2",
        "question": "Um pedido com cartão aguardando confirmação do provedor deve ser cancelado pela tarefa depois de 60 minutos, como o PIX pendente.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "O provedor ainda pode confirmar a cobrança do cartão. Cancelar o pedido e receber a confirmação depois criaria um pedido pago e cancelado ao mesmo tempo. O PIX pendente é diferente: o QR tem validade e já venceu."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "O provedor ainda pode confirmar a cobrança do cartão. Cancelar o pedido e receber a confirmação depois criaria um pedido pago e cancelado ao mesmo tempo. O PIX pendente é diferente: o QR tem validade e já venceu."
      },
      {
        "id": "mk-a08-q4",
        "question": "Na correção do PR 27, 3 dos 7 testes novos falham no código antigo e 4 passam nos dois. Qual é a leitura correta?",
        "options": [
          {
            "text": "Os 4 que passam são inúteis e deveriam ser removidos.",
            "whyNot": "Eles travam comportamentos que já eram corretos: se alguém os quebrar no futuro, eles falham."
          },
          {
            "text": "Os 3 que falham provam que detectam o bug; os 4 que passam protegem contra regressão nos casos que já funcionavam."
          },
          {
            "text": "Os 3 que falham mostram que a correção está errada.",
            "whyNot": "As falhas são no código ANTIGO, e é o resultado esperado."
          },
          {
            "text": "Os testes só têm valor se todos falharem antes.",
            "whyNot": "Testes de regressão passam antes e depois; seu valor é justamente não mudar."
          }
        ],
        "correctIndex": 1,
        "explanation": "Falhar antes prova que o teste mede o problema. Passar nos dois garante que a correção não quebrou comportamentos corretos (cartão pendente, pedido pago, pedido recente)."
      },
      {
        "id": "mk-a08-q5",
        "question": "Qual destas tarefas do MySuperStore realmente exige um processo em segundo plano, e não só um relógio externo chamando um endereço?",
        "options": [
          {
            "text": "Expirar pedidos a cada 5 minutos.",
            "whyNot": "Só precisa de um relógio; já existe um endpoint de cron para isso."
          },
          {
            "text": "Liquidar repasses pendentes a cada 30 minutos.",
            "whyNot": "Só precisa de um relógio e é idempotente pelo idEnvio; falta apenas o endpoint."
          },
          {
            "text": "Enviar uma notificação para todos os usuários, que varre milhares de contas."
          },
          {
            "text": "Conferir o PIX pendente.",
            "whyNot": "Não existe uma tarefa assim; quem confirma o PIX é o webhook e o polling da tela."
          }
        ],
        "correctIndex": 2,
        "explanation": "A notificação em massa é demorada e disparada por um evento do admin; executar na requisição travaria o servidor. As duas tarefas agendadas só precisam de um relógio. (O código não tem uma tarefa que \"confere o PIX\": a expiração só lembra e cancela.)"
      }
    ],
    "flashcards": [
      {
        "front": "Toda reserva precisa de...",
        "back": "Prazo de validade e uma tarefa que a solta"
      },
      {
        "front": "Quando o pedido é cancelado por expiração?",
        "back": "≥ 60 min, pendente, e sem como pagar"
      },
      {
        "front": "Por que o cartão pendente não é cancelado?",
        "back": "O provedor ainda pode confirmar"
      },
      {
        "front": "O que fazer depois de travar?",
        "back": "Reler e reconferir antes de decidir"
      },
      {
        "front": "\"Falha antes, passa depois\"",
        "back": "Prova que o teste mede o bug"
      },
      {
        "front": "Testes que passam antes e depois",
        "back": "Protegem contra regressão"
      },
      {
        "front": "Worker x cron",
        "back": "Worker para eventos demorados; cron para tarefas só de relógio"
      }
    ],
    "threeThings": [
      "Toda reserva expira: se você bloqueia algo, precisa de quem o solte.",
      "Trave, releia, decida: o que você leu antes da trava pode estar velho.",
      "Um teste só vale se já o vimos falhar, e os que passam nos dois lados guardam o que já funcionava."
    ]
  },
  "modulo-4-tempo-real-e-midia": {
    "slug": "modulo-4-tempo-real-e-midia",
    "code": "A09",
    "title": "Tempo real, notificações e mídia: WebSocket com autorização, push e upload que não derruba o servidor",
    "oneSentence": "conexões longas e arquivos grandes são onde sistemas pequenos quebram: um por abrir uma porta sem checar quem entra, outro por receber mais do que a memória aguenta.",
    "guideQuestion": "uma conexão aberta o tempo todo, um arquivo de 50 MB e uma VM de 1 GB: como manter tudo isso seguro e de pé?",
    "metaNote": "120 min · Estudo de caso MySuperStore",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A09 · Áudio de arquitetura",
      "audio": {
        "title": "Segurança versus Pragmatismo na Arquitetura de Software",
        "src": "/cursos/midia/seguranca-versus-pragmatismo.m4a",
        "summary": "Episódio em áudio discutindo autorização em tempo real e proteção de upload em servidores enxutos.",
        "durationLabel": "Áudio 16m42s"
      }
    },
    "predict": [
      {
        "question": "O JavaScript do navegador não consegue enviar o cabeçalho Authorization ao abrir um WebSocket. Como, então, o servidor sabe quem é o usuário?",
        "answer": "Por um token na URL (?token=...), lido por um *middleware* que o valida. É uma limitação do navegador, com um custo: o token pode aparecer em logs de proxy."
      },
      {
        "question": "O ChatConsumer original só verificava: \"o usuário está logado e a sala existe?\". Um terceiro, logado, que descobre o UUID de uma sala alheia, consegue ler e escrever nela?",
        "answer": "Sim (antes do PR 27). O consumer checava autenticação (quem é) e existência da sala, mas não autorização (se ele pode estar ali). O UUID é difícil de adivinhar, mas \"difícil de adivinhar\" não é permissão."
      },
      {
        "question": "O Redis (que enfileira a otimização da foto) está fora do ar e o lojista sobe uma foto de produto. O cadastro falha?",
        "answer": "Não. A otimização é \"nice to have\": o enfileiramento está num try/except que só registra o aviso. O upload funciona."
      },
      {
        "question": "Um vídeo de 50 MB é enviado pela API do marketplace (VM de 1 GB). Quanta memória o servidor chegou a precisar, na pior versão do código?",
        "answer": "Cerca de 650 MB (13× o tamanho do arquivo): o servidor fazia um *parse* duplicado do formulário. Foi o incidente de OOM de 16/10/2026."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o telefone com sala de conferência",
        "paragraphs": [
          "Uma requisição HTTP é como uma ligação rápida: pergunta, resposta, desliga. Um WebSocket é como uma sala de conferência que fica aberta: quem entra recebe tudo que for dito ali, enquanto estiver na sala.",
          "- Consumer: a classe que atende uma conexão (equivale a uma \"view\" do WebSocket). - Grupo: um nome (por exemplo, chat_<sala> ou user_<id>_notifications) ao qual conexões se juntam. - Channel layer: o \"correio\" (Redis) que entrega uma mensagem do grupo a todas as conexões, mesmo vindas de outro processo."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart LR\n  B[\"Navegador<br/>abre ws://...?token=...\"] --> M[\"Middleware JWT<br/>descobre quem é\"]\n  M --> C[\"Consumer<br/>decide se pode entrar\"]\n  C --> G[\"Grupo (sala)<br/>chat_&lt;id&gt;\"]\n  V[\"Uma view qualquer<br/>(group_send)\"] --> R[(\"Redis<br/>channel layer\")]\n  R --> G\n  G --> B"
          }
        ]
      },
      {
        "heading": "2. A autenticação: o token na URL (sellers/middleware.py)",
        "paragraphs": [
          "⚠️ Custo conhecido: um token na URL pode aparecer em logs de proxy. Mitigações: token de curta duração, ou um ticket de uso único (a API entrega um código que vale 30 segundos e só abre o WebSocket). É o exercício E4."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "class JWTAuthMiddleware(BaseMiddleware):\n    async def __call__(self, scope, receive, send):\n        query_string = parse_qs(scope[\"query_string\"].decode())\n        token = query_string.get(\"token\")\n        if token:\n            scope[\"user\"] = await get_user_from_token(token[0])\n        else:\n            scope[\"user\"] = AnonymousUser()\n        return await super().__call__(scope, receive, send)"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "Token na query string",
              "O WebSocket do navegador não permite cabeçalhos personalizados. É a saída mais simples."
            ],
            [
              "get_user_from_token valida o JWT",
              "A assinatura prova que o token foi emitido por nós."
            ],
            [
              "AnonymousUser() se não há token",
              "Nunca deixar scope[\"user\"] indefinido: o consumer sempre sabe se é anônimo."
            ],
            [
              "await e database_sync_to_async",
              "O consumer é assíncrono; consulta ao banco (síncrona) precisa ser embrulhada, senão trava o laço de eventos."
            ]
          ]
        }
      },
      {
        "heading": "3. O caso real (PR 27): autenticação não é autorização",
        "paragraphs": [
          "3.1 Antes",
          "Ninguém perguntou: \"este usuário faz parte desta conversa?\" Já a API REST do mesmo chat perguntava, com get_queryset filtrando por cliente ou dono da loja. O mesmo recurso, duas portas de entrada, só uma protegida.",
          "3.2 Depois (sellers/consumers.py)",
          "💡 A lição de arquitetura: a regra de autorização precisa existir em cada porta de entrada (REST, WebSocket, tarefas, admin). Quando a regra mora só em uma, as outras viram desvios. Uma boa prática: uma função de \"pode acessar?\" compartilhada, chamada por todas as portas."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "async def connect(self):\n    self.user = self.scope[\"user\"]\n    if self.user.is_anonymous:                      # autenticação: quem é?\n        await self.close(); return\n    room_exists = await self.check_room_exists(self.room_id)   # a sala existe?\n    if not room_exists:\n        await self.close(); return\n    await self.channel_layer.group_add(self.room_group_name, self.channel_name)\n    await self.accept()"
          },
          {
            "title": "Código (python)",
            "code": "if not await self.user_can_access_room(self.room_id, self.user):\n    await self.close(code=4403)\n    return\n\n@database_sync_to_async\ndef user_can_access_room(self, room_id, user):\n    try:\n        return ChatRoom.objects.filter(\n            Q(id=room_id) & (Q(customer=user) | Q(seller__user=user))\n        ).exists()\n    except (ValueError, ValidationError):          # id fora do formato UUID na URL\n        return False"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "Uma única consulta com `Q(customer=user) \\",
              "Q(seller__user=user)`",
              "A sala existe e eu sou uma das duas partes. Mesma regra da API REST."
            ],
            [
              "close(code=4403)",
              "Códigos 4000+ são do aplicativo; 4403 ecoa o \"403 Forbidden\" do HTTP e deixa o frontend distinguir \"proibido\" de \"sala inexistente\"."
            ],
            [
              "except (ValueError, ValidationError)",
              "A URL aceita qualquer texto [0-9a-f-]+; um abc-def não é UUID e antes derrubava o consumer com um erro."
            ],
            [
              "Antes de group_add",
              "Autorizar antes de entrar no grupo: quem entra no grupo recebe tudo."
            ]
          ]
        }
      },
      {
        "heading": "4. A mensagem, do chat até a notificação",
        "paragraphs": [
          "1. Receber (receive): lê o JSON, grava no banco (database_sync_to_async). 2. Distribuir: group_send ao grupo da sala (chat_<id>): quem está conectado recebe na hora. 3. Notificar a outra parte: cria uma Notification e faz group_send para o grupo pessoal (user_<id>_notifications), que o NotificationConsumer entrega ao navegador.",
          "💡 Por quê o Redis aqui? O channel layer precisa entregar mensagens entre processos diferentes (uma view e uma conexão aberta podem estar em processos distintos). Com um único processo, um correio em memória serviria; o Redis passa a ser indispensável com vários processos, ou se o worker precisar enviar (Aula 8).",
          "4.1 Push: notificação com o site fechado (users/notifications.py)",
          "O Web Push usa um par de chaves VAPID (a chave privada fica no servidor) para identificar quem está enviando.",
          "💡 Por quê apagar a inscrição em 410/404? O navegador diz \"essa inscrição não existe mais\". Continuar tentando seria desperdício e poluiria o log. Limpar sozinho é parte do contrato com o serviço de push."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "channel_layer = get_channel_layer()\nasync_to_sync(channel_layer.group_send)(\n    f\"user_{target_user.id}_notifications\",\n    {\"type\": \"send_notification\", \"data\": {...}})"
          },
          {
            "title": "Código (python)",
            "code": "except WebPushException as ex:\n    if ex.response and ex.response.status_code in (410, 404):\n        sub.delete()          # o usuário cancelou a inscrição"
          }
        ],
        "table": {
          "headers": [
            "Trecho",
            "Por quê"
          ],
          "rows": [
            [
              "async_to_sync(...)",
              "Esta parte roda em código síncrono (uma view ou um método dentro de database_sync_to_async); async_to_sync permite chamar a função assíncrona do channel layer."
            ],
            [
              "Um grupo por usuário",
              "Qualquer parte do sistema (chat, promoção em favoritos, pedido) envia uma notificação sem saber onde o usuário está conectado."
            ],
            [
              "Gravar antes de enviar",
              "Se o usuário estiver offline, a notificação não se perde: está no banco e aparece quando ele voltar."
            ]
          ]
        }
      },
      {
        "heading": "5. Mídia: o upload que não passa pelo servidor",
        "paragraphs": [
          "5.1 O problema, em números",
          "O Daphne, ao receber um formulário multipart, fazia um **segundo *parse* do corpo inteiro só para preencher um campo que ninguém usava: lia, juntava, decodificava e montava a mensagem. 50 MB viravam ~650 MB** e a VM morria (16/10/2026).",
          "5.2 A solução em três camadas",
          "5.3 Upload direto assinado (sellers/media.py)",
          "O fluxo, como diz o cabeçalho do arquivo: a API assina um upload com public_id fixo para o produto → o navegador envia o arquivo ao serviço → a API confirma (existe? tamanho? formato?) e só então grava o link.",
          "5.4 A otimização de foto em segundo plano (catalog/signals.py, catalog/tasks.py)",
          "5.5 Bomba de descompressão",
          "Uma bomba de descompressão é uma imagem pequena no disco que explode na memória. Medido: um PNG de 6000×6000 com uma cor só ocupa 117 KB, mas decodificado em RGB são 103 MB: 903 vezes maior. O limite de 40 milhões de pixels (≈ 114 MB em RGB, 152 MB em RGBA) é o teto aceitável para a VM."
        ],
        "codeBlocks": [
          {
            "title": "Código (python)",
            "code": "def signed_upload(product):\n    params = {\"timestamp\": int(time.time()), \"public_id\": new_video_public_id(product),\n              \"allowed_formats\": \",\".join(settings.PRODUCT_VIDEO_FORMATS), \"tags\": VIDEO_TAG}\n    return {\"direct\": True, \"upload_url\": ..., \"signature\": cloudinary.utils.api_sign_request(params, cfg.api_secret), ...}"
          },
          {
            "title": "Código (python)",
            "code": "if created and instance.image:\n    def _enqueue():\n        try:\n            optimize_product_image_task.delay(image_id)\n        except Exception as exc:\n            logger.warning(\"Falha ao enfileirar otimização da imagem %s: %s\", image_id, exc)\n    transaction.on_commit(_enqueue)"
          },
          {
            "title": "Código (python)",
            "code": "PRODUCT_PHOTO_MAX_BYTES = 10 * 1024 * 1024\nPRODUCT_PHOTO_MAX_PIXELS = 40_000_000     # acima disso é bomba de descompressão"
          }
        ],
        "table": {
          "headers": [
            "Dado",
            "Valor"
          ],
          "rows": [
            [
              "Memória da VM",
              "1 GB"
            ],
            [
              "Vídeo de produto",
              "até 50 MB"
            ],
            [
              "Memória usada na pior versão",
              "~650 MB (13×)"
            ]
          ]
        }
      },
      {
        "heading": "8. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Modelo de ameaça do consumer (30 min)",
          "Para o ChatConsumer, preencha o que um atacante tentaria em cada etapa e onde está a defesa:",
          "E2 — Leia o teste real (25 min)",
          "Abra ChatWebSocketAuthzTest em apps/sellers/tests.py. Responda: por que usa TransactionTestCase e InMemoryChannelLayer? Depois acrescente um 7º teste: um cliente de outra sala tenta entrar na sala de um terceiro.",
          "TransactionTestCase: o consumer consulta o banco em outra thread (database_sync_to_async), que não enxerga a transação de um TestCase comum. InMemoryChannelLayer: o teste não depende do Redis. O 7º teste é uma variação do test_terceiro_autenticado_nao_entra com um usuário que tem outra sala (prova que \"ter alguma sala\" não dá acesso a qualquer sala).",
          "E3 — Conta de memória (15 min)",
          "(a) Um vídeo de 30 MB com o *parse* duplicado usa quanto? (b) Uma foto de 8000×5000 em RGB ocupa quanto decodificada? (c) Ela passa no limite do projeto?",
          "(a) 30 × 13 = 390 MB. (b) 8000 × 5000 = 40.000.000 px × 3 bytes = 120.000.000 bytes ≈ 114 MB. (c) Passa: a verificação (catalog/serializers.py:78) recusa só quando pixels > 40_000_000, e ela tem exatamente 40 milhões. Em RGBA seriam ~152 MB. Um único pixel a mais, não passa.",
          "E4 — Projete o ticket de uso único ★★★ (40 min)",
          "Substitua o token na URL por um ticket: (1) onde o cliente o obtém? (2) quanto tempo vale? (3) onde ele é guardado e como se garante o uso único? (4) o que acontece se alguém roubar o ticket depois de usado?",
          "(1) Um endpoint HTTP autenticado (POST /ws-ticket/) devolve um código aleatório. (2) Alguns segundos (por exemplo, 30). (3) No Redis, com expiração e apagado ao ser lido (GETDEL): a primeira leitura consome. O middleware troca ticket por usuário. (4) Nada: já foi consumido. E mesmo o ticket não usado vence logo. Ganho: o JWT (que vale horas) nunca vai para a URL nem para os logs de proxy.",
          "E5 — Desafio ★★★: uma função só de \"pode acessar?\"",
          "Hoje a regra existe duas vezes (ChatRoomViewSet.get_queryset e ChatConsumer.user_can_access_room). Proponha uma função compartilhada: assinatura, onde mora, quem a chama e o teste que garante que as duas portas nunca divergem.",
          "ChatRoom.objects.for_user(user) (um *QuerySet* personalizado) devolve as salas do usuário (customer=user | seller__user=user). O get_queryset da API usa .for_user(request.user); o consumer usa .for_user(user).filter(id=room_id).exists(). Teste de paridade: para um conjunto de usuários e salas, afirmar que o resultado da API e do consumer é o mesmo. Assim, mudar a regra em um lugar muda as duas portas."
        ],
        "table": {
          "headers": [
            "Etapa",
            "Ataque possível",
            "Defesa"
          ],
          "rows": [
            [
              "Conectar sem token",
              "",
              ""
            ],
            [
              "Conectar com token de outro usuário",
              "",
              ""
            ],
            [
              "Entrar em sala alheia",
              "",
              ""
            ],
            [
              "Enviar mensagem enorme",
              "",
              ""
            ],
            [
              "Passar um id de sala inválido",
              "",
              ""
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: a bomba. Com o Pillow instalado (pip install pillow), no Python:",
      "whatHappens": "arquivo: 117 KB | decodificado: 103 MB. Por quê: o PNG comprime uma superfície de uma só cor quase a nada, mas o computador precisa de 3 bytes por pixel para trabalhar com ela. Conclusão: limitar o tamanho em bytes não protege a memória; é preciso limitar pixels.",
      "lessonLearned": "Experimento B: o terceiro na sala. No repositório do MySuperStore (branch do PR 27), rode pytest apps/sellers/tests.py::ChatWebSocketAuthzTest -q e depois desfaça a verificação no consumer (volte a só checar se a sala existe)."
    },
    "pitfalls": [
      {
        "wrong": "Checar só \"está logado\" no WebSocket",
        "right": "Checar se pode acessar aquele recurso",
        "why": "Autenticação ≠ autorização"
      },
      {
        "wrong": "Proteger a API REST e esquecer o WebSocket",
        "right": "A mesma regra em todas as portas",
        "why": "Desvios viram vulnerabilidades"
      },
      {
        "wrong": "Limitar o upload em bytes",
        "right": "Limitar bytes e pixels",
        "why": "Bomba de descompressão"
      },
      {
        "wrong": "Confiar que o navegador enviou o arquivo certo",
        "right": "Conferir no destino (tamanho, formato)",
        "why": "O navegador não é confiável"
      },
      {
        "wrong": "Notificação só em tempo real",
        "right": "Gravar e depois enviar",
        "why": "Quem está offline não perde"
      },
      {
        "wrong": "Decidir o formato da imagem pela extensão",
        "right": "Decidir pelo conteúdo",
        "why": "Nomes mentem (e geraram um loop)"
      },
      {
        "wrong": "Fila fora do ar derruba o cadastro",
        "right": "try/except em tarefas opcionais",
        "why": "Opcional não pode quebrar o essencial"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a09-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "A otimização da foto é enfileirada dentro de transaction."
          },
          {
            "kind": "blank",
            "id": "mk-a09-q3-b1",
            "accepted": [
              "on_commit",
              "on_commit()"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": "(_enqueue) para só rodar depois que a foto foi gravada."
          }
        ],
        "explanation": "Sem on_commit, o worker poderia procurar a foto antes de ela existir no banco e não a encontraria."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a09-q1",
        "question": "O ChatConsumer original fechava a conexão de usuários anônimos e de salas inexistentes. Por que isso ainda deixava uma falha?",
        "options": [
          {
            "text": "Porque anônimos conseguiam entrar mesmo assim.",
            "whyNot": "Anônimos eram recusados corretamente; o problema era com usuários logados."
          },
          {
            "text": "Porque não verificava se o usuário logado fazia parte daquela conversa."
          },
          {
            "text": "Porque o token expirava rápido demais.",
            "whyNot": "O tempo do token não tem relação com a falta de checagem de participação."
          },
          {
            "text": "Porque o Redis estava fora do ar.",
            "whyNot": "O Redis só entrega mensagens; não decide quem pode entrar."
          }
        ],
        "correctIndex": 1,
        "explanation": "Autenticação diz quem é a pessoa; autorização diz se ela pode acessar aquele recurso. O consumer só fazia a primeira, então um usuário logado que soubesse o UUID de uma sala alheia entrava nela."
      },
      {
        "id": "mk-a09-q2",
        "question": "Como o id da sala é um UUID difícil de adivinhar, não era necessário verificar se o usuário participava da conversa.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "Difícil de adivinhar não é permissão. UUIDs vazam (logs, links, compartilhamento). A segurança precisa vir de uma checagem explícita de quem pode acessar o recurso."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "Difícil de adivinhar não é permissão. UUIDs vazam (logs, links, compartilhamento). A segurança precisa vir de uma checagem explícita de quem pode acessar o recurso."
      },
      {
        "id": "mk-a09-q4",
        "question": "Uma foto de 6000×6000 pixels, de uma só cor, ocupa 117 KB como PNG. Por que o limite do projeto também restringe pixels, e não só bytes?",
        "options": [
          {
            "text": "Porque pixels são mais fáceis de contar.",
            "whyNot": "A razão é de segurança de memória, não conveniência de contagem."
          },
          {
            "text": "Porque, decodificada, ela ocupa cerca de 103 MB: o tamanho em bytes não revela o custo na memória."
          },
          {
            "text": "Porque o PNG é um formato inseguro.",
            "whyNot": "O formato não é o problema; qualquer formato compressível tem isso."
          },
          {
            "text": "Porque o serviço de mídia cobra por pixel.",
            "whyNot": "O limite existe para proteger a VM de 1 GB, não por custo."
          }
        ],
        "correctIndex": 1,
        "explanation": "Imagens muito compressíveis são pequenas no disco e enormes na memória. Limitar pixels limita o custo real de decodificação."
      }
    ],
    "flashcards": [
      {
        "front": "Por que o token vai na URL do WebSocket?",
        "back": "O navegador não permite cabeçalhos no WebSocket"
      },
      {
        "front": "Autenticação x autorização",
        "back": "Quem é você x o que você pode acessar"
      },
      {
        "front": "O que é IDOR?",
        "back": "Acessar o recurso de outro só trocando o identificador"
      },
      {
        "front": "Por que o código 4403?",
        "back": "Ecoa o 403 e distingue \"proibido\" de \"inexistente\""
      },
      {
        "front": "Upload direto: o que a API ainda faz?",
        "back": "Assina antes e confere depois, no destino"
      },
      {
        "front": "Por que on_commit na tarefa?",
        "back": "O worker só procura a foto depois de gravada"
      },
      {
        "front": "Bomba de descompressão",
        "back": "Arquivo pequeno no disco, enorme na memória: limite pixels"
      }
    ],
    "threeThings": [
      "Autenticar é saber quem; autorizar é saber se pode. Cada porta de entrada precisa das duas.",
      "Não confie no navegador: assine antes, confira depois, no destino.",
      "O custo real está na memória, não nos bytes: limite o que a máquina precisa decodificar."
    ]
  },
  "modulo-5-infraestrutura-deploy-backup": {
    "slug": "modulo-5-infraestrutura-deploy-backup",
    "code": "A10",
    "title": "No ar e operando: Docker, deploy, backup, memória e decidir com medidas",
    "oneSentence": "operar não é \"subir o servidor\": é prever como ele falha, limitar o estrago e medir antes de decidir.",
    "guideQuestion": "o sistema funciona na sua máquina. O que muda para ele funcionar às 3 da manhã, sem você, numa máquina de 1 GB?",
    "metaNote": "130 min · Estudo de caso MySuperStore",
    "diagramId": "a10-infra-1gb",
    "notebookMedia": {
      "sectionLabel": "Estúdio da aula A10 · Áudio, slides e links públicos",
      "audio": {
        "title": "Como proteger dinheiro em 1 GB de RAM",
        "src": "/cursos/midia/como-proteger-dinheiro-1gb-ram.m4a",
        "summary": "Episódio de 24m35s sobre orçamento de memória, Redis, Celery --pool=solo, deploy e banco.",
        "durationLabel": "Áudio 24m35s"
      },
      "deck": {
        "title": "Anatomia da Infraestrutura MySuperStore",
        "href": "/cursos/midia/anatomia-infraestrutura-mysuperstore.pdf",
        "summary": "Slides visuais de 15 páginas sobre Docker, Caddy, memória e pipeline de deploy.",
        "pagesLabel": "15 slides · PDF"
      },
      "publicLinks": [
        {
          "tag": "Mapa Mental · NotebookLM",
          "label": "Infraestrutura Mapa Mental",
          "description": "Mapa mental público com os serviços, portas e fluxo de deploy do MySuperStore.",
          "href": "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/639416b1-8254-4217-ae3e-de13fded1d03"
        },
        {
          "tag": "Tabela · NotebookLM",
          "label": "Especificação da Infraestrutura e Deploy",
          "description": "Tabela pública conferida com medições reais (954 MB RAM, 640 MB teto API, Redis 24 MB).",
          "href": "https://notebook.google.com/notebook/67ad63e1-46fb-4f82-bf91-386993aa3c89/artifact/e8883b4e-0a4b-4779-b0de-47eda444a380"
        }
      ]
    },
    "predict": [
      {
        "question": "Uma VM tem 954 MB de RAM. Os containers que rodam nela têm tetos de memória (mem_limit) que, somados, dão 2.048 MB. Isso é um erro de configuração?",
        "answer": "Não necessariamente. mem_limit é um teto, não uma reserva: ninguém usa o teto de todos ao mesmo tempo. Mas é um risco: se vários chegarem perto do teto juntos, falta memória e o sistema recorre ao swap ou mata um processo."
      },
      {
        "question": "No deploy, a nova versão do código precisa de uma coluna nova no banco. Devemos migrar o banco antes de subir a aplicação nova, ou depois?",
        "answer": "Antes. Se a migração falhar, o deploy para e a versão antiga continua rodando. Subir a aplicação nova com o banco velho a derrubaria."
      },
      {
        "question": "Você tem um backup diário há 6 meses. Ele funciona?",
        "answer": "Você não sabe. Backup que nunca foi restaurado é uma esperança, não um backup. O script do projeto valida o arquivo (pg_restore --list), o que ajuda, mas só um teste de restauração prova."
      },
      {
        "question": "O servidor está com 1 GB de swap em uso. É um problema?",
        "answer": "É um sinal de pressão. Swap é disco fingindo ser memória: muito mais lento. Alguns processos ociosos em swap são normais; 1 GB em uso numa máquina de 954 MB diz que a memória acabou."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: o restaurante que abre sem o dono",
        "paragraphs": [
          "Um restaurante que funciona quando o dono está ausente precisa de: uma cozinha padronizada (Docker), um gerente que organiza as estações (Compose), um porteiro (Caddy), um inspetor que confere se tudo está de pé (healthcheck) e um procedimento de abertura (CI/CD) com uma saída de emergência (rollback)."
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart LR\n  M[\"Merge na master\"] --> W[\"GitHub Actions\"]\n  W --> S[\"SSH na VM<br/>chave temporária,<br/>servidor conhecido\"]\n  S --> B[\"Build da imagem\"]\n  B --> G[\"Migrações<br/>ANTES de trocar a app\"]\n  G --> U[\"Sobe os containers\"]\n  U --> H{\"/api/health/<br/>responde?\"}\n  H -- sim --> OK[\"No ar\"]\n  H -- não --> E[\"Falha: versão anterior<br/>continua disponível\"]"
          }
        ]
      },
      {
        "heading": "2. Docker: a receita (backend/Dockerfile.prod)",
        "paragraphs": [],
        "codeBlocks": [
          {
            "title": "Código (dockerfile)",
            "code": "FROM python:3.12-slim\nCOPY backend/requirements/ requirements/         # 1º as dependências\nRUN pip install -r requirements/prod.txt\nCOPY backend/ .                                  # 2º o código\nRUN ... python manage.py collectstatic --noinput --upload-unhashed-files   # sem \"|| true\""
          }
        ],
        "table": {
          "headers": [
            "Decisão",
            "Por quê"
          ],
          "rows": [
            [
              "python:3.12-slim",
              "Imagem menor = download, deploy e superfície de ataque menores"
            ],
            [
              "Dependências antes do código",
              "Cache de camadas: se só o código mudou, a instalação das dependências (lenta) é reaproveitada"
            ],
            [
              "collectstatic no build",
              "Antes rodava no início do container, atrasando a volta da API após um reinício ou falta de memória. Agora os arquivos já vêm prontos."
            ],
            [
              "**Sem `",
              "",
              "true`**",
              "Se falhar, o build falha. Um erro silencioso no build vira problema escondido em produção."
            ]
          ]
        }
      },
      {
        "heading": "3. Compose: a operação (deploy/oracle/compose.micro.yml)",
        "paragraphs": [
          "O orçamento de memória (o número que surpreende)",
          "Lendo os limites de todos os containers da VM pública (docker stats, 12/11/2026):",
          "💡 Por quê isso não é, por si só, um erro? O teto é um limite de proteção, não uma reserva: cada container usa bem menos que o teto na maior parte do tempo. Mas a soma ser 2,1× a RAM significa que a máquina vive de aposta: funciona enquanto os picos não coincidem. Na medida de 12/11: 728 MB em uso, 225 MB disponíveis, 1,06 GB de swap em uso. A aposta já estava custando: processos ociosos jogados para o disco. Orçamento de memória é uma conta que se faz antes, não uma surpresa que se descobre depois."
        ],
        "codeBlocks": [
          {
            "title": "Código (yaml)",
            "code": "x-backend: &backend\n  image: mysuperstore-backend:${RELEASE:-latest}\n  restart: unless-stopped\n  env_file: ${SHARED_DIR}/.env.prod\nmss-api:\n  <<: *backend\n  command: daphne -b 0.0.0.0 -p 8000 --proxy-headers config.asgi:application\n  healthcheck: { test: [...], interval: 60s, timeout: 10s, retries: 3, start_period: 90s }\n  mem_limit: 640m\nmss-worker:\n  <<: *backend\n  command: celery -A config worker -B --pool=solo -l info\n  mem_limit: 320m"
          }
        ],
        "table": {
          "headers": [
            "Elemento",
            "Por quê"
          ],
          "rows": [
            [
              "Âncora &backend",
              "API e worker usam a mesma imagem: o mesmo código. Só muda o comando."
            ],
            [
              "restart: unless-stopped",
              "Se o processo morrer (falta de memória, falha), o Docker o levanta de novo."
            ],
            [
              "healthcheck com /api/health/",
              "O Docker pergunta se o sistema responde (e se alcança o banco). start_period: 90s dá tempo de subir sem contar como falha."
            ],
            [
              "mem_limit",
              "Um processo descontrolado não derruba a máquina: o Docker o mata sozinho."
            ],
            [
              "--pool=solo",
              "Um processo Python no Celery: em 1 GB, cada processo a mais pesa."
            ],
            [
              "env_file fora do repositório",
              "Segredos nunca vão para o código."
            ]
          ]
        }
      },
      {
        "heading": "4. O deploy: a ordem segura (deploy.sh, deploy-backend.yml)",
        "paragraphs": [
          "4.1 Os passos (deploy.sh)",
          "1. Recusa deploy \"sujo\" (alterações não commitadas). 2. A release é o hash do commit (git rev-parse --short=12 HEAD). 3. Envia só o que está commitado (git archive), sem .env nem lixo local. 4. Constrói a imagem ...:<release> e marca como latest. 5. Sobe as dependências e espera ficarem saudáveis. 6. Roda as migrações num container descartável (run --rm --no-deps ... migrate). 7. Sobe a stack nova. 8. Aponta o link current para a release nova. 9. Mantém a release atual + 5 anteriores. 10. Testa /api/health/ até 30 vezes.",
          "💡 Por quê migrar (6) antes de subir (7)? Se a migração falhar, o script para (set -euo pipefail) e a versão antiga continua rodando, intacta. O contrário (subir a app nova com o banco velho) derrubaria o sistema. Corolário importante: migração que remove uma coluna é perigosa, porque a versão antiga ainda roda durante a troca e pode precisar da coluna. A regra segura é duas etapas: primeiro um deploy do código que para de usar a coluna; depois a migração que a remove.",
          "4.2 As proteções do workflow (deploy-backend.yml)",
          "⚠️ Lacuna conhecida: esse deploy não roda testes antes de publicar (o MercadinhoSys roda). A suíte do marketplace leva ~2,5 min: um *workflow* de teste em pull request é a melhoria mais barata (exercício do Projeto)."
        ],
        "table": {
          "headers": [
            "Proteção",
            "Por quê"
          ],
          "rows": [
            [
              "concurrency (um deploy por vez, sem cancelar o que roda)",
              "Dois deploys simultâneos corromperiam a VM"
            ],
            [
              "Só publica a partir da master",
              "Um branch qualquer não chega à produção"
            ],
            [
              "Ação do GitHub fixada por hash",
              "Uma etiqueta adulterada não injeta código (ataque à cadeia de suprimentos)"
            ],
            [
              "permissions: contents: read",
              "Permissão mínima"
            ],
            [
              "persist-credentials: false",
              "O token não fica no disco do runner"
            ],
            [
              "Chave SSH validada e apagada no fim (if: always())",
              "Mesmo se o job falhar, a chave some"
            ],
            [
              "StrictHostKeyChecking=yes + known_hosts de *secret*",
              "Evita o ataque do homem no meio"
            ],
            [
              "PRINT_REMOTE_LOGS: \"0\"",
              "O repositório é público → os logs do Actions também; os logs da aplicação ficam na VM"
            ]
          ]
        }
      },
      {
        "heading": "5. Backup: existir não basta (deploy/oracle/backup-db.sh)",
        "paragraphs": [
          "⚠️ O ponto fraco: os backups ficam na própria VM. Se a VM se perder, perde-se o banco e o backup. Falta uma cópia fora do local (outro provedor, criptografada) e um teste periódico de restauração. Regra: *backup que nunca foi restaurado é uma esperança*."
        ],
        "codeBlocks": [
          {
            "title": "Código (bash)",
            "code": "pg_dump ... -Fc > \"$out.tmp\"                          # 1. grava num arquivo temporário\nif ! check < \"$out.tmp\" >/dev/null; then              # 2. valida com pg_restore --list\n  rm -f \"$out.tmp\"; echo \"Dump inválido, descartado\" >&2; exit 1\nfi\nmv \"$out.tmp\" \"$out\"                                  # 3. só renomeia se válido\nfind \"$BACKUP_DIR\" -name 'mysuperstore-*.dump' -mtime +\"$KEEP_DAYS\" -delete   # 4. retenção"
          }
        ],
        "table": {
          "headers": [
            "Passo",
            "Por quê"
          ],
          "rows": [
            [
              "Arquivo .tmp",
              "Nunca existe um backup \"pela metade\" com o nome definitivo"
            ],
            [
              "pg_restore --list",
              "Confirma que o arquivo é legível. Mas ainda não prova que restaura"
            ],
            [
              "mv só depois de válido",
              "Um dump corrompido não vira o \"último backup\""
            ],
            [
              "Retenção de 7 dias",
              "Não encher o disco"
            ],
            [
              "umask 077",
              "O dump tem dados de clientes: só o dono lê"
            ]
          ]
        }
      },
      {
        "heading": "6. Medir antes de decidir: o caso do Supabase",
        "paragraphs": [
          "A hipótese: \"mover o banco para um serviço gratuito liberaria memória na Oracle.\" Em vez de decidir, mediu-se (12/11/2026):",
          "Decisão: não migrar. Pior desempenho, sem resolver o problema real. Uma boa decisão pode ser \"não fazer\", quando medida.",
          "💡 Por quê a latência importa tanto? Uma tela faz muitas consultas em sequência. 10 consultas × 2 ms = 20 ms; 10 × 200 ms = 2 segundos. A conta é simples, mas só aparece se você medir (e se lembrar que cada consulta soma, não \"faz uma média\")."
        ],
        "table": {
          "headers": [
            "Medida",
            "Resultado",
            "O que significa"
          ],
          "rows": [
            [
              "Tamanho do banco do marketplace",
              "11 MB",
              "Cabe com folga, mas não pesa na memória"
            ],
            [
              "Latência por consulta (túnel até o Postgres)",
              "1,7 ms",
              "O banco está \"ao lado\""
            ],
            [
              "Latência até o serviço externo (Virgínia)",
              "119–605 ms, mediana ~200 ms",
              "~100× pior por consulta"
            ],
            [
              "Onde está a memória",
              "Nos processos da aplicação, não no banco",
              "O banco não era o problema"
            ]
          ]
        }
      },
      {
        "heading": "9. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Orçamento de memória (25 min)",
          "Refaça o experimento A para o seu sistema (ou para um exemplo): liste os containers, os tetos e a RAM. (1) quanto vale a soma dos tetos? (2) qual é o cenário em que o teto de dois containers coincide? (3) que limite você baixaria primeiro, e por quê?",
          "(1) 2.048 MB (2,1×). (2) Um upload de vídeo (API sobe a centenas de MB) enquanto o outro sistema processa um relatório pesado (o backend dele sobe). (3) Não baixaria o teto da API (ela precisa do pico do upload; o teto de 640 MB foi dimensionado depois do incidente de 16/10). O candidato é o worker (320 MB, para tarefas que são só de relógio, Aula 8), e o ganho real viria de eliminá-lo, não de baixar o teto.",
          "E2 — Leia o workflow (25 min)",
          "Abra .github/workflows/deploy-backend.yml. Liste cinco proteções e, para cada uma, o ataque ou falha que ela evita.",
          "E3 — Teste de restauração (45 min)",
          "Escreva o roteiro (comandos e conferências) de um teste periódico de restauração do backup. Ele precisa responder: o arquivo restaura? Os dados batem?",
          "1. Pegar o último .dump. 2. Subir um PostgreSQL descartável (container). 3. pg_restore --no-owner --no-acl no banco descartável. 4. Contar linhas por tabela no banco restaurado e comparar com a produção no momento do dump (ou com uma contagem registrada no dia do backup). 5. Rodar uma consulta de sanidade (pedidos do dia, soma dos pagamentos). 6. Registrar data, resultado e tempo de restauração; apagar o banco descartável. 7. Alertar se algo divergir. (É o mesmo princípio do script de migração do Neon, que compara contagens de todas as tabelas dos dois lados.)",
          "E3b — Meça a sua latência (10 min)",
          "Rode o experimento B contra o seu banco. Anote mínimo, mediana e máximo. Que tela do seu sistema faz mais consultas em sequência? Quanto tempo de latência pura isso soma?",
          "E4 — Duas etapas para remover uma coluna ★★★ (30 min)",
          "O Product tem uma coluna legacy_code que não se usa mais. Escreva o plano em duas etapas, dizendo o que vai em cada deploy e por que não pode ser um só.",
          "Deploy 1: remover todo o uso de legacy_code do código (leitura, escrita, filtros, serializers); a coluna continua no banco. Deploy 2 (depois de o 1 estar estável): a migração que remove a coluna. Por quê não juntos: durante a troca de containers, a versão antiga ainda roda e continua lendo legacy_code; se a migração já removeu a coluna, ela quebra. Em duas etapas, quando a coluna some, nenhuma versão em execução a usa. (Reverter o Deploy 1 também fica seguro: a coluna ainda existe.)",
          "E5 — Desafio ★★★: o workflow de testes",
          "Escreva (em pseudo-YAML) um workflow que rode a suíte do marketplace em pull request e bloqueie o merge se falhar. O que ele precisa (banco, dependências, variáveis)? Quanto tempo leva? O que não deve entrar (segredos reais)?",
          "Gatilho pull_request; ubuntu-latest; setup-python 3.12; pip install -r backend/requirements/dev.txt; variável DJANGO_SECRET_KEY=teste (valor fictício, nunca um segredo real); banco: SQLite padrão do projeto (a suíte usa isso) ou um PostgreSQL de serviço, se quiser testar travas; pytest dentro de backend/. Tempo: ~2,5 min (medido: 142 s). Para bloquear o merge, marcar o job como check obrigatório na proteção de branch. Não entram: certificados, chaves do provedor, .env real. Observação: travas de linha (select_for_update) não se comportam como em PostgreSQL no SQLite, então um teste de concorrência real precisa de PostgreSQL."
        ]
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento A: o orçamento de memória. No Python (só biblioteca padrão):",
      "whatHappens": "soma: 2048 MB | RAM: 954 MB | razão: 2.1x. E agora pense: só os três do MySuperStore somam 1.008 MB (1,06× a RAM, sozinhos!). Por quê funciona assim mesmo? Porque ninguém usa o teto: no momento da medida, a API (idle) usava 16 MB de RAM, com o resto em swap. O perigo é o dia em que um upload de vídeo faz a API pular para centenas de MB enquanto o outro sistema também sobe.",
      "lessonLearned": "Experimento B: meça a latência até o seu banco. (Substitua pelo host e porta do seu banco; para testar sem banco, use (\"localhost\", 22) ou qualquer porta aberta.)"
    },
    "pitfalls": [
      {
        "wrong": "Subir a app nova e depois migrar",
        "right": "Migrar antes",
        "why": "Migração que falha não derruba o que está no ar"
      },
      {
        "wrong": "Remover coluna e o código no mesmo deploy",
        "right": "Duas etapas",
        "why": "A versão antiga ainda roda na troca"
      },
      {
        "wrong": "Backup guardado só na mesma máquina",
        "right": "Cópia fora do local + teste de restauração",
        "why": "A máquina pode se perder"
      },
      {
        "wrong": "\"Funciona\" no teste de uma requisição",
        "right": "Medir sob carga e observar swap",
        "why": "Memória só aperta quando há pico"
      },
      {
        "wrong": "Decidir pela intuição (\"o banco está pesado\")",
        "right": "Medir (tamanho, latência, memória)",
        "why": "A intuição errou neste caso"
      },
      {
        "wrong": "Segredos no repositório",
        "right": "Arquivo fora do repo / variável / *secret*",
        "why": "Repositório público"
      },
      {
        "wrong": "`",
        "right": "",
        "why": "true` no build"
      }
    ],
    "fillBlanks": [
      {
        "id": "mk-a10-q3",
        "title": "Complete a regra ou o trecho de código",
        "prompt": "Preencha a lacuna exatamente como no código do estudo de caso.",
        "segments": [
          {
            "kind": "text",
            "value": "Para remover uma coluna sem derrubar o sistema, o primeiro deploy "
          },
          {
            "kind": "blank",
            "id": "mk-a10-q3-b1",
            "accepted": [
              "para",
              "deixa",
              "pára"
            ],
            "placeholder": "digite aqui"
          },
          {
            "kind": "text",
            "value": " de usar a coluna no código, e só o segundo remove a coluna no banco."
          }
        ],
        "explanation": "Durante a troca, a versão antiga ainda roda e pode precisar da coluna. Só depois que nenhuma versão em execução a usa é que a migração a remove."
      }
    ],
    "quizzes": [
      {
        "id": "mk-a10-q1",
        "question": "No Dockerfile, as dependências são copiadas e instaladas antes de copiar o código. Qual é a vantagem?",
        "options": [
          {
            "text": "A imagem fica menor.",
            "whyNot": "O tamanho final é parecido; o ganho é de tempo de build."
          },
          {
            "text": "Se só o código mudou, a camada pesada de instalação é reaproveitada e o build é rápido."
          },
          {
            "text": "As dependências ficam mais seguras.",
            "whyNot": "Segurança não depende da ordem das instruções."
          },
          {
            "text": "O Python executa mais rápido.",
            "whyNot": "A velocidade de execução não muda."
          }
        ],
        "correctIndex": 1,
        "explanation": "O Docker guarda cada camada. Mudar só o código invalida só as camadas depois dele; a instalação de dependências (lenta) é reaproveitada."
      },
      {
        "id": "mk-a10-q2",
        "question": "É mais seguro subir a aplicação nova primeiro e rodar a migração do banco depois, para que o sistema fique fora do ar o menor tempo possível.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "Migrar antes significa que, se a migração falhar, o deploy para e a versão antiga continua no ar. Subir a nova com o banco velho a derrubaria."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "Migrar antes significa que, se a migração falhar, o deploy para e a versão antiga continua no ar. Subir a nova com o banco velho a derrubaria."
      },
      {
        "id": "mk-a10-q4",
        "question": "O script de backup grava em arquivo temporário, valida com pg_restore --list e só então renomeia. O que isso garante, e o que NÃO garante?",
        "options": [
          {
            "text": "Garante que o backup restaura perfeitamente.",
            "whyNot": "A listagem não restaura nada; só confere a estrutura do arquivo."
          },
          {
            "text": "Garante que o arquivo é legível e que um dump quebrado não vira o último backup; não prova que a restauração funciona nem protege contra perda da VM."
          },
          {
            "text": "Garante que o backup está fora da máquina.",
            "whyNot": "O backup fica em uma pasta da mesma VM (shared/backups)."
          },
          {
            "text": "Não garante nada, é só uma formalidade.",
            "whyNot": "Evita um erro real: um dump pela metade ser tratado como válido."
          }
        ],
        "correctIndex": 1,
        "explanation": "Validar a listagem pega arquivos truncados ou corrompidos. Mas só um teste de restauração prova que os dados voltam, e como o arquivo fica na própria VM, uma perda da VM leva o banco e o backup juntos."
      }
    ],
    "flashcards": [
      {
        "front": "Por que dependências antes do código no Dockerfile?",
        "back": "Cache de camadas"
      },
      {
        "front": "mem_limit é...",
        "back": "Um teto de proteção, não uma reserva"
      },
      {
        "front": "Por que migrar antes de subir a app?",
        "back": "Se a migração falhar, a versão antiga continua no ar"
      },
      {
        "front": "Remover uma coluna exige...",
        "back": "Duas etapas (parar de usar; depois remover)"
      },
      {
        "front": "Por que apagar a chave SSH no fim do workflow?",
        "back": "Mesmo se o job falhar, a chave não fica no runner"
      },
      {
        "front": "O que prova que um backup funciona?",
        "back": "Um teste de restauração"
      },
      {
        "front": "Mediana x média",
        "back": "A mediana não é distorcida pelos picos"
      }
    ],
    "threeThings": [
      "A ordem do deploy é segurança: migre antes, remova colunas em duas etapas e tenha uma saída (rollback).",
      "Backup que nunca foi restaurado é uma esperança: valide e teste a restauração, fora da máquina.",
      "Meça antes de decidir: tamanho, latência e memória decidiram o que o palpite teria errado."
    ]
  },
  "modulo-6-juridico-fiscal-operacao": {
    "slug": "modulo-6-juridico-fiscal-operacao",
    "code": "A11",
    "title": "Jurídico, fiscal e operação: o que resolver antes de cobrar de alguém",
    "oneSentence": "software pronto não é negócio pronto: antes de cobrar, alguém precisa responder quem é a empresa, como emite nota, o que promete, o que faz com os dados e o que acontece quando o cliente desiste.",
    "guideQuestion": "o código está pronto. O que mais precisa existir para que você possa, de verdade, receber dinheiro de um cliente e repassar a um lojista?",
    "metaNote": "90 min · Estudo de caso MySuperStore",
    "predict": [
      {
        "question": "Na Aula 7 vimos que, para um lojista sem conta no provedor, o dinheiro cai na conta da plataforma e o repasse fica PENDING até um PIX de saída. Do ponto de vista jurídico, o que esse desenho cria?",
        "answer": "Uma questão regulatória séria. A plataforma passa a segurar dinheiro de terceiros por um intervalo. Isso pode ter implicações de regulação de pagamentos ⚖️. O desenho que evita isso é o split nativo do provedor, no qual o dinheiro"
      },
      {
        "question": "O pedido guarda o endereço, o IP e a resposta completa do provedor (raw_response). Quais desses são dados pessoais?",
        "answer": "Os três, em geral: endereço (identifica a pessoa), IP (pode identificar, portanto é dado pessoal) e a resposta do provedor (costuma conter nome, documento e dados da transação). ⚖️"
      },
      {
        "question": "O texto de venda diz: *\"construa um marketplace que vai gerar RENDA\"*. Qual é o risco?",
        "answer": "Propaganda enganosa. Garantir resultado financeiro que você não pode comprovar é um dos pontos mais litigiosos de cursos e produtos digitais ⚖️ ([Migalhas](https://www.migalhas.com.br/depeso/401936/decisao-que-responsabilizou-influenciadora-por-publicidade-enganosa))."
      },
      {
        "question": "O cliente comprou online e desistiu 3 dias depois. A plataforma é obrigada a devolver o dinheiro?",
        "answer": "Em regra, sim: o Código de Defesa do Consumidor prevê 7 dias para desistir de compras feitas fora do estabelecimento (art. 49), em geral aplicados também a compras online ⚖️ *(confirme em fonte primária: nesta pesquisa eu só achei fontes secundárias)*."
      }
    ],
    "coreSections": [
      {
        "heading": "1. O modelo mental: abrir a loja é diferente de construir a loja",
        "paragraphs": [
          "Construir o prédio (o software) é uma coisa. Abrir a loja é outra: alvará, nota fiscal, contrato com os lojistas, regras de troca e o cuidado com os dados de quem entra. Nenhum teste automatizado verifica isso.",
          "Quem responde o quê"
        ],
        "codeBlocks": [
          {
            "title": "Código (mermaid)",
            "code": "flowchart TD\n  A[\"Código pronto\"] --> B[\"Empresa e enquadramento\"]\n  A --> C[\"Nota fiscal e tributos\"]\n  A --> D[\"Termos e política de reembolso\"]\n  A --> E[\"Dados pessoais (LGPD)\"]\n  A --> F[\"Dinheiro de terceiros\"]\n  B & C & D & E & F --> G[\"Pronto para cobrar\"]"
          }
        ],
        "table": {
          "headers": [
            "Tema",
            "Quem responde",
            "O que você leva pronto"
          ],
          "rows": [
            [
              "Tipo de empresa, CNAE, regime tributário, ISS, nota",
              "Contador",
              "O fluxo do dinheiro (Aula 1) e uma lista do que a plataforma cobra"
            ],
            [
              "Termos de uso, política de reembolso, responsabilidade, LGPD, enquadramento regulatório",
              "Advogado",
              "Os fluxos reais (Aulas 5 a 7) e o mapa de dados"
            ],
            [
              "O que prometer, a que preço, a quem vender",
              "Você",
              "A conta honesta (Aula 1) e as hipóteses testadas"
            ]
          ]
        }
      },
      {
        "heading": "2. Empresa e nota fiscal ⚖️",
        "paragraphs": [
          "O que o código faz: calcula a comissão de cada sub-pedido (SubOrder.commission) e registra uma CommissionEntry. Isso diz quanto a plataforma ganha, mas não emite nota de nada.",
          "Perguntas para o contador (leve por escrito):",
          "1. Qual CNAE descreve a atividade de intermediar vendas na internet, e ele é compatível com o meu enquadramento atual? *(Não verifiquei CNAE de marketplace em fonte oficial; não vou chutar um código.)* 2. A plataforma emite nota da comissão (serviço de intermediação)? Em qual município? Qual a alíquota de ISS? 3. Quem emite a nota da venda do produto: o lojista, para o cliente? Como o sistema precisa mostrar isso (o SubOrder já tem o campo invoice_link, em orders/models.py:89). 4. Qual é o regime tributário mais adequado para o meu faturamento esperado, e o que muda se a comissão passar de certo valor? 5. Como contabilizar o dinheiro que entra para repasse (não é receita, é passivo)?",
          "💡 Por quê a pergunta 5 importa para quem programa? O dinheiro do lojista que passa pela sua conta não é seu faturamento. É o conceito de GMV x receita da Aula 1, agora com consequência tributária: se tudo for tratado como receita, você pode ser tributado sobre dinheiro que nunca foi seu. ⚖️ (Por isso o modelo de dados separa seller_amount e commission.)"
        ]
      },
      {
        "heading": "3. Dinheiro de terceiros ⚖️",
        "paragraphs": [
          "Voltando ao código da Aula 7 (payments/processing.py:57-88):",
          "💡 Por quê levar isso ao advogado agora e não depois? Porque é uma decisão de arquitetura que pode ter consequência regulatória. Se a resposta for \"não pode\", o sistema precisa exigir conta no provedor para todo lojista (e o ramo PENDING deixa de existir); mudar isso depois de ter lojistas é muito mais caro. Pergunte antes de ter volume.  *(O código foi escrito para funcionar nas duas situações. Isso é uma flexibilidade técnica, não uma resposta jurídica.)*"
        ],
        "table": {
          "headers": [
            "Situação",
            "Quem tem o dinheiro",
            "Questão a perguntar"
          ],
          "rows": [
            [
              "Lojista com conta no provedor (split nativo)",
              "O provedor divide no pagamento; a plataforma só recebe a comissão",
              "Em geral é o desenho que evita a custódia ⚖️"
            ],
            [
              "Loja da casa",
              "A plataforma (é dela)",
              "Sem questão de terceiros"
            ],
            [
              "Lojista sem conta (PENDING + PIX de saída)",
              "O dinheiro cai na conta da plataforma e é repassado depois",
              "A plataforma segura dinheiro de terceiros: ⚖️ isso é permitido para você?"
            ]
          ]
        }
      },
      {
        "heading": "4. Dados pessoais (LGPD) ⚖️",
        "paragraphs": [
          "4.1 Onde o sistema guarda dado pessoal (verificado no código)",
          "4.2 Perguntas que a LGPD pede que você saiba responder ⚖️",
          "1. Para quê guardo cada dado (finalidade)? Qual a base legal? 2. Por quanto tempo (retenção)? O sistema tem uma regra que apaga ou anonimiza? 3. Quem acessa? Há controle de acesso por papel (sim: Aula 9) e trilha de quem acessou? 4. Como o titular pede acesso, correção ou exclusão? Existe um caminho? 5. E se houver vazamento? Quem avisa, quando e a quem?",
          "💡 Por quê o conflito mais interessante é \"apagar a conta\" x \"guardar o pedido\"? O pedido tem obrigações (fiscal, disputa, estorno) que podem exigir guardar dados mesmo depois do pedido de exclusão. O desenho do código (SET_NULL) já sugere uma saída: desvincular a conta e manter o pedido com o mínimo necessário. ⚖️ Qual é o mínimo e por quanto tempo é uma pergunta para o advogado.",
          "✅ O que já protege, tecnicamente: o cartão nunca chega ao seu servidor (tokenização, Aula 5), então o seu banco não tem cartões para vazar; segredos ficam fora do repositório; as permissões são impostas no servidor."
        ],
        "table": {
          "headers": [
            "Onde",
            "O que",
            "Observação"
          ],
          "rows": [
            [
              "Order.address_* (orders/models.py:43-51)",
              "Endereço completo de entrega",
              "Snapshot (Aula 2): fica no pedido mesmo se o usuário mudar o perfil"
            ],
            [
              "Order.ip_address (:59)",
              "IP de quem comprou",
              "IP pode identificar uma pessoa ⚖️"
            ],
            [
              "Payment.raw_response (payments/models.py:44)",
              "Resposta completa do provedor",
              "Costuma conter nome, documento e dados da transação: verifique o que é guardado"
            ],
            [
              "Order.user com SET_NULL (orders/models.py:40)",
              "Vínculo com a conta",
              "Apagar a conta não apaga o pedido (a Aula 2 explica por quê)"
            ],
            [
              "Notificações, chat e mensagens",
              "Conteúdo de conversas",
              "Conteúdo livre pode ter dado sensível"
            ]
          ]
        }
      },
      {
        "heading": "5. Termos, reembolso e a venda online ⚖️",
        "paragraphs": [
          "5.1 O que o código já suporta (e a política precisa casar com ele)",
          "💡 Por quê a política precisa \"casar\" com o código? Uma política que promete o que o sistema não consegue (por exemplo, \"estorno parcial no cartão\") vira reclamação. E um sistema que faz o que a política não prevê vira disputa. Código e texto jurídico precisam ser escritos juntos.",
          "5.2 Direito de arrependimento ⚖️",
          "O CDC prevê 7 dias para desistir de compras feitas fora do estabelecimento (art. 49), em geral aplicado também ao comércio online. O sistema já tem ReturnReason.REMORSE (\"Arrependimento (7 dias)\", orders/models.py:127-131), o que mostra que o desenho considerou isso. Confirme o prazo, as exceções e quem arca com o frete com um advogado."
        ],
        "table": {
          "headers": [
            "Capacidade técnica",
            "Onde",
            "O que a política precisa dizer"
          ],
          "rows": [
            [
              "Estorno total ou parcial",
              "payments/refunds.py",
              "Em que casos e em que prazo se devolve"
            ],
            [
              "Devolução por item",
              "orders/views.py:111-224 (ReturnRequest: remorso, defeito, errado, atraso)",
              "Quem paga o frete de volta; condições do produto"
            ],
            [
              "Cartão só estorno integral",
              "refunds.py:57-61",
              "Como explicar isso ao cliente"
            ],
            [
              "Cancelamento por expiração (60 min)",
              "orders/tasks.py",
              "Que o pedido não pago some, e o estoque volta"
            ]
          ]
        }
      },
      {
        "heading": "6. O que prometer (e o que não) ⚖️",
        "paragraphs": [
          "A promessa de resultado financeiro é o ponto que mais gera processo em produtos digitais. Há decisões que analisaram cursos com promessas de ganho como publicidade enganosa ([Migalhas](https://www.migalhas.com.br/depeso/401936/decisao-que-responsabilizou-influenciadora-por-publicidade-enganosa), [Migalhas, regulamentações](https://www.migalhas.com.br/depeso/405184/direito-do-consumidor-e-publicidade-enganosa-regulamentacoes)), e uma cláusula nos termos não apaga uma promessa destacada na propaganda ([Estado de Minas](https://www.em.com.br/emfoco/?p=255069))."
        ],
        "table": {
          "headers": [
            "❌ Risco",
            "✅ Honesto"
          ],
          "rows": [
            [
              "\"Seu marketplace vai gerar renda\"",
              "\"Aprenda a construir um marketplace e a calcular a margem de cada pedido\""
            ],
            [
              "\"Fature R$ X por mês\"",
              "\"Simule a sua margem com os seus números (não é garantia de resultado)\""
            ],
            [
              "\"Melhor plataforma do Brasil\"",
              "O que é verificável: \"split nativo, estorno com teto, testes de concorrência\""
            ],
            [
              "Depoimentos inventados",
              "Depoimentos reais, com autorização"
            ],
            [
              "\"Sem risco\"",
              "Os riscos reais: demanda, regulação, concorrência"
            ]
          ]
        }
      },
      {
        "heading": "7. Operação: o que acontece depois de cobrar",
        "paragraphs": [],
        "table": {
          "headers": [
            "Situação",
            "O que precisa existir"
          ],
          "rows": [
            [
              "Cliente reclama de um lojista",
              "Canal de suporte e regra de quem decide (a plataforma, o lojista?)"
            ],
            [
              "Disputa de cartão (chargeback)",
              "Prova: o raw_response e o histórico do pedido (Aula 2) são a evidência"
            ],
            [
              "Lojista não envia",
              "Prazo, aviso e consequência (estorno automático?)"
            ],
            [
              "Pagamento que chega depois do cancelamento",
              "A regra da Aula 6 (pagamento órfão) e um fluxo de estorno"
            ],
            [
              "Vazamento ou incidente",
              "Plano de comunicação ⚖️"
            ],
            [
              "Sistema fora do ar",
              "Backup testado, rollback, alerta (Aula 10)"
            ]
          ]
        }
      },
      {
        "heading": "9. 🧪 Mão na massa",
        "paragraphs": [
          "E1 — Mapa de dados (30 min)",
          "Monte a tabela para os cinco lugares da seção 4.1. Para cada um: finalidade, por quanto tempo guardar (proposta), quem acessa e o que apagar/anonimizar se o usuário pedir exclusão.",
          "E2 — Onde o dinheiro de terceiros fica parado? (20 min)",
          "Usando o código (Aula 7), responda: (1) em que momento exato o dinheiro de um lojista sem conta entra na conta da plataforma? (2) em que momento sai? (3) quanto tempo, no máximo, pode ficar parado (considere a tarefa de 30 minutos e falhas do provedor)?",
          "(1) No pagamento: o valor inteiro cai na conta master (processing.py:57-67, comentário \"o valor inteiro cai na conta master\"). (2) No PIX de saída do settle_payout, na rodada da tarefa (a cada 30 min) ou logo após a confirmação (dispatch_post_payment_tasks tenta na hora). (3) Sem limite superior no código: se o provedor falhar, ou a chave PIX do lojista estiver ausente, ou o repasse ficar preso em PROCESSING (Aula 7), o dinheiro continua retido. Essa ausência de prazo máximo e de alerta é o que mais interessa a um advogado.",
          "E3 — Reescreva a promessa (15 min)",
          "Reescreva cinco frases de venda (do seu curso ou do seu marketplace) trocando a promessa por algo verificável.",
          "\"Ganhe dinheiro vendendo online\" → \"Veja, com os seus números, quantos pedidos por mês cobrem os seus custos.\" · \"Plataforma 100% segura\" → \"O cartão nunca passa pelo nosso servidor, e as regras de acesso são testadas.\" · \"Você vai aprender tudo\" → \"Nove módulos com código real e exercícios corrigidos.\" · \"Resultados garantidos\" → \"Certificado de conclusão de curso livre, com critérios publicados.\" · \"Todos os nossos alunos ganham dinheiro\" → *(não escreva isso sem prova; omita)*.",
          "E4 — Perguntas para o contador e o advogado ★★★ (30 min)",
          "Escreva 10 perguntas objetivas (5 para cada), no formato situação → decisão que preciso tomar. Ex.: \"Eu recebo R$ 100, repasso R$ 88 ao lojista; o que entra na minha receita para fins de imposto?\"",
          "Contador: (1) Qual CNAE e regime se aplicam à intermediação? (2) A comissão tem ISS em qual município? (3) Como contabilizar o valor dos repasses? (4) A plataforma emite nota da comissão? (5) O que muda no regime se o faturamento passar de X? Advogado: (1) Posso manter o ramo \"recebe e repassa depois\", ou preciso exigir conta no provedor? (2) Qual a minha responsabilidade perante o consumidor pelos lojistas? (3) Quais cláusulas devo ter nos termos para lojistas (comissão, cupom, devolução)? (4) Qual o texto mínimo da política de reembolso e de privacidade? (5) Qual o prazo de retenção de dados por tipo? *(Cada pergunta nasce de uma decisão que o código já força você a tomar.)*",
          "E5 — Desafio ★★★: o prazo de arrependimento no código",
          "O código tem o rótulo REMORSE mas não impõe o prazo. Desenhe a regra: (1) a partir de que data conta (confirmação? entrega?) ⚖️; (2) onde colocar a validação; (3) como testar; (4) o que fazer fora do prazo.",
          "(1) Defina com o advogado: a lei costuma contar da assinatura do contrato ou do recebimento, o que se traduz em delivered_at/dispatched_at ⚖️ (o SubOrder só tem dispatched_at, então talvez falte um campo de entrega confirmada). (2) No create do ReturnRequestViewSet (orders/views.py:129-156), junto das outras validações, só para reason == \"remorse\". (3) Teste que cria um sub-pedido delivered há 8 dias e afirma que o remorse é recusado, e outro há 6 dias que é aceito (falha antes, passa depois). (4) Fora do prazo, não recusar o motivo \"defeito\" (\"defect\"): a lei trata vício de outra forma ⚖️; só o arrependimento tem o prazo curto."
        ],
        "table": {
          "headers": [
            "Dado",
            "Finalidade",
            "Retenção (proposta)",
            "Quem acessa",
            "Se o titular pedir exclusão"
          ],
          "rows": [
            [
              "Endereço do pedido",
              "Entregar e provar a entrega",
              "Enquanto houver obrigação fiscal/disputa ⚖️",
              "Lojista do sub-pedido, suporte",
              "Manter o necessário, anonimizar o resto depois do prazo"
            ],
            [
              "IP do pedido",
              "Antifraude, auditoria",
              "Prazo curto (definir)",
              "Suporte/segurança",
              "Apagar ao fim do prazo"
            ],
            [
              "raw_response",
              "Prova em disputa de pagamento",
              "Prazo da disputa",
              "Financeiro",
              "Reduzir ao mínimo; não guardar o que não precisa"
            ],
            [
              "Vínculo Order.user",
              "Histórico do cliente",
              "Até a exclusão da conta",
              "O próprio usuário",
              "SET_NULL (já é o desenho)"
            ],
            [
              "Chat",
              "Atendimento",
              "Prazo do atendimento",
              "Participantes",
              "Apagar ou anonimizar"
            ]
          ]
        }
      }
    ],
    "breakExperiment": {
      "title": "Experimento: Quebre a regra na prática",
      "setup": "Experimento: o texto que o sistema não cumpre. Escreva três frases da sua política de reembolso. Para cada uma, abra o código e responda: o sistema consegue fazer isso hoje? Onde?",
      "whatHappens": "Lição: a segunda linha mostra um rótulo (REMORSE) que parece uma regra mas não é: o código não calcula \"7 dias\". Política que promete prazo precisa de código que o aplique (ou de processo manual que o faça). *(Pelo que li em orders/views.py:129-156, a criação da devolução só confere que o item é do usuário e que o sub-pedido está delivered/shipped; não há comparação de datas.)*",
      "lessonLearned": "A camada de proteção do MySuperStore impede exatamente essa falha."
    },
    "pitfalls": [],
    "fillBlanks": [],
    "quizzes": [
      {
        "id": "mk-a11-q1",
        "question": "No MySuperStore, qual situação faz a plataforma segurar dinheiro de terceiros por algum tempo?",
        "options": [
          {
            "text": "Lojista com conta no provedor (split nativo).",
            "whyNot": "No split nativo o provedor divide no pagamento; a plataforma só recebe a comissão."
          },
          {
            "text": "A loja da casa.",
            "whyNot": "O dinheiro da loja da casa já é da plataforma."
          },
          {
            "text": "Lojista sem conta: o valor cai na conta da plataforma e o repasse fica pendente até o PIX de saída."
          },
          {
            "text": "Nenhuma: o dinheiro vai sempre direto ao lojista.",
            "whyNot": "Isso só vale para quem tem conta no provedor."
          }
        ],
        "correctIndex": 2,
        "explanation": "Sem conta no provedor não há split nativo: o valor inteiro cai na conta master e o Payout fica PENDING até o PIX de saída. É a situação que pede avaliação jurídica sobre custódia de recursos de terceiros."
      },
      {
        "id": "mk-a11-q2",
        "question": "Como o sistema tem o motivo 'Arrependimento (7 dias)', ele já impede automaticamente devoluções por arrependimento depois de 7 dias.",
        "options": [
          {
            "text": "Verdadeiro",
            "whyNot": "REMORSE é só um rótulo (ReturnReason). A criação da devolução confere o dono do item e o status do sub-pedido, mas não compara datas. Se a política promete um prazo, o código ou um processo manual precisa aplicá-lo."
          },
          {
            "text": "Falso"
          }
        ],
        "correctIndex": 1,
        "explanation": "REMORSE é só um rótulo (ReturnReason). A criação da devolução confere o dono do item e o status do sub-pedido, mas não compara datas. Se a política promete um prazo, o código ou um processo manual precisa aplicá-lo."
      },
      {
        "id": "mk-a11-q3",
        "question": "Qual destas frases de venda de um curso ou de um marketplace é a mais segura do ponto de vista jurídico?",
        "options": [
          {
            "text": "Seu marketplace vai gerar renda já no primeiro mês.",
            "whyNot": "Promete resultado e prazo que não se pode comprovar."
          },
          {
            "text": "Simule a margem de cada pedido com os seus números; o resultado depende do seu negócio."
          },
          {
            "text": "Garantimos o retorno do seu investimento.",
            "whyNot": "Garantia de retorno é promessa explícita de resultado."
          },
          {
            "text": "Todos os nossos alunos já faturam alto.",
            "whyNot": "Afirmação de resultado dos alunos sem prova (e generalizada) é risco claro."
          }
        ],
        "correctIndex": 1,
        "explanation": "Descreve uma ferramenta verificável e avisa que o resultado depende do negócio. As demais prometem resultado financeiro, ponto sensível de propaganda enganosa."
      }
    ],
    "flashcards": [
      {
        "front": "Quem responde sobre CNAE e nota?",
        "back": "O contador"
      },
      {
        "front": "Quem responde sobre termos, reembolso e custódia?",
        "back": "O advogado"
      },
      {
        "front": "Por que o ramo PENDING preocupa?",
        "back": "A plataforma segura dinheiro de terceiros ⚖️"
      },
      {
        "front": "IP é dado pessoal?",
        "back": "Pode ser (identifica uma pessoa) ⚖️"
      },
      {
        "front": "Rótulo x regra",
        "back": "REMORSE é rótulo: o prazo precisa de código ou processo"
      },
      {
        "front": "O que não prometer",
        "back": "Renda, retorno, \"garantido\""
      },
      {
        "front": "Política de reembolso",
        "back": "Escrita junto com o código"
      }
    ],
    "threeThings": [
      "Código pronto não é negócio pronto: contador, advogado e você têm perguntas diferentes, e cada uma nasce de uma decisão que o código já força.",
      "Dinheiro e dados de terceiros pedem avaliação jurídica antes de ter volume, quando mudar custa pouco.",
      "Nunca prometa o que não pode provar, e escreva a política junto do código."
    ]
  },
  "modulo-7-projeto-final-certificado": {
    "slug": "modulo-7-projeto-final-certificado",
    "code": "Projeto Final",
    "title": "Projeto final: o seu mini-marketplace com testes que provam o dinheiro",
    "oneSentence": "juntar o que você aprendeu em um pacote pequeno, testado, e acompanhar com um documento honesto.",
    "guideQuestion": "você consegue provar, com testes e com um documento honesto, que o seu marketplace não perde, não duplica e não promete o que não pode cumprir?",
    "metaNote": "360 min · Estudo de caso MySuperStore",
    "predict": [],
    "coreSections": [
      {
        "heading": "1. O que você entrega",
        "paragraphs": [],
        "table": {
          "headers": [
            "Parte",
            "O que é",
            "Peso"
          ],
          "rows": [
            [
              "A. Código",
              "Um pacote minimarket/ que passa nos testes de aceitação",
              "40"
            ],
            [
              "B. Documento",
              "Decisões, hipóteses de negócio e checklist legal",
              "35"
            ],
            [
              "C. Apresentação",
              "5 a 8 minutos explicando por que o sistema é seguro e onde ainda é frágil",
              "15"
            ],
            [
              "D. Evidência",
              "Resultado dos testes, medidas e o histórico de commits",
              "10"
            ]
          ]
        }
      },
      {
        "heading": "2. Parte A: o pacote minimarket/",
        "paragraphs": [
          "Crie uma pasta minimarket/ com os módulos e as funções abaixo. Você já escreveu quase tudo nos laboratórios; o projeto pede para reunir, completar e provar.",
          "As três extensões (as lacunas reais do módulo)",
          "Como validar",
          "São 13 testes: margem (com conservação em 200 casos sorteados), rateio, última peça com 8 compradores, ordem das travas, os cenários do webhook, 20 avisos simultâneos, pedido cancelado, estorno com timeout, expiração com cupom e um fluxo completo de duas lojas (do preço ao estorno).",
          "💡 Por quê \"testes de aceitação\" e não só os dos laboratórios? Os laboratórios provam cada peça. A aceitação prova que as peças se encaixam e que as invariantes (o dinheiro fecha, a peça não vende duas vezes, o aviso não confirma duas vezes) valem no conjunto."
        ],
        "codeBlocks": [
          {
            "title": "Código (bash)",
            "code": "cd modulo-marketplace/projeto\npython testes_aceitacao.py caminho/para/a/pasta/que/contem/minimarket"
          }
        ],
        "table": {
          "headers": [
            "Módulo",
            "Funções e classes (nomes obrigatórios)",
            "Vem de"
          ],
          "rows": [
            [
              "dinheiro.py",
              "calcular_pedido(subtotal, desconto, frete, metodo, ...), pedidos_para_equilibrio(...)",
              "Lab 1"
            ],
            [
              "cupom.py",
              "ratear_desconto(desconto, subtotais)",
              "Lab 3"
            ],
            [
              "estoque.py",
              "preparar, comprar, disputar, estoque_atual, ordem_de_travas(skus)",
              "Lab 4 + extensão"
            ],
            [
              "pagamento.py",
              "validar_webhook, Pedido (com pagamentos_orfaos), confirmar_pagamento",
              "Lab 6 + extensão"
            ],
            [
              "estorno.py",
              "ErroEstorno, ProvedorFalso, Pagamento, estornar",
              "Lab 7"
            ],
            [
              "expiracao.py",
              "precisa_lembrete, deve_cancelar, expirar(pedidos, estoque, cupons=None)",
              "Lab 8 + extensão"
            ]
          ]
        }
      },
      {
        "heading": "3. Parte B: o documento (3 a 5 páginas)",
        "paragraphs": [
          "Entregue um único arquivo DOCUMENTO.md com as quatro seções:",
          "B1. Três decisões (formato do arquivo 04, \"ADR\")",
          "Para três decisões do seu projeto, escreva: Contexto → Decisão → Ganho → Custo → Alternativa descartada → Evidência (arquivo e teste). Pelo menos uma deve ser uma decisão em que você escolheu não fazer algo.",
          "B2. O negócio, com as suas hipóteses",
          "- A tabela de cinco hipóteses da Aula 1 (E4), preenchida. - O ponto de equilíbrio calculado com o seu pedidos_para_equilibrio. - Qual hipótese, se errada, mais muda a conclusão? E qual o teste mais barato para ela? - ⚠️ Sem promessa de renda. Mostre a conta e as suposições.",
          "B3. O checklist \"antes de cobrar\" (Aula 11)",
          "Preencha a tabela da seção 12 da Aula 11 com responsável e estado (feito, pendente, não se aplica) e uma frase de justificativa.",
          "B4. Onde o seu sistema ainda é frágil",
          "Liste cinco fragilidades reais do seu projeto, ordenadas por risco, cada uma com o plano e o gatilho (quando você a corrigiria). Honestidade aqui vale mais do que um sistema \"perfeito\"."
        ]
      },
      {
        "heading": "4. Parte C: a apresentação (5 a 8 min)",
        "paragraphs": [
          "🎬 Vídeo — Como entregar o projeto (5 min)",
          "Roteiro da sua apresentação (use esta estrutura):"
        ],
        "codeBlocks": [
          {
            "title": "Código (video)",
            "code": "id: mk-projeto-v1\ntitulo: \"Como entregar o projeto final\"\ntipo: resumo\nduracao_min: 5\nstatus: roteiro-pronto\nurl: \"\"\nlegenda_arquivo: \"\"\ncapitulos:\n  - { tempo: \"0:00\", titulo: \"Os testes\" }\n  - { tempo: \"1:00\", titulo: \"As invariantes\" }\n  - { tempo: \"2:15\", titulo: \"As extensões\" }\n  - { tempo: \"3:30\", titulo: \"O documento\" }\n  - { tempo: \"4:30\", titulo: \"A entrega\" }\nnotebooklm: \"Resumo em Vídeo: o que o projeto final avalia e como entregar.\""
          }
        ],
        "table": {
          "headers": [
            "Tempo",
            "Na tela",
            "Fala"
          ],
          "rows": [
            [
              "0:00",
              "Resultado dos 13 testes em verde",
              "\"Treze testes passando. Mas o que cada um prova? É isso que a banca quer ouvir.\""
            ],
            [
              "1:00",
              "As três invariantes",
              "\"O dinheiro fecha. A peça não vende duas vezes. O aviso não confirma duas vezes. Cada uma tem um teste.\""
            ],
            [
              "2:15",
              "As três extensões",
              "\"O pagamento órfão, o cupom que volta e a ordem das travas: três lacunas reais e como foram fechadas.\""
            ],
            [
              "3:30",
              "O documento: decisões e fragilidades",
              "\"Duas partes decidem a nota: o que você escolheu e por quê, e onde ainda é frágil.\""
            ],
            [
              "4:30",
              "Chamada para ação",
              "\"Rode a aceitação, escreva o documento e grave a sua apresentação de cinco minutos.\""
            ]
          ]
        }
      },
      {
        "heading": "5. Parte D: a evidência",
        "paragraphs": [
          "- A saída completa de python testes_aceitacao.py (13 testes, OK). - A saída de python testes.py do laboratório (os 6 laboratórios com os seus arquivos, sem erros). - Um teste seu, a mais, que falhou antes e passou depois (cole o antes e o depois). - O histórico de commits, mostrando a evolução (sem um commit único gigante)."
        ]
      },
      {
        "heading": "6. Rubrica (100 pontos)",
        "paragraphs": [
          "*Soma: A = 30 + 10 = 40 · B = 15 + 10 + 5 + 5 = 35 · C = 15 · D = 10 → 100.*",
          "Nota para o certificado: veja a seção \"Critérios de aprovação\" do README.md do módulo."
        ],
        "table": {
          "headers": [
            "Critério",
            "Pontos",
            "Excelente (100% do critério)",
            "Insuficiente (0 a 30%)"
          ],
          "rows": [
            [
              "Correção (testes de aceitação)",
              "30",
              "13 de 13 passando; as extensões implementadas pela regra, não \"para passar\"",
              "Falhas nas invariantes (dinheiro, estoque, confirmação)"
            ],
            [
              "Testes próprios",
              "10",
              "Um teste extra que falhou antes; testa concorrência com latência",
              "Só os testes fornecidos"
            ],
            [
              "Decisões (B1)",
              "15",
              "Contexto, custo e alternativa descartada, com evidência no código",
              "Só descreve o que fez"
            ],
            [
              "Negócio honesto (B2)",
              "10",
              "Hipóteses explícitas, equilíbrio calculado, sem promessa de renda",
              "Afirma resultados sem conta"
            ],
            [
              "Legal e fiscal (B3)",
              "5",
              "Responsáveis e perguntas certas; nada de texto jurídico inventado",
              "Copia termos de outro site"
            ],
            [
              "Fragilidades (B4)",
              "5",
              "Cinco reais, ordenadas por risco, com plano e gatilho",
              "Diz que \"não há\""
            ],
            [
              "Apresentação (C)",
              "15",
              "Mostra um teste falhando e passando; explica o porquê",
              "Lê o documento"
            ],
            [
              "Evidência (D)",
              "10",
              "Saídas completas, um teste \"falhou antes\", commits que contam a evolução",
              "Sem prova, só texto"
            ]
          ]
        }
      },
      {
        "heading": "7. 🎁 Trilha de contribuição (opcional): leve para o sistema real",
        "paragraphs": [
          "Cada extensão do projeto tem um equivalente no código real do MySuperStore. Quem quiser pode abrir pull requests (cada um com um teste que falha antes e passa depois):",
          "⚠️ O repositório do MySuperStore é público e publica sozinho a cada merge na master. Contribua por branch e pull request, sem fazer merge sem revisão, e sem colocar segredos ou dados reais em testes."
        ],
        "table": {
          "headers": [
            "#",
            "Melhoria no sistema real",
            "Onde",
            "Aula"
          ],
          "rows": [
            [
              "1",
              "Travar variantes em ordem fixa (sorted)",
              "orders/serializers.py:168-169",
              "4"
            ],
            [
              "2",
              "Recusar confirmação de pedido cancelled e estornar o valor",
              "payments/processing.py:26",
              "5, 6 (a recusa foi feita no PR 29; falta o estorno automático)"
            ],
            [
              "3",
              "Devolver o uso do cupom na expiração",
              "orders/tasks.py",
              "3, 8"
            ],
            [
              "4",
              "Recuperar repasses presos em PROCESSING",
              "payments/processing.py:101-182",
              "7"
            ],
            [
              "5",
              "Numeração de pedido sem colisão",
              "orders/serializers.py:171-176",
              "3"
            ],
            [
              "6",
              "Falhar com clareza em vez do PIX \"local\"",
              "payments/views.py:76-89",
              "5"
            ],
            [
              "7",
              "Alinhar a validade do PIX ao prazo de cancelamento",
              "settings/base.py (EFI_PIX_EXPIRACAO)",
              "5, 8 (feito no PR 29: a expiração espera o QR vencer)"
            ]
          ]
        }
      },
      {
        "heading": "8. Entrega",
        "paragraphs": [
          "1. A pasta minimarket/ e os seus testes. 2. DOCUMENTO.md. 3. O link (ou arquivo) da apresentação. 4. A pasta (ou colagem) com a evidência (seção 5).",
          "Prazo sugerido: 2 semanas depois da Aula 11."
        ]
      }
    ],
    "pitfalls": [],
    "fillBlanks": [],
    "quizzes": [],
    "flashcards": [],
    "threeThings": [
      "Um teste só vale se já o vimos falhar.",
      "O dinheiro precisa fechar, o estoque não pode duplicar e o aviso não pode confirmar duas vezes.",
      "Mostrar onde o sistema é frágil, com um plano, vale mais do que dizer que ele é perfeito."
    ]
  }
};
