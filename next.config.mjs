/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // permite compilar em outra pasta sem derrubar o `next dev` que já está no ar
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /**
   * A remoção de fundo (@imgly/background-removal) NÃO entra no bundle: o
   * componente BackgroundRemover a carrega sob demanda direto do CDN (esm.sh),
   * fora do webpack (import com webpackIgnore). Assim o onnxruntime-web, que
   * usa `import.meta` e quebraria a compilação, nunca passa pelo build.
   */

  /* ----------------------------------------------------------------- */
  /*  Cabeçalhos de segurança (Vercel Pro) — nota máxima sem vetar SEO  */
  /* ----------------------------------------------------------------- */
  async headers() {
    /**
     * CSP compatível com rastreamento:
     *  • 'unsafe-inline' em script-src é necessário para o bootstrap do
     *    Next e para o JSON-LD inline; bots do Google leem o HTML cru e
     *    não são bloqueados por CSP (ela vale para o navegador).
     *  • liberamos os domínios do Google/Analytics/AdSense e os CDNs que
     *    o projeto já usa (esm.sh para background-removal, simpleicons).
     */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://cdn.simpleicons.org",
      "connect-src 'self' https://esm.sh https://cdn.simpleicons.org https://www.google-analytics.com https://region1.google-analytics.com https://viacep.com.br https://brasilapi.com.br https://api.bcb.gov.br",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          // HSTS — 2 anos, subdomínios, pronto para preload
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), browsing-topics=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      // sitemap, robots e llms.txt não precisam de CSP restritiva
      {
        source: "/(sitemap.xml|robots.txt|llms.txt)",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  /* ----------------------------------------------------------------- */
  /*  Redirecionamentos de SEO (301)                                    */
  /*                                                                    */
  /*  Consolida as URLs legadas (sem idioma) nas rotas i18n canônicas   */
  /*  /pt/*.                                                            */
  /*                                                                    */
  /*  ATENÇÃO À ORDEM: o middleware roda ANTES destes redirects. Por    */
  /*  isso o middleware tem uma lista LEGACY_PATHS que deixa essas URLs  */
  /*  passarem sem tocá-las — senão ele as capturaria primeiro e mandaria */
  /*  para um destino inexistente (ex.: /sobre -> /pt/sobre, que não     */
  /*  existe; o canônico é /pt/about).                                   */
  /*                                                                    */
  /*  São 301 (permanent: true) porque as rotas antigas não voltam — o   */
  /*  ranking migra de vez para o novo destino.                          */
  /* ----------------------------------------------------------------- */
  async redirects() {
    return [
      // páginas legadas → /pt/*
      { source: "/servicos", destination: "/pt/servicos", permanent: true },
      { source: "/portfolio", destination: "/pt/portfolio", permanent: true },
      { source: "/ferramentas", destination: "/pt/ferramentas", permanent: true },
      { source: "/ferramentas/:slug", destination: "/pt/ferramentas/:slug", permanent: true },
      { source: "/sobre", destination: "/pt/about", permanent: true },
      // aliases de marca → landing de produto
      { source: "/miseon", destination: "/pt/produtos/miseon", permanent: true },
      {
        source: "/selectsys-jobs",
        destination: "/pt/produtos/selectsys-jobs",
        permanent: true,
      },
      { source: "/produtos", destination: "/pt/produtos", permanent: true },
    ];
  },
};
export default nextConfig;
