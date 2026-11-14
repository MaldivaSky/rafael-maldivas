/**
 * Curated browsable repository tree for the MySuperStore reference project
 * shown inside the Course IDE Explorer.
 */

export interface RepoFileNode {
  path: string;
  folder: string;
  language: "python" | "yaml" | "text";
  summary: string;
  lessonSlugs: string[];
  content: string;
}

export const MYSUPERSTORE_REPO_FILES: RepoFileNode[] = [
  {
    path: "config/settings/base.py",
    folder: "config/settings",
    language: "python",
    summary: "Configurações fail-closed carregadas de variáveis de ambiente.",
    lessonSlugs: ["modulo-0-f02-preparando-a-bancada", "modulo-0-f03-primeiro-projeto-django", "modulo-5-infraestrutura-deploy-backup"],
    content: `import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]

if not DEBUG and not ALLOWED_HOSTS:
    raise RuntimeError("ALLOWED_HOSTS obrigatorio em producao.")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "rest_framework",
    "apps.orders",
    "apps.payments",
    "apps.payouts",
    "apps.notifications",
]`,
  },
  {
    path: "apps/orders/models.py",
    folder: "apps/orders",
    language: "python",
    summary: "Order (checkout único) e SubOrder (split por lojista) com dinheiro em centavos inteiros.",
    lessonSlugs: ["modulo-1-visao-do-negocio", "modulo-2-modelo-de-dados", "modulo-0-f06-lendo-um-projeto-real"],
    content: `from django.db import models

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendente"
        PAID = "PAID", "Pago"
        CANCELLED = "CANCELLED", "Cancelado"

    customer_id = models.UUIDField(db_index=True)
    total_cents = models.PositiveBigIntegerField()
    discount_cents = models.PositiveBigIntegerField(default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

class SubOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="sub_orders")
    seller_id = models.UUIDField(db_index=True)
    subtotal_cents = models.PositiveBigIntegerField()
    commission_cents = models.PositiveBigIntegerField()
    seller_net_cents = models.PositiveBigIntegerField()
    shipping_cents = models.PositiveBigIntegerField(default=0)`,
  },
  {
    path: "apps/orders/services.py",
    folder: "apps/orders",
    language: "python",
    summary: "Criação atômica de pedido com lock pessimista de estoque (select_for_update) e split.",
    lessonSlugs: ["modulo-2-carrinho-frete-cupom", "modulo-3-criar-pedido-sem-vender-duas-vezes"],
    content: `from django.db import transaction

def create_marketplace_order(*, customer_id, items, fee_bps=1200):
    with transaction.atomic():
        # Lock pessimista ordenado por sku_id para evitar deadlock e overselling
        ordered_items = sorted(items, key=lambda x: x["sku_id"])
        subtotal = 0
        for row in ordered_items:
            sku = Sku.objects.select_for_update().get(id=row["sku_id"])
            if sku.stock < row["qty"]:
                raise ValueError(f"Estoque insuficiente para {sku.code}")
            sku.stock -= row["qty"]
            sku.save(update_fields=["stock"])
            subtotal += sku.price_cents * row["qty"]

        commission = (subtotal * fee_bps + 5000) // 10000
        seller_net = subtotal - commission
        return {"subtotal_cents": subtotal, "commission_cents": commission, "seller_net_cents": seller_net}`,
  },
  {
    path: "apps/payments/efi_client.py",
    folder: "apps/payments",
    language: "python",
    summary: "Cliente Efí Pay com mTLS, timeouts explícitos e geração de payload Pix/Cartão.",
    lessonSlugs: ["modulo-0-f04-primeira-api-com-drf", "modulo-3-cobrar-pix-e-cartao"],
    content: `import httpx

def create_pix_charge(*, txid: str, total_cents: int, cert_path: str, base_url: str) -> dict:
    amount_str = f"{total_cents // 100}.{total_cents % 100:02d}"
    payload = {
        "calendario": {"expiracao": 900},
        "valor": {"original": amount_str},
        "chave": "pix@maldivastech.dev",
        "solicitacaoPagador": f"Pedido {txid}",
    }
    with httpx.Client(cert=cert_path, timeout=httpx.Timeout(connect=3.0, read=8.0)) as client:
        resp = client.put(f"{base_url}/v2/cob/{txid}", json=payload)
        resp.raise_for_status()
        return resp.json()`,
  },
  {
    path: "apps/payments/webhooks.py",
    folder: "apps/payments",
    language: "python",
    summary: "Validação HMAC fail-closed + idempotência para evitar crédito duplicado.",
    lessonSlugs: ["modulo-3-confirmar-pagamento-webhook", "modulo-6-juridico-fiscal-operacao"],
    content: `import hmac
import hashlib
from django.db import IntegrityError, transaction

def verify_hmac_signature(raw_body: bytes, received_sig: str, secret: str) -> bool:
    if not secret or not received_sig:
        return False
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received_sig.strip())

def process_efi_webhook(event_id: str, txid: str, status: str) -> str:
    with transaction.atomic():
        try:
            WebhookReceipt.objects.create(event_id=event_id, txid=txid)
        except IntegrityError:
            return "deduplicated"
        if status == "CONCLUIDA":
            mark_order_paid(txid=txid)
            return "processed"
        return "ignored"`,
  },
  {
    path: "apps/payouts/tasks.py",
    folder: "apps/payouts",
    language: "python",
    summary: "Ledger imutável, estorno parcial seguro e disparo via transaction.on_commit.",
    lessonSlugs: ["modulo-3-repasse-e-estorno", "modulo-4-ciclo-de-vida-e-worker"],
    content: `from django.db import transaction

def issue_partial_refund(*, order, amount_cents: int):
    if amount_cents <= 0:
        raise ValueError("Valor de estorno deve ser positivo.")
    with transaction.atomic():
        locked = Order.objects.select_for_update().get(id=order.id)
        available = locked.paid_cents - locked.refunded_cents
        if amount_cents > available:
            raise ValueError("Estorno excede saldo liquido disponivel.")
        locked.refunded_cents += amount_cents
        locked.save(update_fields=["refunded_cents"])
        LedgerEntry.objects.create(order=locked, entry_type="REFUND_DEBIT", amount_cents=-amount_cents)
        transaction.on_commit(lambda: notify_refund_task.delay(str(locked.id), amount_cents))`,
  },
  {
    path: "apps/notifications/consumers.py",
    folder: "apps/notifications",
    language: "python",
    summary: "WebSocket autenticado por grupo de pedido + Storage externo para mídia.",
    lessonSlugs: ["modulo-4-tempo-real-e-midia"],
    content: `from channels.generic.websocket import AsyncJsonWebsocketConsumer

class OrderStatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        order_id = self.scope["url_route"]["kwargs"]["order_id"]
        if not user or not user.is_authenticated or not await user_owns_order(user.id, order_id):
            await self.close(code=4403)
            return
        self.group_name = f"order_{order_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()`,
  },
  {
    path: "deploy/docker-compose.prod.yml",
    folder: "deploy",
    language: "yaml",
    summary: "Stack de produção com API Gunicorn, Worker Celery, Postgres e Redis isolados.",
    lessonSlugs: ["modulo-5-infraestrutura-deploy-backup", "modulo-7-projeto-final-certificado"],
    content: `services:
  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
  redis:
    image: redis:7-alpine
  web:
    build: .
    command: gunicorn config.wsgi:application --workers 4 --timeout 30
    depends_on:
      postgres:
        condition: service_healthy
  worker:
    build: .
    command: celery -A config worker -l info --concurrency=4`,
  },
  {
    path: "tests/test_conservation.py",
    folder: "tests",
    language: "python",
    summary: "Teste de invariante financeira: cliente pago == loja + plataforma sempre.",
    lessonSlugs: ["modulo-0-f05-testes-e-git", "modulo-7-projeto-final-certificado"],
    content: `import unittest

def test_split_conservation_across_penny_cases():
    for total in (1, 17, 99, 1000, 12990):
        commission = (total * 1200 + 5000) // 10000
        seller_net = total - commission
        assert commission + seller_net == total`,
  },
];

export function findRepoFilesForLesson(lessonSlug: string): RepoFileNode[] {
  return MYSUPERSTORE_REPO_FILES.filter((file) => file.lessonSlugs.includes(lessonSlug));
}
