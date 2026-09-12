import type { Metadata } from "next";
import ImageStudio from "./ImageStudio";
export const metadata:Metadata={title:"Estúdio de imagem grátis — redimensionar, converter e preparar fotos",description:"Prepare fotos para sites e catálogos. Converta JPG, PNG e WebP, ajuste o tamanho e baixe sem cadastro. Processamento no navegador.",alternates:{canonical:"/ferramentas/estudio-de-imagem"}};
export default function Page(){return <ImageStudio/>;}
