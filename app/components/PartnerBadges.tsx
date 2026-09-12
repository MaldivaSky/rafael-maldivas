"use client";

import { BadgeCheck, Clock3 } from "lucide-react";
import { badges } from "../lib/credentials";
import { useLang } from "../lib/i18n";
import { Reveal, Spotlight } from "./fx";

const t = {
  pt: {
    tag: "Credenciais de plataforma",
    title: "Homologado por quem opera o mercado",
    lead: "Integrar com iFood ou WhatsApp não é consumir uma API pública: passa por análise de segurança e homologação da plataforma. Estes são os processos que a Maldivas Tech já concluiu.",
    note: "Comprovação de cada homologação enviada sob solicitação, na reunião técnica.",
  },
  en: {
    tag: "Platform credentials",
    title: "Approved by the platforms that run the market",
    lead: "Integrating with iFood or WhatsApp isn't calling a public API: it goes through the platform's security review and approval. These are the processes Maldivas Tech has already cleared.",
    note: "Evidence for each approval is shared on request, during the technical call.",
  },
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
