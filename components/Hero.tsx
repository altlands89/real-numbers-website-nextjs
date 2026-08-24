import CompositionInteractive from "./CompositionInteractive";

export default function Hero() {
  return (
    <section className="hero hairline-grid" id="top">
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
          <h1 data-reveal className="reveal-heading">
            Real Numbers.
            <br />
            Real Clarity.
            <br />
            Real Confidence.
          </h1>
          <p className="sub">
            Every great business decision begins with knowing where you
            really stand.
          </p>
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
      <CompositionInteractive
        src="/compositions/comp-5.svg"
        scrollDistance={70}
        mouseDistance={46}
        seed={1}
        className="hero-composition"
        style={{
          right: "0%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "clamp(420px, 40vw, 720px)",
          opacity: 0.9,
        }}
      />
    </section>
  );
}
