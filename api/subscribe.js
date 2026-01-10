const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@trywhitespace.com';

// Subtle bot detection for name field
function isLikelyBotName(name) {
  const cleaned = name.trim();
  const lower = cleaned.toLowerCase();
  
  // Too long for a first name (most first names are under 15 chars)
  if (cleaned.length > 20) return true;
  
  // Must contain at least one vowel (real names have vowels)
  const vowels = /[aeiouAEIOU]/;
  if (!vowels.test(cleaned)) return true;
  
  // Check for random character patterns - too many consonants in a row (5+)
  const manyConsonants = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
  if (manyConsonants.test(cleaned)) return true;
  
  // Check for repeating 2-3 char patterns (gibberish detector)
  if (cleaned.length > 6) {
    for (let len = 2; len <= 3; len++) {
      for (let i = 0; i <= lower.length - len; i++) {
        const pattern = lower.substring(i, i + len);
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = (lower.match(regex) || []).length;
        if (matches >= 3) return true;
      }
    }
  }
  
  // Check for same letter appearing too many times
  const letterCounts = {};
  for (const char of lower) {
    if (/[a-z]/.test(char)) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
  }
  const maxLetterCount = Math.max(...Object.values(letterCounts));
  const letterRatio = maxLetterCount / cleaned.length;
  if (letterRatio > 0.4 && cleaned.length > 4) return true;
  
  // Check for 3+ same letters in a row
  if (/(.)\1{2,}/.test(lower)) return true;
  
  // Check for suspicious mixed case (e.g., "OPOOXwIZfbBt")
  let caseChanges = 0;
  for (let i = 1; i < cleaned.length; i++) {
    const prevIsUpper = cleaned[i-1] === cleaned[i-1].toUpperCase() && cleaned[i-1] !== cleaned[i-1].toLowerCase();
    const currIsUpper = cleaned[i] === cleaned[i].toUpperCase() && cleaned[i] !== cleaned[i].toLowerCase();
    const prevIsLetter = /[a-zA-Z]/.test(cleaned[i-1]);
    const currIsLetter = /[a-zA-Z]/.test(cleaned[i]);
    if (prevIsLetter && currIsLetter && prevIsUpper !== currIsUpper) {
      caseChanges++;
    }
  }
  if (caseChanges > 3) return true;
  
  // Only allow letters, spaces, hyphens, apostrophes, and periods (for names like "M.J.")
  const validChars = /^[a-zA-Z\s\-'.]+$/;
  if (!validChars.test(cleaned)) return true;
  
  // Ratio of uppercase to total letters is suspicious if too high (excluding first letter)
  if (cleaned.length > 2) {
    const rest = cleaned.slice(1);
    const upperCount = (rest.match(/[A-Z]/g) || []).length;
    const letterCount = (rest.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 0 && upperCount / letterCount > 0.4) return true;
  }
  
  return false;
}

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
    const { email, name, website, company } = req.body;

    // Honeypot check - if filled, silently "succeed" but do nothing
    if (website || company) {
      console.warn('Honeypot triggered, rejecting:', { email, website, company });
      return res.status(200).json({ success: true });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Subtle bot detection
    if (isLikelyBotName(name)) {
      // Return success to not tip off bots, but don't actually save
      console.warn('Bot detected, rejecting:', { name, email });
      return res.status(200).json({ success: true });
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

    // Send notification email to admin
    if (RESEND_API_KEY && ADMIN_EMAIL) {
      try {
        const notificationResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'Whitespace <hello@trywhitespace.com>',
            to: ADMIN_EMAIL,
            subject: `New Waitlist Signup: ${name}`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <h2 style="font-size: 24px; color: #1a1a1a; margin-bottom: 20px;">
                  New Waitlist Signup
                </h2>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 10px 0;">
                    <strong>Name:</strong> ${name}
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 10px 0;">
                    <strong>Email:</strong> ${email.toLowerCase().trim()}
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 10px 0;">
                    <strong>Signed up at:</strong> ${new Date().toLocaleString()}
                  </p>
                </div>
                <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
                  This is an automated notification from your Whitespace waitlist.
                </p>
              </div>
            `
          })
        });

        if (!notificationResponse.ok) {
          const error = await notificationResponse.text();
          console.error('Notification email error:', error);
          console.warn('Notification email failed but user was saved to database');
        }
      } catch (notificationError) {
        console.error('Error sending notification email:', notificationError);
        // Don't fail the whole request if notification email fails
      }
    } else {
      if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set, skipping notification email');
      }
      if (!ADMIN_EMAIL) {
        console.warn('ADMIN_EMAIL not set, skipping notification email');
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
