import { describe, expect, it } from 'vitest';
import { APP_CONSTANTS, createAppConstants } from './app.constants';

describe('createAppConstants', () => {
  it('uses provided Vite environment variables', () => {
    expect(
      createAppConstants({
        VITE_API_BASE_URL: 'https://api.example.com',
        VITE_GOOGLE_MAPS_API_KEY: 'maps-key',
      }),
    ).toEqual({
      API_BASE_URL: 'https://api.example.com',
      GOOGLE_MAPS_API_KEY: 'maps-key',
      DEBOUNCE_MS: 300,
    });
  });

  it('falls back when Vite environment variables are unset', () => {
    expect(createAppConstants({})).toEqual({
      API_BASE_URL: 'http://localhost:3001',
      GOOGLE_MAPS_API_KEY: '',
      DEBOUNCE_MS: 300,
    });
  });
});

describe('APP_CONSTANTS', () => {
  it('is initialized from import.meta.env', () => {
    expect(APP_CONSTANTS.DEBOUNCE_MS).toBe(300);
    expect(APP_CONSTANTS.API_BASE_URL).toBeTruthy();
  });
});
