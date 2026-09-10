import React from "react";

// Reuses the same abstract composition line-art the live site uses as a
// low-opacity decorative texture (.v2-bg-cover--comp in globals.css) — ties
// the login screen to the same brand system instead of a bare white page.
// Rendered only via admin.components.beforeLogin, so this never appears
// anywhere but the login screen.
export function AdminLoginBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundImage: "url(/compositions/comp-16.svg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "min(70vw, 900px)",
        opacity: 0.06,
        pointerEvents: "none",
      }}
    />
  );
}
