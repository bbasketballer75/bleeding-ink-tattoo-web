"use client";

/**
 * ContactForm — client component for /contact.
 *
 * Uses the server action submitContact() defined in ./actions.ts.
 * Shows success / error state inline.
 */

import { useState, useTransition } from "react";
import { submitContact } from "./actions";
import { BLEED_RED } from "@/lib/constants";

const SUBJECTS = [
  "General inquiry",
  "Custom tattoo consultation",
  "Coverup consultation",
  "Walk-in question",
  "Other",
];

export default function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string; preview?: Record<string, string> } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitContact(formData);
      setResult(res);
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  if (result?.ok) {
    return (
      <div
        style={{
          padding: 32,
          background: "var(--color-bone-white)",
          color: "var(--color-ink-black)",
          border: `2px solid ${BLEED_RED}`,
        }}
        role="status"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              background: BLEED_RED,
              color: "var(--color-bone-white)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
            aria-hidden
          >
            ✓
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              textTransform: "uppercase",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Message received
          </h3>
        </div>
        <p style={{ margin: "0 0 16px", opacity: 0.85, fontSize: 15, lineHeight: 1.6 }}>
          We'll respond within <strong>1 business day</strong>. For anything urgent, give us a call during shop hours.
        </p>

        {/* Summary of what they submitted (helps them remember they sent it) */}
        {result.preview && (
          <details
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid rgba(10, 10, 10, 0.1)",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Your submission
            </summary>
            <dl style={{ margin: 0, fontSize: 13 }}>
              {Object.entries(result.preview).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 6 }}>
                  <dt style={{ display: "inline", fontWeight: 700, textTransform: "capitalize", marginRight: 6 }}>{k}:</dt>
                  <dd style={{ display: "inline", margin: 0, opacity: 0.8 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </details>
        )}

        <button
          type="button"
          onClick={() => setResult(null)}
          style={{
            marginTop: 20,
            background: "transparent",
            color: BLEED_RED,
            border: `2px solid ${BLEED_RED}`,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Your name *
        </label>
        <input id="name" name="name" type="text" required className="form-input" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <div>
          <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Email *
          </label>
          <input id="email" name="email" type="email" required className="form-input" />
        </div>
        <div>
          <label htmlFor="phone" style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Phone (optional)
          </label>
          <input id="phone" name="phone" type="tel" className="form-input" />
        </div>
      </div>

      <div>
        <label htmlFor="subject" style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          What can we help with?
        </label>
        <select id="subject" name="subject" className="form-input" defaultValue="General inquiry">
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Tell us about your idea *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className="form-input"
          placeholder="Style, size, placement, references — anything that helps us picture what you have in mind."
        />
      </div>

      {result?.error && (
        <div
          style={{
            padding: 12,
            background: "rgba(139, 0, 0, 0.1)",
            border: `1px solid ${BLEED_RED}`,
            color: BLEED_RED,
            fontSize: 14,
          }}
        >
          {result.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
        style={{ fontSize: 16, padding: "16px 32px", cursor: pending ? "wait" : "pointer", opacity: pending ? 0.7 : 1 }}
      >
        {pending ? "Sending..." : "Send Message"}
      </button>

      <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
        We respond within 2 business days. Your info stays with us — we never share or sell.
      </p>
    </form>
  );
}