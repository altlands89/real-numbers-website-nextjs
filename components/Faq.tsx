"use client";

import { useState } from "react";

type FaqItem = { question: string; answer: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div className={`faq-item${open ? " open" : ""}`} key={item.question}>
            <button
              className="faq-question"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span>{item.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            {open && <p className="faq-answer">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
