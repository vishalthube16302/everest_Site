/**
 * Normalises the messy price_range strings stored in Supabase.
 * Handles:
 *   "Price Range:- 80,000-1,00,000"  →  "₹80,000 – ₹1,00,000"
 *   "7800"                            →  "₹7,800"
 *   "0" | "" | null                   →  "Price on Request"
 *   "29200"                           →  "₹29,200"
 */
export function formatPrice(raw?: string | null): string {
  if (!raw) return 'Price on Request';

  const cleaned = raw
    .replace(/Price\s*Range\s*:?-?\s*/gi, '')
    .replace(/Price\s*:?-?\s*/gi, '')
    .replace(/₹/g, '')
    .trim();

  if (!cleaned || cleaned === '0') return 'Price on Request';

  // Plain integer  e.g. "7800"
  if (/^\d+$/.test(cleaned)) {
    return `₹${parseInt(cleaned, 10).toLocaleString('en-IN')}`;
  }

  // Range  e.g. "80,000-1,00,000"
  const rangeMatch = cleaned.match(/^([\d,]+)\s*[-–]\s*([\d,]+)$/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
    const hi = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
    return `₹${lo.toLocaleString('en-IN')} – ₹${hi.toLocaleString('en-IN')}`;
  }

  // Already formatted / other
  return cleaned.startsWith('₹') ? cleaned : `₹${cleaned}`;
}

/** Truncates a string to n characters, adding ellipsis. */
export function truncate(str: string, n: number): string {
  if (!str) return '';
  return str.length <= n ? str : str.slice(0, n).trimEnd() + '…';
}
