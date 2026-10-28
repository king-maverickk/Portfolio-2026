import React from 'react';
import PropTypes from 'prop-types';

import styles from './DocumentBody.module.scss';

function Bullets({ items }) {
  return (
    <ul className={styles.bullets}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

Bullets.propTypes = { items: PropTypes.arrayOf(PropTypes.string).isRequired };

function Section({ section }) {
  return (
    <section className={styles.section}>
      <h4 className={styles.heading}>{section.heading}</h4>
      {section.paragraphs && section.paragraphs.map((text) => <p key={text}>{text}</p>)}
      {section.entries && section.entries.map((entry) => (
        <div className={styles.entry} key={entry.heading}>
          <div className={styles.entryHead}>
            <b>{entry.heading}</b>
            {entry.meta && <span className={styles.meta}>{entry.meta}</span>}
          </div>
          {entry.text && <p>{entry.text}</p>}
          {entry.bullets && <Bullets items={entry.bullets} />}
        </div>
      ))}
      {section.bullets && <Bullets items={section.bullets} />}
      {section.lines && section.lines.map((line) => (
        <p className={styles.line} key={line.label}>
          <b>{line.label}</b>
          {' '}
          {line.text}
        </p>
      ))}
    </section>
  );
}

Section.propTypes = {
  section: PropTypes.shape({
    bullets: PropTypes.arrayOf(PropTypes.string),
    entries: PropTypes.arrayOf(PropTypes.shape({
      bullets: PropTypes.arrayOf(PropTypes.string),
      heading: PropTypes.string.isRequired,
      meta: PropTypes.string,
      text: PropTypes.string
    })),
    heading: PropTypes.string.isRequired,
    lines: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })),
    paragraphs: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

// Renders one document: a resume (name, contact row, sections) or a letter (title and paragraphs).
// Sized entirely in design pixels, so it looks the same in the preview card and in the fit-to-screen view.
function DocumentBody({ document: doc }) {
  if (doc.kind === 'letter') {
    return (
      <article className={styles.doc}>
        <h3 className={styles.name}>{doc.title}</h3>
        <p className={styles.role}>{doc.subtitle}</p>
        <div className={styles.rule} />
        {doc.paragraphs.map((text) => <p className={styles.letterText} key={text}>{text}</p>)}
        <p className={styles.letterText}>
          {doc.signoff.map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      </article>
    );
  }

  return (
    <article className={styles.doc}>
      <h3 className={styles.name}>{doc.name}</h3>
      <p className={styles.role}>{doc.title}</p>
      <p className={styles.contact}>
        {doc.contact.map((item) => <span key={item}>{item}</span>)}
      </p>
      {doc.sections.map((section) => <Section section={section} key={section.heading} />)}
    </article>
  );
}

DocumentBody.propTypes = {
  document: PropTypes.shape({
    contact: PropTypes.arrayOf(PropTypes.string),
    kind: PropTypes.oneOf(['resume', 'letter']).isRequired,
    name: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    sections: PropTypes.arrayOf(PropTypes.object),
    signoff: PropTypes.arrayOf(PropTypes.string),
    subtitle: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};

export default DocumentBody;
