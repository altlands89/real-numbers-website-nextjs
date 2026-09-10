/** The v2 homepage's ambient color-blob backdrop, reused on subpage
 *  heroes for visual consistency — a constant, gentle idle float
 *  independent of scroll position (see .v2-hero-glow / v2-glow-drift). */
export default function HeroGlow() {
  return (
    <div className="v2-hero-glow-wrap" aria-hidden="true">
      <div className="v2-hero-glow v2-hero-glow--a" />
      <div className="v2-hero-glow v2-hero-glow--b" />
    </div>
  );
}
