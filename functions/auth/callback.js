export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) return Response.redirect(`${url.origin}?error=no_code`, 302);

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GSC_CLIENT_ID,
        client_secret: env.GSC_CLIENT_SECRET,
        redirect_uri: `${url.origin}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) return Response.redirect(`${url.origin}?error=${tokens.error}`, 302);

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    const sessionId = crypto.randomUUID();
    if (env.KV) {
      await env.KV.put(`session:${sessionId}`, JSON.stringify({ 
        token: tokens.access_token, 
        email: profile.email, 
        name: profile.name, 
        picture: profile.picture 
      }), { expirationTtl: 86400 });
    }

    const response = new Response(null, {
      status: 302,
      headers: { 'Location': `${url.origin}/?status=connected` }
    });
    
    // Cookie security: SameSite=Lax is better for OAuth redirects
    response.headers.append('Set-Cookie', `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`);
    return response;
  } catch (err) {
    return Response.redirect(`${url.origin}?error=internal_server_error`, 302);
  }
}