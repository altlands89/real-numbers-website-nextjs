"use client";

import { useCallback, useState } from "react";
import type { MediaItem } from "./shared";

/**
 * Tracks which photo slot the in-canvas image picker is choosing for, and
 * resolves an image relation (bare id or populated object) to its URL —
 * shared by every visual editor that has a photo field.
 *
 * `mediaLibrary` is fetched once, server-side, on page load — it doesn't
 * include anything uploaded during this session. `registerUpload` (wired
 * to MediaPicker's `onUpload`) folds a freshly uploaded file into a local
 * list ahead of it, so a newly uploaded photo resolves and renders
 * immediately instead of showing "Missing image" until the next refresh.
 */
export function useMediaPicker(mediaLibrary: MediaItem[]) {
  const [sessionMedia, setSessionMedia] = useState<MediaItem[]>([]);
  const [picking, setPicking] = useState<number | "new" | null>(null);

  const library = sessionMedia.length ? [...sessionMedia, ...mediaLibrary] : mediaLibrary;

  const mediaById = useCallback(
    (id: number | { id: number } | null | undefined) => {
      const key = typeof id === "object" && id ? id.id : id;
      return library.find((m) => m.id === key);
    },
    [library],
  );

  const registerUpload = useCallback((item: MediaItem) => {
    setSessionMedia((prev) => [item, ...prev]);
  }, []);

  return { library, mediaById, picking, setPicking, registerUpload } as const;
}
