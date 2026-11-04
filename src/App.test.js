import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// The old starter test looked for "learn react", which this site never had.
// This one checks the router: /lab opens the Lab page.

jest.mock('components/DotGrid', () => () => null);

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.scrollTo = jest.fn();
});

test('/lab opens the Lab page', () => {
  window.history.pushState({}, '', '/lab');
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'Lab' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
});
