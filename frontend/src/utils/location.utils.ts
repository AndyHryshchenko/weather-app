import type { LocationQuery } from '@weather-app/types';

export const formatLocationQueryLabel = (query: LocationQuery): string => {
  const parts =
    query.zip && !query.city
      ? [query.zip, query.state, query.country]
      : [query.city, query.state, query.zip, query.country];
  return parts.filter(Boolean).join(', ');
};
