import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import ProjectStages from 'components/ProjectStages';
import homeProject from 'components/ProjectStages/projectStages';
import HowIllDeliver from 'components/HowIllDeliver';
import AboutMotheo from 'components/AboutMotheo';
import HOME_ASSETS from './heroAssets';
import styles from './index.module.scss';

const PANEL_COUNT_PER_SIDE = 6;
const PANEL_COUNT = PANEL_COUNT_PER_SIDE * 2;

function getUniqueRandomAssets(assets, count) {
  const uniqueAssets = Array.from(
    new Map(assets.map((asset) => [asset.src, asset])).values()
  );

  if (uniqueAssets.length < count) {
    throw new Error(`Expected at least ${count} unique hero assets; found ${uniqueAssets.length}.`);
  }

  const shuffled = [...uniqueAssets];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event) => setReducedMotion(event.matches);

    setReducedMotion(mediaQuery.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return reducedMotion;
}

function HeroPanel({ asset, className, index }) {
  const videoRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (asset.type !== 'video') return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    if (reducedMotion) {
      video.pause();
      if (video.currentTime !== 0) video.currentTime = 0;
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      video.play().catch(() => {});
      return () => video.pause();
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.01 });

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [asset.type, reducedMotion]);

  const panelStyle = { '--i': index };

  return (
    <div className={className} style={panelStyle} aria-hidden="true">
      {asset.type === 'video' ? (
        <video
          ref={videoRef}
          className={styles.media}
          src={asset.src}
          muted
          loop
          playsInline
          preload={reducedMotion ? 'auto' : 'none'}
          tabIndex={-1}
        />
      ) : (
        <img
          className={styles.media}
          src={asset.src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

HeroPanel.propTypes = {
  asset: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'video']).isRequired,
    src: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

function Home(props) {
  const assets = useState(() => getUniqueRandomAssets(HOME_ASSETS, PANEL_COUNT))[0];

  return (
    <>
      <div
        className={cn(styles.root, props.className, 'home')}
        style={{ '--count': PANEL_COUNT_PER_SIDE }}
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

        {Array.from({ length: PANEL_COUNT_PER_SIDE }, (_, index) => (
          <React.Fragment key={index}>
            <HeroPanel
              asset={assets[index]}
              className={cn(styles.rect, styles.rectLeft)}
              index={index}
            />
            <HeroPanel
              asset={assets[index + PANEL_COUNT_PER_SIDE]}
              className={cn(styles.rect, styles.rectRight)}
              index={index}
            />
          </React.Fragment>
        ))}

        <div className={styles.content}>
          <section className={styles.heroCopy} aria-label="Introduction">
            <h1 className={styles.headline}>
              <img fetchPriority="high" className={styles.sketchWord} src="/sketch-handwritten.svg" alt="Sketch" />
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
      <AboutMotheo />
    </>
  );
}

Home.propTypes = {
  className: PropTypes.string
};

export default Home;
