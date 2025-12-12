const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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
    const { email, name } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Save to Supabase
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        created_at: new Date().toISOString()
      })
    });

    if (!supabaseResponse.ok) {
      const error = await supabaseResponse.text();
      console.error('Supabase error:', error);
      
      // Handle duplicate email (unique constraint violation)
      if (supabaseResponse.status === 409 || error.includes('duplicate') || error.includes('23505')) {
        return res.status(200).json({ 
          success: true, 
          message: "You're already on the list!" 
        });
      }
      
      throw new Error('Failed to save to database');
    }

    // Send welcome email via Resend
    if (RESEND_API_KEY) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Whitespace <hello@trywhitespace.com>',
          to: email,
          subject: 'Welcome to Whitespace',
          html: `
            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
              <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a;">
                Hi ${name},
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                I'm Andrew, the founder of Whitespace.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                Thank you for joining our mailing list.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                I built this app because I tried all the meditation apps out there and found myself overwhelmed. They had countless sessions in their expansive libraries, but none of them spoke uniquely to what I needed in that moment.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                Whitespace is different. It's not a library but a teacher that knows you better over time. Each space you create is unique to your moment, your needs, and your practice.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                We launch soon. Until then, I'd love to hear what brought you here. Feel free to reach out with any questions or suggestions.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #333;">
                I look forward to starting this journey with you.
              </p>
              <p style="font-size: 16px; line-height: 1.8; color: #666; margin-top: 40px;">
                Best regards,<br>
                Andrew
              </p>
            </div>
          `
        })
      });

      if (!emailResponse.ok) {
        const error = await emailResponse.text();
        console.error('Resend error:', error);
        // Don't fail the whole request if email fails
        console.warn('Email failed but user was saved to database');
      }
    } else {
      console.warn('RESEND_API_KEY not set, skipping email');
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
