import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

// Two spans per word: the outer one stays put and owns the hover area, the
// inner one moves. If the hovered element itself moved, the cursor would slip
// off its bottom edge and the word would flicker.
function Word({ children }) {
  return (
    <span className={styles.word}>
      <span className={styles.lift}>{children}</span>
    </span>
  );
}

Word.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Wraps every word of its children so it can lift on hover.
 *
 * - Strings are split into words. The spaces stay plain text between the
 *   words, so line wrapping, selecting and copying behave as normal.
 * - Elements (such as <InlineImg>) count as one word, so a word and its image
 *   lift together.
 * - Children must be strings or elements, not fragments. Punctuation that
 *   follows an <InlineImg> should go in its `after` prop, otherwise it becomes
 *   a word of its own and can wrap onto a new line alone.
 */
function HoverWords({ children }) {
  const parts = [];

  React.Children.forEach(children, (child, index) => {
    if (typeof child === 'string' || typeof child === 'number') {
      String(child)
        .split(/(\s+)/)
        .forEach((token, i) => {
          if (!token) return;
          parts.push(
            /^\s+$/.test(token) ? (
              token
            ) : (
              <Word key={`${index}-${i}`}>{token}</Word>
            ),
          );
        });
    } else if (React.isValidElement(child)) {
      parts.push(<Word key={index}>{child}</Word>);
    }
  });

  return <>{parts}</>;
}

HoverWords.propTypes = {
  children: PropTypes.node,
};

export default HoverWords;