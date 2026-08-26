import CompositionDrift from "./CompositionDrift";
import PillWord from "./PillWord";
import PhotoSlideshow from "./PhotoSlideshow";

const FEATURE_IMAGES = [
  "/img/photography/team-hero.jpg",
  "/img/photography/about-atmosphere.jpg",
  "/img/photography/faq-atmosphere.jpg",
  "/img/photography/home-final-cta.jpg",
  "/img/photography/contact-hero.jpg",
  "/img/photography/why-hero.jpg",
];

const LOGOS = [
  { src: "/img/logos/mccann.png", alt: "McCann" },
  { src: "/img/logos/fix.png", alt: "Fix" },
  { src: "/img/logos/dominos.png", alt: "Domino's" },
  { src: "/img/logos/asus.png", alt: "ASUS" },
  { src: "/img/logos/yes.png", alt: "yes" },
];

export default function HeroV2() {
  return (
    <section className="v2-hero">
      <div className="v2-hero-backdrop" aria-hidden="true">
        <div className="v2-hero-glow v2-hero-glow--a" />
        <div className="v2-hero-glow v2-hero-glow--b" />
        <CompositionDrift
          src="/compositions/comp-5.svg"
          distance={140}
          seed={11}
          style={{ left: "-8%", top: "-10%", width: 620, opacity: 0.5 }}
        />
        <CompositionDrift
          src="/compositions/comp-11.svg"
          distance={120}
          seed={22}
          style={{ right: "-6%", top: "10%", width: 520, opacity: 0.4 }}
        />
        <CompositionDrift
          src="/compositions/comp-14.svg"
          distance={160}
          seed={33}
          style={{ left: "18%", bottom: "-14%", width: 460, opacity: 0.35 }}
        />
      </div>

      <div className="wrap v2-hero-inner">
        <h1 className="v2-hero-headline" data-reveal>
          Real numbers.
          <br />
          Real clarity
          <PillWord color="var(--red)" />
          and
          <br />
          real confidence.
        </h1>
        <div className="v2-hero-foot">
          <p className="v2-hero-desc">
            Real Numbers is a financial partnership platform that backs
            growing companies and turns financial complexity into clear,
            confident decisions — at every stage.
          </p>
          <div className="v2-hero-ctas">
            <a href="/contact" className="v2-pill-link v2-pill-link--solid">
              Let&apos;s Talk <span>→</span>
            </a>
            <a href="/our-expertise" className="v2-pill-link">
              Our Expertise <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="v2-photo-feature" data-reveal>
          <PhotoSlideshow images={FEATURE_IMAGES} />
          <div className="v2-photo-feature-overlay">
            <h2>
              A partnership
              <br />
              that works
            </h2>
            <a href="/about" className="v2-pill-link">
              Our approach <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap v2-logos-strip">
        <div className="v2-logos-row">
          {LOGOS.map((l) => (
            <div className="v2-logo-chip" key={l.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.alt} />
            </div>
          ))}
        </div>
        <a href="/why-real-numbers" className="v2-pill-link">
          Why Real Numbers <span>→</span>
        </a>
      </div>
    </section>
  );
}
