import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import Faq from "@/components/Faq";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AtmospherePhoto from "@/components/AtmospherePhoto";
import { ResponsiveText, getOverride } from "@/components/ResponsiveText";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "questions-founders-ask-page" });
  return buildPageMetadata(page.seo, {
    title: "Questions Founders Ask | Real Numbers",
    description: "Honest answers to the questions we hear most, before we start working together.",
  });
}

export default async function QuestionsFoundersAskPage() {
  const payload = await getCMS();
  const [page, faqItems] = await Promise.all([
    payload.findGlobal({ slug: "questions-founders-ask-page" }),
    payload.find({ collection: "faq-items", sort: "order", limit: 100 }),
  ]);
  const atmospherePhotos = (page.atmospherePhotos || [])
    .map((p) => (typeof p.image === "object" && p.image?.url ? p.image.url : ""))
    .filter(Boolean);
  const mo = page.mobileOverrides;

  return (
    <>
      <HeaderV2 />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-8.svg"
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
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-15.svg"
          distance={140}
          style={{ right: "-10%", top: "-8%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          <AtmospherePhoto
            images={atmospherePhotos}
            fallbackSrc="/img/photography/faq-atmosphere.jpg"
            alt="A quiet corner of the Real Numbers office"
            editorFieldPath="atmospherePhotos"
            strength={22}
            style={{ marginTop: 0, marginBottom: "var(--space-600)", aspectRatio: "21/9" }}
          />
          <Faq
            items={faqItems.docs.map((f) => ({
              id: f.id,
              question: <ResponsiveText desktop={f.question} mobile={getOverride(mo, `faq.${f.id}.question`)} path={`faq.${f.id}.question`} />,
              answer: <ResponsiveText desktop={f.answer} mobile={getOverride(mo, `faq.${f.id}.answer`)} path={`faq.${f.id}.answer`} />,
            }))}
          />
        </div>
      </section>

      {/* The Q&A page is otherwise an unbroken column of type — this gives
          the eye somewhere to land before the footer. */}
      <AbstractPanel src="/img/abstract/wide-23.jpg" variant="band" strength={26} />

      <FooterV2 />
    </>
  );
}
