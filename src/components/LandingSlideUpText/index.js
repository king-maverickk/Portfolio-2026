import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import styles from './index.module.scss';

// The four page cards from the Photos by Alex landing page (without the large
// "Photos By Alex" block). Hover a card: it turns dark, the screenshot gets its
// colour back, and the title rolls up one letter after another.

const AnimatedTitle = ({ text, className }) => {
  let charIndex = 0;
  const words = text.split(' ');

  // The letters are split up for the roll; screen readers get the whole title.
  return (
    <p className={className} aria-label={text}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className={styles.word_wrapper} aria-hidden="true">
          {word.split('').map((char) => {
            const currentIdx = charIndex++;
            return (
              <span key={currentIdx} className={styles.char_wrapper}>
                <span
                  className={styles.char_inner}
                  style={{ transitionDelay: `${currentIdx * 0.03}s` }}
                  data-char={char}
                >
                  {char}
                </span>
              </span>
            );
          })}
          {wordIdx < words.length - 1 && (
            <span className={styles.space}>
              &nbsp;
              {/* The space counts toward the stagger, so the roll keeps its rhythm. */}
              {(() => { charIndex++; return null; })()}
            </span>
          )}
        </span>
      ))}
    </p>
  );
};

AnimatedTitle.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

const DEFAULT_CARDS = [
  {
    id: 'home',
    title: 'Home Page',
    overview: 'Discover the work and story behind Photos by Alex.',
    image: '/assets/Lab/PhotosByAlexNav/home_cover.png',
    alt: 'home page screenshot'
  },
  {
    id: 'contact',
    title: 'Contact info',
    overview: 'Reach out to Alex for bookings, questions, and collaborations.',
    image: '/assets/Lab/PhotosByAlexNav/contact_cover.png',
    alt: 'contact page screenshot'
  },
  {
    id: 'wedding',
    title: 'wedding portfolio',
    overview: 'Timeless photography for every wedding moment.',
    image: '/assets/Lab/PhotosByAlexNav/wedding_page_cover.png',
    alt: 'wedding portfolio screenshot'
  },
  {
    id: 'events',
    title: 'Events & more',
    overview: 'Fashion, sports, and photography beyond weddings.',
    image: '/assets/Lab/PhotosByAlexNav/live_events_cover.png',
    alt: 'events portfolio screenshot'
  }
];

// Give a card `to` and it becomes a router link, as on the client's site.
// Without it (as in the Lab, where those pages don't exist) it's a plain card.
function Card({ card }) {
  const content = (
    <div className={styles.col}>
      <AnimatedTitle text={card.title} className={styles.header} />
      <div className={styles.col1}>
        <p className={styles.overview}>{card.overview}</p>
        <img className={styles.overview_image} src={card.image} alt={card.alt} />
      </div>
    </div>
  );

  return card.to
    ? <Link to={card.to} className={styles.card}>{content}</Link>
    : <div className={styles.card}>{content}</div>;
}

Card.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    to: PropTypes.string
  }).isRequired
};

export default function LandingSlideUpText({ className, cards = DEFAULT_CARDS }) {
  return (
    <article className={cn(styles.portfolio_section, className)}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.id || card.title} card={card} />
        ))}
      </div>
    </article>
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
      to: PropTypes.string
    })
  )
};
