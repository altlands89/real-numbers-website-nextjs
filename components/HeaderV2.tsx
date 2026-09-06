import { getCMS } from "@/lib/payload";
import HeaderV2Client from "./HeaderV2Client";

export default async function HeaderV2() {
  const payload = await getCMS();
  const branding = await payload.findGlobal({ slug: "branding" });
  const headerLogo = branding.headerLogo && typeof branding.headerLogo === "object" ? branding.headerLogo : null;

  return (
    <HeaderV2Client
      logoSrc={headerLogo?.url || "/img/logo-black.svg"}
      logoAlt={headerLogo?.alt || "Real Numbers"}
    />
  );
}
