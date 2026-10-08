export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Retrieve the search params from the original url
  // req.url on Vercel contains the query string
  const queryString = req.url.split('?')[1] || '';
  const targetUrl = `https://www.youtube.com/api/timedtext${queryString ? '?' + queryString : ''}`;

  try {
    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip'
      }
    });

    const data = await fetchRes.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(fetchRes.status).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
