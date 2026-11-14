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

test('/lab opens the Lab page', async () => {
  window.history.pushState({}, '', '/lab');
  render(<App />);
  expect(await screen.findByRole('heading', { level: 1, name: 'Lab' })).toBeInTheDocument();
});

test('every page has the site header: the mark goes home, and the menu button is there', async () => {
  window.history.pushState({}, '', '/lab');
  render(<App />);
  await screen.findByRole('heading', { level: 1, name: 'Lab' });
  expect(screen.getByRole('link', { name: 'motheo moleko, home' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('button', { name: 'Open the menu' })).toBeInTheDocument();
});
