import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import InlineImg from '../InlineImg';
import HoverWords from 'components/HoverWords';

import styles from './index.module.scss';

// Simple stand-in icons. Swap for your own set when you have it. For the footer.
const ICON_PATHS = {
  document: (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  arrow: <path d="M7 17 17 7M9 7h8v8" />,
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(ICON_PATHS)).isRequired,
};

function AboutMotheo({
  className,
  resumeHref,
  coverLetterHref,
  freelanceHref,
  projectHref,
  projectImage,
}) {
  // A link only renders once it has a destination, so nothing ships dead.
  const links = [
    { label: 'Resume', href: resumeHref, icon: 'document' },
    { label: 'General cover letter', href: coverLetterHref, icon: 'document' },
    { label: 'Freelance enquiries', href: freelanceHref, icon: 'briefcase' },
  ].filter(({ href }) => href);

  const ProjectCard = projectHref ? 'a' : 'div';

  return ( 
    <section
      className={cn(styles.section, className, 'aboutmotheo')}
    >
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h2 className={styles.headline}>motheo moleko</h2>
          <p className={styles.subtitle}>
            designer-developer
          </p>
        </div>
        <div
          className={styles.photo}
          role="img"
          aria-label="Photo placeholder"
        />
      </div>
      <div className={styles.detailsColumn}>
        {/*
          Every <InlineImg> below is a grey placeholder. Swap each one for its
          asset by adding `src={...}` (or `icon={...}`), and set `ratio` to the
          real width / height:
            languages -> speech bubbles     design     -> colour wheel
            code      -> </> chip           cloud      -> Azure mark
            3rd       -> medal              references -> screenshot collage
            notebook  -> notebook page      creatives  -> "Digital Creative" chip
        */}
        <div className={styles.intro}>
          <p className={styles.label}>about</p>
          <p className={styles.lead}>
                I speak six{' '}
                <InlineImg ratio={1.2} src={`/assets/Home/about_speech_bubble.png`} after=",">languages</InlineImg> plus{' '}
                <InlineImg ratio={1} src={`assets/Home/about_design_wheel.png`}>design</InlineImg> and{' '}
                <InlineImg ratio={1.5} src={`assets/Home/about_code_chip.png`} after=".">code</InlineImg> Based in Hamilton, I
                design websites and build them too.
          </p>
          <p className={styles.statement}>
            <HoverWords>
                I started in code and followed my eye toward design, so now I can do
                both. Every project gets a look built around what it needs to do.
            </HoverWords>
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.paragraphs}>
            <section className={styles.entry}>
              <h3 className={styles.entryTitle}>My Path</h3>
              <p className={styles.entryText}>
                Six years ago I began teaching myself to code, and I learned by
                building: full-stack apps,{' '}
                <InlineImg ratio={1} src={`assets/Home/about_azure_logo.png`} after=",">cloud</InlineImg> and the DevOps
                work of getting something live and keeping it there. Somewhere
                along the way design started pulling at me, until I was spending
                as much time on how things looked and moved as on how they worked. 
                <br/> <br/>
                I’ve competed in three hackathons, placing{' '}
                <InlineImg ratio={1} src={`assets/Home/about_bronze_medal.png`}>3rd</InlineImg> at a Microsoft one in 2025
                for building a generative AI app that turns historical topics 
                into geotagged podcast shorts with audio narration, and I’ve 
                shipped three sites since then.
              </p>
            </section>

            <section className={styles.entry}>
              <h3 className={styles.entryTitle}>My Craft</h3>
              <p className={styles.entryText}>
                I spend hours collecting{' '}
                <InlineImg ratio={1.3} src={`assets/Home/about_references.png`} after=":">references</InlineImg> layouts,
                color combinations, interactions I can’t stop thinking about. I
                keep a <InlineImg src={`assets/Home/about_notebook_collage.png`} ratio={1.4}>notebook</InlineImg> where I work
                out how I’d recreate them, how the layout is built, how the motion
                probably works. Most of those ideas never leave the page. The ones
                that do get everything I’ve got, and I don’t stop until they’re
                ready for the people who’ll use them.
              </p>
            </section>

            <section className={styles.entry}>
              <h3 className={styles.entryTitle}>The Community</h3>
              <p className={styles.entryText}>
                Hamilton is a small city, and finding other digital creatives in
                it wasn’t easy. I wanted people to talk shop with, so I started
                Hamilton Creative Group, a place for designers, developers,
                animators and other digital media{' '}
                <InlineImg ratio={2.2} src={`assets/Home/about_hcg_mouse.png`}>creatives</InlineImg> to meet up. Now we
                have two weekly meetups. It’s the same instinct as everything
                above: if what I want isn’t there, I build it.
              </p>
            </section>

            <ProjectCard className={styles.projectCard} href={projectHref}>
              {projectImage ? (
                <img
                  className={styles.projectThumb}
                  src={projectImage}
                  alt=""
                />
              ) : (
                <span className={styles.projectThumb} aria-hidden="true" />
              )}
              <span className={styles.projectBody}>
                <span className={styles.projectTitle}>
                  Hamilton Creative Group Website
                </span>
                <span className={styles.projectMeta}>
                  <span className={styles.tag}>Community</span>
                  <span className={styles.tag}>Weekly meets</span>
                  <span className={styles.arrow}>
                    <Icon name="arrow" />
                  </span>
                </span>
              </span>
            </ProjectCard>
          </div>
        </div>

        {links.length > 0 && (
          <ul className={styles.links}>
            {links.map(({ label, href, icon }) => (
              <li key={label}>
                <a className={styles.link} href={href}>
                  <Icon name={icon} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

AboutMotheo.propTypes = {
  className: PropTypes.string,
  resumeHref: PropTypes.string,
  coverLetterHref: PropTypes.string,
  freelanceHref: PropTypes.string,
  projectHref: PropTypes.string,
  projectImage: PropTypes.string,
};

export default AboutMotheo;