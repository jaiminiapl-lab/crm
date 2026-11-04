import { CurrencyCode, SUPPORTED_CURRENCIES } from '../constants/international';

export function formatInternationalCurrency(
  amountInInr: number,
  targetCurrency: CurrencyCode = 'INR',
  isMasked: boolean = false
): string {
  if (isMasked) {
    const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR;
    return `${config.symbol}••••••`;
  }

  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.INR;
  const convertedAmount = amountInInr / config.rateToBaseInr;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: convertedAmount > 1000 ? 0 : 2,
    }).format(convertedAmount);
  } catch {
    return `${config.symbol}${Math.round(convertedAmount).toLocaleString()}`;
  }
}

export function formatInternationalPhone(
  phone: string,
  isMasked: boolean = false
): string {
  if (!phone) return isMasked ? '••••••••••' : '-';
  const clean = phone.trim();

  if (isMasked) {
    if (clean.length < 8) return '••••••••';
    const prefix = clean.slice(0, 5);
    const suffix = clean.slice(-2);
    return `${prefix}*** ${suffix}`;
  }

  return clean;
}

export function formatLocalDateTime(
  dateString: string | Date,
  timezone: string = 'Asia/Kolkata',
  formatStyle: 'short' | 'medium' | 'timeOnly' = 'short'
): string {
  if (!dateString) return '-';
  const dateObj = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(dateObj.getTime())) return String(dateString);

  try {
    if (formatStyle === 'timeOnly') {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(dateObj);
    }

    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      hour: formatStyle === 'medium' ? '2-digit' : undefined,
      minute: formatStyle === 'medium' ? '2-digit' : undefined,
      hour12: true,
    }).format(dateObj);
  } catch {
    return dateObj.toLocaleDateString();
  }
}
