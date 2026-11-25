import type { Metadata } from "next";
import { LOCALES, isLang, type Lang } from "../lib/seo";
import { buildMetadata } from "../lib/metadata";
import { SITE } from "../lib/site";
import { allCourseLessons, courseBySlug } from "../lib/courses";
import { BRAND_VIDEO, HOME_FAQ } from "../lib/home-content";
import JsonLd from "../components/whatsapp/JsonLd";
import HomeClient from "../HomeClient";

export function generateStaticParams() {
  return LOCALES.map((lang: Lang) => ({ lang }));
}

export async function generateMetadata({ params: paramsP }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await paramsP;
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  const pt = lang === "pt";
  // A home ranqueia a MARCA e os termos de empresa; as palavras de cada
  // produto ficam nas páginas de produto (evita canibalização).
  return buildMetadata({
    lang,
    path: "",
    title: pt ? "Maldivas Tech — Software house: SaaS e sistemas sob medida" : "Maldivas Tech — Software house: SaaS and custom systems",
    description: pt
      ? "Software house em São Paulo: MiseOn, MercadinhoSys, SelectSys Jobs, Atol Connect e MySuperStore. Sistemas sob medida, BI e curso grátis com certificado."
      : "São Paulo software house: MiseOn, MercadinhoSys, SelectSys Jobs, Atol Connect and MySuperStore. Custom systems, BI and a free certified course.",
    keywords: pt
      ? ["software house São Paulo", "desenvolvimento de sistemas sob medida", "empresa de SaaS", "Maldivas Tech", "curso gratuito com certificado"]
      : ["software house Brazil", "custom software development", "SaaS company", "Maldivas Tech"],
  });
}

export default async function LangHome({ params: paramsP }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await paramsP;
  const lang = (isLang(l) ? l : "pt") as Lang;
  const pt = lang === "pt";
  const url = `${SITE}/${lang}`;
  const org = { "@id": `${SITE}/#organization` };

  const course = courseBySlug("construa-seu-marketplace");
  const lessons = course ? allCourseLessons(course) : [];
  const minutes = lessons.reduce((s, x) => s + x.durationMin, 0);

  const products = [
    { name: "MiseOn", url: `${SITE}/${lang}/produtos/miseon`, id: `${SITE}/#product-miseon` },
    { name: "MercadinhoSys", url: `${SITE}/${lang}/produtos/mercadinhosys`, id: `${SITE}/#product-mercadinhosys` },
    { name: "SelectSys Jobs", url: `${SITE}/${lang}/produtos/selectsys-jobs`, id: `${SITE}/#product-selectsys-jobs` },
    { name: "Atol Connect", url: `${SITE}/${lang}/whatsapp-api`, id: "https://connect.maldivastech.dev/#software" },
    { name: "MySuperStore", url: "https://mysuperstore-lime.vercel.app", id: `${SITE}/#product-mysuperstore` },
  ];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${url}#produtos`,
      name: pt ? "Produtos SaaS da Maldivas Tech" : "Maldivas Tech SaaS products",
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: p.url, item: { "@id": p.id } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#product-mysuperstore`,
      name: "MySuperStore",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://mysuperstore-lime.vercel.app",
      description: pt ? "Plataforma de marketplace multi-vendedor com split PIX, webhook idempotente e assistente de IA." : "Multi-vendor marketplace platform with PIX split, idempotent webhooks and an AI assistant.",
      provider: org,
      author: org,
    },
    ...(course
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "@id": `${SITE}/${lang}/cursos/${course.slug}#course`,
            name: course.name,
            description: course.copy[lang].metaDescription,
            url: `${SITE}/${lang}/cursos/${course.slug}`,
            provider: org,
            inLanguage: "pt-BR",
            isAccessibleForFree: true,
            educationalCredentialAwarded: pt ? "Certificado de conclusão de curso livre, verificável" : "Verifiable free-standing course certificate",
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL", category: "Free", availability: "https://schema.org/InStock" },
            hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${Math.floor(minutes / 60)}H${minutes % 60}M` },
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: BRAND_VIDEO.name[lang],
      description: BRAND_VIDEO.description[lang],
      thumbnailUrl: `${SITE}${BRAND_VIDEO.poster}`,
      contentUrl: `${SITE}${BRAND_VIDEO.src}`,
      uploadDate: BRAND_VIDEO.uploadDate,
      publisher: org,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: HOME_FAQ.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <HomeClient />
    </>
  );
}
