export default function TrustStrip() {
  return (
    <section className="trust">
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
