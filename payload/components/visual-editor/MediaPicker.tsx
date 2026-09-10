"use client";

import React, { useRef, useState } from "react";
import { type MediaItem, photoBtn } from "./shared";
import { uploadMedia } from "./uploadMediaAction";

/** Picks an existing image from the Media library, or uploads a brand-new
 *  one directly from this modal — no need to leave the visual editor and
 *  go through the regular Media admin screen first. A freshly uploaded
 *  file is auto-selected (via `onSelect`) and handed back to the caller
 *  (via `onUpload`) so it can be added to the picker's own known-media
 *  list, since the library it was given on page load obviously doesn't
 *  include it yet. Shared by every page's visual editor. */
export function MediaPicker({
  library,
  onSelect,
  onUpload,
  onClose,
}: {
  library: MediaItem[];
  onSelect: (id: number) => void;
  onUpload: (item: MediaItem) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filtered = query
    ? library.filter((m) => `${m.alt} ${m.filename}`.toLowerCase().includes(query.toLowerCase()))
    : library;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadMedia(formData);
      if (!result.ok) throw new Error(result.error);
      onUpload(result.item);
      onSelect(result.item.id);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Choose an image"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        style={{
          background: "var(--theme-elevation-0)",
          borderRadius: "var(--style-radius-m, 8px)",
          border: "1px solid var(--theme-elevation-150)",
          width: "min(840px, 100%)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--theme-elevation-150)", display: "flex", gap: 12, alignItems: "center" }}>
          <strong style={{ fontSize: 14 }}>Choose an image</strong>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            style={{
              flex: 1,
              padding: "6px 10px",
              borderRadius: "var(--style-radius-s, 4px)",
              border: "1px solid var(--theme-elevation-200)",
              background: "var(--theme-input-bg, transparent)",
              color: "var(--theme-text)",
              fontSize: 13,
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              ...photoBtn,
              background: "var(--theme-success-500)",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              fontSize: 12,
              cursor: uploading ? "default" : "pointer",
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? "Uploading…" : "+ Upload new"}
          </button>
          <button type="button" onClick={onClose} style={{ ...photoBtn, background: "var(--theme-elevation-100)", color: "var(--theme-text)", border: "1px solid var(--theme-elevation-200)" }}>
            Close
          </button>
        </div>
        {uploadError && (
          <div style={{ padding: "8px 16px", background: "rgba(184,88,64,0.10)", color: "var(--theme-text)", fontSize: 12 }}>
            ⚠ {uploadError}
          </div>
        )}
        <div style={{ overflowY: "auto", padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              title={m.alt || m.filename}
              style={{
                padding: 0,
                border: "1px solid var(--theme-elevation-150)",
                borderRadius: 6,
                overflow: "hidden",
                background: "var(--theme-elevation-50)",
                cursor: "pointer",
                display: "block",
                // Explicit, not auto: this button is a CSS Grid item in
                // an auto-row-sized grid, and its *own* height kept
                // resolving to ~19px — just its label's height, as if its
                // image child (130px, even with a plain fixed pixel
                // height, no percentage/aspect-ratio involved) weren't
                // there at all — confirmed by walking the live ancestor
                // chain and reading each element's actual rect, not
                // guessed or assumed from a screenshot. With
                // `overflow: hidden` that silently clipped almost the
                // entire thumbnail to a sliver. However that auto-sizing
                // pass is going wrong, giving the button a height that
                // isn't computed at all removes the ambiguity outright.
                height: 160,
              }}
            >
              {/* object-fit:contain rather than cover: most of the media
                  library is roughly-square product/icon shots, and
                  cover-cropping those into a wide landscape box was
                  cutting most of the actual subject off, leaving a thin
                  sliver that read as a broken thumbnail — this is a
                  picker meant to help recognize a file, not a crop
                  preview, so showing the whole image (letterboxed if
                  needed) is the right default here. */}
              <span
                style={{
                  display: "block",
                  width: "100%",
                  height: 130,
                  background: "var(--theme-elevation-100)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              </span>
              <span style={{ fontSize: 10, padding: "6px 8px", color: "var(--theme-elevation-600)", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.alt || m.filename}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ gridColumn: "1 / -1", fontSize: 13, color: "var(--theme-elevation-600)", margin: 0 }}>
              No images match “{query}”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
