// The words and links for the Living Histories page (the "story" layout).
//
// Drafted from copy.md. Change the words here; the layout is in
// ../ProjectStory-LivingHistories.js and doesn't need to be touched.
//
// Small bits of markup work inside any `text`:
//   **bold**   `code`   [link text](https://example.com)
//
// BLOCKS inside a document section, in the order they appear:
//   { type: 'p',      text }
//   { type: 'h3',     text }
//   { type: 'figure', src, alt, caption }
//   { type: 'code',   title, language: 'js' | 'text', code, caption }
//   { type: 'draft',  text }       a dashed "draft" note, only in `npm start`
//   { type: 'stage',  title, before, after, afterLabel, rows: [{ label, text }],
//                     visual, code }
//                      one step of the Process. `visual` is a note about a
//                      picture still to be made: shown as a dashed placeholder
//                      in `npm start`, and not at all on the live site.

const FLICKR = 'https://www.flickr.com/photos/geekulcha/albums/72177720325835702/';
const YOUTUBE = 'https://www.youtube.com/watch?v=YwHBtCoK-wE';
const FRONTEND_REPO = 'https://github.com/king-maverickk/Living-Histories-Frontend';
const BACKEND_REPO = 'https://github.com/king-maverickk/new-Living-Histories-Backen';

const ARCHITECTURE = `React app                        Azure Static Web Apps
  │  where you are               Google Maps JavaScript API + Geocoding
  ▼
Azure Functions (Node.js)
  ├─ events    Azure OpenAI suggests events from the past 80 years nearby
  ├─ script    Azure OpenAI writes the episode for Elijah and Ayana
  ├─ voices    Azure AI Speech gives each host a voice
  ├─ audio     Blob Storage keeps the audio
  └─ saving    a queue writes each episode to Cosmos DB`;

// A simplified outline of the gateway's logic, written for this page. It is
// not the original file (that was removed in 9855cb3). Swap in a real excerpt
// from b3c4b88 if you'd rather show the code itself.
const GATEWAY = `// in front of the episode endpoint
const visitor = hash(clientIp);          // a hash, never the IP itself

const { usage, etag } = await readBlob('usage');
const paidUsers = await readBlob('paid-users');

const overLimit = !paidUsers.includes(visitor) && usage[visitor] >= 1;
if (overLimit) return { status: 429 };   // one free episode a day

usage[visitor] = (usage[visitor] || 0) + 1;
// ifMatch: the write fails if another request saved first
await writeBlob('usage', usage, { ifMatch: etag });

return forward(request, 'orchestrator');`;

const LIVING_HISTORIES_STORY = {
  // The big sentence under the heading. A list of words and small pictures,
  // in order (same idea as `sentence` in projects.js, with a `ratio` for each
  // picture: width / height).
  lede: [
    'A phone-first map that finds where you are',
    { img: '/assets/Home/project_living_histories.webp', alt: '', ratio: 1.5 },
    ', suggests events from the past 80 years around you, and turns the one you pick into a two-voice',
    { img: '/assets/Home/about_speech_bubble.png', alt: '', ratio: 1.2 },
    'podcast episode.'
  ],

  facts: {
    type: 'Hackathon, then personal project · 2025 – 2026',
    // `photo` replaces the initials (a square image works best; it's shown
    // as a 24px circle). `href` makes the chip a link that opens in a new tab.
    team: [
      {
        name: 'Lesibana Ngoepe',
        initials: 'LN',
        photo: '/assets/Home/lesibana_ngoepe.webp',
        href: 'https://www.linkedin.com/in/lesibana-ngoepe-junior-software-developer/',
        title: 'Lesibana Ngoepe on LinkedIn'
      },
      { name: 'Motheo Moleko', initials: 'MM', photo: '/assets/Home/my-face.png' }
    ],
    result: { label: 'Finished 3rd', img: '/assets/Home/about_bronze_medal.png' },
    // These open in a new tab. The photos are Geekulcha's, so they're linked
    // rather than copied here.
    media: [
      { kind: 'photos', label: 'Photos', href: FLICKR, title: 'Hackathon photos by Geekulcha, on Flickr' },
      { kind: 'youtube', label: 'YouTube', href: YOUTUBE, title: 'Microsoft AI for Good Hackathon 2025 South Africa, on YouTube' }
    ]
  },

  // The two cards under "My role": a short vertical timeline each.
  // icon: 'code' | 'cloud' | 'slides' | 'react' | 'figma'
  roles: [
    {
      title: 'At the hackathon',
      steps: [
        { icon: 'code', label: 'Backend' },
        { icon: 'cloud', label: 'Cloud deployment' },
        { icon: 'slides', label: 'Pitch, presentation & speech' }
      ]
    },
    {
      title: 'Afterwards',
      steps: [
        { icon: 'code', label: 'Backend & Azure' },
        { icon: 'react', label: 'React front end' },
        { icon: 'figma', label: 'UI redesign in Figma' }
      ]
    }
  ],

  // The document under the cards.
  doc: [
    {
      id: 'idea',
      title: 'The idea',
      blocks: [
        { type: 'p', text: 'What if, no matter where you were, you could hear a narrated collection of events from the past 80 years around you?' },
        { type: 'p', text: 'Open the app and it asks for your location. It suggests events and cultural or political moments from the last 80 years near you. Pick one, and two hosts talk you through it in a short podcast episode. Elijah is “the curious, creative one” and Ayana is “the brainy powerhouse”. The script names real places you could walk to, like statues, streets, museums and food, along with a few lesser-known details.' },
        { type: 'h3', text: 'How it fits together' },
        { type: 'p', text: 'Google Maps finds where you are. Azure OpenAI suggests the events and writes the script, and Azure AI Speech gives the two hosts their voices. The backend is Azure Functions, with Blob Storage for the audio and a queue that saves each episode to Cosmos DB. The React front end runs on Azure Static Web Apps.' },
        { type: 'code', title: 'How it fits together', language: 'text', code: ARCHITECTURE }
      ]
    },
    {
      id: 'role',
      title: 'My role in detail',
      blocks: [
        { type: 'p', text: `Lesibana Ngoepe and I built it in 36 hours, as team Plus+Plus, at Microsoft South Africa’s AI for Good hackathon. It was held at their head office in Bryanston on 3–4 May 2025. I handled the backend, cloud deployment and the pitch. Lesibana built the front end, and we did the research and the presentation together. We placed 3rd.` },
        { type: 'figure', src: '/assets/Home/project_me_at_microsoft.webp', alt: 'At the Microsoft hackathon', caption: 'At the Microsoft hackathon.' },
        { type: 'p', text: `The two public repos ([front end](${FRONTEND_REPO}) and [back end](${BACKEND_REPO})) are the versions I rebuilt after the hackathon. The code we wrote during those 36 hours was scrappy and only had to get us through the demo. From then on I worked alone: I did the redesign, the front end, the backend and the Azure resources.` }
      ]
    },
    {
      id: 'process',
      title: 'Process',
      blocks: [
        {
          type: 'stage',
          title: 'From a South African pitch to anywhere in the world',
          before: '“Afri_AI by Plus+Plus”. The deck framed it around South African history fading from memory, for South African places.',
          after: 'Living Histories (briefly “Ground Speak”). The front end was renamed on 5 June 2025, and on 17 June the country became part of every request (`95070e4`), so the events and the script follow wherever the listener is.',
          rows: [
            { label: 'Why', text: 'The African framing was for the pitch. The idea works anywhere in the world.' }
          ],
          visual: 'Side by side: the deck’s title slide next to the app’s top bar'
        },
        {
          type: 'stage',
          title: 'From a hackathon demo to a designed app',
          before: 'The demo front end: Vite and Tailwind, built in a weekend to present (`FrontendSrc_V2.zip`). It worked, but it didn’t look like an app anyone would download.',
          after: 'I redesigned the layout in Figma and exported it one component at a time with a design-to-code tool. Each export arrived as a “blank”: the main screen, the event picker and the generate button, with the look but no behaviour. I wired them up between 18 May and 5 June 2025: the map, geocoding, events from the backend and the audio cards.',
          rows: [
            { label: 'Why', text: 'The demo needed to become something people would actually use. The design-to-code tool exports Create React App projects, and building on its output was easier than porting each export to Vite.' },
            { label: 'What it cost', text: 'Vite’s faster tooling. Create React App is no longer maintained.' }
          ],
          visual: 'Drag to compare at phone width: the demo against the redesign'
        },
        {
          type: 'stage',
          title: 'Wiring the design up with an AI agent',
          before: 'One 500-line `MainView` component holding the map, location, events and audio.',
          after: '9 components, 4 hooks and 4 context providers, with documentation. This was done in June 2025 with Manus, an AI agent.',
          rows: [
            { label: 'Why', text: 'My plan was to design, export, and have an agent help wire up the client side. It was my first time building a web UI with an agent. The result worked, but it was lacklustre. Describing a design and its interactions in words alone was hard, and the agents of the time weren’t good at it. Now I sketch designs, interactions and motion first, and give the agent those.' }
          ]
        },
        {
          type: 'stage',
          title: 'Coming back certified: rebuilt to run on about US$5 a month',
          before: 'I had shut down most of the Azure resources to save money. The AI calls went through an Azure OpenAI Assistant, the voices were the Dragon HD previews, and nothing limited how many episodes a visitor could make.',
          afterLabel: 'After · Oct – Nov 2025',
          after: 'I moved the AI calls to plain Chat Completions, with the prompts in the code, and moved to the standard neural voices. I put a gateway in front of the episode endpoint. It gave each visitor one free episode a day, tracked by a hashed IP address rather than the IP itself. It kept a list of paid users, stored both lists in Blob Storage with ETag checks so concurrent requests couldn’t overwrite each other, and answered `429` over the limit.',
          rows: [
            { label: 'Why', text: 'I had earned the Azure Developer Associate certification in August 2025 and came back with new skills. I wanted to demo the app to family and friends without the Azure bill going past about US$5 a month. A paid tier was a real plan, but the app was never launched.' }
          ],
          code: {
            title: 'The gateway, in outline',
            language: 'js',
            code: GATEWAY,
            caption: 'A simplified outline of the gateway’s logic, not the original code (commit `b3c4b88`).'
          }
        },
        {
          type: 'stage',
          title: 'The last update, and stopping',
          rows: [
            { label: 'What changed · Apr – May 2026', text: 'A newer GPT model (5.4) with tweaked prompts, local development with Azurite, and a README. The gateway was reverted on 27 April, and the front end was pointed back at the episode endpoint on 4 May.' },
            { label: 'Why it stopped', text: 'The project needs full-time dedication and a team with a focus on business, launching and selling the product to people. The AI isn’t ready yet either: the voices aren’t good enough, the cost is high, it makes mistakes, and connecting to real history databases needs research and a team.' },
            { label: 'Status', text: 'Prototype, paused. Never launched.' }
          ]
        }
      ]
    },
    {
      id: 'challenges',
      title: 'Challenges',
      blocks: [
        { type: 'h3', text: 'AI making up history' },
        { type: 'p', text: 'We knew from the start that this could undermine the whole idea. At the hackathon Lesibana and I split the research so we weren’t both reading the same thing, and looked at retrieval-augmented generation to ground the model in real sources. With less than two days, there were too many moving parts to build it safely. So we gave part of the pitch to the problem instead: what hallucination is, and how, with funding, we’d ground the hosts in South African archives’ websites, offline media and news publishers. The judges appreciated that we were upfront about it. The current code tells the model it is “a factual historian” when it lists events, but nothing checks what it says.' },
        { type: 'h3', text: 'Location data and security' },
        { type: 'p', text: 'The app needs your location, so I wrote a security audit for how it should be handled, including Microsoft Entra ID sign-in between the front end and the backend. I didn’t build it. Security was new to me then, and switching to it from designing and developing felt like a big change of context. I chose to do the core of the app well rather than everything badly. Every function in the current backend is open to anyone.' },
        { type: 'h3', text: 'Cost' },
        { type: 'p', text: 'Every episode calls paid AI and speech services, so visitors couldn’t be allowed to make unlimited episodes. The gateway described above was the answer: one free episode a day per visitor, and a list of paid users. It came out in April 2026, and the app was never launched.' }
      ]
    },
    {
      id: 'retrospective',
      title: 'Retrospective',
      blocks: [
        { type: 'draft', text: 'Drafted from your notes in copy.md. Rewrite in your voice.' },
        { type: 'h3', text: 'What I’m proud of' },
        { type: 'p', text: 'The presentation we put on at the hackathon, and that it landed us 3rd. It was my third hackathon, and finishing that close to first, in a competition of 160+ teams and 390 people across the country, is a result I’m proud of.' },
        { type: 'h3', text: 'What it taught me' },
        { type: 'p', text: 'React context and providers, hands-on. An effective web app does a lot of its work on the client side, preparing and working with abstract ideas before they’re finally used, and this project gave me a boots-on-the-ground understanding of that.' },
        { type: 'p', text: 'Learning how to work with AI was the biggest part of it: how to talk to agents and LLMs about design features in code, and the do’s and don’ts of it. I can see the difference in my work with AI agents in development now.' },
        { type: 'h3', text: 'What I’d do differently' },
        { type: 'p', text: 'I’d learn how to convey ideas to an LLM sooner. Then I would have done a better job than I did with straight words alone.' },
        { type: 'p', text: 'And I’d give security more effort. I could do one thing well or everything poorly and burn out, and given the opportunity, I’d go back and put more into the security side.' }
      ]
    }
  ]
};

export default LIVING_HISTORIES_STORY;
