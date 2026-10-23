// Precio de DPZ (Alpha Vantage GLOBAL_QUOTE). La clave es la variable secreta AV_KEY.
// La respuesta se guarda 30 min en la caché de Cloudflare: toda la clase comparte una llamada (el plan gratuito permite 25 al día).
export async function onRequestGet({ env, request, waitUntil }) {
  const cache = caches.default, key = new Request(new URL("/api/quote", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  if (!env.AV_KEY) return new Response(JSON.stringify({ error: "AV_KEY not set" }), { status: 500, headers: { "content-type": "application/json" } });
  try {
    const r = await fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DPZ&apikey=" + encodeURIComponent(env.AV_KEY));
    const j = await r.json();
    if (!(j && j["Global Quote"] && j["Global Quote"]["05. price"])) return new Response(JSON.stringify({ error: "no quote" }), { status: 502, headers: { "content-type": "application/json" } });
    const res = new Response(JSON.stringify(j), { headers: { "content-type": "application/json", "cache-control": "public, max-age=1800" } });
    waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (e) { return new Response(JSON.stringify({ error: "upstream" }), { status: 502, headers: { "content-type": "application/json" } }); }
}
