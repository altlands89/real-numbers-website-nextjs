import React from "react";

// Payload's default admin accent ("success" color scale — used for the Save
// button, active nav item, links, etc.) is a blue. This swaps that whole
// 19-step scale for a ramp built from the site's brand red (#b85840) so the
// admin panel reads as "Real Numbers", not generic Payload. Overriding the
// full scale (not just the 500 stop) keeps hover/active/light-bg states
// visually consistent with each other, matching how Payload defines its own
// light/dark inversion in colors.scss.
export function AdminBrandStyles() {
  return (
    <style>{`
      :root {
        --theme-success-50: #fbf1ef;
        --theme-success-100: #f7e3de;
        --theme-success-150: #f0cec5;
        --theme-success-200: #e8b6a8;
        --theme-success-250: #dfa090;
        --theme-success-300: #d38872;
        --theme-success-350: #c8735c;
        --theme-success-400: #c0654d;
        --theme-success-450: #ba5c43;
        --theme-success-500: #b85840;
        --theme-success-550: #a94e38;
        --theme-success-600: #9c4933;
        --theme-success-650: #8a3f2c;
        --theme-success-700: #763524;
        --theme-success-750: #632c1e;
        --theme-success-800: #4f2318;
        --theme-success-850: #3c1a12;
        --theme-success-900: #2a120c;
        --theme-success-950: #180a07;
      }

      html[data-theme='dark'] {
        --theme-success-50: #180a07;
        --theme-success-100: #2a120c;
        --theme-success-150: #3c1a12;
        --theme-success-200: #4f2318;
        --theme-success-250: #632c1e;
        --theme-success-300: #763524;
        --theme-success-350: #8a3f2c;
        --theme-success-400: #9c4933;
        --theme-success-450: #a94e38;
        --theme-success-550: #ba5c43;
        --theme-success-600: #c0654d;
        --theme-success-650: #c8735c;
        --theme-success-700: #d38872;
        --theme-success-750: #dfa090;
        --theme-success-800: #e8b6a8;
        --theme-success-850: #f0cec5;
        --theme-success-900: #f7e3de;
        --theme-success-950: #fbf1ef;
      }

      /* Brand symbol mark before the "Pages" and "Site Design" nav-group
         labels — Payload adds the group name itself as a literal class on
         .nav-group (e.g. class="nav-group Pages"), so these are stable,
         structural selectors, not guesses. Two-word group names become two
         separate classes, hence .Site.Design (both required) rather than a
         single ".Site Design" selector. */
      .nav-group.Pages .nav-group__label,
      .nav-group.Site.Design .nav-group__label {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .nav-group.Pages .nav-group__label::before,
      .nav-group.Site.Design .nav-group__label::before {
        content: "";
        display: inline-block;
        width: 13px;
        height: 13px;
        flex-shrink: 0;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
      .nav-group.Pages .nav-group__label::before {
        background-image: url(/img/symbol-red.svg);
      }
      .nav-group.Site.Design .nav-group__label::before {
        background-image: url(/img/symbol-blue.svg);
      }
    `}</style>
  );
}
