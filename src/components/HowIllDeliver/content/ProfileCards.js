import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { HIRING } from './copy';
import { Icon } from './Blocks';
import hx from './hiringSheet.module.scss';

// Your LinkedIn and GitHub cards, rebuilt in HTML from the Figma exports so
// they stay sharp and reflow at any width: a tinted frame with the service's
// name, and a white card inside it.
//
// Each card has one real link ("View Profile", the GitHub handle). Its click
// area is stretched over the whole card, so anywhere on the card opens it.
// "Open to Work" and "Skills" are words, not links.
//
// The words and numbers are in copy.js (HIRING.online).

function Avatar({ src, initials }) {
  if (src) return <img className={hx.avatar} src={src} alt="" loading="lazy" decoding="async" />;
  return <span className={cn(hx.avatar, hx.avatarEmpty)} aria-hidden="true">{initials}</span>;
}

Avatar.propTypes = {
  src: PropTypes.string,
  initials: PropTypes.string
};

function Frame({ service, icon, tone, children }) {
  return (
    <li className={cn(hx.profile, tone)}>
      <div className={hx.profileService}>
        <Icon name={icon} className={hx.profileLogo} />
        {service}
      </div>
      <div className={hx.profileCard}>{children}</div>
    </li>
  );
}

Frame.propTypes = {
  service: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  tone: PropTypes.string,
  children: PropTypes.node
};

const external = { target: '_blank', rel: 'noopener noreferrer' };

function ProfileCards() {
  const { linkedin, github } = HIRING.online;

  return (
    <ul className={hx.profiles}>
      <Frame service="LinkedIn" icon="linkedin" tone={hx.profileLinkedin}>
        <div className={hx.profileTop}>
          <span className={hx.profileName}>{linkedin.name}</span>
          <Avatar src={linkedin.avatar} initials={linkedin.initials} />
        </div>
        <div className={hx.profileText}>{linkedin.headline}</div>
        <div className={hx.profileFoot}>
          <a className={cn(hx.profileLink, hx.profileLinkAccent)} href={linkedin.href} {...external}>
            {linkedin.cta}
            <Icon name="arrow" className={hx.profileArrow} />
          </a>
          {linkedin.notes.map((note) => (
            <span className={hx.profileNote} key={note}>{note}</span>
          ))}
        </div>
      </Frame>

      <Frame service="GitHub" icon="github" tone={hx.profileGithub}>
        <div className={hx.profileTop}>
          <a className={cn(hx.profileLink, hx.profileName)} href={github.href} {...external}>
            {github.handle}
          </a>
          <Avatar src={github.avatar} initials={github.initials} />
        </div>
        <div className={hx.profileText}>{github.bio}</div>
        <ul className={hx.profileStats}>
          {github.stats.map(({ value, label }) => (
            <li key={label}>
              <strong>{value}</strong> {label}
            </li>
          ))}
        </ul>
      </Frame>
    </ul>
  );
}

export default ProfileCards;
