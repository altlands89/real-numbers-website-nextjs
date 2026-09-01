import HeaderV2 from "@/components/HeaderV2";
import HeroV2 from "@/components/HeroV2";
import DifferenceV2 from "@/components/DifferenceV2";
import StatsV2 from "@/components/StatsV2";
import CtaDarkV2 from "@/components/CtaDarkV2";
import AudienceV2 from "@/components/AudienceV2";
import Stories from "@/components/Stories";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";

export default function Home() {
  return (
    <>
      <HeaderV2 />
      <HeroV2 />
      <DifferenceV2 />
      <StatsV2 />
      {/* Visual breath between the stats and the dark CTA, and a hand-off
          from the light half of the page into the dark one. */}
      <AbstractPanel src="/img/abstract/wide-14.jpg" variant="band" strength={30} />
      <CtaDarkV2 />
      <AudienceV2 />
      <Stories />
      <FooterV2 />
    </>
  );
}
