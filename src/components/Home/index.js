import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import ProjectStages from 'components/ProjectStages';
import homeProject from 'components/ProjectStages/projectStages';
import HowIllDeliver from 'components/HowIllDeliver';
import styles from './index.module.scss';

const COLORS = [
  '#FF5A5F', '#FF9F1C', '#FFD23F', '#A7C957',
  '#2EC4B6', '#3A86FF'
];

function Home(props) {
  const shift = Math.floor(COLORS.length / 2);

  return (
    <>
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
        <section className={styles.heroCopy} aria-label="Introduction">
          <h1 className={styles.headline}>
            <img fetchPriority='high' className={styles.sketchWord} src="/sketch-handwritten.svg" alt="Sketch" />
            <span className={styles.arrow} aria-hidden="true">→</span>
            <span className={styles.screenWord}>Screen</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
            <span className={styles.motionWord} aria-label="Motion">
              {Array.from('Motion').map((letter, index) => (
                <span
                  className={styles.motionLetter}
                  style={{ '--letter-index': index }}
                  aria-hidden="true"
                  key={`${letter}-${index}`}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>
          <p className={styles.subtitle}>
            <span>Motheo Moleko,</span>
            <span>designer-developer in Hamilton, Ontario</span>
          </p>
        </section>
      </div>
    </div>
    <ProjectStages project={homeProject} />
    <HowIllDeliver />
    </>
  );
}

Home.propTypes = {
  className: PropTypes.string
};

export default Home;
