import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { ExpandIcon } from '../Icons';
import DocumentBody from './DocumentBody';
import FitView from './FitView';
import styles from './ExpandableDocument.module.scss';

// A document inside a paper.
//
// stacked layout: the whole document, in the flow of the page.
// scaled layout:  a preview that fills the paper. When the document is taller than the paper the bottom fades
//                 out and the paper becomes one big button: click it and the document opens in FitView,
//                 scaled to fit the screen. A document that already fits is shown as it is, with no button.
function ExpandableDocument({ document: doc, label, layout }) {
  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const triggerRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);
  const [open, setOpen] = useState(false);

  const measure = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;
    setOverflowing(preview.scrollHeight - preview.clientHeight > 1);
  }, []);

  useLayoutEffect(() => {
    if (layout !== 'scaled') {
      setOverflowing(false);
      return undefined;
    }

    measure();
    const preview = previewRef.current;
    let observer;
    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(measure);
      observer.observe(preview);
      if (preview.firstElementChild) observer.observe(preview.firstElementChild);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [layout, doc, measure]);

  // A different file (or a layout change) closes the enlarged view.
  useEffect(() => {
    setOpen(false);
  }, [doc, layout]);

  const close = useCallback(() => {
    setOpen(false);
    // The trigger is still mounted: return focus to it.
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const host = open && rootRef.current ? rootRef.current.closest('[data-sheet-dialog]') : null;
  const canExpand = layout === 'scaled' && overflowing;

  return (
    <div className={styles.root} ref={rootRef} data-expandable={canExpand ? '' : undefined}>
      <div className={styles.preview} ref={previewRef}>
        <DocumentBody document={doc} />
      </div>

      {canExpand && (
        <>
          <div className={styles.fade} aria-hidden="true" />
          <button
            ref={triggerRef}
            type="button"
            className={styles.expand}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            <span className={styles.hint}>
              <ExpandIcon className={styles.hintIcon} />
              {`View full ${label}`}
            </span>
          </button>
        </>
      )}

      {open && host && createPortal(
        <FitView document={doc} label={label} layout={layout} onClose={close} />,
        host
      )}
    </div>
  );
}

ExpandableDocument.propTypes = {
  document: PropTypes.shape({ kind: PropTypes.string.isRequired }).isRequired,
  label: PropTypes.string.isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired
};

export default ExpandableDocument;
