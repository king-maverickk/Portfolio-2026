import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Benefits from '../Benefits';
import DocumentCard from '../DocumentCard';
import ExpandableDocument from '../DocumentCard/ExpandableDocument';
import OnlineSection from '../OnlineSection';
import ReferenceLists from '../ReferenceLists';
import RoleSwitch from '../RoleSwitch';
import Scenario from '../Scenario';
import SheetLayout from '../SheetLayout';
import {
  BENEFITS, ROLES, SCENARIOS, TABS, getLetter, getLists, getResume
} from '../data/hiringManagers';

const ID = 'hm';

const ROLE_OPTIONS = ROLES.map((role) => (
  role.id === 'frontend' ? { ...role, short: 'Frontend' } : role
));

const SCALED_ORDER = {
  left: ['benefits', 'online', 'scenario'],
  right: ['top', 'document', 'lists']
};

const STACKED_ORDER = ['top', 'document', 'scenario', 'lists', 'benefits', 'online'];

// "Hiring managers": pick a role to change the resume, cover letter and skill lists; pick who you are to
// change the closing sentence. "Online" is the two profile cards, with no call to action.
function HiringManagersSheet({
  layout, glow, glowAt, title, description, closeButtonRef, onClose
}) {
  const [role, setRole] = useState('interaction');
  const [file, setFile] = useState('resume');
  const [scenario, setScenario] = useState(SCENARIOS.options[0].id);

  // Memoised so the enlarged view stays open while the sheet re-renders.
  const resume = useMemo(() => getResume(role), [role]);
  const letter = useMemo(() => getLetter(role), [role]);
  const lists = useMemo(() => getLists(role), [role]);

  const slots = {
    top: (
      <RoleSwitch
        idBase={`${ID}-role`}
        label="Role:"
        options={ROLE_OPTIONS}
        value={role}
        onChange={setRole}
        layout={layout}
      />
    ),
    document: (
      <DocumentCard
        idBase={`${ID}-file`}
        label="Application documents"
        tabs={TABS}
        activeId={file}
        onChange={setFile}
      >
        <ExpandableDocument
          document={file === 'resume' ? resume : letter}
          label={file === 'resume' ? 'resume' : 'cover letter'}
          layout={layout}
        />
      </DocumentCard>
    ),
    lists: <ReferenceLists groups={lists} label="Tools, skills and languages for this role" />,
    benefits: <Benefits id={`${ID}-benefits`} heading={BENEFITS.heading} items={BENEFITS.items} />,
    online: <OnlineSection id={`${ID}-online`} />,
    scenario: (
      <Scenario
        id={`${ID}-scenario`}
        heading={SCENARIOS.heading}
        options={SCENARIOS.options}
        value={scenario}
        onChange={setScenario}
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

HiringManagersSheet.propTypes = {
  closeButtonRef: PropTypes.shape({ current: PropTypes.any }),
  description: PropTypes.node.isRequired,
  glow: PropTypes.string.isRequired,
  glowAt: PropTypes.shape({ x: PropTypes.string, y: PropTypes.number }).isRequired,
  layout: PropTypes.oneOf(['scaled', 'stacked']).isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default HiringManagersSheet;
