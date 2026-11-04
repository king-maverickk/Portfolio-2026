import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

import HowIllDeliver from '../index';
import HiringManagerSheet from './HiringManagerSheet';
import FreelanceSheet from './FreelanceSheet';
import OpenToWorkSheet from './OpenToWorkSheet';
import { CONTACT } from './copy';

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
});

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
  render(<FreelanceSheet onStartContact={() => {}} />);
  expect(document.querySelectorAll('[data-draft]').length).toBeGreaterThan(0);
});

test('the sheets point to the contact section instead of holding a form', () => {
  const onStart = jest.fn();
  const { unmount } = render(<FreelanceSheet onStartContact={onStart} />);
  expect(document.querySelector('form')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Start a project/ }));
  expect(onStart).toHaveBeenCalledWith('website');
  unmount();

  render(<OpenToWorkSheet onShowResume={() => {}} onStartContact={onStart} />);
  fireEvent.click(screen.getByRole('button', { name: /Get in touch/ }));
  expect(onStart).toHaveBeenLastCalledWith('hiring');
});

test('“Start a project” closes the sheet, then hands over to the contact section', () => {
  const heard = jest.fn();
  window.addEventListener('contact:start', heard);
  render(<HowIllDeliver />);

  fireEvent.click(screen.getByRole('button', { name: '(freelance/contract)' }));
  fireEvent.click(screen.getByRole('button', { name: /Start a project/ }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(heard).toHaveBeenCalledTimes(1);
  expect(heard.mock.calls[0][0].detail).toEqual({ reason: 'after a new website' });
  window.removeEventListener('contact:start', heard);
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
