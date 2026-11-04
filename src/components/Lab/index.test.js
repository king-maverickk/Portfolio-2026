import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Lab from './index';
import LAB_ITEMS from './labItems';
import DEMOS from './demos';

// The dot grid draws on a canvas, which jsdom doesn't have.
jest.mock('components/DotGrid', () => () => null);

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.scrollTo = jest.fn();
});

function renderLab() {
  return render(
    <MemoryRouter>
      <Lab />
    </MemoryRouter>
  );
}

test('every live item points at a demo that exists, every recording at a video', () => {
  LAB_ITEMS.forEach((item) => {
    if (item.kind === 'live') expect(DEMOS[item.demo]).toBeDefined();
    else expect(item.video).toMatch(/^\/assets\/.+\.(mp4|webm)$/);
  });
});

test('shows every piece, then filters to live demos and to recordings', () => {
  renderLab();
  const list = screen.getByRole('list', { name: 'Lab pieces' });
  const live = LAB_ITEMS.filter((item) => item.kind === 'live').length;

  expect(within(list).getAllByRole('listitem')).toHaveLength(LAB_ITEMS.length);

  fireEvent.click(screen.getByRole('button', { name: /^Live/ }));
  expect(within(list).getAllByRole('listitem')).toHaveLength(live);
  expect(screen.getByRole('button', { name: /^Live/ })).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(screen.getByRole('button', { name: /^Recordings/ }));
  expect(within(list).getAllByRole('listitem')).toHaveLength(LAB_ITEMS.length - live);
});

test('links back home', () => {
  renderLab();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
});

test('the stage pills demo moves to the stage you pick', () => {
  renderLab();
  const motion = screen.getAllByRole('button', { name: 'Motion' })[0];
  fireEvent.click(motion);
  expect(motion).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Interaction and motion bring it to life.')).toBeInTheDocument();
});
