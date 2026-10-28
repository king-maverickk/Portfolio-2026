const { EmailClient } = require('@azure/communication-email');

const REQUIRED = ['ACS_CONNECTION_STRING', 'CONTACT_SENDER_ADDRESS', 'CONTACT_TO_ADDRESS'];

// Sends one email through Azure Communication Services. Replying to it goes straight to the visitor.
async function sendMail({
  subject, plainText, replyTo, env = process.env
}) {
  const missing = REQUIRED.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing settings: ${missing.join(', ')}`);

  const client = new EmailClient(env.ACS_CONNECTION_STRING);
  const poller = await client.beginSend({
    senderAddress: env.CONTACT_SENDER_ADDRESS,
    content: { subject, plainText },
    recipients: { to: [{ address: env.CONTACT_TO_ADDRESS }] },
    replyTo: [{ address: replyTo.address, displayName: replyTo.name }]
  });
  const result = await poller.pollUntilDone();

  if (result.status !== 'Succeeded') throw new Error(`Email was not sent: ${result.status}`);
}

module.exports = { sendMail };
