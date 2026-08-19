import CompositionDrift from "./CompositionDrift";

const STORIES = [
  {
    quote:
      "Working with Real Numbers has been a real asset for us. Uzi and Eran are thoughtful, precise, and always available when we need them. They understand our business deeply and help turn complex challenges into clear, practical plans. Their team combines the professionalism of a strong finance department with the care and ownership of true partners.",
    name: "Gilad Uziely",
    role: "Get Sequence",
  },
  {
    quote:
      "The Real Numbers team supported us every step of the way — guiding with clarity, strengthening our business model, and responding quickly whenever needed. Their true partnership and personal approach made us feel like the first and only client.",
    name: "Yaniv Nisanboim",
    role: "",
  },
  {
    quote:
      "I've worked with many advisors, but Real Numbers really changed the game. They're that rare mix of professionalism, reliability, and true partnership. With them, I gained clarity, control, and confidence in financial decisions. More than just a service provider, they became a trusted partner to me and the company.",
    name: "Marina",
    role: "VP of Finance and Operations, Astrix",
  },
  {
    quote:
      "As a CEO, trust is everything — especially when it comes to finances. The team at Real Numbers has become a true partner in our journey. They act as real-time advisors for every financial strategy and question, and their proactive approach allows us to focus fully on our customers, confident that Real Numbers has our back at every step. Their professionalism, combined with a level of service that is truly unheard of, sets them apart in every way.",
    name: "Amit Rapaport",
    role: "CEO, Compete",
  },
];

export default function Stories() {
  return (
    <section className="stories" id="use-cases" data-reveal>
      <CompositionDrift
        src="/compositions/comp-13.svg"
        distance={140}
        style={{ right: "-8%", top: "-12%", width: 420, opacity: 0.1 }}
      />
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
            <div className="story-card" key={s.name}>
              <span className="story-quote-mark">&quot;</span>
              <p className="story-text">{s.quote}</p>
              <p className="attribution">
                — {s.name}
                {s.role ? `, ${s.role}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
