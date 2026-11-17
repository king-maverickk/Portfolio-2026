import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import Resume from '../Resume';
import { HIRING } from './copy';
import { DraftTag } from './Blocks';
import styles from './index.module.scss';
import hx from './hiringSheet.module.scss';

// Resume and open letter, as a pile of two pages (direction D, 16 Nov 2026).
//
// - The page on top leans left; the other peeks out on the right.
// - Click the back page: it slides out from behind the pile, then lands on
//   top while the other drops behind.
// - Click the top page: it opens full size to read, with "Back to the pile".
//
// Each page in the pile is the real document, shrunk to fit, and hidden from
// keyboards and screen readers: they use the page's button instead, and read
// the document once it's open. The words are in copy.js (HIRING.documents and
// HIRING.coverLetter); the motion is in hiringSheet.module.scss.

const DOCS = ['resume', 'letter'];

// How long the back page takes to slide out before it lands on top. Keep in
// step with $paper-out in hiringSheet.module.scss.
const OUT_MS = 260;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function CoverLetter() {
  const { coverLetter, documents } = HIRING;
  return (
    <article className={styles.letter} aria-label={documents.letter.label}>
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

const Doc = ({ id }) => (id === 'resume' ? <Resume /> : <CoverLetter />);

// Takes a page in the pile out of the tab order and away from screen readers,
// links and all. (React 18 doesn't know the inert attribute, so it's set here.)
const makeInert = (element) => {
  if (element) element.setAttribute('inert', '');
};

function Documents() {
  const { documents } = HIRING;
  const [front, setFront] = useState('resume');
  const [lifting, setLifting] = useState(false); // the back page on its way out
  const [reading, setReading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const frontButtonRef = useRef(null);
  const backToPileRef = useRef(null);
  const wasReading = useRef(false);
  const timer = useRef();

  const back = DOCS.find((id) => id !== front);
  const name = (id) => documents[id].label.toLowerCase();
  const { pdf } = documents[front];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Opening a page moves focus to "Back to the pile"; closing it returns
  // focus to the page on top.
  useEffect(() => {
    if (reading) backToPileRef.current?.focus();
    else if (wasReading.current) frontButtonRef.current?.focus();
    wasReading.current = reading;
  }, [reading]);

  const bringForward = () => {
    if (lifting) return;
    const swap = () => {
      setFront(back);
      setLifting(false);
      setAnnouncement(`${documents[back].label} on top.`);
    };
    if (window.matchMedia?.(REDUCED_MOTION)?.matches) {
      swap();
      return;
    }
    setLifting(true);
    timer.current = window.setTimeout(swap, OUT_MS);
  };

  const backToPile = (ref) => (
    <button ref={ref} type="button" className={hx.pillButton} onClick={() => setReading(false)}>
      {documents.backToPile}
    </button>
  );

  return (
    <section className={hx.block} aria-labelledby="hiring-documents-title">
      <div className={hx.blockHead}>
        <h3 className={hx.blockTitle} id="hiring-documents-title">{documents.title}</h3>
        <div className={hx.docActions}>
          {pdf && (
            <a className={hx.pillButton} href={pdf} download>
              Download {documents[front].label.toLowerCase()} <span aria-hidden="true">↓</span>
            </a>
          )}
          {reading && backToPile(backToPileRef)}
        </div>
      </div>

      {reading ? (
        <>
          <div className={cn(styles.paper, hx.reader)}>
            <Doc id={front} />
          </div>
          <div className={hx.readerFoot}>{backToPile()}</div>
        </>
      ) : (
        <div className={hx.pile}>
          {DOCS.map((id) => {
            const onTop = id === front;
            return (
              <div
                key={id}
                className={cn(hx.paper, onTop ? hx.paperOnTop : hx.paperBehind, !onTop && lifting && hx.paperLifting)}
              >
                <div className={hx.paperPreview} ref={makeInert} aria-hidden="true">
                  <Doc id={id} />
                </div>
                <button
                  ref={onTop ? frontButtonRef : undefined}
                  type="button"
                  className={hx.paperButton}
                  aria-label={onTop ? `Read the ${name(id)}` : `Bring the ${name(id)} to the front`}
                  onClick={onTop ? () => setReading(true) : bringForward}
                >
                  <span className={hx.paperPill} aria-hidden="true">
                    {onTop ? `Read the ${name(id)}` : documents[id].label}
                  </span>
                </button>
              </div>
            );
          })}
          <span className={hx.srOnly} aria-live="polite">{announcement}</span>
        </div>
      )}
    </section>
  );
}

export default Documents;
