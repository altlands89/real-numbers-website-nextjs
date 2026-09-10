"use client";

/** A single, shared `requestAnimationFrame` loop that multiple animated
 *  components ride instead of each running its own.
 *
 *  CompositionDrift mounts up to six independent instances on one page
 *  (three in the hero backdrop alone, plus one each in the CTA, audience,
 *  and stories sections) — six separate rAF callbacks, each doing its own
 *  per-path trig and direct style writes every frame, is real overhead on
 *  a mobile CPU. iOS Safari in particular has to share that same main
 *  thread with its own scroll compositing, so the more independently-
 *  scheduled JS callbacks are competing for a frame, the more likely any
 *  one of them is to get delayed or dropped — this is a real contributor
 *  to animations reading as janky/stuttery specifically on iPhone.
 *  Coordinating them under one `requestAnimationFrame` call doesn't
 *  change what any individual component animates or how, just how many
 *  separate browser scheduling slots the work costs.
 *
 *  The loop itself only exists while at least one listener is
 *  subscribed — mounting zero animated components costs nothing, same as
 *  before. */

type Listener = (now: number) => void;

const listeners = new Set<Listener>();
let rafId: number | null = null;

function tick(now: number) {
  listeners.forEach((fn) => fn(now));
  rafId = requestAnimationFrame(tick);
}

export function subscribeToAnimationLoop(fn: Listener): () => void {
  listeners.add(fn);
  if (rafId === null) {
    rafId = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
