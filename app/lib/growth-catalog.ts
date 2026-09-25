import type { Tool } from "./tools";

export const growthTools: Tool[] = [
  {
    slug: "gerador-link-whatsapp", key: "whatsapp", group: "site", category: "BusinessApplication",
    copy: {
      pt: { title: "Gerador de link do WhatsApp", seoTitle: "Gerador de link do WhatsApp com mensagem | grátis", h1: "Seu próximo cliente, a um clique.", description: "Crie um link do WhatsApp com mensagem personalizada para sua bio, site ou campanha. Copie e compartilhe. Grátis, sem cadastro.", keywords: ["gerador link whatsapp", "link whatsapp mensagem", "link para bio"], faq: [["A ferramenta envia mensagens?", "Não. Ela cria um link com uma mensagem pronta. A pessoa abre o WhatsApp e confirma o envio."], ["Preciso incluir o código do país?", "Sim. Informe o número completo com código do país e DDD. Para o Brasil, comece com 55. A ferramenta verifica o formato, mas não se o número possui WhatsApp."]] },
      en: { title: "WhatsApp link generator", seoTitle: "Free WhatsApp link generator with a prefilled message", h1: "Your next customer is one click away.", description: "Create a WhatsApp link with a personalized message for your bio, website or campaign. Copy and share it. Free, no signup.", keywords: ["WhatsApp link generator", "prefilled WhatsApp message"], faq: [["Does this send messages?", "No. It creates a link with a prefilled message. The visitor opens WhatsApp and confirms sending."], ["Should I include a country code?", "Yes. Enter the full international number. The tool checks its format, not whether it has WhatsApp."]] },
    },
  },
  {
    slug: "criador-links-utm", key: "utm", group: "site", category: "BusinessApplication",
    copy: {
      pt: { title: "Criador de links de campanha (UTM)", seoTitle: "Criador de links UTM para campanhas | grátis", h1: "Cada campanha com seu próprio link.", description: "Monte links com origem, meio e nome da campanha para identificar suas visitas no analytics. Modelos para Instagram, WhatsApp e e-mail.", keywords: ["gerador UTM", "criador link campanha", "utm instagram"], faq: [["O link conta os cliques sozinho?", "Não. Seu site precisa de uma ferramenta de analytics configurada para interpretar os parâmetros UTM."], ["O que acontece com parâmetros que já existem?", "Parâmetros não editados e a âncora são preservados. Origem, meio e campanha são substituídos pelos valores preenchidos. O conteúdo opcional é removido se ficar vazio."]] },
      en: { title: "Campaign URL builder (UTM)", seoTitle: "Free UTM campaign URL builder", h1: "Give every campaign its own link.", description: "Build links with source, medium and campaign name to identify visits in analytics. Presets for Instagram, WhatsApp and email.", keywords: ["UTM builder", "campaign URL builder"], faq: [["Does the link count clicks by itself?", "No. Your website needs an analytics tool configured to read UTM parameters."], ["Are existing parameters preserved?", "Unedited parameters and the anchor are preserved. Source, medium and campaign are replaced. Optional content is removed when left empty."]] },
    },
  },
  {
    slug: "simulador-tempo-automacao", key: "automacao", group: "operacao", category: "BusinessApplication",
    copy: {
      pt: { title: "Simulador de tempo com automação", seoTitle: "Simulador de tempo economizado com automação | grátis", h1: "Menos repetição. Mais tempo para criar.", description: "Estime quantas horas uma automação pode liberar por mês. Ajuste o tempo da tarefa, a frequência e a redução esperada, sem cadastro.", keywords: ["simulador automação", "tempo economizado", "automatizar tarefas"], faq: [["Como o cálculo é feito?", "Multiplicamos minutos por execução, execuções por dia e dias por mês; dividimos por 60 e aplicamos a redução estimada."], ["O resultado é garantido?", "Não. É uma simulação baseada nos valores informados. Implantação, manutenção e revisão humana não estão incluídas. A viabilidade precisa ser avaliada para cada processo."]] },
      en: { title: "Automation time savings simulator", seoTitle: "Free automation time savings simulator", h1: "Less repetition. More time to create.", description: "Estimate how many hours automation could free up each month. Adjust task duration, frequency and expected reduction. No signup.", keywords: ["automation calculator", "time savings simulator"], faq: [["How is the estimate calculated?", "Minutes per task multiplied by tasks per day and working days, divided by 60, then multiplied by the expected reduction."], ["Is the result guaranteed?", "No. It is a simulation based on your inputs. Implementation, maintenance and human review are not included. Each process needs a feasibility assessment."]] },
    },
  },
  {
    slug: "roi-presenca-digital", key: "roi", group: "site", category: "BusinessApplication",
    copy: {
      pt: {
        title: "Calculadora de ROI de presença digital",
        seoTitle: "Quanto custa não ter site? Calculadora de ROI digital | grátis",
        h1: "Quanto a sua empresa está deixando na mesa por não ter presença digital?",
        description: "Descubra quanto a sua empresa pode ganhar a mais por mês melhorando a presença digital. Informe seu ticket médio e seus leads atuais — a calculadora mostra o potencial real.",
        keywords: ["quanto custa não ter site", "ROI de site", "retorno presença digital", "calculadora de retorno digital", "vale a pena investir em site", "quanto ganha com presença digital"],
        faq: [
          ["Como a calculadora estima o retorno?", "Ela calcula quantos leads você já recebe pelo digital hoje, estima o ganho com uma melhora percentual e multiplica pelo seu ticket médio e taxa de fechamento. É uma projeção conservadora para dar um ponto de partida realista."],
          ["Preciso de um site novo para ter resultado?", "Não necessariamente. Às vezes pequenas melhorias — um botão de WhatsApp visível, uma página de Google Meu Negócio atualizada ou um formulário funcionando — já mudam o resultado. A calculadora ajuda a ver se vale o investimento."],
          ["O número que aparece é garantido?", "Não. É uma estimativa baseada nos dados que você informou. O resultado real depende da qualidade da execução, do mercado e de outros fatores. Use como ponto de partida, não como contrato."],
        ],
      },
      en: {
        title: "Digital presence ROI calculator",
        seoTitle: "Digital presence ROI calculator: what are you leaving on the table?",
        h1: "How much revenue is your business missing without a strong digital presence?",
        description: "Find out how much more your business could earn each month by improving its digital presence. Enter your average ticket and current leads — the calculator shows the real potential.",
        keywords: ["digital presence ROI", "website ROI calculator", "is a website worth it", "digital marketing return", "business website investment"],
        faq: [
          ["How does the calculator estimate the return?", "It calculates your current digital leads, estimates the gain from a percentage improvement and multiplies by your average ticket and close rate. It is a conservative projection to give you a realistic starting point."],
          ["Do I need a new website to get results?", "Not necessarily. Sometimes small improvements — a visible WhatsApp button, an updated Google Business profile or a working contact form — already change the outcome. The calculator helps you see whether the investment makes sense."],
          ["Is the figure shown guaranteed?", "No. It is an estimate based on the data you entered. Real results depend on execution quality, the market and other factors. Use it as a starting point, not a contract."],
        ],
      },
    },
  },
  {
    slug: "diagnostico-digital",
    key: "diagnostico",
    group: "operacao",
    category: "BusinessApplication",
    copy: {
      pt: {
        title: "Diagnóstico de Maturidade Digital",
        seoTitle: "Descubra o Score de Maturidade Digital da sua empresa | Grátis",
        h1: "O seu negócio está preparado para competir na internet?",
        description: "Avalie a presença digital da sua empresa em 3 minutos e descubra onde você está perdendo dinheiro. Receba um relatório visual e um score de maturidade instantâneo.",
        keywords: ["diagnóstico digital", "maturidade digital", "avaliação de presença online", "auditoria de site", "score digital da empresa"],
        faq: [
          ["Como funciona o diagnóstico?", "Você responde a 8 perguntas rápidas sobre as áreas-chave do seu negócio (site, atração, conversão e métricas). O sistema calcula um score e gera um gráfico radar mostrando seus pontos fortes e fracos."],
          ["Preciso pagar para ver o resultado?", "Não. O score e o gráfico radar são gerados instantaneamente e de forma 100% gratuita na própria tela."],
          ["O que eu faço com o resultado?", "O gráfico vai te mostrar exatamente quais áreas (ex: conversão ou atração) precisam de atenção imediata. Você pode usar isso para guiar seus próximos investimentos ou agendar uma análise comigo."],
        ],
      },
      en: {
        title: "Digital Maturity Diagnostic",
        seoTitle: "Find out your company's Digital Maturity Score | Free",
        h1: "Is your business ready to compete online?",
        description: "Assess your company's digital presence in 3 minutes and find out where you're losing money. Get a visual report and an instant maturity score.",
        keywords: ["digital diagnostic", "digital maturity", "online presence assessment", "website audit", "company digital score"],
        faq: [
          ["How does the diagnostic work?", "You answer 8 quick questions about key areas of your business (website, attraction, conversion and metrics). The system calculates a score and generates a radar chart showing your strengths and weaknesses."],
          ["Do I have to pay to see the results?", "No. The score and radar chart are generated instantly and 100% free on the screen."],
          ["What do I do with the results?", "The chart will show you exactly which areas (e.g. conversion or attraction) need immediate attention. You can use this to guide your next investments or schedule a review with me."],
        ],
      },
    },
  },
];
