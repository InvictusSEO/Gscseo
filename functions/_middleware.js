export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const origin = request.headers.get("Origin") || url.origin;

  // Handle preflight requests (OPTIONS)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = await context.next();
  
  // FIX: Manually copy headers to a new Headers object.
  // Previous version had a syntax error (colons instead of commas) here.
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", origin);
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  newHeaders.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}