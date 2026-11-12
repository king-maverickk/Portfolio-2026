import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import TOOL_ICONS from './toolIcons';
import styles from './ProjectStory-LivingHistories.module.scss';

const SHOW_DRAFT_MARKERS = process.env.NODE_ENV !== 'production';

// The body of a project page that tells its story top to bottom: a big
// sentence, the facts, who did what, then a document. The heading, the slim
// bar and the glide back to the list are ProjectDetail's; this is what sits
// where the two-column view sits for other projects. Words live in
// stories/<project>.js.

// --- Small pieces -----------------------------------------------------------------

// **bold**, `code` and [links](https://...) inside a string.
const TOKENS = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function Rich({ text }) {
  return text.split(TOKENS).filter(Boolean).map((chunk, index) => {
    if (chunk.startsWith('**')) return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    if (chunk.startsWith('`')) return <code key={index} className={styles.inlineCode}>{chunk.slice(1, -1)}</code>;
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={index} className={styles.link} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
          <span className={styles.srOnly}> (opens in a new tab)</span>
        </a>
      );
    }
    return <React.Fragment key={index}>{chunk}</React.Fragment>;
  });
}

Rich.propTypes = { text: PropTypes.string.isRequired };

function DraftTag() {
  if (!SHOW_DRAFT_MARKERS) return null;
  return <span className={styles.draftTag} data-draft="">draft</span>;
}

// The big sentence: words with small pictures between them. A picture stays
// on the same line as the word before it and the punctuation after it, so it
// can't end up alone at the start of a line.
const PUNCTUATION = /^[,.;:!?]+/;

function Lede({ parts }) {
  const nodes = [];

  parts.forEach((part, index) => {
    if (typeof part !== 'string') return; // placed with the word before it

    const afterPicture = index > 0 && typeof parts[index - 1] !== 'string';
    let text = part;
    let lead = '';
    if (afterPicture) {
      const moved = text.match(PUNCTUATION);
      if (moved) text = text.slice(moved[0].length); // already placed beside the picture
      else lead = ' ';
    } else if (index > 0 && !PUNCTUATION.test(text)) {
      lead = ' ';
    }

    const picture = parts[index + 1];
    if (picture && typeof picture !== 'string') {
      const following = parts[index + 2];
      const punctuation = typeof following === 'string' ? (following.match(PUNCTUATION) || [''])[0] : '';
      const [, head = '', word = text] = text.match(/^([\s\S]*?)(\S+)$/) || [];
      nodes.push(
        <React.Fragment key={index}>
          {lead}{head}
          <span className={styles.bind}>
            {word}{' '}
            <img
              className={styles.ledePic}
              style={picture.ratio ? { aspectRatio: picture.ratio } : undefined}
              src={picture.img}
              alt={picture.alt || ''}
            />
            {punctuation}
          </span>
        </React.Fragment>
      );
    } else {
      nodes.push(<React.Fragment key={index}>{lead}{text}</React.Fragment>);
    }
  });

  return <p className={styles.lede}>{nodes}</p>;
}

Lede.propTypes = { parts: PropTypes.array.isRequired };

// --- Icons -------------------------------------------------------------------------

// Simple line icons (24 x 24, drawn with a stroke). React and Figma use the
// real logos from toolIcons.js instead.
const LINE_ICONS = {
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  cloud: <path d="M7 18.5a4.25 4.25 0 0 1-.6-8.46 5.75 5.75 0 0 1 11.1 1.2A3.65 3.65 0 0 1 17 18.5H7z" />,
  slides: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8" />
    </>
  ),
  photos: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="m21 16-5-5-8 9" />
    </>
  )
};

function RoleIcon({ name }) {
  const brand = TOOL_ICONS[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.iconFilled}>
        <path d={brand.path} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.iconLine}>
      {LINE_ICONS[name]}
    </svg>
  );
}

RoleIcon.propTypes = { name: PropTypes.string.isRequired };

function MediaIcon({ kind }) {
  if (kind === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.iconYoutube}>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#ff1f3d" />
        <path d="m10 9 5 3-5 3z" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.iconLine}>
      {LINE_ICONS.photos}
    </svg>
  );
}

MediaIcon.propTypes = { kind: PropTypes.string };

// --- Top: facts and roles -----------------------------------------------------------

function Facts({ facts }) {
  const { type, team = [], result, media = [] } = facts;
  return (
    <dl className={styles.facts}>
      <div className={styles.factRow}>
        <dt className={styles.factLabel}>Type</dt>
        <dd className={styles.factValue}>{type}</dd>
      </div>

      <div className={styles.factRow}>
        <dt className={styles.factLabel}>Team</dt>
        <dd className={styles.factValue}>
          <ul className={styles.chips}>
            {team.map((person) => {
              const avatar = person.photo ? (
                <img className={cn(styles.avatar, styles.avatarPhoto)} src={person.photo} alt="" />
              ) : (
                <span className={styles.avatar} aria-hidden="true">{person.initials}</span>
              );
              if (!person.href) {
                return (
                  <li key={person.name} className={styles.chip}>
                    {avatar}
                    {person.name}
                  </li>
                );
              }
              return (
                <li key={person.name}>
                  <a
                    className={cn(styles.chip, styles.chipLink)}
                    href={person.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={person.title}
                  >
                    {avatar}
                    {person.name}
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                    <span className={styles.chipArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              );
            })}
            {result && (
              <li className={styles.chip}>
                <img className={styles.medal} src={result.img} alt="" />
                {result.label}
              </li>
            )}
          </ul>
        </dd>
      </div>

      {media.length > 0 && (
        <div className={styles.factRow}>
          <dt className={styles.factLabel}>Media</dt>
          <dd className={styles.factValue}>
            <ul className={styles.chips}>
              {media.map((item) => (
                <li key={item.href}>
                  <a
                    className={cn(styles.chip, styles.chipLink)}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.title}
                  >
                    <span className={styles.chipIcon}><MediaIcon kind={item.kind} /></span>
                    {item.label}
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                    <span className={styles.chipArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
    </dl>
  );
}

Facts.propTypes = { facts: PropTypes.object.isRequired };

function Roles({ roles }) {
  if (!roles?.length) return null;
  return (
    <section className={styles.roles} aria-labelledby="story-roles">
      <h2 id="story-roles" className={styles.eyebrow}>My role</h2>
      <ul className={styles.roleCards}>
        {roles.map((role) => (
          <li key={role.title} className={styles.roleCard}>
            <h3 className={styles.roleTitle}>{role.title}</h3>
            <ol className={styles.timeline}>
              {role.steps.map((step) => (
                <li key={step.label} className={styles.timelineStep}>
                  <span className={styles.node}><RoleIcon name={step.icon} /></span>
                  {step.label}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}

Roles.propTypes = { roles: PropTypes.array };

// --- The document -------------------------------------------------------------------

// A line of code with its // comment set apart.
function CodeLine({ line, language }) {
  const at = language === 'js' ? line.indexOf('//') : -1;
  if (at === -1) return <>{line}</>;
  return (
    <>
      {line.slice(0, at)}
      <span className={styles.comment}>{line.slice(at)}</span>
    </>
  );
}

CodeLine.propTypes = { line: PropTypes.string.isRequired, language: PropTypes.string };

function CodeBlock({ title, language = 'text', code, caption }) {
  const lines = code.split('\n');
  return (
    <figure className={styles.code}>
      <div className={styles.codeBar}>
        <span>{title}</span>
        <span aria-hidden="true">{language === 'js' ? 'JavaScript' : 'Overview'}</span>
      </div>
      <pre className={styles.pre} tabIndex={0} role="region" aria-label={title}>
        <code>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              <CodeLine line={line} language={language} />
              {index < lines.length - 1 ? '\n' : ''}
            </React.Fragment>
          ))}
        </code>
      </pre>
      {caption && <figcaption className={styles.codeCaption}><Rich text={caption} /></figcaption>}
    </figure>
  );
}

CodeBlock.propTypes = {
  title: PropTypes.string.isRequired,
  language: PropTypes.string,
  code: PropTypes.string.isRequired,
  caption: PropTypes.string
};

// One step of the Process: what it was, what it became, and why.
function Stage({ block, number }) {
  const { title, before, after, afterLabel = 'After', rows = [], visual, code } = block;
  return (
    <section className={styles.stage} aria-label={title}>
      <p className={styles.stageNumber} aria-hidden="true">{String(number).padStart(2, '0')}</p>
      <h3 className={styles.stageTitle}>{title}</h3>

      {(before || after) && (
        <div className={styles.compare}>
          {before && (
            <div className={styles.compareCard}>
              <p className={styles.compareLabel}>Before</p>
              <p className={styles.compareText}><Rich text={before} /></p>
            </div>
          )}
          {after && (
            <div className={cn(styles.compareCard, styles.compareAfter)}>
              <p className={styles.compareLabel}>{afterLabel}</p>
              <p className={styles.compareText}><Rich text={after} /></p>
            </div>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div className={styles.rows}>
          {rows.map((row) => (
            <p key={row.label} className={styles.row}>
              <span className={styles.rowLabel}>{row.label}</span>
              <span><Rich text={row.text} /></span>
            </p>
          ))}
        </div>
      )}

      {code && <CodeBlock {...code} />}

      {SHOW_DRAFT_MARKERS && visual && (
        <p className={styles.placeholder} data-draft="">
          <span className={styles.placeholderTag}>to add</span>
          {visual}
        </p>
      )}
    </section>
  );
}

Stage.propTypes = { block: PropTypes.object.isRequired, number: PropTypes.number.isRequired };

function Block({ block, stageNumber }) {
  switch (block.type) {
    case 'p':
      return <p className={styles.p}><Rich text={block.text} /></p>;
    case 'h3':
      return <h3 className={styles.subTitle}>{block.text}</h3>;
    case 'figure':
      return (
        <figure className={styles.figure}>
          <img className={styles.figurePic} src={block.src} alt={block.alt || ''} loading="lazy" decoding="async" />
          {block.caption && <figcaption className={styles.figureCaption}>{block.caption}</figcaption>}
        </figure>
      );
    case 'code':
      return <CodeBlock title={block.title} language={block.language} code={block.code} caption={block.caption} />;
    case 'stage':
      return <Stage block={block} number={stageNumber} />;
    case 'draft':
      return SHOW_DRAFT_MARKERS ? <p className={styles.draftNote}><DraftTag /> {block.text}</p> : null;
    default:
      return null;
  }
}

Block.propTypes = { block: PropTypes.object.isRequired, stageNumber: PropTypes.number };

function DocSection({ section }) {
  let stages = 0;
  return (
    <section className={styles.docSection} aria-labelledby={`story-${section.id}`}>
      <h2 id={`story-${section.id}`} className={styles.docTitle}>{section.title}</h2>
      {section.blocks.map((block, index) => {
        if (block.type === 'stage') stages += 1;
        return <Block key={index} block={block} stageNumber={stages} />;
      })}
    </section>
  );
}

DocSection.propTypes = { section: PropTypes.object.isRequired };

// --- The page body --------------------------------------------------------------------

function ProjectStoryLivingHistories({ story }) {
  const { lede, facts, roles, doc = [] } = story;
  return (
    <div className={styles.story}>
      <div className={styles.top}>
        <Lede parts={lede} />
        <Facts facts={facts} />
        <Roles roles={roles} />
      </div>

      <article className={styles.doc} aria-label="The full story">
        <div className={styles.docInner}>
          {doc.map((section) => <DocSection key={section.id} section={section} />)}
        </div>
      </article>
    </div>
  );
}

ProjectStoryLivingHistories.propTypes = {
  story: PropTypes.shape({
    lede: PropTypes.array.isRequired,
    facts: PropTypes.object.isRequired,
    roles: PropTypes.array,
    doc: PropTypes.array
  }).isRequired
};

export default ProjectStoryLivingHistories;
