import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

// Same condition the SCSS uses for the hover effect.
const HOVER_QUERY = '(hover: hover)';

// False on the first render (and on the server), then true once we know the
// device can hover. Touch-only devices never get the hover version.
function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY);
    const update = () => setCanHover(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return canHover;
}

// Two spans per word: the outer one stays put and owns the hover area (and the
// fall-in), the inner one lifts. If the hovered element itself moved, the
// cursor would slip off its bottom edge and the word would flicker.
//
// Both spans are plain inline boxes unless the device can hover. Inline spans
// can't change how a line breaks or how much space sits between words, which
// is what went wrong on iOS Safari when every word was an inline-block.
function Word({ children, index, canHover, reveal, revealed, revealDelay }) {
  return (
    <span
      className={cn(styles.word, {
        [styles.hoverable]: canHover,
        [styles.reveal]: reveal,
        [styles.revealed]: reveal && revealed,
      })}
      style={
        reveal
          ? { '--word-index': index, '--reveal-delay': `${revealDelay}ms` }
          : undefined
      }
    >
      <span className={styles.lift}>{children}</span>
    </span>
  );
}

Word.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  canHover: PropTypes.bool.isRequired,
  reveal: PropTypes.bool.isRequired,
  revealed: PropTypes.bool.isRequired,
  revealDelay: PropTypes.number.isRequired,
};

/**
 * Wraps every word of its children so it can lift on hover and, optionally,
 * fall into place once.
 *
 * - Hover lift: only on devices that can hover (and never with reduced
 *   motion). Elsewhere the children render untouched, unless `reveal` is on.
 * - `reveal`: words start slightly above their line and invisible, then fall
 *   into place one after another when `revealed` turns true. The parent decides
 *   when (for example when the text scrolls into view). With reduced motion the
 *   words are simply shown. Words are wrapped on every device in this mode, so
 *   nothing is rebuilt when hover support is detected.
 * - `revealDelay`: milliseconds to wait before the first word starts, so a
 *   second paragraph can follow the first one.
 *
 * - Strings are split into words. The spaces stay plain text between the
 *   words, so line wrapping, selecting and copying behave as normal.
 * - Elements (such as <InlineImg>) count as one word, so a word and its image
 *   move together.
 * - Children must be strings or elements, not fragments. Punctuation that
 *   follows an <InlineImg> should go in its `after` prop, otherwise it becomes
 *   a word of its own and can wrap onto a new line alone.
 */
function HoverWords({
  children,
  reveal = false,
  revealed = false,
  revealDelay = 0,
}) {
  const canHover = useCanHover();

  if (!canHover && !reveal) return <>{children}</>;

  const parts = [];
  let wordIndex = 0;

  const addWord = (key, content) => {
    parts.push(
      <Word
        key={key}
        index={wordIndex}
        canHover={canHover}
        reveal={reveal}
        revealed={revealed}
        revealDelay={revealDelay}
      >
        {content}
      </Word>,
    );
    wordIndex += 1;
  };

  React.Children.forEach(children, (child, index) => {
    if (typeof child === 'string' || typeof child === 'number') {
      String(child)
        .split(/(\s+)/)
        .forEach((token, i) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            parts.push(token);
          } else {
            addWord(`${index}-${i}`, token);
          }
        });
    } else if (React.isValidElement(child)) {
      addWord(index, child);
    }
  });

  return <>{parts}</>;
}

HoverWords.propTypes = {
  children: PropTypes.node,
  reveal: PropTypes.bool,
  revealed: PropTypes.bool,
  revealDelay: PropTypes.number,
};

export default HoverWords;
