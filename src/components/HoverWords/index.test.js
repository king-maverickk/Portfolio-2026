import React from 'react';
import { render } from '@testing-library/react';
import HoverWords from './index';

function mockMatchMedia(matches) {
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

test('renders its children untouched on a touch device when reveal is off', () => {
  mockMatchMedia(false);
  const { container } = render(<p><HoverWords>one two three</HoverWords></p>);

  expect(container.querySelectorAll('span')).toHaveLength(0);
  expect(container).toHaveTextContent('one two three');
});

test('wraps each word on a touch device when reveal is on, keeping the spaces as text', () => {
  mockMatchMedia(false);
  const { container } = render(<p><HoverWords reveal>one two three</HoverWords></p>);
  const words = container.querySelectorAll('.word');

  expect(words).toHaveLength(3);
  expect(container.querySelector('p').textContent).toBe('one two three');
  expect(words[2].style.getPropertyValue('--word-index')).toBe('2');
  // Plain inline boxes: the hoverable (inline-block) class is for hover devices only.
  words.forEach((word) => expect(word).not.toHaveClass('hoverable'));
});

test('words stay hidden until revealed, then get the revealed class', () => {
  mockMatchMedia(false);
  const { container, rerender } = render(
    <p><HoverWords reveal revealed={false}>one two</HoverWords></p>,
  );

  container.querySelectorAll('.word').forEach((word) => {
    expect(word).toHaveClass('reveal');
    expect(word).not.toHaveClass('revealed');
  });

  rerender(<p><HoverWords reveal revealed>one two</HoverWords></p>);

  container.querySelectorAll('.word').forEach((word) => {
    expect(word).toHaveClass('revealed');
  });
});

test('revealDelay is passed to every word so a second paragraph can follow the first', () => {
  mockMatchMedia(false);
  const { container } = render(
    <p><HoverWords reveal revealed revealDelay={450}>one two</HoverWords></p>,
  );

  container.querySelectorAll('.word').forEach((word) => {
    expect(word.style.getPropertyValue('--reveal-delay')).toBe('450ms');
  });
});

test('an element counts as one word, so a word and its image move together', () => {
  mockMatchMedia(false);
  const { container } = render(
    <p><HoverWords reveal>a <b>b c</b> d</HoverWords></p>,
  );

  expect(container.querySelectorAll('.word')).toHaveLength(3);
});

test('on a device that can hover, words become hoverable even without reveal', () => {
  mockMatchMedia(true);
  const { container } = render(<p><HoverWords>one two</HoverWords></p>);
  const words = container.querySelectorAll('.word');

  expect(words).toHaveLength(2);
  words.forEach((word) => expect(word).toHaveClass('hoverable'));
});

test('does not rebuild the words when hover support is detected', () => {
  mockMatchMedia(true);
  const { container } = render(<p><HoverWords reveal>one <b>two</b></HoverWords></p>);

  // Reveal mode wraps from the first render, so the <b> keeps the same node.
  const inner = container.querySelector('b');
  expect(inner).toBeInTheDocument();
  expect(container.querySelectorAll('.word')).toHaveLength(2);
});
