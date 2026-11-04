// All the words in the three sheets live here, so you can rewrite them without
// touching layout code.
//
// Anything with `draft: true` was written by Claude from your notes, not by you.
// In `npm start` those blocks carry a small dashed "draft" tag so you can spot
// them; the production build hides the tag (but keeps the words), so rewrite
// or approve each one before you deploy.
//
// Facts used come from your resume, About copy and project notes. Nothing here
// claims a result, client quote or number you haven't stated.

export const CONTACT = {
  email: 'motheo.moleko03@gmail.com',
  linkedin: 'https://www.linkedin.com/in/motheo-m-moleko/',
  linkedinLabel: 'linkedin.com/in/motheo-m-moleko',
  // Add your GitHub profile URL and the GitHub card appears.
  github: '',
  githubLabel: ''
};

// --- The section itself ---------------------------------------------------------

// The small line under "How I'll deliver for you" that tells visitors the tags
// open something. Draft.
export const SECTION_PROMPT = 'Which one are you? Pick a tag.';

// --- (hiring manager) --------------------------------------------------------

export const HIRING = {
  title: 'Hiring managers',
  description: 'Looking for a designer-developer?',

  intro: {
    draft: true,
    paragraphs: [
      'I design interfaces and build them myself, so what gets approved in Figma is what ships. Six years of self-taught development, now pointed at design.',
      'My resume and a short cover letter are below, readable right here. Nothing to download.'
    ]
  },

  // Short facts a recruiter can repeat to a colleague. All from your resume.
  glance: [
    { label: 'Roles', value: 'Interaction design · UI/UX design · Front-end development' },
    { label: 'Based in', value: 'Hamilton, Ontario' },
    { label: 'Proof', value: '3rd place, Microsoft AI for Social Good 2025 · Azure Developer Associate (AZ-204)' },
    { label: 'Also', value: 'Founder of Hamilton Creative Group · Speaks six languages' }
  ],

  // The general (open) cover letter. Draft: leads with what you shipped and lets
  // the dates show your level, as the plan suggested. Rewrite in your voice.
  coverLetter: {
    draft: true,
    greeting: 'Hello,',
    paragraphs: [
      'I’m Motheo, a designer-developer in Hamilton. I take a page from sketch to screen to motion on my own: the research, the layout and type, the prototype, and the React build that goes live.',
      'Recently I designed and built sites for a photographer, a holistic healer and an illustrator, each focused on bringing in clients and showing their work well. Before that I designed Milk & Honey TV’s website in Figma, built it in React and deployed it on Azure, and worked on cloud back-end services at Queers Code.',
      'In 2025 my teammate and I placed 3rd at Microsoft’s AI for Social Good hackathon with an app that turns historical topics into geotagged podcast shorts. I designed its interface and built the front end.',
      'Outside client work I started Hamilton Creative Group, which now runs two weekly meetups for local designers, developers and animators.',
      'I’m looking for a team where design and code sit close together. If that’s yours, I’d like to talk.'
    ],
    signOff: 'Motheo Moleko'
  }
};

// --- (freelance/contract) ----------------------------------------------------

export const FREELANCE = {
  title: 'Freelance / contract',
  description: 'A website that brings in enquiries, not just compliments.',

  // From the value-proposition draft in "what goes where".
  lead: {
    draft: true,
    text: 'I design and build bespoke websites for growing businesses and creative professionals. One person from first sketch to launch, so nothing gets lost between design and code.'
  },

  whoFor: {
    draft: true,
    items: [
      { title: 'Creative professionals', text: 'Portfolios for artists, illustrators, photographers and makers whose work deserves better than a template.' },
      { title: 'Small and growing businesses', text: 'A branded site made for your industry and your customers, built to turn visits into enquiries.' },
      { title: 'Brand designers and agencies', text: 'You have the designs. I build them faithfully, motion included.' },
      { title: 'Sites that need a rebuild', text: 'Outdated, slow or hard to use on a phone. I redesign and redevelop it.' }
    ]
  },

  // Your dad's list of problems to look for.
  problems: {
    draft: true,
    title: 'Sound familiar?',
    items: [
      'Customers find you on social media or by word of mouth, but there’s no website to send them to.',
      'Your site is hard to use on a phone, or hard to contact you from.',
      'People phone to ask prices or availability the site could have answered.',
      'There’s nowhere that shows your work, your services or what clients say.',
      'Nobody can book, pay or ask for a quote online.'
    ]
  },

  process: {
    draft: true,
    title: 'How a project runs',
    note: 'About 6 to 7 weeks from first call to launch. Bigger sites take longer.',
    steps: [
      { label: 'Research', text: 'Your competitors, your industry’s terms, who visits and what they expect.' },
      { label: 'Sketch', text: 'References and sketches of the layout, before anything is polished.' },
      { label: 'Screen', text: 'Type, colour and a clickable prototype you can react to.' },
      { label: 'Build', text: 'I build what we designed, then launch it and hand you the keys.' }
    ]
  },

  recentWork: {
    title: 'Photos by Alex',
    meta: 'Photographer, Hamilton · about 6 weeks',
    image: '/assets/Home/project_alex_text_in_photos.png',
    // Add the live site or case-study link and the card becomes clickable.
    href: ''
  },

  // You were leaning toward per-page pricing; these numbers are your tentative
  // ones. Set `show: false` to hide the block until you decide.
  pricing: {
    draft: true,
    show: true,
    title: 'Pricing',
    text: 'Priced by page, not by package. One page starts at $800; a full site usually lands around $2,600. You get a fixed quote before anything starts.'
  },

  // Your AI line, kept to what your note says.
  ai: {
    draft: true,
    title: 'On AI',
    text: 'I research and design everything myself. In development I use AI on components I’ve written and directed.'
  },

  // The form lives in the contact section at the bottom of the page; this
  // button closes the sheet and takes the visitor there with "after a new
  // website" already picked.
  form: {
    title: 'Start a project',
    draft: true,
    text: 'Tell me about it in one sentence (or a few). It goes straight to my inbox, and I reply within 24 hours.',
    cta: 'Start a project'
  }
};

// --- (open to work) ----------------------------------------------------------

export const OPEN_TO_WORK = {
  title: 'Open to work',
  description: 'Looking for my next team.',

  lookingFor: {
    label: 'Looking for',
    value: 'Entry- to mid-level roles in interaction and UI/UX design, front-end development, or designer-developer and creative technologist work.'
  },
  basedIn: { label: 'Based in', value: 'Hamilton, Ontario' },

  // Fill these in and they appear. Left empty on purpose: only you know them.
  start: { label: 'Can start', value: '' },
  workStyle: { label: 'Works', value: '' }, // e.g. 'On-site, hybrid or remote'

  // Same as the freelance sheet, with "hiring for a role" picked.
  form: {
    title: 'Get in touch',
    draft: true,
    text: 'A role you think fits? Send it over. I reply within 24 hours.',
    cta: 'Get in touch'
  }
};
