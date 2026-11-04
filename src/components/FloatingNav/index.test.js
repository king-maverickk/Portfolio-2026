import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FloatingNav from './index';

test('opens and closes from the menu button, and with Escape', () => {
  render(<FloatingNav preview />);
  const button = screen.getByRole('button', { name: 'Open navigation menu' });

  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toBe(button);

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('hovering a page previews its cover', () => {
  render(<FloatingNav preview />);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  fireEvent.mouseEnter(screen.getByText('Contact').closest('[role="listitem"]'));
  expect(screen.getByText('Previewing').nextSibling).toHaveTextContent('Contact');
});
