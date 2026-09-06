/**
 * Shared 4s-loop animation system for the 48-icon brand set, used by both
 * the Brand Identity admin view (CSS) and the icon download-pack builder
 * (baked per-frame SVG transforms for the animated SVG/GIF packs) — one
 * source of truth so the on-page preview and the downloaded files move
 * the same way. Every icon SVG is a single solid-fill path with no
 * internal structure, so animations are whole-icon transforms (scale,
 * rotate, translate, opacity) rather than per-part choreography.
 */

export type AnimationRecipe =
  | "pulse"
  | "rotate360"
  | "swing"
  | "bounceY"
  | "tilt"
  | "blinkOpacity"
  | "flipY"
  | "growX"
  | "wobble"
  | "typeCount"
  | "driftY"
  | "popIn";

// Best-effort subject read per icon (from the brand icon sheet) used only
// to pick a fitting motion — a handful (3, 13, 14, 15, 17, 23, 25, 26, 27,
// 29, 31, 32, 36, 38, 40, 42, 44, 47) are confirmed via AdminBrandStyles.tsx's
// NAV_ICONS map; the rest are a reasonable visual read, not guaranteed.
export const ICON_ANIMATIONS: Record<number, AnimationRecipe> = {
  1: "wobble", // chat / conversation
  2: "typeCount", // calculator
  3: "pulse", // star
  4: "blinkOpacity", // signal tower
  5: "popIn", // dot grid
  6: "growX", // briefcase
  7: "typeCount", // percent
  8: "typeCount", // binary
  9: "bounceY", // ladder
  10: "rotate360", // infinity
  11: "swing", // office chair
  12: "popIn", // pie chart
  13: "popIn", // checklist
  14: "wobble", // phone
  15: "blinkOpacity", // binoculars
  16: "pulse", // piggy bank
  17: "wobble", // handshake
  18: "blinkOpacity", // camera
  19: "driftY", // grid
  20: "flipY", // card reader
  21: "popIn", // swatch grid
  22: "bounceY", // cap
  23: "rotate360", // globe
  24: "tilt", // lightning zigzag
  25: "growX", // briefcase
  26: "swing", // key
  27: "tilt", // pulse line
  28: "pulse", // plant
  29: "driftY", // books
  30: "rotate360", // globe
  31: "bounceY", // bench
  32: "swing", // keyhole
  33: "pulse", // coin stack
  34: "flipY", // card
  35: "wobble", // badge
  36: "swing", // pushpin
  37: "growX", // wallet
  38: "growX", // archive box
  39: "flipY", // cursor
  40: "bounceY", // bar chart
  41: "blinkOpacity", // eye
  42: "rotate360", // compass
  43: "wobble", // medal
  44: "tilt", // lightning bolt
  45: "pulse", // coin stack
  46: "popIn", // clipboard
  47: "flipY", // diamond
  48: "driftY", // grid table
};

// CSS @keyframes bodies, all normalized to a 0%–100% single 4s loop.
// transform-origin is set to center via the wrapping element's inline
// style, not here, so this text stays reusable in both a live <style>
// block and inside standalone downloaded SVG files.
export const ANIMATION_KEYFRAMES: Record<AnimationRecipe, string> = {
  pulse: `0%,100%{transform:scale(1)}50%{transform:scale(1.15)}`,
  rotate360: `0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`,
  swing: `0%,100%{transform:rotate(0deg)}25%{transform:rotate(10deg)}75%{transform:rotate(-10deg)}`,
  bounceY: `0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}`,
  tilt: `0%,50%,100%{transform:rotate(0deg)}25%{transform:rotate(6deg)}75%{transform:rotate(-6deg)}`,
  blinkOpacity: `0%,100%{opacity:1}50%{opacity:0.35}`,
  flipY: `0%,100%{transform:scaleX(1)}50%{transform:scaleX(-1)}`,
  growX: `0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.12)}`,
  wobble: `0%,100%{transform:rotate(0deg) scale(1)}50%{transform:rotate(8deg) scale(1.05)}`,
  typeCount: `0%,20%,40%,60%,80%,100%{transform:scale(1)}10%,30%,50%,70%,90%{transform:scale(1.08)}`,
  driftY: `0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}`,
  popIn: `0%,50%,100%{transform:scale(1)}25%,75%{transform:scale(1.1)}`,
};

/** Sample a recipe at time t (0..1 across one 4s loop) as an SVG-attribute
 * transform (no units on angles, space-separated functions) plus opacity,
 * for baking a static per-frame SVG used by the GIF/animated-SVG builders. */
export function sampleSvgTransform(
  recipe: AnimationRecipe,
  t: number,
  cx: number,
  cy: number,
): { transform: string; opacity: number } {
  const twoPi = Math.PI * 2;
  let angle = 0;
  let sx = 1;
  let sy = 1;
  let dx = 0;
  let dy = 0;
  let opacity = 1;

  switch (recipe) {
    case "pulse": {
      const s = 1 + 0.15 * (0.5 - 0.5 * Math.cos(twoPi * t));
      sx = sy = s;
      break;
    }
    case "rotate360":
      angle = 360 * t;
      break;
    case "swing":
      angle = 10 * Math.sin(twoPi * t);
      break;
    case "bounceY":
      dy = -6 * Math.max(0, Math.sin(twoPi * t));
      break;
    case "tilt":
      angle = 6 * Math.sin(twoPi * 2 * t);
      break;
    case "blinkOpacity":
      opacity = 0.35 + 0.65 * Math.abs(Math.cos(Math.PI * t));
      break;
    case "flipY":
      sx = Math.cos(twoPi * t);
      break;
    case "growX":
      sx = 1 + 0.12 * (0.5 - 0.5 * Math.cos(twoPi * t));
      break;
    case "wobble":
      angle = 8 * Math.sin(twoPi * t);
      sx = sy = 1 + 0.05 * Math.sin(twoPi * t);
      break;
    case "typeCount": {
      const s = 1 + 0.08 * Math.max(0, Math.sin(twoPi * 4 * t));
      sx = sy = s;
      break;
    }
    case "driftY":
      dy = -4 * Math.sin(twoPi * t);
      break;
    case "popIn": {
      const s = 1 + 0.1 * Math.max(0, Math.sin(twoPi * 2 * t));
      sx = sy = s;
      break;
    }
  }

  const parts = [
    `translate(${dx} ${dy})`,
    `translate(${cx} ${cy})`,
    angle ? `rotate(${angle})` : "",
    sx !== 1 || sy !== 1 ? `scale(${sx} ${sy})` : "",
    `translate(${-cx} ${-cy})`,
  ].filter(Boolean);

  return { transform: parts.join(" "), opacity };
}
