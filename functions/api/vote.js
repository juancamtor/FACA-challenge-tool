import { init, json, getState } from "../../lib/db.js";
const OK = ["BUY", "HOLD", "SELL"];
// Un voto por dispositivo (id aleatorio guardado en el navegador). Solo se acepta con la ronda abierta y solo el campo de la ronda actual.
export async function onRequestPost({ env, request }) {
  try {
    await init(env);
    const b = await request.json().catch(() => null);
    if (!b || typeof b.id !== "string" || b.id.length < 8 || b.id.length > 64) return json({ error: "bad id" }, 400);
    const { poll } = await getState(env);
    if (!poll.open) return json({ error: "closed" }, 403);
    const col = poll.round === "post" ? "post" : "pre";
    const v = b[col];
    if (!OK.includes(v)) return json({ error: "bad vote" }, 400);
    const exists = await env.DB.prepare("SELECT 1 AS x FROM votes WHERE id = ?").bind(b.id).first();
    if (!exists) {
      const n = await env.DB.prepare("SELECT COUNT(*) AS n FROM votes").first();
      if (n && n.n >= 2000) return json({ error: "full" }, 429);
    }
    await env.DB.prepare(`INSERT INTO votes (id, ${col}, ts) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET ${col} = excluded.${col}, ts = excluded.ts`)
      .bind(b.id, v, Date.now()).run();
    return json({ ok: true });
  } catch (e) { return json({ error: "db" }, 500); }
}
