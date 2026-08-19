import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompositionParallax from "@/components/CompositionParallax";

export const metadata: Metadata = {
  title: "Use Cases — Real Numbers",
  description: "Different companies. Different challenges. One trusted financial partner.",
};

const SITUATIONS = [
  {
    q: "“We’re growing faster than our financial infrastructure.”",
    a: "Growth exposes gaps in process, reporting, and decision-making fast. When the business outpaces the finance function, leadership loses visibility right when it matters most. We build foundations that scale alongside the business, without slowing it down.",
  },
  {
    q: "“We need strategic financial leadership, but not a full-time CFO.”",
    a: "Financial decisions get more sophisticated before a full-time executive hire makes sense. Our Fractional CFO model gives leadership experienced guidance exactly when it's needed — not on a headcount timeline.",
  },
  {
    q: "“We’re preparing to raise investment.”",
    a: "Fundraising begins long before the first investor meeting: strong reporting, reliable forecasts, assumptions that hold up, models that read as credible, not hopeful. We build what investors expect to see before they ask for it.",
  },
  {
    q: "“We need better visibility into our business.”",
    a: "Leadership shouldn't decide on incomplete information. We build the reporting frameworks, dashboards, and performance visibility that show clearly where the business stands — and where it's heading.",
  },
  {
    q: "“We’ve outgrown traditional accounting.”",
    a: "Growth needs strategic thinking, financial planning, scenario analysis, real business insight — right where a traditional bookkeeper's role usually ends. That's where ours begins.",
  },
  {
    q: "“We’re entering a new stage of growth.”",
    a: "International expansion, rapid hiring, a new product line, a possible acquisition — every new stage needs stronger financial infrastructure than the last one did. We help businesses prepare before complexity becomes a crisis.",
  },
  {
    q: "“We need someone who understands both finance and business.”",
    a: "Technical expertise matters. Business judgment matters more. We connect financial knowledge to strategic thinking, so leadership understands not just the number, but what it means for the decision in front of them.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <Header />

      <section className="page-hero hairline-grid">
        <CompositionParallax
          src="/compositions/comp-7.svg"
          speed={0.13}
          style={{ left: "-8%", top: "-16%", width: 400, opacity: 0.08, filter: "invert(1) brightness(1.9)" }}
        />
        <div className="wrap">
          <span className="eyebrow">Use Cases</span>
          <h1>
            Different companies. Different challenges. One trusted financial
            partner.
          </h1>
          <p className="lede">
            Some are preparing to raise. Others are scaling faster than their
            systems can handle. Some need sharper visibility. Others are
            gearing up for international growth. The challenges vary — the
            need underneath doesn&apos;t: clear financial insight, so
            leadership decides with confidence instead of guesswork.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <p style={{ fontWeight: 600, opacity: 0.85 }}>
            Some of the situations that typically bring companies to Real
            Numbers:
          </p>
          <div className="usecase-list">
            {SITUATIONS.map((s) => (
              <div className="usecase-item" key={s.q}>
                <p className="q">{s.q}</p>
                <p>{s.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <div className="section-head center">
            <h2>
              If one of these sounds familiar, let&apos;s talk. Every
              business deserves financial clarity before its next important
              decision — not after.
            </h2>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
