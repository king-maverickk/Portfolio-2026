import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { CONTACT } from './copy';
import styles from './index.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

// A small dashed "draft" tag next to copy Claude wrote. Only in development.
export function DraftTag() {
  if (!SHOW_DRAFT_MARKERS) return null;
  return (
    <span className={styles.draftTag} data-draft="" title="Written by Claude from your notes. Rewrite or approve.">
      draft
    </span>
  );
}

// A note to you about something only you can fill in. Only in development.
export function TodoNote({ children }) {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <div className={styles.todoNote} data-draft="">{children}</div>;
}

TodoNote.propTypes = { children: PropTypes.node.isRequired };

// Heading with the small accent-coloured bar, the same as the resume uses.
export function SheetSection({ title, draft, children, className }) {
  return (
    <section className={cn(styles.section, className)} aria-label={title}>
      {title && (
        <h3 className={styles.sectionTitle}>
          {title}
          {draft && <DraftTag />}
        </h3>
      )}
      {children}
    </section>
  );
}

SheetSection.propTypes = {
  title: PropTypes.string,
  draft: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

// Label / value rows: "Based in  Hamilton, Ontario". Empty values are skipped.
export function FactList({ items }) {
  const filled = items.filter((item) => item && item.value);
  return (
    <dl className={styles.facts}>
      {filled.map(({ label, value }) => (
        <div className={styles.fact} key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

FactList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }))
    .isRequired
};

const LINK_ICONS = {
  linkedin: (
    <path d="M6.5 9.5v8M6.5 6.5v.01M10.5 17.5v-4.75a2.75 2.75 0 0 1 5.5 0v4.75M10.5 9.5v8" />
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.6 2.6 5.6 2.9 5.6 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.3c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  arrow: <path d="M7 17 17 7M9 7h8v8" />
};

export function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {LINK_ICONS[name]}
    </svg>
  );
}

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(LINK_ICONS)).isRequired,
  className: PropTypes.string
};

// LinkedIn, GitHub (once you add the URL) and email, as small cards.
export function LinkCards() {
  const links = [
    { id: 'linkedin', title: 'LinkedIn', detail: CONTACT.linkedinLabel, href: CONTACT.linkedin, external: true },
    { id: 'github', title: 'GitHub', detail: CONTACT.githubLabel || CONTACT.github, href: CONTACT.github, external: true },
    { id: 'mail', title: 'Email', detail: CONTACT.email, href: `mailto:${CONTACT.email}` }
  ].filter(({ href }) => href);

  return (
    <ul className={styles.linkCards}>
      {links.map(({ id, title, detail, href, external }) => (
        <li key={id}>
          <a
            className={styles.linkCard}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Icon name={id} className={styles.linkIcon} />
            <span className={styles.linkText}>
              <span className={styles.linkTitle}>{title}</span>
              <span className={styles.linkDetail}>{detail}</span>
            </span>
            <Icon name="arrow" className={styles.linkArrow} />
          </a>
        </li>
      ))}
    </ul>
  );
}

// "Start a project →": closes the sheet and takes the visitor to the contact
// form at the bottom of the page (see HowIllDeliver/index.js).
export function ContactCta({ form, onStart }) {
  return (
    <SheetSection title={form.title} draft={form.draft} className={styles.formSection}>
      <div className={styles.ctaRow}>
        <p className={styles.ctaText}>{form.text}</p>
        <button type="button" className={styles.primaryAction} onClick={onStart}>
          {form.cta}
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </button>
      </div>
    </SheetSection>
  );
}

ContactCta.propTypes = {
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    draft: PropTypes.bool,
    text: PropTypes.string.isRequired,
    cta: PropTypes.string.isRequired
  }).isRequired,
  onStart: PropTypes.func.isRequired
};
