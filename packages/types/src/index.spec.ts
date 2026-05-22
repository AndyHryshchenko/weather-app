import { describe, expect, it } from 'vitest';
import {
  AsyncStatus,
  LocationSource,
  TemperatureUnit,
  WeatherIconCode,
} from './index';

describe('index exports', () => {
  it('re-exports shared enums', () => {
    expect(TemperatureUnit.METRIC).toBe('metric');
    expect(LocationSource.GPS).toBe('GPS');
    expect(WeatherIconCode.RAIN).toBe('RAIN');
    expect(AsyncStatus.IDLE).toBe('idle');
  });
});
