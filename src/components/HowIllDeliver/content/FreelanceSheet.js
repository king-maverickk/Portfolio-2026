import React from 'react';

import { FREELANCE } from './copy';
import { ContactForm, DraftTag, Icon, SheetSection } from './Blocks';
import styles from './index.module.scss';

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
function FreelanceSheet() {
  const { lead, whoFor, problems, process, pricing, ai, form } = FREELANCE;

  return (
    <>
      <div className={styles.intro}>
        {lead.draft && <DraftTag />}
        <p className={styles.leadText}>{lead.text}</p>
      </div>

      <SheetSection title="Who I work with" draft={whoFor.draft}>
        <ul className={styles.audienceGrid}>
          {whoFor.items.map(({ title, text }) => (
            <li className={styles.audience} key={title}>
              <span className={styles.audienceTitle}>{title}</span>
              <span className={styles.audienceText}>{text}</span>
            </li>
          ))}
        </ul>
      </SheetSection>

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

      <SheetSection title={form.title} className={styles.formSection}>
        <div className={styles.note}>{form.note}</div>
        <ContactForm
          kind="freelance"
          idPrefix="freelance"
          submitLabel={form.submit}
          messageLabel={form.messageLabel}
          showCurrentSite={form.showCurrentSite}
        />
      </SheetSection>
    </>
  );
}

export default FreelanceSheet;
