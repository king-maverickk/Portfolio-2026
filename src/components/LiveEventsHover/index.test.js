import React from 'react';
import { render, screen } from '@testing-library/react';
import LiveEventsHover from './index';

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));
});

test('lists each event with its photo', () => {
  const events = [
    { id: 'a', title: 'Show A', imageUrl: '/a.png' },
    { id: 'b', title: 'Show B', imageUrl: '/b.png' }
  ];
  render(<LiveEventsHover events={events} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByRole('heading', { name: 'Show A' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Show B' })).toHaveAttribute('src', '/b.png');
});
