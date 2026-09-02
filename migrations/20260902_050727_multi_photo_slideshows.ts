import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_our_story_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "why_real_numbers_page_what_makes_different_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "our_expertise_page_integrated_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "use_cases_page_atmosphere_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "questions_founders_ask_page_atmosphere_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  ALTER TABLE "about_page" DROP CONSTRAINT "about_page_our_story_photo_id_media_id_fk";
  
  ALTER TABLE "why_real_numbers_page" DROP CONSTRAINT "why_real_numbers_page_what_makes_different_photo_id_media_id_fk";
  
  ALTER TABLE "our_expertise_page" DROP CONSTRAINT "our_expertise_page_integrated_photo_id_media_id_fk";
  
  ALTER TABLE "use_cases_page" DROP CONSTRAINT "use_cases_page_atmosphere_photo_id_media_id_fk";
  
  ALTER TABLE "questions_founders_ask_page" DROP CONSTRAINT "questions_founders_ask_page_atmosphere_photo_id_media_id_fk";
  
  DROP INDEX "about_page_our_story_our_story_photo_idx";
  DROP INDEX "why_real_numbers_page_what_makes_different_what_makes_di_idx";
  DROP INDEX "our_expertise_page_integrated_integrated_photo_idx";
  DROP INDEX "use_cases_page_atmosphere_photo_idx";
  DROP INDEX "questions_founders_ask_page_atmosphere_photo_idx";
  ALTER TABLE "about_page_our_story_photos" ADD CONSTRAINT "about_page_our_story_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_our_story_photos" ADD CONSTRAINT "about_page_our_story_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_what_makes_different_photos" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_what_makes_different_photos" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page_integrated_photos" ADD CONSTRAINT "our_expertise_page_integrated_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_expertise_page_integrated_photos" ADD CONSTRAINT "our_expertise_page_integrated_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_expertise_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_page_atmosphere_photos" ADD CONSTRAINT "use_cases_page_atmosphere_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_page_atmosphere_photos" ADD CONSTRAINT "use_cases_page_atmosphere_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "questions_founders_ask_page_atmosphere_photos" ADD CONSTRAINT "questions_founders_ask_page_atmosphere_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "questions_founders_ask_page_atmosphere_photos" ADD CONSTRAINT "questions_founders_ask_page_atmosphere_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."questions_founders_ask_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_our_story_photos_order_idx" ON "about_page_our_story_photos" USING btree ("_order");
  CREATE INDEX "about_page_our_story_photos_parent_id_idx" ON "about_page_our_story_photos" USING btree ("_parent_id");
  CREATE INDEX "about_page_our_story_photos_image_idx" ON "about_page_our_story_photos" USING btree ("image_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_order_idx" ON "why_real_numbers_page_what_makes_different_photos" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_parent_id_idx" ON "why_real_numbers_page_what_makes_different_photos" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_photos_image_idx" ON "why_real_numbers_page_what_makes_different_photos" USING btree ("image_id");
  CREATE INDEX "our_expertise_page_integrated_photos_order_idx" ON "our_expertise_page_integrated_photos" USING btree ("_order");
  CREATE INDEX "our_expertise_page_integrated_photos_parent_id_idx" ON "our_expertise_page_integrated_photos" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_integrated_photos_image_idx" ON "our_expertise_page_integrated_photos" USING btree ("image_id");
  CREATE INDEX "use_cases_page_atmosphere_photos_order_idx" ON "use_cases_page_atmosphere_photos" USING btree ("_order");
  CREATE INDEX "use_cases_page_atmosphere_photos_parent_id_idx" ON "use_cases_page_atmosphere_photos" USING btree ("_parent_id");
  CREATE INDEX "use_cases_page_atmosphere_photos_image_idx" ON "use_cases_page_atmosphere_photos" USING btree ("image_id");
  CREATE INDEX "questions_founders_ask_page_atmosphere_photos_order_idx" ON "questions_founders_ask_page_atmosphere_photos" USING btree ("_order");
  CREATE INDEX "questions_founders_ask_page_atmosphere_photos_parent_id_idx" ON "questions_founders_ask_page_atmosphere_photos" USING btree ("_parent_id");
  CREATE INDEX "questions_founders_ask_page_atmosphere_photos_image_idx" ON "questions_founders_ask_page_atmosphere_photos" USING btree ("image_id");
  ALTER TABLE "about_page" DROP COLUMN "our_story_photo_id";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "what_makes_different_photo_id";
  ALTER TABLE "our_expertise_page" DROP COLUMN "integrated_photo_id";
  ALTER TABLE "use_cases_page" DROP COLUMN "atmosphere_photo_id";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "atmosphere_photo_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_our_story_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page_what_makes_different_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page_integrated_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases_page_atmosphere_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "questions_founders_ask_page_atmosphere_photos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page_our_story_photos" CASCADE;
  DROP TABLE "why_real_numbers_page_what_makes_different_photos" CASCADE;
  DROP TABLE "our_expertise_page_integrated_photos" CASCADE;
  DROP TABLE "use_cases_page_atmosphere_photos" CASCADE;
  DROP TABLE "questions_founders_ask_page_atmosphere_photos" CASCADE;
  ALTER TABLE "about_page" ADD COLUMN "our_story_photo_id" integer;
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "what_makes_different_photo_id" integer;
  ALTER TABLE "our_expertise_page" ADD COLUMN "integrated_photo_id" integer;
  ALTER TABLE "use_cases_page" ADD COLUMN "atmosphere_photo_id" integer;
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "atmosphere_photo_id" integer;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_our_story_photo_id_media_id_fk" FOREIGN KEY ("our_story_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_photo_id_media_id_fk" FOREIGN KEY ("what_makes_different_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_expertise_page" ADD CONSTRAINT "our_expertise_page_integrated_photo_id_media_id_fk" FOREIGN KEY ("integrated_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_page" ADD CONSTRAINT "use_cases_page_atmosphere_photo_id_media_id_fk" FOREIGN KEY ("atmosphere_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "questions_founders_ask_page" ADD CONSTRAINT "questions_founders_ask_page_atmosphere_photo_id_media_id_fk" FOREIGN KEY ("atmosphere_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_page_our_story_our_story_photo_idx" ON "about_page" USING btree ("our_story_photo_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_what_makes_di_idx" ON "why_real_numbers_page" USING btree ("what_makes_different_photo_id");
  CREATE INDEX "our_expertise_page_integrated_integrated_photo_idx" ON "our_expertise_page" USING btree ("integrated_photo_id");
  CREATE INDEX "use_cases_page_atmosphere_photo_idx" ON "use_cases_page" USING btree ("atmosphere_photo_id");
  CREATE INDEX "questions_founders_ask_page_atmosphere_photo_idx" ON "questions_founders_ask_page" USING btree ("atmosphere_photo_id");`)
}
