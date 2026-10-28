const test = require('node:test');
const assert = require('node:assert/strict');

const { validateContact, buildEmail } = require('../src/lib/validate');
const { createContactHandler, MAX_BODY_BYTES } = require('../src/lib/contactHandler');

const good = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  kind: 'redesign',
  currentSite: 'alex.example.com',
  message: 'A new gallery site',
  company: ''
};

const request = (body, headers = {}) => ({
  headers: new Headers(headers),
  json: async () => {
    if (body instanceof Error) throw body;
    return body;
  }
});

const context = () => {
  const errors = [];
  return { errors, error: (message) => errors.push(message) };
};

test('accepts a complete enquiry', () => {
  const result = validateContact(good);
  assert.equal(result.valid, true);
  assert.equal(result.isBot, false);
  assert.deepEqual(result.value, {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    kind: 'redesign',
    currentSite: 'alex.example.com',
    message: 'A new gallery site'
  });
});

test('needs only a name and an email', () => {
  const result = validateContact({ name: 'Alex', email: 'alex@example.com' });
  assert.equal(result.valid, true);
  assert.equal(result.value.kind, 'other');
});

test('rejects a missing name, a bad email and an unknown kind', () => {
  const result = validateContact({ name: '  ', email: 'not-an-email', kind: 'spam' });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, { name: 'required', email: 'invalid', kind: 'invalid' });
});

test('rejects fields that are too long', () => {
  const result = validateContact({ ...good, name: 'a'.repeat(121), message: 'm'.repeat(3001) });
  assert.deepEqual(result.errors, { name: 'too_long', message: 'too_long' });
});

test('ignores values that are not text', () => {
  const result = validateContact({ name: { toString: 'x' }, email: ['a@b.co'] });
  assert.equal(result.valid, false);
  assert.equal(validateContact(null).valid, false);
});

test('flags the honeypot', () => {
  assert.equal(validateContact({ ...good, company: 'Acme' }).isBot, true);
});

test('keeps line breaks out of anything that goes in a header', () => {
  const { value } = validateContact({ ...good, name: 'Alex\r\nBcc: someone@else.com' });
  assert.doesNotMatch(value.name, /[\r\n]/);
  assert.doesNotMatch(buildEmail(value).subject, /[\r\n]/);
});

test('writes a readable email', () => {
  const { subject, plainText } = buildEmail(validateContact(good).value);
  assert.equal(subject, 'New project enquiry from Alex Rivera');
  assert.match(plainText, /Looking to make: Redesign/);
  assert.match(plainText, /Current site: alex\.example\.com/);
  assert.match(plainText, /A new gallery site/);
});

test('sends the email and answers 200', async () => {
  const sent = [];
  const handler = createContactHandler({ sendMail: async (mail) => sent.push(mail) });

  const response = await handler(request(good), context());

  assert.equal(response.status, 200);
  assert.deepEqual(response.jsonBody, { ok: true });
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].replyTo, { address: 'alex@example.com', name: 'Alex Rivera' });
});

test('answers 400 and sends nothing for an invalid enquiry', async () => {
  const sent = [];
  const handler = createContactHandler({ sendMail: async (mail) => sent.push(mail) });

  const response = await handler(request({ ...good, email: 'nope' }), context());

  assert.equal(response.status, 400);
  assert.equal(response.jsonBody.fields.email, 'invalid');
  assert.equal(sent.length, 0);
});

test('answers 400 for a body that is not JSON', async () => {
  const handler = createContactHandler({ sendMail: async () => {} });
  const response = await handler(request(new Error('bad json')), context());
  assert.equal(response.status, 400);
  assert.equal(response.jsonBody.error, 'invalid_json');
});

test('answers 413 for a body that is too large', async () => {
  const handler = createContactHandler({ sendMail: async () => {} });
  const response = await handler(request(good, { 'content-length': String(MAX_BODY_BYTES + 1) }), context());
  assert.equal(response.status, 413);
});

test('looks successful to a bot but sends nothing', async () => {
  const sent = [];
  const handler = createContactHandler({ sendMail: async (mail) => sent.push(mail) });

  const response = await handler(request({ ...good, company: 'Acme' }), context());

  assert.equal(response.status, 200);
  assert.equal(sent.length, 0);
});

test('answers 500 when sending fails and logs no visitor details', async () => {
  const log = context();
  const handler = createContactHandler({
    sendMail: async () => { throw new Error('ACS is down'); }
  });

  const response = await handler(request(good), log);

  assert.equal(response.status, 500);
  assert.deepEqual(response.jsonBody, { ok: false, error: 'send_failed' });
  assert.equal(log.errors.length, 1);
  assert.doesNotMatch(log.errors[0], /alex|gallery/i);
});
