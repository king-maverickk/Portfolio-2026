import React from 'react';
import { createEvent, fireEvent, render, screen, within } from '@testing-library/react';

import Unfinished from './Unfinished';
import UNFINISHED, { todo } from './unfinishedWork';

const row = (name) => screen.getByRole('heading', { level: 3, name: new RegExp(name) }).closest('li');
// The highlight sentence as one line of text (its words are split across the
// InlineImgs that hold the pictures).
const sentenceText = (container) => container.querySelector('.sentence').textContent.replace(/\s+/g, ' ');
// Rows start closed. Opens one and returns its <li>.
const openRow = (name) => {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
  return row(name);
};

test('one row per entry: year, name and hint, under an “Unfinished” heading', () => {
  render(<Unfinished />);
  expect(screen.getByRole('heading', { level: 2, name: 'Unfinished' })).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(UNFINISHED.length);

  const entelect = row('Entelect Challenge 2024');
  expect(entelect).toHaveTextContent('2024');
  expect(entelect).toHaveTextContent(UNFINISHED[0].hint);
});

// Sample rows, so the tests below don't depend on which rows are written yet.
const SAMPLE = { id: 'sample', name: 'Sample row', year: 2023, hint: 'A hint.', summary: 'Made for my dad.' };
const NOT_WRITTEN = { ...SAMPLE, id: 'not-written', name: 'Not written yet', disabled: true };

test('every row starts closed; rows open and close on their own', () => {
  render(<Unfinished entries={[UNFINISHED[0], SAMPLE]} />);
  screen.getAllByRole('button').forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'));
  const entelect = screen.getByRole('button', { name: /Entelect Challenge 2024/ });
  const sample = screen.getByRole('button', { name: /Sample row/ });
  expect(screen.getByText(/A bot for Sproutopia/)).not.toBeVisible();
  expect(screen.getByText(/Made for my dad/)).not.toBeVisible();

  fireEvent.click(entelect);
  expect(entelect).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/A bot for Sproutopia/)).toBeVisible();
  // Opening one leaves the others as they were.
  expect(sample).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(sample);
  expect(sample).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/Made for my dad/)).toBeVisible();
  expect(entelect).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(entelect);
  expect(entelect).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(/A bot for Sproutopia/)).not.toBeVisible();
});

test('a row marked `open: true` in unfinishedWork.js starts open', () => {
  render(<Unfinished entries={[{ ...UNFINISHED[0], open: true }, SAMPLE]} />);
  expect(screen.getByRole('button', { name: /Entelect Challenge 2024/ })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: /Sample row/ })).toHaveAttribute('aria-expanded', 'false');
});

test('a row marked `disabled: true` is listed but greyed out, with nothing to open', () => {
  render(<Unfinished entries={[SAMPLE, NOT_WRITTEN]} />);
  const off = row('Not written yet');
  expect(off).toHaveClass('rowDisabled');
  expect(off).toHaveTextContent('2023');
  expect(off).toHaveTextContent('A hint.');
  expect(within(off).queryByRole('button')).not.toBeInTheDocument();
  expect(off).not.toHaveTextContent('+');
  // Its summary isn't on the page at all, so it can't be reached by search or a screen reader.
  expect(screen.getAllByText('Made for my dad.')).toHaveLength(1);
  // The row beside it is untouched.
  expect(row('Sample row')).not.toHaveClass('rowDisabled');
  expect(within(row('Sample row')).getByRole('button')).toBeInTheDocument();
});

test('the Entelect entry: the sentence, four short sections and the shelf', () => {
  render(<Unfinished showTodos />);
  const entry = openRow('Entelect Challenge 2024');
  expect(within(entry).getByText(/My first programming competition/)).toBeInTheDocument();
  expect(within(entry).getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent))
    .toEqual(['What it was', 'How far it got', 'Why I stopped', 'What I’d take from it', 'Shelf-made:']);
  expect(within(entry).getByText(/30\+ commits over five weeks/)).toBeInTheDocument();
  expect(within(entry).getByText(/reconstructed with an AI agent/)).toBeInTheDocument();
});

test('the shelf: a labelled group per pile of cards, each card a link out', () => {
  render(<Unfinished showTodos={false} />);
  openRow('Entelect Challenge 2024');
  const shelf = screen.getByRole('region', { name: 'Shelf-made:' });
  expect(within(shelf).getByRole('link', { name: 'GitHub Repo' }))
    .toHaveAttribute('href', expect.stringContaining('github.com/king-maverickk/ent-chal-bot-v1'));
  expect(within(shelf).getByRole('link', { name: 'YouTube Trailer' })).toHaveAttribute('target', '_blank');

  // The trailer and the two workshop posts are piled up: one behind, two in front.
  const pile = within(shelf).getByText('Trailer and Workshop').closest('li');
  expect(pile.querySelector('.stackPictures')).not.toBeNull();
  expect(within(pile).getAllByRole('link')).toHaveLength(3);
  expect(within(pile).getByRole('link', { name: 'YouTube Trailer' })).toHaveClass('stackBack');
  expect(within(pile).getByRole('link', { name: /the poster/ })).toHaveClass('stackLeft');
  expect(within(pile).getByRole('link', { name: /photos from the day/ })).toHaveClass('stackRight');

  // Every card is its picture; the notebook isn't a link and wears its label.
  expect(shelf.querySelectorAll('img')).toHaveLength(7);
  const notebook = within(shelf).getByText('Notebook notes').closest('li');
  expect(within(notebook).queryByRole('link')).not.toBeInTheDocument();
  expect(within(notebook).getAllByText('2024 notebook')).toHaveLength(2); // one for screen readers, one on the picture
});

test('the shelf can be dragged sideways with the mouse, without opening a card', () => {
  render(<Unfinished showTodos={false} />);
  openRow('Entelect Challenge 2024');
  const shelf = screen.getByRole('region', { name: 'Shelf-made:' });
  const cards = within(shelf).getByRole('list');
  const github = within(shelf).getByRole('link', { name: 'GitHub Repo' });
  const click = () => {
    const event = createEvent.click(github);
    fireEvent(github, event);
    return event.defaultPrevented;
  };

  // Press on a card, pull 120px to the left, let go: the row has moved 120px
  // and the card under the mouse does not open.
  fireEvent.mouseDown(github, { button: 0, clientX: 300 });
  fireEvent.mouseMove(window, { clientX: 180 });
  expect(cards.scrollLeft).toBe(120);
  expect(cards).toHaveClass('dragging');
  fireEvent.mouseUp(window);
  expect(cards).not.toHaveClass('dragging');
  expect(click()).toBe(true);

  // An ordinary click (the mouse barely moves) still opens the card.
  fireEvent.mouseDown(github, { button: 0, clientX: 300 });
  fireEvent.mouseMove(window, { clientX: 298 });
  fireEvent.mouseUp(window);
  expect(cards.scrollLeft).toBe(120);
  expect(click()).toBe(false);
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

test('the sentence: the C# logo sits in its chip, the notebook pops out of its own', () => {
  const { container } = render(<Unfinished entries={[{ ...UNFINISHED[0], open: true }]} showTodos={false} />);
  const logo = container.querySelector('img[src$="chip-csharp.webp"]');
  const notebook = container.querySelector('img[src$="chip-notebook.webp"]');
  expect(logo).toHaveClass('chipLogo');
  expect(logo.parentElement).toHaveClass('chipFrame');
  expect(notebook).toHaveClass('chipPop');
  expect(notebook.style.getPropertyValue('--chip-tilt')).toBe('-7deg');

  // Both are InlineImgs, each kept on one line with the word before it.
  expect(logo.closest('.bind')).toHaveTextContent(/^teaching$/);
  expect(notebook.closest('.bind')).toHaveTextContent(/^in$/);
  expect(logo.parentElement).toHaveClass('media');
  expect(sentenceText(container)).toMatch(/five weeks teaching a C# bot to claim land on a field/);
});

test('a shelf card still waiting for its picture: a reminder in npm start, left out in production', () => {
  const entries = [{
    ...UNFINISHED[0],
    open: true,
    entry: {
      ...UNFINISHED[0].entry,
      shelf: [
        { label: 'Sketches', cards: [{ title: 'Sketches', image: todo('ADD SKETCHES') }] },
        { label: 'Rules', cards: [{ title: 'Rules', href: 'https://example.com/rules' }] }
      ]
    }
  }];
  const { unmount } = render(<Unfinished entries={entries} showTodos />);
  expect(screen.getByText('[ADD SKETCHES]')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Sketches/ })).not.toBeInTheDocument();
  unmount();

  render(<Unfinished entries={entries} showTodos={false} />);
  expect(screen.queryByText('Sketches')).not.toBeInTheDocument();
  // A card with a link but no picture is a plain grey card with its title.
  expect(screen.getByRole('link', { name: 'Rules' })).not.toHaveClass('cardPicture');
});

describe('placeholders', () => {
  test('while developing: todo()s, reminders, picture chips and draft tags are shown', () => {
    const { container } = render(<Unfinished showTodos />);
    expect(screen.getByText('[YOURS: WHY I STOPPED, TWO OR THREE SENTENCES]')).toBeInTheDocument();
    expect(screen.getByText('board')).toBeInTheDocument();
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
    expect(screen.queryByText('board')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Why I stopped' })).not.toBeInTheDocument();
    // The sentence still reads as one sentence without its pictures.
    expect(sentenceText(container)).toMatch(/five weeks teaching a C# bot to claim land on a field/);
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
      open: true,
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
