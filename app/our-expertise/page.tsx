import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompositionDrift from "@/components/CompositionDrift";

export const metadata: Metadata = {
  title: "Our Expertise — Real Numbers",
  description: "The right expertise at every stage of growth.",
};

const AREAS = [
  {
    icon: "/icons/finops.svg",
    title: "Financial Operations",
    tagline: "Build confidence from the ground up.",
    paras: [
      "Strong businesses run on strong financial foundations — not exciting, but non-negotiable. Financial Operations keeps every process accurate, compliant, and scalable, giving leadership full visibility into the real health of the business, and structure to grow without losing control of what's underneath it.",
    ],
    services: [
      "Bookkeeping",
      "Payroll",
      "Financial Statements",
      "Tax Compliance & Reporting",
      "Accounts Payable & Receivable",
      "Cash Flow Management",
      "Financial Controls",
    ],
  },
  {
    icon: "/icons/stratfin.svg",
    title: "Strategic Finance",
    tagline: "Turning financial information into business direction.",
    paras: [
      "As companies grow, finance moves from the edge of strategic conversations to the center of them. We connect financial insight to business planning — sharper budgeting and forecasting, KPI frameworks that mean something, board reporting that earns trust, strategy grounded in real numbers.",
      "Numbers should guide leadership. Not overwhelm it.",
    ],
    services: [
      "Fractional CFO",
      "Budget Planning",
      "Forecasting",
      "Financial Planning",
      "KPI Frameworks",
      "Executive Reporting",
      "Scenario Planning",
      "Decision Support",
    ],
  },
  {
    icon: "/icons/fundraising.svg",
    title: "Fundraising & Growth",
    tagline: "Building credibility before you meet a single investor.",
    paras: [
      "Fundraising starts long before the first pitch deck opens. We build the financial foundations investors expect to see — the kind that hold up through the entire process, not just the room.",
      "Whether you're preparing for Seed, Series A, or your next milestone, we help leadership tell a financial story investors trust because it's true, not just polished.",
    ],
    services: [
      "Financial Models",
      "Investor Materials",
      "Due Diligence Preparation",
      "Valuation Support",
      "Capital Planning",
      "Growth Planning",
      "M&A Financial Support",
    ],
  },
  {
    icon: "/icons/bizperf.svg",
    title: "Business Performance",
    tagline: "Make every number mean something.",
    paras: [
      "Data creates value the moment it changes a decision. We turn financial information into clear insight — performance dashboards, profitability analysis, runway monitoring, executive reporting — built so leadership spots opportunity and manages risk without waiting for next quarter to explain what already happened.",
    ],
    services: [
      "KPI Reporting",
      "Performance Dashboards",
      "Business Analysis",
      "Profitability Analysis",
      "Unit Economics",
      "Budget vs. Actual",
      "Cash Runway Monitoring",
      "Executive Insights",
    ],
  },
];

export default function OurExpertisePage() {
  return (
    <>
      <Header />

      <section className="page-hero hairline-grid">
        <CompositionDrift
          src="/compositions/comp-6.svg"
          distance={150}
          style={{ right: "-8%", top: "-16%", width: 440, opacity: 0.14, filter: "invert(1) brightness(1.9)" }}
        />
        <div className="wrap">
          <span className="eyebrow">Our Expertise</span>
          <h1>The right expertise at every stage of growth.</h1>
          <p className="lede">
            Every growing business hits a different financial challenge at a
            different moment — stronger operations, strategic leadership in
            the room, fundraising readiness, or infrastructure for scale it
            hasn&apos;t hit yet.
          </p>
          <p className="lede">
            Our expertise is built as one connected financial ecosystem,
            supporting leadership from daily operations to the company&apos;s
            most consequential decisions.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          {AREAS.map((a, i) => (
            <div
              className="expertise-block"
              key={a.title}
              style={i === 0 ? { paddingTop: 0 } : undefined}
            >
              <div className="pillar-icon" style={{ background: i % 2 === 0 ? "var(--red)" : "var(--blue)" }}>
                <Image src={a.icon} alt="" width={22} height={22} />
              </div>
              <h2 style={{ marginTop: "var(--space-400)" }}>{a.title}</h2>
              <p className="tagline">{a.tagline}</p>
              {a.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="key-services">
                {a.services.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="prose-block">
            <h2>One integrated financial partnership</h2>
            <p>
              Each area creates value alone. Together, they&apos;re one
              connected financial framework supporting leadership at every
              stage — one partner who sees the whole business, instead of
              four providers each holding a piece of a picture no one sees
              whole.
            </p>
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <div className="section-head center">
            <h2>Whatever stage your business is in, we&apos;ll help you prepare for what&apos;s next.</h2>
            <p className="closing-line">
              Let&apos;s build clarity. Let&apos;s build confidence. Let&apos;s
              build growth that lasts.
            </p>
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
