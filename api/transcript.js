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
    // Custom fetch wrapper to inject CONSENT cookie to bypass YouTube's GDPR/Captcha pages
    const customFetch = (url, options = {}) => {
      options.headers = {
        ...options.headers,
        'Cookie': 'CONSENT=YES+cb',
      };
      return fetch(url, options);
    };

    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId, { fetch: customFetch });
    } catch (e) {
      console.error(`[transcript] youtube-transcript failed for ${videoId}:`, e.message);
      
      // Fallback: try lemnoslife public api
      const lemnosRes = await fetch(`https://yt.lemnoslife.com/noKey/captions?videoId=${videoId}`);
      if (!lemnosRes.ok) throw e; // throw original error if fallback fails
      
      const lemnosData = await lemnosRes.json();
      const track = lemnosData?.captions?.playerCaptionsTracklistRenderer?.captionTracks?.[0];
      if (!track?.baseUrl) throw e;
      
      const xmlRes = await fetch(track.baseUrl);
      if (!xmlRes.ok) throw e;
      
      const xml = await xmlRes.text();
      // Use youtube-transcript's internal parser!
      transcript = YoutubeTranscript.parseTranscriptXml(xml, track.languageCode);
      
      if (!transcript || transcript.length === 0) {
        throw e;
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
