"use client";

import { useId, useState } from "react";
import { Check, Copy, MessageCircle, Link2, Timer, ArrowUpRight } from "lucide-react";
import { useLang } from "../lib/i18n";
import { campaignLink, savedTime, whatsappLink } from "../lib/growth-tools";
import { WHATSAPP } from "../lib/site";

function CopyResult({ value }: { value: string }) {
  const { lang } = useLang();
  const pt = lang === "pt";
  const [status, setStatus] = useState("");
  const id = useId();
  return <div className="growth-output">
    <label htmlFor={id}>{pt ? "Seu link está pronto" : "Your link is ready"}</label>
    <textarea id={id} readOnly value={value} rows={3} onFocus={(event) => event.target.select()} />
    <button className="btn btn-primary" type="button" onClick={async () => {
      try { await navigator.clipboard.writeText(value); setStatus(pt ? "Link copiado!" : "Link copied!"); }
      catch { setStatus(pt ? "Selecione o link acima e copie manualmente." : "Select the link above and copy it manually."); }
    }}><Copy size={17} />{pt ? "Copiar link" : "Copy link"}</button>
    <span role="status">{status}</span>
  </div>;
}

export function WhatsAppTool() {
  const { lang } = useLang(); const pt = lang === "pt"; const id = useId();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const link = whatsappLink(phone, message);
  return <div className="growth-tool">
    <div className="growth-tool-icon"><MessageCircle size={27} /></div>
    <h2>{pt ? "Uma conversa começa com um clique." : "One click starts a conversation."}</h2>
    <p>{pt ? "Crie o link do seu atendimento para colocar na bio, no site ou em uma campanha." : "Create a contact link for your bio, website or campaign."}</p>
    <div className="field"><label htmlFor={`${id}-phone`}>{pt ? "WhatsApp com código do país e DDD" : "WhatsApp number including country code"}</label>
      <input id={`${id}-phone`} type="tel" autoComplete="tel" placeholder="+55 11 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} aria-describedby={`${id}-hint`} aria-invalid={Boolean(phone && !link)} />
      <span className="field-hint" id={`${id}-hint`}>{pt ? "Inclua 55 para o Brasil. Conferimos o formato; não verificamos se o número tem WhatsApp." : "Include the country code. We check the format, not whether the number has WhatsApp."}</span>
    </div>
    <div className="field"><label htmlFor={`${id}-message`}>{pt ? "Mensagem pronta (opcional)" : "Prefilled message (optional)"}</label>
      <textarea id={`${id}-message`} rows={3} maxLength={2000} placeholder={pt ? "Olá! Conheci seu trabalho e gostaria de saber mais." : "Hi! I'd love to learn more about your work."} value={message} onChange={(e) => setMessage(e.target.value)} />
    </div>
    {phone && !link && <p role="status">{pt ? "Confira o número: use código do país, DDD e telefone, sem letras." : "Check the number: include country code and phone number, without letters."}</p>}
    {link ? <><CopyResult key={link} value={link} /><a className="personal-link" href={link} target="_blank" rel="noopener noreferrer">{pt ? "Testar no WhatsApp" : "Test in WhatsApp"}<ArrowUpRight size={17}/></a></> : <div className="growth-empty">{pt ? "Preencha o telefone para gerar seu link." : "Enter a phone number to generate your link."}</div>}
    <p className="field-hint">{pt ? "A mensagem só é enviada quando a pessoa confirma no WhatsApp. Os campos desta ferramenta são processados no seu navegador." : "The message is only sent when the person confirms in WhatsApp. These fields are processed in your browser."}</p>
  </div>;
}

export function CampaignTool() {
  const { lang } = useLang(); const pt = lang === "pt"; const id = useId();
  const [address, setAddress] = useState(""); const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("social"); const [campaign, setCampaign] = useState(""); const [content, setContent] = useState("");
  const link = campaignLink(address, source, medium, campaign, content);
  const presets = [["Instagram", "instagram", "social"], ["WhatsApp", "whatsapp", "messaging"], ["E-mail", "newsletter", "email"]];
  return <div className="growth-tool">
    <div className="growth-tool-icon"><Link2 size={27} /></div>
    <h2>{pt ? "Descubra de onde vem cada visita." : "Know where your visitors come from."}</h2>
    <p>{pt ? "Organize seus links com parâmetros UTM. Veja a origem das visitas na ferramenta de analytics instalada no seu site." : "Organize links with UTM parameters. Read visit sources in the analytics tool installed on your site."}</p>
    <div className="growth-presets" role="group" aria-label={pt ? "Modelos de canal" : "Channel presets"}>{presets.map(([label, s, m]) => <button type="button" key={s} aria-pressed={source === s && medium === m} onClick={() => {setSource(s); setMedium(m);}}>{label}</button>)}</div>
    <div className="field"><label htmlFor={`${id}-url`}>{pt ? "Endereço de destino" : "Destination URL"}</label><input id={`${id}-url`} type="url" placeholder="https://seusite.com.br/oferta" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
    <div className="field-row">
      <div className="field"><label htmlFor={`${id}-source`}>{pt ? "Origem (utm_source)" : "Source (utm_source)"}</label><input id={`${id}-source`} value={source} onChange={(e) => setSource(e.target.value)} /></div>
      <div className="field"><label htmlFor={`${id}-medium`}>{pt ? "Meio (utm_medium)" : "Medium (utm_medium)"}</label><input id={`${id}-medium`} value={medium} onChange={(e) => setMedium(e.target.value)} /></div>
    </div>
    <div className="field"><label htmlFor={`${id}-campaign`}>{pt ? "Nome da campanha" : "Campaign name"}</label><input id={`${id}-campaign`} placeholder="lancamento_setembro" value={campaign} onChange={(e) => setCampaign(e.target.value)} /></div>
    <div className="field"><label htmlFor={`${id}-content`}>{pt ? "Identificação do anúncio (opcional)" : "Ad identifier (optional)"}</label><input id={`${id}-content`} placeholder="video_01" value={content} onChange={(e) => setContent(e.target.value)} /></div>
    {link ? <CopyResult key={link} value={link} /> : <div className="growth-empty" role="status">{pt ? "Preencha um endereço com https://, a origem, o meio e o nome da campanha." : "Enter an https:// address, source, medium and campaign name."}</div>}
    <p className="field-hint">{pt ? "Os parâmetros existentes e as âncoras são preservados; UTMs preenchidas são substituídas. O link não instala analytics nem conta cliques por conta própria." : "Existing parameters and anchors are preserved; supplied UTMs are replaced. The link does not install analytics or count clicks on its own."}</p>
  </div>;
}

export function AutomationTool() {
  const { lang } = useLang(); const pt = lang === "pt"; const id = useId();
  const [minutes, setMinutes] = useState("10"); const [repetitions, setRepetitions] = useState("6"); const [days, setDays] = useState("22"); const [percent, setPercent] = useState("70");
  const result = [minutes, repetitions, days, percent].every((v) => v.trim() !== "") ? savedTime(Number(minutes), Number(repetitions), Number(days), Number(percent)) : null;
  const format = (n: number) => n.toLocaleString(pt ? "pt-BR" : "en-US", { maximumFractionDigits: 1 });
  const summary = result ? (pt ? `Olá, Rafael! Simulei uma tarefa de ${minutes} minutos, ${repetitions} vezes por dia e ${days} dias por mês. Com uma redução hipotética de ${percent}%, seriam ${format(result.saved)} horas liberadas por mês. Gostaria de avaliar essa automação.` : `Hi Rafael! I simulated a ${minutes}-minute task, ${repetitions} times a day, ${days} days a month. With a hypothetical ${percent}% reduction, I could free up ${format(result.saved)} hours per month. I'd like to discuss this automation.`) : "";
  return <div className="growth-tool">
    <div className="growth-tool-icon"><Timer size={27} /></div>
    <h2>{pt ? "Quanto tempo a rotina leva de você?" : "How much time does routine take?"}</h2>
    <p>{pt ? "Simule uma tarefa repetitiva e descubra o tempo que poderia ser liberado. Ajuste a redução esperada à sua realidade." : "Simulate a repetitive task and discover the time you could free up. Adjust the expected reduction to your situation."}</p>
    <div className="field-row">
      <div className="field"><label htmlFor={`${id}-minutes`}>{pt ? "Minutos por execução" : "Minutes per task"}</label><input id={`${id}-minutes`} type="number" min="0.1" step="any" value={minutes} onChange={(e) => setMinutes(e.target.value)}/></div>
      <div className="field"><label htmlFor={`${id}-times`}>{pt ? "Execuções por dia" : "Tasks per day"}</label><input id={`${id}-times`} type="number" min="1" step="1" value={repetitions} onChange={(e) => setRepetitions(e.target.value)}/></div>
    </div>
    <div className="field"><label htmlFor={`${id}-days`}>{pt ? "Dias de trabalho por mês" : "Working days per month"}</label><input id={`${id}-days`} type="number" min="1" max="31" value={days} onChange={(e) => setDays(e.target.value)}/></div>
    <div className="field"><label htmlFor={`${id}-percent`}>{pt ? "Redução estimada do tempo" : "Estimated time reduction"}: {percent}%</label><input id={`${id}-percent`} type="range" min="0" max="100" step="5" value={percent} onChange={(e) => setPercent(e.target.value)}/></div>
    <div aria-live="polite" aria-atomic="true">{result ? <div className="growth-metrics"><div><span>{pt ? "Tempo liberado / mês" : "Time freed / month"}</span><strong>{format(result.saved)} <small>h</small></strong></div><div><span>{pt ? "Hoje / mês" : "Today / month"}</span><b>{format(result.monthly)} h</b></div><div><span>{pt ? "Após automação / mês" : "After automation / month"}</span><b>{format(result.remaining)} h</b></div><div><span>{pt ? "Em 12 meses" : "Over 12 months"}</span><b>{format(result.yearly)} h</b></div></div> : <p>{pt ? "Use valores positivos e de 1 a 31 dias por mês." : "Use positive values and 1 to 31 days per month."}</p>}</div>
    <p className="field-hint">{pt ? "Estimativa, não promessa de resultado. Cálculo: minutos × execuções × dias ÷ 60 × redução. Não inclui implantação, manutenção ou revisão humana." : "An estimate, not a guaranteed outcome. Formula: minutes × tasks × days ÷ 60 × reduction. Excludes implementation, maintenance and human review."}</p>
    {result && <a className="btn btn-primary" href={`${WHATSAPP}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener noreferrer" data-analytics="contact_click"><Check size={17}/>{pt ? "Conversar sobre esta automação" : "Discuss this automation"}</a>}
  </div>;
}
