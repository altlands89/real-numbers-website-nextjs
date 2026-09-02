import React from "react";
import type { ServerProps } from "payload";
import { getSiteUrl } from "@/lib/site-url";

// Icon numbers match AdminBrandStyles.tsx's NAV_ICONS mapping for the same
// pages, so the sidebar and this dashboard grid stay visually consistent.
const PAGE_LINKS = [
  { label: "Home", slug: "home", icon: 42 },
  { label: "About", slug: "about-page", icon: 15 },
  { label: "Team", slug: "team-page", icon: 31 },
  { label: "Why Real Numbers", slug: "why-real-numbers-page", icon: 27 },
  { label: "Our Expertise", slug: "our-expertise-page", icon: 25 },
  { label: "Use Cases", slug: "use-cases-page", icon: 36 },
  { label: "Questions Founders Ask", slug: "questions-founders-ask-page", icon: 32 },
  { label: "Contact", slug: "contact-page", icon: 14 },
];

// Rendered above Payload's own collections/globals grid via
// admin.components.beforeDashboard — additive, doesn't replace anything.
// Gives a non-technical editor a friendly landing spot instead of a bare
// grid of internal collection names: a greeting, one-click jumps to the
// 8 content pages, and a way to see the actual live site.
export function AdminDashboardWelcome({ user }: ServerProps) {
  const firstName = user?.email ? user.email.split("@")[0] : undefined;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        marginBottom: "var(--base, 20px)",
        padding: "28px 32px",
        borderRadius: "var(--style-radius-m, 8px)",
        border: "1px solid var(--theme-elevation-150)",
        background: "var(--theme-elevation-50)",
      }}
    >
      {/* Same abstract composition line-art the live site uses as texture
          (.v2-bg-cover--comp) — ties this card to the same brand system
          instead of a plain gray box. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url(/compositions/comp-16.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right -60px top -60px",
          backgroundSize: "420px",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22 }}>
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h2>
        <p style={{ margin: "0 0 20px", color: "var(--theme-elevation-600)" }}>
          Jump straight to a page to edit, or see what&apos;s live right now.
        </p>

        <a
          href={getSiteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            marginBottom: 24,
            borderRadius: "var(--style-radius-m, 8px)",
            background: "var(--theme-success-500)",
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          View Live Site ↗
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 10,
          }}
        >
          {PAGE_LINKS.map((page) => (
            <a
              key={page.slug}
              href={`/admin/globals/${page.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: "var(--style-radius-m, 8px)",
                border: "1px solid var(--theme-elevation-150)",
                background: "var(--theme-elevation-0)",
                color: "var(--theme-text)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/icons/brand/RN_ICON_BLUE_${page.icon}.svg`}
                alt=""
                aria-hidden="true"
                style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.6 }}
              />
              {page.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
