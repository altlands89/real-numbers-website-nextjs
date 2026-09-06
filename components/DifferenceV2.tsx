import type { ReactNode } from "react";
import DecodeText from "./DecodeText";

export default function DifferenceV2({ heading }: { heading: ReactNode }) {
  return (
    <section className="v2-difference v2-bg-cover v2-bg-cover--digit">
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          {heading}
        </h2>
      </div>
      <div className="wrap">
        <DecodeText />
      </div>
    </section>
  );
}
