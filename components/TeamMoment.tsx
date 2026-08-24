import Parallax from "./Parallax";

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
            <Parallax strength={26} style={{ width: "100%", height: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/masked/masked-11.png" alt="" />
            </Parallax>
          </div>
          <div
            className="team-moment-photo team-moment-photo--b"
            data-reveal
            style={{ transitionDelay: "90ms" }}
          >
            <Parallax strength={42} style={{ width: "100%", height: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/masked/masked-19.png" alt="" />
            </Parallax>
          </div>
          <div
            className="team-moment-photo team-moment-photo--c"
            data-reveal
            style={{ transitionDelay: "180ms" }}
          >
            <Parallax strength={16} style={{ width: "100%", height: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/masked/masked-20.png" alt="" />
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
