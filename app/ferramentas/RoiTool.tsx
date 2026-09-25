"use client";

import { useId, useMemo, useState } from "react";
import { TrendingUp, ArrowUpRight, Target } from "lucide-react";
import { useLang } from "../lib/i18n";
import { calcRoiDigital } from "../lib/roi-digital";
import { WHATSAPP } from "../lib/site";

const copy = {
  pt: {
    title: "Quanto a sua empresa está deixando na mesa?",
    lead: "Simule o impacto de melhorar sua presença digital com os números reais do seu negócio.",
    revenue: "Faturamento mensal atual (R$)",
    ticket: "Ticket médio por venda (R$)",
    leads: "Leads que você recebe por mês",
    closeRate: "Taxa de fechamento (%)",
    digitalShare: "% dos seus leads que vem do digital hoje",
    digitalUplift: "Melhoria esperada no digital (%)",
    upliftHint: "Aumento realista de leads digitais com presença melhor. 30% é conservador.",
    digitalShareHint: "Google, redes sociais, WhatsApp de campanha. Exclua indicações e clientes recorrentes.",
    resultTitle: "Oportunidade estimada",
    chartTitle: "Receita digital: hoje vs. com melhoria",
    barCurrent: "Hoje",
    barAfter: "Com melhoria",
    currentDigital: "Receita digital atual / mês",
    additionalMonthly: "Potencial adicional / mês",
    additionalYearly: "Potencial adicional / ano",
    additionalLeads: "Leads novos / mês",
    breakEven: "Retorno do investimento em",
    breakEvenMonths: "meses",
    breakEvenNote: "Referência: investimento de R$ 6.000 em site/presença digital.",
    ctaBtn: "Conversar sobre isso no WhatsApp",
    disclaimer: "Estimativa baseada nos dados informados. Não é garantia de resultado.",
    emptyState: "Preencha os campos acima para ver o potencial.",
    infinity: "< 1",
  },
  en: {
    title: "How much revenue is your business missing?",
    lead: "Simulate the impact of improving your digital presence using your real business numbers.",
    revenue: "Current monthly revenue (R$)",
    ticket: "Average ticket per sale (R$)",
    leads: "Leads you receive per month",
    closeRate: "Close rate (%)",
    digitalShare: "% of your leads that come from digital today",
    digitalUplift: "Expected improvement in digital leads (%)",
    upliftHint: "A realistic increase in digital leads with a better presence. 30% is conservative.",
    digitalShareHint: "Google, social media, campaign WhatsApp. Exclude referrals and returning customers.",
    resultTitle: "Estimated opportunity",
    chartTitle: "Digital revenue: today vs. with improvement",
    barCurrent: "Today",
    barAfter: "With improvement",
    currentDigital: "Current digital revenue / month",
    additionalMonthly: "Potential gain / month",
    additionalYearly: "Potential gain / year",
    additionalLeads: "New leads / month",
    breakEven: "Return on investment in",
    breakEvenMonths: "months",
    breakEvenNote: "Reference: R$ 6,000 investment in website / digital presence.",
    ctaBtn: "Talk about this on WhatsApp",
    disclaimer: "Estimate based on the data you entered. Not a guarantee of results.",
    emptyState: "Fill in the fields above to see the potential.",
    infinity: "< 1",
  },
} as const;

function money(n: number, lang: "pt" | "en") {
  return n.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`roi-metric${highlight ? " roi-metric--highlight" : ""}`}>
      <span className="roi-metric-label">{label}</span>
      <strong className="roi-metric-value">{value}</strong>
    </div>
  );
}

/** Pure SVG bar chart — zero dependencies */
function BarChart({
  current,
  after,
  labelCurrent,
  labelAfter,
  lang,
}: {
  current: number;
  after: number;
  labelCurrent: string;
  labelAfter: string;
  lang: "pt" | "en";
}) {
  const max = Math.max(current, after, 1);
  const W = 340;
  const barH = 36;
  const gap = 16;
  const labelW = 90;
  const chartW = W - labelW - 12;
  const totalH = (barH + gap) * 2 + 24;

  const bars = [
    { label: labelCurrent, value: current, color: "#6d28d9", opacity: 0.5 },
    { label: labelAfter, value: after, color: "#10b981", opacity: 1 },
  ];

  return (
    <div className="roi-chart-wrap" role="img" aria-label={`${labelCurrent}: ${money(current, lang)} — ${labelAfter}: ${money(after, lang)}`}>
      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        width="100%"
        style={{ maxWidth: W, display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        {bars.map((bar, i) => {
          const y = i * (barH + gap) + 20;
          const barWidth = max > 0 ? (bar.value / max) * chartW : 0;
          return (
            <g key={bar.label}>
              {/* label */}
              <text
                x={0}
                y={y + barH / 2 + 5}
                fontSize={12}
                fontFamily="Outfit, sans-serif"
                fontWeight={600}
                fill="currentColor"
                opacity={0.6}
              >
                {bar.label}
              </text>
              {/* track */}
              <rect
                x={labelW}
                y={y}
                width={chartW}
                height={barH}
                rx={8}
                fill="currentColor"
                opacity={0.07}
              />
              {/* bar */}
              <rect
                x={labelW}
                y={y}
                width={barWidth}
                height={barH}
                rx={8}
                fill={bar.color}
                opacity={bar.opacity}
                style={{
                  transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
              {/* value label */}
              {barWidth > 40 && (
                <text
                  x={labelW + barWidth - 10}
                  y={y + barH / 2 + 5}
                  fontSize={12}
                  fontFamily="Outfit, sans-serif"
                  fontWeight={700}
                  fill="#fff"
                  textAnchor="end"
                >
                  {money(bar.value, lang)}
                </text>
              )}
              {barWidth <= 40 && bar.value > 0 && (
                <text
                  x={labelW + barWidth + 8}
                  y={y + barH / 2 + 5}
                  fontSize={12}
                  fontFamily="Outfit, sans-serif"
                  fontWeight={700}
                  fill="currentColor"
                  opacity={0.7}
                >
                  {money(bar.value, lang)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function RoiTool() {
  const { lang } = useLang();
  const c = copy[lang];
  const id = useId();

  const [v, setV] = useState({
    monthlyRevenue: "25000",
    avgTicket: "800",
    monthlyLeads: "40",
    closeRate: "25",
    digitalShare: "35",
    digitalUplift: "30",
  });

  const set =
    (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setV((s) => ({ ...s, [k]: e.target.value }));

  const num = (k: keyof typeof v) =>
    parseFloat(v[k].replace(",", ".")) || 0;

  const result = useMemo(
    () =>
      calcRoiDigital({
        monthlyRevenue: num("monthlyRevenue"),
        avgTicket: num("avgTicket"),
        monthlyLeads: num("monthlyLeads"),
        closeRate: num("closeRate"),
        digitalShare: num("digitalShare"),
        digitalUplift: num("digitalUplift"),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [v]
  );

  const summary = result
    ? lang === "pt"
      ? `Olá, Rafael! Simulei o ROI de presença digital com ticket médio de R$ ${num("avgTicket").toLocaleString("pt-BR")}, ${num("monthlyLeads")} leads/mês e ${num("digitalShare")}% de origem digital. O potencial adicional estimado é de R$ ${result.additionalMonthly.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} por mês. Gostaria de conversar sobre isso.`
      : `Hi Rafael! I ran the digital presence ROI simulation with an average ticket of R$ ${num("avgTicket").toLocaleString("en-US")}, ${num("monthlyLeads")} leads/month and ${num("digitalShare")}% digital share. The estimated additional potential is R$ ${result.additionalMonthly.toLocaleString("en-US", { maximumFractionDigits: 0 })} per month. I'd love to talk about it.`
    : "";

  const fields: [keyof typeof v, string, string?][] = [
    ["monthlyRevenue", c.revenue],
    ["avgTicket", c.ticket],
    ["monthlyLeads", c.leads],
    ["closeRate", c.closeRate],
    ["digitalShare", c.digitalShare, c.digitalShareHint],
    ["digitalUplift", c.digitalUplift, c.upliftHint],
  ];

  return (
    <div className="growth-tool">
      <div className="growth-tool-icon">
        <TrendingUp size={27} />
      </div>
      <h2>{c.title}</h2>
      <p>{c.lead}</p>

      <div className="field-row">
        {fields.map(([k, label, hint]) => (
          <div className="field" key={k}>
            <label htmlFor={`${id}-${k}`}>{label}</label>
            <input
              id={`${id}-${k}`}
              inputMode="decimal"
              value={v[k]}
              onChange={set(k)}
              autoComplete="off"
            />
            {hint && <span className="field-hint">{hint}</span>}
          </div>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {result ? (
          <div className="roi-results">
            <div className="roi-section-label">{c.resultTitle}</div>

            {/* ── Gráfico SVG ── */}
            <div className="roi-chart-section">
              <div className="roi-chart-title">{c.chartTitle}</div>
              <BarChart
                current={result.currentDigitalRevenue}
                after={result.currentDigitalRevenue + result.additionalMonthly}
                labelCurrent={c.barCurrent}
                labelAfter={c.barAfter}
                lang={lang}
              />
            </div>

            {/* ── Métricas ── */}
            <div className="roi-grid">
              <Metric label={c.currentDigital} value={money(result.currentDigitalRevenue, lang)} />
              <Metric label={c.additionalLeads} value={`+${Math.round(result.additionalLeads)}`} />
              <Metric label={c.additionalMonthly} value={money(result.additionalMonthly, lang)} highlight />
              <Metric label={c.additionalYearly} value={money(result.additionalYearly, lang)} highlight />
            </div>

            {/* ── Break-even ── */}
            <div className="roi-breakeven">
              <span>
                {c.breakEven}{" "}
                <strong>
                  {result.breakEvenMonths >= 999 ? c.infinity : result.breakEvenMonths}{" "}
                  {c.breakEvenMonths}
                </strong>
              </span>
              <span className="field-hint" style={{ marginTop: 4, display: "block" }}>
                {c.breakEvenNote}
              </span>
            </div>

            <a
              className="btn btn-primary"
              href={`${WHATSAPP}?text=${encodeURIComponent(summary)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="contact_click"
              style={{ marginTop: 18 }}
            >
              <Target size={17} /> {c.ctaBtn} <ArrowUpRight size={16} />
            </a>
          </div>
        ) : (
          <div className="growth-empty">{c.emptyState}</div>
        )}
      </div>

      <p className="field-hint" style={{ marginTop: 12 }}>
        {c.disclaimer}
      </p>
    </div>
  );
}
