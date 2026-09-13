import { tools, GROUP_LABEL, type ToolGroup } from "../lib/tools";
import { SITE } from "../lib/site";

/**
 * /llms.txt — resumo do site no formato proposto em llmstxt.org.
 *
 * Modelos de linguagem não executam JavaScript nem clicam em nada: o que
 * eles conseguem ler é este arquivo. Em vez de manter uma lista escrita à
 * mão (que envelhece), ele é gerado a partir do mesmo registro que produz
 * as páginas de /ferramentas. Publicar uma ferramenta nova já a coloca aqui.
 */

export const dynamic = "force-static";

export function GET() {
  const groups: ToolGroup[] = ["fiscal", "margem", "site", "operacao"];

  const linhas: string[] = [
    "# Maldivas Tech",
    "",
    "> Sistemas sob medida, integrações e presença na internet para pequenas",
    "> empresas brasileiras. Este site mantém uma coleção de ferramentas",
    "> gratuitas, sem cadastro, que resolvem cálculos e consultas do dia a dia",
    "> de quem toca um negócio: precificação, nota fiscal, Pix, contrato, site",
    "> e dados públicos.",
    "",
    "Todas as ferramentas rodam no navegador ou consultam APIs públicas",
    "brasileiras (BrasilAPI, Banco Central, registro.br). Nenhuma exige login.",
    "Os dados sensíveis — como o XML de uma nota — são processados localmente,",
    "sem upload.",
    "",
    "## Ferramentas gratuitas",
    "",
  ];

  for (const g of groups) {
    const doGrupo = tools.filter((t) => t.group === g);
    if (doGrupo.length === 0) continue;
    linhas.push(`### ${GROUP_LABEL[g].pt}`, "");
    for (const t of doGrupo) {
      linhas.push(`- [${t.title}](${SITE}/ferramentas/${t.slug}): ${t.description}`);
    }
    linhas.push("");
  }

  linhas.push(
    "## Páginas principais",
    "",
    `- [Início](${SITE}): apresentação, produtos e ferramentas.`,
    `- [Serviços](${SITE}/servicos): o que é feito sob contrato e como começa um projeto.`,
    `- [Portfólio](${SITE}/portfolio): projetos de sistema, integração e edição.`,
    `- [Sobre](${SITE}/sobre): quem está por trás e como o trabalho é conduzido.`,
    `- [Estúdio de imagem](${SITE}/ferramentas/estudio-de-imagem): preparo de imagens no navegador.`,
    "",
    "## Produtos",
    "",
    "- MiseOn: gestão para cozinhas profissionais, com integração de canais de",
    "  delivery e precificação por ficha técnica. Ver https://miseon.app.br",
    "- mercadinhosys: gestão de mercadinho, com entrada de estoque pelo XML da",
    "  nota do fornecedor e emissão de NFC-e no PDV.",
    "",
    "## Contato",
    "",
    "- E-mail: rafaelmaldivas@gmail.com",
    "- WhatsApp: https://wa.me/5511919889233",
    "- LinkedIn: https://www.linkedin.com/in/rafael-paiva-dias/",
    "",
  );

  return new Response(linhas.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
