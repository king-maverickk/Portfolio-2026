// Checks and cleans what the "Start a project" form sends. Pure functions, so they are easy to test.

const KINDS = {
  portfolio: 'Portfolio site',
  business: 'Business site',
  redesign: 'Redesign',
  'build-from-design': 'Build from my design',
  other: 'Other'
};

const LIMITS = {
  name: 120,
  email: 200,
  currentSite: 300,
  message: 3000
};

// Deliberately simple: one @, no spaces, a dot in the domain. The real check is whether the mail gets answered.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anything that ends up in a header (the subject, the reply-to name) must not carry line breaks.
const singleLine = (value) => value.replace(/[\r\n\t]+/g, ' ').trim();

const text = (value) => (typeof value === 'string' ? value.trim() : '');

function validateContact(body) {
  const source = body && typeof body === 'object' ? body : {};
  const errors = {};

  const name = singleLine(text(source.name));
  const email = singleLine(text(source.email));
  const currentSite = singleLine(text(source.currentSite));
  const message = text(source.message);
  const kind = text(source.kind) || 'other';

  if (!name) errors.name = 'required';
  else if (name.length > LIMITS.name) errors.name = 'too_long';

  if (!email) errors.email = 'required';
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) errors.email = 'invalid';

  if (!Object.prototype.hasOwnProperty.call(KINDS, kind)) errors.kind = 'invalid';
  if (currentSite.length > LIMITS.currentSite) errors.currentSite = 'too_long';
  if (message.length > LIMITS.message) errors.message = 'too_long';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    // The honeypot: real visitors never see this field, so a filled one means a bot.
    isBot: text(source.company) !== '',
    value: {
      name, email, kind, currentSite, message
    }
  };
}

function buildEmail({
  name, email, kind, currentSite, message
}) {
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Looking to make: ${KINDS[kind]}`,
    `Current site: ${currentSite || '(none given)'}`,
    '',
    message || '(no message)'
  ];

  return {
    subject: `New project enquiry from ${name}`,
    plainText: lines.join('\n')
  };
}

module.exports = {
  KINDS, LIMITS, validateContact, buildEmail
};
