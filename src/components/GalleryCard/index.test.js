import React from 'react';
import { render, screen } from '@testing-library/react';
import GalleryCard from './index';

test('shows up to four albums with their date, title and item count', () => {
  const items = Array.from({ length: 6 }, (_, index) => ({
    id: `album-${index}`,
    date: 'april, 2026',
    title: `Album ${index}`,
    itemCount: '12 items'
  }));
  render(<GalleryCard items={items} />);

  expect(screen.getByText('Album 0')).toBeInTheDocument();
  expect(screen.getByText('Album 3')).toBeInTheDocument();
  expect(screen.queryByText('Album 4')).toBeNull();
  expect(screen.getAllByText('12 items')).toHaveLength(4);
});

test('a card without a video renders no video element', () => {
  const { container } = render(
    <GalleryCard items={[{ id: 'a', date: 'may', title: 'No clip', itemCount: '1 item' }]} />
  );
  expect(container.querySelector('video')).toBeNull();
});
