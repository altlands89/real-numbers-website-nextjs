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
  const page = await payload.findGlobal({ slug: "how-we-work-page" });
  return buildPageMetadata(page.seo, {
    title: "How We Work | Real Numbers",
    description: "How an engagement with Real Numbers starts, and how it grows from there.",
  });
}

export default async function HowWeWorkPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "how-we-work-page" });

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-11.svg"
          distance={170}
          style={{ right: "-12%", top: "-20%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
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
          src="/compositions/comp-5.svg"
          distance={140}
          style={{ left: "-10%", bottom: "-10%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          {page.stepsIntro && (
            <p style={{ fontWeight: 600, opacity: 0.85 }}>{page.stepsIntro}</p>
          )}
          <div className="process-steps">
            {(page.steps || []).map((s, i) => (
              <div className="process-step" key={s.title} data-reveal style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}>
                <Image
                  src={`/img/digits/digit-solid-red-${(i % 10) + 1}.svg`}
                  alt=""
                  width={56}
                  height={56}
                  className="process-step-number"
                />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-9.jpg" variant="strip" className="final-cta-visual" />
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
