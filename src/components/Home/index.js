import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

function Home(props) {
  return <div className={cn(styles.root, props.className, 'home')} />;
}

Home.propTypes = {
  className: PropTypes.string
};

export default Home;
