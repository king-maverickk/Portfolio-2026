import React, { useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';

import HoverWords from 'components/HoverWords';
import InlineImg from 'components/InlineImg';
import { STAGE_ICONS } from 'components/ProjectStages/StageIcons';
import GalleryCard from 'components/GalleryCard';
import LandingSlideUpText from 'components/LandingSlideUpText';
import LiveEventsHover from 'components/LiveEventsHover';
import FloatingNav from 'components/FloatingNav';

import ScaledFrame from './ScaledFrame';

import styles from './demos.module.scss';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// --- Hover words ---------------------------------------------------------------

function HoverWordsDemo() {
  return (
    <div className={styles.center}>
      <p className={styles.bigText}>
        <HoverWords>Run your cursor along this line and watch it ripple.</HoverWords>
      </p>
      <span className={styles.hint}>Hover the words (mouse only)</span>
    </div>
  );
}

// --- Images in text --------------------------------------------------------------

function InlineImagesDemo() {
  return (
    <div className={styles.center}>
      <p className={cn(styles.bigText, styles.inlineText)}>
        I speak six{' '}
        <InlineImg ratio={1.2} src="/assets/Home/about_speech_bubble.png" after=",">languages</InlineImg>
        {' '}plus{' '}
        <InlineImg ratio={1} src="/assets/Home/about_design_wheel.png">design</InlineImg>
        {' '}and{' '}
        <InlineImg ratio={1.5} src="/assets/Home/about_code_chip.png" after=".">code</InlineImg>
      </p>
      <span className={styles.hint}>Hover a word with a picture</span>
    </div>
  );
}

// --- Stage pills -----------------------------------------------------------------

const STAGES = [
  { id: 'sketch', label: 'Sketch', text: 'Early ideas take shape through quick sketches.' },
  { id: 'screen', label: 'Screen', text: 'The chosen direction becomes a considered screen.' },
  { id: 'motion', label: 'Motion', text: 'Interaction and motion bring it to life.' }
];

function StagePillsDemo() {
  const [active, setActive] = useState(0);
  const pillRefs = useRef([]);
  const [highlight, setHighlight] = useState({ x: 0, width: 0 });

  useLayoutEffect(() => {
    const pill = pillRefs.current[active];
    if (pill) setHighlight({ x: pill.offsetLeft, width: pill.offsetWidth });
  }, [active]);

  return (
    <div className={styles.center}>
      <div className={styles.pillCard}>
        <div className={styles.pills} role="group" aria-label="Stages">
          <span
            className={styles.pillHighlight}
            style={{ '--x': `${highlight.x}px`, '--w': `${highlight.width}px` }}
            aria-hidden="true"
          />
          {STAGES.map((stage, index) => {
            const Icon = STAGE_ICONS[stage.id];
            return (
              <button
                key={stage.id}
                ref={(element) => { pillRefs.current[index] = element; }}
                type="button"
                className={styles.pill}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <Icon className={styles.pillIcon} />
                {stage.label}
              </button>
            );
          })}
        </div>
        <div className={styles.pillDivider} />
        <p className={styles.pillText} key={active}>{STAGES[active].text}</p>
      </div>
    </div>
  );
}

// --- Paper sheet -----------------------------------------------------------------
//
// The same numbers as the sheet in How I'll deliver: perspective 1000px, starts
// 35° turned on its left edge, slides 750ms and swings 500ms on
// cubic-bezier(0.5, 0.6, 0, 1). Each click sends the next audience colour.

const PAPER_COLOURS = [
  { colour: '#3794FE', label: 'Hiring managers' },
  { colour: '#22C55E', label: 'Freelance / contract' },
  { colour: '#ff0000', label: 'Open to work' }
];

function PaperSheetDemo() {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const busy = useRef(false);
  const paper = PAPER_COLOURS[count % PAPER_COLOURS.length];

  const next = () => {
    if (busy.current) return;
    if (prefersReducedMotion()) {
      setCount((value) => value + 1);
      return;
    }
    busy.current = true;
    setLeaving(true);
  };

  return (
    <div className={styles.desk}>
      <div
        key={count}
        className={cn(styles.paper, leaving && styles.paperLeaving)}
        style={{ '--paper-accent': paper.colour }}
        onAnimationEnd={(event) => {
          // Both exit animations report; only the first one counts.
          if (!busy.current || !leaving || event.target !== event.currentTarget) return;
          busy.current = false;
          setLeaving(false);
          setCount((value) => value + 1);
        }}
      >
        <span className={styles.paperTitle}>{paper.label}</span>
        <span className={styles.paperLine} />
        <span className={cn(styles.paperLine, styles.paperLineShort)} />
        <span className={styles.paperLine} />
      </div>
      <button type="button" className={styles.demoButton} onClick={next}>
        Next sheet
      </button>
    </div>
  );
}

// --- Headline reveal ---------------------------------------------------------------
//
// The same numbers as the How I'll deliver headline: each word slides 48px in
// over 600ms on cubic-bezier(0, 0.56, 0.25, 1) while it scales from 0.15 to 1
// in 150ms.

const REVEAL_WORDS = [
  { text: 'How I’ll', from: -1 },
  { text: 'deliver', from: -1 },
  { text: 'for', from: 1 },
  { text: 'you', from: 1 }
];

function HeadlineRevealDemo() {
  const wordRefs = useRef([]);

  const play = () => {
    if (prefersReducedMotion() || typeof Element.prototype.animate !== 'function') return;
    wordRefs.current.forEach((word, index) => {
      if (!word) return;
      const direction = REVEAL_WORDS[index].from;
      const delay = 50 + index * 70;
      word.animate(
        [{ transform: `translateX(${direction * 48}px)` }, { transform: 'translateX(0)' }],
        { duration: 600, delay, easing: 'cubic-bezier(0, 0.56, 0.25, 1)', fill: 'both' }
      );
      word.firstChild.animate(
        [{ transform: 'scale(0.15)' }, { transform: 'scale(1)' }],
        { duration: 150, delay, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' }
      );
    });
  };

  return (
    <div className={styles.center}>
      <p className={styles.revealLine} aria-label="How I’ll deliver for you">
        {REVEAL_WORDS.map((word, index) => (
          <span
            key={word.text}
            ref={(element) => { wordRefs.current[index] = element; }}
            className={styles.revealWord}
            data-from={word.from > 0 ? 'right' : 'left'}
            aria-hidden="true"
          >
            <span className={styles.revealScale}>{word.text}</span>
          </span>
        ))}
      </p>
      <button type="button" className={styles.demoButton} onClick={play}>
        Replay
      </button>
    </div>
  );
}

// --- Photos by Alex components ---------------------------------------------------
//
// Built as full-width page sections, so each runs in a ScaledFrame (a small
// browser window) on the background it had on the client's site.

function GalleryCardDemo() {
  return (
    <ScaledFrame background="#ffffff">
      <div className={styles.pageSection}>
        <GalleryCard />
      </div>
    </ScaledFrame>
  );
}

function SlideUpTextDemo() {
  return (
    <ScaledFrame background="#ecebe7">
      <LandingSlideUpText />
    </ScaledFrame>
  );
}

function LiveEventsDemo() {
  return (
    <ScaledFrame background="#1e1e1e">
      <div className={styles.pageSection}>
        <LiveEventsHover />
      </div>
    </ScaledFrame>
  );
}

function FloatingNavDemo() {
  return (
    <ScaledFrame background="#ecebe7">
      <div className={styles.navStage}>
        <FloatingNav preview />
      </div>
    </ScaledFrame>
  );
}

const DEMOS = {
  galleryCard: GalleryCardDemo,
  slideUpText: SlideUpTextDemo,
  liveEvents: LiveEventsDemo,
  floatingNav: FloatingNavDemo,
  hoverWords: HoverWordsDemo,
  inlineImages: InlineImagesDemo,
  stagePills: StagePillsDemo,
  paperSheet: PaperSheetDemo,
  headlineReveal: HeadlineRevealDemo
};

export default DEMOS;
