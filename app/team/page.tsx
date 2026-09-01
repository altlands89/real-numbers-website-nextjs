import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";

export const metadata: Metadata = {
  title: "Our Team | Real Numbers",
  description: "The people behind Real Numbers.",
};

const LEADERSHIP = [
  {
    name: "Eran Dor",
    role: "Founder & CEO",
    image: "/img/team/eran-dor.jpg",
    bio: "A CPA and economist with a 360-degree view of the high-tech industry: auditor, controller, CFO, and investor. Eran has guided hundreds of fundraising processes and prepared companies for IPOs, M&As, and major growth phases. Before founding Real Numbers, he built his career at EY, then served as CFO across cybersecurity and health-tech VCs and startups, experience that gives him a close read on what investors actually expect.",
    edu: "B.A. in Accounting and Business Administration, MBA.",
  },
  {
    name: "Uzi Baruch",
    role: "Partner, Investor Relations",
    image: "/img/team/uzi-baruch.jpg",
    bio: "Over 15 years inside Israel's technology and financial ecosystems, working every engagement from both the business and financial side. Before Real Numbers, Uzi led Business Development for KPMG Israel's Technology Practice, with deep focus on mobility and fintech. His path runs through the Israel Securities Authority, American Express, and PwC: investigation, management, and accounting, all in one background.",
    edu: "B.A. in Accounting and Business Administration, LLB in Law.",
  },
];

const TEAM = [
  {
    name: "Dana Atzmon",
    role: "VP Finance",
    image: "/img/team/dana-atzmon.jpg",
    bio: "Startup financial management, corporate finance, and financial reporting under US GAAP and IFRS. Dana leads strategic planning and due diligence for growing companies.",
  },
  {
    name: "Shalom Renard",
    role: "Finance Director",
    image: "/img/team/shalom-renard.jpg",
    bio: "Financial leadership for early-stage and established companies across high-tech, medical, food tech, and SaaS: financial modeling, cash flow, and ERP implementation.",
  },
  {
    name: "Idan Stern",
    role: "Controller",
    image: "/img/team/idan-stern.jpg",
    bio: "Manages financial operations for Real Numbers clients, including venture capital funds: financial reporting, internal and external audits, full event tracking.",
  },
  {
    name: "Dorit Blit",
    role: "Senior Bookkeeper & Payroll Manager",
    image: "/img/team/dorit-blit.jpg",
    bio: "Complex payroll and business operations for high-tech companies, with over 10 years across FATCA/CRS implementation and regulatory compliance.",
  },
  {
    name: "Reila Eliach",
    role: "Senior Bookkeeper",
    image: "/img/team/reila-eliach.jpg",
    bio: "End-to-end bookkeeping across manufacturing, contracting, and startups, with particular strength in high-tech financial services and Priority.",
  },
  {
    name: "Yael Korchak",
    role: "Grant Specialist & Customer Success",
    image: "/img/team/yael-korchak.jpg",
    bio: "Runs administrative operations and payroll preparation while coordinating clients, suppliers, and banks. Leads Real Numbers' work with the Israeli Innovation Authority.",
  },
  {
    name: "Yulia Sytnyk",
    role: "Financial Operations",
    image: "/img/team/yulia-sytnyk.jpg",
    bio: "Manages financial processes and payment workflows to keep day-to-day operations running smoothly: precise, detail-driven, client-focused.",
  },
  {
    name: "Haim Dagan",
    role: "Senior Bookkeeper",
    image: null,
    bio: "Financial systems and technology: ERP implementation, U.S. bookkeeping, and digital transformation of accounting processes using Priority and SAP.",
  },
  {
    name: "Lesya Feldman",
    role: "Senior Bookkeeper & Payroll Manager",
    image: null,
    bio: "Over 12 years in advanced bookkeeping and payroll: monthly closings, tax reporting, international payments, and advanced payroll solutions.",
  },
  {
    name: "Sara Kanal",
    role: "Senior Bookkeeper",
    image: null,
    bio: "Comprehensive accounting for startups and corporations: financial reporting, payroll, and international banking reconciliations including SVB and PayPal.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

const ALL_TEAM = [...LEADERSHIP, ...TEAM];

export default function TeamPage() {
  return (
    <>
      <HeaderV2 />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/team-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-4.svg"
          distance={110}
          style={{
            right: "-12%",
            top: "-20%",
            width: 620,
            opacity: 0.22,
            filter: "invert(1) brightness(1.9)",
          }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">Our Team</span>
          <h1 data-reveal className="reveal-heading">
            The people behind Real Numbers
          </h1>
          <p className="lede">
            Every model, every board deck, every late-night answer to an
            urgent question: it comes from this team.
          </p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-2.svg"
          distance={140}
          style={{ right: "-10%", top: "-6%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          <div className="prose-block" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
            <h2 data-reveal className="reveal-heading">The Team</h2>
            <div className="team-grid">
              {ALL_TEAM.map((p, i) => (
                <div
                  className="team-card"
                  key={p.name}
                  data-reveal
                  style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
                >
                  <div className="team-photo">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="team-placeholder"
                        style={{
                          background: i % 2 === 0 ? "var(--blue)" : "var(--red)",
                        }}
                      >
                        {initials(p.name)}
                      </div>
                    )}
                  </div>
                  <div className="team-body">
                    <h3>{p.name}</h3>
                    <span className="role">{p.role}</span>
                    <p>{p.bio}</p>
                    {"edu" in p && (
                      <p style={{ marginTop: 8, fontWeight: 600, opacity: 0.85 }}>
                        {(p as { edu: string }).edu}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-13.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>The right people, at every stage of growth</h2>
            <p className="closing-line">
              Let&apos;s talk about what your business needs next.
            </p>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
