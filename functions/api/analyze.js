export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. Authentication Check
  const cookies = request.headers.get('Cookie') || '';
  const sessionId = cookies.match(/session_id=([^;]+)/)?.[1];
  if (!sessionId || !env.KV) return new Response('Unauthorized', { status: 401 });

  const sessionData = await env.KV.get(`session:${sessionId}`);
  if (!sessionData) return new Response('Unauthorized', { status: 401 });
  const session = JSON.parse(sessionData);

  try {
    // 2. Parse Input
    const { siteUrl, sitemapUrl } = await request.json();
    if (!siteUrl) return new Response('Missing siteUrl', { status: 400 });

    // 3. Fetch GSC Performance Data (Last 28 days)
    // We request 'page' dimension to get metrics per URL.
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const gscResponse = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 500 // Get top 500 pages
      })
    });

    if (!gscResponse.ok) {
        const err = await gscResponse.text();
        console.error("GSC API Error:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch GSC data", details: err }), { status: 500 });
    }

    const gscData = await gscResponse.json();
    const rows = gscData.rows || [];

    // Map GSC data for easy lookup: URL -> Metrics
    const gscMap = new Map();
    rows.forEach(row => {
      // row.keys[0] is the URL
      gscMap.set(row.keys[0], {
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position
      });
    });

    // 4. Fetch and Parse Sitemap (Best Effort)
    // If sitemap fails (CORS, 404, etc), we just use the GSC data we found.
    let sitemapUrls = [];
    if (sitemapUrl) {
        try {
            const sitemapRes = await fetch(sitemapUrl, { 
                headers: { 'User-Agent': 'SEO-Visibility-Analyzer/1.0' } 
            });
            if (sitemapRes.ok) {
                const xml = await sitemapRes.text();
                // Simple regex to extract <loc> tags. fast and dependency-free.
                const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
                sitemapUrls = matches.map(m => m[1].trim());
            }
        } catch (e) {
            console.warn("Sitemap fetch failed, relying only on GSC data", e);
        }
    }

    // 5. Merge Data
    // Priority: 
    // - If we have sitemap URLs, iterate them. If GSC data exists, add it. If not, it's "Not Indexed" (or 0 impressions).
    // - Also include pages GSC knows about that might NOT be in the sitemap (orphaned pages).

    const combinedResults = [];
    const processedUrls = new Set();

    // Process Sitemap URLs first
    if (sitemapUrls.length > 0) {
        sitemapUrls.forEach(url => {
            processedUrls.add(url);
            const metrics = gscMap.get(url);
            if (metrics) {
                combinedResults.push({ url, status: 'Indexed', ...metrics });
            } else {
                combinedResults.push({
                    url,
                    status: 'Not Indexed', // Or just "No Impressions"
                    clicks: 0,
                    impressions: 0,
                    ctr: 0,
                    position: 0
                });
            }
        });
    }

    // Add remaining GSC pages (Orphaned or not in sitemap)
    rows.forEach(row => {
        const url = row.keys[0];
        if (!processedUrls.has(url)) {
            combinedResults.push({ url, status: 'Indexed', ...gscMap.get(url) });
        }
    });

    // If sitemap was empty/failed, combinedResults is just the GSC rows.
    // Return top 100 for performance
    return new Response(JSON.stringify(combinedResults.slice(0, 100)), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
}