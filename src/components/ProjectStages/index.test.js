import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProjectStages from './index';
import homeProject from './projectStages';

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
});

function renderStages() {
  return render(
    <MemoryRouter>
      <ProjectStages project={homeProject} />
    </MemoryRouter>
  );
}

test('the whole Motion tile is a link to the Lab', () => {
  renderStages();
  const link = screen.getByRole('link', { name: 'Open the Lab' });
  expect(link).toHaveAttribute('href', '/lab');
  expect(link.closest('[data-index]')).toHaveAttribute('data-index', '2');
});

test('Lab cards wait behind the Motion tile and come out when Motion is the active stage', () => {
  const { container } = renderStages();
  const wrap = container.querySelector('[class*="tileWrap"]');
  const cards = wrap.querySelectorAll('[class*="peekCard"]');

  expect(cards).toHaveLength(homeProject.stages[2].peek.length);
  // Decoration only: hidden from screen readers and out of the tab order.
  expect(wrap.querySelector('[class*="peek"]')).toHaveAttribute('aria-hidden', 'true');
  cards.forEach((card) => expect(card).toHaveAttribute('tabindex', '-1'));
  expect(wrap.className).not.toMatch(/tileWrapActive/);

  fireEvent.click(screen.getByRole('button', { name: 'Motion' }));
  expect(wrap.className).toMatch(/tileWrapActive/);
});
