import React from 'react';
import cn from 'classnames';

import { ArrowUpRightIcon, GithubIcon, LinkedinIcon } from '../Icons';
import profiles from '../data/profiles';
import styles from './index.module.scss';

// The GitHub and LinkedIn cards. Each whole card is one link that opens in a new tab.
function ProfileCards() {
  const { github, linkedin } = profiles;

  return (
    <div className={styles.cards}>
      <a
        className={cn(styles.card, styles.github)}
        href={github.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`GitHub profile ${github.handle} (opens in a new tab)`}
      >
        <span className={styles.head}>
          <GithubIcon className={styles.headIcon} />
          GitHub
        </span>
        <span className={styles.body}>
          <span className={styles.top}>
            <span className={styles.name}>{github.handle}</span>
            <img className={styles.avatar} src={github.avatar} alt="" width="34" height="34" />
          </span>
          <span className={cn(styles.about, styles.aboutSmall)}>{github.about}</span>
          <span className={styles.row}>
            {github.stats.map((stat) => (
              <span className={styles.stat} key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
                {stat.note && <small className={styles.note}>{stat.note}</small>}
              </span>
            ))}
          </span>
        </span>
      </a>

      <a
        className={cn(styles.card, styles.linkedin)}
        href={linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`LinkedIn profile: ${linkedin.name} (opens in a new tab)`}
      >
        <span className={styles.head}>
          <LinkedinIcon className={styles.headIcon} />
          LinkedIn
        </span>
        <span className={styles.body}>
          <span className={styles.top}>
            <span className={styles.name}>{linkedin.name}</span>
            <img className={styles.avatar} src={linkedin.avatar} alt="" width="34" height="34" />
          </span>
          <span className={styles.about}>{linkedin.about}</span>
          <span className={styles.row}>
            <span className={cn(styles.foot, styles.view)}>
              {linkedin.action}
              <ArrowUpRightIcon className={styles.viewIcon} />
            </span>
            {linkedin.tags.map((tag) => <span className={styles.foot} key={tag}>{tag}</span>)}
          </span>
        </span>
      </a>
    </div>
  );
}

export default ProfileCards;
