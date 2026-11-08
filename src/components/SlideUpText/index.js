import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

// The letter roll from the Photos by Alex landing cards (LandingSlideUpText),
// as a piece of text you can drop anywhere. Each letter rolls up to a copy of
// itself, one after another.
//
// Two ways to set it off:
// - Hover or keyboard focus: put `slideUpHost` on the element that should
//   trigger it (a button, a link, a card).
// - On demand: bump `rollKey` (any new number) and it rolls once.
//
// Screen readers get the text once, as normal; the letters are hidden from them.

export const slideUpHost = styles.host;

function SlideUpText({ text, rollKey = 0, className }) {
  // Number every letter (spaces count too) so the stagger keeps its rhythm.
  let index = 0;
  const words = text.split(' ').map((word) => {
    const letters = word.split('').map((char) => {
      const letter = { char, index };
      index += 1;
      return letter;
    });
    index += 1; // the space after the word
    return letters;
  });

  return (
    <span className={cn(styles.text, className)}>
      <span className={styles.srOnly}>{text}</span>
      <span key={rollKey} className={cn(styles.letters, rollKey > 0 && styles.rolling)} aria-hidden="true">
        {words.map((letters, w) => (
          <React.Fragment key={w}>
            {w > 0 && ' '}
            <span className={styles.word}>
              {letters.map(({ char, index: i }) => (
                <span key={i} className={styles.charWrap}>
                  <span className={styles.char} data-char={char} style={{ '--slide-i': i }}>
                    {char}
                  </span>
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}

SlideUpText.propTypes = {
  text: PropTypes.string.isRequired,
  rollKey: PropTypes.number,
  className: PropTypes.string
};

export default SlideUpText;
