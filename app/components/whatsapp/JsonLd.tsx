/** JSON-LD server-side (SEO e GEO: Google e motores de IA leem este bloco). */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
