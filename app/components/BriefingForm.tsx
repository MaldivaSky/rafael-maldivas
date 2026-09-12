"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, MessageCircle, Send } from "lucide-react";
import { useLang } from "../lib/i18n";
import { AREAS, servicos, type Area } from "../lib/catalog";
import { EMAIL, WHATSAPP } from "../lib/site";

/**
 * Levantamento de requisitos.
 *
 * Não existe backend aqui, e é de propósito: formulário que depende de
 * servidor cai calado e o contato se perde. Este monta uma mensagem
 * estruturada e abre no WhatsApp ou no e-mail, com tudo já escrito.
 */

const t = {
  pt: {
    tag: "Levantamento",
    title: "Me conte o que está travando",
    lead: "Quatro perguntas. Elas são exatamente as que eu faria na primeira reunião — respondendo aqui a gente já começa adiantado, e você não paga nada por isso.",
    q1: "1. Qual é o seu negócio?",
    q1ph: "Ex.: restaurante com 40 lugares e delivery, pet shop com duas lojas, agência de recrutamento",
    q2: "2. O que está doendo hoje?",
    q2ph: "Ex.: não sei quanto sobra por prato · o estoque nunca bate · perco pedido no papel · meu e-mail cai no spam · ninguém me acha no Google",
    q3: "3. Que tipo de trabalho você imagina?",
    q3hint: "Pode marcar mais de um, ou nenhum se ainda não sabe.",
    q4: "4. Quando isso precisa estar resolvido?",
    urgency: [
      ["ontem", "Ontem — está travando a operação agora"],
      ["mes", "Neste mês"],
      ["trimestre", "Nos próximos três meses"],
      ["estudando", "Ainda estou estudando o assunto"],
    ],
    name: "Seu nome",
    contact: "WhatsApp ou e-mail para eu responder",
    send: "Enviar pelo WhatsApp",
    mail: "Prefiro por e-mail",
    missing: "Responda pelo menos o que está doendo hoje.",
    preview: "O que vai ser enviado",
    privacy: "Nada é gravado neste site. A mensagem vai direto para mim, pelo canal que você escolher.",
    areas: "Área",
  },
  en: {
    tag: "Discovery",
    title: "Tell me what's stuck",
    lead: "Four questions. They're exactly what I'd ask in a first meeting — answering here means we start ahead, and it costs you nothing.",
    q1: "1. What's your business?",
    q1ph: "e.g. a 40-seat restaurant with delivery, a pet shop with two stores, a recruitment agency",
    q2: "2. What hurts today?",
    q2ph: "e.g. I don't know the margin per dish · stock never matches · orders get lost on paper · my email goes to spam · nobody finds me on Google",
    q3: "3. What kind of work do you have in mind?",
    q3hint: "Pick more than one, or none if you're not sure yet.",
    q4: "4. When does this need to be solved?",
    urgency: [
      ["ontem", "Yesterday — it's blocking the operation now"],
      ["mes", "This month"],
      ["trimestre", "Within three months"],
      ["estudando", "Still researching"],
    ],
    name: "Your name",
    contact: "WhatsApp or email so I can reply",
    send: "Send on WhatsApp",
    mail: "I'd rather use email",
    missing: "At least tell me what hurts today.",
    preview: "What gets sent",
    privacy: "Nothing is stored on this site. The message goes straight to me through the channel you pick.",
    areas: "Area",
  },
} as const;

export default function BriefingForm() {
  const { lang } = useLang();
  const c = t[lang];

  const [negocio, setNegocio] = useState("");
  const [dor, setDor] = useState("");
  const [escolhas, setEscolhas] = useState<string[]>([]);
  const [prazo, setPrazo] = useState("");
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [tentou, setTentou] = useState(false);

  const toggle = (id: string) =>
    setEscolhas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const mensagem = useMemo(() => {
    const nomes = escolhas
      .map((id) => servicos.find((s) => s.id === id)?.nome[lang])
      .filter(Boolean);
    const urg = c.urgency.find(([k]) => k === prazo)?.[1];

    return [
      lang === "pt" ? "Olá Rafael! Vim pelo site." : "Hi Rafael! I came from the website.",
      nome && `\n${lang === "pt" ? "Nome" : "Name"}: ${nome}`,
      negocio && `\n${lang === "pt" ? "Negócio" : "Business"}: ${negocio}`,
      dor && `\n${lang === "pt" ? "O que está doendo" : "What hurts"}: ${dor}`,
      nomes.length > 0 && `\n${lang === "pt" ? "Tipo de trabalho" : "Kind of work"}: ${nomes.join(", ")}`,
      urg && `\n${lang === "pt" ? "Prazo" : "Timeline"}: ${urg}`,
      contato && `\n${lang === "pt" ? "Contato" : "Contact"}: ${contato}`,
    ]
      .filter(Boolean)
      .join("");
  }, [nome, negocio, dor, escolhas, prazo, contato, lang, c.urgency]);

  const valido = dor.trim().length > 3;

  const enviar = (canal: "wa" | "mail") => (e: React.MouseEvent) => {
    if (!valido) {
      e.preventDefault();
      setTentou(true);
      return;
    }
  };

  const waHref = `${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    lang === "pt" ? "Levantamento pelo site — Maldivas Tech" : "Website discovery — Maldivas Tech"
  )}&body=${encodeURIComponent(mensagem)}`;

  const porArea = (Object.keys(AREAS) as Area[]).map((a) => ({
    area: a,
    label: AREAS[a][lang],
    itens: servicos.filter((s) => s.area === a),
  }));

  return (
    <section id="briefing">
      <div className="wrap">
        <div className="sec-tag">{c.tag}</div>
        <h2>{c.title}</h2>
        <p className="sec-lead">{c.lead}</p>

        <div className="briefing">
          <div className="briefing-form">
            <div className="field">
              <label htmlFor="b-neg">{c.q1}</label>
              <input
                id="b-neg"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                placeholder={c.q1ph}
                autoComplete="organization"
              />
            </div>

            <div className="field">
              <label htmlFor="b-dor">{c.q2}</label>
              <textarea
                id="b-dor"
                value={dor}
                onChange={(e) => setDor(e.target.value)}
                placeholder={c.q2ph}
                rows={4}
              />
              {tentou && !valido && <span className="field-hint result-warn">{c.missing}</span>}
            </div>

            <div className="field">
              <label>{c.q3}</label>
              <span className="field-hint">{c.q3hint}</span>
              {porArea.map(({ area, label, itens }) => (
                <div key={area} className="briefing-area">
                  <span className="briefing-area-label">{label}</span>
                  <div className="briefing-chips">
                    {itens.map((s) => {
                      const on = escolhas.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          className={`briefing-chip ${on ? "is-on" : ""}`}
                          onClick={() => toggle(s.id)}
                          aria-pressed={on}
                        >
                          {on && <Check size={14} />}
                          {s.nome[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="field">
              <label htmlFor="b-prazo">{c.q4}</label>
              <select id="b-prazo" value={prazo} onChange={(e) => setPrazo(e.target.value)}>
                <option value="">—</option>
                {c.urgency.map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="b-nome">{c.name}</label>
                <input id="b-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="b-contato">{c.contact}</label>
                <input
                  id="b-contato"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="p-links" style={{ marginTop: 8 }}>
              <a
                className="plink solid"
                href={valido ? waHref : "#briefing"}
                onClick={enviar("wa")}
                target={valido ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} /> {c.send} <ArrowRight size={15} />
              </a>
              <a className="plink" href={valido ? mailHref : "#briefing"} onClick={enviar("mail")}>
                <Send size={16} /> {c.mail}
              </a>
            </div>
          </div>

          <aside className="briefing-preview">
            <h4>{c.preview}</h4>
            <pre>{mensagem}</pre>
            <p className="field-hint">{c.privacy}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
