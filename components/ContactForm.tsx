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
            <input id="firstName" type="text" required />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" required />
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <input id="company" type="text" required />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <input id="role" type="text" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="tel" />
          </div>
          <div className="full">
            <label htmlFor="message">How can we help?</label>
            <textarea id="message" rows={4} />
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
