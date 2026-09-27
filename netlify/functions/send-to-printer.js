// netlify/functions/send-to-printer.js
// Emails a PDF of invoices to a cloud printer's email address (e.g. Brother Email Print).
// The email body is left BLANK on purpose — Brother prints any body text as an
// extra page, so only the PDF attachment is sent.
// Environment variable required: RESEND_API_KEY (same one send-email.js uses).

// Only allow sending to known print-by-email services, so this function
// can't be used to send attachments to anybody else.
const ALLOWED_PRINTER_DOMAINS = [
  'print.brother.com',
  'print.epsonconnect.com',
  'epsonconnect.com',
  'hpeprint.com'
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

  const { to, subject, filename, pdfBase64 } = payload;
  if (!to || !pdfBase64) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: to, pdfBase64' }) };
  }

  const domain = String(to).split('@')[1] || '';
  if (!ALLOWED_PRINTER_DOMAINS.some(d => domain.toLowerCase() === d)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Not a recognised printer email address: ' + to }) };
  }

  const body = {
    from: 'C J Torode Newsagent <craigpapers@newsagentdelivr.com>',
    to: [to],
    subject: subject || 'Invoices',
    // Resend won't accept an empty body, so send a single space —
    // no visible text, so Brother shouldn't print an extra page for it.
    text: ' ',
    attachments: [{ filename: filename || 'invoices.pdf', content: pdfBase64 }]
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
