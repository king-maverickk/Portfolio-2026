import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../Icons';
import DocumentBody from './DocumentBody';
import styles from './FitView.module.scss';

const PAGE_WIDTH = 620; // design pixels, see FitView.module.scss
const EDGE = 28; // px of breathing room kept around the page
const MAX_SCALE = 1.6;
const MIN_SCALE = 0.5;

// The enlarged view of a document.
//
// scaled layout:  the page is scaled, as one piece, so its whole height fits inside the viewport. Text stays
//                 sharp because the page is laid out at the final size (--u is changed), not zoomed with a
//                 transform. Nothing scrolls.
// stacked layout: a full-screen reader at normal size that scrolls like any page.
//
// Esc and Tab are handled here, before the sheet sees them: Esc closes only this view, and Tab stays on the
// close button because it is the only control in the view.
function FitView({ document: doc, label, layout, onClose }) {
  const pageRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const fit = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;

    if (layout !== 'scaled') {
      page.style.removeProperty('--u');
      return;
    }

    // Lay the page out at 1 design pixel = 1px, measure it, then pick the largest size that fits.
    page.style.setProperty('--u', '1px');
    const naturalWidth = page.offsetWidth || PAGE_WIDTH;
    const naturalHeight = page.offsetHeight;
    if (!naturalHeight) return;

    const byHeight = (window.innerHeight - EDGE * 2) / naturalHeight;
    const byWidth = (window.innerWidth - EDGE * 2) / naturalWidth;
    const scale = Math.min(byHeight, byWidth, MAX_SCALE);
    page.style.setProperty('--u', `${Math.max(scale, MIN_SCALE)}px`);
  }, [layout]);

  useLayoutEffect(() => {
    fit();
  }, [fit, doc]);

  useEffect(() => {
    const handleResize = () => fit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fit]);

  // Fonts arriving late change line breaks, so measure again once they are ready.
  useEffect(() => {
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { if (!cancelled) fit(); });
    }
    return () => { cancelled = true; };
  }, [fit]);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  return (
    <div
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-label={`${label}, full view`}
      data-fit-view=""
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        // The stacked reader scrolls: a press on its scrollbar (beyond clientWidth) must not close it.
        if (layout === 'stacked' && event.clientX >= event.currentTarget.clientWidth) return;
        onClose();
      }}
    >
      <article ref={pageRef} className={styles.page}>
        <DocumentBody document={doc} />
      </article>
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label={`Close ${label}`}
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

FitView.propTypes = {
  document: PropTypes.shape({ kind: PropTypes.string.isRequired }).isRequired,
  label: PropTypes.string.isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired,
  onClose: PropTypes.func.isRequired
};

export default FitView;
