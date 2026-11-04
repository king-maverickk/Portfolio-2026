// Words for the contact section at the bottom of the home page.
// `draft: true` = written by Claude from your notes. Rewrite or approve.

import { REASONS } from './contactEvents';

export const CONTACT_SECTION = {
  headline: 'Let’s talk.',
  intro: {
    draft: true,
    text: 'Hiring, or after a website? Fill in the sentence and it lands in my inbox.'
  },

  // The sentence. A line with `when` only shows once that answer is picked.
  // Answers with a `summary` are listed at the top of the email you receive.
  form: {
    draft: true,
    submit: 'Send',
    footnote: 'I reply within 24 hours.',
    lines: [
      [
        'Hi, I’m',
        { input: 'name', label: 'Your name', placeholder: 'your name', required: true, autoComplete: 'name', width: '5em' },
        'and I’m',
        {
          chips: 'reason',
          label: 'Why you’re writing',
          required: true,
          summary: 'Writing about',
          options: [REASONS.hiring, REASONS.website]
        }
      ],

      // Hiring
      {
        when: { reason: REASONS.hiring },
        parts: [
          'I’m with',
          { input: 'organisation', label: 'Your company', placeholder: 'your company', autoComplete: 'organization', summary: 'Company', width: '6em' },
          'and we’re looking for',
          {
            chips: 'role',
            label: 'The role',
            multiple: true,
            summary: 'Role',
            options: ['Interaction design', 'UI/UX design', 'Front-end development', 'A designer-developer']
          }
        ]
      },

      // Website
      {
        when: { reason: REASONS.website },
        parts: [
          'I run',
          { input: 'organisation', label: 'Your business', placeholder: 'your business or studio', autoComplete: 'organization', summary: 'Business', width: '7em' },
          'and need help with',
          {
            chips: 'help',
            label: 'What you need help with',
            multiple: true,
            summary: 'Help with',
            options: ['A new website', 'A redesign', 'A portfolio', 'Building your designs', 'Something else']
          }
        ]
      },
      {
        // Uses your tentative per-page pricing. Delete this line to drop budget.
        when: { reason: REASONS.website },
        parts: [
          'I’m hoping to stay around',
          {
            chips: 'budget',
            label: 'Budget',
            summary: 'Budget',
            options: ['Under $1,000', '$1,000 – 2,500', '$2,500 – 5,000', '$5,000 +']
          }
        ]
      },
      {
        when: { reason: REASONS.website },
        parts: [
          'and my current site is',
          { input: 'currentSite', label: 'Current website (optional)', placeholder: 'https:// (optional)', type: 'url', width: '7em' }
        ]
      },

      // Everyone
      [
        'Reach me at',
        { input: 'email', label: 'Your email', placeholder: 'your email address', type: 'email', required: true, autoComplete: 'email', width: '8em' },
        'and let’s talk.'
      ],
      [
        'A little more:',
        { textarea: 'message', label: 'Your message', placeholder: 'The role or the project, business goals, dates, if we\'ve met anything useful', required: true }
      ]
    ]
  }
};

// Which kind of message the API gets.
export function kindFor(values) {
  return values.reason === REASONS.hiring ? 'hiring' : 'freelance';
}
