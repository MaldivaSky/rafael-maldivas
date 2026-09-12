"use client";

import { useLang } from "../lib/i18n";
import { rich } from "../lib/rich";
import { Reveal } from "./fx";

const t = {
  "pt": {
    "tag": "Sobre o trabalho",
    "quote": [
      "Já trabalhei dos dois lados: ",
      "atendendo clientes e fazendo acontecer",
      "."
    ],
    "body": [
      "Vendas, qualidade, processos, marcenaria, química e gastronomia fazem parte da minha história. Sei o que é lidar com prazo, custo e cliente esperando. Hoje uso essa experiência no meu trabalho com tecnologia.",
      "Posso ajudar a organizar informações, reduzir tarefas repetidas ou apresentar melhor sua empresa na internet. A solução depende do que você precisa e do que cabe no projeto."
    ],
    "pillars": [
      [
        "Uma conversa",
        "Você me mostra como trabalha e o que gostaria de melhorar. Pode ser por chamada ou numa visita combinada."
      ],
      [
        "Uma proposta",
        "Eu organizo as opções, explico o que consigo entregar e apresento prazo e valor."
      ],
      [
        "Acompanhamento",
        "Durante o projeto, mostro o andamento e ajustamos os detalhes com quem vai usar."
      ]
    ]
  },
  "en": {
    "tag": "My approach",
    "quote": [
      "I’ve worked with customers ",
      "and behind the scenes",
      "."
    ],
    "body": [
      "Sales, quality, processes, woodworking, chemistry and gastronomy are part of my background. I know what it means to work with deadlines, costs and a waiting customer. I bring that experience to technology.",
      "I can help organise information, reduce repetitive tasks or improve how your business presents itself online. The solution depends on what you need and the scope we agree on."
    ],
    "pillars": [
      [
        "A conversation",
        "Show me how you work and what you’d like to improve, over a call or an arranged visit."
      ],
      [
        "A proposal",
        "I outline the options, explain what I can deliver and provide a timeline and price."
      ],
      [
        "Follow-through",
        "I share progress and work through the details with the people who will use the result."
      ]
    ]
  }
} as const;

export default function Mission() {
  const { lang } = useLang();
  const c = t[lang];

  return (
    <section id="missao">
      <div className="wrap">
        <Reveal>
          <div className="sec-tag">{c.tag}</div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mission">
            <h2 className="mission-quote">
              {c.quote[0]}
              <em>{c.quote[1]}</em>
              {c.quote[2]}
            </h2>

            <div className="mission-body">
              {c.body.map((p, i) => (
                <p key={i}>{rich(p)}</p>
              ))}
            </div>

            <div className="mission-pillars">
              {c.pillars.map(([h, p]) => (
                <div className="mission-pillar" key={h}>
                  <h4>{h}</h4>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
