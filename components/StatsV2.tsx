import CounterBadge from "./CounterBadge";

type Stat = {
  label: string;
  value: number;
  color: "red" | "blue" | "jet" | "horizon";
};

export default function StatsV2({ heading, stats }: { heading: string; stats: Stat[] }) {
  return (
    <section className="v2-stats">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          {heading}
        </h2>
        <div className="v2-stats-grid">
          {stats.map((s) => (
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
