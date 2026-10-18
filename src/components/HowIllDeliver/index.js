import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

const CELLS = Array.from({ length: 12 * 8 }, (_, index) => index);

function HowIllDeliver({ className }) {
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
          <span className={styles.you}>you</span>
        </h2>

        <p className={cn(styles.annotation, styles.openToWork)}>(open to work)</p>
        <p className={cn(styles.annotation, styles.freelance)}>(freelance/contract)</p>
        <p className={cn(styles.annotation, styles.hiringManager)}>(hiring manager)</p>
      </div>
    </section>
  );
}

HowIllDeliver.propTypes = {
  className: PropTypes.string
};

export default HowIllDeliver;