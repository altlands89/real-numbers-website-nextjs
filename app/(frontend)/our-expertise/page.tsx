import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AtmospherePhoto from "@/components/AtmospherePhoto";
import { ResponsiveText, getOverride } from "@/components/ResponsiveText";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "our-expertise-page" });
  return buildPageMetadata(page.seo, {
    title: "Our Expertise | Real Numbers",
    description: "The right expertise at every stage of growth.",
  });
}

// Icon per area — decorative/structural, matched to the CMS-driven areas in order.
const AREA_ICONS = ["/icons/finops.svg", "/icons/stratfin.svg", "/icons/fundraising.svg", "/icons/bizperf.svg"];

export default async function OurExpertisePage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "our-expertise-page" });
  const integratedPhotos = (page.integrated?.photos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);
  const mo = page.mobileOverrides;

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
          <span className="eyebrow">
            <ResponsiveText desktop={page.hero.eyebrow ?? ""} mobile={getOverride(mo, "hero.eyebrow")} path={"hero.eyebrow"} />
          </span>
          <h1 data-reveal className="reveal-heading">
            <ResponsiveText desktop={page.hero.heading} mobile={getOverride(mo, "hero.heading")} path={"hero.heading"} />
          </h1>
          {(page.hero.ledeParagraphs || []).map((p, i) => (
            <p className="lede" key={i}>
              <ResponsiveText desktop={p.text ?? ""} mobile={getOverride(mo, `hero.ledeParagraphs.${p.id ?? i}.text`)} path={`hero.ledeParagraphs.${p.id ?? i}.text`} />
            </p>
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
              <h2 style={{ marginTop: "var(--space-400)" }}>
                <ResponsiveText desktop={a.title} mobile={getOverride(mo, `areas.${a.id ?? i}.title`)} path={`areas.${a.id ?? i}.title`} />
              </h2>
              <p className="tagline">
                <ResponsiveText desktop={a.tagline} mobile={getOverride(mo, `areas.${a.id ?? i}.tagline`)} path={`areas.${a.id ?? i}.tagline`} />
              </p>
              {(a.paragraphs || []).map((p, pi) => (
                <p key={pi}>
                  <ResponsiveText desktop={p.text ?? ""} mobile={getOverride(mo, `areas.${a.id ?? i}.paragraphs.${p.id ?? pi}.text`)} path={`areas.${a.id ?? i}.paragraphs.${p.id ?? pi}.text`} />
                </p>
              ))}
              {i === 0 && (
                <div className="prose-mask-photo align-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/masked/masked-7.png" alt="" />
                </div>
              )}
              <div className="key-services">
                {(a.services || []).map((s, si) => (
                  <span key={si}>
                    <ResponsiveText desktop={s.label} mobile={getOverride(mo, `areas.${a.id ?? i}.services.${s.id ?? si}.label`)} path={`areas.${a.id ?? i}.services.${s.id ?? si}.label`} />
                  </span>
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
            <h2 data-reveal className="reveal-heading">
              <ResponsiveText desktop={page.integrated?.heading ?? ""} mobile={getOverride(mo, "integrated.heading")} path={"integrated.heading"} />
            </h2>
            <p>
              <ResponsiveText desktop={page.integrated?.text ?? ""} mobile={getOverride(mo, "integrated.text")} path={"integrated.text"} />
            </p>
            <AtmospherePhoto
              images={integratedPhotos}
              fallbackSrc="/img/photography/expertise-atmosphere.jpg"
              alt="A financial model in progress"
              caption={
                page.integrated?.photoCaption ? (
                  <ResponsiveText desktop={page.integrated.photoCaption} mobile={getOverride(mo, "integrated.photoCaption")} path={"integrated.photoCaption"} />
                ) : undefined
              }
            />
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-24.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>
              <ResponsiveText desktop={page.closingCta.heading} mobile={getOverride(mo, "closingCta.heading")} path={"closingCta.heading"} />
            </h2>
            <p className="closing-line">
              <ResponsiveText desktop={page.closingCta.closingLine ?? ""} mobile={getOverride(mo, "closingCta.closingLine")} path={"closingCta.closingLine"} />
            </p>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">
              <ResponsiveText desktop={page.closingCta.buttonLabel ?? ""} mobile={getOverride(mo, "closingCta.buttonLabel")} path={"closingCta.buttonLabel"} />
            </a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
