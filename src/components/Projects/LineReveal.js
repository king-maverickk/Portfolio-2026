import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './LineReveal.module.scss';

// Text that slides down into place one line at a time, like the slide-up
// cards on Photos by Alex but downward and by line instead of by letter.
//
// `parts` is a list of words and pictures (see `sentence` in projects.js). The
// words are wrapped one by one, then, before the first paint, every word gets
// the number of the line it landed on, so each line drops in as a unit.
// `delay` (ms) shifts the whole block; `step` (ms) is the gap between lines.

function splitParts(parts) {
  const units = [];
  parts.forEach((part, partIndex) => {
    if (typeof part === 'string') {
      part.split(/(\s+)/).forEach((piece, pieceIndex) => {
        if (!piece) return;
        if (/^\s+$/.test(piece)) units.push({ type: 'space', key: `s${partIndex}-${pieceIndex}` });
        else units.push({ type: 'word', text: piece, key: `w${partIndex}-${pieceIndex}` });
      });
    } else if (part && part.img) {
      units.push({ type: 'space', key: `sb${partIndex}` });
      units.push({ type: 'img', src: part.img, alt: part.alt || '', key: `i${partIndex}` });
      units.push({ type: 'space', key: `sa${partIndex}` });
    }
  });
  // No space before punctuation that follows a picture (", ." etc.).
  return units.filter((unit, index) => !(unit.type === 'space'
    && units[index + 1]?.type === 'word' && /^[,.;:!?]/.test(units[index + 1].text)));
}

function LineReveal({ parts, as: Tag = 'p', className, delay = 0, step = 70, play = true }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const units = Array.from(root.querySelectorAll('[data-unit]'));
    let line = -1;
    let lastTop = null;
    units.forEach((unit) => {
      const top = unit.offsetTop;
      if (lastTop === null || top > lastTop + 4) {
        line += 1;
        lastTop = top;
      }
      unit.style.setProperty('--line', line);
    });
  });

  return (
    <Tag
      ref={rootRef}
      className={cn(styles.root, play && styles.play, className)}
      style={{ '--delay': `${delay}ms`, '--step': `${step}ms` }}
    >
      {splitParts(parts).map((unit) => {
        if (unit.type === 'space') return <React.Fragment key={unit.key}> </React.Fragment>;
        if (unit.type === 'img') {
          return (
            <span key={unit.key} className={styles.unit} data-unit="">
              <img className={cn(styles.inner, styles.pic)} src={unit.src} alt={unit.alt} />
            </span>
          );
        }
        return (
          <span key={unit.key} className={styles.unit} data-unit="">
            <span className={styles.inner}>{unit.text}</span>
          </span>
        );
      })}
    </Tag>
  );
}

LineReveal.propTypes = {
  parts: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ img: PropTypes.string.isRequired, alt: PropTypes.string })
  ])).isRequired,
  as: PropTypes.elementType,
  className: PropTypes.string,
  delay: PropTypes.number,
  step: PropTypes.number,
  play: PropTypes.bool
};

export default LineReveal;
