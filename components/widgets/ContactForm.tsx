"use client";

import { useState } from "react";

/**
 * Generic contact form widget.
 *
 * Emitted when ``engine/detect_widgets`` finds a ``<form>`` with an email
 * input, a submit button, and no risky controls (password / file / CAPTCHA).
 * Fields are replayed as native HTML controls with React state so the form
 * submits via ``fetch`` to ``action`` (default ``/api/contact``). The generic
 * API route always returns 200 — consumers wire up real delivery themselves.
 */
type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "date"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";

export type ContactFormField = {
  type: FieldType;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type ContactFormProps = {
  fields?: ContactFormField[];
  action?: string;
  method?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  fields,
  action = "/api/contact",
  method = "post",
  submitLabel = "Send",
  successMessage = "Thanks — we'll get back to you shortly.",
  errorMessage = "Something went wrong. Please try again.",
}: ContactFormProps) {
  const safe = Array.isArray(fields) ? fields.filter(isValidField) : [];
  const [status, setStatus] = useState<Status>("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  if (safe.length === 0) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorDetail(null);

    try {
      const form = new FormData(e.currentTarget);
      const payload: Record<string, unknown> = {};
      form.forEach((value, key) => {
        const existing = payload[key];
        if (existing === undefined) {
          payload[key] = value;
        } else if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          payload[key] = [existing, value];
        }
      });

      const res = await fetch(action, {
        method: method.toUpperCase(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setErrorDetail(txt || `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="react-widget-contact-success">
        {successMessage}
      </div>
    );
  }

  return (
    <form
      className="react-widget-contact-form"
      onSubmit={onSubmit}
      noValidate
    >
      {safe.map((field, i) => (
        <FieldView key={`${field.name}-${i}`} field={field} />
      ))}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="react-widget-contact-submit"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
      {status === "error" ? (
        <p role="alert" className="react-widget-contact-error">
          {errorMessage}
          {errorDetail ? (
            <span style={{ display: "block", opacity: 0.75, fontSize: "0.85em" }}>
              {errorDetail}
            </span>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}

function FieldView({ field }: { field: ContactFormField }) {
  const common = {
    id: field.name,
    name: field.name,
    required: Boolean(field.required),
    placeholder: field.placeholder || undefined,
  };

  if (field.type === "textarea") {
    return (
      <label className="react-widget-contact-field" htmlFor={field.name}>
        <span>
          {field.label}
          {field.required ? " *" : ""}
        </span>
        <textarea {...common} rows={4} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="react-widget-contact-field" htmlFor={field.name}>
        <span>
          {field.label}
          {field.required ? " *" : ""}
        </span>
        <select {...common} defaultValue="">
          <option value="" disabled>
            {field.placeholder || field.label}
          </option>
          {(field.options ?? []).map((opt, i) => (
            <option key={`${opt.value}-${i}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "checkbox" || field.type === "radio") {
    return (
      <label
        className="react-widget-contact-field react-widget-contact-checkbox"
        htmlFor={field.name}
      >
        <input type={field.type} {...common} />
        <span>
          {field.label}
          {field.required ? " *" : ""}
        </span>
      </label>
    );
  }

  return (
    <label className="react-widget-contact-field" htmlFor={field.name}>
      <span>
        {field.label}
        {field.required ? " *" : ""}
      </span>
      <input type={field.type} {...common} />
    </label>
  );
}

function isValidField(x: unknown): x is ContactFormField {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return (
    typeof obj.type === "string" &&
    typeof obj.name === "string" &&
    typeof obj.label === "string"
  );
}
