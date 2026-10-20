import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

/**
 * An image (or inline SVG) that sits inside a line of text and scales with it.
 *
 * - `children`  The word the image should stay attached to (pass ONE word).
 *               The word, the image and `after` are wrapped in a nowrap span,
 *               so the image can never start a new line on its own.
 * - `after`     Punctuation that follows the image (",", ".", ":"). It goes
 *               inside the nowrap span so it can't be orphaned either.
 * - `src`       Image URL. Omit `src` and `icon` to render a grey placeholder.
 * - `icon`      A React node (e.g. an inline <svg>) instead of `src`, handy
 *               when you want to animate it.
 * - `alt`       Leave empty for decorative images (the default). Pass text only
 *               when the image carries meaning the sentence doesn't.
 * - `ratio`     width / height. Reserves space before the image loads and
 *               crops with object-fit: cover. Omit it to use the file's own
 *               proportions.
 * - `size`      Height in em (a unitless number). Falls back to the inherited
 *               --inline-img-size custom property, then 1.1.
 * - `shape`     'pill' | 'soft' | 'square'. Falls back to the inherited
 *               --inline-img-radius custom property, then 'soft'.
 */
function InlineImg({
  children,
  after,
  src,
  alt,
  icon,
  ratio,
  size,
  shape,
  className,
}) {
  const isPlaceholder = !src && !icon;
  const hasFixedBox = Boolean(ratio) || Boolean(icon) || isPlaceholder;

  const style = {};
  if (size) style['--inline-img-size'] = size;
  if (hasFixedBox) style['--inline-img-ratio'] = ratio || 1;

  const media = (
    <span
      className={cn(
        styles.media,
        shape && styles[shape],
        {
          [styles.fixed]: hasFixedBox,
          [styles.placeholder]: isPlaceholder,
        },
        className,
      )}
      style={style}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {src && (
        <img
          className={styles.img}
          src={src}
          alt=""
          decoding="async"
          loading="lazy"
        />
      )}
      {icon}
    </span>
  );

  if (!children && !after) return media;

  return (
    <span className={styles.bind}>
      {children}
      {media}
      {after}
    </span>
  );
}

InlineImg.propTypes = {
  children: PropTypes.node,
  after: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  icon: PropTypes.node,
  ratio: PropTypes.number,
  size: PropTypes.number,
  shape: PropTypes.oneOf(['pill', 'soft', 'square']),
  className: PropTypes.string,
};

export default InlineImg;