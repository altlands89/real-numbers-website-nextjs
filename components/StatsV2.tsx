import Image from "next/image";
import CounterBadge from "./CounterBadge";

const STATS = [
  {
    label: "Founded.",
    value: 2016,
    photo: "/compositions/comp-7.svg",
  },
  {
    label: "People on the team.",
    value: 12,
    photo: "/img/photography/expertise-atmosphere.jpg",
  },
  {
    label: "Connected areas of expertise.",
    value: 4,
    photo: "/img/photography/usecases-atmosphere.jpg",
  },
];

export default function StatsV2() {
  return (
    <section className="v2-stats v2-bg-cover v2-bg-cover--comp">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          Proof in numbers.
        </h2>
        <div className="v2-stats-list">
          {STATS.map((s, i) => (
            <div className="v2-stat-row" key={s.label} data-reveal>
              <span className="v2-stat-label">{s.label}</span>
              <CounterBadge
                value={s.value}
                className="v2-stat-number"
                color={i % 2 === 0 ? "red" : "blue"}
              />
              <div className="v2-stat-photo">
                <Image src={s.photo} alt="" fill style={{ objectFit: "cover" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
