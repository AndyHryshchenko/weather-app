import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TruncatedText } from './truncated-text';

describe('TruncatedText', () => {
  it('renders truncated text with full value in tooltip content', () => {
    render(
      <TooltipProvider>
        <TruncatedText text="Overcast Clouds" />
      </TooltipProvider>,
    );
    expect(screen.getByText('Overcast Clouds')).toBeInTheDocument();
  });
});
