"use server";

/**
 * Server action for the book consultation form on /book.
 *
 * Demo-only: logs submission to console + KV (if available).
 * For production: pipe to Resend/email/SMS or forward to a CRM.
 */

interface BookSubmission {
  name: string;
  email: string;
  phone: string;
  instagram?: string;
  idea: string;
  size: string;
  placement: string;
  dates: string;
  firstTattoo: string;
  artistPreference: string;
}

interface BookResult {
  ok: boolean;
  error?: string;
}

export async function submitConsultation(formData: FormData): Promise<BookResult> {
  const submission: BookSubmission = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    instagram: String(formData.get("instagram") ?? "").trim() || undefined,
    idea: String(formData.get("idea") ?? "").trim(),
    size: String(formData.get("size") ?? "").trim(),
    placement: String(formData.get("placement") ?? "").trim(),
    dates: String(formData.get("dates") ?? "").trim(),
    firstTattoo: String(formData.get("firstTattoo") ?? "no"),
    artistPreference: String(formData.get("artist") ?? "no-preference"),
  };

  // Validation
  if (!submission.name || submission.name.length < 2) {
    return { ok: false, error: "We need your name to get back to you." };
  }
  if (!submission.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return { ok: false, error: "Please give us a valid email." };
  }
  if (!submission.phone || submission.phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "We need a phone number to call you back." };
  }
  if (!submission.idea || submission.idea.length < 20) {
    return { ok: false, error: "Tell us a bit more about your idea (20+ characters) so we can prep." };
  }

  // Demo: log submission (in production: send to email/CRM)
  // eslint-disable-next-line no-console
  console.log("[book] consultation request received:", {
    when: new Date().toISOString(),
    name: submission.name,
    contact: { email: submission.email, phone: submission.phone, instagram: submission.instagram },
    idea: submission.idea,
    size: submission.size,
    placement: submission.placement,
    dates: submission.dates,
    firstTattoo: submission.firstTattoo,
    artistPreference: submission.artistPreference,
    depositNote: "$65 non-refundable — required to lock the slot",
  });

  return { ok: true };
}