const { app } = require('@azure/functions');
const { createContactHandler } = require('../lib/contactHandler');
const { sendMail } = require('../lib/sendMail');

app.http('contact', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'contact',
  handler: createContactHandler({ sendMail })
});
