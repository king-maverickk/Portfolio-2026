import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SentenceForm from 'components/SentenceForm';
import { CONTACT } from 'components/HowIllDeliver/content/copy';
import { CONTACT_EVENT } from './contactEvents';
import { CONTACT_SECTION, kindFor } from './copy';
import styles from './index.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function DraftTag() {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <span className={styles.draftTag} data-draft="">draft</span>;
}

// The contact section after About: a big headline, the ways to reach you on
// the left, and the sentence form on the right.
function ContactSection({ className }) {
  const sectionRef = useRef(null);
  const [defaults, setDefaults] = useState({});
  const [formKey, setFormKey] = useState(0);

  // A sheet's "Start a project" / "Get in touch" button lands here with the
  // matching answer already picked.
  useEffect(() => {
    let focusTimer;

    const onStart = (event) => {
      const reason = event.detail?.reason;
      if (reason) {
        setDefaults({ reason });
        setFormKey((key) => key + 1);
      }

      const reduced = prefersReducedMotion();
      sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        document.getElementById('contact-name')?.focus({ preventScroll: true });
      }, reduced ? 0 : 700);
    };

    window.addEventListener(CONTACT_EVENT, onStart);
    return () => {
      window.removeEventListener(CONTACT_EVENT, onStart);
      window.clearTimeout(focusTimer);
    };
  }, []);

  const {  headline, intro, form } = CONTACT_SECTION;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={cn(styles.section, className)}
      aria-labelledby="contact-headline"
    >
      <header className={styles.header}>
        <h2 id="contact-headline" className={styles.headline}>{headline}</h2>
      </header>

      <aside className={styles.aside}>
        <p className={styles.intro}>
          {intro.text}
          {intro.draft && <DraftTag />}
        </p>

        <dl className={styles.ways}>
          <div>
            <dt>Email me</dt>
            <dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Hamilton, Ontario</dd>
          </div>
          <div>
            <dt>Elsewhere</dt>
            <dd>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              {CONTACT.github && (
                <>
                  {' · '}
                  <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                </>
              )}
            </dd>
          </div>
        </dl>
      </aside>

      <div className={styles.formColumn}>
        {form.draft && SHOW_DRAFT_MARKERS && <div className={styles.formDraft}><DraftTag /></div>}
        <SentenceForm
          key={formKey}
          theme="dark"
          idPrefix="contact"
          kind={kindFor}
          lines={form.lines}
          submitLabel={form.submit}
          footnote={form.footnote}
          email={CONTACT.email}
          defaults={defaults}
        />
      </div>
    </section>
  );
}

ContactSection.propTypes = {
  className: PropTypes.string
};

export default ContactSection;
