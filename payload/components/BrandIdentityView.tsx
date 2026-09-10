import React from "react";
import { redirect } from "next/navigation";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { getCMS } from "@/lib/payload";
import { BRAND_ASSET_CATEGORIES } from "@/payload/collections/BrandAssets";
import type { BrandAsset } from "@/payload/payload-types";
import { ICON_ANIMATIONS, ANIMATION_KEYFRAMES } from "@/payload/brand-icon-animations";

// Minimal slice of Payload's AdminViewServerProps — the fields
// DefaultTemplate needs to render the standard admin shell (sidebar nav,
// header) around this custom view. Confirmed against Root/index.js's
// actual RenderServerComponent call (the ServerProps type from `payload`
// is a general shape, not what's really sent here): only `i18n`,
// `payload`, `params`, and `searchParams` are top-level — `permissions`,
// `locale`, `visibleEntities`, and the request/user live nested under
// `initPageResult`, which is why an earlier version of this component
// crashed reading `visibleEntities.collections` off `undefined`.
type BrandIdentityViewProps = {
  i18n: unknown;
  initPageResult?: {
    locale?: unknown;
    permissions?: unknown;
    req?: { user?: unknown };
    visibleEntities?: { collections: string[]; globals: string[] };
  };
  params?: Record<string, string | string[] | undefined>;
  payload: unknown;
  searchParams?: Record<string, string | string[] | undefined>;
};

// Custom top-level admin view (registered at /admin/brand-identity via
// payload.config.ts's admin.components.views). A living one-pager
// reference for Real Numbers' brand identity — colors, typography, logo
// marks, iconography, numerals, photography, and voice/messaging — built
// from the same assets and content already live on the site, not a
// separate document that can drift out of sync. Colors are fetched live
// from the `design-tokens` Global so this page always reflects whatever
// an editor last saved there.

const COLOR_FIELDS: { key: string; label: string }[] = [
  { key: "black", label: "Black" },
  { key: "offwhite", label: "Off-white" },
  { key: "white", label: "White" },
  { key: "red", label: "Red" },
  { key: "redDark", label: "Red — Dark" },
  { key: "blue", label: "Blue" },
  { key: "blueDark", label: "Blue — Dark" },
  { key: "stone", label: "Stone" },
  { key: "horizon", label: "Horizon" },
  { key: "clay", label: "Clay" },
  { key: "jet", label: "Jet" },
];

const VOICE_PILLARS = [
  { title: "Clarity", text: "Know where your business really stands." },
  { title: "Confidence", text: "Decide on insight, not assumption." },
  { title: "Growth", text: "Build financial foundations that scale with your ambition." },
  { title: "Visibility", text: "See the full picture before your next move." },
];

const ICON_COUNT = 48;
const DIGITS = Array.from({ length: 10 }, (_, i) => i);
const COMPOSITION_PREVIEW_COUNT = 6;

const DIGIT_STYLES: { prefix: string; label: string }[] = [
  { prefix: "digit", label: "Outline" },
  { prefix: "digit-solid", label: "Solid" },
  { prefix: "digit-solid-jet", label: "Solid — Jet" },
  { prefix: "digit-solid-blue", label: "Solid — Blue" },
  { prefix: "digit-solid-red", label: "Solid — Red" },
  { prefix: "digit-solid-horizon", label: "Solid — Horizon" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>{title}</h2>
      {description && (
        <p style={{ margin: "0 0 18px", color: "var(--theme-elevation-600)", maxWidth: 640 }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export async function BrandIdentityView(props: BrandIdentityViewProps) {
  const { i18n, params, payload: adminPayload, searchParams, initPageResult } = props;
  const { locale, permissions, req, visibleEntities } = initPageResult ?? {};
  const user = req?.user;

  // Custom views registered under admin.components.views do NOT inherit
  // Payload's auth gate — unlike /admin/globals/*, an unauthenticated
  // visitor reaches this component directly, and the Local API below
  // bypasses access control by design. Without this check the full brand
  // library (including asset download links) rendered to anyone.
  if (!user) redirect("/admin/login?redirect=%2Fadmin%2Fbrand-identity");

  const payload = await getCMS();
  const [tokens, branding, assetsResult] = await Promise.all([
    payload.findGlobal({ slug: "design-tokens" }),
    payload.findGlobal({ slug: "branding" }),
    payload.find({ collection: "brand-assets", limit: 200, sort: "title" }),
  ]);
  const colors = (tokens?.colors ?? {}) as Record<string, string>;
  const assets = assetsResult.docs as BrandAsset[];
  const assetsByCategory = new Map<string, BrandAsset[]>();
  for (const asset of assets) {
    const list = assetsByCategory.get(asset.category) ?? [];
    list.push(asset);
    assetsByCategory.set(asset.category, list);
  }
  const findAsset = (title: string) => assets.find((a) => a.title === title);
  const iconPacks = {
    static: findAsset("Icon Set — Static SVG (as shown)"),
    animatedSvg: findAsset("Icon Set — Animated SVG Pack"),
    animatedGif: findAsset("Icon Set — Animated GIF Pack (Transparent)"),
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DefaultTemplate
      {...({ i18n, locale, params, payload: adminPayload, permissions, searchParams, user, visibleEntities } as any)}
    >
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 32px 80px" }}>
      {/* Scoped @font-face so the specimen below renders in the real
          brand typeface, without touching the admin app's own fonts. */}
      <style>{`
        @font-face { font-family: "TASA Orbiter Specimen"; src: url("/fonts/TASAOrbiter-Regular.ttf") format("truetype"); font-weight: 400; }
        @font-face { font-family: "TASA Orbiter Specimen"; src: url("/fonts/TASAOrbiter-Medium.ttf") format("truetype"); font-weight: 500; }
        @font-face { font-family: "TASA Orbiter Specimen"; src: url("/fonts/TASAOrbiter-SemiBold.ttf") format("truetype"); font-weight: 600; }
        @font-face { font-family: "TASA Orbiter Specimen"; src: url("/fonts/TASAOrbiter-Bold.ttf") format("truetype"); font-weight: 700; }
        @font-face { font-family: "TASA Orbiter Specimen"; src: url("/fonts/TASAOrbiter-ExtraBold.ttf") format("truetype"); font-weight: 800; }
        ${Object.entries(ANIMATION_KEYFRAMES)
          .map(([name, body]) => `@keyframes icon-anim-${name}{${body}}`)
          .join("\n")}
        .brand-icon-tile { transform-origin: center; }
        @media (prefers-reduced-motion: no-preference) {
          ${Object.keys(ANIMATION_KEYFRAMES)
            .map((name) => `.brand-icon-anim-${name}{animation:icon-anim-${name} 4s ease-in-out infinite;}`)
            .join("\n")}
        }
      `}</style>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          marginBottom: 48,
          padding: "36px 32px",
          borderRadius: "var(--style-radius-m, 8px)",
          background: colors.blue || "#353e5b",
          color: colors.offwhite || "#f0efe8",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url(/compositions/comp-16.svg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right -80px top -80px",
            backgroundSize: "480px",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ margin: "0 0 8px", opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12 }}>
            Brand Identity &amp; Design Assets
          </p>
          <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 800, fontFamily: '"TASA Orbiter Specimen", sans-serif' }}>
            Real Numbers. Real Clarity. Real Confidence.
          </h1>
          <p style={{ margin: 0, maxWidth: 560, opacity: 0.85 }}>
            A single reference for everything that makes Real Numbers look and sound like Real
            Numbers — colors, type, logo marks, icons, numerals, photography, and voice. Pulled
            live from the site&apos;s own design system, not a separate document that can drift
            out of date.
          </p>
        </div>
      </div>

      {/* Downloads */}
      <Section
        title="Downloads"
        description="Every brand file, organized by type and ready to download — logo packs, icons, numerals, fonts, templates, and more. Add or replace files any time via Site Design → Brand Assets."
      >
        {assets.length === 0 ? (
          <p style={{ color: "var(--theme-elevation-600)" }}>
            No files uploaded yet. Add some in{" "}
            <a href="/admin/collections/brand-assets/create">Site Design → Brand Assets</a>.
          </p>
        ) : (
          BRAND_ASSET_CATEGORIES.filter((c) => assetsByCategory.has(c.value)).map((cat) => (
            <div key={cat.value} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 8px", color: "var(--theme-elevation-700)" }}>
                {cat.label}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
                {(assetsByCategory.get(cat.value) ?? []).map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.url ?? "#"}
                    download
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: "var(--style-radius-m, 8px)",
                      border: "1px solid var(--theme-elevation-150)",
                      background: "var(--theme-elevation-0)",
                      color: "var(--theme-text)",
                      textDecoration: "none",
                    }}
                  >
                    <span>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{asset.title}</div>
                      {asset.description && (
                        <div style={{ fontSize: 11, color: "var(--theme-elevation-500)" }}>{asset.description}</div>
                      )}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--theme-elevation-500)", whiteSpace: "nowrap" }}>
                      ↓ {formatBytes(asset.filesize)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </Section>

      {/* Logo & marks */}
      <Section
        title="Logo & Marks"
        description="Primary wordmark for light and dark backgrounds, plus the symbol mark used standalone (favicon, admin nav, small spaces)."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          <LogoCard bg="#f0efe8" src="/img/logo-black.svg" label="Wordmark — on light" />
          <LogoCard bg="#241e1c" src="/img/logo-offwhite.svg" label="Wordmark — on dark" />
          <LogoCard bg="#f0efe8" src="/img/symbol-red.svg" label="Symbol — red" small />
          <LogoCard bg="#f0efe8" src="/img/symbol-blue.svg" label="Symbol — blue" small />
          <LogoCard bg="#241e1c" src="/img/symbol-offwhite.svg" label="Symbol — off-white" small />
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: "var(--theme-elevation-600)" }}>
          The self-animating wordmark (<code>/img/logo-counter-animation.svg</code>) is used as
          the site&apos;s page preloader. Header/footer logo files are managed in{" "}
          <a href="/admin/globals/branding">Site Design → Logo</a>
          {branding?.footerCopyright ? ` — footer line: "${branding.footerCopyright}"` : ""}.
        </p>
      </Section>

      {/* Color palette */}
      <Section
        title="Color Palette"
        description="The 11 brand colors, live from Site Design → Colors. Edit them there — this page always reflects the current values."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {COLOR_FIELDS.map(({ key, label }) => {
            const hex = colors[key] || "#cccccc";
            const isLight = ["offwhite", "white", "stone", "clay"].includes(key);
            return (
              <div
                key={key}
                style={{
                  borderRadius: "var(--style-radius-m, 8px)",
                  overflow: "hidden",
                  border: "1px solid var(--theme-elevation-150)",
                }}
              >
                <div style={{ height: 64, background: hex }} />
                <div style={{ padding: "8px 10px", background: "var(--theme-elevation-0)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "var(--theme-elevation-600)", fontFamily: "monospace" }}>
                    {hex}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Typography */}
      <Section
        title="Typography"
        description="TASA Orbiter, self-hosted. Every heading/paragraph on the site runs through 6 shared style roles (H1, H2, H3, Eyebrow, Lede, Body) — tunable in Site Design → Typography, not set per-field."
      >
        <div
          style={{
            padding: "24px 28px",
            borderRadius: "var(--style-radius-m, 8px)",
            border: "1px solid var(--theme-elevation-150)",
            background: "var(--theme-elevation-0)",
          }}
        >
          <div style={{ fontFamily: '"TASA Orbiter Specimen", sans-serif', fontWeight: 800, fontSize: 34, marginBottom: 4 }}>
            Real Numbers
          </div>
          <div style={{ fontFamily: '"TASA Orbiter Specimen", sans-serif', fontWeight: 400, fontSize: 15, color: "var(--theme-elevation-600)", marginBottom: 18 }}>
            Financial clarity for growing companies.
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {[400, 500, 600, 700, 800].map((weight) => (
              <div key={weight} style={{ fontFamily: '"TASA Orbiter Specimen", sans-serif', fontWeight: weight, fontSize: 16 }}>
                Aa {weight}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Iconography */}
      <Section
        title="Iconography"
        description={`The full 48-icon brand set (solid style, blue), each with its own 4s looping animation. Click any icon to download it on its own. Files at /icons/brand/RN_ICON_BLUE_1.svg … _${ICON_COUNT}.svg.`}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {(iconPacks.static || iconPacks.animatedSvg || iconPacks.animatedGif) ? (
            <>
              {iconPacks.static && <DownloadPillButton href={iconPacks.static.url} label="↓ Download all — Static SVG" />}
              {iconPacks.animatedSvg && <DownloadPillButton href={iconPacks.animatedSvg.url} label="↓ Download all — Animated SVG" />}
              {iconPacks.animatedGif && <DownloadPillButton href={iconPacks.animatedGif.url} label="↓ Download all — Animated GIF (transparent)" />}
            </>
          ) : (
            <p style={{ fontSize: 12, color: "var(--theme-elevation-500)" }}>
              Bulk download packs not generated yet — run <code>payload/build-icon-download-packs.ts</code>.
            </p>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))", gap: 8 }}>
          {Array.from({ length: ICON_COUNT }, (_, i) => i + 1).map((n) => {
            const recipe = ICON_ANIMATIONS[n] ?? "pulse";
            return (
              <a
                key={n}
                href={`/icons/brand/RN_ICON_BLUE_${n}.svg`}
                download={`RN-Icon-${n}.svg`}
                title={`Icon ${n} — click to download`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1",
                  borderRadius: "var(--style-radius-s, 4px)",
                  border: "1px solid var(--theme-elevation-150)",
                  background: "var(--theme-elevation-0)",
                  cursor: "pointer",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/icons/brand/RN_ICON_BLUE_${n}.svg`}
                  alt=""
                  className={`brand-icon-tile brand-icon-anim-${recipe}`}
                  style={{ width: 20, height: 20 }}
                />
              </a>
            );
          })}
        </div>
      </Section>

      {/* Numerals */}
      <Section
        title="Numerals"
        description="Digit badges used for stat counters and numbered lists — every style and color variant that exists in the brand set."
      >
        {DIGIT_STYLES.map(({ prefix, label }) => (
          <div key={prefix} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "var(--theme-elevation-600)" }}>{label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DIGITS.map((d) => (
                <a
                  key={d}
                  href={`/img/digits/${prefix}-${d}.svg`}
                  download={`RN-${prefix}-${d}.svg`}
                  style={{
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--style-radius-m, 8px)",
                    border: "1px solid var(--theme-elevation-150)",
                    background: "var(--theme-elevation-0)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/img/digits/${prefix}-${d}.svg`} alt={String(d)} style={{ width: 24, height: 24 }} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* Compositions */}
      <Section
        title="Abstract Compositions"
        description="Line-art SVG compositions used as animated decorative texture behind nearly every section (see CompositionDrift.tsx). A sample of the set — full library in /compositions/."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {Array.from({ length: COMPOSITION_PREVIEW_COUNT }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              style={{
                aspectRatio: "1",
                borderRadius: "var(--style-radius-m, 8px)",
                border: "1px solid var(--theme-elevation-150)",
                background: colors.offwhite || "#f0efe8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/compositions/comp-${n}.svg`}
                alt=""
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Photography */}
      <Section
        title="Photography"
        description="Brand photography used across atmosphere/mood spots and hero backgrounds. Full-res originals live in the Drive brand folder; these are the processed site versions."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {[
            "home-hero-atmosphere",
            "home-momentum",
            "about-atmosphere",
            "why-hero",
            "expertise-atmosphere",
            "team-hero",
            "usecases-atmosphere",
            "faq-atmosphere",
            "contact-hero",
            "moment-lobby",
            "moment-strategy",
            "home-final-cta",
          ].map((name) => (
            <div
              key={name}
              style={{
                aspectRatio: "4/3",
                borderRadius: "var(--style-radius-m, 8px)",
                overflow: "hidden",
                border: "1px solid var(--theme-elevation-150)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/img/photography/${name}.jpg`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Voice & messaging */}
      <Section
        title="Voice & Messaging"
        description="Pulled from the approved website copy — the recurring language and pillars that define how Real Numbers talks, not a separate style guide invented after the fact."
      >
        <div
          style={{
            padding: "24px 28px",
            marginBottom: 16,
            borderRadius: "var(--style-radius-m, 8px)",
            background: colors.black || "#241e1c",
            color: colors.offwhite || "#f0efe8",
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
            Tagline
          </p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: '"TASA Orbiter Specimen", sans-serif' }}>
            Real Numbers. Real Clarity. Real Confidence.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
          {VOICE_PILLARS.map((p) => (
            <div
              key={p.title}
              style={{
                padding: "14px 16px",
                borderRadius: "var(--style-radius-m, 8px)",
                border: "1px solid var(--theme-elevation-150)",
                background: "var(--theme-elevation-0)",
              }}
            >
              <div style={{ fontWeight: 700, color: colors.red || "#b85840", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: "var(--theme-elevation-600)" }}>{p.text}</div>
            </div>
          ))}
        </div>

        <ul style={{ margin: "0 0 16px", paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
          <li>Direct and confident, never corporate-jargon-heavy — short declarative sentences over hedged ones.</li>
          <li>Speaks to leadership, not accountants: the value is the decision a number enables, not the report itself.</li>
          <li>&quot;We don&apos;t manage numbers. We help leaders make better decisions.&quot; is the closest thing to a mission line.</li>
          <li>Partnership language throughout (&quot;partner,&quot; &quot;alongside,&quot; &quot;together&quot;) — never &quot;vendor&quot; or &quot;service provider.&quot;</li>
        </ul>

        <blockquote
          style={{
            margin: 0,
            padding: "16px 20px",
            borderLeft: `3px solid ${colors.red || "#b85840"}`,
            fontStyle: "italic",
            color: "var(--theme-elevation-600)",
          }}
        >
          &quot;Real Numbers. Built on trust. Driven by clarity. Focused on growth.&quot; — closing
          manifesto, Contact page.
        </blockquote>
      </Section>

      <p style={{ fontSize: 12, color: "var(--theme-elevation-500)", borderTop: "1px solid var(--theme-elevation-150)", paddingTop: 16 }}>
        Source assets: this repo&apos;s <code>public/</code> folder, live values from Site
        Design, and the approved &quot;Real Numbers — Website Copy (Final)&quot; document. Full-res
        originals, fonts, and print materials live in the Drive brand folder (REAL NUMBERS
        BRANDING / BRAND ELEMENTS).
      </p>
    </div>
    </DefaultTemplate>
  );
}

function DownloadPillButton({ href, label }: { href?: string | null; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      download
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 14px",
        borderRadius: "var(--style-radius-pill, 999px)",
        border: "1px solid var(--theme-elevation-150)",
        background: "var(--theme-elevation-0)",
        color: "var(--theme-text)",
        textDecoration: "none",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </a>
  );
}

function LogoCard({ bg, src, label, small }: { bg: string; src: string; label: string; small?: boolean }) {
  return (
    <div style={{ borderRadius: "var(--style-radius-m, 8px)", overflow: "hidden", border: "1px solid var(--theme-elevation-150)" }}>
      <div style={{ background: bg, height: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} style={{ maxWidth: small ? "40%" : "80%", maxHeight: "70%" }} />
      </div>
      <div style={{ padding: "8px 10px", fontSize: 12, fontWeight: 600, background: "var(--theme-elevation-0)" }}>{label}</div>
    </div>
  );
}
