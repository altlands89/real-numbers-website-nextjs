import ShatterComposition from "./ShatterComposition";

const BENEFITS = [
  "Teams plan with more confidence",
  "Investment decisions carry stronger conviction",
  "Growth becomes intentional, not reactive",
  "Problems surface early enough to fix",
];

export default function Momentum() {
  return (
    <section className="momentum hairline-grid" data-reveal>
      <ShatterComposition
        src="/compositions/comp-5.svg"
        distance={150}
        style={{
          right: "-10%",
          bottom: "-16%",
          width: 480,
          opacity: 0.14,
          filter: "invert(1) brightness(1.9)",
        }}
      />
      <div className="wrap momentum-grid">
        <div>
          <span className="eyebrow" style={{ color: "var(--offwhite)" }}>
            Real Clarity, Real Momentum
          </span>
          <h2>The cost of finding out too late</h2>
          <div className="momentum-copy">
            <p>
              The companies that struggle rarely lack ambition. More often,
              they find out too late that their numbers weren&apos;t telling
              the full story. Real clarity doesn&apos;t just make good
              decisions easier — it makes bad ones visible in time to change
              course.
            </p>
          </div>
        </div>
        <div>
          <p style={{ opacity: 0.85, fontSize: "1.02rem", marginBottom: 22 }}>
            When leadership sees the full picture, every part of the business
            benefits:
          </p>
          <ul className="momentum-list">
            {BENEFITS.map((b) => (
              <li key={b}>
                <span className="mark">✓</span> {b}
              </li>
            ))}
          </ul>
          <p className="momentum-closing">
            That&apos;s the actual return on financial clarity. Not better
            spreadsheets. Better leadership.
          </p>
        </div>
      </div>
    </section>
  );
}
