import React from 'react';
import cn from 'classnames';

import { FolderIcon, PointerIcon } from '../Icons';
import { WORKFLOW } from '../data/freelance';
import styles from './WorkflowFile.module.scss';

// "Project Plan": the build as a folder tree (Research, Direction, Prototype, Build, Launch and Care).
function WorkflowFile() {
  return (
    <div className={styles.workflow}>
      <h3 className={styles.title}>{WORKFLOW.title}</h3>

      <ol className={styles.tree} aria-label="Project phases">
        <li className={cn(styles.item, styles.intro)}>
          <p className={styles.lead}>{WORKFLOW.intro}</p>
          <p className={styles.recent}>{WORKFLOW.recent}</p>
        </li>

        {WORKFLOW.phases.map((phase) => (
          <li className={cn(styles.item, styles.phase)} key={phase.name}>
            <span className={styles.row}>
              <FolderIcon className={styles.phaseIcon} />
              <span className={styles.phaseName}>{phase.name}</span>
            </span>
            <ul className={styles.steps}>
              {phase.steps.map((step) => (
                <li className={cn(styles.item, styles.step)} key={step.text}>
                  <span className={styles.row}>
                    {step.icon === 'pointer'
                      ? <PointerIcon className={styles.stepIcon} />
                      : <FolderIcon className={styles.stepIcon} />}
                    <span>{step.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className={styles.ai}>
        <h4 className={styles.aiHeading}>{WORKFLOW.ai.heading}</h4>
        <p>{WORKFLOW.ai.text}</p>
      </div>
    </div>
  );
}

export default WorkflowFile;
