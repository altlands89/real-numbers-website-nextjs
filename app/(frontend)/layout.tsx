import type { Metadata } from "next";
import { tasaOrbiter } from "./fonts";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/Preloader";
import { getCMS } from "@/lib/payload";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Design Concept] Real Numbers | Financial Clarity for Growing Companies",
  description:
    "Real Numbers helps startups and technology companies turn financial complexity into clear decisions, scalable planning and confident growth.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getCMS();
  const tokens = await payload.findGlobal({ slug: "design-tokens" });
  const c = tokens.colors;

  // Overrides the brand palette defined in globals.css — editable live from
  // /admin (Design Tokens global) without a redeploy. Falls back silently
  // to the stylesheet's own defaults if a field is somehow empty.
  const cssVars = c
    ? `:root{${[
        c.black && `--black:${c.black} !important;`,
        c.offwhite && `--offwhite:${c.offwhite} !important;`,
        c.red && `--red:${c.red} !important;`,
        c.redDark && `--red-dark:${c.redDark} !important;`,
        c.blue && `--blue:${c.blue} !important;`,
        c.blueDark && `--blue-dark:${c.blueDark} !important;`,
        c.stone && `--stone:${c.stone} !important;`,
        c.horizon && `--horizon:${c.horizon} !important;`,
        c.jet && `--jet:${c.jet} !important;`,
      ]
        .filter(Boolean)
        .join("")}}`
    : "";

  return (
    <html lang="en" className={tasaOrbiter.variable}>
      {cssVars && (
        <head>
          <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        </head>
      )}
      <body>
        <Preloader />
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
