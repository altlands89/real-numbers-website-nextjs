import Image from "next/image";
import Parallax from "./Parallax";
import PhotoSlideshow from "./PhotoSlideshow";

interface AbstractPanelProps {
  /** A single image, or several for an auto-playing crossfade slideshow. Used as a fallback when `video` is empty. */
  src: string | string[];
  /** Optional looping background video (muted, autoplay). Takes over from `src` when present, with a fixed/pinned background instead of the drift Parallax gives images. */
  video?: string;
  /** Decorative by default — these are brand texture, not content. */
  alt?: string;
  /** "band" = full-bleed strip, "strip" = contained wide strip, "panel" = square-ish block. */
  variant?: "band" | "strip" | "panel";
  className?: string;
  /** Parallax travel in px. Kept gentle so it reads as drift, not motion sickness. Ignored when `video` is set. */
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
  video,
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

  const images = Array.isArray(src) ? src.filter(Boolean) : [src];

  return (
    <div
      className={`abstract-panel abstract-panel--${variant}${className ? ` ${className}` : ""}`}
      data-reveal
    >
      {video ? (
        // Pinned/fixed background, not drift — the video is genuinely
        // `position: fixed` to the real viewport; `.abstract-panel`'s own
        // `overflow: hidden` clips it down to a "window" onto this panel
        // as the page scrolls past. No Parallax wrapper here — that's for
        // the image drift case only.
        <div className="abstract-panel-video-fixed">
          <video autoPlay muted loop playsInline aria-hidden="true">
            <source src={video} type="video/mp4" />
          </video>
          {/* Halftone dot texture, colored by a slow-drifting blue→red
              (brand "orange") gradient instead of a flat dot color — a
              radial-gradient dot pattern used as a mask over the gradient
              fill. Fixed to the viewport too, so it stays perfectly
              registered with the video underneath as both scroll/reveal
              together. */}
          <div className="abstract-panel-video-dots" aria-hidden="true" />
        </div>
      ) : (
        <Parallax className="abstract-panel-inner" strength={strength}>
          {images.length > 1 ? (
            <PhotoSlideshow images={images} />
          ) : (
            <Image
              src={images[0]}
              alt={alt}
              fill
              sizes={sizes || defaultSizes}
              style={{ objectFit: "cover" }}
            />
          )}
        </Parallax>
      )}
    </div>
  );
}
