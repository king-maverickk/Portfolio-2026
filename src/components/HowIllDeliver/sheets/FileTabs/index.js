import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { FileIcon } from '../Icons';
import styles from './index.module.scss';

export const tabId = (idBase, id) => `${idBase}-tab-${id}`;
export const panelId = (idBase) => `${idBase}-panel`;

// File-style tabs that sit on top of a document card. Follows the tabs pattern:
// one tab stop, arrow keys / Home / End move between tabs, and the card is the tabpanel.
function FileTabs({ tabs, activeId, onChange, idBase, label, className }) {
  const refs = useRef({});

  const handleKeyDown = (event, index) => {
    const last = tabs.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;

    event.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };

  return (
    <div className={cn(styles.tabs, className)} role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeId;
        return (
          <button
            type="button"
            role="tab"
            key={tab.id}
            id={tabId(idBase, tab.id)}
            ref={(node) => { refs.current[tab.id] = node; }}
            className={styles.tab}
            aria-selected={isActive}
            aria-controls={panelId(idBase)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <FileIcon className={styles.icon} />
            <span className={styles.label} data-text={tab.label}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// The same tab, not clickable. Used above each paper when the sheet shows every file at once.
export function FileLabel({ children, className }) {
  return (
    <div className={cn(styles.tabs, className)}>
      <span className={cn(styles.tab, styles.static)}>
        <FileIcon className={styles.icon} />
        <span>{children}</span>
      </span>
    </div>
  );
}

FileLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

FileTabs.propTypes = {
  activeId: PropTypes.string.isRequired,
  className: PropTypes.string,
  idBase: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default FileTabs;
