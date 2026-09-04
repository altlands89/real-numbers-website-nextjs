import type { Metadata } from "next";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import ContactForm from "@/components/ContactForm";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import AbstractPanel from "@/components/AbstractPanel";
import { ResponsiveText, getOverride } from "@/components/ResponsiveText";
import { getCMS } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "contact-page" });
  return buildPageMetadata(page.seo, {
    title: "Contact | Real Numbers",
    description: "Every meaningful partnership starts with a conversation.",
  });
}

export default async function ContactPage() {
  const payload = await getCMS();
  const page = await payload.findGlobal({ slug: "contact-page" });
  const mo = page.mobileOverrides;

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
          <span className="eyebrow">
            <ResponsiveText desktop={page.hero.eyebrow ?? ""} mobile={getOverride(mo, "hero.eyebrow")} />
          </span>
          <h1 data-reveal className="reveal-heading">
            <ResponsiveText desktop={page.hero.heading} mobile={getOverride(mo, "hero.heading")} />
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
            <ContactForm
              directContactLabel={
                page.directContact?.label ? (
                  <ResponsiveText desktop={page.directContact.label} mobile={getOverride(mo, "directContact.label")} />
                ) : undefined
              }
              whatsappNumber={page.directContact?.whatsappNumber || undefined}
              email={page.directContact?.email || undefined}
            />
          </div>
          {/* Fills the wide empty gutter the centred form used to leave. */}
          <div className="contact-layout-visual">
            <AbstractPanel src="/img/abstract/sq-12.jpg" variant="panel" strength={16} />
          </div>
        </div>
        <div className="wrap">
          <div className="manifesto">
            <h3>
              <ResponsiveText desktop={page.manifesto?.heading ?? ""} mobile={getOverride(mo, "manifesto.heading")} />
            </h3>
            <p>
              <ResponsiveText desktop={page.manifesto?.text ?? ""} mobile={getOverride(mo, "manifesto.text")} />
            </p>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
