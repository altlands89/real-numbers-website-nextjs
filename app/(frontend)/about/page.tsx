import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AtmospherePhoto from "@/components/AtmospherePhoto";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "about-page" });
  return buildPageMetadata(page.seo, {
    title: "About | Real Numbers",
    description: "We believe every growing company deserves a financial partner it can actually trust.",
  });
}

export default async function AboutPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "about-page" });

  const storyPhotos = (page.ourStory?.photos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-1.svg"
          distance={170}
          style={{ right: "-12%", top: "-20%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">{page.hero.eyebrow}</span>
          <h1 data-reveal className="reveal-heading">
            {page.hero.heading}
          </h1>
          <p className="lede">{page.hero.lede}</p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <div className="prose-block prose-block--story">
            <div className="prose-block-text">
              <h2 data-reveal className="reveal-heading">{page.ourStory?.heading}</h2>
              {(page.ourStory?.paragraphs || []).map((p, i) => (
                <p key={i}>{p.text}</p>
              ))}
            </div>
            <div className="prose-block-media">
              <AtmospherePhoto
                images={storyPhotos}
                fallbackSrc="/img/photography/about-atmosphere.jpg"
                alt="Inside a Real Numbers strategy session"
                caption={page.ourStory?.photoCaption || undefined}
              />
            </div>
          </div>

          <div className="prose-block">
            <h2>{page.whatWeBelieve?.heading}</h2>
            <p>{page.whatWeBelieve?.intro}</p>
            <div className="prose-mask-photo align-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/masked/masked-13.png" alt="" />
            </div>
            <div className="principles-list">
              {(page.whatWeBelieve?.principles || []).map((p, i) => (
                <div
                  className="principle"
                  key={p.lead}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <strong>{p.lead}</strong>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="prose-block">
            <h2>{page.howWeWork?.heading}</h2>
            {(page.howWeWork?.paragraphs || []).map((p, i) => (
              <p key={i}>{p.text}</p>
            ))}
            <div className="prose-mask-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/masked/masked-3.png" alt="" />
            </div>
          </div>

          <div className="prose-block" style={{ position: "relative" }}>
            <CompositionDrift
              src="/compositions/comp-15.svg"
              distance={150}
              style={{ right: "-10%", top: "-6%", width: 480, opacity: 0.18 }}
            />
            <h2 style={{ position: "relative", zIndex: 1 }}>{page.leadership?.heading}</h2>
            <div className="leadership-grid" style={{ position: "relative", zIndex: 1 }}>
              {(page.leadership?.cards || []).map((c) => (
                <div className="leadership-card" key={c.name}>
                  <h3>{c.name}</h3>
                  <span className="role">{c.role}</span>
                  <p className="bio">{c.bio}</p>
                </div>
              ))}
            </div>
            <p className="leadership-note">{page.leadership?.note}</p>
            <a
              href="/team"
              className="link-arrow"
              style={{ marginTop: "var(--space-500)", display: "inline-flex" }}
            >
              {page.leadership?.teamLinkLabel} →
            </a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
