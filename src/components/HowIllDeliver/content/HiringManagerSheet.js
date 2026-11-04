import React, { useRef, useState } from 'react';
import cn from 'classnames';

import Resume from '../Resume';
import { HIRING } from './copy';
import { DraftTag, FactList, LinkCards, SheetSection } from './Blocks';
import styles from './index.module.scss';

const TABS = [
  { id: 'resume', label: 'Resume' },
  { id: 'letter', label: 'Cover letter' }
];

function CoverLetter() {
  const { coverLetter } = HIRING;
  return (
    <article className={styles.letter} aria-label="Cover letter">
      {coverLetter.draft && <DraftTag />}
      <div className={styles.letterText}>
        <div>{coverLetter.greeting}</div>
        {coverLetter.paragraphs.map((paragraph) => (
          <div key={paragraph}>{paragraph}</div>
        ))}
        <div className={styles.signOff}>
          <span>Thanks for reading,</span>
          <span className={styles.signature}>{coverLetter.signOff}</span>
        </div>
      </div>
    </article>
  );
}

// Resume and cover letter behind two tabs, with the sliding dark highlight the
// stage pills use. Arrow keys move between tabs.
function Documents() {
  const [active, setActive] = useState('resume');
  const tabRefs = useRef([]);
  const activeIndex = TABS.findIndex((tab) => tab.id === active);

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = (activeIndex + step + TABS.length) % TABS.length;
    setActive(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={styles.documents}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Documents"
        style={{ '--tab-index': activeIndex, '--tab-count': TABS.length }}
      >
        <span className={styles.tabHighlight} aria-hidden="true" />
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            type="button"
            role="tab"
            id={`doc-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`doc-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={cn(styles.tab, active === tab.id && styles.tabActive)}
            onClick={() => setActive(tab.id)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={styles.paper}
        role="tabpanel"
        id={`doc-panel-${active}`}
        aria-labelledby={`doc-tab-${active}`}
      >
        {active === 'resume' ? <Resume /> : <CoverLetter />}
      </div>
    </div>
  );
}

function HiringManagerSheet() {
  return (
    <>
      <div className={styles.intro}>
        {HIRING.intro.draft && <DraftTag />}
        {HIRING.intro.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <SheetSection title="At a glance">
        <FactList items={HIRING.glance} />
      </SheetSection>

      <SheetSection title="Documents">
        <Documents />
      </SheetSection>

      <SheetSection title="Find me">
        <LinkCards />
      </SheetSection>
    </>
  );
}

export default HiringManagerSheet;
