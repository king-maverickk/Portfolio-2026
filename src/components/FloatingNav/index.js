import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

const NAV_ITEMS = [
  {
    label: 'Home',
    eyebrow: 'familiar',
    preview: '/assets/Lab/PhotosByAlexNav/home_cover.png',
    alt: 'Alex photographing a warm family moment at home',
  },
  {
    label: 'Wedding',
    eyebrow: 'celebrate',
    preview: '/assets/Lab/PhotosByAlexNav/wedding_page_cover.png',
    alt: 'Wedding couple sharing a modern candid moment',
  },
  {
    label: 'Live Events',
    eyebrow: 'in motion',
    preview: '/assets/Lab/PhotosByAlexNav/live_events_cover.png',
    alt: 'Live event photography from Supercrawl',
  },
  {
    label: 'Contact',
    eyebrow: 'let’s talk',
    preview: '/assets/Lab/PhotosByAlexNav/contact_cover.png',
    alt: 'Wedding couple portrait from Photos by Alex',
  },
  {
    label: 'Past Photography',
    eyebrow: 'archive',
    preview: '/assets/Lab/PhotosByAlexNav/facebookalbums_cover.png',
    alt: 'Past projects from Photos by Alex',
  },
];

export default function FloatingNav({ preview = false, activeIndex = 0 }) {
  const shellRef = useRef(null);
  const dragRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const activeItem = NAV_ITEMS[activeIndex] || NAV_ITEMS[0];

  useEffect(() => {
    if (!isExpanded) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    const handlePointerDown = (event) => {
      if (shellRef.current && !shellRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isDragging) return undefined;

    const handlePointerMove = (event) => {
      if (!dragRef.current) return;
      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;
      setDragOffset({
        x: Math.max(-96, Math.min(96, dragRef.current.originX + deltaX)),
        y: Math.max(-32, Math.min(32, dragRef.current.originY + deltaY)),
      });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (event) => {
    if (event.target.closest('button')) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: dragOffset.x,
      originY: dragOffset.y,
    };
    setIsDragging(true);
  };

  const displayedPreview = previewItem || activeItem;

  return (
    <aside
      ref={shellRef}
      className={`${styles.shell} ${preview ? styles.previewMode : ''} ${isExpanded ? styles.isExpanded : ''} ${isDragging ? styles.isDragging : ''}`}
      style={{
        '--drag-x': `${dragOffset.x}px`,
        '--drag-y': `${dragOffset.y}px`,
      }}
      onPointerDown={handlePointerDown}
      aria-label="Photos by Alex navigation"
    >
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <span className={styles.logoFrame}>
            <img src="/assets/Lab/PhotosByAlexNav/PBA-logo.jpg" alt="" className={styles.logo} />
          </span>
          <span className={styles.brandText}>Photos by Alex</span>
        </div>

        <button
          type="button"
          className={`${styles.menuButton} ${isExpanded ? styles.menuButtonOpen : ''}`}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-controls="photos-by-alex-navigation"
          aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="photos-by-alex-navigation"
        className={styles.expandedContent}
        aria-hidden={!isExpanded}
      >
        <div className={styles.navigationColumn}>
          <p className={styles.kicker}>Make room for the good stuff.</p>
          <div className={styles.navigation} role="list">
            {NAV_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.label}
                  role="listitem"
                  tabIndex={0}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onMouseEnter={() => setPreviewItem(item)}
                  onFocus={() => setPreviewItem(item)}
                >
                  <span className={styles.navIndex}>0{index + 1}</span>
                  <span className={styles.navLabelGroup}>
                    <span className={styles.navEyebrow}>{item.eyebrow}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </span>
                  <span className={styles.navArrow} aria-hidden="true">
                    <img src="/assets/Lab/PhotosByAlexNav/ArrowUpRight.svg" alt="" />
                  </span>
                </div>
              );
            })}
          </div>
          <p className={styles.footerNote}>Stories, celebrations, and all the in-between moments.</p>
        </div>

        <div className={styles.previewColumn}>
          <div className={styles.previewMedia}>
            <img key={displayedPreview.preview} src={displayedPreview.preview} alt={displayedPreview.alt} />
            <div className={styles.previewOverlay}>
              <span>Previewing</span>
              <strong>{displayedPreview.label}</strong>
            </div>
          </div>
          <span className={styles.previewCaption}>Photos by Alex / Hamilton, ON</span>
        </div>
      </div>
    </aside>
  );
}