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
  },
};

export default nextConfig;
