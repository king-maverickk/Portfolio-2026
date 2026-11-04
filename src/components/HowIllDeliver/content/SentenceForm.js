import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { CONTACT } from './copy';
import styles from './SentenceForm.module.scss';

// A contact form written as a sentence: the visitor fills in the blanks and
// picks chips, and the form reads back as a message.
//
// The sentence itself lives in copy.js as `lines`. Each line is a list of parts:
//   'Plain text'                                    words of the sentence
//   { input: 'name', label, placeholder, ... }      a blank to fill in
//   { chips: 'help', label, options, multiple }     a set of chips
//   { textarea: 'message', label, placeholder }     a full-width box
//
// What's sent to /api/contact is { name, email, kind, currentSite, message,
// company }, the shape the Azure Function expects. The other answers (business,
// chips) are written into the top of `message` so nothing is lost. `company`
// is the honeypot, so the visitor's company goes in as `organisation`.
//
// If sending fails (the API isn't deployed yet, say), the visitor gets a
// ready-written email with everything they typed.

const API_FIELDS = ['name', 'email', 'currentSite', 'message'];

function partsOf(lines) {
  return lines.flat().filter((part) => typeof part === 'object');
}

function initialValues(lines) {
  const values = { company: '' };
  partsOf(lines).forEach((part) => {
    if (part.chips) values[part.chips] = part.multiple ? [] : '';
    else values[part.input || part.textarea] = '';
  });
  return values;
}

// The extra answers, as lines at the top of the message.
function composeMessage(lines, values) {
  const summary = partsOf(lines)
    .filter((part) => part.summary)
    .map((part) => {
      const key = part.chips || part.input;
      const value = Array.isArray(values[key]) ? values[key].join(', ') : values[key];
      return value ? `${part.summary}: ${value}` : null;
    })
    .filter(Boolean);

  return [...summary, summary.length ? '' : null, values.message].filter((line) => line !== null).join('\n');
}

function mailtoFor(values, message, kind) {
  const subject = kind === 'freelance' ? `Project enquiry from ${values.name}` : `Message from ${values.name}`;
  const body = [message, values.currentSite ? `\nCurrent site: ${values.currentSite}` : ''].join('');
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

function Chips({ part, value, onChange, idPrefix }) {
  const groupId = `${idPrefix}-${part.chips}`;
  const isOn = (option) => (part.multiple ? value.includes(option) : value === option);

  const toggle = (option) => {
    if (!part.multiple) {
      onChange(value === option ? '' : option);
      return;
    }
    onChange(isOn(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <span className={styles.chips} role="group" aria-label={part.label}>
      {part.options.map((option) => (
        <label key={option} className={cn(styles.chip, isOn(option) && styles.chipOn)}>
          <input
            className={styles.chipInput}
            type={part.multiple ? 'checkbox' : 'radio'}
            name={groupId}
            value={option}
            checked={isOn(option)}
            onChange={() => toggle(option)}
            // A radio can be unpicked by clicking it again.
            onClick={() => { if (!part.multiple && value === option) onChange(''); }}
          />
          <span className={styles.chipDot} aria-hidden="true" />
          {option}
        </label>
      ))}
    </span>
  );
}

function SentenceForm({ kind, lines, submitLabel, footnote, idPrefix }) {
  const [values, setValues] = useState(() => initialValues(lines));
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const message = useMemo(() => composeMessage(lines, values), [lines, values]);

  const set = (key) => (value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const payload = { kind, company: values.company };
    API_FIELDS.forEach((field) => { payload[field] = values[field] || ''; });
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

  if (status === 'sent') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneTitle}>Thanks, {values.name.split(' ')[0] || 'got it'}.</span>
        <span>Your message is in my inbox. I’ll reply to {values.email} within 24 hours.</span>
      </div>
    );
  }

  const renderPart = (part, index) => {
    if (typeof part === 'string') {
      return <span key={index}>{part}</span>;
    }
    if (part.chips) {
      return (
        <Chips key={part.chips} part={part} value={values[part.chips]} onChange={set(part.chips)} idPrefix={idPrefix} />
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.sentence}>
        {lines.map((line, index) => (
          // Spaces between parts are real text, so lines wrap like a sentence.
          <div className={styles.line} key={index}>
            {line.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {partIndex > 0 && ' '}
                {renderPart(part, partIndex)}
              </React.Fragment>
            ))}
          </div>
        ))}
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
          <a href={mailtoFor(values, message, kind)}>Send it as an email instead</a>
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

SentenceForm.propTypes = {
  kind: PropTypes.oneOf(['hiring', 'freelance']).isRequired,
  lines: PropTypes.arrayOf(PropTypes.arrayOf(partShape)).isRequired,
  submitLabel: PropTypes.string.isRequired,
  footnote: PropTypes.string,
  idPrefix: PropTypes.string.isRequired
};

export default SentenceForm;
