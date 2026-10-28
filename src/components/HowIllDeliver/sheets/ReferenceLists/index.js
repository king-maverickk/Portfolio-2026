import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

// Three short titled lists (Tools / Skills / Languages, or Research / Design / Build).
// Items read as a pipe-separated line; the pipe is drawn by CSS so screen readers get a plain list.
function ReferenceLists({ groups, label }) {
  return (
    <div className={styles.lists} role="group" aria-label={label}>
      {groups.map((group) => (
        <section className={styles.group} key={group.title}>
          <h4 className={styles.title}>{group.title}</h4>
          <ul className={styles.items}>
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

ReferenceLists.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired
  })).isRequired,
  label: PropTypes.string.isRequired
};

export default ReferenceLists;
