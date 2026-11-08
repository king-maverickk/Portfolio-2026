import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import InlineImg from 'components/InlineImg';
import SlideUpText, { slideUpHost } from 'components/SlideUpText';
import { FREELANCE } from './copy';
import { DraftTag } from './Blocks';
import PainPoints from './PainPoints';
import styles from './index.module.scss';
import sx from './freelanceSheet.module.scss';

// The Freelance / contract sheet as separate containers (from Motheo's
// "Freelance Sheet Sections" preview). The first one (the sheet's title, the
// headline and the two calls to action) sits straight on the sheet and is
// always open. The rest start collapsed as pale rows, each with its bold title
// and a one-line hint; the one you open turns solid white and lifts. The
// calls to action roll their letters up on hover (SlideUpText). The sheet's
// title lives here (HowIllDeliver/index.js leaves it out for this sheet).

const ICONS = '/assets/HowIllDeliver';

// How long a container takes to open (keep in step with .boxBody's transition).
const TOGGLE_MS = 420;

const COLLAPSIBLE = ['pain', 'together', 'process', 'pricing', 'ai', 'next'];

function Section({
  id,
  title,
  titleAs: Heading = 'h3',
  titleId,
  teaser,
  draft = false,
  collapsible = true,
  open: openProp = false,
  onToggle,
  className,
  children
}) {
  const open = collapsible ? openProp : true;
  const headingId = titleId || `${id}-title`;
  const innerRef = useRef(null);
  // Once fully open, the container stops clipping its content. Closing clips
  // again straight away, so the slide shut stays clean.
  const [settled, setSettled] = useState(open);

  useEffect(() => {
    if (!open) {
      setSettled(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setSettled(true), TOGGLE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Closed content can't be tabbed into (aria-hidden below hides it from
  // screen readers in browsers without inert).
  useEffect(() => {
    if (innerRef.current) innerRef.current.inert = !open;
  }, [open]);

  return (
    <section
      className={cn(sx.box, { [sx.open]: open, [sx.settled]: settled }, className)}
      aria-labelledby={headingId}
    >
      <Heading className={sx.boxHeading} id={headingId}>
        {collapsible ? (
          <button
            type="button"
            className={sx.boxHead}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            onClick={onToggle}
          >
            <span className={sx.boxLabel}>
              <span className={sx.boxTitle}>{title}</span>
              {draft && <DraftTag />}
            </span>
            {teaser && <span className={sx.boxTeaser}>{teaser}</span>}
            <span className={sx.boxToggle} aria-hidden="true" />
          </button>
        ) : (
          <span className={sx.boxHead}>
            <span className={sx.boxLabel}>
              <span className={sx.boxTitle}>{title}</span>
              {draft && <DraftTag />}
            </span>
          </span>
        )}
      </Heading>
      <div className={sx.boxBody} id={`${id}-body`}>
        <div className={sx.boxInner} ref={innerRef} aria-hidden={!open}>
          <div className={sx.boxContent}>{children}</div>
        </div>
      </div>
    </section>
  );
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleAs: PropTypes.oneOf(['h2', 'h3']),
  titleId: PropTypes.string,
  teaser: PropTypes.string,
  draft: PropTypes.bool,
  collapsible: PropTypes.bool,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

// A call to action whose label rolls up on hover.
function Action({ label, onClick, variant = 'primary', arrow = '→', className }) {
  return (
    <button
      type="button"
      className={cn(variant === 'primary' ? styles.primaryAction : styles.secondaryAction, slideUpHost, className)}
      onClick={onClick}
    >
      <SlideUpText text={label} />
      <span className={arrow === '↓' ? sx.downArrow : styles.ctaArrow} aria-hidden="true">{arrow}</span>
    </button>
  );
}

Action.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  arrow: PropTypes.string,
  className: PropTypes.string
};

function FreelanceSheet({ onStartContact }) {
  const { introActions, painPoints, doc, process, pricing, ai, form } = FREELANCE;
  // Every collapsible section starts closed.
  const [open, setOpen] = useState(() => Object.fromEntries(COLLAPSIBLE.map((key) => [key, false])));

  const toggle = (key) => () => setOpen((current) => ({ ...current, [key]: !current[key] }));
  const sectionProps = (key, { title, draft, teaser }) => ({
    id: `freelance-${key}`,
    title,
    draft,
    teaser,
    open: open[key],
    onToggle: toggle(key)
  });

  // "See how a project runs": open that section, then scroll the sheet to it.
  const showProcess = () => {
    setOpen((current) => ({ ...current, process: true }));
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    window.requestAnimationFrame?.(() => {
      document
        .getElementById('freelance-process-title')
        ?.closest('section')
        ?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  };

  return (
    <div className={sx.stack}>
      {/* Always open, and straight on the sheet: the sheet's name, who it's
          for, and the two calls to action. */}
      <Section
        id="freelance-intro"
        title={FREELANCE.title}
        titleAs="h2"
        titleId="delivery-sheet-title"
        collapsible={false}
        className={sx.boxIntro}
      >
        {/* From the Figma frame. The images sit inside the sentence, so the
            words live here rather than in copy.js. Each icon leads into the
            words it stands for and stays on their line (styles.keep). */}
        <p className={cn(styles.forStatement, sx.introHeadline)}>
          For businesses that depend on{' '}
          <span className={styles.keep}>
            <InlineImg
              src={`${ICONS}/freelance_icons_chat_calendar.png`}
              ratio={307 / 176}
              className={cn(styles.forIcon, styles.forIconChat)}
            />
            enquiries,
          </span>{' '}
          bookings, customer trust,{' '}
          <span className={styles.keep}>
            <InlineImg
              src={`${ICONS}/freelance_icon_receipt.png`}
              ratio={1}
              className={cn(styles.forIcon, styles.forIconReceipt)}
            />
            repeat
          </span>{' '}
          purchases &amp; professional{' '}
          <InlineImg
            src={`${ICONS}/freelance_icon_verified.png`}
            ratio={1}
            className={cn(styles.forIcon, styles.forIconBadge)}
          >
            credibility.
          </InlineImg>
        </p>
      </Section>

      <div className={sx.introActions}>
        <Action label={introActions.primary} onClick={() => onStartContact('website')} />
        <Action label={introActions.secondary} onClick={showProcess} variant="secondary" arrow="↓" />
        {introActions.draft && <DraftTag />}
      </div>

      {/* The card shuffle. (The phone notifications, PainPointsPhone.js, were
          too heavy: their frosted blur on top of the sheet's own blur slowed
          scrolling noticeably.) */}
      <Section {...sectionProps('pain', painPoints)} className={sx.boxPain}>
        <PainPoints {...painPoints} showTitle={false} />
      </Section>

      <Section {...sectionProps('together', doc)}>
        <div className={sx.lead}>{doc.lead}</div>
        <div className={sx.callout}>
          <strong>{doc.callout.label}</strong> {doc.callout.text}
        </div>
      </Section>

      <Section {...sectionProps('process', process)}>
        <ol className={sx.steps}>
          {process.steps.map(({ label, text }) => (
            <li key={label}>
              <strong>{label}.</strong> {text}
            </li>
          ))}
        </ol>
        <div className={sx.note}>{process.note}</div>
      </Section>

      {pricing.show && (
        <Section {...sectionProps('pricing', pricing)}>
          <div className={sx.text}>{pricing.intro}</div>
          <ul className={sx.list}>
            {pricing.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section {...sectionProps('ai', ai)}>
        <div className={sx.text}>{ai.text}</div>
      </Section>

      <Section {...sectionProps('next', form)}>
        <ol className={sx.checklist}>
          {form.steps.map((step) => (
            <li key={step}>
              <span className={sx.checkbox} aria-hidden="true" />
              {step}
            </li>
          ))}
        </ol>
        <Action label={form.cta} onClick={() => onStartContact('website')} className={sx.action} />
      </Section>
    </div>
  );
}

FreelanceSheet.propTypes = {
  onStartContact: PropTypes.func.isRequired
};

export default FreelanceSheet;
