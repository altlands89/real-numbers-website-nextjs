import React from "react";

// Rendered via admin.components.afterNavLinks — Payload's custom `views`
// entries don't get an automatic sidebar link, so this adds one styled to
// match the existing nav-group look (see AdminBrandStyles.tsx's
// `.nav-group` selectors) rather than reusing Payload's internal nav
// classes directly, which aren't a stable public API.
export function BrandIdentityNav() {
  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--theme-elevation-500)",
          padding: "0 0 6px 6px",
        }}
      >
        Brand
      </div>
      <a
        href="/admin/brand-identity"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 6px",
          borderRadius: "var(--style-radius-s, 4px)",
          color: "var(--theme-text)",
          textDecoration: "none",
          fontSize: 13,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/brand/RN_ICON_BLUE_9.svg" alt="" aria-hidden="true" style={{ width: 16, height: 16, opacity: 0.65 }} />
        Brand Identity
      </a>
    </div>
  );
}
