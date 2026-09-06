import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Second half of the Home → blocks restructuring, split from the original
// auto-generated migration on purpose (see
// 20260902_115832_add_home_sections_blocks.ts's comment). Only applied
// after payload/migrate-home-to-blocks.ts copied every value from these
// old flat fields into the new `sections` blocks array and that copy was
// verified via direct SQL query against the real dev database (rotating
// words, featured images, audience areas, and every heading/CTA field all
// confirmed to match, plus a live page load rendering identically).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_hero_rotating_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_featured_photo_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_audience_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_hero_rotating_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_featured_photo_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_audience_areas" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_hero_rotating_words" CASCADE;
  DROP TABLE "home_featured_photo_images" CASCADE;
  DROP TABLE "home_audience_areas" CASCADE;
  DROP TABLE "_home_v_version_hero_rotating_words" CASCADE;
  DROP TABLE "_home_v_version_featured_photo_images" CASCADE;
  DROP TABLE "_home_v_version_audience_areas" CASCADE;
  ALTER TABLE "home" DROP CONSTRAINT "home_divider_video_id_media_id_fk";
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_divider_video_id_media_id_fk";
  DROP INDEX "home_divider_divider_video_idx";
  DROP INDEX "_home_v_version_divider_version_divider_video_idx";
  ALTER TABLE "home" DROP COLUMN "hero_description";
  ALTER TABLE "home" DROP COLUMN "hero_primary_cta_label";
  ALTER TABLE "home" DROP COLUMN "hero_secondary_cta_label";
  ALTER TABLE "home" DROP COLUMN "featured_photo_heading";
  ALTER TABLE "home" DROP COLUMN "featured_photo_cta_label";
  ALTER TABLE "home" DROP COLUMN "logos_strip_cta_label";
  ALTER TABLE "home" DROP COLUMN "difference_heading";
  ALTER TABLE "home" DROP COLUMN "divider_video_id";
  ALTER TABLE "home" DROP COLUMN "cta_dark_heading";
  ALTER TABLE "home" DROP COLUMN "cta_dark_cta_label";
  ALTER TABLE "home" DROP COLUMN "audience_heading";
  ALTER TABLE "home" DROP COLUMN "stories_eyebrow";
  ALTER TABLE "home" DROP COLUMN "stories_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_hero_description";
  ALTER TABLE "_home_v" DROP COLUMN "version_hero_primary_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_hero_secondary_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_featured_photo_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_featured_photo_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_logos_strip_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_difference_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_divider_video_id";
  ALTER TABLE "_home_v" DROP COLUMN "version_cta_dark_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_cta_dark_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_audience_heading";
  ALTER TABLE "_home_v" DROP COLUMN "version_stories_eyebrow";
  ALTER TABLE "_home_v" DROP COLUMN "version_stories_heading";`)
}

// Best-effort schema-only rollback: recreates the old columns (nullable,
// no data) so the app doesn't crash on missing columns if this migration
// is reverted, but does NOT restore the actual content — that lived in
// the dropped tables/columns and is gone once this migration's up() runs.
// A real rollback would need re-running an inverse copy from `sections`
// back into these columns, not attempted here since down() is an
// emergency path, not a normal part of this migration's flow.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "home" ADD COLUMN "hero_primary_cta_label" varchar DEFAULT 'Let''s Talk';
  ALTER TABLE "home" ADD COLUMN "hero_secondary_cta_label" varchar DEFAULT 'Our Expertise';
  ALTER TABLE "home" ADD COLUMN "featured_photo_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "featured_photo_cta_label" varchar DEFAULT 'Our approach';
  ALTER TABLE "home" ADD COLUMN "logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers';
  ALTER TABLE "home" ADD COLUMN "difference_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "divider_video_id" integer;
  ALTER TABLE "home" ADD COLUMN "cta_dark_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "cta_dark_cta_label" varchar DEFAULT 'Discover more';
  ALTER TABLE "home" ADD COLUMN "audience_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "stories_eyebrow" varchar DEFAULT 'Client Stories';
  ALTER TABLE "home" ADD COLUMN "stories_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_hero_description" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_hero_primary_cta_label" varchar DEFAULT 'Let''s Talk';
  ALTER TABLE "_home_v" ADD COLUMN "version_hero_secondary_cta_label" varchar DEFAULT 'Our Expertise';
  ALTER TABLE "_home_v" ADD COLUMN "version_featured_photo_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_featured_photo_cta_label" varchar DEFAULT 'Our approach';
  ALTER TABLE "_home_v" ADD COLUMN "version_logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers';
  ALTER TABLE "_home_v" ADD COLUMN "version_difference_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_divider_video_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "version_cta_dark_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_cta_dark_cta_label" varchar DEFAULT 'Discover more';
  ALTER TABLE "_home_v" ADD COLUMN "version_audience_heading" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_stories_eyebrow" varchar DEFAULT 'Client Stories';
  ALTER TABLE "_home_v" ADD COLUMN "version_stories_heading" varchar;
  CREATE TABLE "home_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  CREATE TABLE "home_featured_photo_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  CREATE TABLE "home_audience_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  CREATE TABLE "_home_v_version_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_home_v_version_featured_photo_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  CREATE TABLE "_home_v_version_audience_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  ALTER TABLE "home_hero_rotating_words" ADD CONSTRAINT "home_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_featured_photo_images" ADD CONSTRAINT "home_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_featured_photo_images" ADD CONSTRAINT "home_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_audience_areas" ADD CONSTRAINT "home_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_hero_rotating_words" ADD CONSTRAINT "_home_v_version_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_featured_photo_images" ADD CONSTRAINT "_home_v_version_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_featured_photo_images" ADD CONSTRAINT "_home_v_version_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_audience_areas" ADD CONSTRAINT "_home_v_version_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_divider_video_id_media_id_fk" FOREIGN KEY ("divider_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_divider_video_id_media_id_fk" FOREIGN KEY ("version_divider_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_divider_divider_video_idx" ON "home" USING btree ("divider_video_id");
  CREATE INDEX "_home_v_version_divider_version_divider_video_idx" ON "_home_v" USING btree ("version_divider_video_id");`)
}
