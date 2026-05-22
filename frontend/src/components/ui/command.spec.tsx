import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Command, CommandEmpty, CommandItem, CommandList } from './command';

describe('Command ui', () => {
  it('renders command primitives', () => {
    render(
      <Command label="Search">
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandItem value="charlotte">Charlotte</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(screen.getByText('Charlotte')).toBeInTheDocument();
  });
});
