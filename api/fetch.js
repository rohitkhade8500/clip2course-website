export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    return res.status(200).end();
  }

  // Parse the query string to get the url
  // On Vercel, req.query is populated, but we can also parse req.url
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const target = urlObj.searchParams.get('url');

  if (!target) {
    return res.status(400).send('Missing "url" query parameter');
  }

  try {
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    };
    if (req.headers.range) {
      fetchOptions.headers.Range = req.headers.range;
    }

    const fetchRes = await fetch(target, fetchOptions);

    const contentType = fetchRes.headers.get('content-type');
    const contentLength = fetchRes.headers.get('content-length');
    const acceptRanges = fetchRes.headers.get('accept-ranges');
    const contentRange = fetchRes.headers.get('content-range');

    if (contentType) res.setHeader('Content-Type', contentType);
    if (contentLength) res.setHeader('Content-Length', contentLength);
    if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges);
    if (contentRange) res.setHeader('Content-Range', contentRange);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Stream the body for large files
    const bodyBuffer = await fetchRes.arrayBuffer();
    res.status(fetchRes.status).send(Buffer.from(bodyBuffer));
  } catch (error) {
    res.status(502).send(`Upstream fetch failed: ${error.message}`);
  }
}
