import DecodeText from "./DecodeText";

export default function DifferenceV2({ heading }: { heading: string }) {
  return (
    <section className="v2-difference v2-bg-cover v2-bg-cover--digit">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          {heading.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
      </div>
      <div className="wrap">
        <DecodeText />
      </div>
    </section>
  );
}
