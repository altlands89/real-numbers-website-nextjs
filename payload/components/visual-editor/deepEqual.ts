/** Structural equality for the small, plain-JSON editor documents these
 *  hooks manage (page content, mobile overrides, roster/FAQ arrays) — good
 *  enough here because nothing in these documents is a Date/Map/Set/etc,
 *  and cheap enough because a single page's content is a few KB at most.
 *  Used to tell a real edit apart from a no-op (a drag-reorder dropped back
 *  in its own slot, a field-commit for a path that didn't match anything)
 *  so "Publish changes" only ever lights up for an actual difference — see
 *  useCloneState.ts / useMobileOverrides.ts. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  return JSON.stringify(a) === JSON.stringify(b);
}
