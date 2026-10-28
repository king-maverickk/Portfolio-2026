// Content for the "(freelance/contract)" sheet.
//
// PLACEHOLDER: "Site redesign" and "Other" sentences are stand-ins. The prices, the timeline and the
// "Recent:" project line come from the design file, so check them before they go live.

export const REPLY_TIME = 'Within 24 hours'; // shown as "I reply within 24 hours."
export const TYPICAL_WEEKS = '6-7 weeks';

export const TABS = [
  { id: 'workflow', label: 'File: Workflow' },
  { id: 'deliverables', label: 'File: What you get' },
  { id: 'start', label: 'File: Start a project' }
];

export const BENEFITS = {
  heading: 'Why work with me',
  items: [
    { lead: 'You get one person', text: 'from research to launch' },
    { lead: 'You get research first:', text: 'your market and your visitors, before any layout' },
    { lead: 'You get a launch date, not a maybe:', text: `about ${TYPICAL_WEEKS} for a typical site` }
  ]
};

export const SCENARIOS = {
  heading: 'Who I work best with',
  options: [
    {
      id: 'creative-professionals',
      label: 'Creative professionals',
      sentence: 'I build sites for painters, illustrators and makers that put the work first and make it easy to enquire.'
    },
    {
      id: 'growing-businesses',
      label: 'Growing businesses',
      sentence: 'I design around your industry and your customers, so the right people find you and get in touch.'
    },
    {
      id: 'brand-designers',
      label: 'Brand designers',
      sentence: 'I build your designs as drawn, inside your system, from Figma to production.'
    },
    { // PLACEHOLDER
      id: 'site-redesign',
      label: 'Site redesign',
      sentence: 'I rebuild the site that is holding you back around what your visitors need.'
    },
    { // PLACEHOLDER
      id: 'other',
      label: 'Other',
      sentence: 'Tell me what you are making, and I will say plainly if I am the right person for it.'
    }
  ]
};

export const LISTS = [
  { title: 'Research', items: ['Competitors', 'Terminology', 'Visitors'] },
  { title: 'Design', items: ['References', 'Layout', 'Typography', 'Color'] },
  { title: 'Build', items: ['Responsive', 'Motion', 'Cloud hosting'] }
];

export const WORKFLOW = {
  title: 'Project Plan',
  intro: `How a typical build runs, about ${TYPICAL_WEEKS}`,
  recent: 'Recent: Photos by Alex, a photographer’s site, built in 6 weeks',
  phases: [
    {
      name: 'Research',
      steps: [
        { text: 'Your business, goals & style' },
        { text: 'Industry & competitors' },
        { text: 'Standards & terminology' }
      ]
    },
    {
      name: 'Direction',
      steps: [
        { text: 'References' },
        { text: 'Sketches' },
        { text: 'Type & color pairings' }
      ]
    },
    {
      name: 'Prototype',
      steps: [{ text: 'A clickable version early, so you can judge before it’s built.', icon: 'pointer' }]
    },
    {
      name: 'Build',
      steps: [
        { text: 'Responsive frontend' },
        { text: 'Motion & Interaction' }
      ]
    },
    {
      name: 'Launch and Care',
      steps: [
        { text: 'Live on cloud hosting' },
        { text: 'Optional: Monthly Care Plan' }
      ]
    }
  ],
  ai: {
    heading: 'On AI',
    text: 'Research and design are mine. I use AI in development, on components I’ve spec’d and directed.'
  }
};

export const DELIVERABLES = {
  title: 'What you get',
  intro: 'Priced by the page, built around your goals.',
  packages: [
    {
      name: 'Single page',
      prefix: '',
      price: 'CA$800',
      text: 'A focused site for a new business or solo service: who you are, what you offer, how to reach you.'
    },
    {
      name: 'Full site',
      prefix: 'from',
      price: 'CA$2,600',
      text: 'A custom multi-page site for growing teams, with room for services, work and proof.'
    }
  ],
  note: 'Motion and interaction are included in both prices.',
  problemsHeading: 'Problems I solve',
  problems: [
    { problem: 'No site, only social media', solution: 'A site built to be found' },
    { problem: 'Outdated or hard on mobile', solution: 'Fast, mobile-first design' },
    { problem: 'Enquiries get lost', solution: 'Clear enquiry forms' },
    { problem: 'Customers phone for prices', solution: 'Online quote requests' },
    { problem: 'Little proof of credibility', solution: 'Portfolio and testimonials' },
    { problem: 'Bookings handled by hand', solution: 'Online booking' }
  ],
  after: {
    heading: 'After launch',
    text: 'Optional monthly Care Plan: updates, hosting and support.'
  },
  timeline: {
    heading: 'Timeline',
    text: `${TYPICAL_WEEKS}, kickoff to launch. Larger scopes quoted separately.`
  }
};

export const FORM = {
  title: 'Start a project',
  intro: `Tell me a little about it. I reply ${REPLY_TIME.toLowerCase()}.`,
  nameLead: 'Hi! My name is',
  namePlaceholder: 'Your name',
  emailLead: 'and you can reach me at',
  emailPlaceholder: 'you@example.com',
  kindLegend: 'I’m looking to make',
  kinds: [
    { id: 'portfolio', label: 'Portfolio site' },
    { id: 'business', label: 'Business site' },
    { id: 'redesign', label: 'Redesign' },
    { id: 'build-from-design', label: 'Build from my design' },
    { id: 'other', label: 'Other' }
  ],
  siteLead: 'My current site is',
  sitePlaceholder: 'https:// (optional)',
  messageLead: 'I’d like to share more about my project:',
  messagePlaceholder: 'What it is, who it’s for, and when you need it',
  send: 'Send',
  sending: 'Sending…',
  sentTitle: 'Thank you, I have your message.',
  sentText: `I reply ${REPLY_TIME.toLowerCase()}.`,
  error: 'That did not send. Please check your details and try again in a moment.'
};
