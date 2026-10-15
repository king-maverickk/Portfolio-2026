import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import styles from './index.module.scss';
const COLORS = [
  '#FF5A5F', '#FF9F1C', '#FFD23F', '#A7C957',
  '#2EC4B6', '#3A86FF', '#5E60CE', '#9D4EDD',
  '#F72585', '#FB6F92', '#06D6A0', '#118AB2'
];

function Home(props) {
  const shift = Math.floor(COLORS.length / 2);

  return (
    <div
      className={cn(styles.root, props.className, 'home')}
      style={{ '--count': COLORS.length }}
    >
      <DotGrid />

      <div className={styles.line} aria-hidden="true" />
      <div className={styles.originLine} aria-hidden="true" />

      {/* The arcs */}
      <svg
        className={styles.arcs}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className={styles.arcsDesktop}>
          <path d="M 0 10 Q 50 75 100 10" />
          <path d="M 0 90 Q 50 25 100 90" />
        </g>
        <g className={styles.arcsMobile}>
          <path d="M 0 35 Q 50 55 100 35" />
          <path d="M 0 65 Q 50 45 100 65" />
        </g>
      </svg>

      {COLORS.map((color, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(styles.rect, styles.rectLeft)}
            style={{ '--i': i, '--color': color }}
            aria-hidden="true"
          />
          <div
            className={cn(styles.rect, styles.rectRight)}
            style={{ '--i': i, '--color': COLORS[(i + shift) % COLORS.length] }}
            aria-hidden="true"
          />
        </React.Fragment>
      ))}

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
