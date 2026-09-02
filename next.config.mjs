import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Brand composition SVGs are used as next/image sources (e.g. StatsV2's
    // photo slots) — Next blocks local SVG optimization by default since
    // they can carry inline scripts; safe here since these are our own
    // trusted static assets, not user uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Payload-uploaded media (team photos, replaced logos/photography)
    // lives in Vercel Blob, one public hostname per Blob store.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
