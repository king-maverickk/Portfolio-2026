import React from 'react';
import { render, screen } from '@testing-library/react';

import SlideUpText, { slideUpHost } from './index';

test('reads as one piece of text, and the letters are hidden from screen readers', () => {
  render(
    <button type="button" className={slideUpHost}>
      <SlideUpText text="Start a project" />
    </button>
  );
  expect(screen.getByRole('button', { name: 'Start a project' })).toBeInTheDocument();
  // 13 letters, each in its own window; the space isn't a letter.
  expect(document.querySelectorAll('[data-char]')).toHaveLength(13);
  expect(document.querySelector('[data-char]').closest('[aria-hidden="true"]')).not.toBeNull();
});

test('a new rollKey rolls the letters once', () => {
  const { container, rerender } = render(<SlideUpText text="Pricing" />);
  expect(container.querySelector('.rolling')).toBeNull();
  rerender(<SlideUpText text="Pricing" rollKey={1} />);
  expect(container.querySelector('.rolling')).not.toBeNull();
});
