import React from "react";
import type { ServerProps } from "payload";
import { getSiteUrl } from "@/lib/site-url";

const PAGE_LINKS = [
  { label: "Home", slug: "home" },
  { label: "About", slug: "about-page" },
  { label: "Team", slug: "team-page" },
  { label: "Why Real Numbers", slug: "why-real-numbers-page" },
  { label: "Our Expertise", slug: "our-expertise-page" },
  { label: "Use Cases", slug: "use-cases-page" },
  { label: "Questions Founders Ask", slug: "questions-founders-ask-page" },
  { label: "Contact", slug: "contact-page" },
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
        marginBottom: "var(--base, 20px)",
        padding: "28px 32px",
        borderRadius: "var(--style-radius-m, 8px)",
        border: "1px solid var(--theme-elevation-150)",
        background: "var(--theme-elevation-50)",
      }}
    >
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
              display: "block",
              padding: "12px 16px",
              borderRadius: "var(--style-radius-m, 8px)",
              border: "1px solid var(--theme-elevation-150)",
              background: "var(--theme-elevation-0)",
              color: "var(--theme-text)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {page.label}
          </a>
        ))}
      </div>
    </div>
  );
}
