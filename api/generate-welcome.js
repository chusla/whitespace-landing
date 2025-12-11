export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const script = `Welcome to Whitespace, ${name}.`;
    
    // Call your existing audio generation endpoint
    // Replace with your actual Supabase edge function URL
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/generate-meditation-audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script,
        voiceId: 'ROMJ9yK1NAMuu1ggrjDW', // Your ElevenLabs voice ID for Noa
        backgroundMusic: 'forest-ambience' // Or whatever your background track is
      })
    });

    const data = await response.json();

    return res.status(200).json({
      audioUrl: data.audioUrl
    });

  } catch (error) {
    console.error('Error generating welcome audio:', error);
    return res.status(500).json({ error: 'Failed to generate welcome' });
  }
}
