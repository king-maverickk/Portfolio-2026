import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STAGE_ICONS } from './StageIcons';
import { useActiveStage } from './useActiveStage';
import styles from './index.module.scss';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function StageVideo({ src, label, isActive }) {
  const videoRef = useRef(null);
  const [reducedMotion] = useState(prefersReducedMotion);
  const [inView, setInView] = useState(false);

  // Being the active stage isn't enough to play: the first stage is active from
  // page load, long before anyone has scrolled down to it, and it stays active
  // after they scroll past. So also track whether the video is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return undefined;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Play only while this stage is the active one AND on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    if (isActive && inView) {
      const playing = video.play();
      if (playing && typeof playing.catch === 'function') playing.catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, inView, reducedMotion]);

  return (
    <video
      ref={videoRef}
      className={styles.tileVideo}
      src={src}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reducedMotion}
    />
  );
}

function ProjectStages({ project }) {
  const { stages } = project;
  const { active, setActive, tileRefs } = useActiveStage(stages.length);
  const pillRefs = useRef([]);
  const pillsRef = useRef(null);
  const [highlight, setHighlight] = useState({ x: 0, width: 0 });
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    const text = stages[active]?.description || '';
    const reducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setTypedCount(text.length);
      return undefined;
    }

    setTypedCount(0);
    if (!text.length) return undefined;

    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      setTypedCount(count);
      if (count >= text.length) window.clearInterval(timer);
    }, 14);

    return () => window.clearInterval(timer);
  }, [active, stages]);

  useLayoutEffect(() => {
    const updateHighlight = () => {
      const pill = pillRefs.current[active];
      if (!pill) return;
      setHighlight({ x: pill.offsetLeft, width: pill.offsetWidth });
    };

    updateHighlight();
    if (typeof ResizeObserver === 'undefined' || !pillsRef.current) return undefined;
    const observer = new ResizeObserver(updateHighlight);
    observer.observe(pillsRef.current);
    pillRefs.current.filter(Boolean).forEach((pill) => observer.observe(pill));
    return () => observer.disconnect();
  }, [active, stages.length]);

  const goToStage = (index) => {
    const tile = tileRefs.current[index];
    if (!tile) return;
    setActive(index);
    const reducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tile.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center'
    });
  };

  const activeDescription = stages[active]?.description || '';

  return (
    <section className={styles.section} aria-label={`${project.title}: sketch, screen, and motion`}>
      <div className={styles.inner}>
        <aside className={styles.card}>
          <div className={styles.pills} ref={pillsRef} role="group" aria-label="Project stages">
            <span
              className={styles.pillHighlight}
              style={{ '--highlight-x': `${highlight.x}px`, '--highlight-width': `${highlight.width}px` }}
              aria-hidden="true"
            />
            {stages.map((stage, index) => {
              const Icon = STAGE_ICONS[stage.icon];
              return (
                <button
                  key={stage.id}
                  ref={(element) => { pillRefs.current[index] = element; }}
                  type="button"
                  className={styles.pill}
                  aria-current={index === active ? 'step' : undefined}
                  onClick={() => goToStage(index)}
                >
                  {Icon && <Icon className={styles.icon} />}
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.divider} />
          <div className={styles.descriptions}>
            {stages.map((stage, index) => (
              <p
                key={stage.id}
                className={`${styles.description} ${index === active ? styles.descriptionActive : ''}`}
                aria-hidden="true"
              >
                <span className={styles.descriptionMeasure}>{stage.description}</span>
                <span className={styles.typedText}>
                  {index === active ? stage.description.slice(0, typedCount) : ''}
                  {index === active && typedCount < stage.description.length && (
                    <span className={styles.typingCaret} aria-hidden="true" />
                  )}
                </span>
              </p>
            ))}
          </div>
          <span className={styles.screenReaderOnly} aria-live="polite" aria-atomic="true">
            {activeDescription}
          </span>
        </aside>

        <div className={styles.tiles}>
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              ref={(element) => { tileRefs.current[index] = element; }}
              className={[
                styles.tile,
                index === active ? styles.tileActive : '',
                stage.video ? styles.tileHasVideo : ''
              ].filter(Boolean).join(' ')}
              data-index={index}
              aria-label={`${stage.label} stage`}
            >
              {stage.video ? (
                <StageVideo
                  src={stage.video}
                  label={stage.videoLabel || `${stage.label} stage video`}
                  isActive={index === active}
                />
              ) : (
                <span className={styles.tileLabel}>{stage.placeholder}</span>
              )}
              {stage.link && (
                <Link className={styles.tileLink} to={stage.link.href}>
                  {stage.link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectStages;
