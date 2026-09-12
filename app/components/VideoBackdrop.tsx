"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Vídeo institucional do hero.
 *
 * Regras:
 * - tenta tocar COM som. Chrome, Safari e Firefox rejeitam `play()` com
 *   áudio antes de o visitante interagir com o site; quando isso acontece
 *   o vídeo toca mudo e o botão fica piscando convidando a ligar o som.
 * - o áudio toca UMA volta. Depois disso o vídeo segue em loop silencioso,
 *   porque trilha repetindo sem parar atrapalha quem está lendo.
 * - o botão é a única coisa que liga e desliga o som. Não existe nenhum
 *   religamento automático disputando com o clique do visitante — era
 *   exatamente isso que fazia "silenciar" religar o áudio.
 */
export default function VideoBackdrop({
  label,
}: {
  label: { on: string; off: string; hint: string; replay: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [heard, setHeard] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // o elemento é a fonte da verdade; o estado do React só espelha
    const sync = () => setMuted(v.muted);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }

    v.muted = false;
    v.play()
      .then(() => setMuted(false))
      .catch(() => {
        // o navegador recusou o áudio. Toca mudo e avisa no botão.
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play().catch(() => {});
      });

    // com `loop`, o evento `ended` nunca dispara: a volta completa é
    // detectada pelo tempo voltando para perto de zero
    let last = 0;
    const onTime = () => {
      if (v.currentTime < last - 0.4 && !v.muted) {
        v.muted = true;
        setMuted(true);
        setHeard(true);
      }
      last = v.currentTime;
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("volumechange", sync);

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
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("volumechange", sync);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;

    const next = !v.muted; // lê do elemento, nunca do estado do React
    v.muted = next;
    setMuted(next);
    setBlocked(false);

    if (!next) {
      v.currentTime = 0; // ligou o som: ouve a peça desde o começo
      setHeard(false);
      v.play().catch(() => {});
    }
  };

  const text = blocked ? label.hint : muted ? (heard ? label.replay : label.on) : label.off;

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
        preload="auto"
        onCanPlay={() => setReady(true)}
      >
        <source src="/video/maldivas-hero.webm" type="video/webm" />
        <source src="/video/maldivas-hero.mp4" type="video/mp4" />
      </video>

      <div className="video-scrim" aria-hidden="true" />

      <button
        type="button"
        className={`video-sound ${blocked ? "is-blocked" : ""} ${muted ? "is-muted" : "is-playing"}`}
        onClick={toggle}
        aria-label={text}
      >
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        <span className="video-sound-txt">{text}</span>
      </button>
    </div>
  );
}
