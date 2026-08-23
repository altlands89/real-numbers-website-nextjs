import CompositionDrift from "./CompositionDrift";

export default function FinalCta() {
  return (
    <section
      className="final-cta bg-photo"
      data-reveal
      style={{ backgroundImage: "url(/img/photography/home-final-cta.jpg)" }}
    >
      <CompositionDrift
        src="/compositions/comp-14.svg"
        distance={140}
        seed={9}
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(760px, 70vw)",
          opacity: 0.14,
          filter: "invert(1) brightness(1.9)",
        }}
      />
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Let&apos;s Talk</span>
          <h2 data-reveal className="reveal-heading">
            Better businesses are built on better decisions.
          </h2>
          <p className="lede" style={{ marginLeft: "auto", marginRight: "auto" }}>
            If you&apos;re looking for a financial partner who brings
            clarity, perspective, and long-term commitment to your leadership
            table, let&apos;s start the conversation.
          </p>
          <p className="closing-line">
            Let&apos;s build your next stage of growth — together.
          </p>
        </div>
        <div className="final-cta-action">
          <a href="/contact" className="btn btn-primary">
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </section>
  );
}
