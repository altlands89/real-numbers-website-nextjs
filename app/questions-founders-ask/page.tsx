import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import Faq from "@/components/Faq";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import Parallax from "@/components/Parallax";

export const metadata: Metadata = {
  title: "Questions Founders Ask | Real Numbers",
  description:
    "Honest answers to the questions we hear most, before we start working together.",
};

export default function QuestionsFoundersAskPage() {
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
          <span className="eyebrow">Questions Founders Ask</span>
          <h1 data-reveal className="reveal-heading">
            Honest answers to the questions we hear most, before we start
            working together
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
          <Parallax
            className="atmosphere-photo"
            strength={22}
            style={{ marginTop: 0, marginBottom: "var(--space-600)", aspectRatio: "21/9" }}
          >
            <Image
              src="/img/photography/faq-atmosphere.jpg"
              alt="A quiet corner of the Real Numbers office"
              fill
              style={{ objectFit: "cover" }}
            />
          </Parallax>
          <Faq />
        </div>
      </section>

      {/* The Q&A page is otherwise an unbroken column of type — this gives
          the eye somewhere to land before the footer. */}
      <AbstractPanel src="/img/abstract/wide-23.jpg" variant="band" strength={26} />

      <FooterV2 />
    </>
  );
}
