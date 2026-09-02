import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "why-real-numbers-page" });
  return buildPageMetadata(page.seo, {
    title: "Why Real Numbers",
    description: "More than financial expertise. A trusted partner for the moments that matter most.",
  });
}

// Icon + accent color are structural/decorative — matched to the CMS-driven
// value props in order, not editable content.
const VALUE_PROP_META = [
  { icon: "/icons/startup.svg", bg: "var(--red)" },
  { icon: "/icons/strategic.svg", bg: "var(--blue)" },
  { icon: "/icons/partnership.svg", bg: "var(--red)" },
  { icon: "/icons/longterm.svg", bg: "var(--blue)" },
];

export default async function WhyRealNumbersPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "why-real-numbers-page" });
  const differentPhotos = (page.whatMakesDifferent?.photos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);

  return (
    <>
      <HeaderV2 />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/why-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-2.svg"
          distance={170}
          style={{ left: "-12%", top: "-22%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">{page.hero.eyebrow}</span>
          <h1 data-reveal className="reveal-heading">
            {page.hero.heading}
          </h1>
          {(page.hero.ledeParagraphs || []).map((p, i) => (
            <p className="lede" key={i}>{p.text}</p>
          ))}
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-18.svg"
          distance={120}
          seed={41}
          style={{ right: "-10%", top: "-14%", width: 440, opacity: 0.13 }}
        />
        <div className="wrap">
          <div className="prose-block">
            <h2>{page.whyChooseUs?.heading}</h2>
            {(page.whyChooseUs?.paragraphs || []).map((p, i) => (
              <p key={i}>{p.text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="why" data-reveal>
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={140}
          style={{ right: "-10%", bottom: "-16%", width: 520, opacity: 0.16 }}
        />
        <div className="wrap">
          <div className="why-grid detailed">
            {(page.valueProps || []).map((v, i) => {
              const meta = VALUE_PROP_META[i] || VALUE_PROP_META[0];
              return (
                <div
                  className="why-item"
                  key={v.title}
                  data-reveal
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="pillar-icon" style={{ background: meta.bg }}>
                    <Image src={meta.icon} alt="" width={22} height={22} />
                  </div>
                  <h3>{v.title}</h3>
                  <p style={{ marginBottom: 12 }}>{v.paragraph1}</p>
                  <p>{v.paragraph2}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="prose-section on-stone" data-reveal>
        <CompositionDrift
          src="/compositions/comp-12.svg"
          distance={130}
          style={{ left: "-8%", bottom: "-10%", width: 460, opacity: 0.13 }}
        />
        <div className="wrap">
          <div
            className="prose-block prose-block--story"
            style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}
          >
            <div className="prose-block-text">
              <h2 data-reveal className="reveal-heading">{page.whatMakesDifferent?.heading}</h2>
              {(page.whatMakesDifferent?.paragraphs || []).map((p, i) => (
                <p key={i}>{p.text}</p>
              ))}
            </div>
            <div className="prose-block-media">
              <AbstractPanel src={differentPhotos.length > 0 ? differentPhotos : "/img/abstract/sq-8.jpg"} variant="panel" strength={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <CompositionDrift
          src="/compositions/comp-17.svg"
          distance={130}
          seed={42}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(700px, 64vw)",
            opacity: 0.14,
            filter: "invert(1) brightness(1.9)",
          }}
        />
        <div className="wrap">
          <div className="section-head center">
            <h2>{page.closingCta.heading}</h2>
            <p className="closing-line">{page.closingCta.closingLine}</p>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">
              {page.closingCta.buttonLabel}
            </a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
