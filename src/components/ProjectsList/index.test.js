import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectsList from './index';
import PROJECTS from 'components/Projects/projects';

function renderList(props) {
  return render(
    <MemoryRouter>
      <ProjectsList {...props} />
    </MemoryRouter>
  );
}

test('each project is a link to its card on /projects, named by the project alone', () => {
  renderList();
  PROJECTS.slice(0, 5).forEach((project) => {
    // The pictures are decoration, so the link reads as just the name.
    expect(screen.getByRole('link', { name: project.name })).toHaveAttribute('href', `/projects#${project.id}`);
  });
});

test('shows only as many as `limit`, then a button to the full page', () => {
  renderList({ limit: 2 });
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByRole('link', { name: /See all projects/ })).toHaveAttribute('href', '/projects');
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
