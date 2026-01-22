export async function onRequest(context) {
  const { env } = context;
  
  return new Response(JSON.stringify({
    timestamp: new Date().toISOString(),
    env_keys: Object.keys(env),
    gsc_id_set: !!env.GSC_CLIENT_ID,
    gsc_secret_set: !!env.GSC_CLIENT_SECRET,
    kv_bound: !!env.KV,
  }), {
    headers: { "Content-Type": "application/json" }
  });
}