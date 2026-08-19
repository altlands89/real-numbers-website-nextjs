export default function Hero() {
  return (
    <section className="hero on-dark hairline-grid" id="top">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/numcomp.svg"
        className="hero-numcomp"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap">
        <div className="hero-inner">
          <span className="eyebrow">
            Real Numbers · Financial Partner for Growth Companies
          </span>
          <h1>Real Numbers. Real Clarity. Real Confidence.</h1>
          <p className="sub">
            Every great business decision begins with knowing where you
            really stand.
          </p>
          <div className="body-copy">
            <p>
              Growth brings opportunity — and uncertainty, in equal measure.
              More people, more capital, more decisions that will define what
              the business becomes.
            </p>
            <p>
              We help founders and leadership teams trade uncertainty for
              clarity — combining financial precision with strategic thinking
              to give leaders the insight and confidence to decide well, at
              every stage.
            </p>
          </div>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              Let&apos;s Talk
            </a>
            <a href="/our-expertise" className="link-arrow">
              Explore Our Expertise →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
