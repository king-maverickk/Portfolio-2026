import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import FreelanceSheet from './FreelanceSheet';
import { FREELANCE } from './copy';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

const sectionButton = (name) => screen.getByRole('button', { name: new RegExp(`^${name}`) });

test('the first container holds the sheet title and is always open', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);

  const title = screen.getByRole('heading', { level: 2, name: FREELANCE.title });
  expect(title).toHaveAttribute('id', 'delivery-sheet-title');
  expect(within(title).queryByRole('button')).toBeNull();
  expect(screen.getByText(/For businesses that depend on/)).toBeVisible();
});

test('every other section starts collapsed, with its title showing', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);

  ['Pain points', 'Working together', 'How a project runs', 'Pricing', 'On AI', 'Next steps'].forEach((name) => {
    expect(sectionButton(name)).toHaveAttribute('aria-expanded', 'false');
  });
  // Collapsed content is hidden from assistive tech (and inert in browsers).
  expect(screen.queryByRole('list', { hidden: false })).toBeNull();
});

test('clicking a title opens and closes its section', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);

  fireEvent.click(sectionButton('Pricing'));
  expect(sectionButton('Pricing')).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(FREELANCE.pricing.points[0])).toBeInTheDocument();
  expect(screen.getByRole('list')).toBeInTheDocument();

  fireEvent.click(sectionButton('Pricing'));
  expect(sectionButton('Pricing')).toHaveAttribute('aria-expanded', 'false');
});

test('“See how a project runs” opens that section', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /See how a project runs/ }));
  expect(sectionButton('How a project runs')).toHaveAttribute('aria-expanded', 'true');
});

test('“Start a project” under the headline goes to the contact form', () => {
  const onStart = jest.fn();
  render(<FreelanceSheet onStartContact={onStart} />);
  // The one in "Next steps" is hidden while that section is collapsed.
  expect(screen.getAllByRole('button', { name: /Start a project/ })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /Start a project/ }));
  expect(onStart).toHaveBeenCalledWith('website');
});

test('no “Recent work” section', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);
  expect(screen.queryByText('Recent work')).toBeNull();
});

test('closed rows show a one-line hint', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);
  expect(screen.getByText(FREELANCE.pricing.teaser)).toBeInTheDocument();
  expect(screen.getByText(FREELANCE.process.teaser)).toBeInTheDocument();
});

test('Pain points opens to the card shuffle', () => {
  render(<FreelanceSheet onStartContact={() => {}} />);
  fireEvent.click(sectionButton('Pain points'));
  expect(screen.getByRole('group', { name: `1 of ${FREELANCE.painPoints.items.length}` }))
    .toHaveTextContent(FREELANCE.painPoints.items[0].text);
});
