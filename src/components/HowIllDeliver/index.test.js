import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

describe('hiring manager sheets', () => {
  const openSheets = () => {
    render(<HowIllDeliver />);
    fireEvent.click(screen.getByRole('button', { name: '(hiring manager)' }));
  };

  test('shows the roles, scenario and resume together in one dialog', () => {
    openSheets();

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Interactions and UX' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('region', { name: 'Resume preview' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Tools, skills and languages' })).toBeInTheDocument();
  });

  test('choosing a role highlights matching resume text and syncs the resume switcher', () => {
    openSheets();
    const resume = screen.getByRole('region', { name: 'Resume preview' });
    const highlighted = () => Array.from(resume.querySelectorAll('[data-highlighted="true"]')).map((node) => node.textContent);

    expect(highlighted()).toContain('explore a direction');
    expect(highlighted()).not.toContain('parallax animation');

    fireEvent.click(screen.getByRole('button', { name: 'Motion Design' }));

    expect(screen.getByRole('button', { name: 'Motion Design' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Motion' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Interactions and UX' })).toHaveAttribute('aria-pressed', 'false');
    expect(highlighted()).toContain('parallax animation');
    expect(highlighted()).not.toContain('explore a direction');
  });

  test('the cards list only what fits the selected role', () => {
    openSheets();
    const cards = within(screen.getByRole('region', { name: 'Tools, skills and languages' }));

    expect(cards.getByText('Figma')).toBeInTheDocument();
    expect(cards.queryByText('Jitter')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Motion Design' }));

    expect(cards.getByText('Jitter')).toBeInTheDocument();
    expect(cards.queryByText('Figma')).not.toBeInTheDocument();
  });

  test('choosing a scenario swaps the sentence', () => {
    openSheets();
    fireEvent.click(screen.getByRole('button', { name: 'Marketing team' }));

    expect(screen.getByRole('button', { name: 'Marketing team' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/campaign ideas into on-brand pages/)).toBeInTheDocument();
    expect(screen.queryByText(/prototype in code early/)).not.toBeInTheDocument();
  });

  test('hovering a row lights up the matching resume entry', () => {
    openSheets();
    const entry = document.querySelector('[data-entry="freelance"]');

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Freelance designer-developer' }));
    expect(entry).toHaveAttribute('data-active', 'true');

    fireEvent.mouseLeave(screen.getByRole('button', { name: 'Freelance designer-developer' }));
    expect(entry).toHaveAttribute('data-active', 'false');
  });

  test('clicking inside a sheet keeps it open, clicking the gap closes both', () => {
    openSheets();

    fireEvent.mouseDown(screen.getByRole('region', { name: 'Resume preview' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.mouseDown(document.querySelector('[class*="sheetBackdrop"]'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});