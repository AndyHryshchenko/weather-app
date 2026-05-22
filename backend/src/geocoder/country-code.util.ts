import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const DEFAULT_COUNTRY_LOCALE = 'en';

export const normalizeCountryCode = (country?: string): string | undefined => {
  if (!country) {
    return undefined;
  }
  const trimmed = country.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }
  return countries.getAlpha2Code(trimmed, DEFAULT_COUNTRY_LOCALE) ?? trimmed;
};
