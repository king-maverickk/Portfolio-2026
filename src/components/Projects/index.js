import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import PROJECTS from './projects';
import styles from './index.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

// Draft copy for the page header. Rewrite in your voice.
const INTRO = {
  title: 'Projects',
  text: 'Sites I’ve designed and built for clients, and the experiments that got me here.',
  draft: true
};

function DraftTag() {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <span className={styles.draftTag} data-draft="">draft</span>;
}

function ProjectCard({ project }) {
  const meta = [project.category, project.year].filter(Boolean).join(' · ');
  return (
    <li id={project.id} className={styles.card}>
      <div className={styles.media}>
        <img src={project.images[0]} alt={`${project.name}, screenshot`} loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <h2 className={styles.name}>{project.name}</h2>
          <span className={styles.meta}>{meta}</span>
        </div>
        <p className={styles.role}>{project.role}</p>
        <p className={styles.summary}>
          {project.summary}
          {project.draft && <DraftTag />}
        </p>
        <ul className={styles.tags} aria-label="Tags">
          {project.tags.map((tag) => <li key={tag} className={styles.tag}>{tag}</li>)}
        </ul>
      </div>
    </li>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    year: PropTypes.string,
    role: PropTypes.string,
    summary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    draft: PropTypes.bool
  }).isRequired
};

// /projects: opens like the Lab (huge title and a subtitle), then the projects
// as cards. A first pass at the layout, to reshape once you know what you want.
function Projects() {
  const { hash } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Projects · Motheo Moleko';
    return () => { document.title = previousTitle; };
  }, []);

  // Arriving from a name on the home page (/projects#living-histories):
  // go to that card and give it a brief glow, otherwise start at the top.
  useEffect(() => {
    const card = hash ? document.getElementById(hash.slice(1)) : null;
    if (!card) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    card.dataset.arrived = '';
    const timer = window.setTimeout(() => { delete card.dataset.arrived; }, 1800);
    return () => window.clearTimeout(timer);
  }, [hash]);

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
          {INTRO.draft && <DraftTag />}
        </p>
      </header>

      <ul className={cn(styles.grid)} aria-label="Projects">
        {PROJECTS.map((project) => <ProjectCard key={project.id} project={project} />)}
      </ul>
    </div>
  );
}

export default Projects;
