import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import InlineImg from 'components/InlineImg';
import { FREELANCE } from './copy';
import { ContactCta, Icon, SheetSection } from './Blocks';
import styles from './index.module.scss';

const ICONS = '/assets/HowIllDeliver';

function RecentWork() {
  const { recentWork } = FREELANCE;
  const Card = recentWork.href ? 'a' : 'div';
  const linkProps = recentWork.href
    ? { href: recentWork.href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Card className={styles.workCard} {...linkProps}>
      <img className={styles.workThumb} src={recentWork.image} alt="" loading="lazy" />
      <span className={styles.workBody}>
        <span className={styles.workTitle}>{recentWork.title}</span>
        <span className={styles.workMeta}>{recentWork.meta}</span>
      </span>
      {recentWork.href && <Icon name="arrow" className={styles.linkArrow} />}
    </Card>
  );
}

// Everything is visible at once, top to bottom: who it's for, the problems,
// how it runs, proof, price, then the form. No selectors hiding anything.
function FreelanceSheet({ onStartContact }) {
  const { problems, process, pricing, ai, form } = FREELANCE;

  return (
    <>
      {/* Who it's for, from the Figma frame. The images sit inside the
          sentence, so the words live here rather than in copy.js. Each icon
          leads into the words it stands for and is kept on the same line as
          them (styles.keep). Sizes and offsets are in index.module.scss. */}
      <p className={styles.forStatement}>
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

      <SheetSection title={problems.title} draft={problems.draft}>
        <ul className={styles.checkList}>
          {problems.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SheetSection>

      <SheetSection title={process.title} draft={process.draft}>
        <ol className={styles.steps}>
          {process.steps.map(({ label, text }, index) => (
            <li className={styles.step} key={label}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.stepLabel}>{label}</span>
              <span className={styles.stepText}>{text}</span>
            </li>
          ))}
        </ol>
        <div className={styles.note}>{process.note}</div>
      </SheetSection>

      <SheetSection title="Recent work">
        <RecentWork />
      </SheetSection>

      {pricing.show && (
        <SheetSection title={pricing.title} draft={pricing.draft}>
          <div className={styles.bodyText}>{pricing.text}</div>
        </SheetSection>
      )}

      <SheetSection title={ai.title} draft={ai.draft}>
        <div className={styles.bodyText}>{ai.text}</div>
      </SheetSection>

      <ContactCta form={form} onStart={() => onStartContact('website')} />
    </>
  );
}

FreelanceSheet.propTypes = {
  onStartContact: PropTypes.func.isRequired
};

export default FreelanceSheet;
