// The words and links in the site header. Change them here.
//
// AUDIENCES are the three cards on the left of the open menu. Each one opens
// the matching sheet from "How I'll deliver for you" on the home page (the
// `sheet` id is the one HowIllDeliver uses). The colours match its labels.

export const AUDIENCES = [
  {
    sheet: 'hiring-manager',
    title: 'Hiring managers',
    leadsTo: 'Résumé',
    text: 'Looking for a designer-developer? My résumé, a cover letter and how I work.',
    tag: '(hiring manager)',
    color: '#3794FE'
  },
  {
    sheet: 'freelance',
    title: 'Freelance / contract',
    leadsTo: 'Quote',
    text: 'For businesses that depend on enquiries, bookings and trust. How a project runs, and pricing.',
    tag: '(freelance/contract)',
    color: '#22C55E'
  },
  {
    sheet: 'open-to-work',
    title: 'Open to work',
    leadsTo: 'Now',
    text: 'What I’m looking for, where I’m based and when I can start.',
    tag: '(open to work)',
    color: '#ff4d4d'
  }
];

// The big links on the right. `to` is where each one goes; `hash` is the part
// of that page it lands on.
export const NAV = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'projects', label: 'Projects', to: '/projects' },
  { id: 'unfinished', label: 'Unfinished', to: '/projects', hash: '#unfinished' },
  { id: 'lab', label: 'Lab', to: '/lab' },
  { id: 'contact', label: 'Contact', to: '/', hash: '#contact' }
];

export const WORDS = {
  name: 'motheo moleko',
  homeLabel: 'motheo moleko, home',
  audienceButton: 'Who are you? Open the three ways I work',
  menuButton: 'Open the menu',
  close: 'Close the menu',
  dialog: 'Menu',
  menu: 'Menu',
  talk: 'Let’s talk',
  elsewhere: 'Elsewhere'
};
