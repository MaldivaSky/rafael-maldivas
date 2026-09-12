"use client";

import { BadgeCheck, Clock3 } from "lucide-react";
import { badges } from "../lib/credentials";
import { useLang } from "../lib/i18n";
import { Reveal, Spotlight } from "./fx";

const t = {
  "pt": {
    "tag": "Credenciais de plataforma",
    "title": "Integrações e credenciais",
    "lead": "O status das integrações da Maldivas Tech com plataformas de pedidos e atendimento.",
    "note": "Comprovação de cada homologação enviada sob solicitação, na reunião técnica."
  },
  "en": {
    "tag": "Platform credentials",
    "title": "Integrations and credentials",
    "lead": "The status of Maldivas Tech’s ordering and customer service integrations.",
    "note": "Evidence for each approval is shared on request, during the technical call."
  }
} as const;

export default function PartnerBadges() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <section id="credenciais">
      <div className="wrap">
        <Reveal>
          <div className="sec-tag">{c.tag}</div>
          <h2>{c.title}</h2>
          <p className="sec-lead">{c.lead}</p>
        </Reveal>

        <div className="badges">
          {badges.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08}>
              <Spotlight className={`badge badge-${b.status}`}>
                <div className="badge-top">
                  <img src={b.icon} alt="" width={30} height={30} />
                  <span className="badge-platform">{b.platform}</span>
                  <span className="badge-pill">
                    {b.status === "approved" ? <BadgeCheck size={13} /> : <Clock3 size={13} />}
                    {b.statusLabel[lang]}
                  </span>
                </div>
                <h3>{b.title[lang]}</h3>
                <p>{b.detail[lang]}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>

        <p className="badges-note">{c.note}</p>
      </div>
    </section>
  );
}
