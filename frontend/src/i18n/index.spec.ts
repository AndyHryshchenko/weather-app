import { describe, expect, it } from 'vitest';
import i18n from './index';

describe('i18n', () => {
  it('initializes with english translations', () => {
    expect(i18n.t('app.title')).toBe('Weather');
  });
});
