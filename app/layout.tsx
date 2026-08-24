import type { Metadata } from "next";
import { tasaOrbiter } from "./fonts";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Design Concept] Real Numbers — Financial Clarity for Growing Companies",
  description:
    "Real Numbers helps startups and technology companies turn financial complexity into clear decisions, scalable planning and confident growth.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={tasaOrbiter.variable}>
      <body>
        <Preloader />
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
