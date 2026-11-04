import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import GalleryItem from './GalleryItem';
import styles from './index.module.scss';

const DEFAULT_EVENTS = [
  {
    id: 'sandman',
    title: '2026 Sandman',
    imageUrl: '/assets/Lab/LiveEventsHover/band_group_photo.png',
  },
  {
    id: 'ginger-st-james',
    title: '2026 Ginger St. James',
    imageUrl: '/assets/Lab/LiveEventsHover/home_guitar_lady.png',
  },
  {
    id: 'redhill-valley',
    title: '2026 The Redhill Valley',
    imageUrl: '/assets/Lab/LiveEventsHover/live_2026_redhill_valley.png',
  },
  {
    id: 'supercrawl',
    title: '2025 Hamilton Supercrawl',
    imageUrl: '/assets/Lab/LiveEventsHover/hero_supercrawl.png',
  },
];

export default function LiveEventsHover({ className, events = DEFAULT_EVENTS }) {
  return (
    <div className={cn(styles.event_item, className)}>
      <div className={styles.event_header}>
        <h2 className={styles.event_info_title}>Live Music Events Covered</h2>
        <p className={styles.event_desc}>
          Available for live music and event photography in the Toronto, Hamilton, Niagara Region
        </p>
      </div>

      <div className={styles.event_gallery} role="list">
        {events.map((event) => (
          <GalleryItem
            key={event.id || event.title}
            title={event.title}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

LiveEventsHover.propTypes = {
  className: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ),
};