/** Pure, browser-only helpers. No data is sent to any server. */

export interface RoiInputs {
  /** Monthly revenue in BRL */
  monthlyRevenue: number;
  /** Average ticket per sale in BRL */
  avgTicket: number;
  /** Current monthly leads */
  monthlyLeads: number;
  /** Current close rate (0–100) */
  closeRate: number;
  /** % of leads that come from digital channels today (0–100) */
  digitalShare: number;
  /** Estimated improvement in digital leads after optimization (0–100) */
  digitalUplift: number;
}

export interface RoiResult {
  /** Current monthly revenue from digital */
  currentDigitalRevenue: number;
  /** Additional monthly revenue after optimization */
  additionalMonthly: number;
  /** Additional yearly revenue */
  additionalYearly: number;
  /** Current monthly digital leads */
  currentDigitalLeads: number;
  /** Additional digital leads per month after optimization */
  additionalLeads: number;
  /** Cost of opportunity per month (what they're leaving on the table) */
  opportunityCost: number;
  /** Estimated ROI in months to break even at a R$6k site investment */
  breakEvenMonths: number;
}

/** Returns null if inputs are invalid. */
export function calcRoiDigital(inputs: RoiInputs): RoiResult | null {
  const { monthlyRevenue, avgTicket, monthlyLeads, closeRate, digitalShare, digitalUplift } = inputs;
  if (
    !([monthlyRevenue, avgTicket, monthlyLeads, closeRate, digitalShare, digitalUplift].every(Number.isFinite)) ||
    monthlyRevenue <= 0 || avgTicket <= 0 || monthlyLeads <= 0 ||
    closeRate < 0 || closeRate > 100 ||
    digitalShare < 0 || digitalShare > 100 ||
    digitalUplift < 0 || digitalUplift > 100
  ) return null;

  const digitalLeads = monthlyLeads * (digitalShare / 100);
  const closedDeals = digitalLeads * (closeRate / 100);
  const currentDigitalRevenue = closedDeals * avgTicket;

  const additionalLeads = digitalLeads * (digitalUplift / 100);
  const additionalClosedDeals = additionalLeads * (closeRate / 100);
  const additionalMonthly = additionalClosedDeals * avgTicket;
  const additionalYearly = additionalMonthly * 12;

  const opportunityCost = additionalMonthly;
  const REF_INVESTMENT = 6000;
  const breakEvenMonths = additionalMonthly > 0 ? REF_INVESTMENT / additionalMonthly : Infinity;

  return {
    currentDigitalRevenue,
    additionalMonthly,
    additionalYearly,
    currentDigitalLeads: digitalLeads,
    additionalLeads,
    opportunityCost,
    breakEvenMonths: Math.ceil(breakEvenMonths),
  };
}
