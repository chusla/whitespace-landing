const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
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

    // Add contact to Resend Audience
    if (RESEND_API_KEY && RESEND_AUDIENCE_ID) {
      try {
        const contactResponse = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            first_name: name.trim(),
            unsubscribed: false
          })
        });

        if (!contactResponse.ok) {
          const error = await contactResponse.text();
          console.error('Resend Audience error:', error);
          // Don't fail the whole request if audience add fails
        } else {
          console.log('Contact added to Resend audience');
        }
      } catch (audienceError) {
        console.error('Error adding to Resend audience:', audienceError);
        // Don't fail the whole request if audience add fails
      }
    } else {
      if (!RESEND_AUDIENCE_ID) {
        console.warn('RESEND_AUDIENCE_ID not set, skipping audience add');
      }
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
          subject: 'Try Whitespace beta now - your feedback will shape what we build',
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
  </head>
  <body>
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">
      Welcome to Whitespace - get 12 free credits to start
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:1.0769230769230769em;min-height:100%;line-height:155%">
              <tbody>
                <tr>
                  <td>
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="align:left;width:100%;padding-left:0px;padding-right:0px;line-height:155%;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif">
                      <tbody>
                        <tr>
                          <td>
                            <div>
                              <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.8; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(180deg, #151821 0%, #0f1119 50%, #151821 100%); font-size: 18px; border-radius: 16px;">
                                <div style="text-align: center; margin-bottom: 25px; padding: 20px 0;">
                                  <img src="https://auth.trywhitespace.com/storage/v1/object/public/images/whitespace_banner.png" alt="Whitespace" style="width: 300px; height: 150px; max-width: 100%; display: block; margin: 0 auto;" />
                                </div>

                                <p style="margin-bottom: 24px;">Hi,</p>

                                <p style="margin-bottom: 24px;">Thanks for joining the Whitespace waitlist.</p>

                                <p style="margin-bottom: 24px;">I'm Andrew, and I built Whitespace to create something different - meditation that adapts to you, not the other way around.</p>

                                <p style="margin-bottom: 24px;">Every session is generated specifically for what you need: better sleep, sharper focus, or just a moment of calm. The meditations are yours to keep and revisit anytime.</p>

                                <p style="margin-bottom: 24px;">The app is live in beta, and you're invited to try it now.</p>

                                <div style="text-align: center; margin: 40px 0;">
                                  <a href="https://testflight.apple.com/join/RuRQCBjr" style="display: inline-block; vertical-align: middle; margin: 0 4px;">
                                    <img src="https://auth.trywhitespace.com/storage/v1/object/public/images/apple_badge2.png" alt="Download on TestFlight" style="height: 40px; width: auto; vertical-align: middle; display: inline-block;" />
                                  </a>
                                  <a href="https://play.google.com/store/apps/details?id=io.one2all.whitespace" style="display: inline-block; vertical-align: middle; margin: 0 4px;">
                                    <img src="https://auth.trywhitespace.com/storage/v1/object/public/images/google_badge.png" alt="Get it on Google Play" style="height: 60px; width: auto; vertical-align: middle; display: inline-block;" />
                                  </a>
                                </div>

                                <p style="margin-bottom: 24px;"><strong>You'll start with 12 free credits</strong> - that's over 60 minutes of personalized meditation content that stays in your library forever.</p>

                                <p style="margin-bottom: 24px;">I'd love to hear what you think. Reply anytime with feedback or questions.</p>

                                <p style="margin-top: 32px; margin-bottom: 24px;">Best,<br />Andrew</p>

                                <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px;"></div>
                              </div>
                            </div>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em"><br /></p>
                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="node-footer" style="font-size:0.8em">
                              <tbody>
                                <tr>
                                  <td>
                                    <hr class="divider" style="width:100%;border:none;border-top:1px solid #eaeaea;padding-bottom:1em;border-width:2px" />
                                    <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                      <span>You are receiving this email because you signed up for the Whitespace waitlist.</span><br /><br /><span>Want to change how you receive these emails?</span><br /><span>You can </span><span><a href="{{unsubscribe_url}}" rel="noopener noreferrer nofollow" ses:no-track="true" style="color:#0670DB;text-decoration-line:none;text-decoration:underline" target="_blank">unsubscribe from this list</a></span><span>.</span>
                                    </p>
                                    <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                                      <span>Whitespace: Custom Sleep Focus</span><br /><span>One2all 2026</span>
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em"><br /></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`
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
