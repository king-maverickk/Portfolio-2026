// Dataset for the "(hiring manager)" annotation, read by DeliverySheets.
// To add "(freelance/contract)" or "(open to work)", copy this shape into a sibling file.
// Everything below is placeholder copy: check each claim, date and role tag before it goes live.
// A `roles` array lists the roles a phrase or skill supports; picking a role highlights those items.

const ROLES = [
  { id: 'interactions', label: 'Interactions and UX', short: 'Interactions' },
  { id: 'ui', label: 'UI Design', short: 'UI design' },
  { id: 'frontend', label: 'Frontend Development', short: 'Frontend dev' },
  { id: 'motion', label: 'Motion Design', short: 'Motion' }
];

const SCENARIOS = [
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
  {
    id: 'other',
    label: 'Other',
    sentence: 'If that mix could be a fit for your team, I’d be happy to learn more about the role and what you’re creating.'
  }
];

// Shared by the resume's skills section and the three cards, so the two never disagree.
const SKILLS = [
  { text: 'Figma', kind: 'tool', roles: ['interactions', 'ui'] },
  { text: 'Chrome DevTools', kind: 'tool', roles: ['ui', 'frontend'] },
  { text: 'React', kind: 'tool', roles: ['frontend', 'interactions'] },
  { text: 'Git and GitHub', kind: 'tool', roles: ['frontend'] },
  { text: 'Azure', kind: 'tool', roles: ['frontend'] },
  { text: 'Jitter', kind: 'tool', roles: ['motion'] },
  { text: 'Lottie', kind: 'tool', roles: ['motion', 'frontend'] },
  { text: 'Rive', kind: 'tool', roles: ['motion', 'interactions'] },
  { text: 'GSAP', kind: 'tool', roles: ['motion', 'frontend'] },

  { text: 'Wireframing', kind: 'skill', roles: ['interactions'] },
  { text: 'User flows', kind: 'skill', roles: ['interactions'] },
  { text: 'Prototyping', kind: 'skill', roles: ['interactions', 'ui'] },
  { text: 'Micro-interactions', kind: 'skill', roles: ['interactions', 'motion'] },
  { text: 'Typography and layout', kind: 'skill', roles: ['ui'] },
  { text: 'Color and spacing', kind: 'skill', roles: ['ui'] },
  { text: 'Responsive layouts', kind: 'skill', roles: ['ui', 'frontend'] },
  { text: 'Component architecture', kind: 'skill', roles: ['frontend'] },
  { text: 'Accessibility', kind: 'skill', roles: ['frontend', 'interactions'] },
  { text: 'Easing and timing', kind: 'skill', roles: ['motion'] },
  { text: 'Scroll-driven animation', kind: 'skill', roles: ['motion', 'frontend'] },

  { text: 'JavaScript', kind: 'language', roles: ['interactions', 'ui', 'frontend', 'motion'] },
  { text: 'HTML and CSS', kind: 'language', roles: ['ui', 'frontend'] },
  { text: 'SCSS', kind: 'language', roles: ['ui', 'frontend'] },
  { text: 'Python', kind: 'language', roles: ['frontend'] },
  { text: 'C#', kind: 'language', roles: ['interactions'] }
];

const CARD_GROUPS = [
  { kind: 'tool', title: 'Tools', resumeTitle: 'Tools' },
  { kind: 'skill', title: 'Skills', resumeTitle: 'Practice' },
  { kind: 'language', title: 'Languages', resumeTitle: 'Languages' }
];

const mark = (text, ...roles) => ({ text, roles });

const RESUME = {
  name: 'Motheo', // PLACEHOLDER: add your surname
  title: 'Designer-developer',
  contact: ['Hamilton, Ontario', 'hello@example.com', 'your-portfolio.com'],

  summary: [
    'My work sits across the design and development process: I can ',
    mark('explore a direction', 'interactions'),
    ', ',
    mark('refine the details', 'ui'),
    ', and ',
    mark('build the experience for the screen', 'frontend', 'motion'),
    '.'
  ],

  experience: [
    {
      id: 'freelance',
      heading: 'Freelance designer-developer',
      meta: '20XX – Present',
      bullets: [
        [
          'Designed and built websites end to end, from ',
          mark('wireframes and user flows', 'interactions'),
          ' to ',
          mark('polished layouts in Figma', 'ui'),
          ' to ',
          mark('responsive React front ends', 'frontend'),
          '.'
        ],
        [
          'Added ',
          mark('scroll-driven motion', 'motion', 'frontend'),
          ' and ',
          mark('small interactions', 'interactions', 'motion'),
          ' that show what changed when someone clicks or scrolls.'
        ],
        [
          'Shipped sites on ',
          mark('cloud hosting with automated deploys', 'frontend'),
          ', so updates go live reliably.'
        ]
      ]
    },
    {
      id: 'events',
      heading: 'Event support coordinator',
      meta: '20XX – 20XX',
      bullets: [
        ['Coordinated on-site support for events, keeping schedules and teams moving.'],
        [
          'Explained schedule changes to guests and crew in plain language, so people always knew ',
          mark('what came next', 'interactions'),
          '.'
        ]
      ]
    }
  ],

  projects: {
    id: 'portfolio',
    bullets: [
      [
        'Living Histories: placed 3rd at a Microsoft hackathon (2025) with a ',
        mark('generative AI app', 'frontend'),
        ' that turns historical topics into ',
        mark('geotagged podcast shorts', 'interactions'),
        ' with audio narration.'
      ],
      [
        'Photos by Alex: a ',
        mark('photo-first website', 'ui'),
        ' for a Hamilton photographer, with a ',
        mark('floating navbar and slide-up text', 'motion', 'interactions'),
        '.'
      ],
      [
        'Hamilton Creative Group: built the ',
        mark('community website', 'frontend'),
        ' for a weekly meetup of digital media creatives.'
      ],
      [
        'Hamilton Fashion Week: a ',
        mark('parallax animation', 'motion'),
        ' made in Jitter.'
      ]
    ]
  },

  education: {
    id: 'education',
    heading: 'College Name',
    detail: 'Diploma, Information Technology in Software Development (incomplete)'
  }
};

// The Experience / Education / Portfolio rows under the resume.
// Each item points at a resume entry id, so hovering one lights up the other.
const ROWS = [
  {
    label: 'Experience',
    items: [
      { id: 'freelance', label: 'Freelance designer-developer' },
      { id: 'events', label: 'Event support coordinator' }
    ]
  },
  {
    label: 'Education',
    items: [
      {
        id: 'education',
        label: 'College Name | Diploma, Information Technology in Software Development (incomplete)'
      }
    ]
  },
  {
    label: 'Portfolio',
    items: [{ id: 'portfolio', label: 'Portfolio' }]
  }
];

export default {
  id: 'hiring-manager',
  fileName: 'File: Resume',
  roles: ROLES,
  scenarios: SCENARIOS,
  skills: SKILLS,
  cardGroups: CARD_GROUPS,
  resume: RESUME,
  rows: ROWS
};  