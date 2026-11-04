import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './demos.module.scss';

const MOBILE_QUERY_MAX = 767;

/**
 * Shows a full-width page section inside a Lab card, as if in a small browser
 * window: it lays out at `width` px (`mobileWidth` on phones, so the
 * component's own mobile styles show), then scales down to fit the card.
 * Hover and clicks still work through the scale.
 *
 * The component only mounts while the card is on or near the screen, and
 * unmounts when it's scrolled well away, so its videos and animations stop.
 */
function ScaledFrame({ children, width = 1280, mobileWidth = 390, background = '#ffffff' }) {
  const outerRef = useRef(null);
  const [box, setBox] = useState(null);
  const [near, setNear] = useState(false);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;

    const measure = () => {
      const rect = outer.getBoundingClientRect();
      const virtualWidth = window.innerWidth <= MOBILE_QUERY_MAX ? mobileWidth : width;
      const scale = rect.width > 0 ? rect.width / virtualWidth : 1;
      setBox({
        scale,
        width: virtualWidth,
        height: rect.height > 0 ? rect.height / scale : virtualWidth / 1.6
      });
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [width, mobileWidth]);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;

    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    );
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className={styles.frame} style={{ background }}>
      {near && box && (
        <div
          className={styles.frameInner}
          style={{
            width: box.width,
            height: box.height,
            transform: `scale(${box.scale})`
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

ScaledFrame.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
  mobileWidth: PropTypes.number,
  background: PropTypes.string
};

export default ScaledFrame;
