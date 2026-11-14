/**
 * Pure generator that builds a ready-to-publish standalone clothing storefront
 * (HTML/CSS/JS + JSON catalog + Render/Vercel deploy configs) from the student's custom edits.
 *
 * Zero sibling runtime imports so Node 24 --test can import directly.
 */

export interface CustomStoreProduct {
  id: string;
  name: string;
  priceCents: number;
  sizes: string[];
  colorHex: string;
  badge: string;
}

export interface CustomStoreConfig {
  storeName: string;
  whatsappDigits: string;
  accentHex: string;
  products: CustomStoreProduct[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHex(hex: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex.trim()) ? hex.trim() : "#22B5F2";
}

function sanitizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits : "5511999999999";
}

export function generateStandaloneStoreHtml(config: CustomStoreConfig): string {
  const storeName = escapeHtml(config.storeName.trim() || "Minha Loja Oficial");
  const accent = safeHex(config.accentHex);
  const whatsapp = sanitizeWhatsapp(config.whatsappDigits);
  const safeCatalogJson = JSON.stringify(
    config.products.map((p) => ({
      id: p.id,
      name: p.name,
      priceCents: Math.max(100, Math.trunc(p.priceCents)),
      sizes: p.sizes.length > 0 ? p.sizes : ["P", "M", "G"],
      colorHex: safeHex(p.colorHex),
      badge: p.badge || "Novo",
    })),
  ).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${storeName}</title>
  <style>
    :root { --accent: ${accent}; --bg: #0b1220; --surface: #111a2e; --fg: #f8fafc; --muted: #94a3b8; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.5; }
    .wrap { max-width: 1040px; margin: 0 auto; padding: 24px 18px; }
    header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid rgba(148,163,184,0.2); }
    h1 { margin: 0; font-size: 1.5rem; }
    .badge { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: var(--accent); color: #0b1220; font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 22px; }
    .card { background: var(--surface); border: 1px solid rgba(148,163,184,0.22); border-radius: 14px; padding: 14px; display: grid; gap: 10px; }
    .banner { height: 84px; border-radius: 10px; display: flex; align-items: flex-end; padding: 8px; }
    .banner span { font-size: 11px; background: rgba(2,6,23,0.75); padding: 2px 8px; border-radius: 6px; }
    .price { font-size: 1.1rem; font-weight: 700; color: var(--accent); }
    .sizes { display: flex; flex-wrap: wrap; gap: 6px; }
    .sz { border: 1px solid rgba(148,163,184,0.35); background: transparent; color: var(--fg); border-radius: 6px; padding: 4px 10px; cursor: pointer; font-weight: 600; }
    .sz.active { border-color: var(--accent); background: rgba(34,181,242,0.18); }
    .btn { border: none; border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; background: var(--accent); color: #0b1220; }
    .btn-wa { background: #22c55e; color: #052e16; width: 100%; }
    .cart { margin-top: 28px; background: var(--surface); border: 1px solid rgba(34,197,94,0.4); border-radius: 14px; padding: 16px; display: grid; gap: 10px; }
    .cart ul { margin: 0; padding-left: 18px; color: var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h1>${storeName}</h1>
        <small style="color: var(--muted)">Criado na trilha pratica Maldivas Tech</small>
      </div>
      <span class="badge" id="cart-count">Sacola: 0 itens</span>
    </header>

    <main class="grid" id="catalog"></main>

    <section class="cart" aria-label="Resumo do pedido">
      <strong>Sua Sacola — Total: <span id="cart-total">R$ 0,00</span></strong>
      <ul id="cart-items"><li>Nenhum item adicionado ainda.</li></ul>
      <button type="button" class="btn btn-wa" id="wa-btn">Finalizar Pedido no WhatsApp</button>
    </section>
  </div>

  <script>
    const PRODUCTS = ${safeCatalogJson};
    const WHATSAPP = ${JSON.stringify(whatsapp)};
    const selectedSizes = {};
    const cart = [];

    function brl(cents) {
      return "R$ " + (cents / 100).toFixed(2).replace(".", ",");
    }

    function renderCatalog() {
      const root = document.getElementById("catalog");
      root.textContent = "";
      PRODUCTS.forEach((p) => {
        if (!selectedSizes[p.id]) selectedSizes[p.id] = p.sizes[0];
        const card = document.createElement("article");
        card.className = "card";

        const banner = document.createElement("div");
        banner.className = "banner";
        banner.style.background = "linear-gradient(135deg, " + p.colorHex + "33, #0b1220)";
        banner.style.border = "1px solid " + p.colorHex + "66";
        banner.style.position = "relative";
        banner.style.overflow = "hidden";
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 64 48");
        icon.setAttribute("width", "48");
        icon.setAttribute("height", "36");
        icon.style.marginLeft = "auto";
        const shirtPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shirtPath.setAttribute("d", "M16 8 L24 6 Q32 12 40 6 L48 8 L58 18 L50 24 L44 20 L44 42 L20 42 L20 20 L14 24 L6 18 Z");
        shirtPath.setAttribute("fill", p.colorHex);
        shirtPath.setAttribute("opacity", "0.85");
        icon.appendChild(shirtPath);
        const tag = document.createElement("span");
        tag.textContent = p.badge;
        banner.append(tag, icon);

        const title = document.createElement("strong");
        title.textContent = p.name;

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = brl(p.priceCents);

        const sizesRow = document.createElement("div");
        sizesRow.className = "sizes";
        p.sizes.forEach((sz) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "sz" + (selectedSizes[p.id] === sz ? " active" : "");
          btn.textContent = sz;
          btn.onclick = () => { selectedSizes[p.id] = sz; renderCatalog(); };
          sizesRow.appendChild(btn);
        });

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn";
        addBtn.textContent = "Adicionar (" + selectedSizes[p.id] + ")";
        addBtn.onclick = () => {
          const size = selectedSizes[p.id];
          const found = cart.find((c) => c.id === p.id && c.size === size);
          if (found) found.qty += 1;
          else cart.push({ id: p.id, name: p.name, size, priceCents: p.priceCents, qty: 1 });
          renderCart();
        };

        card.append(banner, title, price, sizesRow, addBtn);
        root.appendChild(card);
      });
    }

    function renderCart() {
      const countEl = document.getElementById("cart-count");
      const totalEl = document.getElementById("cart-total");
      const listEl = document.getElementById("cart-items");
      const totalQty = cart.reduce((a, b) => a + b.qty, 0);
      const totalCents = cart.reduce((a, b) => a + b.priceCents * b.qty, 0);
      countEl.textContent = "Sacola: " + totalQty + " itens";
      totalEl.textContent = brl(totalCents);
      listEl.textContent = "";
      if (cart.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum item adicionado ainda.";
        listEl.appendChild(li);
        return;
      }
      cart.forEach((i) => {
        const li = document.createElement("li");
        li.textContent = i.qty + "x " + i.name + " (Tam " + i.size + ") — " + brl(i.priceCents * i.qty);
        listEl.appendChild(li);
      });
    }

    document.getElementById("wa-btn").onclick = () => {
      if (cart.length === 0) return alert("Adicione pelo menos 1 produto primeiro!");
      const lines = cart.map((i) => "- " + i.qty + "x " + i.name + " (Tam " + i.size + ") = " + brl(i.priceCents * i.qty));
      const totalCents = cart.reduce((a, b) => a + b.priceCents * b.qty, 0);
      const text = "Ola! Pedido em ${storeName}:\\n" + lines.join("\\n") + "\\nTotal: " + brl(totalCents);
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank");
    };

    renderCatalog();
    renderCart();
  </script>
</body>
</html>
`;
}

export function generateRenderBlueprintYaml(): string {
  return `services:
  - type: web
    name: minha-loja-api
    runtime: python
    plan: free
    buildCommand: "pip install -r requirements.txt && python manage.py migrate"
    startCommand: "gunicorn config.wsgi:application"
    envVars:
      - key: DJANGO_DEBUG
        value: "false"
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        value: ".onrender.com"
      - key: DATABASE_URL
        sync: false
      - key: CORS_ALLOWED_ORIGINS
        sync: false
`;
}
