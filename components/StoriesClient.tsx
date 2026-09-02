"use client";

import { useRef } from "react";
import CompositionDrift from "./CompositionDrift";
import ScrollDots from "./ScrollDots";
import QuoteMark from "./QuoteMark";

type Story = { quote: string; name: string; role: string };

type Props = {
  eyebrow: string;
  heading: string;
  stories: Story[];
};

export default function StoriesClient({ eyebrow, heading, stories }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="stories" id="use-cases" data-reveal>
      <CompositionDrift
        src="/compositions/comp-13.svg"
        distance={160}
        seed={8}
        style={{ right: "-12%", top: "-16%", width: 590, opacity: 0.18 }}
      />
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">{eyebrow}</span>
          <h2 data-reveal className="reveal-heading">
            {heading}
          </h2>
        </div>
        <div className="stories-grid-wrap">
          <div className="stories-grid" ref={railRef}>
            {stories.map((s, i) => (
              <div
                className="story-card"
                key={s.name}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <QuoteMark />
                <p className="story-text">{s.quote}</p>
                {/* Closing mark sits bottom-right so the pair brackets the
                    quote, instead of trailing the last word like a typo. */}
                <QuoteMark close />
                <p className="attribution">
                  {s.name}
                  {s.role ? `, ${s.role}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
        <ScrollDots railRef={railRef} count={stories.length} />
      </div>
    </section>
  );
}
