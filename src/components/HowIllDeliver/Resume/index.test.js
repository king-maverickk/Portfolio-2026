import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Resume from './index';
import resume from './resumeData';

test('shows the name, headline and working contact links', () => {
  render(<Resume />);

  expect(screen.getByRole('heading', { name: 'Motheo Moleko' })).toBeInTheDocument();
  expect(screen.getByText(resume.headline)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: resume.email })).toHaveAttribute('href', `mailto:${resume.email}`);

  const linkedin = screen.getByRole('link', { name: resume.linkedin.label });
  expect(linkedin).toHaveAttribute('href', resume.linkedin.href);
  expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('has the standard sections in order', () => {
  render(<Resume />);

  const headings = screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent);
  expect(headings).toEqual([
    'Professional summary',
    'Languages & technologies',
    'Work experience',
    'Projects',
    'Education'
  ]);
});

test('lists every job, project and education entry with its dates and bullets', () => {
  render(<Resume />);

  [...resume.experience, ...resume.projects, ...resume.education].forEach((entry) => {
    expect(screen.getByText(entry.title)).toBeInTheDocument();
    expect(screen.getAllByText(entry.dates).length).toBeGreaterThan(0);
    (entry.bullets || []).forEach((bullet) => expect(screen.getByText(bullet)).toBeInTheDocument());
  });
});

test('skills are labelled lines inside the skills section', () => {
  render(<Resume />);
  const section = screen.getByRole('region', { name: 'Languages & technologies' });

  expect(within(section).getAllByRole('listitem')).toHaveLength(resume.skills.length);
  expect(within(section).getByText('Cloud:')).toBeInTheDocument();
});
