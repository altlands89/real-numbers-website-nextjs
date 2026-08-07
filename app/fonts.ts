import localFont from "next/font/local";

// TASA Orbiter — brand typeface, self-hosted via next/font for automatic
// optimization (subsetting, preload, no layout shift).
export const tasaOrbiter = localFont({
  src: [
    {
      path: "../public/fonts/TASAOrbiter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TASAOrbiter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/TASAOrbiter-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/TASAOrbiter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/TASAOrbiter-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-tasa",
  display: "swap",
});
