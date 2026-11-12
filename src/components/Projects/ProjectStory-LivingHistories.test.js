import React from 'react';
import { render, screen, within } from '@testing-library/react';

import ProjectStoryLivingHistories from './ProjectStory-LivingHistories';
import LIVING_HISTORIES_STORY from './stories/livingHistories';

function renderStory() {
  return render(<ProjectStoryLivingHistories story={LIVING_HISTORIES_STORY} />);
}

test('opens with the sentence, then Type, Team and Media', () => {
  renderStory();
  // The words are split around the small pictures, so read the whole paragraph.
  const lede = screen.getByText((_, element) => element.tagName === 'P' && /A phone-first map that finds where you are/.test(element.textContent));
  expect(lede).toHaveTextContent(/suggests events from the past 80 years around you/);
  expect(lede).toHaveTextContent(/two-voice\s+podcast episode\./);

  expect(screen.getByText('Hackathon, then personal project · 2025 – 2026')).toBeInTheDocument();
  expect(screen.getByText('Lesibana Ngoepe')).toBeInTheDocument();
  expect(screen.getByText('Motheo Moleko')).toBeInTheDocument();
  expect(screen.getByText('Finished 3rd')).toBeInTheDocument();
});

test('the Photos and YouTube chips link out in a new tab', () => {
  renderStory();
  const photos = screen.getByRole('link', { name: /Photos/ });
  expect(photos).toHaveAttribute('href', expect.stringContaining('flickr.com/photos/geekulcha'));
  expect(photos).toHaveAttribute('target', '_blank');
  expect(photos.getAttribute('rel')).toMatch(/noopener/);

  const video = screen.getByRole('link', { name: /YouTube/ });
  expect(video).toHaveAttribute('href', expect.stringContaining('youtube.com/watch?v=YwHBtCoK-wE'));
  expect(video).toHaveAttribute('target', '_blank');
  expect(video.getAttribute('rel')).toMatch(/noopener/);
});

test('Lesibana links to his LinkedIn, and both chips show photos', () => {
  renderStory();
  const lesibana = screen.getByRole('link', { name: /Lesibana Ngoepe/ });
  expect(lesibana).toHaveAttribute('href', 'https://www.linkedin.com/in/lesibana-ngoepe-junior-software-developer/');
  expect(lesibana).toHaveAttribute('target', '_blank');
  expect(lesibana.getAttribute('rel')).toMatch(/noopener/);
  expect(lesibana.querySelector('img')).toHaveAttribute('src', '/assets/Home/lesibana_ngoepe.webp');

  const me = screen.getByText('Motheo Moleko').closest('li');
  expect(me.querySelector('img')).toHaveAttribute('src', '/assets/Home/my-face.png');
  expect(me).not.toHaveTextContent('MM');
});

test('Status says the app is live and links to it in a new tab', () => {
  renderStory();
  expect(screen.getByText('Status', { selector: 'dt' })).toBeInTheDocument();
  const app = screen.getByRole('link', { name: /Live Prototype \(rough\)/ });
  expect(app).toHaveAttribute('href', 'https://red-bush-085e4ea10.3.azurestaticapps.net/');
  expect(app).toHaveAttribute('target', '_blank');
  expect(app.getAttribute('rel')).toMatch(/noopener/);
});

test('My role: one card for the hackathon, one for afterwards', () => {
  renderStory();
  const roles = screen.getByRole('region', { name: 'My role' });

  const hackathon = within(roles).getByRole('heading', { name: 'At the hackathon' }).closest('li');
  ['Backend', 'Cloud deployment', 'Pitch, presentation & speech'].forEach((label) => {
    expect(within(hackathon).getByText(label)).toBeInTheDocument();
  });

  const afterwards = within(roles).getByRole('heading', { name: 'Afterwards' }).closest('li');
  ['Backend & Azure', 'React front end', 'UI redesign in Figma'].forEach((label) => {
    expect(within(afterwards).getByText(label)).toBeInTheDocument();
  });
});

test('the document has its five sections, in order', () => {
  renderStory();
  const article = screen.getByRole('article', { name: 'The full story' });
  const titles = within(article).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
  expect(titles).toEqual(['The idea', 'My role in detail', 'Process', 'Challenges', 'Retrospective']);
});

test('the process has five numbered steps, each with its own heading', () => {
  renderStory();
  const process = screen.getByRole('region', { name: 'Process' });
  const steps = within(process).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
  expect(steps).toEqual([
    'From a South African pitch to anywhere in the world',
    'From a hackathon demo to a designed app',
    'Wiring the design up with an AI agent',
    'Coming back certified: rebuilt to run on about US$5 a month',
    'The last update, and stopping'
  ]);
  expect(within(process).getAllByText('Before')).toHaveLength(4);
});

test('code blocks: the architecture flow and the gateway', () => {
  renderStory();
  const flow = screen.getByRole('region', { name: 'How it fits together' });
  expect(flow).toHaveTextContent('Azure Functions (Node.js)');
  expect(flow).toHaveTextContent('Cosmos DB');

  const gateway = screen.getByRole('region', { name: 'The gateway, in outline' });
  expect(gateway).toHaveTextContent('status: 429');
  expect(gateway).toHaveTextContent('ifMatch: etag');
  // Said plainly, so nobody takes the outline for the original file.
  expect(within(gateway.closest('figure')).getByText(/not the original code/)).toBeInTheDocument();
});

test('inline `code` and links in the copy are rendered, not shown as markup', () => {
  renderStory();
  expect(screen.getByText('95070e4').tagName).toBe('CODE');
  const frontEnd = screen.getByRole('link', { name: /front end/ });
  expect(frontEnd).toHaveAttribute('href', 'https://github.com/king-maverickk/Living-Histories-Frontend');
  expect(frontEnd).toHaveAttribute('target', '_blank');
  expect(document.body).not.toHaveTextContent('**');
  expect(document.body).not.toHaveTextContent('](');
});

test('the retrospective is written in first person from the notes', () => {
  renderStory();
  const retro = screen.getByRole('region', { name: 'Retrospective' });
  expect(within(retro).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
    'What I’m proud of',
    'What it taught me',
    'What I’d do differently'
  ]);
  expect(retro).toHaveTextContent('160+ teams and 390 people');
});

test('while building, steps that still need a picture say so', () => {
  renderStory();
  expect(screen.getByText('Side by side: the deck’s title slide next to the app’s top bar')).toBeInTheDocument();
  expect(screen.getByText('Drag to compare at phone width: the demo against the redesign')).toBeInTheDocument();
});
