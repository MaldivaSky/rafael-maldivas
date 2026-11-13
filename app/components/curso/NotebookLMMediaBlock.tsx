"use client";

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

export default function NotebookLMMediaBlock({
  media,
}: {
  media?: NotebookLMMediaConfig;
}) {
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
      className="curso-sim-card curso-media-section"
      aria-labelledby="notebooklm-media-title"
    >
      <div className="curso-sim-head">
        <div>
          <span className="curso-badge">
            {media.sectionLabel ?? "Estúdio da aula · Vídeo, áudio e apoio visual"}
          </span>
          <h2 id="notebooklm-media-title">
            <Sparkles size={20} aria-hidden="true" /> Material multimídia da lição
          </h2>
        </div>
      </div>

      <div className="curso-media-stack">
        {media.video && (
          <div className="curso-media-card">
            <div className="curso-media-card-head">
              <div>
                <h3 className="curso-media-title">
                  <PlayCircle size={18} aria-hidden="true" /> {media.video.title}
                </h3>
                <p className="curso-muted">{media.video.summary}</p>
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
              Seu navegador não suporta vídeo HTML5.{" "}
              <a href={media.video.src} download>
                Baixar vídeo (.mp4)
              </a>
            </video>
          </div>
        )}

        {media.audio && (
          <div className="curso-media-card">
            <div className="curso-media-card-head">
              <div>
                <h3 className="curso-media-title">
                  <Headphones size={18} aria-hidden="true" /> {media.audio.title}
                </h3>
                <p className="curso-muted">{media.audio.summary}</p>
              </div>
              {media.audio.durationLabel && (
                <span className="curso-pill">{media.audio.durationLabel}</span>
              )}
            </div>
            <audio
              controls
              preload="metadata"
              className="curso-media-audio"
            >
              <source src={media.audio.src} type="audio/mp4" />
              Seu navegador não suporta áudio HTML5.{" "}
              <a href={media.audio.src} download>
                Baixar áudio (.m4a)
              </a>
            </audio>
          </div>
        )}

        {media.deck && (
          <div className="curso-media-card curso-media-deck">
            <div className="curso-media-card-head">
              <div>
                <h3 className="curso-media-title">
                  <FileText size={18} aria-hidden="true" /> {media.deck.title}
                </h3>
                <p className="curso-muted">{media.deck.summary}</p>
                <p className="curso-fine" style={{ marginTop: 6 }}>
                  Slides visuais gerados para fixação. O texto pesquisável e os
                  comandos completos permanecem logo abaixo na lição.
                </p>
              </div>
              {media.deck.pagesLabel && (
                <span className="curso-pill">{media.deck.pagesLabel}</span>
              )}
            </div>
            <div className="curso-media-actions">
              <a
                href={media.deck.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary curso-btn-sm"
              >
                <ExternalLink size={15} aria-hidden="true" />
                Abrir slides (PDF)
              </a>
              <a
                href={media.deck.href}
                download
                className="btn btn-ghost curso-btn-sm"
              >
                <Download size={15} aria-hidden="true" />
                Baixar PDF
              </a>
            </div>
          </div>
        )}

        {media.mindMap && (
          <figure className="curso-media-card curso-media-figure">
            <div className="curso-media-card-head">
              <h3 className="curso-media-title">
                <ImageIcon size={18} aria-hidden="true" /> {media.mindMap.title}
              </h3>
              <a
                href={media.mindMap.src}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost curso-btn-sm"
              >
                <ExternalLink size={14} aria-hidden="true" />
                Abrir em tela cheia
              </a>
            </div>
            <a
              href={media.mindMap.src}
              target="_blank"
              rel="noopener noreferrer"
              className="curso-media-img-link"
            >
              <img
                src={media.mindMap.src}
                alt={media.mindMap.alt}
                loading="lazy"
                className="curso-media-img"
              />
            </a>
            <figcaption className="curso-fine">{media.mindMap.caption}</figcaption>
          </figure>
        )}

        {media.publicLinks && media.publicLinks.length > 0 && (
          <div className="curso-media-card">
            <div className="curso-media-card-head">
              <div>
                <h3 className="curso-media-title">
                  <ExternalLink size={18} aria-hidden="true" /> Prática extra no
                  NotebookLM (aberta sem login)
                </h3>
                <p className="curso-muted">
                  Links públicos com testes, flashcards, mapa mental e relatórios
                  para revisar fora da aula.
                </p>
              </div>
            </div>
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

