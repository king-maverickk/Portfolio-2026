// Your projects, used by the list on the home page and the /projects page.
// Add, remove or reorder here and both update.
//
// images: [left, right] for the home list (the same picture twice is fine);
//         the first one is also the card image on /projects.
// Everything below comes from your resume and notes; `summary` lines are
// Claude's drafts (draft: true), so rewrite them in your voice.

const PROJECTS = [
  {
    id: 'photos-by-alex',
    name: 'Photos by Alex',
    category: 'Client',
    year: '2026',
    role: 'Design and build',
    tags: ['Figma', 'React', 'Azure'],
    summary: 'A portfolio site for a Hamilton photographer: event albums with looping clips, a floating nav, and photographs that lead.',
    images: ['/assets/Home/project_alex_text_in_photos.png', '/assets/Home/project_alex_floating_nav.webp'],
    draft: true
  },
  {
    id: 'hamilton-creative-group',
    name: 'Hamilton Creative Group',
    category: 'Community',
    year: '2026',
    role: 'Founder, design and build',
    tags: ['Community', 'Weekly meets'],
    summary: 'The site for the meetup community I started for digital creatives in Hamilton, now running two weekly meetups.',
    images: ['/assets/Home/project_hcg_what_we_make.png', '/assets/Home/project_hcg_what_we_make.png'],
    draft: true
  },
  {
    id: 'living-histories',
    name: 'Living Histories',
    category: 'Hackathon',
    year: '2025',
    role: 'UI design and React front end, with one teammate',
    tags: ['3rd place, Microsoft AI for Social Good', 'Azure', 'OpenAI'],
    summary: 'A generative AI app that turns historical topics into geotagged podcast shorts with audio narration.',
    images: ['/assets/Home/project_living_histories.webp', '/assets/Home/project_me_at_microsoft.webp'],
    draft: true
  },
  {
    id: 'milk-and-honey-tv',
    name: 'Milk & Honey TV',
    category: 'Client',
    year: '2022 – 2023',
    role: 'Full-stack developer',
    tags: ['Figma', 'React', 'Azure'],
    summary: 'The company website, designed in Figma, built in React and deployed on Azure.',
    images: ['/assets/Home/project_milk_and_honey.webp', '/assets/Home/project_milk_and_honey.webp'],
    draft: true
  },
  {
    id: 'virtual-guitar',
    name: 'Virtual Guitar',
    category: 'Personal',
    year: '', // add the year and it shows
    role: 'Design and build',
    tags: ['Python', 'C#', 'WPF'],
    summary: 'A playable guitar for the desktop, shortlisted for Digital Labs Africa’s 8th edition in the video games category.',
    images: ['/assets/Home/project_guitar.webp', '/assets/Home/project_guitar.webp'],
    draft: true
  }
];

export default PROJECTS;
