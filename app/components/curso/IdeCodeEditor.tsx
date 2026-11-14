"use client";

import { useMemo, useRef, type KeyboardEvent, type ReactNode } from "react";

interface IdeCodeEditorProps {
  value: string;
  onChange?: (next: string) => void;
  onRunShortcut?: () => void;
  readOnly?: boolean;
  language?: "python" | "sql-py" | "yaml" | "text";
  ariaLabel?: string;
  minHeight?: number;
}

const PY_KEYWORDS = new Set([
  "def",
  "class",
  "return",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "in",
  "not",
  "and",
  "or",
  "is",
  "try",
  "except",
  "finally",
  "raise",
  "with",
  "as",
  "import",
  "from",
  "pass",
  "break",
  "continue",
  "True",
  "False",
  "None",
  "async",
  "await",
  "lambda",
]);

const PY_BUILTINS = new Set([
  "int",
  "str",
  "float",
  "bool",
  "dict",
  "list",
  "set",
  "tuple",
  "len",
  "sum",
  "min",
  "max",
  "isinstance",
  "type",
  "print",
  "ValueError",
  "RuntimeError",
  "NotImplementedError",
  "Exception",
  "Decimal",
  "ROUND_HALF_UP",
]);

const TOKEN_RE = /(#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:_\d+)*(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

function highlightLineTokens(line: string, lineKey: number): ReactNode[] {
  if (!line) return [" "];
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let partIdx = 0;

  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    let cls = "";
    if (token.startsWith("#")) {
      cls = "ide-tok-comment";
    } else if (token.startsWith('"') || token.startsWith("'")) {
      cls = "ide-tok-string";
    } else if (/^\d/.test(token)) {
      cls = "ide-tok-number";
    } else if (PY_KEYWORDS.has(token)) {
      cls = "ide-tok-keyword";
    } else if (PY_BUILTINS.has(token)) {
      cls = "ide-tok-builtin";
    }

    if (cls) {
      nodes.push(
        <span key={`${lineKey}-${partIdx}`} className={cls}>
          {token}
        </span>,
      );
    } else {
      nodes.push(token);
    }
    partIdx += 1;
    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

export function IdeCodeEditor({
  value,
  onChange,
  onRunShortcut,
  readOnly = false,
  ariaLabel = "Editor de codigo Python",
  minHeight = 260,
}: IdeCodeEditorProps) {
  const preRef = useRef<HTMLPreElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lines = useMemo(() => value.split("\n"), [value]);
  const highlightedLines = useMemo(
    () => lines.map((line, i) => highlightLineTokens(line, i)),
    [lines],
  );

  function syncScroll(scrollTop: number, scrollLeft: number) {
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRunShortcut?.();
      return;
    }
    if (readOnly || !onChange) return;

    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = `${value.slice(0, start)}    ${value.slice(end)}`;
      onChange(next);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      });
    }
  }

  return (
    <div className="ide-editor-shell" style={{ minHeight }}>
      <div ref={gutterRef} className="ide-editor-gutter" aria-hidden="true">
        {lines.map((_, i) => (
          <div key={i} className="ide-editor-line-num">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="ide-editor-stage">
        <pre ref={preRef} className="ide-editor-highlight" aria-hidden="true">
          <code>
            {highlightedLines.map((nodes, idx) => (
              <div key={idx} className="ide-editor-code-line">
                {nodes}
              </div>
            ))}
          </code>
        </pre>

        <textarea
          ref={textareaRef}
          className="ide-editor-textarea"
          value={value}
          readOnly={readOnly}
          aria-label={ariaLabel}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={(e) => syncScroll(e.currentTarget.scrollTop, e.currentTarget.scrollLeft)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
