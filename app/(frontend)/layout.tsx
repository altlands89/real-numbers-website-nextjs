import type { Metadata } from "next";
import { tasaOrbiter } from "./fonts";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/Preloader";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import EditorBridgeListener from "@/components/EditorBridgeListener";
import { getCMS } from "@/lib/payload";
import { buildRootMetadata } from "@/lib/site-metadata";
import "./globals.css";

const FALLBACK_METADATA = {
  title: "[Design Concept] Real Numbers | Financial Clarity for Growing Companies",
  description:
    "Real Numbers helps startups and technology companies turn financial complexity into clear decisions, scalable planning and confident growth.",
};

// Dynamic (not a static `export const metadata`) so the favicon and
// search-engine indexing toggle — both editable from Site Design → SEO &
// Site Info — take effect without a redeploy, same as every other
// admin-driven value on this site.
export async function generateMetadata(): Promise<Metadata> {
  const root = await buildRootMetadata();
  return { ...FALLBACK_METADATA, ...root };
}

// sizeScale is a 1–5 dropdown (1 = smallest, 3 = the site's current
// default, 5 = largest) — mapped to a multiplier applied on top of the
// existing responsive clamp() sizing, so text stays fluid across screen
// sizes no matter which step is chosen.
const SIZE_SCALE_MULTIPLIER: Record<string, number> = {
  "1": 0.75,
  "2": 0.875,
  "3": 1,
  "4": 1.15,
  "5": 1.35,
};

type TypeStyle = {
  sizeScale?: string | null;
  lineHeight?: number | null;
  letterSpacing?: number | null;
  weight?: string | null;
} | null | undefined;

function typeVars(role: string, style: TypeStyle): string[] {
  if (!style) return [];
  const scale = style.sizeScale ? SIZE_SCALE_MULTIPLIER[style.sizeScale] : undefined;
  return [
    scale !== undefined && `--type-${role}-scale:${scale} !important;`,
    style.lineHeight != null && `--type-${role}-line-height:${style.lineHeight} !important;`,
    style.letterSpacing != null && `--type-${role}-letter-spacing:${style.letterSpacing}em !important;`,
    style.weight && `--type-${role}-weight:${style.weight} !important;`,
  ].filter((v): v is string => Boolean(v));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getCMS();
  const [tokens, typography, layoutMotion] = await Promise.all([
    payload.findGlobal({ slug: "design-tokens" }),
    payload.findGlobal({ slug: "typography" }),
    payload.findGlobal({ slug: "layout-motion" }),
  ]);
  const c = tokens.colors;

  const colorVars = c
    ? [
        c.black && `--black:${c.black} !important;`,
        c.offwhite && `--offwhite:${c.offwhite} !important;`,
        c.white && `--white:${c.white} !important;`,
        c.red && `--red:${c.red} !important;`,
        c.redDark && `--red-dark:${c.redDark} !important;`,
        c.blue && `--blue:${c.blue} !important;`,
        c.blueDark && `--blue-dark:${c.blueDark} !important;`,
        c.stone && `--stone:${c.stone} !important;`,
        c.horizon && `--horizon:${c.horizon} !important;`,
        c.clay && `--clay:${c.clay} !important;`,
        c.jet && `--jet:${c.jet} !important;`,
      ].filter((v): v is string => Boolean(v))
    : [];

  const typographyVars = [
    ...typeVars("h1", typography.h1),
    ...typeVars("h2", typography.h2),
    ...typeVars("h3", typography.h3),
    ...typeVars("eyebrow", typography.eyebrow),
    ...typeVars("lede", typography.lede),
    ...typeVars("body", typography.body),
  ];

  const layoutVars = [
    layoutMotion.containerWidth && `--max:${layoutMotion.containerWidth}% !important;`,
    layoutMotion.cornerRoundness && `--roundness-scale:${Number(layoutMotion.cornerRoundness) / 100} !important;`,
    layoutMotion.spacingDensity && `--density-scale:${Number(layoutMotion.spacingDensity) / 100} !important;`,
    layoutMotion.motionSpeed && `--motion-scale:${Number(layoutMotion.motionSpeed) / 100} !important;`,
  ].filter((v): v is string => Boolean(v));

  const allVars = [...colorVars, ...typographyVars, ...layoutVars];
  // Overrides the design system defined in globals.css — editable live from
  // /admin (Site Design section) without a redeploy. Falls back silently to
  // the stylesheet's own defaults if a field is somehow empty.
  const cssVars = allVars.length ? `:root{${allVars.join("")}}` : "";

  return (
    <html lang="en" className={tasaOrbiter.variable}>
      {cssVars && (
        <head>
          <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        </head>
      )}
      <body>
        <LivePreviewListener />
        <EditorBridgeListener />
        <Preloader />
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
