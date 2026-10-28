const { validateContact, buildEmail } = require('./validate');

const MAX_BODY_BYTES = 20 * 1024;

const json = (status, body) => ({ status, jsonBody: body });

// POST /api/contact. `sendMail` is passed in so tests can replace it.
function createContactHandler({ sendMail }) {
  return async function contact(request, context) {
    const length = Number(request.headers.get('content-length') || 0);
    if (length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'too_large' });

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return json(400, { ok: false, error: 'invalid_json' });
    }

    const { valid, errors, isBot, value } = validateContact(body);

    // Pretend it worked, so a bot learns nothing, and send nothing.
    if (isBot) return json(200, { ok: true });
    if (!valid) return json(400, { ok: false, error: 'invalid', fields: errors });

    try {
      const { subject, plainText } = buildEmail(value);
      await sendMail({ subject, plainText, replyTo: { address: value.email, name: value.name } });
    } catch (error) {
      // Log what went wrong, never what the visitor wrote.
      context.error(`Contact email failed: ${error.message}`);
      return json(500, { ok: false, error: 'send_failed' });
    }

    return json(200, { ok: true });
  };
}

module.exports = { createContactHandler, MAX_BODY_BYTES };
