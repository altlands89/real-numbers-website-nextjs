import type { Metadata } from "next";
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
  const page = await payload.findGlobal({ slug: "use-cases-page" });
  return buildPageMetadata(page.seo, {
    title: "Use Cases | Real Numbers",
    description: "Different companies. Different challenges. One trusted financial partner.",
  });
}

export default async function UseCasesPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "use-cases-page" });
  const atmospherePhotos = (page.atmospherePhotos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);
  const mo = page.mobileOverrides;

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-7.svg"
          distance={170}
          style={{ left: "-12%", top: "-22%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">
            <ResponsiveText desktop={page.hero.eyebrow ?? ""} mobile={getOverride(mo, "hero.eyebrow")} path={"hero.eyebrow"} />
          </span>
          <h1 data-reveal className="reveal-heading">
            <ResponsiveText desktop={page.hero.heading} mobile={getOverride(mo, "hero.heading")} path={"hero.heading"} />
          </h1>
          <p className="lede">
            <ResponsiveText desktop={page.hero.lede ?? ""} mobile={getOverride(mo, "hero.lede")} path={"hero.lede"} />
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-13.svg"
          distance={140}
          style={{ left: "-10%", bottom: "-10%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          <AtmospherePhoto
            images={atmospherePhotos}
            fallbackSrc="/img/photography/usecases-atmosphere.jpg"
            alt="A team working through a growth decision"
            caption={
              page.atmospherePhotoCaption ? (
                <ResponsiveText desktop={page.atmospherePhotoCaption} mobile={getOverride(mo, "atmospherePhotoCaption")} path={"atmospherePhotoCaption"} />
              ) : undefined
            }
            style={{ marginTop: 0, marginBottom: "var(--space-600)" }}
          />
          <p style={{ fontWeight: 600, opacity: 0.85 }}>
            <ResponsiveText desktop={page.situationsIntro ?? ""} mobile={getOverride(mo, "situationsIntro")} path={"situationsIntro"} />
          </p>
          <div className="usecase-list">
            {(page.situations || []).map((s, i) => (
              <div
                className="usecase-item"
                key={s.question}
                data-reveal
                style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
              >
                <p className="q">
                  <ResponsiveText desktop={s.question} mobile={getOverride(mo, `situations.${s.id ?? i}.question`)} path={`situations.${s.id ?? i}.question`} />
                </p>
                <p>
                  <ResponsiveText desktop={s.answer} mobile={getOverride(mo, `situations.${s.id ?? i}.answer`)} path={`situations.${s.id ?? i}.answer`} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-7.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>
              <ResponsiveText desktop={page.closingCta.heading} mobile={getOverride(mo, "closingCta.heading")} path={"closingCta.heading"} />
            </h2>
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
