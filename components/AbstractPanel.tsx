import Image from "next/image";
import Parallax from "./Parallax";

interface AbstractPanelProps {
  src: string;
  /** Decorative by default — these are brand texture, not content. */
  alt?: string;
  /** "band" = full-bleed strip, "strip" = contained wide strip, "panel" = square-ish block. */
  variant?: "band" | "strip" | "panel";
  className?: string;
  /** Parallax travel in px. Kept gentle so it reads as drift, not motion sickness. */
  strength?: number;
  sizes?: string;
}

/**
 * A brand "abstract" still-life used as visual texture in sections that
 * would otherwise be a wall of type. The outer element carries the scroll
 * reveal (a slow clip + scale settle), the inner Parallax carries the
 * drift — separate elements because both animate `transform`.
 */
export default function AbstractPanel({
  src,
  alt = "",
  variant = "strip",
  className,
  strength = 22,
  sizes,
}: AbstractPanelProps) {
  const defaultSizes =
    variant === "panel"
      ? "(max-width: 900px) 100vw, 45vw"
      : "(max-width: 900px) 100vw, 90vw";

  return (
    <div
      className={`abstract-panel abstract-panel--${variant}${className ? ` ${className}` : ""}`}
      data-reveal
    >
      <Parallax className="abstract-panel-inner" strength={strength}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || defaultSizes}
          style={{ objectFit: "cover" }}
        />
      </Parallax>
    </div>
  );
}
