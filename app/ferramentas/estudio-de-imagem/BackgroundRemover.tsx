"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, ShieldCheck, Upload, Wand2 } from "lucide-react";
import { useLang } from "../../lib/i18n";

/**
 * Remoção de fundo 100% no navegador.
 *
 * O @imgly/background-removal roda um modelo ONNX em WebAssembly no próprio
 * dispositivo — a foto nunca sai do computador de quem usa. Ele é carregado
 * sob demanda (next/dynamic, ssr:false), porque os pesos do modelo são grandes
 * e só devem baixar quando alguém abre esta aba de verdade.
 *
 * O pacote embute o onnxruntime-web, cujo bundle usa `import.meta` e não
 * sobrevive ao webpack nem ao SSR. Em vez de brigar com a configuração de
 * build, buscamos o build ESM publicado no CDN direto no navegador — assim
 * ele fica fora do bundle, é cacheado pelo navegador e nada toca o servidor.
 */

type Phase = "idle" | "loading-model" | "working" | "done" | "error";

const bytes = (n: number) =>
  n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${Math.round(n / 1024)} KB`;

const IMGLY_ESM = "https://esm.sh/@imgly/background-removal@1.7.0";

type RemoveBg = (
  input: File | Blob | string,
  config?: {
    progress?: (key: string, current: number, total: number) => void;
    output?: { format?: string; quality?: number };
    publicPath?: string;
  }
) => Promise<Blob>;

let removerPromise: Promise<RemoveBg> | null = null;
function loadRemover(): Promise<RemoveBg> {
  if (!removerPromise) {
    removerPromise = import(
      /* webpackIgnore: true */ /* @vite-ignore */ IMGLY_ESM
    ).then((mod: { removeBackground: RemoveBg }) => mod.removeBackground);
  }
  return removerPromise;
}

export default function BackgroundRemover() {
  const { lang } = useLang();
  const pt = lang === "pt";

  const [phase, setPhase] = useState<Phase>("idle");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceBytes, setSourceBytes] = useState(0);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [cutoutBytes, setCutoutBytes] = useState(0);
  const [cutoutSize, setCutoutSize] = useState<{ w: number; h: number } | null>(null);
  const [bg, setBg] = useState("transparent");
  const [solid, setSolid] = useState("#ffffff");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const input = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => () => void (sourceUrl && URL.revokeObjectURL(sourceUrl)), [sourceUrl]);
  useEffect(() => () => void (cutoutUrl && URL.revokeObjectURL(cutoutUrl)), [cutoutUrl]);

  const reset = useCallback(() => {
    setPhase("idle");
    setSourceName("");
    setSourceUrl(null);
    setSourceBytes(0);
    setCutoutUrl(null);
    setCutoutBytes(0);
    setCutoutSize(null);
    setError("");
    setProgress(0);
    if (input.current) input.current.value = "";
  }, []);

  const run = useCallback(
    async (file: File) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 20 * 1024 * 1024) {
        setError(
          pt
            ? "Escolha um JPG, PNG ou WebP de até 20 MB."
            : "Choose a JPG, PNG or WebP up to 20 MB."
        );
        return;
      }

      reset();
      setSourceName(file.name);
      setSourceBytes(file.size);
      setSourceUrl(URL.createObjectURL(file));
      setPhase("loading-model");

      try {
        // baixa o pacote e o modelo só agora — nada disso pesa no primeiro load
        const removeBackground = await loadRemover();
        if (!mounted.current) return;
        setPhase("working");

        const blob = await removeBackground(file, {
          progress: (key, current, total) => {
            if (!mounted.current) return;
            // as chaves do modelo contam; as de fetch do arquivo, não
            if (key.startsWith("fetch")) {
              setProgress(total > 0 ? Math.round((current / total) * 100) : 0);
            }
          },
          output: { format: "image/png", quality: 1 },
        });

        if (!mounted.current) return;

        // mede as dimensões reais do recorte para exibir no resultado
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await img.decode().catch(() => undefined);

        setCutoutUrl(url);
        setCutoutBytes(blob.size);
        setCutoutSize({ w: img.naturalWidth, h: img.naturalHeight });
        setPhase("done");
      } catch {
        if (!mounted.current) return;
        setError(
          pt
            ? "Não foi possível remover o fundo desta imagem. Tente outra foto ou um arquivo menor."
            : "Could not remove this image's background. Try another photo or a smaller file."
        );
        setPhase("error");
      }
    },
    [pt, reset]
  );

  /**
   * Compõe o recorte sobre uma cor sólida quando o usuário não quer PNG
   * transparente (útil para catálogo e para o Mercado Livre, que exige fundo).
   */
  const download = useCallback(async () => {
    if (!cutoutUrl) return;
    const base = sourceName.replace(/\.[^.]+$/, "") || "imagem";

    if (bg === "transparent") {
      const a = document.createElement("a");
      a.href = cutoutUrl;
      a.download = `${base}-sem-fundo.png`;
      a.click();
      return;
    }

    const img = new Image();
    img.src = cutoutUrl;
    await img.decode().catch(() => undefined);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = solid;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}-fundo.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  }, [cutoutUrl, sourceName, bg, solid]);

  return (
    <div className="bg-remove">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="studio-file"
        aria-label={pt ? "Escolher imagem" : "Choose image"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void run(file);
          e.target.value = "";
        }}
      />

      {phase === "idle" && (
        <button className="studio-drop" onClick={() => input.current?.click()}>
          <Wand2 size={46} strokeWidth={1} />
          <strong>{pt ? "Escolha uma foto para tirar o fundo" : "Choose a photo to remove the background"}</strong>
          <span>JPG, PNG, WebP · {pt ? "até 20 MB" : "up to 20 MB"}</span>
          <span className="btn btn-primary">
            <Upload size={17} />
            {pt ? "Escolher imagem" : "Choose image"}
          </span>
        </button>
      )}

      {phase === "loading-model" && (
        <div className="studio-drop" role="status">
          <Loader2 size={40} className="spin" />
          <strong>{pt ? "Carregando o modelo…" : "Loading the model…"}</strong>
          <span>
            {pt
              ? "Só na primeira vez. Ele fica em cache no seu navegador depois disso."
              : "Only the first time. It is cached in your browser afterwards."}
          </span>
        </div>
      )}

      {phase === "working" && (
        <div className="studio-drop" role="status">
          <Loader2 size={40} className="spin" />
          <strong>{pt ? "Separando o fundo…" : "Separating the background…"}</strong>
          <span>{pt ? "Rodando no seu dispositivo, sem enviar a foto." : "Running on your device, without uploading."}</span>
          {progress > 0 && <progress value={progress} max={100} style={{ width: "60%" }} />}
        </div>
      )}

      {(phase === "done" || phase === "error") && sourceUrl && (
        <div className="bg-remove-grid">
          <figure className="bg-remove-panel">
            <figcaption>{pt ? "Original" : "Original"}</figcaption>
            <div className="studio-checker">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sourceUrl} alt={pt ? "Imagem original" : "Original image"} />
            </div>
            <span className="studio-source">
              <span>{sourceName}</span>
              <span>{bytes(sourceBytes)}</span>
            </span>
          </figure>

          <figure className="bg-remove-panel">
            <figcaption>{pt ? "Sem fundo" : "Background removed"}</figcaption>
            <div className="studio-checker">
              {phase === "done" && cutoutUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cutoutUrl} alt={pt ? "Imagem sem fundo" : "Image without background"} />
              ) : (
                <span role="status">{pt ? "Não foi possível processar." : "Could not process."}</span>
              )}
            </div>
            {phase === "done" && cutoutSize && (
              <span className="studio-source">
                <span>PNG</span>
                <span>
                  {cutoutSize.w} × {cutoutSize.h} · {bytes(cutoutBytes)}
                </span>
              </span>
            )}
          </figure>
        </div>
      )}

      {phase === "done" && (
        <div className="bg-remove-actions">
          <fieldset className="bg-remove-fieldset">
            <legend>{pt ? "Fundo do arquivo baixado" : "Background of the downloaded file"}</legend>
            <label>
              <input
                type="radio"
                name="bg"
                checked={bg === "transparent"}
                onChange={() => setBg("transparent")}
              />
              {pt ? "Transparente (PNG)" : "Transparent (PNG)"}
            </label>
            <label>
              <input type="radio" name="bg" checked={bg === "solid"} onChange={() => setBg("solid")} />
              {pt ? "Cor sólida" : "Solid colour"}
              <input
                type="color"
                value={solid}
                disabled={bg !== "solid"}
                onChange={(e) => setSolid(e.target.value)}
              />
            </label>
          </fieldset>

          <button className="btn btn-primary studio-download" onClick={() => void download()}>
            <Download size={18} />
            {pt ? "Baixar imagem" : "Download image"}
          </button>
          <button className="studio-reset" onClick={() => input.current?.click()}>
            {pt ? "Trocar foto" : "Change photo"}
          </button>
          <button className="studio-reset" onClick={reset}>
            {pt ? "Limpar" : "Clear"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="studio-error">
          {error}
        </p>
      )}

      <p className="studio-private studio-private-inline">
        <ShieldCheck size={18} />
        {pt
          ? "A remoção acontece no seu navegador. A foto não é enviada para nenhum servidor."
          : "Removal happens in your browser. The photo is not sent to any server."}
      </p>

      <div className="studio-explainer">
        <div>
          <h2>{pt ? "Para que serve o PNG sem fundo?" : "What is a transparent PNG for?"}</h2>
          <p>
            {pt
              ? "Recorte de produto com fundo transparente entra em catálogo, anúncio e vitrine sem aquele retângulo branco em volta. Quando a plataforma exige fundo (Mercado Livre e alguns marketplaces), escolha uma cor sólida branca antes de baixar."
              : "A product cut-out with a transparent background drops into a catalogue, ad or storefront without a white rectangle around it. When the platform demands a background (Mercado Livre and some marketplaces), pick a solid white before downloading."}
          </p>
        </div>
        <div>
          <h2>{pt ? "Funciona com qualquer foto?" : "Does it work with any photo?"}</h2>
          <p>
            {pt
              ? "O resultado é melhor com o sujeito bem separado do fundo: produto sobre mesa lisa, pessoa contra parede. Cabelo, pelos e vidro são os casos mais difíceis para qualquer remoção automática, inclusive as pagas."
              : "Results are best when the subject stands apart from the background: a product on a plain table, a person against a wall. Hair, fur and glass are the hardest cases for any automatic removal, paid ones included."}
          </p>
        </div>
      </div>
    </div>
  );
}
