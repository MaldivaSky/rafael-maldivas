/**
 * Complete catalog of 18 hands-on IDE coding labs (Python 3.12 + SQLite via Pyodide)
 * and the stateful HTTP / Webhook Simulator for the MySuperStore course.
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export interface CourseLabChallenge {
  slug: string;
  shortCode: string;
  language: "python" | "sql-py";
  filePath: string;
  title: string;
  objective: string;
  instructions: string[];
  starterCode: string;
  solutionCode: string;
  hints: [string, string, string];
  testRunnerCode: string;
}

export interface HttpLabProduct {
  id: string;
  title: string;
  sellerId: string;
  priceCents: number;
  stock: number;
}

export interface HttpLabOrder {
  orderId: string;
  txid: string;
  items: Array<{ productId: string; qty: number; unitPriceCents: number; sellerId: string }>;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  paidCents: number;
  refundedCents: number;
  status: "PENDING" | "PAID" | "PARTIAL_REFUND" | "REFUNDED";
}

export interface HttpSandboxState {
  products: Record<string, HttpLabProduct>;
  orders: Record<string, HttpLabOrder>;
  processedWebhookKeys: string[];
  sellerLedgerCents: Record<string, number>;
  platformRevenueCents: number;
  requestCount: number;
}

export interface HttpLabRequest {
  method: "GET" | "POST";
  path: string;
  headers: Record<string, string>;
  bodyText: string;
}

export interface HttpLabResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  diagnostic: string;
  nextState: HttpSandboxState;
}

export interface HttpLabScenario {
  id: string;
  label: string;
  lessonSlugs: string[];
  method: "GET" | "POST";
  path: string;
  headers: Record<string, string>;
  bodyText: string;
  explanation: string;
}

const PY_TEST_HARNESS = `
import json as _lab_json

def _emit_result(name, passed, detail=""):
    print("__TEST_RESULT__:" + _lab_json.dumps({
        "name": str(name),
        "passed": bool(passed),
        "detail": str(detail),
    }, ensure_ascii=False))
`;

export const COURSE_LABS: Record<string, CourseLabChallenge> = {
  "modulo-0-f01-o-mapa": {
    slug: "modulo-0-f01-o-mapa",
    shortCode: "F01",
    language: "python",
    filePath: "labs/f01_http_router.py",
    title: "Roteador HTTP Stateless (Cozinha & Garçom)",
    objective: "Implemente um roteador HTTP simples que respeita método + caminho e valida token de sessão sem estado global.",
    instructions: [
      "GET /health deve retornar status 200 e {'ok': True}.",
      "GET /orders sem header 'Authorization: Bearer token-ok' deve retornar status 401.",
      "GET /orders com token válido deve retornar status 200 e lista de pedidos.",
      "Qualquer outra rota deve retornar status 404 (Never 200 com erro!).",
    ],
    starterCode: `def handle_request(method: str, path: str, headers: dict[str, str]) -> tuple[int, dict]:
    # Normalize headers para case-insensitive ou consulte "Authorization"
    if method == "GET" and path == "/health":
        return 200, {"ok": True}

    # TODO: Implemente GET /orders com validação Bearer e 404 para rotas desconhecidas
    return 501, {"error": "nao implementado"}`,
    solutionCode: `def handle_request(method: str, path: str, headers: dict[str, str]) -> tuple[int, dict]:
    if method == "GET" and path == "/health":
        return 200, {"ok": True}
    if method == "GET" and path == "/orders":
        auth = headers.get("Authorization", "")
        if auth != "Bearer token-ok":
            return 401, {"error": "unauthorized"}
        return 200, {"orders": ["ord-101"]}
    return 404, {"error": "not_found"}`,
    hints: [
      "Leia `headers.get('Authorization', '')` e compare exatamente com `'Bearer token-ok'`.",
      "Quando não autenticado, retorne `(401, {'error': ...})` em vez de 200 ou 403.",
      "No final da função, o fallback para método/rota não mapeados deve ser `return 404, {'error': 'not_found'}`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    s, b = handle_request("GET", "/health", {})
    _emit_result("GET /health -> 200", s == 200 and b.get("ok") is True, f"got {s} {b}")
    s2, _ = handle_request("GET", "/orders", {})
    _emit_result("GET /orders sem token -> 401", s2 == 401, f"got {s2}")
    s3, b3 = handle_request("GET", "/orders", {"Authorization": "Bearer token-ok"})
    _emit_result("GET /orders autenticado -> 200", s3 == 200 and "orders" in b3, f"got {s3} {b3}")
    s4, _ = handle_request("POST", "/unknown", {})
    _emit_result("Rota inexistente -> 404", s4 == 404, f"got {s4}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-0-f02-preparando-a-bancada": {
    slug: "modulo-0-f02-preparando-a-bancada",
    shortCode: "F02",
    language: "python",
    filePath: "labs/f02_env_fail_closed.py",
    title: "Configuração Fail-Closed de Ambiente",
    objective: "Carregue variáveis obrigatórias de ambiente falhando imediatamente no boot se faltar segredo ou ALLOWED_HOSTS em produção.",
    instructions: [
      "Se DEBUG for False e SECRET_KEY estiver ausente/curta (< 16 chars), lance ValueError.",
      "Se DEBUG for False e ALLOWED_HOSTS estiver vazio após split/strip, lance ValueError.",
      "Retorne dicionário {'debug': bool, 'allowed_hosts': list[str], 'db_url': str}.",
    ],
    starterCode: `def load_runtime_config(env: dict[str, str]) -> dict:
    debug = env.get("DJANGO_DEBUG", "false").lower() == "true"
    secret = env.get("DJANGO_SECRET_KEY", "").strip()
    raw_hosts = env.get("ALLOWED_HOSTS", "")
    hosts = [h.strip() for h in raw_hosts.split(",") if h.strip()]
    db_url = env.get("DATABASE_URL", "").strip()

    # TODO: Aplique fail-closed quando debug == False e retorne config validada
    return {"debug": debug, "allowed_hosts": hosts, "db_url": db_url}`,
    solutionCode: `def load_runtime_config(env: dict[str, str]) -> dict:
    debug = env.get("DJANGO_DEBUG", "false").lower() == "true"
    secret = env.get("DJANGO_SECRET_KEY", "").strip()
    hosts = [h.strip() for h in env.get("ALLOWED_HOSTS", "").split(",") if h.strip()]
    db_url = env.get("DATABASE_URL", "").strip()

    if not debug:
        if len(secret) < 16:
            raise ValueError("SECRET_KEY fraca ou ausente em producao")
        if not hosts:
            raise ValueError("ALLOWED_HOSTS obrigatorio em producao")
    return {"debug": debug, "allowed_hosts": hosts, "db_url": db_url}`,
    hints: [
      "Use `if not debug:` para endurecer as regras apenas em ambiente de produção/staging.",
      "Valide `len(secret) < 16` e `if not hosts:` lançando `raise ValueError(...)`.",
      "Retorne o dicionário completo com as 3 chaves esperadas quando tudo estiver válido.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    ok_raised_secret = False
    try:
        load_runtime_config({"DJANGO_DEBUG": "false", "ALLOWED_HOSTS": "api.site.com"})
    except ValueError:
        ok_raised_secret = True
    _emit_result("Falha fechada sem SECRET_KEY em prod", ok_raised_secret, "esperava ValueError")

    ok_raised_hosts = False
    try:
        load_runtime_config({"DJANGO_DEBUG": "false", "DJANGO_SECRET_KEY": "chave-super-segura-prod"})
    except ValueError:
        ok_raised_hosts = True
    _emit_result("Falha fechada sem ALLOWED_HOSTS em prod", ok_raised_hosts, "esperava ValueError")

    cfg = load_runtime_config({
        "DJANGO_DEBUG": "false",
        "DJANGO_SECRET_KEY": "chave-super-segura-prod",
        "ALLOWED_HOSTS": " api.maldivas.dev , www.maldivas.dev ",
        "DATABASE_URL": "postgres://db/app",
    })
    _emit_result("Carrega hosts limpos em producao", cfg["allowed_hosts"] == ["api.maldivas.dev", "www.maldivas.dev"], str(cfg))
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-0-f03-primeiro-projeto-django": {
    slug: "modulo-0-f03-primeiro-projeto-django",
    shortCode: "F03",
    language: "python",
    filePath: "labs/f03_server_price_view.py",
    title: "View Segura vs. Preço Adulterado no Cliente",
    objective: "Ignore o total enviado pelo navegador e calcule o total oficial a partir do catálogo do servidor.",
    instructions: [
      "O cliente envia {'product_id': str, 'qty': int, 'client_total_cents': int}.",
      "Valide qty >= 1 e existência do produto no dicionário CATALOG.",
      "Nunca use `client_total_cents`: retorne `CATALOG[product_id] * qty` e flag `tampered = (client_total_cents != server_total)`.",
    ],
    starterCode: `CATALOG = {
    "cafeteira": 24990,
    "moedor": 15900,
}

def quote_order_view(payload: dict) -> tuple[int, dict]:
    pid = payload.get("product_id", "")
    qty = payload.get("qty", 0)
    # TODO: Valide produto/qty e calcule server_total_cents ignorando client_total_cents
    return 501, {}`,
    solutionCode: `CATALOG = {
    "cafeteira": 24990,
    "moedor": 15900,
}

def quote_order_view(payload: dict) -> tuple[int, dict]:
    pid = payload.get("product_id", "")
    qty = payload.get("qty", 0)
    if pid not in CATALOG:
        return 404, {"error": "produto_nao_encontrado"}
    if not isinstance(qty, int) or qty < 1:
        return 400, {"error": "quantidade_invalida"}
    server_total = CATALOG[pid] * qty
    tampered = payload.get("client_total_cents") != server_total
    return 200, {"server_total_cents": server_total, "tampered": tampered}`,
    hints: [
      "Primeiro cheque `if pid not in CATALOG: return 404, ...`.",
      "Depois valide `isinstance(qty, int) and qty >= 1`, senão retorne 400.",
      "Calcule `server_total = CATALOG[pid] * qty` e compare com `payload.get('client_total_cents')`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    s1, b1 = quote_order_view({"product_id": "cafeteira", "qty": 2, "client_total_cents": 100})
    _emit_result("Ignora preco adulterado do cliente", s1 == 200 and b1.get("server_total_cents") == 49980 and b1.get("tampered") is True, f"{s1} {b1}")
    s2, _ = quote_order_view({"product_id": "inexistente", "qty": 1, "client_total_cents": 100})
    _emit_result("Produto ausente -> 404", s2 == 404, f"got {s2}")
    s3, _ = quote_order_view({"product_id": "moedor", "qty": 0, "client_total_cents": 0})
    _emit_result("Qty <= 0 -> 400", s3 == 400, f"got {s3}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-0-f04-primeira-api-com-drf": {
    slug: "modulo-0-f04-primeira-api-com-drf",
    shortCode: "F04",
    language: "python",
    filePath: "labs/f04_drf_serializer.py",
    title: "Serializer DRF & Validação Estrita",
    objective: "Construa um validador de entrada estilo DRF Serializer que retorna erros estruturados 422/400 sem aceitar tipos errados.",
    instructions: [
      "Valide 'title' (str não vazia, <= 80 chars), 'price_cents' (int estrito > 0, rejeite bool!) e 'stock' (int >= 0).",
      "Retorne `(True, cleaned_dict)` quando válido ou `(False, errors_dict)` com chaves dos campos inválidos.",
    ],
    starterCode: `def validate_product_payload(data: dict) -> tuple[bool, dict]:
    errors = {}
    # Dica em Python: isinstance(True, int) é True! Checar type(x) is int evita bug de booleano virar 1 centavo.
    # TODO: Valide title, price_cents e stock
    return False, {"todo": "implementar"}`,
    solutionCode: `def validate_product_payload(data: dict) -> tuple[bool, dict]:
    errors = {}
    title = data.get("title")
    if not isinstance(title, str) or not title.strip() or len(title.strip()) > 80:
        errors["title"] = "titulo deve ter entre 1 e 80 caracteres"

    price = data.get("price_cents")
    if type(price) is not int or price <= 0:
        errors["price_cents"] = "price_cents deve ser inteiro positivo"

    stock = data.get("stock")
    if type(stock) is not int or stock < 0:
        errors["stock"] = "stock deve ser inteiro >= 0"

    if errors:
        return False, errors
    return True, {"title": title.strip(), "price_cents": price, "stock": stock}`,
    hints: [
      "Lembre-se: em Python `bool` herda de `int`, então use `type(price) is int`.",
      "Acumule os erros por campo em `errors[campo] = '...'` em vez de parar no primeiro.",
      "Se `errors` estiver vazio, retorne `(True, {'title': title.strip(), 'price_cents': price, 'stock': stock})`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    ok1, out1 = validate_product_payload({"title": " Teclado Mecanico ", "price_cents": 35900, "stock": 5})
    _emit_result("Aceita payload valido com strip", ok1 is True and out1.get("title") == "Teclado Mecanico", f"{ok1} {out1}")
    ok2, err2 = validate_product_payload({"title": "", "price_cents": True, "stock": -1})
    _emit_result("Rejeita bool como price_cents e stock negativo", ok2 is False and "title" in err2 and "price_cents" in err2 and "stock" in err2, f"{ok2} {err2}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-0-f05-testes-e-git": {
    slug: "modulo-0-f05-testes-e-git",
    shortCode: "F05",
    language: "python",
    filePath: "labs/f05_secret_guard.py",
    title: "Hook Pré-Commit Anti-Vazamento de Segredos",
    objective: "Escreva um scanner pré-commit que bloqueia arquivos sensíveis (.env, chaves .pem) ou tokens no diff antes do `git commit`.",
    instructions: [
      "Bloqueie caminhos que terminem em `.env`, `.env.local`, `.pem` ou `.key` (exceto `.env.example`).",
      "Bloqueie linhas adicionadas contendo prefixos secretos como `sk_live_`, `whsec_` ou `PRIVATE KEY`.",
      "Retorne lista de violações encontradas (vazia = commit seguro).",
    ],
    starterCode: `def scan_staged_files(staged: list[dict]) -> list[str]:
    """staged = [{'path': str, 'content': str}]"""
    violations = []
    # TODO: Verifique path sensivel e padroes de segredo em content
    return violations`,
    solutionCode: `SENSITIVE_EXACT = (".env", ".env.local", ".env.production")
SENSITIVE_EXT = (".pem", ".key")
SECRET_PATTERNS = ("sk_live_", "whsec_", "PRIVATE KEY")

def scan_staged_files(staged: list[dict]) -> list[str]:
    violations = []
    for item in staged:
        path = item.get("path", "")
        content = item.get("content", "")
        if path.endswith(".example"):
            continue
        if path.endswith(SENSITIVE_EXACT) or path.endswith(SENSITIVE_EXT):
            violations.append(f"blocked_file:{path}")
        for pat in SECRET_PATTERNS:
            if pat in content:
                violations.append(f"secret_leak:{path}:{pat}")
    return violations`,
    hints: [
      "Permita `.env.example` verificando `if path.endswith('.example'): continue`.",
      "Cheque extensões/sufixos perigosos como `.env`, `.pem`, `.key` no campo `path`.",
      "Inspecione `content` procurando `sk_live_`, `whsec_` e `PRIVATE KEY`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    v1 = scan_staged_files([{"path": ".env.example", "content": "STRIPE_KEY="}, {"path": "app.py", "content": "print('ok')"}])
    _emit_result("Permite .env.example e codigo limpo", v1 == [], f"got {v1}")
    v2 = scan_staged_files([{"path": ".env", "content": "SECRET=123"}, {"path": "cfg.py", "content": "KEY='sk_live_999'"}])
    _emit_result("Bloqueia .env e sk_live_", len(v2) >= 2, f"got {v2}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-0-f06-lendo-um-projeto-real": {
    slug: "modulo-0-f06-lendo-um-projeto-real",
    shortCode: "F06",
    language: "python",
    filePath: "labs/f06_layer_boundaries.py",
    title: "Refatorando Fat View para Camada Service",
    objective: "Desacople validação HTTP (View) da lógica pura de negócio (Service) garantindo testabilidade sem Django HttpRequest.",
    instructions: [
      "Implemente `calculate_checkout_service(items, discount_bps)` puro (sem conceitos HTTP).",
      "Implemente `checkout_view(request)` chamando o service e convertendo `ValueError` em status 400.",
    ],
    starterCode: `def calculate_checkout_service(items: list[dict], discount_bps: int = 0) -> dict:
    # TODO: Valide items nao vazio e 0 <= discount_bps <= 5000 (max 50%)
    raise NotImplementedError

def checkout_view(request: dict) -> tuple[int, dict]:
    # TODO: Chame calculate_checkout_service e converta ValueError em HTTP 400
    return 501, {}`,
    solutionCode: `def calculate_checkout_service(items: list[dict], discount_bps: int = 0) -> dict:
    if not items:
        raise ValueError("carrinho vazio")
    if discount_bps < 0 or discount_bps > 5000:
        raise ValueError("desconto fora do teto permitido")
    subtotal = sum(item["unit_cents"] * item["qty"] for item in items)
    discount = (subtotal * discount_bps) // 10000
    return {"subtotal_cents": subtotal, "discount_cents": discount, "total_cents": subtotal - discount}

def checkout_view(request: dict) -> tuple[int, dict]:
    try:
        result = calculate_checkout_service(request.get("items", []), request.get("discount_bps", 0))
        return 200, result
    except ValueError as err:
        return 400, {"error": str(err)}`,
    hints: [
      "O Service nunca retorna status HTTP 400 — ele lança `ValueError` de domínio.",
      "Calcule `subtotal = sum(i['unit_cents'] * i['qty'] for i in items)` e `discount = (subtotal * discount_bps) // 10000`.",
      "A View envolve a chamada do Service em `try/except ValueError` para devolver `(400, {'error': ...})` ou `(200, result)`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    res = calculate_checkout_service([{"unit_cents": 10000, "qty": 2}], 1000)
    _emit_result("Service puro calcula 10% sobre R$ 200", res["total_cents"] == 18000, str(res))
    s_err, _ = checkout_view({"items": [], "discount_bps": 0})
    _emit_result("View traduz ValueError em HTTP 400", s_err == 400, f"got {s_err}")
    s_ok, body_ok = checkout_view({"items": [{"unit_cents": 5000, "qty": 1}], "discount_bps": 1000})
    _emit_result("View devolve HTTP 200 com resultado", s_ok == 200 and body_ok.get("total_cents") == 4500, f"{s_ok} {body_ok}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-1-visao-do-negocio": {
    slug: "modulo-1-visao-do-negocio",
    shortCode: "A01",
    language: "python",
    filePath: "apps/orders/split_engine.py",
    title: "Conservação de Centavos no Split Multi-Lojista",
    objective: "Implemente o cálculo exato de comissão em centavos inteiros garantindo que nenhum centavo apareça ou suma por arredondamento float.",
    instructions: [
      "Receba `subtotals_by_seller: dict[str, int]` e `fee_bps: int` (ex: 1200 = 12%).",
      "Use `Decimal` com `ROUND_HALF_UP` (ou aritmética inteira exata) por loja.",
      "Garanta a invariante contábil: `sum(seller_net) + total_commission == sum(subtotals)`.",
    ],
    starterCode: `from decimal import Decimal, ROUND_HALF_UP

def split_marketplace_cents(subtotals_by_seller: dict[str, int], fee_bps: int) -> dict:
    """Retorna {'sellers': {id: {'gross': int, 'commission': int, 'net': int}}, 'platform_commission': int}"""
    # TODO: Calcule comissao exata em centavos sem float
    return {"sellers": {}, "platform_commission": 0}`,
    solutionCode: `from decimal import Decimal, ROUND_HALF_UP

def split_marketplace_cents(subtotals_by_seller: dict[str, int], fee_bps: int) -> dict:
    sellers = {}
    platform_commission = 0
    rate = Decimal(fee_bps) / Decimal(10000)

    for seller_id, gross in subtotals_by_seller.items():
        comm = int((Decimal(gross) * rate).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
        net = gross - comm
        sellers[seller_id] = {"gross": gross, "commission": comm, "net": net}
        platform_commission += comm

    return {"sellers": sellers, "platform_commission": platform_commission}`,
    hints: [
      "Converta `Decimal(fee_bps) / Decimal(10000)` para evitar imprecisão binária de `float`.",
      "Arredonde cada comissão com `.quantize(Decimal('1'), rounding=ROUND_HALF_UP)` e converta com `int(...)`.",
      "Calcule `net = gross - comm` para cada loja — isso garante soma exata.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    out = split_marketplace_cents({"loja_a": 9999, "loja_b": 3333, "loja_c": 1}, 1250)
    gross_sum = 9999 + 3333 + 1
    net_sum = sum(v["net"] for v in out["sellers"].values())
    plat = out["platform_commission"]
    _emit_result("Invariante net + comissao == bruto total", net_sum + plat == gross_sum, f"net={net_sum} plat={plat} gross={gross_sum}")
    _emit_result("Loja C de 1 centavo nao gera saldo negativo", out["sellers"]["loja_c"]["net"] >= 0, str(out["sellers"]["loja_c"]))
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-2-modelo-de-dados": {
    slug: "modulo-2-modelo-de-dados",
    shortCode: "A02",
    language: "sql-py",
    filePath: "apps/orders/schema.sql (SQLite)",
    title: "Modelagem Order -> SubOrder + Constraints SQL",
    objective: "Execute um schema relacional real em SQLite in-memory com Foreign Keys ativas e constraint de não-negatividade em dinheiro.",
    instructions: [
      "Crie tabelas `orders` e `sub_orders` com `CHECK (total_cents >= 0)` e `FOREIGN KEY (order_id) REFERENCES orders(id)`.",
      "Implemente a função `setup_and_query(conn)` que cria o schema, insere 1 Order e 2 SubOrders e devolve a soma das SubOrders via SQL.",
    ],
    starterCode: `import sqlite3

def setup_and_query(conn: sqlite3.Connection) -> int:
    conn.execute("PRAGMA foreign_keys = ON;")
    # TODO: Crie orders e sub_orders com CHECK (>= 0) e FOREIGN KEY, insira 1 order (total 15000) + 2 sub_orders (9000 e 6000) e retorne SUM(subtotal_cents)
    return 0`,
    solutionCode: `import sqlite3

def setup_and_query(conn: sqlite3.Connection) -> int:
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.executescript("""
        CREATE TABLE orders (
            id TEXT PRIMARY KEY,
            total_cents INTEGER NOT NULL CHECK (total_cents >= 0)
        );
        CREATE TABLE sub_orders (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            seller_id TEXT NOT NULL,
            subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0)
        );
    """)
    conn.execute("INSERT INTO orders (id, total_cents) VALUES (?, ?)", ("ord-1", 15000))
    conn.execute("INSERT INTO sub_orders (id, order_id, seller_id, subtotal_cents) VALUES (?, ?, ?, ?)", ("sub-1", "ord-1", "loja-a", 9000))
    conn.execute("INSERT INTO sub_orders (id, order_id, seller_id, subtotal_cents) VALUES (?, ?, ?, ?)", ("sub-2", "ord-1", "loja-b", 6000))
    row = conn.execute("SELECT SUM(subtotal_cents) FROM sub_orders WHERE order_id = ?", ("ord-1",)).fetchone()
    return int(row[0] or 0)`,
    hints: [
      "Sempre habilite `conn.execute('PRAGMA foreign_keys = ON;')` no SQLite antes de criar ou inserir.",
      "Adicione `CHECK (subtotal_cents >= 0)` na coluna monetária para impedir valores negativos no banco.",
      "Use `SELECT SUM(subtotal_cents) FROM sub_orders WHERE order_id = 'ord-1'` para conferir a soma relacional.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
import sqlite3
try:
    conn = sqlite3.connect(":memory:")
    total = setup_and_query(conn)
    _emit_result("Soma SQL das SubOrders == 15000", total == 15000, f"got {total}")
    fk_blocked = False
    try:
        conn.execute("INSERT INTO sub_orders (id, order_id, seller_id, subtotal_cents) VALUES ('sub-bad', 'ord-ghost', 'loja-x', 100)")
    except sqlite3.IntegrityError:
        fk_blocked = True
    _emit_result("Constraint Foreign Key bloqueia SubOrder orfa", fk_blocked, "esperava IntegrityError")
    neg_blocked = False
    try:
        conn.execute("INSERT INTO sub_orders (id, order_id, seller_id, subtotal_cents) VALUES ('sub-neg', 'ord-1', 'loja-x', -50)")
    except sqlite3.IntegrityError:
        neg_blocked = True
    _emit_result("CHECK constraint bloqueia centavos negativos", neg_blocked, "esperava IntegrityError")
except Exception as e:
    _emit_result("Execucao SQL", False, repr(e))`,
  },

  "modulo-2-carrinho-frete-cupom": {
    slug: "modulo-2-carrinho-frete-cupom",
    shortCode: "A03",
    language: "python",
    filePath: "apps/orders/coupons.py",
    title: "Rateio Proporcional de Cupom Sem Perder 1 Centavo",
    objective: "Aplique cupom limitado ao subtotal e distribua o desconto proporcionalmente entre sub-pedidos sem deixar sobra nem negativo.",
    instructions: [
      "Se `coupon_cents > sum(subtotals)`, aplique teto `discount = sum(subtotals)` (nunca total negativo).",
      "Rateie o desconto proporcionalmente e ajuste o resto da divisão inteira no maior/primeiro sub-pedido.",
      "Garanta `sum(discounts_per_sub) == discount`.",
    ],
    starterCode: `def allocate_coupon_discount(subtotals_by_seller: dict[str, int], coupon_cents: int) -> dict[str, int]:
    if not subtotals_by_seller or coupon_cents <= 0:
        return {k: 0 for k in subtotals_by_seller}
    # TODO: Aplique teto e distribua proporcionalmente garantindo soma exata == desconto efetivo
    return {k: 0 for k in subtotals_by_seller}`,
    solutionCode: `def allocate_coupon_discount(subtotals_by_seller: dict[str, int], coupon_cents: int) -> dict[str, int]:
    if not subtotals_by_seller or coupon_cents <= 0:
        return {k: 0 for k in subtotals_by_seller}
    total_sub = sum(subtotals_by_seller.values())
    if total_sub <= 0:
        return {k: 0 for k in subtotals_by_seller}
    effective_discount = min(coupon_cents, total_sub)

    allocated = {}
    keys = list(subtotals_by_seller.keys())
    running = 0
    for k in keys[:-1]:
        share = (subtotals_by_seller[k] * effective_discount) // total_sub
        allocated[k] = share
        running += share
    allocated[keys[-1]] = effective_discount - running
    return allocated`,
    hints: [
      "Defina `effective_discount = min(coupon_cents, total_sub)` como trava anti-negativo.",
      "Para os N-1 primeiros lojistas, use divisão inteira `(sub * effective_discount) // total_sub`.",
      "Atribua ao último lojista o saldo restante `effective_discount - running` para fechar 100% da soma.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    d1 = allocate_coupon_discount({"a": 1000, "b": 1000, "c": 1000}, 1000)
    _emit_result("Rateio de R$ 10,00 entre 3 lojas fecha 1000 centavos", sum(d1.values()) == 1000 and all(v <= 1000 for v in d1.values()), str(d1))
    d2 = allocate_coupon_discount({"a": 500, "b": 300}, 5000)
    _emit_result("Teto de cupom impede desconto maior que subtotal", sum(d2.values()) == 800, str(d2))
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-3-criar-pedido-sem-vender-duas-vezes": {
    slug: "modulo-3-criar-pedido-sem-vender-duas-vezes",
    shortCode: "A04",
    language: "sql-py",
    filePath: "apps/orders/stock_lock.py",
    title: "Baixa Atômica Anti-Overselling (Compare-and-Swap SQL)",
    objective: "Implemente reserva atômica de estoque em SQLite onde dois compradores concorrentes jamais consigam baixar abaixo de zero.",
    instructions: [
      "Use `UPDATE inventory SET stock = stock - ? WHERE sku = ? AND stock >= ?`.",
      "Confira `cursor.rowcount == 1`; se `0`, faça rollback e retorne `False` sem corromper o saldo.",
    ],
    starterCode: `import sqlite3

def reserve_stock_atomic(conn: sqlite3.Connection, sku: str, qty: int) -> bool:
    if qty <= 0:
        return False
    # TODO: Use UPDATE condicional WHERE sku = ? AND stock >= ? e cheque rowcount
    return False`,
    solutionCode: `import sqlite3

def reserve_stock_atomic(conn: sqlite3.Connection, sku: str, qty: int) -> bool:
    if qty <= 0:
        return False
    with conn:
        cur = conn.execute(
            "UPDATE inventory SET stock = stock - ? WHERE sku = ? AND stock >= ?",
            (qty, sku, qty),
        )
        return cur.rowcount == 1`,
    hints: [
      "Não faça `SELECT stock` seguido de `if stock >= qty:` antes do `UPDATE` — isso abre janela de corrida.",
      "Coloque `AND stock >= ?` dentro do próprio `UPDATE` SQL para tornar a checagem atômica no motor do banco.",
      "Verifique `cur.rowcount == 1` para saber se a reserva venceu a disputa.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
import sqlite3
try:
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE inventory (sku TEXT PRIMARY KEY, stock INTEGER NOT NULL CHECK (stock >= 0))")
    conn.execute("INSERT INTO inventory VALUES ('SKU-PIX', 1)")
    win = reserve_stock_atomic(conn, "SKU-PIX", 1)
    lose = reserve_stock_atomic(conn, "SKU-PIX", 1)
    remaining = conn.execute("SELECT stock FROM inventory WHERE sku = 'SKU-PIX'").fetchone()[0]
    _emit_result("Primeiro comprador reserva ultima unidade", win is True, f"win={win}")
    _emit_result("Segundo comprador e bloqueado sem estoque negativo", lose is False and remaining == 0, f"lose={lose}, stock={remaining}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-3-cobrar-pix-e-cartao": {
    slug: "modulo-3-cobrar-pix-e-cartao",
    shortCode: "A05",
    language: "python",
    filePath: "apps/payments/charge_builder.py",
    title: "Geração de Payload Pix + Conversão Segura Centavos -> Efí",
    objective: "Monte o payload de cobrança Pix convertendo centavos inteiros para string decimal de exatamente 2 casas e validando `txid`.",
    instructions: [
      "Valide `total_cents > 0` e `26 <= len(txid) <= 35` apenas alfanumérico.",
      "Formate `valor.original` a partir de centavos inteiros (ex: `105` -> `'1.05'`).",
      "Retorne dicionário compatível com API Pix BACEN v2.",
    ],
    starterCode: `def build_pix_payload(txid: str, total_cents: int, pix_key: str) -> dict:
    # TODO: Valide txid (26..35 alfanumerico) e total_cents > 0; formate original sem float!
    return {}`,
    solutionCode: `def build_pix_payload(txid: str, total_cents: int, pix_key: str) -> dict:
    if not txid.isalnum() or not (26 <= len(txid) <= 35):
        raise ValueError("txid invalido para padrao BACEN")
    if type(total_cents) is not int or total_cents <= 0:
        raise ValueError("total_cents deve ser inteiro positivo")
    original = f"{total_cents // 100}.{total_cents % 100:02d}"
    return {
        "txid": txid,
        "calendario": {"expiracao": 900},
        "valor": {"original": original},
        "chave": pix_key,
    }`,
    hints: [
      "Evite `f'{total_cents / 100:.2f}'`; prefira divisão inteira `f'{total_cents // 100}.{total_cents % 100:02d}'`.",
      "Valide `txid.isalnum()` e `26 <= len(txid) <= 35` lançando `ValueError` se inválido.",
      "Retorne `'valor': {'original': original}` dentro do payload.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    tx = "A" * 28
    p = build_pix_payload(tx, 105, "pix@loja.dev")
    _emit_result("Formata 105 centavos como '1.05' sem float", p.get("valor", {}).get("original") == "1.05", str(p))
    bad_tx = False
    try:
        build_pix_payload("curto", 500, "pix@loja.dev")
    except ValueError:
        bad_tx = True
    _emit_result("Rejeita txid fora do padrao BACEN", bad_tx, "esperava ValueError")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-3-confirmar-pagamento-webhook": {
    slug: "modulo-3-confirmar-pagamento-webhook",
    shortCode: "A06",
    language: "python",
    filePath: "apps/payments/webhook_handler.py",
    title: "Webhook Fail-Closed: Assinatura HMAC + Idempotência",
    objective: "Implemente o núcleo mais crítico de pagamentos: validar HMAC SHA-256 em tempo constante e impedir crédito duplicado em reenvios.",
    instructions: [
      "Valide assinatura com `hmac.compare_digest` — se segredo vazio ou assinatura errada, retorne `(401, {'status': 'rejected'})`.",
      "Se `event_id` já existir em `processed_events`, NÃO credite novamente e retorne `(200, {'status': 'deduplicated'})`.",
      "No primeiro evento válido, registre `event_id`, incremente `ledger['paid_count'] += 1` e retorne `(200, {'status': 'processed'})`.",
    ],
    starterCode: `import hmac
import hashlib

def handle_webhook_event(raw_body: bytes, signature: str, secret: str, event_id: str, processed_events: set[str], ledger: dict) -> tuple[int, dict]:
    # TODO: 1) Fail-closed HMAC compare_digest  2) Deduplicacao por event_id  3) Credito unico no ledger
    return 501, {}`,
    solutionCode: `import hmac
import hashlib

def handle_webhook_event(raw_body: bytes, signature: str, secret: str, event_id: str, processed_events: set[str], ledger: dict) -> tuple[int, dict]:
    if not secret or not signature:
        return 401, {"status": "rejected"}
    expected = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature.strip()):
        return 401, {"status": "rejected"}

    if event_id in processed_events:
        return 200, {"status": "deduplicated"}

    processed_events.add(event_id)
    ledger["paid_count"] = ledger.get("paid_count", 0) + 1
    return 200, {"status": "processed"}`,
    hints: [
      "Use `hmac.new(secret.encode('utf-8'), raw_body, hashlib.sha256).hexdigest()` e compare com `hmac.compare_digest`.",
      "Falhe fechado: `if not secret or not signature: return 401, ...`.",
      "Somente após confirmar que `event_id not in processed_events` é que `ledger['paid_count']` deve ser incrementado.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
import hmac, hashlib
try:
    body = b'{"event_id":"evt-1","status":"PAID"}'
    sec = "segredo-super-forte"
    sig = hmac.new(sec.encode(), body, hashlib.sha256).hexdigest()
    seen = set()
    ledger = {"paid_count": 0}

    s_bad, _ = handle_webhook_event(body, "assinatura-falsa", sec, "evt-1", seen, ledger)
    _emit_result("Assinatura invalida -> 401 sem alterar ledger", s_bad == 401 and ledger["paid_count"] == 0, f"{s_bad} {ledger}")

    s1, b1 = handle_webhook_event(body, sig, sec, "evt-1", seen, ledger)
    s2, b2 = handle_webhook_event(body, sig, sec, "evt-1", seen, ledger)
    _emit_result("1o webhook credita; 2o reenvio deduplica sem duplo credito", s1 == 200 and b1.get("status") == "processed" and s2 == 200 and b2.get("status") == "deduplicated" and ledger["paid_count"] == 1, f"{b1} / {b2} / {ledger}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-3-repasse-e-estorno": {
    slug: "modulo-3-repasse-e-estorno",
    shortCode: "A07",
    language: "python",
    filePath: "apps/payouts/refund_ledger.py",
    title: "Estorno Parcial Múltiplo com Ledger Imutável",
    objective: "Processe estornos parciais sucessivos garantindo que a soma estornada nunca ultrapasse o valor pago.",
    instructions: [
      "Receba `order = {'paid_cents': int, 'refunded_cents': int}`, `amount_cents: int` e lista `ledger_entries`.",
      "Rejeite com `ValueError` se `amount_cents <= 0` ou se `amount_cents > paid_cents - refunded_cents`.",
      "Atualize `order['refunded_cents']` e adicione lançamento imutável `-amount_cents` em `ledger_entries`.",
    ],
    starterCode: `def apply_partial_refund(order: dict, amount_cents: int, ledger_entries: list[dict]) -> dict:
    # TODO: Valide teto restante e registre lancamento imutavel em ledger_entries
    raise NotImplementedError`,
    solutionCode: `def apply_partial_refund(order: dict, amount_cents: int, ledger_entries: list[dict]) -> dict:
    if amount_cents <= 0:
        raise ValueError("Estorno deve ser positivo")
    available = order["paid_cents"] - order["refunded_cents"]
    if amount_cents > available:
        raise ValueError("Saldo insuficiente para estorno")
    order["refunded_cents"] += amount_cents
    ledger_entries.append({"type": "REFUND_DEBIT", "amount_cents": -amount_cents})
    return {"refunded_cents": order["refunded_cents"], "remaining_cents": order["paid_cents"] - order["refunded_cents"]}`,
    hints: [
      "Calcule `available = order['paid_cents'] - order['refunded_cents']` antes de alterar qualquer valor.",
      "Se `amount_cents > available`, lance `ValueError` antes de mexer no `order` ou no `ledger_entries`.",
      "Insira um novo registro com valor negativo `-amount_cents` em `ledger_entries` (append-only).",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    ord_obj = {"paid_cents": 10000, "refunded_cents": 0}
    ledger = []
    r1 = apply_partial_refund(ord_obj, 4000, ledger)
    r2 = apply_partial_refund(ord_obj, 6000, ledger)
    over_blocked = False
    try:
        apply_partial_refund(ord_obj, 1, ledger)
    except ValueError:
        over_blocked = True
    _emit_result("Dois estornos parciais fecham 10000 centavos", r1["remaining_cents"] == 6000 and r2["remaining_cents"] == 0 and len(ledger) == 2, f"{r2} ledger={len(ledger)}")
    _emit_result("Estorno acima do saldo e bloqueado", over_blocked and ord_obj["refunded_cents"] == 10000, str(ord_obj))
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-4-ciclo-de-vida-e-worker": {
    slug: "modulo-4-ciclo-de-vida-e-worker",
    shortCode: "A08",
    language: "python",
    filePath: "apps/payouts/outbox_tx.py",
    title: "Padrão Outbox + on_commit (Sem Tarefa Fantasma)",
    objective: "Garanta que tarefas assíncronas (e-mail, NF-e, repasse) só entrem na fila quando a transação SQL tiver sucesso.",
    instructions: [
      "Implemente `run_with_outbox(fn, queue)`: registre eventos locais em `pending_events`, execute `fn(pending_events)`.",
      "Se `fn` lançar exceção, NÃO envie nada para `queue` (simula rollback!).",
      "Somente se `fn` concluir sem erro, mova todos os eventos para `queue`.",
    ],
    starterCode: `def run_with_outbox(fn, queue: list[str]) -> bool:
    pending_events = []
    # TODO: Execute fn(pending_events); apenas no commit (sem excecao) publique em queue
    return False`,
    solutionCode: `def run_with_outbox(fn, queue: list[str]) -> bool:
    pending_events: list[str] = []
    try:
        fn(pending_events)
    except Exception:
        return False
    queue.extend(pending_events)
    return True`,
    hints: [
      "Crie uma lista isolada `pending_events = []` dentro da função.",
      "Em `except Exception:`, retorne `False` sem tocar na lista `queue`.",
      "Apenas depois do bloco `try` bem-sucedido execute `queue.extend(pending_events)` e retorne `True`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    q = []
    def failing_tx(events):
        events.append("send_invoice:ord-1")
        raise RuntimeError("falha no banco")
    ok_fail = run_with_outbox(failing_tx, q)
    _emit_result("Rollback nao enfileira tarefa fantasma", ok_fail is False and q == [], f"q={q}")

    def success_tx(events):
        events.append("send_invoice:ord-2")
    ok_win = run_with_outbox(success_tx, q)
    _emit_result("Commit bem-sucedido publica no worker", ok_win is True and q == ["send_invoice:ord-2"], f"q={q}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-4-tempo-real-e-midia": {
    slug: "modulo-4-tempo-real-e-midia",
    shortCode: "A09",
    language: "python",
    filePath: "apps/notifications/ws_auth.py",
    title: "Autorização de Sala WebSocket & Validação de Upload",
    objective: "Garanta isolamento por dono em canal WebSocket e bloqueie uploads perigosos ou gigantes antes de gerar URL de Object Storage.",
    instructions: [
      "`authorize_ws_channel(user_id, order_owner_id)` retorna True somente se ambos existirem e forem iguais.",
      "`validate_media_upload(mime, size_bytes)` aceita apenas `image/jpeg`, `image/png`, `image/webp` até `5 * 1024 * 1024` bytes.",
    ],
    starterCode: `ALLOWED_MIMES = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = 5 * 1024 * 1024

def authorize_ws_channel(user_id: str | None, order_owner_id: str | None) -> bool:
    return False

def validate_media_upload(mime: str, size_bytes: int) -> bool:
    return False`,
    solutionCode: `ALLOWED_MIMES = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = 5 * 1024 * 1024

def authorize_ws_channel(user_id: str | None, order_owner_id: str | None) -> bool:
    return bool(user_id and order_owner_id and user_id == order_owner_id)

def validate_media_upload(mime: str, size_bytes: int) -> bool:
    return mime in ALLOWED_MIMES and 0 < size_bytes <= MAX_BYTES`,
    hints: [
      "Nunca permita `None == None` virar `True` em `authorize_ws_channel`: cheque `bool(user_id and order_owner_id and ...)`.",
      "Em `validate_media_upload`, rejeite tamanho <= 0 e > `MAX_BYTES`.",
      "Rejeite tipos como `text/html` ou `image/svg+xml` para prevenir XSS armazenado.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    _emit_result("WS impede None == None e outro usuario", authorize_ws_channel(None, None) is False and authorize_ws_channel("u1", "u2") is False and authorize_ws_channel("u1", "u1") is True, "")
    _emit_result("Upload bloqueia SVG e arquivo > 5MB", validate_media_upload("image/svg+xml", 1024) is False and validate_media_upload("image/webp", 6_000_000) is False and validate_media_upload("image/png", 1024) is True, "")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-5-infraestrutura-deploy-backup": {
    slug: "modulo-5-infraestrutura-deploy-backup",
    shortCode: "A10",
    language: "python",
    filePath: "deploy/readiness_probe.py",
    title: "Readiness Probe & Verificação de Backup",
    objective: "Implemente um healthcheck /ready que só devolve 200 quando Postgres, Redis e último teste de restore estiverem saudáveis.",
    instructions: [
      "Receba `deps = {'db_ok': bool, 'redis_ok': bool, 'backup_restore_age_hours': float}`.",
      "Retorne `(200, {'ready': True})` apenas se `db_ok`, `redis_ok` e `backup_restore_age_hours <= 168` (7 dias).",
      "Caso contrário, retorne `(503, {'ready': False, 'failed': [...]})` listando as causas.",
    ],
    starterCode: `def check_readiness(deps: dict) -> tuple[int, dict]:
    # TODO: Verifique db_ok, redis_ok e backup_restore_age_hours <= 168
    return 503, {"ready": False, "failed": ["not_implemented"]}`,
    solutionCode: `def check_readiness(deps: dict) -> tuple[int, dict]:
    failed = []
    if not deps.get("db_ok"):
        failed.append("postgres")
    if not deps.get("redis_ok"):
        failed.append("redis")
    if deps.get("backup_restore_age_hours", 9999) > 168:
        failed.append("backup_restore_stale")
    if failed:
        return 503, {"ready": False, "failed": failed}
    return 200, {"ready": True}`,
    hints: [
      "Crie uma lista `failed = []` e adicione o nome de cada dependência degradada.",
      "Compare `backup_restore_age_hours > 168` para alertar backups sem teste recente.",
      "Retorne HTTP `503` (Service Unavailable) para que o Load Balancer pare de enviar tráfego à instância doente.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    s1, b1 = check_readiness({"db_ok": True, "redis_ok": True, "backup_restore_age_hours": 12})
    _emit_result("Instancia saudavel retorna 200 ready", s1 == 200 and b1.get("ready") is True, f"{s1} {b1}")
    s2, b2 = check_readiness({"db_ok": True, "redis_ok": False, "backup_restore_age_hours": 240})
    _emit_result("Redis fora ou backup vencido retorna 503 com motivos", s2 == 503 and "redis" in b2.get("failed", []) and "backup_restore_stale" in b2.get("failed", []), f"{s2} {b2}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-6-juridico-fiscal-operacao": {
    slug: "modulo-6-juridico-fiscal-operacao",
    shortCode: "A11",
    language: "python",
    filePath: "apps/core/pii_sanitizer.py",
    title: "Mascaramento de PII em Logs (LGPD & PCI-DSS)",
    objective: "Sanitize payloads antes de enviar logs para observability garantindo zero vazamento de CPF, token e cartão.",
    instructions: [
      "Redacte chaves sensíveis (`password`, `token`, `authorization`, `cvv`, `card_number`) para `'***REDACTED***'`.",
      "Para a chave `cpf`, mantenha apenas os 2 últimos dígitos no padrão `'***.***.***-XX'`.",
      "Retorne um novo dicionário sem mutar o dicionário original.",
    ],
    starterCode: `REDACTED_KEYS = {"password", "token", "authorization", "cvv", "card_number"}

def sanitize_log_payload(payload: dict) -> dict:
    # TODO: Retorne copia segura mascarando segredos e CPF
    return {}`,
    solutionCode: `REDACTED_KEYS = {"password", "token", "authorization", "cvv", "card_number"}

def sanitize_log_payload(payload: dict) -> dict:
    cleaned = {}
    for k, v in payload.items():
        lk = k.lower()
        if lk in REDACTED_KEYS:
            cleaned[k] = "***REDACTED***"
        elif lk == "cpf" and isinstance(v, str):
            digits = "".join(ch for ch in v if ch.isdigit())
            cleaned[k] = f"***.***.***-{digits[-2:]}" if len(digits) >= 2 else "***REDACTED***"
        else:
            cleaned[k] = v
    return cleaned`,
    hints: [
      "Normalize a chave com `.lower()` ao verificar `REDACTED_KEYS`.",
      "Extraia apenas dígitos de `cpf` e pegue `digits[-2:]` para preservar utilidade mínima em suporte sem expor o titular.",
      "Crie `cleaned = {}` novo em vez de alterar `payload` in-place.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    orig = {"order_id": "ord-9", "cpf": "123.456.789-01", "token": "Bearer abc", "total_cents": 5000}
    safe = sanitize_log_payload(orig)
    _emit_result("Mascara token e CPF preservando apenas sufixo", safe.get("token") == "***REDACTED***" and safe.get("cpf") == "***.***.***-01", str(safe))
    _emit_result("Preserva campos operacionais e nao muta original", safe.get("order_id") == "ord-9" and orig["token"] == "Bearer abc", str(orig))
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },

  "modulo-7-projeto-final-certificado": {
    slug: "modulo-7-projeto-final-certificado",
    shortCode: "Final",
    language: "python",
    filePath: "tests/e2e_capstone_verify.py",
    title: "Bateria Final E2E: Invariantes Production-Ready",
    objective: "Integre criação segura, webhook idempotente e estorno parcial provando que a máquina de estados e o saldo financeiro fecham em 100%.",
    instructions: [
      "Implemente `MarketplaceMiniEngine.pay(order_id, webhook_id)` idempotente.",
      "Implemente `MarketplaceMiniEngine.refund(order_id, amount_cents)` bloqueando excedente.",
      "Garanta `net_retained == paid - refunded` ao final do fluxo completo.",
    ],
    starterCode: `class MarketplaceMiniEngine:
    def __init__(self, fee_bps: int = 1200):
        self.fee_bps = fee_bps
        self.orders = {}
        self.seen_webhooks = set()

    def create_order(self, order_id: str, total_cents: int):
        self.orders[order_id] = {"total": total_cents, "paid": 0, "refunded": 0, "status": "PENDING"}

    def pay_webhook(self, order_id: str, webhook_id: str) -> str:
        # TODO: Idempotente por webhook_id, atualiza status='PAID' e paid=total
        return "todo"

    def refund(self, order_id: str, amount_cents: int) -> int:
        # TODO: Valide teto e atualize refunded; retorne saldo retido (paid - refunded)
        return -1`,
    solutionCode: `class MarketplaceMiniEngine:
    def __init__(self, fee_bps: int = 1200):
        self.fee_bps = fee_bps
        self.orders = {}
        self.seen_webhooks = set()

    def create_order(self, order_id: str, total_cents: int):
        self.orders[order_id] = {"total": total_cents, "paid": 0, "refunded": 0, "status": "PENDING"}

    def pay_webhook(self, order_id: str, webhook_id: str) -> str:
        if webhook_id in self.seen_webhooks:
            return "deduplicated"
        order = self.orders[order_id]
        self.seen_webhooks.add(webhook_id)
        order["paid"] += order["total"]
        order["status"] = "PAID"
        return "processed"

    def refund(self, order_id: str, amount_cents: int) -> int:
        order = self.orders[order_id]
        available = order["paid"] - order["refunded"]
        if amount_cents <= 0 or amount_cents > available:
            raise ValueError("Estorno invalido ou acima do pago")
        order["refunded"] += amount_cents
        return order["paid"] - order["refunded"]`,
    hints: [
      "Em `pay_webhook`, cheque `webhook_id in self.seen_webhooks` logo na primeira linha.",
      "Em `refund`, garanta `0 < amount_cents <= order['paid'] - order['refunded']`.",
      "Retorne `order['paid'] - order['refunded']` após somar em `order['refunded']`.",
    ],
    testRunnerCode: `${PY_TEST_HARNESS}
try:
    eng = MarketplaceMiniEngine()
    eng.create_order("ord-final", 25000)
    r1 = eng.pay_webhook("ord-final", "wh-01")
    r2 = eng.pay_webhook("ord-final", "wh-01")
    net_after = eng.refund("ord-final", 5000)
    over_err = False
    try:
        eng.refund("ord-final", 20001)
    except ValueError:
        over_err = True
    _emit_result("Webhook idempotente nao dobra pagamento", r1 == "processed" and r2 == "deduplicated" and eng.orders["ord-final"]["paid"] == 25000, f"{r1}/{r2}")
    _emit_result("Estorno parcial + bloqueio de estorno excedente", net_after == 20000 and over_err is True, f"net={net_after} over_err={over_err}")
except Exception as e:
    _emit_result("Execucao do laboratorio", False, repr(e))`,
  },
};

export function createInitialHttpSandboxState(): HttpSandboxState {
  return {
    products: {
      "cafeteira-pro": {
        id: "cafeteira-pro",
        title: "Cafeteira Espresso Pro",
        sellerId: "loja-alfa",
        priceCents: 24990,
        stock: 2,
      },
      "moedor-inox": {
        id: "moedor-inox",
        title: "Moedor Inox Precisao",
        sellerId: "loja-beta",
        priceCents: 15900,
        stock: 5,
      },
    },
    orders: {},
    processedWebhookKeys: [],
    sellerLedgerCents: {
      "loja-alfa": 0,
      "loja-beta": 0,
    },
    platformRevenueCents: 0,
    requestCount: 0,
  };
}

export const HTTP_LAB_SCENARIOS: HttpLabScenario[] = [
  {
    id: "health",
    label: "GET /health (200)",
    lessonSlugs: ["modulo-0-f01-o-mapa", "modulo-5-infraestrutura-deploy-backup"],
    method: "GET",
    path: "/api/v1/health",
    headers: {},
    bodyText: "",
    explanation: "Probe básico de disponibilidade da API.",
  },
  {
    id: "create-order",
    label: "POST /orders (201 Split)",
    lessonSlugs: ["modulo-0-f04-primeira-api-com-drf", "modulo-2-carrinho-frete-cupom", "modulo-3-criar-pedido-sem-vender-duas-vezes"],
    method: "POST",
    path: "/api/v1/orders",
    headers: { Authorization: "Bearer aluno-token" },
    bodyText: JSON.stringify(
      {
        orderId: "ord-1001",
        items: [{ productId: "cafeteira-pro", qty: 1 }],
        couponCode: "BEMVINDO10",
      },
      null,
      2,
    ),
    explanation: "Cria pedido com cálculo server-side, reserva estoque atômico e aplica cupom de 10%.",
  },
  {
    id: "webhook-bad-sig",
    label: "Webhook Assinatura Inválida (401)",
    lessonSlugs: ["modulo-3-confirmar-pagamento-webhook", "modulo-6-juridico-fiscal-operacao"],
    method: "POST",
    path: "/api/v1/webhooks/efi",
    headers: {
      "X-Webhook-Signature": "assinatura-forjada",
      "Idempotency-Key": "evt-pix-1001",
    },
    bodyText: JSON.stringify({ orderId: "ord-1001", status: "CONCLUIDA" }, null, 2),
    explanation: "Testa defesa fail-closed: rejeita webhook sem assinatura válida antes de tocar no saldo.",
  },
  {
    id: "webhook-valid",
    label: "Webhook Efí Válido (200 / Replay)",
    lessonSlugs: ["modulo-3-confirmar-pagamento-webhook", "modulo-3-cobrar-pix-e-cartao", "modulo-4-ciclo-de-vida-e-worker"],
    method: "POST",
    path: "/api/v1/webhooks/efi",
    headers: {
      "X-Webhook-Signature": "secret-ok",
      "Idempotency-Key": "evt-pix-1001",
    },
    bodyText: JSON.stringify({ orderId: "ord-1001", status: "CONCLUIDA" }, null, 2),
    explanation: "Clique 2x seguidas ou use 'Simular Reenvio 2x' para ver a idempotência impedir crédito duplicado.",
  },
  {
    id: "refund-partial",
    label: "POST /refunds (Parcial / Teto)",
    lessonSlugs: ["modulo-3-repasse-e-estorno", "modulo-7-projeto-final-certificado"],
    method: "POST",
    path: "/api/v1/refunds",
    headers: { Authorization: "Bearer aluno-token" },
    bodyText: JSON.stringify({ orderId: "ord-1001", amountCents: 5000 }, null, 2),
    explanation: "Estorno parcial descontado do saldo pago sem ultrapassar o limite restante.",
  },
];

function cloneSandboxState(state: HttpSandboxState): HttpSandboxState {
  return JSON.parse(JSON.stringify(state)) as HttpSandboxState;
}

function getHeaderCaseInsensitive(headers: Record<string, string>, name: string): string {
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) return v;
  }
  return "";
}

export function executeHttpLabRequest(
  state: HttpSandboxState,
  req: HttpLabRequest,
): HttpLabResponse {
  const next = cloneSandboxState(state);
  next.requestCount += 1;

  const baseHeaders = { "content-type": "application/json", "x-sandbox-req": String(next.requestCount) };
  const method = req.method;
  const path = req.path.trim();

  if (method === "GET" && path === "/api/v1/health") {
    return {
      status: 200,
      statusText: "OK",
      headers: baseHeaders,
      body: { ok: true, service: "mysuperstore-sandbox", requests: next.requestCount },
      diagnostic: "API saudável (200 OK).",
      nextState: next,
    };
  }

  if (method === "GET" && path === "/api/v1/products") {
    return {
      status: 200,
      statusText: "OK",
      headers: baseHeaders,
      body: { products: Object.values(next.products) },
      diagnostic: "Catálogo oficial consultado do servidor.",
      nextState: next,
    };
  }

  let parsedBody: Record<string, unknown> = {};
  if (method === "POST" && req.bodyText.trim()) {
    try {
      const candidate = JSON.parse(req.bodyText);
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        return {
          status: 400,
          statusText: "Bad Request",
          headers: baseHeaders,
          body: { error: "JSON body deve ser um objeto" },
          diagnostic: "Payload inválido (esperado objeto JSON).",
          nextState: next,
        };
      }
      parsedBody = candidate as Record<string, unknown>;
    } catch {
      return {
        status: 400,
        statusText: "Bad Request",
        headers: baseHeaders,
        body: { error: "JSON malformado no corpo da requisicao" },
        diagnostic: "Erro de sintaxe JSON no Body.",
        nextState: next,
      };
    }
  }

  if (method === "POST" && path === "/api/v1/orders") {
    const auth = getHeaderCaseInsensitive(req.headers, "Authorization");
    if (!auth.startsWith("Bearer ") || auth.trim().length <= 8) {
      return {
        status: 401,
        statusText: "Unauthorized",
        headers: baseHeaders,
        body: { error: "missing_or_invalid_bearer_token" },
        diagnostic: "401: informe 'Authorization: Bearer aluno-token'.",
        nextState: next,
      };
    }

    const rawItems = Array.isArray(parsedBody.items) ? parsedBody.items : [];
    if (rawItems.length === 0) {
      return {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: baseHeaders,
        body: { error: "items_required" },
        diagnostic: "422: carrinho vazio.",
        nextState: next,
      };
    }

    const orderId =
      typeof parsedBody.orderId === "string" && parsedBody.orderId.trim()
        ? parsedBody.orderId.trim()
        : `ord-${1000 + next.requestCount}`;

    if (next.orders[orderId]) {
      return {
        status: 409,
        statusText: "Conflict",
        headers: baseHeaders,
        body: { error: "order_already_exists", orderId },
        diagnostic: `409: pedido ${orderId} já existe.`,
        nextState: next,
      };
    }

    const normalizedItems: HttpLabOrder["items"] = [];
    let subtotalCents = 0;

    for (const row of rawItems) {
      if (!row || typeof row !== "object") {
        return {
          status: 422,
          statusText: "Unprocessable Entity",
          headers: baseHeaders,
          body: { error: "invalid_item_entry" },
          diagnostic: "422: item inválido.",
          nextState: next,
        };
      }
      const itemObj = row as Record<string, unknown>;
      const productId = typeof itemObj.productId === "string" ? itemObj.productId : "";
      const qty = typeof itemObj.qty === "number" && Number.isInteger(itemObj.qty) ? itemObj.qty : 0;
      const product = next.products[productId];
      if (!product) {
        return {
          status: 404,
          statusText: "Not Found",
          headers: baseHeaders,
          body: { error: "product_not_found", productId },
          diagnostic: `404: produto ${productId} não existe.`,
          nextState: next,
        };
      }
      if (qty <= 0) {
        return {
          status: 422,
          statusText: "Unprocessable Entity",
          headers: baseHeaders,
          body: { error: "invalid_quantity", productId },
          diagnostic: "422: quantidade precisa ser inteiro >= 1.",
          nextState: next,
        };
      }
      if (product.stock < qty) {
        return {
          status: 409,
          statusText: "Conflict",
          headers: baseHeaders,
          body: { error: "insufficient_stock", productId, available: product.stock },
          diagnostic: `409 Anti-Overselling: estoque disponível (${product.stock}) menor que ${qty}.`,
          nextState: next,
        };
      }

      product.stock -= qty;
      subtotalCents += product.priceCents * qty;
      normalizedItems.push({
        productId,
        qty,
        unitPriceCents: product.priceCents,
        sellerId: product.sellerId,
      });
    }

    const coupon = typeof parsedBody.couponCode === "string" ? parsedBody.couponCode.trim().toUpperCase() : "";
    const discountCents = coupon === "BEMVINDO10" ? Math.floor((subtotalCents * 10) / 100) : 0;
    const totalCents = Math.max(0, subtotalCents - discountCents);

    const newOrder: HttpLabOrder = {
      orderId,
      txid: `TX${orderId.replace(/[^A-Za-z0-9]/g, "").toUpperCase()}0001`,
      items: normalizedItems,
      subtotalCents,
      discountCents,
      totalCents,
      paidCents: 0,
      refundedCents: 0,
      status: "PENDING",
    };
    next.orders[orderId] = newOrder;

    return {
      status: 201,
      statusText: "Created",
      headers: baseHeaders,
      body: { order: newOrder },
      diagnostic: `201 Created: preço calculado no servidor (${totalCents} centavos), aguardando webhook Pix.`,
      nextState: next,
    };
  }

  if (method === "POST" && path === "/api/v1/webhooks/efi") {
    const signature = getHeaderCaseInsensitive(req.headers, "X-Webhook-Signature");
    if (signature.trim() !== "secret-ok") {
      return {
        status: 401,
        statusText: "Unauthorized",
        headers: baseHeaders,
        body: { error: "invalid_webhook_signature" },
        diagnostic: "401 Fail-Closed: assinatura inválida bloqueada antes de alterar saldo ou pedido.",
        nextState: next,
      };
    }

    const idempKey = getHeaderCaseInsensitive(req.headers, "Idempotency-Key").trim();
    if (!idempKey) {
      return {
        status: 400,
        statusText: "Bad Request",
        headers: baseHeaders,
        body: { error: "missing_idempotency_key" },
        diagnostic: "400: cabeçalho Idempotency-Key obrigatório para evitar duplo crédito.",
        nextState: next,
      };
    }

    if (next.processedWebhookKeys.includes(idempKey)) {
      return {
        status: 200,
        statusText: "OK",
        headers: baseHeaders,
        body: { deduplicated: true, idempotencyKey: idempKey },
        diagnostic: `200 Idempotente: evento '${idempKey}' já foi processado antes — zero duplo crédito!`,
        nextState: next,
      };
    }

    const orderId = typeof parsedBody.orderId === "string" ? parsedBody.orderId.trim() : "";
    const order = next.orders[orderId];
    if (!order) {
      return {
        status: 404,
        statusText: "Not Found",
        headers: baseHeaders,
        body: { error: "order_not_found", orderId },
        diagnostic: `404: pedido '${orderId}' não encontrado. Crie o pedido primeiro!`,
        nextState: next,
      };
    }

    next.processedWebhookKeys.push(idempKey);
    const evStatus = typeof parsedBody.status === "string" ? parsedBody.status.toUpperCase() : "CONCLUIDA";
    if (evStatus !== "CONCLUIDA") {
      return {
        status: 200,
        statusText: "OK",
        headers: baseHeaders,
        body: { ignored: true, status: evStatus },
        diagnostic: `200: evento '${evStatus}' registrado sem liquidar pagamento.`,
        nextState: next,
      };
    }

    order.paidCents = order.totalCents;
    order.status = "PAID";
    const commissionCents = Math.round((order.totalCents * 12) / 100);
    const sellerNetCents = order.totalCents - commissionCents;
    const primarySeller = order.items[0]?.sellerId ?? "loja-alfa";
    next.sellerLedgerCents[primarySeller] = (next.sellerLedgerCents[primarySeller] ?? 0) + sellerNetCents;
    next.platformRevenueCents += commissionCents;

    return {
      status: 200,
      statusText: "OK",
      headers: baseHeaders,
      body: {
        processed: true,
        orderId,
        paidCents: order.paidCents,
        split: { sellerId: primarySeller, sellerNetCents, commissionCents },
      },
      diagnostic: `200 Liquidado: +${sellerNetCents}c para ${primarySeller} e +${commissionCents}c plataforma.`,
      nextState: next,
    };
  }

  if (method === "POST" && path === "/api/v1/refunds") {
    const orderId = typeof parsedBody.orderId === "string" ? parsedBody.orderId.trim() : "";
    const amountCents = typeof parsedBody.amountCents === "number" ? Math.trunc(parsedBody.amountCents) : 0;
    const order = next.orders[orderId];

    if (!order) {
      return {
        status: 404,
        statusText: "Not Found",
        headers: baseHeaders,
        body: { error: "order_not_found", orderId },
        diagnostic: `404: pedido '${orderId}' não encontrado.`,
        nextState: next,
      };
    }
    if (order.paidCents <= 0) {
      return {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: baseHeaders,
        body: { error: "order_not_paid" },
        diagnostic: "422: não é possível estornar um pedido que ainda não foi pago.",
        nextState: next,
      };
    }

    const available = order.paidCents - order.refundedCents;
    if (amountCents <= 0 || amountCents > available) {
      return {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: baseHeaders,
        body: { error: "refund_exceeds_available", availableCents: available },
        diagnostic: `422 Invariante Protegida: saldo máximo para estorno é ${available} centavos.`,
        nextState: next,
      };
    }

    order.refundedCents += amountCents;
    order.status = order.refundedCents >= order.paidCents ? "REFUNDED" : "PARTIAL_REFUND";
    const sellerDebit = Math.round((amountCents * 88) / 100);
    const platformDebit = amountCents - sellerDebit;
    const primarySeller = order.items[0]?.sellerId ?? "loja-alfa";
    next.sellerLedgerCents[primarySeller] = (next.sellerLedgerCents[primarySeller] ?? 0) - sellerDebit;
    next.platformRevenueCents -= platformDebit;

    return {
      status: 200,
      statusText: "OK",
      headers: baseHeaders,
      body: {
        orderId,
        refundedCents: order.refundedCents,
        remainingRefundableCents: order.paidCents - order.refundedCents,
        status: order.status,
      },
      diagnostic: `200 Estornado: -${amountCents}c debitados proporcionalmente do ledger.`,
      nextState: next,
    };
  }

  return {
    status: 404,
    statusText: "Not Found",
    headers: baseHeaders,
    body: { error: "route_not_found", method, path },
    diagnostic: `404: rota ${method} ${path} não existe no sandbox.`,
    nextState: next,
  };
}
