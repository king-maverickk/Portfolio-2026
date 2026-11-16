import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import hx from './hiringSheet.module.scss';

// Proof, as scenarios: one small card per situation. The figure at the top
// carries the point (400 albums = 2 hr job), so the card can be read at a
// glance; the sentence under it is there for whoever wants the how.
//
// The words are in copy.js (HIRING.proof.scenarios).

// What a screen reader says for the sign between two tiles.
const JOINER_WORDS = { '=': 'equals', '→': 'then', vs: 'instead of' };

function Figure({ joiner, parts }) {
  return (
    <div className={hx.figure}>
      {parts.map(({ value, label, quiet }, index) => (
        <React.Fragment key={label}>
          {index > 0 && (
            <span className={hx.figureJoiner}>
              <span aria-hidden="true">{joiner}</span>
              <span className={hx.srOnly}>{JOINER_WORDS[joiner] || joiner}</span>
            </span>
          )}
          <span className={cn(hx.figureTile, quiet && hx.figureTileQuiet)}>
            <span className={hx.figureValue}>{value}</span>
            <span className={hx.figureLabel}>{label}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

const partShape = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  quiet: PropTypes.bool
});

Figure.propTypes = {
  joiner: PropTypes.oneOf(['=', '→', 'vs']).isRequired,
  parts: PropTypes.arrayOf(partShape).isRequired
};

function Scenarios({ scenarios }) {
  return (
    <ul className={hx.scenarios}>
      {scenarios.map(({ id, tag, figure, title, text, project, to }) => (
        <li className={hx.scenario} key={id}>
          <Figure {...figure} />
          <div className={hx.scenarioBody}>
            <span className={hx.scenarioTag}>{tag}</span>
            <h4 className={hx.scenarioTitle}>{title}</h4>
            <div className={hx.scenarioText}>{text}</div>
          </div>
          <Link className={hx.scenarioLink} to={to} aria-label={`${title}: see ${project}`}>
            {project}
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

Scenarios.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    figure: PropTypes.shape(Figure.propTypes).isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  })).isRequired
};

export default Scenarios;
