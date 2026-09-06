"use client";

import { useRouter } from "next/navigation";
import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";

// Pages here are Server Components reading straight from Postgres, not from
// the unsaved in-memory form state — so this can't merge keystroke-by-
// keystroke edits like Payload's client-fetching Live Preview examples do.
// What it does do: as soon as an editor hits Save in the admin's Live
// Preview iframe, this re-fetches the page from the server immediately,
// instead of the editor having to reload the iframe by hand.
export function LivePreviewListener() {
  const router = useRouter();

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={typeof window !== "undefined" ? window.location.origin : ""}
    />
  );
}
