import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { ArrowRightIcon } from '../Icons';
import { FORM } from '../data/freelance';
import styles from './StartFile.module.scss';

const ENDPOINT = '/api/contact'; // the Azure Function in ./api

const EMPTY = {
  name: '', email: '', kind: FORM.kinds[0].id, currentSite: '', message: '', company: ''
};

// "Start a project": a sentence you fill in. Posts to the contact function; `company` is a honeypot field
// that people never see, so anything that fills it in is a bot.
function StartFile({ idBase, nameInputRef }) {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('sent');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={styles.start}>
        <h3 className={styles.title}>{FORM.title}</h3>
        <div className={styles.sent} role="status">
          <p className={styles.sentTitle}>{FORM.sentTitle}</p>
          <p>{FORM.sentText}</p>
        </div>
      </div>
    );
  }

  const id = (field) => `${idBase}-${field}`;

  return (
    <form className={styles.start} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{FORM.title}</h3>
      <p className={styles.intro}>{FORM.intro}</p>

      <div className={styles.fields}>
        <label className={cn(styles.line, styles.lineName)} htmlFor={id('name')}>
          <span className={styles.lead}>{FORM.nameLead}</span>
          <input
            ref={nameInputRef}
            id={id('name')}
            className={styles.input}
            type="text"
            name="name"
            autoComplete="name"
            placeholder={FORM.namePlaceholder}
            maxLength={120}
            required
            value={values.name}
            onChange={set('name')}
          />
        </label>

        <label className={cn(styles.line, styles.lineEmail)} htmlFor={id('email')}>
          <span className={styles.lead}>{FORM.emailLead}</span>
          <input
            id={id('email')}
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            placeholder={FORM.emailPlaceholder}
            maxLength={200}
            required
            value={values.email}
            onChange={set('email')}
          />
        </label>

        <fieldset className={styles.kinds}>
          <legend className={styles.lead}>{FORM.kindLegend}</legend>
          <div className={styles.pills}>
            {FORM.kinds.map((kind) => (
              <label className={styles.pill} key={kind.id}>
                <input
                  className={styles.radio}
                  type="radio"
                  name={`${idBase}-kind`}
                  value={kind.id}
                  checked={values.kind === kind.id}
                  onChange={set('kind')}
                />
                <span className={styles.pillBody}>
                  <span className={styles.dot} aria-hidden="true" />
                  {kind.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={cn(styles.line, styles.lineSite)} htmlFor={id('site')}>
          <span className={styles.lead}>{FORM.siteLead}</span>
          <input
            id={id('site')}
            className={styles.input}
            type="text"
            inputMode="url"
            name="currentSite"
            autoComplete="url"
            placeholder={FORM.sitePlaceholder}
            maxLength={300}
            value={values.currentSite}
            onChange={set('currentSite')}
          />
        </label>

        <div className={styles.message}>
          <label className={styles.lead} htmlFor={id('message')}>{FORM.messageLead}</label>
          <textarea
            id={id('message')}
            className={styles.textarea}
            name="message"
            rows={2}
            placeholder={FORM.messagePlaceholder}
            maxLength={3000}
            value={values.message}
            onChange={set('message')}
          />
        </div>

        <div className={styles.trap} aria-hidden="true">
          <label htmlFor={id('company')}>Company</label>
          <input
            id={id('company')}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={set('company')}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.send} disabled={status === 'sending'}>
          {status === 'sending' ? FORM.sending : FORM.send}
          <ArrowRightIcon className={styles.sendIcon} />
        </button>
        {status === 'error' && <p className={styles.error} role="alert">{FORM.error}</p>}
      </div>
    </form>
  );
}

StartFile.propTypes = {
  idBase: PropTypes.string.isRequired,
  nameInputRef: PropTypes.shape({ current: PropTypes.any })
};

export default StartFile;
