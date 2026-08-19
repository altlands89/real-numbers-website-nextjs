import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import CompositionParallax from "@/components/CompositionParallax";

export const metadata: Metadata = {
  title: "Questions Founders Ask — Real Numbers",
  description:
    "Honest answers to the questions we hear most, before we start working together.",
};

export default function QuestionsFoundersAskPage() {
  return (
    <>
      <Header />

      <section className="page-hero hairline-grid">
        <CompositionParallax
          src="/compositions/comp-8.svg"
          speed={0.13}
          style={{ right: "-8%", top: "-14%", width: 400, opacity: 0.08, filter: "invert(1) brightness(1.9)" }}
        />
        <div className="wrap">
          <span className="eyebrow">Questions Founders Ask</span>
          <h1>
            Honest answers to the questions we hear most, before we start
            working together.
          </h1>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <Faq />
        </div>
      </section>

      <Footer />
    </>
  );
}
