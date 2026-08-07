const STORIES = [
  { role: "Founder & CEO" },
  { role: "Co-Founder & COO" },
  { role: "VP Finance" },
];

export default function Stories() {
  return (
    <section className="stories" id="use-cases">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">Client Stories</span>
          <h2>
            Reports were never the point. The confidence leaders gain from
            them is.
          </h2>
        </div>
        <div className="stories-grid">
          {STORIES.map((s) => (
            <div className="story-card" key={s.role}>
              <span className="story-quote-mark">&quot;</span>
              <p className="placeholder-text">
                Client testimonial coming soon.
              </p>
              <p className="attribution">— {s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
