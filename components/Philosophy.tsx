import Image from "next/image";

const PILLARS = [
  {
    icon: "/icons/clarity.svg",
    title: "Clarity",
    text: "Know where your business really stands.",
  },
  {
    icon: "/icons/confidence.svg",
    title: "Confidence",
    text: "Decide on insight, not assumption.",
  },
  {
    icon: "/icons/growth.svg",
    title: "Growth",
    text: "Build financial foundations that scale with your ambition.",
  },
  {
    icon: "/icons/visibility.svg",
    title: "Visibility",
    text: "See the full picture before your next move.",
  },
];

export default function Philosophy() {
  return (
    <section className="philosophy">
      <div className="wrap">
        <div className="philosophy-top">
          <div>
            <span className="eyebrow">Our Philosophy</span>
            <h2>
              We don&apos;t manage numbers. We help leaders make better
              decisions.
            </h2>
          </div>
          <p className="lede">
            Financial information isn&apos;t an end in itself. Its job is to
            show leadership reality clearly enough to spot opportunity,
            manage risk, and move forward with conviction. Real clarity moves
            businesses faster, plans them better, and grows them stronger.
          </p>
        </div>

        <div className="pillars">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.title}>
              <div className="pillar-icon">
                <Image src={p.icon} alt="" width={22} height={22} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>

        <div className="philosophy-cta">
          <a href="#about" className="btn btn-outline-dark">
            More About Us
          </a>
        </div>
      </div>
    </section>
  );
}
