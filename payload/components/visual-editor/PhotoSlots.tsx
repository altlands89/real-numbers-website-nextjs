"use client";

import React from "react";
import { type MediaItem, photoBtn } from "./shared";

/** The photo slots for a slideshow-capable photo array field. One photo
 *  renders as a static image on the live page; several auto-play as a
 *  crossfading slideshow, which is why this shows them as an ordered set
 *  rather than a single well. Shared by every page's visual editor that
 *  has one of these fields (About's ourStory.photos, Why Real Numbers'
 *  whatMakesDifferent.photos, Our Expertise's integrated.photos, Use
 *  Cases' / Questions Founders Ask's top-level atmospherePhotos, …). */
export function PhotoSlots({
  photos,
  resolve,
  onPick,
  onRemove,
}: {
  photos: { image: number | { id: number; url?: string | null } }[];
  resolve: (id: number | { id: number } | null | undefined) => MediaItem | undefined;
  onPick: (index: number | "new") => void;
  onRemove: (index: number) => void;
}) {
  // A fixed *pixel* height, not a percentage-padding aspect-ratio box.
  // This tile is a CSS Grid item in an auto-sized-row grid; a percentage
  // `padding-top` needs its own resolved width before it can produce a
  // height, and a grid's auto-row-sizing pass needs each item's height
  // before it can resolve row (and therefore item) sizing — that circular
  // dependency is a real, confirmed bug (not a browser quirk): with
  // `overflow: hidden` the tile's *computed* height collapsed to ~0 in
  // testing, clipping the whole photo out. A fixed height has no such
  // dependency — it's known up front, so there's nothing to resolve.
  const tile: React.CSSProperties = {
    position: "relative",
    height: 320,
    borderRadius: 8,
    overflow: "hidden",
    background: "rgba(36,30,28,0.08)",
    border: "1px solid rgba(36,30,28,0.15)",
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {photos.map((p, i) => {
        // Prefer the populated object's own url so a freshly picked image
        // still renders even if it wasn't in the library page we loaded.
        const populated = typeof p.image === "object" ? p.image : undefined;
        const url = populated?.url ?? resolve(p.image)?.url;
        return (
          <div key={i} style={tile}>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 10, color: "rgba(36,30,28,0.45)", fontFamily: "system-ui, sans-serif" }}>
                Missing image
              </span>
            )}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 6, padding: 6 }}>
              <button type="button" onClick={() => onPick(i)} style={photoBtn}>
                Change
              </button>
              <button type="button" onClick={() => onRemove(i)} style={photoBtn} title="Remove this photo">
                Remove
              </button>
            </div>
            {photos.length > 1 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  background: "rgba(36,30,28,0.75)",
                  color: "#f0efe8",
                  fontSize: 9,
                  padding: "2px 6px",
                  borderRadius: 3,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {i + 1} / {photos.length}
              </span>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => onPick("new")}
        style={{
          ...photoBtn,
          width: "100%",
          padding: "8px 10px",
          background: "rgba(255,255,255,0.75)",
          color: "#241e1c",
          border: "1px dashed rgba(36,30,28,0.3)",
        }}
      >
        + Add photo{photos.length >= 1 ? " (becomes a slideshow)" : ""}
      </button>
    </div>
  );
}
