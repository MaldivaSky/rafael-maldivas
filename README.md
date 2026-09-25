# Maldivas Tech — site institucional e portfólio

Site de **Rafael Maldivas** / Maldivas Tech — Rafael Paiva Dias da Silva Consultoria em Tecnologia da Informação LTDA, CNPJ 68.923.239/0001-77.
Bilíngue pt-BR / en, Next.js 14 App Router, TypeScript estrito, CSS puro.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

> Com o `next dev` rodando na `.next`, builde em outra pasta sem derrubá-lo:
> `$env:NEXT_DIST_DIR=".next-build"; npm run build`. Ao fim, apague `.next-build`
> e `build.log` e rode `git checkout tsconfig.json` (o Next injeta os dirs de
> build no tsconfig e polui o diff). Nunca commitar lixo de build.

## Estrutura

```
app/
  layout.tsx        casca raiz: <html>/<body>, fontes, ThemeProvider, LangProvider
  [lang]/layout.tsx injeta o JSON-LD (siteGraph) do idioma + LangProvider
  [lang]/           TODAS as páginas (pt e en) — home, about, servicos,
                    portfolio, ferramentas, produtos
  lib/              seo.ts, metadata.ts, products.ts, structured-data.ts, i18n.tsx
  components/       UI compartilhada (nav, footer, cards, tools…)
  ferramentas/      client components das ferramentas (sem page.tsx próprio)
  servicos|portfolio|sobre/   *Client.tsx reutilizados pelas rotas /pt e /en
  admin/ api/       painel de leads e endpoints — ficam na RAIZ (sem idioma)
  globals.css       design system (tokens em :root)
middleware.ts       detecção de idioma (cookie → Accept-Language → pt)
```

> A raiz `/` **não tem `page.tsx`**: o `middleware.ts` responde com 307
> (temporário, language-aware) para `/{lang}`. Não recriar `app/page.tsx`.
>
> **Só o root layout renderiza `<html>`/`<body>`.** `/admin` e `/api` vivem na
> raiz e dependem dele — por isso o layout raiz é uma casca neutra, sem
> canonical/OG nem JSON-LD de entidade (isso fica no `[lang]/layout.tsx`).

## Manutenção

- **Adicionar produto:** um objeto novo em `app/lib/products.ts`, com `copy.pt`
  e `copy.en` (por intenção de busca, não tradução literal).
- **Adicionar ferramenta:** um objeto novo em `app/lib/tools.ts` com `copy.pt` e
  `copy.en` (mesmo padrão dos produtos: copy por **intenção de busca**, não
  tradução literal) e um `case` correspondente em
  `app/ferramentas/ToolRenderer.tsx` apontando para o componente da ferramenta.
  Tudo o que consome o registro (`sitemap.ts`, nav, `llms.txt`, índice de
  `/ferramentas`) já lê `copy`, então a página nova entra sozinha.
- **Adicionar página:** cria `app/[lang]/<rota>/page.tsx` e usa `buildMetadata()`
  para title/description/canonical/hreflang. Nunca declare canonical à mão.
- **Links internos:** sempre via `localePath(href, lang)` — nunca `href="/servicos"`
  cru, senão o link sai sem idioma e cai num redirect 301.
- **Trocar texto:** tudo vive nos dicionários por idioma — não há string solta no JSX.
- **Cores e espaçamento:** variáveis em `:root` no `globals.css`.
- **Negrito no conteúdo:** use `**texto**` — `rich()` converte sem
  `dangerouslySetInnerHTML`.

## Pendências antes do deploy

- [ ] Definir `NEXT_PUBLIC_SITE_URL=https://www.maldivastech.dev` no Vercel
      (fallback já aponta para o domínio oficial em `app/lib/site.ts`)
- [ ] Publicar o case study do exportador .xls e linkar no card do SelectSys
- [x] Imagem Open Graph (`app/opengraph-image.png`, 1200×630) — presente

---

## SEO técnico, i18n e Geo-SEO

Domínio canônico: **`https://www.maldivastech.dev`** (o `www` é o host
principal no Vercel; o apex `maldivastech.dev` faz 301 → www). Definido por
`NEXT_PUBLIC_SITE_URL` no Vercel. Tudo o que segue é derivado dele.

> **Apex vs www (crítico):** canonical, `@id` do JSON-LD, sitemap e robots usam
> **sempre o `www`**. O apex redireciona 301 para www em `next.config.mjs`
> (`redirects` com `has: host`). Não misturar os dois hosts, senão o Google vê
> conteúdo duplicado. Se um dia o apex virar o host principal, basta definir
> `NEXT_PUBLIC_SITE_URL=https://maldivastech.dev` no Vercel.

### Estrutura i18n (`app/[lang]/`)

| Rota | Idiomas | Observação |
|---|---|---|
| `/[lang]` | `/pt`, `/en` | home completa (HomeClient) |
| `/[lang]/servicos` | `/pt`, `/en` | serviços |
| `/[lang]/portfolio` | `/pt`, `/en` | portfólio |
| `/[lang]/about` | `/pt/about`, `/en/about` | página de autoridade (GEO) — canônico em ambos |
| `/[lang]/ferramentas` | `/pt`, `/en` | índice de ferramentas |
| `/[lang]/ferramentas/[slug]` | `/pt`, `/en` × 19 ferramentas | uma página por ferramenta (FAQ + JSON-LD) |
| `/[lang]/ferramentas/estudio-de-imagem` | `/pt`, `/en` | estúdio de imagem |
| `/[lang]/produtos` | `/pt`, `/en` | índice de produtos |
| `/[lang]/produtos/[slug]` | `/pt`, `/en` × `miseon`, `selectsys-jobs` | landings SaaS |

**URLs canônicas em inglês:** a página "sobre" usa `/en/about` (inglês) e
`/pt/about` (português) — a rota legada `/sobre` é redirecionada 301 para
`/pt/about`.

**Ordem de execução (importante):** o `middleware.ts` roda **antes** dos
`redirects` do `next.config.mjs`. Por isso o middleware tem uma lista
`LEGACY_PATHS` que **deixa passar** as rotas antigas (`/sobre`, `/servicos`, …)
para que os 301 dedicados as tratem — caso contrário o middleware as capturaria
primeiro e mandaria para um destino inexistente.

**Redirects 301 (`next.config.mjs`):** `/servicos`, `/portfolio`,
`/ferramentas`, `/ferramentas/:slug`, `/sobre` → versões `/pt/*`; aliases
`/miseon`, `/selectsys-jobs`, `/produtos` → landings pt.

- `generateStaticParams` pré-renderiza todas as variantes (SSG no Vercel).

### `html lang` — decisão de arquitetura

O Next 14 permite **um único `<html>`**, no layout raiz — que está **acima** do
segmento `[lang]` e, portanto, não conhece o idioma em build time. Ler
`headers()` aqui tornaria as 69 páginas dinâmicas (mata o SSG).

Restruturar para route groups (`app/(pt)/layout.tsx` + `app/(en)/layout.tsx`,
cada um com seu `<html>`) **foi avaliado e descartado**: `/admin` e `/api`
vivem na raiz e dependem do layout raiz; grupos com `<html>` próprio exigiriam
duplicar a árvore inteira (e um segundo `<html>` aninhado é inválido).

**Decisão:** manter o `<html lang="pt-BR">` no root e corrigir o atributo com um
script síncrono no `<head>` (`app/layout.tsx`), que roda antes do first paint e
antes de qualquer crawler avaliar o documento. Lê o 1º segmento da URL
(`/pt`→`pt-BR`, `/en`→`en`). O Googlebot executa JS e lê o valor correto; Bing e
parsers que não executam JS veem `pt-BR` no HTML cru. Alternativa não-JS:
`content-language` é emitido por idioma via `buildMetadata()`.

### JSON-LD — um único grafo

O JSON-LD de entidade vive **só** em `app/lib/structured-data.ts` (`siteGraph`),
injetado pelo `[lang]/layout.tsx` por idioma. Os `@id` são `${SITE}/#organization`,
`/#website` e `/#founder`. **Não** declarar JSON-LD de entidade no root layout
nem em páginas soltas: referencie os `@id` canônicos.

> Histórico: o root layout declarava um segundo `Organization` com `@id`
> `${SITE}#org` (sem barra), e o tool page referenciava `${SITE}#organization`
> — o HTML saía com entidades duplicadas/`@id` quebrado. Corrigido.

### Núcleo de SEO (`app/lib/`)

- **`seo.ts`** — locales, `HTML_LANG` (BCP-47), `localeUrl()`, `buildAlternates()`
  (gera canonical + `hreflang` de todas as variantes + `x-default`).
- **`metadata.ts`** — `buildMetadata()`: única forma de montar `<title>`,
  `<meta description>`, Open Graph, Twitter Card, canonical e hreflang. **Nunca
  declare canonical/hreflang à mão** — sempre via esta factory.
- **`products.ts`** — catálogo SaaS com copy por **intenção de busca** (não
  tradução literal): `"Sistema de Gestão para Restaurantes"` (pt) vs
  `"Multi-tenant Restaurant SaaS"` (en).
- **`structured-data.ts`** — JSON-LD: `Organization` (sede SP, `areaServed`
  global), `WebSite`, `Person` e um `SoftwareApplication` por produto, com
  `offers` (SaaS mensal) e `aggregateRating` (Rich Snippets).
- **`llms.txt`** (rota `app/llms.txt/route.ts`) — "cardápio" em Markdown para
  crawlers de IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot).

> **Data de fundação:** `COMPANY.since = "2026-09-02"` em `app/lib/site.ts` é
> usada como `foundingDate` no schema e em `llms.txt`. Parece futura, mas é o
> `data_inicio_atividade` que a Receita Federal publica para o CNPJ
> 68.923.239/0001-77 (confirmado via BrasilAPI). Não é invenção — se a data
> oficial mudar, ajustar só em `site.ts`.

### Indexação

- `app/robots.ts` — libera explicitamente bots de busca **e** de IA; bloqueia só
  `/api` e `/admin`.
- `app/sitemap.ts` — dinâmico; cada rota i18n sai uma vez por idioma com
  `alternates.languages` (o Next emite `<xhtml:link hreflang>`).

### Segurança (Vercel Pro)

`next.config.mjs` injeta HSTS (`preload`), CSP compatível com GA/AdSense e com os
CDNs do projeto (esm.sh, simpleicons), `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options`. A CSP vale para o
navegador; os bots do Google leem o HTML cru e não são afetados.

> **Vercel Pro:** o plano Pro é necessário para (a) headers customizados por
> rota com `headers()` no volume que usamos, (b) deploy de middleware Edge sem
> limite de invocações do Hobby e (c) logs/observabilidade do middleware. No
> Hobby, `headers()` funciona, mas o middleware tem limites de execução.

### Variáveis de ambiente (Vercel → Project → Settings → Environment Variables)

| Nome | Exemplo | Função |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.maldivastech.dev` | domínio canônico (todas as URLs absolutas) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `xxxx` | Search Console |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | `xxxx` | Bing Webmaster |

### Métricas da jornada

O componente `SiteAnalytics` envia eventos sem cookies ou dados de contato para
`POST /api/analytics`. O endpoint aceita apenas eventos conhecidos e registra
`metric=site_event`, evento e caminho (sem query string) nos logs da função.
Eventos: `page_view`, `contact_click`, `service_click`, `portfolio_click`,
`briefing_start`, `lead_submit`, `tool_click` e `product_demo`. Consulte os logs de Functions no
Vercel e filtre por `site_event` para comparar páginas, interesse e conversões.

### Checklist pós-deploy

- [ ] Definir `NEXT_PUBLIC_SITE_URL` no Vercel e redeployar
- [ ] Cadastrar a **propriedade de domínio** `maldivastech.dev` no Google Search
      Console e no Bing (a propriedade de domínio cobre apex e www juntos)
- [ ] Enviar `https://www.maldivastech.dev/sitemap.xml`
- [ ] Validar JSON-LD no Rich Results Test (MiseOn, SelectSys Jobs)
- [ ] Conferir `hreflang` no relatório "Internacional" do GSC
- [ ] Verificar `https://www.maldivastech.dev/llms.txt`

---
Backup da versão anterior em `_backup_pre_maldivas/`.
