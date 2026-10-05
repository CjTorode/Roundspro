// netlify/functions/send-to-driver.js
// Emails a PDF of the printed bills to the driver, who opens it and prints it.
// Environment variable required: RESEND_API_KEY (same one send-email.js uses).

// Only these addresses can receive PDFs from this function, so it can't be
// used to send attachments to anybody else. Add to this list if the driver
// email ever changes in ⚙ Settings.
const ALLOWED_RECIPIENTS = [
  'catorode@me.com'
];

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RESEND_API_KEY not configured in Netlify.' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  const { to, subject, text, filename, pdfBase64 } = payload;
  if (!to || !pdfBase64) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: to, pdfBase64' }) };
  }
  if (!ALLOWED_RECIPIENTS.includes(String(to).trim().toLowerCase())) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Driver email not allowed: ' + to + ' — add it to ALLOWED_RECIPIENTS in send-to-driver.js' }) };
  }

  const body = {
    from: 'C J Torode Newsagent <craigpapers@newsagentdelivr.com>',
    to: [to],
    subject: subject || 'Bills to print',
    text: text || 'Bills to print attached.',
    attachments: [{ filename: filename || 'bills.pdf', content: pdfBase64 }]
  };

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.ok) return { statusCode: 200, body: JSON.stringify({ ok: true, id: data.id }) };
    return {
      statusCode: resp.status,
      body: JSON.stringify({ error: 'Resend error ' + resp.status + ': ' + (data.message || JSON.stringify(data)) })
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Network error: ' + e.message }) };
  }
};
