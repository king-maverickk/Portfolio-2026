import React from 'react';
import PropTypes from 'prop-types';

import { CONTACT, OPEN_TO_WORK } from './copy';
import { ContactCta, FactList, Icon, TodoNote } from './Blocks';
import styles from './index.module.scss';

// Deliberately short: this sheet is how to reach you. Your documents live on
// the (hiring manager) sheet, one click away, so the two never repeat.
function OpenToWorkSheet({ onShowResume, onStartContact }) {
  const { lookingFor, basedIn, start, workStyle, form } = OPEN_TO_WORK;
  const missing = [start, workStyle].filter((item) => !item.value).map((item) => item.label.toLowerCase());

  return (
    <>
      <div className={styles.availability}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span className={styles.availabilityLabel}>Available for new roles</span>
      </div>

      <FactList items={[lookingFor, basedIn, start, workStyle]} />
      {missing.length > 0 && (
        <TodoNote>
          Add “{missing.join('” and “')}” in content/copy.js and the rows appear here.
        </TodoNote>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.primaryAction} onClick={onShowResume}>
          Read my resume
        </button>
        <a
          className={styles.secondaryAction}
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="linkedin" className={styles.actionIcon} />
          LinkedIn
        </a>
      </div>

      <ContactCta form={form} onStart={() => onStartContact('hiring')} />
    </>
  );
}

OpenToWorkSheet.propTypes = {
  onShowResume: PropTypes.func.isRequired,
  onStartContact: PropTypes.func.isRequired
};

export default OpenToWorkSheet;
