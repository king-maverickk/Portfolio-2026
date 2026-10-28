import { useEffect, useState } from 'react';

// "scaled": the two-column composition, drawn on a 1440 x 900 board and scaled to fit the viewport.
//           Used on desktops and landscape tablets, as long as scaling stays legible (about 0.7x at the smallest).
// "stacked": one scrolling column. Used on phones and portrait tablets.
export const SCALED_QUERY = '(min-width: 1000px) and (min-height: 620px) and (min-aspect-ratio: 5/4)';

const read = () => (
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia(SCALED_QUERY).matches
    ? 'scaled'
    : 'stacked'
);

export default function useSheetLayout() {
  const [layout, setLayout] = useState(read);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia(SCALED_QUERY);
    const update = () => setLayout(mediaQuery.matches ? 'scaled' : 'stacked');

    update();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    if (mediaQuery.addListener) {
      mediaQuery.addListener(update);
      return () => mediaQuery.removeListener(update);
    }
    return undefined;
  }, []);

  return layout;
}
