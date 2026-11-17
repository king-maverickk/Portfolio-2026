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
//
// The sheet, top to bottom (HiringManagerSheet.js): the hello sentence, the
// roles, the resume and open letter, your two profile cards, then Proof,
// Working with me and Still learning as containers, and your projects.
//
// The hello sentence has icons inside it, so its words live in
// HiringManagerSheet.js (like the Freelance headline).

export const HIRING = {
  title: 'Hiring managers',

  // A container like Freelance's "Working together": the role on the left, a
  // line on the right. It starts closed, so the hint names the roles: keep
  // the two in step.
  roles: {
    title: 'Roles I’m excited by',
    teaser: 'Design-Engineering, UI/UX, front-end',
    items: [
      // Draft: the line is Claude's. Rewrite in your words.
      { id: 'design-engineering', label: 'Design-Engineering', text: 'Using AI in development; designing by hand.' },
      { id: 'interaction', label: 'Interaction design', text: 'Hovers, drags and reveals, prototyped in the browser.' },
      { id: 'ux', label: 'UI/UX design', text: 'Research, sketches and Figma screens.' },
      { id: 'frontend', label: 'Front-end development', text: 'React builds of my own designs or yours deployed.' }
    ]
  },

  // The two documents, as a pile of pages (Documents.js). Put each PDF in
  // public/ (e.g. public/assets/HowIllDeliver/motheo-moleko-resume.pdf) and
  // set its path here: a Download button appears for the page on top.
  documents: {
    title: 'Resume and open letter',
    resume: { label: 'Resume', pdf: '' },
    letter: { label: 'Open letter', pdf: '' },
    backToPile: 'Back to the pile'
  },


  // The open letter. Draft: says which site launched and which two were
  // designs, and describes the hackathon app the way its project page does.
  // Rewrite in your voice.
  coverLetter: {
    draft: true,
    greeting: 'Hello,',
    paragraphs: [
      'I’m Motheo, a designer-developer in Hamilton. I take a page from sketch to screen to motion on my own: the research, the layout and type, the prototype, and the React build that goes live.',
      'Recently I designed and built a site for a Hamilton photographer, and designed two more for a holistic healer and an illustrator. Before that I designed Milk & Honey TV’s website in Figma, built it in React and deployed it on Azure, and worked on cloud back-end services at Queers Code.',
      'In 2025 my teammate and I placed 3rd at Microsoft’s AI for Good hackathon with an app that finds where you are and turns the history around you into two-voice podcast episodes. I built its backend and cloud side there, then redesigned and rebuilt it on my own.',
      'Outside client work I started Hamilton Creative Group, which now runs two weekly meetups for local designers, developers and animators.',
      'I’m looking for a team where design and code sit close together. If that’s yours, I’d like to talk.'
    ],
    signOff: 'Motheo Moleko'
  },

  // Your two profile cards, rebuilt from your Figma exports (ProfileCards.js),
  // in a container that starts closed; `teaser` is the hint on its row.
  // The numbers are typed in: update them by hand. `avatar` is a file in
  // public/ (e.g. '/assets/HowIllDeliver/avatar_linkedin.jpg'); until it's set
  // the card shows your initials.
  online: {
    title: 'Online',
    teaser: 'Find me: LinkedIn, GitHub',
    linkedin: {
      name: 'Motheo M Moleko',
      headline: 'Creative Design | Motion, Web & Interaction Design | Technical | Positive Collaboration',
      href: 'https://www.linkedin.com/in/motheo-m-moleko/',
      cta: 'View Profile',
      notes: ['Open to Work', 'Skills'],
      avatar: '',
      initials: 'MM'
    },
    github: {
      handle: '@king-maverickk',
      bio: 'Microsoft Certified Azure Developer Associate, 6 years of personal programming experience.',
      href: 'https://github.com/king-maverickk',
      // CHECK: your card says 377 contributions, your sketch says 337.
      stats: [
        { value: '377', label: 'contributions in 2026' },
        { value: '19', label: 'public repos' },
        { value: '33', label: 'private repos' }
      ],
      avatar: '',
      initials: 'KM'
    }
  },

  // Proof: scenarios you've been in and how you got through them. One small
  // card each (Scenarios.js): a figure that puts the statement in context,
  // a tag, a title, ONE or two short sentences (20 words at most) and the
  // project it comes from.
  //
  // `figure.parts` are the tiles, `figure.joiner` sits between them:
  //   '='  one thing amounts to the other     '→'  first this, then that
  //   'vs' two options side by side (give the one you didn't pick `quiet: true`)
  //
  // The facts are in Portfolio Project Copy: Photos by Alex/README.md and
  // Living Histories/README.md ("Scenarios used on the Hiring managers sheet").
  proof: {
    draft: true,
    title: 'Proof',
    teaser: 'Scenarios I’ve been in, and how I got through them',
    scenarios: [
      {
        id: 'everything-page',
        tag: 'Thinking',
        // CHECK: what the 2 hours cover (it's from your sketch).
        figure: {
          joiner: '=',
          parts: [
            { value: '400', label: 'albums' },
            { value: '2 hr', label: 'job' }
          ]
        },
        title: '400 albums I couldn’t sort by hand',
        text: 'Alex wanted two decades of photos online. I scripted his Facebook albums into a database and designed each a preview.',
        project: 'Photos by Alex',
        to: '/projects/photos-by-alex'
      },
      {
        id: 'certification',
        tag: 'Skill',
        figure: {
          joiner: '→',
          parts: [
            { value: 'Certified', label: 'Azure, Aug 2025' },
            { value: 'Rebuilt', label: 'Oct to Nov 2025' }
          ]
        },
        title: 'Learn it first, then rebuild',
        text: 'My hackathon app’s cloud setup was more than I understood, so I got Azure-certified and came back to re-architect it.',
        project: 'Living Histories',
        to: '/projects/living-histories'
      },
      {
        id: 'cost',
        tag: 'Cost',
        // CHECK: swap $$$ and $ for real monthly figures if you have them.
        figure: {
          joiner: 'vs',
          parts: [
            { value: '$$$', label: 'SQL DB, 24/7', quiet: true },
            { value: '$', label: 'NoSQL DB' }
          ]
        },
        title: 'Paid AI on about US$5 a month',
        text: 'Every episode costs money. A NoSQL database and one free episode a day per visitor kept the bill low.',
        project: 'Living Histories',
        to: '/projects/living-histories'
      },
      {
        // You said there's a fourth scenario but not which. This one is
        // Claude's pick, from your interview answers: swap it if another fits.
        id: 'hallucination',
        tag: 'Research',
        figure: {
          joiner: '→',
          parts: [
            { value: '36 hrs', label: 'to build it' },
            { value: '3rd', label: 'of 160+ teams' }
          ]
        },
        title: 'An AI that can make up history',
        text: 'A real safeguard wouldn’t fit in 36 hours. We researched one, then pitched the risk and how we’d fix it.',
        project: 'Living Histories',
        to: '/projects/living-histories'
      }
    ]
  },

  workingWithMe: {
    title: 'Working with me',
    teaser: 'Feedback, being stuck, what I need from a lead',
    rows: [
      {
        label: 'When I’m stuck',
        text: 'I leave the screen. First a library or bookstore for design books, then Pinterest, Awwwards, and the tabs and collections I’ve been saving for a day like this.'
      },
      {
        label: 'Feedback I agree with',
        text: 'If I trust the person, I take the note. It usually comes with a suggestion, and I try it.'
      },
      {
        label: 'Feedback I disagree with',
        text: 'My first reaction isn’t always graceful, so I give it a moment. Then I ask questions until I understand what the note is trying to fix. If I still disagree, I write out what the design is meant to achieve and argue both sides, often with Claude, before I decide.'
      },
      {
        // Draft: reworded on 15 Nov from your note (open communication, sharing
        // and comparing each other's work, suggestions). Was "…whose taste I trust".
        label: 'From a lead',
        draft: true,
        text: 'Room to explore, and open communication: sharing and comparing each other’s work, with suggestions going both ways. I’ve mostly been the one leading, and I’ve never had a design lead of my own. I’d like one: a senior designer who still loves the craft and will tell me where my work falls short.'
      },
      {
        label: 'On AI',
        text: 'I research and design everything myself. In development I use AI on components I’ve written and directed.'
      }
    ]
  },

  stillLearning: {
    title: 'Still learning',
    teaser: 'What I’m not yet',
    rows: [
      {
        label: 'Motion timing and easing',
        text: 'I know how I want something to move, but I still lean on AI for the exact values. I’m learning to set them by hand.'
      },
      {
        label: 'Colour',
        text: 'Most of my work sits on white or near-black. I want to design confidently on coloured backgrounds.'
      }
    ]
  },

  // One card per project (from Projects/projects.js) and per written-up
  // unfinished entry (Projects/unfinishedWork.js), each leading to its page.
  // `screenshots`: a picture per project id, a file in public/. Until one is
  // set the card shows a hatched placeholder.
  projects: {
    title: 'Projects',
    caption: 'Overview, repos, images',
    screenshots: {
      'photos-by-alex': '',
      'hamilton-creative-group': '',
      'living-histories': '',
      'entelect-challenge-2024': ''
    }
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
    teaser: 'How we’ll talk, meet and make decisions',
    lead: 'This is the short version; the details go in our contract.',
    callout: {
      label: 'In short:',
      text: 'one person from first design to launch, about 6 to 8 weeks, and a reply to every message within 24 hours.'
    },
    // One line or two each, shown as label / text rows. Lines marked CHECK
    // hold a number or habit Claude picked as a common default: confirm it,
    // change it, or cut the line.
    topics: [
      {
        title: 'How we’ll talk',
        text: 'Email for anything we decide, so it’s in writing. Texts are fine for quick questions. I reply within 24 hours!'
      },
      {
        title: 'Updates',
        // CHECK: Fridays
        text: 'Every Monday you get a short note: what got done, what’s next, and anything I need from you.'
      },
      {
        title: 'Meetings',
        text: 'A kickoff, a review at the end of each stage, and a walkthrough at launch. In person in Hamilton, Toronto or on video, whichever suits you.'
      },
      {
        title: 'Rescheduling meetings',
        text: 'Things come up. Give me 2 hours’ notice and we’ll find another time, and I’ll do the same for you.'
      },
      {
        title: 'Deadlines',
        text: 'Each stage gets a date before we start. If feedback or content comes in late, launch moves by the same amount, and I’ll tell you the new date right away.'
      },
      {
        title: 'What I’ll need from you',
        text: 'One person who makes the final call, your logo and photos, and feedback within three working days of each review.'
      },
      {
        title: 'What I’ll show you',
        text: 'Drafts and references first, then designs, then a clickable prototype (on desktop and mobile), then the real site on a private link before it goes live.'
      },
      {
        title: 'Revisions',
        // CHECK: two rounds per stage
        text: 'Each stage includes two rounds of changes. Send your notes together in one go, so nothing slips through.'
      },
      {
        title: 'New ideas along the way',
        text: 'Always welcome. If it’s outside what we agreed, I’ll send a quick quote first, so the invoice never surprises you.'
      },
      {
        title: 'Payment',
        // CHECK: deposit, then milestones, last payment before launch
        text: 'A deposit of 30% is required, another 30% half-way through, with the last one before launch. You get a fixed quote before anything starts.'
      },
      {
        // I don't offer CMS so I can't say that they can change whatever they want once it's launched. They'll have contact me for changes, but this is included in the Care Plan.
        title: 'Ownership',
        text: 'Once it’s paid for, the site is yours. Your domain and hosting stay in your name, and you get every login. I may show the work in my portfolio unless you’d rather I didn’t.'
      },
      {
        title: 'After launch',
        text: 'I fix any bugs for 30 days after launch. After that, the monthly Care Plan keeps your site updated and looked after.'
      },
      {
        title: 'Agencies and teams',
        text: 'Already have designs or a team? I build from your Figma files, work in your repo and tools, and keep to your conventions.'
      },
      // I want to attract engineer teams that have a good product but a bad UI/UX. 
      {
        title: 'Engineers and product teams',
        text: 'I can help you design and build a better interface for your product. I work in Figma and React, and can integrate with your existing codebase.'
      }
    ]
  },

  process: {
    draft: true,
    title: 'How a project runs',
    teaser: 'Typically 6–8 weeks',
    // The folder tree from the Design canvas (Freelance/contract, Workflow).
    // Each stage is a folder; its items sit inside it. itemIcon swaps the
    // items' folder icon (the prototype gets a pointer).
    intro: 'An overview of how a typical build runs, about 6–8 weeks',
    stages: [
      { label: 'Research', items: ['Your business, goals & style', 'Industry & competitors', 'Standards & terminology'] },
      { label: 'Direction', items: ['References', 'Sketches', 'Type & color pairings'] },
      { label: 'Prototype', items: ['A clickable version early, so you can judge before it’s built.'], itemIcon: 'cursor' },
      { label: 'Build', items: ['Responsive frontend', 'Motion & Interaction'] },
      { label: 'Launch and Care', items: ['Live on cloud hosting', 'Optional: Monthly Care Plan'] }
    ]
  },

  // You were leaning toward per-page pricing; these numbers are your tentative
  // ones. Set `show: false` to hide the block until you decide.
  pricing: {
    draft: true,
    show: true,
    title: 'Pricing',
    teaser: 'Starting at $800',
    // One page, then four kinds of client to drag between (DRAFT). `includes`
    // is the work I take on; each task ticks on at the first stop that has it
    // and stays ticked after it (from: 0 = one page, 1 = small business,
    // 2 = growing company, 3 = startup & agency, 4 = contract). `price` is a
    // number (shown as dollars) or a word; `per` goes small after it.
    // Contract is at least a living wage, 3-month minimum: Hamilton's 2025
    // rate ($22.60/h, Ontario Living Wage Network) x 35 h a week x 52 / 12
    // = $3,428 a month full time; half time (17.5 h a week) = $1,714.
    stops: [
      {
        label: 'One page',
        lead: 'One page, from',
        price: 800,
        blurb: 'One thing, for a day or an event: a quick-turnaround site.'
      },
      {
        label: 'Small business',
        lead: 'Small business, about',
        price: 1800,
        blurb: 'Fewer, simpler needs: the essentials, done well.'
      },
      {
        label: 'Growing company',
        lead: 'Growing company, about',
        price: 2600,
        blurb: 'Show off what you have, and how you’re different.'
      },
      {
        label: 'Startup & agency',
        lead: 'Startup or agency',
        price: 'Quoted',
        per: 'per project',
        blurb: 'Different work, about more than a site.'
      },
      {
        label: 'Contract',
        lead: 'On contract, from',
        price: 1720,
        per: '/month',
        blurb: 'New work every month, and I’m responsible for it. $1,720 a month part-time, $3,430 full-time. 3-month minimum.'
      }
    ],
    includesLabel: 'What I take on',
    includes: [
      { text: 'Design & build', from: 0 },
      { text: 'Research your market', from: 1 },
      { text: 'Enquiries & bookings', from: 1 },
      { text: 'Stand out from rivals', from: 1 },
      { text: 'Show off your work', from: 2 },
      { text: 'Motion & interaction', from: 2 },
      { text: 'Campaigns & landing pages', from: 3 },
      { text: 'Prototypes for pitches', from: 3 },
      { text: 'New work every month', from: 4 }
    ],
    note: 'Note: these are estimates. You get a fixed quote, or we negotiate a monthly agreement on contract, before anything starts.',
    cta: 'Get a fixed quote'
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
