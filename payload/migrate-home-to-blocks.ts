/**
 * One-off: copies the Home global's existing content from its old flat
 * fields (hero, featuredPhoto, logosStrip, difference, ctaDark, audience,
 * stories, divider) into the new `sections` blocks array.
 *
 * Reads via a direct SQL query — HomeGlobal.ts's config already only
 * defines `sections`, so Payload's own Local API no longer surfaces the
 * old columns at all, even though they still exist in the database until
 * the follow-up migration drops them. Writes via the Local API
 * (payload.updateGlobal) so the normal write path — relationship
 * resolution, hooks — runs as usual.
 *
 * Run once against the real dev DB, then verify with a direct SQL query
 * before applying the migration that drops the old columns.
 */
import { getPayload } from "payload";
import { Client } from "pg";
import config from "../payload.config";

async function run() {
  const payload = await getPayload({ config });
  const client = new Client({ connectionString: process.env.DATABASE_URI });
  await client.connect();

  const { rows: homeRows } = await client.query('select * from "home";');
  const home = homeRows[0];
  if (!home) throw new Error("No home row found");

  const { rows: rotatingWords } = await client.query(
    'select "word" from "home_hero_rotating_words" order by "_order";',
  );
  const { rows: featuredImages } = await client.query(
    'select "image_id" from "home_featured_photo_images" order by "_order";',
  );
  const { rows: audienceAreas } = await client.query(
    'select "title", "text" from "home_audience_areas" order by "_order";',
  );

  await client.end();

  const sections = [
    {
      blockType: "hero" as const,
      rotatingWords: rotatingWords.map((w) => ({ word: w.word })),
      description: home.hero_description,
      primaryCtaLabel: home.hero_primary_cta_label,
      secondaryCtaLabel: home.hero_secondary_cta_label,
      featuredPhoto: {
        heading: home.featured_photo_heading,
        ctaLabel: home.featured_photo_cta_label,
        images: featuredImages.map((i) => ({ image: i.image_id })),
      },
      logosStrip: { ctaLabel: home.logos_strip_cta_label },
    },
    { blockType: "diff" as const, heading: home.difference_heading },
    { blockType: "stats" as const },
    ...(home.divider_video_id ? [{ blockType: "divider" as const, video: home.divider_video_id }] : [{ blockType: "divider" as const }]),
    { blockType: "cta" as const, heading: home.cta_dark_heading, ctaLabel: home.cta_dark_cta_label },
    {
      blockType: "audience" as const,
      heading: home.audience_heading,
      areas: audienceAreas.map((a) => ({ title: a.title, text: a.text })),
    },
    { blockType: "stories" as const, eyebrow: home.stories_eyebrow, heading: home.stories_heading },
  ];

  console.log("Writing sections:", JSON.stringify(sections, null, 2));

  const updated = await payload.updateGlobal({ slug: "home", data: { sections } });
  console.log("Updated home. Section count:", updated.sections?.length);

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
