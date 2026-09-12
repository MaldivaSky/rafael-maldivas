"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../lib/i18n";

export default function CityStory() {
  const { lang } = useLang();
  const pt = lang === "pt";
  return <section className="city-story"><div className="wrap">
    <div className="city-heading"><div><div className="sec-tag">{pt ? "Um pouco do meu olhar" : "Through my lens"}</div><h2>{pt ? "Também saio da frente da tela." : "There’s work beyond the screen, too."}</h2></div><p>{pt ? "Fotografia, captação com drone e edição também fazem parte do que eu faço. Estes registros são meus." : "Photography, drone filming and editing are also part of my work. These are my own photographs."}</p></div>
    <div className="city-grid">
      <figure><div className="city-image"><Image src="/media/cidade-avenida.jpg" alt={pt ? "Fotografia aérea de uma avenida entre edifícios" : "An aerial photograph of an avenue between buildings"} fill sizes="(max-width: 760px) 100vw, 55vw" /></div><figcaption><span>01 / {pt ? "A cidade de perto" : "A closer look at the city"}</span><span>{pt ? "Fotografia autoral" : "Original photography"}</span></figcaption></figure>
      <figure><div className="city-image"><Image src="/media/cidade-anoitecer.jpg" alt={pt ? "Panorama urbano ao anoitecer, com as luzes das ruas acesas" : "A city panorama at dusk with street lights on"} fill sizes="(max-width: 760px) 100vw, 40vw" /></div><figcaption><span>02 / {pt ? "Quando a luz muda" : "When the light changes"}</span><span>Rafael Maldivas</span></figcaption></figure>
    </div>
    <Link className="personal-link" href="/servicos#audiovisual">{pt ? "Conhecer os serviços de foto e vídeo" : "Explore photo and video services"}<ArrowUpRight size={18}/></Link>
  </div></section>;
}
