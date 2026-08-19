import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Real Numbers",
  description:
    "We believe every growing company deserves a financial partner it can actually trust.",
};

const PRINCIPLES = [
  {
    lead: "Clarity comes first.",
    text: "Financial information should simplify leadership, not overwhelm it. Our job is turning complexity into insight you can act on.",
  },
  {
    lead: "Confidence is earned.",
    text: "Strong partnerships run on honesty, consistency, and discretion — earned conversation by conversation, decision by decision.",
  },
  {
    lead: "Growth needs a partner, not a vendor.",
    text: "We don't sit outside the business looking in. We work inside the decisions that shape where it goes.",
  },
  {
    lead: "Visibility is a discipline.",
    text: "We don't optimize only for today's problem. We build the foundations you'll still rely on two years from now.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="page-hero hairline-grid">
        <div className="wrap">
          <span className="eyebrow">About Real Numbers</span>
          <h1>
            We believe every growing company deserves a financial partner it
            can actually trust.
          </h1>
          <p className="lede">
            We didn&apos;t build Real Numbers to become another accounting
            firm. We built it because leadership deserves more than accurate
            reports — it deserves clarity, perspective, honest conversations,
            and a partner who understands that behind every financial
            decision sits a business, a team, and a vision worth protecting.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <div className="wrap">
          <div className="prose-block">
            <h2>Our Story</h2>
            <p>
              Every business reaches a point where instinct alone stops being
              enough. Growth brings new opportunity and greater complexity in
              the same breath — the questions get more strategic, the risk
              more consequential, the decisions heavier than they used to be.
            </p>
            <p>
              That&apos;s the gap Real Numbers was built to close: between
              traditional financial management and strategic business
              leadership. We work alongside founders and executive teams to
              turn financial complexity into business clarity — helping
              companies decide with confidence and build foundations that
              hold under real growth.
            </p>
            <p>
              Our role was never just to explain what happened. It&apos;s to
              help leadership understand what comes next.
            </p>
          </div>

          <div className="prose-block">
            <h2>What We Believe</h2>
            <p>
              Every company has numbers. Not every company has clarity. Four
              principles guide how we work.
            </p>
            <div className="principles-list">
              {PRINCIPLES.map((p) => (
                <div className="principle" key={p.lead}>
                  <strong>{p.lead}</strong>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="prose-block">
            <h2>How We Work</h2>
            <p>
              Every engagement starts with understanding, not a template.
              Before we build a forecast, dashboard, or model, we learn the
              business behind the numbers — its ambitions, its pace, its
              people, and what growth is actually pressuring right now.
            </p>
            <p>
              Every company deserves a financial framework built around its
              own journey. As your business evolves, our role evolves with
              it: building foundations one quarter, preparing a raise the
              next, sitting in on a decision that has nothing to do with a
              spreadsheet and everything to do with judgment.
            </p>
            <p>
              Whatever the challenge, the purpose stays the same — clarity
              and confidence to move forward.
            </p>
          </div>

          <div className="prose-block">
            <h2>Leadership</h2>
            <div className="leadership-grid">
              <div className="leadership-card">
                <h3>Eran Dor</h3>
                <span className="role">Founder &amp; CEO</span>
                <p className="bio">
                  Eran is a CPA and economist who learned finance from the
                  inside before founding Real Numbers — starting at KPMG,
                  then moving client-side through VP Finance and CFO roles,
                  including time at BRM. He founded Real Numbers in 2016 on a
                  simple conviction: growing companies need financial
                  leadership, not just financial reporting. That conviction
                  still shapes how he works — Eran would rather understand
                  what a business actually needs than hand over a standard
                  deliverable, and that instinct sits behind every model,
                  forecast, and board conversation we lead.
                </p>
              </div>
              <div className="leadership-card">
                <h3>Uzi Baruch</h3>
                <span className="role">Partner, Client &amp; Investor Relations</span>
                <p className="bio">
                  Uzi doesn&apos;t fit the usual mold of the profession, by
                  design. He trained in accounting and holds a law degree,
                  but built his career on people more than paperwork — first
                  as an investigator at the Israel Securities Authority, then
                  in fintech business development at KPMG, where he built the
                  market relationships and startup-ecosystem knowledge that
                  still shape how we work with founders today. At Real
                  Numbers, Uzi is the reason clients feel looked after rather
                  than processed — he owns the relationship and the
                  responsiveness, so the team stays focused on getting the
                  numbers right.
                </p>
              </div>
            </div>
            <p className="leadership-note">
              Eran and Uzi have worked together across more than one chapter
              of their careers. What carried into Real Numbers is the same
              division that makes the partnership work: one holds the
              professional depth, the other makes sure it reaches the people
              who need it.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
