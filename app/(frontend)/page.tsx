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

  const featuredImages = (home.featuredPhoto?.images ?? [])
    .map((entry) => (typeof entry.image === "object" && entry.image && "url" in entry.image ? (entry.image as { url: string }).url : ""))
    .filter(Boolean);

  return (
    <>
      <HeaderV2 />
      <HeroV2
        rotatingWords={(home.hero?.rotatingWords || []).map((w) => w.word)}
        description={home.hero?.description || ""}
        primaryCtaLabel={home.hero?.primaryCtaLabel || "Let's Talk"}
        secondaryCtaLabel={home.hero?.secondaryCtaLabel || "Our Expertise"}
        featuredHeading={home.featuredPhoto?.heading || ""}
        featuredCtaLabel={home.featuredPhoto?.ctaLabel || "Our approach"}
        featuredImages={featuredImages}
        logos={logos}
        logosCtaLabel={home.logosStrip?.ctaLabel || "Why Real Numbers"}
      />
      <DifferenceV2 heading={home.difference?.heading || ""} />
      <StatsV2
        heading={stats.heading || "Proof in numbers"}
        stats={(stats.stats || []).map((s) => ({ label: s.label, value: s.value, color: s.color as "red" | "blue" | "jet" | "horizon" }))}
      />
      {/* Visual breath between the stats and the dark CTA, and a hand-off
          from the light half of the page into the dark one. */}
      <AbstractPanel src="/img/abstract/wide-14.jpg" variant="band" strength={30} />
      <CtaDarkV2 heading={home.ctaDark?.heading || ""} ctaLabel={home.ctaDark?.ctaLabel || "Discover more"} />
      <AudienceV2
        heading={home.audience?.heading || ""}
        areas={(home.audience?.areas || []).map((a) => ({ title: a.title, text: a.text }))}
      />
      <Stories />
      <FooterV2 />
    </>
  );
}
