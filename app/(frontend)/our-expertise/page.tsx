import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AtmospherePhoto from "@/components/AtmospherePhoto";
import { getCMS } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Our Expertise | Real Numbers",
  description: "The right expertise at every stage of growth.",
};

// Icon per area — decorative/structural, matched to the CMS-driven areas in order.
const AREA_ICONS = ["/icons/finops.svg", "/icons/stratfin.svg", "/icons/fundraising.svg", "/icons/bizperf.svg"];

export default async function OurExpertisePage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "our-expertise-page" });
  const integratedPhotos = (page.integrated?.photos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-6.svg"
          distance={170}
          style={{ right: "-12%", top: "-20%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
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
          src="/compositions/comp-3.svg"
          distance={140}
          style={{ left: "-10%", top: "-8%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          {(page.areas || []).map((a, i) => (
            <div
              className="expertise-block"
              key={a.title}
              style={i === 0 ? { paddingTop: 0 } : undefined}
            >
              <div className="pillar-icon" style={{ background: i % 2 === 0 ? "var(--red)" : "var(--blue)" }}>
                <Image src={AREA_ICONS[i] || AREA_ICONS[0]} alt="" width={22} height={22} />
              </div>
              <h2 style={{ marginTop: "var(--space-400)" }}>{a.title}</h2>
              <p className="tagline">{a.tagline}</p>
              {(a.paragraphs || []).map((p, pi) => (
                <p key={pi}>{p.text}</p>
              ))}
              {i === 0 && (
                <div className="prose-mask-photo align-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/masked/masked-7.png" alt="" />
                </div>
              )}
              <div className="key-services">
                {(a.services || []).map((s, si) => (
                  <span key={si}>{s.label}</span>
                ))}
              </div>
            </div>
          ))}

          <AbstractPanel
            src="/img/abstract/wide-8.jpg"
            variant="strip"
            className="expertise-break"
          />

          <div className="prose-block">
            <h2 data-reveal className="reveal-heading">{page.integrated?.heading}</h2>
            <p>{page.integrated?.text}</p>
            <AtmospherePhoto
              images={integratedPhotos}
              fallbackSrc="/img/photography/expertise-atmosphere.jpg"
              alt="A financial model in progress"
              caption={page.integrated?.photoCaption || undefined}
            />
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-24.jpg" variant="strip" className="final-cta-visual" />
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
