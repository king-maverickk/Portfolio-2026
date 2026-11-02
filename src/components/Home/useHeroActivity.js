import { useEffect, useState } from 'react';

/**
 * Tells the hero when it is worth keeping alive.
 *
 * - The moment the hero leaves the viewport, or the tab is hidden, it sets
 *   `data-offscreen="true"` on the root. The stylesheet pauses every animation
 *   off that attribute. It is set on the element directly, not through React
 *   state, so pausing costs no re-render.
 * - It returns `active`: true while the hero is on screen and for `graceMs`
 *   after it leaves, then false. HeroPanel uses that to let go of its video
 *   file. The grace period stops a quick scroll past the hero (and back) from
 *   unloading and reloading the videos.
 */
export default function useHeroActivity(rootRef, graceMs = 3000) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    let intersecting = true;
    let timer = null;

    const apply = () => {
      const offscreen = !intersecting || document.hidden;
      node.dataset.offscreen = offscreen ? 'true' : 'false';

      window.clearTimeout(timer);
      if (offscreen) {
        timer = window.setTimeout(() => setActive(false), graceMs);
      } else {
        setActive(true);
      }
    };

    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        apply();
      });
      observer.observe(node);
    }

    document.addEventListener('visibilitychange', apply);
    apply();

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', apply);
      if (observer) observer.disconnect();
      delete node.dataset.offscreen;
    };
  }, [rootRef, graceMs]);

  return active;
}
