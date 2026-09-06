import type { ReactNode } from "react";
import CompositionDrift from "./CompositionDrift";
import PhotoSlideshow from "./PhotoSlideshow";
import RotatingWord from "./RotatingWord";
import LogoMarquee from "./LogoMarquee";

type Logo = { src: string; alt: string; href?: string };

type Props = {
  // Not yet wired to per-field mobile overrides — RotatingWord measures
  // and animates these as plain strings, so giving individual words a
  // mobile-only variant would need changes to that animation logic too.
  // A mobile override set on a rotating word in the editor is stored but
  // currently has no effect on the live site.
  rotatingWords: string[];
  description: ReactNode;
  primaryCtaLabel: ReactNode;
  secondaryCtaLabel: ReactNode;
  featuredHeading: ReactNode;
  featuredCtaLabel: ReactNode;
  featuredImages: string[];
  // See PhotoSlideshow's editorFieldPath.
  featuredImagesFieldPath?: string;
  logos: Logo[];
  logosCtaLabel: ReactNode;
};

export default function HeroV2({
  rotatingWords,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
  featuredHeading,
  featuredCtaLabel,
  featuredImages,
  featuredImagesFieldPath,
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
        <h1 className="v2-hero-headline reveal-heading" data-reveal>
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
          <PhotoSlideshow images={featuredImages} editorFieldPath={featuredImagesFieldPath} />
          <div className="v2-photo-feature-overlay">
            <h2>{featuredHeading}</h2>
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
