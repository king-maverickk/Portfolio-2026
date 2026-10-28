import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

// "What you get with me" / "Why work with me": a short heading and a stack of one-line cards.
function Benefits({ id, heading, items }) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`} className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item.lead}>
            <b>{item.lead}</b>
            {' '}
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

Benefits.propTypes = {
  heading: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    lead: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
};

export default Benefits;
