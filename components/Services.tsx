import Image from "next/image";

const SERVICES = [
  {
    num: "01",
    icon: "/icons/finops.svg",
    title: "Financial Operations",
    text: "The foundations every growing business depends on — bookkeeping, payroll, financial statements, and the controls that keep the business accurate and compliant.",
  },
  {
    num: "02",
    icon: "/icons/stratfin.svg",
    title: "Strategic Finance",
    text: "Turning data into business decisions — fractional CFO support, budgeting, forecasting, and board reporting that earns trust.",
  },
  {
    num: "03",
    icon: "/icons/fundraising.svg",
    title: "Fundraising & Growth",
    text: "Preparing for investment, expansion, and what's next — financial models, investor materials, and due diligence support.",
  },
  {
    num: "04",
    icon: "/icons/bizperf.svg",
    title: "Business Performance",
    text: "The visibility that drives smarter decisions — performance dashboards, profitability analysis, and cash runway monitoring.",
  },
];

export default function Services() {
  return (
    <section className="services" id="expertise">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Our Expertise</span>
          <h2>The right expertise for every stage of growth</h2>
          <p className="lede" style={{ marginLeft: "auto", marginRight: "auto" }}>
            As businesses evolve, so do their financial needs. Our integrated
            approach combines operational precision with strategic
            leadership — the exact capability, exactly when you need it.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div className="service-card" key={s.num}>
              <span className="num">{s.num}</span>
              <div className="icon-badge">
                <Image src={s.icon} alt="" width={22} height={22} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a href="#expertise" className="service-link">
                Learn more →
              </a>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <a href="#expertise" className="btn btn-outline-dark">
            Explore Our Expertise
          </a>
        </div>
      </div>
    </section>
  );
}
