"use client";

import { useRef } from "react";
import Image from "next/image";
import CompositionDrift from "./CompositionDrift";
import ScrollDots from "./ScrollDots";

const PILLARS = [
  {
    icon: "/icons/clarity.svg",
    title: "Clarity",
    text: "Know where your business really stands.",
  },
  {
    icon: "/icons/confidence.svg",
    title: "Confidence",
    text: "Decide on insight, not assumption.",
  },
  {
    icon: "/icons/growth.svg",
    title: "Growth",
    text: "Build financial foundations that scale with your ambition.",
  },
  {
    icon: "/icons/visibility.svg",
    title: "Visibility",
    text: "See the full picture before your next move.",
  },
];

export default function Philosophy() {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="philosophy" data-reveal>
      <CompositionDrift
        src="/compositions/comp-11.svg"
        distance={160}
        seed={4}
        style={{ right: "-12%", bottom: "-14%", width: 590, opacity: 0.18 }}
      />
      <div className="wrap">
        <div className="philosophy-top">
          <div>
            <span className="eyebrow">Our Philosophy</span>
            <h2 data-reveal className="reveal-heading">
              We don&apos;t manage numbers. We help leaders make better
              decisions.
            </h2>
          </div>
          <p className="lede">
            Financial information isn&apos;t an end in itself. Its job is to
            show leadership reality clearly enough to spot opportunity,
            manage risk, and move forward with conviction.
          </p>
          <p className="lede" style={{ marginTop: 16 }}>
            So we don&apos;t measure our value by the reports we produce —
            we measure it by the decisions they make possible. Real clarity
            moves businesses faster, plans them better, and grows them
            stronger.
          </p>
        </div>

        <h3 className="pillars-kicker">
          Every important decision starts with a number
        </h3>

        <div className="pillars-rail-wrap">
          <div className="pillars-rail" ref={railRef}>
            {PILLARS.map((p, i) => (
              <div
                className="pillar-tile"
                key={p.title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="tile-num">0{i + 1}</span>
                <Image
                  className="pillar-tile-icon"
                  src={p.icon}
                  alt=""
                  width={46}
                  height={46}
                />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
        <ScrollDots railRef={railRef} count={PILLARS.length} className="pillars-dots" />

        <div className="philosophy-cta">
          <a href="/about" className="btn btn-outline-dark">
            More About Us
          </a>
        </div>
      </div>
    </section>
  );
}
