import Image from "next/image";
import CompositionDrift from "./CompositionDrift";
import Parallax from "./Parallax";

export default function Moment() {
  return (
    <section className="moment" id="about" data-reveal>
      <CompositionDrift
        src="/compositions/comp-3.svg"
        distance={172}
        seed={3}
        style={{
          left: "-14%",
          top: "-16%",
          width: 640,
          opacity: 0.2,
        }}
      />
      <div className="wrap moment-grid">
        <div>
          <span className="eyebrow">Where Finance Becomes Leadership</span>
          <h2 data-reveal className="reveal-heading">
            The point every growing company reaches
          </h2>
          <div className="moment-copy">
            <p>
              There&apos;s a familiar moment: staring at a dashboard the
              night before a board meeting, no longer sure the numbers on it
              are the ones that matter.
            </p>
            <p>
              That&apos;s not a failure. It&apos;s a milestone — the business
              has outgrown the tools that got it here. Teams grow. Cash flow
              gets harder to predict. Investors ask sharper questions.
              Decisions that once ran on instinct now need visibility.
            </p>
            <p>
              This is the point where finance stops being an operational
              function and becomes part of leadership. We help companies make
              that shift — clarity for the complexity, confidence for the
              decision that follows it.
            </p>
          </div>
        </div>
        <Parallax className="moment-visual" strength={30}>
          <Image
            src="/img/masked-zero.png"
            alt="Founder reviewing financials on a laptop"
            fill
            style={{ objectFit: "cover" }}
          />
          <span className="tag">Clarity, in practice</span>
        </Parallax>
      </div>
    </section>
  );
}
