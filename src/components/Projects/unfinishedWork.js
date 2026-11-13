// Unfinished work: things you started, learned from and stopped. The
// "Unfinished" section at the bottom of /projects and the "Unfinished" row on
// the home list both read from here.
//
// todo('LABEL') marks a gap only you can fill. In `npm start` it shows as a
// dashed [LABEL] so you can see what's missing. The production build leaves
// it out completely, so a visitor never sees a placeholder.
//
// EVERY FIELD of a row:
//
//   id        used for the row's anchor (#unfinished-<id>)
//   name      the bold name
//   year      a string, or todo('YEAR')
//   hint      the one line on the right: why it stopped, or the one thing
//             worth knowing. A string, a todo(), or a list mixing both.
//   image     optional thumbnail (a file in public/assets/Home)
//   onHome    1 or 2: lends its image to the fanned pictures beside
//             "Unfinished" on the home list, in that order
//   open      true = the row starts open
//   summary   a sentence or two shown when the row opens
//   note      a todo() reminder shown under the summary (never in production)
//   entry     the full write-up (see Entelect below). When it's set, the row
//             opens to it instead of the summary.
//
// A row with nothing to open (no summary, no entry) is shown as a plain line
// in production, without the +.
//
// `draft: true` = Claude wrote the words from your notes and the repo. Rewrite
// them in your voice.

export const todo = (label) => ({ todo: label });
export const isTodo = (value) => Boolean(value) && typeof value === 'object' && 'todo' in value;

// Draft copy for the section header.
export const UNFINISHED_INTRO = {
  title: 'Unfinished',
  text: 'Six things I started, learned from and stopped. Every row tells you why.',
  draft: true
};

const UNFINISHED = [
  {
    id: 'entelect-challenge-2024',
    name: 'Entelect Challenge 2024',
    year: '2024',
    hint: 'Solo entry. Stopped five weeks in.',
    open: true,
    draft: true,
    entry: {
      // The highlight sentence. Words and pictures, in order. A picture with
      // no `img` yet shows as a labelled grey chip in `npm start` and is left
      // out of the production build.
      sentence: [
        'My first programming competition: five weeks teaching',
        { img: null, label: 'console', alt: '' },
        'a C# bot to claim land on',
        { img: null, label: 'board', alt: '' },
        'a field it could only see a corner of, with the plan worked out in',
        { img: null, label: 'notebook', alt: '' },
        'a notebook.'
      ],
      // The story: a bold title and a short paragraph each. A todo() body is
      // yours to write; until then the whole block stays out of production.
      sections: [
        {
          title: 'What it was',
          body: 'A bot for Sproutopia, Entelect’s 2024 game. Four bots share a 50 × 50 field and claim land by drawing a trail around it and getting home before anyone cuts the trail. Each bot sees only a small square around itself. The most land when time runs out wins.'
        },
        {
          title: 'How far it got',
          body: 'Research, ML & the Git repository. 30+ commits over five weeks. The busiest day was the one after Entelect’s workshop.'
        },
        { title: 'Why I stopped', body: todo('YOURS: WHY I STOPPED, TWO OR THREE SENTENCES') },
        { title: 'What I’d take from it', body: todo('YOURS: WHAT I’D TAKE FROM IT') }
      ],
      // The shelf: cards in a row that scrolls sideways. Each group has a
      // label under it and one or more cards.
      //   title   the words on the card (and what a screen reader says)
      //   href    where the card goes. No href = not a link.
      //   image   a picture that fills the card (a file in public/assets/…).
      //           todo('…') = still to add: the card shows in `npm start`
      //           only, unless it has an href.
      //   stack   on a group of exactly three cards: pile them up, the first
      //           wide and behind, the other two tilted in front.
      shelf: [
        {
          label: 'Notebook notes',
          cards: [{ title: 'Notebook', image: todo('ADD NOTEBOOK PHOTOS') }]
        },
        {
          label: 'Trailer and Workshop',
          stack: true,
          cards: [
            { title: 'Trailer', href: 'https://www.instagram.com/p/C4vYg27tUGZ/' },
            { title: 'Workshop poster', href: 'https://www.instagram.com/p/C9URVyQtScE/' },
            { title: 'Workshop photos', href: 'https://www.instagram.com/p/C9hei_vtTPa/?img_index=3' }
          ]
        },
        {
          label: 'GitHub',
          cards: [{ title: 'GitHub', href: 'https://github.com/king-maverickk/ent-chal-bot-v1/tree/NEATBot' }]
        },
        {
          label: 'The game',
          cards: [{ title: 'Game rules', href: 'https://github.com/EntelectChallenge/2024-Sproutopia/blob/main/Sproutopia/GAMERULES.md' }]
        },
        {
          label: 'Workshop notes',
          cards: [{ title: 'Entelect’s gist', href: 'https://gist.github.com/EntelectChallenge/9bdb52a082c00dbe55c80c29cab0716f' }]
        }
      ],
      // Shown small under the shelf, beside the link to the repo.
      disclosure: 'The README for this repo was reconstructed with an AI agent in 2026. The Developer’s Note in it is mine.'
    }
  },
  {
    id: 'safm-redesign',
    name: 'SAfm redesign',
    year: 2022,
    hint: 'Built before anyone asked for it.',
    summary: 'A redesign of the SAfm radio site with a modern audio player and news layout, plus a news API behind it. Made for my dad. Never used.',
    note: todo('ENTRY NOT WRITTEN YET. IDEA: DRAG TO COMPARE AGAINST THE LIVE SITE'),
    draft: true
  },
  {
    // Was a project page until Nov 2026. Its words then: "A playable guitar
    // for the desktop, shortlisted for Digital Labs Africa’s 8th edition in
    // the video games category." Built in Python and C# with WPF.
    id: 'virtual-guitar',
    name: 'Virtual Guitar',
    year: todo('YEAR'),
    hint: 'Three versions. Shortlisted, Digital Labs Africa.',
    image: '/assets/Home/project_guitar.webp',
    onHome: 2,
    summary: 'Built three times: in C#, in Python, and a third start that didn’t get far.',
    note: todo('ENTRY NOT WRITTEN YET. IDEA: ONE STORY OF THREE VERSIONS'),
    draft: true
  },
  {
    // Was a project page until Nov 2026. Its words then: "The company website
    // for Milk & Honey TV, designed in Figma, built in React and deployed on
    // Azure (Static Web App, Blob Storage for media)." Role there: full-stack
    // developer, September 2022 to September 2023.
    id: 'milk-and-honey-tv',
    name: 'Milk & Honey TV',
    year: '2024',
    hint: todo('WHY IT STOPPED'),
    image: '/assets/Home/project_milk_and_honey.webp',
    onHome: 1,
    note: todo('ENTRY NOT WRITTEN YET. 64 COMMITS, LAST TOUCHED 2024'),
    draft: true
  },
  {
    id: 'image-to-map',
    name: 'Image to Map',
    year: 2024,
    hint: ['Made for a friend.', todo('WHY IT STOPPED')],
    summary: 'Made for a friend who wanted to start making video games. Two versions.',
    note: todo('ENTRY NOT WRITTEN YET'),
    draft: true
  },
  {
    id: 'video-cutter',
    name: 'Video Cutter',
    year: 2023,
    hint: ['A tool for helping with ML.', todo('WHY IT STOPPED')],
    summary: 'A video dataset creator, made while learning machine learning for scene detection.',
    note: todo('ENTRY NOT WRITTEN YET'),
    draft: true
  }
];

export default UNFINISHED;

// The pictures fanned out beside "Unfinished" on the home list.
export const HOME_FAN = UNFINISHED
  .filter((entry) => entry.onHome && entry.image)
  .sort((a, b) => a.onHome - b.onHome)
  .map((entry) => entry.image);
