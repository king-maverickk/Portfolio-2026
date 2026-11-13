import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';

import PROJECTS from 'components/Projects/projects';
import UNFINISHED, { HOME_FAN } from 'components/Projects/unfinishedWork';
import {
  clearNotes, manualScroll, partRows, peekReturn, plainRect, rememberPick, returnRows
} from 'components/Projects/transition';
import styles from './index.module.scss';

// The project list: each name in big type with a small picture either side.
// Used after How I'll deliver on the home page (origin "home", with a label
// and a "See all projects" button) and as the /projects page's list (origin
// "projects").
//
// - Rows rise in one after another the first time the list scrolls into view.
// - Hovering a row tilts its pictures out and dims the other rows. On touch
//   screens the row crossing the middle of the screen gets the same look.
// - Clicking a row: the other rows part (up and down) and fade, then the
//   project's page opens and its heading glides from this row to the top.
//   Coming back plays it in reverse (see Projects/transition.js).
// - On the home page a last, greyed row, "Unfinished", stands for everything
//   in Projects/unfinishedWork.js and goes to that section of /projects.

function ProjectsList({
  className,
  limit = 5,
  origin = 'home',
  showLabel = true,
  showButton = true,
  showUnfinished = true,
  alsoFade = []
}) {
  const history = useHistory();
  const listRef = useRef(null);
  const sectionBitsRef = useRef([]);
  const busyRef = useRef(false);

  // Coming back from a project? Checked in a layout effect (below), after the
  // project page has cleaned up and noted where its heading was, and before
  // the first paint, so the list doesn't flash its rise-in first.
  const returningRef = useRef(null);
  // Starts "shown" so the list is visible without JS; the effect hides it
  // just before it can animate in.
  const [state, setState] = useState('shown'); // 'waiting' | 'shown'
  // Touch screens: the row nearest the middle of the screen, or null.
  const [centred, setCentred] = useState(null);

  // Rise-in on first view (skipped when coming back from a project).
  useEffect(() => {
    const list = listRef.current;
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (returningRef.current || !list || reduced || !('IntersectionObserver' in window)) return undefined;

    setState('waiting');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setState('shown');
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Coming back from a project: put the list where it was, then glide the
  // heading back into its row and bring the others back from above and below.
  useLayoutEffect(() => {
    const returning = peekReturn(origin);
    if (!returning) return;
    returningRef.current = returning;
    clearNotes();
    const list = listRef.current;
    const rows = Array.from(list.querySelectorAll('[data-row]'));
    const picked = rows.find((row) => row.dataset.id === returning.id);
    if (!picked) return;

    if (returning.y !== null) {
      window.scrollTo(0, returning.y);
    } else {
      const rect = picked.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top - (window.innerHeight - rect.height) / 2);
    }
    returnRows(rows, picked, returning.rect, [...sectionBitsRef.current, ...alsoFade.map((ref) => ref.current)]);
    // Only on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // A plain click plays the move; new-tab clicks and the like behave as links.
  const openProject = (event, project) => {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;

    const list = listRef.current;
    const rows = Array.from(list.querySelectorAll('[data-row]'));
    const picked = event.currentTarget;
    const from = plainRect(picked);

    rememberPick(origin, project.id);
    manualScroll();
    partRows(rows, picked, [...sectionBitsRef.current, ...alsoFade.map((ref) => ref.current)])
      .then(() => {
        history.push(`/projects/${project.id}`, { from: plainRect(picked) || from, origin });
      });
  };

  const projects = PROJECTS.slice(0, limit);

  return (
    <section
      className={cn(styles.section, origin === 'projects' && styles.sectionPage, className)}
      aria-label={showLabel ? undefined : 'Projects'}
      aria-labelledby={showLabel ? 'projects-list-label' : undefined}
    >
      {showLabel && (
        <p
          id="projects-list-label"
          ref={(element) => { sectionBitsRef.current[0] = element; }}
          className={styles.label}
        >
          projects
        </p>
      )}

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
              to={`/projects/${project.id}`}
              onClick={(event) => openProject(event, project)}
              data-row={index}
              data-id={project.id}
            >
              <img className={cn(styles.thumb, styles.thumbLeft)} src={project.images[0]} alt="" loading="lazy" decoding="async" />
              <span className={styles.name}>{project.name}</span>
              <img className={cn(styles.thumb, styles.thumbRight)} src={project.images[1] || project.images[0]} alt="" loading="lazy" decoding="async" />
            </Link>
          </li>
        ))}

        {showUnfinished && UNFINISHED.length > 0 && (
          <li className={styles.item} style={{ '--i': projects.length }}>
            <Link
              className={cn(styles.row, styles.rowUnfinished, centred === projects.length && styles.rowCentred)}
              to="/projects#unfinished"
              aria-label={`Unfinished work, ${UNFINISHED.length} entries`}
              data-row={projects.length}
            >
              <span className={cn(styles.fan, styles.fanLeft)} aria-hidden="true">
                {HOME_FAN.slice(0, 2).map((src) => (
                  <img key={src} className={styles.fanPic} src={src} alt="" loading="lazy" decoding="async" />
                ))}
              </span>
              <span className={styles.name}>
                Unfinished
                <span className={styles.count}>{UNFINISHED.length}</span>
              </span>
              <span className={cn(styles.fan, styles.fanRight)} aria-hidden="true">
                {HOME_FAN.slice(0, 2).reverse().map((src) => (
                  <img key={src} className={styles.fanPic} src={src} alt="" loading="lazy" decoding="async" />
                ))}
              </span>
            </Link>
          </li>
        )}
      </ul>

      {showButton && (
        <Link
          ref={(element) => { sectionBitsRef.current[1] = element; }}
          className={styles.button}
          to="/projects"
        >
          See all projects
          <span className={styles.buttonArrow} aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  );
}

ProjectsList.propTypes = {
  className: PropTypes.string,
  // How many projects to show (the home page shows a few; /projects all).
  limit: PropTypes.number,
  // Which list this is, so coming back from a project returns to the right one.
  origin: PropTypes.oneOf(['home', 'projects']),
  showLabel: PropTypes.bool,
  showButton: PropTypes.bool,
  // The greyed "Unfinished" row after the projects (home page only).
  showUnfinished: PropTypes.bool,
  // Other things on the page to fade along with the parting rows.
  alsoFade: PropTypes.arrayOf(PropTypes.shape({ current: PropTypes.any }))
};

export default ProjectsList;
