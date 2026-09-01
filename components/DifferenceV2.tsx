import DecodeText from "./DecodeText";

export default function DifferenceV2() {
  return (
    <section className="v2-difference v2-bg-cover v2-bg-cover--digit">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          The numbers that
          <br />
          make the difference
        </h2>
      </div>
      <div className="wrap">
        <DecodeText />
      </div>
    </section>
  );
}
