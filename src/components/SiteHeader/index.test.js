import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

import SiteHeader from './index';
import { AUDIENCES, NAV } from './menu';
import { CONTACT_EVENT, takeContactRequest } from 'components/ContactSection/contactEvents';
import { DELIVERY_EVENT, takeDeliveryRequest } from 'components/HowIllDeliver/deliveryEvents';
import { CONTACT } from 'components/HowIllDeliver/content/copy';

beforeEach(() => {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
  document.body.style.overflow = '';
  takeContactRequest();
  takeDeliveryRequest();
});

function renderAt(path = '/') {
  let location;
  render(
    <MemoryRouter initialEntries={[path]}>
      <SiteHeader />
      <Route render={(props) => { location = props.location; return null; }} />
    </MemoryRouter>
  );
  return () => location;
}

const menuButton = () => screen.getByRole('button', { name: 'Open the menu' });
const audienceButton = () => screen.getByRole('button', { name: /^Who are you\?/ });
const dialog = () => screen.getByRole('dialog', { name: 'Menu' });

test('closed: the mark goes home and the two corner buttons wait', () => {
  renderAt('/projects');

  expect(screen.getByRole('link', { name: 'motheo moleko, home' })).toHaveAttribute('href', '/');
  expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  expect(audienceButton()).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('the menu button opens the menu: five links, the page you are on marked', () => {
  renderAt('/projects');
  fireEvent.click(menuButton());

  const nav = within(dialog()).getByRole('navigation', { name: 'Site' });
  const links = within(nav).getAllByRole('link');
  expect(links.map((link) => link.textContent)).toEqual(NAV.map((item) => item.label));
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/', '/projects', '/projects#unfinished', '/lab', '/#contact'
  ]);

  expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  expect(within(nav).getAllByRole('link', { current: 'page' })).toHaveLength(1);
  // The keyboard starts in the menu, and the page behind stops scrolling.
  expect(links[0]).toHaveFocus();
  expect(document.body.style.overflow).toBe('hidden');
  expect(dialog()).toHaveAttribute('data-first', 'menu');
});

test.each([
  ['/', 'Home'],
  ['/projects/living-histories', 'Projects'],
  ['/projects#unfinished-entelect-challenge-2024', 'Unfinished'],
  ['/lab', 'Lab']
])('at %s the menu marks %s', (path, label) => {
  renderAt(path);
  fireEvent.click(menuButton());
  expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(label);
});

test('the “who are you?” button opens the same thing, starting with the three cards', () => {
  renderAt('/');
  fireEvent.click(audienceButton());

  const cards = AUDIENCES.map(({ title }) => within(dialog()).getByRole('button', { name: new RegExp(`^${title}`) }));
  expect(cards).toHaveLength(3);
  expect(cards[0]).toHaveFocus();
  expect(cards[0]).toHaveTextContent('(hiring manager)');
  expect(dialog()).toHaveAttribute('data-first', 'audience');
  expect(within(dialog()).getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
});

test('Esc, the close button and a click on the dimmed page all close it; focus goes back', () => {
  renderAt('/');

  fireEvent.click(menuButton());
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(menuButton()).toHaveFocus();
  expect(document.body.style.overflow).toBe('');

  fireEvent.click(audienceButton());
  fireEvent.click(screen.getByRole('button', { name: 'Close the menu' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(audienceButton()).toHaveFocus();

  fireEvent.click(menuButton());
  fireEvent.click(document.querySelector('[class*="dim"]'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('Tab stays inside the open menu', () => {
  renderAt('/');
  fireEvent.click(menuButton());

  const stops = Array.from(dialog().querySelectorAll('a[href], button'));
  const first = stops[0];
  const last = stops[stops.length - 1];

  last.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(first).toHaveFocus();

  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(last).toHaveFocus();
});

test('following a link closes the menu and goes there', () => {
  const location = renderAt('/');
  fireEvent.click(menuButton());
  fireEvent.click(screen.getByRole('link', { name: 'Lab' }));

  expect(location().pathname).toBe('/lab');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

test('“Unfinished” goes to that part of /projects (and scrolls there if you already are)', () => {
  const location = renderAt('/lab');
  fireEvent.click(menuButton());
  fireEvent.click(screen.getByRole('link', { name: 'Unfinished' }));
  expect(location().pathname).toBe('/projects');
  expect(location().hash).toBe('#unfinished');

  const section = document.createElement('section');
  section.id = 'unfinished';
  document.body.appendChild(section);
  fireEvent.click(menuButton());
  fireEvent.click(screen.getByRole('link', { name: 'Unfinished' }));
  expect(section.scrollIntoView).toHaveBeenCalled();
  section.remove();
});

test.each(['Contact', 'Let’s talk'])('“%s” goes home and asks for the contact form', (name) => {
  const asked = jest.fn();
  window.addEventListener(CONTACT_EVENT, asked);

  const location = renderAt('/lab');
  fireEvent.click(menuButton());
  fireEvent.click(screen.getByRole('link', { name }));

  expect(location().pathname).toBe('/');
  expect(location().hash).toBe('#contact');
  expect(asked).toHaveBeenCalledTimes(1);
  // The home page isn't up yet when the request is made: it waits.
  expect(takeContactRequest()).toEqual({ reason: undefined });

  window.removeEventListener(CONTACT_EVENT, asked);
});

test('a card asks for its sheet once the menu has closed', () => {
  const asked = jest.fn(() => {
    // By now the menu is gone and the page scrolls again.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
  window.addEventListener(DELIVERY_EVENT, asked);

  const location = renderAt('/');
  fireEvent.click(audienceButton());
  fireEvent.click(screen.getByRole('button', { name: /^Freelance \/ contract/ }));

  expect(asked).toHaveBeenCalledTimes(1);
  expect(takeDeliveryRequest()).toEqual(expect.objectContaining({ id: 'freelance', returnFocus: audienceButton() }));
  expect(location().pathname).toBe('/');

  window.removeEventListener(DELIVERY_EVENT, asked);
});

test('from another page, a card goes home first', () => {
  const location = renderAt('/projects/living-histories');
  fireEvent.click(menuButton());
  fireEvent.click(screen.getByRole('button', { name: /^Open to work/ }));

  expect(location().pathname).toBe('/');
  expect(takeDeliveryRequest()).toEqual(expect.objectContaining({ id: 'open-to-work' }));
});

test('“Elsewhere” lists only the places that are filled in', () => {
  renderAt('/');
  fireEvent.click(menuButton());

  expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', CONTACT.linkedin);
  expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', `mailto:${CONTACT.email}`);
  expect(Boolean(screen.queryByRole('link', { name: 'GitHub' }))).toBe(Boolean(CONTACT.github));
});

test('opening the address /#contact brings up the contact form', () => {
  const asked = jest.fn();
  window.addEventListener(CONTACT_EVENT, asked);
  act(() => { renderAt('/#contact'); });
  expect(asked).toHaveBeenCalledTimes(1);
  window.removeEventListener(CONTACT_EVENT, asked);
});
