import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

function AboutMotheo({ className }) {
  return ( 
    <section
      className={cn(styles.section, className, 'aboutmotheo')}
    >
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h2 className={styles.headline}>motheo moleko</h2>
          <p className={styles.subtitle}>
            designer-developer
          </p>
        </div>
        <div
          className={styles.photo}
          role="img"
          aria-label="Photo placeholder"
        />
      </div>
      <div className={styles.detailsColumn} />
    </section>
  );
}

AboutMotheo.propTypes = {
  className: PropTypes.string,
};

export default AboutMotheo;
