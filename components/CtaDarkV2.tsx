import CompositionDrift from "./CompositionDrift";

export default function CtaDarkV2({ heading, ctaLabel }: { heading: string; ctaLabel: string }) {
  return (
    <section className="v2-cta-dark">
      <CompositionDrift
        src="/compositions/comp-17.svg"
        distance={130}
        seed={44}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 70vw)",
          opacity: 0.4,
        }}
      />
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          {heading.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <a href="/why-real-numbers" className="v2-pill-link">
          {ctaLabel} <span>→</span>
        </a>
      </div>
    </section>
  );
}
