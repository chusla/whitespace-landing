const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@trywhitespace.com';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, requestType, details } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!requestType) {
      return res.status(400).json({ error: 'Please select a deletion type.' });
    }

    const typeLabels = {
      'account': 'Delete account and all data',
      'data-only': 'Delete data only (keep account)',
      'calendar': 'Delete calendar & Concierge data only',
      'specific': 'Delete specific data'
    };

    const typeLabel = typeLabels[requestType] || requestType;
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedDetails = details ? details.trim().substring(0, 2000) : '';
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Email service is not configured. Please email hello@trywhitespace.com directly.' });
    }

    // 1. Send notification email to admin/team
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Whitespace <hello@trywhitespace.com>',
        to: ADMIN_EMAIL,
        subject: `Data Deletion Request: ${sanitizedEmail}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
            <h2 style="font-size: 22px; margin-bottom: 24px; color: #111;">
              Data Deletion Request
            </h2>
            <div style="background-color: #f8f8fa; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e5e5e7;">
              <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 8px 0;">
                <strong>User Email:</strong> ${sanitizedEmail}
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 8px 0;">
                <strong>Request Type:</strong> ${typeLabel}
              </p>
              ${sanitizedDetails ? `
              <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 8px 0;">
                <strong>Details:</strong> ${sanitizedDetails}
              </p>
              ` : ''}
              <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 8px 0;">
                <strong>Submitted:</strong> ${timestamp}
              </p>
            </div>
            <div style="background-color: #fff8e6; padding: 16px 20px; border-radius: 8px; border: 1px solid #f0e0b0; margin-bottom: 24px;">
              <p style="font-size: 14px; line-height: 1.6; color: #665500; margin: 0;">
                <strong>Action required:</strong> Verify the user's identity and process this deletion request within 30 days per the privacy policy.
              </p>
            </div>
            <p style="font-size: 13px; line-height: 1.6; color: #888; margin-top: 24px;">
              This is an automated notification from the Whitespace data deletion request page.
            </p>
          </div>
        `
      })
    });

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text();
      console.error('Admin notification email error:', error);
      return res.status(500).json({ error: 'Failed to send your request. Please email hello@trywhitespace.com directly.' });
    }

    // 2. Send confirmation email to the user
    try {
      const userEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Whitespace <hello@trywhitespace.com>',
          to: sanitizedEmail,
          subject: 'We received your data deletion request',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #ffffff; background: linear-gradient(180deg, #151821 0%, #0f1119 50%, #151821 100%); border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://auth.trywhitespace.com/storage/v1/object/public/images/whitespace_banner.png" alt="Whitespace" style="width: 240px; max-width: 100%; display: block; margin: 0 auto;" />
              </div>

              <h2 style="font-size: 22px; margin-bottom: 16px; color: #ffffff; font-weight: 400;">
                We received your request
              </h2>

              <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 20px;">
                We've received your request to <strong style="color: #ffffff;">${typeLabel.toLowerCase()}</strong> for the account associated with <strong style="color: #ffffff;">${sanitizedEmail}</strong>.
              </p>

              <div style="background: rgba(255,255,255,0.06); padding: 20px 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
                <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.7); margin: 0 0 12px 0;">
                  <strong style="color: rgba(255,255,255,0.9);">What happens next:</strong>
                </p>
                <ol style="font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.7); margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 6px;">We'll verify your identity by responding to this email</li>
                  <li style="margin-bottom: 6px;">Once verified, your data will be permanently removed</li>
                  <li style="margin-bottom: 6px;">You'll receive a final confirmation when the process is complete</li>
                </ol>
              </div>

              <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.6); margin-bottom: 24px;">
                This process typically completes within 30 days. If you have any questions, simply reply to this email.
              </p>

              <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.6); margin-bottom: 8px;">
                Best,<br />The Whitespace Team
              </p>

              <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px; padding-top: 20px;">
                <p style="font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.35); margin: 0;">
                  Whitespace by One 2 All LLC &middot; 2248 Broadway #1409, New York, NY 10024
                </p>
              </div>
            </div>
          `
        })
      });

      if (!userEmailResponse.ok) {
        const error = await userEmailResponse.text();
        console.error('User confirmation email error:', error);
        // Don't fail the whole request — admin already received it
      }
    } catch (userEmailError) {
      console.error('Error sending user confirmation:', userEmailError);
      // Don't fail — admin already received the request
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Delete request error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please email hello@trywhitespace.com directly.' });
  }
}
