import React from 'react';

import { ArrowRightIcon } from '../Icons';
import { DELIVERABLES } from '../data/freelance';
import styles from './DeliverablesFile.module.scss';

// "What you get": two prices, the problems each page solves, and what happens after launch.
function DeliverablesFile() {
  return (
    <div className={styles.deliverables}>
      <h3 className={styles.title}>{DELIVERABLES.title}</h3>
      <p className={styles.intro}>{DELIVERABLES.intro}</p>

      <ul className={styles.packages}>
        {DELIVERABLES.packages.map((item) => (
          <li className={styles.package} key={item.name}>
            <h4 className={styles.packageName}>{item.name}</h4>
            <p className={styles.price}>
              {item.prefix && <span className={styles.prefix}>{item.prefix}</span>}
              {item.price}
            </p>
            <p className={styles.packageText}>{item.text}</p>
          </li>
        ))}
      </ul>
      <p className={styles.note}>{DELIVERABLES.note}</p>

      <h4 className={styles.problemsHeading}>{DELIVERABLES.problemsHeading}</h4>
      <ul className={styles.problems}>
        {DELIVERABLES.problems.map((item) => (
          <li className={styles.problem} key={item.problem}>
            <span className={styles.from}>{item.problem}</span>
            <ArrowRightIcon className={styles.arrow} />
            <b className={styles.to}>{item.solution}</b>
          </li>
        ))}
      </ul>

      <div className={styles.after}>
        <section>
          <h4 className={styles.afterHeading}>{DELIVERABLES.after.heading}</h4>
          <p>{DELIVERABLES.after.text}</p>
        </section>
        <section>
          <h4 className={styles.afterHeading}>{DELIVERABLES.timeline.heading}</h4>
          <p>{DELIVERABLES.timeline.text}</p>
        </section>
      </div>
    </div>
  );
}

export default DeliverablesFile;
