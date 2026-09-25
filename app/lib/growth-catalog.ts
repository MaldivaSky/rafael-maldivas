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
];
