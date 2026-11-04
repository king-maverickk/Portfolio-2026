// How other parts of the site open the contact form: a sheet's "Start a
// project" button calls startContact('website'), the contact section hears it,
// picks that answer, scrolls into view and puts the cursor in the first blank.
//
// Kept in its own file (no imports) so the sheets and the section can both use
// it without importing each other.

export const CONTACT_EVENT = 'contact:start';

// The answers to "and I'm …" in the sentence. The words are what the visitor
// sees, so change them here and nowhere else.
export const REASONS = {
  hiring: 'hiring for a role',
  website: 'after a new website'
};

export function startContact(reason) {
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail: { reason: REASONS[reason] } }));
}
