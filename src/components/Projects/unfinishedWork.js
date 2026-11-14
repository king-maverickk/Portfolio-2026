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
//   open      true = the row starts open. No row has it: they all start closed.
//   disabled  true = not written yet: the row is listed, greyed out, and
//             can't be opened. Delete the line when the row is ready.
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
    hint: 'C# Machine Learning game. Complex language, simple rules.',
    draft: true,
    entry: {
      // The highlight sentence. Words and pictures, in order. A picture sits
      // in a small grey chip:
      //   img     the picture (a file in public/assets/…). No `img` yet = a
      //           labelled grey chip in `npm start`, left out of production.
      //   fit     'contain' = the whole picture inside the chip (a logo).
      //           Without it, the picture fills the chip.
      //   tilt    degrees: the picture pops out of the chip, turned this much.
      sentence: [
        'My first programming competition: five weeks teaching',
        { img: '/assets/Unfinished/entelect/chip-csharp.webp', label: 'C#', alt: '', fit: 'contain' },
        'a C# bot to claim land on',
        { img: null, label: 'board', alt: '' },
        'a field it could only see a corner of, with the plan worked out in',
        { img: '/assets/Unfinished/entelect/chip-notebook.webp', label: 'notebook', alt: '', tilt: -7 },
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
      //   title   what a screen reader says for the card (the picture says
      //           it for everyone else)
      //   href    where the card goes. No href = not a link.
      //   image   the picture, shown as it is: its own corners, tilt, shadow
      //           and blue label (a file in public/assets/…). No image = a
      //           plain grey card with the title on it. todo('…') = still to
      //           add: the card shows in `npm start` only, unless it has an href.
      //   width, height   the picture's size on the page, in px
      //   tag     a blue label laid over the middle of the picture
      //   stack   on a group of exactly three pictures: piled up like the
      //           mockup, the first behind, the second in front on the left,
      //           the third in front on the right (sizes are set in the
      //           stylesheet, under .stackPictures)
      shelf: [
        {
          label: 'Notebook notes',
          cards: [{
            title: '2024 notebook',
            image: '/assets/Unfinished/entelect/shelf-notebook.webp',
            width: 160,
            height: 201,
            tag: '2024 notebook'
          }]
        },
        {
          label: 'Trailer and Workshop',
          stack: true,
          cards: [
            {
              title: 'YouTube Trailer',
              href: 'https://youtu.be/2ia7_uMDhM0',
              image: '/assets/Unfinished/entelect/shelf-youtube-trailer.webp'
            },
            {
              title: 'IG: Workshop Post, the poster',
              href: 'https://www.instagram.com/p/C9URVyQtScE/',
              image: '/assets/Unfinished/entelect/shelf-workshop-poster.webp'
            },
            {
              title: 'IG: Workshop Post, photos from the day',
              href: 'https://www.instagram.com/p/C9hei_vtTPa/?img_index=3',
              image: '/assets/Unfinished/entelect/shelf-workshop-photos.webp'
            }
          ]
        },
        {
          label: 'C# implementation',
          cards: [{
            title: 'GitHub Repo',
            href: 'https://github.com/king-maverickk/ent-chal-bot-v1/tree/NEATBot',
            image: '/assets/Unfinished/entelect/shelf-github-repo.webp',
            width: 179,
            height: 224
          }]
        },
        {
          label: 'Game rules',
          cards: [{
            title: 'Markdown of Rules',
            href: 'https://github.com/EntelectChallenge/2024-Sproutopia/blob/main/Sproutopia/GAMERULES.md',
            image: '/assets/Unfinished/entelect/shelf-game-rules.webp',
            width: 179,
            height: 224
          }]
        },
        {
          label: 'Challenge resources',
          cards: [{
            title: 'GitHub Gist',
            href: 'https://gist.github.com/EntelectChallenge/9bdb52a082c00dbe55c80c29cab0716f',
            image: '/assets/Unfinished/entelect/shelf-challenge-resources.webp',
            width: 179,
            height: 224
          }]
        }
      ],
      // Shown small under the shelf, beside the link to the repo.
      disclosure: 'The README for this repo was reconstructed with an AI agent in 2026. The Developer’s Note in it is mine.'
    }
  },
  {
    id: 'safm-redesign',
    disabled: true,
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
    disabled: true,
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
    disabled: true,
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
    disabled: true,
    name: 'Image to Map',
    year: 2024,
    hint: ['Made for a friend.', todo('WHY IT STOPPED')],
    summary: 'Made for a friend who wanted to start making video games. Two versions.',
    note: todo('ENTRY NOT WRITTEN YET'),
    draft: true
  },
  {
    id: 'video-cutter',
    disabled: true,
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
