import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import InlineImg from 'components/InlineImg';

import UNFINISHED, { UNFINISHED_INTRO, isTodo } from './unfinishedWork';
import styles from './Unfinished.module.scss';

// Placeholders (todo() in unfinishedWork.js), "draft" tags and picture chips with
// no image yet show while you work in `npm start`. The production build
// leaves them all out.
const SHOW_TODOS = process.env.NODE_ENV !== 'production';

// The "Unfinished" section at the bottom of /projects: one collapsible row per
// entry (year, name, a one-line hint, +). A row opens in place to its entry.
//
// An open entry follows Motheo's own mockup (Nov 13): the sentence and four
// short sections on the left, a "Shelf" of cards on the right.
//   1024+        hint on the right of the row; entry in two columns
//   601–1023     hint under the name; entry in one column, shelf last
//   up to 600    year moves down beside the hint; shelf first, then the words

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

// A picture in the sentence, as an InlineImg (components/InlineImg): it scales
// with the text, keeps to the word before it so it never starts a line on its
// own, and spins (or flips) on hover. Inside the chip's grey box: a logo
// (`fit: 'contain'`) whole, a picture with a `tilt` popping out, turned, any
// other picture filling the box. No picture yet: the chip's label (dev only).
const CHIP_RATIO = 16 / 9;

function Chip({ part, word }) {
  const popped = typeof part.tilt === 'number';
  if (!part.img) {
    return (
      <InlineImg ratio={CHIP_RATIO} className={cn(styles.chipFrame, styles.chipEmpty)} icon={<span>{part.label}</span>}>
        {word}
      </InlineImg>
    );
  }
  if (part.fit !== 'contain' && !popped) {
    return <InlineImg ratio={CHIP_RATIO} src={part.img} alt={part.alt || ''}>{word}</InlineImg>;
  }
  return (
    <InlineImg
      ratio={CHIP_RATIO}
      alt={part.alt || ''}
      className={cn(styles.chipFrame, popped && styles.chipPopFrame)}
      icon={(
        <img
          className={popped ? styles.chipPop : styles.chipLogo}
          src={part.img}
          alt=""
          decoding="async"
          style={popped ? { '--chip-tilt': `${part.tilt}deg` } : undefined}
        />
      )}
    >
      {word}
    </InlineImg>
  );
}

Chip.propTypes = { part: PropTypes.object.isRequired, word: PropTypes.string };

// The highlight sentence: words with small pictures between them. The last
// word before each picture goes inside its InlineImg, so the two stay on one line.
function Sentence({ parts, showTodos, draft }) {
  const visible = parts.filter((part) => typeof part === 'string' || part.img || showTodos);
  const pieces = [];
  let word = null;
  visible.forEach((part, index) => {
    if (typeof part === 'string') {
      let text = part;
      const next = visible[index + 1];
      if (next && typeof next !== 'string') {
        const cut = text.search(/\S+$/);
        word = text.slice(cut);
        text = text.slice(0, cut).trimEnd();
      }
      if (text) pieces.push({ key: index, node: text, joins: /^[,.;:!?]/.test(text) });
    } else {
      pieces.push({ key: index, node: <Chip part={part} word={word || undefined} /> });
      word = null;
    }
  });
  return (
    <p className={styles.sentence}>
      {pieces.map((piece, index) => (
        <React.Fragment key={piece.key}>
          {index > 0 && !piece.joins ? ' ' : ''}
          {piece.node}
        </React.Fragment>
      ))}
      {draft && <> <DraftTag show={showTodos} /></>}
    </p>
  );
}

Sentence.propTypes = { parts: PropTypes.array.isRequired, showTodos: PropTypes.bool, draft: PropTypes.bool };

// A titled block of the story: a bold title and a short paragraph. A todo()
// body is a bracketed placeholder (never in production, where the whole block
// is left out).
function Block({ title, body, showTodos }) {
  if (!body || (isTodo(body) && !showTodos)) return null;
  return (
    <section className={styles.block}>
      <h4 className={styles.blockTitle}>{title}</h4>
      {isTodo(body)
        ? <p className={cn(styles.blockBody, styles.blockTodo)}>[{body.todo}]</p>
        : <p className={styles.blockBody}>{body}</p>}
    </section>
  );
}

Block.propTypes = { title: PropTypes.string.isRequired, body: PropTypes.any, showTodos: PropTypes.bool };

// Is there anything to show a visitor on this card? A link or a real picture.
const cardIsReal = (card) => Boolean(card.href) || (Boolean(card.image) && !isTodo(card.image));

// The shelf's pictures load a couple at a time, in shelf order, and only once
// they're in view or about to scroll into it (half a shelf ahead). On a phone
// that means the first two or three, not all seven at once; the rest follow as
// the shelf is swiped. Nothing loads while the row is closed: a hidden shelf
// is never in view. Without IntersectionObserver, everything loads.
const LOOK_AHEAD = '0px 50% 0px 0px';
const AT_ONCE = 2;

function usePictureQueue(rowRef, count) {
  const canWatch = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [near, setNear] = useState(() => new Set());
  const [started, setStarted] = useState(() => new Set());
  const [settled, setSettled] = useState(() => new Set());

  useEffect(() => {
    const row = rowRef.current;
    if (!canWatch || !row) return undefined;
    const observer = new IntersectionObserver((changes) => {
      const seen = changes.filter((change) => change.isIntersecting).map((change) => Number(change.target.dataset.order));
      if (seen.length) setNear((current) => new Set([...current, ...seen]));
    }, { root: row, rootMargin: LOOK_AHEAD });
    row.querySelectorAll('[data-order]').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [rowRef, canWatch, count]);

  useEffect(() => {
    if (!canWatch) return;
    let free = AT_ONCE - [...started].filter((order) => !settled.has(order)).length;
    const next = new Set(started);
    for (let order = 0; order < count && free > 0; order += 1) {
      if (near.has(order) && !next.has(order)) {
        next.add(order);
        free -= 1;
      }
    }
    if (next.size !== started.size) setStarted(next);
  }, [canWatch, count, near, started, settled]);

  return {
    canLoad: (order) => !canWatch || started.has(order),
    onSettled: (order) => setSettled((current) => (current.has(order) ? current : new Set([...current, order])))
  };
}

// One card on the shelf. With a picture, the picture is the card, shown as it
// is (its own corners, tilt, shadow and blue label), with the title kept for
// screen readers. Without, a plain grey card with the title on it. With a
// link, the whole card is the link.
function Card({ card, className, order, queue }) {
  const picture = Boolean(card.image) && !isTodo(card.image);
  const [loaded, setLoaded] = useState(false);
  const settle = () => {
    setLoaded(true);
    queue.onSettled(order);
  };
  const face = picture ? (
    <>
      {queue.canLoad(order) ? (
        <img
          className={cn(styles.cardImage, loaded && styles.cardImageLoaded)}
          src={card.image}
          alt=""
          width={card.width}
          height={card.height}
          decoding="async"
          fetchpriority="low"
          draggable="false"
          onLoad={settle}
          onError={settle}
        />
      ) : (
        // Holds the picture's place until its turn comes.
        <span className={styles.cardWaiting} style={{ aspectRatio: `${card.width} / ${card.height}` }} />
      )}
      <span className={styles.srOnly}>{card.title}</span>
      {card.tag && <span className={styles.cardTag} aria-hidden="true">{card.tag}</span>}
    </>
  ) : (
    <>
      <span className={styles.cardTitle}>{card.title}</span>
      {isTodo(card.image) && <span className={styles.cardTodo}>[{card.image.todo}]</span>}
    </>
  );
  const classes = cn(styles.card, picture && styles.cardPicture, card.href && styles.cardLink, className);
  const style = picture && card.width ? { width: card.width } : undefined;
  const marker = picture ? { 'data-order': order } : {};
  if (!card.href) return <span className={classes} style={style} {...marker}>{face}</span>;
  return (
    <a className={classes} style={style} href={card.href} target="_blank" rel="noreferrer" {...marker}>
      {face}
    </a>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired, className: PropTypes.string, order: PropTypes.number, queue: PropTypes.object.isRequired
};

const STACK_SPOTS = [styles.stackBack, styles.stackLeft, styles.stackRight];

// How far the mouse has to move before a press on the shelf counts as a drag
// and not a click on a card.
const DRAG_START = 6;

// Lets a row that scrolls sideways be dragged with the mouse, like a phone
// screen. (A trackpad's two-finger swipe and a touch screen already scroll it
// on their own.) Returns the ref to put on the scrolling element.
function useDragScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return undefined;
    let startX = 0;
    let startLeft = 0;
    let dragged = false;

    const onMove = (event) => {
      const moved = event.clientX - startX;
      if (!dragged && Math.abs(moved) < DRAG_START) return;
      if (!dragged) {
        dragged = true;
        row.classList.add(styles.dragging);
      }
      row.scrollLeft = startLeft - moved;
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      row.classList.remove(styles.dragging);
    };

    const onDown = (event) => {
      if (event.button !== 0) return;
      startX = event.clientX;
      startLeft = row.scrollLeft;
      dragged = false;
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    // Letting go after a drag would otherwise open the card under the mouse.
    const onClick = (event) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    // Stop the browser picking up a link or a picture as something to drag away.
    const onDragStart = (event) => event.preventDefault();

    row.addEventListener('mousedown', onDown);
    row.addEventListener('click', onClick, true);
    row.addEventListener('dragstart', onDragStart);
    return () => {
      row.removeEventListener('mousedown', onDown);
      row.removeEventListener('click', onClick, true);
      row.removeEventListener('dragstart', onDragStart);
      onUp();
    };
  }, []);

  return ref;
}

// The shelf: the things you can pick up and look at (notebook, trailer,
// repo), as cards in a row that scrolls sideways, by swipe, trackpad or
// dragging with the mouse. A group of three cards marked `stack` is piled up:
// one wide card behind, two tilted in front.
function Shelf({ shelf, showTodos, id }) {
  const rowRef = useDragScroll();
  const groups = shelf
    .map((group) => ({ ...group, cards: group.cards.filter((card) => cardIsReal(card) || showTodos) }))
    .filter((group) => group.cards.length > 0);
  // Number the pictures in shelf order, for the queue.
  let count = 0;
  const numbered = groups.map((group) => ({
    ...group,
    cards: group.cards.map((card) => ({ card, order: card.image && !isTodo(card.image) ? count++ : undefined }))
  }));
  const queue = usePictureQueue(rowRef, count);
  if (!groups.length) return null;

  return (
    <section className={styles.shelf} aria-labelledby={id}>
      <h4 id={id} className={styles.shelfTitle}>Shelf-made:</h4>
      <ul ref={rowRef} className={styles.shelfRow}>
        {numbered.map((group) => {
          const stacked = group.stack && group.cards.length === 3;
          const pictures = stacked && group.cards.every(({ card }) => card.image && !isTodo(card.image));
          return (
            <li key={group.label} className={cn(styles.group, group.cards.some(({ order }) => order !== undefined) && styles.groupPictures)}>
              <div className={cn(styles.cards, stacked && styles.stack, pictures && styles.stackPictures)}>
                {group.cards.map(({ card, order }, index) => (
                  <Card
                    key={card.title}
                    card={card}
                    order={order}
                    queue={queue}
                    className={stacked ? STACK_SPOTS[index] : undefined}
                  />
                ))}
              </div>
              <p className={styles.groupLabel}>{group.label}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

Shelf.propTypes = {
  shelf: PropTypes.array.isRequired, showTodos: PropTypes.bool, id: PropTypes.string.isRequired
};

// A full write-up: the sentence and the story on the left, the shelf on the
// right with the note about the README under it. On phones the shelf comes
// first, then the words, then the note.
function Entry({ entry, showTodos, draft, id }) {
  return (
    <div className={styles.entry}>
      <div className={styles.main}>
        <Sentence parts={entry.sentence} showTodos={showTodos} draft={draft} />
        <div className={styles.story}>
          {entry.sections.map((section) => (
            <Block key={section.title} title={section.title} body={section.body} showTodos={showTodos} />
          ))}
        </div>
      </div>
      {entry.shelf && <Shelf shelf={entry.shelf} showTodos={showTodos} id={`${id}-shelf`} />}
      {entry.disclosure && <p className={styles.disclosure}>{entry.disclosure}</p>}
    </div>
  );
}

Entry.propTypes = {
  entry: PropTypes.object.isRequired, showTodos: PropTypes.bool, draft: PropTypes.bool, id: PropTypes.string.isRequired
};

const Unfinished = forwardRef(function Unfinished({ entries = UNFINISHED, showTodos = SHOW_TODOS }, ref) {
  const [open, setOpen] = useState(() => entries.filter((entry) => entry.open).map((entry) => entry.id));
  // A row's contents (and their pictures) are only put on the page once it's
  // first opened, so a closed row costs nothing on load. Hovering a row with a
  // mouse puts them on early, hidden (on a touch screen this happens on the tap
  // that opens it anyway): the two small pictures in the sentence
  // load then, so they're there when it opens. The shelf still waits until the
  // row is open (see usePictureQueue).
  const [mounted, setMounted] = useState(() => entries.filter((entry) => entry.open).map((entry) => entry.id));
  const mount = (id) => setMounted((current) => (current.includes(id) ? current : [...current, id]));

  const toggle = (id) => {
    mount(id);
    setOpen((current) => (
      current.includes(id) ? current.filter((other) => other !== id) : [...current, id]
    ));
  };

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
          // A row marked `disabled` isn't written yet: listed, but nothing to open.
          const canOpen = !entry.disabled && Boolean(entry.entry || entry.summary || hasNote);
          const isOpen = canOpen && open.includes(entry.id);
          const panelId = `unfinished-${entry.id}-panel`;

          const line = (
            <>
              <span className={styles.year}><Mixed value={entry.year} showTodos={showTodos} /></span>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.hint}>
                {hasText(entry.hint, showTodos) && <Mixed value={entry.hint} showTodos={showTodos} />}
              </span>
              {/* Kept, empty, on a row that can't open, so the hints stay lined up. */}
              <span className={styles.sign} aria-hidden="true">{canOpen && (isOpen ? '−' : '+')}</span>
            </>
          );

          return (
            <li key={entry.id} id={`unfinished-${entry.id}`} className={cn(styles.row, isOpen && styles.rowOpen, entry.disabled && styles.rowDisabled)}>
              <h3 className={styles.rowHead}>
                {canOpen ? (
                  <button
                    type="button"
                    className={styles.line}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(entry.id)}
                    onMouseEnter={() => mount(entry.id)}
                  >
                    {line}
                  </button>
                ) : (
                  <span className={cn(styles.line, styles.linePlain)}>{line}</span>
                )}
              </h3>

              {canOpen && (
                <div id={panelId} className={styles.panel} hidden={!isOpen}>
                  {!mounted.includes(entry.id) ? null : entry.entry ? (
                    <Entry entry={entry.entry} showTodos={showTodos} draft={entry.draft} id={`unfinished-${entry.id}`} />
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
