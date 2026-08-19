"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "When does a company actually need a CFO?",
    a: "Not every company needs one full-time. But every growing company reaches a point where financial decisions get more complex, the stakes get higher, and instinct alone stops being enough. If you're hiring, raising, entering new markets, or deciding with less visibility than you'd like — it's time.",
  },
  {
    q: "How are you different from a traditional accounting firm?",
    a: "Traditional accounting explains what already happened. We help leadership understand what comes next — clarity, strategic perspective, and executive confidence alongside the accounting itself.",
  },
  {
    q: "Can you work alongside our existing finance team?",
    a: "Yes — it's one of our most common setups. We work alongside internal finance teams, controllers, and accountants, adding executive-level guidance where it's missing rather than replacing anyone.",
  },
  {
    q: "What type of companies do you usually work with?",
    a: "Mostly startups, technology companies, and growth-stage businesses — founders and executive teams who want a partner that understands both the business and the numbers behind it.",
  },
  {
    q: "We're not raising yet. Is this still the right time?",
    a: "Often, yes — this is the ideal time. Fundraising readiness starts long before the first investor conversation. The stronger your foundations today, the more options you'll have when the moment comes.",
  },
  {
    q: "Do you only support fundraising?",
    a: "No — it's one milestone among many. We support every stage of growth: operations, planning, board reporting, strategic decisions, and long-term growth planning.",
  },
  {
    q: "What does onboarding look like?",
    a: "We start by understanding your business — goals, challenges, priorities, growth plans — before recommending a framework. No standard package; every partnership is built around what your company needs.",
  },
  {
    q: "Is your model suitable for companies without an internal finance department?",
    a: "Absolutely — many of our clients are exactly that. Growing businesses often need executive-level financial expertise well before they need a full-time CFO. Our flexible model gets you there without the overhead.",
  },
  {
    q: "How do you measure success?",
    a: "Not in reports produced, but in decisions our clients are able to make with them — real clarity, real visibility, real confidence.",
  },
  {
    q: "What should we expect from working with Real Numbers?",
    a: "More than technical expertise: a partner who understands your business, communicates directly, challenges assumptions when it matters, and stays committed past the first engagement. The goal is simple — turn financial complexity into clarity, so leadership spends its time building the business, not decoding a spreadsheet.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {FAQS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={`faq-item${open ? " open" : ""}`} key={item.q}>
            <button
              className="faq-question"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span>{item.q}</span>
              <span className="faq-icon" aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            {open && <p className="faq-answer">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
