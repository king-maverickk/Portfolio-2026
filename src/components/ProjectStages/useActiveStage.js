import { useEffect, useRef, useState } from 'react';

export function useActiveStage(count) {
  const [active, setActive] = useState(0);
  const tileRefs = useRef([]);

  useEffect(() => {
    const tiles = tileRefs.current.slice(0, count).filter(Boolean);
    if (!tiles.length || typeof IntersectionObserver === 'undefined') return undefined;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: isMobile ? '-25% 0px -60% 0px' : '-45% 0px -45% 0px' }
    );

    tiles.forEach((tile) => observer.observe(tile));
    return () => observer.disconnect();
  }, [count]);

  return { active, setActive, tileRefs };
}
