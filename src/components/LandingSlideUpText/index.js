import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './index.module.scss';

const AnimatedTitle = ({ text, className = '' }) => {
  let charIndex = 0;
  const words = text.split(' ');

  // The letters are split up for the roll; screen readers get the whole title.
  return (
    <p className={className} aria-label={text}>
      {words.map((word, wordIdx) => {
        const chars = word.split('').map((char) => ({
          char,
          index: charIndex++,
        }));

        // Advance character delay counter for word spacing
        if (wordIdx < words.length - 1) {
          charIndex++;
        }

        return (
          <span key={wordIdx} className={styles.word_wrapper} aria-hidden="true">
            {chars.map(({ char, index }) => (
              <span key={index} className={styles.char_wrapper}>
                <span
                  className={styles.char_inner}
                  style={{ transitionDelay: `${index * 0.03}s` }}
                  data-char={char}
                >
                  {char}
                </span>
              </span>
            ))}
            {wordIdx < words.length - 1 && (
              <span className={styles.space}>&nbsp;</span>
            )}
          </span>
        );
      })}
    </p>
  );
};

AnimatedTitle.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const DEFAULT_CARDS = [
  {
    id: 'home',
    title: 'Home Page',
    overview: 'Discover the work and story behind Photos by Alex.',
    image: '/assets/Lab/PhotosByAlexNav/home_cover.png',
    alt: 'home page screenshot',
  },
  {
    id: 'contact',
    title: 'Contact info',
    overview: 'Reach out to Alex for bookings, questions, and collaborations.',
    image: '/assets/Lab/PhotosByAlexNav/contact_cover.png',
    alt: 'contact page screenshot',
  },
  {
    id: 'wedding',
    title: 'wedding portfolio',
    overview: 'Timeless photography for every wedding moment.',
    image: '/assets/Lab/PhotosByAlexNav/wedding_page_cover.png',
    alt: 'wedding portfolio screenshot',
  },
  {
    id: 'events',
    title: 'Events & more',
    overview: 'Live events, portraits, and photography beyond weddings.',
    image: '/assets/Lab/PhotosByAlexNav/live_events_cover.png',
    alt: 'events portfolio screenshot',
  },
];

export default function LandingSlideUpText({
  className = '',
  cards = DEFAULT_CARDS,
}) {
  return (
    <div className={cn(styles.grid, className)}>
      {cards.map((card) => (
        <div key={card.id || card.title} className={styles.card}>
          <div className={styles.cardInner}>
            <AnimatedTitle text={card.title} className={styles.cardHeader} />

            <div className={styles.cardFooter}>
              <p className={styles.cardOverview}>{card.overview}</p>
              <img
                className={styles.cardImage}
                src={card.image}
                alt={card.alt}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

LandingSlideUpText.propTypes = {
  className: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ),
};
