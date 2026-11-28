"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

type PlaybackState = "loading" | "playing" | "paused" | "ended";

/**
 * Vídeo institucional do hero.
 *
 * Regras:
 * - Tenta iniciar COM som; quando bloqueado pelo navegador antes de gesto do
 *   usuário, toca mudo e exibe estado de convite.
 * - Ao completar uma volta com áudio ativo, entra no estado finalizado ("Ouvir de novo").
 * - Ao clicar em "Ouvir de novo", executa reset determinístico:
 *   pause() -> currentTime = 0 -> reset de estados -> play() com tratamento de Promise.
 */
export default function VideoBackdrop({
  label,
}: {
  label: { on: string; off: string; hint: string; replay: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef<number>(0);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [heard, setHeard] = useState(false);
  const [ready, setReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("loading");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const syncVolume = () => setMuted(v.muted);
    const onWaiting = () => setPlaybackState("loading");
    const onPlaying = () => {
      setReady(true);
      setPlaybackState("playing");
    };
    const onPause = () => {
      if (!v.ended) setPlaybackState("paused");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaybackState("paused");
      return;
    }

    v.muted = false;
    v.play()
      .then(() => {
        setMuted(false);
        setBlocked(false);
        setPlaybackState("playing");
      })
      .catch(() => {
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play()
          .then(() => setPlaybackState("playing"))
          .catch(() => setPlaybackState("paused"));
      });

    const onTime = () => {
      const current = v.currentTime;
      const last = lastTimeRef.current;
      // Com loop ativo, quando o tempo retorna perto de zero após ter tocado com som,
      // marcamos a primeira audição como finalizada e silenciamos o loop visual.
      if (last > 1.2 && current < last - 0.5 && !v.muted) {
        v.muted = true;
        setMuted(true);
        setHeard(true);
        setPlaybackState("ended");
      }
      lastTimeRef.current = current;
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("volumechange", syncVolume);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.1 },
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
      v.removeEventListener("volumechange", syncVolume);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const handleToggleOrReplay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;

    const shouldUnmuteAndRestart = v.muted || heard || blocked || playbackState === "ended";

    if (shouldUnmuteAndRestart) {
      // Reset determinístico para "Ouvir de novo" ou ativação de som
      v.pause();
      lastTimeRef.current = 0;
      v.currentTime = 0;
      v.muted = false;
      setMuted(false);
      setBlocked(false);
      setHeard(false);
      setPlaybackState("loading");

      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaybackState("playing");
          })
          .catch(() => {
            setPlaybackState("paused");
          });
      } else {
        setPlaybackState("playing");
      }
    } else {
      // Usuário clicou em "Silenciar" enquanto o áudio estava tocando
      v.muted = true;
      setMuted(true);
      setBlocked(false);
    }
  };

  const isReplayMode = muted && heard;
  const text = blocked
    ? label.hint
    : muted
      ? heard
        ? label.replay
        : label.on
      : label.off;

  const statusBadge =
    playbackState === "loading"
      ? "Carregando"
      : !muted && playbackState === "playing"
        ? "Tocando"
        : isReplayMode || playbackState === "ended"
          ? "Finalizado"
          : playbackState === "paused"
            ? "Pausado"
            : "Mudo";

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
        onCanPlay={() => {
          setReady(true);
          setPlaybackState((prev) => (prev === "loading" ? "playing" : prev));
        }}
      >
        <source src="/video/maldivas-hero.webm" type="video/webm" />
        <source src="/video/maldivas-hero.mp4" type="video/mp4" />
      </video>

      <div className="video-scrim" aria-hidden="true" />

      <button
        type="button"
        className={`video-sound ${blocked ? "is-blocked" : ""} ${muted ? "is-muted" : "is-playing"} ${isReplayMode ? "is-ended" : ""}`}
        onClick={handleToggleOrReplay}
        aria-label={`${text} (${statusBadge})`}
        data-state={playbackState}
      >
        {playbackState === "loading" ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : isReplayMode ? (
          <RotateCcw size={16} aria-hidden="true" />
        ) : muted ? (
          <VolumeX size={17} aria-hidden="true" />
        ) : playbackState === "paused" ? (
          <Play size={16} aria-hidden="true" />
        ) : (
          <Volume2 size={17} aria-hidden="true" />
        )}
        <span className="video-sound-txt">{text}</span>
        {!muted && playbackState === "playing" && (
          <span className="video-sound-live-dot" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
