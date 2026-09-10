import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Split by hand from Payload's auto-generated migration: the generator
// bundled "create the new blocks tables" and "drop the old flat fields"
// into one migration, which would have destroyed the live Home page's
// real content before it could be copied into the new shape. This
// migration is the safe, additive-only half — new tables only, nothing
// dropped. The old fields are removed in a separate later migration,
// after payload/migrate-home-to-blocks.ts has copied the data across and
// that copy has been verified.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );

  CREATE TABLE "home_blocks_hero_featured_photo_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );

  CREATE TABLE "home_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"primary_cta_label" varchar DEFAULT 'Let''s Talk',
  	"secondary_cta_label" varchar DEFAULT 'Our Expertise',
  	"featured_photo_heading" varchar DEFAULT 'A partnership that works',
  	"featured_photo_cta_label" varchar DEFAULT 'Our approach',
  	"logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers',
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_diff" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The numbers that make the difference',
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'From ambition to tangible results',
  	"cta_label" varchar DEFAULT 'Discover more',
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_audience_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );

  CREATE TABLE "home_blocks_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'One partnership
  for every stage of growth',
  	"block_name" varchar
  );

  CREATE TABLE "home_blocks_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Client Stories',
  	"heading" varchar DEFAULT 'What happens when the numbers start working for you',
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_home_v_blocks_hero_featured_photo_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE "_home_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" varchar,
  	"primary_cta_label" varchar DEFAULT 'Let''s Talk',
  	"secondary_cta_label" varchar DEFAULT 'Our Expertise',
  	"featured_photo_heading" varchar DEFAULT 'A partnership that works',
  	"featured_photo_cta_label" varchar DEFAULT 'Our approach',
  	"logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_diff" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'The numbers that make the difference',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'From ambition to tangible results',
  	"cta_label" varchar DEFAULT 'Discover more',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_audience_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );

  CREATE TABLE "_home_v_blocks_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'One partnership
  for every stage of growth',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_home_v_blocks_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Client Stories',
  	"heading" varchar DEFAULT 'What happens when the numbers start working for you',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "home_blocks_hero_rotating_words" ADD CONSTRAINT "home_blocks_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_featured_photo_images" ADD CONSTRAINT "home_blocks_hero_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_featured_photo_images" ADD CONSTRAINT "home_blocks_hero_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_diff" ADD CONSTRAINT "home_blocks_diff_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats" ADD CONSTRAINT "home_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_divider" ADD CONSTRAINT "home_blocks_divider_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_divider" ADD CONSTRAINT "home_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta" ADD CONSTRAINT "home_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_audience_areas" ADD CONSTRAINT "home_blocks_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_audience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_audience" ADD CONSTRAINT "home_blocks_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stories" ADD CONSTRAINT "home_blocks_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_rotating_words" ADD CONSTRAINT "_home_v_blocks_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_featured_photo_images" ADD CONSTRAINT "_home_v_blocks_hero_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_featured_photo_images" ADD CONSTRAINT "_home_v_blocks_hero_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero" ADD CONSTRAINT "_home_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_diff" ADD CONSTRAINT "_home_v_blocks_diff_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stats" ADD CONSTRAINT "_home_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_divider" ADD CONSTRAINT "_home_v_blocks_divider_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_divider" ADD CONSTRAINT "_home_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_cta" ADD CONSTRAINT "_home_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_audience_areas" ADD CONSTRAINT "_home_v_blocks_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_audience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_audience" ADD CONSTRAINT "_home_v_blocks_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stories" ADD CONSTRAINT "_home_v_blocks_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_hero_rotating_words_order_idx" ON "home_blocks_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_rotating_words_parent_id_idx" ON "home_blocks_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_featured_photo_images_order_idx" ON "home_blocks_hero_featured_photo_images" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_featured_photo_images_parent_id_idx" ON "home_blocks_hero_featured_photo_images" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_featured_photo_images_image_idx" ON "home_blocks_hero_featured_photo_images" USING btree ("image_id");
  CREATE INDEX "home_blocks_hero_order_idx" ON "home_blocks_hero" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_parent_id_idx" ON "home_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_path_idx" ON "home_blocks_hero" USING btree ("_path");
  CREATE INDEX "home_blocks_diff_order_idx" ON "home_blocks_diff" USING btree ("_order");
  CREATE INDEX "home_blocks_diff_parent_id_idx" ON "home_blocks_diff" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_diff_path_idx" ON "home_blocks_diff" USING btree ("_path");
  CREATE INDEX "home_blocks_stats_order_idx" ON "home_blocks_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_parent_id_idx" ON "home_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_path_idx" ON "home_blocks_stats" USING btree ("_path");
  CREATE INDEX "home_blocks_divider_order_idx" ON "home_blocks_divider" USING btree ("_order");
  CREATE INDEX "home_blocks_divider_parent_id_idx" ON "home_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_divider_path_idx" ON "home_blocks_divider" USING btree ("_path");
  CREATE INDEX "home_blocks_divider_video_idx" ON "home_blocks_divider" USING btree ("video_id");
  CREATE INDEX "home_blocks_cta_order_idx" ON "home_blocks_cta" USING btree ("_order");
  CREATE INDEX "home_blocks_cta_parent_id_idx" ON "home_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_cta_path_idx" ON "home_blocks_cta" USING btree ("_path");
  CREATE INDEX "home_blocks_audience_areas_order_idx" ON "home_blocks_audience_areas" USING btree ("_order");
  CREATE INDEX "home_blocks_audience_areas_parent_id_idx" ON "home_blocks_audience_areas" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_audience_order_idx" ON "home_blocks_audience" USING btree ("_order");
  CREATE INDEX "home_blocks_audience_parent_id_idx" ON "home_blocks_audience" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_audience_path_idx" ON "home_blocks_audience" USING btree ("_path");
  CREATE INDEX "home_blocks_stories_order_idx" ON "home_blocks_stories" USING btree ("_order");
  CREATE INDEX "home_blocks_stories_parent_id_idx" ON "home_blocks_stories" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stories_path_idx" ON "home_blocks_stories" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_hero_rotating_words_order_idx" ON "_home_v_blocks_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_rotating_words_parent_id_idx" ON "_home_v_blocks_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_featured_photo_images_order_idx" ON "_home_v_blocks_hero_featured_photo_images" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_featured_photo_images_parent_id_idx" ON "_home_v_blocks_hero_featured_photo_images" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_featured_photo_images_image_idx" ON "_home_v_blocks_hero_featured_photo_images" USING btree ("image_id");
  CREATE INDEX "_home_v_blocks_hero_order_idx" ON "_home_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_parent_id_idx" ON "_home_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_path_idx" ON "_home_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_diff_order_idx" ON "_home_v_blocks_diff" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_diff_parent_id_idx" ON "_home_v_blocks_diff" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_diff_path_idx" ON "_home_v_blocks_diff" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_stats_order_idx" ON "_home_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stats_parent_id_idx" ON "_home_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_stats_path_idx" ON "_home_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_divider_order_idx" ON "_home_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_divider_parent_id_idx" ON "_home_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_divider_path_idx" ON "_home_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_divider_video_idx" ON "_home_v_blocks_divider" USING btree ("video_id");
  CREATE INDEX "_home_v_blocks_cta_order_idx" ON "_home_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_cta_parent_id_idx" ON "_home_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_cta_path_idx" ON "_home_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_audience_areas_order_idx" ON "_home_v_blocks_audience_areas" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_audience_areas_parent_id_idx" ON "_home_v_blocks_audience_areas" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_audience_order_idx" ON "_home_v_blocks_audience" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_audience_parent_id_idx" ON "_home_v_blocks_audience" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_audience_path_idx" ON "_home_v_blocks_audience" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_stories_order_idx" ON "_home_v_blocks_stories" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stories_parent_id_idx" ON "_home_v_blocks_stories" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_stories_path_idx" ON "_home_v_blocks_stories" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_blocks_hero_rotating_words" CASCADE;
  DROP TABLE "home_blocks_hero_featured_photo_images" CASCADE;
  DROP TABLE "home_blocks_hero" CASCADE;
  DROP TABLE "home_blocks_diff" CASCADE;
  DROP TABLE "home_blocks_stats" CASCADE;
  DROP TABLE "home_blocks_divider" CASCADE;
  DROP TABLE "home_blocks_cta" CASCADE;
  DROP TABLE "home_blocks_audience_areas" CASCADE;
  DROP TABLE "home_blocks_audience" CASCADE;
  DROP TABLE "home_blocks_stories" CASCADE;
  DROP TABLE "_home_v_blocks_hero_rotating_words" CASCADE;
  DROP TABLE "_home_v_blocks_hero_featured_photo_images" CASCADE;
  DROP TABLE "_home_v_blocks_hero" CASCADE;
  DROP TABLE "_home_v_blocks_diff" CASCADE;
  DROP TABLE "_home_v_blocks_stats" CASCADE;
  DROP TABLE "_home_v_blocks_divider" CASCADE;
  DROP TABLE "_home_v_blocks_cta" CASCADE;
  DROP TABLE "_home_v_blocks_audience_areas" CASCADE;
  DROP TABLE "_home_v_blocks_audience" CASCADE;
  DROP TABLE "_home_v_blocks_stories" CASCADE;`)
}
