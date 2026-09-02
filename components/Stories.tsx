import { getCMS } from "@/lib/payload";
import StoriesClient from "./StoriesClient";

export default async function Stories() {
  const payload = await getCMS();
  const [home, testimonials] = await Promise.all([
    payload.findGlobal({ slug: "home" }),
    payload.find({ collection: "testimonials", sort: "order", limit: 50 }),
  ]);

  return (
    <StoriesClient
      eyebrow={home.stories?.eyebrow || "Client Stories"}
      heading={home.stories?.heading || ""}
      stories={testimonials.docs.map((t) => ({ quote: t.quote, name: t.name, role: t.role || "" }))}
    />
  );
}
