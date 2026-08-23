import CompositionDrift from "./CompositionDrift";

const LOGOS = [
  { src: "/img/logos/mccann.png", alt: "McCann" },
  { src: "/img/logos/fix.png", alt: "Fix" },
  { src: "/img/logos/dominos.png", alt: "Domino's" },
  { src: "/img/logos/asus.png", alt: "ASUS" },
  { src: "/img/logos/yes.png", alt: "yes" },
];

export default function TrustStrip() {
  return (
    <section className="trust">
      <CompositionDrift
        src="/compositions/comp-10.svg"
        distance={140}
        seed={2}
        style={{ left: "-10%", top: "-50%", width: 420, opacity: 0.17 }}
      />
      <div className="wrap">
        <p>
          Trusted by founders and CEOs building the next generation of
          technology and growth companies
        </p>
        <div className="logo-row">
          {LOGOS.map((l) => (
            <div className="logo-chip" key={l.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.alt} className="logo-mark" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
