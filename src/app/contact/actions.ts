"use server";

/**
 * Server action for the contact form on /contact.
 *
 * Uses Resend to send an email to the configured RESEND_TO_EMAIL address.
 * Falls back gracefully if RESEND_API_KEY isn't set (dev mode logs to console).
 */

import { Resend } from "resend";
import { SHOP, DEPOSIT_MIN } from "@/lib/constants";

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

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL || process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    // Dev-mode: log + pretend success. The form will say "Thanks, we'll be in touch."
    console.log("[contact] RESEND_API_KEY or RESEND_TO_EMAIL not set — logging submission:", {
      to: "shop owner",
      from: submission.email,
      name: submission.name,
      phone: submission.phone ?? "(none)",
      subject: `[Bleeding Ink] ${submission.subject} — ${submission.name}`,
      message: submission.message,
    });
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Bleeding Ink Website <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      replyTo: submission.email,
      subject: `[Bleeding Ink] ${submission.subject} — ${submission.name}`,
      html: `
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
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return { ok: false, error: "Couldn't send your message — please try again or call us directly." };
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