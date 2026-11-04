export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToBaseInr: number; // 1 unit of this currency = X INR
  flag: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToBaseInr: 83.25,
    flag: '🇺🇸',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToBaseInr: 90.4,
    flag: '🇪🇺',
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToBaseInr: 105.8,
    flag: '🇬🇧',
    locale: 'en-GB',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateToBaseInr: 1.0,
    flag: '🇮🇳',
    locale: 'en-IN',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    rateToBaseInr: 22.67,
    flag: '🇦🇪',
    locale: 'ar-AE',
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    rateToBaseInr: 61.9,
    flag: '🇸🇬',
    locale: 'en-SG',
  },
};

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  city: string;
}

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Kolkata', label: 'IST (India Standard Time)', offset: 'UTC+5:30', city: 'Mumbai / Delhi' },
  { value: 'UTC', label: 'UTC (Universal Coordinated Time)', offset: 'UTC+0:00', city: 'Global / London' },
  { value: 'America/New_York', label: 'EST (Eastern Standard Time)', offset: 'UTC-5:00', city: 'New York' },
  { value: 'Europe/London', label: 'GMT / BST (UK Time)', offset: 'UTC+1:00', city: 'London' },
  { value: 'Asia/Dubai', label: 'GST (Gulf Standard Time)', offset: 'UTC+4:00', city: 'Dubai' },
  { value: 'Asia/Singapore', label: 'SGT (Singapore Time)', offset: 'UTC+8:00', city: 'Singapore' },
];

export const INTERNATIONAL_CAMPUSES = [
  'All Campuses',
  'Mumbai Main Campus',
  'Bengaluru Tech Hub',
  'Delhi NCR Campus',
  'Pune Campus',
  'London Global Hub',
  'Dubai Academic City',
  'Singapore Tech Centre',
];
