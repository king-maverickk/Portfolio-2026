// How other parts of the site open the contact form: a sheet's "Start a
// project" button calls startContact('website'), the contact section hears it,
// picks that answer, scrolls into view and puts the cursor in the first blank.
// The site header's "Contact" and "Let's talk" call startContact() with no
// answer picked.
//
// The section only exists on the home page. From any other page the header
// goes home first, so the request waits here until the section arrives and
// picks it up (for a couple of seconds at most).
//
// Kept in its own file (no imports) so the sheets, the header and the section
// can all use it without importing each other.

export const CONTACT_EVENT = 'contact:start';

// The answers to "and I'm …" in the sentence. The words are what the visitor
// sees, so change them here and nowhere else.
export const REASONS = {
  hiring: 'hiring for a role',
  website: 'after a new website'
};

const WAIT_MS = 2000;
let waiting = null;

export function startContact(reason) {
  const detail = { reason: REASONS[reason] };
  waiting = { detail, at: Date.now() };
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail }));
}

// Whoever handles the request takes it, so it is only ever answered once.
export function takeContactRequest() {
  const request = waiting;
  waiting = null;
  if (!request || Date.now() - request.at > WAIT_MS) return null;
  return request.detail;
}
