import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_why_real_numbers_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__why_real_numbers_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_our_expertise_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__our_expertise_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_use_cases_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__use_cases_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_questions_founders_ask_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__questions_founders_ask_page_v_version_status" AS ENUM('draft', 'published');
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
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_description" varchar,
  	"version_hero_primary_cta_label" varchar DEFAULT 'Let''s Talk',
  	"version_hero_secondary_cta_label" varchar DEFAULT 'Our Expertise',
  	"version_featured_photo_heading" varchar DEFAULT 'A partnership that works',
  	"version_featured_photo_cta_label" varchar DEFAULT 'Our approach',
  	"version_logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers',
  	"version_difference_heading" varchar DEFAULT 'The numbers that make the difference',
  	"version_cta_dark_heading" varchar DEFAULT 'From ambition to tangible results',
  	"version_cta_dark_cta_label" varchar DEFAULT 'Discover more',
  	"version_audience_heading" varchar DEFAULT 'One partnership
  for every stage of growth',
  	"version_stories_eyebrow" varchar DEFAULT 'Client Stories',
  	"version_stories_heading" varchar DEFAULT 'What happens when the numbers start working for you',
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_about_page_v_version_our_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_our_story_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_what_we_believe_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_how_we_work_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_leadership_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'About Real Numbers',
  	"version_hero_heading" varchar,
  	"version_hero_lede" varchar,
  	"version_our_story_heading" varchar DEFAULT 'Our Story',
  	"version_our_story_photo_caption" varchar DEFAULT 'Where the conversations happen',
  	"version_what_we_believe_heading" varchar DEFAULT 'What We Believe',
  	"version_what_we_believe_intro" varchar,
  	"version_how_we_work_heading" varchar DEFAULT 'How We Work',
  	"version_leadership_heading" varchar DEFAULT 'Leadership',
  	"version_leadership_note" varchar,
  	"version_leadership_team_link_label" varchar DEFAULT 'Meet the full team',
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_team_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Our Team',
  	"version_hero_heading" varchar,
  	"version_hero_lede" varchar,
  	"version_section_heading" varchar DEFAULT 'The Team',
  	"version_closing_cta_heading" varchar,
  	"version_closing_cta_closing_line" varchar,
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version__status" "enum__team_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Contact',
  	"version_hero_heading" varchar,
  	"version_direct_contact_label" varchar DEFAULT 'Prefer a direct conversation?',
  	"version_direct_contact_whatsapp_number" varchar,
  	"version_direct_contact_email" varchar,
  	"version_manifesto_heading" varchar,
  	"version_manifesto_text" varchar,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_why_real_numbers_page_v_version_hero_lede_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_real_numbers_page_v_version_why_choose_us_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_real_numbers_page_v_version_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"paragraph1" varchar,
  	"paragraph2" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_rn_wmd_paragraphs_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_rn_wmd_photos_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_why_real_numbers_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Why Real Numbers',
  	"version_hero_heading" varchar,
  	"version_why_choose_us_heading" varchar DEFAULT 'Why companies choose us',
  	"version_what_makes_different_heading" varchar DEFAULT 'What makes the partnership different',
  	"version_closing_cta_heading" varchar,
  	"version_closing_cta_closing_line" varchar,
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version__status" "enum__why_real_numbers_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_our_expertise_page_v_version_hero_lede_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_expertise_page_v_version_areas_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_expertise_page_v_version_areas_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_expertise_page_v_version_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_expertise_page_v_version_integrated_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_our_expertise_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Our Expertise',
  	"version_hero_heading" varchar,
  	"version_integrated_heading" varchar DEFAULT 'One integrated financial partnership',
  	"version_integrated_text" varchar,
  	"version_integrated_photo_caption" varchar DEFAULT 'The work behind the clarity',
  	"version_closing_cta_heading" varchar,
  	"version_closing_cta_closing_line" varchar,
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version__status" "enum__our_expertise_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_use_cases_page_v_version_atmosphere_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_use_cases_page_v_version_situations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_use_cases_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Use Cases',
  	"version_hero_heading" varchar,
  	"version_hero_lede" varchar,
  	"version_atmosphere_photo_caption" varchar DEFAULT 'Every stage looks different',
  	"version_situations_intro" varchar DEFAULT 'Some of the situations that typically bring companies to Real Numbers:',
  	"version_closing_cta_heading" varchar,
  	"version_closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"version__status" "enum__use_cases_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_questions_founders_ask_page_v_version_atmosphere_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_questions_founders_ask_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Questions Founders Ask',
  	"version_hero_heading" varchar,
  	"version__status" "enum__questions_founders_ask_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "home_hero_rotating_words" ALTER COLUMN "word" DROP NOT NULL;
  ALTER TABLE "home_featured_photo_images" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "home_audience_areas" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "home_audience_areas" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "hero_description" DROP NOT NULL;
  ALTER TABLE "about_page_our_story_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "about_page_our_story_photos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "about_page_what_we_believe_principles" ALTER COLUMN "lead" DROP NOT NULL;
  ALTER TABLE "about_page_what_we_believe_principles" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "about_page_how_we_work_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "bio" DROP NOT NULL;
  ALTER TABLE "about_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "about_page" ALTER COLUMN "hero_lede" DROP NOT NULL;
  ALTER TABLE "team_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "team_page" ALTER COLUMN "closing_cta_heading" DROP NOT NULL;
  ALTER TABLE "contact_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "contact_page" ALTER COLUMN "manifesto_heading" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page_hero_lede_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page_why_choose_us_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page_value_props" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page_value_props" ALTER COLUMN "paragraph1" DROP NOT NULL;
  ALTER TABLE "why_rn_wmd_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "why_rn_wmd_photos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "why_real_numbers_page" ALTER COLUMN "closing_cta_heading" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_hero_lede_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_areas_paragraphs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_areas_services" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_areas" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_areas" ALTER COLUMN "tagline" DROP NOT NULL;
  ALTER TABLE "our_expertise_page_integrated_photos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "our_expertise_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "our_expertise_page" ALTER COLUMN "closing_cta_heading" DROP NOT NULL;
  ALTER TABLE "use_cases_page_atmosphere_photos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "use_cases_page_situations" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "use_cases_page_situations" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "use_cases_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "use_cases_page" ALTER COLUMN "closing_cta_heading" DROP NOT NULL;
  ALTER TABLE "questions_founders_ask_page_atmosphere_photos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "questions_founders_ask_page" ALTER COLUMN "hero_heading" DROP NOT NULL;
  ALTER TABLE "home" ADD COLUMN "_status" "enum_home_status" DEFAULT 'draft';
  ALTER TABLE "about_page" ADD COLUMN "_status" "enum_about_page_status" DEFAULT 'draft';
  ALTER TABLE "team_page" ADD COLUMN "_status" "enum_team_page_status" DEFAULT 'draft';
  ALTER TABLE "contact_page" ADD COLUMN "_status" "enum_contact_page_status" DEFAULT 'draft';
  ALTER TABLE "why_real_numbers_page" ADD COLUMN "_status" "enum_why_real_numbers_page_status" DEFAULT 'draft';
  ALTER TABLE "our_expertise_page" ADD COLUMN "_status" "enum_our_expertise_page_status" DEFAULT 'draft';
  ALTER TABLE "use_cases_page" ADD COLUMN "_status" "enum_use_cases_page_status" DEFAULT 'draft';
  ALTER TABLE "questions_founders_ask_page" ADD COLUMN "_status" "enum_questions_founders_ask_page_status" DEFAULT 'draft';
  ALTER TABLE "_home_v_version_hero_rotating_words" ADD CONSTRAINT "_home_v_version_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_featured_photo_images" ADD CONSTRAINT "_home_v_version_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_featured_photo_images" ADD CONSTRAINT "_home_v_version_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_audience_areas" ADD CONSTRAINT "_home_v_version_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_our_story_paragraphs" ADD CONSTRAINT "_about_page_v_version_our_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_our_story_photos" ADD CONSTRAINT "_about_page_v_version_our_story_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_our_story_photos" ADD CONSTRAINT "_about_page_v_version_our_story_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_what_we_believe_principles" ADD CONSTRAINT "_about_page_v_version_what_we_believe_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_how_we_work_paragraphs" ADD CONSTRAINT "_about_page_v_version_how_we_work_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_leadership_cards" ADD CONSTRAINT "_about_page_v_version_leadership_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_real_numbers_page_v_version_hero_lede_paragraphs" ADD CONSTRAINT "_why_real_numbers_page_v_version_hero_lede_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_real_numbers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_real_numbers_page_v_version_why_choose_us_paragraphs" ADD CONSTRAINT "_why_real_numbers_page_v_version_why_choose_us_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_real_numbers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_real_numbers_page_v_version_value_props" ADD CONSTRAINT "_why_real_numbers_page_v_version_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_real_numbers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_rn_wmd_paragraphs_v" ADD CONSTRAINT "_why_rn_wmd_paragraphs_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_real_numbers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_why_rn_wmd_photos_v" ADD CONSTRAINT "_why_rn_wmd_photos_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_why_rn_wmd_photos_v" ADD CONSTRAINT "_why_rn_wmd_photos_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_why_real_numbers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_hero_lede_paragraphs" ADD CONSTRAINT "_our_expertise_page_v_version_hero_lede_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_expertise_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_areas_paragraphs" ADD CONSTRAINT "_our_expertise_page_v_version_areas_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_expertise_page_v_version_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_areas_services" ADD CONSTRAINT "_our_expertise_page_v_version_areas_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_expertise_page_v_version_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_areas" ADD CONSTRAINT "_our_expertise_page_v_version_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_expertise_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_integrated_photos" ADD CONSTRAINT "_our_expertise_page_v_version_integrated_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_our_expertise_page_v_version_integrated_photos" ADD CONSTRAINT "_our_expertise_page_v_version_integrated_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_our_expertise_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_page_v_version_atmosphere_photos" ADD CONSTRAINT "_use_cases_page_v_version_atmosphere_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_use_cases_page_v_version_atmosphere_photos" ADD CONSTRAINT "_use_cases_page_v_version_atmosphere_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_use_cases_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_use_cases_page_v_version_situations" ADD CONSTRAINT "_use_cases_page_v_version_situations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_use_cases_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_questions_founders_ask_page_v_version_atmosphere_photos" ADD CONSTRAINT "_questions_founders_ask_page_v_version_atmosphere_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_questions_founders_ask_page_v_version_atmosphere_photos" ADD CONSTRAINT "_questions_founders_ask_page_v_version_atmosphere_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_questions_founders_ask_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_home_v_version_hero_rotating_words_order_idx" ON "_home_v_version_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "_home_v_version_hero_rotating_words_parent_id_idx" ON "_home_v_version_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_featured_photo_images_order_idx" ON "_home_v_version_featured_photo_images" USING btree ("_order");
  CREATE INDEX "_home_v_version_featured_photo_images_parent_id_idx" ON "_home_v_version_featured_photo_images" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_featured_photo_images_image_idx" ON "_home_v_version_featured_photo_images" USING btree ("image_id");
  CREATE INDEX "_home_v_version_audience_areas_order_idx" ON "_home_v_version_audience_areas" USING btree ("_order");
  CREATE INDEX "_home_v_version_audience_areas_parent_id_idx" ON "_home_v_version_audience_areas" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_about_page_v_version_our_story_paragraphs_order_idx" ON "_about_page_v_version_our_story_paragraphs" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_our_story_paragraphs_parent_id_idx" ON "_about_page_v_version_our_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_our_story_photos_order_idx" ON "_about_page_v_version_our_story_photos" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_our_story_photos_parent_id_idx" ON "_about_page_v_version_our_story_photos" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_our_story_photos_image_idx" ON "_about_page_v_version_our_story_photos" USING btree ("image_id");
  CREATE INDEX "_about_page_v_version_what_we_believe_principles_order_idx" ON "_about_page_v_version_what_we_believe_principles" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_what_we_believe_principles_parent_id_idx" ON "_about_page_v_version_what_we_believe_principles" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_how_we_work_paragraphs_order_idx" ON "_about_page_v_version_how_we_work_paragraphs" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_how_we_work_paragraphs_parent_id_idx" ON "_about_page_v_version_how_we_work_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_leadership_cards_order_idx" ON "_about_page_v_version_leadership_cards" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_leadership_cards_parent_id_idx" ON "_about_page_v_version_leadership_cards" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE INDEX "_team_page_v_version_version__status_idx" ON "_team_page_v" USING btree ("version__status");
  CREATE INDEX "_team_page_v_created_at_idx" ON "_team_page_v" USING btree ("created_at");
  CREATE INDEX "_team_page_v_updated_at_idx" ON "_team_page_v" USING btree ("updated_at");
  CREATE INDEX "_team_page_v_latest_idx" ON "_team_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_why_real_numbers_page_v_version_hero_lede_paragraphs_order_idx" ON "_why_real_numbers_page_v_version_hero_lede_paragraphs" USING btree ("_order");
  CREATE INDEX "_why_real_numbers_page_v_version_hero_lede_paragraphs_parent_id_idx" ON "_why_real_numbers_page_v_version_hero_lede_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_why_real_numbers_page_v_version_why_choose_us_paragraphs_order_idx" ON "_why_real_numbers_page_v_version_why_choose_us_paragraphs" USING btree ("_order");
  CREATE INDEX "_why_real_numbers_page_v_version_why_choose_us_paragraphs_parent_id_idx" ON "_why_real_numbers_page_v_version_why_choose_us_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_why_real_numbers_page_v_version_value_props_order_idx" ON "_why_real_numbers_page_v_version_value_props" USING btree ("_order");
  CREATE INDEX "_why_real_numbers_page_v_version_value_props_parent_id_idx" ON "_why_real_numbers_page_v_version_value_props" USING btree ("_parent_id");
  CREATE INDEX "_why_rn_wmd_paragraphs_v_order_idx" ON "_why_rn_wmd_paragraphs_v" USING btree ("_order");
  CREATE INDEX "_why_rn_wmd_paragraphs_v_parent_id_idx" ON "_why_rn_wmd_paragraphs_v" USING btree ("_parent_id");
  CREATE INDEX "_why_rn_wmd_photos_v_order_idx" ON "_why_rn_wmd_photos_v" USING btree ("_order");
  CREATE INDEX "_why_rn_wmd_photos_v_parent_id_idx" ON "_why_rn_wmd_photos_v" USING btree ("_parent_id");
  CREATE INDEX "_why_rn_wmd_photos_v_image_idx" ON "_why_rn_wmd_photos_v" USING btree ("image_id");
  CREATE INDEX "_why_real_numbers_page_v_version_version__status_idx" ON "_why_real_numbers_page_v" USING btree ("version__status");
  CREATE INDEX "_why_real_numbers_page_v_created_at_idx" ON "_why_real_numbers_page_v" USING btree ("created_at");
  CREATE INDEX "_why_real_numbers_page_v_updated_at_idx" ON "_why_real_numbers_page_v" USING btree ("updated_at");
  CREATE INDEX "_why_real_numbers_page_v_latest_idx" ON "_why_real_numbers_page_v" USING btree ("latest");
  CREATE INDEX "_our_expertise_page_v_version_hero_lede_paragraphs_order_idx" ON "_our_expertise_page_v_version_hero_lede_paragraphs" USING btree ("_order");
  CREATE INDEX "_our_expertise_page_v_version_hero_lede_paragraphs_parent_id_idx" ON "_our_expertise_page_v_version_hero_lede_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_our_expertise_page_v_version_areas_paragraphs_order_idx" ON "_our_expertise_page_v_version_areas_paragraphs" USING btree ("_order");
  CREATE INDEX "_our_expertise_page_v_version_areas_paragraphs_parent_id_idx" ON "_our_expertise_page_v_version_areas_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_our_expertise_page_v_version_areas_services_order_idx" ON "_our_expertise_page_v_version_areas_services" USING btree ("_order");
  CREATE INDEX "_our_expertise_page_v_version_areas_services_parent_id_idx" ON "_our_expertise_page_v_version_areas_services" USING btree ("_parent_id");
  CREATE INDEX "_our_expertise_page_v_version_areas_order_idx" ON "_our_expertise_page_v_version_areas" USING btree ("_order");
  CREATE INDEX "_our_expertise_page_v_version_areas_parent_id_idx" ON "_our_expertise_page_v_version_areas" USING btree ("_parent_id");
  CREATE INDEX "_our_expertise_page_v_version_integrated_photos_order_idx" ON "_our_expertise_page_v_version_integrated_photos" USING btree ("_order");
  CREATE INDEX "_our_expertise_page_v_version_integrated_photos_parent_id_idx" ON "_our_expertise_page_v_version_integrated_photos" USING btree ("_parent_id");
  CREATE INDEX "_our_expertise_page_v_version_integrated_photos_image_idx" ON "_our_expertise_page_v_version_integrated_photos" USING btree ("image_id");
  CREATE INDEX "_our_expertise_page_v_version_version__status_idx" ON "_our_expertise_page_v" USING btree ("version__status");
  CREATE INDEX "_our_expertise_page_v_created_at_idx" ON "_our_expertise_page_v" USING btree ("created_at");
  CREATE INDEX "_our_expertise_page_v_updated_at_idx" ON "_our_expertise_page_v" USING btree ("updated_at");
  CREATE INDEX "_our_expertise_page_v_latest_idx" ON "_our_expertise_page_v" USING btree ("latest");
  CREATE INDEX "_use_cases_page_v_version_atmosphere_photos_order_idx" ON "_use_cases_page_v_version_atmosphere_photos" USING btree ("_order");
  CREATE INDEX "_use_cases_page_v_version_atmosphere_photos_parent_id_idx" ON "_use_cases_page_v_version_atmosphere_photos" USING btree ("_parent_id");
  CREATE INDEX "_use_cases_page_v_version_atmosphere_photos_image_idx" ON "_use_cases_page_v_version_atmosphere_photos" USING btree ("image_id");
  CREATE INDEX "_use_cases_page_v_version_situations_order_idx" ON "_use_cases_page_v_version_situations" USING btree ("_order");
  CREATE INDEX "_use_cases_page_v_version_situations_parent_id_idx" ON "_use_cases_page_v_version_situations" USING btree ("_parent_id");
  CREATE INDEX "_use_cases_page_v_version_version__status_idx" ON "_use_cases_page_v" USING btree ("version__status");
  CREATE INDEX "_use_cases_page_v_created_at_idx" ON "_use_cases_page_v" USING btree ("created_at");
  CREATE INDEX "_use_cases_page_v_updated_at_idx" ON "_use_cases_page_v" USING btree ("updated_at");
  CREATE INDEX "_use_cases_page_v_latest_idx" ON "_use_cases_page_v" USING btree ("latest");
  CREATE INDEX "_questions_founders_ask_page_v_version_atmosphere_photos_order_idx" ON "_questions_founders_ask_page_v_version_atmosphere_photos" USING btree ("_order");
  CREATE INDEX "_questions_founders_ask_page_v_version_atmosphere_photos_parent_id_idx" ON "_questions_founders_ask_page_v_version_atmosphere_photos" USING btree ("_parent_id");
  CREATE INDEX "_questions_founders_ask_page_v_version_atmosphere_photos_idx" ON "_questions_founders_ask_page_v_version_atmosphere_photos" USING btree ("image_id");
  CREATE INDEX "_questions_founders_ask_page_v_version_version__status_idx" ON "_questions_founders_ask_page_v" USING btree ("version__status");
  CREATE INDEX "_questions_founders_ask_page_v_created_at_idx" ON "_questions_founders_ask_page_v" USING btree ("created_at");
  CREATE INDEX "_questions_founders_ask_page_v_updated_at_idx" ON "_questions_founders_ask_page_v" USING btree ("updated_at");
  CREATE INDEX "_questions_founders_ask_page_v_latest_idx" ON "_questions_founders_ask_page_v" USING btree ("latest");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE INDEX "team_page__status_idx" ON "team_page" USING btree ("_status");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "why_real_numbers_page__status_idx" ON "why_real_numbers_page" USING btree ("_status");
  CREATE INDEX "our_expertise_page__status_idx" ON "our_expertise_page" USING btree ("_status");
  CREATE INDEX "use_cases_page__status_idx" ON "use_cases_page" USING btree ("_status");
  CREATE INDEX "questions_founders_ask_page__status_idx" ON "questions_founders_ask_page" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_home_v_version_hero_rotating_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_featured_photo_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_audience_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_our_story_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_our_story_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_what_we_believe_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_how_we_work_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_leadership_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_real_numbers_page_v_version_hero_lede_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_real_numbers_page_v_version_why_choose_us_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_real_numbers_page_v_version_value_props" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_rn_wmd_paragraphs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_rn_wmd_photos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_why_real_numbers_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v_version_hero_lede_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v_version_areas_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v_version_areas_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v_version_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v_version_integrated_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_our_expertise_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_use_cases_page_v_version_atmosphere_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_use_cases_page_v_version_situations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_use_cases_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_questions_founders_ask_page_v_version_atmosphere_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_questions_founders_ask_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_home_v_version_hero_rotating_words" CASCADE;
  DROP TABLE "_home_v_version_featured_photo_images" CASCADE;
  DROP TABLE "_home_v_version_audience_areas" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_about_page_v_version_our_story_paragraphs" CASCADE;
  DROP TABLE "_about_page_v_version_our_story_photos" CASCADE;
  DROP TABLE "_about_page_v_version_what_we_believe_principles" CASCADE;
  DROP TABLE "_about_page_v_version_how_we_work_paragraphs" CASCADE;
  DROP TABLE "_about_page_v_version_leadership_cards" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_team_page_v" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TABLE "_why_real_numbers_page_v_version_hero_lede_paragraphs" CASCADE;
  DROP TABLE "_why_real_numbers_page_v_version_why_choose_us_paragraphs" CASCADE;
  DROP TABLE "_why_real_numbers_page_v_version_value_props" CASCADE;
  DROP TABLE "_why_rn_wmd_paragraphs_v" CASCADE;
  DROP TABLE "_why_rn_wmd_photos_v" CASCADE;
  DROP TABLE "_why_real_numbers_page_v" CASCADE;
  DROP TABLE "_our_expertise_page_v_version_hero_lede_paragraphs" CASCADE;
  DROP TABLE "_our_expertise_page_v_version_areas_paragraphs" CASCADE;
  DROP TABLE "_our_expertise_page_v_version_areas_services" CASCADE;
  DROP TABLE "_our_expertise_page_v_version_areas" CASCADE;
  DROP TABLE "_our_expertise_page_v_version_integrated_photos" CASCADE;
  DROP TABLE "_our_expertise_page_v" CASCADE;
  DROP TABLE "_use_cases_page_v_version_atmosphere_photos" CASCADE;
  DROP TABLE "_use_cases_page_v_version_situations" CASCADE;
  DROP TABLE "_use_cases_page_v" CASCADE;
  DROP TABLE "_questions_founders_ask_page_v_version_atmosphere_photos" CASCADE;
  DROP TABLE "_questions_founders_ask_page_v" CASCADE;
  DROP INDEX "home__status_idx";
  DROP INDEX "about_page__status_idx";
  DROP INDEX "team_page__status_idx";
  DROP INDEX "contact_page__status_idx";
  DROP INDEX "why_real_numbers_page__status_idx";
  DROP INDEX "our_expertise_page__status_idx";
  DROP INDEX "use_cases_page__status_idx";
  DROP INDEX "questions_founders_ask_page__status_idx";
  ALTER TABLE "home_hero_rotating_words" ALTER COLUMN "word" SET NOT NULL;
  ALTER TABLE "home_featured_photo_images" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "home_audience_areas" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "home_audience_areas" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "hero_description" SET NOT NULL;
  ALTER TABLE "about_page_our_story_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "about_page_our_story_photos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "about_page_what_we_believe_principles" ALTER COLUMN "lead" SET NOT NULL;
  ALTER TABLE "about_page_what_we_believe_principles" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "about_page_how_we_work_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "about_page_leadership_cards" ALTER COLUMN "bio" SET NOT NULL;
  ALTER TABLE "about_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "about_page" ALTER COLUMN "hero_lede" SET NOT NULL;
  ALTER TABLE "team_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "team_page" ALTER COLUMN "closing_cta_heading" SET NOT NULL;
  ALTER TABLE "contact_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "contact_page" ALTER COLUMN "manifesto_heading" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page_hero_lede_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page_why_choose_us_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page_value_props" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page_value_props" ALTER COLUMN "paragraph1" SET NOT NULL;
  ALTER TABLE "why_rn_wmd_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "why_rn_wmd_photos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "why_real_numbers_page" ALTER COLUMN "closing_cta_heading" SET NOT NULL;
  ALTER TABLE "our_expertise_page_hero_lede_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "our_expertise_page_areas_paragraphs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "our_expertise_page_areas_services" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "our_expertise_page_areas" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "our_expertise_page_areas" ALTER COLUMN "tagline" SET NOT NULL;
  ALTER TABLE "our_expertise_page_integrated_photos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "our_expertise_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "our_expertise_page" ALTER COLUMN "closing_cta_heading" SET NOT NULL;
  ALTER TABLE "use_cases_page_atmosphere_photos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "use_cases_page_situations" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "use_cases_page_situations" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "use_cases_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "use_cases_page" ALTER COLUMN "closing_cta_heading" SET NOT NULL;
  ALTER TABLE "questions_founders_ask_page_atmosphere_photos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "questions_founders_ask_page" ALTER COLUMN "hero_heading" SET NOT NULL;
  ALTER TABLE "home" DROP COLUMN "_status";
  ALTER TABLE "about_page" DROP COLUMN "_status";
  ALTER TABLE "team_page" DROP COLUMN "_status";
  ALTER TABLE "contact_page" DROP COLUMN "_status";
  ALTER TABLE "why_real_numbers_page" DROP COLUMN "_status";
  ALTER TABLE "our_expertise_page" DROP COLUMN "_status";
  ALTER TABLE "use_cases_page" DROP COLUMN "_status";
  ALTER TABLE "questions_founders_ask_page" DROP COLUMN "_status";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum_team_page_status";
  DROP TYPE "public"."enum__team_page_v_version_status";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";
  DROP TYPE "public"."enum_why_real_numbers_page_status";
  DROP TYPE "public"."enum__why_real_numbers_page_v_version_status";
  DROP TYPE "public"."enum_our_expertise_page_status";
  DROP TYPE "public"."enum__our_expertise_page_v_version_status";
  DROP TYPE "public"."enum_use_cases_page_status";
  DROP TYPE "public"."enum__use_cases_page_v_version_status";
  DROP TYPE "public"."enum_questions_founders_ask_page_status";
  DROP TYPE "public"."enum__questions_founders_ask_page_v_version_status";`)
}
