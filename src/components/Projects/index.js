import React, { useEffect, useRef } from 'react';
import { Link, Redirect, useLocation, useParams } from 'react-router-dom';

import DotGrid from 'components/DotGrid';
import ProjectsList from 'components/ProjectsList';
import ProjectDetail from './ProjectDetail';
import Unfinished from './Unfinished';
import PROJECTS, { findProject } from './projects';
import UNFINISHED from './unfinishedWork';
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

// The list at /projects. Opens like the Lab: huge title, subtitle, then the
// projects in the same style as the home page list, then the unfinished work
// as a quieter list of rows.
function ProjectIndex() {
  const headerRef = useRef(null);
  const unfinishedRef = useRef(null);
  const { hash } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Projects · Motheo Moleko';
    return () => { document.title = previousTitle; };
  }, []);

  // /projects#unfinished (the "Unfinished" row on the home page) and
  // /projects#unfinished-<id> land on that part of the page.
  useEffect(() => {
    if (!hash.startsWith('#unfinished')) return;
    const target = document.getElementById(hash.slice(1)) || unfinishedRef.current;
    if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'start' });
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

      <header ref={headerRef} className={styles.header}>
        <h1 className={styles.title}>{INTRO.title}</h1>
        <p className={styles.intro}>
          {INTRO.text}
          {INTRO.draft && <DraftTag />}
        </p>
      </header>

      <ProjectsList
        origin="projects"
        limit={PROJECTS.length}
        showLabel={false}
        showButton={false}
        showUnfinished={false}
        alsoFade={[headerRef, unfinishedRef]}
      />

      <Unfinished ref={unfinishedRef} />
    </div>
  );
}

// /projects and /projects/:id. An unknown id goes back to the list. The old
// address of a project that moved to Unfinished (Virtual Guitar, Milk & Honey
// TV) goes to its row there.
function Projects() {
  const { id } = useParams();
  if (!id) return <ProjectIndex />;

  const project = findProject(id);
  if (!project && UNFINISHED.some((entry) => entry.id === id)) {
    return <Redirect to={`/projects#unfinished-${id}`} />;
  }
  if (!project) return <Redirect to="/projects" />;
  return <ProjectDetail key={project.id} project={project} />;
}

export default Projects;
