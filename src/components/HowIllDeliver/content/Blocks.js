import React, { useState } from 'react';
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

// --- Contact form --------------------------------------------------------------
//
// Posts to the Azure Function at /api/contact:
//   { name, email, kind, currentSite, message, company }
// `company` is the honeypot: a hidden field people never see, so anything in it
// came from a bot.
//
// If the request fails (the API isn't deployed yet, say), the visitor gets a
// ready-written email to send instead, so no enquiry is ever lost.

const MAX_MESSAGE = 4000;

function buildMailto({ name, message, currentSite }, kind) {
  const subject = kind === 'freelance' ? `Project enquiry from ${name}` : `Message from ${name}`;
  const body = [message, currentSite ? `\nCurrent site: ${currentSite}` : ''].join('');
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ kind, submitLabel, messageLabel, showCurrentSite, idPrefix }) {
  const [values, setValues] = useState({ name: '', email: '', currentSite: '', message: '', company: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, kind })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={styles.formDone} role="status">
        <span className={styles.formDoneTitle}>Thanks, {values.name.split(' ')[0] || 'got it'}.</span>
        <span>Your message is in my inbox. I’ll reply to {values.email} within 24 hours.</span>
      </div>
    );
  }

  const id = (field) => `${idPrefix}-${field}`;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <label className={styles.field} htmlFor={id('name')}>
          <span className={styles.fieldLabel}>Name</span>
          <input
            id={id('name')}
            className={styles.input}
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={values.name}
            onChange={update('name')}
          />
        </label>
        <label className={styles.field} htmlFor={id('email')}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            id={id('email')}
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={200}
            value={values.email}
            onChange={update('email')}
          />
        </label>
      </div>

      {showCurrentSite && (
        <label className={styles.field} htmlFor={id('site')}>
          <span className={styles.fieldLabel}>
            Current website <span className={styles.optional}>(optional)</span>
          </span>
          <input
            id={id('site')}
            className={styles.input}
            type="url"
            name="currentSite"
            inputMode="url"
            placeholder="https://"
            maxLength={300}
            value={values.currentSite}
            onChange={update('currentSite')}
          />
        </label>
      )}

      <label className={styles.field} htmlFor={id('message')}>
        <span className={styles.fieldLabel}>{messageLabel}</span>
        <textarea
          id={id('message')}
          className={cn(styles.input, styles.textarea)}
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE}
          value={values.message}
          onChange={update('message')}
        />
      </label>

      {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={id('company')}>Company</label>
        <input
          id={id('company')}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={update('company')}
        />
      </div>

      <div className={styles.formFooter}>
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : submitLabel}
        </button>
        {status === 'error' && (
          <div className={styles.formError} role="alert">
            That didn’t send.{' '}
            <a href={buildMailto(values, kind)}>Send it as an email instead</a>
            {' '}and your message comes with it.
          </div>
        )}
      </div>
    </form>
  );
}

ContactForm.propTypes = {
  kind: PropTypes.oneOf(['hiring', 'freelance']).isRequired,
  submitLabel: PropTypes.string.isRequired,
  messageLabel: PropTypes.string.isRequired,
  showCurrentSite: PropTypes.bool,
  idPrefix: PropTypes.string.isRequired
};
