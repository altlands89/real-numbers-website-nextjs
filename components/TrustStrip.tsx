import CompositionDrift from "./CompositionDrift";

export default function TrustStrip() {
  return (
    <section className="trust">
      <CompositionDrift
        src="/compositions/comp-10.svg"
        distance={120}
        style={{ left: "-6%", top: "-40%", width: 300, opacity: 0.09 }}
      />
      <div className="wrap">
        <p>
          Trusted by founders and CEOs building the next generation of
          technology and growth companies
        </p>
        <div className="logo-row" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="logo-chip" key={i}>
              <span className="dot"></span>
              <span className="bar"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
