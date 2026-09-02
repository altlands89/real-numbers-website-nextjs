import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AtmospherePhoto from "@/components/AtmospherePhoto";
import { getCMS } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Use Cases | Real Numbers",
  description: "Different companies. Different challenges. One trusted financial partner.",
};

export default async function UseCasesPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "use-cases-page" });
  const atmospherePhotos = (page.atmospherePhotos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);

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
          <span className="eyebrow">{page.hero.eyebrow}</span>
          <h1 data-reveal className="reveal-heading">
            {page.hero.heading}
          </h1>
          <p className="lede">{page.hero.lede}</p>
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
            caption={page.atmospherePhotoCaption || undefined}
            style={{ marginTop: 0, marginBottom: "var(--space-600)" }}
          />
          <p style={{ fontWeight: 600, opacity: 0.85 }}>{page.situationsIntro}</p>
          <div className="usecase-list">
            {(page.situations || []).map((s, i) => (
              <div
                className="usecase-item"
                key={s.question}
                data-reveal
                style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
              >
                <p className="q">{s.question}</p>
                <p>{s.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-7.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>{page.closingCta.heading}</h2>
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
