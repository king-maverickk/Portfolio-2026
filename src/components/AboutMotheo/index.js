import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

function AboutMotheo({ className }) {
  return ( 
    <section
      className={cn(styles.section, className, 'aboutmotheo')}
    >
    </section>
  );
}

AboutMotheo.propTypes = {
  className: PropTypes.string,
};

export default AboutMotheo;
