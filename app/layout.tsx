import type { Metadata } from "next";
import { tasaOrbiter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real Numbers — Financial Clarity for Growing Companies",
  description:
    "Real Numbers helps startups and technology companies turn financial complexity into clear decisions, scalable planning and confident growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={tasaOrbiter.variable}>
      <body>{children}</body>
    </html>
  );
}
