import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import UNFINISHED, { UNFINISHED_INTRO, isTodo } from './unfinishedWork';
import styles from './Unfinished.module.scss';

// Placeholders (todo() in unfinishedWork.js), "draft" tags and picture chips with
// no image yet show while you work in `npm start`. The production build
// leaves them all out.
const SHOW_TODOS = process.env.NODE_ENV !== 'production';

// The "Unfinished" section at the bottom of /projects: one collapsible row per
// entry (year, name, a one-line hint, +). A row opens in place to its entry.
//
// Layout follows the Design canvas at four widths:
//   1440+        hint on the right of the row; entry in two columns
//   1024–1439    the same, slightly smaller type
//   601–1023     hint under the name; entry in one column, facts first (2 × 2)
//   up to 600    year moves down beside the hint; facts as a single list

// A string, a todo(), or a list of both, as inline text. Todos are skipped
// when `showTodos` is off. Returns null when nothing is left.
function Mixed({ value, showTodos }) {
  const parts = (Array.isArray(value) ? value : [value])
    .filter((part) => part && (showTodos || !isTodo(part)));
  if (!parts.length) return null;
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {index > 0 && ' '}
      {isTodo(part) ? `[${part.todo}]` : part}
    </React.Fragment>
  ));
}

function hasText(value, showTodos) {
  return (Array.isArray(value) ? value : [value]).some((part) => part && (showTodos || !isTodo(part)));
}

function DraftTag({ show }) {
  if (!show) return null;
  return <span className={styles.draftTag} data-draft="">draft</span>;
}

DraftTag.propTypes = { show: PropTypes.bool };

// The highlight sentence: words with small pictures between them.
function Sentence({ parts, showTodos, draft }) {
  const visible = parts.filter((part) => typeof part === 'string' || part.img || showTodos);
  return (
    <p className={styles.sentence}>
      {visible.map((part, index) => {
        const before = index > 0 && !(typeof part === 'string' && /^[,.;:!?]/.test(part)) ? ' ' : '';
        if (typeof part === 'string') return <React.Fragment key={index}>{before}{part}</React.Fragment>;
        return (
          <React.Fragment key={index}>
            {before}
            {part.img
              ? <img className={styles.chip} src={part.img} alt={part.alt || ''} />
              : <span className={cn(styles.chip, styles.chipEmpty)} aria-hidden="true">{part.label}</span>}
          </React.Fragment>
        );
      })}
      {draft && <> <DraftTag show={showTodos} /></>}
    </p>
  );
}

Sentence.propTypes = { parts: PropTypes.array.isRequired, showTodos: PropTypes.bool, draft: PropTypes.bool };

const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

// 0 commits = level 0, 1 = 1, 2 = 2, 3–4 = 3, 5 or more = 4.
const levelOf = (count) => {
  if (!count) return 0;
  if (count <= 2) return count;
  return count <= 4 ? 3 : 4;
};

// Commits per day as a calendar, like the one on a GitHub profile: a column
// per week starting on Sunday, a square per day.
function Timeline({ timeline }) {
  const {
    from, days, commits, marker, peak, caption
  } = timeline;
  const first = Date.parse(`${from}T00:00:00Z`);
  const lead = new Date(first).getUTCDay(); // squares before the first day, in its week
  const counts = new Map(commits);
  const weeks = Math.ceil((lead + days + 1) / 7);

  const cells = [];
  for (let slot = 0; slot < weeks * 7; slot += 1) {
    const day = slot - lead;
    const inRange = day >= 0 && day <= days;
    const count = inRange ? counts.get(day) || 0 : 0;
    const date = dayMonth.format(first + day * DAY_MS);
    let title;
    if (inRange && count) title = `${date}: ${count} ${count === 1 ? 'commit' : 'commits'}`;
    if (inRange && marker && marker.day === day) title = marker.label;
    cells.push(
      <span
        key={slot}
        className={cn(
          styles.cell,
          !inRange && styles.cellOff,
          count > 0 && styles[`level${levelOf(count)}`],
          inRange && marker && marker.day === day && styles.cellMarked
        )}
        title={title}
        data-commits={inRange ? count : undefined}
      />
    );
  }

  // Every other week gets its date above it.
  const weekLabels = Array.from({ length: weeks }, (_, week) => (
    week % 2 === 0 ? dayMonth.format(first + (week * 7 - lead) * DAY_MS) : ''
  ));

  return (
    <figure className={styles.timeline}>
      <div className={styles.calendar} aria-hidden="true">
        <div className={styles.weeks}>
          <div className={styles.weekLabels}>
            {weekLabels.map((label, week) => <span key={week}>{label}</span>)}
          </div>
          <div className={styles.grid}>
            <div className={styles.dayLabels}>
              {DAY_LABELS.map((label, row) => <span key={row}>{label}</span>)}
            </div>
            <div className={styles.cells}>{cells}</div>
          </div>
        </div>

        <div className={styles.legend}>
          {peak && (
            <span className={cn(styles.legendItem, styles.legendPeak)}>
              <span className={cn(styles.swatch, styles.level4)} />
              {peak.label}
            </span>
          )}
          {marker && (
            <span className={styles.legendItem}>
              <span className={cn(styles.swatch, styles.swatchMarked)} />
              {marker.label}
            </span>
          )}
          <span className={styles.scale}>
            Less
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className={cn(styles.swatch, level > 0 && styles[`level${level}`])} />
            ))}
            More
          </span>
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

Timeline.propTypes = { timeline: PropTypes.object.isRequired };

// A titled block of the story. A todo() body is a dashed box (dev only).
function Block({ title, body, showTodos, children }) {
  if (!children && (!body || (isTodo(body) && !showTodos))) return null;
  return (
    <section className={styles.block}>
      <h4 className={styles.blockTitle}>{title}</h4>
      {children}
      {body && (isTodo(body)
        ? <p className={styles.todoBox}>[{body.todo}]</p>
        : <p className={styles.body}>{body}</p>)}
    </section>
  );
}

Block.propTypes = {
  title: PropTypes.string.isRequired, body: PropTypes.any, showTodos: PropTypes.bool, children: PropTypes.node
};

// A full write-up: sentence, facts, the story, links out.
function Entry({ entry, showTodos, draft }) {
  return (
    <div className={styles.entry}>
      <Sentence parts={entry.sentence} showTodos={showTodos} draft={draft} />

      <div className={styles.cols}>
        <dl className={styles.facts}>
          {entry.facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.story}>
          <Block title="What it was meant to be" body={entry.meant} showTodos={showTodos} />
          <Block title="How far it got">
            {entry.timeline && <Timeline timeline={entry.timeline} />}
            <ol className={styles.steps}>
              {entry.steps.map((step) => (
                <li key={step.when} className={styles.step}>
                  <span className={styles.stepWhen}>{step.when}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </li>
              ))}
            </ol>
          </Block>
          <Block title="Why I stopped" body={entry.why} showTodos={showTodos} />
          <Block title="What I’d take from it" body={entry.take} showTodos={showTodos} />
        </div>

        <section className={styles.material}>
          <h4 className={styles.blockTitle}>Open the material</h4>
          {entry.links.map((link) => (
            <a key={link.href} className={styles.link} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          {showTodos && entry.reminder && (
            <div className={styles.reminder}>
              <span className={styles.reminderTitle}>[{entry.reminder.title}]</span>
              <span className={styles.reminderText}>{entry.reminder.text}</span>
            </div>
          )}
        </section>

        {entry.disclosure && <p className={styles.disclosure}>{entry.disclosure}</p>}
      </div>
    </div>
  );
}

Entry.propTypes = { entry: PropTypes.object.isRequired, showTodos: PropTypes.bool, draft: PropTypes.bool };

const Unfinished = forwardRef(function Unfinished({ entries = UNFINISHED, showTodos = SHOW_TODOS }, ref) {
  const [open, setOpen] = useState(() => entries.filter((entry) => entry.open).map((entry) => entry.id));

  const toggle = (id) => setOpen((current) => (
    current.includes(id) ? current.filter((other) => other !== id) : [...current, id]
  ));

  return (
    <section ref={ref} id="unfinished" className={styles.section} aria-labelledby="unfinished-title">
      <header className={styles.head}>
        <h2 id="unfinished-title" className={styles.title}>{UNFINISHED_INTRO.title}</h2>
        <p className={styles.intro}>
          {UNFINISHED_INTRO.text}
          {UNFINISHED_INTRO.draft && <> <DraftTag show={showTodos} /></>}
        </p>
      </header>

      <ul className={styles.rows}>
        {entries.map((entry) => {
          const hasNote = Boolean(entry.note) && showTodos;
          const canOpen = Boolean(entry.entry || entry.summary || hasNote);
          const isOpen = canOpen && open.includes(entry.id);
          const panelId = `unfinished-${entry.id}-panel`;

          const line = (
            <>
              <span className={styles.year}><Mixed value={entry.year} showTodos={showTodos} /></span>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.hint}>
                {hasText(entry.hint, showTodos) && <Mixed value={entry.hint} showTodos={showTodos} />}
              </span>
              {canOpen && <span className={styles.sign} aria-hidden="true">{isOpen ? '−' : '+'}</span>}
            </>
          );

          return (
            <li key={entry.id} id={`unfinished-${entry.id}`} className={cn(styles.row, isOpen && styles.rowOpen)}>
              <h3 className={styles.rowHead}>
                {canOpen ? (
                  <button
                    type="button"
                    className={styles.line}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(entry.id)}
                  >
                    {line}
                  </button>
                ) : (
                  <span className={cn(styles.line, styles.linePlain)}>{line}</span>
                )}
              </h3>

              {canOpen && (
                <div id={panelId} className={styles.panel} hidden={!isOpen}>
                  {entry.entry ? (
                    <Entry entry={entry.entry} showTodos={showTodos} draft={entry.draft} />
                  ) : (
                    <div className={styles.stub}>
                      {entry.summary && <p className={styles.body}>{entry.summary}</p>}
                      {hasNote && <p className={cn(styles.todoBox, styles.todoBoxSmall)}>[{entry.note.todo}]</p>}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
});

Unfinished.propTypes = {
  // The rows. Defaults to everything in unfinishedWork.js.
  entries: PropTypes.array,
  // Show todo() placeholders, draft tags and empty picture chips. On in
  // `npm start`, off in the production build.
  showTodos: PropTypes.bool
};

export default Unfinished;
