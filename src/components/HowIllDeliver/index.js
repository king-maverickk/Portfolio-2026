import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import HiringManagerSheet from './content/HiringManagerSheet';
import FreelanceSheet from './content/FreelanceSheet';
import OpenToWorkSheet from './content/OpenToWorkSheet';
import { FREELANCE, HIRING, OPEN_TO_WORK, SECTION_PROMPT } from './content/copy';
import { startContact } from 'components/ContactSection/contactEvents';

import styles from './index.module.scss';

const GRID = {
  columns: 12,
  rows: 8
};

const REVEAL = {
  duration: 600,
  scaleDuration: 150,
  delay: 50,
  desktopOffset: 144,
  compactOffset: 48,
  compactBreakpoint: 1000,
  triggerOffset: 100
};

const HEADLINE_ITEMS = [
  { id: 'how', text: 'How I’ll', className: styles.how, direction: 'left' },
  { id: 'deliver', text: 'deliver', className: styles.deliver, direction: 'left' },
  { id: 'for', text: 'for', className: styles.for, direction: 'right' },
  { id: 'you', text: 'You', className: styles.you, direction: 'right' }
];

// The annotation labels are the way into the sheets. Three cues say so:
// the prompt line under the headline, an arrow in each pill, and a single ring
// that leaves each pill (in its own colour) once it has flown in.
const HELLO_STAGGER_MS = 180;

const ANNOTATIONS = [
  { id: 'open-to-work', label: '(open to work)', className: styles.openToWork },
  { id: 'freelance', label: '(freelance/contract)', className: styles.freelance },
  { id: 'hiring-manager', label: '(hiring manager)', className: styles.hiringManager }
];

// If the exit animation never reports back (a hidden tab, say) the sheet would
// stay open forever. It is longer than the exit itself (600ms).
const SHEET_CLOSE_FALLBACK_MS = 900;

// The sheet is animated with the individual `translate` and `rotate`
// properties. Where they aren't supported it simply appears and disappears.
function canAnimateSheet() {
  const supportsMotion = Boolean(
    window.CSS && typeof window.CSS.supports === 'function' && window.CSS.supports('translate', '10px 0 0')
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return supportsMotion && !prefersReducedMotion;
}

// Titles and words live in content/copy.js; each sheet's layout is its own
// component in content/.
const SHEET_CONTENT = {
  'open-to-work': {
    title: OPEN_TO_WORK.title,
    description: OPEN_TO_WORK.description,
    Body: OpenToWorkSheet
  },
  freelance: {
    title: FREELANCE.title,
    description: FREELANCE.description,
    Body: FreelanceSheet,
    // This sheet is a stack of containers: its first container shows the
    // title (with id="delivery-sheet-title"), and the sheet's margins are slim.
    ownsTitle: true,
    className: styles.sheetSections
  },
  'hiring-manager': {
    title: HIRING.title,
    description: HIRING.description,
    Body: HiringManagerSheet
  }
};

// Everything Tab can land on inside the sheet, form fields included.
const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].map((selector) => `[data-sheet-dialog] ${selector}`).join(', ');

function RevealItem({ children, className, direction = 'left', as: Element = 'span', ...props }) {
  return (
    <Element
      {...props}
      className={cn(styles.revealItem, className)}
      data-reveal-item=""
      data-reveal-direction={direction}
    >
      <span className={styles.scaleItem} data-reveal-scale="">
        {children}
      </span>
    </Element>
  );
}

RevealItem.propTypes = {
  as: PropTypes.oneOf(['span', 'button']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  direction: PropTypes.oneOf(['left', 'right'])
};

function HowIllDeliver({ className, onAnnotationClick }) {
  const sectionRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);
  const annotationRefs = useRef({});
  const backdropRef = useRef(null);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [sheetAccentColor, setSheetAccentColor] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  // Set by a sheet's "Start a project" button: once the sheet is gone, the
  // contact section takes over (it scrolls into view with the answer picked).
  const pendingContactRef = useRef(null);
  const closeTimerRef = useRef(null);
  const isSheetOpen = activeAnnotation !== null;

  // Takes the sheet off the page for good, once its exit has finished.
  const finishClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closingRef.current = false;
    setIsClosing(false);
    setActiveAnnotation(null);
  }, []);

  // Every way of closing (Esc, the Close button, a click on the backdrop) comes
  // through here. With motion available the sheet slides back out first.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;

    if (!canAnimateSheet()) {
      setActiveAnnotation(null);
      return;
    }

    closingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(finishClose, SHEET_CLOSE_FALLBACK_MS);
  }, [finishClose]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const startContactFromSheet = useCallback((reason) => {
    pendingContactRef.current = reason;
    requestClose();
  }, [requestClose]);

  // Runs after the sheet has left and focus has gone back to its label, so the
  // contact section's scroll and focus win.
  useEffect(() => {
    if (isSheetOpen || !pendingContactRef.current) return;
    const reason = pendingContactRef.current;
    pendingContactRef.current = null;
    startContact(reason);
  }, [isSheetOpen]);

  useEffect(() => {
    if (!isSheetOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The sheet starts off screen, so don't let focusing it scroll anything.
    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        requestClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(document.querySelectorAll(FOCUSABLE));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isSheetOpen, requestClose]);

  const accentOf = (element) => (
    window.getComputedStyle(element).getPropertyValue('--annotation-border-color').trim()
  );

  const openSheet = (id, event) => {
    triggerRef.current = event.currentTarget;
    setSheetAccentColor(accentOf(event.currentTarget));
    setActiveAnnotation(id);
    onAnnotationClick?.(id);
  };

  // Moves an open sheet over to another one (e.g. "Read my resume" on the open
  // to work sheet). The new sheet takes its own colour, starts at the top, and
  // closing it returns focus to its own label.
  const switchSheet = useCallback((id) => {
    const trigger = annotationRefs.current[id];
    if (trigger) {
      triggerRef.current = trigger;
      setSheetAccentColor(accentOf(trigger));
    }
    setActiveAnnotation(id);
    if (backdropRef.current) backdropRef.current.scrollTop = 0;
    closeButtonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const targets = Array.from(section.querySelectorAll('[data-reveal-item]'));
    const animations = [];
    const canAnimate = typeof Element.prototype.animate === 'function';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showImmediately = (target) => {
      target.style.opacity = '1';
      target.style.transform = 'none';
      const scale = target.querySelector('[data-reveal-scale]');
      if (scale) scale.style.transform = 'none';
    };

    if (prefersReducedMotion || !canAnimate || !('IntersectionObserver' in window)) {
      targets.forEach(showImmediately);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;
          observer.unobserve(target);

          const direction = target.dataset.revealDirection === 'right' ? 1 : -1;
          const offset = window.innerWidth < REVEAL.compactBreakpoint
            ? REVEAL.compactOffset
            : REVEAL.desktopOffset;
          const scale = target.querySelector('[data-reveal-scale]');

          const slide = target.animate(
            [
              { transform: `translateX(${direction * offset}px)` },
              { transform: 'translateX(0px)' }
            ],
            {
              duration: REVEAL.duration,
              delay: REVEAL.delay,
              easing: 'cubic-bezier(0, 0.56, 0.25, 1)',
              fill: 'both'
            }
          );

          target.style.opacity = '1';
          animations.push(slide);

          // An annotation says hello once it has landed: one ring, in its
          // colour, staggered across the three. (CSS skips it for reduced motion.)
          const annotation = target.closest('[data-annotation]');
          if (annotation && slide.finished) {
            slide.finished
              .then(() => { annotation.dataset.hello = ''; })
              .catch(() => {});
          }

          if (scale) {
            animations.push(scale.animate(
              [{ transform: 'scale(0.15)' }, { transform: 'scale(1)' }],
              {
                duration: REVEAL.scaleDuration,
                delay: REVEAL.delay,
                easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                fill: 'both'
              }
            ));
          }
        });
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${REVEAL.triggerOffset}px 0px`
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  const sheet = activeAnnotation ? SHEET_CONTENT[activeAnnotation] : null;

  return (
    <>
      <section
        ref={sectionRef}
        className={cn(styles.section, className)}
        aria-label="How I'll deliver for you"
      >
        {Array.from({ length: GRID.columns * GRID.rows }, (_, index) => (
          <div className={styles.cell} aria-hidden="true" key={index} />
        ))}

        <div className={styles.content}>
          <h2 className={styles.headline}>
            {HEADLINE_ITEMS.map(({ id, text, className: itemClass, direction }) => (
              <RevealItem key={id} className={itemClass} direction={direction}>
                {text}
              </RevealItem>
            ))}
          </h2>

          <RevealItem className={styles.prompt}>
            <span aria-hidden="true" className={styles.promptMark}>*</span>
            {SECTION_PROMPT}
          </RevealItem>

          {ANNOTATIONS.map(({ id, label, className: areaClass }, index) => (
            <button
              type="button"
              key={id}
              ref={(element) => { annotationRefs.current[id] = element; }}
              className={cn(styles.annotation, areaClass)}
              data-annotation=""
              style={{ '--hello-delay': `${index * HELLO_STAGGER_MS}ms` }}
              aria-haspopup="dialog"
              aria-expanded={activeAnnotation === id}
              aria-controls={activeAnnotation === id ? 'delivery-sheet' : undefined}
              onClick={(event) => openSheet(id, event)}
            >
              <RevealItem>
                {label}
                <svg
                  className={styles.annotationArrow}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </RevealItem>
            </button>
          ))}
        </div>
      </section>

      {sheet && createPortal(
        <div
          ref={backdropRef}
          className={cn(styles.sheetBackdrop, isClosing && styles.sheetBackdropClosing)}
          onMouseDown={(event) => {
            // The backdrop is also the scroller: a press on its scrollbar
            // shouldn't close the sheet.
            const backdrop = event.currentTarget;
            const scrollbarWidth = backdrop.offsetWidth - backdrop.clientWidth;
            const onScrollbar = scrollbarWidth > 0 && event.clientX >= backdrop.clientWidth;
            if (event.target === event.currentTarget && !onScrollbar) requestClose();
          }}
        >
          <aside
            id="delivery-sheet"
            className={cn(styles.sheet, sheet.className, isClosing && styles.sheetClosing)}
            style={{ '--sheet-accent-color': sheetAccentColor }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-sheet-title"
            aria-describedby={sheet.description ? 'delivery-sheet-description' : undefined}
            data-sheet-dialog=""
            onAnimationEnd={(event) => {
              // The two exit animations end together; the first to report is enough.
              if (isClosing && event.target === event.currentTarget) finishClose();
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.sheetClose}
              aria-label="Close sheet"
              onClick={requestClose}
            >
              Close
            </button>
            {!sheet.ownsTitle && (
              <>
                <h2 id="delivery-sheet-title" className={styles.sheetTitle}>{sheet.title}</h2>
                {sheet.description && (
                  <p id="delivery-sheet-description" className={styles.sheetDescription}>
                    {sheet.description}
                  </p>
                )}
              </>
            )}
            <div className={styles.sheetBody}>
              <sheet.Body
                key={activeAnnotation}
                onShowResume={() => switchSheet('hiring-manager')}
                onStartContact={startContactFromSheet}
              />
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

HowIllDeliver.propTypes = {
  className: PropTypes.string,
  onAnnotationClick: PropTypes.func
};

export default HowIllDeliver;
