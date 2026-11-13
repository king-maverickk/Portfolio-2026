import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectsList from './index';
import PROJECTS from 'components/Projects/projects';
import UNFINISHED from 'components/Projects/unfinishedWork';

function renderList(props) {
  return render(
    <MemoryRouter>
      <ProjectsList {...props} />
    </MemoryRouter>
  );
}

test('each project links to its own page, named by the project alone', () => {
  renderList();
  PROJECTS.slice(0, 5).forEach((project) => {
    // The pictures are decoration, so the link reads as just the name.
    expect(screen.getByRole('link', { name: project.name })).toHaveAttribute('href', `/projects/${project.id}`);
  });
});

test('shows only as many as `limit`, then a button to the full page', () => {
  renderList({ limit: 2, showUnfinished: false });
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByRole('link', { name: /See all projects/ })).toHaveAttribute('href', '/projects');
});

test('the home list ends with one “Unfinished” row that goes to that section of /projects', () => {
  renderList();
  const row = screen.getByRole('link', { name: `Unfinished work, ${UNFINISHED.length} entries` });
  expect(row).toHaveAttribute('href', '/projects#unfinished');
  expect(row).toHaveTextContent(`Unfinished${UNFINISHED.length}`);
  // After the projects, as the last row of the same list.
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(PROJECTS.length + 1);
  expect(items[items.length - 1]).toContainElement(row);
});

test('unfinished work is not listed among the projects', () => {
  renderList();
  ['Milk & Honey TV', 'Virtual Guitar'].forEach((name) => {
    expect(screen.queryByRole('link', { name })).not.toBeInTheDocument();
  });
});

test('`showUnfinished={false}` leaves the row out (the /projects page has the section instead)', () => {
  renderList({ showUnfinished: false });
  expect(screen.queryByRole('link', { name: /Unfinished/ })).not.toBeInTheDocument();
});

describe('on touch screens', () => {
  let observed;
  let fire;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      // No hover, no reduced motion.
      matches: false,
      media: query,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {}
    }));
    observed = [];
    window.IntersectionObserver = jest.fn((callback, options) => {
      if (options && options.rootMargin) fire = callback;
      return {
        observe: (element) => observed.push(element),
        disconnect: () => {},
        unobserve: () => {}
      };
    });
  });

  afterEach(() => {
    delete window.IntersectionObserver;
  });

  test('the row in the middle of the screen gets the hover look, and the rest dim', () => {
    const { act } = require('@testing-library/react');
    renderList();
    const rows = screen.getAllByRole('link').filter((link) => link.hasAttribute('data-row'));

    act(() => fire([{ target: rows[2], isIntersecting: true }]));
    expect(rows[2].className).toMatch(/rowCentred/);
    expect(rows[2].closest('ul').className).toMatch(/listHasCentred/);
    expect(rows[0].className).not.toMatch(/rowCentred/);

    // Scrolled past it: nothing in the middle, nothing dimmed.
    act(() => fire([{ target: rows[2], isIntersecting: false }]));
    expect(rows[2].closest('ul').className).not.toMatch(/listHasCentred/);
  });
});
