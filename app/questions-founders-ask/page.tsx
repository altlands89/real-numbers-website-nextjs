import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import CompositionDrift from "@/components/CompositionDrift";

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
        <CompositionDrift
          src="/compositions/comp-8.svg"
          distance={170}
          style={{ right: "-12%", top: "-20%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
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
          <div className="atmosphere-photo" style={{ marginTop: 0, marginBottom: "var(--space-600)", aspectRatio: "21/9" }}>
            <Image
              src="/img/photography/faq-atmosphere.jpg"
              alt="A quiet corner of the Real Numbers office"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <Faq />
        </div>
      </section>

      <Footer />
    </>
  );
}
