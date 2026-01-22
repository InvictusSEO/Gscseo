export async function onRequest(context) {
  const { env } = context;
  const url = new URL(context.request.url);
  
  if (!env.GSC_CLIENT_ID) {
    return new Response(JSON.stringify({ error: "GSC_CLIENT_ID not set in Cloudflare Dashboard" }), { status: 500 });
  }

  const callback = `${url.origin}/auth/callback`;
  const scopes = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.GSC_CLIENT_ID}&redirect_uri=${encodeURIComponent(callback)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  
  return Response.redirect(googleUrl, 302);
}