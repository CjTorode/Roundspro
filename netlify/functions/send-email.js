// netlify/functions/send-email.js
// Sends a customer invoice email via Resend.
// Environment variable required: RESEND_API_KEY
// Set this in Netlify Dashboard → Site → Environment Variables.

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Resend API key not configured. Add RESEND_API_KEY to Netlify environment variables.' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { to, cc, subject, html, text, from, fromName } = payload;
  if (!to || !subject || !html) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: to, subject, html' }) };
  }

  const fromEmail = from || 'Craigpapers@icloud.com';
  const fromDisplay = fromName || 'C J Torode Newsagent';

  const body = {
    from: fromDisplay + ' <' + fromEmail + '>',
    to: [to],
    subject: subject,
    html: html,
    text: text || 'Please view this email in an HTML-capable client.'
  };

  if (cc) {
    body.cc = Array.isArray(cc) ? cc : [cc];
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json().catch(() => ({}));
    if (resp.ok) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, id: data.id }) };
    }
    return {
      statusCode: resp.status,
      body: JSON.stringify({ error: 'Resend error ' + resp.status + ': ' + (data.message || JSON.stringify(data)) })
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Network error: ' + e.message })
    };
  }
};
