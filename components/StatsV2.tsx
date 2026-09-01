import CounterBadge from "./CounterBadge";

// M&A deals and funds managed are placeholders pending final figures from
// the client — everything else here is a real, current number.
const STATS = [
  { label: "People on the team", value: 12, color: "red" as const },
  { label: "Years in business", value: 10, color: "blue" as const },
  { label: "M&A deals", value: 8, color: "jet" as const },
  { label: "Funds managed ($M)", value: 250, color: "horizon" as const },
];

export default function StatsV2() {
  return (
    <section className="v2-stats">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          Proof in numbers
        </h2>
        <div className="v2-stats-grid">
          {STATS.map((s) => (
            <div className="v2-stat-col" key={s.label} data-reveal>
              <CounterBadge value={s.value} className="v2-stat-number" color={s.color} />
              <span className="v2-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
