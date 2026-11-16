import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import InlineImg from 'components/InlineImg';
import PROJECTS from 'components/Projects/projects';
import UNFINISHED from 'components/Projects/unfinishedWork';
import Resume from '../Resume';
import { HIRING } from './copy';
import { DraftTag, TodoNote } from './Blocks';
import SheetBox from './SheetBox';
import ProfileCards from './ProfileCards';
import Scenarios from './Scenarios';
import styles from './index.module.scss';
import hx from './hiringSheet.module.scss';

// The Hiring managers sheet, from the "Hiring managers sheet: redesign mock"
// Design file and Motheo's Freeform sketch over it (15 Nov 2026). Top to bottom:
//
//   hello sentence → roles → resume and open letter → Online (profile cards)
//   → Proof / Working with me / Still learning (containers) → Projects
//
// Everything above the containers sits straight on the sheet. The words are in
// copy.js (HIRING), apart from the hello sentence, which has pictures inside it.

const TABS = ['resume', 'letter'];

// The five small pictures inside the hello sentence. Four are the site's own:
// the code chip and colour wheel from About (AboutMotheo), and the pencil and
// interactivity icons from the stages on Home (ProjectStages/StageIcons.js).
// "build" has no picture of its own yet, so it keeps the drawing from the
// Design file. `ratio` is width / height, as InlineImg wants it.
const ASSETS = `${process.env.PUBLIC_URL}/assets/Home`;

const HELLO_PICTURES = {
  code: { src: `${ASSETS}/about_code_chip.png`, ratio: 1.5 },
  design: { src: `${ASSETS}/about_design_wheel.png`, ratio: 1 },
  sketch: { src: `${ASSETS}/pencil.svg`, ratio: 1 },
  build: {
    icon: (
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="16" ry="6.5" transform="rotate(45 20 20)" stroke="#2B2B2B" strokeWidth="2.4" />
        <ellipse cx="20" cy="20" rx="16" ry="6.5" transform="rotate(-45 20 20)" stroke="#2B2B2B" strokeWidth="2.4" />
        <circle cx="20" cy="20" r="3.2" fill="#2B2B2B" />
        <circle cx="31.3" cy="31.3" r="2.8" fill="#2864E8" />
        <circle cx="31.3" cy="8.7" r="2.8" fill="#2864E8" />
      </svg>
    )
  },
  launch: { src: `${ASSETS}/interactivity.svg`, ratio: 1 }
};

// A word with its picture straight after it; the two never split across lines.
function Word({ picture, after, children }) {
  return (
    <InlineImg {...HELLO_PICTURES[picture]} after={after} size={1.15}>
      {children}
    </InlineImg>
  );
}

Word.propTypes = {
  picture: PropTypes.oneOf(Object.keys(HELLO_PICTURES)).isRequired,
  after: PropTypes.string,
  children: PropTypes.node.isRequired
};

function Hello() {
  return (
    <div className={hx.hello}>
      Hello, I’ve been teaching myself to <Word picture="code">code</Word> since 2019, and somewhere
      along the way <Word picture="design">design</Word> pulled me in. Now
      I <Word picture="sketch" after=",">sketch</Word> design
      and <Word picture="build">build</Word> it all myself, and I’ve taken a client’s site from first
      call to <Word picture="launch" after=".">launch</Word>
    </div>
  );
}

function Roles() {
  const { title, items } = HIRING.roles;
  const [picked, setPicked] = useState(items[0].id);

  return (
    <section className={hx.block} aria-labelledby="hiring-roles-title">
      <h3 className={hx.blockTitle} id="hiring-roles-title">{title}</h3>
      <div className={hx.roles} role="group" aria-labelledby="hiring-roles-title">
        {items.map(({ id, label, text }) => (
          <button
            key={id}
            type="button"
            className={cn(hx.role, picked === id && hx.rolePicked)}
            aria-pressed={picked === id}
            onClick={() => setPicked(id)}
          >
            <span className={hx.roleLabel}>{label}</span>
            <span className={hx.roleText}>{text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CoverLetter() {
  const { coverLetter, documents } = HIRING;
  return (
    <article className={styles.letter} aria-label={documents.letter.label}>
      {coverLetter.draft && <DraftTag />}
      <div className={styles.letterText}>
        <div>{coverLetter.greeting}</div>
        {coverLetter.paragraphs.map((paragraph) => (
          <div key={paragraph}>{paragraph}</div>
        ))}
        <div className={styles.signOff}>
          <span>Thanks for reading,</span>
          <span className={styles.signature}>{coverLetter.signOff}</span>
        </div>
      </div>
    </article>
  );
}

// Resume and open letter behind two tabs (arrow keys move between them). The
// page shows the top of the document and fades out; a click on it, or on the
// line under it, opens the rest in place. Tabbing into the page opens it too,
// so a keyboard never lands on a link it can't see.
function Documents() {
  const { documents } = HIRING;
  const [active, setActive] = useState('resume');
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef([]);
  const activeIndex = TABS.indexOf(active);
  const { pdf } = documents[active];

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = (activeIndex + step + TABS.length) % TABS.length;
    setActive(TABS[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={hx.block} aria-labelledby="hiring-documents-title">
      <div className={hx.blockHead}>
        <h3 className={hx.blockTitle} id="hiring-documents-title">{documents.title}</h3>
        <div
          className={cn(styles.tabs, hx.docTabs)}
          role="tablist"
          aria-labelledby="hiring-documents-title"
          style={{ '--tab-index': activeIndex, '--tab-count': TABS.length }}
        >
          <span className={styles.tabHighlight} aria-hidden="true" />
          {TABS.map((id, index) => (
            <button
              key={id}
              ref={(element) => { tabRefs.current[index] = element; }}
              type="button"
              role="tab"
              id={`doc-tab-${id}`}
              aria-selected={active === id}
              aria-controls={`doc-panel-${id}`}
              tabIndex={active === id ? 0 : -1}
              className={cn(styles.tab, active === id && styles.tabActive)}
              onClick={() => setActive(id)}
              onKeyDown={onKeyDown}
            >
              {documents[id].label}
            </button>
          ))}
        </div>
      </div>

      {/* The click on the page is a shortcut for the button below, which is
          what a keyboard or screen reader uses. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={cn(styles.paper, hx.page, !expanded && hx.pageClosed)}
        role="tabpanel"
        id={`doc-panel-${active}`}
        aria-labelledby={`doc-tab-${active}`}
        onClick={(event) => {
          if (!expanded && !event.target.closest('a')) setExpanded(true);
        }}
        onFocus={() => setExpanded(true)}
      >
        {active === 'resume' ? <Resume /> : <CoverLetter />}
      </div>

      <div className={hx.pageActions}>
        {pdf && (
          <a className={hx.download} href={pdf} download>
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        )}
        <button
          type="button"
          className={hx.pageToggle}
          aria-expanded={expanded}
          aria-controls={`doc-panel-${active}`}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? documents.openHint : documents.closedHint}
        </button>
      </div>
    </section>
  );
}

function Online() {
  const { title, caption } = HIRING.online;
  return (
    <section className={hx.block} aria-labelledby="hiring-online-title hiring-online-caption">
      <div className={hx.blockHead}>
        <h3 className={hx.blockTitle} id="hiring-online-title">{title}</h3>
        <span className={hx.blockCaption} id="hiring-online-caption">{caption}</span>
      </div>
      <ProfileCards />
    </section>
  );
}

// Label on the left, a line or two on the right.
function Rows({ rows }) {
  return (
    <dl className={hx.rows}>
      {rows.map(({ label, text, draft }) => (
        <div className={hx.row} key={label}>
          <dt>
            {label}
            {draft && <DraftTag />}
          </dt>
          <dd>{text}</dd>
        </div>
      ))}
    </dl>
  );
}

Rows.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    draft: PropTypes.bool
  })).isRequired
};

// Every project with a page, then every unfinished entry that has been written
// up (those open as a row on /projects).
function projectCards() {
  return [
    ...PROJECTS.map(({ id, name }) => ({ id, name, to: `/projects/${id}` })),
    ...UNFINISHED
      .filter((entry) => !entry.disabled && (entry.entry || entry.summary))
      .map(({ id, name }) => ({ id, name, to: `/projects#unfinished-${id}` }))
  ];
}

function ProjectCards() {
  const { title, caption, screenshots } = HIRING.projects;
  return (
    // Named with its caption too: the resume above has its own "Projects".
    <section className={hx.block} aria-labelledby="hiring-projects-title hiring-projects-caption">
      <div className={hx.blockHead}>
        <h3 className={hx.blockTitle} id="hiring-projects-title">{title}</h3>
        <span className={hx.blockCaption} id="hiring-projects-caption">{caption}</span>
      </div>
      <ul className={hx.projects}>
        {projectCards().map(({ id, name, to }) => (
          <li key={id}>
            <Link className={hx.project} to={to}>
              {screenshots[id]
                ? <img className={hx.projectShot} src={screenshots[id]} alt="" loading="lazy" decoding="async" />
                : <span className={cn(hx.projectShot, hx.projectShotEmpty)} aria-hidden="true" />}
              <span className={hx.projectPill}>
                {name}
                <span className={hx.projectArrow} aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// What only Motheo can add, listed once at the bottom (development only).
function Missing() {
  const { documents, online, projects } = HIRING;
  const missing = [
    !(documents.resume.pdf && documents.letter.pdf) && 'the resume and letter PDFs (the Download button appears)',
    !(online.linkedin.avatar && online.github.avatar) && 'your two profile pictures',
    projectCards().some(({ id }) => !projects.screenshots[id]) && 'a screenshot per project'
  ].filter(Boolean);

  if (missing.length === 0) return null;
  return <TodoNote>Still to add in content/copy.js (HIRING): {missing.join('; ')}.</TodoNote>;
}

const BOXES = ['proof', 'working', 'learning'];

function HiringManagerSheet() {
  const { proof, workingWithMe, stillLearning } = HIRING;
  // Proof starts open; the other two start as rows.
  const [open, setOpen] = useState(() => Object.fromEntries(BOXES.map((key) => [key, key === 'proof'])));

  const boxProps = (key, { title, teaser, draft }) => ({
    id: `hiring-${key}`,
    title,
    teaser,
    draft,
    open: open[key],
    onToggle: () => setOpen((current) => ({ ...current, [key]: !current[key] }))
  });

  return (
    <div className={hx.sheet}>
      <Hello />
      <Roles />
      <Documents />
      <Online />

      <div className={hx.stack}>
        <SheetBox {...boxProps('proof', proof)}>
          <Scenarios scenarios={proof.scenarios} />
        </SheetBox>
        <SheetBox {...boxProps('working', workingWithMe)}>
          <Rows rows={workingWithMe.rows} />
        </SheetBox>
        <SheetBox {...boxProps('learning', stillLearning)}>
          <Rows rows={stillLearning.rows} />
        </SheetBox>
      </div>

      <ProjectCards />
      <Missing />
    </div>
  );
}

export default HiringManagerSheet;
