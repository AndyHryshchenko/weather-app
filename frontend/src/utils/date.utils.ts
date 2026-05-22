const SECONDS_PER_DAY = 86400;

export interface HourlyDayRange {
  firstDayStart: number;
  lastDayStart: number;
}

export const getStartOfDay = (timestampSeconds: number): number => {
  const date = new Date(timestampSeconds * 1000);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

export const filterHourlyByDay = <T extends { dt: number }>(
  hourly: T[] | null | undefined,
  dayStart: number,
): T[] => {
  if (!Array.isArray(hourly)) {
    return [];
  }
  const dayEnd = dayStart + SECONDS_PER_DAY;
  return hourly.filter((hour) => hour.dt >= dayStart && hour.dt < dayEnd);
};

export const getHourlyDayRange = (
  hourly: { dt: number }[] | null | undefined,
): HourlyDayRange | null => {
  if (!Array.isArray(hourly) || hourly.length === 0) {
    return null;
  }

  let minDt = hourly[0].dt;
  let maxDt = hourly[0].dt;

  for (const entry of hourly) {
    if (entry.dt < minDt) {
      minDt = entry.dt;
    }
    if (entry.dt > maxDt) {
      maxDt = entry.dt;
    }
  }

  return {
    firstDayStart: getStartOfDay(minDt),
    lastDayStart: getStartOfDay(maxDt),
  };
};

export const isDayWithinHourlyRange = (
  dayStart: number,
  range: HourlyDayRange | null,
): boolean => {
  if (!range) {
    return false;
  }

  return dayStart >= range.firstDayStart && dayStart <= range.lastDayStart;
};

export const formatHour = (timestampSeconds: number): string =>
  new Date(timestampSeconds * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
  });
