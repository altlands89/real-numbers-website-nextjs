import Image from "next/image";

const SERVICES = [
  {
    num: "01",
    icon: "/icons/finops.svg",
    title: "Financial Operations",
    text: "The foundations every growing business depends on.",
  },
  {
    num: "02",
    icon: "/icons/stratfin.svg",
    title: "Strategic Finance",
    text: "Turning data into business decisions.",
  },
  {
    num: "03",
    icon: "/icons/fundraising.svg",
    title: "Fundraising & Growth",
    text: "Preparing for investment, expansion, and what's next.",
  },
  {
    num: "04",
    icon: "/icons/bizperf.svg",
    title: "Business Performance",
    text: "The visibility that drives smarter decisions.",
  },
];

export default function Services() {
  return (
    <section className="services" id="expertise" data-reveal>
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
              <a href="/our-expertise" className="service-link">
                Learn more →
              </a>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <a href="/our-expertise" className="btn btn-outline-dark">
            Explore Our Expertise
          </a>
        </div>
      </div>
    </section>
  );
}
