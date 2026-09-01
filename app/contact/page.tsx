import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import ContactForm from "@/components/ContactForm";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AbstractPanel from "@/components/AbstractPanel";

export const metadata: Metadata = {
  title: "Contact | Real Numbers",
  description: "Every meaningful partnership starts with a conversation.",
};

export default function ContactPage() {
  return (
    <>
      <HeaderV2 />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/contact-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={170}
          style={{ left: "-12%", top: "-22%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">Contact</span>
          <h1 data-reveal className="reveal-heading">
            Every meaningful partnership starts with a conversation
          </h1>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-1.svg"
          distance={140}
          style={{ right: "-10%", bottom: "-12%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap contact-layout">
          <div className="contact-layout-form">
            <ContactForm />
          </div>
          {/* Fills the wide empty gutter the centred form used to leave. */}
          <div className="contact-layout-visual">
            <AbstractPanel src="/img/abstract/sq-12.jpg" variant="panel" strength={16} />
          </div>
        </div>
        <div className="wrap">
          <div className="manifesto">
            <h3>
              Real Numbers. Built on trust. Driven by clarity. Focused on
              growth
            </h3>
            <p>
              That&apos;s why Real Numbers exists. And that&apos;s how we
              help businesses grow.
            </p>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
