"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyCodeBlock({
  title,
  code,
}: {
  title: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div className="curso-code-card">
      <div className="curso-code-head curso-code-head-flex">
        <span>{title}</span>
        <button
          type="button"
          className="curso-copy-btn"
          onClick={handleCopy}
          aria-label={`Copiar ${title}`}
        >
          {copied ? (
            <>
              <Check size={13} aria-hidden="true" /> Copiado
            </>
          ) : (
            <>
              <Copy size={13} aria-hidden="true" /> Copiar
            </>
          )}
        </button>
      </div>
      <pre className="curso-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

