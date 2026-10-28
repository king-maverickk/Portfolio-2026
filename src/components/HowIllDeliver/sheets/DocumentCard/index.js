import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import FileTabs, { panelId, tabId } from '../FileTabs';
import styles from './index.module.scss';

// The white sheet of paper that holds a file's contents.
export function Paper({ children, className, ...rest }) {
  return <div className={cn(styles.paper, className)} {...rest}>{children}</div>;
}

Paper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

// File tabs on top of one paper. The paper is the tab panel for whichever tab is active.
function DocumentCard({
  idBase, tabs, activeId, onChange, label, children, paperClassName
}) {
  return (
    <div className={styles.card}>
      <FileTabs tabs={tabs} activeId={activeId} onChange={onChange} idBase={idBase} label={label} />
      <Paper
        className={paperClassName}
        role="tabpanel"
        id={panelId(idBase)}
        aria-labelledby={tabId(idBase, activeId)}
      >
        {children}
      </Paper>
    </div>
  );
}

DocumentCard.propTypes = {
  activeId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  idBase: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  paperClassName: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default DocumentCard;
