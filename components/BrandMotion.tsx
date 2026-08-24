export default function BrandMotion() {
  return (
    <section className="brand-motion on-dark" data-reveal>
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Our Mark</span>
          <h2 data-reveal className="reveal-heading">
            Real Numbers, in motion
          </h2>
        </div>
        <div className="atmosphere-photo brand-motion-video">
          <video autoPlay muted loop playsInline aria-hidden="true">
            <source src="/videos/rn-comp-1.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
