import React from 'react';
import PropTypes from 'prop-types';

import ProfileCards from '../ProfileCards';
import styles from './index.module.scss';

// The "Online" heading with the GitHub and LinkedIn cards. `action` is an optional control on the heading's
// right (the freelance sheet puts its "Start a project" button there).
function OnlineSection({ id, action }) {
  return (
    <section className={styles.online} aria-labelledby={`${id}-heading`}>
      <div className={styles.head}>
        <h3 id={`${id}-heading`} className={styles.heading}>Online</h3>
        {action}
      </div>
      <ProfileCards />
    </section>
  );
}

OnlineSection.propTypes = {
  action: PropTypes.node,
  id: PropTypes.string.isRequired
};

export default OnlineSection;
