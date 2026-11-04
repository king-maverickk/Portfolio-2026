import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import LAB_ITEMS from './labItems';
import DEMOS from './demos';
import styles from './index.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'recording', label: 'Recordings' }
];

// Draft copy for the page header. Rewrite in your voice.
const INTRO = {
  title: 'Lab',
  text: 'Pieces I’ve built for this site and for clients. The live ones are the real components, so hover, click and replay them.',
  draft: true
};

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Plays only while on screen, and only gets its file once it's near the
// viewport. With reduced motion it waits for a press of play.
function Recording({ src, title }) {
  const videoRef = useRef(null);
  const [reducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!('IntersectionObserver' in window)) {
      video.src = src;
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (video.getAttribute('src') !== src) video.src = src;
        if (!reducedMotion) video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { rootMargin: '200px 0px' });

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src, reducedMotion]);

  return (
    <video
      ref={videoRef}
      className={styles.video}
      aria-label={`Screen recording: ${title}`}
      muted
      loop
      playsInline
      preload="none"
      controls={reducedMotion}
    />
  );
}

Recording.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

function LabCard({ item }) {
  const Demo = item.kind === 'live' ? DEMOS[item.demo] : null;

  return (
    <li className={cn(styles.card, item.wide && styles.cardWide)}>
      <div
        className={cn(
          styles.stage,
          item.kind === 'live' && !item.wide && styles.stageLive,
          item.wide && styles.stageWide
        )}
      >
        {Demo ? <Demo /> : <Recording src={item.video} title={item.title} />}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <span className={styles.tags}>
            <span className={cn(styles.tag, item.kind === 'live' && styles.tagLive)}>
              {item.kind === 'live' ? 'Live' : 'Recording'}
            </span>
            {item.where && <span className={styles.tag}>{item.where}</span>}
          </span>
        </div>
        <p className={styles.caption}>
          {item.caption}
          {item.draft && SHOW_DRAFT_MARKERS && (
            <span className={styles.draftTag} data-draft="">draft</span>
          )}
        </p>
      </div>
    </li>
  );
}

LabCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    kind: PropTypes.oneOf(['live', 'recording']).isRequired,
    demo: PropTypes.string,
    video: PropTypes.string,
    where: PropTypes.string,
    wide: PropTypes.bool,
    draft: PropTypes.bool
  }).isRequired
};

function Filters({ active, onChange, counts }) {
  const refs = useRef([]);
  const [highlight, setHighlight] = useState({ x: 0, width: 0 });
  const activeIndex = FILTERS.findIndex((filter) => filter.id === active);

  useLayoutEffect(() => {
    const update = () => {
      const button = refs.current[activeIndex];
      if (button) setHighlight({ x: button.offsetLeft, width: button.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    // Outfit can arrive after first paint and change the pill widths.
    document.fonts?.ready?.then(update);
    return () => window.removeEventListener('resize', update);
  }, [activeIndex]);

  return (
    <div className={styles.filters} role="group" aria-label="Show">
      <span
        className={styles.filterHighlight}
        style={{ '--x': `${highlight.x}px`, '--w': `${highlight.width}px` }}
        aria-hidden="true"
      />
      {FILTERS.map((filter, index) => (
        <button
          key={filter.id}
          ref={(element) => { refs.current[index] = element; }}
          type="button"
          className={styles.filter}
          aria-pressed={active === filter.id}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
          <span className={styles.filterCount}>{counts[filter.id]}</span>
        </button>
      ))}
    </div>
  );
}

Filters.propTypes = {
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  counts: PropTypes.objectOf(PropTypes.number).isRequired
};

function Lab() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = 'Lab · Motheo Moleko';
    return () => { document.title = previousTitle; };
  }, []);

  const counts = {
    all: LAB_ITEMS.length,
    live: LAB_ITEMS.filter((item) => item.kind === 'live').length,
    recording: LAB_ITEMS.filter((item) => item.kind === 'recording').length
  };
  const items = filter === 'all' ? LAB_ITEMS : LAB_ITEMS.filter((item) => item.kind === filter);

  return (
    <div className={styles.page}>
      <DotGrid color="255, 255, 255" />

      <nav className={styles.topBar} aria-label="Site">
        <Link className={styles.back} to="/">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 6 9 12l6 6" />
          </svg>
          Home
        </Link>
        <span className={styles.byline}>motheo moleko</span>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{INTRO.title}</h1>
        <p className={styles.intro}>
          {INTRO.text}
          {INTRO.draft && SHOW_DRAFT_MARKERS && (
            <span className={styles.draftTag} data-draft="">draft</span>
          )}
        </p>
        <Filters active={filter} onChange={setFilter} counts={counts} />
      </header>

      <ul className={styles.grid} aria-label="Lab pieces">
        {items.map((item) => (
          <LabCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default Lab;
