"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, ImagePlus, ArrowLeft, Upload, ShieldCheck } from "lucide-react";
import { useLang } from "../../lib/i18n";

type Loaded = { image: HTMLImageElement; name: string; bytes: number; url: string };
type Result = { url: string; size: number; width: number; height: number; ext: string };
const bytes = (n:number) => n >= 1048576 ? `${(n/1048576).toFixed(2)} MB` : `${Math.round(n/1024)} KB`;

export default function ImageStudio(){
 const {lang}=useLang(); const pt=lang==="pt";
 const [source,setSource]=useState<Loaded|null>(null);
 const [result,setResult]=useState<Result|null>(null);
 const [format,setFormat]=useState("image/webp");
 const [size,setSize]=useState(1600);
 const [quality,setQuality]=useState(85);
 const [mode,setMode]=useState("original");
 const [background,setBackground]=useState("#ffffff");
 const [busy,setBusy]=useState(false);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const input=useRef<HTMLInputElement>(null);
 const generation=useRef(0);
 const loadVersion=useRef(0);
 const mounted=useRef(true);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;loadVersion.current++;};},[]);
 useEffect(()=>()=>{if(source)URL.revokeObjectURL(source.url);},[source]);
 useEffect(()=>()=>{if(result)URL.revokeObjectURL(result.url);},[result]);

 async function open(file:File){
   const version=++loadVersion.current;
   if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>20*1024*1024){setError(pt?"Escolha um JPG, PNG ou WebP de até 20 MB.":"Choose a JPG, PNG or WebP up to 20 MB.");return;}
   setLoading(true);setError("");
   const url=URL.createObjectURL(file), image=new Image(); image.src=url;
   try{await image.decode();
     if(version!==loadVersion.current||!mounted.current){URL.revokeObjectURL(url);return;}
     if(image.naturalWidth*image.naturalHeight>40_000_000)throw new Error("size");
     setResult(null);setSource({image,name:file.name,bytes:file.size,url});
   }catch{URL.revokeObjectURL(url);if(version===loadVersion.current&&mounted.current)setError(pt?"Não foi possível abrir a imagem. Use um arquivo válido de até 40 megapixels.":"Could not open this image. Use a valid file up to 40 megapixels.");}
   finally{if(version===loadVersion.current&&mounted.current)setLoading(false);}
 }

 useEffect(()=>{
   if(!source)return;
   const version=++generation.current;
   setBusy(true);setResult(null);setError("");
   const timer=setTimeout(()=>{
     const canvas=document.createElement("canvas");
     const iw=source.image.naturalWidth,ih=source.image.naturalHeight;
     const ratio=Math.min(1,size/Math.max(iw,ih));
     canvas.width=mode==="catalog"?size:Math.max(1,Math.round(iw*ratio));
     canvas.height=mode==="catalog"?size:Math.max(1,Math.round(ih*ratio));
     const ctx=canvas.getContext("2d");
     const fail=()=>{if(version===generation.current){setError(pt?"Seu navegador não conseguiu gerar o arquivo. Tente um tamanho menor.":"Your browser could not create the file. Try a smaller size.");setBusy(false);}};
     if(!ctx){fail();return;}
     if(mode==="catalog"||format==="image/jpeg"){ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);}
     const scale=mode==="catalog"?Math.min((size*.9)/iw,(size*.9)/ih,1):ratio;
     const w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
     ctx.imageSmoothingQuality="high";
     ctx.drawImage(source.image,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
     try{canvas.toBlob(blob=>{
       if(version!==generation.current||!mounted.current)return;
       if(!blob){fail();return;}
       setResult({url:URL.createObjectURL(blob),size:blob.size,width:canvas.width,height:canvas.height,ext:blob.type==="image/webp"?"webp":blob.type==="image/jpeg"?"jpg":"png"});setBusy(false);
     },format,quality/100);}catch{fail();}
   },180);
   return()=>{clearTimeout(timer);generation.current++;};
 },[source,size,quality,mode,background,format,pt]);

 function reset(){loadVersion.current++;generation.current++;setSource(null);setResult(null);setError("");setBusy(false);setLoading(false);if(input.current)input.current.value="";}
 return <div className="image-studio wrap">
   <Link href="/ferramentas" className="personal-link"><ArrowLeft size={16}/>{pt?"Todas as ferramentas":"All tools"}</Link>
   <div className="studio-heading"><div><div className="sec-tag">{pt?"Estúdio de imagem / Maldivas Tech":"Image studio / Maldivas Tech"}</div><h1>{pt?"Sua foto, pronta para usar.":"Your photo, ready to use."}</h1><p>{pt?"Ajuste o tamanho, escolha o formato e baixe. Para o seu site, catálogo ou próxima publicação.":"Choose the size and format, then download. For your website, catalogue or next post."}</p></div><span className="studio-private"><ShieldCheck size={18}/>{pt?"Sem enviar sua foto a um servidor":"No image upload to a server"}</span></div>
   <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="studio-file" aria-label={pt?"Escolher imagem":"Choose image"} onChange={e=>{const file=e.target.files?.[0];if(file)void open(file);e.target.value="";}}/>
   <div className="studio-workspace">
    <div className="studio-preview">
     {!source?<button className="studio-drop" onClick={()=>input.current?.click()} disabled={loading}><ImagePlus size={48} strokeWidth={1}/><strong>{loading?(pt?"Abrindo imagem…":"Opening image…"):(pt?"Escolha uma foto para começar":"Choose a photo to get started")}</strong><span>JPG, PNG, WebP · {pt?"até 20 MB / 40 megapixels":"up to 20 MB / 40 megapixels"}</span><span className="btn btn-primary"><Upload size={17}/>{pt?"Escolher imagem":"Choose image"}</span></button>:<><div className="studio-preview-head"><span>{pt?"Prévia do resultado":"Output preview"}</span><button type="button" onClick={()=>input.current?.click()} disabled={loading}>{pt?"Trocar foto":"Change photo"}</button></div><div className="studio-checker">{result?<img src={result.url} alt={pt?"Prévia da imagem preparada":"Prepared image preview"}/>:<span role="status">{pt?"Preparando sua imagem…":"Preparing your image…"}</span>}</div><div className="studio-source"><span>{source.name}</span><span>{source.image.naturalWidth} × {source.image.naturalHeight} · {bytes(source.bytes)}</span></div></>}
    </div>
    <div className="studio-controls">
     <div className="sec-tag">{pt?"Como você quer a imagem?":"How would you like it?"}</div>
     <fieldset disabled={!source||loading}><legend className="sr-only">{pt?"Opções da imagem":"Image options"}</legend>
      <label>{pt?"Composição":"Layout"}<select value={mode} onChange={e=>setMode(e.target.value)}><option value="original">{pt?"Manter proporção original":"Keep original proportions"}</option><option value="catalog">{pt?"Quadrada para catálogo · com margem":"Square catalogue image · with padding"}</option></select></label>
      <label>{pt?"Tamanho máximo":"Maximum size"}<select value={size} onChange={e=>setSize(Number(e.target.value))}>{[640,1080,1600,2048,3200].map(n=><option value={n} key={n}>{n} px</option>)}</select></label>
      <label>{pt?"Formato do arquivo":"File format"}<select value={format} onChange={e=>setFormat(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
      {format!=="image/png"&&<label>{pt?"Qualidade":"Quality"} <strong>{quality}%</strong><input type="range" min="40" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label>}
      {(mode==="catalog"||format==="image/jpeg")&&<label>{pt?"Cor da margem / transparência":"Padding / transparency colour"}<input type="color" value={background} onChange={e=>setBackground(e.target.value)}/></label>}
     </fieldset>
     <p className="studio-hint">{pt?"A foto não é esticada nem recortada. O modo catálogo acrescenta uma margem; ele não remove o fundo original.":"Photos are never stretched or cropped. Catalogue mode adds padding; it does not remove the original background."}</p>
     <div aria-live="polite" className="studio-result">{result&&!busy?<><strong>{result.width} × {result.height} · {bytes(result.size)}</strong><span>{result.size<source!.bytes?(pt?`${Math.round((1-result.size/source!.bytes)*100)}% menor que o original`:`${Math.round((1-result.size/source!.bytes)*100)}% smaller than the original`):(pt?"Este arquivo ficou maior que o original. Você pode reduzir o tamanho ou a qualidade.":"This file is larger than the original. You can reduce size or quality.")}</span></>:<span>{source?(pt?"Atualizando a prévia…":"Updating preview…"):(pt?"O tamanho final aparece aqui.":"Output size will appear here.")}</span>}</div>
     {result&&!busy&&!loading?<a className="btn btn-primary studio-download" href={result.url} download={`${source!.name.replace(/\.[^.]+$/,"")}-pronta.${result.ext}`}><Download size={18}/>{pt?"Baixar imagem":"Download image"}</a>:<button className="btn btn-primary studio-download" disabled>{pt?"Baixar imagem":"Download image"}</button>}
     {source&&<button className="studio-reset" onClick={reset}>{pt?"Limpar e começar de novo":"Clear and start again"}</button>}
    </div>
   </div>
   {error&&<p role="alert" className="studio-error">{error}</p>}
   <div className="studio-explainer"><div><h2>{pt?"Qual formato escolher?":"Which format should I use?"}</h2><p>{pt?"WebP costuma ser uma boa opção para sites. JPG tem ampla compatibilidade para fotografias. PNG preserva transparência no modo original, mas pode gerar um arquivo maior.":"WebP is often useful for websites. JPG is widely supported for photographs. PNG preserves transparency in original mode, but may produce a larger file."}</p></div><div><h2>{pt?"A foto fica com você":"Your photo stays with you"}</h2><p>{pt?"A ferramenta trabalha no seu navegador. Você não precisa criar uma conta e a imagem não é enviada para processamento. Ao sair, baixe o resultado se quiser guardá-lo.":"Processing happens in your browser. No account needed and no image is sent away for processing. Download the result before leaving if you want to keep it."}</p></div></div>
 </div>;
}
