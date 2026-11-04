import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

// A contact form written as a sentence: the visitor fills in the blanks and
// picks chips, and the form reads back as a message.
//
// `lines` is a list of lines. A line is either a list of parts, or
// { when: { field: 'value' }, parts: [...] } to show it only once an earlier
// chip has that answer. Parts:
//   'Plain text'                                    words of the sentence
//   { input: 'name', label, placeholder, ... }      a blank to fill in
//   { chips: 'help', label, options, multiple }     a set of chips
//   { textarea: 'message', label, placeholder }     a full-width box
//
// What's sent to /api/contact is { name, email, kind, currentSite, message,
// company }, the shape the Azure Function expects. Answers with a `summary`
// are written at the top of `message`, so nothing is lost. `company` is the
// honeypot, so the visitor's company goes in as `organisation`.
//
// If sending fails (the API isn't deployed yet, say), the visitor gets a
// ready-written email with everything they typed.

const API_FIELDS = ['name', 'email', 'currentSite', 'message'];

function normalise(line) {
  return Array.isArray(line) ? { parts: line } : line;
}

function isShown(line, values) {
  if (!line.when) return true;
  return Object.entries(line.when).every(([field, answer]) => values[field] === answer);
}

function partsOf(lines) {
  return lines.flatMap((line) => line.parts).filter((part) => typeof part === 'object');
}

function keyOf(part) {
  return part.input || part.chips || part.textarea;
}

function initialValues(lines, defaults) {
  const values = { company: '' };
  partsOf(lines).forEach((part) => {
    values[keyOf(part)] = part.chips && part.multiple ? [] : '';
  });
  return { ...values, ...defaults };
}

function composeMessage(parts, values) {
  const summary = parts
    .filter((part) => part.summary)
    .map((part) => {
      const value = values[keyOf(part)];
      const text = Array.isArray(value) ? value.join(', ') : value;
      return text ? `${part.summary}: ${text}` : null;
    })
    .filter(Boolean);

  return [...summary, summary.length ? '' : null, values.message]
    .filter((line) => line !== null)
    .join('\n');
}

function mailtoFor(email, values, message, kind) {
  const subject = kind === 'freelance' ? `Project enquiry from ${values.name}` : `Message from ${values.name}`;
  const body = [message, values.currentSite ? `\nCurrent site: ${values.currentSite}` : ''].join('');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// A blank in the sentence. The hidden twin span behind the input grows with
// what's typed, so the line reflows as the visitor writes.
function Blank({ part, value, onChange, idPrefix }) {
  return (
    <span className={styles.blank} data-value={value} style={{ '--min': part.width || '6em' }}>
      <input
        id={`${idPrefix}-${part.input}`}
        className={styles.blankInput}
        name={part.input}
        type={part.type || 'text'}
        // Without this the input asks for ~20 characters of room; the hidden
        // twin span sets the real width instead.
        size={1}
        inputMode={part.type === 'url' ? 'url' : undefined}
        autoComplete={part.autoComplete}
        aria-label={part.label}
        placeholder={part.placeholder}
        required={part.required}
        maxLength={part.maxLength || 200}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </span>
  );
}

function Chips({ part, value, onChange, idPrefix, invalid }) {
  const groupId = `${idPrefix}-${part.chips}`;
  const isOn = (option) => (part.multiple ? value.includes(option) : value === option);

  const toggle = (option) => {
    if (!part.multiple) {
      onChange(option);
      return;
    }
    onChange(isOn(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <span
      className={styles.chips}
      role="group"
      aria-label={part.label}
      data-invalid={invalid || undefined}
      data-group={groupId}
    >
      {part.options.map((option) => (
        <label key={option} className={cn(styles.chip, isOn(option) && styles.chipOn)}>
          <input
            className={styles.chipInput}
            type={part.multiple ? 'checkbox' : 'radio'}
            name={groupId}
            value={option}
            checked={isOn(option)}
            onChange={() => toggle(option)}
            // An optional single choice can be unpicked by clicking it again.
            onClick={() => { if (!part.multiple && !part.required && value === option) onChange(''); }}
          />
          <span className={styles.chipDot} aria-hidden="true" />
          {option}
        </label>
      ))}
    </span>
  );
}

function SentenceForm({
  kind,
  lines: rawLines,
  submitLabel,
  footnote,
  idPrefix,
  email,
  theme = 'paper',
  defaults = {},
  className
}) {
  const lines = useMemo(() => rawLines.map(normalise), [rawLines]);
  const formRef = useRef(null);
  const [values, setValues] = useState(() => initialValues(lines, defaults));
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [missing, setMissing] = useState(null); // a required chip group left empty

  const shownLines = lines.filter((line) => isShown(line, values));
  const shownParts = partsOf(shownLines);
  const message = composeMessage(shownParts, values);
  const resolvedKind = typeof kind === 'function' ? kind(values) : kind;

  const set = (key) => (value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (status === 'error') setStatus('idle');
    if (missing === key) setMissing(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    // The browser checks the blanks; chips need checking here.
    const emptyChips = shownParts.find((part) => part.chips && part.required
      && (Array.isArray(values[part.chips]) ? !values[part.chips].length : !values[part.chips]));
    if (emptyChips) {
      setMissing(emptyChips.chips);
      formRef.current
        ?.querySelector(`[data-group="${idPrefix}-${emptyChips.chips}"] input`)
        ?.focus();
      return;
    }

    setStatus('sending');
    const shownKeys = new Set(shownParts.map(keyOf));
    const payload = { kind: resolvedKind, company: values.company };
    API_FIELDS.forEach((field) => {
      payload[field] = shownKeys.has(field) ? values[field] || '' : '';
    });
    payload.message = message;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
    }
  };

  const themeClass = theme === 'dark' ? styles.dark : styles.paper;

  if (status === 'sent') {
    return (
      <div className={cn(styles.done, themeClass, className)} role="status">
        <span className={styles.doneTitle}>Thanks, {values.name.split(' ')[0] || 'got it'}.</span>
        <span>Your message is in my inbox. I’ll reply to {values.email} within 24 hours.</span>
      </div>
    );
  }

  const renderPart = (part, index) => {
    if (typeof part === 'string') return <span key={index}>{part}</span>;

    if (part.chips) {
      return (
        <Chips
          key={part.chips}
          part={part}
          value={values[part.chips]}
          onChange={set(part.chips)}
          idPrefix={idPrefix}
          invalid={missing === part.chips}
        />
      );
    }

    if (part.textarea) {
      return (
        <textarea
          key={part.textarea}
          id={`${idPrefix}-${part.textarea}`}
          className={styles.textarea}
          name={part.textarea}
          aria-label={part.label}
          placeholder={part.placeholder}
          required={part.required}
          rows={3}
          maxLength={4000}
          value={values[part.textarea]}
          onChange={(event) => set(part.textarea)(event.target.value)}
        />
      );
    }

    return (
      <Blank key={part.input} part={part} value={values[part.input]} onChange={set(part.input)} idPrefix={idPrefix} />
    );
  };

  return (
    <form ref={formRef} className={cn(styles.form, themeClass, className)} onSubmit={handleSubmit}>
      <div className={styles.sentence}>
        {lines.map((line, index) => {
          if (!isShown(line, values)) return null;
          const missingHere = line.parts.some((part) => part.chips && part.chips === missing);
          return (
            // Lines that depend on an answer slide in when they appear.
            <div className={cn(styles.line, line.when && styles.lineAppears)} key={index}>
              {line.parts.map((part, partIndex) => (
                <React.Fragment key={partIndex}>
                  {partIndex > 0 && ' '}
                  {renderPart(part, partIndex)}
                </React.Fragment>
              ))}
              {missingHere && (
                <span className={styles.missing} role="alert">Pick one to carry on.</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input
          id={`${idPrefix}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => set('company')(event.target.value)}
        />
      </div>

      <div className={styles.footer}>
        {footnote && <span className={styles.footnote}>{footnote}</span>}
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : submitLabel}
          <span className={styles.submitArrow} aria-hidden="true">→</span>
        </button>
      </div>

      {status === 'error' && (
        <div className={styles.error} role="alert">
          That didn’t send.{' '}
          <a href={mailtoFor(email, values, message, resolvedKind)}>Send it as an email instead</a>
          {' '}and everything you wrote comes with it.
        </div>
      )}
    </form>
  );
}

const partShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    input: PropTypes.string,
    chips: PropTypes.string,
    textarea: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    summary: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.string
  })
]);

const lineShape = PropTypes.oneOfType([
  PropTypes.arrayOf(partShape),
  PropTypes.shape({
    when: PropTypes.objectOf(PropTypes.string),
    parts: PropTypes.arrayOf(partShape).isRequired
  })
]);

SentenceForm.propTypes = {
  // 'hiring' | 'freelance', or a function of the answers that returns one.
  kind: PropTypes.oneOfType([PropTypes.oneOf(['hiring', 'freelance']), PropTypes.func]).isRequired,
  lines: PropTypes.arrayOf(lineShape).isRequired,
  submitLabel: PropTypes.string.isRequired,
  footnote: PropTypes.string,
  idPrefix: PropTypes.string.isRequired,
  // Where the "send it as an email instead" fallback goes.
  email: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['paper', 'dark']),
  // Answers to start with, e.g. { reason: 'hiring for a role' }.
  defaults: PropTypes.object,
  className: PropTypes.string
};

export default SentenceForm;
