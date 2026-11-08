import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import PainPoints from './PainPoints';
import { FREELANCE } from './copy';

const { painPoints } = FREELANCE;
const count = painPoints.items.length;
const AUTOPLAY_MS = 5000;
const SETTLE_MS = 1000; // a little longer than the throw animation

function renderDeck(props = {}) {
  return render(<PainPoints {...painPoints} {...props} />);
}

const topCard = () => screen.getByRole('group', { name: / of / });
const deck = () => screen.getByLabelText(/use the arrow keys/);
const settle = () => act(() => jest.advanceTimersByTime(SETTLE_MS));

// jsdom has no PointerEvent, so pointer events would lose clientX/Y and
// pointerId. A small stand-in built on MouseEvent.
if (typeof window.PointerEvent !== 'function') {
  window.PointerEvent = class PointerEvent extends window.MouseEvent {
    constructor(type, init = {}) {
      super(type, init);
      this.pointerId = init.pointerId;
      this.pointerType = init.pointerType;
    }
  };
}

// Drags the top card by (dx, dy) over `ms` milliseconds.
function drag(dx, dy, ms) {
  const card = topCard();
  const pointer = { pointerId: 1, pointerType: 'mouse', button: 0 };
  fireEvent.pointerDown(card, { ...pointer, clientX: 200, clientY: 200 });
  act(() => jest.advanceTimersByTime(ms / 2));
  fireEvent.pointerMove(card, { ...pointer, clientX: 200 + dx, clientY: 200 + dy });
  act(() => jest.advanceTimersByTime(ms / 2));
  fireEvent.pointerUp(card, { ...pointer, clientX: 200 + dx, clientY: 200 + dy });
}

beforeEach(() => {
  jest.useFakeTimers();
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  jest.useRealTimers();
});

test('shows the first card on top, with the rest hidden from screen readers', () => {
  const { container } = renderDeck();

  expect(screen.getByRole('heading', { name: /Pain points/ })).toBeInTheDocument();
  expect(topCard()).toHaveAccessibleName(`1 of ${count}`);
  expect(topCard()).toHaveTextContent(painPoints.items[0].text);
  // The other cards, plus each card's icon-and-count row.
  expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(count - 1);
});

test('every card has an icon', () => {
  const { container } = renderDeck();
  expect(container.querySelectorAll('svg')).toHaveLength(count);
});

test('tapping the top card deals the next one', () => {
  renderDeck();
  drag(0, 0, 100);
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);
});

test('a short, slow drag springs back; a long drag or a flick throws the card', () => {
  renderDeck();

  drag(40, 10, 800);
  expect(topCard()).toHaveAccessibleName(`1 of ${count}`);

  drag(-160, 40, 600);
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);
  settle();

  drag(30, -20, 30); // a flick
  expect(topCard()).toHaveAccessibleName(`3 of ${count}`);
});

test('the thrown card goes to the back, so the deck wraps round', () => {
  renderDeck();
  for (let i = 0; i < count; i += 1) {
    fireEvent.keyDown(deck(), { key: 'ArrowRight' });
    settle();
  }
  expect(topCard()).toHaveAccessibleName(`1 of ${count}`);
});

test('arrow keys move forward and back', () => {
  renderDeck();

  fireEvent.keyDown(deck(), { key: 'ArrowLeft' });
  expect(topCard()).toHaveAccessibleName(`${count} of ${count}`);
  settle();
  fireEvent.keyDown(deck(), { key: 'ArrowRight' });
  expect(topCard()).toHaveAccessibleName(`1 of ${count}`);
});

test('ignores input while a card is still in the air', () => {
  renderDeck();
  fireEvent.keyDown(deck(), { key: 'ArrowRight' });
  fireEvent.keyDown(deck(), { key: 'ArrowRight' });
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);
});

test('deals on its own, but not while the mouse is over the cards', () => {
  renderDeck();

  act(() => jest.advanceTimersByTime(AUTOPLAY_MS));
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);
  settle();

  fireEvent.pointerEnter(deck(), { pointerType: 'mouse' });
  act(() => jest.advanceTimersByTime(AUTOPLAY_MS * 2));
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);

  fireEvent.pointerLeave(deck(), { pointerType: 'mouse' });
  act(() => jest.advanceTimersByTime(AUTOPLAY_MS));
  expect(topCard()).toHaveAccessibleName(`3 of ${count}`);
});

test('no autoplay for people who prefer less motion; changes by hand are read out', () => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  renderDeck();

  act(() => jest.advanceTimersByTime(AUTOPLAY_MS * 2));
  expect(topCard()).toHaveAccessibleName(`1 of ${count}`);

  fireEvent.keyDown(deck(), { key: 'ArrowRight' });
  expect(topCard()).toHaveAccessibleName(`2 of ${count}`);
  expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(painPoints.items[1].text);
});
