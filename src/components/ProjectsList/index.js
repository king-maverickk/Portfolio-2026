import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import PROJECTS from 'components/Projects/projects';
import styles from './index.module.scss';

// The project list after How I'll deliver: each name in big type with a small
// picture on either side, then a button to the /projects page.
//
// - Rows rise in one after another the first time the list scrolls into view.
// - Hovering a row tilts its pictures out and dims the other rows. On touch
//   screens (no hover) the row crossing the middle of the screen gets the same
//   treatment as you scroll.
// - Each row links to that project on /projects.

function ProjectsList({ className, limit = 5 }) {
  const listRef = useRef(null);
  // Starts "shown" so the list is visible without JS; the effect hides it
  // just before it can animate in.
  const [state, setState] = useState('shown'); // 'waiting' | 'shown'
  // Touch screens: the row nearest the middle of the screen, or null.
  const [centred, setCentred] = useState(null);

  useEffect(() => {
    const list = listRef.current;
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!list || reduced || !('IntersectionObserver' in window)) return undefined;

    setState('waiting');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setState('shown');
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Touch screens only: watch a thin band across the middle of the screen and
  // highlight whichever row is in it (the closest one if two overlap it).
  useEffect(() => {
    const list = listRef.current;
    const canHover = typeof window.matchMedia === 'function'
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!list || canHover || !('IntersectionObserver' in window)) return undefined;

    const rows = Array.from(list.querySelectorAll('[data-row]'));
    const inBand = new Set();

    const pickClosest = () => {
      if (!inBand.size) {
        setCentred(null);
        return;
      }
      const middle = window.innerHeight / 2;
      let best = null;
      let bestDistance = Infinity;
      inBand.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = Number(row.dataset.row);
        }
      });
      setCentred(best);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inBand.add(entry.target);
        else inBand.delete(entry.target);
      });
      pickClosest();
    }, { rootMargin: '-42% 0px -42% 0px' });

    rows.forEach((row) => observer.observe(row));

    // Two rows can share the strip, so keep re-picking the closer one while
    // scrolling (once per frame), not just when a row enters or leaves.
    let frame = 0;
    const onScroll = () => {
      if (!inBand.size || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        pickClosest();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [limit]);

  const projects = PROJECTS.slice(0, limit);

  return (
    <section className={cn(styles.section, className)} aria-labelledby="projects-list-label">
      <p id="projects-list-label" className={styles.label}>projects</p>

      <ul
        ref={listRef}
        className={cn(
          styles.list,
          state === 'waiting' && styles.listWaiting,
          centred !== null && styles.listHasCentred
        )}
      >
        {projects.map((project, index) => (
          <li key={project.id} className={styles.item} style={{ '--i': index }}>
            <Link
              className={cn(styles.row, centred === index && styles.rowCentred)}
              to={`/projects#${project.id}`}
              data-row={index}
            >
              <img className={cn(styles.thumb, styles.thumbLeft)} src={project.images[0]} alt="" loading="lazy" decoding="async" />
              <span className={styles.name}>{project.name}</span>
              <img className={cn(styles.thumb, styles.thumbRight)} src={project.images[1] || project.images[0]} alt="" loading="lazy" decoding="async" />
            </Link>
          </li>
        ))}
      </ul>

      <Link className={styles.button} to="/projects">
        See all projects
        <span className={styles.buttonArrow} aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

ProjectsList.propTypes = {
  className: PropTypes.string,
  // How many projects the home page shows (the rest are on /projects).
  limit: PropTypes.number
};

export default ProjectsList;
