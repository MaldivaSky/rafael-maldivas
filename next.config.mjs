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
};
export default nextConfig;
