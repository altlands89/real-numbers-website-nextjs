import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

// Every page reads Payload content at request time in production (no ISR
// window), but Next still caches the render — so an edit in /admin needs an
// explicit revalidation to show up without a full redeploy. This is a
// low-traffic marketing site, so the simplest safe approach is to
// revalidate every page on any content change, rather than maintain a
// slug-to-page map that will silently go stale as pages change.
const ALL_PATHS = [
  "/",
  "/about",
  "/team",
  "/contact",
  "/why-real-numbers",
  "/our-expertise",
  "/use-cases",
  "/questions-founders-ask",
];

function revalidateAll() {
  for (const path of ALL_PATHS) {
    try {
      revalidatePath(path);
    } catch {
      // revalidatePath only works inside a real Next.js request (e.g. an
      // actual /admin save going through the running server). Standalone
      // scripts using the Local API directly (payload/seed.ts,
      // payload/reset-seed.ts) call these same hooks outside that context —
      // harmless to skip there, since those scripts don't need live-site
      // revalidation anyway.
    }
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = () => {
  revalidateAll();
};

export const revalidateOnDelete: CollectionAfterDeleteHook = () => {
  revalidateAll();
};

export const revalidateGlobalOnChange: GlobalAfterChangeHook = () => {
  revalidateAll();
};
