"use client";

import { useState, FormEvent } from "react";
// import { supabase } from "@/lib/supabase";

export default function FinalCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Not wired to a backend yet. Once the `leads` table exists in Supabase:
    //   await supabase?.from("leads").insert({ name, email });
    // For now this just confirms the form works client-side.
    setStatus("sent");
  }

  return (
    <section className="final-cta hairline-grid" id="contact">
      <div className="wrap final-grid">
        <div>
          <span className="eyebrow">Let&apos;s Talk</span>
          <h2>Better businesses are built on better decisions.</h2>
          <p className="lede">
            If you&apos;re looking for a financial partner who brings
            clarity, perspective, and long-term commitment to your leadership
            table, let&apos;s start the conversation.
          </p>
          <p className="closing-line">
            Let&apos;s build your next stage of growth — together.
          </p>
          <a href="#contact" className="btn btn-primary">
            Let&apos;s Talk
          </a>
        </div>

        <form className="mini-form" onSubmit={handleSubmit}>
          <span className="form-title">Start the conversation</span>
          <input
            type="text"
            placeholder="Full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Work email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            {status === "sent" ? "Thanks — we'll be in touch" : "Start the Conversation"}
          </button>
          <span className="fine">
            Prefer a direct conversation? Schedule a meeting with our team.
          </span>
        </form>
      </div>
    </section>
  );
}
