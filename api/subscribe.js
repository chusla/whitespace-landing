import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;
  console.log('Received:', { email, name });

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Insert email and name
    const { error } = await supabase
      .from('waitlist')
      .insert({ 
        email: email.toLowerCase().trim(),
        name: name.trim(),
        created_at: new Date().toISOString()
      });

    if (error) {
      if (error.code === '23505') {
        return res.status(200).json({ 
          success: true, 
          message: "You're already on the list!" 
        });
      }

      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save email' });
    }

    console.log('✅ Saved to waitlist');

    return res.status(200).json({ 
      success: true,
      message: 'Successfully joined the waitlist!'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
