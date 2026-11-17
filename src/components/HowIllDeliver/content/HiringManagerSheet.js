import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import InlineImg from 'components/InlineImg';
import PROJECTS from 'components/Projects/projects';
import UNFINISHED from 'components/Projects/unfinishedWork';
import { HIRING } from './copy';
import { DraftTag, TodoNote } from './Blocks';
import SheetBox from './SheetBox';
import Documents from './Documents';
import ProfileCards from './ProfileCards';
import Scenarios from './Scenarios';
import styles from './index.module.scss';
import sx from './freelanceSheet.module.scss';
import hx from './hiringSheet.module.scss';

// The Hiring managers sheet, from the "Hiring managers sheet: redesign mock"
// Design file and Motheo's Freeform sketch over it (15 Nov 2026). Top to bottom:
//
//   title → hello sentence → resume and open letter → Online (profile cards) / Roles
//   / Proof / Working with me / Still learning (containers) → Projects
//
// Everything above the containers sits straight on the sheet. The words are in
// copy.js (HIRING), apart from the opening sentence, which has icons inside it.

// The opening sentence follows the Freelance sentence's rules (index.module.scss
// .forStatement): same size and line height, and the icons pop in one after
// another once the sheet has slid in (.forIcon). Each icon's size and delay is
// in hiringSheet.module.scss.
const ASSETS = `${process.env.PUBLIC_URL}/assets/HowIllDeliver`;

const HELLO_PICTURES = {
  figma: { src: `${ASSETS}/hiring-manager_icon_figma.png`, ratio: 1, className: hx.iconFigma },
  prototype: { src: `${ASSETS}/hiring-manager_icon_prototype.png`, ratio: 1, className: hx.iconPrototype },
  react: { src: `${ASSETS}/hiring-manager_icon_react.png`, ratio: 1, className: hx.iconReact }
};

// A word with its icon straight after it; the two never split across lines.
function Word({ picture, after, children }) {
  const { className, ...image } = HELLO_PICTURES[picture];
  return (
    <InlineImg {...image} after={after} className={cn(styles.forIcon, className)}>
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
    <p className={cn(styles.forStatement, hx.hello)}>
      For teams that need the <Word picture="figma">Figma</Word> screens, the <Word picture="prototype">prototype</Word> <Word picture="react">&</Word> React build from one person.
    </p>
  );
}

// Roles: the same label / text rows as Freelance's "Working together".
function Roles({ items }) {
  return (
    <dl className={cn(sx.topics, hx.roleTopics)}>
      {items.map(({ id, label, text, draft }) => (
        <div className={sx.topic} key={id}>
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

Roles.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    draft: PropTypes.bool
  })).isRequired
};

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

const BOXES = ['online', 'roles', 'proof', 'working', 'learning'];

function HiringManagerSheet() {
  const { online, roles, proof, workingWithMe, stillLearning } = HIRING;
  // Every container starts closed, as a row with its hint.
  const [open, setOpen] = useState(() => Object.fromEntries(BOXES.map((key) => [key, false])));

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
      {/* The sheet's name, with the same rules as the Freelance title. */}
      {/* Title and sentence together, so the sheet's gap doesn't come between them. */}
      <header className={hx.opening}>
        <div className={sx.sheetNameFrame}>
          <h2 id="delivery-sheet-title" className={cn(sx.sheetName, hx.title)}>{HIRING.title}</h2>
        </div>
        <Hello />
      </header>
      <Documents />

      <div className={hx.stack}>
        <SheetBox {...boxProps('online', online)}>
          <ProfileCards />
        </SheetBox>
        <SheetBox {...boxProps('roles', roles)}>
          <Roles items={roles.items} />
        </SheetBox>
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
