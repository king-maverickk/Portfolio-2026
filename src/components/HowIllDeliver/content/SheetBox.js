import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { DraftTag } from './Blocks';
import sx from './freelanceSheet.module.scss';

// One container of a sheet built from containers (Freelance / contract, and
// the lower half of Hiring managers). Closed, it is a pale row: bold title, a
// one-line hint and a + . Open, it turns solid white and lifts.
//
// The look lives in freelanceSheet.module.scss (.box and friends). A sheet can
// retune it with custom properties on a parent: see the list above .box there.

// How long a container takes to open (keep in step with .boxBody's transition).
const TOGGLE_MS = 420;

function SheetBox({
  id,
  title,
  titleAs: Heading = 'h3',
  titleId,
  teaser,
  draft = false,
  collapsible = true,
  open: openProp = false,
  onToggle,
  className,
  children
}) {
  const open = collapsible ? openProp : true;
  const headingId = titleId || `${id}-title`;
  const innerRef = useRef(null);
  // Once fully open, the container stops clipping its content. Closing clips
  // again straight away, so the slide shut stays clean.
  const [settled, setSettled] = useState(open);

  useEffect(() => {
    if (!open) {
      setSettled(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setSettled(true), TOGGLE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Closed content can't be tabbed into (aria-hidden below hides it from
  // screen readers in browsers without inert).
  useEffect(() => {
    if (innerRef.current) innerRef.current.inert = !open;
  }, [open]);

  return (
    <section
      className={cn(sx.box, { [sx.open]: open, [sx.settled]: settled }, className)}
      aria-labelledby={headingId}
    >
      <Heading className={sx.boxHeading} id={headingId}>
        {collapsible ? (
          <button
            type="button"
            className={sx.boxHead}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            onClick={onToggle}
          >
            <span className={sx.boxLabel}>
              <span className={sx.boxTitle}>{title}</span>
              {draft && <DraftTag />}
            </span>
            {teaser && <span className={sx.boxTeaser}>{teaser}</span>}
            <span className={sx.boxToggle} aria-hidden="true" />
          </button>
        ) : (
          <span className={sx.boxHead}>
            <span className={sx.boxLabel}>
              <span className={sx.boxTitle}>{title}</span>
              {draft && <DraftTag />}
            </span>
          </span>
        )}
      </Heading>
      <div className={sx.boxBody} id={`${id}-body`}>
        <div className={sx.boxInner} ref={innerRef} aria-hidden={!open}>
          <div className={sx.boxContent}>{children}</div>
        </div>
      </div>
    </section>
  );
}

SheetBox.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleAs: PropTypes.oneOf(['h2', 'h3']),
  titleId: PropTypes.string,
  teaser: PropTypes.string,
  draft: PropTypes.bool,
  collapsible: PropTypes.bool,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

export default SheetBox;
