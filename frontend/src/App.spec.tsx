import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { renderWithProviders } from './test/test-utils';

describe('App', () => {
  it('renders weather page', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Weather')).toBeInTheDocument();
  });
});
