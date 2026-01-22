export async function onRequest(context) {
  const { request, env } = context;
  const cookies = request.headers.get('Cookie') || '';
  const sessionId = cookies.match(/session_id=([^;]+)/)?.[1];
  
  if (!sessionId || !env.KV) return new Response('Unauthorized', { status: 401 });
  
  const sessionData = await env.KV.get(`session:${sessionId}`);
  if (!sessionData) return new Response('Unauthorized', { status: 401 });
  const session = JSON.parse(sessionData);

  const gscRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', { 
    headers: { Authorization: `Bearer ${session.token}` } 
  });
  
  const data = await gscRes.json();
  return new Response(JSON.stringify(data.siteEntry || []), {
    headers: { 'Content-Type': 'application/json' }
  });
}