import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';

import HowIllDeliver from '../index';
import HiringManagerSheet from './HiringManagerSheet';
import FreelanceSheet from './FreelanceSheet';
import OpenToWorkSheet from './OpenToWorkSheet';
import { CONTACT, HIRING } from './copy';
import PROJECTS from 'components/Projects/projects';
import UNFINISHED from 'components/Projects/unfinishedWork';

// The hiring manager sheet links to project pages, so everything renders
// inside a router, as it does on the site.
const render = (ui) => rtlRender(ui, { wrapper: MemoryRouter });

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

describe('hiring manager sheet', () => {
  test('the resume is on top of the pile, the open letter behind it; the pages are buttons, not readable text', () => {
    render(<HiringManagerSheet />);

    expect(screen.getByRole('button', { name: 'Read the resume' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bring the open letter to the front' })).toBeInTheDocument();

    // The shrunk pages are pictures of the documents: no article, no links.
    expect(screen.queryByRole('article', { name: 'Resume' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: CONTACT.email })).not.toBeInTheDocument();
  });

  test('clicking the back page slides it out, then puts it on top', () => {
    jest.useFakeTimers();
    try {
      render(<HiringManagerSheet />);
      const letter = screen.getByRole('button', { name: 'Bring the open letter to the front' });

      fireEvent.click(letter);
      // Still on its way out.
      expect(letter).toHaveAccessibleName('Bring the open letter to the front');

      act(() => { jest.advanceTimersByTime(400); });
      expect(letter).toHaveAccessibleName('Read the open letter');
      expect(screen.getByRole('button', { name: 'Bring the resume to the front' })).toBeInTheDocument();
      expect(screen.getByText('Open letter on top.')).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  test('with reduced motion the pages swap straight away', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    render(<HiringManagerSheet />);

    fireEvent.click(screen.getByRole('button', { name: 'Bring the open letter to the front' }));
    expect(screen.getByRole('button', { name: 'Read the open letter' })).toBeInTheDocument();
  });

  test('clicking the top page opens it to read; "Back to the pile" puts it back', () => {
    render(<HiringManagerSheet />);
    const { backToPile } = HIRING.documents;

    fireEvent.click(screen.getByRole('button', { name: 'Read the resume' }));
    expect(screen.getByRole('article', { name: 'Resume' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: CONTACT.email })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: backToPile })[0]).toHaveFocus();

    fireEvent.click(screen.getAllByRole('button', { name: backToPile })[0]);
    expect(screen.queryByRole('article', { name: 'Resume' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read the resume' })).toHaveFocus();
  });

  test('the open letter opens the same way once it is on top', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    render(<HiringManagerSheet />);

    fireEvent.click(screen.getByRole('button', { name: 'Bring the open letter to the front' }));
    fireEvent.click(screen.getByRole('button', { name: 'Read the open letter' }));
    expect(screen.getByRole('article', { name: 'Open letter' })).toBeInTheDocument();
    expect(screen.getByText(HIRING.coverLetter.greeting)).toBeInTheDocument();
  });

  test('no Download button until a PDF is set in copy.js', () => {
    render(<HiringManagerSheet />);
    expect(Boolean(screen.queryByRole('link', { name: /Download/ }))).toBe(Boolean(HIRING.documents.resume.pdf));
  });

  test('Roles is a closed container whose hint names the roles; open, it lists them, design engineering first', () => {
    render(<HiringManagerSheet />);
    const { title, teaser, items } = HIRING.roles;

    const toggle = screen.getByRole('button', { name: new RegExp(`^${title}`) });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveTextContent(teaser);

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const roles = within(screen.getByRole('region', { name: new RegExp(`^${title}`) }));
    const labels = roles.getAllByRole('term').map((term) => term.textContent);
    expect(labels).toHaveLength(items.length);
    expect(items[0].id).toBe('design-engineering');
    expect(labels[0]).toContain(items[0].label);
    items.forEach(({ text }) => expect(roles.getByText(text)).toBeInTheDocument());
  });

  test('Online is a closed container; open, it shows the two profile cards, each with one link', () => {
    render(<HiringManagerSheet />);
    const toggle = screen.getByRole('button', { name: /^Online/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveTextContent(HIRING.online.teaser);
    fireEvent.click(toggle);

    const online = within(screen.getByRole('region', { name: /^Online/ }));
    const { linkedin, github } = HIRING.online;

    expect(online.getByRole('link', { name: linkedin.cta })).toHaveAttribute('href', linkedin.href);
    expect(online.getByRole('link', { name: github.handle })).toHaveAttribute('href', github.href);
    expect(online.getAllByRole('link')).toHaveLength(2);

    // "Open to Work" and "Skills" are words on the card, not links.
    linkedin.notes.forEach((note) => expect(online.getByText(note).closest('a')).toBeNull());
    github.stats.forEach(({ value }) => expect(online.getByText(value)).toBeInTheDocument());
  });

  test('Proof starts closed; open, it has one card per scenario, each leading to its project', () => {
    render(<HiringManagerSheet />);
    const { scenarios } = HIRING.proof;

    const toggle = screen.getByRole('button', { name: /^Proof/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const proof = within(screen.getByRole('region', { name: /^Proof/ }));
    expect(proof.getAllByRole('listitem')).toHaveLength(scenarios.length);

    scenarios.forEach(({ title, tag, figure, project, to }) => {
      const card = within(proof.getByRole('heading', { name: title }).closest('li'));
      expect(card.getByText(tag)).toBeInTheDocument();
      figure.parts.forEach(({ value }) => expect(card.getByText(value)).toBeInTheDocument());
      expect(card.getByRole('link', { name: new RegExp(project) })).toHaveAttribute('href', to);
    });
  });

  test('scenario sentences stay short enough to scan', () => {
    HIRING.proof.scenarios.forEach(({ text }) => {
      expect(text.split(/\s+/).length).toBeLessThanOrEqual(20);
    });
  });

  test('Working with me and Still learning open from their rows; Next steps is gone', () => {
    render(<HiringManagerSheet />);

    const working = screen.getByRole('button', { name: /^Working with me/ });
    expect(working).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(working);
    expect(working).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('From a lead')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^Still learning/ })).toBeInTheDocument();
    expect(screen.queryByText('Next steps')).toBeNull();
  });

  test('Projects: a card for every project page and every written-up unfinished entry', () => {
    render(<HiringManagerSheet />);
    // The resume has a "Projects" section too; this one is named with its caption.
    const projects = within(screen.getByRole('region', { name: `${HIRING.projects.title} ${HIRING.projects.caption}` }));

    PROJECTS.forEach(({ id, name }) => {
      expect(projects.getByRole('link', { name })).toHaveAttribute('href', `/projects/${id}`);
    });

    const written = UNFINISHED.filter((entry) => !entry.disabled && (entry.entry || entry.summary));
    written.forEach(({ id, name }) => {
      expect(projects.getByRole('link', { name })).toHaveAttribute('href', `/projects#unfinished-${id}`);
    });
    expect(projects.getAllByRole('link')).toHaveLength(PROJECTS.length + written.length);
  });
});

test('draft copy is tagged outside production', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);
  expect(document.querySelectorAll('[data-draft]').length).toBeGreaterThan(0);
});

test('the sheets point to the contact section instead of holding a form', () => {
  const onStart = jest.fn();
  const { unmount } = render(<FreelanceSheet onStartContact={onStart} />);
  expect(document.querySelector('form')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Start a project/ }));
  expect(onStart).toHaveBeenCalledWith('website');
  unmount();

  render(<OpenToWorkSheet onShowResume={() => {}} onStartContact={onStart} />);
  fireEvent.click(screen.getByRole('button', { name: /Get in touch/ }));
  expect(onStart).toHaveBeenLastCalledWith('hiring');
});

test('“Start a project” closes the sheet, then hands over to the contact section', () => {
  const heard = jest.fn();
  window.addEventListener('contact:start', heard);
  render(<HowIllDeliver />);

  fireEvent.click(screen.getByRole('button', { name: '(freelance/contract)' }));
  fireEvent.click(screen.getByRole('button', { name: /Start a project/ }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(heard).toHaveBeenCalledTimes(1);
  expect(heard.mock.calls[0][0].detail).toEqual({ reason: 'after a new website' });
  window.removeEventListener('contact:start', heard);
});

test('“Read my resume” turns the open to work sheet into the hiring manager sheet', () => {
  render(<HowIllDeliver />);
  fireEvent.click(screen.getByRole('button', { name: '(open to work)' }));
  expect(screen.getByRole('heading', { name: 'Open to work' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Read my resume' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('heading', { name: 'Hiring managers' })).toBeInTheDocument();
  // The resume is on top of the pile.
  expect(within(dialog).getByRole('button', { name: 'Read the resume' })).toBeInTheDocument();

  // Closing it returns focus to the label of the sheet now showing.
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: '(hiring manager)' })).toHaveFocus();
});
