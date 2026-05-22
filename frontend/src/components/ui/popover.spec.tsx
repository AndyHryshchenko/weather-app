import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

describe('Popover ui', () => {
  it('renders trigger and content', () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Panel content</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });
});
