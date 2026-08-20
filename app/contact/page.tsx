import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import CompositionDrift from "@/components/CompositionDrift";

export const metadata: Metadata = {
  title: "Contact — Real Numbers",
  description: "Every meaningful partnership starts with a conversation.",
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/contact-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={170}
          style={{ left: "-12%", top: "-22%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <div className="wrap">
          <span className="eyebrow">Contact</span>
          <h1>Every meaningful partnership starts with a conversation.</h1>
          <p className="lede">
            Whether you&apos;re preparing for growth, raising capital,
            building stronger foundations, or just looking for more clarity
            than you have today — we&apos;d like to hear your story.
          </p>
          <p className="lede">
            Every company is different, so every conversation starts with
            understanding yours before we recommend anything.
          </p>
          <p className="kicker">
            Tell us where your business is today. We&apos;ll help you
            understand what comes next.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <ContactForm />

          <div className="manifesto">
            <h3>
              Real Numbers. Built on trust. Driven by clarity. Focused on
              growth.
            </h3>
            <p>
              Leadership deserves more than financial reporting — clarity,
              perspective, honest conversations, and a partner who turns
              uncertainty into confident decisions.
            </p>
            <p>
              That&apos;s why Real Numbers exists. And that&apos;s how we
              help businesses grow.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
