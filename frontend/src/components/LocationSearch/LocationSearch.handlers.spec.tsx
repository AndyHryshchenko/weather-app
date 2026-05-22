import { describe, expect, it, vi } from 'vitest';
import * as GooglePlacesServiceModule from '@/services/GooglePlacesService';

describe('LocationSearch handlers', () => {
  it('resolves place location on selection', async () => {
    vi.spyOn(GooglePlacesServiceModule.GooglePlacesService, 'getPlaceLocation')
      .mockResolvedValue({
        query: { city: 'Charlotte', state: 'NC', country: 'US' },
        displayName: 'Charlotte, NC, US',
      });

    const { query } =
      await GooglePlacesServiceModule.GooglePlacesService.getPlaceLocation('place-id');
    expect(query.city).toBe('Charlotte');
  });
});
