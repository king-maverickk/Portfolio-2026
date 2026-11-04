import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Projects from './index';
import PROJECTS from './projects';

jest.mock('components/DotGrid', () => () => null);

beforeEach(() => {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

test('opens like the Lab, then shows every project as a card', () => {
  render(<MemoryRouter initialEntries={['/projects']}><Projects /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');

  const list = screen.getByRole('list', { name: 'Projects' });
  expect(list.querySelectorAll(':scope > li')).toHaveLength(PROJECTS.length);
  expect(within(list).getByRole('heading', { name: 'Living Histories' })).toBeInTheDocument();
});

test('arriving from a name on the home page goes to that card and lights it up', () => {
  render(<MemoryRouter initialEntries={['/projects#living-histories']}><Projects /></MemoryRouter>);
  const card = document.getElementById('living-histories');
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  expect(card).toHaveAttribute('data-arrived');
});
