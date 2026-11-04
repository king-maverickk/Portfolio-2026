import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingSlideUpText from './index';

test('each card title reads as a whole word, not letter by letter', () => {
  render(<LandingSlideUpText />);
  expect(screen.getByLabelText('Home Page')).toBeInTheDocument();
  expect(screen.getByLabelText('wedding portfolio')).toBeInTheDocument();
  expect(screen.getAllByRole('img')).toHaveLength(4);
});

test('a card with `to` is a link; without it, a plain card', () => {
  const card = { title: 'Home Page', overview: 'Hi', image: '/a.png', alt: 'a' };
  const { MemoryRouter } = require('react-router-dom');
  render(
    <MemoryRouter>
      <LandingSlideUpText cards={[{ ...card, id: 'a', to: '/Home' }, { ...card, id: 'b', title: 'Contact info' }]} />
    </MemoryRouter>
  );
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByRole('link')).toHaveAttribute('href', '/Home');
});
