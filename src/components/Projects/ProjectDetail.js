import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation } from 'react-router-dom';
import cn from 'classnames';

import DotGrid from 'components/DotGrid';
import LineReveal from './LineReveal';
import TOOL_ICONS, { TEXT_ONLY } from './toolIcons';
import { fadeOut, glideFrom, manualScroll, prefersReducedMotion, rememberHeading } from './transition';
import styles from './ProjectDetail.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

// How the left side swaps between the context and the media: 'fade' or
// 'instant'. In `npm start` there's a switch in the bottom-left corner to try
// both; set your favourite here.
const DEFAULT_SWAP = 'fade';
const FADE_OUT_MS = 180;
// Height of the slim bar that follows you down the page (keep in step with
// $bar-h in ProjectDetail.module.scss). The sticky box sits below it.
const BAR_H = 64;

function DraftTag() {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <span className={styles.draftTag} data-draft="">draft</span>;
}

// A muted, looping video that only plays while it's on screen and visible.
function AutoVideo({ src, poster, className, label, active = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (!active || prefersReducedMotion()) {
      video.pause();
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      video.play().catch(() => {});
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [active, src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}

AutoVideo.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool
};

// The sentence with small pictures in it, as plain text (view A).
function Sentence({ parts, className }) {
  return (
    <p className={className}>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          const next = parts[index + 1];
          const before = index > 0 && !/^[,.;:!?]/.test(part) ? ' ' : '';
          return <React.Fragment key={index}>{before}{part}{next && typeof next !== 'string' ? ' ' : ''}</React.Fragment>;
        }
        return <img key={index} className={styles.sentencePic} src={part.img} alt={part.alt || ''} />;
      })}
    </p>
  );
}

Sentence.propTypes = { parts: PropTypes.array.isRequired, className: PropTypes.string };

// A logo turns its brand colour on hover, unless that colour would vanish on
// the dark tile (GitHub's near-black, say), in which case it stays light.
function brandOnDark(hex) {
  const value = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  const lightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lightness > 0.3 ? hex : undefined;
}

function Stack({ tools }) {
  if (!tools?.length) return null;
  return (
    <section className={styles.stackBlock} aria-label="Built with">
    <h3 className={styles.sectionTitle}>Built with</h3>
    <ul className={styles.stack}>
      {tools.map((tool) => {
        const icon = TOOL_ICONS[tool];
        if (icon) {
          return (
            <li key={tool} className={styles.tool} title={icon.title} style={{ '--brand-shown': brandOnDark(icon.hex) }}>
              <svg viewBox="0 0 24 24" role="img" aria-label={icon.title}>
                <path d={icon.path} />
              </svg>
            </li>
          );
        }
        return (
          <li key={tool} className={cn(styles.tool, styles.toolText)}>
            {TEXT_ONLY[tool] || tool}
          </li>
        );
      })}
    </ul>
    </section>
  );
}

Stack.propTypes = { tools: PropTypes.arrayOf(PropTypes.string) };

function StyleBlock({ style }) {
  const colors = style?.colors || [];
  const fonts = style?.fonts || [];
  if (!colors.length && !fonts.length) return null;
  return (
    <section className={styles.styleBlock} aria-label="Style">
      <h3 className={styles.sectionTitle}>Style</h3>
      <div className={styles.styleRow}>
        {colors.length > 0 && (
          <ul className={styles.swatches} aria-label="Colours">
            {colors.map((color) => (
              <li key={color} className={styles.swatch}>
                <span className={styles.swatchChip} style={{ background: color }} />
                <span className={styles.swatchHex}>{color}</span>
              </li>
            ))}
          </ul>
        )}
        {fonts.length > 0 && (
          <ul className={styles.fonts} aria-label="Typefaces">
            {fonts.map((font) => (
              <li key={font} className={styles.font}>
                <span className={styles.fontSample} style={{ fontFamily: `"${font}", Georgia, serif` }}>Aa</span>
                <span className={styles.fontName}>{font}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

StyleBlock.propTypes = { style: PropTypes.object };

function MediaGrid({ media, active, className }) {
  if (!media?.length) return null;
  return (
    <ul className={cn(styles.media, className)} aria-label="Project media">
      {media.map((item, index) => (
        <li key={item.src + index} className={cn(styles.mediaItem, index === 0 && styles.mediaLead)}>
          {item.type === 'video'
            ? <AutoVideo className={styles.mediaFill} src={item.src} label={item.alt} active={active} />
            : <img className={styles.mediaFill} src={item.src} alt={item.alt || ''} />}
        </li>
      ))}
    </ul>
  );
}

MediaGrid.propTypes = { media: PropTypes.array, active: PropTypes.bool, className: PropTypes.string };

// One project's page.
//
// View A: the context on the left (scrolls), the video on the right (sticky).
// View B: the media on the left, a compact context card on the right.
// Clicking whatever is on the right swaps between them.
// Phones: one column, the right-hand box first, then the rest.
function ProjectDetail({ project }) {
  const history = useHistory();
  const location = useLocation();
  const pageRef = useRef(null);
  const headingRowRef = useRef(null);
  const barRowRef = useRef(null);
  const columnsRef = useRef(null);
  const topBarRef = useRef(null);
  const closingRef = useRef(false);

  const cameFrom = location.state?.from || null;
  const [view, setView] = useState('a');           // 'a' | 'b'
  const [swapping, setSwapping] = useState(false);  // fading out before a swap
  const [swapStyle, setSwapStyle] = useState(DEFAULT_SWAP);
  const [compact, setCompact] = useState(false);
  const [sweeping, setSweeping] = useState(!prefersReducedMotion());

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${project.name} · Motheo Moleko`;
    return () => { document.title = previousTitle; };
  }, [project.name]);

  // Arriving: start at the top, then glide the heading in from where its row
  // was on the previous page. The columns sweep in from the top meanwhile.
  useLayoutEffect(() => {
    manualScroll();
    window.scrollTo(0, 0);
    if (cameFrom) glideFrom(headingRowRef.current, cameFrom);
    // Leaving by any route (including the browser's back button): note where
    // the heading is, so the list can glide it back into its row.
    const bar = barRowRef.current;
    const heading = headingRowRef.current;
    return () => {
      if (closingRef.current) return; // close() already noted it
      const barShown = bar && bar.closest('[data-shown]');
      rememberHeading(project.id, barShown ? bar : heading);
    };
    // On arrival only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the big heading scrolls away, a slim copy of it slides down and
  // stays at the top (a separate bar, so nothing below jumps).
  useEffect(() => {
    const onScroll = () => {
      const row = headingRowRef.current;
      if (row) setCompact(row.getBoundingClientRect().bottom < BAR_H * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Whichever heading you can see is the one that glides home.
  const visibleHeading = () => (compact ? barRowRef.current : headingRowRef.current);

  // Back to the list: the columns fade, then the page goes back and the list
  // glides the heading home. Same for the heading, the back link and Esc.
  const close = useCallback((event) => {
    if (event && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    event?.preventDefault();
    if (closingRef.current) return;
    closingRef.current = true;

    rememberHeading(project.id, visibleHeading());
    fadeOut([columnsRef.current, topBarRef.current]).then(() => {
      if (location.state?.origin) history.goBack();
      else history.push('/projects');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, location.state, project.id, compact]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // Swap between view A and view B.
  const swap = () => {
    const next = view === 'a' ? 'b' : 'a';
    const columns = columnsRef.current;
    const columnsTop = columns ? columns.getBoundingClientRect().top + window.scrollY : 0;
    const goTop = () => {
      // If you'd scrolled down the context, start the other view from its top.
      const target = columnsTop - BAR_H - 16;
      if (window.scrollY > target) window.scrollTo(0, target);
    };

    if (swapStyle === 'instant' || prefersReducedMotion()) {
      setView(next);
      goTop();
      return;
    }
    setSwapping(true);
    window.setTimeout(() => {
      setView(next);
      setSwapping(false);
      goTop();
    }, FADE_OUT_MS);
  };

  const { name, images, year, category, role, sentence, context, intention, sections = [], stack, style, video, poster, media } = project;
  const meta = [year, category].filter(Boolean).join(' · ');

  return (
    <div
      ref={pageRef}
      className={cn(styles.page, swapStyle === 'instant' && styles.instant)}
      data-view={view}
    >
      <DotGrid color="255, 255, 255" />

      <nav ref={topBarRef} className={styles.topBar} aria-label="Site">
        <Link className={styles.back} to="/projects" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 6 9 12l6 6" />
          </svg>
          All projects
        </Link>
        <span className={styles.byline}>motheo moleko</span>
      </nav>

      {/* The slim bar that follows you down (a copy of the heading). */}
      <div
        className={cn(styles.bar, compact && styles.barShown)}
        data-shown={compact ? '' : undefined}
        aria-hidden={!compact}
      >
        <Link
          ref={barRowRef}
          className={styles.barRow}
          to="/projects"
          onClick={close}
          tabIndex={compact ? undefined : -1}
          title="Back to all projects"
        >
          <img className={styles.barThumb} src={images[0]} alt="" />
          <span className={styles.barName}>{name}</span>
          <img className={styles.barThumb} src={images[1] || images[0]} alt="" />
        </Link>
      </div>

      <header className={styles.heading}>
        <h1 className={styles.headingTitle}>
          <Link
            ref={headingRowRef}
            className={styles.headingRow}
            to="/projects"
            onClick={close}
            title="Back to all projects"
          >
            <img className={cn(styles.thumb, styles.thumbLeft)} src={images[0]} alt="" />
            <span className={styles.headingName}>{name}</span>
            <img className={cn(styles.thumb, styles.thumbRight)} src={images[1] || images[0]} alt="" />
          </Link>
        </h1>
      </header>

      <div
        ref={columnsRef}
        className={cn(styles.columns, sweeping && (cameFrom ? styles.sweepLate : styles.sweep), swapping && styles.swapping)}
        onAnimationEnd={(event) => { if (event.target === event.currentTarget) setSweeping(false); }}
      >
        {/* Left: context (A) or media (B). Both are on the page from the start,
            so their pictures and videos are already loaded when you swap. */}
        <div className={styles.left}>
          <div className={styles.leftA} hidden={view !== 'a'}>
            <section className={styles.context} aria-label="Project context">
              <h2 className={styles.eyebrow}>Project context</h2>
              {meta && <p className={styles.meta}>{meta}</p>}
              {role && <p className={styles.role}>{role}</p>}
              <Sentence parts={sentence} className={styles.sentence} />
              {context && <p className={styles.body}>{context}</p>}
              {intention && <p className={styles.intention}>{intention}</p>}

              {sections.map((section) => (
                <section key={section.title} className={styles.talkingPoint}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <p className={styles.body}>{section.text}</p>
                  {section.img && <img className={styles.sectionPic} src={section.img} alt="" />}
                </section>
              ))}

              <div className={styles.space} aria-hidden="true" />
              <Stack tools={stack} />
              <StyleBlock style={style} />
              {project.draft && <p className={styles.draftNote}><DraftTag /> words drafted from your notes</p>}
            </section>

            {/* Phones: all the media follows the context. */}
            <MediaGrid media={media} active={view === 'a'} className={styles.phoneOnly} />
          </div>

          <div className={styles.leftB} hidden={view !== 'b'}>
            <MediaGrid media={media} active={view === 'b'} />
            <Stack tools={stack} />
          </div>
        </div>

        {/* Right: the video (A) or the compact context card (B). Sticky. */}
        <div className={styles.right}>
          <button
            type="button"
            className={styles.videoBox}
            onClick={swap}
            hidden={view !== 'a'}
            aria-label={`Show the media for ${name}`}
          >
            {video
              ? <AutoVideo className={styles.mediaFill} src={video} poster={poster} active={view === 'a'} />
              : <img className={styles.mediaFill} src={poster} alt="" />}
            <span className={styles.boxHint} aria-hidden="true">
              See the media
              <span className={styles.boxHintArrow}>↗</span>
            </span>
          </button>

          {view === 'b' && (
            <button
              type="button"
              className={styles.card}
              onClick={swap}
              aria-label={`Back to the overview of ${name}`}
            >
              <LineReveal as="span" className={styles.cardEyebrow} parts={['Project context']} />
              {meta && <LineReveal as="span" className={styles.cardMeta} parts={[meta]} delay={70} />}
              <LineReveal as="span" className={styles.cardSentence} parts={sentence} delay={140} />
              <span className={styles.boxHint} aria-hidden="true">
                {video ? 'Back to the video' : 'Back to the overview'}
                <span className={styles.boxHintArrow}>↗</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {SHOW_DRAFT_MARKERS && (
        <div className={styles.devSwitch} role="group" aria-label="Swap style (only in npm start)">
          <span>swap:</span>
          {['fade', 'instant'].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={swapStyle === option}
              onClick={() => setSwapStyle(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

ProjectDetail.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    year: PropTypes.string,
    category: PropTypes.string,
    role: PropTypes.string,
    sentence: PropTypes.array.isRequired,
    context: PropTypes.string,
    intention: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string,
      img: PropTypes.string
    })),
    stack: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object,
    video: PropTypes.string,
    poster: PropTypes.string,
    media: PropTypes.array,
    draft: PropTypes.bool
  }).isRequired
};

export default ProjectDetail;
