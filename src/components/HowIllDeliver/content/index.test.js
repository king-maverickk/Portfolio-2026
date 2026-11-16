import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render as rtlRender, screen, within } from '@testing-library/react';

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
  test('resume first, open letter one tab away', () => {
    render(<HiringManagerSheet />);

    expect(screen.getByRole('tab', { name: 'Resume' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('article', { name: 'Resume' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Open letter' }));
    expect(screen.getByRole('article', { name: 'Open letter' })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Resume' })).not.toBeInTheDocument();

    // Arrow keys move between the tabs too.
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Open letter' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Resume' })).toHaveFocus();
    expect(screen.getByRole('article', { name: 'Resume' })).toBeInTheDocument();
  });

  test('the page shows its top; a click on it, or its button, opens the rest', () => {
    render(<HiringManagerSheet />);
    const { closedHint, openHint } = HIRING.documents;

    const toggle = screen.getByRole('button', { name: closedHint });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // A click on the page itself opens it.
    fireEvent.click(screen.getByRole('article', { name: 'Resume' }));
    expect(screen.getByRole('button', { name: openHint })).toHaveAttribute('aria-expanded', 'true');

    // The button folds it back, and opens it again.
    fireEvent.click(screen.getByRole('button', { name: openHint }));
    expect(screen.getByRole('button', { name: closedHint })).toHaveAttribute('aria-expanded', 'false');
  });

  test('a link inside the closed page still works as a link, and tabbing into the page opens it', () => {
    render(<HiringManagerSheet />);
    const email = screen.getByRole('link', { name: CONTACT.email });

    fireEvent.click(email);
    expect(screen.getByRole('button', { name: HIRING.documents.closedHint })).toBeInTheDocument();

    fireEvent.focus(email);
    expect(screen.getByRole('button', { name: HIRING.documents.openHint })).toBeInTheDocument();
  });

  test('no Download button until a PDF is set in copy.js', () => {
    render(<HiringManagerSheet />);
    expect(Boolean(screen.queryByRole('link', { name: /Download PDF/ }))).toBe(Boolean(HIRING.documents.resume.pdf));
  });

  test('picking a role moves the highlight', () => {
    render(<HiringManagerSheet />);
    const roles = within(screen.getByRole('group', { name: HIRING.roles.title }));

    expect(roles.getByRole('button', { name: /Interaction design/ })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(roles.getByRole('button', { name: /Front-end development/ }));
    expect(roles.getByRole('button', { name: /Front-end development/ })).toHaveAttribute('aria-pressed', 'true');
    expect(roles.getByRole('button', { name: /Interaction design/ })).toHaveAttribute('aria-pressed', 'false');
  });

  test('Online: the two profile cards, each with one link', () => {
    render(<HiringManagerSheet />);
    const online = within(screen.getByRole('region', { name: /^Online/ }));
    const { linkedin, github } = HIRING.online;

    expect(online.getByRole('link', { name: linkedin.cta })).toHaveAttribute('href', linkedin.href);
    expect(online.getByRole('link', { name: github.handle })).toHaveAttribute('href', github.href);
    expect(online.getAllByRole('link')).toHaveLength(2);

    // "Open to Work" and "Skills" are words on the card, not links.
    linkedin.notes.forEach((note) => expect(online.getByText(note).closest('a')).toBeNull());
    github.stats.forEach(({ value }) => expect(online.getByText(value)).toBeInTheDocument());
  });

  test('Proof starts open: one card per scenario, each leading to its project', () => {
    render(<HiringManagerSheet />);
    const { scenarios } = HIRING.proof;

    expect(screen.getByRole('button', { name: /^Proof/ })).toHaveAttribute('aria-expanded', 'true');
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
  expect(within(dialog).getByRole('article', { name: 'Resume' })).toBeInTheDocument();

  // Closing it returns focus to the label of the sheet now showing.
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: '(hiring manager)' })).toHaveFocus();
});
