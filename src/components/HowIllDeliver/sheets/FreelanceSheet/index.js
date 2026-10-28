import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Benefits from '../Benefits';
import DocumentCard, { Paper } from '../DocumentCard';
import { FileLabel } from '../FileTabs';
import { CalendarIcon } from '../Icons';
import OnlineSection from '../OnlineSection';
import ReferenceLists from '../ReferenceLists';
import Scenario from '../Scenario';
import SheetLayout from '../SheetLayout';
import {
  BENEFITS, LISTS, SCENARIOS, TABS, TYPICAL_WEEKS
} from '../data/freelance';
import DeliverablesFile from './DeliverablesFile';
import StartFile from './StartFile';
import WorkflowFile from './WorkflowFile';
import styles from './index.module.scss';

const ID = 'fl';

const SCALED_ORDER = {
  left: ['benefits', 'online', 'scenario'],
  right: ['top', 'document', 'lists']
};

const STACKED_ORDER = ['scenario', 'benefits', 'document', 'lists', 'online'];

// "Freelance / contract". On desktop the three files sit behind tabs; on phones and portrait tablets they are
// stacked one after another. Either way "Start a project" leads to the form.
function FreelanceSheet({
  layout, glow, glowAt, title, description, closeButtonRef, onClose
}) {
  const [file, setFile] = useState('workflow');
  const [scenario, setScenario] = useState(SCENARIOS.options[0].id);
  const [focusForm, setFocusForm] = useState(false);
  const nameInputRef = useRef(null);

  // Wait until the form is on screen before moving focus into it.
  useEffect(() => {
    if (!focusForm) return;
    nameInputRef.current?.focus();
    setFocusForm(false);
  }, [focusForm, file]);

  const startProject = () => {
    setFile('start');
    setFocusForm(true);
  };

  const files = {
    workflow: <WorkflowFile />,
    deliverables: <DeliverablesFile />,
    start: <StartFile idBase={`${ID}-form`} nameInputRef={nameInputRef} />
  };

  const documents = layout === 'scaled' ? (
    <DocumentCard
      idBase={`${ID}-file`}
      label="Project files"
      tabs={TABS}
      activeId={file}
      onChange={setFile}
      paperClassName={file === 'workflow' ? styles.paperWorkflow : undefined}
    >
      {files[file]}
    </DocumentCard>
  ) : (
    <div className={styles.files}>
      {TABS.map((tab) => (
        <section className={styles.file} key={tab.id} aria-label={tab.label.replace('File: ', '')}>
          <FileLabel>{tab.label}</FileLabel>
          <Paper>{files[tab.id]}</Paper>
        </section>
      ))}
    </div>
  );

  const slots = {
    top: (
      <p className={styles.typical}>
        <CalendarIcon className={styles.typicalIcon} />
        {`Typical project: about ${TYPICAL_WEEKS}`}
      </p>
    ),
    document: documents,
    lists: <ReferenceLists groups={LISTS} label="Research, design and build" />,
    benefits: <Benefits id={`${ID}-benefits`} heading={BENEFITS.heading} items={BENEFITS.items} />,
    online: (
      <OnlineSection
        id={`${ID}-online`}
        action={(
          <button type="button" className={styles.start} onClick={startProject}>
            Start a project
          </button>
        )}
      />
    ),
    scenario: (
      <Scenario
        id={`${ID}-scenario`}
        heading={SCENARIOS.heading}
        options={SCENARIOS.options}
        value={scenario}
        onChange={setScenario}
        reserveLines={3}
      />
    )
  };

  return (
    <SheetLayout
      layout={layout}
      glow={glow}
      glowAt={glowAt}
      title={title}
      description={description}
      slots={slots}
      scaledOrder={SCALED_ORDER}
      stackedOrder={STACKED_ORDER}
      closeButtonRef={closeButtonRef}
      onClose={onClose}
    />
  );
}

FreelanceSheet.propTypes = {
  closeButtonRef: PropTypes.shape({ current: PropTypes.any }),
  description: PropTypes.node.isRequired,
  glow: PropTypes.string.isRequired,
  glowAt: PropTypes.shape({ x: PropTypes.string, y: PropTypes.number }).isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default FreelanceSheet;
