import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingSlideUpText from './index';

test('each card title reads as a whole word, not letter by letter', () => {
  render(<LandingSlideUpText />);
  expect(screen.getByLabelText('Home Page')).toBeInTheDocument();
  expect(screen.getByLabelText('wedding portfolio')).toBeInTheDocument();
  expect(screen.getAllByRole('img')).toHaveLength(4);
});
