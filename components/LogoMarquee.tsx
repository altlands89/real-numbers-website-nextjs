interface Logo {
  src: string;
  alt: string;
}

/** On desktop all logos already fit in one row (no-op — the duplicated
 *  set stays hidden, see .v2-logos-set--dup). On mobile this becomes a
 *  continuous marquee: a plain CSS `animation` (globals.css,
 *  .v2-logos-track / @keyframes v2-logos-scroll) translates the track by
 *  exactly one set's width — 50% of itself, since it holds two identical
 *  copies back to back — looping with no visible seam.
 *
 *  No JS timer drives this (an earlier version called
 *  scrollTo({behavior:"smooth"}) on a setInterval, then reset scrollLeft
 *  after a hardcoded 500ms timeout — racing against the browser's actual,
 *  variable-duration smooth-scroll animation, which on iOS Safari in
 *  particular is neither fixed nor consistent for a given distance; the
 *  reset regularly fired mid-scroll, producing a visible snap instead of
 *  continuous motion). A CSS animation has no such race — the compositor
 *  owns the whole loop once it starts, so there's nothing for a delayed
 *  or throttled JS tick to fall out of sync with. This component is now a
 *  server component (no "use client", no state, nothing to hydrate). */
export default function LogoMarquee({ logos }: { logos: Logo[] }) {
  return (
    <div className="v2-logos-row">
      <div className="v2-logos-track">
        <div className="v2-logos-set">
          {logos.map((l) => (
            <div className="v2-logo-chip" key={l.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.alt} />
            </div>
          ))}
        </div>
        <div className="v2-logos-set v2-logos-set--dup" aria-hidden="true">
          {logos.map((l) => (
            <div className="v2-logo-chip" key={`${l.alt}-dup`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
