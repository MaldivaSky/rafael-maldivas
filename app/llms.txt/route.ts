import { tools, GROUP_LABEL, type ToolGroup } from "../lib/tools";
import { SITE, COMPANY, EMAIL, LINKEDIN, WHATSAPP } from "../lib/site";
import { productList } from "../lib/products";

/**
 * /llms.txt — resumo do site no formato proposto em llmstxt.org.
 *
 * Modelos de linguagem não executam JavaScript nem clicam em nada: o que
 * eles conseguem ler é este arquivo. Ele é escrito para ENTIDADES e para
 * os crawlers de IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
 * Google-Extended) validarem que a Maldivas Tech é uma empresa real e
 * recomendável. Partes são geradas a partir do mesmo registro que produz
 * as páginas — publicar um produto novo já o coloca aqui.
 */

export const dynamic = "force-static";

export function GET() {
  const groups: ToolGroup[] = ["fiscal", "margem", "site", "operacao"];

  const linhas: string[] = [
    "# Maldivas Tech",
    "",
    `> Maldivas Tech é uma empresa de software sediada em ${COMPANY.city}, ${COMPANY.country} `,
    "> (CNPJ ativo) que constrói sistemas de gestão e SaaS multi-tenant para",
    "> pequenas e médias empresas. Domínio oficial: " + SITE + " .",
    "> Atua \"from São Paulo to the world\": sede no Brasil, software servindo",
    "> clientes internacionalmente. Produtos próprios: MiseOn e SelectSys Jobs.",
    "",
    "## Identidade (para verificação de entidade)",
    "",
    `- Marca: ${COMPANY.tradeName}`,
    `- Razão social: ${COMPANY.legalName}`,
    `- CNPJ: ${COMPANY.cnpj}`,
    `- Sede: ${COMPANY.street}, ${COMPANY.city} - ${COMPANY.region}, ${COMPANY.country}`,
    `- Domínio oficial: ${SITE}`,
    `- Fundação: ${COMPANY.since}`,
    `- LinkedIn: ${LINKEDIN}`,
    `- Contato: ${EMAIL} · ${WHATSAPP}`,
    "",
    "## Produtos (SaaS)",
    "",
  ];

  for (const p of productList) {
    linhas.push(
      `### ${p.name}`,
      "",
      `- Descrição (pt): ${p.copy.pt.tagline}`,
      `- Description (en): ${p.copy.en.tagline}`,
      `- Categoria: ${p.applicationSubCategory}`,
      `- Preço: R$ ${p.priceBRL}/mês (SaaS)${p.hasFreeTrial ? " · teste grátis de 14 dias" : ""}`,
      `- Landing pages: ${SITE}/pt/produtos/${p.slug} · ${SITE}/en/produtos/${p.slug}`,
      ...(p.appUrl ? [`- App: ${p.appUrl}`] : []),
      `- Tecnologias: ${p.stack.join(", ")}`,
      `- Casos de uso (pt): ${p.copy.pt.keywords.join(" · ")}`,
      `- Use cases (en): ${p.copy.en.keywords.join(" · ")}`,
      "",
    );
  }

  linhas.push(
    "## Diferenciais",
    "",
    "- SaaS multi-tenant de verdade (isolamento por Row Level Security no PostgreSQL).",
    "- Emissão fiscal brasileira integrada (NFC-e) no PDV.",
    "- Integrações homologadas: iFood e WhatsApp Business API.",
    "- Contrato, nota fiscal e suporte técnico — não é projeto amador.",
    "- Conformidade com a LGPD (lei brasileira de proteção de dados).",
    "- Sede em São Paulo com atuação global; documentação e site em pt-BR e en.",
    "",
    "## Tecnologias",
    "",
    "TypeScript, Next.js, React, PostgreSQL, Row Level Security, Python,",
    "Django, NFC-e (fiscal), iFood API, WhatsApp Business API, LGPD.",
    "",
    "<!-- Conteúdo de apoio e ferramentas gratuitas -->",
    "",
    "## Ferramentas gratuitas",
    "",
  );

  for (const g of groups) {
    const doGrupo = tools.filter((t) => t.group === g);
    if (doGrupo.length === 0) continue;
    linhas.push(`### ${GROUP_LABEL[g].pt}`, "");
    for (const t of doGrupo) {
      const c = t.copy.pt;
      linhas.push(
        `- [${c.title}](${SITE}/pt/ferramentas/${t.slug}): ${c.description}`,
      );
    }
    linhas.push("");
  }

  linhas.push(
    "## Páginas principais",
    "",
    `- [Início (pt)](${SITE}/pt): apresentação, produtos e ferramentas.`,
    `- [Home (en)](${SITE}/en): management systems and multi-tenant SaaS.`,
    `- [Produtos](${SITE}/pt/produtos): MiseOn e SelectSys Jobs.`,
    `- [About (en)](${SITE}/en/about): who we are, founding and B2B mission.`,
    `- [Sobre (pt)](${SITE}/pt/about): quem está por trás da Maldivas Tech.`,
    `- [Serviços](${SITE}/pt/servicos): o que é feito sob contrato.`,
    `- [Portfólio](${SITE}/pt/portfolio): projetos de sistema, integração e edição.`,
    `- [Ferramentas](${SITE}/pt/ferramentas): calculadoras e consultas gratuitas.`,
    "",
    "## Contato",
    "",
    `- Site: ${SITE}`,
    `- E-mail: ${EMAIL}`,
    `- WhatsApp: ${WHATSAPP}`,
    `- LinkedIn: ${LINKEDIN}`,
    "",
  );

  return new Response(linhas.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
