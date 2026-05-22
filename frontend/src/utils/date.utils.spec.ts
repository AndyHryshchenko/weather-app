import { describe, expect, it } from 'vitest';
import {
  filterHourlyByDay,
  formatHour,
  getHourlyDayRange,
  getStartOfDay,
  isDayWithinHourlyRange,
} from './date.utils';

describe('date utils', () => {
  it('getStartOfDay returns midnight unix timestamp', () => {
    const noon = new Date('2026-05-22T12:00:00').getTime() / 1000;
    const start = getStartOfDay(noon);
    const date = new Date(start * 1000);
    expect(date.getHours()).toBe(0);
  });

  it('getHourlyDayRange returns null when hourly is empty or missing', () => {
    expect(getHourlyDayRange(null)).toBeNull();
    expect(getHourlyDayRange(undefined)).toBeNull();
    expect(getHourlyDayRange([])).toBeNull();
  });

  it('getHourlyDayRange updates min and max from out-of-order hours', () => {
    const dayStart = getStartOfDay(1700000000);
    const range = getHourlyDayRange([
      { dt: dayStart + 90_000 },
      { dt: dayStart + 3_600 },
    ]);

    expect(range).toEqual({
      firstDayStart: dayStart,
      lastDayStart: dayStart + 86_400,
    });
  });

  it('getHourlyDayRange spans from first to last hour calendar day', () => {
    const dayStart = getStartOfDay(1700000000);
    const range = getHourlyDayRange([
      { dt: dayStart + 3600 },
      { dt: dayStart + 86_400 + 7200 },
    ]);

    expect(range).toEqual({
      firstDayStart: dayStart,
      lastDayStart: dayStart + 86_400,
    });
    expect(isDayWithinHourlyRange(dayStart, range)).toBe(true);
    expect(isDayWithinHourlyRange(dayStart + 86_400, range)).toBe(true);
    expect(isDayWithinHourlyRange(dayStart + 172_800, range)).toBe(false);
    expect(isDayWithinHourlyRange(dayStart - 86_400, range)).toBe(false);
    expect(isDayWithinHourlyRange(dayStart, null)).toBe(false);
  });

  it('returns empty list when hourly input is not an array', () => {
    expect(filterHourlyByDay(null, 1700000000)).toEqual([]);
    expect(filterHourlyByDay(undefined, 1700000000)).toEqual([]);
  });

  it('filterHourlyByDay filters hours within day range', () => {
    const dayStart = getStartOfDay(1700000000);
    const hourly = [
      { dt: dayStart - 1 },
      { dt: dayStart },
      { dt: dayStart + 3600 },
      { dt: dayStart + 90000 },
    ];
    expect(filterHourlyByDay(hourly, dayStart)).toEqual([
      { dt: dayStart },
      { dt: dayStart + 3600 },
    ]);
  });

  it('formatHour returns localized hour string', () => {
    expect(formatHour(1700000000)).toBeTruthy();
  });
});
