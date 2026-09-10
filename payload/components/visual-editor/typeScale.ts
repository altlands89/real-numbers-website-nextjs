import type { CSSProperties } from "react";
import type { BrandColors } from "./serverData";

/**
 * Real fluid clamp() formulas copied verbatim from app/(frontend)/globals.css's
 * shared h1/h2/h3/eyebrow/lede rules (see CLAUDE.md's "Stage 1 — heading sizes
 * unified onto the shared type scale" note), evaluated as plain numbers
 * against a FIXED reference viewport (REFERENCE_VIEWPORT, matching
 * DeviceFrame's virtual desktop width) instead of a literal CSS `vw` unit.
 *
 * Two reasons this is computed rather than a CSS clamp() string:
 * 1. Payload's admin sets `html { font-size: 12px }` (vs. the live site's
 *    16px), so a literal `rem` here would resolve 25% smaller than on the
 *    live page — every "rem" term below is its px equivalent at a 16px root.
 * 2. `vw` always reads the REAL browser window width, which has nothing to
 *    do with the editor's own admin browser tab width — a wide admin window
 *    would render noticeably larger text than the same page in a narrower
 *    one, even though both should represent "how this looks on a 1440px-wide
 *    desktop." Evaluating the formula against a fixed reference width makes
 *    the preview deterministic, and DeviceFrame's `transform: scale()` then
 *    does the actual "shrink to fit the panel" — a pure optical zoom that
 *    doesn't change the underlying (correctly-computed) type sizes.
 */

export const REFERENCE_VIEWPORT = 1440;

function clampPx(minPx: number, vwCoefficient: number, addPx: number, maxPx: number): number {
  const val = (vwCoefficient / 100) * REFERENCE_VIEWPORT + addPx;
  return Math.min(maxPx, Math.max(minPx, val));
}

// h1 { --type-h1-computed: clamp(2.75rem, 4.6vw + 1.4rem, 6.5rem); }
const H1_PX = clampPx(44, 4.6, 22.4, 104);
// h2 { --type-h2-computed: clamp(2.3rem, 2vw + 1.75rem, 3.85rem); }
const H2_PX = clampPx(36.8, 2, 28, 61.6);
// h3 { clamp(1.15rem, 0.4vw + 1.05rem, 1.35rem); }
const H3_PX = clampPx(18.4, 0.4, 16.8, 21.6);

/** .eyebrow */
export function eyebrowStyle(colors: BrandColors, onDark = true): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: onDark ? colors.clay : colors.red,
  };
}

/** .page-hero h1 — every subpage's top-banner heading: calc(--type-h1-computed * 0.62) */
export function pageHeroH1Style(colors: BrandColors): CSSProperties {
  return {
    fontSize: H1_PX * 0.62,
    lineHeight: 0.98,
    letterSpacing: "-0.02em",
    fontWeight: 800,
    color: colors.offwhite,
  };
}

/** .page-hero .lede — 20px/500/0.8 opacity, white */
export function pageHeroLedeStyle(): CSSProperties {
  return {
    fontSize: 20,
    lineHeight: 1.5,
    fontWeight: 500,
    opacity: 0.8,
    color: "#ffffff",
    maxWidth: "62ch",
  };
}

/** Base h2 — section headings, on light or dark background */
export function sectionH2Style(colors: BrandColors, onDark = false): CSSProperties {
  return {
    fontSize: H2_PX,
    lineHeight: 1,
    letterSpacing: "-0.028em",
    fontWeight: 700,
    color: onDark ? colors.offwhite : colors.blue,
  };
}

/**
 * Home's v2 sections each scale the shared h2 by their own multiplier
 * instead of using the base size directly (.v2-difference h2 ×1.45,
 * .v2-stats/.v2-audience h2 ×1.17, .v2-cta-dark h2 ×0.94,
 * .v2-footer-cta h2 ×0.88 — see CLAUDE.md's Stage 1 note).
 */
export function scaledH2Style(colors: BrandColors, multiplier: number, onDark = false): CSSProperties {
  return {
    fontSize: H2_PX * multiplier,
    lineHeight: 1,
    letterSpacing: "-0.028em",
    fontWeight: 700,
    color: onDark ? colors.offwhite : colors.blue,
  };
}

/** .v2-hero-headline — the homepage's giant rotating-word headline, ×1.77 */
export function homeHeroHeadlineStyle(colors: BrandColors): CSSProperties {
  return {
    fontSize: H1_PX * 1.77,
    lineHeight: 0.8,
    letterSpacing: "-0.03em",
    fontWeight: 800,
    color: colors.offwhite,
  };
}

/** h3 — card/item titles in dense grids */
export function cardH3Style(colors: BrandColors): CSSProperties {
  return {
    fontSize: H3_PX,
    lineHeight: 1.15,
    letterSpacing: "-0.016em",
    fontWeight: 700,
    color: colors.blue,
  };
}

/** .lede — 20px/400/0.86 opacity, used outside .page-hero */
export function ledeStyle(colors: BrandColors, onDark = false): CSSProperties {
  return {
    fontSize: 20,
    lineHeight: 1.5,
    fontWeight: 400,
    opacity: 0.86,
    color: onDark ? colors.offwhite : colors.black,
    maxWidth: "62ch",
  };
}

/** .prose-section p — real body-copy paragraph size, 16px/1.65/0.8 opacity */
export function bodyTextStyle(colors: BrandColors): CSSProperties {
  return {
    fontSize: 16,
    lineHeight: 1.65,
    opacity: 0.8,
    color: colors.black,
  };
}
