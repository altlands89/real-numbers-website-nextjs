import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";

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
