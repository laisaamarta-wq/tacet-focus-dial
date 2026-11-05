import { z } from "zod";

/**
 * Reservation form endpoint.
 * Delivery is configured with environment variables (see README):
 *   RESEND_API_KEY + CONTACT_TO (+ CONTACT_FROM) — email via Resend
 *   CONTACT_WEBHOOK_URL — JSON to any webhook (Make, Zapier, n8n…)
 * Without them, reservations are written to the server log.
 */

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  tier: z.string().trim().max(40).optional().default(""),
  finish: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true),
  company: z.string().optional(), // honeypot
});

// Simple rate limit: 5 submissions per IP per 10 minutes
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  }
  const d = parsed.data;

  // A bot filled the hidden field — reply OK, send nothing
  if (d.company) return Response.json({ ok: true });

  const lines = [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone && `Phone: ${d.phone}`,
    d.tier && `Package: ${d.tier}`,
    d.finish && `Finish: ${d.finish}`,
    d.message && `Message: ${d.message}`,
  ].filter(Boolean) as string[];

  let delivered = false;
  try {
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "TACET <onboarding@resend.dev>",
          to: process.env.CONTACT_TO.split(",").map((s) => s.trim()),
          reply_to: d.email,
          subject: `New reservation: ${d.name}`,
          text: lines.join("\n"),
          html: `<p>${lines.map(escape).join("<br>")}</p>`,
        }),
      });
      if (!r.ok) throw new Error(`resend ${r.status}`);
      delivered = true;
    } else if (process.env.CONTACT_WEBHOOK_URL) {
      const r = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, company: undefined, receivedAt: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      delivered = true;
    } else {
      console.info("[contact] Delivery not configured, reservation:\n" + lines.join("\n"));
    }
  } catch (err) {
    console.error("[contact] Delivery failed", err);
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true, delivered });
}
