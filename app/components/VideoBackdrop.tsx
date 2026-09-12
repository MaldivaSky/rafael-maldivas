"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Vídeo institucional como fundo do hero, tocando COM som.
 *
 * Chrome, Safari e Firefox bloqueiam autoplay com áudio — `play()` é
 * rejeitado se o vídeo não estiver mudo e o visitante ainda não tiver
 * interagido com o site. Não há como contornar isso por código.
 *
 * Então a estratégia é: tentar com som primeiro; se o navegador recusar,
 * cair para mudo e destravar o áudio no primeiro toque, clique, tecla ou
 * rolagem da página — qualquer um desses conta como gesto do usuário.
 */
export default function VideoBackdrop({
  label,
}: {
  label: { on: string; off: string; hint: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const manual = useRef(false); // o visitante mandou calar: respeitar

  const armAudio = useCallback(() => {
    const v = ref.current;
    if (!v || manual.current) return;
    v.muted = false;
    v.play()
      .then(() => {
        setMuted(false);
        setBlocked(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }

    // 1ª tentativa: com som
    v.muted = false;
    v.play()
      .then(() => setMuted(false))
      .catch(() => {
        // o navegador recusou. Toca mudo e espera um gesto.
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play().catch(() => {});

        const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
        const once = () => {
          events.forEach((e) => window.removeEventListener(e, once));
          armAudio();
        };
        events.forEach((e) => window.addEventListener(e, once, { once: true, passive: true }));
      });

    // fora da tela ou aba escondida: não gasta CPU nem toca som sozinho
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
  }, [armAudio]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    manual.current = next; // silenciou de propósito, não religa sozinho
    v.muted = next;
    setMuted(next);
    setBlocked(false);
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
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      >
        <source src="/video/maldivas-hero.webm" type="video/webm" />
        <source src="/video/maldivas-hero.mp4" type="video/mp4" />
      </video>

      <div className="video-scrim" aria-hidden="true" />

      <button
        type="button"
        className={`video-sound ${blocked ? "is-blocked" : ""}`}
        onClick={toggle}
        aria-label={muted ? label.on : label.off}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {blocked && <span className="video-sound-hint">{label.hint}</span>}
      </button>
    </div>
  );
}
