import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Real Numbers',
  	"tagline" varchar,
  	"favicon_id" integer,
  	"default_og_image_id" integer,
  	"search_engine_indexing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "home" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "home" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "about_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "about_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "team_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "team_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "team_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_team_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_team_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_team_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "contact_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_why_real_numbers_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_why_real_numbers_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_why_real_numbers_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "our_expertise_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "our_expertise_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "our_expertise_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_our_expertise_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_our_expertise_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_our_expertise_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "use_cases_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "use_cases_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "use_cases_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_use_cases_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_use_cases_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_use_cases_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "_questions_founders_ask_page_v" ADD COLUMN "version_seo_title" varchar;
  ALTER TABLE "_questions_founders_ask_page_v" ADD COLUMN "version_seo_description" varchar;
  ALTER TABLE "_questions_founders_ask_page_v" ADD COLUMN "version_seo_og_image_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  ALTER TABLE "home" ADD CONSTRAINT "home_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_page" ADD CONSTRAINT "team_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_page_v" ADD CONSTRAINT "_team_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page" ADD CONSTRAINT "why_real_numbers_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_why_real_numbers_page_v" ADD CONSTRAINT "_why_real_numbers_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "our_expertise_page" ADD CONSTRAINT "our_expertise_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v" ADD CONSTRAINT "_our_expertise_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_page" ADD CONSTRAINT "use_cases_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_cases_page_v" ADD CONSTRAINT "_use_cases_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "questions_founders_ask_page" ADD CONSTRAINT "questions_founders_ask_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_questions_founders_ask_page_v" ADD CONSTRAINT "_questions_founders_ask_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_seo_seo_og_image_idx" ON "home" USING btree ("seo_og_image_id");
  CREATE INDEX "_home_v_version_seo_version_seo_og_image_idx" ON "_home_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_about_page_v_version_seo_version_seo_og_image_idx" ON "_about_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "team_page_seo_seo_og_image_idx" ON "team_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_team_page_v_version_seo_version_seo_og_image_idx" ON "_team_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "contact_page_seo_seo_og_image_idx" ON "contact_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_contact_page_v_version_seo_version_seo_og_image_idx" ON "_contact_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "why_real_numbers_page_seo_seo_og_image_idx" ON "why_real_numbers_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_why_real_numbers_page_v_version_seo_version_seo_og_imag_idx" ON "_why_real_numbers_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "our_expertise_page_seo_seo_og_image_idx" ON "our_expertise_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_our_expertise_page_v_version_seo_version_seo_og_image_idx" ON "_our_expertise_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "use_cases_page_seo_seo_og_image_idx" ON "use_cases_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_use_cases_page_v_version_seo_version_seo_og_image_idx" ON "_use_cases_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "questions_founders_ask_page_seo_seo_og_image_idx" ON "questions_founders_ask_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_questions_founders_ask_page_v_version_seo_version_seo_o_idx" ON "_questions_founders_ask_page_v" USING btree ("version_seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "home" DROP CONSTRAINT "home_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "about_page" DROP CONSTRAINT "about_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_about_page_v" DROP CONSTRAINT "_about_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "team_page" DROP CONSTRAINT "team_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_team_page_v" DROP CONSTRAINT "_team_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "contact_page" DROP CONSTRAINT "contact_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_contact_page_v" DROP CONSTRAINT "_contact_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "why_real_numbers_page" DROP CONSTRAINT "why_real_numbers_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_why_real_numbers_page_v" DROP CONSTRAINT "_why_real_numbers_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "our_expertise_page" DROP CONSTRAINT "our_expertise_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_our_expertise_page_v" DROP CONSTRAINT "_our_expertise_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "use_cases_page" DROP CONSTRAINT "use_cases_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_use_cases_page_v" DROP CONSTRAINT "_use_cases_page_v_version_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "questions_founders_ask_page" DROP CONSTRAINT "questions_founders_ask_page_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "_questions_founders_ask_page_v" DROP CONSTRAINT "_questions_founders_ask_page_v_version_seo_og_image_id_media_id_fk";
  
  DROP INDEX "home_seo_seo_og_image_idx";
  DROP INDEX "_home_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "about_page_seo_seo_og_image_idx";
  DROP INDEX "_about_page_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "team_page_seo_seo_og_image_idx";
  DROP INDEX "_team_page_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "contact_page_seo_seo_og_image_idx";
  DROP INDEX "_contact_page_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "why_real_numbers_page_seo_seo_og_image_idx";
  DROP INDEX "_why_real_numbers_page_v_version_seo_version_seo_og_imag_idx";
  DROP INDEX "our_expertise_page_seo_seo_og_image_idx";
  DROP INDEX "_our_expertise_page_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "use_cases_page_seo_seo_og_image_idx";
  DROP INDEX "_use_cases_page_v_version_seo_version_seo_og_image_idx";
  DROP INDEX "questions_founders_ask_page_seo_seo_og_image_idx";
  DROP INDEX "_questions_founders_ask_page_v_version_seo_version_seo_o_idx";
  ALTER TABLE "home" DROP COLUMN "seo_title";
  ALTER TABLE "home" DROP COLUMN "seo_description";
  ALTER TABLE "home" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_home_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_home_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_home_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "about_page" DROP COLUMN "seo_title";
  ALTER TABLE "about_page" DROP COLUMN "seo_description";
  ALTER TABLE "about_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "team_page" DROP COLUMN "seo_title";
  ALTER TABLE "team_page" DROP COLUMN "seo_description";
  ALTER TABLE "team_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_team_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_team_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_team_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "contact_page" DROP COLUMN "seo_title";
  ALTER TABLE "contact_page" DROP COLUMN "seo_description";
  ALTER TABLE "contact_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "seo_title";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "seo_description";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_why_real_numbers_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_why_real_numbers_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_why_real_numbers_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "our_expertise_page" DROP COLUMN "seo_title";
  ALTER TABLE "our_expertise_page" DROP COLUMN "seo_description";
  ALTER TABLE "our_expertise_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_our_expertise_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_our_expertise_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_our_expertise_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "use_cases_page" DROP COLUMN "seo_title";
  ALTER TABLE "use_cases_page" DROP COLUMN "seo_description";
  ALTER TABLE "use_cases_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_use_cases_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_use_cases_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_use_cases_page_v" DROP COLUMN "version_seo_og_image_id";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "seo_title";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "seo_description";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "_questions_founders_ask_page_v" DROP COLUMN "version_seo_title";
  ALTER TABLE "_questions_founders_ask_page_v" DROP COLUMN "version_seo_description";
  ALTER TABLE "_questions_founders_ask_page_v" DROP COLUMN "version_seo_og_image_id";`)
}
