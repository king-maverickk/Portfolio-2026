// Content for the "(hiring manager)" sheet.
//
// PLACEHOLDER: everything marked PLACEHOLDER below is stand-in copy. Check every claim, date and role before
// it goes live. Copy that comes straight from the design file is not marked.

export const ROLES = [
  { id: 'interaction', label: 'Interaction' },
  { id: 'ui-ux', label: 'UI/UX Design' },
  { id: 'frontend', label: 'Frontend Development' }
];

export const TABS = [
  { id: 'resume', label: 'File: Resume' },
  { id: 'letter', label: 'File: Cover letter' }
];

export const BENEFITS = {
  heading: 'What you get with me',
  items: [
    { lead: 'Design and code', text: 'in one person, so less lost in handoff' },
    { lead: 'Working prototypes', text: 'early, so you can click and judge' },
    { lead: 'Clear communication', text: 'about trade-offs and timelines' }
  ]
};

export const SCENARIOS = {
  heading: 'Who I’m working under matters',
  options: [
    {
      id: 'design-engineer',
      label: 'Design engineer',
      sentence: 'Working with a design engineer, I prototype in code early and come back with something you can click, not just questions.'
    },
    {
      id: 'developer',
      label: 'Developer',
      sentence: 'Working with developers, I keep the front end clean and the components reusable, so the next person can build on them.'
    },
    {
      id: 'growing-company',
      label: 'Growing company',
      sentence: 'At a growing company, I cover design and front end in one pass, so a small team can move faster.'
    },
    {
      id: 'marketing-team',
      label: 'Marketing team',
      sentence: 'With a marketing team, I turn campaign ideas into on-brand pages and motion that hold up on every screen.'
    },
    {
      id: 'creative-studio',
      label: 'Creative studio',
      sentence: 'In a creative studio, I take a rough direction, explore it quickly, and build the version people can actually try.'
    },
    { // PLACEHOLDER
      id: 'game-developer',
      label: 'Game Developer',
      sentence: 'With a game developer, I design the interface and menus and build them to feel responsive, so the UI never gets in the way of the game.'
    },
    {
      id: 'other',
      label: 'Other',
      sentence: 'If that mix could be a fit for your team, I’d be happy to learn more about the role and what you’re creating.'
    }
  ]
};

// What changes with the chosen role: the resume's summary and bullets, the cover letter, and the three lists.
// The "ui-ux" entry is PLACEHOLDER copy: the design file only shows Interaction and Frontend Development.
const BY_ROLE = {
  interaction: {
    summary: 'My work sits across the design and development process: I can explore a direction, refine the details, and build the experience for the screen.',
    freelance: [
      'Designed and built websites end to end, from wireframes and user flows to polished layouts in Figma to responsive React front ends.',
      'Added scroll-driven motion and small interactions that show what changed when someone clicks or scrolls.',
      'Shipped sites on cloud hosting with automated deploys, so updates go live reliably.'
    ],
    letter: {
      subtitle: 'For interaction and UX roles',
      paragraphs: [
        'Dear hiring manager,',
        'I design and build interfaces, and I’m most at home where the two meet: sketching a flow, testing it as a working prototype, and refining it until it feels obvious to use.',
        'For an interaction role, that starts with how someone moves through the product. From there I add small interactions that explain what just happened, so people are never left guessing.',
        'I’d welcome a conversation about what your team is making and where I could help.'
      ]
    },
    lists: [
      { title: 'Tools', items: ['Figma', 'Visual Studio Code', 'Azure Cloud'] },
      { title: 'Skills', items: ['Wireframing', 'Micro-interaction', 'Accessibility'] },
      { title: 'Languages', items: ['JavaScript', 'Python'] }
    ]
  },

  'ui-ux': { // PLACEHOLDER
    summary: 'I design interfaces people can read at a glance: clear hierarchy, considered type and spacing, and layouts that hold up from phone to desktop.',
    freelance: [
      'Designed websites end to end, from wireframes and user flows to polished, responsive layouts in Figma.',
      'Set up a consistent system of type, color and spacing that carried across every page.',
      'Handed off and built the final design, so what shipped matched what was drawn.'
    ],
    letter: {
      subtitle: 'For UI and UX design roles',
      paragraphs: [
        'Dear hiring manager,',
        'I design interfaces from the first sketch to the finished layout, and I build what I design, so the details survive the handoff.',
        'For a UI or UX role, that means starting with who the product is for, giving every screen a clear hierarchy, and testing the idea as a working prototype before anyone commits to it.',
        'I’d welcome a conversation about what your team is making and where I could help.'
      ]
    },
    lists: [
      { title: 'Tools', items: ['Figma', 'Visual Studio Code'] },
      { title: 'Skills', items: ['Wireframing', 'Typography and layout', 'Responsive layouts'] },
      { title: 'Languages', items: ['HTML and CSS', 'JavaScript'] }
    ]
  },

  frontend: {
    summary: 'I build the screen: responsive, accessible interfaces in React and JavaScript, from a design file to a deployed site.',
    freelance: [
      'Built responsive React front ends from design files, covering layout, state and accessibility.',
      'Added scroll-driven motion and small interactions, tuned to stay smooth on mid-range phones.',
      'Shipped sites on cloud hosting with automated deploys, so updates go live reliably.'
    ],
    letter: { // PLACEHOLDER: the design file only has the Interaction letter
      subtitle: 'For frontend development roles',
      paragraphs: [
        'Dear hiring manager,',
        'I build the front end of products: responsive, accessible interfaces in React and JavaScript, taken from a design file to a deployed site.',
        'I read a design closely, flag early what will not survive a small screen, and keep components clear enough that the next person can build on them.',
        'I’d welcome a conversation about what your team is making and where I could help.'
      ]
    },
    lists: [
      { title: 'Tools', items: ['Visual Studio Code', 'Azure Cloud'] },
      { title: 'Skills', items: ['Micro-interaction', 'Accessibility'] },
      { title: 'Languages', items: ['JavaScript', 'Python'] }
    ]
  }
};

// Shared by every role.
const EVENTS = { // PLACEHOLDER dates
  heading: 'Event support coordinator',
  meta: '20XX – 20XX',
  bullets: [
    'Coordinated on-site support for events, keeping schedules and teams moving.',
    'Explained schedule changes to guests and crew in plain language, so people always knew what came next.'
  ]
};

const PROJECTS = [
  'Living Histories: placed 3rd at a Microsoft hackathon (2025) with a generative AI app that turns historical topics into geotagged podcast shorts with audio narration.',
  'Photos by Alex: a photo-first website for a Hamilton photographer, with a floating navbar and slide-up text.',
  'Hamilton Creative Group: built the community website for a weekly meetup of digital media creatives.'
];

const EDUCATION = { // PLACEHOLDER: college name
  heading: 'College Name',
  text: 'Diploma, Information Technology in Software Development (incomplete)'
};

const SIGNOFF = ['Thank you for your time,', 'Motheo'];

export function getResume(roleId) {
  const role = BY_ROLE[roleId];
  return {
    kind: 'resume',
    name: 'Motheo', // PLACEHOLDER: add the surname
    title: 'Designer-developer',
    contact: ['Hamilton, Ontario', 'hello@example.com', 'your-portfolio.com'], // PLACEHOLDER
    sections: [
      { heading: 'Summary', paragraphs: [role.summary] },
      {
        heading: 'Experience',
        entries: [
          { heading: 'Freelance designer-developer', meta: '20XX – Present', bullets: role.freelance },
          EVENTS
        ]
      },
      { heading: 'Projects', bullets: PROJECTS },
      { heading: 'Education', entries: [EDUCATION] }
    ]
  };
}

export function getLetter(roleId) {
  const { letter } = BY_ROLE[roleId];
  return {
    kind: 'letter',
    title: 'Cover letter',
    subtitle: letter.subtitle,
    paragraphs: letter.paragraphs,
    signoff: SIGNOFF
  };
}

export function getLists(roleId) {
  return BY_ROLE[roleId].lists;
}
