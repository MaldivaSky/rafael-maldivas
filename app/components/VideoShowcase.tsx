"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useLang } from "../lib/i18n";
import { pecas } from "../lib/catalog";
import { CANVA_REEL, YOUTUBE } from "../lib/site";
import { Reveal, TechIcon } from "./fx";

const t = {
  pt: {
    tag: "Audiovisual",
    title: "Cada peça, o tipo de trabalho que ela representa",
    lead: "São quatro modalidades diferentes, produzidas aqui dentro. Dá play em qualquer uma — todas têm som, e todas começam no mudo para não atropelar você.",
    play: "Assistir",
    pause: "Pausar",
    sound: "Som",
    mute: "Mudo",
    yt: "Canal no YouTube",
    reel: "Reel completo no Canva",
  },
  en: {
    tag: "Video",
    title: "Each piece, and the kind of work it stands for",
    lead: "Four different formats, all produced in-house. Hit play on any of them — they all have sound, and they all start muted so nothing jumps at you.",
    play: "Watch",
    pause: "Pause",
    sound: "Sound",
    mute: "Mute",
    yt: "YouTube channel",
    reel: "Full reel on Canva",
  },
} as const;

function Peca({ peca }: { peca: (typeof pecas)[number] }) {
  const { lang } = useLang();
  const c = t[lang];
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const sound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <article className="peca">
      <div className="peca-video">
        <video
          ref={ref}
          poster={peca.poster}
          loop
          muted
          playsInline
          preload="none"
          onEnded={() => setPlaying(false)}
        >
          <source src={peca.src} type="video/mp4" />
        </video>

        <div className="peca-controls">
          <button type="button" onClick={toggle} aria-label={playing ? c.pause : c.play}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            {playing ? c.pause : c.play}
          </button>
          <button type="button" onClick={sound} aria-label={muted ? c.sound : c.mute}>
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {muted ? c.sound : c.mute}
          </button>
        </div>
      </div>

      <div className="peca-info">
        <span className="peca-mod">{peca.modalidade[lang]}</span>
        <h3>{peca.titulo[lang]}</h3>
        <p>{peca.desc[lang]}</p>
        <span className="peca-ficha">{peca.ficha[lang]}</span>
      </div>
    </article>
  );
}

export default function VideoShowcase() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <section id="audiovisual">
      <div className="wrap">
        <Reveal>
          <div className="sec-tag">{c.tag}</div>
          <h2>{c.title}</h2>
          <p className="sec-lead">{c.lead}</p>
        </Reveal>

        <div className="pecas">
          {pecas.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Peca peca={p} />
            </Reveal>
          ))}
        </div>

        <div className="cta-row" style={{ marginTop: 30, marginBottom: 0 }}>
          <a className="btn btn-ghost" href={YOUTUBE} target="_blank" rel="noopener noreferrer">
            <TechIcon src="/icons/youtube.svg" size={18} /> {c.yt}
          </a>
          <a className="btn btn-ghost" href={CANVA_REEL} target="_blank" rel="noopener noreferrer">
            <TechIcon src="/icons/canva.svg" size={18} /> {c.reel}
          </a>
        </div>
      </div>
    </section>
  );
}
