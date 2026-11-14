"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FlipHorizontal2,
  Plus,
  RotateCw,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  DEFAULT_CLOTHING_STOREFRONT,
  getCourseLevelSpec,
  getDeployCardsForLevel,
  type CourseDifficultyLevel,
} from "@/app/lib/course-levels";
import {
  generateRenderBlueprintYaml,
  generateStandaloneStoreHtml,
  type CustomStoreProduct,
} from "@/app/lib/store-generator";

interface FreeDeployGuidePanelProps {
  selectedLevel: CourseDifficultyLevel;
  deployChecklist: Record<string, boolean>;
  onToggleDeployStep: (stepId: string) => void;
  onChangeLevel?: (level: CourseDifficultyLevel) => void;
  sectionMode?: "all" | "builder" | "deploy";
  initialProviderId?: string;
}

interface CartEntry {
  productId: string;
  name: string;
  size: string;
  priceCents: number;
  qty: number;
}

interface StoreBuilderProduct extends CustomStoreProduct {
  imagePath?: string;
}

const THEME_SWATCHES = [
  { label: "Azul Ciano", hex: "#22B5F2" },
  { label: "Esmeralda", hex: "#22C55E" },
  { label: "Âmbar", hex: "#F59E0B" },
  { label: "Coral", hex: "#F43F5E" },
];

function formatBrl(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function triggerFileDownload(filename: string, content: string, mime = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function FreeDeployGuidePanel({
  selectedLevel,
  deployChecklist,
  onToggleDeployStep,
  onChangeLevel,
  sectionMode = "all",
  initialProviderId,
}: FreeDeployGuidePanelProps) {
  const levelSpec = getCourseLevelSpec(selectedLevel);
  const deployCards = getDeployCardsForLevel(selectedLevel);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [flippedProviderCards, setFlippedProviderCards] = useState<Record<string, boolean>>({});
  const [activeStepByCard, setActiveStepByCard] = useState<Record<string, number>>({});
  const [selectedProviderIdx, setSelectedProviderIdx] = useState<number>(() => {
    if (!initialProviderId) return 0;
    const idx = deployCards.findIndex((c) => c.id === initialProviderId);
    return idx >= 0 ? idx : 0;
  });

  // Custom Storefront Builder state
  const [storeName, setStoreName] = useState("Vitrine Jovem Store");
  const [whatsappDigits, setWhatsappDigits] = useState("5511999999999");
  const [accentHex, setAccentHex] = useState("#22B5F2");
  const [products, setProducts] = useState<StoreBuilderProduct[]>(() =>
    DEFAULT_CLOTHING_STOREFRONT.map((p) => ({
      id: p.id,
      name: p.name,
      priceCents: p.priceCents,
      sizes: p.sizes,
      colorHex: p.colorHex,
      badge: p.badge,
      imagePath: p.imagePath,
    })),
  );
  const [newProdName, setNewProdName] = useState("");
  const [newProdPriceReais, setNewProdPriceReais] = useState("89.90");

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [whatsappPreview, setWhatsappPreview] = useState<string | null>(null);

  const generatedHtml = useMemo(
    () =>
      generateStandaloneStoreHtml({
        storeName,
        whatsappDigits,
        accentHex,
        products,
      }),
    [accentHex, products, storeName, whatsappDigits],
  );

  async function copyValue(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard fallback unavailable
    }
  }

  function handleAddCustomProduct() {
    const cleanName = newProdName.trim();
    if (!cleanName) return;
    const parsedPrice = Number(newProdPriceReais.replace(",", "."));
    const priceCents = Number.isFinite(parsedPrice) && parsedPrice > 0
      ? Math.round(parsedPrice * 100)
      : 5990;
    const id = `prod-${Date.now()}`;
    setProducts((prev) => [
      ...prev,
      {
        id,
        name: cleanName,
        priceCents,
        sizes: ["P", "M", "G"],
        colorHex: accentHex,
        badge: "Meu item",
      },
    ]);
    setNewProdName("");
  }

  function addClothingItem(id: string) {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const size = selectedSizes[id] ?? prod.sizes[0] ?? "M";
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === id && i.size === size);
      if (idx >= 0) {
        return prev.map((item, i) => (i === idx ? { ...item, qty: item.qty + 1 } : item));
      }
      return [
        ...prev,
        { productId: id, name: prod.name, size, priceCents: prod.priceCents, qty: 1 },
      ];
    });
    setWhatsappPreview(null);
  }

  const totalCents = cart.reduce((acc, item) => acc + item.priceCents * item.qty, 0);

  function buildWhatsappSummary() {
    if (cart.length === 0) return;
    const lines = cart.map(
      (i) => `- ${i.qty}x ${i.name} (Tam ${i.size}) = ${formatBrl(i.priceCents * i.qty)}`,
    );
    const msg = `Ola! Pedido em ${storeName}:\n${lines.join("\n")}\nTotal: ${formatBrl(totalCents)}`;
    setWhatsappPreview(msg);
  }

  const completedDeployCount = deployCards.filter((c) => Boolean(deployChecklist[c.id])).length;
  const safeProviderIdx = Math.min(selectedProviderIdx, Math.max(0, deployCards.length - 1));
  const visibleDeployCards =
    deployCards.length > 0 ? [deployCards[safeProviderIdx]] : [];
  const showBuilder = sectionMode === "all" || sectionMode === "builder";
  const showDeploy = sectionMode === "all" || sectionMode === "deploy";

  return (
    <div className="ide-deploy-wrap">
      {/* Level Strip & Progress */}
      <div className="ide-deploy-hero">
        <div>
          <span className="ide-file-badge">{levelSpec.monthlyCost} · Fábrica de Loja + Publicação</span>
          <h3 className="ide-lab-title" style={{ marginTop: 6 }}>
            Plano Mínimo Gratuito — {levelSpec.name}
          </h3>
          <p className="ide-lab-objective">
            {sectionMode === "builder"
              ? "Personalize sua vitrine de roupas abaixo, teste o carrinho e baixe seu arquivo index.html pronto para publicar."
              : sectionMode === "deploy"
                ? `Siga uma etapa por vez para abrir conta gratuita e publicar (${completedDeployCount}/${deployCards.length} etapas concluídas).`
                : `Personalize sua loja abaixo, baixe o código pronto e siga uma etapa por vez para publicar (${completedDeployCount}/${deployCards.length} etapas concluídas).`}
          </p>
        </div>

        {onChangeLevel && (
          <div className="ide-level-pills" role="group" aria-label="Alternar nível de publicação">
            {(
              [
                ["facil", "Fácil (Vitrine)"],
                ["mediano", "Mediano (Render + DB)"],
                ["dificil", "Difícil (Completo)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`ide-preset-chip${selectedLevel === id ? " is-selected-chip" : ""}`}
                onClick={() => {
                  setSelectedProviderIdx(0);
                  onChangeLevel(id);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Custom Storefront Builder + Live Preview + Export */}
      {showBuilder && (
      <section className="ide-vitrine-box" aria-label="Construtor Ao Vivo da Sua Loja">
        <div className="ide-vitrine-head">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 ide-text-cyan" aria-hidden="true" />
            <strong>Fábrica da Sua Loja: Edite, Teste Ao Vivo e Baixe Pronto para Subir!</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="ide-btn ide-btn-primary ide-btn-xs"
              onClick={() => triggerFileDownload("index.html", generatedHtml)}
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Baixar index.html da Minha Loja</span>
            </button>
            {selectedLevel !== "facil" && (
              <button
                type="button"
                className="ide-btn ide-btn-ghost ide-btn-xs"
                onClick={() =>
                  triggerFileDownload(
                    "render.yaml",
                    generateRenderBlueprintYaml(),
                    "text/yaml;charset=utf-8",
                  )
                }
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Baixar render.yaml</span>
              </button>
            )}
          </div>
        </div>

        {/* Customizer Controls */}
        <div className="ide-builder-controls">
          <label className="ide-field-block">
            <span>Nome da sua loja</span>
            <input
              type="text"
              className="ide-http-input"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </label>
          <label className="ide-field-block">
            <span>Seu WhatsApp (com DDI 55 + DDD)</span>
            <input
              type="text"
              className="ide-http-input"
              value={whatsappDigits}
              onChange={(e) => setWhatsappDigits(e.target.value)}
            />
          </label>
          <div className="ide-field-block">
            <span>Cor da sua marca</span>
            <div className="flex flex-wrap gap-2">
              {THEME_SWATCHES.map((sw) => (
                <button
                  key={sw.hex}
                  type="button"
                  className={`ide-size-pill${accentHex === sw.hex ? " is-active" : ""}`}
                  style={{ borderColor: accentHex === sw.hex ? sw.hex : undefined }}
                  onClick={() => setAccentHex(sw.hex)}
                >
                  {sw.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Add Custom Clothing Piece */}
        <div className="ide-add-prod-row">
          <input
            type="text"
            aria-label="Nome da nova peça de roupa"
            className="ide-http-input"
            placeholder="Adicionar produto (ex: Boné Aba Curva)"
            value={newProdName}
            onChange={(e) => setNewProdName(e.target.value)}
          />
          <input
            type="text"
            aria-label="Preço em reais"
            className="ide-http-input"
            style={{ maxWidth: 110 }}
            placeholder="89.90"
            value={newProdPriceReais}
            onChange={(e) => setNewProdPriceReais(e.target.value)}
          />
          <button
            type="button"
            className="ide-btn ide-btn-ghost ide-btn-xs"
            onClick={handleAddCustomProduct}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Adicionar Peça</span>
          </button>
        </div>

        {/* Live Storefront Preview */}
        <div className="ide-vitrine-grid">
          {products.map((item) => {
            const activeSize = selectedSizes[item.id] ?? item.sizes[0] ?? "M";
            return (
              <div key={item.id} className="ide-clothing-card">
                {item.imagePath ? (
                  <div className="ide-clothing-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className="ide-clothing-thumb"
                      loading="lazy"
                    />
                    <span className="ide-clothing-media-badge">{item.badge}</span>
                  </div>
                ) : (
                  <div
                    className="ide-clothing-swatch"
                    style={{ background: `linear-gradient(135deg, ${item.colorHex}44, #0b1220)` }}
                    aria-hidden="true"
                  >
                    <span>{item.badge}</span>
                  </div>
                )}
                <div className="ide-clothing-title">{item.name}</div>
                <div className="ide-clothing-price" style={{ color: accentHex }}>
                  {formatBrl(item.priceCents)}
                </div>

                <div className="ide-clothing-sizes">
                  {item.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`ide-size-pill${activeSize === sz ? " is-active" : ""}`}
                      onClick={() =>
                        setSelectedSizes((prev) => ({ ...prev, [item.id]: sz }))
                      }
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="ide-btn ide-btn-primary ide-btn-xs"
                  style={{ background: accentHex, borderColor: accentHex }}
                  onClick={() => addClothingItem(item.id)}
                >
                  Adicionar ({activeSize})
                </button>
              </div>
            );
          })}
        </div>

        <div className="ide-vitrine-cart">
          <div className="ide-vitrine-cart-top">
            <span>
              <strong>{storeName}</strong> · Sacola:{" "}
              <strong>{cart.reduce((a, b) => a + b.qty, 0)}</strong> itens · Total{" "}
              <strong>{formatBrl(totalCents)}</strong>
            </span>
            <div className="flex gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  className="ide-btn ide-btn-ghost ide-btn-xs"
                  onClick={() => {
                    setCart([]);
                    setWhatsappPreview(null);
                  }}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" /> Limpar
                </button>
              )}
              <button
                type="button"
                className="ide-btn ide-btn-primary ide-btn-xs"
                disabled={cart.length === 0}
                onClick={buildWhatsappSummary}
              >
                Simular Pedido WhatsApp
              </button>
            </div>
          </div>

          {whatsappPreview && (
            <pre className="ide-console-stream" style={{ marginTop: 8 }}>
              {whatsappPreview}
            </pre>
          )}
        </div>
      </section>
      )}

      {/* Dynamic Focused 1-Provider-at-a-Time Deploy Cards */}
      {showDeploy && (
      <div className="ide-deploy-cards">
        <div
          className="ide-deploy-provider-stepper"
          role="tablist"
          aria-label="Escolher provedor de publicação gratuita"
        >
          {deployCards.map((c, idx) => {
            const isCurrent = idx === safeProviderIdx;
            const isDone = Boolean(deployChecklist[c.id]);
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                className={`ide-preset-chip${isCurrent ? " is-selected-chip" : ""}`}
                onClick={() => setSelectedProviderIdx(idx)}
              >
                {isDone ? "✓ " : `Passo ${idx + 1}: `}
                {c.provider}
              </button>
            );
          })}
        </div>

        {visibleDeployCards.map((card) => {
          const done = Boolean(deployChecklist[card.id]);
          const isFlipped = Boolean(flippedProviderCards[card.id]);
          const visuals = card.stepVisuals ?? [];
          const activeVisualIdx = Math.min(
            activeStepByCard[card.id] ?? 0,
            Math.max(0, visuals.length - 1),
          );
          const activeVisual = visuals[activeVisualIdx] ?? {
            stepLabel: "Tela Guiada",
            caption: card.simpleAnalogy,
            imagePath: card.imagePath,
            imageAlt: card.imageAlt,
          };

          return (
            <article key={card.id} className={`ide-deploy-card${done ? " is-done" : ""}`}>
              <div className="ide-deploy-card-top">
                <div>
                  <div className="ide-lab-file-row">
                    <span className="ide-file-badge">{card.provider}</span>
                    <span className="ide-status-chip is-ok">{card.costLabel}</span>
                  </div>
                  <h4 className="ide-deploy-card-title">{card.title}</h4>
                  <p className="ide-lab-objective">{card.simpleAnalogy}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="ide-btn ide-btn-ghost"
                    onClick={() =>
                      setFlippedProviderCards((prev) => ({
                        ...prev,
                        [card.id]: !prev[card.id],
                      }))
                    }
                  >
                    {isFlipped ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ver Passo Visual</span>
                      </>
                    ) : (
                      <>
                        <FlipHorizontal2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Virar: Comandos &amp; Segredos</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`ide-btn ${done ? "ide-btn-primary" : "ide-btn-ghost"}`}
                    onClick={() => onToggleDeployStep(card.id)}
                    aria-pressed={done}
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>{done ? "Etapa Feita" : "Marcar Feita"}</span>
                  </button>
                </div>
              </div>

              {!isFlipped ? (
                <div className="ide-deploy-visual-row">
                  <div className="ide-deploy-gallery-col">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeVisual.imagePath}
                      alt={activeVisual.imageAlt}
                      className="ide-deploy-thumb"
                      loading="lazy"
                    />
                    <p className="ide-deploy-caption">{activeVisual.caption}</p>

                    {visuals.length > 1 && (
                      <div
                        className="ide-step-thumb-strip"
                        role="tablist"
                        aria-label={`Telas do guia ${card.provider}`}
                      >
                        {visuals.map((vis, idx) => (
                          <button
                            key={vis.imagePath}
                            type="button"
                            role="tab"
                            aria-selected={activeVisualIdx === idx}
                            className={`ide-step-pill${activeVisualIdx === idx ? " is-active" : ""}`}
                            onClick={() =>
                              setActiveStepByCard((prev) => ({ ...prev, [card.id]: idx }))
                            }
                          >
                            {vis.stepLabel}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ide-deploy-steps-col">
                    <div className="ide-inspector-title">Onde clicar na tela (passo a passo)</div>
                    <ol className="ide-deploy-ol">
                      {card.whereToClick.map((step, idx) => {
                        const targetVisualIdx =
                          visuals.length > 0 ? Math.min(idx, visuals.length - 1) : 0;
                        return (
                          <li key={idx}>
                            <button
                              type="button"
                              className={`ide-deploy-step-btn${activeVisualIdx === targetVisualIdx ? " is-active" : ""}`}
                              onClick={() =>
                                setActiveStepByCard((prev) => ({
                                  ...prev,
                                  [card.id]: targetVisualIdx,
                                }))
                              }
                            >
                              {step}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                    <a
                      href={card.signupUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ide-external-btn"
                    >
                      <span>Abrir tela de cadastro do {card.provider}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="ide-deploy-back-face">
                  <div className="ide-deploy-fields">
                    {card.fields.map((field) => {
                      const key = `${card.id}-${field.label}`;
                      const copied = copiedKey === key;
                      return (
                        <div key={key} className="ide-deploy-field-box">
                          <div className="ide-deploy-field-head">
                            <span>{field.label}</span>
                            {field.copyable && (
                              <button
                                type="button"
                                className="ide-btn ide-btn-xs ide-btn-ghost"
                                onClick={() => copyValue(key, field.value)}
                              >
                                {copied ? (
                                  <>
                                    <Check className="w-3 h-3 ide-text-emerald" aria-hidden="true" /> Copiado
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" aria-hidden="true" /> Copiar
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <pre className="ide-deploy-code">{field.value}</pre>
                          {field.helper && <small className="ide-field-helper">{field.helper}</small>}
                        </div>
                      );
                    })}
                  </div>

                  {card.warningNote && (
                    <div className="ide-hint-box" role="note">
                      <strong>Segredo do plano R$ 0,00:</strong> {card.warningNote}
                    </div>
                  )}

                  {deployCards.length > 1 && (
                    <div
                      className="flex flex-wrap items-center justify-between gap-2"
                      style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(148,163,184,0.16)" }}
                    >
                      <button
                        type="button"
                        className="ide-btn ide-btn-ghost ide-btn-xs"
                        disabled={safeProviderIdx === 0}
                        onClick={() => setSelectedProviderIdx((i) => Math.max(0, i - 1))}
                      >
                        ← Provedor Anterior
                      </button>
                      <span className="ide-muted-xs">
                        Etapa {safeProviderIdx + 1} de {deployCards.length} ({card.provider})
                      </span>
                      <button
                        type="button"
                        className="ide-btn ide-btn-primary ide-btn-xs"
                        disabled={safeProviderIdx >= deployCards.length - 1}
                        onClick={() =>
                          setSelectedProviderIdx((i) => Math.min(deployCards.length - 1, i + 1))
                        }
                      >
                        Próximo Provedor →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}
