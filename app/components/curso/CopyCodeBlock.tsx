"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

function inferLanguageLabel(title: string, code: string, explicitLang?: string): string {
  if (explicitLang) return explicitLang.toUpperCase();
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes(".py") || lowerTitle.includes("python") || lowerTitle.includes("django")) return "PYTHON";
  if (lowerTitle.includes("sql") || lowerTitle.includes("postgres")) return "SQL";
  if (lowerTitle.includes("yaml") || lowerTitle.includes("yml")) return "YAML";
  if (lowerTitle.includes("json") || lowerTitle.includes("webhook") || lowerTitle.includes("http")) return "JSON / HTTP";
  if (lowerTitle.includes("terminal") || lowerTitle.includes("bash") || code.trim().startsWith("$")) return "BASH";
  if (lowerTitle.includes(".tsx") || lowerTitle.includes(".ts") || lowerTitle.includes("next")) return "TYPESCRIPT";
  if (lowerTitle.includes(".html")) return "HTML";
  if (/^\s*(SELECT|UPDATE|INSERT|CREATE|WITH)\b/i.test(code)) return "SQL";
  if (/^\s*(def |class |from |import |with transaction)/m.test(code)) return "PYTHON";
  return "CODE";
}

export default function CopyCodeBlock({
  title,
  code,
  language,
}: {
  title: string;
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const langBadge = inferLanguageLabel(title, code, language);

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
    <div className="curso-code-card" data-code-theme="dark">
      <div className="curso-code-head curso-code-head-flex">
        <div className="curso-code-head-left">
          <span className="curso-code-dots" aria-hidden="true">
            <i className="dot-r" />
            <i className="dot-y" />
            <i className="dot-g" />
          </span>
          <Terminal size={13} className="curso-code-icon" aria-hidden="true" />
          <span className="curso-code-filename">{title}</span>
        </div>
        <div className="curso-code-head-right">
          <span className="curso-code-lang-pill">{langBadge}</span>
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
      </div>
      <pre className="curso-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

