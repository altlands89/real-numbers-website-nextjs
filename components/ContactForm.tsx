"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
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
          {status === "sent"
            ? "Thanks — we'll be in touch"
            : "Start the Conversation"}
        </button>
      </form>
      <p className="contact-fine">
        Prefer a direct conversation? Schedule a meeting with our team.
      </p>
    </>
  );
}
