import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import PricingStops from './PricingStops';
import { FREELANCE } from './copy';

const { stops, includes, includesLabel, note } = FREELANCE.pricing;
const setup = () =>
  render(<PricingStops stops={stops} includes={includes} includesLabel={includesLabel} note={note} />);
const ticked = () => within(screen.getByRole('list', { name: includesLabel })).getAllByRole('listitem');
const tickedAt = (stop) => includes.filter(({ from }) => from <= stop).length;
const money = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-CA')}` : n);

beforeEach(() => {
  // Reduced motion: the price goes straight to its new value.
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
});

test('starts at the first stop', () => {
  setup();
  const slider = screen.getByRole('slider', { name: 'What you need' });
  expect(slider).toHaveValue('0');
  expect(slider).toHaveAttribute('aria-valuetext', expect.stringContaining(money(stops[0].price)));
  expect(screen.getByText(money(stops[0].price))).toBeInTheDocument();
  expect(ticked()).toHaveLength(tickedAt(0));
});

test('the last stop ticks everything and shows its monthly price', () => {
  setup();
  const last = stops.length - 1;
  fireEvent.change(screen.getByRole('slider'), { target: { value: String(last) } });
  expect(screen.getByText(money(stops[last].price))).toBeInTheDocument();
  expect(screen.getByText(stops[last].per)).toBeInTheDocument();
  // Every description is there (they share a spot, so the height stays put);
  // only the current one is shown.
  expect(screen.getByText(stops[last].blurb)).toHaveClass('shown');
  expect(screen.getByText(stops[0].blurb)).not.toHaveClass('shown');
  expect(ticked()).toHaveLength(includes.length);
});

test('clicking a label jumps to it; a word price shows as it is', () => {
  setup();
  const i = stops.findIndex(({ price }) => typeof price === 'string');
  fireEvent.click(screen.getByText(stops[i].label));
  expect(screen.getByRole('slider')).toHaveValue(String(i));
  expect(screen.getByText(stops[i].price)).toBeInTheDocument();
  expect(screen.getByText(stops[i].per)).toBeInTheDocument();
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', expect.stringContaining('quoted per project'));
  expect(ticked()).toHaveLength(tickedAt(i));
});
