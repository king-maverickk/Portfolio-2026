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
  // No description: the "For businesses that depend on…" statement at the top
  // of FreelanceSheet does that job (it has inline images, so it lives there).

  // The pain points, shown as the card shuffle (PainPoints.js). One sentence
  // per card (`text`); every card is the size of the longest, so keep each to
  // about 25 words. The first card leads with growth (your favourite). `icon`
  // is the tile in the card's corner: calendar, badge, builder, analytics,
  // notes, messages or phone (painPointIcons.js). `notification` is for the
  // phone version (PainPointsPhone.js, not in use: it slowed the sheet down).
  // `teaser` on each section: the one-line hint on its row while it's
  // collapsed (draft), so the closed sheet still says something useful.
  painPoints: {
    draft: true,
    title: 'Pain points',
    teaser: 'Sound familiar?',
    items: [
      { notification: { app: 'Calendar', icon: 'calendar', title: 'Grand opening: second location' }, icon: 'calendar', text: 'You’re adding services, opening a location or hiring, but your website still describes the business you were two years ago.' },
      { notification: { app: 'Messages', icon: 'messages', title: '“Do you have any examples of your work?”' }, icon: 'badge', text: 'There’s nowhere that shows your work, your services, what clients say or your qualifications, so visitors can’t tell how good you are.' },
      { notification: { app: 'Site Builder', icon: 'builder', title: 'Your template site is live' }, icon: 'builder', text: 'Your site looks like your next twenty competitors’. The builder ads promised it would bring clients in. It hasn’t.' },
      { notification: { app: 'Analytics', icon: 'analytics', title: 'Weekly report: most visitors left after one page' }, icon: 'analytics', text: 'You paid for a website, but visitors leave after one page. Few click around, and fewer get in touch.' },
      { notification: { app: 'Notes', icon: 'notes', title: 'About us (draft 7)' }, icon: 'notes', text: 'You know exactly what you do. Putting why you’re the one to hire into words, on your own site, is a different job.' },
      { notification: { app: 'Messages', icon: 'messages', title: '“Your site won’t work on my phone”' }, icon: 'messages', text: 'Your site is hard to use on a phone, or hard to contact you from.' },
      { notification: { app: 'Phone', icon: 'phone', title: 'Missed calls (4)' }, icon: 'phone', text: 'People phone to ask prices or availability the site could have answered.' }
    ]
  },


  // Two calls to action under the headline (draft): the same "Start a project"
  // as the end of the sheet, and a jump to how a project runs.
  introActions: {
    draft: true,
    primary: 'Start a project',
    secondary: 'See how a project runs'
  },

  // --- The "document" half --------------------------------------------------
  // The practical sections read like a clean shared doc (headings, short
  // lists, a callout), so the part where people decide whether to spend money
  // reads as calm and organised. Each is its own collapsible container.
  doc: {
    draft: true,
    title: 'Working together',
    teaser: 'One person, sketch to launch',
    lead: 'How we’ll talk, meet and make decisions. This is the short version; the details go in our contract.',
    callout: {
      label: 'In short:',
      text: 'one person from first sketch to launch, about 6 to 7 weeks, and a reply to every message within 24 hours.'
    }
  },

  process: {
    draft: true,
    title: 'How a project runs',
    teaser: 'About 6–7 weeks',
    note: 'About 6 to 7 weeks from first call to launch. Bigger sites take longer.',
    steps: [
      { label: 'Research', text: 'Your competitors, your industry’s terms, who visits and what they expect.' },
      { label: 'Sketch', text: 'References and sketches of the layout, before anything is polished.' },
      { label: 'Screen', text: 'Type, colour and a clickable prototype you can react to.' },
      { label: 'Build', text: 'I build what we designed, then launch it and hand you the keys.' }
    ]
  },

  // You were leaning toward per-page pricing; these numbers are your tentative
  // ones. Set `show: false` to hide the block until you decide.
  pricing: {
    draft: true,
    show: true,
    title: 'Pricing',
    teaser: 'From $800 a page',
    intro: 'Priced by page, not by package.',
    points: [
      'One page starts at $800.',
      'A full site usually lands around $2,600.',
      'You get a fixed quote before anything starts.'
    ]
  },

  // Your AI line, kept to what your note says.
  ai: {
    draft: true,
    title: 'On AI',
    teaser: 'The design is all mine',
    text: 'I research and design everything myself. In development I use AI on components I’ve written and directed.'
  },

  // The doc ends like a meeting note: what happens next, then the button. The
  // form itself lives in the contact section at the bottom of the page; the
  // button closes the sheet and takes the visitor there with "after a new
  // website" already picked.
  form: {
    draft: true,
    title: 'Next steps',
    teaser: 'A reply within 24 hours',
    steps: [
      'Tell me about your business and what you need, in a sentence or a few.',
      'I reply within 24 hours to set up a short call.',
      'You get a fixed quote and a timeline. Work starts once you’re happy with both.'
    ],
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
