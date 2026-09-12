"use client";
import Link from "next/link";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import { useLang } from "../lib/i18n";
export default function StudioInvite(){
 const {lang}=useLang(); const pt=lang==="pt";
 return <Link href="/ferramentas/estudio-de-imagem" className="studio-invite"><div className="studio-invite-icon"><ImagePlus size={32}/></div><div><span className="sec-tag">{pt?"Novo · gratuito e sem cadastro":"New · free, no account needed"}</span><h3>{pt?"Prepare sua foto para publicar":"Get your photo ready to publish"}</h3><p>{pt?"Redimensione, converta e monte uma imagem quadrada para catálogo. Veja o resultado e baixe o arquivo. A foto fica no seu navegador.":"Resize, convert and prepare a square catalogue image. Preview and download the result. Your photo stays in your browser."}</p></div><ArrowUpRight size={24}/></Link>;
}
