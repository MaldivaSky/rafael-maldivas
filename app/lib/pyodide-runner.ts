"use client";

/**
 * Lazy singleton runner for Python 3.12 + SQLite in-browser via Pyodide CDN.
 */

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

export interface LabTestResult {
  name: string;
  passed: boolean;
  detail: string;
}

export interface LabRunOutput {
  ok: boolean;
  stdout: string;
  stderr: string;
  testResults: LabTestResult[];
  allPassed: boolean;
  durationMs: number;
  errorMessage?: string;
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (line: string) => void }) => void;
  setStderr: (opts: { batched: (line: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

let pyodidePromise: Promise<PyodideInstance> | null = null;
let pyodideReady = false;

export function isPyodideLoaded(): boolean {
  return pyodideReady;
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Pyodide requer ambiente de navegador."));
      return;
    }
    if (typeof window.loadPyodide === "function") {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[data-pyodide="true"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar runtime Pyodide CDN.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.pyodide = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao baixar Pyodide WebAssembly da CDN."));
    document.head.appendChild(script);
  });
}

export async function getPyodideInstance(): Promise<PyodideInstance> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScriptOnce(PYODIDE_SCRIPT_URL);
      if (typeof window.loadPyodide !== "function") {
        throw new Error("window.loadPyodide indisponivel apos carregar script.");
      }
      const instance = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
      pyodideReady = true;
      return instance;
    })().catch((err) => {
      pyodidePromise = null;
      pyodideReady = false;
      throw err;
    });
  }
  return pyodidePromise;
}

export async function runPythonLab(
  studentCode: string,
  testRunnerCode: string,
): Promise<LabRunOutput> {
  const startedAt = performance.now();
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];
  const testResults: LabTestResult[] = [];

  try {
    const py = await getPyodideInstance();
    py.setStdout({
      batched: (line: string) => {
        if (line.startsWith("__TEST_RESULT__:")) {
          const rawJson = line.slice("__TEST_RESULT__:".length);
          try {
            const parsed = JSON.parse(rawJson) as Partial<LabTestResult>;
            testResults.push({
              name: String(parsed.name ?? "Teste"),
              passed: Boolean(parsed.passed),
              detail: String(parsed.detail ?? ""),
            });
            return;
          } catch {
            // Fall through to normal stdout
          }
        }
        stdoutLines.push(line);
      },
    });
    py.setStderr({
      batched: (line: string) => {
        stderrLines.push(line);
      },
    });

    const combinedCode = `${studentCode}\n\n# --- BATERIA DE TESTES ---\n${testRunnerCode}\n`;
    await py.runPythonAsync(combinedCode);

    const allPassed = testResults.length > 0 && testResults.every((t) => t.passed);
    return {
      ok: true,
      stdout: stdoutLines.join("\n"),
      stderr: stderrLines.join("\n"),
      testResults,
      allPassed,
      durationMs: Math.round(performance.now() - startedAt),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      stdout: stdoutLines.join("\n"),
      stderr: stderrLines.length > 0 ? stderrLines.join("\n") : message,
      testResults,
      allPassed: false,
      durationMs: Math.round(performance.now() - startedAt),
      errorMessage: message,
    };
  }
}
