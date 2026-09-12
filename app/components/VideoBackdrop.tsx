"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Vídeo institucional como fundo do hero.
 *
 * Regras: sempre em loop, sempre mudo ao carregar (autoplay com som é
 * bloqueado por todos os navegadores e irrita quem chega), com o áudio
 * disponível num toque. Pausa quando sai da tela ou a aba perde o foco.
 */
export default function VideoBackdrop({
  label,
}: {
  label: { on: string; off: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause(); // fica no poster
      return;
    }

    // fora da tela ou aba em segundo plano: não decodifica frame à toa
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(v);

    const onVis = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {});
  };

  return (
    <div className="video-backdrop">
      <video
        ref={ref}
        aria-hidden="true"
        className={`video-backdrop-el ${ready ? "is-ready" : ""}`}
        poster="/video/maldivas-hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setReady(true)}
      >
        <source src="/video/maldivas-hero.webm" type="video/webm" />
        <source src="/video/maldivas-hero.mp4" type="video/mp4" />
      </video>

      <div className="video-scrim" aria-hidden="true" />

      <button
        type="button"
        className="video-sound"
        onClick={toggle}
        aria-label={muted ? label.on : label.off}
        title={muted ? label.on : label.off}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}
