// The moves between a project list and a project page.
//
// Going in:  the other rows part (the ones above slide up, the ones below
//            slide down) and fade; the page changes to /projects/<id>; the
//            heading then glides from where its row was to the top.
// Coming back (heading click, Esc, back button, browser back): the heading
//            glides from the top back to its row, and the other rows return
//            from above and below.
//
// The two pages don't share a component, so they pass a note through
// sessionStorage: where the list was scrolled and which row was picked, and,
// when leaving a project, where its heading was on screen.

const RETURN_KEY = 'projects:return';   // { origin, id, y, at }
const HEADING_KEY = 'projects:heading'; // { id, rect, at }
// The heading note is written as you leave a project, so it only needs to last
// a moment. The pick is written when you open one and has to outlast however
// long you spend reading it.
const HEADING_FRESH_MS = 15000;
const PICK_FRESH_MS = 2 * 60 * 60 * 1000;

const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.5, 0, 0.75, 0)';
const GLIDE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const PART_DISTANCE = 80; // px the other rows travel

export function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canAnimate() {
  return !prefersReducedMotion() && typeof Element !== 'undefined'
    && typeof Element.prototype.animate === 'function';
}

function write(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ ...value, at: Date.now() }));
  } catch (error) { /* private mode etc.: the move just won't be animated */ }
}

function read(key, maxAge) {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(key));
    return value && Date.now() - value.at < maxAge ? value : null;
  } catch (error) {
    return null;
  }
}

function clear(key) {
  try { window.sessionStorage.removeItem(key); } catch (error) { /* ignore */ }
}

function plainRect(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { left, top, width, height };
}

// --- Notes between the pages ----------------------------------------------------

export function rememberPick(origin, id) {
  write(RETURN_KEY, { origin, id, y: window.scrollY });
}

export function rememberHeading(id, element) {
  if (element) write(HEADING_KEY, { id, rect: plainRect(element) });
}

// For a list that's just mounted: is someone coming back to it from a project?
// Returns { id, y, rect } (rect = where the heading was) or null.
export function peekReturn(origin) {
  const pick = read(RETURN_KEY, PICK_FRESH_MS);
  const heading = read(HEADING_KEY, HEADING_FRESH_MS);
  if (!heading) return null;
  if (pick && pick.origin === origin && pick.id === heading.id) {
    return { id: heading.id, y: pick.y, rect: heading.rect };
  }
  // Arrived on the list from a project opened directly (no pick to go back to).
  if (!pick && origin === 'projects') return { id: heading.id, y: null, rect: heading.rect };
  return null;
}

export function clearNotes() {
  clear(RETURN_KEY);
  clear(HEADING_KEY);
}

export { plainRect };

// --- Moves ------------------------------------------------------------------------

// The rows that aren't `picked` part around it and fade; `alsoFade` elements
// (labels, buttons, the page header) just fade. Resolves when done.
export function partRows(rows, picked, alsoFade = []) {
  if (!canAnimate()) return Promise.resolve();
  const pickedIndex = rows.indexOf(picked);

  const animations = rows.map((row, index) => {
    if (row === picked) return null;
    const direction = index < pickedIndex ? -1 : 1;
    const distanceAway = Math.abs(index - pickedIndex);
    return row.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${direction * PART_DISTANCE}px)`, opacity: 0 }
      ],
      { duration: 420, delay: (distanceAway - 1) * 40, easing: EASE_IN, fill: 'forwards' }
    );
  }).filter(Boolean);

  alsoFade.filter(Boolean).forEach((element) => {
    animations.push(element.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 280, easing: 'ease', fill: 'forwards' }
    ));
  });

  return Promise.all(animations.map((animation) => animation.finished)).catch(() => {});
}

// Glides `element` from `fromRect` (where something was on screen) to where it
// is now. Size changes become a scale, so the text glides rather than reflows.
export function glideFrom(element, fromRect, { duration = 720, delay = 0 } = {}) {
  if (!element || !fromRect || !canAnimate()) return Promise.resolve();
  const to = element.getBoundingClientRect();
  if (!to.width || !to.height) return Promise.resolve();

  const dx = (fromRect.left + fromRect.width / 2) - (to.left + to.width / 2);
  const dy = (fromRect.top + fromRect.height / 2) - (to.top + to.height / 2);
  const scale = fromRect.height / to.height;

  return element.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, transformOrigin: 'center center' },
      { transform: 'translate(0, 0) scale(1)', transformOrigin: 'center center' }
    ],
    { duration, delay, easing: GLIDE, fill: 'backwards' }
  ).finished.catch(() => {});
}

// Coming back to a list: the other rows return from above and below, and the
// picked row glides from where the heading was.
export function returnRows(rows, picked, headingRect, alsoFade = []) {
  if (!canAnimate()) return Promise.resolve();
  const pickedIndex = rows.indexOf(picked);

  const animations = rows.map((row, index) => {
    if (row === picked) return glideFrom(row, headingRect, { duration: 680 });
    const direction = index < pickedIndex ? -1 : 1;
    const distanceAway = Math.abs(index - pickedIndex);
    return row.animate(
      [
        { transform: `translateY(${direction * PART_DISTANCE}px)`, opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      { duration: 560, delay: 220 + (distanceAway - 1) * 50, easing: EASE_OUT, fill: 'backwards' }
    ).finished;
  });

  alsoFade.filter(Boolean).forEach((element) => {
    animations.push(element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 420, delay: 380, easing: 'ease', fill: 'backwards' }
    ).finished);
  });

  return Promise.all(animations).catch(() => {});
}

// Leaving a project page: its columns fade out before the heading goes back.
export function fadeOut(elements, duration = 240) {
  if (!canAnimate()) return Promise.resolve();
  return Promise.all(elements.filter(Boolean).map((element) => element.animate(
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(12px)' }],
    { duration, easing: EASE_IN, fill: 'forwards' }
  ).finished)).catch(() => {});
}

// The browser remembers a scroll mode per history entry. The list and project
// pages put the scroll back themselves, so tell the browser not to jump first
// (only for these entries; the rest of the site keeps the default).
export function manualScroll() {
  try {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  } catch (error) { /* ignore */ }
}
