import React from 'react';

import resume from './resumeData';
import styles from './index.module.scss';

function Entry({ title, dates, bullets, detail }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryHead}>
        <span className={styles.entryTitle}>{title}</span>
        <span className={styles.entryDates}>{dates}</span>
      </div>
      {detail && <div className={styles.entryDetail}>{detail}</div>}
      {bullets && (
        <ul className={styles.bullets}>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className={styles.section} aria-label={title}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      {children}
    </section>
  );
}

// The resume, as text in the page. No download: company computers often block
// files from sites they don't know, so it is read here.
//
// Plain <div>s for the text blocks, because the sheet body styles every <p>.
function Resume() {
  return (
    <article className={styles.resume} aria-label="Resume">
      <header className={styles.header}>
        <h3 className={styles.name}>{resume.name}</h3>
        <div className={styles.headline}>{resume.headline}</div>
        <div className={styles.contact}>
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          <span aria-hidden="true"> | </span>
          <span>{resume.location}</span>
          <span aria-hidden="true"> | </span>
          <a href={resume.linkedin.href} target="_blank" rel="noopener noreferrer">
            {resume.linkedin.label}
          </a>
        </div>
      </header>

      <Section title="Professional summary">
        <div className={styles.summary}>{resume.summary}</div>
      </Section>

      <Section title="Languages & technologies">
        <ul className={styles.bullets}>
          {resume.skills.map(({ label, text }) => (
            <li key={label}>
              <strong>{label}:</strong> {text}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Work experience">
        {resume.experience.map((job) => (
          <Entry key={job.title} {...job} />
        ))}
      </Section>

      <Section title="Projects">
        {resume.projects.map((project) => (
          <Entry key={project.title} {...project} />
        ))}
      </Section>

      <Section title="Education">
        {resume.education.map((item) => (
          <Entry key={item.title} {...item} />
        ))}
      </Section>
    </article>
  );
}

export default Resume;
