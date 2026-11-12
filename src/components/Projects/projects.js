// Your projects. One object per project; the home list, the /projects list
// and each project's page all read from here.
//
// EVERY FIELD, in the order it appears on the project page:
//
//   id         the address: /projects/<id>
//   name       the heading
//   images     [left, right] pictures beside the name (same one twice is fine)
//   year, category, role
//              the small line under "Project context"
//   sentence   the short sentence at the top of the context, with small
//              pictures in it. A list of words and pictures, in order:
//                'Some words', { img: '/path.png', alt: '' }, 'more words.'
//              It's also what shows on the compact card in the media view.
//   context    a short paragraph: what the project is and who it was for
//   intention  the small but important paragraph that sets up the sections
//   sections   the talking points, each { title, text, img? }:
//                "Design and technical choices", "Away from code", ...
//   stack      tools used, as keys from toolIcons.js (real logos) or its
//              TEXT_ONLY list (shown as labelled pills)
//   style      { colors: ['#hex', ...], fonts: ['Font name', ...] }
//              shown as swatches and the font set big. Leave empty to hide.
//   video      plays in the box on the right. null = shows `poster` instead
//              (handy until you've recorded it)
//   poster     a still for the right-hand box
//   media      everything for the media view: { src, type: 'image' | 'video',
//              alt }. The first is shown large.
//   story      optional. A project with a `story` gets a page that reads top
//              to bottom (big sentence, facts, roles, then a document)
//              instead of the context/media views. Its words live in
//              stories/<project>.js. The fields above still feed the lists.
//
// `draft: true` = Claude wrote the words from your resume and notes. In
// `npm start` they get a dashed "draft" tag; rewrite them in your voice.

import LIVING_HISTORIES_STORY from './stories/livingHistories';

const PROJECTS = [
  {
    id: 'photos-by-alex',
    name: 'Photos by Alex',
    images: ['/assets/Home/project_alex_text_in_photos.png', '/assets/Home/project_alex_floating_nav.webp'],
    year: '2026',
    category: 'Client',
    role: 'Design and build',
    sentence: [
      'A portfolio for',
      { img: '/assets/Lab/PhotosByAlexNav/PBA-logo.jpg', alt: '' },
      'a Hamilton photographer, where the photographs lead',
      { img: '/assets/Lab/LiveEventsHover/home_guitar_lady.png', alt: '' },
      'and every album plays a clip as you browse',
      { img: '/assets/Lab/GalleryCard/posters/2026-sandman.jpg', alt: '' },
      '.'
    ],
    context: 'Alex photographs weddings, live music and events around Hamilton. The site is where people decide whether to book him, so it had to show his work before anything else.',
    intention: 'The photographs are the product. Every choice below is about getting out of their way, and making the few things around them feel considered.',
    sections: [
      {
        title: 'Design and technical choices',
        img: '/assets/Lab/GalleryCard/posters/2026-hamilton-fashion-week.jpg',
        text: 'A warm stone background (#DCD7CF) instead of grey, so the photos sit warm. Gallery cards play a one-second clip on hover, and the reverse plays from a second, pre-reversed video file rather than scrubbing in JavaScript, so it stays smooth.'
      },
      {
        title: 'Away from code',
        img: '/assets/Home/project_alex_plan_and_proposal.webp',
        text: 'Research on the wedding photography market, a call to review Alex’s portfolio before committing, and a written proposal with three tiers and a monthly care plan.'
      }
    ],
    stack: ['figma', 'react', 'sass', 'azure'],
    style: { colors: ['#DCD7CF', '#F7F7F7', '#1E1E1E'], fonts: ['Outfit', 'Instrument Serif'] },
    video: '/assets/Home/demo_photo_first_layout.mp4',
    poster: '/assets/Home/project_alex_text_in_photos.png',
    media: [
      { type: 'video', src: '/assets/Home/demo_GalleryCard.mp4', alt: 'Gallery cards playing their clips' },
      { type: 'image', src: '/assets/Lab/PhotosByAlexNav/home_cover.png', alt: 'Home page' },
      { type: 'image', src: '/assets/Lab/PhotosByAlexNav/wedding_page_cover.png', alt: 'Wedding portfolio page' },
      { type: 'video', src: '/assets/Home/demo_live_events_hover_full.mp4', alt: 'Live events list with photos on hover' },
      { type: 'image', src: '/assets/Lab/PhotosByAlexNav/live_events_cover.png', alt: 'Live events page' },
      { type: 'image', src: '/assets/Home/project_alex_floating_nav.webp', alt: 'Floating navigation' }
    ],
    draft: true
  },
  {
    id: 'hamilton-creative-group',
    name: 'Hamilton Creative Group',
    images: ['/assets/Home/project_hcg_what_we_make.png', '/assets/Home/project_hcg_what_we_make.png'],
    year: '2026',
    category: 'Community',
    role: 'Founder, design and build',
    sentence: [
      'The home of',
      { img: '/assets/Home/about_hcg_mouse.png', alt: '' },
      'Hamilton Creative Group, a meetup I started so digital creatives in a small city can find each other.'
    ],
    context: 'I started HCG to meet and befriend other digital creatives in Hamilton. It now runs two weekly meetups, and the site is the front door.',
    intention: 'A community site has to feel like the room it invites you into: hands-on, a bit playful, and easy to say yes to.',
    sections: [
      {
        title: 'Design and technical choices',
        img: '/assets/Home/project_hcg_what_we_make.png',
        text: 'Pieces of the page you can pick up and drag around, so the site feels as hands-on as the meetups. Clear sections for what members make and the software they use.'
      },
      {
        title: 'Away from code',
        text: 'Venue outreach to Farside, Cotton Factory, Gas Works and Centre 3, an Instagram and a subreddit alongside the site, and two weekly meetups running.'
      }
    ],
    stack: ['figma', 'react', 'azure'],
    style: { colors: [], fonts: [] },
    video: '/assets/Home/demo_draggable_components.mp4',
    poster: '/assets/Home/project_hcg_what_we_make.png',
    media: [
      { type: 'video', src: '/assets/Home/demo_draggable_components.mp4', alt: 'Draggable components on the site' },
      { type: 'image', src: '/assets/Home/project_hcg_what_we_make.png', alt: 'What we make section' }
    ],
    draft: true
  },
  {
    id: 'living-histories',
    name: 'Living Histories',
    images: ['/assets/Home/project_living_histories.webp', '/assets/Home/project_me_at_microsoft.webp'],
    year: '2025 – 2026',
    category: 'Hackathon',
    role: 'Backend and cloud, then redesign and full stack',
    sentence: [
      'A map that finds where you are',
      { img: '/assets/Home/project_living_histories.webp', alt: '' },
      'and turns the history around you into two-voice',
      { img: '/assets/Home/about_speech_bubble.png', alt: '' },
      'podcast episodes. 3rd place at Microsoft’s AI for Good hackathon',
      { img: '/assets/Home/about_bronze_medal.png', alt: '' },
      '.'
    ],
    context: 'Built with Lesibana Ngoepe as team Plus+Plus at Microsoft South Africa’s AI for Good hackathon, 3–4 May 2025. Open it anywhere and it suggests events from the past 80 years around you; pick one and two AI hosts talk you through it. After the hackathon I redesigned and rebuilt it on my own, on and off for a year.',
    intention: 'What if, wherever you were, you could hear what happened there in the last 80 years?',
    sections: [],
    stack: ['figma', 'react', 'azure', 'openai'],
    style: { colors: [], fonts: [] },
    video: null,
    poster: '/assets/Home/project_living_histories.webp',
    media: [
      { type: 'image', src: '/assets/Home/project_living_histories.webp', alt: 'Choosing an event in the app' },
      { type: 'image', src: '/assets/Home/project_me_at_microsoft.webp', alt: 'At the Microsoft hackathon' }
    ],
    story: LIVING_HISTORIES_STORY,
    draft: true
  },
  {
    id: 'milk-and-honey-tv',
    name: 'Milk & Honey TV',
    images: ['/assets/Home/project_milk_and_honey.webp', '/assets/Home/project_milk_and_honey.webp'],
    year: '2022 – 2023',
    category: 'Client',
    role: 'Full-stack developer',
    sentence: [
      'The company website for',
      { img: '/assets/Home/project_milk_and_honey.webp', alt: '' },
      'Milk & Honey TV, designed in Figma, built in React and deployed on Azure.'
    ],
    context: 'My role at Milk & Honey TV from September 2022 to September 2023, taking the website from design to deployment.',
    intention: '',
    sections: [
      {
        title: 'Design and technical choices',
        text: 'Designed in Figma, built in React, and deployed on an Azure Static Web App with Blob Storage for media.'
      }
    ],
    stack: ['figma', 'react', 'azure'],
    style: { colors: [], fonts: [] },
    video: null,
    poster: '/assets/Home/project_milk_and_honey.webp',
    media: [
      { type: 'image', src: '/assets/Home/project_milk_and_honey.webp', alt: 'Milk & Honey TV website' }
    ],
    draft: true
  },
  {
    id: 'virtual-guitar',
    name: 'Virtual Guitar',
    images: ['/assets/Home/project_guitar.webp', '/assets/Home/project_guitar.webp'],
    year: '',
    category: 'Personal',
    role: 'Design and build',
    sentence: [
      'A playable guitar for the desktop',
      { img: '/assets/Home/project_guitar.webp', alt: '' },
      ', shortlisted for Digital Labs Africa’s 8th edition in the video games category.'
    ],
    context: 'A desktop guitar built in Python and C# with WPF.',
    intention: '',
    sections: [],
    stack: ['python', 'csharp', 'wpf'],
    style: { colors: [], fonts: [] },
    video: null,
    poster: '/assets/Home/project_guitar.webp',
    media: [
      { type: 'image', src: '/assets/Home/project_guitar.webp', alt: 'Virtual Guitar' }
    ],
    draft: true
  }
];

export default PROJECTS;

export function findProject(id) {
  return PROJECTS.find((project) => project.id === id) || null;
}
