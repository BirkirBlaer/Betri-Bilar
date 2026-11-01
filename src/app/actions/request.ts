"use server";

import { headers } from "next/headers";
import { company } from "@/content/site";
import { requestSchema, type RequestFields, type RequestState } from "@/lib/request-schema";

/**
 * Appointment-request form handler.
 *
 * Delivery: Resend (https://resend.com) via its HTTP API — free tier covers a workshop's volume.
 *   RESEND_API_KEY     required to send
 *   CONTACT_TO_EMAIL   where requests go (defaults to the company email)
 *   CONTACT_FROM_EMAIL verified sender, e.g. "Vefsíða Betri Bíla <vefur@betribilar.is>"
 * Without RESEND_API_KEY nothing is sent and the visitor is told so plainly.
 *
 * Spam protection: hidden honeypot field, minimum fill time, and a per-IP rate limit.
 * The rate limit is in memory (per server instance); add Upstash/Vercel KV if spam becomes an issue.
 */

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const methodLabel = { simi: "Símtal", netfang: "Tölvupóstur" } as const;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendRequest(_prev: RequestState, form: FormData): Promise<RequestState> {
  const raw = {
    name: String(form.get("name") ?? ""),
    contact: String(form.get("contact") ?? ""),
    vehicle: String(form.get("vehicle") ?? ""),
    message: String(form.get("message") ?? ""),
    method: String(form.get("method") ?? ""),
  };

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<keyof RequestFields, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RequestFields;
      errors[key] ??= issue.message;
    }
    return { status: "invalid", errors, values: raw as Partial<RequestFields> };
  }

  // Bots: filled the hidden field, or submitted faster than a person can type.
  const started = Number(form.get("t") ?? 0);
  const honeypot = String(form.get("website") ?? "");
  if (honeypot || !started || Date.now() - started < MIN_FILL_MS) {
    // Do not reveal the check to bots — but never tell a person it was sent either.
    return { status: "failed" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return { status: "rate_limited" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "not_configured" };

  const d = parsed.data;
  const replyTo = d.contact.includes("@") ? d.contact : undefined;
  const text = [
    `Beiðni um tíma frá vefsíðu ${company.name}`,
    "",
    `Nafn: ${d.name}`,
    `Sími / netfang: ${d.contact}`,
    `Bíll: ${d.vehicle}`,
    `Vill að haft sé samband með: ${methodLabel[d.method]}`,
    "",
    "Lýsing:",
    d.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Vefsíða <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? company.email],
        reply_to: replyTo,
        subject: `Beiðni um tíma: ${d.vehicle} — ${d.name}`,
        text,
        html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${esc(text)}</pre>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text().catch(() => ""));
      return { status: "failed" };
    }
    return { status: "sent" };
  } catch (err) {
    console.error("Request form delivery failed", err);
    return { status: "failed" };
  }
}
