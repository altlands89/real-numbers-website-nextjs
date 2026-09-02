import type { Metadata } from "next";
import Image from "next/image";
import HeaderV2 from "@/components/HeaderV2";
import FooterV2 from "@/components/FooterV2";
import AbstractPanel from "@/components/AbstractPanel";
import CompositionDrift from "@/components/CompositionDrift";
import HeroGlow from "@/components/HeroGlow";
import { getCMS } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Our Team | Real Numbers",
  description: "The people behind Real Numbers.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

export default async function TeamPage() {
  const payload = await getCMS();
  const [page, roster] = await Promise.all([
    payload.findGlobal({ slug: "team-page" }),
    payload.find({ collection: "team-members", sort: "order", limit: 100 }),
  ]);

  return (
    <>
      <HeaderV2 />

      <section
        className="page-hero bg-photo"
        style={{ backgroundImage: "url(/img/photography/team-hero.jpg)" }}
      >
        <CompositionDrift
          src="/compositions/comp-4.svg"
          distance={110}
          style={{
            right: "-12%",
            top: "-20%",
            width: 620,
            opacity: 0.22,
            filter: "invert(1) brightness(1.9)",
          }}
        />
        <HeroGlow />
        <div className="wrap">
          <span className="eyebrow">{page.hero.eyebrow}</span>
          <h1 data-reveal className="reveal-heading">
            {page.hero.heading}
          </h1>
          <p className="lede">{page.hero.lede}</p>
        </div>
      </section>

      <section className="prose-section" data-reveal>
        <CompositionDrift
          src="/compositions/comp-2.svg"
          distance={140}
          style={{ right: "-10%", top: "-6%", width: 500, opacity: 0.14 }}
        />
        <div className="wrap">
          <div className="prose-block" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
            <h2 data-reveal className="reveal-heading">{page.sectionHeading}</h2>
            <div className="team-grid">
              {roster.docs.map((p, i) => {
                const photo = p.photo && typeof p.photo === "object" ? p.photo : null;
                return (
                  <div
                    className="team-card"
                    key={p.id}
                    data-reveal
                    style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
                  >
                    <div className="team-photo">
                      {photo?.url ? (
                        <Image
                          src={photo.url}
                          alt={p.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="team-placeholder"
                          style={{
                            background: i % 2 === 0 ? "var(--blue)" : "var(--red)",
                          }}
                        >
                          {initials(p.name)}
                        </div>
                      )}
                    </div>
                    <div className="team-body">
                      <h3>{p.name}</h3>
                      <span className="role">{p.role}</span>
                      <p>{p.bio}</p>
                      {p.education && (
                        <p style={{ marginTop: 8, fontWeight: 600, opacity: 0.85 }}>
                          {p.education}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta hairline-grid" data-reveal>
        <div className="wrap">
          <AbstractPanel src="/img/abstract/wide-13.jpg" variant="strip" className="final-cta-visual" />
          <div className="section-head center">
            <h2>{page.closingCta.heading}</h2>
            <p className="closing-line">{page.closingCta.closingLine}</p>
          </div>
          <div className="final-cta-action">
            <a href="/contact" className="btn btn-primary">
              {page.closingCta.buttonLabel}
            </a>
          </div>
        </div>
      </section>

      <FooterV2 />
    </>
  );
}
