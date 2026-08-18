"use server";

/**
 * Server action for the contact form on /contact.
 *
 * Runtime-agnostic:
 *   - In Node (dev/Vercel): uses Resend SDK, env via process.env
 *   - In Cloudflare Workers: uses Resend REST API via fetch, env via Cloudflare
 *     bindings OR compat `process.env` (via nodejs_compat flag).
 *
 * Falls back gracefully if no API key is set (logs only — useful for demo).
 */

import { DEPOSIT_MIN } from "@/lib/constants";

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ContactResult {
  ok: boolean;
  error?: string;
}

/** Read an env var from either Node's process.env or Cloudflare's env (workers) */
function getEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name];
  }
  // Cloudflare bindings — exposed on globalThis via the OpenNext adapter
  const cfEnv = (globalThis as { CloudflareEnv?: Record<string, string> }).CloudflareEnv;
  if (cfEnv && cfEnv[name]) return cfEnv[name];
  return undefined;
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const submission: ContactSubmission = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    subject: String(formData.get("subject") ?? "General inquiry").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Server-side validation
  if (!submission.name || submission.name.length < 2) {
    return { ok: false, error: "Please give us your name." };
  }
  if (!submission.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return { ok: false, error: "Please give us a valid email address." };
  }
  if (!submission.message || submission.message.length < 10) {
    return { ok: false, error: "Tell us a little more about what you have in mind (10+ characters)." };
  }
  if (submission.message.length > 4000) {
    return { ok: false, error: "Message is too long — keep it under 4,000 characters." };
  }

  const apiKey = getEnv("RESEND_API_KEY");
  const toEmail = getEnv("RESEND_TO_EMAIL") || getEnv("CONTACT_TO_EMAIL");
  const fromAddress =
    getEnv("RESEND_FROM_EMAIL") || "Bleeding Ink Website <onboarding@resend.dev>";

  const subjectLine = `[Bleeding Ink] ${submission.subject} — ${submission.name}`;
  const html = `
    <h2>New contact form submission</h2>
    <table style="border-collapse: collapse;">
      <tr><td style="padding: 4px 12px 4px 0;"><strong>Name</strong></td><td>${escapeHtml(submission.name)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0;"><strong>Email</strong></td><td>${escapeHtml(submission.email)}</td></tr>
      ${submission.phone ? `<tr><td style="padding: 4px 12px 4px 0;"><strong>Phone</strong></td><td>${escapeHtml(submission.phone)}</td></tr>` : ""}
      <tr><td style="padding: 4px 12px 4px 0;"><strong>Subject</strong></td><td>${escapeHtml(submission.subject)}</td></tr>
    </table>
    <h3>Message</h3>
    <p style="white-space: pre-wrap;">${escapeHtml(submission.message)}</p>
    <hr>
    <p style="color: #888; font-size: 12px;">
      Sent from bleedinginktattoo.com contact form. Deposit reminder: $${DEPOSIT_MIN} non-refundable.
    </p>
  `;

  if (!apiKey || !toEmail) {
    // Demo / dev-mode: log + pretend success. The form will say "Thanks, we'll be in touch."
    console.log("[contact] RESEND_API_KEY or RESEND_TO_EMAIL not set — logging submission:", {
      to: toEmail || "shop owner (not configured)",
      from: submission.email,
      subject: subjectLine,
      message: submission.message,
    });
    return { ok: true };
  }

  try {
    // Use the Resend REST API directly — works in both Node and Workers runtimes
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: toEmail,
        reply_to: submission.email,
        subject: subjectLine,
        html,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("[contact] Resend error:", resp.status, body);
      return { ok: false, error: "Couldn’t send your message — please try again or call us directly." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return { ok: false, error: "Something went wrong on our end. Please try again." };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
