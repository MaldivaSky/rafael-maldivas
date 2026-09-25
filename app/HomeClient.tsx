"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Film, Layers, Sparkles } from "lucide-react";
import { useLang, localePath } from "./lib/i18n";
import { WHATSAPP } from "./lib/site";
import CaseHighlights from "./components/CaseHighlights";
import BriefingForm from "./components/BriefingForm";
import ProjectPlanner from "./components/ProjectPlanner";
import GrowthToolsInvite from "./components/GrowthToolsInvite";

export default function HomeClient() {
  const { lang } = useLang();
  const pt = lang === "pt";
  const services = pt ? [
    ["software", "Organizar para crescer.", "Sistemas e automações que tiram o retrabalho da rotina."],
    ["marketing", "Aparecer do jeito certo.", "Sites e presença digital com identidade e um caminho claro até você."],
    ["audiovisual", "Mostrar outro ponto de vista.", "Drone, vídeo e conteúdo para dar vida à sua marca."],
  ] : [
    ["software", "Make room to grow.", "Systems and automation that take repetitive work off your plate."],
    ["marketing", "Show up with purpose.", "Websites and a digital presence with personality and a clear way to reach you."],
    ["audiovisual", "Offer a fresh perspective.", "Drone footage, video and content that bring your brand to life."],
  ];
  const icons = [Code2, Layers, Film];
  return (
    <div className="studio-home">
      <header className="studio-hero" id="top"><div className="wrap">
        <div className="studio-hero-grid">
          <div className="studio-hero-copy">
            <div className="studio-kicker"><span />{pt ? "TECNOLOGIA COM CABEÇA. CRIAÇÃO COM ALMA." : "THOUGHTFUL TECHNOLOGY. SOULFUL CREATION."}</div>
            <h1>{pt ? "Boas ideias" : "Good ideas"}<br />{pt ? "merecem" : "deserve"}<br /><em>{pt ? "ganhar vida." : "to come alive."}</em><Sparkles aria-hidden="true" /></h1>
            <p>{pt ? "Sou Rafael. Conecto tecnologia, negócio e criatividade para transformar o que você imagina em algo que funciona de verdade." : "I’m Rafael. I connect technology, business and creativity to turn what you imagine into something that really works."}</p>
            <div className="studio-actions"><a href="#diagnostico" className="btn studio-primary">{pt ? "Descobrir meu próximo passo" : "Find my next step"}<ArrowUpRight size={18} /></a><a href="#produtos" className="studio-text-link">{pt ? "Conheça meu trabalho" : "Explore my work"}<ArrowDown size={16} /></a></div>
            <div className="studio-hero-note"><span className="studio-avatars">RM</span><span>{pt ? "Da primeira conversa à entrega." : "From the first conversation to delivery."}<strong>{pt ? "Você fala com quem faz." : "You talk to the person who builds it."}</strong></span></div>
          </div>
          <div className="studio-portrait-composition"><div className="studio-orbit" aria-hidden="true" /><figure className="studio-portrait"><Image src="/media/rafael-drone.jpg" alt={pt ? "Rafael Maldivas pilotando um drone em campo" : "Rafael Maldivas flying a drone in the field"} fill priority sizes="(max-width: 800px) 90vw, 45vw" quality={85} /><span className="studio-photo-label">SÃO PAULO · {pt ? "PARA O MUNDO" : "TO THE WORLD"}</span><figcaption><span>{pt ? "Prazer, eu sou o" : "Hi, I’m"}</span><strong>Rafael Maldivas<span>.</span></strong><small>{pt ? "Engenharia, criatividade e pé no chão." : "Engineering, creativity and a grounded approach."}</small></figcaption></figure><div className="studio-float"><span><Code2 size={22} /></span><div>{pt ? "Da ideia à operação" : "From idea to operation"}<small>{pt ? "Software · Estratégia · Audiovisual" : "Software · Strategy · Video"}</small></div><ArrowUpRight size={18} /></div><span className="studio-handnote" aria-hidden="true">{pt ? "Vamos fazer acontecer ↗" : "Let’s make it happen ↗"}</span></div>
        </div>
        <div className="studio-service-row">{services.map(([id,title,desc],i) => { const Icon = icons[i]; return <Link href={localePath(`/servicos#${id}`,lang)} key={id} data-analytics="service_click"><span className={`studio-service-icon tone-${i}`}><Icon size={23} /></span><div><h2>{title}</h2><p>{desc}</p></div><ArrowUpRight size={19} /></Link>; })}</div>
      </div></header>
      <section id="produtos" className="studio-selected"><div className="wrap"><div className="studio-section-heading"><div><div className="studio-kicker">01 / {pt ? "IDEIAS EM MOVIMENTO" : "IDEAS IN MOTION"}</div><h2>{pt ? "É na prática que" : "The work"}<br /><span>{pt ? "a ideia se prova." : "speaks for itself."}</span></h2></div><Link className="studio-text-link" href={localePath("/portfolio",lang)} data-analytics="portfolio_click">{pt ? "Explorar portfólio" : "Explore portfolio"}<ArrowUpRight size={18} /></Link></div>
        <div className="studio-projects"><Link href={localePath("/produtos/miseon",lang)} className="studio-project project-miseon" data-analytics="portfolio_click"><div className="studio-project-top"><span>01 / FOOD SERVICE</span><ArrowUpRight /></div><div className="studio-product-visual"><Image src="/logo-horiz-miseon.png" alt="MiseOn" width={310} height={120} style={{objectFit:"contain"}} /><div className="studio-operation"><span><Check size={14} />{pt ? "Pedidos" : "Orders"}</span><span><Check size={14} />{pt ? "Estoque" : "Inventory"}</span><span><Check size={14} />{pt ? "Gestão" : "Management"}</span></div></div><div className="studio-project-bottom"><span className="studio-pill">{pt ? "Produto próprio · Em operação" : "Own product · Live"}</span><h3>{pt ? "Mais controle na cozinha." : "More control in the kitchen."}</h3><p>{pt ? "Pedidos, estoque e delivery conectados em um sistema feito para restaurantes." : "Orders, inventory and delivery connected in a system built for restaurants."}</p></div></Link>
        <Link href={localePath("/portfolio#audiovisual",lang)} className="studio-project project-video" data-analytics="portfolio_click"><Image src="/media/cidade-anoitecer.jpg" alt={pt ? "Vista aérea da cidade ao anoitecer, por Rafael Maldivas" : "Aerial city view at dusk by Rafael Maldivas"} fill sizes="(max-width: 800px) 95vw, 48vw" /><div className="studio-project-top"><span>02 / {pt ? "UM NOVO OLHAR" : "A FRESH PERSPECTIVE"}</span><ArrowUpRight /></div><div className="studio-project-bottom"><span className="studio-pill">{pt ? "Drone · Vídeo · Conteúdo" : "Drone · Video · Content"}</span><h3>{pt ? "Sua marca vista de outro jeito." : "See your brand in a new light."}</h3><p>{pt ? "Da captação aérea à edição. Imagens que apresentam lugares, histórias e negócios." : "From aerial capture to editing. Images that introduce places, stories and businesses."}</p></div></Link></div>
      </div></section>
      <ProjectPlanner />
      <section className="growth-home"><div className="wrap"><GrowthToolsInvite /></div></section>
      <CaseHighlights />
      <section className="studio-tools" id="ferramentas"><div className="wrap"><div className="studio-section-heading"><div><div className="studio-kicker">{pt ? "EXPERIMENTE. É POR MINHA CONTA." : "TRY IT. IT’S ON ME."}</div><h2>{pt ? "Uma mão na roda." : "A little helping hand."}</h2><p>{pt ? "Ferramentas úteis, sem cadastro. Um pouco do meu trabalho, já ajudando no seu." : "Useful tools, no signup. A little of my work, already helping yours."}</p></div><Link className="studio-text-link" href={localePath("/ferramentas",lang)}>{pt ? "Ver todas" : "See all"}<ArrowUpRight size={18} /></Link></div><div className="studio-tool-grid">{[
        ["plano-digital", "01", pt ? "Planejador digital" : "Digital planner", pt ? "Encontre uma prioridade e saia com um plano de ação." : "Find a priority and leave with an action plan."],
        ["plano-digital#simulador", "02", pt ? "Simulador de tempo" : "Time simulator", pt ? "Descubra quanto da rotina poderia ser automatizado." : "Explore how much of your routine could be automated."],
        ["estudio-de-imagem", "03", pt ? "Estúdio de imagem" : "Image studio", pt ? "Remova fundos e prepare fotos para a sua vitrine." : "Remove backgrounds and prepare photos for your storefront."],
      ].map(([slug,n,title,desc])=><Link key={slug} href={localePath(`/ferramentas/${slug}`,lang)} data-analytics="tool_click"><span>{n}<ArrowUpRight size={20} /></span><h3>{title}</h3><p>{desc}</p><small>{pt ? "Abrir ferramenta" : "Open tool"}<ArrowRight size={15} /></small></Link>)}</div></div></section>
      <section className="studio-method" id="metodo"><div className="wrap"><div className="studio-section-heading"><div><div className="studio-kicker">{pt ? "CRIATIVIDADE NO COMEÇO. CUIDADO ATÉ O FIM." : "CREATIVE FROM THE START. CAREFUL TO THE FINISH."}</div><h2>{pt ? "Trabalho bom tem conversa." : "Good work starts with a conversation."}</h2></div></div><div className="studio-method-grid">{(pt ? [["Escutar de verdade", "Entendo sua rotina, o problema e o que precisa mudar."],["Combinar o caminho", "Escopo, prioridades e etapas claros antes de começar."],["Construir junto", "Você acompanha, experimenta e participa dos ajustes."],["Entregar com cuidado", "Validação, orientação de uso e próximos passos combinados."]] : [["Really listen", "I learn about your routine, the problem and what needs to change."],["Agree on the path", "Clear scope, priorities and milestones before we start."],["Build together", "You follow along, try things and help shape the adjustments."],["Deliver with care", "Validation, guidance and agreed next steps."]]).map(([title,desc],i)=><div key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
      <BriefingForm />
      <section id="contato" className="studio-contact"><div className="wrap"><div className="studio-kicker">{pt ? "O PRÓXIMO PROJETO PODE SER O SEU." : "THE NEXT PROJECT COULD BE YOURS."}</div><h2>{pt ? "Vamos fazer" : "Let’s make"}<br /><em>{pt ? "acontecer?" : "it happen."}</em></h2><p>{pt ? "Me conte a ideia. A gente encontra o caminho." : "Tell me your idea. We’ll find the way forward."}</p><a className="btn studio-primary" href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-analytics="contact_click">{pt ? "Conversar com o Rafael" : "Talk to Rafael"}<ArrowUpRight size={20} /></a><span className="studio-contact-sign">Rafael Maldivas / Maldivas Tech</span></div></section>
    </div>
  );
}
