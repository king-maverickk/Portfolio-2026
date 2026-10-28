import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

// "Role: Interaction | UI/UX Design | Frontend Development". Chooses which version of the documents is shown.
function RoleSwitch({ idBase, label, options, value, onChange, layout }) {
  return (
    <div className={styles.switch} role="group" aria-labelledby={`${idBase}-label`}>
      <span id={`${idBase}-label`} className={styles.label}>{label}</span>
      <div className={styles.options}>
        {options.map((option) => {
          const text = layout === 'stacked' && option.short ? option.short : option.label;
          return (
            <button
              type="button"
              key={option.id}
              className={styles.option}
              aria-pressed={option.id === value}
              aria-label={option.label}
              onClick={() => onChange(option.id)}
            >
              <span className={styles.text} data-text={text}>{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

RoleSwitch.propTypes = {
  idBase: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    short: PropTypes.string
  })).isRequired,
  value: PropTypes.string.isRequired
};

export default RoleSwitch;
