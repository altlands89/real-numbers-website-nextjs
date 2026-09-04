import { getCMS } from "@/lib/payload";
import StoriesClient from "./StoriesClient";
import { ResponsiveText, getOverride } from "./ResponsiveText";

export default async function Stories() {
  const payload = await getCMS();
  const [home, testimonials] = await Promise.all([
    payload.findGlobal({ slug: "home" }),
    payload.find({ collection: "testimonials", sort: "order", limit: 50 }),
  ]);

  const storiesSection = (home.sections ?? []).find((s) => s.blockType === "stories");
  const mo = home.mobileOverrides;
  const sectionKey = storiesSection?.id ?? "stories";

  return (
    <StoriesClient
      eyebrow={
        <ResponsiveText
          desktop={storiesSection?.eyebrow || "Client Stories"}
          mobile={getOverride(mo, `${sectionKey}.eyebrow`)} path={`${sectionKey}.eyebrow`}
        />
      }
      heading={
        <ResponsiveText desktop={storiesSection?.heading || ""} mobile={getOverride(mo, `${sectionKey}.heading`)} path={`${sectionKey}.heading`} />
      }
      stories={testimonials.docs.map((t) => ({ quote: t.quote, name: t.name, role: t.role || "" }))}
    />
  );
}
