import { init, json, putKV, safeEqual } from "../../lib/db.js";
// Acciones del presentador. Se protegen con la variable secreta ADMIN_PASSWORD (Cloudflare → Settings → Variables and Secrets).
export async function onRequestPost({ env, request }) {
  try {
    const b = await request.json().catch(() => null);
    if (!b || !env.ADMIN_PASSWORD || !safeEqual(String(b.pw || ""), String(env.ADMIN_PASSWORD))) return json({ error: "unauthorized" }, 401);
    await init(env);
    switch (b.action) {
      case "check": return json({ ok: true });
      case "setPoll": {
        const round = b.round === "post" ? "post" : "pre";
        await putKV(env, "poll", { round, open: b.open === true, reveal: b.reveal === true });
        return json({ ok: true });
      }
      case "setSite": await putKV(env, "site", { show: b.show === true }); return json({ ok: true });
      case "deleteVote":
        if (typeof b.id !== "string") return json({ error: "bad id" }, 400);
        await env.DB.prepare("DELETE FROM votes WHERE id = ?").bind(b.id).run();
        return json({ ok: true });
      default: return json({ error: "unknown action" }, 400);
    }
  } catch (e) { return json({ error: "db" }, 500); }
}
