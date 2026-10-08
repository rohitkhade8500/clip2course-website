export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Rewrite /api/invidious/* to https://inv.nadeko.net/*
  // We can just get the path after /api/invidious/
  const urlPath = req.url.replace('/api/invidious', '');
  const targetUrl = `https://inv.nadeko.net${urlPath}`;

  try {
    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });

    const contentType = fetchRes.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    const data = await fetchRes.text();
    res.status(fetchRes.status).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
