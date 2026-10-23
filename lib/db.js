// Utilidades comunes: crea las tablas la primera vez, lee y valida el estado.
let ready = null;
export function init(env) {
  if (!ready) {
    ready = env.DB.batch([
      env.DB.prepare("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)"),
      env.DB.prepare("CREATE TABLE IF NOT EXISTS votes (id TEXT PRIMARY KEY, pre TEXT, post TEXT, ts INTEGER)")
    ]).catch(e => { ready = null; throw e; });
  }
  return ready;
}
export const json = (o, status = 200, h = {}) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...h } });

export async function getState(env) {
  const rows = (await env.DB.prepare("SELECT k, v FROM kv WHERE k IN ('poll','site')").all()).results || [];
  const m = Object.fromEntries(rows.map(r => [r.k, JSON.parse(r.v)]));
  return { poll: { round: "pre", open: false, reveal: false, ...(m.poll || {}) }, site: { show: false, ...(m.site || {}) } };
}
export async function putKV(env, k, v) {
  await env.DB.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(k, JSON.stringify(v)).run();
}
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0;
}
