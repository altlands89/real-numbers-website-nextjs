import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_how_we_work_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__how_we_work_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "how_we_work_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "how_we_work_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'How We Work',
  	"hero_heading" varchar DEFAULT 'A clear path from first conversation to full financial partnership',
  	"hero_lede" varchar DEFAULT 'No surprises, no long onboarding limbo. Here''s how an engagement with Real Numbers starts, and how it grows from there.',
  	"steps_intro" varchar DEFAULT 'How an engagement comes together, step by step:',
  	"closing_cta_heading" varchar DEFAULT 'Ready to talk about how we''d work together?',
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"_status" "enum_how_we_work_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_how_we_work_page_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_how_we_work_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'How We Work',
  	"version_hero_heading" varchar DEFAULT 'A clear path from first conversation to full financial partnership',
  	"version_hero_lede" varchar DEFAULT 'No surprises, no long onboarding limbo. Here''s how an engagement with Real Numbers starts, and how it grows from there.',
  	"version_steps_intro" varchar DEFAULT 'How an engagement comes together, step by step:',
  	"version_closing_cta_heading" varchar DEFAULT 'Ready to talk about how we''d work together?',
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version__status" "enum__how_we_work_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "case_studies_page_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client_label" varchar,
  	"metric" varchar,
  	"description" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "case_studies_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Case Studies',
  	"hero_heading" varchar DEFAULT 'Real results, from real engagements',
  	"hero_lede" varchar DEFAULT 'A few examples of what changes when a growing company gets a real financial partner.',
  	"closing_cta_heading" varchar DEFAULT 'Ready to be the next one?',
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"_status" "enum_case_studies_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_case_studies_page_v_version_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_label" varchar,
  	"metric" varchar,
  	"description" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Case Studies',
  	"version_hero_heading" varchar DEFAULT 'Real results, from real engagements',
  	"version_hero_lede" varchar DEFAULT 'A few examples of what changes when a growing company gets a real financial partner.',
  	"version_closing_cta_heading" varchar DEFAULT 'Ready to be the next one?',
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version__status" "enum__case_studies_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "testimonials" ADD COLUMN "photo_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "logo_id" integer;
  ALTER TABLE "how_we_work_page_steps" ADD CONSTRAINT "how_we_work_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."how_we_work_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "how_we_work_page" ADD CONSTRAINT "how_we_work_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_how_we_work_page_v_version_steps" ADD CONSTRAINT "_how_we_work_page_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_how_we_work_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_how_we_work_page_v" ADD CONSTRAINT "_how_we_work_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_page_case_studies" ADD CONSTRAINT "case_studies_page_case_studies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_page_case_studies" ADD CONSTRAINT "case_studies_page_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_page" ADD CONSTRAINT "case_studies_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_version_case_studies" ADD CONSTRAINT "_case_studies_page_v_version_case_studies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v_version_case_studies" ADD CONSTRAINT "_case_studies_page_v_version_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_page_v" ADD CONSTRAINT "_case_studies_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "how_we_work_page_steps_order_idx" ON "how_we_work_page_steps" USING btree ("_order");
  CREATE INDEX "how_we_work_page_steps_parent_id_idx" ON "how_we_work_page_steps" USING btree ("_parent_id");
  CREATE INDEX "how_we_work_page_seo_seo_og_image_idx" ON "how_we_work_page" USING btree ("seo_og_image_id");
  CREATE INDEX "how_we_work_page__status_idx" ON "how_we_work_page" USING btree ("_status");
  CREATE INDEX "_how_we_work_page_v_version_steps_order_idx" ON "_how_we_work_page_v_version_steps" USING btree ("_order");
  CREATE INDEX "_how_we_work_page_v_version_steps_parent_id_idx" ON "_how_we_work_page_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_how_we_work_page_v_version_seo_version_seo_og_image_idx" ON "_how_we_work_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_how_we_work_page_v_version_version__status_idx" ON "_how_we_work_page_v" USING btree ("version__status");
  CREATE INDEX "_how_we_work_page_v_created_at_idx" ON "_how_we_work_page_v" USING btree ("created_at");
  CREATE INDEX "_how_we_work_page_v_updated_at_idx" ON "_how_we_work_page_v" USING btree ("updated_at");
  CREATE INDEX "_how_we_work_page_v_latest_idx" ON "_how_we_work_page_v" USING btree ("latest");
  CREATE INDEX "case_studies_page_case_studies_order_idx" ON "case_studies_page_case_studies" USING btree ("_order");
  CREATE INDEX "case_studies_page_case_studies_parent_id_idx" ON "case_studies_page_case_studies" USING btree ("_parent_id");
  CREATE INDEX "case_studies_page_case_studies_logo_idx" ON "case_studies_page_case_studies" USING btree ("logo_id");
  CREATE INDEX "case_studies_page_seo_seo_og_image_idx" ON "case_studies_page" USING btree ("seo_og_image_id");
  CREATE INDEX "case_studies_page__status_idx" ON "case_studies_page" USING btree ("_status");
  CREATE INDEX "_case_studies_page_v_version_case_studies_order_idx" ON "_case_studies_page_v_version_case_studies" USING btree ("_order");
  CREATE INDEX "_case_studies_page_v_version_case_studies_parent_id_idx" ON "_case_studies_page_v_version_case_studies" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_page_v_version_case_studies_logo_idx" ON "_case_studies_page_v_version_case_studies" USING btree ("logo_id");
  CREATE INDEX "_case_studies_page_v_version_seo_version_seo_og_image_idx" ON "_case_studies_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_case_studies_page_v_version_version__status_idx" ON "_case_studies_page_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_page_v_created_at_idx" ON "_case_studies_page_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_page_v_updated_at_idx" ON "_case_studies_page_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_page_v_latest_idx" ON "_case_studies_page_v" USING btree ("latest");
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_logo_idx" ON "testimonials" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "how_we_work_page_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "how_we_work_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_how_we_work_page_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_how_we_work_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v_version_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "how_we_work_page_steps" CASCADE;
  DROP TABLE "how_we_work_page" CASCADE;
  DROP TABLE "_how_we_work_page_v_version_steps" CASCADE;
  DROP TABLE "_how_we_work_page_v" CASCADE;
  DROP TABLE "case_studies_page_case_studies" CASCADE;
  DROP TABLE "case_studies_page" CASCADE;
  DROP TABLE "_case_studies_page_v_version_case_studies" CASCADE;
  DROP TABLE "_case_studies_page_v" CASCADE;
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_photo_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_logo_id_media_id_fk";
  
  DROP INDEX "testimonials_photo_idx";
  DROP INDEX "testimonials_logo_idx";
  ALTER TABLE "testimonials" DROP COLUMN "photo_id";
  ALTER TABLE "testimonials" DROP COLUMN "logo_id";
  DROP TYPE "public"."enum_how_we_work_page_status";
  DROP TYPE "public"."enum__how_we_work_page_v_version_status";
  DROP TYPE "public"."enum_case_studies_page_status";
  DROP TYPE "public"."enum__case_studies_page_v_version_status";`)
}
