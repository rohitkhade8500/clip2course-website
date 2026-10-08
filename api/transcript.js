import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const videoId = req.query.videoId || (req.body && req.body.videoId);
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId' });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
