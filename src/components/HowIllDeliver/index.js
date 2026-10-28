import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SHEETS from './sheets';
import useSheetLayout from './sheets/useSheetLayout';
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

const ANNOTATIONS = [
  { id: 'open-to-work', label: '(open to work)', className: styles.openToWork },
  { id: 'freelance', label: '(freelance/contract)', className: styles.freelance },
  { id: 'hiring-manager', label: '(hiring manager)', className: styles.hiringManager }
];

// Titles and descriptions for every sheet. Only "open to work" still uses the original single sheet, which is
// why it is the only entry with paragraphs.
const SHEET_CONTENT = {
  'open-to-work': {
    title: 'Open to work',
    description: 'I’m looking for my next opportunity.',
    paragraphs: [
      'I’m open to joining a team where thoughtful design and hands-on development come together to make useful, memorable digital experiences.',
      'If you’re building something that could use a designer who can also bring ideas to life in code, I’d love to hear about it.'
    ]
  },
  freelance: {
    title: 'Freelance / contract',
    description: 'Have a project that needs a designer and a developer?',
    detail: 'Independent, collaborative and open to your ideas.'
  },
  'hiring-manager': {
    title: 'Hiring managers',
    description: 'Looking for a designer-developer?'
  }
};

// Everything the Tab key may land on inside the open sheet, in page order.
const FOCUSABLE = [
  'button',
  '[href]',
  'input:not([type="hidden"])',
  'textarea',
  'select',
  '[tabindex]'
].map((selector) => `[data-sheet-dialog] ${selector}`).join(',');

function getFocusableElements() {
  return Array.from(document.querySelectorAll(FOCUSABLE)).filter((element) => {
    if (element.disabled || element.getAttribute('tabindex') === '-1') return false;
    // Only the checked radio in a group is a tab stop.
    if (element.type === 'radio' && !element.checked && element.name) {
      const group = document.getElementsByName(element.name);
      return !Array.from(group).some((radio) => radio.checked);
    }
    return true;
  });
}

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
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [sheetAccentColor, setSheetAccentColor] = useState(null);
  const layout = useSheetLayout();
  const isSheetOpen = activeAnnotation !== null;

  useEffect(() => {
    if (!isSheetOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveAnnotation(null);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
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
  }, [isSheetOpen]);

  const openSheet = (id, event) => {
    triggerRef.current = event.currentTarget;
    setSheetAccentColor(
      window.getComputedStyle(event.currentTarget).getPropertyValue('--annotation-border-color').trim()
    );
    setActiveAnnotation(id);
    onAnnotationClick?.(id);
  };

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
  const twoColumnSheet = activeAnnotation ? SHEETS[activeAnnotation] : null;
  const closeSheet = () => setActiveAnnotation(null);

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

          {ANNOTATIONS.map(({ id, label, className: areaClass }) => (
            <button
              type="button"
              key={id}
              className={cn(styles.annotation, areaClass)}
              aria-haspopup="dialog"
              aria-expanded={activeAnnotation === id}
              aria-controls={activeAnnotation === id ? 'delivery-sheet' : undefined}
              onClick={(event) => openSheet(id, event)}
            >
              <RevealItem>{label}</RevealItem>
            </button>
          ))}
        </div>
      </section>

      {sheet && createPortal(
        <div
          className={cn(styles.sheetBackdrop, twoColumnSheet && styles.sheetBackdropLight)}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSheet();
          }}
        >
          {twoColumnSheet ? (
            <twoColumnSheet.Component
              layout={layout}
              glow={twoColumnSheet.glow}
              glowAt={twoColumnSheet.glowAt}
              title={sheet.title}
              description={(
                <>
                  <p>{sheet.description}</p>
                  {sheet.detail && <p>{sheet.detail}</p>}
                </>
              )}
              closeButtonRef={closeButtonRef}
              onClose={closeSheet}
            />
          ) : (
            <aside
              id="delivery-sheet"
              className={styles.sheet}
              style={{ '--sheet-accent-color': sheetAccentColor }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delivery-sheet-title"
              aria-describedby="delivery-sheet-description"
              data-sheet-dialog=""
            >
              <header className={styles.sheetHeader}>
                <div>
                  <h2 id="delivery-sheet-title" className={styles.sheetTitle}>{sheet.title}</h2>
                  <p id="delivery-sheet-description" className={styles.sheetDescription}>
                    {sheet.description}
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.sheetClose}
                  aria-label="Close sheet"
                  onClick={closeSheet}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </header>
              <div className={styles.sheetBody}>
                {sheet.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </aside>
          )}
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
