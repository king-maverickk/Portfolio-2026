// How other parts of the site open one of the three sheets: the site header's
// cards call openDeliverySheet('freelance', button) and "How I'll deliver for
// you" opens that sheet. `returnFocus` is where the keyboard goes back to when
// the sheet closes (the header button that started it).
//
// The section only exists on the home page. From any other page the header
// goes home first, so the request waits here until the section arrives and
// picks it up (for a couple of seconds at most).
//
// Kept in its own file (no imports) so the header and the section can both use
// it without importing each other.

export const DELIVERY_EVENT = 'delivery:open';

const WAIT_MS = 2000;
let waiting = null;

export function openDeliverySheet(id, returnFocus) {
  waiting = { id, returnFocus, at: Date.now() };
  window.dispatchEvent(new CustomEvent(DELIVERY_EVENT));
}

// Whoever handles the request takes it, so it is only ever answered once.
export function takeDeliveryRequest() {
  const request = waiting;
  waiting = null;
  if (!request || Date.now() - request.at > WAIT_MS) return null;
  return request;
}
