import Image from "next/image";
import CompositionDrift from "./CompositionDrift";

// Icon + digit-badge + link target are structural/decorative — not content
// an editor needs to change, so they stay hardcoded and are matched to the
// CMS-driven title in order.
const AREA_META = [
  { icon: "/icons/finops.svg", bgDigit: "8", href: "/our-expertise" },
  { icon: "/icons/stratfin.svg", href: "/our-expertise" },
  { icon: "/icons/fundraising.svg", href: "/our-expertise" },
  { icon: "/icons/bizperf.svg", href: "/our-expertise" },
];

type Area = { title: string; text: string };

export default function AudienceV2({
  heading,
  areas,
  backdropPhotoUrl,
}: {
  heading: string;
  areas: Area[];
  backdropPhotoUrl?: string;
}) {
  return (
    <section className="v2-audience">
      <div className="v2-audience-backdrop" aria-hidden="true">
        {/* Brand still-life as surface texture, blended into the navy rather
            than sitting on top of it as a photo. */}
        <Image
          src={backdropPhotoUrl || "/img/abstract/wide-10.jpg"}
          alt=""
          fill
          sizes="100vw"
          className="v2-audience-texture"
          style={{ objectFit: "cover" }}
        />
        <div className="v2-hero-glow v2-hero-glow--a" />
        <CompositionDrift
          src="/compositions/comp-9.svg"
          distance={140}
          seed={55}
          style={{ right: "-10%", top: "-8%", width: 560, opacity: 0.4 }}
        />
      </div>
      <div className="wrap">
        <h2 data-reveal className="reveal-heading">
          {heading.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <div className="v2-audience-grid">
          {areas.map((a, i) => {
            const meta = AREA_META[i] || AREA_META[0];
            return (
              <a
                href={meta.href}
                className="v2-audience-card"
                key={a.title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="v2-audience-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/img/digits/digit-${meta.bgDigit || i + 1}.svg`}
                    alt=""
                    className="v2-audience-icon-shape"
                  />
                  <Image src={meta.icon} alt="" width={22} height={22} className="v2-audience-icon-glyph" />
                </div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
