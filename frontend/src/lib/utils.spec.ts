import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    const includeHidden = false;
    expect(cn('px-2', 'py-1', includeHidden && 'hidden')).toContain('px-2');
  });
});
