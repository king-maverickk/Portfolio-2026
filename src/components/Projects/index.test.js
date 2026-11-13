import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import Projects from './index';
import PROJECTS, { findProject } from './projects';
import UNFINISHED from './unfinishedWork';

jest.mock('components/DotGrid', () => () => null);

beforeEach(() => {
  window.scrollTo = jest.fn();
  window.sessionStorage.clear();
  window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = jest.fn();
});

function renderAt(path) {
  let location;
  render(
    <MemoryRouter initialEntries={[path]}>
      <Route path="/projects/:id?" component={Projects} />
      <Route render={(props) => { location = props.location; return null; }} />
    </MemoryRouter>
  );
  return () => location;
}

test('/projects opens like the Lab, then lists every project with its own address', () => {
  renderAt('/projects');
  expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');

  const list = screen.getByRole('region', { name: 'Projects' });
  PROJECTS.forEach((project) => {
    expect(within(list).getByRole('link', { name: project.name })).toHaveAttribute('href', `/projects/${project.id}`);
  });
});

test('/projects opens at the top, wherever the page before was scrolled to', () => {
  renderAt('/projects');
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

test('/projects#unfinished goes to the Unfinished section instead of the top', () => {
  Element.prototype.scrollIntoView = jest.fn();
  renderAt('/projects#unfinished');
  expect(window.scrollTo).not.toHaveBeenCalledWith(0, 0);
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(document.getElementById('unfinished'));
  delete Element.prototype.scrollIntoView;
});

test('coming back from a project, the list keeps its place instead of jumping to the top', () => {
  const [project] = PROJECTS;
  const at = Date.now();
  window.sessionStorage.setItem('projects:return', JSON.stringify({ origin: 'projects', id: project.id, y: 1234, at }));
  window.sessionStorage.setItem('projects:heading', JSON.stringify({ id: project.id, rect: { left: 0, top: 0, width: 10, height: 10 }, at }));
  renderAt('/projects');
  expect(window.scrollTo).toHaveBeenCalledWith(0, 1234);
  expect(window.scrollTo).not.toHaveBeenCalledWith(0, 0);
});

test('/projects ends with the Unfinished section, one row per entry, all closed', () => {
  renderAt('/projects');
  const section = screen.getByRole('region', { name: 'Unfinished' });
  expect(within(section).getAllByRole('listitem').filter((item) => item.id.startsWith('unfinished-'))).toHaveLength(UNFINISHED.length);
  expect(within(section).getByRole('button', { name: /Entelect Challenge 2024/ })).toHaveAttribute('aria-expanded', 'false');
  // Unfinished work is not in the big list above.
  const list = screen.getByRole('region', { name: 'Projects' });
  expect(within(list).queryByRole('link', { name: /Unfinished/ })).not.toBeInTheDocument();
  expect(within(list).queryByRole('link', { name: 'Virtual Guitar' })).not.toBeInTheDocument();
});

test('/projects#unfinished lands on the Unfinished section', () => {
  Element.prototype.scrollIntoView = jest.fn();
  renderAt('/projects#unfinished');
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(screen.getByRole('region', { name: 'Unfinished' }));
  delete Element.prototype.scrollIntoView;
});

test('the old pages of projects that moved to Unfinished go to their row there', () => {
  Element.prototype.scrollIntoView = jest.fn();
  const location = renderAt('/projects/virtual-guitar');
  expect(location().pathname).toBe('/projects');
  expect(location().hash).toBe('#unfinished-virtual-guitar');
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(document.getElementById('unfinished-virtual-guitar'));
  delete Element.prototype.scrollIntoView;
});

test('an address that was never a project goes back to the list', () => {
  const location = renderAt('/projects/not-a-project');
  expect(location().pathname).toBe('/projects');
  expect(location().hash).toBe('');
});

test('clicking a project goes to its page', async () => {
  const location = renderAt('/projects');
  fireEvent.click(screen.getByRole('link', { name: 'Living Histories' }));
  expect(await screen.findByRole('heading', { level: 1, name: 'Living Histories' })).toBeInTheDocument();
  expect(location().pathname).toBe('/projects/living-histories');
});

test('Living Histories tells its story top to bottom, with no media swap', () => {
  renderAt('/projects/living-histories');
  expect(screen.getByRole('heading', { level: 2, name: 'My role' })).toBeInTheDocument();
  expect(screen.getByRole('article', { name: 'The full story' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Show the media for/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Project context' })).not.toBeInTheDocument();
});

test('a project page: heading, context, tools and style', () => {
  const project = findProject('photos-by-alex');
  renderAt('/projects/photos-by-alex');

  expect(screen.getByRole('heading', { level: 1, name: project.name })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Project context' })).toBeInTheDocument();
  // Real logos are named for screen readers; tools without one are plain text.
  const tools = screen.getAllByRole('region', { name: 'Built with' })[0];
  expect(within(tools).getByRole('img', { name: 'React' })).toBeInTheDocument();
  expect(within(tools).getByText('Azure')).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Colours' })).toHaveTextContent(project.style.colors[0]);
  expect(screen.getByRole('list', { name: 'Typefaces' })).toHaveTextContent(project.style.fonts[0]);
});

test('the box on the right swaps between the overview and the media, and back', async () => {
  const project = findProject('photos-by-alex');
  renderAt('/projects/photos-by-alex');

  fireEvent.click(screen.getByRole('button', { name: `Show the media for ${project.name}` }));
  const card = await screen.findByRole('button', { name: `Back to the overview of ${project.name}` });
  expect(screen.getByRole('region', { name: 'Project context', hidden: true })).not.toBeVisible();
  expect(screen.getAllByRole('list', { name: 'Project media' }).some((list) => list.closest('[hidden]') === null)).toBe(true);

  fireEvent.click(card);
  expect(await screen.findByRole('button', { name: `Show the media for ${project.name}` })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Project context' })).toBeVisible();
});

test('Esc, the heading and “All projects” all go back to the list', async () => {
  const location = renderAt('/projects/living-histories');
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(await screen.findByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  expect(location().pathname).toBe('/projects');

  // The heading on a project page is itself a link back.
  fireEvent.click(screen.getByRole('link', { name: 'Living Histories' }));
  const heading = await screen.findByRole('heading', { level: 1, name: 'Living Histories' });
  fireEvent.click(within(heading).getByRole('link'));
  expect(await screen.findByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: 'Living Histories' }));
  fireEvent.click(await screen.findByRole('link', { name: 'All projects' }));
  expect(await screen.findByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
});

test('an unknown project goes back to the list', () => {
  const location = renderAt('/projects/not-a-project');
  expect(location().pathname).toBe('/projects');
  expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
});
