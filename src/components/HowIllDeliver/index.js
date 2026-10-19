import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

const CELLS = Array.from({ length: 12 * 8 }, (_, index) => index);

const ANNOTATIONS = [
  { id: 'open-to-work', label: '(open to work)', className: styles.openToWork },
  { id: 'freelance', label: '(freelance/contract)', className: styles.freelance },
  { id: 'hiring-manager', label: '(hiring manager)', className: styles.hiringManager }
];

function HowIllDeliver({ className, onAnnotationClick }) {
  return (
    <section className={cn(styles.section, className)} aria-label="How I'll deliver for you">
      {CELLS.map((cell) => (
        <div className={styles.cell} aria-hidden="true" key={cell} />
      ))}

      <div className={styles.content}>
        <h2 className={styles.headline}>
          <span className={styles.how}>How I’ll</span>
          <span className={styles.deliver}>deliver</span>
          <span className={styles.for}>for</span>
          <span className={styles.you}>You</span>
        </h2>

        {ANNOTATIONS.map(({ id, label, className: areaClass }) => (
          <button
            type="button"
            key={id}
            className={cn(styles.annotation, areaClass)}
            onClick={() => onAnnotationClick?.(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

HowIllDeliver.propTypes = {
  className: PropTypes.string,
  onAnnotationClick: PropTypes.func
};

export default HowIllDeliver;