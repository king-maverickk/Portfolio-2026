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
  color
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pointer = { x: -9999, y: -9999 };
    let dots = [];
    let width = 0;
    let height = 0;
    let rafId = null;
    let resizeTimeout = null;

    function tick() {
      ctx.clearRect(0, 0, width, height);
      let moving = false;

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

        const alpha = baseAlpha + d.glow * (hoverAlpha - baseAlpha);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, (dotSize / 2) * d.scale, 0, Math.PI * 2);
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
    window.addEventListener('blur', onPointerLeave);
    window.addEventListener('resize', onResize);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('resize', onResize);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [dotSize, spacing, radius, push, grow, ease, baseAlpha, hoverAlpha, color]);

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
  color: PropTypes.string     // "r, g, b"
};

DotGrid.defaultProps = {
  className: undefined,
  dotSize: 5,
  spacing: 45,
  radius: 140,
  push: 18,
  grow: 1.8,
  ease: 0.12,
  baseAlpha: 0.08,
  hoverAlpha: 0.35,
  color: '0, 0, 0'
};

export default DotGrid;