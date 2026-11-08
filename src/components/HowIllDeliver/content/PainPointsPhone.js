import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import PainPointIcon from './painPointIcons';
import styles from './index.module.scss';
import ph from './painPointsPhone.module.scss';

// "Pain points" as a phone lock screen. The pain points arrive one by
// one as notifications (the phone buzzes each time); two show at once and the
// rest tuck into a stack. Drag one sideways, or press Delete / an arrow key on
// it, to dismiss it. From the "Notifications" prototype.

const FIRST_MS = 600; // the first notification, once the phone is in view
const EVERY_MS = 2400; // then one every 2.4 s
const VISIBLE = 2; // notifications shown in full; the rest stack underneath
const FLY_MS = 260; // a dismissed notification flies off...
const COLLAPSE_MS = 500; // ...then its space closes
const SWIPE_DISTANCE = 90;
const SWIPE_SPEED = 0.5;
const TAP_SLOP = 6;

const BUZZ = [
  { transform: 'translateX(0) rotate(0)' },
  { transform: 'translateX(-3px) rotate(-0.6deg)', offset: 0.15 },
  { transform: 'translateX(3px) rotate(0.6deg)', offset: 0.3 },
  { transform: 'translateX(-2px) rotate(-0.4deg)', offset: 0.45 },
  { transform: 'translateX(2px) rotate(0.4deg)', offset: 0.6 },
  { transform: 'translateX(-1px)', offset: 0.75 },
  { transform: 'translateX(0) rotate(0)' }
];

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

function today() {
  try {
    return new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
  } catch (error) {
    return '';
  }
}

function Notification({ item, leaving, hidden, onDismiss }) {
  const { app, icon, title } = item.notification;
  const pointerRef = useRef(null);
  const [dragX, setDragX] = useState(null);

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, time: Date.now(), moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (!pointer.moved && Math.abs(dx) < TAP_SLOP) return;
    pointer.moved = true;
    setDragX(dx);
  };

  const onPointerUp = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    pointerRef.current = null;
    const dx = event.clientX - pointer.x;
    const speed = Math.abs(dx) / Math.max(1, Date.now() - pointer.time);
    setDragX(null);
    if (pointer.moved && (Math.abs(dx) > SWIPE_DISTANCE || speed > SWIPE_SPEED)) {
      onDismiss(dx > 0 ? 1 : -1);
    }
  };

  const onPointerCancel = () => {
    pointerRef.current = null;
    setDragX(null);
  };

  const onKeyDown = (event) => {
    if (['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      onDismiss(event.key === 'ArrowRight' ? 1 : -1);
    }
  };

  let style;
  if (leaving) {
    style = { translate: `${leaving * 130}% 0`, opacity: 0 };
  } else if (dragX !== null) {
    style = { translate: `${dragX}px 0`, opacity: Math.max(0.35, 1 - Math.abs(dragX) / 320) };
  }

  return (
    <article
      className={cn(ph.notif, dragX !== null && ph.notifDragging)}
      style={style}
      tabIndex={hidden ? -1 : 0}
      aria-label={`${app}: ${title}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
    >
      <span className={ph.appIcon} aria-hidden="true">
        <PainPointIcon name={icon} />
      </span>
      <span className={ph.notifBody}>
        <span className={ph.notifTop} aria-hidden="true">
          <span className={ph.appName}>{app}</span>
          <span>now</span>
        </span>
        <span className={ph.notifTitle}>{title}</span>
        <span className={ph.notifText}>{item.text}</span>
      </span>
    </article>
  );
}

Notification.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      app: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  leaving: PropTypes.number,
  hidden: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired
};

function PainPointsPhone({ items }) {
  const count = items.length;
  const reducedMotion = usePrefersReducedMotion();
  const phoneRef = useRef(null);
  const timersRef = useRef([]);

  const [run, setRun] = useState(0);
  const [sent, setSent] = useState(0);
  const [arrived, setArrived] = useState([]); // { id, index }, newest first
  const [shown, setShown] = useState(() => new Set());
  const [leaving, setLeaving] = useState({}); // id -> direction
  const [dismissed, setDismissed] = useState(() => new Set());
  const [inView, setInView] = useState(false);
  const [date] = useState(today);

  const later = (fn, ms) => timersRef.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timersRef.current.forEach((id) => window.clearTimeout(id)), []);

  // Only send notifications while the phone is on screen (and its container open).
  useEffect(() => {
    const node = phoneRef.current;
    if (!node || typeof window.IntersectionObserver !== 'function') {
      setInView(true);
      return undefined;
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const arrive = useCallback((index) => {
    const id = `${run}-${index}`;
    setArrived((list) => [{ id, index }, ...list]);
    nextFrame(() => setShown((set) => new Set(set).add(id)));
    if (!reducedMotion) phoneRef.current?.animate?.(BUZZ, { duration: 360, easing: 'linear' });
  }, [run, reducedMotion]);

  useEffect(() => {
    if (!inView || sent >= count) return undefined;
    if (reducedMotion) {
      // Everything at once, no buzzing.
      const all = items.map((_, index) => ({ id: `${run}-${index}`, index })).reverse();
      setArrived(all);
      setShown(new Set(all.map(({ id }) => id)));
      setSent(count);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      arrive(sent);
      setSent(sent + 1);
    }, sent === 0 ? FIRST_MS : EVERY_MS);
    return () => window.clearTimeout(timer);
  }, [inView, sent, count, arrive, reducedMotion, items, run]);

  const dismiss = (id, direction) => {
    if (leaving[id]) return;
    setLeaving((current) => ({ ...current, [id]: direction }));
    later(() => setDismissed((set) => new Set(set).add(id)), reducedMotion ? 0 : FLY_MS);
    later(() => setArrived((list) => list.filter((n) => n.id !== id)), reducedMotion ? 0 : FLY_MS + COLLAPSE_MS);
  };

  const replay = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setRun((r) => r + 1);
    setSent(0);
    setArrived([]);
    setShown(new Set());
    setLeaving({});
    setDismissed(new Set());
  };

  const live = arrived.filter(({ id }) => !dismissed.has(id));
  const rank = new Map(live.map(({ id }, k) => [id, k]));
  const stacked = Math.max(0, live.length - VISIBLE);
  const allGone = sent >= count && live.length === 0;

  return (
    <div className={ph.wrap}>
      <div className={ph.phone} ref={phoneRef}>
        <div className={ph.screen}>
          <div className={ph.island} />
          <div className={ph.status} aria-hidden="true">
            <span>9:41</span>
            <svg viewBox="0 0 46 12">
              <g fill="#fff">
                <rect x="0" y="8" width="3" height="4" rx="1" />
                <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                <rect x="10" y="3" width="3" height="9" rx="1" />
                <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
                <rect x="24" y="1" width="19" height="10" rx="3" fill="none" stroke="#fff" strokeOpacity=".5" />
                <rect x="26" y="3" width="13" height="6" rx="1.5" />
                <rect x="44" y="4" width="1.6" height="4" rx=".8" fillOpacity=".5" />
              </g>
            </svg>
          </div>
          <div className={ph.lock} aria-hidden="true">
            <div className={ph.date}>{date}</div>
            <div className={ph.time}>9:41</div>
          </div>

          <div className={ph.feed} aria-live="polite">
            {arrived.map(({ id, index }) => {
              const k = rank.get(id);
              const isIn = shown.has(id) && k !== undefined && k < VISIBLE;
              return (
                <div key={id} className={cn(ph.slot, isIn && ph.slotIn, !reducedMotion && ph.slotFresh)}>
                  <div className={ph.slotInner}>
                    <Notification
                      item={items[index]}
                      leaving={leaving[id]}
                      hidden={!isIn}
                      onDismiss={(direction) => dismiss(id, direction)}
                    />
                  </div>
                </div>
              );
            })}
            {stacked > 0 && (
              <div className={ph.more} aria-hidden="true">
                <span />
                <span />
                <b>{stacked} more</b>
              </div>
            )}
            {allGone && <div className={ph.empty}>No more notifications</div>}
          </div>
          <div className={ph.homeBar} />
        </div>
      </div>

      <div className={ph.controls}>
        <button type="button" className={styles.secondaryAction} onClick={replay}>
          Send them again
        </button>
        <span className={ph.hint}>Drag a notification sideways to dismiss it</span>
      </div>
    </div>
  );
}

PainPointsPhone.propTypes = {
  items: PropTypes.arrayOf(Notification.propTypes.item).isRequired
};

export default PainPointsPhone;
