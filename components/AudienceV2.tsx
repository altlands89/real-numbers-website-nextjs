import Image from "next/image";
import CompositionDrift from "./CompositionDrift";
import PillWord from "./PillWord";

const AREAS = [
  {
    num: "1",
    icon: "/icons/finops.svg",
    title: "Financial Operations",
    text: "The foundations every growing business depends on — bookkeeping, payroll, compliance, and control.",
    href: "/our-expertise",
  },
  {
    num: "2",
    icon: "/icons/stratfin.svg",
    title: "Strategic Finance",
    text: "Turning financial information into business direction — budgeting, forecasting, and board-ready reporting.",
    href: "/our-expertise",
  },
  {
    num: "3",
    icon: "/icons/fundraising.svg",
    title: "Fundraising & Growth",
    text: "Building the credibility investors expect to see, long before the first pitch deck opens.",
    href: "/our-expertise",
  },
  {
    num: "4",
    icon: "/icons/bizperf.svg",
    title: "Business Performance",
    text: "Dashboards, profitability analysis, and executive insight that turn data into decisions.",
    href: "/our-expertise",
  },
];

export default function AudienceV2() {
  return (
    <section className="v2-audience">
      <div className="v2-audience-backdrop" aria-hidden="true">
        <div className="v2-hero-glow v2-hero-glow--a" />
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={140}
          seed={55}
          style={{ right: "-10%", top: "-8%", width: 560, opacity: 0.4 }}
        />
      </div>
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          One partnership.
          <PillWord color="var(--red)" />
          <br />
          Every stage of growth.
        </h2>
        <div className="v2-audience-grid">
          {AREAS.map((a, i) => (
            <a
              href={a.href}
              className="v2-audience-card"
              key={a.title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="v2-audience-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/img/digits/digit-${a.num}.svg`}
                  alt=""
                  className="v2-audience-icon-shape"
                />
                <Image
                  src={a.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="v2-audience-icon-glyph"
                />
              </div>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
