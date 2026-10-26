import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

const markShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired
});

// Renders plain strings as-is and tagged phrases as marks that light up for the active role.
function Marked({ parts, roleId }) {
  return parts.map((part, index) => {
    if (typeof part === 'string') return part;

    const isOn = part.roles.includes(roleId);
    return (
      <span
        key={`${index}-${part.text}`}
        className={cn(styles.mark, isOn && styles.markOn)}
        data-highlighted={isOn}
      >
        {part.text}
      </span>
    );
  });
}

Marked.propTypes = {
  parts: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, markShape])).isRequired,
  roleId: PropTypes.string.isRequired
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function DeliverySheets({ dataset, title, description, accentColor, closeButtonRef, onClose }) {
  const { cardGroups, fileName, resume, roles, rows, scenarios, skills } = dataset;
  const [roleId, setRoleId] = useState(roles[0].id);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [activeEntry, setActiveEntry] = useState(null);
  const stageRef = useRef(null);
  const entryRefs = useRef({});

  const scenario = scenarios.find(({ id }) => id === scenarioId);

  // Hovering a resume entry lights up its row below, and hovering a row lights up its entry.
  const entryProps = (id) => ({
    ref: (node) => { entryRefs.current[id] = node; },
    className: cn(styles.entry, activeEntry === id && styles.entryActive),
    'data-entry': id,
    'data-active': activeEntry === id,
    onMouseEnter: () => setActiveEntry(id),
    onMouseLeave: () => setActiveEntry(null)
  });

  const scrollToEntry = (id) => {
    const stage = stageRef.current;
    const node = entryRefs.current[id];
    if (!stage || !node) return;

    const top = node.getBoundingClientRect().top
      - stage.getBoundingClientRect().top
      + stage.scrollTop
      - 16;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof stage.scrollTo === 'function') {
      stage.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      stage.scrollTop = top;
    }
  };

  return (
    <div
      id="delivery-sheet"
      className={styles.dialog}
      style={{ '--sheet-accent-color': accentColor }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-sheet-title"
      aria-describedby="delivery-sheet-description"
      data-sheet-dialog=""
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.close}
        aria-label="Close sheet"
        onClick={onClose}
      >
        <CloseIcon />
      </button>

      <section className={cn(styles.sheet, styles.left)} aria-labelledby="delivery-sheet-title">
        <header className={styles.header}>
          <h2 id="delivery-sheet-title" className={styles.title}>{title}</h2>
          <p id="delivery-sheet-description" className={styles.description}>{description}</p>
        </header>

        <div className={styles.leftBody}>
          <div className={styles.roles} role="group" aria-label="Role">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                className={cn(styles.role, roleId === role.id && styles.roleActive)}
                aria-pressed={roleId === role.id}
                onClick={() => setRoleId(role.id)}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className={styles.scenario}>
            <h3 id="scenario-heading" className={styles.scenarioHeading}>
              Who I’m working under matters
            </h3>
            <div className={styles.chips} role="group" aria-labelledby="scenario-heading">
              {scenarios.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={cn(styles.chip, scenarioId === item.id && styles.chipActive)}
                  aria-pressed={scenarioId === item.id}
                  onClick={() => setScenarioId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className={styles.sentenceWrap} aria-live="polite">
              <p key={scenario.id} className={styles.sentence}>{scenario.sentence}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(styles.sheet, styles.right)} aria-label="Resume and details">
        <header className={styles.fileHeader}>
          <p className={styles.fileName}>{fileName}</p>
          <div className={styles.switch} role="group" aria-label="Resume role">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                className={cn(styles.switchItem, roleId === role.id && styles.switchItemActive)}
                aria-pressed={roleId === role.id}
                onClick={() => setRoleId(role.id)}
              >
                {role.short}
              </button>
            ))}
          </div>
        </header>

        <div className={styles.rightBody}>
          <div
            ref={stageRef}
            className={styles.stage}
            role="region"
            aria-label="Resume preview"
            tabIndex={0}
          >
            <article className={styles.paper}>
              <header>
                <h3 className={styles.paperName}>{resume.name}</h3>
                <p className={styles.paperTitle}>{resume.title}</p>
                <p className={styles.paperContact}>
                  {resume.contact.map((item) => <span key={item}>{item}</span>)}
                </p>
              </header>

              <section className={styles.paperSection}>
                <h4 className={styles.paperHeading}>Summary</h4>
                <p className={styles.paperText}>
                  <Marked parts={resume.summary} roleId={roleId} />
                </p>
              </section>

              <section className={styles.paperSection}>
                <h4 className={styles.paperHeading}>Experience</h4>
                {resume.experience.map((job) => (
                  <div key={job.id} {...entryProps(job.id)}>
                    <div className={styles.entryHead}>
                      <h5 className={styles.entryTitle}>{job.heading}</h5>
                      <span className={styles.entryMeta}>{job.meta}</span>
                    </div>
                    <ul className={styles.bullets}>
                      {job.bullets.map((parts, index) => (
                        <li key={index}><Marked parts={parts} roleId={roleId} /></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className={styles.paperSection}>
                <h4 className={styles.paperHeading}>Selected projects</h4>
                <div {...entryProps(resume.projects.id)}>
                  <ul className={styles.bullets}>
                    {resume.projects.bullets.map((parts, index) => (
                      <li key={index}><Marked parts={parts} roleId={roleId} /></li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className={styles.paperSection}>
                <h4 className={styles.paperHeading}>Skills and tools</h4>
                {cardGroups.map((group) => (
                  <p key={group.kind} className={styles.skillLine}>
                    <span className={styles.skillKind}>{group.resumeTitle}</span>
                    {skills.filter((skill) => skill.kind === group.kind).map((skill, index) => (
                      <React.Fragment key={skill.text}>
                        {index > 0 && ', '}
                        <Marked parts={[skill]} roleId={roleId} />
                      </React.Fragment>
                    ))}
                  </p>
                ))}
              </section>

              <section className={styles.paperSection}>
                <h4 className={styles.paperHeading}>Education</h4>
                <div {...entryProps(resume.education.id)}>
                  <h5 className={styles.entryTitle}>{resume.education.heading}</h5>
                  <p className={styles.paperText}>{resume.education.detail}</p>
                </div>
              </section>
            </article>
          </div>

          <dl className={styles.rows}>
            {rows.map((row) => (
              <div className={styles.row} key={row.label}>
                <dt className={styles.rowLabel}>{row.label}</dt>
                <dd className={styles.rowItems}>
                  {row.items.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={cn(styles.rowItem, activeEntry === item.id && styles.rowItemActive)}
                      onMouseEnter={() => setActiveEntry(item.id)}
                      onMouseLeave={() => setActiveEntry(null)}
                      onFocus={() => setActiveEntry(item.id)}
                      onBlur={() => setActiveEntry(null)}
                      onClick={() => scrollToEntry(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <section className={styles.cards} aria-label="Tools, skills and languages">
            {cardGroups.map((group) => {
              const items = skills.filter(
                (skill) => skill.kind === group.kind && skill.roles.includes(roleId)
              );

              return (
                <article className={styles.card} key={group.kind}>
                  <h3 className={styles.cardTitle}>{group.title}</h3>
                  <ul key={roleId} className={styles.cardList}>
                    {items.map((skill) => <li key={skill.text}>{skill.text}</li>)}
                  </ul>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </div>
  );
}

const partsShape = PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, markShape]));

DeliverySheets.propTypes = {
  accentColor: PropTypes.string,
  closeButtonRef: PropTypes.shape({ current: PropTypes.any }),
  dataset: PropTypes.shape({
    cardGroups: PropTypes.arrayOf(PropTypes.shape({
      kind: PropTypes.string.isRequired,
      resumeTitle: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    fileName: PropTypes.string.isRequired,
    resume: PropTypes.shape({
      contact: PropTypes.arrayOf(PropTypes.string).isRequired,
      education: PropTypes.shape({
        detail: PropTypes.string.isRequired,
        heading: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      }).isRequired,
      experience: PropTypes.arrayOf(PropTypes.shape({
        bullets: PropTypes.arrayOf(partsShape).isRequired,
        heading: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        meta: PropTypes.string.isRequired
      })).isRequired,
      name: PropTypes.string.isRequired,
      projects: PropTypes.shape({
        bullets: PropTypes.arrayOf(partsShape).isRequired,
        id: PropTypes.string.isRequired
      }).isRequired,
      summary: partsShape.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      short: PropTypes.string.isRequired
    })).isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })).isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
    scenarios: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sentence: PropTypes.string.isRequired
    })).isRequired,
    skills: PropTypes.arrayOf(markShape).isRequired
  }).isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default DeliverySheets;