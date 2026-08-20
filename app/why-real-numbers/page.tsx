import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompositionDrift from "@/components/CompositionDrift";

export const metadata: Metadata = {
  title: "Why Real Numbers",
  description:
    "More than financial expertise. A trusted partner for the moments that matter most.",
};

const VALUE_PROPS = [
  {
    title: "Startup Mindset",
    p1: "We understand how founders think, because we work inside that world every day. Startups don't move in straight lines — priorities shift overnight, markets move faster than plans, funding timelines compress without warning.",
    p2: "Our role isn't slowing you down with process. It's building the clarity that lets leadership move faster, with confidence instead of guesswork.",
  },
  {
    title: "Strategic Thinking",
    p1: "Numbers only matter when they change a decision. Financial reports explain the past; strategic finance shapes what's next. We connect financial insight to business strategy — not just what happened, but what it means and what should happen because of it.",
    p2: "Information only becomes valuable the moment it drives action.",
  },
  {
    title: "Hands-on Partnership",
    p1: "Great partnerships aren't measured by how many meetings happen — they're measured by what gets said in them.",
    p2: "Our clients don't treat us as an outside advisor looped in occasionally. They bring us into planning, board meetings, fundraising, hiring, expansion — because they know we'll bring honest, practical thinking to the table, not a status update. We become part of how leadership decides. Not a report that arrives after the decision's made.",
  },
  {
    title: "Built for Long-Term Growth",
    p1: "Today's decisions should hold up under tomorrow's ambitions. Our responsibility doesn't end at this quarter's problem — we build financial frameworks that keep supporting growth as the business changes shape: operational foundations, executive reporting, fundraising prep, strategic planning, the first five hires through international expansion.",
    p2: "Every recommendation is made with the next stage already in mind. The goal was never to fix today. It's to be right about tomorrow.",
  },
];

export default function WhyRealNumbersPage() {
  return (
    <>
      <Header />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/why-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-2.svg"
          distance={170}
          style={{ left: "-12%", top: "-22%", width: 620, opacity: 0.22, filter: "invert(1) brightness(1.9)" }}
        />
        <div className="wrap">
          <span className="eyebrow">Why Real Numbers</span>
          <h1 data-reveal className="reveal-heading">
            Financial leadership was never really about numbers. It&apos;s
            about helping leaders make better decisions.
          </h1>
          <p className="lede">
            The most valuable financial conversations rarely start with a
            spreadsheet. They start with questions: Where are we today? What
            are we missing? Can we afford the next step? Should we raise now
            — or wait?
          </p>
          <p className="lede">
            The answers shape the future of the business. Our role is
            helping leadership answer them with clarity, confidence, and
            perspective.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <div className="prose-block">
            <h2>Why companies choose us</h2>
            <p>
              Choosing a financial partner is one of the most consequential
              decisions a growing business makes — not because of
              bookkeeping or compliance, but because the quality of
              financial leadership shapes every decision that follows it.
            </p>
            <p>
              Most companies end up choosing between two extremes: a large,
              generalist firm that sees them as one account among hundreds,
              or a technical bookkeeper who can close the books but
              can&apos;t sit at the leadership table. Neither is built for
              the moment finance becomes strategy.
            </p>
            <p>
              Real Numbers is built for what sits between them — companies
              who need more than a service provider but aren&apos;t ready
              for (or don&apos;t need) a full internal finance department.
              Trusted thinking, strategic perspective, and a partner still in
              the room a year from now, not just at signing.
            </p>
          </div>
        </div>
      </section>

      <section className="why" data-reveal>
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={140}
          style={{ right: "-10%", bottom: "-16%", width: 520, opacity: 0.16 }}
        />
        <div className="wrap">
          <div className="why-grid detailed">
            {VALUE_PROPS.map((v) => (
              <div className="why-item" key={v.title}>
                <h3>{v.title}</h3>
                <p style={{ marginBottom: 12 }}>{v.p1}</p>
                <p>{v.p2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prose-section on-stone" data-reveal>
        <CompositionDrift
          src="/compositions/comp-12.svg"
          distance={130}
          style={{ left: "-8%", bottom: "-10%", width: 460, opacity: 0.13 }}
        />
        <div className="wrap">
          <div className="prose-block" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
            <h2 data-reveal className="reveal-heading">What makes the partnership different</h2>
            <p>
              Clarity changes what happens next: decisions move faster,
              communication gets stronger, planning gets more accurate,
              investors trust the numbers behind the story, and teams align
              around information instead of instinct.
            </p>
            <p>
              That&apos;s the value we aim to create — every engagement,
              every quarter, every board deck.
            </p>
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <div className="section-head center">
            <h2>Better financial decisions begin with better conversations.</h2>
            <p className="closing-line">Let&apos;s start one.</p>
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
