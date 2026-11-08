import React, { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './pricingStops.module.scss';

// Pricing by what you need (one page, then small business, growing company,
// startup and agency, contract), after an estimator Motheo liked: drag the
// knob, click a label, or use the arrow keys. The work he takes on for that kind of client
// ticks on (the rest stays greyed, so you can see what the next one adds).
//
// The control is the browser's own slider, made invisible over the track, so
// dragging, keyboard and screen readers all work without extra code.

const COUNT_MS = 420;
// A number shows as dollars; a word ("Quoted") shows as it is, in the same
// big type, so it reads as one of the series.
const money = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-CA')}` : n);

// Counts from the number on screen to the new one (straight there with
// reduced motion). Rounds to tens on the way, like a meter.
function useCountTo(target) {
  const [shown, setShown] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const numbers = typeof from === 'number' && typeof target === 'number';
    if (from === target || !numbers || still || !window.requestAnimationFrame) {
      current.current = target;
      setShown(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      current.current = from + (target - from) * (1 - (1 - t) ** 3);
      setShown(t < 1 ? Math.round(current.current / 10) * 10 : target);
      if (t < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}

function PricingStops({ stops, includes, includesLabel, note }) {
  const [stop, setStop] = useState(0);
  const { lead, price, per, blurb } = stops[stop];
  const shown = useCountTo(price);
  const last = stops.length - 1;
  const labelId = useId();

  return (
    <div className={styles.pricing}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span>{lead}</span>
        </div>
        <div className={styles.price}>
          {money(shown)}
          {per && <span className={styles.per}>{per}</span>}
        </div>
        {blurb && <div className={styles.blurb}>{blurb}</div>}
      </div>

      {/* What this kind of client doesn't get is greyed, and hidden from screen
          readers, so the list reads as what you get. (Divs, not paragraphs:
          the sheet styles its paragraphs.) */}
      <div className={styles.includesLabel} id={labelId}>
        {includesLabel}
      </div>
      <ul className={styles.includes} aria-labelledby={labelId}>
        {includes.map(({ text, from }) => (
          <li key={text} className={cn(styles.include, { [styles.on]: from <= stop })} aria-hidden={from > stop}>
            <span className={styles.check} />
            {text}
          </li>
        ))}
      </ul>

      <div className={styles.track} style={{ '--at': stop / last }}>
        {stops.map((s, i) => (
          <span key={s.label} className={styles.dot} style={{ '--p': i / last }} aria-hidden="true" />
        ))}
        <span className={styles.fill} aria-hidden="true">
          <span className={styles.knob}>
            <svg viewBox="0 0 24 24">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </span>
        </span>
        <input
          type="range"
          className={styles.range}
          min={0}
          max={last}
          step={1}
          value={stop}
          onChange={(event) => setStop(Number(event.target.value))}
          aria-label="What you need"
          aria-valuetext={`${lead}${typeof price === 'number' ? ` ${money(price)}` : `: ${price.toLowerCase()}`}${
            per ? ` ${per.replace(/^\//, 'a ')}` : ''
          }`}
        />
      </div>

      {/* Click a label to jump to it (the slider above covers the keyboard).
          Each label sits under its dot. */}
      <div className={styles.labels} aria-hidden="true">
        {stops.map((s, i) => (
          <button
            type="button"
            tabIndex={-1}
            key={s.label}
            className={cn({ [styles.current]: i === stop })}
            style={{ '--p': i / last }}
            onClick={() => setStop(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
}

PricingStops.propTypes = {
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      lead: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      per: PropTypes.string, // small, after the price: '/month', 'per project'
      blurb: PropTypes.string
    })
  ).isRequired,
  includes: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      from: PropTypes.number.isRequired
    })
  ).isRequired,
  includesLabel: PropTypes.string.isRequired,
  note: PropTypes.string
};

export default PricingStops;
