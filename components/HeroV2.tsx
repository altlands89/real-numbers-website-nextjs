import CompositionDrift from "./CompositionDrift";
import PhotoSlideshow from "./PhotoSlideshow";
import RotatingWord from "./RotatingWord";
import LogoMarquee from "./LogoMarquee";

type Logo = { src: string; alt: string; href?: string };

type Props = {
  rotatingWords: string[];
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  featuredHeading: string;
  featuredCtaLabel: string;
  featuredImages: string[];
  logos: Logo[];
  logosCtaLabel: string;
};

export default function HeroV2({
  rotatingWords,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
  featuredHeading,
  featuredCtaLabel,
  featuredImages,
  logos,
  logosCtaLabel,
}: Props) {
  return (
    <section className="v2-hero">
      <div className="v2-hero-backdrop" aria-hidden="true">
        <div className="v2-hero-glow v2-hero-glow--a" />
        <div className="v2-hero-glow v2-hero-glow--b" />
        <CompositionDrift
          src="/compositions/comp-5.svg"
          distance={220}
          seed={11}
          swayScale={2.2}
          style={{ left: "-8%", top: "-10%", width: 620, opacity: 0.5 }}
        />
        <CompositionDrift
          src="/compositions/comp-11.svg"
          distance={190}
          seed={22}
          swayScale={2.2}
          style={{ right: "-6%", top: "10%", width: 520, opacity: 0.4 }}
        />
        <CompositionDrift
          src="/compositions/comp-14.svg"
          distance={250}
          seed={33}
          swayScale={2.2}
          style={{ left: "18%", bottom: "-14%", width: 460, opacity: 0.35 }}
        />
      </div>

      <div className="wrap v2-hero-inner">
        <h1 className="v2-hero-headline" data-reveal>
          Real
          <br />
          <RotatingWord words={rotatingWords} />
        </h1>
        <div className="v2-hero-foot">
          <p className="v2-hero-desc">{description}</p>
          <div className="v2-hero-ctas">
            <a href="/contact" className="v2-pill-link v2-pill-link--solid">
              {primaryCtaLabel} <span>→</span>
            </a>
            <a href="/our-expertise" className="v2-pill-link">
              {secondaryCtaLabel} <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="v2-photo-feature" data-reveal>
          <PhotoSlideshow images={featuredImages} />
          <div className="v2-photo-feature-overlay">
            <h2>
              {featuredHeading.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <a href="/about" className="v2-pill-link">
              {featuredCtaLabel} <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap v2-logos-strip">
        <LogoMarquee logos={logos} />
        <a href="/why-real-numbers" className="v2-pill-link">
          {logosCtaLabel} <span>→</span>
        </a>
      </div>
    </section>
  );
}
