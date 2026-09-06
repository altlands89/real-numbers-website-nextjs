import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stats_stats_color" AS ENUM('red', 'blue', 'jet', 'horizon');
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"bio" varchar NOT NULL,
  	"education" varchar,
  	"leadership" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"href" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "branding" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_logo_id" integer,
  	"footer_logo_id" integer,
  	"footer_copyright" varchar DEFAULT 'Real Numbers. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"color" "enum_stats_stats_color" DEFAULT 'red' NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Proof in numbers',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar NOT NULL
  );
  
  CREATE TABLE "home_featured_photo_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "home_audience_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"hero_primary_cta_label" varchar DEFAULT 'Let''s Talk',
  	"hero_secondary_cta_label" varchar DEFAULT 'Our Expertise',
  	"featured_photo_heading" varchar DEFAULT 'A partnership that works',
  	"featured_photo_cta_label" varchar DEFAULT 'Our approach',
  	"logos_strip_cta_label" varchar DEFAULT 'Why Real Numbers',
  	"difference_heading" varchar DEFAULT 'The numbers that make the difference',
  	"cta_dark_heading" varchar DEFAULT 'From ambition to tangible results',
  	"cta_dark_cta_label" varchar DEFAULT 'Discover more',
  	"audience_heading" varchar DEFAULT 'One partnership
  for every stage of growth',
  	"stories_eyebrow" varchar DEFAULT 'Client Stories',
  	"stories_heading" varchar DEFAULT 'What happens when the numbers start working for you',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_our_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_what_we_believe_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_how_we_work_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_leadership_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'About Real Numbers',
  	"hero_heading" varchar NOT NULL,
  	"hero_lede" varchar NOT NULL,
  	"our_story_heading" varchar DEFAULT 'Our Story',
  	"our_story_photo_id" integer,
  	"our_story_photo_caption" varchar DEFAULT 'Where the conversations happen',
  	"what_we_believe_heading" varchar DEFAULT 'What We Believe',
  	"what_we_believe_intro" varchar,
  	"how_we_work_heading" varchar DEFAULT 'How We Work',
  	"leadership_heading" varchar DEFAULT 'Leadership',
  	"leadership_note" varchar,
  	"leadership_team_link_label" varchar DEFAULT 'Meet the full team',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "team_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Our Team',
  	"hero_heading" varchar NOT NULL,
  	"hero_lede" varchar,
  	"section_heading" varchar DEFAULT 'The Team',
  	"closing_cta_heading" varchar NOT NULL,
  	"closing_cta_closing_line" varchar,
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Contact',
  	"hero_heading" varchar NOT NULL,
  	"direct_contact_label" varchar DEFAULT 'Prefer a direct conversation?',
  	"direct_contact_whatsapp_number" varchar,
  	"direct_contact_email" varchar,
  	"manifesto_heading" varchar NOT NULL,
  	"manifesto_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "why_real_numbers_page_hero_lede_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "why_real_numbers_page_why_choose_us_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "why_real_numbers_page_value_props" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"paragraph1" varchar NOT NULL,
  	"paragraph2" varchar
  );
  
  CREATE TABLE "why_real_numbers_page_what_makes_different_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "why_real_numbers_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Why Real Numbers',
  	"hero_heading" varchar NOT NULL,
  	"why_choose_us_heading" varchar DEFAULT 'Why companies choose us',
  	"what_makes_different_heading" varchar DEFAULT 'What makes the partnership different',
  	"closing_cta_heading" varchar NOT NULL,
  	"closing_cta_closing_line" varchar,
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "our_expertise_page_hero_lede_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "our_expertise_page_areas_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "our_expertise_page_areas_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "our_expertise_page_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar NOT NULL
  );
  
  CREATE TABLE "our_expertise_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Our Expertise',
  	"hero_heading" varchar NOT NULL,
  	"integrated_heading" varchar DEFAULT 'One integrated financial partnership',
  	"integrated_text" varchar,
  	"integrated_photo_id" integer,
  	"integrated_photo_caption" varchar DEFAULT 'The work behind the clarity',
  	"closing_cta_heading" varchar NOT NULL,
  	"closing_cta_closing_line" varchar,
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "use_cases_page_situations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "use_cases_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Use Cases',
  	"hero_heading" varchar NOT NULL,
  	"hero_lede" varchar,
  	"atmosphere_photo_id" integer,
  	"atmosphere_photo_caption" varchar DEFAULT 'Every stage looks different',
  	"situations_intro" varchar DEFAULT 'Some of the situations that typically bring companies to Real Numbers:',
  	"closing_cta_heading" varchar NOT NULL,
  	"closing_cta_button_label" varchar DEFAULT 'Let''s Talk',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "questions_founders_ask_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Questions Founders Ask',
  	"hero_heading" varchar NOT NULL,
  	"atmosphere_photo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "client_logos_id" integer;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_logos" ADD CONSTRAINT "client_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_header_logo_id_media_id_fk" FOREIGN KEY ("header_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stats_stats" ADD CONSTRAINT "stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_rotating_words" ADD CONSTRAINT "home_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_featured_photo_images" ADD CONSTRAINT "home_featured_photo_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_featured_photo_images" ADD CONSTRAINT "home_featured_photo_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_audience_areas" ADD CONSTRAINT "home_audience_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_our_story_paragraphs" ADD CONSTRAINT "about_page_our_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_what_we_believe_principles" ADD CONSTRAINT "about_page_what_we_believe_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_how_we_work_paragraphs" ADD CONSTRAINT "about_page_how_we_work_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_leadership_cards" ADD CONSTRAINT "about_page_leadership_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_our_story_photo_id_media_id_fk" FOREIGN KEY ("our_story_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_hero_lede_paragraphs" ADD CONSTRAINT "why_real_numbers_page_hero_lede_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_why_choose_us_paragraphs" ADD CONSTRAINT "why_real_numbers_page_why_choose_us_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_value_props" ADD CONSTRAINT "why_real_numbers_page_value_props_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "why_real_numbers_page_what_makes_different_paragraphs" ADD CONSTRAINT "why_real_numbers_page_what_makes_different_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."why_real_numbers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page_hero_lede_paragraphs" ADD CONSTRAINT "our_expertise_page_hero_lede_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_expertise_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page_areas_paragraphs" ADD CONSTRAINT "our_expertise_page_areas_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_expertise_page_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page_areas_services" ADD CONSTRAINT "our_expertise_page_areas_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_expertise_page_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page_areas" ADD CONSTRAINT "our_expertise_page_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."our_expertise_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "our_expertise_page" ADD CONSTRAINT "our_expertise_page_integrated_photo_id_media_id_fk" FOREIGN KEY ("integrated_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "use_cases_page_situations" ADD CONSTRAINT "use_cases_page_situations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."use_cases_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "use_cases_page" ADD CONSTRAINT "use_cases_page_atmosphere_photo_id_media_id_fk" FOREIGN KEY ("atmosphere_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "questions_founders_ask_page" ADD CONSTRAINT "questions_founders_ask_page_atmosphere_photo_id_media_id_fk" FOREIGN KEY ("atmosphere_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faq_items_updated_at_idx" ON "faq_items" USING btree ("updated_at");
  CREATE INDEX "faq_items_created_at_idx" ON "faq_items" USING btree ("created_at");
  CREATE INDEX "client_logos_logo_idx" ON "client_logos" USING btree ("logo_id");
  CREATE INDEX "client_logos_updated_at_idx" ON "client_logos" USING btree ("updated_at");
  CREATE INDEX "client_logos_created_at_idx" ON "client_logos" USING btree ("created_at");
  CREATE INDEX "branding_header_logo_idx" ON "branding" USING btree ("header_logo_id");
  CREATE INDEX "branding_footer_logo_idx" ON "branding" USING btree ("footer_logo_id");
  CREATE INDEX "stats_stats_order_idx" ON "stats_stats" USING btree ("_order");
  CREATE INDEX "stats_stats_parent_id_idx" ON "stats_stats" USING btree ("_parent_id");
  CREATE INDEX "home_hero_rotating_words_order_idx" ON "home_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "home_hero_rotating_words_parent_id_idx" ON "home_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "home_featured_photo_images_order_idx" ON "home_featured_photo_images" USING btree ("_order");
  CREATE INDEX "home_featured_photo_images_parent_id_idx" ON "home_featured_photo_images" USING btree ("_parent_id");
  CREATE INDEX "home_featured_photo_images_image_idx" ON "home_featured_photo_images" USING btree ("image_id");
  CREATE INDEX "home_audience_areas_order_idx" ON "home_audience_areas" USING btree ("_order");
  CREATE INDEX "home_audience_areas_parent_id_idx" ON "home_audience_areas" USING btree ("_parent_id");
  CREATE INDEX "about_page_our_story_paragraphs_order_idx" ON "about_page_our_story_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_our_story_paragraphs_parent_id_idx" ON "about_page_our_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_what_we_believe_principles_order_idx" ON "about_page_what_we_believe_principles" USING btree ("_order");
  CREATE INDEX "about_page_what_we_believe_principles_parent_id_idx" ON "about_page_what_we_believe_principles" USING btree ("_parent_id");
  CREATE INDEX "about_page_how_we_work_paragraphs_order_idx" ON "about_page_how_we_work_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_how_we_work_paragraphs_parent_id_idx" ON "about_page_how_we_work_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_leadership_cards_order_idx" ON "about_page_leadership_cards" USING btree ("_order");
  CREATE INDEX "about_page_leadership_cards_parent_id_idx" ON "about_page_leadership_cards" USING btree ("_parent_id");
  CREATE INDEX "about_page_our_story_our_story_photo_idx" ON "about_page" USING btree ("our_story_photo_id");
  CREATE INDEX "why_real_numbers_page_hero_lede_paragraphs_order_idx" ON "why_real_numbers_page_hero_lede_paragraphs" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_hero_lede_paragraphs_parent_id_idx" ON "why_real_numbers_page_hero_lede_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_why_choose_us_paragraphs_order_idx" ON "why_real_numbers_page_why_choose_us_paragraphs" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_why_choose_us_paragraphs_parent_id_idx" ON "why_real_numbers_page_why_choose_us_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_value_props_order_idx" ON "why_real_numbers_page_value_props" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_value_props_parent_id_idx" ON "why_real_numbers_page_value_props" USING btree ("_parent_id");
  CREATE INDEX "why_real_numbers_page_what_makes_different_paragraphs_order_idx" ON "why_real_numbers_page_what_makes_different_paragraphs" USING btree ("_order");
  CREATE INDEX "why_real_numbers_page_what_makes_different_paragraphs_parent_id_idx" ON "why_real_numbers_page_what_makes_different_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_hero_lede_paragraphs_order_idx" ON "our_expertise_page_hero_lede_paragraphs" USING btree ("_order");
  CREATE INDEX "our_expertise_page_hero_lede_paragraphs_parent_id_idx" ON "our_expertise_page_hero_lede_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_areas_paragraphs_order_idx" ON "our_expertise_page_areas_paragraphs" USING btree ("_order");
  CREATE INDEX "our_expertise_page_areas_paragraphs_parent_id_idx" ON "our_expertise_page_areas_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_areas_services_order_idx" ON "our_expertise_page_areas_services" USING btree ("_order");
  CREATE INDEX "our_expertise_page_areas_services_parent_id_idx" ON "our_expertise_page_areas_services" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_areas_order_idx" ON "our_expertise_page_areas" USING btree ("_order");
  CREATE INDEX "our_expertise_page_areas_parent_id_idx" ON "our_expertise_page_areas" USING btree ("_parent_id");
  CREATE INDEX "our_expertise_page_integrated_integrated_photo_idx" ON "our_expertise_page" USING btree ("integrated_photo_id");
  CREATE INDEX "use_cases_page_situations_order_idx" ON "use_cases_page_situations" USING btree ("_order");
  CREATE INDEX "use_cases_page_situations_parent_id_idx" ON "use_cases_page_situations" USING btree ("_parent_id");
  CREATE INDEX "use_cases_page_atmosphere_photo_idx" ON "use_cases_page" USING btree ("atmosphere_photo_id");
  CREATE INDEX "questions_founders_ask_page_atmosphere_photo_idx" ON "questions_founders_ask_page" USING btree ("atmosphere_photo_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_logos_fk" FOREIGN KEY ("client_logos_id") REFERENCES "public"."client_logos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faq_items_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_items_id");
  CREATE INDEX "payload_locked_documents_rels_client_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("client_logos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "client_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "branding" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stats_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_hero_rotating_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_featured_photo_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_audience_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_our_story_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_what_we_believe_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_how_we_work_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_leadership_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page_hero_lede_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page_why_choose_us_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page_value_props" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page_what_makes_different_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "why_real_numbers_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page_hero_lede_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page_areas_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page_areas_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "our_expertise_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases_page_situations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "use_cases_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "questions_founders_ask_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "client_logos" CASCADE;
  DROP TABLE "branding" CASCADE;
  DROP TABLE "stats_stats" CASCADE;
  DROP TABLE "stats" CASCADE;
  DROP TABLE "home_hero_rotating_words" CASCADE;
  DROP TABLE "home_featured_photo_images" CASCADE;
  DROP TABLE "home_audience_areas" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "about_page_our_story_paragraphs" CASCADE;
  DROP TABLE "about_page_what_we_believe_principles" CASCADE;
  DROP TABLE "about_page_how_we_work_paragraphs" CASCADE;
  DROP TABLE "about_page_leadership_cards" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "team_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "why_real_numbers_page_hero_lede_paragraphs" CASCADE;
  DROP TABLE "why_real_numbers_page_why_choose_us_paragraphs" CASCADE;
  DROP TABLE "why_real_numbers_page_value_props" CASCADE;
  DROP TABLE "why_real_numbers_page_what_makes_different_paragraphs" CASCADE;
  DROP TABLE "why_real_numbers_page" CASCADE;
  DROP TABLE "our_expertise_page_hero_lede_paragraphs" CASCADE;
  DROP TABLE "our_expertise_page_areas_paragraphs" CASCADE;
  DROP TABLE "our_expertise_page_areas_services" CASCADE;
  DROP TABLE "our_expertise_page_areas" CASCADE;
  DROP TABLE "our_expertise_page" CASCADE;
  DROP TABLE "use_cases_page_situations" CASCADE;
  DROP TABLE "use_cases_page" CASCADE;
  DROP TABLE "questions_founders_ask_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_client_logos_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_faq_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_client_logos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "client_logos_id";
  DROP TYPE "public"."enum_stats_stats_color";`)
}
