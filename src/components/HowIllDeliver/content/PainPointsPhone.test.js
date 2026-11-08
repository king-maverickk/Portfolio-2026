import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import PainPointsPhone from './PainPointsPhone';
import { FREELANCE } from './copy';

const { items } = FREELANCE.painPoints;
const FIRST_MS = 600;
const EVERY_MS = 2400;

const shown = () => document.querySelectorAll('article[tabindex="0"]');
const all = () => document.querySelectorAll('article');
const wait = (ms) => act(() => jest.advanceTimersByTime(ms));
// Lets n notifications arrive. One step per notification, so React can
// schedule the next one in between.
const arrive = (n) => {
  for (let i = 0; i < n; i += 1) wait(i === 0 ? FIRST_MS : EVERY_MS);
  wait(50); // the newest one drops in over the next couple of frames
};

beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  jest.useRealTimers();
});

test('notifications arrive one at a time, newest on top', () => {
  render(<PainPointsPhone items={items} />);
  expect(all()).toHaveLength(0);

  wait(FIRST_MS);
  expect(all()).toHaveLength(1);
  expect(all()[0]).toHaveTextContent(items[0].text);

  wait(EVERY_MS);
  expect(all()).toHaveLength(2);
  expect(all()[0]).toHaveTextContent(items[1].notification.title);
});

test('two show in full; the rest stack underneath with a count', () => {
  render(<PainPointsPhone items={items} />);
  arrive(4);

  expect(all()).toHaveLength(4);
  expect(shown()).toHaveLength(2);
  expect(screen.getByText('2 more')).toBeInTheDocument();
});

test('a dismissed notification goes, and the next one moves up', () => {
  render(<PainPointsPhone items={items} />);
  arrive(3);

  expect(shown()[0]).toHaveTextContent(items[2].notification.title);
  fireEvent.keyDown(shown()[0], { key: 'Delete' });
  wait(1000);
  expect(all()).toHaveLength(2);
  expect(shown()).toHaveLength(2);
  expect(screen.queryByText(/more$/)).toBeNull();
});

test('“Send them again” starts over', () => {
  render(<PainPointsPhone items={items} />);
  arrive(2);
  expect(all()).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', { name: 'Send them again' }));
  expect(all()).toHaveLength(0);
  wait(FIRST_MS);
  expect(all()).toHaveLength(1);
});

test('with reduced motion they are all there at once', () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  render(<PainPointsPhone items={items} />);
  expect(all()).toHaveLength(items.length);
  expect(shown()).toHaveLength(2);
});
