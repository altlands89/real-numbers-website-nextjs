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

  return (
    <>
      <HeaderV2 />
      {sections.map((section) => {
        switch (section.blockType) {
          case "hero": {
            const featuredImages = (section.featuredPhoto?.images ?? [])
              .map((entry) => (typeof entry.image === "object" && entry.image && "url" in entry.image ? (entry.image as { url: string }).url : ""))
              .filter(Boolean);
            return (
              <HeroV2
                key={section.id}
                rotatingWords={(section.rotatingWords || []).map((w) => w.word)}
                description={section.description || ""}
                primaryCtaLabel={section.primaryCtaLabel || "Let's Talk"}
                secondaryCtaLabel={section.secondaryCtaLabel || "Our Expertise"}
                featuredHeading={section.featuredPhoto?.heading || ""}
                featuredCtaLabel={section.featuredPhoto?.ctaLabel || "Our approach"}
                featuredImages={featuredImages}
                logos={logos}
                logosCtaLabel={section.logosStrip?.ctaLabel || "Why Real Numbers"}
              />
            );
          }
          case "diff":
            return <DifferenceV2 key={section.id} heading={section.heading || ""} />;
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
            return <CtaDarkV2 key={section.id} heading={section.heading || ""} ctaLabel={section.ctaLabel || "Discover more"} />;
          case "audience":
            return (
              <AudienceV2
                key={section.id}
                heading={section.heading || ""}
                areas={(section.areas || []).map((a) => ({ title: a.title, text: a.text }))}
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
