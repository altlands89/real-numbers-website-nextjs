export default function TeamMoment() {
  return (
    <section className="team-moment" data-reveal>
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Real Partnership</span>
          <h2 data-reveal className="reveal-heading">
            Real people, real conversations, real decisions.
          </h2>
        </div>
        <div className="team-moment-cluster">
          <div className="team-moment-photo team-moment-photo--a" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/masked/masked-2.png" alt="" />
          </div>
          <div
            className="team-moment-photo team-moment-photo--b"
            data-reveal
            style={{ transitionDelay: "90ms" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/masked/masked-9.png" alt="" />
          </div>
          <div
            className="team-moment-photo team-moment-photo--c"
            data-reveal
            style={{ transitionDelay: "180ms" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/masked/masked-6.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
