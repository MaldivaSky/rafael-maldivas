/** Pure, browser-only helpers. Form values are never sent to an API. */
export function whatsappLink(phone: string, message: string): string | null {
  if (!/^[+\d\s().-]+$/.test(phone)) return null;
  const digits = phone.replace(/\D/g, "");
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
}

export function campaignLink(address: string, source: string, medium: string, campaign: string, content: string): string | null {
  if (![address, source, medium, campaign].every((value) => value.trim())) return null;
  try {
    const url = new URL(address.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    for (const [key, value] of Object.entries({ utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content })) {
      if (value.trim()) url.searchParams.set(key, value.trim());
      else url.searchParams.delete(key);
    }
    return url.toString();
  } catch { return null; }
}

export function savedTime(minutes: number, repetitions: number, days: number, percent: number) {
  if (![minutes, repetitions, days, percent].every(Number.isFinite) || minutes <= 0 || repetitions <= 0 || days <= 0 || days > 31 || percent < 0 || percent > 100) return null;
  const monthly = minutes * repetitions * days / 60;
  const saved = monthly * percent / 100;
  if (!Number.isFinite(monthly)) return null;
  return { monthly, saved, remaining: monthly - saved, yearly: saved * 12 };
}
