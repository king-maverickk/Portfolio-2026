import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useHistory, useLocation } from 'react-router-dom';
import cn from 'classnames';

import { startContact } from 'components/ContactSection/contactEvents';
import { openDeliverySheet } from 'components/HowIllDeliver/deliveryEvents';
import { CONTACT } from 'components/HowIllDeliver/content/copy';
import { AUDIENCES, NAV, WORDS } from './menu';

import styles from './index.module.scss';

// The site header, on every page: the mark and name top left (they scroll
// away with the page) and two corner buttons top right (they stay).
//
// Either button opens the same thing: three cards on the left ("who are
// you?", each opens its sheet from "How I'll deliver for you"), "Let's talk"
// under them, and the menu on the right. On tablets and phones it is one
// column, starting with whichever half the button you pressed stands for.
//
// The words and links are in ./menu.js.

// Your shape: a square with its corners cut.
const SHAPE = 'M85 0H415L500 85V415L415 500H85L0 415V85L85 0Z';

const FOCUSABLE = 'a[href], button:not([disabled])';

function Shape({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" aria-hidden="true" focusable="false">
      <path d={SHAPE} fill={color} />
    </svg>
  );
}

// → (straight on), ↘ (you are here) and ↗ (opens something).
const ARROWS = {
  right: 'M2 8h12M9 3l5 5-5 5',
  here: 'M4 4l8 8M12 6v6H6',
  out: 'M4 12l8-8M6 4h6v6'
};

function Arrow({ kind = 'right', size = 16, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ARROWS[kind]} />
    </svg>
  );
}

// Which of the big links is the page you are on.
function currentPage(pathname, hash) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/projects')) return hash.startsWith('#unfinished') ? 'unfinished' : 'projects';
  if (pathname.startsWith('/lab')) return 'lab';
  return null;
}

function SiteHeader() {
  const history = useHistory();
  const location = useLocation();
  const { pathname, hash, key } = location;

  // null (closed), or the half that goes first on small screens and gets the
  // keyboard: 'audience' (the three cards) or 'menu'.
  const [open, setOpen] = useState(null);
  const isOpen = open !== null;

  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const audienceButtonRef = useRef(null);
  // What to do once the menu has gone and the page scrolls again (open a
  // sheet). Doing it any earlier would have the menu and the sheet both
  // locking the page's scroll and both moving the keyboard focus.
  const afterCloseRef = useRef(null);

  const show = (half) => (event) => {
    openerRef.current = event.currentTarget;
    setOpen(half);
  };

  const close = useCallback(() => setOpen(null), []);

  // While it is open: the page behind doesn't scroll, Esc closes, Tab stays
  // inside. Closing puts the keyboard back on the button that opened it.
  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // The keyboard starts on the half you asked for.
    const half = dialog?.querySelector(`[data-half="${open}"]`);
    half?.querySelector(FOCUSABLE)?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;

      const stops = Array.from(dialog.querySelectorAll(FOCUSABLE));
      const firstStop = stops[0];
      const lastStop = stops[stops.length - 1];
      if (!firstStop) return;

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        firstStop.focus();
      } else if (event.shiftKey && document.activeElement === firstStop) {
        event.preventDefault();
        lastStop.focus();
      } else if (!event.shiftKey && document.activeElement === lastStop) {
        event.preventDefault();
        firstStop.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus({ preventScroll: true });
    };
    // `open` only changes between null and one half while this runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen || !afterCloseRef.current) return;
    const then = afterCloseRef.current;
    afterCloseRef.current = null;
    then();
  }, [isOpen]);

  // "/#contact" (the Contact link, "Let's talk", or the address typed in)
  // brings up the contact form on the home page. `key` changes on every
  // visit, so pressing Contact a second time works too.
  useEffect(() => {
    if (pathname === '/' && hash === '#contact') startContact();
  }, [pathname, hash, key]);

  const toTop = () => window.scrollTo(0, 0);

  const follow = (item) => () => {
    close();
    if (!item.hash) {
      toTop();
      return;
    }
    // Already there? The address doesn't change, so the page won't move on
    // its own.
    if (item.id !== 'contact' && pathname === item.to && hash === item.hash) {
      document.getElementById(item.hash.slice(1))?.scrollIntoView({ block: 'start' });
    }
  };

  // The sheets live on the home page, so go there first if need be. When the
  // sheet closes, the keyboard goes back to the "who are you?" button.
  const openSheet = (sheet) => () => {
    afterCloseRef.current = () => {
      if (pathname !== '/') {
        history.push('/');
        toTop();
      }
      openDeliverySheet(sheet, audienceButtonRef.current);
    };
    close();
  };

  const here = currentPage(pathname, hash);

  const elsewhere = [
    CONTACT.linkedin && { label: 'LinkedIn', href: CONTACT.linkedin, newTab: true },
    CONTACT.github && { label: 'GitHub', href: CONTACT.github, newTab: true },
    CONTACT.email && { label: 'Email', href: `mailto:${CONTACT.email}` }
  ].filter(Boolean);

  return (
    <header className={styles.header}>
      <Link className={styles.mark} to="/" aria-label={WORDS.homeLabel} onClick={toTop}>
        <Shape size={30} color="#2864E8" />
        {WORDS.name}
      </Link>

      <div className={styles.buttons}>
        <button
          ref={audienceButtonRef}
          type="button"
          className={styles.corner}
          aria-label={WORDS.audienceButton}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={show('audience')}
        >
          <span className={styles.dots} aria-hidden="true">
            {AUDIENCES.slice().reverse().map(({ sheet, color }) => (
              <Shape key={sheet} size={7} color={color} />
            ))}
          </span>
        </button>
        <button
          type="button"
          className={styles.corner}
          aria-label={WORDS.menuButton}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={show('menu')}
        >
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d="M1 1.5h16M1 8.5h16" />
          </svg>
        </button>
      </div>

      {isOpen && createPortal(
        <div
          ref={dialogRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={WORDS.dialog}
          data-first={open}
        >
          {/* A click on the dimmed page closes it. */}
          <div className={styles.dim} onClick={close} aria-hidden="true" />

          <div className={styles.layout}>
            <div className={styles.audiences} data-half="audience">
              {AUDIENCES.map(({ sheet, title, leadsTo, text, tag, color }, index) => (
                <button
                  key={sheet}
                  type="button"
                  className={styles.card}
                  style={{ '--card-color': color, '--card-index': index }}
                  onClick={openSheet(sheet)}
                >
                  <span className={styles.cardWords}>
                    <span className={styles.cardTop}>
                      <span className={styles.cardTitle}>
                        {title}
                        <Arrow />
                        <span className={styles.cardLeadsTo}>{leadsTo}</span>
                      </span>
                      <span className={styles.cardText}>{text}</span>
                    </span>
                    <span className={styles.cardTag}>{tag}</span>
                  </span>
                  <span className={styles.cardTile} aria-hidden="true">
                    <Arrow kind="out" size={72} className={styles.cardTileArrow} />
                  </span>
                </button>
              ))}

              <Link
                className={styles.talk}
                style={{ '--card-index': AUDIENCES.length }}
                to="/#contact"
                onClick={close}
              >
                {WORDS.talk}
                <Arrow size={18} />
              </Link>
            </div>

            <div className={styles.panel} data-half="menu">
              <p className={styles.panelLabel}>
                <Arrow size={14} />
                {WORDS.menu}
              </p>

              <nav className={styles.nav} aria-label="Site">
                {NAV.map((item) => {
                  const current = item.id === here;
                  return (
                    <Link
                      key={item.id}
                      className={cn(styles.navLink, current && styles.navLinkCurrent)}
                      to={`${item.to}${item.hash || ''}`}
                      aria-current={current ? 'page' : undefined}
                      onClick={follow(item)}
                    >
                      {item.label}
                      <Arrow kind={current ? 'here' : 'right'} size={current ? 22 : 20} className={styles.navArrow} />
                    </Link>
                  );
                })}
              </nav>

              {elsewhere.length > 0 && (
                <div className={styles.elsewhere}>
                  <p className={styles.elsewhereLabel}>{WORDS.elsewhere}</p>
                  {elsewhere.map(({ label, href, newTab }) => (
                    <a
                      key={label}
                      className={styles.elsewhereLink}
                      href={href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noreferrer' : undefined}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Last, so it sits on top of the menu's corner; Tab still reaches it. */}
          <button type="button" className={styles.close} aria-label={WORDS.close} onClick={close}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M2 2l10 10M12 2 2 12" />
            </svg>
          </button>
        </div>,
        document.body
      )}
    </header>
  );
}

export default SiteHeader;
