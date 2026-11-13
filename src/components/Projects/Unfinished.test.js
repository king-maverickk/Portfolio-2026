import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import Unfinished from './Unfinished';
import UNFINISHED, { todo } from './unfinishedWork';

const row = (name) => screen.getByRole('heading', { level: 3, name: new RegExp(name) }).closest('li');

test('one row per entry: year, name and hint, under an “Unfinished” heading', () => {
  render(<Unfinished />);
  expect(screen.getByRole('heading', { level: 2, name: 'Unfinished' })).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(UNFINISHED.length);

  const entelect = row('Entelect Challenge 2024');
  expect(entelect).toHaveTextContent('2024');
  expect(entelect).toHaveTextContent('Solo entry. Stopped five weeks in.');
});

test('rows open and close on their own; Entelect starts open', () => {
  render(<Unfinished />);
  const entelect = screen.getByRole('button', { name: /Entelect Challenge 2024/ });
  const safm = screen.getByRole('button', { name: /SAfm redesign/ });
  expect(entelect).toHaveAttribute('aria-expanded', 'true');
  expect(safm).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(/Made for my dad/)).not.toBeVisible();

  fireEvent.click(safm);
  expect(safm).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/Made for my dad/)).toBeVisible();
  // Opening one leaves the other as it was.
  expect(entelect).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(entelect);
  expect(entelect).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(/A bot for Sproutopia/)).not.toBeVisible();
});

test('the Entelect entry: sentence, facts, the story, the chart and links out', () => {
  render(<Unfinished />);
  const entry = row('Entelect Challenge 2024');
  expect(within(entry).getByText(/My first programming competition/)).toBeInTheDocument();
  expect(within(entry).getByText('Stack').closest('div')).toHaveTextContent('C#, .NET 8, SignalR');
  expect(within(entry).getByRole('heading', { level: 4, name: 'How far it got' })).toBeInTheDocument();
  expect(within(entry).getByText(/30 commits over five weeks/)).toBeInTheDocument();
  expect(within(entry).getByRole('link', { name: /The repo, 30 commits/ }))
    .toHaveAttribute('href', 'https://github.com/king-maverickk/ent-chal-bot-v1');
  expect(within(entry).getByText(/reconstructed with an AI agent/)).toBeInTheDocument();
});

test('the commit calendar: a square per day, the busiest day and the workshop marked', () => {
  const { container } = render(<Unfinished />);
  const days = [...container.querySelectorAll('[data-commits]')];
  // 16 Jun to 23 Jul 2024, both ends included.
  expect(days).toHaveLength(38);
  expect(days.reduce((sum, day) => sum + Number(day.dataset.commits), 0)).toBe(30);
  // Six whole weeks of squares, Sunday first; the days after the last commit are blank.
  expect(container.querySelectorAll('figure .cell')).toHaveLength(42);
  expect(container.querySelectorAll('figure .cellOff')).toHaveLength(4);
  expect(container.querySelector('[title="14 Jul: 6 commits"]')).toHaveClass('level4');
  expect(container.querySelector('[title="26 Jun: 1 commit"]')).toHaveClass('level1');
  expect(container.querySelector('[title="Workshop, 13 Jul"]')).toHaveClass('cellMarked');
  expect(screen.getByText('6 commits, 14 Jul')).toBeInTheDocument();
});

describe('placeholders', () => {
  test('while developing: todo()s, reminders, picture chips and draft tags are shown', () => {
    const { container } = render(<Unfinished showTodos />);
    expect(screen.getByText('[YOURS: WHY I STOPPED, TWO OR THREE SENTENCES]')).toBeInTheDocument();
    expect(screen.getByText('[ADD NOTEBOOK PAGES HERE]')).toBeInTheDocument();
    expect(row('Milk & Honey TV')).toHaveTextContent('[WHY IT STOPPED]');
    expect(row('SAfm redesign')).toHaveTextContent('[YEAR]');
    expect(screen.getByText('console')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-draft]').length).toBeGreaterThan(0);
  });

  test('in the production build: nothing in [BRACKETS] reaches a visitor', () => {
    const { container } = render(<Unfinished showTodos={false} />);
    // Open everything that can open, then look at all of it.
    screen.getAllByRole('button').forEach((button) => {
      if (button.getAttribute('aria-expanded') === 'false') fireEvent.click(button);
    });
    expect(container.textContent).not.toMatch(/\[[A-Z]/);
    expect(container.querySelector('[data-draft]')).toBeNull();
    expect(screen.queryByText('console')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Why I stopped' })).not.toBeInTheDocument();
    // The sentence still reads as one sentence without its pictures.
    expect(screen.getByText(/five weeks teaching a C# bot to claim land on a field/)).toBeInTheDocument();
  });

  test('in the production build: a row with nothing to open is a plain line', () => {
    render(<Unfinished showTodos={false} />);
    const milk = row('Milk & Honey TV');
    expect(within(milk).queryByRole('button')).not.toBeInTheDocument();
    expect(milk).toHaveTextContent('2024');
    // A row with a summary still opens.
    expect(within(row('Virtual Guitar')).getByRole('button')).toBeInTheDocument();
  });

  test('once a todo() is replaced with words, they show everywhere', () => {
    const entries = [{
      ...UNFINISHED[0],
      entry: { ...UNFINISHED[0].entry, why: 'I had nobody to check my thinking against.', take: todo('LATER') }
    }];
    render(<Unfinished entries={entries} showTodos={false} />);
    expect(screen.getByRole('heading', { name: 'Why I stopped' })).toBeInTheDocument();
    expect(screen.getByText('I had nobody to check my thinking against.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'What I’d take from it' })).not.toBeInTheDocument();
  });
});
