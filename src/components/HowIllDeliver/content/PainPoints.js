import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { DraftTag } from './Blocks';
import PainPointIcon from './painPointIcons';
import styles from './index.module.scss';

// "Pain points": a hand of bright cards. Flick, drag or tap the top card and
// it spins off, drops behind the pile and springs into place at the back,
// while the next card comes forward. The deck also deals itself every few
// seconds. (Built from the "Card shuffle" prototype.)

// How long a card stays on top before the deck deals the next one.
const AUTOPLAY_MS = 5000;
// The thrown card's flight out, then its spring into the back of the pile.
// Keep in step with the transitions on .shuffleCard in index.module.scss.
const FLY_OUT_MS = 320;
const SETTLE_MS = 640;
// A drag this far (px), or this fast (px per ms), throws the card.
const THROW_DISTANCE = 90;
const THROW_SPEED = 0.6;
// Less movement than this (px) is a tap.
const TAP_SLOP = 6;
// A tap or the timer throws the card up and to the right.
const DEFAULT_THROW = { x: 1, y: -0.35 };

// Card colours, in order, repeating if there are more cards. `ink` is the
// text colour that reads on that background.
const LOOKS = [
  { bg: '#22c55e', ink: '#0f2e1a' }, // freelance green
  { bg: '#2864e8', ink: '#ffffff' }, // blue
  { bg: '#ff4b3e', ink: '#ffffff' }, // red
  { bg: '#ffc83d', ink: '#2b2b2b' }, // warm yellow
  { bg: '#2b2b2b', ink: '#f3f4f1' }, // ink
  { bg: '#ff8a3d', ink: '#2b2b2b' }, // orange
  { bg: '#b9a7ff', ink: '#221a44' } // lilac
];

// Where the cards sit in the pile, top first: a slightly messy hand. Cards
// further down share the last spot.
const SPOTS = [
  { x: 0, y: 0, r: 0, s: 1 },
  { x: 12, y: 10, r: 4, s: 0.97 },
  { x: -14, y: 14, r: -5, s: 0.95 },
  { x: 16, y: 20, r: 7, s: 0.93 },
  { x: -8, y: 24, r: -3, s: 0.91 }
];

const spotFor = (depth) => SPOTS[Math.min(depth, SPOTS.length - 1)];
const toTransform = ({ x, y, r, s = 1 }) => `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window.matchMedia !== 'function') return false;
    return Boolean(window.matchMedia(REDUCED_MOTION)?.matches);
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(REDUCED_MOTION);
    if (!query || typeof query.addEventListener !== 'function') return undefined;
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

const nextFrame = (callback) => {
  const raf = window.requestAnimationFrame || ((fn) => window.setTimeout(fn, 16));
  raf(() => raf(callback));
};

// `showTitle={false}` leaves out the big heading, for when the deck sits inside
// something that already shows it (the Freelance sheet's Pain points section).
function PainPoints({ title, items, draft, showTitle = true }) {
  const count = items.length;
  const reducedMotion = usePrefersReducedMotion();
  const autoplay = !reducedMotion && count > 1;

  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const pointerRef = useRef(null);
  const timersRef = useRef([]);

  // Card indexes, top of the pile first.
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  // A card in flight: { card, phase, x, y, r }.
  //   'out'    flying off the pile (above everything)
  //   'settle' springing into the back of the pile
  //   'start'  coming back from the left ("previous"), placed with no transition
  //   'in'     springing back onto the top
  const [flight, setFlight] = useState(null);
  const [drag, setDrag] = useState(null); // { x, y } while the top card is dragged
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  // Read out by screen readers after the visitor changes card themselves.
  const [announcement, setAnnouncement] = useState('');

  const busy = flight !== null;
  const running = autoplay && !busy && !hovered && !keyboardFocus && !drag && inView && pageVisible;

  const later = useCallback((fn, ms) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timersRef.current.forEach((id) => window.clearTimeout(id)), []);

  const announce = (nextOrder, manual) => {
    if (manual) setAnnouncement(items[nextOrder[0]].text);
  };

  // Throw the top card in direction (dx, dy) and send it to the back.
  const throwTop = useCallback((direction = DEFAULT_THROW, { manual = false } = {}) => {
    if (busy || count < 2) return;
    const card = order[0];
    const nextOrder = [...order.slice(1), card];
    setDrag(null);
    setOrder(nextOrder);
    announce(nextOrder, manual);
    if (reducedMotion) return;

    const width = deckRef.current?.offsetWidth || 400;
    const length = Math.hypot(direction.x, direction.y) || 1;
    const ux = direction.x / length;
    const uy = direction.y / length;
    setFlight({
      card,
      phase: 'out',
      x: ux * width * 1.05,
      y: uy * width * 0.7,
      r: (ux >= 0 ? 1 : -1) * 34
    });
    later(() => setFlight((f) => f && { ...f, phase: 'settle' }), FLY_OUT_MS);
    later(() => setFlight(null), FLY_OUT_MS + SETTLE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, count, order, reducedMotion, later]);

  // Bring the bottom card back onto the top, in from the left.
  const bringBack = useCallback(({ manual = false } = {}) => {
    if (busy || count < 2) return;
    const card = order[order.length - 1];
    const nextOrder = [card, ...order.slice(0, -1)];
    setOrder(nextOrder);
    announce(nextOrder, manual);
    if (reducedMotion) return;

    const width = deckRef.current?.offsetWidth || 400;
    setFlight({ card, phase: 'start', x: -width * 1.05, y: -width * 0.2, r: -34 });
    nextFrame(() => setFlight((f) => f && { ...f, phase: 'in' }));
    later(() => setFlight(null), SETTLE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, count, order, reducedMotion, later]);

  // Deal on a timer. Any change of card restarts the wait.
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => throwTop(), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [running, order, throwTop]);

  // Pause while the deck is off screen or the tab is in the background.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window.IntersectionObserver !== 'function') return undefined;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // --- Tap, drag and flick on the top card ------------------------------------

  const onPointerDown = (event) => {
    if (busy) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
      moved: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.moved && Math.hypot(dx, dy) < TAP_SLOP) return;
    pointer.moved = true;
    setDrag({ x: dx, y: dy });
  };

  const onPointerUp = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    pointerRef.current = null;

    if (!pointer.moved) {
      throwTop(DEFAULT_THROW, { manual: true });
      return;
    }

    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    const distance = Math.hypot(dx, dy);
    const speed = distance / Math.max(1, Date.now() - pointer.time);
    if (distance > THROW_DISTANCE || speed > THROW_SPEED) {
      throwTop({ x: dx, y: dy }, { manual: true });
    } else {
      setDrag(null); // springs back
    }
  };

  const onPointerCancel = () => {
    pointerRef.current = null;
    setDrag(null);
  };

  // --- Keyboard and focus -----------------------------------------------------

  const onKeyDown = (event) => {
    if (['ArrowRight', 'ArrowDown', ' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      throwTop(DEFAULT_THROW, { manual: true });
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      bringBack({ manual: true });
    }
  };

  // Only keyboard focus pauses the deck.
  const onFocus = (event) => {
    let visible = true;
    try {
      visible = event.target.matches(':focus-visible');
    } catch (error) {
      // Older browsers: treat any focus as keyboard focus.
    }
    setKeyboardFocus(visible);
  };

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
  };

  const headingId = 'pain-points-title';

  return (
    <section
      ref={sectionRef}
      className={cn(styles.section, styles.painPoints, !showTitle && styles.painPointsBare)}
      aria-roledescription="carousel"
      {...(showTitle ? { 'aria-labelledby': headingId } : { 'aria-label': title })}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {showTitle && (
        <h3 id={headingId} className={styles.deckTitle}>
          {title}
          {draft && <DraftTag />}
        </h3>
      )}

      <div className={styles.shuffle}>
        <div
          ref={deckRef}
          className={styles.shuffleDeck}
          tabIndex={0}
          aria-label={`${title}, use the arrow keys to change card`}
          onKeyDown={onKeyDown}
          onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={(event) => event.pointerType === 'mouse' && setHovered(false)}
        >
          {items.map((item, card) => {
            const depth = order.indexOf(card);
            const isTop = depth === 0;
            const inFlight = flight?.card === card ? flight.phase : null;
            const isDragging = isTop && drag !== null && !inFlight;
            const look = LOOKS[card % LOOKS.length];

            let transform = toTransform(spotFor(depth));
            let zIndex = count - depth;
            if (inFlight === 'out' || inFlight === 'start') {
              transform = toTransform(flight);
              zIndex = count + 1;
            } else if (inFlight === 'in') {
              zIndex = count + 1;
            } else if (isDragging) {
              transform = `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.07}deg)`;
            }

            return (
              <div
                key={item.text}
                className={cn(styles.shuffleCard, {
                  [styles.shuffleCardIsTop]: isTop,
                  [styles.shuffleCardDragging]: isDragging,
                  [styles.shuffleCardOut]: inFlight === 'out',
                  [styles.shuffleCardInstant]: inFlight === 'start'
                })}
                style={{
                  '--card-bg': look.bg,
                  '--card-ink': look.ink,
                  transform,
                  zIndex
                }}
                {...(isTop
                  ? {
                    role: 'group',
                    'aria-roledescription': 'slide',
                    'aria-label': `${card + 1} of ${count}`,
                    onPointerDown,
                    onPointerMove,
                    onPointerUp,
                    onPointerCancel
                  }
                  : { 'aria-hidden': true })}
              >
                <div className={styles.shuffleCardHead} aria-hidden="true">
                  <span className={styles.shuffleIcon}>
                    <PainPointIcon name={item.icon} />
                  </span>
                  <span className={styles.shuffleCount}>
                    {card + 1} / {count}
                  </span>
                </div>
                <div className={styles.shuffleText}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </section>
  );
}

PainPoints.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.string
    })
  ).isRequired,
  draft: PropTypes.bool,
  showTitle: PropTypes.bool
};

export default PainPoints;
