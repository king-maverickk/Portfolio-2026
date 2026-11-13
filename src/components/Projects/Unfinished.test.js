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

test('the Entelect entry: the sentence, four short sections and the shelf', () => {
  render(<Unfinished showTodos />);
  const entry = row('Entelect Challenge 2024');
  expect(within(entry).getByText(/My first programming competition/)).toBeInTheDocument();
  expect(within(entry).getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent))
    .toEqual(['What it was', 'How far it got', 'Why I stopped', 'What I’d take from it', 'Shelf']);
  expect(within(entry).getByText(/30\+ commits over five weeks/)).toBeInTheDocument();
  expect(within(entry).getByText(/reconstructed with an AI agent/)).toBeInTheDocument();
});

test('the shelf: a labelled group per pile of cards, each card a link out', () => {
  render(<Unfinished showTodos={false} />);
  const shelf = screen.getByRole('region', { name: 'Shelf' });
  expect(within(shelf).getByRole('link', { name: 'GitHub' }))
    .toHaveAttribute('href', 'https://github.com/king-maverickk/ent-chal-bot-v1');
  expect(within(shelf).getByRole('link', { name: 'Trailer' })).toHaveAttribute('target', '_blank');

  // Trailer and the two workshop posts are piled up: one behind, two tilted.
  const pile = within(shelf).getByText('Trailer and Workshop').closest('li');
  expect(within(pile).getAllByRole('link')).toHaveLength(3);
  expect(within(pile).getByRole('link', { name: 'Trailer' })).toHaveClass('stackBack');
  expect(within(pile).getByRole('link', { name: 'Workshop poster' })).toHaveClass('stackLeft');
  expect(within(pile).getByRole('link', { name: 'Workshop photos' })).toHaveClass('stackRight');
});

test('a shelf card with a picture shows the picture and keeps its name for screen readers', () => {
  const entries = [{
    ...UNFINISHED[0],
    entry: {
      ...UNFINISHED[0].entry,
      shelf: [{ label: 'Notebook notes', cards: [{ title: 'Notebook', image: '/assets/notebook.jpg' }] }]
    }
  }];
  const { container } = render(<Unfinished entries={entries} showTodos={false} />);
  expect(container.querySelector('img[src="/assets/notebook.jpg"]')).toBeInTheDocument();
  expect(screen.getByText('Notebook')).toHaveClass('srOnly');
});

describe('placeholders', () => {
  test('while developing: todo()s, reminders, picture chips and draft tags are shown', () => {
    const { container } = render(<Unfinished showTodos />);
    expect(screen.getByText('[YOURS: WHY I STOPPED, TWO OR THREE SENTENCES]')).toBeInTheDocument();
    // The notebook card has no photos yet: it shows as a reminder, not as a link.
    expect(screen.getByText('[ADD NOTEBOOK PHOTOS]')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Notebook/ })).not.toBeInTheDocument();
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
    // A card with no link and no picture yet is left off the shelf, and so is its group.
    expect(screen.queryByText('Notebook notes')).not.toBeInTheDocument();
    // The sentence still reads as one sentence without its pictures.
    expect(screen.getByText(/five weeks teaching a C# bot to claim land on a field/)).toBeInTheDocument();
  });

  // These use their own rows, so filling in a year or a hint in
  // unfinishedWork.js never breaks them.
  const GAPS = [
    { id: 'gaps', name: 'Row with gaps', year: todo('YEAR'), hint: ['Made for a friend.', todo('WHY IT STOPPED')] },
    { id: 'summary', name: 'Row with a summary', year: 2023, hint: 'A hint.', summary: 'A sentence.' }
  ];

  test('while developing: a missing year or hint shows in [BRACKETS]', () => {
    render(<Unfinished entries={GAPS} showTodos />);
    expect(row('Row with gaps')).toHaveTextContent('[YEAR]');
    expect(row('Row with gaps')).toHaveTextContent('Made for a friend. [WHY IT STOPPED]');
  });

  test('in the production build: a row with nothing to open is a plain line', () => {
    render(<Unfinished entries={GAPS} showTodos={false} />);
    const gaps = row('Row with gaps');
    expect(within(gaps).queryByRole('button')).not.toBeInTheDocument();
    expect(gaps).toHaveTextContent('Made for a friend.');
    expect(gaps).not.toHaveTextContent('[');
    // A row with a summary still opens; a year typed as a number shows too.
    expect(within(row('Row with a summary')).getByRole('button')).toHaveTextContent('2023');
  });

  test('once a todo() is replaced with words, they show everywhere', () => {
    const entries = [{
      ...UNFINISHED[0],
      entry: {
        ...UNFINISHED[0].entry,
        sections: [
          { title: 'Why I stopped', body: 'I had nobody to check my thinking against.' },
          { title: 'What I’d take from it', body: todo('LATER') }
        ]
      }
    }];
    render(<Unfinished entries={entries} showTodos={false} />);
    expect(screen.getByRole('heading', { name: 'Why I stopped' })).toBeInTheDocument();
    expect(screen.getByText('I had nobody to check my thinking against.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'What I’d take from it' })).not.toBeInTheDocument();
  });
});
