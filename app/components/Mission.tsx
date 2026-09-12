"use client";

import { useLang } from "../lib/i18n";
import { rich } from "../lib/rich";
import { Reveal } from "./fx";

const t = {
  pt: {
    tag: "Como eu trabalho",
    quote: ["Eu não pergunto qual sistema você quer. ", "Eu vou ver o seu problema onde ele acontece", "."],
    body: [
      "Software de prateleira chega pronto e obriga a sua operação a se encaixar nele. Eu faço o contrário. Antes de escrever uma linha, eu **estudo o seu fluxo**: acompanho o dia, vejo o caixa fechar, olho o garçom anotar, sigo a nota até ela sair errada. O problema quase nunca está onde alguém me conta que está — está dois passos antes.",
      "E eu **falo a sua língua**. Se você diz ruptura, eu entendo ruptura. Se diz que o produto sumiu da prateleira, eu entendo igual. Ninguém precisa aprender o meu vocabulário para ser atendido. Passei quinze anos do outro lado do balcão, então eu sei exatamente o que é depender de um sistema que não entende o negócio por dentro.",
    ],
    pillars: [
      [
        "Eu vejo na prática",
        "Operação não se diagnostica por telefone nem por formulário. Eu vou até onde o problema acontece e fico até entender por que ele acontece.",
      ],
      [
        "Eu entendo na fonte",
        "Levantar requisito é fácil. Difícil é descobrir o que a equipe faz por fora do sistema para conseguir trabalhar — é ali que mora o que precisa ser resolvido.",
      ],
      [
        "Preço é consequência",
        "Eu não abro tabela antes de conhecer o seu negócio. Primeiro a gente descobre quanto o problema custa para você. O valor do trabalho sai disso, e essa conversa é a última.",
      ],
    ],
  },
  en: {
    tag: "How I work",
    quote: ["I don't ask which system you want. ", "I go and see your problem where it happens", "."],
    body: [
      "Off-the-shelf software arrives finished and forces your operation to bend around it. I do the opposite. Before writing a line, I **study your flow**: I follow the day, watch the till close, watch the waiter take an order, follow an invoice until it comes out wrong. The problem is almost never where someone tells me it is — it's two steps earlier.",
      "And I **speak your language**. If you say stockout, I understand stockout. If you say the product vanished from the shelf, I understand that just the same. Nobody has to learn my vocabulary to be served. I spent fifteen years on the other side of the counter, so I know exactly what it's like to depend on a system that doesn't understand the business from the inside.",
    ],
    pillars: [
      [
        "I see it in practice",
        "An operation can't be diagnosed over the phone or through a form. I go where the problem happens and stay until I understand why it happens.",
      ],
      [
        "I understand it at the source",
        "Gathering requirements is easy. The hard part is finding what the team does outside the system just to get through the day — that's where the real problem lives.",
      ],
      [
        "Price is a consequence",
        "I don't open a price list before knowing your business. First we find out what the problem is costing you. The value of the work comes from that, and it's the last conversation, not the first.",
      ],
    ],
  },
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
