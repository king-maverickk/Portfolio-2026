import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

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

  return (
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
            onClick={() => onAnnotationClick?.(id)}
          >
            <RevealItem>{label}</RevealItem>
          </button>
        ))}
      </div>
    </section>
  );
}

HowIllDeliver.propTypes = {
  className: PropTypes.string,
  onAnnotationClick: PropTypes.func
};

export default HowIllDeliver;
