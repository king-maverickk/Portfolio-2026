import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './index.module.scss';

const recentPhotographyGallery = [
  {
    id: '2026-hamilton-fashion-week',
    date: 'april, 2026',
    title: '2026 Hamilton Fashion Week',
    itemCount: '78 items',
    videoSrc: '/assets/Lab/GalleryCard/2026_Hamilton_Fashion_Week.webm',
    posterSrc: '/assets/Lab/GalleryCard/posters/2026-hamilton-fashion-week.jpg',
    facebookAlbumUrl: 'https://www.facebook.com/media/set/?set=a.1599180562214745&type=3'
  },
  {
    id: '2026-hamilton-fashion-week-afterparty',
    date: 'april, 2026',
    title: '2026 Hamilton Fashion Week Afterparty',
    itemCount: '78 items',
    videoSrc: '/assets/Lab/GalleryCard/2026-hamilton-fashion-week-afterparty.webm',
    posterSrc: '/assets/Lab/GalleryCard/posters/2026-hamilton-fashion-week-afterparty.jpg',
    facebookAlbumUrl: 'https://www.facebook.com/media/set/?set=a.1601996715266463&type=3'
  },
  {
    id: '2026-sandman',
    date: 'march 2026',
    title: '2026 Sandman',
    itemCount: '78 items',
    videoSrc: '/assets/Lab/GalleryCard/2026-sandman.webm',
    posterSrc: '/assets/Lab/GalleryCard/posters/2026-sandman.jpg',
    facebookAlbumUrl: 'https://www.facebook.com/media/set/?set=a.1581247124008089&type=3'
  },
  {
    id: '2026-three-lions-boxing',
    date: 'march 2026',
    title: '2026 Three Lions Promotions Boxing in Sydney Nova Scotia',
    itemCount: '78 items',
    videoSrc: '/assets/Lab/GalleryCard/2026-three-lions-boxing.webm',
    posterSrc: '/assets/Lab/GalleryCard/posters/2026-three-lions-boxing.jpg',
    facebookAlbumUrl: 'https://www.facebook.com/media/set/?set=a.1572390431560425&type=3'
  }
];

function GalleryCard({ date, title, itemCount, videoSrc = '', posterSrc }) {
  return (
    <div className={styles.galleryCard}>
      <p className={styles.galleryDate}>{date}</p>

      <div className={styles.galleryContent}>
        <div className={styles.galleryMedia}>
          {videoSrc && (
            <video
              className={styles.galleryVideo}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          )}
        </div>

        <div className={styles.galleryInfo}>
          <p className={styles.galleryTitle}>{title}</p>
          <p className={styles.galleryItemsCount}>{itemCount}</p>
        </div>
      </div>
    </div>
  );
}

GalleryCard.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  itemCount: PropTypes.string.isRequired,
  videoSrc: PropTypes.string,
};

export default function HeadlessGalleryGrid({
  items = recentPhotographyGallery,
  className,
}) {
  // Limit to 4 items for display
  const displayItems = items.slice(0, 4);

  return (
    <div className={cn(styles.recent_photography_grid, className)}>
      {displayItems.map((item) => (
        <GalleryCard
          key={item.id || item.title}
          date={item.date}
          title={item.title}
          itemCount={item.itemCount}
          videoSrc={item.videoSrc}
          posterSrc={item.posterSrc}
        />
      ))}
    </div>
  );
}

HeadlessGalleryGrid.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      itemCount: PropTypes.string.isRequired,
      videoSrc: PropTypes.string,
      posterSrc: PropTypes.string,
    })
  ),
};