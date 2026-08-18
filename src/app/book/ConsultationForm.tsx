"use client";

/**
 * ConsultationForm — for /book.
 * Server action: submitConsultation()
 */

import { useState, useTransition } from "react";
import { BONE_WHITE } from "@/lib/constants";
import { submitConsultation } from "./actions";

export default function ConsultationForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await submitConsultation(formData);
      setResult(r);
      if (r.ok) {
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  if (result?.ok) {
    return (
      <div
        style={{
          background: "rgba(139, 0, 0, 0.12)",
          border: "2px solid #8B0000",
          padding: "32px 28px",
          borderRadius: 2,
        }}
        role="status"
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            color: BONE_WHITE,
            margin: 0,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          Got it — we'll be in touch
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: BONE_WHITE, opacity: 0.85, margin: 0, marginBottom: 16 }}>
          You'll hear back within 1 business day. We'll go over your idea, placement, sizing, and schedule.
        </p>
        <p style={{ fontSize: 14, color: BONE_WHITE, opacity: 0.7, margin: 0 }}>
          When you're ready to lock your slot, the <strong>$65 non-refundable deposit</strong> can be paid in-person or via our booking link.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          style={{
            marginTop: 20,
            background: "transparent",
            color: BONE_WHITE,
            border: "2px solid rgba(245, 241, 232, 0.4)",
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: "pointer",
            borderRadius: 2,
          }}
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {result && !result.ok && result.error && (
        <div
          style={{
            background: "rgba(139, 0, 0, 0.2)",
            border: "2px solid #8B0000",
            padding: 14,
            color: BONE_WHITE,
            fontSize: 14,
            borderRadius: 2,
          }}
          role="alert"
        >
          {result.error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Your name" name="name" required placeholder="Alex Smith" />
        <Field label="Phone" name="phone" type="tel" required placeholder="(814) 555-0100" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Email" name="email" type="email" required placeholder="alex@example.com" />
        <Field label="Instagram (optional)" name="instagram" placeholder="@handle" />
      </div>

      <FieldTextarea
        label="Tell us about your idea"
        name="idea"
        required
        placeholder="What do you want? Describe the design, mood, references (other tattoos, art styles). Even rough ideas are great."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FieldSelect
          label="Approximate size"
          name="size"
          required
          options={[
            { value: "", label: "Select..." },
            { value: "small", label: "Small (under 4\")" },
            { value: "medium", label: "Medium (4\"-7\")" },
            { value: "large", label: "Large (8\"-12\")" },
            { value: "xl", label: "Extra Large (12\"+ / sleeve / back piece)" },
            { value: "unsure", label: "Not sure yet" },
          ]}
        />
        <FieldSelect
          label="Placement"
          name="placement"
          required
          options={[
            { value: "", label: "Select..." },
            { value: "forearm", label: "Forearm" },
            { value: "upper-arm", label: "Upper arm" },
            { value: "shoulder", label: "Shoulder" },
            { value: "back", label: "Back" },
            { value: "chest", label: "Chest" },
            { value: "ribs", label: "Ribs" },
            { value: "leg", label: "Leg / calf / thigh" },
            { value: "wrist", label: "Wrist / hand" },
            { value: "neck", label: "Neck" },
            { value: "other", label: "Other (tell us in the idea box above)" },
          ]}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field
          label="Preferred timeframe"
          name="dates"
          placeholder="e.g. 'next 2-3 weeks' or specific dates"
        />
        <FieldSelect
          label="Artist preference"
          name="artist"
          options={[
            { value: "no-preference", label: "No preference — surprise me" },
            { value: "isiah-jackson", label: "Isiah (lead artist, owner)" },
            { value: "courtney-fetzer", label: "Courtney (apprentice)" },
          ]}
        />
      </div>

      <FieldSelect
        label="Is this your first tattoo?"
        name="firstTattoo"
        options={[
          { value: "no", label: "No, I have others" },
          { value: "yes", label: "Yes — this will be my first" },
          { value: "first-with-shop", label: "First at this shop, but I've had others" },
        ]}
      />

      <button
        type="submit"
        disabled={pending}
        style={{
          background: pending ? "rgba(139, 0, 0, 0.5)" : "#8B0000",
          color: "#F5F1E8",
          border: "none",
          padding: "16px 32px",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: pending ? "wait" : "pointer",
          fontFamily: "var(--font-body)",
          borderRadius: 2,
          marginTop: 8,
        }}
      >
        {pending ? "Sending..." : "Send Consultation Request"}
      </button>

      <p style={{ fontSize: 13, color: BONE_WHITE, opacity: 0.5, margin: 0, textAlign: "center" }}>
        Free consultation. We'll respond within 1 business day.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: BONE_WHITE }}>
        {label} {required && <span style={{ color: "#8B0000" }}>*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="form-input"
        style={{ background: BONE_WHITE, color: "#0A0A0A" }}
      />
    </label>
  );
}

function FieldTextarea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: BONE_WHITE }}>
        {label} {required && <span style={{ color: "#8B0000" }}>*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="form-input"
        style={{ background: BONE_WHITE, color: "#0A0A0A", resize: "vertical", fontFamily: "inherit" }}
      />
    </label>
  );
}

function FieldSelect({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: BONE_WHITE }}>
        {label} {required && <span style={{ color: "#8B0000" }}>*</span>}
      </span>
      <select
        name={name}
        required={required}
        className="form-input"
        style={{ background: BONE_WHITE, color: "#0A0A0A" }}
        defaultValue=""
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}