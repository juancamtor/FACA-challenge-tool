import { init, json, getState } from "../../lib/db.js";
// Estado público: ronda de voto, interruptor de la consola y votos. Todos los clientes lo consultan cada pocos segundos.
export async function onRequestGet({ env }) {
  try {
    await init(env);
    const st = await getState(env);
    const votes = ((await env.DB.prepare("SELECT id, pre, post FROM votes").all()).results) || [];
    return json({ ...st, votes });
  } catch (e) { return json({ error: "db" }, 500); }
}
