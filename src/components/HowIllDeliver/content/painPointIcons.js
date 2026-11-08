import React from 'react';

// App-style icon tiles for the pain point cards (38 x 38, drawn flat so
// several can share a page without clashing gradient ids). Decorative only.
// Pick one per card in copy.js with `icon: '<name>'`.

const calendar = (
  <>
    <rect width="38" height="38" fill="#fff" />
    <rect width="38" height="11" fill="#ff3b30" />
    <rect x="13" y="4" width="12" height="3" rx="1.5" fill="#fff" opacity="0.85" />
    <rect x="12" y="17" width="4" height="4" rx="1" fill="#1c1c1e" />
    <rect x="17" y="17" width="4" height="4" rx="1" fill="#1c1c1e" />
    <rect x="22" y="17" width="4" height="4" rx="1" fill="#ff3b30" />
    <rect x="12" y="23" width="4" height="4" rx="1" fill="#1c1c1e" />
    <rect x="17" y="23" width="4" height="4" rx="1" fill="#1c1c1e" />
    <rect x="22" y="23" width="4" height="4" rx="1" fill="#1c1c1e" />
  </>
);

const badge = (
  <>
    <rect width="38" height="38" fill="#fff" />
    <path
      d="M19 6l3.2 2.6 4.1-.4 1.2 3.9 3.6 2-.9 4 2 3.6-3 2.8-.2 4.1-4 .9-2.3 3.4-3.7-1.7-3.7 1.7-2.3-3.4-4-.9-.2-4.1-3-2.8 2-3.6-.9-4 3.6-2 1.2-3.9 4.1.4z"
      fill="#2f86ff"
    />
    <path
      d="M13.5 19.5l3.8 3.8 7.4-7.6"
      fill="none"
      stroke="#fff"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

const builder = (
  <>
    <rect width="38" height="38" fill="#2b2b2b" />
    <rect x="8" y="8" width="10" height="10" rx="2" fill="#fff" />
    <rect x="20" y="8" width="10" height="10" rx="2" fill="#fff" opacity="0.55" />
    <rect x="8" y="20" width="22" height="10" rx="2" fill="#fff" opacity="0.8" />
  </>
);

const analytics = (
  <>
    <rect width="38" height="38" fill="#ff9500" />
    <rect x="9" y="11" width="5" height="17" rx="1.5" fill="#fff" />
    <rect x="16.5" y="17" width="5" height="11" rx="1.5" fill="#fff" opacity="0.85" />
    <rect x="24" y="23" width="5" height="5" rx="1.5" fill="#fff" opacity="0.7" />
  </>
);

const notes = (
  <>
    <rect width="38" height="38" fill="#fff" />
    <rect width="38" height="10" fill="#ffd60a" />
    <g stroke="#d9d9de" strokeWidth="1.2">
      <line x1="6" y1="17" x2="32" y2="17" />
      <line x1="6" y1="23" x2="32" y2="23" />
      <line x1="6" y1="29" x2="32" y2="29" />
    </g>
  </>
);

const messages = (
  <>
    <rect width="38" height="38" fill="#30d158" />
    <path
      d="M19 9c-6.6 0-11.5 4.2-11.5 9.4 0 3 1.6 5.6 4.2 7.3-.2 1.6-1 3.1-2.3 4.2 2.4 0 4.6-.9 6.2-2.3 1.1.2 2.2.3 3.4.3 6.6 0 11.5-4.2 11.5-9.5S25.6 9 19 9z"
      fill="#fff"
    />
  </>
);

const phone = (
  <>
    <rect width="38" height="38" fill="#30d158" />
    <path
      d="M14.2 9.5c.6-.2 1.2 0 1.6.6l2.3 3.6c.4.6.3 1.4-.2 1.9l-1.6 1.5c.9 2.1 2.6 3.9 4.7 4.8l1.5-1.6c.5-.5 1.3-.6 1.9-.2l3.6 2.3c.6.4.8 1 .6 1.6-.7 2.4-2.9 3.9-5.3 3.4-6.3-1.3-11.1-6.1-12.4-12.4-.5-2.4 1-4.6 3.3-5.5z"
      fill="#fff"
    />
  </>
);

const ICONS = { calendar, badge, builder, analytics, notes, messages, phone };

export const ICON_NAMES = Object.keys(ICONS);

export default function PainPointIcon({ name }) {
  const shape = ICONS[name];
  if (!shape) return null;
  return (
    <svg viewBox="0 0 38 38" aria-hidden="true" focusable="false">
      {shape}
    </svg>
  );
}
