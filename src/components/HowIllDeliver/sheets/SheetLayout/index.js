import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { CloseIcon } from '../Icons';
import styles from './index.module.scss';

function Slots({ names, slots }) {
  return names.map((name) => (
    slots[name] ? (
      <div className={styles.slot} data-slot={name} key={name}>{slots[name]}</div>
    ) : null
  ));
}

Slots.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  slots: PropTypes.objectOf(PropTypes.node).isRequired
};

// The dialog shell shared by every sheet.
//
// "scaled" layout: two columns pinned to the left and right edges, the middle left open so the blurred page
//   shows through. Every size is a multiple of --u, so the composition scales to fit the viewport.
//   Clicks on empty space fall through to the backdrop, which closes the sheet.
// "stacked" layout: one scrolling column in the order given by `stacked`.
//
// Slots are named blocks supplied by the sheet. Each layout lists which slots it uses and in what order,
// so the DOM order always matches the reading order.
function SheetLayout({
  layout,
  glow,
  glowAt,
  title,
  description,
  slots,
  scaledOrder,
  stackedOrder,
  closeButtonRef,
  onClose,
  className
}) {
  const closeButton = (
    <button
      ref={closeButtonRef}
      type="button"
      className={styles.close}
      aria-label="Close sheet"
      onClick={onClose}
    >
      <CloseIcon />
    </button>
  );

  const header = (
    <header className={styles.header}>
      <div>
        <h2 id="delivery-sheet-title" className={styles.title}>{title}</h2>
        <div id="delivery-sheet-description" className={styles.description}>{description}</div>
      </div>
    </header>
  );

  // In the stacked layout a click on the empty margin beside the column closes the sheet.
  // Ignore clicks on the scrollbar itself (they land beyond clientWidth).
  const handleMouseDown = (event) => {
    if (layout !== 'stacked') return;
    if (event.target === event.currentTarget && event.clientX < event.currentTarget.clientWidth) onClose();
  };

  return (
    <div
      id="delivery-sheet"
      className={cn(styles.dialog, styles[layout], className)}
      style={{ '--glow': glow, '--glow-x': glowAt.x, '--glow-y': glowAt.y }}
      data-layout={layout}
      data-sheet-dialog=""
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-sheet-title"
      aria-describedby="delivery-sheet-description"
      onMouseDown={handleMouseDown}
    >
      {layout === 'scaled' ? (
        <>
          <div className={styles.glow} aria-hidden="true" />
          {closeButton}
          <div className={styles.columns}>
            <div className={styles.left}>
              {header}
              <Slots names={scaledOrder.left} slots={slots} />
            </div>
            <div className={styles.right}>
              <Slots names={scaledOrder.right} slots={slots} />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.column}>
          <div className={styles.headerRow}>
            {header}
            {closeButton}
          </div>
          <Slots names={stackedOrder} slots={slots} />
        </div>
      )}
    </div>
  );
}

SheetLayout.propTypes = {
  className: PropTypes.string,
  closeButtonRef: PropTypes.shape({ current: PropTypes.any }),
  description: PropTypes.node.isRequired,
  glow: PropTypes.string.isRequired,
  glowAt: PropTypes.shape({
    x: PropTypes.string.isRequired, // a CSS length, measured from the left edge of the screen
    y: PropTypes.number.isRequired // design pixels from the top
  }).isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired,
  onClose: PropTypes.func.isRequired,
  scaledOrder: PropTypes.shape({
    left: PropTypes.arrayOf(PropTypes.string).isRequired,
    right: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  slots: PropTypes.objectOf(PropTypes.node).isRequired,
  stackedOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
};

export default SheetLayout;
