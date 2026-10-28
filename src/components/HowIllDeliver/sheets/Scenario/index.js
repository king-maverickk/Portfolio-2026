import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

// A set of chips and one large sentence that changes with the chosen chip.
// Used for "Who I'm working under matters" (hiring managers) and "Who I work best with" (freelance).
function Scenario({
  id, heading, options, value, onChange, reserveLines = 4, className
}) {
  const current = options.find((option) => option.id === value) || options[0];

  return (
    <section className={cn(styles.scenario, className)} aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`} className={styles.heading}>{heading}</h3>
      <div className={styles.chips} role="group" aria-labelledby={`${id}-heading`}>
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            className={styles.chip}
            aria-pressed={option.id === current.id}
            onClick={() => onChange(option.id)}
          >
            <span className={styles.chipText} data-text={option.label}>{option.label}</span>
          </button>
        ))}
      </div>
      {/* Reserves the height of the longest sentence so the chips above never jump. */}
      <p
        className={styles.sentence}
        style={{ '--reserve-lines': reserveLines }}
        aria-live="polite"
      >
        {current.sentence}
      </p>
    </section>
  );
}

Scenario.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sentence: PropTypes.string.isRequired
  })).isRequired,
  reserveLines: PropTypes.number,
  value: PropTypes.string.isRequired
};

export default Scenario;
