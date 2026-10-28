import FreelanceSheet from './FreelanceSheet';
import HiringManagersSheet from './HiringManagersSheet';

// The annotations that open a two-column sheet, and the glow behind each: its color, and where its center sits on the
// 1440 x 900 board (x as a CSS length from the left edge, y in design pixels from the top).
// An annotation that is not listed here opens the original single sheet.
const SHEETS = {
  'hiring-manager': { Component: HiringManagersSheet, glow: '#2864e8', glowAt: { x: '50%', y: 388 } },
  freelance: {
    Component: FreelanceSheet,
    glow: '#22c55e',
    glowAt: { x: 'calc(100% - 310 * var(--u))', y: 423 }
  }
};

export default SHEETS;
