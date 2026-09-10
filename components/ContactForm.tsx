"use client";

import { useState, FormEvent, ReactNode } from "react";

type Props = {
  directContactLabel?: ReactNode;
  whatsappNumber?: string;
  email?: string;
};

export default function ContactForm({
  directContactLabel = "Prefer a direct conversation?",
  whatsappNumber = "972523735059",
  email = "Uzi@realnumbers.co.il",
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a field no human sees, so anything that fills it is a bot.
    // Answer as if it succeeded rather than revealing the check.
    if (data.get("website")) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          role: data.get("role"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-grid">
          <div>
            <label htmlFor="firstName">First Name</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-user.svg" alt="" className="field-icon" />
              <input id="firstName" name="firstName" type="text" autoComplete="given-name" required />
            </div>
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-user.svg" alt="" className="field-icon" />
              <input id="lastName" name="lastName" type="text" autoComplete="family-name" required />
            </div>
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-building.svg" alt="" className="field-icon" />
              <input id="company" name="company" type="text" autoComplete="organization" required />
            </div>
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-role.svg" alt="" className="field-icon" />
              <input id="role" name="role" type="text" autoComplete="organization-title" />
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-email.svg" alt="" className="field-icon" />
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-phone.svg" alt="" className="field-icon" />
              <input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          </div>
          <div className="full">
            <label htmlFor="message">How can we help?</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-chat.svg" alt="" className="field-icon field-icon--top" />
              <textarea id="message" name="message" rows={4} />
            </div>
          </div>
        </div>
        {/* Honeypot — hidden from people, catnip for bots. Not `display:none`,
            which some bots skip; off-screen and untabbable instead. */}
        <div className="contact-hp" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending"
            ? "Sending…"
            : status === "sent"
              ? "Thanks, we'll be in touch"
              : "Let's Talk"}
        </button>
        <p className="contact-form-status" role="status" aria-live="polite">
          {status === "sent" && "Got it — we'll get back to you shortly."}
          {status === "error" && (
            <span className="is-error">
              Something went wrong sending that. Please try again, or email us directly at{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </span>
          )}
        </p>
      </form>
      <div className="contact-direct">
        <p className="contact-direct-text">{directContactLabel}</p>
        <div className="contact-direct-links">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-direct-icon"
            aria-label="Message us on WhatsApp"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/ic-whatsapp.svg" alt="" />
          </a>
          <a
            href={`mailto:${email}`}
            className="contact-direct-icon"
            aria-label="Email us"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/ic-email.svg" alt="" />
          </a>
        </div>
      </div>
    </>
  );
}
