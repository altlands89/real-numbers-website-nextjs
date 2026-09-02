import Parallax from "./Parallax";
import PhotoSlideshow from "./PhotoSlideshow";
import type { CSSProperties } from "react";

type Props = {
  images: string[];
  alt: string;
  caption?: string;
  fallbackSrc: string;
  className?: string;
  strength?: number;
  style?: CSSProperties;
};

/**
 * Mood/atmosphere photo slot used across several pages — renders as a
 * single still image when the editor uploaded one photo, or an
 * auto-playing crossfade slideshow (see PhotoSlideshow) the moment they
 * upload more than one. Falls back to the original static asset if the
 * CMS field is empty (e.g. before the first seed/edit).
 */
export default function AtmospherePhoto({ images, alt, caption, fallbackSrc, className = "atmosphere-photo", strength = 26, style }: Props) {
  const srcs = images.length > 0 ? images : [fallbackSrc];

  return (
    <Parallax className={className} strength={strength} style={style}>
      <PhotoSlideshow images={srcs} />
      {caption && <span className="tag">{caption}</span>}
      {/* Screen-reader description — PhotoSlideshow's own <img> tags are alt="" since they're decorative/rotating. */}
      <span className="sr-only">{alt}</span>
    </Parallax>
  );
}
