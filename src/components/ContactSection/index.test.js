import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';

import ContactSection from './index';
import { startContact } from './contactEvents';
import { CONTACT } from 'components/HowIllDeliver/content/copy';

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

afterEach(() => {
  delete global.fetch;
});

function fill(id, value) {
  fireEvent.change(document.getElementById(`contact-${id}`), { target: { value } });
}

function fillBasics() {
  fill('name', 'Ada Lovelace');
  fill('email', 'ada@example.com');
  fill('message', 'Hello there.');
}

async function send() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /^Send/ }));
  });
}

test('starts with only the lines everyone needs; picking a reason brings in its own lines', () => {
  render(<ContactSection />);
  expect(screen.queryByRole('group', { name: 'The role' })).toBeNull();
  expect(screen.queryByRole('group', { name: 'Budget' })).toBeNull();

  fireEvent.click(screen.getByRole('radio', { name: 'after a new website' }));
  expect(screen.getByRole('group', { name: 'What you need help with' })).toBeInTheDocument();
  expect(screen.getByRole('group', { name: 'Budget' })).toBeInTheDocument();
  expect(screen.getByLabelText('Your business')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('radio', { name: 'hiring for a role' }));
  expect(screen.queryByRole('group', { name: 'Budget' })).toBeNull();
  expect(screen.getByRole('group', { name: 'The role' })).toBeInTheDocument();
  expect(screen.getByLabelText('Your company')).toBeInTheDocument();
});

test('won’t send until a reason is picked, and says so', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<ContactSection />);
  fillBasics();
  await send();

  expect(global.fetch).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Pick one to carry on.');
  expect(screen.getByRole('radio', { name: 'hiring for a role' })).toHaveFocus();
});

test('a website enquiry is sent as freelance, with its answers at the top of the message', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<ContactSection />);
  fillBasics();
  fireEvent.click(screen.getByRole('radio', { name: 'after a new website' }));
  fill('organisation', 'Ada Studio');
  fill('currentSite', 'https://old.example.com');
  fireEvent.click(screen.getByRole('checkbox', { name: 'A redesign' }));
  fireEvent.click(screen.getByRole('radio', { name: '$2,500 – 5,000' }));
  await send();

  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({
    kind: 'freelance',
    company: '',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    currentSite: 'https://old.example.com',
    message: 'Writing about: after a new website\nBusiness: Ada Studio\nHelp with: A redesign\nBudget: $2,500 – 5,000\n\nHello there.'
  });
  expect(screen.getByRole('status')).toHaveTextContent('Thanks, Ada.');
});

test('a hiring message is sent as hiring, and leaves out answers from the website lines', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<ContactSection />);
  fillBasics();

  // Started down the website path, then switched.
  fireEvent.click(screen.getByRole('radio', { name: 'after a new website' }));
  fill('currentSite', 'https://old.example.com');
  fireEvent.click(screen.getByRole('radio', { name: 'hiring for a role' }));
  fill('organisation', 'Northwind');
  fireEvent.click(screen.getByRole('checkbox', { name: 'UI/UX design' }));
  await send();

  const body = JSON.parse(global.fetch.mock.calls[0][1].body);
  expect(body.kind).toBe('hiring');
  expect(body.currentSite).toBe('');
  expect(body.message).toBe('Writing about: hiring for a role\nCompany: Northwind\nRole: UI/UX design\n\nHello there.');
});

test('if sending fails, the visitor gets a ready-written email instead', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
  render(<ContactSection />);
  fillBasics();
  fireEvent.click(screen.getByRole('radio', { name: 'hiring for a role' }));
  await send();

  const link = within(screen.getByRole('alert')).getByRole('link', { name: /Send it as an email instead/ });
  expect(link.getAttribute('href')).toMatch(`mailto:${CONTACT.email}?subject=Message%20from%20Ada%20Lovelace`);
  expect(link.getAttribute('href')).toContain(encodeURIComponent('Hello there.'));
});

test('a sheet’s button scrolls here with its answer already picked', () => {
  render(<ContactSection />);
  act(() => startContact('website'));

  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  expect(screen.getByRole('radio', { name: 'after a new website' })).toBeChecked();
  expect(screen.getByRole('group', { name: 'Budget' })).toBeInTheDocument();
});

test('shows the ways to reach you', () => {
  render(<ContactSection />);
  expect(screen.getByRole('link', { name: CONTACT.email })).toHaveAttribute('href', `mailto:${CONTACT.email}`);
  expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', CONTACT.linkedin);
});
