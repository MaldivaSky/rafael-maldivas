import type { Metadata } from "next";
import { isLang, type Lang } from "@/app/lib/seo";
import { buildMetadata } from "@/app/lib/metadata";
import ImageStudio from "@/app/ferramentas/estudio-de-imagem/ImageStudio";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLang(params.lang)) return {};
  const lang = params.lang as Lang;
  return buildMetadata({
    lang,
    path: "ferramentas/estudio-de-imagem",
    title:
      lang === "pt"
        ? "Estúdio de Imagem Grátis — Remover Fundo, Redimensionar e Converter"
        : "Free Image Studio — Remove Background, Resize and Convert",
    description:
      lang === "pt"
        ? "Prepare fotos para sites e catálogos: remova o fundo com um clique, converta JPG, PNG e WebP, ajuste o tamanho e baixe sem cadastro. Tudo no navegador."
        : "Prepare photos for sites and catalogues: remove the background in one click, convert JPG, PNG and WebP, resize and download with no signup. All in your browser.",
    keywords:
      lang === "pt"
        ? [
            "remover fundo de imagem",
            "tirar fundo de foto grátis",
            "converter imagem WebP",
            "redimensionar foto online",
          ]
        : [
            "remove image background",
            "free background remover",
            "convert image to WebP",
            "resize photo online",
          ],
  });
}

export default function ImageStudioPage() {
  return <ImageStudio />;
}
