"use client";

import { useState, FormEvent } from "react";

type Props = {
  directContactLabel?: string;
  whatsappNumber?: string;
  email?: string;
};

export default function ContactForm({
  directContactLabel = "Prefer a direct conversation?",
  whatsappNumber = "972523735059",
  email = "Uzi@realnumbers.co.il",
}: Props) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Not wired to a backend yet — client-side confirmation only.
    setStatus("sent");
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
              <input id="firstName" type="text" required />
            </div>
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-user.svg" alt="" className="field-icon" />
              <input id="lastName" type="text" required />
            </div>
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-building.svg" alt="" className="field-icon" />
              <input id="company" type="text" required />
            </div>
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-role.svg" alt="" className="field-icon" />
              <input id="role" type="text" />
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-email.svg" alt="" className="field-icon" />
              <input id="email" type="email" required />
            </div>
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-phone.svg" alt="" className="field-icon" />
              <input id="phone" type="tel" />
            </div>
          </div>
          <div className="full">
            <label htmlFor="message">How can we help?</label>
            <div className="field-input-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/ic-chat.svg" alt="" className="field-icon field-icon--top" />
              <textarea id="message" rows={4} />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {status === "sent" ? "Thanks, we'll be in touch" : "Let's Talk"}
        </button>
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
