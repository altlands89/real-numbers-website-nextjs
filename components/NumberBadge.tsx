import type { CSSProperties } from "react";

interface NumberBadgeProps {
  value: string;
  className?: string;
  style?: CSSProperties;
  /** Use the solid-filled digit glyphs instead of the hollow outlines. */
  solid?: boolean;
}

/** Renders a numeral string using the brand's hand-drawn digit outlines
 *  instead of typography — used as a graphic accent wherever the site
 *  shows a number (card indices, stats), not just as text. */
export default function NumberBadge({ value, className, style, solid }: NumberBadgeProps) {
  return (
    <span
      className={`number-badge${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      {value.split("").map((d, i) =>
        /[0-9]/.test(d) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={`/img/digits/digit-${solid ? "solid-" : ""}${d}.svg`}
            alt=""
            className="number-badge-digit"
          />
        ) : null
      )}
    </span>
  );
}
