import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "case-studies-page" });
  return buildPageMetadata(page.seo, {
    title: "Case Studies | Real Numbers",
    description: "A few examples of what changes when a growing company gets a real financial partner.",
  });
}

export default async function CaseStudiesPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "case-studies-page" });

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-8.svg"
          distance={170}
          style={{ left: "-12%", top: "-20%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">{page.hero.eyebrow}</span>
          <h1 data-reveal className="reveal-heading">{page.hero.heading}</h1>
          <p className="lede">{page.hero.lede}</p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-12.svg"
          distance={140}
          style={{ right: "-10%", bottom: "-10%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          <div className="case-study-list">
            {(page.caseStudies || []).map((c, i) => {
              const logoUrl = typeof c.logo === "object" && c.logo?.url ? c.logo.url : undefined;
              return (
                <div className="case-study-card" key={c.clientLabel} data-reveal style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}>
                  <span className="case-study-client">{c.clientLabel}</span>
                  <span className="case-study-metric">{c.metric}</span>
                  <p className="case-study-description">{c.description}</p>
                  {logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="" className="case-study-logo" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-11.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>{page.closingCta.heading}</h2>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">{page.closingCta.buttonLabel}</a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
