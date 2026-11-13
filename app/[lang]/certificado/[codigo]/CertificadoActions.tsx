"use client";

import { useState } from "react";
import { Check, Copy, Printer, Share2 } from "lucide-react";

export default function CertificadoActions({
  verifyUrl,
  codigo,
}: {
  verifyUrl: string;
  codigo: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
        Código rastreável: <code>{codigo}</code>
      </div>
      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={copyLink}
          className="btn-g"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          {copied ? <Check size={16} color="#22C55E" /> : <Copy size={16} />}
          {copied ? "Link copiado!" : "Copiar link verificável"}
        </button>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-g"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <Share2 size={16} />
          Compartilhar no LinkedIn
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-p"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          <Printer size={16} />
          Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  );
}

