import React from 'react';
import { act, render } from '@testing-library/react';
import AboutMotheo from './index';

let observerCallback;
const disconnect = jest.fn();

beforeEach(() => {
  disconnect.mockClear();
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  window.IntersectionObserver = jest.fn((callback) => {
    observerCallback = callback;
    return { observe: jest.fn(), disconnect };
  });
});

afterEach(() => {
  delete window.IntersectionObserver;
});

test('intro words stay hidden until the intro scrolls into view, then fall in once', () => {
  const { container } = render(<AboutMotheo />);
  const words = () => container.querySelectorAll('.intro .word');

  expect(words().length).toBeGreaterThan(20);
  words().forEach((word) => expect(word).not.toHaveClass('revealed'));

  act(() => observerCallback([{ isIntersecting: false }]));
  words().forEach((word) => expect(word).not.toHaveClass('revealed'));

  act(() => observerCallback([{ isIntersecting: true }]));
  words().forEach((word) => expect(word).toHaveClass('revealed'));
  expect(disconnect).toHaveBeenCalled();
});

test('the statement starts after the lead, so the two read as one sweep', () => {
  const { container } = render(<AboutMotheo />);
  const lead = container.querySelector('.lead .word');
  const statement = container.querySelector('.statement .word');

  expect(lead.style.getPropertyValue('--reveal-delay')).toBe('0ms');
  expect(statement.style.getPropertyValue('--reveal-delay')).toBe('450ms');
});

test('shows the intro straight away when IntersectionObserver is unavailable', () => {
  delete window.IntersectionObserver;
  const { container } = render(<AboutMotheo />);

  container.querySelectorAll('.intro .word').forEach((word) => {
    expect(word).toHaveClass('revealed');
  });
});
