import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';

import HowIllDeliver from '../index';
import HiringManagerSheet from './HiringManagerSheet';
import FreelanceSheet from './FreelanceSheet';
import OpenToWorkSheet from './OpenToWorkSheet';
import { CONTACT } from './copy';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  delete global.fetch;
});

function fillForm(prefix = 'freelance') {
  fireEvent.change(document.getElementById(`${prefix}-name`), { target: { value: 'Ada Lovelace' } });
  fireEvent.change(document.getElementById(`${prefix}-email`), { target: { value: 'ada@example.com' } });
  fireEvent.change(document.getElementById(`${prefix}-message`), { target: { value: 'A site for my studio.' } });
}

test('hiring manager sheet: resume first, cover letter one tab away', () => {
  render(<HiringManagerSheet />);

  expect(screen.getByRole('tab', { name: 'Resume' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('article', { name: 'Resume' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: 'Cover letter' }));
  expect(screen.getByRole('article', { name: 'Cover letter' })).toBeInTheDocument();
  expect(screen.queryByRole('article', { name: 'Resume' })).not.toBeInTheDocument();

  // Arrow keys move between the tabs too.
  fireEvent.keyDown(screen.getByRole('tab', { name: 'Cover letter' }), { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: 'Resume' })).toHaveFocus();
  expect(screen.getByRole('article', { name: 'Resume' })).toBeInTheDocument();
});

test('hiring manager sheet links to LinkedIn and email, and hides GitHub until it has a URL', () => {
  render(<HiringManagerSheet />);
  expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', CONTACT.linkedin);
  expect(screen.getByRole('link', { name: /Email/ })).toHaveAttribute('href', `mailto:${CONTACT.email}`);
  expect(screen.queryByRole('link', { name: /GitHub/ })).toBeNull();
});

test('draft copy is tagged outside production', () => {
  render(<FreelanceSheet />);
  expect(document.querySelectorAll('[data-draft]').length).toBeGreaterThan(0);
});

test('freelance form posts the enquiry to /api/contact and thanks the sender', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<FreelanceSheet />);

  fillForm();
  fireEvent.change(document.getElementById('freelance-site'), { target: { value: 'https://old.example.com' } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
  });

  expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }));
  const body = JSON.parse(global.fetch.mock.calls[0][1].body);
  expect(body).toEqual({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    currentSite: 'https://old.example.com',
    message: 'A site for my studio.',
    company: '',
    kind: 'freelance'
  });
  expect(screen.getByRole('status')).toHaveTextContent('Thanks, Ada.');
});

test('when sending fails the visitor gets a ready-written email instead', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
  render(<FreelanceSheet />);

  fillForm();
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Send enquiry' }));
  });

  const alert = screen.getByRole('alert');
  const fallback = within(alert).getByRole('link', { name: /Send it as an email instead/ });
  expect(fallback.getAttribute('href')).toMatch(`mailto:${CONTACT.email}?subject=Project%20enquiry%20from%20Ada%20Lovelace`);
  expect(fallback.getAttribute('href')).toContain(encodeURIComponent('A site for my studio.'));
});

test('open to work: the form is sent as a hiring message', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  render(<OpenToWorkSheet onShowResume={() => {}} />);

  fillForm('open-to-work');
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  });
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).kind).toBe('hiring');
});

test('“Read my resume” turns the open to work sheet into the hiring manager sheet', () => {
  render(<HowIllDeliver />);
  fireEvent.click(screen.getByRole('button', { name: '(open to work)' }));
  expect(screen.getByRole('heading', { name: 'Open to work' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Read my resume' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('heading', { name: 'Hiring managers' })).toBeInTheDocument();
  expect(within(dialog).getByRole('article', { name: 'Resume' })).toBeInTheDocument();

  // Closing it returns focus to the label of the sheet now showing.
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: '(hiring manager)' })).toHaveFocus();
});
