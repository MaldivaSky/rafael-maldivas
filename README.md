# Maldivas Tech Solutions — site institucional e portfólio

Site de **Rafael Maldivas** / Maldivas Tech Solutions (CNPJ 63.310.253/0001-81).
Bilíngue pt-BR / en, Next.js 14 App Router, TypeScript estrito, CSS puro.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Estrutura

```
app/
  layout.tsx    metadata, JSON-LD (Organization + Person), fontes
  page.tsx      página única — dicionário pt/en em `t`, produtos em `products`
  globals.css   design system (tokens em :root)
  icon.svg      favicon
```

## Manutenção

- **Adicionar produto:** um objeto novo em `products` (page.tsx), com `problem` e `solution` nos dois idiomas.
- **Trocar texto:** tudo vive no objeto `t` — não há string solta no JSX.
- **Cores e espaçamento:** variáveis em `:root` no `globals.css`.
- **Negrito no conteúdo:** use `**texto**` — a função `rich()` converte sem `dangerouslySetInnerHTML`.

## Pendências antes do deploy

- [ ] Confirmar o handle da organização no GitHub (`GITHUB_ORG` em `page.tsx`)
- [ ] Registrar o domínio e ajustar `SITE` em `layout.tsx`
- [ ] Adicionar imagem Open Graph (`app/opengraph-image.png`, 1200×630)
- [ ] Publicar o case study do exportador .xls e linkar no card do SelectSys

---
Backup da versão anterior em `_backup_pre_maldivas/`.
