import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import HeroV2 from "@/components/HeroV2";
import DifferenceV2 from "@/components/DifferenceV2";
import StatsV2 from "@/components/StatsV2";
import CtaDarkV2 from "@/components/CtaDarkV2";
import AudienceV2 from "@/components/AudienceV2";
import Stories from "@/components/Stories";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import { ResponsiveText, getOverride } from "@/components/ResponsiveText";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const home = await payload.findGlobal({ slug: "home" });
  return buildPageMetadata(home.seo, {
    title: "[Design Concept] Real Numbers | Financial Clarity for Growing Companies",
    description:
      "Real Numbers helps startups and technology companies turn financial complexity into clear decisions, scalable planning and confident growth.",
  });
}

export default async function Home() {
  const payload = await getCMS();
  const [home, stats, clientLogos] = await Promise.all([
    payload.findGlobal({ slug: "home" }),
    payload.findGlobal({ slug: "stats" }),
    payload.find({ collection: "client-logos", sort: "order", limit: 20 }),
  ]);

  const logos = clientLogos.docs.map((l) => ({
    src: typeof l.logo === "object" && l.logo?.url ? l.logo.url : "",
    alt: l.name,
    href: l.href || undefined,
  }));

  const sections = home.sections ?? [];
  const mo = home.mobileOverrides;

  return (
    <>
      <HeaderV2 />
      {sections.map((section, si) => {
        const sectionKey = section.id ?? si;
        switch (section.blockType) {
          case "hero": {
            const featuredImages = (section.featuredPhoto?.images ?? [])
              .map((entry) => (typeof entry.image === "object" && entry.image && "url" in entry.image ? (entry.image as { url: string }).url : ""))
              .filter(Boolean);
            return (
              <HeroV2
                key={section.id}
                rotatingWords={(section.rotatingWords || []).map((w) => w.word)}
                description={
                  <ResponsiveText desktop={section.description || ""} mobile={getOverride(mo, `${sectionKey}.description`)} path={`${sectionKey}.description`} />
                }
                primaryCtaLabel={
                  <ResponsiveText desktop={section.primaryCtaLabel || "Let's Talk"} mobile={getOverride(mo, `${sectionKey}.primaryCtaLabel`)} path={`${sectionKey}.primaryCtaLabel`} />
                }
                secondaryCtaLabel={
                  <ResponsiveText desktop={section.secondaryCtaLabel || "Our Expertise"} mobile={getOverride(mo, `${sectionKey}.secondaryCtaLabel`)} path={`${sectionKey}.secondaryCtaLabel`} />
                }
                featuredHeading={
                  <ResponsiveText
                    desktop={section.featuredPhoto?.heading || ""}
                    mobile={getOverride(mo, `${sectionKey}.featuredPhoto.heading`)} path={`${sectionKey}.featuredPhoto.heading`}
                  />
                }
                featuredCtaLabel={
                  <ResponsiveText
                    desktop={section.featuredPhoto?.ctaLabel || "Our approach"}
                    mobile={getOverride(mo, `${sectionKey}.featuredPhoto.ctaLabel`)} path={`${sectionKey}.featuredPhoto.ctaLabel`}
                  />
                }
                featuredImages={featuredImages}
                logos={logos}
                logosCtaLabel={
                  <ResponsiveText
                    desktop={section.logosStrip?.ctaLabel || "Why Real Numbers"}
                    mobile={getOverride(mo, `${sectionKey}.logosStrip.ctaLabel`)} path={`${sectionKey}.logosStrip.ctaLabel`}
                  />
                }
              />
            );
          }
          case "diff":
            return (
              <DifferenceV2
                key={section.id}
                heading={<ResponsiveText desktop={section.heading || ""} mobile={getOverride(mo, `${sectionKey}.heading`)} path={`${sectionKey}.heading`} />}
              />
            );
          case "stats":
            return (
              <StatsV2
                key={section.id}
                heading={stats.heading || "Proof in numbers"}
                stats={(stats.stats || []).map((s) => ({ label: s.label, value: s.value, color: s.color as "red" | "blue" | "jet" | "horizon" }))}
              />
            );
          case "divider": {
            // Visual breath between two sections, and a hand-off from the
            // light half of the page into the dark one when it sits where
            // it does by default. Falls back to the static image when no
            // video is uploaded.
            const dividerVideo =
              typeof section.video === "object" && section.video && "url" in section.video
                ? (section.video as { url: string }).url
                : undefined;
            return <AbstractPanel key={section.id} src="/img/abstract/wide-14.jpg" video={dividerVideo} variant="band" strength={30} />;
          }
          case "cta":
            return (
              <CtaDarkV2
                key={section.id}
                heading={<ResponsiveText desktop={section.heading || ""} mobile={getOverride(mo, `${sectionKey}.heading`)} path={`${sectionKey}.heading`} />}
                ctaLabel={
                  <ResponsiveText desktop={section.ctaLabel || "Discover more"} mobile={getOverride(mo, `${sectionKey}.ctaLabel`)} path={`${sectionKey}.ctaLabel`} />
                }
              />
            );
          case "audience":
            return (
              <AudienceV2
                key={section.id}
                heading={<ResponsiveText desktop={section.heading || ""} mobile={getOverride(mo, `${sectionKey}.heading`)} path={`${sectionKey}.heading`} />}
                areas={(section.areas || []).map((a) => ({
                  id: a.id,
                  title: <ResponsiveText desktop={a.title} mobile={getOverride(mo, `${sectionKey}.areas.${a.id ?? ""}.title`)} path={`${sectionKey}.areas.${a.id ?? ""}.title`} />,
                  text: <ResponsiveText desktop={a.text} mobile={getOverride(mo, `${sectionKey}.areas.${a.id ?? ""}.text`)} path={`${sectionKey}.areas.${a.id ?? ""}.text`} />,
                }))}
              />
            );
          case "stories":
            // Self-fetching — reads its own copy + the testimonials
            // collection directly, no props needed.
            return <Stories key={section.id} />;
          default:
            return null;
        }
      })}
      <FooterV2 />
    </>
  );
}
