import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'; // the prebuilt copy, which Jest can read
import styles from './GalleryItem.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryItem({ title, imageUrl }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const titleEl = titleRef.current;

    if (!container || !image || !titleEl) return undefined;

    // Use gsap.context to auto-clean timelines, matchMedia, and ScrollTriggers
    const ctx = gsap.context(() => {
      gsap.set(image, { scale: 0, opacity: 0, yPercent: -50 });

      const tl = gsap.timeline({ paused: true });

      tl.to(container, {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        duration: 0.4,
        ease: 'power2.inOut',
      }, 0);

      tl.to(titleEl, {
        color: 'rgb(30, 30, 30)',
        duration: 0.4,
        ease: 'power2.inOut',
      }, 0);

      tl.to(image, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 0.1);

      const onMouseEnter = () => tl.play();
      const onMouseLeave = () => tl.reverse();

      container.addEventListener('mouseenter', onMouseEnter);
      container.addEventListener('mouseleave', onMouseLeave);

      const mm = gsap.matchMedia();
      mm.add('(max-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => tl.play(),
          onLeave: () => tl.reverse(),
          onEnterBack: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.gallery_item_container} role="listitem">
      <div className={styles.content_wrapper}>
        <h3 ref={titleRef} className={styles.title}>
          {title}
        </h3>
      </div>
      <img
        ref={imageRef}
        src={imageUrl}
        alt={title}
        className={styles.hover_image}
      />
    </div>
  );
}

GalleryItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};