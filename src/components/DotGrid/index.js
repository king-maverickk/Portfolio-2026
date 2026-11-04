import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

function DotGrid({
  className,
  dotSize,
  spacing,
  radius,
  push,
  grow,
  ease,
  baseAlpha,
  hoverAlpha,
  color,
  pulse,
  pulseSpeed,
  pulseWidth,
  pulsePush,
  pulseGrow,
  pulseGlow
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pointer = { x: -9999, y: -9999 };
    // Click pulses: rings that travel out from a click and fade as they go.
    let pulses = [];
    const MAX_PULSES = 4;
    let dots = [];
    let width = 0;
    let height = 0;
    let rafId = null;
    let resizeTimeout = null;

    function tick() {
      ctx.clearRect(0, 0, width, height);
      let moving = false;

      // Where each pulse's ring is now; drop the ones that have faded out.
      const now = performance.now();
      const rings = [];
      pulses = pulses.filter((p) => {
        const front = ((now - p.start) / 1000) * pulseSpeed;
        if (front > p.reach) return false;
        const fade = 1 - front / p.reach;
        rings.push({ x: p.x, y: p.y, front, strength: fade * fade });
        return true;
      });
      if (rings.length) moving = true;

      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - dist / radius);
        const influence = t * t;

        const targetOx = dist > 0 ? (dx / dist) * influence * push : 0;
        const targetOy = dist > 0 ? (dy / dist) * influence * push : 0;
        const targetScale = 1 + influence * (grow - 1);

        d.ox += (targetOx - d.ox) * ease;
        d.oy += (targetOy - d.oy) * ease;
        d.scale += (targetScale - d.scale) * ease;
        d.glow += (influence - d.glow) * ease;

        if (
          Math.abs(targetOx - d.ox) > 0.01 ||
          Math.abs(targetOy - d.oy) > 0.01 ||
          Math.abs(targetScale - d.scale) > 0.001
        ) {
          moving = true;
        }

        // The pulse rings. Applied straight to this frame (not eased) so the
        // wave stays crisp; once it has passed, the dot is simply back home.
        let waveX = 0;
        let waveY = 0;
        let waveScale = 0;
        let waveGlow = 0;
        for (const ring of rings) {
          const rx = d.x - ring.x;
          const ry = d.y - ring.y;
          const rDist = Math.hypot(rx, ry) || 1;
          const offset = (rDist - ring.front) / pulseWidth;
          if (offset > -3 && offset < 3) {
            const amount = Math.exp(-offset * offset) * ring.strength;
            waveX += (rx / rDist) * amount * pulsePush;
            waveY += (ry / rDist) * amount * pulsePush;
            waveScale += amount * (pulseGrow - 1);
            waveGlow += amount * pulseGlow;
          }
        }

        const glow = Math.min(1, d.glow + waveGlow);
        const alpha = baseAlpha + glow * (hoverAlpha - baseAlpha);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(
          d.x + d.ox + waveX,
          d.y + d.oy + waveY,
          (dotSize / 2) * (d.scale + waveScale),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Sleep once everything has settled
      rafId = moving ? requestAnimationFrame(tick) : null;
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function build() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          dots.push({
            x: col * spacing + spacing / 2,
            y: row * spacing + spacing / 2,
            ox: 0,
            oy: 0,
            scale: 1,
            glow: 0
          });
        }
      }
      start();
    }

    function onPointerMove(e) {
      if (reduceMotion) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      start();
    }

    // A click (or tap) sends a pulse out from that spot. `click` rather than
    // `pointerdown`, so starting a scroll on a phone doesn't set one off;
    // keyboard "clicks" (detail 0) have no position, so they're skipped.
    function onClick(e) {
      if (!pulse || reduceMotion || e.detail === 0) return;
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        start: performance.now(),
        // Far enough to cross the screen from wherever the click was.
        reach: Math.max(
          Math.hypot(Math.max(e.clientX, width - e.clientX), Math.max(e.clientY, height - e.clientY)),
          400
        ) + pulseWidth * 2
      });
      if (pulses.length > MAX_PULSES) pulses.shift();
      start();
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
      start();
    }

    function onResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(build, 100);
    }

    build();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('blur', onPointerLeave);
    window.addEventListener('resize', onResize);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [
    dotSize, spacing, radius, push, grow, ease, baseAlpha, hoverAlpha, color,
    pulse, pulseSpeed, pulseWidth, pulsePush, pulseGrow, pulseGlow
  ]);

  return <canvas ref={canvasRef} className={cn(styles.root, className)} aria-hidden="true" />;
}

DotGrid.propTypes = {
  className: PropTypes.string,
  dotSize: PropTypes.number,
  spacing: PropTypes.number,
  radius: PropTypes.number,   // cursor influence distance (px)
  push: PropTypes.number,     // max displacement from cursor (px)
  grow: PropTypes.number,     // max scale at the cursor
  ease: PropTypes.number,     // 0-1, higher = snappier
  baseAlpha: PropTypes.number,
  hoverAlpha: PropTypes.number,
  color: PropTypes.string,    // "r, g, b"
  pulse: PropTypes.bool,      // a wave from every click
  pulseSpeed: PropTypes.number, // how fast the ring travels (px per second)
  pulseWidth: PropTypes.number, // how thick the ring is (px)
  pulsePush: PropTypes.number,  // how far it pushes dots outward (px)
  pulseGrow: PropTypes.number,  // how much it swells dots (1 = not at all)
  pulseGlow: PropTypes.number   // how much it lights dots up (0-1)
};

DotGrid.defaultProps = {
  className: undefined,
  dotSize: 5,
  spacing: 25,
  radius: 140,
  push: 18,
  grow: 1.8,
  ease: 0.12,
  baseAlpha: 0.08,
  hoverAlpha: 0.65,
  color: '0, 0, 0',
  pulse: true,
  pulseSpeed: 900,
  pulseWidth: 55,
  pulsePush: 10,
  pulseGrow: 1.7,
  pulseGlow: 0.85
};

export default DotGrid;