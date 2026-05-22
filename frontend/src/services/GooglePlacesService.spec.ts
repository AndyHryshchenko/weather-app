import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockAutocomplete = vi.fn();
const mockGetDetails = vi.fn();

vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: vi.fn().mockImplementation(() => ({
    importLibrary: vi.fn().mockResolvedValue({}),
  })),
}));

describe('GooglePlacesService', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('google', {
      maps: {
        places: {
          AutocompleteService: vi.fn(() => ({
            getPlacePredictions: mockAutocomplete,
          })),
          PlacesService: vi.fn(() => ({
            getDetails: mockGetDetails,
          })),
          PlacesServiceStatus: { OK: 'OK' },
        },
      },
    });
    mockAutocomplete.mockReset();
    mockGetDetails.mockReset();
  });

  it('skips re-initialization when already loaded', async () => {
    const { GooglePlacesService } = await import('./GooglePlacesService');
    await GooglePlacesService.init();
    await GooglePlacesService.init();
    expect(GooglePlacesService['autocompleteService']).toBeTruthy();
  });

  it('returns empty predictions for blank input', async () => {
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const results = await GooglePlacesService.getPredictions('  ');
    expect(results).toEqual([]);
  });

  it('returns empty when autocomplete status is not OK', async () => {
    mockAutocomplete.mockImplementation((_req, cb) => cb(null, 'ZERO_RESULTS'));
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const results = await GooglePlacesService.getPredictions('Char');
    expect(results).toEqual([]);
  });

  it('maps place predictions using regions type for cities and postal codes', async () => {
    mockAutocomplete.mockImplementation((req, cb) => {
      expect(req.types).toEqual(['(regions)']);
      cb([{ place_id: 'abc', description: 'Charlotte, NC' }], 'OK');
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const results = await GooglePlacesService.getPredictions('Char');
    expect(results[0]?.placeId).toBe('abc');
  });

  it('prefers ISO country code from short_name', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          address_components: [
            { long_name: 'Mooresville', types: ['locality'] },
            { long_name: 'North Carolina', types: ['administrative_area_level_1'] },
            { long_name: 'United States', short_name: 'US', types: ['country'] },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query.country).toBe('US');
  });

  it('parses place location from address components', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          address_components: [
            { long_name: 'Charlotte', types: ['locality'] },
            { long_name: 'NC', types: ['administrative_area_level_1'] },
            { long_name: 'US', types: ['country'] },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query.city).toBe('Charlotte');
  });

  it('rejects when place details fail', async () => {
    mockGetDetails.mockImplementation((_req, cb) => cb(null, 'ERROR'));
    const { GooglePlacesService } = await import('./GooglePlacesService');
    await expect(GooglePlacesService.getPlaceLocation('abc')).rejects.toThrow(
      'Failed to resolve place details',
    );
  });

  it('parses postal code from address components', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          address_components: [
            { long_name: '28105', types: ['postal_code'] },
            { long_name: 'Indian Trail', types: ['locality'] },
            { long_name: 'NC', types: ['administrative_area_level_1'] },
            { long_name: 'US', types: ['country'] },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query.zip).toBe('28105');
    expect(query.city).toBe('Indian Trail');
  });

  it('uses administrative_area_level_1 as city when locality is missing (e.g. Seoul)', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          address_components: [
            { long_name: 'Seoul', types: ['administrative_area_level_1'] },
            { long_name: 'South Korea', short_name: 'KR', types: ['country'] },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query.city).toBe('Seoul');
    expect(query.state).toBeUndefined();
    expect(query.country).toBe('KR');
  });

  it('parses Seoul street addresses with metro as city and formatted_address as label', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          formatted_address: 'Seoulsup 2-gil, Seongdong-gu, Seoul, South Korea',
          address_components: [
            {
              long_name: 'Seoulsup 2-gil',
              short_name: 'Seoulsup 2-gil',
              types: ['political', 'sublocality', 'sublocality_level_4'],
            },
            {
              long_name: 'Seongdong-gu',
              short_name: 'Seongdong-gu',
              types: ['political', 'sublocality', 'sublocality_level_1'],
            },
            {
              long_name: 'Seoul',
              short_name: 'Seoul',
              types: ['administrative_area_level_1', 'political'],
            },
            {
              long_name: 'South Korea',
              short_name: 'KR',
              types: ['country', 'political'],
            },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query, displayName } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query).toEqual({
      city: 'Seoul',
      state: undefined,
      country: 'KR',
      zip: undefined,
    });
    expect(displayName).toBe('Seoulsup 2-gil, Seongdong-gu, Seoul, South Korea');
  });

  it('uses administrative area when locality is missing', async () => {
    mockGetDetails.mockImplementation((_req, cb) => {
      cb(
        {
          address_components: [
            { long_name: 'Mecklenburg', types: ['administrative_area_level_2'] },
            { long_name: 'US', types: ['country'] },
          ],
        },
        'OK',
      );
    });
    const { GooglePlacesService } = await import('./GooglePlacesService');
    const { query } = await GooglePlacesService.getPlaceLocation('abc');
    expect(query.city).toBe('Mecklenburg');
  });
});
