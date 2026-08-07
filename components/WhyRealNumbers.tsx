import Image from "next/image";

const WHY = [
  {
    icon: "/icons/startup.svg",
    bg: "var(--red)",
    title: "Startup Mindset",
    text: "We understand how founders think, because we work inside that world every day.",
  },
  {
    icon: "/icons/strategic.svg",
    bg: "var(--blue)",
    title: "Strategic Thinking",
    text: "Numbers only matter when they change a decision. We connect insight to strategy.",
  },
  {
    icon: "/icons/partnership.svg",
    bg: "var(--red)",
    title: "Hands-on Partnership",
    text: "We become part of how leadership decides — not a report that arrives after.",
  },
  {
    icon: "/icons/longterm.svg",
    bg: "var(--blue)",
    title: "Long-Term Growth",
    text: "Every recommendation is made with the next stage already in mind.",
  },
];

export default function WhyRealNumbers() {
  return (
    <section className="why">
      <div className="wrap">
        <div className="why-top">
          <div>
            <span className="eyebrow">Why Real Numbers</span>
            <h2>
              More than financial expertise. A trusted partner for the
              moments that matter most.
            </h2>
          </div>
          <div className="cta-col">
            <p className="lede">
              Choosing a financial partner was never just about technical
              skill. It&apos;s about who you&apos;ll rely on when the
              decisions get bigger and growth stops being theoretical.
            </p>
            <a href="#why" className="link-arrow">
              See why companies choose us →
            </a>
          </div>
        </div>

        <div className="why-grid">
          {WHY.map((w) => (
            <div className="why-item" key={w.title}>
              <div className="pillar-icon" style={{ background: w.bg }}>
                <Image src={w.icon} alt="" width={22} height={22} />
              </div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
