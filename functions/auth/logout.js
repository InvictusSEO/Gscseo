export async function onRequest(context) {
  const { request, env } = context;
  const cookies = request.headers.get('Cookie') || '';
  const sessionId = cookies.match(/session_id=([^;]+)/)?.[1];

  if (sessionId && env.KV) {
    await env.KV.delete(`session:${sessionId}`);
  }

  const response = new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  response.headers.set('Set-Cookie', 'session_id=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  return response;
}