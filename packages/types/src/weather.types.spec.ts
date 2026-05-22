import { describe, expect, it } from 'vitest';
import {
  AsyncStatus,
  TemperatureUnit,
  WeatherIconCode
} from './weather.types';

describe('enums', () => {
  it('TemperatureUnit values', () => {
    expect(TemperatureUnit.METRIC).toBe('metric');
    expect(TemperatureUnit.IMPERIAL).toBe('imperial');
  });

  it('WeatherIconCode has expected entries', () => {
    expect(WeatherIconCode.CLEAR_DAY).toBe('CLEAR_DAY');
    expect(WeatherIconCode.UNKNOWN).toBe('UNKNOWN');
  });

  it('AsyncStatus lifecycle values', () => {
    expect(AsyncStatus.IDLE).toBe('idle');
    expect(AsyncStatus.LOADING).toBe('loading');
    expect(AsyncStatus.SUCCEEDED).toBe('succeeded');
    expect(AsyncStatus.FAILED).toBe('failed');
  });
});
