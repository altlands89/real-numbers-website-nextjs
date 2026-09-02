/** One-off: wipe seeded content so seed.ts can re-run cleanly after a config change. */
import { getPayload } from "payload";
import config from "../payload.config";

async function run() {
  const payload = await getPayload({ config });

  // Clear every Media relationship first — the home page's slideshow array
  // has a required image field, which would otherwise violate a NOT NULL
  // constraint when the referenced Media doc is deleted.
  await payload.updateGlobal({ slug: "home", data: { featuredPhoto: { images: [] } } });
  await payload.updateGlobal({ slug: "about-page", data: { ourStory: { photos: [] } } });
  await payload.updateGlobal({ slug: "why-real-numbers-page", data: { whatMakesDifferent: { photos: [] } } });
  await payload.updateGlobal({ slug: "our-expertise-page", data: { integrated: { photos: [] } } });
  await payload.updateGlobal({ slug: "use-cases-page", data: { atmospherePhotos: [] } });
  await payload.updateGlobal({ slug: "questions-founders-ask-page", data: { atmospherePhotos: [] } });
  await payload.updateGlobal({ slug: "branding", data: { headerLogo: null, footerLogo: null } });

  for (const collection of ["team-members", "testimonials", "faq-items", "client-logos", "media"] as const) {
    const { docs } = await payload.find({ collection, limit: 1000 });
    for (const doc of docs) {
      await payload.delete({ collection, id: doc.id });
    }
    console.log(`Cleared ${collection}: ${docs.length}`);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
