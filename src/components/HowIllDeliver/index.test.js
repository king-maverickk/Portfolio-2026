import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HowIllDeliver from './index';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

test.each([
  ['(open to work)', 'Open to work'],
  ['(freelance/contract)', 'Freelance / contract'],
  ['(hiring manager)', 'Hiring managers']
])('opens the %s sheet with its own content', (annotation, title) => {
  render(<HowIllDeliver />);

  fireEvent.click(screen.getByRole('button', { name: annotation }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
});

test('closes the sheet with Escape and returns focus to its trigger', () => {
  render(<HowIllDeliver />);
  const trigger = screen.getByRole('button', { name: '(open to work)' });

  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test('closes the sheet when the backdrop is clicked', () => {
  render(<HowIllDeliver />);
  fireEvent.click(screen.getByRole('button', { name: '(freelance/contract)' }));
  fireEvent.mouseDown(document.querySelector('[class*="sheetBackdrop"]'));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
