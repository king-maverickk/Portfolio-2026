import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './index.module.scss';

// Images at least this wide (width / height) flip on hover instead of
// spinning, so a wide chip doesn't swing across the neighbouring lines.
const WIDE_RATIO = 1.6;

/**
 * An image (or inline SVG) that sits inside a line of text and scales with it.
 * On hover it spins once, quickly (wide images flip instead).
 *
 * - `children`  The word the image should stay attached to (pass ONE word).
 *               The word, the image and `after` are wrapped in a nowrap span,
 *               so the image can never start a new line on its own. Hovering
 *               the word spins the image too.
 * - `after`     Punctuation that follows the image (",", ".", ":"). It goes
 *               inside the nowrap span so it can't be orphaned either.
 * - `src`       Image URL. Omit `src` and `icon` to render a grey placeholder.
 * - `icon`      A React node (e.g. an inline <svg>) instead of `src`.
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
  const [spinning, setSpinning] = useState(false);

  const isPlaceholder = !src && !icon;
  const hasFixedBox = Boolean(ratio) || Boolean(icon) || isPlaceholder;
  const isWide = ratio >= WIDE_RATIO;
  const isBound = Boolean(children || after);

  // Hover starts one spin. It's released when the animation ends, so the spin
  // always completes (no snapping back if the cursor leaves early) and never
  // plays in reverse.
  const hoverProps = { onMouseEnter: () => setSpinning(true) };

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
          [styles.wide]: isWide,
          [styles.spinning]: spinning,
        },
        className,
      )}
      style={style}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setSpinning(false);
      }}
      {...(isBound ? {} : hoverProps)}
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

  if (!isBound) return media;

  return (
    <span className={styles.bind} {...hoverProps}>
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