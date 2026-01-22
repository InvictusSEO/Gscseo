export async function onRequest(context) {
  const { request, env } = context;
  const cookies = request.headers.get('Cookie') || '';
  const sessionId = cookies.match(/session_id=([^;]+)/)?.[1];
  
  if (!sessionId || !env.KV) {
    return new Response(JSON.stringify({ user: null }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const data = await env.KV.get(`session:${sessionId}`);
  const session = data ? JSON.parse(data) : null;
  
  return new Response(JSON.stringify({ 
    user: session ? { name: session.name, email: session.email, avatar: session.picture } : null 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}