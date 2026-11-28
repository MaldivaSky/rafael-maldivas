"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Headphones,
  Image as ImageIcon,
  Loader2,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";

export type NotebookLMMediaConfig = {
  sectionLabel?: string;
  video?: {
    title: string;
    src: string;
    summary: string;
    durationLabel?: string;
  };
  audio?: {
    title: string;
    src: string;
    summary: string;
    durationLabel?: string;
  };
  deck?: {
    title: string;
    href: string;
    summary: string;
    pagesLabel?: string;
  };
  mindMap?: {
    title: string;
    src: string;
    alt: string;
    caption: string;
  };
  publicLinks?: {
    label: string;
    description: string;
    href: string;
    tag: string;
  }[];
};

type MediaTab = "video" | "audio" | "deck" | "mindmap" | "links";
type MediaPlayStatus = "idle" | "loading" | "playing" | "paused" | "ended";

const STATUS_LABEL: Record<MediaPlayStatus, string> = {
  idle: "Pronto para reproduzir",
  loading: "Carregando mídia...",
  playing: "Tocando agora",
  paused: "Pausado",
  ended: "Finalizado · Pronto para ouvir de novo",
};

export default function NotebookLMMediaBlock({
  media,
}: {
  media?: NotebookLMMediaConfig;
}) {
  const defaultTab: MediaTab = media?.video
    ? "video"
    : media?.audio
      ? "audio"
      : media?.deck
        ? "deck"
        : media?.mindMap
          ? "mindmap"
          : "links";

  const [activeTab, setActiveTab] = useState<MediaTab>(defaultTab);

  // Refs e estados controlados para Áudio e Vídeo das aulas
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [audioStatus, setAudioStatus] = useState<MediaPlayStatus>("idle");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioEnded, setIsAudioEnded] = useState(false);

  const [videoStatus, setVideoStatus] = useState<MediaPlayStatus>("idle");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  useEffect(() => {
    setAudioStatus("idle");
    setIsAudioPlaying(false);
    setIsAudioEnded(false);
    setVideoStatus("idle");
    setIsVideoPlaying(false);
    setIsVideoEnded(false);
  }, [media?.audio?.src, media?.video?.src]);

  function handleReplayAudio() {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setIsAudioEnded(false);
    setIsAudioPlaying(false);
    setAudioStatus("loading");

    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAudioPlaying(true);
          setIsAudioEnded(false);
          setAudioStatus("playing");
        })
        .catch(() => {
          setIsAudioPlaying(false);
          setAudioStatus("paused");
        });
    } else {
      setIsAudioPlaying(true);
      setAudioStatus("playing");
    }
  }

  function handleToggleAudioPlay() {
    const el = audioRef.current;
    if (!el) return;
    if (isAudioEnded || el.ended) {
      handleReplayAudio();
      return;
    }
    if (el.paused) {
      setAudioStatus("loading");
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
            setAudioStatus("playing");
          })
          .catch(() => {
            setIsAudioPlaying(false);
            setAudioStatus("paused");
          });
      }
    } else {
      el.pause();
      setIsAudioPlaying(false);
      setAudioStatus("paused");
    }
  }

  function handleReplayVideo() {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setIsVideoEnded(false);
    setIsVideoPlaying(false);
    setVideoStatus("loading");

    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
          setIsVideoEnded(false);
          setVideoStatus("playing");
        })
        .catch(() => {
          setIsVideoPlaying(false);
          setVideoStatus("paused");
        });
    } else {
      setIsVideoPlaying(true);
      setVideoStatus("playing");
    }
  }

  if (!media) return null;

  const hasAny =
    Boolean(media.video) ||
    Boolean(media.audio) ||
    Boolean(media.deck) ||
    Boolean(media.mindMap) ||
    Boolean(media.publicLinks && media.publicLinks.length > 0);

  if (!hasAny) return null;

  return (
    <section
      className="clean-media-studio"
      aria-labelledby="notebooklm-media-title"
    >
      <div className="clean-media-studio-head">
        <div className="clean-media-head-copy">
          <span className="clean-act-pill">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />{" "}
            {media.sectionLabel ?? "Estúdio Multimídia da Aula"}
          </span>
          <h2 id="notebooklm-media-title" className="clean-media-heading">
            Assista, Ouça ou Inspecione os Slides antes da Prática
          </h2>
        </div>

        {/* Clean Tab Selector: Only 1 Media Item Open at a Time */}
        <div className="clean-media-tabs" role="tablist">
          {media.video && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "video"}
              onClick={() => setActiveTab("video")}
              className={`clean-media-tab${activeTab === "video" ? " is-active" : ""}`}
            >
              <PlayCircle className="w-4 h-4" aria-hidden="true" />
              <span>Vídeo</span>
            </button>
          )}
          {media.audio && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "audio"}
              onClick={() => setActiveTab("audio")}
              className={`clean-media-tab${activeTab === "audio" ? " is-active" : ""}`}
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              <span>Podcast</span>
            </button>
          )}
          {media.deck && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "deck"}
              onClick={() => setActiveTab("deck")}
              className={`clean-media-tab${activeTab === "deck" ? " is-active" : ""}`}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Slides PDF</span>
            </button>
          )}
          {media.mindMap && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "mindmap"}
              onClick={() => setActiveTab("mindmap")}
              className={`clean-media-tab${activeTab === "mindmap" ? " is-active" : ""}`}
            >
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
              <span>Mapa Mental</span>
            </button>
          )}
          {media.publicLinks && media.publicLinks.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "links"}
              onClick={() => setActiveTab("links")}
              className={`clean-media-tab${activeTab === "links" ? " is-active" : ""}`}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>NotebookLM ({media.publicLinks.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="clean-media-stage">
        {activeTab === "video" && media.video && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <div className="clean-media-title-group">
                <h3>{media.video.title}</h3>
                <p>{media.video.summary}</p>
              </div>
              <div className="clean-media-badges-row">
                <span className={`curso-media-status-pill is-${videoStatus}`}>
                  {videoStatus === "loading" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  )}
                  {videoStatus === "playing" && (
                    <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {videoStatus === "ended" && (
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{STATUS_LABEL[videoStatus]}</span>
                </span>
                {media.video.durationLabel && (
                  <span className="curso-pill">{media.video.durationLabel}</span>
                )}
                <button
                  type="button"
                  onClick={handleReplayVideo}
                  className="clean-btn-replay"
                  aria-label="Ouvir de novo o vídeo desde o início"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ouvir de novo</span>
                </button>
              </div>
            </div>
            <video
              ref={videoRef}
              key={media.video.src}
              controls
              preload="metadata"
              playsInline
              className="curso-media-video"
              onLoadStart={() => setVideoStatus("loading")}
              onCanPlay={() =>
                setVideoStatus((prev) => (prev === "loading" ? "idle" : prev))
              }
              onWaiting={() => setVideoStatus("loading")}
              onPlay={() => {
                setIsVideoPlaying(true);
                setIsVideoEnded(false);
                setVideoStatus("playing");
              }}
              onPlaying={() => {
                setIsVideoPlaying(true);
                setIsVideoEnded(false);
                setVideoStatus("playing");
              }}
              onPause={() => {
                setIsVideoPlaying(false);
                if (!videoRef.current?.ended) setVideoStatus("paused");
              }}
              onEnded={() => {
                setIsVideoPlaying(false);
                setIsVideoEnded(true);
                setVideoStatus("ended");
              }}
            >
              <source src={media.video.src} type="video/mp4" />
            </video>
          </div>
        )}

        {activeTab === "audio" && media.audio && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <div className="clean-media-title-group">
                <h3>{media.audio.title}</h3>
                <p>{media.audio.summary}</p>
              </div>
              <div className="clean-media-badges-row">
                <span className={`curso-media-status-pill is-${audioStatus}`}>
                  {audioStatus === "loading" && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  )}
                  {audioStatus === "playing" && (
                    <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {audioStatus === "ended" && (
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{STATUS_LABEL[audioStatus]}</span>
                </span>
                {media.audio.durationLabel && (
                  <span className="curso-pill">{media.audio.durationLabel}</span>
                )}
              </div>
            </div>

            <div className="curso-audio-player-bar">
              <div className="curso-audio-controls-row">
                <button
                  type="button"
                  onClick={handleToggleAudioPlay}
                  className="clean-btn-primary curso-audio-play-btn"
                  aria-label={isAudioPlaying ? "Pausar narração" : "Ouvir narração"}
                >
                  {audioStatus === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : isAudioPlaying ? (
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>
                    {audioStatus === "loading"
                      ? "Carregando..."
                      : isAudioPlaying
                        ? "Pausar áudio"
                        : isAudioEnded
                          ? "Reproduzir"
                          : "Ouvir episódio"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleReplayAudio}
                  className="clean-btn-replay"
                  aria-label="Ouvir de novo a narração desde o início"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Ouvir de novo</span>
                </button>
              </div>

              <audio
                ref={audioRef}
                key={media.audio.src}
                controls
                preload="metadata"
                className="curso-media-audio"
                onLoadStart={() => setAudioStatus("loading")}
                onCanPlay={() =>
                  setAudioStatus((prev) => (prev === "loading" ? "idle" : prev))
                }
                onWaiting={() => setAudioStatus("loading")}
                onPlay={() => {
                  setIsAudioPlaying(true);
                  setIsAudioEnded(false);
                  setAudioStatus("playing");
                }}
                onPlaying={() => {
                  setIsAudioPlaying(true);
                  setIsAudioEnded(false);
                  setAudioStatus("playing");
                }}
                onPause={() => {
                  setIsAudioPlaying(false);
                  if (!audioRef.current?.ended) setAudioStatus("paused");
                }}
                onEnded={() => {
                  setIsAudioPlaying(false);
                  setIsAudioEnded(true);
                  setAudioStatus("ended");
                }}
              >
                <source src={media.audio.src} type="audio/mp4" />
              </audio>
            </div>
          </div>
        )}

        {activeTab === "deck" && media.deck && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <div className="clean-media-title-group">
                <h3>{media.deck.title}</h3>
                <p>{media.deck.summary}</p>
              </div>
              {media.deck.pagesLabel && (
                <span className="curso-pill">{media.deck.pagesLabel}</span>
              )}
            </div>
            <div className="curso-media-actions" style={{ marginTop: 12 }}>
              <a
                href={media.deck.href}
                target="_blank"
                rel="noopener noreferrer"
                className="clean-btn-primary"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Abrir Apresentação em PDF</span>
              </a>
              <a href={media.deck.href} download className="clean-btn-ghost">
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Baixar PDF</span>
              </a>
            </div>
          </div>
        )}

        {activeTab === "mindmap" && media.mindMap && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <h3>{media.mindMap.title}</h3>
              <a
                href={media.mindMap.src}
                target="_blank"
                rel="noopener noreferrer"
                className="clean-btn-ghost"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ampliar Imagem</span>
              </a>
            </div>
            <img
              src={media.mindMap.src}
              alt={media.mindMap.alt}
              loading="lazy"
              className="curso-media-img"
              style={{ marginTop: 10 }}
            />
            <p className="curso-fine" style={{ marginTop: 8 }}>
              {media.mindMap.caption}
            </p>
          </div>
        )}

        {activeTab === "links" && media.publicLinks && (
          <div className="clean-media-pane">
            <div className="curso-media-links-grid">
              {media.publicLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="curso-media-ext-card"
                >
                  <div className="curso-media-ext-top">
                    <span className="curso-badge">{item.tag}</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </div>
                  <strong>{item.label}</strong>
                  <span className="curso-fine">{item.description}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
