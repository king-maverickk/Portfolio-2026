import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HowIllDeliver from './index';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

test.each([
  ['(open to work)', 'Open to work', '#ff0000'],
  ['(freelance/contract)', 'Freelance / contract', '#22C55E'],
  ['(hiring manager)', 'Hiring managers', '#3794FE']
])('opens the %s sheet with its own content and accent color', (annotation, title, accentColor) => {
  render(<HowIllDeliver />);

  const trigger = screen.getByRole('button', { name: annotation });
  trigger.style.setProperty('--annotation-border-color', accentColor);
  fireEvent.click(trigger);

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  expect(screen.getByRole('dialog').style.getPropertyValue('--sheet-accent-color')).toBe(accentColor);
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
