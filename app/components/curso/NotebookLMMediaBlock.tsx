"use client";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Headphones,
  Image as ImageIcon,
  PlayCircle,
  Sparkles,
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
        <div>
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
              <div>
                <h3>{media.video.title}</h3>
                <p>{media.video.summary}</p>
              </div>
              {media.video.durationLabel && (
                <span className="curso-pill">{media.video.durationLabel}</span>
              )}
            </div>
            <video
              controls
              preload="metadata"
              playsInline
              className="curso-media-video"
            >
              <source src={media.video.src} type="video/mp4" />
            </video>
          </div>
        )}

        {activeTab === "audio" && media.audio && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <div>
                <h3>{media.audio.title}</h3>
                <p>{media.audio.summary}</p>
              </div>
              {media.audio.durationLabel && (
                <span className="curso-pill">{media.audio.durationLabel}</span>
              )}
            </div>
            <audio controls preload="metadata" className="curso-media-audio">
              <source src={media.audio.src} type="audio/mp4" />
            </audio>
          </div>
        )}

        {activeTab === "deck" && media.deck && (
          <div className="clean-media-pane">
            <div className="clean-media-pane-meta">
              <div>
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
