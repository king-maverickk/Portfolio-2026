import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

describe('when the browser can animate the sheet', () => {
  beforeEach(() => {
    window.CSS = { supports: jest.fn().mockReturnValue(true) };
  });

  afterEach(() => {
    delete window.CSS;
    jest.useRealTimers();
  });

  test('slides out before it is removed, then returns focus to its trigger', () => {
    render(<HowIllDeliver />);
    const trigger = screen.getByRole('button', { name: '(hiring manager)' });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });

    // Still on the page, playing its exit.
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sheetClosing');
    expect(document.querySelector('[class*="sheetBackdrop"]')).toHaveClass('sheetBackdropClosing');

    fireEvent.animationEnd(dialog);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('closing twice does not restart the exit', () => {
    render(<HowIllDeliver />);
    fireEvent.click(screen.getByRole('button', { name: '(open to work)' }));

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Close sheet' }));
    fireEvent.mouseDown(document.querySelector('[class*="sheetBackdrop"]'));

    expect(screen.getByRole('dialog')).toHaveClass('sheetClosing');
    fireEvent.animationEnd(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('removes the sheet anyway if the exit animation never reports back', () => {
    jest.useFakeTimers();
    render(<HowIllDeliver />);
    fireEvent.click(screen.getByRole('button', { name: '(freelance/contract)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close sheet' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('closes immediately when the person prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    render(<HowIllDeliver />);
    fireEvent.click(screen.getByRole('button', { name: '(open to work)' }));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
