"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FlipHorizontal2,
  LayoutGrid,
  Layers,
  RotateCw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import type { CourseDifficultyLevel } from "@/app/lib/course-levels";

export interface DynamicFlipCardItem {
  id: string;
  level: CourseDifficultyLevel;
  badge: string;
  frontTitle: string;
  frontPrompt: string;
  backHeadline: string;
  backAnswer: string;
  commonMistake: string;
  actionTip: string;
  imagePath: string;
  imageAlt: string;
}

export const DYNAMIC_FLIP_CARDS: DynamicFlipCardItem[] = [
  {
    id: "flip-github-env",
    level: "facil",
    badge: "GitHub · Segurança",
    frontTitle: "1. Vou subir minha loja no GitHub!",
    frontPrompt:
      "Qual arquivo NUNCA pode ir junto quando você envia sua pasta para um repositório público?",
    backHeadline: "Arquivo .env (senhas e chaves secretas)",
    backAnswer:
      "Crie sempre um .gitignore listando .env, .venv/ e node_modules/. Qualquer senha publicada num repositório aberto pode ser capturada em segundos por robôs.",
    commonMistake:
      "Achar que apagar o .env depois no segundo commit resolve — o arquivo continua visível no histórico antigo do Git.",
    actionTip: "Suba somente um .env.example vazio sem valores reais.",
    imagePath: "/cursos/guias/card-github-conta.jpg",
    imageAlt: "Fluxo visual do GitHub destacando Sign Up, + New Repo e Upload gratuito.",
  },
  {
    id: "flip-github-no-cli",
    level: "facil",
    badge: "GitHub · Sem Medo",
    frontTitle: "2. Preciso decorar comandos no terminal?",
    frontPrompt:
      "Se um aluno de 12 anos ainda não domina comandos git no terminal, como criar o repositório e enviar o index.html da vitrine?",
    backHeadline: "+ New Repo -> Upload files pelo navegador",
    backAnswer:
      "No próprio site do GitHub você clica em 'Add file -> Upload files', arrasta seu index.html baixado aqui do construtor e aperta o botão verde 'Commit changes'.",
    commonMistake: "Desistir da primeira publicação tentando resolver conflito de terminal antes da hora.",
    actionTip: "Suba primeiro pelo navegador para ver no ar hoje; depois pratique git push na aula F05.",
    imagePath: "/cursos/guias/step-github-upload.jpg",
    imageAlt: "Tela Upload files do GitHub enviando index.html com clique no botão Commit changes.",
  },
  {
    id: "flip-vercel-hobby",
    level: "facil",
    badge: "Vercel · Deploy R$ 0",
    frontTitle: "3. Subi no GitHub. Como vira um site?",
    frontPrompt:
      "Por que a Vercel atualiza meu site sozinha toda vez que eu mudo o nome de uma camisa ou preço no GitHub?",
    backHeadline: "Deploy Contínuo Automático (Plano Hobby Free)",
    backAnswer:
      "Quando você conecta o repositório do GitHub na Vercel, ela escuta todo novo commit, constrói a vitrine e publica sua URL HTTPS em ~60 segundos.",
    commonMistake: "Ficar subindo arquivos soltos manualmente por FTP sem versionamento.",
    actionTip: "Cada commit gera um Preview URL seguro para testar antes de divulgar.",
    imagePath: "/cursos/guias/card-vercel-site.jpg",
    imageAlt: "Pipeline visual Vercel: Import Git Repository -> Deploy -> Site HTTPS no ar.",
  },
  {
    id: "flip-whatsapp-mobile",
    level: "facil",
    badge: "Vitrine MVP · Vendas",
    frontTitle: "4. Sem gateway: como recebo o pedido?",
    frontPrompt:
      "No Nível Fácil (Vitrine de Roupas R$ 0), como o cliente escolhe P/M/G e fecha a compra sem pagar taxa de plataforma?",
    backHeadline: "Sacola local + Link wa.me preenchido",
    backAnswer:
      "O JavaScript calcula os itens no navegador e abre https://wa.me/SEUNUMERO já com a lista exata de peças, tamanhos e total em reais.",
    commonMistake: "Escrever preço errado ou deixar telefone sem código do país 55 + DDD.",
    actionTip: "Baixe sua loja personalizada ali em cima e teste 'Simular Pedido WhatsApp'.",
    imagePath: "/cursos/guias/step-vercel-mobile.svg",
    imageAlt: "Vitrine publicada na Vercel em desktop e celular com resumo do pedido no WhatsApp.",
  },
  {
    id: "flip-centavos",
    level: "facil",
    badge: "Lógica · Centavos",
    frontTitle: "5. Camiseta custa R$ 79,90",
    frontPrompt:
      "Por que programadores experientes guardam 7990 (inteiro) no código e no banco em vez de 79.90 (float)?",
    backHeadline: "Centavos inteiros zeram erro binário de ponto flutuante",
    backAnswer:
      "Em Python e JavaScript, somar floats gera sobras invisíveis (0.1 + 0.2 == 0.30000000000000004). Com centavos inteiros toda conta fecha ao centavo.",
    commonMistake: "Somar preço em float e o cliente ver R$ 100,01 ou divergência na cobrança.",
    actionTip: "Armazene e calcule sempre em centavos; divida por 100 apenas na formatação visual.",
    imagePath: "/cursos/guias/flip-centavos-cors.svg",
    imageAlt: "Comparativo visual entre erro de float binário e cálculo exato em centavos inteiros.",
  },
  {
    id: "flip-neon-nocard",
    level: "mediano",
    badge: "Neon PostgreSQL · R$ 0",
    frontTitle: "6. Banco na nuvem cobra cartão de crédito?",
    frontPrompt:
      "Qual banco PostgreSQL gratuito permite subir loja com tabelas reais sem pedir cartão e sem expirar em 30 dias?",
    backHeadline: "Neon Free Tier (0,5 GB grátis por projeto)",
    backAnswer:
      "Diferente do Postgres gratuito do Render (que expira após 30 dias), o plano Free do Neon continua ativo sem cartão — basta entrar com sua conta GitHub.",
    commonMistake: "Deixar dados salvos dentro do db.sqlite3 no Render Free e perder tudo no próximo deploy.",
    actionTip: "Crie o projeto 'loja-db' no Neon e copie a string inteira em 'Connect'.",
    imagePath: "/cursos/guias/step-neon-project.jpg",
    imageAlt: "Tela Create Project do Neon PostgreSQL destacando Free Plan R$ 0 sem cartão.",
  },
  {
    id: "flip-neon-db",
    level: "mediano",
    badge: "Banco · DATABASE_URL",
    frontTitle: "7. Onde colo a senha do banco Neon?",
    frontPrompt:
      "Copiei a string postgresql://... do botão Connect no Neon. Em qual lugar exato eu colo para o Render enxergar?",
    backHeadline: "Environment Variables -> Chave DATABASE_URL no Render",
    backAnswer:
      "Nunca cole sua senha do PostgreSQL no código Python! Vá no painel do serviço Web no Render, abra 'Environment Variables' e crie a chave DATABASE_URL.",
    commonMistake: "Colar a URL secreta direto no settings.py e mandar para o GitHub.",
    actionTip: "Confira se a URL termina com ?sslmode=require exigido pela nuvem.",
    imagePath: "/cursos/guias/card-neon-banco.jpg",
    imageAlt: "Tela do Neon destacando o botão Connect e a string postgresql:// copiada.",
  },
  {
    id: "flip-render-sleep",
    level: "mediano",
    badge: "Render Free · Limite Real",
    frontTitle: "8. Minha API demorou 40s para abrir!",
    frontPrompt:
      "Sua vitrine abriu instantaneamente na Vercel, mas o primeiro pedido na API do Render demorou ~40 segundos. Deu erro?",
    backHeadline: "Hibernação normal após 15 min no Plano Free",
    backAnswer:
      "No Instance Type Free (R$ 0/mês) do Render, o servidor entra em repouso após 15 minutos sem tráfego e religa automaticamente na próxima requisição.",
    commonMistake: "Achar que o servidor quebrou e apagar tudo antes de terminar os 40 segundos de wake-up.",
    actionTip: "Exiba um aviso amigável 'Acordando servidor gratuito...' na primeira chamada.",
    imagePath: "/cursos/guias/step-render-sleep.svg",
    imageAlt: "Infográfico do ciclo gratuito do Render: ativo, soneca após 15 min e despertar em 40s.",
  },
  {
    id: "flip-render-vars",
    level: "mediano",
    badge: "Render · Configuração",
    frontTitle: "9. Quais 4 chaves não podem faltar no Render?",
    frontPrompt:
      "Subi o backend Django no Render, mas deu Bad Request (400) ou Server Error (500). Quais Environment Variables resolvem?",
    backHeadline: "DEBUG, ALLOWED_HOSTS, DATABASE_URL e CORS_ALLOWED_ORIGINS",
    backAnswer:
      "Defina DJANGO_DEBUG=false, ALLOWED_HOSTS=.onrender.com, DATABASE_URL apontando para o Neon e CORS_ALLOWED_ORIGINS com o domínio da Vercel.",
    commonMistake: "Esquecer o ponto em .onrender.com ou deixar DEBUG=True vazando stack trace.",
    actionTip: "Confira as 4 linhas exatamente como no print guiado antes de salvar.",
    imagePath: "/cursos/guias/step-render-env.jpg",
    imageAlt: "Painel Environment Variables do Render com DJANGO_DEBUG, ALLOWED_HOSTS, DATABASE_URL e CORS.",
  },
  {
    id: "flip-cors",
    level: "mediano",
    badge: "Vercel + Render · Integração",
    frontTitle: "10. Erro vermelho de CORS no Navegador!",
    frontPrompt:
      "Seu site em minha-loja.vercel.app chamou a API em minha-api.onrender.com e o navegador bloqueou. Como liberar?",
    backHeadline: "CORS_ALLOWED_ORIGINS sem barra '/' no final",
    backAnswer:
      "Por segurança, o navegador só permite que outro domínio leia o JSON se o servidor responder liberando exatamente a origem sem barra final.",
    commonMistake: "Colocar 'https://minha-loja.vercel.app/' com barra extra no final — falha na comparação exata.",
    actionTip: "Configure NEXT_PUBLIC_API_URL na Vercel e CORS_ALLOWED_ORIGINS no Render em espelho.",
    imagePath: "/cursos/guias/step-vercel-env.jpg",
    imageAlt: "Tela Configure Project da Vercel mostrando NEXT_PUBLIC_API_URL apontando para o Render.",
  },
  {
    id: "flip-webhook-hmac",
    level: "dificil",
    badge: "Pagamentos · Fail-Closed",
    frontTitle: "11. E se alguém enviar POST falso dizendo 'PAGO'?",
    frontPrompt:
      "Um curioso descobriu sua rota /webhooks/pix e mandou status=PAID pelo Insomnia. Como seu servidor trava isso na porta?",
    backHeadline: "Assinatura HMAC SHA-256 + hmac.compare_digest()",
    backAnswer:
      "O gateway assina o corpo bruto com um segredo compartilhado. Se o cabeçalho faltar ou não bater em tempo constante, retornamos HTTP 401 antes de tocar no pedido.",
    commonMistake: "Validar apenas IP em proxy ou confiar no retorno da tela 'Obrigado' do cliente.",
    actionTip: "Grave também o event_id numa tabela única para garantir idempotência em reenvios.",
    imagePath: "/cursos/guias/step-dificil-pix-split.svg",
    imageAlt: "Arquitetura de pagamentos com HMAC SHA-256 fail-closed, lock atômico e split em centavos.",
  },
  {
    id: "flip-lock-estoque",
    level: "dificil",
    badge: "Concorrência · Banco",
    frontTitle: "12. Duas pessoas comprando o último tênis!",
    frontPrompt:
      "Resta 1 unidade no estoque e dois clientes clicam em Pagar no mesmo milissegundo. Como impedir estoque -1?",
    backHeadline: "Transação Atômica + UPDATE WHERE estoque >= qty",
    backAnswer:
      "Nunca leia `if estoque >= 1` separado do UPDATE! Execute `UPDATE produto SET estoque = estoque - 1 WHERE id = ? AND estoque >= 1` dentro da mesma transação.",
    commonMistake: "Checar o estoque em memória Python e depois salvar — duas threads passam juntas.",
    actionTip: "Pratique essa corrida no Laboratório SQLite da IDE na aula A05.",
    imagePath: "/cursos/guias/deploy-render-postgres.jpg",
    imageAlt: "Fluxo backend com API transacional protegendo estoque no PostgreSQL.",
  },
];

export function InteractiveFlipDeck({
  activeLevel,
}: {
  activeLevel: CourseDifficultyLevel;
}) {
  const [filterLevel, setFilterLevel] = useState<CourseDifficultyLevel | "todos">("todos");
  const [viewMode, setViewMode] = useState<"deck" | "grid">("grid");
  const [index, setIndex] = useState(0);
  const [flippedDeck, setFlippedDeck] = useState(false);
  const [flippedGridMap, setFlippedGridMap] = useState<Record<string, boolean>>({});
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);

  const deck = useMemo(() => {
    const base =
      filterLevel === "todos"
        ? DYNAMIC_FLIP_CARDS
        : DYNAMIC_FLIP_CARDS.filter((c) => c.level === filterLevel);
    if (!shuffledOrder || shuffledOrder.length !== base.length) return base;
    return shuffledOrder.map((pos) => base[pos] ?? base[0]);
  }, [filterLevel, shuffledOrder]);

  const safeIdx = deck.length > 0 ? index % deck.length : 0;
  const card = deck[safeIdx];

  function handleChangeFilter(nextFilter: CourseDifficultyLevel | "todos") {
    setFilterLevel(nextFilter);
    setIndex(0);
    setFlippedDeck(false);
    setShuffledOrder(null);
  }

  function shuffleDeck() {
    const count =
      filterLevel === "todos"
        ? DYNAMIC_FLIP_CARDS.length
        : DYNAMIC_FLIP_CARDS.filter((c) => c.level === filterLevel).length;
    const indices = Array.from({ length: count }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledOrder(indices);
    setIndex(0);
    setFlippedDeck(false);
  }

  if (!card) return null;

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;

  return (
    <section className="ide-flipdeck-section" aria-label="Baralho Visual Dinâmico de Flip Cards">
      <div className="ide-flipdeck-head">
        <div>
          <span className="ide-file-badge">
            <Sparkles className="w-3 h-3" aria-hidden="true" /> {DYNAMIC_FLIP_CARDS.length} Flip Cards 3D Ilustrados · Aprendizagem Visual
          </span>
          <h3 className="ide-lab-title" style={{ marginTop: 6 }}>
            Baralho Visual Interativo: Clique em qualquer card para girar em 3D e dominar na prática
          </h3>
          <p className="ide-lab-objective" style={{ marginTop: 4 }}>
            Nível selecionado atualmente na IDE: <strong>{activeLevel.toUpperCase()}</strong> · Dominados:{" "}
            <strong>
              {masteredCount}/{DYNAMIC_FLIP_CARDS.length}
            </strong>
          </p>
        </div>

        <div className="ide-flipdeck-toolbar">
          <div className="ide-flipdeck-filters" role="group" aria-label="Modo de visualização">
            <button
              type="button"
              className={`ide-preset-chip${viewMode === "grid" ? " is-selected-chip" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" /> Grade Visual ({deck.length})
            </button>
            <button
              type="button"
              className={`ide-preset-chip${viewMode === "deck" ? " is-selected-chip" : ""}`}
              onClick={() => setViewMode("deck")}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" /> Baralho Focado
            </button>
          </div>

          <div className="ide-flipdeck-filters" role="group" aria-label="Filtrar baralho por nível">
            {(
              [
                ["todos", "Todos (12)"],
                ["facil", "Fácil"],
                ["mediano", "Mediano"],
                ["dificil", "Difícil"],
              ] as const
            ).map(([lvl, label]) => (
              <button
                key={lvl}
                type="button"
                className={`ide-preset-chip${filterLevel === lvl ? " is-selected-chip" : ""}`}
                onClick={() => handleChangeFilter(lvl)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="ide-flipgrid">
          {deck.map((item) => {
            const isFlipped = Boolean(flippedGridMap[item.id]);
            const isMastered = Boolean(masteredIds[item.id]);
            return (
              <div key={item.id} className="ide-flipgrid-item">
                <button
                  type="button"
                  className={`ide-flipcard-3d ide-flipcard-compact${isFlipped ? " is-flipped" : ""}`}
                  onClick={() =>
                    setFlippedGridMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  aria-pressed={isFlipped}
                  aria-label={`${item.frontTitle}. Clique para virar.`}
                >
                  {/* Front */}
                  <div className="ide-flipcard-face ide-flipcard-front">
                    <div className="ide-flipcard-meta">
                      <span className="ide-file-badge">{item.badge}</span>
                      <span className="ide-flip-cue">
                        <FlipHorizontal2 className="w-3.5 h-3.5" aria-hidden="true" /> Virar
                      </span>
                    </div>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagePath}
                      alt={item.imageAlt}
                      className="ide-flipcard-img"
                      loading="lazy"
                    />

                    <div>
                      <h4 className="ide-flipcard-title">{item.frontTitle}</h4>
                      <p className="ide-flipcard-prompt">{item.frontPrompt}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="ide-flipcard-face ide-flipcard-back">
                    <div className="ide-flipcard-meta">
                      <span className="ide-status-chip is-ok">Resposta</span>
                      <span className="ide-flip-cue">
                        <RotateCw className="w-3.5 h-3.5" aria-hidden="true" /> Imagem
                      </span>
                    </div>
                    <h4 className="ide-flipcard-title">{item.backHeadline}</h4>
                    <p className="ide-flipcard-answer">{item.backAnswer}</p>
                    <div className="ide-flipcard-callout">
                      <strong>Evite:</strong> {item.commonMistake}
                    </div>
                    <div className="ide-flipcard-tip">
                      <strong>Dica:</strong> {item.actionTip}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`ide-btn ide-btn-xs ${isMastered ? "ide-btn-primary" : "ide-btn-ghost"}`}
                  onClick={() =>
                    setMasteredIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  aria-pressed={isMastered}
                >
                  {isMastered ? "✓ Entendido" : "Marcar como Entendido"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="ide-flipcard-stage">
            <button
              type="button"
              className={`ide-flipcard-3d ide-flipcard-wide${flippedDeck ? " is-flipped" : ""}`}
              onClick={() => setFlippedDeck((f) => !f)}
              aria-pressed={flippedDeck}
              aria-label={`Card ${safeIdx + 1} de ${deck.length}: ${
                flippedDeck ? card.backHeadline : card.frontTitle
              }. Clique para virar.`}
            >
              {/* Front Face with Visual Split */}
              <div className="ide-flipcard-face ide-flipcard-front">
                <div className="ide-flipcard-meta">
                  <span className="ide-file-badge">{card.badge}</span>
                  <span className="ide-flip-cue">
                    <FlipHorizontal2 className="w-3.5 h-3.5" aria-hidden="true" /> Clique para virar
                  </span>
                </div>

                <div className="ide-flipcard-split">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imagePath}
                    alt={card.imageAlt}
                    className="ide-flipcard-hero-img"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="ide-flipcard-title">{card.frontTitle}</h4>
                    <p className="ide-flipcard-prompt" style={{ marginTop: 8 }}>
                      {card.frontPrompt}
                    </p>
                  </div>
                </div>

                <div className="ide-flipcard-footer">
                  Card {safeIdx + 1} de {deck.length} · Pense antes de olhar o verso!
                </div>
              </div>

              {/* Back Face */}
              <div className="ide-flipcard-face ide-flipcard-back">
                <div className="ide-flipcard-meta">
                  <span className="ide-status-chip is-ok">Resposta do Mestre</span>
                  <span className="ide-flip-cue">
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" /> Voltar para imagem
                  </span>
                </div>
                <h4 className="ide-flipcard-title">{card.backHeadline}</h4>
                <p className="ide-flipcard-answer">{card.backAnswer}</p>
                <div className="ide-flipcard-callout">
                  <strong>Armadilha:</strong> {card.commonMistake}
                </div>
                <div className="ide-flipcard-tip">
                  <strong>Na prática:</strong> {card.actionTip}
                </div>
              </div>
            </button>
          </div>

          <div className="ide-flipdeck-controls">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="ide-btn ide-btn-ghost"
                onClick={() => {
                  setIndex((prev) => (prev - 1 + deck.length) % deck.length);
                  setFlippedDeck(false);
                }}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                className="ide-btn ide-btn-ghost"
                onClick={() => {
                  setIndex((prev) => (prev + 1) % deck.length);
                  setFlippedDeck(false);
                }}
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="ide-btn ide-btn-ghost"
                onClick={shuffleDeck}
                title="Embaralhar baralho"
              >
                <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Embaralhar</span>
              </button>
            </div>

            <button
              type="button"
              className={`ide-btn ${masteredIds[card.id] ? "ide-btn-primary" : "ide-btn-ghost"}`}
              onClick={() =>
                setMasteredIds((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
              }
              aria-pressed={Boolean(masteredIds[card.id])}
            >
              <span>
                {masteredIds[card.id]
                  ? `Dominado (${masteredCount}/${DYNAMIC_FLIP_CARDS.length})`
                  : "Marcar como Entendido"}
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
