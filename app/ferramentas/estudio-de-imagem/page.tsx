import type { Metadata } from "next";
import ImageStudio from "./ImageStudio";
export const metadata: Metadata = {
  title: "Estúdio de imagem grátis — remover fundo, redimensionar e converter fotos",
  description:
    "Prepare fotos para sites e catálogos: remova o fundo com um clique, converta JPG, PNG e WebP, ajuste o tamanho e baixe sem cadastro. Tudo no navegador, sem enviar sua foto.",
  keywords: [
    "remover fundo de imagem",
    "tirar fundo de foto grátis",
    "remover fundo sem cadastro",
    "deixar fundo transparente",
    "converter imagem WebP",
    "redimensionar foto online",
    "recortar produto catálogo",
  ],
  alternates: { canonical: "/ferramentas/estudio-de-imagem" },
};
export default function Page(){return <ImageStudio/>;}
