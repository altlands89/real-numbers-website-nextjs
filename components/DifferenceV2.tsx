import PillWord from "./PillWord";

export default function DifferenceV2() {
  return (
    <section className="v2-difference">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          The difference that
          <br />
          makes
          <PillWord color="var(--blue)" />
          the difference.
        </h2>
      </div>
      <div className="v2-divider" aria-hidden="true" />
    </section>
  );
}
