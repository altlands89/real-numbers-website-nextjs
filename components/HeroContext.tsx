import CompositionDrift from "./CompositionDrift";

export default function HeroContext() {
  return (
    <section className="hero-context on-dark hairline-grid" data-reveal>
      <CompositionDrift
        src="/compositions/comp-16.svg"
        distance={130}
        seed={10}
        style={{
          left: "-10%",
          bottom: "-40%",
          width: 520,
          opacity: 0.14,
          filter: "invert(1) brightness(1.9)",
        }}
      />
      <div className="hero-context-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/masked/masked-11.png"
          alt="Colleagues walking through the office"
        />
      </div>
      <div className="wrap">
        <div className="hero-context-stack">
          <div className="hero-context-text">
            <p data-reveal style={{ transitionDelay: "0ms" }}>
              Growth brings opportunity — and uncertainty, in equal measure.
              More people, more capital, more decisions that will define what
              the business becomes.
            </p>
            <p data-reveal style={{ transitionDelay: "90ms" }}>
              We help founders and leadership teams trade uncertainty for
              clarity — combining financial precision with strategic thinking
              to give leaders the insight and confidence to decide well, at
              every stage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
