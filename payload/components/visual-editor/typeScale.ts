import type { CSSProperties } from "react";
import type { BrandColors } from "./serverData";

/**
 * Real fluid clamp() formulas copied verbatim from app/(frontend)/globals.css's
 * shared h1/h2/h3/eyebrow/lede rules (see CLAUDE.md's "Stage 1 — heading sizes
 * unified onto the shared type scale" note) — so a visual editor's canvas
 * scales the same way the live page does at the same viewport width, instead
 * of a hand-guessed fixed pixel size tuned for a narrow schematic box. This is
 * why every editor's canvas was also widened from a fixed 900px to 1280px —
 * vw-relative clamp() only reads correctly at something close to the real
 * page's own container width.
 *
 * Every "rem" term below is written as its px equivalent (at the real
 * site's 16px root) rather than literal "rem" — Payload's admin sets
 * `html { font-size: 12px }`, so a literal rem here would resolve 25%
 * smaller than on the live page. The `vw` terms are untouched since those
 * are already root-font-size-independent.
 */

// h1 { --type-h1-computed: clamp(2.75rem, 4.6vw + 1.4rem, 6.5rem); }
const H1_CLAMP = "clamp(44px, 4.6vw + 22.4px, 104px)";
// h2 { --type-h2-computed: clamp(2.3rem, 2vw + 1.75rem, 3.85rem); }
const H2_CLAMP = "clamp(36.8px, 2vw + 28px, 61.6px)";
// h3 { clamp(1.15rem, 0.4vw + 1.05rem, 1.35rem); }
const H3_CLAMP = "clamp(18.4px, 0.4vw + 16.8px, 21.6px)";

/** .eyebrow */
export function eyebrowStyle(colors: BrandColors, onDark = true): CSSProperties {
  return {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: onDark ? colors.clay : colors.red,
  };
}

/** .page-hero h1 — every subpage's top-banner heading: calc(--type-h1-computed * 0.62) */
export function pageHeroH1Style(colors: BrandColors): CSSProperties {
  return {
    fontSize: `calc(${H1_CLAMP} * 0.62)`,
    lineHeight: 0.98,
    letterSpacing: "-0.02em",
    fontWeight: 800,
    color: colors.offwhite,
  };
}

/** .page-hero .lede — 20px/500/0.8 opacity, white */
export function pageHeroLedeStyle(): CSSProperties {
  return {
    fontSize: "20px",
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
    fontSize: H2_CLAMP,
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
    fontSize: `calc(${H2_CLAMP} * ${multiplier})`,
    lineHeight: 1,
    letterSpacing: "-0.028em",
    fontWeight: 700,
    color: onDark ? colors.offwhite : colors.blue,
  };
}

/** .v2-hero-headline — the homepage's giant rotating-word headline, ×1.77 */
export function homeHeroHeadlineStyle(colors: BrandColors): CSSProperties {
  return {
    fontSize: `calc(${H1_CLAMP} * 1.77)`,
    lineHeight: 0.8,
    letterSpacing: "-0.03em",
    fontWeight: 800,
    color: colors.offwhite,
  };
}

/** h3 — card/item titles in dense grids */
export function cardH3Style(colors: BrandColors): CSSProperties {
  return {
    fontSize: H3_CLAMP,
    lineHeight: 1.15,
    letterSpacing: "-0.016em",
    fontWeight: 700,
    color: colors.blue,
  };
}

/** .lede — 20px/400/0.86 opacity, used outside .page-hero */
export function ledeStyle(colors: BrandColors, onDark = false): CSSProperties {
  return {
    fontSize: "20px",
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
    fontSize: "16px",
    lineHeight: 1.65,
    opacity: 0.8,
    color: colors.black,
  };
}
