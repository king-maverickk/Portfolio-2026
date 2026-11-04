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
