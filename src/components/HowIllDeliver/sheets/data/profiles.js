// Content for the "Online" profile cards. Numbers are static on purpose: update them by hand.
// The two avatars live in ../assets.

import githubAvatar from '../assets/github-avatar.png';
import linkedinAvatar from '../assets/linkedin-avatar.png';

const profiles = {
  github: {
    url: 'https://github.com/king-maverickk',
    handle: '@king-maverickk',
    avatar: githubAvatar,
    about: 'Microsoft Certified Azure Developer Associate, 6 years of personal programming experience.',
    stats: [
      { value: '377', label: 'contributions', note: 'in 2026' },
      { value: '19', label: 'public repos' },
      { value: '33', label: 'private repos' }
    ]
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/motheo-m-moleko/',
    name: 'Motheo M Moleko',
    avatar: linkedinAvatar,
    about: 'Creative Design | Motion, Web & Interaction Design | Technical | Positive Collaboration',
    action: 'View Profile',
    tags: ['Open to Work', 'Skills'] // plain text, not links
  }
};

export default profiles;
