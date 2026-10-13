import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import styles from './index.module.scss';

function Home(props) {
  return (
    <div className={cn(styles.root, props.className, 'home')}>
      <DotGrid />

      <div className={styles.content}>
        {/* your actual page content */}
      </div>
    </div>
  );
}

Home.propTypes = {
  className: PropTypes.string
};

export default Home;
